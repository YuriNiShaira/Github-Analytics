import graphene
from graphene_django import DjangoObjectType
from django.conf import settings
from datetime import datetime, timedelta
import requests
import logging
from api.models import GitHubProfile, GitHubRepository

logger = logging.getLogger(__name__)

class GitHubProfileType(DjangoObjectType):
    class Meta:
        model = GitHubProfile
        fields = ('username', 'name', 'bio', 'avatar_url', 'location', 'followers', 'following', 'public_repos')

class DailyActivityType(graphene.ObjectType):
    date = graphene.String()
    commits = graphene.Int()

class ContributionData(graphene.ObjectType):
    total_contributions = graphene.Int()  # Changed from total_commits
    total_commits = graphene.Int()        # Keep for reference
    daily_activity = graphene.List(DailyActivityType)
    source = graphene.String()

class Query(graphene.ObjectType):
    github_contributions = graphene.Field(
        ContributionData,
        username=graphene.String(required=True),
        days=graphene.Int(default_value=30)
    )
    
    def resolve_github_contributions(root, info, username, days=30):
        """Fetch accurate contribution data from GitHub GraphQL API"""
        
        url = "https://api.github.com/graphql"
        
        today = datetime.utcnow()
        start_of_year = datetime(today.year, 1, 1)
        start_date_30 = today - timedelta(days=days)
        
        # Query to get TOTAL contributions (commits + issues + PRs + reviews)
        query = """
        query($username: String!, $from: DateTime!, $to: DateTime!) {
          user(login: $username) {
            contributionsCollection(from: $from, to: $to) {
              totalCommitContributions
              totalIssueContributions
              totalPullRequestContributions
              totalPullRequestReviewContributions
              totalRepositoryContributions
              contributionCalendar {
                totalContributions
                weeks {
                  contributionDays {
                    date
                    contributionCount
                  }
                }
              }
            }
          }
        }
        """
        
        headers = {
            "Authorization": f"Bearer {settings.GITHUB_TOKEN}",
            "Content-Type": "application/json",
        }
        
        try:
            logger.info(f"Fetching GraphQL data for {username}")
            
            # Get year-to-date data
            variables_ytd = {
                "username": username,
                "from": start_of_year.strftime('%Y-%m-%dT%H:%M:%SZ'),
                "to": today.strftime('%Y-%m-%dT%H:%M:%SZ')
            }
            
            response_ytd = requests.post(url, json={"query": query, "variables": variables_ytd}, headers=headers)
            response_ytd.raise_for_status()
            data_ytd = response_ytd.json()
            
            if 'errors' in data_ytd:
                logger.error(f"GraphQL errors: {data_ytd['errors']}")
                raise Exception(f"GraphQL errors: {data_ytd['errors']}")
            
            user_data = data_ytd.get('data', {}).get('user')
            if not user_data:
                raise Exception(f"User '{username}' not found")
            
            contributions_ytd = user_data.get('contributionsCollection', {})
            calendar_ytd = contributions_ytd.get('contributionCalendar', {})
            
            # Total contributions for 2026 (ALL contributions)
            total_contributions = calendar_ytd.get('totalContributions', 0)
            total_commits = contributions_ytd.get('totalCommitContributions', 0)
            
            # Breakdown for debugging
            logger.info(f"✅ GraphQL: {username} has:")
            logger.info(f"   - Total contributions: {total_contributions}")
            logger.info(f"   - Commits: {total_commits}")
            logger.info(f"   - Issues: {contributions_ytd.get('totalIssueContributions', 0)}")
            logger.info(f"   - PRs: {contributions_ytd.get('totalPullRequestContributions', 0)}")
            logger.info(f"   - PR Reviews: {contributions_ytd.get('totalPullRequestReviewContributions', 0)}")
            
            # Now get last 30 days for daily activity
            variables_30 = {
                "username": username,
                "from": start_date_30.strftime('%Y-%m-%dT%H:%M:%SZ'),
                "to": today.strftime('%Y-%m-%dT%H:%M:%SZ')
            }
            
            response_30 = requests.post(url, json={"query": query, "variables": variables_30}, headers=headers)
            response_30.raise_for_status()
            data_30 = response_30.json()
            
            user_data_30 = data_30.get('data', {}).get('user', {})
            calendar_30 = user_data_30.get('contributionsCollection', {}).get('contributionCalendar', {})
            
            # Build daily activity
            date_map = {}
            for week in calendar_30.get('weeks', []):
                for day in week.get('contributionDays', []):
                    date_map[day.get('date')] = day.get('contributionCount', 0)
            
            daily_activity = []
            for i in range(days):
                date = (today - timedelta(days=i)).strftime('%Y-%m-%d')
                count = date_map.get(date, 0)
                daily_activity.append(DailyActivityType(date=date, commits=count))
            
            return ContributionData(
                total_contributions=total_contributions,  # This should match 703!
                total_commits=total_commits,
                daily_activity=daily_activity,
                source="graphql"
            )
            
        except Exception as e:
            logger.error(f"❌ GraphQL error: {str(e)}")
            return fetch_from_rest_api(username, days)

def fetch_from_rest_api(username, days):
    """Fallback: Use REST API data"""
    try:
        from api.services.github_service import GitHubService
        service = GitHubService()
        timeline = service.get_activity_timeline(username, days)
        
        if not timeline:
            return ContributionData(
                total_contributions=0,
                total_commits=0,
                daily_activity=[],
                source="rest"
            )
        
        total_commits = sum(day['commits'] for day in timeline)
        
        daily_activity = [
            DailyActivityType(date=day['date'], commits=day['commits'])
            for day in timeline
        ]
        
        return ContributionData(
            total_contributions=total_commits,
            total_commits=total_commits,
            daily_activity=daily_activity,
            source="rest"
        )
    except Exception as e:
        logger.error(f"REST fallback error: {e}")
        return ContributionData(
            total_contributions=0,
            total_commits=0,
            daily_activity=[],
            source="none"
        )

schema = graphene.Schema(query=Query)