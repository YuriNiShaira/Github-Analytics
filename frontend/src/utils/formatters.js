export const formatNumber = (num) => {
  if (!num && num !== 0) return '0';
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const getLanguageColor = (language) => {
  const colors = {
    JavaScript: '#f1e05a',
    Python: '#3572A5',
    Java: '#b07219',
    TypeScript: '#3178c6',
    'C++': '#f34b7d',
    Ruby: '#701516',
    Go: '#00ADD8',
    Rust: '#dea584',
    HTML: '#e34c26',
    CSS: '#563d7c',
    PHP: '#4F5D95',
    Swift: '#ffac45',
    Kotlin: '#A97BFF',
    Dart: '#00B4AB',
    'C#': '#178600',
    'Jupyter Notebook': '#DA5B0B',
    Vue: '#41b883',
    Shell: '#89e051',
    Scala: '#c22d40',
    Lua: '#000080',
    R: '#198CE7',
    Julia: '#a270ba',
  };
  return colors[language] || '#858585';
};

export const getInitials = (name) => {
  if (!name) return '?';
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};