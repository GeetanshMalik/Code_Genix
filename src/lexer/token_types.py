"""
Token type definitions for the Python interpreter
"""
from enum import Enum, auto

class TokenType(Enum):
    # Literals
    INTEGER = auto()
    FLOAT = auto()
    STRING = auto()
    TRUE = auto()
    FALSE = auto()
    NONE = auto()
    
    # Identifiers
    IDENTIFIER = auto()
    
    # Keywords
    IF = auto()
    ELIF = auto()
    ELSE = auto()
    WHILE = auto()
    FOR = auto()
    IN = auto()
    DEF = auto()
    RETURN = auto()
    CLASS = auto()
    IMPORT = auto()
    FROM = auto()
    AS = auto()
    PASS = auto()
    BREAK = auto()
    CONTINUE = auto()
    AND = auto()
    OR = auto()
    NOT = auto()
    IS = auto()
    LAMBDA = auto()
    TRY = auto()
    EXCEPT = auto()
    FINALLY = auto()
    RAISE = auto()
    WITH = auto()
    YIELD = auto()
    
    # Operators
    PLUS = auto()
    MINUS = auto()
    MULTIPLY = auto()
    DIVIDE = auto()
    FLOOR_DIVIDE = auto()
    MODULO = auto()
    POWER = auto()
    
    # Comparison
    EQUAL = auto()
    NOT_EQUAL = auto()
    LESS_THAN = auto()
    GREATER_THAN = auto()
    LESS_EQUAL = auto()
    GREATER_EQUAL = auto()
    
    # Assignment
    ASSIGN = auto()
    PLUS_ASSIGN = auto()
    MINUS_ASSIGN = auto()
    
    # Delimiters
    LPAREN = auto()
    RPAREN = auto()
    LBRACKET = auto()
    RBRACKET = auto()
    LBRACE = auto()
    RBRACE = auto()
    COMMA = auto()
    COLON = auto()
    SEMICOLON = auto()
    DOT = auto()
    ARROW = auto()
    
    # Special
    NEWLINE = auto()
    INDENT = auto()
    DEDENT = auto()
    EOF = auto()

class Token:
    def __init__(self, type: TokenType, value, line: int, column: int):
        self.type = type
        self.value = value
        self.line = line
        self.column = column
    
    def __repr__(self):
        return f"Token({self.type}, {self.value!r}, {self.line}:{self.column})"

# Keywords mapping
KEYWORDS = {
    'if': TokenType.IF,
    'elif': TokenType.ELIF,
    'else': TokenType.ELSE,
    'while': TokenType.WHILE,
    'for': TokenType.FOR,
    'in': TokenType.IN,
    'def': TokenType.DEF,
    'return': TokenType.RETURN,
    'class': TokenType.CLASS,
    'import': TokenType.IMPORT,
    'from': TokenType.FROM,
    'as': TokenType.AS,
    'pass': TokenType.PASS,
    'break': TokenType.BREAK,
    'continue': TokenType.CONTINUE,
    'and': TokenType.AND,
    'or': TokenType.OR,
    'not': TokenType.NOT,
    'is': TokenType.IS,
    'True': TokenType.TRUE,
    'False': TokenType.FALSE,
    'None': TokenType.NONE,
    'lambda': TokenType.LAMBDA,
    'try': TokenType.TRY,
    'except': TokenType.EXCEPT,
    'finally': TokenType.FINALLY,
    'raise': TokenType.RAISE,
    'with': TokenType.WITH,
    'yield': TokenType.YIELD,
}