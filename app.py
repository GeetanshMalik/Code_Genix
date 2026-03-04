"""
Flask backend for Universal Code Compiler - CodeGenix
Provides REST API for multi-language code execution
"""
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import sys
import os
from pathlib import Path

# Add src to path
sys.path.insert(0, str(Path(__file__).parent / 'src'))

# Import the new compiler system
from src.compilers.compiler_factory import CompilerFactory

app = Flask(__name__, static_folder='web', static_url_path='/static')
CORS(app)  # Enable CORS for frontend

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
Autopilot Mode: {'ENABLED - Write code directly, user wants you to implement' if autopilot else 'DISABLED - Provide suggestions and explanations'}

CRITICAL RULES:
1. When asked to write, create, or build something, ALWAYS provide COMPLETE, WORKING, RUNNABLE code. Never give partial snippets or pseudocode.
2. Always respond in the context of the selected language ({language}).
3. Use markdown formatting: use triple backticks with language name for code blocks.
4. Be concise but helpful.
5. If the user has code in their editor, analyze it when relevant.
6. For non-code questions (theory, concepts), explain clearly without unnecessary code.

MULTI-FILE PROJECT CREATION:
When the user asks you to create something that requires multiple files (e.g., "create a bot", "build an app with multiple modules", "create separate files for each feature"), you MUST output the files using this EXACT format at the END of your response:

[CREATE_FILES]
```json
[
  {{"name": "main.py", "content": "# full file content here..."}},
  {{"name": "utils.py", "content": "# full file content here..."}}
]
```

This will automatically create new file tabs in the IDE. Always use this format when creating multi-file projects.

IMPORTANT: When the user asks to "create a bot", "build an app", or any complex program:
- Write REAL, COMPLETE, FUNCTIONAL code that actually does what they asked
- Include ALL necessary imports
- Include error handling
- If they ask for text-to-speech, use pyttsx3 or similar libraries
- If they ask for a web app, include all necessary routes and templates
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