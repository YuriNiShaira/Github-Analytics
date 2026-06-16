from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.cache import cache
from django.db import transaction
from django.utils import timezone
from .models import GitHubProfile, GitHubRepository, LanguageStats
from .serializers import GitHubProfileSerializer
from .services.github_service import GitHubService, GitHubAPIError, RateLimitExceeded
from .utils.rate_limit_handler import RateLimitHandler
import logging

logger = logging.getLogger(__name__)

class GitHubUserAnalyticsView(APIView):
    """API endpoint to fetch GitHub user analytics"""
    
    def __init__(self):
        super().__init__()
        self.github_service = GitHubService()
    
    def get(self, request, username):
        # Check application rate limit
        can_proceed, wait_seconds = RateLimitHandler.check_rate_limit(
            request.META.get('REMOTE_ADDR', 'unknown')
        )
        
        if not can_proceed:
            return Response({
                'error': f'Rate limit exceeded. Please try again in {wait_seconds:.0f} seconds.'
            }, status=status.HTTP_429_TOO_MANY_REQUESTS)
        
        # Try to get from cache first
        cache_key = RateLimitHandler.get_cache_key(username, 'full_profile')
        cached_data = cache.get(cache_key)
        
        if cached_data:
            logger.info(f"Returning cached data for {username}")
            return Response(cached_data)
        
        # Fetch fresh data from GitHub
        try:
            with transaction.atomic():
                data = self._fetch_and_store_user_data(username)
                
                # Cache for 1 hour
                cache.set(cache_key, data, timeout=3600)
                
                return Response(data)
                
        except RateLimitExceeded as e:
            return Response({'error': str(e)}, status=status.HTTP_429_TOO_MANY_REQUESTS)
        except GitHubAPIError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"Unexpected error: {str(e)}")
            return Response({'error': 'Internal server error'}, 
                          status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def _fetch_and_store_user_data(self, username):
        """Fetch GitHub data and store in database"""
        
        # Fetch profile data
        profile_data = self.github_service.get_user_profile(username)
        
        # Update or create profile
        profile, created = GitHubProfile.objects.update_or_create(
            username=username,
            defaults={
                'name': profile_data.get('name'),
                'bio': profile_data.get('bio'),
                'avatar_url': profile_data.get('avatar_url'),
                'location': profile_data.get('location'),
                'company': profile_data.get('company'),
                'blog': profile_data.get('blog'),
                'followers': profile_data.get('followers'),
                'following': profile_data.get('following'),
                'public_repos': profile_data.get('public_repos'),
                'created_at': profile_data.get('created_at'),
                'last_fetched': timezone.now(),
            }
        )
        
        # Fetch repositories
        repos_data = self.github_service.get_user_repos(username)
        
        # Delete old repos and add new ones
        profile.repositories.all().delete()
        
        for repo_data in repos_data:
            GitHubRepository.objects.create(
                profile=profile,
                repo_id=repo_data['id'],
                name=repo_data['name'],
                full_name=repo_data['full_name'],
                description=repo_data.get('description'),
                language=repo_data.get('language'),
                stargazers_count=repo_data.get('stargazers_count', 0),
                forks_count=repo_data.get('forks_count', 0),
                watchers_count=repo_data.get('watchers_count', 0),
                open_issues_count=repo_data.get('open_issues_count', 0),
                size=repo_data.get('size', 0),
                created_at=repo_data.get('created_at'),
                updated_at=repo_data.get('updated_at'),
                pushed_at=repo_data.get('pushed_at'),
                is_fork=repo_data.get('fork', False),
                is_archived=repo_data.get('archived', False),
                html_url=repo_data.get('html_url'),
            )
        
        # Calculate language statistics
        language_bytes = self.github_service.calculate_language_stats(repos_data)
        
        LanguageStats.objects.update_or_create(
            profile=profile,
            defaults={
                'languages': language_bytes,
                'total_bytes': sum(language_bytes.values()),
                'last_calculated': timezone.now(),
            }
        )
        
        # Estimate total commits
        total_commits = self.github_service.estimate_total_commits(username)
        
        # Serialize and return data
        serializer = GitHubProfileSerializer(profile)
        data = serializer.data
        data['total_commits_estimate'] = total_commits
        
        return data