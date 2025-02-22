'use client';

import React, { useMemo } from 'react';
import { format } from 'date-fns';

import { CalendarEvent, CalendarGridProps } from '../../types/calendar';

export default function CalendarGrid({
  currentDate,
  events,
  onEventClick,
  onTimeSlotClick,
}: CalendarGridProps) {
  const weeks = useMemo(() => {
    const start = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const end = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    
    const days = [];
    const week = [];
    
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
      (event: CalendarEvent) =>
        event.start.toDateString() === date.toDateString() ||
        event.end.toDateString() === date.toDateString()
    );
  };

  return (
    <div className="flex-1 grid grid-cols-7 grid-rows-6 gap-px bg-gray-200">
      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
        <div
          key={day}
          className="bg-white py-2 px-3 text-center text-xs font-semibold uppercase text-gray-700"
        >
          {day}
        </div>
      ))}
      {weeks.map((week, weekIdx) =>
        week.map((day, dayIdx) => {
          const dayEvents = getEventsForDay(day);
          const isToday = day.toDateString() === new Date().toDateString();
          const isCurrentMonth = day.getMonth() === currentDate.getMonth();

          return (
            <div
              key={`${weekIdx}-${dayIdx}`}
              className={`relative bg-white p-2 ${
                !isCurrentMonth ? 'bg-gray-50' : ''
              }`}
              onClick={() => onTimeSlotClick(day)}
            >
              <div
                className={`flex h-6 w-6 items-center justify-center rounded-full ${
                  isToday
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-900'
                }`}
              >
                {day.getDate()}
              </div>
              <div className="space-y-1 mt-2">
                {dayEvents.map((event: CalendarEvent) => (
                  <button
                    key={event.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick(event);
                    }}
                    className={`w-full rounded px-2 py-1 text-xs ${
                      event.color || 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="flex-1 truncate">{event.title}</span>
                      {event.participants && (
                        <div className="flex -space-x-1">
                          {event.participants.map((participant: { avatar: string; name: string }, idx: number) => (
                            <img
                              key={idx}
                              src={participant.avatar}
                              alt={participant.name}
                              className="h-4 w-4 rounded-full ring-2 ring-white"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
