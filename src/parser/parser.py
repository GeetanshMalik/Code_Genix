"""
Parser - Builds Abstract Syntax Tree from tokens
Implements recursive descent parsing
"""
from typing import List, Optional
from ..lexer.token_types import Token, TokenType
from .ast_nodes import *

class Parser:
    def __init__(self, tokens: List[Token]):
        self.tokens = tokens
        self.pos = 0
    
    def error(self, msg: str):
        current = self.current_token()
        raise SyntaxError(f"Line {current.line}, Col {current.column}: {msg}")
    
    def current_token(self) -> Token:
        return self.tokens[self.pos] if self.pos < len(self.tokens) else self.tokens[-1]
    
    def peek(self, offset: int = 1) -> Token:
        pos = self.pos + offset
        return self.tokens[pos] if pos < len(self.tokens) else self.tokens[-1]
    
    def advance(self) -> Token:
        token = self.current_token()
        if self.pos < len(self.tokens) - 1:
            self.pos += 1
        return token
    
    def expect(self, token_type: TokenType) -> Token:
        token = self.current_token()
        if token.type != token_type:
            self.error(f"Expected {token_type}, got {token.type}")
        return self.advance()
    
    def match(self, *token_types: TokenType) -> bool:
        return self.current_token().type in token_types
    
    def skip_newlines(self):
        while self.match(TokenType.NEWLINE):
            self.advance()
    
    def parse(self) -> ProgramNode:
        """Parse the entire program"""
        statements = []
        self.skip_newlines()
        
        while not self.match(TokenType.EOF):
            stmt = self.parse_statement()
            if stmt:
                statements.append(stmt)
            self.skip_newlines()
        
        return ProgramNode(statements=statements)
    
    def parse_statement(self) -> Optional[ASTNode]:
        """Parse a single statement"""
        self.skip_newlines()
        
        if self.match(TokenType.IF):
            return self.parse_if()
        elif self.match(TokenType.WHILE):
            return self.parse_while()
        elif self.match(TokenType.FOR):
            return self.parse_for()
        elif self.match(TokenType.DEF):
            return self.parse_function_def()
        elif self.match(TokenType.CLASS):
            return self.parse_class_def()
        elif self.match(TokenType.RETURN):
            return self.parse_return()
        elif self.match(TokenType.BREAK):
            self.advance()
            return BreakNode()
        elif self.match(TokenType.CONTINUE):
            self.advance()
            return ContinueNode()
        elif self.match(TokenType.PASS):
            self.advance()
            return PassNode()
        elif self.match(TokenType.IMPORT, TokenType.FROM):
            return self.parse_import()
        elif self.match(TokenType.TRY):
            return self.parse_try()
        elif self.match(TokenType.RAISE):
            return self.parse_raise()
        else:
            return self.parse_expression_statement()
    
    def parse_expression_statement(self) -> ASTNode:
        """Parse expression or assignment"""
        expr = self.parse_expression()
        
        # Check for assignment
        if self.match(TokenType.ASSIGN):
            if not isinstance(expr, IdentifierNode):
                self.error("Invalid assignment target")
            self.advance()
            value = self.parse_expression()
            return AssignmentNode(target=expr.name, value=value)
        
        return expr
    
    def parse_expression(self) -> ASTNode:
        """Parse expression with operator precedence"""
        return self.parse_logical_or()
    
    def parse_logical_or(self) -> ASTNode:
        left = self.parse_logical_and()
        
        while self.match(TokenType.OR):
            op = self.advance().value
            right = self.parse_logical_and()
            left = LogicalOpNode(left=left, operator='or', right=right)
        
        return left
    
    def parse_logical_and(self) -> ASTNode:
        left = self.parse_comparison()
        
        while self.match(TokenType.AND):
            op = self.advance().value
            right = self.parse_comparison()
            left = LogicalOpNode(left=left, operator='and', right=right)
        
        return left
    
    def parse_comparison(self) -> ASTNode:
        left = self.parse_additive()
        
        if self.match(TokenType.EQUAL, TokenType.NOT_EQUAL, TokenType.LESS_THAN,
                      TokenType.GREATER_THAN, TokenType.LESS_EQUAL, TokenType.GREATER_EQUAL):
            op_token = self.advance()
            op_map = {
                TokenType.EQUAL: '==',
                TokenType.NOT_EQUAL: '!=',
                TokenType.LESS_THAN: '<',
                TokenType.GREATER_THAN: '>',
                TokenType.LESS_EQUAL: '<=',
                TokenType.GREATER_EQUAL: '>=',
            }
            op = op_map[op_token.type]
            right = self.parse_additive()
            return ComparisonNode(left=left, operator=op, right=right)
        
        return left
    
    def parse_additive(self) -> ASTNode:
        left = self.parse_multiplicative()
        
        while self.match(TokenType.PLUS, TokenType.MINUS):
            op = self.advance().value
            right = self.parse_multiplicative()
            left = BinaryOpNode(left=left, operator=op, right=right)
        
        return left
    
    def parse_multiplicative(self) -> ASTNode:
        left = self.parse_power()
        
        while self.match(TokenType.MULTIPLY, TokenType.DIVIDE, 
                         TokenType.FLOOR_DIVIDE, TokenType.MODULO):
            op = self.advance().value
            right = self.parse_power()
            left = BinaryOpNode(left=left, operator=op, right=right)
        
        return left
    
    def parse_power(self) -> ASTNode:
        left = self.parse_unary()
        
        if self.match(TokenType.POWER):
            op = self.advance().value
            right = self.parse_power()  # Right associative
            return BinaryOpNode(left=left, operator=op, right=right)
        
        return left
    
    def parse_unary(self) -> ASTNode:
        if self.match(TokenType.MINUS, TokenType.PLUS, TokenType.NOT):
            op = self.advance().value
            operand = self.parse_unary()
            return UnaryOpNode(operator=op, operand=operand)
        
        return self.parse_postfix()
    
    def parse_postfix(self) -> ASTNode:
        expr = self.parse_primary()
        
        while True:
            if self.match(TokenType.LPAREN):
                expr = self.parse_function_call(expr)
            elif self.match(TokenType.LBRACKET):
                self.advance()
                index = self.parse_expression()
                self.expect(TokenType.RBRACKET)
                expr = IndexNode(object=expr, index=index)
            elif self.match(TokenType.DOT):
                self.advance()
                attr = self.expect(TokenType.IDENTIFIER).value
                expr = AttributeNode(object=expr, attribute=attr)
            else:
                break
        
        return expr
    
    def parse_primary(self) -> ASTNode:
        """Parse primary expressions (literals, identifiers, etc.)"""
        token = self.current_token()
        
        if self.match(TokenType.INTEGER, TokenType.FLOAT):
            self.advance()
            return NumberNode(value=token.value)
        
        if self.match(TokenType.STRING):
            self.advance()
            return StringNode(value=token.value)
        
        if self.match(TokenType.TRUE, TokenType.FALSE):
            self.advance()
            return BooleanNode(value=token.value)
        
        if self.match(TokenType.NONE):
            self.advance()
            return NoneNode()
        
        if self.match(TokenType.IDENTIFIER):
            self.advance()
            return IdentifierNode(name=token.value)
        
        if self.match(TokenType.LPAREN):
            self.advance()
            expr = self.parse_expression()
            self.expect(TokenType.RPAREN)
            return expr
        
        if self.match(TokenType.LBRACKET):
            return self.parse_list()
        
        if self.match(TokenType.LBRACE):
            return self.parse_dict()
        
        if self.match(TokenType.LAMBDA):
            return self.parse_lambda()
        
        self.error(f"Unexpected token: {token.type}")
    
    def parse_function_call(self, function: ASTNode) -> FunctionCallNode:
        self.expect(TokenType.LPAREN)
        arguments = []
        
        if not self.match(TokenType.RPAREN):
            arguments.append(self.parse_expression())
            while self.match(TokenType.COMMA):
                self.advance()
                arguments.append(self.parse_expression())
        
        self.expect(TokenType.RPAREN)
        return FunctionCallNode(function=function, arguments=arguments)
    
    def parse_list(self) -> ListNode:
        self.expect(TokenType.LBRACKET)
        elements = []
        
        if not self.match(TokenType.RBRACKET):
            elements.append(self.parse_expression())
            while self.match(TokenType.COMMA):
                self.advance()
                if self.match(TokenType.RBRACKET):
                    break
                elements.append(self.parse_expression())
        
        self.expect(TokenType.RBRACKET)
        return ListNode(elements=elements)
    
    def parse_dict(self) -> DictNode:
        self.expect(TokenType.LBRACE)
        pairs = []
        
        if not self.match(TokenType.RBRACE):
            key = self.parse_expression()
            self.expect(TokenType.COLON)
            value = self.parse_expression()
            pairs.append((key, value))
            
            while self.match(TokenType.COMMA):
                self.advance()
                if self.match(TokenType.RBRACE):
                    break
                key = self.parse_expression()
                self.expect(TokenType.COLON)
                value = self.parse_expression()
                pairs.append((key, value))
        
        self.expect(TokenType.RBRACE)
        return DictNode(pairs=pairs)
    
    def parse_block(self) -> List[ASTNode]:
        """Parse an indented block of statements"""
        self.expect(TokenType.INDENT)
        statements = []
        
        while not self.match(TokenType.DEDENT, TokenType.EOF):
            stmt = self.parse_statement()
            if stmt:
                statements.append(stmt)
            self.skip_newlines()
        
        self.expect(TokenType.DEDENT)
        return statements
    
    def parse_if(self) -> IfNode:
        self.expect(TokenType.IF)
        condition = self.parse_expression()
        self.expect(TokenType.COLON)
        self.skip_newlines()
        then_block = self.parse_block()
        
        elif_blocks = []
        while self.match(TokenType.ELIF):
            self.advance()
            elif_cond = self.parse_expression()
            self.expect(TokenType.COLON)
            self.skip_newlines()
            elif_body = self.parse_block()
            elif_blocks.append((elif_cond, elif_body))
        
        else_block = None
        if self.match(TokenType.ELSE):
            self.advance()
            self.expect(TokenType.COLON)
            self.skip_newlines()
            else_block = self.parse_block()
        
        return IfNode(condition=condition, then_block=then_block,
                     elif_blocks=elif_blocks, else_block=else_block)
    
    def parse_while(self) -> WhileNode:
        self.expect(TokenType.WHILE)
        condition = self.parse_expression()
        self.expect(TokenType.COLON)
        self.skip_newlines()
        body = self.parse_block()
        return WhileNode(condition=condition, body=body)
    
    def parse_for(self) -> ForNode:
        self.expect(TokenType.FOR)
        var = self.expect(TokenType.IDENTIFIER).value
        self.expect(TokenType.IN)
        iterable = self.parse_expression()
        self.expect(TokenType.COLON)
        self.skip_newlines()
        body = self.parse_block()
        return ForNode(variable=var, iterable=iterable, body=body)
    
    def parse_function_def(self) -> FunctionDefNode:
        self.expect(TokenType.DEF)
        name = self.expect(TokenType.IDENTIFIER).value
        self.expect(TokenType.LPAREN)
        
        parameters = []
        if not self.match(TokenType.RPAREN):
            parameters.append(self.expect(TokenType.IDENTIFIER).value)
            while self.match(TokenType.COMMA):
                self.advance()
                parameters.append(self.expect(TokenType.IDENTIFIER).value)
        
        self.expect(TokenType.RPAREN)
        self.expect(TokenType.COLON)
        self.skip_newlines()
        body = self.parse_block()
        
        return FunctionDefNode(name=name, parameters=parameters, body=body)
    
    def parse_class_def(self) -> ClassDefNode:
        self.expect(TokenType.CLASS)
        name = self.expect(TokenType.IDENTIFIER).value
        
        bases = []
        if self.match(TokenType.LPAREN):
            self.advance()
            if not self.match(TokenType.RPAREN):
                bases.append(self.expect(TokenType.IDENTIFIER).value)
                while self.match(TokenType.COMMA):
                    self.advance()
                    bases.append(self.expect(TokenType.IDENTIFIER).value)
            self.expect(TokenType.RPAREN)
        
        self.expect(TokenType.COLON)
        self.skip_newlines()
        body = self.parse_block()
        
        return ClassDefNode(name=name, bases=bases, body=body)
    
    def parse_return(self) -> ReturnNode:
        self.expect(TokenType.RETURN)
        value = None
        if not self.match(TokenType.NEWLINE, TokenType.EOF):
            value = self.parse_expression()
        return ReturnNode(value=value)
    
    def parse_import(self) -> ImportNode:
        if self.match(TokenType.IMPORT):
            self.advance()
            module = self.expect(TokenType.IDENTIFIER).value
            alias = None
            if self.match(TokenType.AS):
                self.advance()
                alias = self.expect(TokenType.IDENTIFIER).value
            return ImportNode(module=module, alias=alias)
        # TODO: Handle 'from ... import ...'
        self.error("Import not fully implemented")
    
    def parse_try(self) -> TryNode:
        self.expect(TokenType.TRY)
        self.expect(TokenType.COLON)
        self.skip_newlines()
        try_block = self.parse_block()
        
        except_blocks = []
        while self.match(TokenType.EXCEPT):
            self.advance()
            exc_type = self.expect(TokenType.IDENTIFIER).value if self.match(TokenType.IDENTIFIER) else None
            self.expect(TokenType.COLON)
            self.skip_newlines()
            exc_body = self.parse_block()
            except_blocks.append((exc_type, None, exc_body))
        
        finally_block = None
        if self.match(TokenType.FINALLY):
            self.advance()
            self.expect(TokenType.COLON)
            self.skip_newlines()
            finally_block = self.parse_block()
        
        return TryNode(try_block=try_block, except_blocks=except_blocks, finally_block=finally_block)
    
    def parse_raise(self) -> RaiseNode:
        self.expect(TokenType.RAISE)
        exception = self.parse_expression()
        return RaiseNode(exception=exception)
    
    def parse_lambda(self) -> LambdaNode:
        self.expect(TokenType.LAMBDA)
        parameters = []
        
        if not self.match(TokenType.COLON):
            parameters.append(self.expect(TokenType.IDENTIFIER).value)
            while self.match(TokenType.COMMA):
                self.advance()
                parameters.append(self.expect(TokenType.IDENTIFIER).value)
        
        self.expect(TokenType.COLON)
        body = self.parse_expression()
        return LambdaNode(parameters=parameters, body=body)