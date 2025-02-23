'use client';

import React, { useMemo } from 'react';
import { format } from 'date-fns';
import { CalendarEvent } from '../../types/calendar';
import EventCard from './EventCard';

interface CalendarGridProps {
  currentDate: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onTimeSlotClick: (date: Date) => void;
  view: 'Month' | 'Week' | 'Day';
}

export default function CalendarGrid({
  currentDate,
  events,
  onEventClick,
  onTimeSlotClick,
  view,
}: CalendarGridProps) {
  const timeSlots = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => {
      const hour = i + 6;
      return format(new Date().setHours(hour, 0, 0, 0), 'h:mm a');
    });
  }, []);

  const weeks = useMemo(() => {
    const start = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const end = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    
    const days: Date[] = [];
    const week: Date[][] = [];
    
    // Add days from previous month to start the week
    const startDay = start.getDay();
    for (let i = startDay; i > 0; i--) {
      const day = new Date(start);
      day.setDate(day.getDate() - i);
      days.push(day);
    }
    
    // Add all days of current month
    for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
      days.push(new Date(d));
    }
    
    // Add days from next month to complete the week
    const endDay = end.getDay();
    for (let i = 1; i < 7 - endDay; i++) {
      const day = new Date(end);
      day.setDate(day.getDate() + i);
      days.push(day);
    }
    
    // Group days into weeks
    for (let i = 0; i < days.length; i += 7) {
      week.push(days.slice(i, i + 7));
    }
    
    return week;
  }, [currentDate]);

  const getEventsForDay = (date: Date) => {
    return events.filter(
      (event) =>
        event.start.toDateString() === date.toDateString() ||
        event.end.toDateString() === date.toDateString()
    );
  };

  const renderDayHeaders = () => {
    const days = view === 'Week' ? 7 : view === 'Day' ? 1 : 7;
    const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const startIdx = view === 'Day' ? currentDate.getDay() : 0;
    
    return dayLabels.slice(startIdx, startIdx + days).map((day) => (
      <div
        key={day}
        className="day-header py-3 px-4 text-center text-sm font-semibold uppercase tracking-wider"
      >
        {day}
      </div>
    ));
  };

  return (
    <div className="flex-1 calendar-grid">
      <div className="grid grid-cols-[auto_1fr] gap-px bg-gray-800/50 backdrop-blur-sm">
        <div className="w-24 bg-gray-900/90" /> {/* Time column header */}
        <div className={view === 'Day' ? 'grid grid-cols-1' : 'grid grid-cols-7'}>
          {renderDayHeaders()}</div>
        {timeSlots.map((time) => (
          <React.Fragment key={time}>
            <div className="w-24 bg-gray-900/90 py-3 px-4 text-sm font-medium text-gray-300 border-b border-gray-800/50">
              {time}
            </div>
            <div className={view === 'Day' ? 'grid grid-cols-1' : 'grid grid-cols-7'}>
              {Array(view === 'Day' ? 1 : 7).fill(null).map((_, i) => {
                const date = new Date(currentDate);
                date.setHours(parseInt(time));
                date.setDate(date.getDate() - date.getDay() + i);
                const isToday = date.toDateString() === new Date().toDateString();
                
                return (
                  <div
                    key={i}
                    className={`h-16 time-slot time-slot-hover p-1 ${isToday ? 'current-day' : ''}`}
                    onClick={() => onTimeSlotClick(date)}
                  >
                    {getEventsForDay(date).map((event) => (
                      <EventCard key={event.id} event={event} onClick={onEventClick} />
                    ))}
                  </div>
                );
              })}
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
        {timeSlots.map((time) => (
          <React.Fragment key={time}>
            <div className="w-24 bg-gray-900/90 py-3 px-4 text-sm font-medium text-gray-300 border-b border-gray-800/50">
              {time}
            </div>
            <div className="grid grid-cols-7 gap-px">
              {Array(7).fill(null).map((_, i) => {
                const date = new Date(currentDate);
                date.setHours(parseInt(time));
                date.setDate(date.getDate() - date.getDay() + i);
                const isToday = date.toDateString() === new Date().toDateString();
                
                return (
                  <div
                    key={i}
                    className={`h-16 time-slot time-slot-hover p-1 ${isToday ? 'current-day' : ''}`}
                    onClick={() => onTimeSlotClick(date)}
                  >
                    {getEventsForDay(date).map((event) => (
                      <EventCard key={event.id} event={event} onClick={onEventClick} />
                    ))}
                  </div>
                );
              })}
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
