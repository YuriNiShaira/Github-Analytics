/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Enable class-based dark mode
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        github: {
          dark: '#0d1117',
          card: '#161b22',
          border: '#30363d',
          text: '#c9d1d9',
          muted: '#8b949e',
          accent: '#58a6ff',
          green: '#2ea043',
          orange: '#f0883e',
          purple: '#bc8cff',
        },
        // Light mode colors
        light: {
          bg: '#ffffff',
          card: '#f6f8fa',
          border: '#d0d7de',
          text: '#24292f',
          muted: '#57606a',
        }
      }
    },
  },
  plugins: [],
}