'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-blue-600">Blazing Paddles</h1>
          </div>
          <div className="flex space-x-4">
            <Link
              href="/availability"
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                pathname === '/availability'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
              }`}
            >
              Court Availability
            </Link>
            <Link
              href="/sessions"
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                pathname === '/sessions'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
              }`}
            >
              My Sessions
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

