"""
AI-powered error explanation module
Converts technical errors into user-friendly explanations
"""
from typing import Optional

class ErrorExplainer:
    """Explains errors in plain English using AI"""
    
    def __init__(self, use_ai: bool = False):
        self.use_ai = use_ai
        self.error_templates = self._load_templates()
    
    def _load_templates(self) -> dict:
        """Load error explanation templates"""
        return {
            'SyntaxError': {
                'unexpected EOF': "You forgot to close a bracket, parenthesis, or quote.",
                'invalid syntax': "There's a syntax error in your code. Check for missing colons, brackets, or quotes.",
                'unexpected indent': "Your indentation is incorrect. Make sure you're using consistent spacing.",
            },
            'NameError': {
                'not defined': "You're trying to use a variable that doesn't exist. Did you forget to define it?",
            },
            'TypeError': {
                'not callable': "You're trying to call something that isn't a function.",
                'unsupported operand': "You're trying to use an operator with incompatible types.",
            },
            'IndexError': {
                'out of range': "You're trying to access an element that doesn't exist in the list.",
            },
            'KeyError': {
                'default': "The key you're looking for doesn't exist in the dictionary.",
            },
            'ZeroDivisionError': {
                'default': "You can't divide by zero!",
            },
        }
    
    def explain(self, error: Exception) -> str:
        """
        Explain an error in plain English
        
        Args:
            error: The exception to explain
            
        Returns:
            A user-friendly explanation
        """
        error_type = type(error).__name__
        error_message = str(error).lower()
        
        # Try to find a matching template
        if error_type in self.error_templates:
            templates = self.error_templates[error_type]
            
            # Look for matching substring
            for key, explanation in templates.items():
                if key in error_message:
                    return f"💡 {explanation}"
            
            # Use default if available
            if 'default' in templates:
                return f"💡 {templates['default']}"
        
        # Generic explanation
        return f"💡 {error_type}: {str(error)}"
    
    def suggest_fix(self, error: Exception, code: str) -> Optional[str]:
        """
        Suggest a fix for the error
        
        Args:
            error: The exception
            code: The code that caused the error
            
        Returns:
            A suggested fix or None
        """
        error_type = type(error).__name__
        
        suggestions = {
            'SyntaxError': "Check your syntax, especially colons, brackets, and indentation.",
            'NameError': "Make sure you've defined all variables before using them.",
            'TypeError': "Check that you're using the right types for operations.",
            'IndexError': "Use len() to check the size before accessing elements.",
            'KeyError': "Use .get() method or check if key exists with 'in'.",
        }
        
        return suggestions.get(error_type)
    
    def explain_with_ai(self, error: Exception, code: str) -> str:
        """
        Use AI to explain the error (placeholder for future implementation)
        
        Args:
            error: The exception
            code: The code that caused the error
            
        Returns:
            AI-generated explanation
        """
        if not self.use_ai:
            return self.explain(error)
        
        # TODO: Implement actual AI integration
        # This would call GPT/Claude API with the error and code
        return f"AI explanation not yet implemented. {self.explain(error)}"

# Global explainer instance
_explainer = ErrorExplainer()

def explain_error(error: Exception) -> str:
    """Explain an error using the global explainer"""
    return _explainer.explain(error)

def suggest_fix(error: Exception, code: str = "") -> Optional[str]:
    """Suggest a fix using the global explainer"""
    return _explainer.suggest_fix(error, code)