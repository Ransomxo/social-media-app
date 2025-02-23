export interface CalendarEvent {
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

export interface CalendarGridProps {
  currentDate: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onTimeSlotClick: (date: Date) => void;
}

export interface CalendarHeaderProps {
  currentDate: Date;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
  view: 'Month' | 'Week' | 'Day';
  onViewChange: (view: 'Month' | 'Week' | 'Day') => void;
}
