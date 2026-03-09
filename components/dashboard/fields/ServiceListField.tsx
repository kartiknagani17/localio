'use client';

import { ServiceItem } from '@/templates/types';

interface ServiceListFieldProps {
  value: ServiceItem[];
  onChange: (services: ServiceItem[]) => void;
}

const EMPTY_SERVICE: ServiceItem = { name: '', price: '', duration: '', description: '' };

export default function ServiceListField({ value, onChange }: ServiceListFieldProps) {
  const services = value ?? [];

  const update = (index: number, field: keyof ServiceItem, val: string) => {
    const next = [...services];
    next[index] = { ...next[index], [field]: val };
    onChange(next);
  };

  const add = () => onChange([...services, { ...EMPTY_SERVICE }]);

  const remove = (index: number) => onChange(services.filter((_, i) => i !== index));

  return (
    <div className="space-y-3">
      {services.map((s, i) => (
        <div key={i} className="p-3 bg-gray-50 rounded-lg space-y-2">
          <div className="flex items-start gap-2">
            <input
              type="text"
              value={s.name}
              onChange={e => update(i, 'name', e.target.value)}
              placeholder="Service name"
              className="flex-1 px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-orange-500"
            />
            <button
              type="button"
              onClick={() => remove(i)}
              className="text-red-400 hover:text-red-600 text-xs px-2 py-1.5"
            >
              Remove
            </button>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={s.price ?? ''}
              onChange={e => update(i, 'price', e.target.value)}
              placeholder="Price"
              className="w-24 px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-orange-500"
            />
            <input
              type="text"
              value={s.duration ?? ''}
              onChange={e => update(i, 'duration', e.target.value)}
              placeholder="Duration"
              className="w-28 px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <input
            type="text"
            value={s.description ?? ''}
            onChange={e => update(i, 'description', e.target.value)}
            placeholder="Short description"
            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-orange-500"
          />
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-orange-400 hover:text-orange-600 transition"
      >
        + Add service
      </button>
    </div>
  );
}
