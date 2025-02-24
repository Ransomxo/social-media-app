'use client';

import React, { useState } from 'react';

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
    participants?: Array<{
      name: string;
      avatar: string;
    }>;
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
    const start = selectedDate || new Date();
    const end = new Date(start);
    end.setHours(end.getHours() + 1);

    onSave({
      title,
      description,
      start,
      end,
      platforms,
    });

    setTitle('');
    setDescription('');
    setPlatforms([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 bg-gray-900/75 backdrop-blur-sm">
      <div className="modal-content">
        <h2 className="text-xl font-semibold text-white mb-6">Add Event</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="modal-label">Title</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="modal-input"
              required
              placeholder="Enter event title"
            />
          </div>
          <div>
            <label htmlFor="description" className="modal-label">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="modal-input"
              rows={3}
              placeholder="Enter event description"
            />
          </div>
          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="modal-button-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="modal-button-primary"
            >
              Schedule Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
