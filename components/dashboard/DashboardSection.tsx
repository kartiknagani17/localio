'use client';

import { useState, ReactNode } from 'react';

interface DashboardSectionProps {
  title: string;
  icon: ReactNode;
  defaultOpen?: boolean;
  children: ReactNode;
}

export default function DashboardSection({
  title,
  icon,
  defaultOpen = false,
  children,
}: DashboardSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-200">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition text-left"
      >
        <span className="text-orange-500 shrink-0 flex items-center">{icon}</span>
        <span className="flex-1 font-medium text-gray-800 text-sm">{title}</span>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        className="overflow-hidden transition-all duration-200 ease-in-out"
        style={{ maxHeight: isOpen ? '2000px' : '0' }}
      >
        <div className="px-4 pb-4 space-y-3">{children}</div>
      </div>
    </div>
  );
}
