from django.contrib import admin
from .models import GitHubProfile, GitHubRepository, LanguageStats, GitHubCacheLog

@admin.register(GitHubProfile)
class GitHubProfileAdmin(admin.ModelAdmin):
    list_display = ['username', 'name', 'followers', 'public_repos', 'last_fetched']
    search_fields = ['username', 'name']
    list_filter = ['last_fetched']

@admin.register(GitHubRepository)
class GitHubRepositoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'profile', 'language', 'stargazers_count', 'forks_count']
    search_fields = ['name', 'full_name']
    list_filter = ['language', 'is_fork', 'is_archived']

@admin.register(LanguageStats)
class LanguageStatsAdmin(admin.ModelAdmin):
    list_display = ['profile', 'total_bytes', 'last_calculated']

@admin.register(GitHubCacheLog)
class GitHubCacheLogAdmin(admin.ModelAdmin):
    list_display = ['username', 'endpoint', 'status_code', 'rate_limit_remaining', 'created_at']
    list_filter = ['status_code', 'created_at']