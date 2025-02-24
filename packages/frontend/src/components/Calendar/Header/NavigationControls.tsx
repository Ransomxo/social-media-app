'use client';

import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

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
    <div className="flex items-center space-x-2">
      <button
        onClick={onPrevious}
        className="calendar-nav-button"
        aria-label="Previous"
      >
        <ChevronLeftIcon className="h-5 w-5" />
      </button>
      <button
        onClick={onToday}
        className="calendar-today-button"
      >
        Today
      </button>
      <button
        onClick={onNext}
        className="calendar-nav-button"
        aria-label="Next"
      >
        <ChevronRightIcon className="h-5 w-5" />
      </button>
    </div>
  );
}
