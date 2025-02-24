'use client';

import React from 'react';
import TestimonialAvatar from './TestimonialAvatar';

const testimonials = [
  {
    content: "TrendTide helped me finally understand my audience better than ever. The analytics are so comprehensive, and the insights are invaluable for growing my social media presence.",
    author: {
      name: "Sarah Chen",
      role: "Content Creator",
      image: "/testimonials/sarah.jpg"
    }
  },
  {
    content: "Before using TrendTide, I struggled to keep track of my social media metrics. Now, everything is organized and the insights are incredibly actionable. It's transformed my strategy.",
    author: {
      name: "James Lee",
      role: "Digital Marketer",
      image: "/testimonials/james.jpg"
    }
  },
  {
    content: "As a freelancer, TrendTide gives me all the tools I need to manage my clients' social media effectively. The analytics are detailed, and the interface is so intuitive.",
    author: {
      name: "Emma Wilson",
      role: "Social Media Manager",
      image: "/testimonials/emma.jpg"
    }
  }
];

export default function Testimonials() {
  return (
    <section className="section-spacing">
      <div className="section-gradient"></div>
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="section-title">Customer testimonials</h2>
          <p className="section-description">
            Loved by social media professionals
          </p>
        </div>
        <div className="mx-auto mt-16 flow-root max-w-2xl sm:mt-20 lg:mx-0 lg:max-w-none">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial, testimonialIdx) => (
              <div key={testimonialIdx} className="card hover:bg-gray-800/70 transition-colors">
                <blockquote className="text-lg leading-8 text-gray-300">
                  <p>&ldquo;{testimonial.content}&rdquo;</p>
                </blockquote>
                <div className="mt-8 flex items-center gap-x-4">
                  <TestimonialAvatar name={testimonial.author.name} />
                  <div>
                    <div className="font-semibold text-white">{testimonial.author.name}</div>
                    <div className="text-gray-400">{testimonial.author.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
