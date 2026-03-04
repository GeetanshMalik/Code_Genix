"""
Built-in functions for the Python interpreter
"""
import sys
from typing import Any, List

class BuiltinFunction:
    """Wrapper for built-in functions"""
    def __init__(self, name: str, func):
        self.name = name
        self.func = func
    
    def __call__(self, *args):
        return self.func(*args)
    
    def __repr__(self):
        return f"<built-in function {self.name}>"

def builtin_print(*args):
    """Print function"""
    print(*args)
    return None

def builtin_len(obj):
    """Length function"""
    if isinstance(obj, (list, str, dict)):
        return len(obj)
    raise TypeError(f"object of type '{type(obj).__name__}' has no len()")

def builtin_range(*args):
    """Range function"""
    if len(args) == 1:
        return list(range(args[0]))
    elif len(args) == 2:
        return list(range(args[0], args[1]))
    elif len(args) == 3:
        return list(range(args[0], args[1], args[2]))
    else:
        raise TypeError(f"range() takes 1 to 3 arguments ({len(args)} given)")

def builtin_input(prompt=""):
    """Input function"""
    return input(prompt)

def builtin_int(value):
    """Convert to integer"""
    return int(value)

def builtin_float(value):
    """Convert to float"""
    return float(value)

def builtin_str(value):
    """Convert to string"""
    return str(value)

def builtin_bool(value):
    """Convert to boolean"""
    return bool(value)

def builtin_type(obj):
    """Get type of object"""
    return type(obj).__name__

def builtin_abs(x):
    """Absolute value"""
    return abs(x)

def builtin_min(*args):
    """Minimum value"""
    if len(args) == 1 and isinstance(args[0], list):
        return min(args[0])
    return min(args)

def builtin_max(*args):
    """Maximum value"""
    if len(args) == 1 and isinstance(args[0], list):
        return max(args[0])
    return max(args)

def builtin_sum(iterable, start=0):
    """Sum of iterable"""
    return sum(iterable, start)

def builtin_sorted(iterable, reverse=False):
    """Return sorted list"""
    return sorted(iterable, reverse=reverse)

def builtin_enumerate(iterable, start=0):
    """Enumerate function"""
    return list(enumerate(iterable, start))

def builtin_zip(*iterables):
    """Zip function"""
    return list(zip(*iterables))

def builtin_map(func, iterable):
    """Map function"""
    return list(map(func, iterable))

def builtin_filter(func, iterable):
    """Filter function"""
    return list(filter(func, iterable))

def builtin_all(iterable):
    """Check if all elements are true"""
    return all(iterable)

def builtin_any(iterable):
    """Check if any element is true"""
    return any(iterable)

def builtin_isinstance(obj, classname):
    """Check instance type"""
    type_map = {
        'int': int,
        'float': float,
        'str': str,
        'bool': bool,
        'list': list,
        'dict': dict,
        'tuple': tuple,
    }
    if classname in type_map:
        return isinstance(obj, type_map[classname])
    return False

def builtin_chr(i):
    """Convert integer to character"""
    return chr(i)

def builtin_ord(c):
    """Convert character to integer"""
    return ord(c)

def builtin_pow(x, y, z=None):
    """Power function"""
    if z is None:
        return pow(x, y)
    return pow(x, y, z)

def builtin_round(number, ndigits=None):
    """Round function"""
    if ndigits is None:
        return round(number)
    return round(number, ndigits)

def builtin_reversed(iterable):
    """Reverse iterable"""
    return list(reversed(iterable))

def builtin_help(obj=None):
    """Help function"""
    if obj is None:
        return "Type help(object) for help about object."
    return f"Help for {obj}: Documentation not available in this interpreter."

def builtin_dir(obj=None):
    """Directory listing"""
    if obj is None:
        return "dir() requires an argument in this interpreter"
    return str(dir(obj))

# Dictionary of all built-in functions
BUILTINS = {
    'print': BuiltinFunction('print', builtin_print),
    'len': BuiltinFunction('len', builtin_len),
    'range': BuiltinFunction('range', builtin_range),
    'input': BuiltinFunction('input', builtin_input),
    'int': BuiltinFunction('int', builtin_int),
    'float': BuiltinFunction('float', builtin_float),
    'str': BuiltinFunction('str', builtin_str),
    'bool': BuiltinFunction('bool', builtin_bool),
    'type': BuiltinFunction('type', builtin_type),
    'abs': BuiltinFunction('abs', builtin_abs),
    'min': BuiltinFunction('min', builtin_min),
    'max': BuiltinFunction('max', builtin_max),
    'sum': BuiltinFunction('sum', builtin_sum),
    'sorted': BuiltinFunction('sorted', builtin_sorted),
    'enumerate': BuiltinFunction('enumerate', builtin_enumerate),
    'zip': BuiltinFunction('zip', builtin_zip),
    'map': BuiltinFunction('map', builtin_map),
    'filter': BuiltinFunction('filter', builtin_filter),
    'all': BuiltinFunction('all', builtin_all),
    'any': BuiltinFunction('any', builtin_any),
    'isinstance': BuiltinFunction('isinstance', builtin_isinstance),
    'chr': BuiltinFunction('chr', builtin_chr),
    'ord': BuiltinFunction('ord', builtin_ord),
    'pow': BuiltinFunction('pow', builtin_pow),
    'round': BuiltinFunction('round', builtin_round),
    'reversed': BuiltinFunction('reversed', builtin_reversed),
    'help': BuiltinFunction('help', builtin_help),
    'dir': BuiltinFunction('dir', builtin_dir),
}

def get_builtins():
    """Get all built-in functions"""
    return BUILTINS.copy()