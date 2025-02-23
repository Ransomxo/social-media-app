'use client';

import React from 'react';

interface Calendar {
  id: string;
  name: string;
  color: string;
}

export default function CalendarList() {
  const calendars: Calendar[] = [
    { id: '1', name: 'Personal', color: 'bg-purple-500' },
    { id: '2', name: 'Work', color: 'bg-blue-500' },
    { id: '3', name: 'Health', color: 'bg-green-500' }
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-white">My Calendars</h2>
      <div className="space-y-2">
        {calendars.map((calendar) => (
          <div key={calendar.id} className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${calendar.color}`} />
            <span className="text-gray-300">{calendar.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
