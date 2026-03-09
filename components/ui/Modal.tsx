'use client';

import { ReactNode, useEffect, useState } from 'react';

interface ModalProps {
  isOpen:   boolean;
  onClose:  () => void;
  children: ReactNode;
  title?:   string;
  maxWidth?: number;
}

export default function Modal({ isOpen, onClose, children, title, maxWidth = 560 }: ModalProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => setVisible(true));
      document.body.style.overflow = 'hidden';
    } else {
      setVisible(false);
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position:       'fixed',
        inset:          0,
        zIndex:         300,
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        padding:        '16px',
      }}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        aria-hidden
        style={{
          position:   'absolute',
          inset:      0,
          background: 'rgba(17,17,17,0.45)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          transition: 'opacity 0.3s ease',
          opacity:    visible ? 1 : 0,
        }}
      />

      {/* Panel */}
      <div
        style={{
          position:     'relative',
          background:   '#FFFFFF',
          borderRadius: 20,
          width:        '100%',
          maxWidth:     maxWidth,
          maxHeight:    '90vh',
          overflow:     'hidden',
          display:      'flex',
          flexDirection: 'column',
          boxShadow:    '0 24px 64px rgba(0,0,0,0.14)',
          transform:    visible ? 'translateY(0) scale(1)' : 'translateY(16px) scale(0.97)',
          opacity:      visible ? 1 : 0,
          transition:   'transform 0.35s cubic-bezier(0.34,1.1,0.64,1), opacity 0.25s ease',
        }}
      >
        {/* Header */}
        <div style={{
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'space-between',
          padding:        '18px 22px',
          borderBottom:   '1px solid #F3EDE6',
          flexShrink:     0,
        }}>
          {title
            ? <h2 style={{ fontSize: 16, fontWeight: 700, color: '#111', margin: 0, letterSpacing: '-0.02em' }}>{title}</h2>
            : <div />
          }
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            style={{
              width:          32,
              height:         32,
              borderRadius:   '50%',
              border:         '1.5px solid #E5E7EB',
              background:     '#FAFAF8',
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
              cursor:         'pointer',
              transition:     'background 0.15s',
              marginLeft:     8,
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#F3F0ED'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#FAFAF8'; }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6"  x2="6"  y2="18" />
              <line x1="6"  y1="6"  x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div style={{ overflowY: 'auto', flex: 1, padding: '20px 22px' }}>
          {children}
        </div>
      </div>
    </div>
  );
}
