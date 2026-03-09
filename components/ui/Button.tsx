'use client';

import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?:    'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const BASE = [
  'inline-flex items-center justify-center gap-2',
  'font-semibold rounded-xl',
  'transition-all duration-150 ease-in-out',
  'disabled:opacity-50 disabled:cursor-not-allowed',
  'focus:outline-none focus:ring-2 focus:ring-offset-2',
].join(' ');

const VARIANTS = {
  primary:   'bg-orange-500 text-white hover:bg-orange-600 active:scale-95 shadow-sm shadow-orange-200 focus:ring-orange-400',
  secondary: 'bg-stone-100 text-stone-700 border border-stone-200 hover:bg-stone-200 active:scale-95 focus:ring-stone-300',
  ghost:     'bg-transparent text-stone-600 hover:bg-stone-100 active:scale-95 focus:ring-stone-300',
  danger:    'bg-red-500 text-white hover:bg-red-600 active:scale-95 shadow-sm shadow-red-200 focus:ring-red-400',
};

const SIZES = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-6 py-3.5 text-base',
};

export default function Button({
  variant  = 'primary',
  size     = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${BASE} ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
