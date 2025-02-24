export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start: Date;
  end: Date;
  platforms: string[];
  participants?: Array<{
    name: string;
    avatar: string;
  }>;
}

export type CalendarView = 'Month' | 'Week' | 'Day';
