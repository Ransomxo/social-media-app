'use client';

import React from 'react';
import { PlatformFilter } from '../../types/analytics';

interface PlatformFilterProps {
  platforms: PlatformFilter[];
  onTogglePlatform: (platformId: string) => void;
}

export default function PlatformFilter({ platforms, onTogglePlatform }: PlatformFilterProps) {
  return (
    <div className="space-y-2">
      {platforms.map((platform) => (
        <button
          key={platform.id}
          onClick={() => onTogglePlatform(platform.id)}
          className={`w-full px-4 py-2 flex items-center space-x-3 rounded-md transition-all duration-200 ${
            platform.enabled
              ? 'bg-purple-900/50 text-white'
              : 'text-gray-300 hover:bg-purple-900/30'
          }`}
        >
          <span className="text-xl">{platform.icon}</span>
          <span>{platform.name}</span>
        </button>
      ))}
    </div>
  );
}
