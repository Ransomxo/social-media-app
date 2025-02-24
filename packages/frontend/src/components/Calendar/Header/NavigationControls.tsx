'use client';

import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface NavigationControlsProps {
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
}

export default function NavigationControls({
  onPrevious,
  onNext,
  onToday,
}: NavigationControlsProps) {
  return (
    <div className="flex items-center gap-2">
      <button onClick={onPrevious} className="calendar-nav-button">
        <ChevronLeftIcon className="h-5 w-5" />
      </button>
      <button onClick={onToday} className="calendar-today-button">
        Today
      </button>
      <button onClick={onNext} className="calendar-nav-button">
        <ChevronRightIcon className="h-5 w-5" />
      </button>
    </div>
  );
}
