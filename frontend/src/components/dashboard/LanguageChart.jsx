import React, { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { getLanguageColor } from '../../utils/formatters';

const LanguageChart = ({ languages, totalBytes }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  // Premium Glassmorphism Empty State
  if (!languages || Object.keys(languages).length === 0) {
    return (
      <div className="bg-white/70 dark:bg-black/40 backdrop-blur-xl border border-gray-200/50 dark:border-white/5 rounded-2xl p-6 shadow-xl dark:shadow-2xl transition-all duration-300 h-fit">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white tracking-wide mb-4">Language Distribution</h3>
        <div className="flex items-center justify-center py-10">
          <p className="text-gray-500 dark:text-gray-400">No language data available</p>
        </div>
      </div>
    );
  }

  const sortedEntries = Object.entries(languages).sort((a, b) => b[1] - a[1]);
  const topLanguages = sortedEntries.slice(0, 9);
  const remainingLanguages = sortedEntries.slice(9);

  const data = topLanguages.map(([name, value]) => ({
    name,
    value,
    color: getLanguageColor(name),
  }));

  if (remainingLanguages.length > 0) {
    const otherValue = remainingLanguages.reduce((sum, [_, val]) => sum + val, 0);
    data.push({
      name: 'Other',
      value: otherValue,
      color: '#475569', 
    });
  }

  // Premium Glassmorphism Tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percentage = ((data.value / totalBytes) * 100).toFixed(1);
      return (
        <div className="bg-white/90 dark:bg-[#0a0a0a]/90 backdrop-blur-md border border-gray-200/50 dark:border-white/10 rounded-xl p-3 shadow-xl z-50">
          <div className="flex items-center gap-2 mb-1">
            <span 
              className="w-3 h-3 rounded-full shadow-sm" 
              style={{ backgroundColor: data.color }}
            ></span>
            <p className="text-gray-900 dark:text-gray-200 text-sm font-bold">{data.name}</p>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-xs font-medium ml-5">
            {data.value.toLocaleString()} bytes <span className="text-gray-400 dark:text-gray-500">({percentage}%)</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    // CHANGED: Removed h-full and flex stretching, added h-fit so it hugs the content
    <div className="bg-white/70 dark:bg-black/40 backdrop-blur-xl border border-gray-200/50 dark:border-white/5 rounded-2xl p-6 shadow-xl dark:shadow-2xl transition-all duration-300 h-fit">
      
      {/* CHANGED: Tightened bottom margin */}
      <h3 className="text-lg font-bold text-gray-900 dark:text-white tracking-wide mb-2">Language Distribution</h3>
      
      {/* CHANGED: Set a fixed height (h-72 = 18rem/288px) to keep the chart compact */}
      <div className="w-full h-72 relative mt-4">
        {/* Optional: Add a very subtle glowing orb behind the chart to make the glass pop */}
        <div className="absolute inset-0 bg-blue-500/5 dark:bg-white/5 blur-3xl rounded-full"></div>
        
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="45%" // slightly adjusted upward to make room for legend
              innerRadius={65}
              outerRadius={85}
              stroke="none"
              dataKey="value"
              onMouseEnter={(_, index) => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  stroke="none" 
                  style={{
                    filter: activeIndex === index ? `drop-shadow(0px 0px 8px ${entry.color}80)` : 'none',
                    transform: activeIndex === index ? 'scale(1.03)' : 'scale(1)',
                    transformOrigin: 'center',
                    transition: 'all 0.3s ease',
                  }}
                  opacity={activeIndex === null || activeIndex === index ? 1 : 0.4}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
              wrapperStyle={{
                paddingTop: '10px',
              }}
              formatter={(value, entry) => (
                <span 
                  className={`text-xs font-medium transition-colors ${
                    activeIndex === null || activeIndex === data.findIndex(d => d.name === value)
                      ? 'text-gray-700 dark:text-gray-300' 
                      : 'text-gray-400 dark:text-gray-600'
                  }`}
                >
                  {value}
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LanguageChart;