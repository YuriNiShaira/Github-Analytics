import requests
import time
from datetime import datetime, timedelta, timezone as datetime_timezone
from django.core.cache import cache
from django.conf import settings
from django.utils import timezone
from django.db import transaction
from ..models import GitHubProfile, GitHubRepository, LanguageStats, GitHubCacheLog

# Exception classes
class GitHubAPIError(Exception):
    """Custom exception for GitHub API errors"""
    pass

class RateLimitExceeded(Exception):
    """Raised when rate limit is exceeded"""
    pass

class GitHubService:
    def __init__(self):
        self.base_url = settings.GITHUB_API_URL
        self.headers = {
            'Accept': 'application/vnd.github.v3+json',
        }
        if settings.GITHUB_TOKEN:
            self.headers['Authorization'] = f'token {settings.GITHUB_TOKEN}'
            self.rate_limit_per_hour = 5000
        else:
            self.rate_limit_per_hour = 60
    
    def _make_request(self, endpoint, params=None, retries=3, delay=2):
        """Make a request to GitHub API with retry logic"""
        url = f"{self.base_url}/{endpoint.lstrip('/')}"
        start_time = time.time()
        
        for attempt in range(retries):
            try:
                response = requests.get(url, headers=self.headers, params=params, timeout=30)
                response_time = time.time() - start_time
                
                # Convert to timezone-aware datetime
                rate_limit_reset_ts = int(response.headers.get('X-RateLimit-Reset', 0))
                if rate_limit_reset_ts:
                    rate_limit_reset = datetime.fromtimestamp(
                        rate_limit_reset_ts,
                        tz=datetime_timezone.utc
                    )
                else:
                    rate_limit_reset = timezone.now()
                
                # Log API call
                GitHubCacheLog.objects.create(
                    username=params.get('username', 'unknown') if params else 'unknown',
                    endpoint=endpoint,
                    rate_limit_remaining=int(response.headers.get('X-RateLimit-Remaining', 0)),
                    rate_limit_reset=rate_limit_reset,
                    status_code=response.status_code,
                    response_time=response_time
                )
                
                # Handle rate limiting
                if response.status_code == 403 and 'rate limit' in response.text.lower():
                    reset_time = datetime.fromtimestamp(
                        int(response.headers.get('X-RateLimit-Reset', 0)),
                        tz=datetime_timezone.utc
                    )
                    wait_seconds = (reset_time - timezone.now()).total_seconds()
                    
                    # If we have retries left and wait time is reasonable, wait and retry
                    if attempt < retries - 1 and wait_seconds < 30:
                        time.sleep(min(delay * (attempt + 1), wait_seconds + 1))
                        continue
                    
                    raise RateLimitExceeded(
                        f"Rate limit exceeded. Reset at {reset_time}. Wait {wait_seconds:.0f} seconds."
                    )
                
                response.raise_for_status()
                return response.json()
                
            except requests.exceptions.Timeout:
                if attempt < retries - 1:
                    time.sleep(delay * (attempt + 1))
                    continue
                raise GitHubAPIError(f"Request timed out after {retries} attempts")
                
            except requests.exceptions.RequestException as e:
                if attempt < retries - 1:
                    time.sleep(delay * (attempt + 1))
                    continue
                raise GitHubAPIError(f"GitHub API request failed: {str(e)}")
        
        raise GitHubAPIError(f"Failed after {retries} attempts")
    
    def _paginate(self, endpoint, per_page=100, max_pages=None):
        """Handle GitHub API pagination"""
        page = 1
        all_data = []
        
        while True:
            params = {'per_page': per_page, 'page': page}
            data = self._make_request(endpoint, params)
            
            if not data:
                break
                
            all_data.extend(data)
            page += 1
            
            # Check if we've reached max pages
            if max_pages and page > max_pages:
                break
                
            # If we got less than per_page, we're at the end
            if len(data) < per_page:
                break
        
        return all_data
    
    def get_user_profile(self, username):
        """Fetch GitHub user profile"""
        return self._make_request(f'/users/{username}')
    
    def get_user_repos(self, username, max_pages=None):
        """Fetch all repositories for a user"""
        return self._paginate(f'/users/{username}/repos', max_pages=max_pages)
    
    def get_repo_languages(self, owner, repo):
        """Fetch language breakdown for a specific repo"""
        return self._make_request(f'/repos/{owner}/{repo}/languages')
    
    def get_user_events(self, username, max_pages=5):
        """Fetch user events (for commit estimation)"""
        return self._paginate(f'/users/{username}/events', max_pages=max_pages)
    
    def calculate_language_stats(self, repos_data):
        """Calculate aggregated language stats across all repos"""
        language_bytes = {}
        
        for repo in repos_data:
            # Skip forks if you want, or include them - your choice
            if repo.get('fork'):
                continue
                
            owner = repo['owner']['login']
            repo_name = repo['name']
            
            # Fetch languages for this repo
            try:
                languages = self.get_repo_languages(owner, repo_name)
                for lang, bytes_count in languages.items():
                    language_bytes[lang] = language_bytes.get(lang, 0) + bytes_count
            except GitHubAPIError:
                # Skip repos we can't fetch languages for
                continue
        
        return language_bytes
    
    def estimate_total_commits(self, username):
        """
        Estimate total commits by analyzing push events
        Note: This is an approximation since GitHub API limits this
        """
        try:
            events = self.get_user_events(username, max_pages=3)
            push_events = [e for e in events if e['type'] == 'PushEvent']
            
            # Count commits from push events
            total_commits = sum(
                len(event['payload']['commits']) 
                for event in push_events 
                if 'commits' in event['payload']
            )
            
            return total_commits
        except GitHubAPIError:
            return None