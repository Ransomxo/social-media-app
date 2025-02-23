'use client';

import React from 'react';
import CalendarList from './CalendarList';
import Categories from './Categories';

export default function Sidebar() {
  return (
    <div className="w-64 p-6 border-r border-gray-800 bg-gray-900/50 backdrop-blur-sm">
      <CalendarList />
      <div className="mt-8">
        <Categories />
      </div>
    </div>
  );
}
