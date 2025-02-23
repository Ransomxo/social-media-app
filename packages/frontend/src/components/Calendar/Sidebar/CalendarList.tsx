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
    <div className="space-y-2">
      {calendars.map((calendar) => (
        <label key={calendar.id} className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors duration-200 py-2 px-3 rounded-lg hover:bg-gray-800/50 cursor-pointer group">
          <input
            type="checkbox"
            defaultChecked
            className="h-4 w-4 rounded border-gray-600 text-purple-500 focus:ring-purple-500/50 bg-gray-800 hover:bg-gray-700"
          />
          <span className={`w-2 h-2 rounded-full ${calendar.color} group-hover:ring-2 ring-offset-2 ring-offset-gray-900 ring-purple-500/50 transition-all duration-200`} />
          <span className="text-sm font-medium">{calendar.name}</span>
        </label>
      ))}
    </div>
  );
}
