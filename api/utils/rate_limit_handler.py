from django.core.cache import cache
from datetime import datetime, timedelta

class RateLimitHandler:
    """Handle rate limiting for the application"""
    
    @staticmethod
    def check_rate_limit(username, limit_per_hour=100):
        """Check if user has exceeded rate limit"""
        cache_key = f"rate_limit:{username}"
        current_time = datetime.now()
        
        # Get existing requests
        requests = cache.get(cache_key, [])
        
        # Clean old requests (older than 1 hour)
        requests = [req_time for req_time in requests 
                   if current_time - req_time < timedelta(hours=1)]
        
        # Check limit
        if len(requests) >= limit_per_hour:
            oldest = min(requests)
            reset_time = oldest + timedelta(hours=1)
            wait_seconds = (reset_time - current_time).total_seconds()
            return False, wait_seconds
        
        # Add current request
        requests.append(current_time)
        cache.set(cache_key, requests, timeout=3600)
        
        return True, 0
    
    @staticmethod
    def get_cache_key(username, data_type):
        """Generate cache key for GitHub data"""
        return f"github:{username}:{data_type}"