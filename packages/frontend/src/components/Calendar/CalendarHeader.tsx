'use client';

import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { CalendarHeaderProps } from '../../types/calendar';

export default function CalendarHeader({
  currentDate,
  onPrevious,
  onNext,
  onToday,
  view,
  onViewChange,
}: CalendarHeaderProps) {
  const monthYear = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <div className="flex items-center justify-between p-6 border-b border-gray-800 bg-gray-900">
      <h1 className="text-2xl font-semibold text-white">{monthYear}</h1>
      <div className="flex items-center space-x-4">
        <div className="flex rounded-md shadow-sm">
          <button
            onClick={onPrevious}
            className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-700 hover:bg-gray-800 focus:z-10"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          <button
            onClick={onToday}
            className="relative -ml-px inline-flex items-center px-3 py-2 text-sm font-semibold text-gray-300 ring-1 ring-inset ring-gray-700 hover:bg-gray-800 focus:z-10"
          >
            Today
          </button>
          <button
            onClick={onNext}
            className="relative -ml-px inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-700 hover:bg-gray-800 focus:z-10"
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        </div>
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
      </div>
    </div>
  );
}
