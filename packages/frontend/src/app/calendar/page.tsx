'use client';

import React from 'react';
import Calendar from '../../components/Calendar/Calendar';

export const metadata = {
  title: 'Calendar - Omniposting',
  description: 'Schedule and manage your social media posts',
};

export default function CalendarPage() {
  const sampleEvents = [
    {
      id: '1',
      title: 'Social Media Post - Instagram',
      description: 'New product launch announcement',
      start: new Date(2025, 1, 24, 8, 0),
      end: new Date(2025, 1, 24, 9, 0),
      platforms: ['instagram'],
      participants: [
        { name: 'John Doe', avatar: 'https://i.pravatar.cc/32?u=1' },
        { name: 'Jane Smith', avatar: 'https://i.pravatar.cc/32?u=2' }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="flex">
        <aside className="w-64 p-6 border-r border-gray-800 bg-gray-900/95 backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-white mb-4">My Calendars</h3>
          <h3 className="text-lg font-semibold text-white mt-8 mb-4">Categories</h3>
        </aside>
        <main className="flex-1">
          <Calendar initialEvents={sampleEvents} />
        </main>
      </div>
    </div>
  );
}
