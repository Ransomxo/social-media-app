'use client';

import React from 'react';
import CalendarList from './CalendarList';
import Categories from './Categories';

export default function Sidebar() {
  return (
    <div className="calendar-sidebar">
      <div className="calendar-sidebar-section">
        <h2 className="calendar-header-title mb-4">
          My Calendars
        </h2>
        <CalendarList />
      </div>
      <div className="calendar-sidebar-section">
        <h2 className="calendar-header-title mb-4">
          Categories
        </h2>
        <Categories />
      </div>
    </div>
  );
}
