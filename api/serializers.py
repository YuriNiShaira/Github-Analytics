from rest_framework import serializers
from .models import GitHubProfile, GitHubRepository, LanguageStats

class RepositorySerializer(serializers.ModelSerializer):
    class Meta:
        model = GitHubRepository
        fields = [
            'name', 'full_name', 'description', 'language',
            'stargazers_count', 'forks_count', 'watchers_count',
            'open_issues_count', 'html_url', 'created_at', 'updated_at'
        ]

class LanguageStatsSerializer(serializers.ModelSerializer):
    class Meta:
        model = LanguageStats
        fields = ['languages', 'total_bytes', 'last_calculated']

class GitHubProfileSerializer(serializers.ModelSerializer):
    repositories = RepositorySerializer(many=True, read_only=True)
    language_stats = LanguageStatsSerializer(read_only=True)
    commit_activity = serializers.SerializerMethodField()
    
    total_stars = serializers.SerializerMethodField()
    total_forks = serializers.SerializerMethodField()
    total_commits_estimate = serializers.SerializerMethodField()
    
    class Meta:
        model = GitHubProfile
        fields = [
            'username', 'name', 'bio', 'avatar_url', 'location',
            'company', 'blog', 'followers', 'following', 'public_repos',
            'created_at', 'repositories', 'language_stats',
            'total_stars', 'total_forks', 'total_commits_estimate',
            'commit_activity'
        ]
    
    def get_total_stars(self, obj):
        return sum(repo.stargazers_count for repo in obj.repositories.all())
    
    def get_total_forks(self, obj):
        return sum(repo.forks_count for repo in obj.repositories.all())
    
    def get_total_commits_estimate(self, obj):
        return getattr(obj, 'total_commits_estimate', None)
    
    def get_commit_activity(self, obj):
        return getattr(obj, 'commit_activity', None)