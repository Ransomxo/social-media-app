'use client';

import React, { useState } from 'react';
import { format } from 'date-fns';
import { Dialog } from '@headlessui/react';
import { UserCircleIcon } from '@heroicons/react/24/outline';

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
  const [participants, setParticipants] = useState<string[]>([]);

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
      participants: participants.map(name => ({
        name,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff`
      }))
    });

    setTitle('');
    setDescription('');
    setPlatforms([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-gray-900/75 backdrop-blur-sm" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-gray-800/90 backdrop-blur-sm rounded-xl p-8 w-full max-w-md border border-gray-700 shadow-xl">
          <Dialog.Title className="text-2xl font-semibold text-white mb-6 bg-gradient-to-r from-purple-500 to-purple-300 bg-clip-text text-transparent">
            Add Event
          </Dialog.Title>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
              Title
            </label>
            <input
              type="text"
              id="title"
              devinid="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full rounded-lg bg-gray-700/50 border-gray-600 text-white shadow-sm focus:border-purple-500 focus:ring-purple-500 backdrop-blur-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              id="description"
              devinid="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="mt-1 block w-full rounded-lg bg-gray-700/50 border-gray-600 text-white shadow-sm focus:border-purple-500 focus:ring-purple-500 backdrop-blur-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Date</label>
            <div className="mt-1 text-gray-300 bg-gray-700/50 rounded-lg p-3 backdrop-blur-sm">
              {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'No date selected'}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Participants
            </label>
            <div className="flex items-center space-x-2 mt-2">
              {participants.map((participant, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-1 bg-gray-700/50 rounded-full px-3 py-1"
                >
                  <UserCircleIcon className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-300">{participant}</span>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setParticipants([...participants, `User ${participants.length + 1}`])}
                className="p-1 rounded-full hover:bg-gray-700/50"
              >
                <UserCircleIcon className="h-5 w-5 text-gray-400" />
              </button>
            </div>
          </div>
          <div className="flex justify-end space-x-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-sm font-medium text-gray-300 hover:text-white focus:outline-none transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-purple-500 rounded-lg hover:from-purple-700 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200"
            >
              Save
            </button>
          </div>
        </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
