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
      className={`w-full rounded-lg px-3 py-2 text-xs ${
        event.color || 'bg-gradient-to-r from-purple-600/20 to-purple-400/20 hover:from-purple-600/30 hover:to-purple-400/30'
      } backdrop-blur-sm transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/10 hover:ring-1 hover:ring-purple-500/30`}
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
