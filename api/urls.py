from django.urls import path
from .views import GitHubUserAnalyticsView

urlpatterns = [
    path('github/<str:username>/', GitHubUserAnalyticsView.as_view(), name='github-analytics'),
]