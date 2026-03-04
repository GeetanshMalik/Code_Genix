"""
Lexical Analyzer (Tokenizer) for Python code
Converts source code into a stream of tokens
"""
from typing import List
from .token_types import Token, TokenType, KEYWORDS

class Tokenizer:
    def __init__(self, source: str):
        self.source = source
        self.pos = 0
        self.line = 1
        self.column = 1
        self.tokens: List[Token] = []
        self.indent_stack = [0]
    
    def error(self, msg: str):
        raise SyntaxError(f"Line {self.line}, Col {self.column}: {msg}")
    
    def peek(self, offset: int = 0) -> str:
        pos = self.pos + offset
        return self.source[pos] if pos < len(self.source) else '\0'
    
    def advance(self) -> str:
        if self.pos >= len(self.source):
            return '\0'
        char = self.source[self.pos]
        self.pos += 1
        if char == '\n':
            self.line += 1
            self.column = 1
        else:
            self.column += 1
        return char
    
    def skip_whitespace(self):
        while self.peek() in ' \t\r':
            self.advance()
    
    def skip_comment(self):
        if self.peek() == '#':
            while self.peek() not in '\n\0':
                self.advance()
    
    def read_number(self) -> Token:
        start_col = self.column
        num_str = ''
        is_float = False
        
        while self.peek().isdigit() or self.peek() == '.':
            if self.peek() == '.':
                if is_float:
                    self.error("Invalid number format")
                is_float = True
            num_str += self.advance()
        
        value = float(num_str) if is_float else int(num_str)
        token_type = TokenType.FLOAT if is_float else TokenType.INTEGER
        return Token(token_type, value, self.line, start_col)
    
    def read_string(self, quote: str) -> Token:
        start_col = self.column
        self.advance()  # Skip opening quote
        string_val = ''
        
        while self.peek() != quote and self.peek() != '\0':
            if self.peek() == '\\':
                self.advance()
                next_char = self.advance()
                # Handle escape sequences
                escape_chars = {'n': '\n', 't': '\t', 'r': '\r', '\\': '\\', quote: quote}
                string_val += escape_chars.get(next_char, next_char)
            else:
                string_val += self.advance()
        
        if self.peek() == '\0':
            self.error("Unterminated string")
        
        self.advance()  # Skip closing quote
        return Token(TokenType.STRING, string_val, self.line, start_col)
    
    def read_identifier(self) -> Token:
        start_col = self.column
        identifier = ''
        
        while self.peek().isalnum() or self.peek() == '_':
            identifier += self.advance()
        
        token_type = KEYWORDS.get(identifier, TokenType.IDENTIFIER)
        value = identifier if token_type == TokenType.IDENTIFIER else identifier
        
        # Special handling for boolean and None literals
        if token_type == TokenType.TRUE:
            value = True
        elif token_type == TokenType.FALSE:
            value = False
        elif token_type == TokenType.NONE:
            value = None
        
        return Token(token_type, value, self.line, start_col)
    
    def handle_indentation(self, spaces: int):
        """Handle Python's indentation-based syntax"""
        if spaces > self.indent_stack[-1]:
            self.indent_stack.append(spaces)
            self.tokens.append(Token(TokenType.INDENT, None, self.line, 1))
        elif spaces < self.indent_stack[-1]:
            while self.indent_stack[-1] > spaces:
                self.indent_stack.pop()
                self.tokens.append(Token(TokenType.DEDENT, None, self.line, 1))
            if self.indent_stack[-1] != spaces:
                self.error("Inconsistent indentation")
    
    def tokenize(self) -> List[Token]:
        """Main tokenization method"""
        at_line_start = True
        
        while self.pos < len(self.source):
            # Handle indentation at the start of lines
            if at_line_start and self.peek() not in '\n\0':
                spaces = 0
                while self.peek() in ' \t':
                    spaces += 4 if self.peek() == '\t' else 1
                    self.advance()
                
                if self.peek() not in '#\n\0':  # Not a comment or empty line
                    self.handle_indentation(spaces)
                at_line_start = False
            
            self.skip_whitespace()
            self.skip_comment()
            
            char = self.peek()
            
            if char == '\0':
                break
            
            # Newline
            if char == '\n':
                self.tokens.append(Token(TokenType.NEWLINE, '\\n', self.line, self.column))
                self.advance()
                at_line_start = True
                continue
            
            # Numbers
            if char.isdigit():
                self.tokens.append(self.read_number())
                continue
            
            # Strings
            if char in '"\'':
                self.tokens.append(self.read_string(char))
                continue
            
            # Identifiers and keywords
            if char.isalpha() or char == '_':
                self.tokens.append(self.read_identifier())
                continue
            
            # Operators and delimiters
            start_col = self.column
            
            # Two-character operators
            two_char = char + self.peek(1)
            two_char_ops = {
                '==': TokenType.EQUAL,
                '!=': TokenType.NOT_EQUAL,
                '<=': TokenType.LESS_EQUAL,
                '>=': TokenType.GREATER_EQUAL,
                '//': TokenType.FLOOR_DIVIDE,
                '**': TokenType.POWER,
                '+=': TokenType.PLUS_ASSIGN,
                '-=': TokenType.MINUS_ASSIGN,
                '->': TokenType.ARROW,
            }
            
            if two_char in two_char_ops:
                self.advance()
                self.advance()
                self.tokens.append(Token(two_char_ops[two_char], two_char, self.line, start_col))
                continue
            
            # Single-character operators
            single_char_ops = {
                '+': TokenType.PLUS,
                '-': TokenType.MINUS,
                '*': TokenType.MULTIPLY,
                '/': TokenType.DIVIDE,
                '%': TokenType.MODULO,
                '=': TokenType.ASSIGN,
                '<': TokenType.LESS_THAN,
                '>': TokenType.GREATER_THAN,
                '(': TokenType.LPAREN,
                ')': TokenType.RPAREN,
                '[': TokenType.LBRACKET,
                ']': TokenType.RBRACKET,
                '{': TokenType.LBRACE,
                '}': TokenType.RBRACE,
                ',': TokenType.COMMA,
                ':': TokenType.COLON,
                ';': TokenType.SEMICOLON,
                '.': TokenType.DOT,
            }
            
            if char in single_char_ops:
                self.advance()
                self.tokens.append(Token(single_char_ops[char], char, self.line, start_col))
                continue
            
            self.error(f"Unexpected character: {char}")
        
        # Handle remaining dedents
        while len(self.indent_stack) > 1:
            self.indent_stack.pop()
            self.tokens.append(Token(TokenType.DEDENT, None, self.line, self.column))
        
        self.tokens.append(Token(TokenType.EOF, None, self.line, self.column))
        return self.tokens