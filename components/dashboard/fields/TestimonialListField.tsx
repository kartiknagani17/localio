'use client';

import { Testimonial } from '@/templates/types';

interface TestimonialListFieldProps {
  value: Testimonial[];
  onChange: (testimonials: Testimonial[]) => void;
}

const EMPTY_TESTIMONIAL: Testimonial = { name: '', text: '', rating: 5, context: '' };

export default function TestimonialListField({ value, onChange }: TestimonialListFieldProps) {
  const testimonials = value ?? [];

  const update = (index: number, field: keyof Testimonial, val: string | number) => {
    const next = [...testimonials];
    next[index] = { ...next[index], [field]: val };
    onChange(next);
  };

  const add = () => onChange([...testimonials, { ...EMPTY_TESTIMONIAL }]);

  const remove = (index: number) => onChange(testimonials.filter((_, i) => i !== index));

  return (
    <div className="space-y-3">
      {testimonials.map((t, i) => (
        <div key={i} className="p-3 bg-gray-50 rounded-lg space-y-2">
          <div className="flex items-start gap-2">
            <input
              type="text"
              value={t.name}
              onChange={e => update(i, 'name', e.target.value)}
              placeholder="Reviewer name"
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
          <div className="flex gap-2 items-center">
            <label className="text-xs text-gray-500">Rating:</label>
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  onClick={() => update(i, 'rating', star)}
                  className={`text-lg ${star <= t.rating ? 'text-orange-500' : 'text-gray-300'}`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
          <input
            type="text"
            value={t.context ?? ''}
            onChange={e => update(i, 'context', e.target.value)}
            placeholder="Context (e.g. BMW M4 — Full Detail)"
            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-orange-500"
          />
          <textarea
            value={t.text}
            onChange={e => update(i, 'text', e.target.value)}
            placeholder="Review text"
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
        + Add testimonial
      </button>
    </div>
  );
}
