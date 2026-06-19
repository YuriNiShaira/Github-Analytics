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
  const [loadingProgress, setLoadingProgress] = useState(0);
  const dashboardRef = useRef(null);

  const { 
    data: contributionData, 
    loading: contributionLoading,
    error: contributionError 
  } = useQuery(GET_CONTRIBUTIONS, {
    variables: { username: username, days: 30 },
    skip: !username || username.length === 0
  });

  const handleSearch = async (searchUsername) => {
    setUsername(searchUsername);
    setLoadingProgress(0);
    
    // Simulate progress updates during fetch
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 500);
    
    try {
      await fetchData(searchUsername);
      setLoadingProgress(100);
    } catch (err) {
      setLoadingProgress(0);
    } finally {
      clearInterval(progressInterval);
    }
  };

  const combinedData = data ? {
    ...data,
    total_contributions: contributionData?.githubContributions?.totalContributions || 0,
    total_commits: contributionData?.githubContributions?.totalCommits || 0,
    activity_timeline: contributionData?.githubContributions?.dailyActivity || [],
    data_source: contributionData?.githubContributions?.source || 'rest'
  } : null;

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

  // Reset progress when data is loaded
  useEffect(() => {
    if (data) {
      setLoadingProgress(100);
    }
  }, [data]);

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
    <div className="relative min-h-screen text-gray-900 bg-gray-50 dark:text-gray-200 dark:bg-black font-sans transition-colors duration-300">
      
      {/* --- HONEYCOMB BACKGROUND WITH DYNAMIC VIGNETTE --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 honeycomb-bg opacity-100 dark:opacity-90 transition-opacity duration-300"></div>
        {/* Soft shadow in light mode, heavy shadow in dark mode */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.05)_100%)] dark:bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)] transition-colors duration-300"></div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10">
        
        {/* Header - Adapts to Light/Dark Glassmorphism */}
        <header className="border-b border-gray-200/50 dark:border-white/5 bg-white/70 dark:bg-black/40 backdrop-blur-xl sticky top-0 z-20 transition-colors duration-300">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3 tracking-wide transition-colors duration-300">
                <span className="bg-blue-600 dark:bg-white/80 w-2 h-8 rounded-full transition-colors duration-300"></span>
                GitInsight
              </h1>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowComparison(!showComparison)}
                  className="px-4 py-2 text-sm bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-900 dark:hover:bg-white/10 dark:hover:text-white transition-all font-medium shadow-sm dark:shadow-none"
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
          <section className="mb-8 relative z-30">
            <SearchBar onSearch={handleSearch} loading={loading} />
          </section>

          {showComparison && (
            <section className="mb-8 bg-white/70 dark:bg-black/60 backdrop-blur-xl p-6 rounded-2xl border border-gray-200/50 dark:border-white/5 shadow-xl dark:shadow-2xl transition-colors duration-300">
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

          {loading && (
            <div className="space-y-4">
              <LoadingSpinner message="Fetching data from GitHub..." />
              {loadingProgress > 0 && loadingProgress < 100 && (
                <div className="max-w-md mx-auto">
                  <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                    <div 
                      className="bg-blue-600 dark:bg-blue-500 h-2.5 rounded-full transition-all duration-300 ease-out"
                      style={{ width: `${loadingProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">
                    {loadingProgress < 30 && 'Connecting to GitHub...'}
                    {loadingProgress >= 30 && loadingProgress < 60 && 'Fetching user data...'}
                    {loadingProgress >= 60 && loadingProgress < 90 && 'Processing repositories...'}
                    {loadingProgress >= 90 && loadingProgress < 100 && 'Almost done...'}
                  </p>
                </div>
              )}
            </div>
          )}
          
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
              <div className="max-w-md mx-auto bg-white/80 dark:bg-[#0a0a0a]/80 border border-gray-200/50 dark:border-white/5 backdrop-blur-xl p-8 rounded-3xl shadow-xl dark:shadow-2xl transition-colors duration-300">
                <div className="text-5xl mb-6 opacity-80 dark:opacity-70">📊</div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 tracking-wide transition-colors duration-300">
                  Dashboard Ready
                </h2>
                <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">
                  Enter a GitHub username above to view their coding activity,
                  language statistics, and repository insights.
                </p>
                <button
                  onClick={() => setShowComparison(true)}
                  className="mt-8 text-sm text-blue-600 dark:text-gray-400 hover:text-blue-800 dark:hover:text-white transition-colors font-medium tracking-wide uppercase"
                >
                  Compare Users Instead →
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;