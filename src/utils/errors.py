"""
Custom error classes for the interpreter
"""

class InterpreterError(Exception):
    """Base class for interpreter errors"""
    def __init__(self, message: str, line: int = 0, column: int = 0):
        self.message = message
        self.line = line
        self.column = column
        super().__init__(self.format_error())
    
    def format_error(self) -> str:
        if self.line > 0:
            return f"Line {self.line}, Col {self.column}: {self.message}"
        return self.message

class LexerError(InterpreterError):
    """Error during tokenization"""
    pass

class ParserError(InterpreterError):
    """Error during parsing"""
    pass

class RuntimeError(InterpreterError):
    """Error during execution"""
    pass

class NameError(RuntimeError):
    """Variable not found"""
    pass

class TypeError(RuntimeError):
    """Type mismatch"""
    pass

class ValueError(RuntimeError):
    """Invalid value"""
    pass

class IndexError(RuntimeError):
    """Index out of range"""
    pass

class KeyError(RuntimeError):
    """Key not found in dictionary"""
    pass

class AttributeError(RuntimeError):
    """Attribute not found"""
    pass

class ZeroDivisionError(RuntimeError):
    """Division by zero"""
    pass

class ImportError(RuntimeError):
    """Module import failed"""
    pass