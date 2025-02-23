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
  view = 'Month',
}: CalendarGridProps) {
  const timeSlots = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => {
      const hour = i + 6;
      return format(new Date().setHours(hour, 0, 0, 0), 'h:mm a');
    });
  }, []);

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
      <div className="time-grid">
        <div className="sticky top-0 z-10 bg-gray-900/90">
          <div className="grid grid-cols-[auto_1fr]">
            <div className="w-24" />
            <div className={view === 'Day' ? 'grid grid-cols-1' : 'grid grid-cols-7'}>
              {renderDayHeaders()}
            </div>
          </div>
        </div>
        <div className="time-grid-content">
          {timeSlots.map((time) => (
            <React.Fragment key={time}>
              <div className="time-column sticky left-0">
                {time}
              </div>
              <div className={view === 'Day' ? 'grid grid-cols-1' : 'grid grid-cols-7'}>
                {Array(view === 'Day' ? 1 : 7).fill(null).map((_, i) => {
                  const date = new Date(currentDate);
                  date.setHours(parseInt(time.split(':')[0]));
                  date.setDate(date.getDate() - date.getDay() + i);
                  const isToday = date.toDateString() === new Date().toDateString();
                  
                  return (
                    <div
                      key={i}
                      className={`time-slot time-slot-hover p-2 ${isToday ? 'current-day' : ''}`}
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
    </div>
  );
}
