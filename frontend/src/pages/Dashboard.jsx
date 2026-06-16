import React, { useRef, useState } from 'react';
import { useGithubData } from '../hooks/useGithubData';
import SearchBar from '../components/SearchBar';
import ProfileCard from '../components/dashboard/ProfileCard';
import StatsSummary from '../components/dashboard/StatsSummary';
import LanguageChart from '../components/dashboard/LanguageChart';
import RepositoriesTable from '../components/dashboard/RepositoriesTable';
import CommitHeatmap from '../components/dashboard/CommitHeatmap';
import StarHistory from '../components/dashboard/StarHistory';
import ActivityTimeline from '../components/dashboard/ActivityTimeline';
import UserComparison from '../components/dashboard/UserComparison';
import ComparisonSearch from '../components/ComparisonSearch';
import ExportButton from '../components/common/ExportButton';
import ThemeToggle from '../components/common/ThemeToggle';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import { fetchGithubUser } from '../api/github';

const Dashboard = () => {
  const { data, loading, error, fetchData } = useGithubData();
  const [comparisonData, setComparisonData] = useState(null);
  const [comparisonLoading, setComparisonLoading] = useState(false);
  const [comparisonError, setComparisonError] = useState(null);
  const [showComparison, setShowComparison] = useState(false);
  const dashboardRef = useRef(null);

  const handleSearch = (username) => {
    fetchData(username);
    setShowComparison(false);
  };

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
    <div className="min-h-screen bg-slate-50 dark:bg-github-dark text-slate-700 dark:text-github-text transition-colors duration-300">
      <header className="border-b border-gray-200 dark:border-github-border bg-white/80 dark:bg-github-card/50 backdrop-blur sticky top-0 z-10 transition-colors duration-300 shadow-sm dark:shadow-none">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <span className="bg-blue-600 dark:bg-github-accent w-2 h-8 rounded-full"></span>
              GitHub Analytics
            </h1>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowComparison(!showComparison)}
                className="px-3 py-1.5 text-sm font-medium bg-gray-100 dark:bg-github-border text-gray-700 dark:text-github-text border border-gray-200 dark:border-transparent rounded-md hover:bg-gray-200 dark:hover:bg-github-border/70 transition-colors"
              >
                {showComparison ? 'Hide Comparison' : 'Compare Users'}
              </button>
              {data && !loading && <ExportButton targetRef={dashboardRef} />}
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
        {error && <ErrorMessage message={error} onRetry={() => handleSearch(data?.username || '')} />}

        {data && !loading && !error && (
          <div ref={dashboardRef} className="space-y-6">
            <ProfileCard profile={data} />
            <StatsSummary stats={{
              total_stars: data.total_stars,
              total_forks: data.total_forks,
              total_repos: data.public_repos,
              total_commits_estimate: data.total_commits_estimate,
            }} />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CommitHeatmap activity={data.commit_activity} />
              <StarHistory repositories={data.repositories || []} />
            </div>

            <ActivityTimeline data={data.activity_timeline} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <LanguageChart 
                  languages={data.language_stats?.languages || {}}
                  totalBytes={data.language_stats?.total_bytes || 0}
                />
              </div>
              <div className="lg:col-span-2">
                <RepositoriesTable repositories={data.repositories || []} />
              </div>
            </div>
          </div>
        )}

        {!data && !loading && !error && !showComparison && (
          <div className="text-center py-20 bg-white dark:bg-github-card border border-gray-200 dark:border-github-border rounded-xl shadow-sm max-w-2xl mx-auto">
            <div className="max-w-md mx-auto px-4">
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
                className="mt-4 text-blue-600 dark:text-github-accent hover:underline font-medium text-sm transition-colors"
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