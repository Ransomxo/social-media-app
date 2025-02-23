'use client';

import React from 'react';
import Image from 'next/image';

const tools = [
  {
    name: 'Monetization Tools',
    description: 'Convert your reach into revenue with our advanced monetization tools that help you make smart decisions to optimize your ROI.',
    icon: '/icons/money.svg'
  },
  {
    name: 'User-Friendly Dashboard',
    description: 'Access comprehensive analytics and intuitive interfaces through our easy-to-use dashboard designed for your success.',
    icon: '/icons/dashboard.svg'
  },
  {
    name: 'Real-Time Insights',
    description: 'Get instant performance analytics and engagement metrics to help you make data-driven decisions in real-time.',
    icon: '/icons/insights.svg'
  },
  {
    name: 'Audience Deep Dive',
    description: 'Understand your audience better with detailed demographic data and behavioral analysis about your engaging audiences strategy.',
    icon: '/icons/audience.svg'
  }
];

export default function Tools() {
  return (
    <section className="py-24 bg-gray-900/50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-purple-600">Get more value from your tools</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Convert your reach into revenue with our powerful tools
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            Leverage our comprehensive suite of tools designed to help you maximize your social media impact and drive meaningful results.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2">
            {tools.map((tool) => (
              <div key={tool.name} className="card flex flex-col hover:bg-gray-800/70 transition-colors">
                <dt className="flex items-center gap-x-3 text-xl font-semibold leading-7 text-white">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-600">
                    <Image
                      src={tool.icon}
                      alt={tool.name}
                      className="h-8 w-8 text-white"
                      width={32}
                      height={32}
                    />
                  </div>
                  {tool.name}
                </dt>
                <dd className="mt-6 flex flex-auto flex-col text-base leading-7 text-gray-300">
                  <p className="flex-auto">{tool.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
