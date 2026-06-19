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
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
      const response = await fetch(`${API_URL}/github/compare/${username1}/${username2}/`);
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

          {/* --- LANDING STATE --- */}
          {!combinedData && !loading && !error && !showComparison && (
            <div className="py-12 md:py-20 animate-fade-in">
              <div className="max-w-4xl mx-auto text-center px-4">
                
                {/* Premium Gradient Pill Tag */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 dark:bg-white/5 border border-blue-500/20 dark:border-white/10 text-xs font-semibold text-blue-600 dark:text-blue-400 mb-6 backdrop-blur-md uppercase tracking-wider">
                  <span>✨</span> Analytics & Insights Dashboard
                </div>

                {/* Hero Headline */}
                <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight leading-tight">
                  Unveil Your GitHub Profile <br className="hidden sm:inline" />
                  <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-500 dark:from-white dark:via-gray-200 dark:to-gray-500 bg-clip-text text-transparent">
                    With Premium Metrics
                  </span>
                </h2>

                {/* Description */}
                <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-xl mx-auto mb-10 font-medium">
                  Enter a GitHub username in the field above to pull full activity logs, repository language balances, and interactive contribution heatmaps.
                </p>

                {/* Animated Action Arrow pointing up towards search bar */}
                <div className="flex flex-col items-center justify-center gap-2 mb-16 animate-bounce">
                  <svg 
                    className="w-6 h-6 text-blue-600 dark:text-gray-400" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2.5" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
                  </svg>
                  <span className="text-xs font-bold text-blue-600 dark:text-gray-500 tracking-widest uppercase">
                    Type a username above
                  </span>
                </div>

                {/* Feature Preview Mock Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 relative">
                  {/* Glow Effects Behind Cards */}
                  <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-72 h-32 bg-blue-500/10 dark:bg-blue-500/5 blur-3xl rounded-full"></div>
                  <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-72 h-32 bg-indigo-500/10 dark:bg-white/5 blur-3xl rounded-full"></div>

                  {/* Card 1: Code Insights */}
                  <div className="group bg-white/60 dark:bg-black/30 backdrop-blur-xl border border-gray-200/50 dark:border-white/5 p-6 rounded-2xl shadow-lg hover:shadow-xl dark:hover:border-white/10 transition-all duration-300 text-left flex flex-col justify-between">
                    <div>
                      <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform">📊</div>
                      <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-1.5">Deep Analytics</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                        Track multi-dimensional stats including total stars, forks, and total production-ready repositories.
                      </p>
                    </div>
                  </div>

                  {/* Card 2: Language Distributions */}
                  <div className="group bg-white/60 dark:bg-black/30 backdrop-blur-xl border border-gray-200/50 dark:border-white/5 p-6 rounded-2xl shadow-lg hover:shadow-xl dark:hover:border-white/10 transition-all duration-300 text-left flex flex-col justify-between">
                    <div>
                      <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform">🍩</div>
                      <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-1.5">Language Gaps</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                        Visualize exact byte breakdowns and layout ratios across all active codebases on a sleek donut chart.
                      </p>
                    </div>
                  </div>

                  {/* Card 3: Direct User Comparison */}
                  <div 
                    onClick={() => setShowComparison(true)}
                    className="group bg-white/60 dark:bg-black/30 backdrop-blur-xl border border-gray-200/50 dark:border-white/5 p-6 rounded-2xl shadow-lg hover:shadow-xl dark:hover:border-white/10 transition-all duration-300 text-left flex flex-col justify-between cursor-pointer hover:bg-gray-50/50 dark:hover:bg-white/[0.02]"
                  >
                    <div>
                      <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform">⚔️</div>
                      <h4 className="text-sm font-bold text-gray-900 dark:text-white flex items-center justify-between mb-1.5">
                        User Matchups <span className="text-xs text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform">→</span>
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                        Want to see how two profiles match up? Click here to run clean, side-by-side metric evaluations.
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;