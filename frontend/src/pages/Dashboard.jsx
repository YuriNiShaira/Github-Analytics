import React from 'react';
import { useGithubData } from '../hooks/useGithubData';
import SearchBar from '../components/SearchBar';
import ProfileCard from '../components/dashboard/ProfileCard';
import StatsSummary from '../components/dashboard/StatsSummary';
import LanguageChart from '../components/dashboard/LanguageChart';
import RepositoriesTable from '../components/dashboard/RepositoriesTable';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

const Dashboard = () => {
  const { data, loading, error, fetchData } = useGithubData();

  const handleSearch = (username) => {
    fetchData(username);
  };

  return (
    <div className="min-h-screen bg-github-dark text-github-text">
      {/* Header */}
      <header className="border-b border-github-border bg-github-card/50 backdrop-blur sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <span className="bg-github-accent w-2 h-8 rounded-full"></span>
              GitHub Analytics
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Search Section */}
        <section className="mb-8">
          <SearchBar onSearch={handleSearch} loading={loading} />
        </section>

        {/* Results Section */}
        {loading && (
          <LoadingSpinner message="Fetching data from GitHub..." />
        )}

        {error && (
          <ErrorMessage message={error} onRetry={() => handleSearch(data?.username || '')} />
        )}

        {data && !loading && !error && (
          <div className="space-y-6">
            {/* Profile */}
            <section>
              <ProfileCard profile={data} />
            </section>

            {/* Stats Summary */}
            <section>
              <StatsSummary stats={{
                total_stars: data.total_stars,
                total_forks: data.total_forks,
                total_repos: data.public_repos,
                total_commits_estimate: data.total_commits_estimate,
              }} />
            </section>

            {/* Charts and Tables */}
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

        {/* Empty State */}
        {!data && !loading && !error && (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <div className="text-6xl mb-6">📊</div>
              <h2 className="text-2xl font-bold text-white mb-2">
                GitHub Analytics Dashboard
              </h2>
              <p className="text-github-muted">
                Enter a GitHub username above to view their coding activity,
                language statistics, and repository insights.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;