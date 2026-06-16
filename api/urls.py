from django.urls import path
from .views import (
    GitHubUserAnalyticsView, 
    GitHubRateLimitView, 
    GitHubCompareView,
)

urlpatterns = [
    path('github/<str:username>/', GitHubUserAnalyticsView.as_view(), name='github-analytics'),
    path('github/compare/<str:username1>/<str:username2>/', GitHubCompareView.as_view(), name='github-compare'),
    path('github/rate-limit/', GitHubRateLimitView.as_view(), name='github-rate-limit'),
]