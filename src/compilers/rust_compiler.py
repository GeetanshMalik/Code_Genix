"""
Rust Compiler
"""
from .base_compiler import BaseCompiler
import os

class RustCompiler(BaseCompiler):
    def __init__(self):
        super().__init__("Rust", ".rs")
    
    def compile(self, code, input_data=""):
        """Compile and execute Rust code"""
        # Check if Rust is available first
        rust_check = self.run_command(['rustc', '--version'])
        if not rust_check['success']:
            return {
                'success': False,
                'output': '',
                'error': '''Rust compiler is not installed or not found in PATH.

🔧 Installation Options:
1. Docker Deployment (Recommended): All compilers included automatically
2. Local Installation:
   - All platforms: curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   - Windows: Download from https://rustup.rs/ or run: choco install rust
   - Linux: curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   - macOS: brew install rust

📖 See DEPLOYMENT.md for complete setup instructions.'''
            }
        
        file_path, temp_dir = self.create_temp_file(code)
        executable_path = os.path.join(temp_dir, 'main.exe' if os.name == 'nt' else 'main')
        
        try:
            # Compile Rust code
            compile_result = self.run_command([
                'rustc', '-o', executable_path, file_path
            ], cwd=temp_dir)
            
            if not compile_result['success']:
                error_msg = compile_result['error']
                if 'error:' in error_msg:
                    error_msg += '\n\nTip: Check Rust syntax, missing semicolons, or use statements.'
                
                return {
                    'success': False,
                    'output': '',
                    'error': f'Compilation failed: {error_msg}'
                }
            
            # Run compiled executable
            result = self.run_command([executable_path], cwd=temp_dir, input_data=input_data)
            
            return {
                'success': result['success'],
                'output': result['output'],
                'error': result['error'] if not result['success'] else None
            }
        
        finally:
            self.cleanup_temp_files(temp_dir)