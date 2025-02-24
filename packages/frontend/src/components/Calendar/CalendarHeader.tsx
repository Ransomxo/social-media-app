'use client';

import React from 'react';
import { CalendarHeaderProps } from '../../types/calendar';
import ViewToggle from '../Calendar/Header/ViewToggle';
import NavigationControls from '../Calendar/Header/NavigationControls';

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
    <div className="flex items-center justify-between p-6 border-b border-gray-800 bg-gray-900/90 backdrop-blur-sm">
      <h1 className="text-2xl font-semibold text-white bg-gradient-to-r from-purple-500 to-purple-300 bg-clip-text text-transparent">
        {monthYear}
      </h1>
      <div className="flex items-center space-x-6">
        <NavigationControls
          onPrevious={onPrevious}
          onNext={onNext}
          onToday={onToday}
        />
        <ViewToggle view={view} onViewChange={onViewChange} />
      </div>
    </div>
  );
}
