'use client';

import { useState, KeyboardEvent } from 'react';

interface TagListFieldProps {
  label: string;
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}

export default function TagListField({ label, value, onChange, placeholder }: TagListFieldProps) {
  const tags = value ?? [];
  const [input, setInput] = useState('');

  const add = () => {
    const trimmed = input.trim();
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
      setInput('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      add();
    }
  };

  const remove = (index: number) => onChange(tags.filter((_, i) => i !== index));

  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
      <div className="flex flex-wrap gap-1.5 mb-2">
        {tags.map((tag, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1 px-2.5 py-1 bg-orange-50 text-orange-700 rounded-full text-xs"
          >
            {tag}
            <button
              type="button"
              onClick={() => remove(i)}
              className="text-orange-400 hover:text-orange-700"
            >
              &times;
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder ?? 'Type and press Enter'}
          className="flex-1 px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-orange-500"
        />
        <button
          type="button"
          onClick={add}
          disabled={!input.trim()}
          className="px-3 py-1.5 text-sm bg-gray-100 rounded hover:bg-gray-200 transition disabled:opacity-50"
        >
          Add
        </button>
      </div>
    </div>
  );
}
