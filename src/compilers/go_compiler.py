"""
Go Compiler
"""
from .base_compiler import BaseCompiler

class GoCompiler(BaseCompiler):
    def __init__(self):
        super().__init__("Go", ".go")
    
    def compile(self, code, input_data=""):
        """Execute Go code"""
        # Check if Go is available first
        go_check = self.run_command(['go', 'version'])
        if not go_check['success']:
            return {
                'success': False,
                'output': '',
                'error': '''Go compiler is not installed or not found in PATH.

🔧 Installation Options:
1. Docker Deployment (Recommended): All compilers included automatically
2. Local Installation:
   - Windows: Download from https://golang.org/dl/ or run: choco install golang
   - Linux: sudo apt install golang-go
   - macOS: brew install go

📖 See DEPLOYMENT.md for complete setup instructions.'''
            }
        
        file_path, temp_dir = self.create_temp_file(code)
        
        try:
            # Run Go code
            result = self.run_command(['go', 'run', file_path], cwd=temp_dir, input_data=input_data)
            
            return {
                'success': result['success'],
                'output': result['output'],
                'error': result['error'] if not result['success'] else None
            }
        
        finally:
            self.cleanup_temp_files(temp_dir)