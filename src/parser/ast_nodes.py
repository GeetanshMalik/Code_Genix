"""
Abstract Syntax Tree (AST) Node Definitions
Represents the structure of parsed Python code
"""
from dataclasses import dataclass
from typing import Any, List, Optional

@dataclass
class ASTNode:
    """Base class for all AST nodes"""
    pass

# Literals
@dataclass
class NumberNode(ASTNode):
    value: float
    line: int = 0
    column: int = 0

@dataclass
class StringNode(ASTNode):
    value: str
    line: int = 0
    column: int = 0

@dataclass
class BooleanNode(ASTNode):
    value: bool
    line: int = 0
    column: int = 0

@dataclass
class NoneNode(ASTNode):
    line: int = 0
    column: int = 0

# Variables
@dataclass
class IdentifierNode(ASTNode):
    name: str
    line: int = 0
    column: int = 0

# Binary Operations
@dataclass
class BinaryOpNode(ASTNode):
    left: ASTNode
    operator: str
    right: ASTNode
    line: int = 0
    column: int = 0

# Unary Operations
@dataclass
class UnaryOpNode(ASTNode):
    operator: str
    operand: ASTNode
    line: int = 0
    column: int = 0

# Assignment
@dataclass
class AssignmentNode(ASTNode):
    target: str
    value: ASTNode
    line: int = 0
    column: int = 0

# Comparison
@dataclass
class ComparisonNode(ASTNode):
    left: ASTNode
    operator: str
    right: ASTNode
    line: int = 0
    column: int = 0

# Logical Operations
@dataclass
class LogicalOpNode(ASTNode):
    left: ASTNode
    operator: str  # 'and', 'or'
    right: ASTNode
    line: int = 0
    column: int = 0

# Control Flow
@dataclass
class IfNode(ASTNode):
    condition: ASTNode
    then_block: List[ASTNode]
    elif_blocks: List[tuple] = None  # [(condition, block), ...]
    else_block: Optional[List[ASTNode]] = None
    line: int = 0
    column: int = 0

@dataclass
class WhileNode(ASTNode):
    condition: ASTNode
    body: List[ASTNode]
    line: int = 0
    column: int = 0

@dataclass
class ForNode(ASTNode):
    variable: str
    iterable: ASTNode
    body: List[ASTNode]
    line: int = 0
    column: int = 0

# Function Definition
@dataclass
class FunctionDefNode(ASTNode):
    name: str
    parameters: List[str]
    body: List[ASTNode]
    defaults: List[ASTNode] = None
    line: int = 0
    column: int = 0

# Function Call
@dataclass
class FunctionCallNode(ASTNode):
    function: ASTNode
    arguments: List[ASTNode]
    line: int = 0
    column: int = 0

# Return Statement
@dataclass
class ReturnNode(ASTNode):
    value: Optional[ASTNode] = None
    line: int = 0
    column: int = 0

# Break and Continue
@dataclass
class BreakNode(ASTNode):
    line: int = 0
    column: int = 0

@dataclass
class ContinueNode(ASTNode):
    line: int = 0
    column: int = 0

# Pass Statement
@dataclass
class PassNode(ASTNode):
    line: int = 0
    column: int = 0

# Lists
@dataclass
class ListNode(ASTNode):
    elements: List[ASTNode]
    line: int = 0
    column: int = 0

# Dictionaries
@dataclass
class DictNode(ASTNode):
    pairs: List[tuple]  # [(key, value), ...]
    line: int = 0
    column: int = 0

# Index/Subscript
@dataclass
class IndexNode(ASTNode):
    object: ASTNode
    index: ASTNode
    line: int = 0
    column: int = 0

# Attribute Access
@dataclass
class AttributeNode(ASTNode):
    object: ASTNode
    attribute: str
    line: int = 0
    column: int = 0

# Class Definition
@dataclass
class ClassDefNode(ASTNode):
    name: str
    bases: List[str]
    body: List[ASTNode]
    line: int = 0
    column: int = 0

# Import Statement
@dataclass
class ImportNode(ASTNode):
    module: str
    alias: Optional[str] = None
    line: int = 0
    column: int = 0

# Try-Except
@dataclass
class TryNode(ASTNode):
    try_block: List[ASTNode]
    except_blocks: List[tuple]  # [(exception_type, variable, block), ...]
    finally_block: Optional[List[ASTNode]] = None
    line: int = 0
    column: int = 0

# Raise Statement
@dataclass
class RaiseNode(ASTNode):
    exception: ASTNode
    line: int = 0
    column: int = 0

# Lambda
@dataclass
class LambdaNode(ASTNode):
    parameters: List[str]
    body: ASTNode
    line: int = 0
    column: int = 0

# Program (root node)
@dataclass
class ProgramNode(ASTNode):
    statements: List[ASTNode]
    line: int = 0
    column: int = 0