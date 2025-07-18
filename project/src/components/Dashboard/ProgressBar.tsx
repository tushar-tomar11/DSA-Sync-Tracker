import React from 'react';

interface ProgressBarProps {
  label: string;
  current: number;
  total: number;
  color?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ 
  label, 
  current, 
  total, 
  color = 'bg-blue-500' 
}) => {
  const percentage = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-900 dark:text-white">{label}</span>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {current}/{total}
        </span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div
          className={`h-2 rounded-full ${color} transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
        {percentage.toFixed(1)}% complete
      </div>
    </div>
  );
};