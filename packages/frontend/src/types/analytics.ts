export interface AnalyticsMetric {
  id: string;
  title: string;
  value: number | string;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
  };
  platform?: string;
}

export interface TimeFilter {
  id: string;
  label: string;
  value: 'daily' | 'weekly' | 'monthly' | 'custom';
}

export interface PlatformFilter {
  id: string;
  name: string;
  icon: string;
  enabled: boolean;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
  }[];
}

export interface AnalyticsExport {
  timeRange: {
    start: Date;
    end: Date;
  };
  frequency: 'daily' | 'weekly';
  metrics: string[];
  platforms: string[];
}
