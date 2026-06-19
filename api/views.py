import requests
import logging
import sys
from datetime import timezone as datetime_timezone
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
from datetime import datetime

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
                'error': f'Rate limit exceeded. Please try again in {wait_seconds:.0f} seconds.',
                'retry_after': wait_seconds
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
                result_data = self._fetch_and_store_user_data(username)
                cache.set(cache_key, result_data, timeout=3600)
                return Response(result_data)
                
        except RateLimitExceeded as e:
            return Response({
                'error': str(e),
                'retry_after': 60
            }, status=status.HTTP_429_TOO_MANY_REQUESTS)
            
        except GitHubAPIError as e:
            error_msg = str(e)
            # Check for "Not Found" specifically (case-insensitive)
            if 'not found' in error_msg.lower() or '404' in error_msg:
                return Response({
                    'error': f'User "{username}" not found on GitHub. Please check the username (case-sensitive) and try again.'
                }, status=status.HTTP_404_NOT_FOUND)
            return Response({
                'error': f'GitHub API error: {error_msg}'
            }, status=status.HTTP_400_BAD_REQUEST)
            
        except BrokenPipeError:
            # Client disconnected - return no content
            return Response({}, status=status.HTTP_204_NO_CONTENT)
            
        except Exception as e:
            logger.error(f"Unexpected error for user {username}: {str(e)}")
            return Response({
                'error': 'Something went wrong on our end. Please try again in a moment.'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
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
        
        for repo_data in repos_data:
            GitHubRepository.objects.update_or_create(
                repo_id=repo_data['id'],
                defaults={
                    'profile': profile,
                    'name': repo_data['name'],
                    'full_name': repo_data['full_name'],
                    'description': repo_data.get('description'),
                    'language': repo_data.get('language'),
                    'stargazers_count': repo_data.get('stargazers_count', 0),
                    'forks_count': repo_data.get('forks_count', 0),
                    'watchers_count': repo_data.get('watchers_count', 0),
                    'open_issues_count': repo_data.get('open_issues_count', 0),
                    'size': repo_data.get('size', 0),
                    'created_at': repo_data.get('created_at'),
                    'updated_at': repo_data.get('updated_at'),
                    'pushed_at': repo_data.get('pushed_at'),
                    'is_fork': repo_data.get('fork', False),
                    'is_archived': repo_data.get('archived', False),
                    'html_url': repo_data.get('html_url'),
                }
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
        
        # Get commit data
        commit_data = self.github_service.estimate_total_commits(username)
        commit_activity_data = self.github_service.get_commit_activity(username, week_offset=0)
        activity_timeline = self.github_service.get_activity_timeline(username)
        
        # Handle commit activity data with week info
        if commit_activity_data:
            profile._commit_activity = commit_activity_data.get('activity')
            profile._commit_week_info = commit_activity_data.get('week_range')
        else:
            profile._commit_activity = None
            profile._commit_week_info = None
        
        # Attach data to profile object
        profile._total_commits_estimate = commit_data 
        profile._activity_timeline = activity_timeline
        
        # Serialize and return
        serializer = GitHubProfileSerializer(profile)
        return serializer.data


class GitHubRateLimitView(APIView):
    """Check GitHub API rate limit status"""
    
    def get(self, request):
        try:
            github_service = GitHubService()
            response = requests.get(
                f"{github_service.base_url}/rate_limit",
                headers=github_service.headers
            )
            
            if response.status_code == 200:
                data = response.json()
                core = data.get('resources', {}).get('core', {})
                reset_timestamp = core.get('reset', 0)
                
                return Response({
                    'limit': core.get('limit', 0),
                    'remaining': core.get('remaining', 0),
                    'reset': reset_timestamp,
                    'reset_time': datetime.fromtimestamp(
                        reset_timestamp,
                        tz=datetime_timezone.utc
                    ) if reset_timestamp else None
                })
            
            return Response({'error': 'Failed to fetch rate limit'}, status=status.HTTP_400_BAD_REQUEST)
            
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

class GitHubCompareView(APIView):
    """Compare two GitHub users side-by-side"""
    
    def __init__(self):
        super().__init__()
        self.github_service = GitHubService()
    
    def get(self, request, username1, username2):
        try:
            # Fetch both users
            with transaction.atomic():
                data1 = self._fetch_user_comparison_data(username1)
                data2 = self._fetch_user_comparison_data(username2)
                
                # Calculate comparisons
                comparison = {
                    'followers_diff': data1['followers'] - data2['followers'],
                    'stars_diff': data1['total_stars'] - data2['total_stars'],
                    'repos_diff': data1['public_repos'] - data2['public_repos'],
                    'forks_diff': data1['total_forks'] - data2['total_forks'],
                    'winner': self._determine_winner(data1, data2)
                }
                
                return Response({
                    'user1': data1,
                    'user2': data2,
                    'comparison': comparison
                })
                
        except GitHubAPIError as e:
            error_msg = str(e)
            if 'not found' in error_msg.lower() or '404' in error_msg:
                return Response({
                    'error': f'User "{username1}" or "{username2}" not found on GitHub. Please check the usernames (case-sensitive) and try again.'
                }, status=status.HTTP_404_NOT_FOUND)
            return Response({
                'error': f'GitHub API error: {error_msg}'
            }, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"Comparison error: {str(e)}")
            return Response({
                'error': 'Failed to compare users. Please try again in a moment.'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def _fetch_user_comparison_data(self, username):
        """Fetch data for comparison"""
        profile = self.github_service.get_user_profile(username)
        repos = self.github_service.get_user_repos(username)
        languages = self.github_service.calculate_language_stats(repos)
        
        return {
            'username': username,
            'name': profile.get('name'),
            'avatar_url': profile.get('avatar_url'),
            'bio': profile.get('bio'),
            'location': profile.get('location'),
            'followers': profile.get('followers', 0),
            'following': profile.get('following', 0),
            'public_repos': profile.get('public_repos', 0),
            'total_stars': sum(r['stargazers_count'] for r in repos),
            'total_forks': sum(r['forks_count'] for r in repos),
            'languages': languages,
            'top_repos': sorted(repos, key=lambda x: x['stargazers_count'], reverse=True)[:5]
        }
    
    def _determine_winner(self, data1, data2):
        """Determine which user has more stars and followers"""
        score1 = data1['total_stars'] + data1['followers'] * 10
        score2 = data2['total_stars'] + data2['followers'] * 10
        
        if score1 > score2:
            return data1['username']
        elif score2 > score1:
            return data2['username']
        else:
            return 'tie'
        

class GitHubDebugEventsView(APIView):
    """Debug view to check user events and commit data"""
    
    def get(self, request, username):
        try:
            service = GitHubService()
            
            # Fetch events
            events = service.get_user_events(username, max_pages=3)
            
            # Count event types
            event_types = {}
            for event in events:
                event_type = event.get('type', 'Unknown')
                event_types[event_type] = event_types.get(event_type, 0) + 1
            
            # Count push events and commits
            push_events = [e for e in events if e.get('type') == 'PushEvent']
            total_commits = sum(
                len(e.get('payload', {}).get('commits', []))
                for e in push_events
            )
            
            # Get commit activity and timeline
            commit_activity_data = service.get_commit_activity(username, week_offset=0)
            if commit_activity_data:
                commit_activity = commit_activity_data.get('activity')
                commit_week_info = commit_activity_data.get('week_range')
            else:
                commit_activity = None
                commit_week_info = None
            
            activity_timeline = service.get_activity_timeline(username)
            
            # Get repository count for context
            repos = service.get_user_repos(username, max_pages=1)
            
            return Response({
                'username': username,
                'total_events': len(events),
                'event_types': event_types,
                'push_events': len(push_events),
                'total_commits_from_events': total_commits,
                'repository_count': len(repos) if repos else 0,
                'commit_activity': commit_activity,
                'commit_week_info': commit_week_info,
                'activity_timeline': activity_timeline,
                'sample_events': [
                    {
                        'type': e.get('type'),
                        'created_at': e.get('created_at'),
                        'repo': e.get('repo', {}).get('name'),
                        'commits': len(e.get('payload', {}).get('commits', [])) if e.get('type') == 'PushEvent' else 0
                    }
                    for e in events[:5]
                ]
            })
            
        except GitHubAPIError as e:
            error_msg = str(e)
            if 'not found' in error_msg.lower() or '404' in error_msg:
                return Response({
                    'error': f'User "{username}" not found on GitHub. Please check the username (case-sensitive) and try again.'
                }, status=status.HTTP_404_NOT_FOUND)
            return Response({
                'error': f'GitHub API error: {error_msg}'
            }, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"Debug error for {username}: {str(e)}")
            return Response({
                'error': 'Failed to fetch debug data. Please try again in a moment.'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)