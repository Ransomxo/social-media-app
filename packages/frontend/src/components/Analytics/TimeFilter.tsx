'use client';

import React from 'react';
import { TimeFilter } from '../../types/analytics';

interface TimeFilterProps {
  filters: TimeFilter[];
  selectedFilter: string;
  onFilterChange: (filterId: string) => void;
}

export default function TimeFilter({ filters, selectedFilter, onFilterChange }: TimeFilterProps) {
  return (
    <div className="space-y-2">
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => onFilterChange(filter.id)}
          className={`w-full px-4 py-2 text-left rounded-md transition-all duration-200 ${
            selectedFilter === filter.id
              ? 'bg-purple-900/50 text-white'
              : 'text-gray-300 hover:bg-purple-900/30'
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}
