'use client';

import React from 'react';
import { CalendarView } from '../../../types/calendar';

interface ViewToggleProps {
  view: CalendarView;
  onViewChange: (view: CalendarView) => void;
}

export default function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  return (
    <div className="flex rounded-lg bg-gray-800/50 p-1">
      {['Month', 'Week', 'Day'].map((option) => (
        <button
          key={option}
          onClick={() => onViewChange(option as CalendarView)}
          className={`relative inline-flex items-center px-4 py-2 text-sm font-medium ${
            view === option
              ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-lg'
              : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
          } transition-all duration-200`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
