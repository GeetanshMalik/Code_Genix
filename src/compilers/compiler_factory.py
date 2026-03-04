"""
Compiler Factory - Creates appropriate compiler instances
"""
from .python_compiler import PythonCompiler
from .javascript_compiler import JavaScriptCompiler
from .java_compiler import JavaCompiler
from .cpp_compiler import CppCompiler
from .go_compiler import GoCompiler
from .rust_compiler import RustCompiler
from .php_compiler import PhpCompiler

class CompilerFactory:
    """Factory class to create compiler instances"""
    
    _compilers = {
        'python': PythonCompiler,
        'javascript': JavaScriptCompiler,
        'java': JavaCompiler,
        'cpp': CppCompiler,
        'c': CppCompiler,  # C uses same compiler as C++
        'go': GoCompiler,
        'rust': RustCompiler,
        'php': PhpCompiler,
    }
    
    @classmethod
    def get_compiler(cls, language):
        """Get compiler instance for the specified language"""
        if language not in cls._compilers:
            raise ValueError(f"Unsupported language: {language}")
        
        return cls._compilers[language]()
    
    @classmethod
    def get_supported_languages(cls):
        """Get list of supported languages"""
        return list(cls._compilers.keys())
    
    @classmethod
    def is_supported(cls, language):
        """Check if language is supported"""
        return language in cls._compilers
    
    @classmethod
    def get_language_info(cls):
        """Get detailed information about supported languages"""
        info = {}
        for lang_name, compiler_class in cls._compilers.items():
            compiler = compiler_class()
            info[lang_name] = {
                'name': compiler.language_name,
                'extension': compiler.file_extension,
                'description': f'{compiler.language_name} programming language'
            }
        
        # Add special cases
        info.update({
            'html': {
                'name': 'HTML',
                'extension': '.html',
                'description': 'HyperText Markup Language (validation only)'
            },
            'css': {
                'name': 'CSS',
                'extension': '.css',
                'description': 'Cascading Style Sheets (validation only)'
            },
            'sql': {
                'name': 'SQL',
                'extension': '.sql',
                'description': 'Structured Query Language (syntax validation only)'
            }
        })
        
        return info