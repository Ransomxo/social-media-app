'use client';

import React, { useState } from 'react';
import { format } from 'date-fns';

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate?: Date;
  onSave: (eventData: {
    title: string;
    start: Date;
    end: Date;
    description?: string;
    platforms: string[];
  }) => void;
}

export default function AddEventModal({
  isOpen,
  onClose,
  selectedDate,
  onSave,
}: AddEventModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [platforms, setPlatforms] = useState<string[]>([]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate) return;

    const startDate = new Date(selectedDate);
    const endDate = new Date(selectedDate);
    endDate.setHours(endDate.getHours() + 1);

    onSave({
      title,
      description,
      start: startDate,
      end: endDate,
      platforms,
    });

    setTitle('');
    setDescription('');
    setPlatforms([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-900/75 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold text-white mb-4">Add Event</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-300">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-purple-500 focus:ring-purple-500"
              required
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-300">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-purple-500 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Date</label>
            <div className="mt-1 text-gray-300">
              {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'No date selected'}
            </div>
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white focus:outline-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
