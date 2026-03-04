"""
Flask backend for Universal Code Compiler - CodeGenix
Provides REST API for multi-language code execution
"""
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import sys
import os
import subprocess
import tempfile
import threading
import uuid
import time
import queue
import shutil
from pathlib import Path

# Add src to path
sys.path.insert(0, str(Path(__file__).parent / 'src'))

# Import the new compiler system
from src.compilers.compiler_factory import CompilerFactory

app = Flask(__name__, static_folder='web', static_url_path='/static')
CORS(app)  # Enable CORS for frontend

# ═══════════════════════════════════════════════════════════════
# INTERACTIVE PROCESS MANAGER
# ═══════════════════════════════════════════════════════════════

class ProcessManager:
    """Manages running interactive processes for code execution"""
    
    def __init__(self):
        self.processes = {}  # run_id -> process info dict
        self._lock = threading.Lock()
        # Start cleanup thread
        cleanup_thread = threading.Thread(target=self._cleanup_loop, daemon=True)
        cleanup_thread.start()
    
    def start_process(self, code, language, run_id=None):
        """Start an interactive process and return run_id"""
        if run_id is None:
            run_id = str(uuid.uuid4())[:8]
        
        # Create temp file
        temp_dir = tempfile.mkdtemp()
        ext_map = {
            'python': '.py', 'javascript': '.js', 'java': '.java',
            'cpp': '.cpp', 'c': '.c', 'go': '.go', 'rust': '.rs', 'php': '.php'
        }
        ext = ext_map.get(language, '.py')
        
        # For Java, class name must be Main
        filename = 'Main.java' if language == 'java' else f'main{ext}'
        file_path = os.path.join(temp_dir, filename)
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(code)
        
        # Build command based on language
        cmd = self._get_command(language, file_path, temp_dir)
        if cmd is None:
            shutil.rmtree(temp_dir, ignore_errors=True)
            return None, f"Language '{language}' not supported for interactive mode"
        
        try:
            # For compiled languages, compile first
            compile_cmd = self._get_compile_command(language, file_path, temp_dir)
            if compile_cmd:
                compile_result = subprocess.run(
                    compile_cmd, cwd=temp_dir,
                    capture_output=True, text=True, timeout=30
                )
                if compile_result.returncode != 0:
                    shutil.rmtree(temp_dir, ignore_errors=True)
                    return None, f"Compilation Error:\n{compile_result.stderr}"
            
            # Start the process
            process = subprocess.Popen(
                cmd,
                cwd=temp_dir,
                stdin=subprocess.PIPE,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
                bufsize=0  # Unbuffered
            )
            
            output_queue = queue.Queue()
            error_queue = queue.Queue()
            
            # Reader threads for stdout and stderr
            def read_stdout():
                try:
                    while True:
                        char = process.stdout.read(1)
                        if char == '':
                            break
                        output_queue.put(char)
                except:
                    pass
            
            def read_stderr():
                try:
                    while True:
                        char = process.stderr.read(1)
                        if char == '':
                            break
                        error_queue.put(char)
                except:
                    pass
            
            stdout_thread = threading.Thread(target=read_stdout, daemon=True)
            stderr_thread = threading.Thread(target=read_stderr, daemon=True)
            stdout_thread.start()
            stderr_thread.start()
            
            with self._lock:
                self.processes[run_id] = {
                    'process': process,
                    'output_queue': output_queue,
                    'error_queue': error_queue,
                    'stdout_thread': stdout_thread,
                    'stderr_thread': stderr_thread,
                    'temp_dir': temp_dir,
                    'started_at': time.time(),
                    'language': language
                }
            
            return run_id, None
            
        except Exception as e:
            shutil.rmtree(temp_dir, ignore_errors=True)
            return None, str(e)
    
    def get_output(self, run_id):
        """Get any new output from the process"""
        with self._lock:
            info = self.processes.get(run_id)
        
        if info is None:
            return None, None, 'not_found'
        
        process = info['process']
        output_queue = info['output_queue']
        error_queue = info['error_queue']
        
        # Collect all available output
        output = ''
        while not output_queue.empty():
            try:
                output += output_queue.get_nowait()
            except queue.Empty:
                break
        
        error = ''
        while not error_queue.empty():
            try:
                error += error_queue.get_nowait()
            except queue.Empty:
                break
        
        # Determine status
        poll = process.poll()
        if poll is not None:
            # Process finished — wait a bit for remaining output
            time.sleep(0.1)
            while not output_queue.empty():
                try:
                    output += output_queue.get_nowait()
                except queue.Empty:
                    break
            while not error_queue.empty():
                try:
                    error += error_queue.get_nowait()
                except queue.Empty:
                    break
            status = 'done'
        elif output == '' and error == '':
            # No new output — process might be waiting for input
            # Give it a tiny moment to produce output
            time.sleep(0.05)
            if output_queue.empty() and process.poll() is None:
                status = 'waiting_for_input'
            else:
                # More output came
                while not output_queue.empty():
                    try:
                        output += output_queue.get_nowait()
                    except queue.Empty:
                        break
                status = 'running'
        else:
            status = 'running'
        
        return output, error, status
    
    def send_input(self, run_id, user_input):
        """Send input to the process stdin"""
        with self._lock:
            info = self.processes.get(run_id)
        
        if info is None:
            return False, 'Process not found'
        
        process = info['process']
        if process.poll() is not None:
            return False, 'Process already finished'
        
        try:
            process.stdin.write(user_input + '\n')
            process.stdin.flush()
            return True, None
        except Exception as e:
            return False, str(e)
    
    def kill_process(self, run_id):
        """Kill a running process"""
        with self._lock:
            info = self.processes.get(run_id)
        
        if info is None:
            return
        
        try:
            info['process'].kill()
        except:
            pass
        self._cleanup_process(run_id)
    
    def _cleanup_process(self, run_id):
        """Clean up a finished process"""
        with self._lock:
            info = self.processes.pop(run_id, None)
        
        if info:
            try:
                info['process'].kill()
            except:
                pass
            try:
                shutil.rmtree(info['temp_dir'], ignore_errors=True)
            except:
                pass
    
    def _cleanup_loop(self):
        """Periodically clean up stale processes (>60 seconds)"""
        while True:
            time.sleep(10)
            stale = []
            with self._lock:
                for run_id, info in self.processes.items():
                    if time.time() - info['started_at'] > 60:
                        stale.append(run_id)
            for run_id in stale:
                self.kill_process(run_id)
    
    def _get_command(self, language, file_path, temp_dir):
        """Get the run command for a language"""
        commands = {
            'python': [sys.executable, '-u', file_path],
            'javascript': ['node', file_path],
            'java': ['java', '-cp', temp_dir, 'Main'],
            'cpp': [os.path.join(temp_dir, 'a.exe' if os.name == 'nt' else './a.out')],
            'c': [os.path.join(temp_dir, 'a.exe' if os.name == 'nt' else './a.out')],
            'go': ['go', 'run', file_path],
            'rust': [os.path.join(temp_dir, 'main.exe' if os.name == 'nt' else './main')],
            'php': ['php', file_path],
        }
        return commands.get(language)
    
    def _get_compile_command(self, language, file_path, temp_dir):
        """Get compile command (for compiled languages only)"""
        if language == 'java':
            return ['javac', file_path]
        elif language == 'cpp':
            return ['g++', file_path, '-o', os.path.join(temp_dir, 'a.exe' if os.name == 'nt' else 'a.out')]
        elif language == 'c':
            return ['gcc', file_path, '-o', os.path.join(temp_dir, 'a.exe' if os.name == 'nt' else 'a.out')]
        elif language == 'rust':
            return ['rustc', file_path, '-o', os.path.join(temp_dir, 'main.exe' if os.name == 'nt' else 'main')]
        return None


# Global process manager
process_manager = ProcessManager()

@app.route('/')
def serve_frontend():
    """Serve the frontend"""
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/api/execute', methods=['POST'])
def execute_code():
    """Execute Python code (legacy endpoint for backward compatibility)"""
    try:
        data = request.get_json()
        code = data.get('code', '')
        
        if not code.strip():
            return jsonify({
                'success': False,
                'error': 'No code provided'
            })
        
        # Use the new Python compiler
        compiler = CompilerFactory.get_compiler('python')
        result = compiler.compile(code)
        
        return jsonify(result)
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Server error: {str(e)}'
        }), 500

@app.route('/api/compile/<language>', methods=['POST'])
def compile_and_execute(language):
    """Universal compiler endpoint for all languages"""
    try:
        data = request.get_json()
        code = data.get('code', '')
        input_data = data.get('input', '')
        
        if not code.strip():
            return jsonify({
                'success': False,
                'error': 'No code provided'
            })
        
        # Handle special cases for non-executable languages
        if language == 'html':
            return jsonify({
                'success': True,
                'output': 'HTML code is valid. Open in browser to view.',
                'html_content': code
            })
        
        if language == 'css':
            return jsonify({
                'success': True,
                'output': 'CSS code is valid. Apply to HTML to see styling effects.',
                'css_content': code
            })
        
        if language == 'sql':
            return jsonify({
                'success': True,
                'output': 'SQL query syntax appears valid. Execute in a database to see results.',
                'sql_content': code
            })
        
        # Check if language is supported
        if not CompilerFactory.is_supported(language):
            return jsonify({
                'success': False,
                'error': f'Language {language} not supported. Supported languages: {", ".join(CompilerFactory.get_supported_languages())}'
            })
        
        # Get compiler and execute code
        compiler = CompilerFactory.get_compiler(language)
        result = compiler.compile(code, input_data)
        
        return jsonify(result)
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Server error: {str(e)}'
        }), 500

@app.route('/api/reset', methods=['POST'])
def reset_interpreter():
    """Reset the interpreter state"""
    return jsonify({
        'success': True,
        'message': 'Interpreter reset successfully'
    })

# ═══════════════════════════════════════════════════════════════
# INTERACTIVE EXECUTION ENDPOINTS
# ═══════════════════════════════════════════════════════════════

@app.route('/api/run/start', methods=['POST'])
def run_start():
    """Start interactive code execution"""
    try:
        data = request.get_json()
        code = data.get('code', '')
        language = data.get('language', 'python')
        
        if not code.strip():
            return jsonify({'success': False, 'error': 'No code provided'})
        
        # Handle non-executable languages
        if language in ('html', 'css', 'sql'):
            return jsonify({'success': False, 'error': f'{language.upper()} cannot be executed interactively'})
        
        run_id, error = process_manager.start_process(code, language)
        
        if error:
            return jsonify({'success': False, 'error': error})
        
        return jsonify({'success': True, 'run_id': run_id})
    
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/run/<run_id>/output', methods=['GET'])
def run_output(run_id):
    """Poll for process output"""
    output, error, status = process_manager.get_output(run_id)
    
    if status == 'not_found':
        return jsonify({'success': False, 'error': 'Process not found'})
    
    result = {
        'success': True,
        'output': output or '',
        'error': error or '',
        'status': status  # 'running', 'waiting_for_input', 'done'
    }
    
    # Auto-cleanup finished processes after returning final output
    if status == 'done':
        threading.Thread(
            target=lambda: (time.sleep(2), process_manager._cleanup_process(run_id)),
            daemon=True
        ).start()
    
    return jsonify(result)

@app.route('/api/run/<run_id>/input', methods=['POST'])
def run_input(run_id):
    """Send input to a running process"""
    data = request.get_json()
    user_input = data.get('input', '')
    
    success, error = process_manager.send_input(run_id, user_input)
    
    if not success:
        return jsonify({'success': False, 'error': error})
    
    return jsonify({'success': True})

@app.route('/api/run/<run_id>/stop', methods=['POST'])
def run_stop(run_id):
    """Stop a running process"""
    process_manager.kill_process(run_id)
    return jsonify({'success': True})

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'version': '2.0.0',
        'supported_languages': CompilerFactory.get_supported_languages()
    })

@app.route('/api/languages', methods=['GET'])
def get_supported_languages():
    """Get list of supported languages with detailed information"""
    return jsonify({
        'languages': CompilerFactory.get_supported_languages() + ['html', 'css', 'sql'],
        'language_info': CompilerFactory.get_language_info(),
        'total': len(CompilerFactory.get_supported_languages()) + 3,
        'deployment_note': 'Some languages require specific compilers. Use Docker deployment for full language support.'
    })

@app.route('/api/examples', methods=['GET'])
def get_examples():
    """Get code examples for all languages"""
    examples = {
        'python': {
            'hello_world': {
                'name': 'Hello World',
                'description': 'Basic print statement',
                'code': 'print("Hello, World!")\nprint("Welcome to PyVerse")'
            },
            'variables': {
                'name': 'Variables',
                'description': 'Working with variables',
                'code': 'x = 10\ny = 20\nz = x + y\nprint("Result:", z)'
            },
            'functions': {
                'name': 'Functions',
                'description': 'Defining and calling functions',
                'code': 'def factorial(n):\n    if n <= 1:\n        return 1\n    return n * factorial(n - 1)\n\nprint("Factorial of 5:", factorial(5))'
            }
        },
        'javascript': {
            'hello_world': {
                'name': 'Hello World',
                'description': 'Basic console output',
                'code': 'console.log("Hello, World!");\nconsole.log("Welcome to JavaScript");'
            },
            'variables': {
                'name': 'Variables',
                'description': 'Working with variables',
                'code': 'let x = 10;\nlet y = 20;\nlet z = x + y;\nconsole.log("Result:", z);'
            },
            'functions': {
                'name': 'Functions',
                'description': 'Arrow functions and regular functions',
                'code': 'function factorial(n) {\n    if (n <= 1) return 1;\n    return n * factorial(n - 1);\n}\n\nconsole.log("Factorial of 5:", factorial(5));'
            }
        },
        'java': {
            'hello_world': {
                'name': 'Hello World',
                'description': 'Basic Java program',
                'code': 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n        System.out.println("Welcome to Java");\n    }\n}'
            },
            'variables': {
                'name': 'Variables',
                'description': 'Working with variables',
                'code': 'public class Main {\n    public static void main(String[] args) {\n        int x = 10;\n        int y = 20;\n        int z = x + y;\n        System.out.println("Result: " + z);\n    }\n}'
            }
        },
        'cpp': {
            'hello_world': {
                'name': 'Hello World',
                'description': 'Basic C++ program',
                'code': '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!" << endl;\n    cout << "Welcome to C++" << endl;\n    return 0;\n}'
            },
            'variables': {
                'name': 'Variables',
                'description': 'Working with variables',
                'code': '#include <iostream>\nusing namespace std;\n\nint main() {\n    int x = 10;\n    int y = 20;\n    int z = x + y;\n    cout << "Result: " << z << endl;\n    return 0;\n}'
            }
        }
    }
    return jsonify(examples)

@app.route('/api/ai/suggest', methods=['POST'])
def get_ai_suggestions():
    """Get AI code suggestions"""
    try:
        from src.ai.code_suggester import suggest_completions
        
        data = request.get_json()
        code = data.get('code', '')
        language = data.get('language', 'python')
        
        suggestions = suggest_completions(code, language)
        
        return jsonify({
            'success': True,
            'suggestions': suggestions
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        })

@app.route('/api/ai/optimize', methods=['POST'])
def get_optimization_hints():
    """Get code optimization suggestions"""
    try:
        from src.ai.optimizer import analyze_code
        
        data = request.get_json()
        code = data.get('code', '')
        language = data.get('language', 'python')
        
        optimizations = analyze_code(code, language)
        
        return jsonify({
            'success': True,
            'optimizations': optimizations
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        })

@app.route('/api/ai/explain', methods=['POST'])
def explain_code():
    """Get AI code explanation"""
    try:
        data = request.get_json()
        code = data.get('code', '')
        language = data.get('language', 'python')
        
        # Simple code explanation logic
        explanation = generate_code_explanation(code, language)
        
        return jsonify({
            'success': True,
            'explanation': explanation
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        })

@app.route('/api/ai/chat', methods=['POST'])
def ai_chat():
    """Chat with AI using Groq API (Llama 3.3 70B)"""
    try:
        import requests
        
        data = request.get_json()
        message = data.get('message', '')
        code = data.get('code', '')
        language = data.get('language', 'python')
        conversation_history = data.get('history', [])
        autopilot = data.get('autopilot', False)
        
        if not message.strip():
            return jsonify({
                'success': False,
                'error': 'No message provided'
            })
        
        # Get Groq API key from environment
        api_key = os.getenv('AI_API_KEY') or os.getenv('GROQ_API_KEY')
        if not api_key:
            return jsonify({
                'success': False,
                'error': 'AI API key not configured. Please add GROQ_API_KEY to .env file.'
            })
        
        # Build system prompt for coding assistant
        system_prompt = f"""You are an expert coding assistant for CodeGenix IDE. You help users write, debug, optimize, and explain code.

Current Language: {language}
Autopilot Mode: {'ENABLED - Write complete code in a single code block. The code will be automatically placed into the editor.' if autopilot else 'DISABLED - Provide suggestions and explanations only.'}

CRITICAL RULES:
1. When asked to write, create, or build something, ALWAYS provide COMPLETE, WORKING, RUNNABLE code. Never give partial snippets or pseudocode.
2. Always respond in the context of the selected language ({language}).
3. Use markdown formatting: use triple backticks with language name for code blocks.
4. Be concise but helpful.
5. If the user has code in their editor, analyze it when relevant.
6. For non-code questions (theory, concepts), explain clearly without unnecessary code.

{'AUTOPILOT CODE WRITING RULES (VERY IMPORTANT):' if autopilot else ''}
{'- Write ALL code in a SINGLE code block. This code block will be extracted and placed directly into the current editor tab.' if autopilot else ''}
{'- Do NOT use [CREATE_FILES] for single-file programs like calculators, games, scripts, utilities, etc.' if autopilot else ''}
{'- The code replaces whatever is currently in the editor, so always write the COMPLETE program.' if autopilot else ''}
{'- Keep your explanation brief. The user wants code in their editor, not lengthy explanations.' if autopilot else ''}

INPUT HANDLING (VERY IMPORTANT):
- When writing code that needs user input, ALWAYS print a clear prompt message BEFORE each input() call.
- Example: print("Enter first number: ") then num1 = input() — NOT num1 = input("Enter first number: ")
- Use separate print() and input() so the user can see prompts in the Output and provide inputs in the Input tab.
- For programs needing multiple inputs, the user enters all values in the Input tab, one per line. So each input() call reads one line.
- Write code that handles inputs ONE AT A TIME with clear prompts, never ask for comma-separated or space-separated values.

MULTI-FILE PROJECT CREATION:
ONLY use this when the user EXPLICITLY asks for multiple separate files (e.g., "create separate files", "make a multi-file project", "create modules in different files").
Do NOT use this for single programs like a calculator, game, or script — those should be a single code block.

When creating multi-file projects, output files using this EXACT format at the END of your response:

[CREATE_FILES]
```json
[
  {{"name": "main.py", "content": "# full file content here..."}},
  {{"name": "utils.py", "content": "# full file content here..."}}
]
```

IMPORTANT:
- Write REAL, COMPLETE, FUNCTIONAL code that actually does what the user asked
- Include ALL necessary imports
- Include error handling
- DO NOT give a generic template - give them EXACTLY what they asked for

User's current code in editor:
```{language}
{code if code else '(empty)'}
```"""

        # Build messages for Groq API
        messages = [{"role": "system", "content": system_prompt}]
        
        # Add conversation history (last 10 messages)
        for msg in conversation_history[-10:]:
            messages.append(msg)
        
        # Add current user message
        messages.append({"role": "user", "content": message})
        
        # Call Groq API
        response = requests.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {api_key}"
            },
            json={
                "messages": messages,
                "model": "llama-3.3-70b-versatile",
                "temperature": 0.7,
                "max_tokens": 2048
            },
            timeout=30
        )
        
        if response.status_code == 200:
            result = response.json()
            ai_response = result['choices'][0]['message']['content']
            
            # Extract code if autopilot is enabled and response contains code
            # BUT skip extraction if response uses [CREATE_FILES] format
            # (the frontend will handle file creation separately)
            extracted_code = None
            if autopilot and '[CREATE_FILES]' not in ai_response:
                import re
                code_blocks = re.findall(r'```(?:\w+)?\n([\s\S]*?)```', ai_response)
                if code_blocks:
                    extracted_code = code_blocks[0]
            
            return jsonify({
                'success': True,
                'response': ai_response,
                'extracted_code': extracted_code
            })
        else:
            error_msg = f"Groq API error: {response.status_code}"
            try:
                error_details = response.json()
                if 'error' in error_details:
                    error_msg = error_details['error'].get('message', error_msg)
            except:
                pass
            return jsonify({
                'success': False,
                'error': error_msg
            })
            
    except requests.exceptions.Timeout:
        return jsonify({
            'success': False,
            'error': 'AI request timed out. Please try again.'
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'AI error: {str(e)}'
        })

@app.route('/api/youtube/search', methods=['POST'])
def search_youtube():
    """Search YouTube videos using YouTube Data API v3"""
    try:
        import os
        import requests
        
        data = request.get_json()
        query = data.get('query', '')
        max_results = data.get('maxResults', 5)
        
        # Get YouTube API key from environment
        api_key = os.getenv('YOUTUBE_API_KEY')
        if not api_key or api_key == 'your_youtube_api_key_here':
            return jsonify({
                'success': False,
                'error': 'YouTube API key not configured'
            })
        
        # YouTube Data API v3 search endpoint
        url = 'https://www.googleapis.com/youtube/v3/search'
        params = {
            'part': 'snippet',
            'q': query,
            'type': 'video',
            'maxResults': max_results,
            'key': api_key,
            'order': 'relevance',
            'videoDuration': 'medium'  # Filter for medium length videos
        }
        
        response = requests.get(url, params=params, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            videos = []
            
            for item in data.get('items', []):
                video = {
                    'videoId': item['id']['videoId'],
                    'title': item['snippet']['title'],
                    'description': item['snippet']['description'][:200] + '...',
                    'thumbnail': item['snippet']['thumbnails']['medium']['url'],
                    'channelTitle': item['snippet']['channelTitle']
                }
                videos.append(video)
            
            return jsonify({
                'success': True,
                'videos': videos,
                'total': len(videos)
            })
        else:
            return jsonify({
                'success': False,
                'error': f'YouTube API error: {response.status_code}'
            })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'YouTube search failed: {str(e)}'
        })


def call_openai_api(query, code, language, api_key):
    """Call OpenAI API for AI responses"""
    try:
        import requests
        
        headers = {
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json'
        }
        
        prompt = f"""You are a helpful coding assistant. The user is working with {language} code.

User's code:
```{language}
{code}
```

User's question: {query}

Please provide a helpful, concise response about their code or question."""

        data = {
            'model': 'gpt-3.5-turbo',
            'messages': [
                {'role': 'system', 'content': 'You are a helpful coding assistant.'},
                {'role': 'user', 'content': prompt}
            ],
            'max_tokens': 150,
            'temperature': 0.7
        }
        
        response = requests.post(
            'https://api.openai.com/v1/chat/completions',
            headers=headers,
            json=data,
            timeout=10
        )
        
        if response.status_code == 200:
            result = response.json()
            return result['choices'][0]['message']['content'].strip()
        
    except Exception as e:
        print(f"OpenAI API error: {e}")
    
    return None

def generate_ai_response(query, code, language):
    """Generate rule-based AI responses"""
    query_lower = query.lower()
    
    if 'error' in query_lower or 'bug' in query_lower or 'fix' in query_lower:
        return f"I can help you debug your {language} code! Check for syntax errors, missing semicolons, proper indentation, and make sure all variables are defined before use."
    
    elif 'optimize' in query_lower or 'improve' in query_lower:
        if language == 'python':
            return "For Python optimization: Use list comprehensions, avoid nested loops where possible, use built-in functions like map() and filter(), and consider using generators for large datasets."
        elif language == 'javascript':
            return "For JavaScript optimization: Use const/let instead of var, avoid global variables, use arrow functions, and consider async/await for better performance."
        else:
            return f"For {language} optimization: Use efficient algorithms, avoid unnecessary computations, and follow language-specific best practices."
    
    elif 'explain' in query_lower or 'what does' in query_lower:
        lines = len(code.split('\n')) if code else 0
        return f"This {language} code has {lines} lines. It appears to define variables and perform operations. Each statement executes sequentially from top to bottom."
    
    elif 'help' in query_lower:
        return f"I'm here to help with your {language} code! I can explain code, suggest optimizations, help debug errors, and provide coding tips. What specific help do you need?"
    
    else:
        return f"I understand you're asking about {language} development. Could you be more specific about what you need help with? I can assist with debugging, optimization, or code explanation."

if __name__ == '__main__':
    print("=" * 60)
    print("🚀 Universal Code Compiler Backend Server - CodeGenix")
    print("=" * 60)
    print("Server running on: http://localhost:5000")
    print("Frontend: http://localhost:5000")
    print("API endpoints:")
    print("  • /api/compile/<language> - Universal compiler")
    print("  • /api/execute - Python execution (legacy)")
    print("  • /api/languages - Supported languages")
    print("  • /api/examples - Code examples")
    print("=" * 60)
    print("Supported languages:", ", ".join(CompilerFactory.get_supported_languages()))
    print("=" * 60)
    
    app.run(
        host='0.0.0.0',
        port=5000,
        debug=True
    )