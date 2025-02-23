'use client';

import React from 'react';
import Link from 'next/link';

const tiers = [
  {
    name: 'Individual Creators',
    id: 'individual',
    price: { monthly: '$10' },
    description: 'Perfect for solo content creators and influencers.',
    features: [
      'Basic analytics tracking',
      'Engagement metrics analysis',
      'Social media management',
      'Basic post scheduling',
      'Content performance insights'
    ],
    cta: 'Subscribe Now',
    href: '/signup'
  },
  {
    name: 'Teams & Agencies',
    id: 'team',
    price: { monthly: '$10' },
    description: 'Designed for growing teams and agencies.',
    features: [
      'Multi-account management',
      'Team collaboration tools',
      'Advanced analytics',
      'Priority support',
      'Custom reporting'
    ],
    cta: 'Subscribe Now',
    href: '/signup'
  },
  {
    name: 'Custom Plan',
    id: 'enterprise',
    price: { monthly: "Let's talk!" },
    description: 'Custom solutions for large organizations.',
    features: [
      'Custom solutions',
      'Dedicated support',
      'API access',
      'White-label options',
      'Custom analytics'
    ],
    cta: 'Contact sales',
    href: '/contact'
  }
];

export default function Pricing() {
  return (
    <section className="section-spacing">
      <div className="section-gradient"></div>
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="section-title">Pricing</h2>
          <p className="section-description">
            Flexible Plans for Every Need
          </p>
          <p className="section-subtitle">
            Whether you're a solo creator or managing multiple brands, we have a plan that's right for you.
          </p>
        </div>

        <div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={`ring-1 ring-gray-700/10 rounded-3xl p-8 xl:p-10 ${
                tier.id === 'team' ? 'bg-purple-600/10 ring-purple-600' : 'bg-gray-800/50 backdrop-blur-sm'
              }`}
            >
              <div className="flex items-center justify-between gap-x-4">
                <h3 className="text-lg font-semibold leading-8 text-white">{tier.name}</h3>
              </div>
              <p className="mt-4 text-sm leading-6 text-gray-300">{tier.description}</p>
              <p className="mt-6 flex items-baseline gap-x-1">
                <span className="text-4xl font-bold tracking-tight text-white">{tier.price.monthly}</span>
                {tier.id !== 'enterprise' && <span className="text-sm font-semibold leading-6 text-gray-300">/month</span>}
              </p>
              <Link
                href={tier.href}
                className={`mt-6 block rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                  tier.id === 'team'
                    ? 'bg-purple-600 text-white shadow-sm hover:bg-purple-500 focus-visible:outline-purple-600'
                    : 'bg-gray-800 text-white hover:bg-gray-700 focus-visible:outline-white'
                }`}
              >
                {tier.cta}
              </Link>
              <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-300">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex gap-x-3">
                    <svg className="h-6 w-5 flex-none text-purple-600" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
