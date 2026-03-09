'use client';

import { BusinessHours } from '@/templates/types';

interface HoursFieldProps {
  value: BusinessHours | undefined;
  onChange: (hours: BusinessHours) => void;
}

const FIELDS: { key: keyof BusinessHours; label: string; placeholder: string }[] = [
  { key: 'weekdays', label: 'Weekdays', placeholder: 'Mon - Fri: 9am - 5pm' },
  { key: 'saturday', label: 'Saturday', placeholder: 'Sat: 10am - 3pm' },
  { key: 'sunday',   label: 'Sunday',   placeholder: 'Closed' },
];

export default function HoursField({ value, onChange }: HoursFieldProps) {
  const hours = value ?? {};

  const update = (key: keyof BusinessHours, val: string) => {
    onChange({ ...hours, [key]: val });
  };

  return (
    <div className="space-y-2">
      {FIELDS.map(f => (
        <div key={f.key} className="flex items-center gap-2">
          <label className="w-20 text-xs text-gray-500 shrink-0">{f.label}</label>
          <input
            type="text"
            value={hours[f.key] ?? ''}
            onChange={e => update(f.key, e.target.value)}
            placeholder={f.placeholder}
            className="flex-1 px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-orange-500"
          />
        </div>
      ))}
    </div>
  );
}
