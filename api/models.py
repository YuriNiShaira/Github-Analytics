from django.db import models
from django.contrib.postgres.fields import JSONField
from datetime import datetime
from django.contrib.postgres.indexes import GinIndex
from django.utils import timezone

class GitHubProfile(models.Model):
    """Cached GitHub user profile data"""
    username = models.CharField(max_length=100, unique=True, db_index=True)
    name = models.CharField(max_length=200, blank=True, null=True)
    bio = models.TextField(blank=True, null=True)
    avatar_url = models.URLField(max_length=500)
    location = models.CharField(max_length=200, blank=True, null=True)
    company = models.CharField(max_length=200, blank=True, null=True)
    blog = models.URLField(blank=True, null=True)
    followers = models.IntegerField(default=0)
    following = models.IntegerField(default=0)
    public_repos = models.IntegerField(default=0)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField(auto_now=True)
    last_fetched = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-last_fetched']
        indexes = [
            models.Index(fields=['username']),
            models.Index(fields=['last_fetched']),
        ]
    
    def __str__(self):
        return self.username

class GitHubRepository(models.Model):
    """Cached GitHub repository data"""
    profile = models.ForeignKey(GitHubProfile, on_delete=models.CASCADE, related_name='repositories')
    repo_id = models.IntegerField(unique=True)
    name = models.CharField(max_length=200)
    full_name = models.CharField(max_length=300)
    description = models.TextField(blank=True, null=True)
    language = models.CharField(max_length=100, blank=True, null=True)
    stargazers_count = models.IntegerField(default=0)
    forks_count = models.IntegerField(default=0)
    watchers_count = models.IntegerField(default=0)
    open_issues_count = models.IntegerField(default=0)
    size = models.IntegerField(default=0)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()
    pushed_at = models.DateTimeField()
    is_fork = models.BooleanField(default=False)
    is_archived = models.BooleanField(default=False)
    html_url = models.URLField(max_length=500)
    
    class Meta:
        ordering = ['-stargazers_count']
        indexes = [
            models.Index(fields=['profile', '-stargazers_count']),
            models.Index(fields=['language']),
        ]
    
    def __str__(self):
        return self.full_name

class LanguageStats(models.Model):
    """Aggregated language statistics for a user"""
    profile = models.OneToOneField(GitHubProfile, on_delete=models.CASCADE, related_name='language_stats')
    
    languages = models.JSONField(default=dict) 
    
    total_bytes = models.BigIntegerField(default=0)
    last_calculated = models.DateTimeField(auto_now=True)
    
    class Meta:
        indexes = [
            GinIndex(name='lang_stats_gin_idx', fields=['languages']),
        ]
    
    def __str__(self):
        return f"{self.profile.username} - Language Stats"


class GitHubAnalyticsView(models.Model):
    """Database view for aggregated analytics"""
    
    class Meta:
        managed = False 
        db_table = 'github_analytics_view'
        


class GitHubCacheLog(models.Model):
    """Track API calls and rate limits"""
    username = models.CharField(max_length=100)
    endpoint = models.CharField(max_length=200)
    rate_limit_remaining = models.IntegerField()
    rate_limit_reset = models.DateTimeField(default=timezone.now)
    status_code = models.IntegerField()
    response_time = models.FloatField()  # in seconds
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.username} - {self.endpoint} - {self.created_at}"