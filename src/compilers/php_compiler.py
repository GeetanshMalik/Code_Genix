"""
PHP Compiler/Interpreter
"""
from .base_compiler import BaseCompiler

class PhpCompiler(BaseCompiler):
    def __init__(self):
        super().__init__("PHP", ".php")
    
    def compile(self, code, input_data=""):
        """Execute PHP code"""
        # Check if PHP is available first
        php_check = self.run_command(['php', '--version'])
        if not php_check['success']:
            return {
                'success': False,
                'output': '',
                'error': '''PHP interpreter is not installed or not found in PATH.

🔧 Installation Options:
1. Docker Deployment (Recommended): All compilers included automatically
2. Local Installation:
   - Windows: Download from https://www.php.net/downloads or run: choco install php
   - Linux: sudo apt install php
   - macOS: brew install php

📖 See DEPLOYMENT.md for complete setup instructions.'''
            }
        
        file_path, temp_dir = self.create_temp_file(code)
        
        try:
            # Run PHP code
            result = self.run_command(['php', file_path], cwd=temp_dir, input_data=input_data)
            
            return {
                'success': result['success'],
                'output': result['output'],
                'error': result['error'] if not result['success'] else None
            }
        
        finally:
            self.cleanup_temp_files(temp_dir)