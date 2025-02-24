'use client';

import React, { useState } from 'react';
import CalendarHeader from './CalendarHeader';
import CalendarGrid from './CalendarGrid';
import AddEventModal from './AddEventModal';
import { CalendarEvent, CalendarView } from '../../types/calendar';

interface CalendarProps {
  initialEvents?: CalendarEvent[];
}

export default function Calendar({ initialEvents = [] }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<CalendarView>('Month');
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  const handlePrevious = () => {
    const newDate = new Date(currentDate);
    if (view === 'Month') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setDate(newDate.getDate() - (view === 'Week' ? 7 : 1));
    }
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    if (view === 'Month') {
      newDate.setMonth(newDate.getMonth() + 1);
    } else {
      newDate.setDate(newDate.getDate() + (view === 'Week' ? 7 : 1));
    }
    setCurrentDate(newDate);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleTimeSlotClick = (date: Date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const handleEventClick = (event: CalendarEvent) => {
    // TODO: Implement event editing
    console.log('Event clicked:', event);
  };

  const handleSaveEvent = (eventData: Omit<CalendarEvent, 'id'>) => {
    const newEvent: CalendarEvent = {
      ...eventData,
      id: Math.random().toString(36).substr(2, 9),
    };
    setEvents([...events, newEvent]);
  };

  return (
    <div className="h-screen flex flex-col">
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
        view={view}
      />
      <AddEventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedDate={selectedDate}
        onSave={handleSaveEvent}
      />
    </div>
  );
}
