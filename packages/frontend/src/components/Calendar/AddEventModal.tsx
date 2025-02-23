'use client';

import React, { useState, Fragment } from 'react';
import { format } from 'date-fns';
import { Dialog, Transition } from '@headlessui/react';
import { UserCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import './styles/modal.css';

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
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-900/75 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="relative bg-gray-800/90 backdrop-blur-sm rounded-xl p-8 w-full max-w-md border border-gray-700 shadow-xl">
                <div className="flex items-center justify-between mb-6">
                  <Dialog.Title className="text-2xl font-semibold text-white bg-gradient-to-r from-purple-500 to-purple-300 bg-clip-text text-transparent">
                    Add Event
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="title" className="modal-label">
                      Title
                    </label>
                    <input
                      type="text"
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="modal-input"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="description" className="modal-label">
                      Description
                    </label>
                    <textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                      className="modal-input"
                    />
                  </div>

                  <div>
                    <label className="modal-label">Date</label>
                    <div className="modal-input p-3">
                      {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'No date selected'}
                    </div>
                  </div>

                  <div>
                    <label className="modal-label">
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
                      className="modal-button-secondary"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="modal-button-primary"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
