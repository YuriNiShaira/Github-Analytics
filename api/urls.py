from django.urls import path
from .views import GitHubUserAnalyticsView, GitHubRateLimitView

urlpatterns = [
    path('github/<str:username>/', GitHubUserAnalyticsView.as_view(), name='github-analytics'),
    path('github/rate-limit/', GitHubRateLimitView.as_view(), name='github-rate-limit'),
]