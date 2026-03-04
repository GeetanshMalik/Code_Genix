"""
Enhanced REPL (Read-Eval-Print-Loop) shell
"""
import sys
from typing import Optional

try:
    from prompt_toolkit import PromptSession
    from prompt_toolkit.history import InMemoryHistory
    from prompt_toolkit.auto_suggest import AutoSuggestFromHistory
    PROMPT_TOOLKIT_AVAILABLE = True
except ImportError:
    PROMPT_TOOLKIT_AVAILABLE = False

from ..interpreter.executor import Executor
from ..ai.error_explainer import explain_error

class EnhancedREPL:
    """Enhanced interactive shell with advanced features"""
    
    def __init__(self, use_prompt_toolkit: bool = True):
        self.executor = Executor()
        self.use_prompt_toolkit = use_prompt_toolkit and PROMPT_TOOLKIT_AVAILABLE
        self.history = []
        
        if self.use_prompt_toolkit:
            self.session = PromptSession(
                history=InMemoryHistory(),
                auto_suggest=AutoSuggestFromHistory(),
            )
    
    def print_banner(self):
        """Print welcome banner"""
        print("╔═══════════════════════════════════════════════╗")
        print("║   AI-Powered Python Interpreter v0.1.0       ║")
        print("║   Type 'help()' for help, 'exit()' to quit   ║")
        print("╚═══════════════════════════════════════════════╝")
        print()
    
    def get_input(self, prompt: str = ">>> ") -> str:
        """Get input from user"""
        if self.use_prompt_toolkit:
            try:
                return self.session.prompt(prompt)
            except EOFError:
                return "exit()"
        else:
            try:
                return input(prompt)
            except EOFError:
                return "exit()"
    
    def handle_special_commands(self, code: str) -> Optional[bool]:
        """
        Handle special REPL commands
        Returns True if command was handled, None to continue normally
        """
        code = code.strip()
        
        # Exit commands
        if code in ['exit()', 'quit()', 'exit', 'quit']:
            print("Goodbye! 👋")
            return True
        
        # Help command
        if code in ['help()', 'help']:
            self.show_help()
            return False
        
        # History command
        if code in ['history()', 'history']:
            self.show_history()
            return False
        
        # Clear command
        if code in ['clear()', 'clear', 'cls']:
            self.clear_screen()
            return False
        
        # Variables command
        if code in ['vars()', 'vars']:
            self.show_variables()
            return False
        
        return None
    
    def show_help(self):
        """Show help information"""
        help_text = """
Available Commands:
  help()      - Show this help message
  exit()      - Exit the interpreter
  quit()      - Exit the interpreter
  history()   - Show command history
  clear()     - Clear the screen
  vars()      - Show all defined variables
  
Basic Python Features:
  • Variables: x = 10
  • Arithmetic: +, -, *, /, //, %, **
  • Control: if, while, for
  • Functions: def name(params): ...
  • Data: lists [1,2,3], dicts {"key": "value"}
  
Examples:
  >>> print("Hello World")
  >>> x = 10; y = 20; print(x + y)
  >>> def factorial(n):
  ...     if n <= 1: return 1
  ...     return n * factorial(n-1)
  >>> print(factorial(5))
        """
        print(help_text)
    
    def show_history(self):
        """Show command history"""
        if not self.history:
            print("No history yet")
            return
        
        print("\nCommand History:")
        for i, cmd in enumerate(self.history, 1):
            print(f"  {i}. {cmd}")
        print()
    
    def show_variables(self):
        """Show all defined variables"""
        variables = self.executor.current_env.get_all()
        
        # Filter out built-in functions
        user_vars = {k: v for k, v in variables.items() 
                     if not callable(v) or k not in self.executor.global_env.variables}
        
        if not user_vars:
            print("No variables defined")
            return
        
        print("\nDefined Variables:")
        for name, value in user_vars.items():
            value_str = repr(value)
            if len(value_str) > 50:
                value_str = value_str[:47] + "..."
            print(f"  {name} = {value_str}")
        print()
    
    def clear_screen(self):
        """Clear the screen"""
        import os
        os.system('cls' if os.name == 'nt' else 'clear')
        self.print_banner()
    
    def execute_code(self, code: str) -> Optional[any]:
        """Execute code and return result"""
        try:
            result = self.executor.run(code)
            return result
        except Exception as e:
            # Show error with AI explanation
            print(f"\n❌ {type(e).__name__}: {e}")
            explanation = explain_error(e)
            print(explanation)
            print()
            return None
    
    def run(self):
        """Main REPL loop"""
        self.print_banner()
        
        if not PROMPT_TOOLKIT_AVAILABLE:
            print("⚠️  For better experience, install prompt_toolkit:")
            print("   pip install prompt-toolkit")
            print()
        
        while True:
            try:
                # Get input
                code = self.get_input()
                
                # Skip empty lines
                if not code.strip():
                    continue
                
                # Handle special commands
                result = self.handle_special_commands(code)
                if result is True:  # Exit
                    break
                elif result is False:  # Command handled
                    continue
                
                # Add to history
                self.history.append(code)
                
                # Execute code
                result = self.execute_code(code)
                
                # Print result if not None
                if result is not None:
                    print(result)
            
            except KeyboardInterrupt:
                print("\nKeyboardInterrupt")
                print("(Use exit() or Ctrl+D to exit)")
                continue
            
            except EOFError:
                print("\nGoodbye! 👋")
                break

def start_repl(enhanced: bool = True):
    """Start the REPL"""
    if enhanced and PROMPT_TOOLKIT_AVAILABLE:
        repl = EnhancedREPL()
        repl.run()
    else:
        # Fall back to basic REPL
        from ..interpreter.executor import Executor
        
        print("Python Interpreter with AI (v0.1.0)")
        print("Type 'exit()' or 'quit()' to exit")
        print("-" * 50)
        
        executor = Executor()
        
        while True:
            try:
                code = input(">>> ")
                
                if code.strip() in ['exit()', 'quit()', 'exit', 'quit']:
                    print("Goodbye!")
                    break
                
                if not code.strip():
                    continue
                
                result = executor.run(code)
                
                if result is not None:
                    print(result)
            
            except KeyboardInterrupt:
                print("\nKeyboardInterrupt")
                continue
            except EOFError:
                print("\nGoodbye!")
                break
            except Exception as e:
                print(f"{type(e).__name__}: {e}")