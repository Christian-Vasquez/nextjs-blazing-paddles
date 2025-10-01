'use client';

import { useState } from 'react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  court: string;
  date: Date;
  startTime: string;
  endTime: string;
  onConfirm: (reservation: {
    court: string;
    date: string;
    startTime: string;
    endTime: string;
    credits: number;
  }) => void;
}

export default function BookingModal({
  isOpen,
  onClose,
  court,
  date,
  startTime,
  endTime,
  onConfirm,
}: BookingModalProps) {
  const [credits] = useState(10); // Fixed cost per reservation

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm({
      court,
      date: date.toISOString().split('T')[0],
      startTime,
      endTime,
      credits,
    });
    onClose();
  };

  const formatDate = (d: Date) => {
    return d.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Book Court</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="space-y-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-sm text-gray-600 font-medium">Court</p>
                <p className="text-lg font-bold text-blue-600">{court}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Credits</p>
                <p className="text-lg font-bold text-yellow-600">{credits}</p>
              </div>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-600 font-medium mb-1">Date</p>
            <p className="text-gray-900">{formatDate(date)}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-sm text-gray-600 font-medium mb-1">Start Time</p>
              <p className="text-gray-900 font-semibold">{startTime}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium mb-1">End Time</p>
              <p className="text-gray-900 font-semibold">{endTime}</p>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-lg"
          >
            Add to Sessions
          </button>
        </div>
      </div>
    </div>
  );
}

