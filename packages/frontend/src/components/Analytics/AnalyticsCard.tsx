import React from 'react';

interface AnalyticsCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
  };
  icon?: React.ReactNode;
}

export default function AnalyticsCard({ title, value, change, icon }: AnalyticsCardProps) {
  return (
    <div className="p-6 rounded-lg bg-gradient-to-r from-purple-900/90 to-purple-800/90 backdrop-blur-sm shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-200">{title}</h3>
        {icon && <div className="text-purple-400">{icon}</div>}
      </div>
      <div className="flex items-baseline">
        <p className="text-2xl font-semibold text-white">{value}</p>
        {change && (
          <span className={`ml-2 text-sm ${change.type === 'increase' ? 'text-green-400' : 'text-red-400'}`}>
            {change.type === 'increase' ? '+' : '-'}{Math.abs(change.value)}%
          </span>
        )}
      </div>
    </div>
  );
}
