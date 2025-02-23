'use client';

import React from 'react';

interface ViewToggleProps {
  view: 'Month' | 'Week' | 'Day';
  onViewChange: (view: 'Month' | 'Week' | 'Day') => void;
}

export default function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  return (
    <div className="flex rounded-md shadow-sm">
      {(['Month', 'Week', 'Day'] as const).map((viewType) => (
        <button
          key={viewType}
          onClick={() => onViewChange(viewType)}
          className={`relative -ml-px inline-flex items-center px-3 py-2 text-sm font-semibold ${
            view === viewType
              ? 'bg-purple-600 text-white'
              : 'text-gray-300 ring-1 ring-inset ring-gray-700 hover:bg-gray-800'
          } focus:z-10 ${viewType === 'Month' ? 'rounded-l-md' : ''} ${
            viewType === 'Day' ? 'rounded-r-md' : ''
          }`}
        >
          {viewType}
        </button>
      ))}
    </div>
  );
}
