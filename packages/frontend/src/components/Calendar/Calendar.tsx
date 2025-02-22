'use client';

import React, { useState } from 'react';
import CalendarHeader from './CalendarHeader';
import CalendarGrid from './CalendarGrid';
import AddEventModal from './AddEventModal';
import './styles/calendar.css';

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  color?: string;
  participants?: Array<{
    avatar: string;
    name: string;
  }>;
}

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'Month' | 'Week' | 'Day'>('Month');
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();

  const handlePrevious = () => {
    const newDate = new Date(currentDate);
    if (view === 'Month') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else if (view === 'Week') {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setDate(newDate.getDate() - 1);
    }
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    if (view === 'Month') {
      newDate.setMonth(newDate.getMonth() + 1);
    } else if (view === 'Week') {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    setCurrentDate(newDate);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleEventClick = (event: CalendarEvent) => {
    // Handle event click
    console.log('Event clicked:', event);
  };

  const handleTimeSlotClick = (date: Date) => {
    setSelectedDate(date);
    setIsAddEventModalOpen(true);
  };

  const handleSaveEvent = (eventData: {
    title: string;
    start: Date;
    end: Date;
    description?: string;
    platforms: string[];
  }) => {
    const newEvent: CalendarEvent = {
      id: Math.random().toString(36).substr(2, 9),
      title: eventData.title,
      start: eventData.start,
      end: eventData.end,
      color: 'bg-blue-100 text-blue-700',
    };

    setEvents([...events, newEvent]);
  };

  return (
    <div className="flex h-full flex-col">
      <CalendarHeader
        currentDate={currentDate}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onToday={handleToday}
        view={view}
        onViewChange={setView}
      />
      <CalendarGrid
        currentDate={currentDate}
        events={events}
        onEventClick={handleEventClick}
        onTimeSlotClick={handleTimeSlotClick}
      />
      <AddEventModal
        isOpen={isAddEventModalOpen}
        onClose={() => setIsAddEventModalOpen(false)}
        selectedDate={selectedDate}
        onSave={handleSaveEvent}
      />
    </div>
  );
}
