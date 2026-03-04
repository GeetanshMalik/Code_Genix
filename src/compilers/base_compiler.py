"""
Base compiler class for all language compilers
"""
import subprocess
import tempfile
import os
from abc import ABC, abstractmethod

class BaseCompiler(ABC):
    def __init__(self, language_name, file_extension):
        self.language_name = language_name
        self.file_extension = file_extension
    
    @abstractmethod
    def compile(self, code, input_data=""):
        """Compile and execute code"""
        pass
    
    def create_temp_file(self, code, filename=None):
        """Create a temporary file with the code"""
        if filename is None:
            filename = f"main{self.file_extension}"
        
        temp_dir = tempfile.mkdtemp()
        file_path = os.path.join(temp_dir, filename)
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(code)
        
        return file_path, temp_dir
    
    def run_command(self, command, cwd=None, input_data="", timeout=30):
        """Run a shell command and return result"""
        try:
            result = subprocess.run(
                command,
                cwd=cwd,
                input=input_data,
                capture_output=True,
                text=True,
                timeout=timeout
            )
            
            return {
                'success': result.returncode == 0,
                'output': result.stdout,
                'error': result.stderr,
                'returncode': result.returncode
            }
        
        except subprocess.TimeoutExpired:
            return {
                'success': False,
                'output': '',
                'error': f'Execution timed out after {timeout} seconds',
                'returncode': -1
            }
        except Exception as e:
            return {
                'success': False,
                'output': '',
                'error': str(e),
                'returncode': -1
            }
    
    def cleanup_temp_files(self, temp_dir):
        """Clean up temporary files"""
        try:
            import shutil
            shutil.rmtree(temp_dir)
        except:
            pass