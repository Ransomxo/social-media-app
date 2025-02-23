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
}

export default function CalendarGrid({
  currentDate,
  events,
  onEventClick,
  onTimeSlotClick,
}: CalendarGridProps) {
  const timeSlots = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => {
      const hour = i + 6;
      return `${hour}${hour === 12 ? 'pm' : 'am'}`;
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

  return (
    <div className="flex-1">
      <div className="grid grid-cols-[auto_1fr] gap-px bg-gray-800">
        <div className="w-20" /> {/* Time column header */}
        <div className="grid grid-cols-7">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div
              key={day}
              className="bg-gray-900 py-2 px-3 text-center text-xs font-semibold uppercase text-gray-300"
            >
              {day}
            </div>
          ))}
        </div>
        {timeSlots.map((time) => (
          <React.Fragment key={time}>
            <div className="w-20 bg-gray-900 py-2 px-3 text-xs font-medium text-gray-300">
              {time}
            </div>
            <div className="grid grid-cols-7 gap-px">
              {Array(7).fill(null).map((_, i) => (
                <div
                  key={i}
                  className="h-12 bg-gray-900/50 backdrop-blur-sm"
                  onClick={() => {
                    const date = new Date(currentDate);
                    date.setHours(parseInt(time));
                    onTimeSlotClick(date);
                  }}
                />
              ))}
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
      {weeks.map((week, weekIdx) =>
        week.map((day, dayIdx) => {
          const dayEvents = getEventsForDay(day);
          const isToday = day.toDateString() === new Date().toDateString();
          const isCurrentMonth = day.getMonth() === currentDate.getMonth();

          return (
            <div
              key={`${weekIdx}-${dayIdx}`}
              className={`relative bg-gray-900/50 backdrop-blur-sm p-2 ${
                !isCurrentMonth ? 'bg-opacity-50' : ''
              }`}
              onClick={() => onTimeSlotClick(day)}
            >
              <div
                className={`flex h-6 w-6 items-center justify-center rounded-full ${
                  isToday
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-300'
                }`}
              >
                {day.getDate()}
              </div>
              <div className="space-y-1 mt-2">
                {dayEvents.map((event) => (
                  <EventCard key={event.id} event={event} onClick={onEventClick} />
                ))}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
