'use client';

import React from 'react';

interface Category {
  id: string;
  name: string;
  color: string;
}

export default function Categories() {
  const categories: Category[] = [
    { id: '1', name: 'Personal', color: 'bg-purple-500' },
    { id: '2', name: 'Developer task', color: 'bg-blue-500' },
    { id: '3', name: 'Design project', color: 'bg-pink-500' }
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-white">Categories</h2>
      <div className="space-y-2">
        {categories.map((category) => (
          <div key={category.id} className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${category.color}`} />
            <span className="text-gray-300">{category.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
