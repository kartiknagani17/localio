'use client';

interface SpinnerProps {
  size?:  number;
  color?: string;
  className?: string;
}

export default function Spinner({ size = 24, color = '#E8581A', className = '' }: SpinnerProps) {
  return (
    <div
      className={className}
      style={{
        width:        size,
        height:       size,
        borderRadius: '50%',
        border:       `2.5px solid ${color}22`,
        borderTopColor: color,
        animation:    'spin 0.8s linear infinite',
        flexShrink:   0,
      }}
    />
  );
}
