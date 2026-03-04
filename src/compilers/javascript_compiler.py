"""
JavaScript Compiler using Node.js
"""
from .base_compiler import BaseCompiler

class JavaScriptCompiler(BaseCompiler):
    def __init__(self):
        super().__init__("JavaScript", ".js")
    
    def compile(self, code, input_data=""):
        """Execute JavaScript code using Node.js"""
        # Check if Node.js is available
        node_check = self.run_command(['node', '--version'])
        if not node_check['success']:
            return {
                'success': False,
                'output': '',
                'error': '''Node.js is not installed or not found in PATH.
                
🔧 Installation Options:
1. Docker Deployment (Recommended): All compilers included automatically
2. Local Installation:
   - Windows: Download from https://nodejs.org/ or run: choco install nodejs
   - Linux: sudo apt install nodejs npm
   - macOS: brew install node

📖 See DEPLOYMENT.md for complete setup instructions.'''
            }
        
        file_path, temp_dir = self.create_temp_file(code)
        
        try:
            # Run the JavaScript file
            result = self.run_command(['node', file_path], input_data=input_data)
            
            return {
                'success': result['success'],
                'output': result['output'],
                'error': result['error'] if not result['success'] else None
            }
        
        finally:
            self.cleanup_temp_files(temp_dir)