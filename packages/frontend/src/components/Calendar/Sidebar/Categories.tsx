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
    <div className="space-y-2">
      {categories.map((category) => (
        <div
          key={category.id}
          className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors duration-200 py-2 px-3 rounded-lg hover:bg-gray-800/50 cursor-pointer group"
        >
          <span className={`w-2 h-2 rounded-full ${category.color} group-hover:ring-2 ring-offset-2 ring-offset-gray-900 ring-purple-500/50 transition-all duration-200`} />
          <span className="text-sm font-medium">{category.name}</span>
        </div>
      ))}
    </div>
  );
}
