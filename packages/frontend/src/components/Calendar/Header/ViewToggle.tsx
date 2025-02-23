'use client';

import React from 'react';

interface ViewToggleProps {
  view: 'Month' | 'Week' | 'Day';
  onViewChange: (view: 'Month' | 'Week' | 'Day') => void;
}

export default function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  return (
    <div className="view-toggle">
      {(['Month', 'Week', 'Day'] as const).map((viewType) => (
        <button
          key={viewType}
          onClick={() => onViewChange(viewType)}
          className={`view-toggle-button ${view === viewType ? 'view-toggle-button-active' : ''} ${
            viewType === 'Month' ? 'rounded-l-lg' : ''
          } ${viewType === 'Day' ? 'rounded-r-lg' : ''}`}
        >
          {viewType}
        </button>
      ))}
    </div>
  );
}
