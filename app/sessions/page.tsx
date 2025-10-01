'use client';

import { useState, useEffect } from 'react';

interface Session {
  court: string;
  date: string;
  startTime: string;
  endTime: string;
  credits: number;
}

export default function SessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const creditBudget = 100;

  useEffect(() => {
    // Load sessions from localStorage
    const storedSessions = JSON.parse(localStorage.getItem('sessions') || '[]');
    setSessions(storedSessions);
  }, []);

  const creditsUsed = sessions.reduce((sum, session) => sum + session.credits, 0);
  const creditsRemaining = creditBudget - creditsUsed;

  const handleBookCourts = () => {
    if (sessions.length === 0) {
      alert('No sessions to book. Add sessions from the Court Availability page.');
      return;
    }
    alert(`Successfully booked ${sessions.length} court(s) for ${creditsUsed} credits!`);
    localStorage.setItem('sessions', JSON.stringify([]));
    setSessions([]);
  };

  const handleRemoveSession = (index: number) => {
    const newSessions = sessions.filter((_, i) => i !== index);
    setSessions(newSessions);
    localStorage.setItem('sessions', JSON.stringify(newSessions));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Sessions</h1>
          <p className="text-gray-600">Review your court reservations and credit balance</p>
        </div>

        {/* Credit Balance Card */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-xl p-6 mb-8 text-white">
          <h2 className="text-xl font-bold mb-4">Credit Balance</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="text-sm text-blue-100 font-medium mb-1">Credit Budget</p>
              <p className="text-3xl font-bold">{creditBudget}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="text-sm text-blue-100 font-medium mb-1">Credits Used</p>
              <p className="text-3xl font-bold text-yellow-300">{creditsUsed}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="text-sm text-blue-100 font-medium mb-1">Credits Remaining</p>
              <p className={`text-3xl font-bold ${creditsRemaining < 20 ? 'text-red-300' : 'text-green-300'}`}>
                {creditsRemaining}
              </p>
            </div>
          </div>
        </div>

        {/* Sessions List */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Pending Reservations</h2>
          </div>

          {sessions.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No sessions yet</h3>
              <p className="text-gray-600">
                Go to Court Availability to book your first session
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {sessions.map((session, index) => (
                <div
                  key={index}
                  className="px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <h3 className="text-lg font-bold text-gray-900">{session.court}</h3>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                          {session.credits} credits
                        </span>
                      </div>
                      <div className="flex items-center gap-6 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <span className="font-medium">{formatDate(session.date)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <span className="font-medium">
                            {session.startTime} - {session.endTime}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveSession(index)}
                      className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remove session"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Book Button */}
        <div className="flex justify-end">
          <button
            onClick={handleBookCourts}
            disabled={sessions.length === 0}
            className={`px-8 py-4 rounded-xl font-bold text-lg shadow-lg transition-all transform hover:scale-105 ${
              sessions.length === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            Book Court / Bay ({sessions.length} {sessions.length === 1 ? 'Session' : 'Sessions'})
          </button>
        </div>
      </div>
    </div>
  );
}

