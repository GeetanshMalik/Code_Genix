"""
AI-powered code suggestion module
Provides intelligent code completion suggestions
"""
from typing import List, Dict

class CodeSuggester:
    """Suggests code completions and improvements"""
    
    def __init__(self):
        self.common_patterns = self._load_patterns()
        self.keywords = [
            'if', 'elif', 'else', 'while', 'for', 'def', 'class',
            'return', 'break', 'continue', 'pass', 'import', 'from',
            'try', 'except', 'finally', 'raise', 'with', 'as',
            'True', 'False', 'None', 'and', 'or', 'not', 'in', 'is'
        ]
        self.builtins = [
            'print', 'len', 'range', 'input', 'int', 'float', 'str',
            'list', 'dict', 'set', 'tuple', 'bool', 'type', 'abs',
            'min', 'max', 'sum', 'sorted', 'reversed', 'enumerate',
            'zip', 'map', 'filter', 'all', 'any', 'open'
        ]
    
    def _load_patterns(self) -> Dict[str, List[str]]:
        """Load common code patterns"""
        return {
            'for ': [
                'for i in range(',
                'for item in ',
                'for key, value in ',
            ],
            'if ': [
                'if __name__ == "__main__":',
                'if condition:',
                'if not ',
            ],
            'def ': [
                'def function_name():',
                'def function_name(param):',
            ],
            'while ': [
                'while True:',
                'while condition:',
            ],
            'import ': [
                'import module',
                'from module import name',
            ],
        }
    
    def suggest_completions(self, partial_code: str) -> List[str]:
        """
        Suggest code completions
        
        Args:
            partial_code: The partial code to complete
            
        Returns:
            List of suggestions
        """
        suggestions = []
        lower_partial = partial_code.lower()
        
        # Check for pattern matches
        for pattern, completions in self.common_patterns.items():
            if lower_partial.endswith(pattern.rstrip()):
                suggestions.extend(completions)
        
        # Check for keyword matches
        if partial_code and not partial_code[-1].isspace():
            last_word = partial_code.split()[-1] if partial_code.split() else ''
            
            # Match keywords
            for keyword in self.keywords:
                if keyword.startswith(last_word):
                    suggestions.append(keyword)
            
            # Match builtins
            for builtin in self.builtins:
                if builtin.startswith(last_word):
                    suggestions.append(f"{builtin}()")
        
        return suggestions[:10]  # Return top 10
    
    def suggest_next_line(self, code: str) -> List[str]:
        """
        Suggest what to write next
        
        Args:
            code: The current code
            
        Returns:
            List of next line suggestions
        """
        suggestions = []
        lines = code.strip().split('\n')
        
        if not lines:
            return ['# Start writing your code']
        
        last_line = lines[-1].strip()
        
        # After function definition
        if last_line.startswith('def ') and last_line.endswith(':'):
            return ['    pass', '    return', '    # Add your code here']
        
        # After if/while/for
        if last_line.endswith(':'):
            return ['    pass', '    # Add your code here']
        
        # After import
        if last_line.startswith('import ') or last_line.startswith('from '):
            return ['# Use the imported module']
        
        return suggestions
    
    def optimize_suggestion(self, code: str) -> List[str]:
        """
        Suggest optimizations
        
        Args:
            code: The code to optimize
            
        Returns:
            List of optimization suggestions
        """
        suggestions = []
        
        # Check for inefficient patterns
        if 'for i in range(len(' in code:
            suggestions.append("Consider using 'enumerate()' instead of 'range(len())'")
        
        if 'while True:' in code and 'break' not in code:
            suggestions.append("Infinite loop detected. Add a 'break' condition.")
        
        # Check for repeated operations
        if code.count('print(') > 5:
            suggestions.append("Consider using a loop for repeated print statements")
        
        return suggestions

# Global suggester instance
_suggester = CodeSuggester()

def suggest_completions(partial_code: str) -> List[str]:
    """Get code completion suggestions"""
    return _suggester.suggest_completions(partial_code)

def suggest_next_line(code: str) -> List[str]:
    """Get next line suggestions"""
    return _suggester.suggest_next_line(code)

def suggest_optimizations(code: str) -> List[str]:
    """Get optimization suggestions"""
    return _suggester.optimize_suggestion(code)