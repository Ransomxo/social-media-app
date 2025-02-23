'use client';

import React from 'react';
import Image from 'next/image';

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
    <section className="py-24 bg-gray-900">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-lg font-semibold leading-8 tracking-tight text-purple-600">Customer testimonials</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Loved by social media professionals
          </p>
        </div>
        <div className="mx-auto mt-16 flow-root max-w-2xl sm:mt-20 lg:mx-0 lg:max-w-none">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial, testimonialIdx) => (
              <div key={testimonialIdx} className="flex flex-col justify-between bg-gray-800/50 backdrop-blur-sm px-8 py-10 rounded-2xl">
                <blockquote className="text-lg leading-8 text-gray-300">
                  <p>&ldquo;{testimonial.content}&rdquo;</p>
                </blockquote>
                <div className="mt-8 flex items-center gap-x-4">
                  <Image
                    className="h-10 w-10 rounded-full bg-gray-800"
                    src={testimonial.author.image}
                    alt={testimonial.author.name}
                    width={40}
                    height={40}
                  />
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
