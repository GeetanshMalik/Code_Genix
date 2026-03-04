"""
Executor - Executes Abstract Syntax Tree nodes
"""
from typing import Any, List
from ..parser.ast_nodes import *
from .environment import Environment
from .builtins import get_builtins

class BreakException(Exception):
    """Exception for break statement"""
    pass

class ContinueException(Exception):
    """Exception for continue statement"""
    pass

class ReturnException(Exception):
    """Exception for return statement"""
    def __init__(self, value):
        self.value = value

class UserFunction:
    """User-defined function"""
    def __init__(self, name: str, parameters: List[str], body: List[ASTNode], closure: Environment):
        self.name = name
        self.parameters = parameters
        self.body = body
        self.closure = closure
    
    def __repr__(self):
        return f"<function {self.name}>"

class Executor:
    def __init__(self):
        self.global_env = Environment()
        self.current_env = self.global_env
        
        # Add built-in functions
        for name, func in get_builtins().items():
            self.global_env.define(name, func)
    
    def execute(self, node: ASTNode) -> Any:
        """Execute an AST node"""
        method_name = f'execute_{node.__class__.__name__}'
        method = getattr(self, method_name, self.generic_execute)
        return method(node)
    
    def generic_execute(self, node: ASTNode):
        raise NotImplementedError(f"Execution not implemented for {node.__class__.__name__}")
    
    def execute_ProgramNode(self, node: ProgramNode) -> Any:
        result = None
        for statement in node.statements:
            result = self.execute(statement)
        return result
    
    def execute_NumberNode(self, node: NumberNode) -> float:
        return node.value
    
    def execute_StringNode(self, node: StringNode) -> str:
        return node.value
    
    def execute_BooleanNode(self, node: BooleanNode) -> bool:
        return node.value
    
    def execute_NoneNode(self, node: NoneNode):
        return None
    
    def execute_IdentifierNode(self, node: IdentifierNode) -> Any:
        return self.current_env.get(node.name)
    
    def execute_BinaryOpNode(self, node: BinaryOpNode) -> Any:
        left = self.execute(node.left)
        right = self.execute(node.right)
        
        operators = {
            '+': lambda a, b: a + b,
            '-': lambda a, b: a - b,
            '*': lambda a, b: a * b,
            '/': lambda a, b: a / b,
            '//': lambda a, b: a // b,
            '%': lambda a, b: a % b,
            '**': lambda a, b: a ** b,
        }
        
        if node.operator in operators:
            return operators[node.operator](left, right)
        
        raise RuntimeError(f"Unknown operator: {node.operator}")
    
    def execute_UnaryOpNode(self, node: UnaryOpNode) -> Any:
        operand = self.execute(node.operand)
        
        if node.operator == '-':
            return -operand
        elif node.operator == '+':
            return +operand
        elif node.operator == 'not':
            return not operand
        
        raise RuntimeError(f"Unknown unary operator: {node.operator}")
    
    def execute_ComparisonNode(self, node: ComparisonNode) -> bool:
        left = self.execute(node.left)
        right = self.execute(node.right)
        
        operators = {
            '==': lambda a, b: a == b,
            '!=': lambda a, b: a != b,
            '<': lambda a, b: a < b,
            '>': lambda a, b: a > b,
            '<=': lambda a, b: a <= b,
            '>=': lambda a, b: a >= b,
        }
        
        if node.operator in operators:
            return operators[node.operator](left, right)
        
        raise RuntimeError(f"Unknown comparison operator: {node.operator}")
    
    def execute_LogicalOpNode(self, node: LogicalOpNode) -> Any:
        left = self.execute(node.left)
        
        if node.operator == 'and':
            return left and self.execute(node.right)
        elif node.operator == 'or':
            return left or self.execute(node.right)
        
        raise RuntimeError(f"Unknown logical operator: {node.operator}")
    
    def execute_AssignmentNode(self, node: AssignmentNode) -> Any:
        value = self.execute(node.value)
        self.current_env.set(node.target, value)
        return value
    
    def execute_IfNode(self, node: IfNode) -> Any:
        condition = self.execute(node.condition)
        
        if condition:
            return self.execute_block(node.then_block)
        
        # Check elif blocks
        for elif_condition, elif_block in node.elif_blocks:
            if self.execute(elif_condition):
                return self.execute_block(elif_block)
        
        # Execute else block
        if node.else_block:
            return self.execute_block(node.else_block)
        
        return None
    
    def execute_WhileNode(self, node: WhileNode) -> Any:
        result = None
        try:
            while self.execute(node.condition):
                try:
                    result = self.execute_block(node.body)
                except ContinueException:
                    continue
        except BreakException:
            pass
        return result
    
    def execute_ForNode(self, node: ForNode) -> Any:
        iterable = self.execute(node.iterable)
        result = None
        
        try:
            for item in iterable:
                self.current_env.set(node.variable, item)
                try:
                    result = self.execute_block(node.body)
                except ContinueException:
                    continue
        except BreakException:
            pass
        
        return result
    
    def execute_FunctionDefNode(self, node: FunctionDefNode) -> Any:
        func = UserFunction(node.name, node.parameters, node.body, self.current_env)
        self.current_env.define(node.name, func)
        return None
    
    def execute_FunctionCallNode(self, node: FunctionCallNode) -> Any:
        func = self.execute(node.function)
        args = [self.execute(arg) for arg in node.arguments]
        
        # Built-in function
        if hasattr(func, '__call__') and not isinstance(func, UserFunction):
            return func(*args)
        
        # User-defined function
        if isinstance(func, UserFunction):
            if len(args) != len(func.parameters):
                raise TypeError(f"{func.name}() takes {len(func.parameters)} arguments but {len(args)} were given")
            
            # Create new environment for function
            func_env = Environment(parent=func.closure)
            
            # Bind parameters
            for param, arg in zip(func.parameters, args):
                func_env.define(param, arg)
            
            # Execute function body
            prev_env = self.current_env
            self.current_env = func_env
            
            try:
                self.execute_block(func.body)
                return None
            except ReturnException as e:
                return e.value
            finally:
                self.current_env = prev_env
        
        # Lambda function
        if isinstance(func, tuple) and len(func) == 2:
            params, body = func
            if len(args) != len(params):
                raise TypeError(f"lambda takes {len(params)} arguments but {len(args)} were given")
            
            lambda_env = Environment(parent=self.current_env)
            for param, arg in zip(params, args):
                lambda_env.define(param, arg)
            
            prev_env = self.current_env
            self.current_env = lambda_env
            try:
                return self.execute(body)
            finally:
                self.current_env = prev_env
        
        raise TypeError(f"'{type(func).__name__}' object is not callable")
    
    def execute_ReturnNode(self, node: ReturnNode):
        value = self.execute(node.value) if node.value else None
        raise ReturnException(value)
    
    def execute_BreakNode(self, node: BreakNode):
        raise BreakException()
    
    def execute_ContinueNode(self, node: ContinueNode):
        raise ContinueException()
    
    def execute_PassNode(self, node: PassNode):
        return None
    
    def execute_ListNode(self, node: ListNode) -> list:
        return [self.execute(elem) for elem in node.elements]
    
    def execute_DictNode(self, node: DictNode) -> dict:
        result = {}
        for key_node, value_node in node.pairs:
            key = self.execute(key_node)
            value = self.execute(value_node)
            result[key] = value
        return result
    
    def execute_IndexNode(self, node: IndexNode) -> Any:
        obj = self.execute(node.object)
        index = self.execute(node.index)
        try:
            return obj[index]
        except (IndexError, KeyError, TypeError) as e:
            raise type(e)(str(e))
    
    def execute_AttributeNode(self, node: AttributeNode) -> Any:
        obj = self.execute(node.object)
        try:
            return getattr(obj, node.attribute)
        except AttributeError:
            raise AttributeError(f"'{type(obj).__name__}' object has no attribute '{node.attribute}'")
    
    def execute_LambdaNode(self, node: LambdaNode) -> tuple:
        """Return lambda as tuple (parameters, body) with closure"""
        return (node.parameters, node.body)
    
    def execute_ClassDefNode(self, node: ClassDefNode) -> Any:
        # Simple class implementation
        class_dict = {}
        
        # Create class environment
        class_env = Environment(parent=self.current_env)
        prev_env = self.current_env
        self.current_env = class_env
        
        try:
            for stmt in node.body:
                self.execute(stmt)
            class_dict = class_env.get_all()
        finally:
            self.current_env = prev_env
        
        # Create simple class object
        self.current_env.define(node.name, class_dict)
        return None
    
    def execute_ImportNode(self, node: ImportNode) -> Any:
        # Simplified import - just return None for now
        # In a full implementation, this would load external modules
        print(f"Note: Import '{node.module}' not fully implemented")
        return None
    
    def execute_TryNode(self, node: TryNode) -> Any:
        result = None
        exception_caught = False
        
        try:
            result = self.execute_block(node.try_block)
        except Exception as e:
            exception_caught = True
            for exc_type, exc_var, exc_block in node.except_blocks:
                # Simple exception matching
                if exc_type is None or type(e).__name__ == exc_type:
                    result = self.execute_block(exc_block)
                    break
            else:
                # No matching except block, re-raise
                raise
        finally:
            if node.finally_block:
                self.execute_block(node.finally_block)
        
        return result
    
    def execute_RaiseNode(self, node: RaiseNode):
        exception = self.execute(node.exception)
        if isinstance(exception, str):
            raise RuntimeError(exception)
        raise exception
    
    def execute_block(self, statements: List[ASTNode]) -> Any:
        """Execute a block of statements"""
        result = None
        for statement in statements:
            result = self.execute(statement)
        return result
    
    def run(self, code: str) -> Any:
        """Run Python code from string"""
        from ..lexer.tokenizer import Tokenizer
        from ..parser.parser import Parser
        
        # Tokenize
        tokenizer = Tokenizer(code)
        tokens = tokenizer.tokenize()
        
        # Parse
        parser = Parser(tokens)
        ast = parser.parse()
        
        # Execute
        return self.execute(ast)