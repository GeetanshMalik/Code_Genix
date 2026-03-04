"""
AST caching module for performance optimization
"""
import hashlib
from typing import Dict, Optional, Any

class ASTCache:
    """Cache for parsed Abstract Syntax Trees"""
    
    def __init__(self, max_size: int = 100):
        self.cache: Dict[str, Any] = {}
        self.max_size = max_size
        self.hits = 0
        self.misses = 0
    
    def _hash_code(self, code: str) -> str:
        """Generate hash for code string"""
        return hashlib.md5(code.encode()).hexdigest()
    
    def get(self, code: str) -> Optional[Any]:
        """Get cached AST for code"""
        key = self._hash_code(code)
        if key in self.cache:
            self.hits += 1
            return self.cache[key]
        self.misses += 1
        return None
    
    def put(self, code: str, ast: Any):
        """Cache an AST"""
        key = self._hash_code(code)
        
        # Simple LRU: remove oldest if at capacity
        if len(self.cache) >= self.max_size:
            oldest_key = next(iter(self.cache))
            del self.cache[oldest_key]
        
        self.cache[key] = ast
    
    def clear(self):
        """Clear the cache"""
        self.cache.clear()
        self.hits = 0
        self.misses = 0
    
    def stats(self) -> Dict[str, int]:
        """Get cache statistics"""
        total = self.hits + self.misses
        hit_rate = (self.hits / total * 100) if total > 0 else 0
        return {
            'hits': self.hits,
            'misses': self.misses,
            'size': len(self.cache),
            'hit_rate': round(hit_rate, 2)
        }

# Global cache instance
_global_cache = ASTCache()

def get_cache() -> ASTCache:
    """Get the global cache instance"""
    return _global_cache