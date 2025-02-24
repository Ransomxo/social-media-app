'use client';

import React from 'react';
import CalendarList from './CalendarList';
import Categories from './Categories';

export default function Sidebar() {
  return (
    <div className="calendar-sidebar">
      <CalendarList />
      <Categories />
    </div>
  );
}
