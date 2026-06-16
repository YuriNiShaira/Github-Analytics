import React from 'react';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../../context/ThemeContext';

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-md bg-github-card hover:bg-github-border transition-colors"
      aria-label="Toggle theme"
    >
      {isDark ? (
        <SunIcon className="h-5 w-5 text-github-text" />
      ) : (
        <MoonIcon className="h-5 w-5 text-github-text" />
      )}
    </button>
  );
};

export default ThemeToggle;