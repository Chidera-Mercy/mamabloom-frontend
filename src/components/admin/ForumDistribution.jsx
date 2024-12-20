import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const ForumDistribution = ({ stats }) => {
  // Transform the data to ensure numbers are parsed correctly
  const formattedData = stats.forumStats.map(category => ({
    name: category.name,
    thread_count: parseInt(category.thread_count, 10),
    value: parseInt(category.thread_count, 10) 
  }));

  // Custom label formatter to show category names and counts
  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, name, value }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return value > 0 ? (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
      >
        {`${name} (${value})`}
      </text>
    ) : null;
  };

  return (
    <div className="bg-pink-300/80 backdrop-blur-sm rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
      <h3 className="font-poppins text-lg font-bold mb-4 text-[#013f40]">Forum Categories Distribution</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={formattedData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              labelLine={false}
              label={renderCustomLabel}
            >
              {formattedData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ForumDistribution;