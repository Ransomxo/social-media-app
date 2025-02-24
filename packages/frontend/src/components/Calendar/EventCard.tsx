'use client';

import React from 'react';
import { CalendarEvent } from '../../types/calendar';
import './styles/event-card.css';

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
      className="event-card-gradient w-full rounded-lg px-3 py-2"
    >
      <div className="flex items-center justify-between">
        <span className="flex-1 truncate font-medium text-white">
          {event.title}
        </span>
        {event.participants && (
          <div className="flex -space-x-2">
            {event.participants.map((participant, idx) => (
              <img
                key={idx}
                src={participant.avatar}
                alt={participant.name}
                className="event-avatar"
              />
            ))}
          </div>
        )}
      </div>
    </button>
  );
}
