'use client';

import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?:   string;
  error?:   string;
  hint?:    string;
}

export default function Input({ label, error, hint, className = '', id, ...props }: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-semibold text-stone-700 mb-1.5 tracking-tight"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={[
          'w-full px-4 py-3 text-sm',
          'border rounded-xl',
          'bg-white text-stone-800 placeholder:text-stone-400',
          'outline-none transition-all duration-150',
          error
            ? 'border-red-400 ring-2 ring-red-100'
            : 'border-stone-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100',
          className,
        ].join(' ')}
        {...props}
      />
      {error && (
        <p className="mt-1.5 text-xs font-medium text-red-500">{error}</p>
      )}
      {hint && !error && (
        <p className="mt-1.5 text-xs text-stone-400">{hint}</p>
      )}
    </div>
  );
}
