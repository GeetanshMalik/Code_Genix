"""
Python Compiler
"""
from .base_compiler import BaseCompiler
import sys
import io

class PythonCompiler(BaseCompiler):
    def __init__(self):
        super().__init__("Python", ".py")
    
    def compile(self, code, input_data=""):
        """Execute Python code"""
        try:
            # Capture stdout and stdin
            old_stdout = sys.stdout
            old_stdin = sys.stdin
            
            sys.stdout = io.StringIO()
            sys.stdin = io.StringIO(input_data)
            
            # Create a namespace for execution
            namespace = {
                '__name__': '__main__',
                '__builtins__': __builtins__
            }
            
            # Execute the code
            exec(code, namespace)
            
            # Get captured output
            output = sys.stdout.getvalue()
            
            return {
                'success': True,
                'output': output,
                'error': None
            }
        
        except EOFError:
            # Program tried to read input() but no input was provided
            output = sys.stdout.getvalue() if 'sys' in locals() else ""
            
            return {
                'success': False,
                'output': output,
                'error': '⌨️ Input Required: Your program needs user input to run. Please switch to the "Input" tab, enter your input data, and run again.'
            }
        
        except Exception as e:
            # Get any output before error
            output = sys.stdout.getvalue() if 'sys' in locals() else ""
            
            return {
                'success': False,
                'output': output,
                'error': f"{type(e).__name__}: {str(e)}"
            }
        
        finally:
            # Restore stdout and stdin
            if 'old_stdout' in locals():
                sys.stdout = old_stdout
            if 'old_stdin' in locals():
                sys.stdin = old_stdin