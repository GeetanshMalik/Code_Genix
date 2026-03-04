"""
Environment - Manages variable scopes and namespaces
"""
from typing import Any, Dict, Optional

class Environment:
    """Represents a variable scope with support for nested scopes"""
    
    def __init__(self, parent: Optional['Environment'] = None):
        self.parent = parent
        self.variables: Dict[str, Any] = {}
    
    def define(self, name: str, value: Any):
        """Define a variable in the current scope"""
        self.variables[name] = value
    
    def get(self, name: str) -> Any:
        """Get a variable value, searching parent scopes if needed"""
        if name in self.variables:
            return self.variables[name]
        
        if self.parent:
            return self.parent.get(name)
        
        raise NameError(f"Name '{name}' is not defined")
    
    def set(self, name: str, value: Any):
        """Set a variable value, searching parent scopes if needed"""
        if name in self.variables:
            self.variables[name] = value
        elif self.parent:
            self.parent.set(name, value)
        else:
            # If not found anywhere, define in current scope
            self.variables[name] = value
    
    def exists(self, name: str) -> bool:
        """Check if a variable exists in current or parent scopes"""
        if name in self.variables:
            return True
        if self.parent:
            return self.parent.exists(name)
        return False
    
    def get_all(self) -> Dict[str, Any]:
        """Get all variables in current scope"""
        return self.variables.copy()
    
    def __repr__(self):
        return f"Environment({list(self.variables.keys())})"