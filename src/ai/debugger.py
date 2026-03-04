"""
AI-powered debugging assistant
"""
from typing import List, Dict, Optional

class DebugAssistant:
    """Helps debug code issues"""
    
    def __init__(self):
        self.common_bugs = self._load_common_bugs()
    
    def _load_common_bugs(self) -> Dict[str, Dict]:
        """Load common bug patterns and solutions"""
        return {
            'infinite_loop': {
                'indicators': ['while True:', 'while 1:'],
                'solution': 'Add a break condition or use a counter',
                'example': 'while condition:\n    if exit_condition:\n        break'
            },
            'missing_return': {
                'indicators': ['def ', 'return None'],
                'solution': 'Function might be missing a return statement',
                'example': 'def function():\n    # code\n    return result'
            },
            'off_by_one': {
                'indicators': ['range(len(', '- 1]', '+ 1]'],
                'solution': 'Possible off-by-one error in indexing',
                'example': 'Use range(len(list)) carefully, remember 0-indexing'
            },
            'mutable_default': {
                'indicators': ['def ', '=[]', '={}'],
                'solution': 'Avoid mutable default arguments',
                'example': 'def func(arg=None):\n    if arg is None:\n        arg = []'
            },
        }
    
    def analyze_error(self, error: Exception, code: str, line_num: Optional[int] = None) -> Dict:
        """
        Analyze an error and provide debugging help
        
        Args:
            error: The exception that occurred
            code: The code that caused the error
            line_num: The line number where error occurred
            
        Returns:
            Dictionary with debugging information
        """
        error_type = type(error).__name__
        error_msg = str(error)
        
        analysis = {
            'error_type': error_type,
            'message': error_msg,
            'likely_cause': self._identify_cause(error_type, error_msg),
            'suggestions': self._get_suggestions(error_type, code),
            'related_docs': self._get_docs_link(error_type),
        }
        
        if line_num:
            analysis['problematic_line'] = self._get_line(code, line_num)
        
        return analysis
    
    def _identify_cause(self, error_type: str, message: str) -> str:
        """Identify likely cause of error"""
        causes = {
            'NameError': 'Variable used before definition',
            'TypeError': 'Operation on incompatible types',
            'IndexError': 'Trying to access non-existent index',
            'KeyError': 'Dictionary key does not exist',
            'AttributeError': 'Object does not have the attribute',
            'ValueError': 'Function received wrong value type',
            'ZeroDivisionError': 'Division or modulo by zero',
            'SyntaxError': 'Invalid Python syntax',
            'IndentationError': 'Incorrect indentation',
        }
        return causes.get(error_type, 'Unknown error type')
    
    def _get_suggestions(self, error_type: str, code: str) -> List[str]:
        """Get debugging suggestions"""
        suggestions = []
        
        if error_type == 'NameError':
            suggestions.append("Check if you spelled the variable name correctly")
            suggestions.append("Make sure the variable is defined before use")
            suggestions.append("Check if you're in the right scope")
        
        elif error_type == 'IndexError':
            suggestions.append("Use len() to check list size before accessing")
            suggestions.append("Remember: lists are 0-indexed")
            suggestions.append("Try using .get() for dictionaries")
        
        elif error_type == 'TypeError':
            suggestions.append("Check the types of your variables")
            suggestions.append("Use type() or isinstance() to verify types")
            suggestions.append("Consider type conversion (int(), str(), etc.)")
        
        elif error_type == 'SyntaxError':
            suggestions.append("Check for missing colons, brackets, or quotes")
            suggestions.append("Verify indentation is consistent")
            suggestions.append("Look for unclosed parentheses or brackets")
        
        else:
            suggestions.append(f"Review the {error_type} documentation")
            suggestions.append("Add print() statements to debug")
        
        # Check for common bug patterns
        for bug_type, bug_info in self.common_bugs.items():
            for indicator in bug_info['indicators']:
                if indicator in code:
                    suggestions.append(f"⚠️  {bug_info['solution']}")
                    break
        
        return suggestions
    
    def _get_docs_link(self, error_type: str) -> str:
        """Get documentation link for error type"""
        base_url = "https://docs.python.org/3/library/exceptions.html"
        return f"{base_url}#{error_type}"
    
    def _get_line(self, code: str, line_num: int) -> str:
        """Get specific line from code"""
        lines = code.split('\n')
        if 0 <= line_num - 1 < len(lines):
            return lines[line_num - 1]
        return ""
    
    def suggest_debugging_steps(self, error_type: str) -> List[str]:
        """Suggest step-by-step debugging approach"""
        general_steps = [
            "1. Read the error message carefully",
            "2. Identify the line number where error occurs",
            "3. Check variable values before the error",
            "4. Add print() statements to trace execution",
            "5. Test with simpler inputs",
        ]
        
        specific_steps = {
            'NameError': [
                "• List all variables in current scope",
                "• Check for typos in variable names",
                "• Verify variable is defined before use",
            ],
            'IndexError': [
                "• Print the length of the list",
                "• Print the index you're trying to access",
                "• Check loop range boundaries",
            ],
            'TypeError': [
                "• Print types of all involved variables",
                "• Check function parameter types",
                "• Verify operation compatibility",
            ],
        }
        
        steps = general_steps.copy()
        if error_type in specific_steps:
            steps.extend(specific_steps[error_type])
        
        return steps
    
    def trace_execution(self, code: str) -> List[str]:
        """Suggest where to add debugging traces"""
        traces = []
        lines = code.split('\n')
        
        for i, line in enumerate(lines, 1):
            stripped = line.strip()
            
            # Suggest traces before function calls
            if '(' in stripped and ')' in stripped and not stripped.startswith('#'):
                traces.append(f"Line {i}: Add print before function call")
            
            # Suggest traces in loops
            if stripped.startswith(('for ', 'while ')):
                traces.append(f"Line {i}: Add print inside loop to track iterations")
            
            # Suggest traces after assignments
            if '=' in stripped and not stripped.startswith(('if ', 'elif ', 'while ')):
                traces.append(f"Line {i}: Print variable value after assignment")
        
        return traces[:5]  # Return top 5 suggestions

# Global debugger instance
_debugger = DebugAssistant()

def debug_error(error: Exception, code: str, line_num: Optional[int] = None) -> Dict:
    """Debug an error"""
    return _debugger.analyze_error(error, code, line_num)

def get_debug_steps(error_type: str) -> List[str]:
    """Get debugging steps"""
    return _debugger.suggest_debugging_steps(error_type)

def suggest_traces(code: str) -> List[str]:
    """Suggest where to add debug traces"""
    return _debugger.trace_execution(code)