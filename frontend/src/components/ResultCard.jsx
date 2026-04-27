import React from 'react';
import { Zap, Target, BarChart2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const ResultCard = ({ result }) => {
  if (!result) return null;

  // Sort alternatives by score descending
  const chartData = [...result.alternatives].sort((a, b) => b.score - a.score);

  // Strategy specific colors
  const getColor = (strategy) => {
    switch (strategy) {
      case 'Reduce': return '#10b981'; // green-500
      case 'Reuse': return '#3b82f6';  // blue-500
      case 'Repair': return '#f59e0b'; // amber-500
      case 'Recycle': return '#8b5cf6'; // violet-500
      case 'Recover': return '#ef4444'; // red-500
      default: return '#9ca3af';
    }
  };

  return (
    <div className="card h-full flex flex-col">
      <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
        <Target className="text-brand-green w-6 h-6" />
        <h2 className="text-2xl font-bold text-gray-800">Recommendation</h2>
      </div>

      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6 mb-8 border border-emerald-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 text-emerald-100 opacity-50">
          <Zap className="w-32 h-32" />
        </div>
        <div className="relative z-10">
          <p className="text-sm font-semibold text-emerald-600 uppercase tracking-wider mb-1">Optimal Strategy</p>
          <h3 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight" style={{ color: getColor(result.recommended_strategy) }}>
            {result.recommended_strategy}
          </h3>
          <p className="text-gray-700 text-lg leading-relaxed">
            {result.explanation}
          </p>
        </div>
      </div>

      <div className="flex-grow flex flex-col">
        <div className="flex items-center gap-2 mb-4">
          <BarChart2 className="text-gray-400 w-5 h-5" />
          <h4 className="text-lg font-semibold text-gray-700">Strategy Comparison Scores</h4>
        </div>
        
        <div className="flex-grow w-full min-h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <XAxis type="number" domain={[0, 1]} tick={{fill: '#6b7280'}} axisLine={{stroke: '#e5e7eb'}} tickLine={false} />
              <YAxis dataKey="strategy" type="category" tick={{fill: '#4b5563', fontWeight: 500}} axisLine={{stroke: '#e5e7eb'}} tickLine={false} />
              <Tooltip 
                cursor={{fill: '#f3f4f6'}}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                formatter={(value) => [value.toFixed(3), 'Score']}
              />
              <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={32}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getColor(entry.strategy)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;
