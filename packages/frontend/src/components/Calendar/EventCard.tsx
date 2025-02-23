'use client';

import React from 'react';
import { CalendarEvent } from '../../types/calendar';

interface EventCardProps {
  event: CalendarEvent;
  onClick: (event: CalendarEvent) => void;
}

export default function EventCard({ event, onClick }: EventCardProps) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick(event);
      }}
      className={`w-full rounded-lg px-2 py-1 text-xs ${
        event.color || 'bg-purple-600/20 text-purple-200'
      } backdrop-blur-sm hover:bg-opacity-30 transition-all duration-200 event-card-gradient`}
    >
      <div className="flex items-center justify-between">
        <span className="flex-1 truncate font-medium text-white">{event.title}</span>
        {event.participants && (
          <div className="flex -space-x-1">
            {event.participants.map((participant, idx) => (
              <img
                key={idx}
                src={participant.avatar}
                alt={participant.name}
                className="h-6 w-6 rounded-full ring-2 ring-gray-900 hover:ring-purple-500 transition-all duration-200"
              />
            ))}
          </div>
        )}
      </div>
    </button>
  );
}
