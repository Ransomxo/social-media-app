'use client';

import React, { useState } from 'react';
import TimeFilter from '../../components/Analytics/TimeFilter';
import PlatformFilter from '../../components/Analytics/PlatformFilter';
import AnalyticsCard from '../../components/Analytics/AnalyticsCard';
import AnalyticsChart from '../../components/Analytics/AnalyticsChart';
import { TimeFilter as ITimeFilter, PlatformFilter as IPlatformFilter, AnalyticsMetric } from '../../types/analytics';

export default function AnalyticsPage() {
  const [selectedTimeFilter, setSelectedTimeFilter] = useState('daily');
  const [platforms, setPlatforms] = useState<IPlatformFilter[]>([
    { id: 'instagram', name: 'Instagram', icon: '📸', enabled: true },
    { id: 'twitter', name: 'Twitter', icon: '🐦', enabled: true },
    { id: 'facebook', name: 'Facebook', icon: '👥', enabled: true }
  ]);

  const timeFilters: ITimeFilter[] = [
    { id: 'daily', label: 'Daily', value: 'daily' },
    { id: 'weekly', label: 'Weekly', value: 'weekly' },
    { id: 'monthly', label: 'Monthly', value: 'monthly' },
    { id: 'custom', label: 'Custom Range', value: 'custom' }
  ];

  const sampleMetrics: AnalyticsMetric[] = [
    {
      id: '1',
      title: 'Total Followers',
      value: '12.5K',
      change: { value: 12, type: 'increase' }
    },
    {
      id: '2',
      title: 'Engagement Rate',
      value: '4.8%',
      change: { value: 0.5, type: 'increase' }
    },
    {
      id: '3',
      title: 'Total Posts',
      value: '156',
      change: { value: 8, type: 'increase' }
    }
  ];

  const sampleChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Engagement',
        data: [65, 59, 80, 81, 56, 55, 40],
        borderColor: '#9333EA',
        backgroundColor: 'rgba(147, 51, 234, 0.1)'
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-purple-900/20">
      <div className="flex">
        <aside className="w-64 p-6 border-r border-purple-900/20 bg-gray-900/95 backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-white mb-6">Analytics Overview</h3>
          
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-3">Time Period</h4>
              <TimeFilter
                filters={timeFilters}
                selectedFilter={selectedTimeFilter}
                onFilterChange={setSelectedTimeFilter}
              />
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-3">Platforms</h4>
              <PlatformFilter
                platforms={platforms}
                onTogglePlatform={(id) => {
                  setPlatforms(platforms.map(p =>
                    p.id === id ? { ...p, enabled: !p.enabled } : p
                  ));
                }}
              />
            </div>

            <button className="analytics-filter-button w-full">
              Export Report
            </button>
          </div>
        </aside>

        <main className="flex-1 p-6">
          <div className="grid grid-cols-3 gap-6 mb-8">
            {sampleMetrics.map(metric => (
              <AnalyticsCard key={metric.id} {...metric} />
            ))}
          </div>

          <div className="grid grid-cols-2 gap-6">
            <AnalyticsChart
              title="Engagement Over Time"
              data={sampleChartData}
            />
            <AnalyticsChart
              title="Follower Growth"
              data={{
                ...sampleChartData,
                datasets: [{
                  label: 'Followers',
                  data: [1200, 1350, 1400, 1450, 1500, 1550, 1600],
                  borderColor: '#9333EA',
                  backgroundColor: 'rgba(147, 51, 234, 0.1)'
                }]
              }}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
