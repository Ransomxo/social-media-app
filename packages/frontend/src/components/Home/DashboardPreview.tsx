'use client';

import React from 'react';

export default function DashboardPreview() {
  return (
    <div className="w-full aspect-[2432/1442] bg-gray-800 rounded-xl shadow-2xl relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/20 to-purple-400/20"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-2xl text-gray-400 font-medium">Dashboard Preview</div>
      </div>
      <div className="absolute inset-0 ring-1 ring-inset ring-gray-900/10"></div>
    </div>
  );
}
