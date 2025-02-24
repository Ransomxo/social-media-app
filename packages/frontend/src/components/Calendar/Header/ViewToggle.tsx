'use client';

import React from 'react';

import { CalendarView } from '../../../types/calendar';

interface ViewToggleProps {
  view: CalendarView;
  onViewChange: (view: CalendarView) => void;
}

export default function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  return (
    <div className="view-toggle">
      {(['month', 'week', 'day'] as const).map((viewType) => (
        <button
          key={viewType}
          onClick={() => onViewChange(viewType)}
          className={`view-toggle-button ${view === viewType ? 'view-toggle-button-active' : ''} ${
            viewType === 'month' ? 'rounded-l-lg' : ''
          } ${viewType === 'day' ? 'rounded-r-lg' : ''}`}
        >
          {viewType.charAt(0).toUpperCase() + viewType.slice(1)}
        </button>
      ))}
    </div>
  );
}
