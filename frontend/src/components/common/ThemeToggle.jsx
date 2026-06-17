import React from 'react';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../../context/ThemeContext';

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2.5 rounded-xl bg-white/50 dark:bg-white/5 border border-gray-200/50 dark:border-white/10 hover:border-blue-500/50 dark:hover:border-blue-400/50 transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-blue-500/10 focus:outline-none group"
      aria-label="Toggle theme"
    >
      <div className="transition-transform duration-500 ease-in-out group-hover:rotate-12">
        {isDark ? (
          <SunIcon className="h-5 w-5 text-yellow-500 transition-all duration-300" />
        ) : (
          <MoonIcon className="h-5 w-5 text-indigo-600 transition-all duration-300" />
        )}
      </div>
      
      {/* Subtle shine effect on the button */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-white/20 to-transparent pointer-events-none"></div>
    </button>
  );
};

export default ThemeToggle;