'use client';

import React from 'react';
import Image from 'next/image';

const features = [
  {
    name: 'Audience Growth & Analysis',
    description: 'Track your audience growth in real-time and analyze your product demographics, behaviors, and interests. Understand what your followers are and what content they engage with most.',
    icon: '/icons/growth.svg'
  },
  {
    name: 'Improving Engagement',
    description: 'Enhance your social media performance with detailed metrics on likes, shares, and interactions. Discover which content resonates best with your audience and optimize your strategy.',
    icon: '/icons/engagement.svg'
  },
  {
    name: 'Monetization Tools',
    description: 'Manage your ad performance and maximize monetization opportunities. Track revenue, analyze campaign effectiveness, and unlock the full earning potential of your social platforms.',
    icon: '/icons/monetization.svg'
  }
];

export default function Features() {
  return (
    <section className="py-24 bg-gray-900">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-purple-600">Comprehensive Analytics</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Everything you need to grow your social media presence
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            Whether you're aiming to grow your audience, identify new opportunities, or improve engagement, our dashboard delivers actionable metrics that help you refine your strategy and achieve lasting success.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.name} className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-white">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-600">
                    <Image
                      src={feature.icon}
                      alt={feature.name}
                      className="h-6 w-6 text-white"
                      width={24}
                      height={24}
                    />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-300">
                  <p className="flex-auto">{feature.description}</p>
                  <p className="mt-6">
                    <a href="#" className="text-sm font-semibold leading-6 text-purple-400">
                      Learn more <span aria-hidden="true">→</span>
                    </a>
                  </p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
