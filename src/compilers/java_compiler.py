"""
Java Compiler
"""
from .base_compiler import BaseCompiler
import re
import os

class JavaCompiler(BaseCompiler):
    def __init__(self):
        super().__init__("Java", ".java")
    
    def extract_class_name(self, code):
        """Extract the public class name from Java code"""
        match = re.search(r'public\s+class\s+(\w+)', code)
        return match.group(1) if match else None
    
    def compile(self, code, input_data=""):
        """Compile and execute Java code"""
        # Check if Java is available first
        java_check = self.run_command(['javac', '-version'])
        if not java_check['success']:
            return {
                'success': False,
                'output': '',
                'error': '''Java compiler (javac) is not installed or not found in PATH.

🔧 Installation Options:
1. Docker Deployment (Recommended): All compilers included automatically
2. Local Installation:
   - Windows: Download JDK from https://adoptium.net/ or run: choco install openjdk
   - Linux: sudo apt install default-jdk
   - macOS: brew install openjdk

📖 See DEPLOYMENT.md for complete setup instructions.'''
            }
        
        class_name = self.extract_class_name(code)
        if not class_name:
            return {
                'success': False,
                'output': '',
                'error': 'Could not find public class in Java code. Make sure your code has a public class.'
            }
        
        filename = f"{class_name}.java"
        file_path, temp_dir = self.create_temp_file(code, filename)
        
        try:
            # Compile Java code
            compile_result = self.run_command(['javac', filename], cwd=temp_dir)
            
            if not compile_result['success']:
                error_msg = compile_result['error']
                if 'cannot find symbol' in error_msg:
                    error_msg += '\n\nTip: Make sure all variables are declared and method names are spelled correctly.'
                
                return {
                    'success': False,
                    'output': '',
                    'error': f'Compilation failed: {error_msg}'
                }
            
            # Run compiled Java code
            result = self.run_command(['java', class_name], cwd=temp_dir, input_data=input_data)
            
            return {
                'success': result['success'],
                'output': result['output'],
                'error': result['error'] if not result['success'] else None
            }
        
        finally:
            self.cleanup_temp_files(temp_dir)