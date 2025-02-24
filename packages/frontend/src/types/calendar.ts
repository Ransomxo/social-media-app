export type CalendarView = 'month' | 'week' | 'day';

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  description?: string;
  participants?: { name: string; avatar: string; }[];
  platform?: string;
  color?: string;
}

export interface TimeSlot {
  time: string;
  events: CalendarEvent[];
}

export interface DayColumn {
  date: Date;
  slots: TimeSlot[];
}
