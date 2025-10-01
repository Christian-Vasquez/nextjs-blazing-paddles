'use client';

import { Calendar, dateFnsLocalizer, View } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay, addWeeks, subWeeks } from 'date-fns';
import { enUS } from 'date-fns/locale/en-US';
import { useState, useMemo } from 'react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import BookingModal from '../components/BookingModal';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

// Hardcoded reservations from CSV
const hardcodedReservations = [
  { court: 'Court A', date: '2025-09-29', start_time: '09:00', end_time: '10:00', reserved_by: 'John Doe' },
  { court: 'Court B', date: '2025-09-29', start_time: '11:00', end_time: '12:00', reserved_by: 'Emily Chen' },
  { court: 'Court C', date: '2025-09-29', start_time: '15:00', end_time: '16:00', reserved_by: 'Carlos Ramirez' },
  { court: 'Court D', date: '2025-09-29', start_time: '17:00', end_time: '18:00', reserved_by: 'Sarah Johnson' },
  { court: 'Court A', date: '2025-09-30', start_time: '08:00', end_time: '09:00', reserved_by: 'David Kim' },
  { court: 'Court B', date: '2025-09-30', start_time: '12:00', end_time: '13:00', reserved_by: 'Jessica Lee' },
  { court: 'Court C', date: '2025-09-30', start_time: '14:00', end_time: '15:00', reserved_by: 'Michael Brown' },
  { court: 'Court D', date: '2025-09-30', start_time: '18:00', end_time: '19:00', reserved_by: 'Alicia Wong' },
  { court: 'Court A', date: '2025-10-01', start_time: '10:00', end_time: '11:00', reserved_by: 'Robert Wilson' },
  { court: 'Court B', date: '2025-10-01', start_time: '13:00', end_time: '14:00', reserved_by: 'Emily Chen' },
  { court: 'Court C', date: '2025-10-01', start_time: '16:00', end_time: '17:00', reserved_by: 'John Doe' },
  { court: 'Court D', date: '2025-10-01', start_time: '19:00', end_time: '20:00', reserved_by: 'David Kim' },
  { court: 'Court A', date: '2025-10-02', start_time: '08:00', end_time: '09:00', reserved_by: 'Jessica Lee' },
  { court: 'Court B', date: '2025-10-02', start_time: '11:00', end_time: '12:00', reserved_by: 'Michael Brown' },
  { court: 'Court C', date: '2025-10-02', start_time: '14:00', end_time: '15:00', reserved_by: 'Sarah Johnson' },
  { court: 'Court D', date: '2025-10-02', start_time: '17:00', end_time: '18:00', reserved_by: 'Carlos Ramirez' },
  { court: 'Court A', date: '2025-10-03', start_time: '09:00', end_time: '10:00', reserved_by: 'Emily Chen' },
  { court: 'Court B', date: '2025-10-03', start_time: '12:00', end_time: '13:00', reserved_by: 'Robert Wilson' },
  { court: 'Court C', date: '2025-10-03', start_time: '15:00', end_time: '16:00', reserved_by: 'David Kim' },
  { court: 'Court D', date: '2025-10-03', start_time: '18:00', end_time: '19:00', reserved_by: 'Jessica Lee' },
  { court: 'Court A', date: '2025-10-04', start_time: '10:00', end_time: '11:00', reserved_by: 'Michael Brown' },
  { court: 'Court B', date: '2025-10-04', start_time: '13:00', end_time: '14:00', reserved_by: 'Sarah Johnson' },
  { court: 'Court C', date: '2025-10-04', start_time: '16:00', end_time: '17:00', reserved_by: 'John Doe' },
  { court: 'Court D', date: '2025-10-04', start_time: '19:00', end_time: '20:00', reserved_by: 'Alicia Wong' },
  { court: 'Court A', date: '2025-10-05', start_time: '08:00', end_time: '09:00', reserved_by: 'Jessica Lee' },
  { court: 'Court B', date: '2025-10-05', start_time: '11:00', end_time: '12:00', reserved_by: 'Carlos Ramirez' },
  { court: 'Court C', date: '2025-10-05', start_time: '14:00', end_time: '15:00', reserved_by: 'Emily Chen' },
  { court: 'Court D', date: '2025-10-05', start_time: '17:00', end_time: '18:00', reserved_by: 'Robert Wilson' },
];

interface CalendarEvent {
  title: string;
  start: Date;
  end: Date;
  resource: {
    court: string;
    isReserved: boolean;
  };
}

export default function AvailabilityPage() {
  const [currentDate, setCurrentDate] = useState(new Date('2025-10-01'));
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{
    court: string;
    date: Date;
    startTime: string;
    endTime: string;
  } | null>(null);

  // Transform hardcoded data into calendar events
  const events: CalendarEvent[] = useMemo(() => {
    return hardcodedReservations.map((res) => {
      const [year, month, day] = res.date.split('-').map(Number);
      const [startHour, startMinute] = res.start_time.split(':').map(Number);
      const [endHour, endMinute] = res.end_time.split(':').map(Number);

      return {
        title: `Court Reserved - ${res.court}`,
        start: new Date(year, month - 1, day, startHour, startMinute),
        end: new Date(year, month - 1, day, endHour, endMinute),
        resource: {
          court: res.court,
          isReserved: true,
        },
      };
    });
  }, []);

  const handleSelectSlot = (slotInfo: { start: Date; end: Date }) => {
    const startTime = format(slotInfo.start, 'HH:mm');
    const endTime = format(slotInfo.end, 'HH:mm');
    
    setSelectedSlot({
      court: 'Court A', // Default court, in real app would select from UI
      date: slotInfo.start,
      startTime,
      endTime,
    });
    setModalOpen(true);
  };

  const handleConfirmBooking = (reservation: {
    court: string;
    date: string;
    startTime: string;
    endTime: string;
    credits: number;
  }) => {
    // In real app, this would add to sessions
    const existingSessions = JSON.parse(localStorage.getItem('sessions') || '[]');
    localStorage.setItem('sessions', JSON.stringify([...existingSessions, reservation]));
    alert('Session added! View it in "My Sessions"');
  };

  const handleNavigate = (direction: 'prev' | 'next') => {
    setCurrentDate((prev) => (direction === 'next' ? addWeeks(prev, 1) : subWeeks(prev, 1)));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Court Bay Availability</h1>
          <p className="text-gray-600">Select an available time slot to book a court</p>
        </div>

        {/* Week Navigation */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex items-center justify-between">
          <button
            onClick={() => handleNavigate('prev')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Previous Week
          </button>
          <div className="text-center">
            <p className="text-sm text-gray-600 font-medium">Current Week</p>
            <p className="text-xl font-bold text-gray-900">
              {format(startOfWeek(currentDate, { weekStartsOn: 1 }), 'MMM d')} -{' '}
              {format(addWeeks(startOfWeek(currentDate, { weekStartsOn: 1 }), 1), 'MMM d, yyyy')}
            </p>
          </div>
          <button
            onClick={() => handleNavigate('next')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Next Week
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Calendar */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            view="week"
            views={['week']}
            date={currentDate}
            onNavigate={setCurrentDate}
            onSelectSlot={handleSelectSlot}
            selectable
            min={new Date(0, 0, 0, 8, 0, 0)}
            max={new Date(0, 0, 0, 20, 0, 0)}
            step={60}
            timeslots={1}
            style={{ height: 600 }}
            eventPropGetter={() => ({
              style: {
                backgroundColor: '#9CA3AF',
                borderColor: '#6B7280',
                color: '#FFFFFF',
                borderRadius: '8px',
                border: 'none',
              },
            })}
          />
        </div>

        {/* Legend */}
        <div className="mt-6 bg-white rounded-xl shadow-sm p-4 flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-400 rounded"></div>
            <span className="text-sm text-gray-700 font-medium">Reserved</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-white border-2 border-blue-600 rounded"></div>
            <span className="text-sm text-gray-700 font-medium">Available - Click to Book</span>
          </div>
        </div>
      </div>

      {selectedSlot && (
        <BookingModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          court={selectedSlot.court}
          date={selectedSlot.date}
          startTime={selectedSlot.startTime}
          endTime={selectedSlot.endTime}
          onConfirm={handleConfirmBooking}
        />
      )}
    </div>
  );
}

