'use client';

import { FAQ } from '@/templates/types';

interface FaqListFieldProps {
  value: FAQ[];
  onChange: (faq: FAQ[]) => void;
}

const EMPTY_FAQ: FAQ = { q: '', a: '' };

export default function FaqListField({ value, onChange }: FaqListFieldProps) {
  const faqItems = value ?? [];

  const update = (index: number, field: keyof FAQ, val: string) => {
    const next = [...faqItems];
    next[index] = { ...next[index], [field]: val };
    onChange(next);
  };

  const add = () => onChange([...faqItems, { ...EMPTY_FAQ }]);

  const remove = (index: number) => onChange(faqItems.filter((_, i) => i !== index));

  return (
    <div className="space-y-3">
      {faqItems.map((f, i) => (
        <div key={i} className="p-3 bg-gray-50 rounded-lg space-y-2">
          <div className="flex items-start gap-2">
            <input
              type="text"
              value={f.q}
              onChange={e => update(i, 'q', e.target.value)}
              placeholder="Question"
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
          <textarea
            value={f.a}
            onChange={e => update(i, 'a', e.target.value)}
            placeholder="Answer"
            rows={2}
            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 resize-none"
          />
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-orange-400 hover:text-orange-600 transition"
      >
        + Add FAQ
      </button>
    </div>
  );
}
