import React, { useRef, useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_CONTRIBUTIONS } from '../graphql/client';  
import { useGithubData } from '../hooks/useGithubData';
import SearchBar from '../components/SearchBar';
import ProfileCard from '../components/dashboard/ProfileCard';
import StatsSummary from '../components/dashboard/StatsSummary';
import LanguageChart from '../components/dashboard/LanguageChart';
import RepositoriesTable from '../components/dashboard/RepositoriesTable';
import CommitHeatmap from '../components/dashboard/CommitHeatmap';
import StarHistory from '../components/dashboard/StarHistory';
import ActivityTimeline from '../components/dashboard/ActivityTimeline';
import ExportButton from '../components/common/ExportButton';
import ThemeToggle from '../components/common/ThemeToggle';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import ComparisonSearch from '../components/ComparisonSearch';
import UserComparison from '../components/dashboard/UserComparison';

const Dashboard = () => {
  const { data, loading, error, fetchData } = useGithubData();
  const [username, setUsername] = useState('');
  const [showComparison, setShowComparison] = useState(false);
  const [comparisonData, setComparisonData] = useState(null);
  const [comparisonLoading, setComparisonLoading] = useState(false);
  const [comparisonError, setComparisonError] = useState(null);
  const dashboardRef = useRef(null);

  // GraphQL query for accurate contribution data
  const { 
    data: contributionData, 
    loading: contributionLoading,
    error: contributionError 
  } = useQuery(GET_CONTRIBUTIONS, {
    variables: {
      username: username,
      days: 30
    },
    skip: !username || username.length === 0
  });

  const handleSearch = (searchUsername) => {
    setUsername(searchUsername);
    fetchData(searchUsername);
  };

  // Combine REST and GraphQL data
  const combinedData = data ? {
    ...data,
    total_contributions: contributionData?.githubContributions?.totalContributions || 0,
    total_commits: contributionData?.githubContributions?.totalCommits || 0,
    activity_timeline: contributionData?.githubContributions?.dailyActivity || [],
    data_source: contributionData?.githubContributions?.source || 'rest'
  } : null;

  // Log combined data for debugging
  useEffect(() => {
    if (combinedData) {
      console.log('Combined Data:', {
        total_contributions: combinedData.total_contributions,
        total_commits: combinedData.total_commits,
        data_source: combinedData.data_source,
        activity_timeline_length: combinedData.activity_timeline?.length
      });
    }
  }, [combinedData]);

  const handleCompare = async (username1, username2) => {
    setComparisonLoading(true);
    setComparisonError(null);
    try {
      const response = await fetch(`http://localhost:8000/api/github/compare/${username1}/${username2}/`);
      const data = await response.json();
      if (response.ok) {
        setComparisonData(data);
        setShowComparison(true);
      } else {
        setComparisonError(data.error || 'Failed to compare users');
      }
    } catch (err) {
      setComparisonError('Failed to fetch comparison data');
    } finally {
      setComparisonLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-github-dark text-gray-900 dark:text-github-text transition-colors duration-300">
      <header className="border-b border-gray-200 dark:border-github-border bg-white/50 dark:bg-github-card/50 backdrop-blur sticky top-0 z-10 transition-colors duration-300">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <span className="bg-blue-600 dark:bg-github-accent w-2 h-8 rounded-full"></span>
              GitHub Analytics
            </h1>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowComparison(!showComparison)}
                className="px-3 py-1.5 text-sm bg-gray-200 dark:bg-github-border text-gray-700 dark:text-github-text rounded-md hover:bg-gray-300 dark:hover:bg-github-border/70 transition-colors"
              >
                {showComparison ? 'Hide Comparison' : 'Compare Users'}
              </button>
              {combinedData && !loading && <ExportButton targetRef={dashboardRef} />}
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <section className="mb-8">
          <SearchBar onSearch={handleSearch} loading={loading} />
        </section>

        {showComparison && (
          <section className="mb-8">
            <ComparisonSearch onCompare={handleCompare} loading={comparisonLoading} />
            <div className="mt-4">
              <UserComparison 
                user1={comparisonData?.user1}
                user2={comparisonData?.user2}
                comparison={comparisonData?.comparison}
                loading={comparisonLoading}
                error={comparisonError}
              />
            </div>
          </section>
        )}

        {loading && <LoadingSpinner message="Fetching data from GitHub..." />}
        {error && <ErrorMessage message={error} onRetry={() => handleSearch(username)} />}

        {combinedData && !loading && !error && (
          <div ref={dashboardRef} className="space-y-6">
            <ProfileCard profile={combinedData} />
            
            <StatsSummary stats={{
              total_stars: combinedData.total_stars,
              total_forks: combinedData.total_forks,
              total_repos: combinedData.public_repos,
              total_contributions: combinedData.total_contributions,  
              total_commits: combinedData.total_commits,              
              data_source: combinedData.data_source,                  
            }} />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CommitHeatmap activity={combinedData.commit_activity} />
              <StarHistory repositories={combinedData.repositories || []} />
            </div>

            <ActivityTimeline 
              data={combinedData.activity_timeline} 
              source={combinedData.data_source}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <LanguageChart 
                  languages={combinedData.language_stats?.languages || {}}
                  totalBytes={combinedData.language_stats?.total_bytes || 0}
                />
              </div>
              <div className="lg:col-span-2">
                <RepositoriesTable repositories={combinedData.repositories || []} />
              </div>
            </div>
          </div>
        )}

        {!combinedData && !loading && !error && !showComparison && (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <div className="text-6xl mb-6">📊</div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                GitHub Analytics Dashboard
              </h2>
              <p className="text-gray-500 dark:text-github-muted">
                Enter a GitHub username above to view their coding activity,
                language statistics, and repository insights.
              </p>
              <button
                onClick={() => setShowComparison(true)}
                className="mt-4 text-blue-600 dark:text-github-accent hover:underline"
              >
                Or compare two users →
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;