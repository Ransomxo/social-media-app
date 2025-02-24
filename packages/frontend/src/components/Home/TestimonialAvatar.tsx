'use client';

import React from 'react';

interface TestimonialAvatarProps {
  name: string;
}

export default function TestimonialAvatar({ name }: TestimonialAvatarProps) {
  return (
    <div className="h-16 w-16 rounded-full bg-gray-800 flex items-center justify-center">
      <span className="text-sm text-gray-400">{name}</span>
    </div>
  );
}
