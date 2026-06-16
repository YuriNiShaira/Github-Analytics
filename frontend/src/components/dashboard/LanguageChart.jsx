import React, { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { getLanguageColor } from '../../utils/formatters';

const LanguageChart = ({ languages, totalBytes }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  if (!languages || Object.keys(languages).length === 0) {
    return (
      <div className="bg-github-card border border-github-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Languages</h3>
        <p className="text-github-muted text-sm">No language data available</p>
      </div>
    );
  }

  // 1. Process data and group remaining small languages into "Other" so the circle closes perfectly
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
      color: '#6e7681',
    });
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percentage = ((data.value / totalBytes) * 100).toFixed(1);
      return (
        <div className="bg-github-card border border-github-border rounded-lg p-3">
          <p className="text-white text-sm font-medium">{data.name}</p>
          <p className="text-github-muted text-xs">
            {data.value.toLocaleString()} bytes ({percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-github-card border border-github-border rounded-lg p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Language Distribution</h3>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              dataKey="value"
              onMouseEnter={(_, index) => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  stroke="#161b22"
                  strokeWidth={2}
                  opacity={activeIndex === null || activeIndex === index ? 1 : 0.5}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
              wrapperStyle={{
                paddingTop: '20px',
                fontSize: '12px',
              }}
              formatter={(value) => (
                <span className="text-github-text text-xs">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LanguageChart;