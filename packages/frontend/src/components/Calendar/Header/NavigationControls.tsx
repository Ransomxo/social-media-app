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
  );
}
