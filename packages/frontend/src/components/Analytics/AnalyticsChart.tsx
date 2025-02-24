'use client';

import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { ChartData } from '../../types/analytics';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface AnalyticsChartProps {
  title: string;
  data: ChartData;
}

export default function AnalyticsChart({ title, data }: AnalyticsChartProps) {
  return (
    <div className="analytics-chart-container">
      <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
      <Line
        data={data}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top' as const,
              labels: { 
                color: '#fff',
                font: {
                  family: "'Inter', sans-serif",
                  size: 12
                }
              }
            },
            tooltip: {
              backgroundColor: 'rgba(17, 24, 39, 0.95)',
              titleColor: '#fff',
              bodyColor: '#fff',
              borderColor: 'rgba(147, 51, 234, 0.2)',
              borderWidth: 1,
              padding: 12,
              displayColors: true,
              mode: 'index',
              intersect: false
            }
          },
          scales: {
            y: {
              grid: { 
                color: '#374151',
                display: false
              },
              ticks: { 
                color: '#fff',
                font: {
                  family: "'Inter', sans-serif",
                  size: 12
                }
              }
            },
            x: {
              grid: { 
                color: '#374151',
                display: false
              },
              ticks: { 
                color: '#fff',
                font: {
                  family: "'Inter', sans-serif",
                  size: 12
                }
              }
            }
          }
        }}
        className="h-[300px]"
      />
    </div>
  );
}
