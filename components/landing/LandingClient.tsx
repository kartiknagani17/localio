'use client';

import { useState } from 'react';
import Hero from './Hero';
import QuickForm from './QuickForm';

export default function LandingClient() {
  const [formOpen, setFormOpen] = useState(false);

  return (
    <>
      {/* Fixed login button — sits above the Hero at all times */}
      <nav style={{
        position:   'fixed',
        top:        0,
        right:      0,
        zIndex:     1000,
        padding:    '16px 24px',
        display:    'flex',
        alignItems: 'center',
        gap:        12,
      }}>
        <a
          href="/dashboard"
          style={{
            padding:      '8px 18px',
            background:   'rgba(255,255,255,0.12)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            border:       '1px solid rgba(255,255,255,0.2)',
            borderRadius: 999,
            fontSize:     13,
            fontWeight:   600,
            color:        '#fff',
            textDecoration: 'none',
            transition:   'background 0.15s',
            fontFamily:   "var(--font-jakarta, 'Plus Jakarta Sans', sans-serif)",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.22)'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.12)'; }}
        >
          Log in
        </a>
      </nav>

      <Hero onCTAClick={() => setFormOpen(true)} />
      {formOpen && <QuickForm onClose={() => setFormOpen(false)} />}
    </>
  );
}
