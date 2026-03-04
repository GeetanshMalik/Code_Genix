"""
Code optimization suggestions module
"""
from typing import List, Dict, Tuple

class CodeOptimizer:
    """Analyzes code and suggests optimizations"""
    
    def __init__(self):
        self.optimization_rules = self._load_rules()
    
    def _load_rules(self) -> List[Dict]:
        """Load optimization rules"""
        return [
            {
                'pattern': 'range(len(',
                'suggestion': 'Use enumerate() instead',
                'example': 'for i, item in enumerate(list): instead of for i in range(len(list)):',
                'severity': 'medium'
            },
            {
                'pattern': '+ ""',
                'suggestion': 'Use join() for string concatenation',
                'example': '"".join(strings) instead of s1 + s2 + s3',
                'severity': 'low'
            },
            {
                'pattern': '== True',
                'suggestion': 'Direct boolean check',
                'example': 'if condition: instead of if condition == True:',
                'severity': 'low'
            },
            {
                'pattern': '== False',
                'suggestion': 'Use not',
                'example': 'if not condition: instead of if condition == False:',
                'severity': 'low'
            },
        ]
    
    def analyze(self, code: str) -> List[Dict]:
        """
        Analyze code for optimization opportunities
        
        Args:
            code: The code to analyze
            
        Returns:
            List of optimization suggestions
        """
        suggestions = []
        lines = code.split('\n')
        
        for line_num, line in enumerate(lines, 1):
            line_stripped = line.strip()
            
            # Check each optimization rule
            for rule in self.optimization_rules:
                if rule['pattern'] in line_stripped:
                    suggestions.append({
                        'line': line_num,
                        'code': line_stripped,
                        'suggestion': rule['suggestion'],
                        'example': rule['example'],
                        'severity': rule['severity']
                    })
            
            # Custom checks
            suggestions.extend(self._check_line(line_num, line_stripped))
        
        return suggestions
    
    def _check_line(self, line_num: int, line: str) -> List[Dict]:
        """Check a single line for issues"""
        suggestions = []
        
        # Check for nested loops (performance concern)
        indent_level = (len(line) - len(line.lstrip())) // 4
        if indent_level > 2 and ('for ' in line or 'while ' in line):
            suggestions.append({
                'line': line_num,
                'code': line.strip(),
                'suggestion': 'Deep nesting detected',
                'example': 'Consider refactoring into separate functions',
                'severity': 'medium'
            })
        
        # Check for long lines
        if len(line) > 80:
            suggestions.append({
                'line': line_num,
                'code': line.strip()[:50] + '...',
                'suggestion': 'Line too long',
                'example': 'Break into multiple lines (PEP 8: max 79 chars)',
                'severity': 'low'
            })
        
        return suggestions
    
    def suggest_refactor(self, code: str) -> List[str]:
        """Suggest refactoring opportunities"""
        suggestions = []
        lines = code.split('\n')
        
        # Check for repeated code
        line_counts = {}
        for line in lines:
            stripped = line.strip()
            if stripped and not stripped.startswith('#'):
                line_counts[stripped] = line_counts.get(stripped, 0) + 1
        
        for line, count in line_counts.items():
            if count > 2:
                suggestions.append(f"Line repeated {count} times: '{line[:40]}...' - Consider extracting to a function")
        
        return suggestions
    
    def complexity_score(self, code: str) -> Tuple[int, str]:
        """
        Calculate code complexity score
        
        Returns:
            Tuple of (score, description)
        """
        score = 0
        lines = code.split('\n')
        
        # Count complexity factors
        for line in lines:
            if 'if ' in line or 'elif ' in line:
                score += 1
            if 'for ' in line or 'while ' in line:
                score += 2
            if 'try:' in line:
                score += 1
            if line.count('and') + line.count('or') > 1:
                score += 1
        
        # Classify complexity
        if score <= 5:
            return score, "Low complexity - Easy to understand"
        elif score <= 10:
            return score, "Medium complexity - Manageable"
        elif score <= 15:
            return score, "High complexity - Consider refactoring"
        else:
            return score, "Very high complexity - Needs refactoring"

# Global optimizer instance
_optimizer = CodeOptimizer()

def analyze_code(code: str) -> List[Dict]:
    """Analyze code for optimizations"""
    return _optimizer.analyze(code)

def suggest_refactoring(code: str) -> List[str]:
    """Get refactoring suggestions"""
    return _optimizer.suggest_refactor(code)

def get_complexity(code: str) -> Tuple[int, str]:
    """Get code complexity score"""
    return _optimizer.complexity_score(code)