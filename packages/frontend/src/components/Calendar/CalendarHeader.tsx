'use client';

import React from 'react';
import { CalendarHeaderProps } from '../../types/calendar';
import ViewToggle from './Header/ViewToggle';
import NavigationControls from './Header/NavigationControls';

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
      <h1 className="text-2xl font-semibold text-white">{monthYear}</h1>
      <div className="flex items-center space-x-4">
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
