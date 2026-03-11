'use client';

import { useEffect, useState } from 'react';

interface Props {
  businessName?: string;
}

const STEPS = [
  { text: 'Reading your business details…',      durationMs: 2500  },
  { text: 'Writing headlines and tagline…',      durationMs: 3200  },
  { text: 'Crafting your services section…',     durationMs: 2800  },
  { text: 'Generating reviews and about copy…',  durationMs: 2800  },
  { text: 'Putting the final touches together…', durationMs: 99999 },
];

// ── Animated phone mockup ────────────────────────────────────────────────────

function reveal(shown: boolean, delay = '0s'): React.CSSProperties {
  return {
    opacity:    shown ? 1 : 0,
    transform:  shown ? 'translateY(0px)' : 'translateY(10px)',
    transition: `opacity 0.75s ease ${delay}, transform 0.75s ease ${delay}`,
  };
}

function PhoneMockup({ stepIndex }: { stepIndex: number }) {
  return (
    <svg
      width="200"
      height="368"
      viewBox="0 0 200 368"
      style={{ display: 'block', overflow: 'visible' }}
      aria-hidden
    >
      <defs>
        <linearGradient id="gs-cta-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#B45309" />
          <stop offset="100%" stopColor="#EA580C" />
        </linearGradient>
      </defs>

      {/* Phone body */}
      <rect x="1" y="1" width="198" height="366" rx="22" fill="#1A1F2E" stroke="#2D3748" strokeWidth="1.5" />
      {/* Status bar notch */}
      <rect x="70" y="6" width="60" height="5" rx="2.5" fill="#2D3748" />

      {/* ── Nav — always visible ── */}
      <rect x="1" y="16" width="198" height="28" fill="#0F172A" />
      <circle cx="18" cy="30" r="6" fill="#F97316" />
      <rect x="30" y="26" width="38" height="8" rx="3" fill="rgba(255,255,255,0.55)" />
      <rect x="112" y="27" width="18" height="6" rx="2" fill="rgba(255,255,255,0.18)" />
      <rect x="135" y="27" width="18" height="6" rx="2" fill="rgba(255,255,255,0.18)" />
      <rect x="158" y="22" width="34" height="16" rx="5" fill="#F97316" />

      {/* ── Hero — step 1 ── */}
      <g style={reveal(stepIndex >= 1, '0s')}>
        <rect x="1" y="44" width="198" height="90" fill="#1E293B" />
        {/* Decorative glow circles */}
        <circle cx="162" cy="82" r="36" fill="rgba(249,115,22,0.09)" />
        <circle cx="162" cy="82" r="22" fill="rgba(249,115,22,0.13)" />
        {/* Headline */}
        <rect x="14" y="58" width="112" height="12" rx="4" fill="rgba(255,255,255,0.90)" />
        <rect x="14" y="75" width="80"  height="8"  rx="3" fill="rgba(255,255,255,0.40)" />
        <rect x="14" y="87" width="58"  height="6"  rx="2" fill="rgba(255,255,255,0.20)" />
        {/* CTAs */}
        <rect x="14" y="100" width="62" height="20" rx="6" fill="#F97316" />
        <rect x="82" y="100" width="52" height="20" rx="6" fill="none" stroke="rgba(255,255,255,0.26)" strokeWidth="1.5" />
      </g>

      {/* ── Services — step 2 ── */}
      <g style={reveal(stepIndex >= 2, '0.10s')}>
        <rect x="1" y="134" width="198" height="74" fill="#0D1117" />
        {/* Section label */}
        <rect x="14" y="142" width="54" height="7" rx="3" fill="rgba(255,255,255,0.52)" />
        {/* Card 1 */}
        <rect x="10"  y="154" width="54" height="48" rx="6" fill="#1E293B" />
        <rect x="10"  y="154" width="54" height="4"  rx="3" fill="#F97316" opacity="0.85" />
        <rect x="14"  y="164" width="36" height="5"  rx="2" fill="rgba(255,255,255,0.50)" />
        <rect x="14"  y="173" width="28" height="4"  rx="2" fill="rgba(255,255,255,0.22)" />
        <rect x="14"  y="181" width="34" height="4"  rx="2" fill="rgba(255,255,255,0.12)" />
        {/* Card 2 */}
        <rect x="73"  y="154" width="54" height="48" rx="6" fill="#1E293B" />
        <rect x="73"  y="154" width="54" height="4"  rx="3" fill="#F97316" opacity="0.85" />
        <rect x="77"  y="164" width="36" height="5"  rx="2" fill="rgba(255,255,255,0.50)" />
        <rect x="77"  y="173" width="28" height="4"  rx="2" fill="rgba(255,255,255,0.22)" />
        <rect x="77"  y="181" width="34" height="4"  rx="2" fill="rgba(255,255,255,0.12)" />
        {/* Card 3 */}
        <rect x="136" y="154" width="54" height="48" rx="6" fill="#1E293B" />
        <rect x="136" y="154" width="54" height="4"  rx="3" fill="#F97316" opacity="0.85" />
        <rect x="140" y="164" width="36" height="5"  rx="2" fill="rgba(255,255,255,0.50)" />
        <rect x="140" y="173" width="28" height="4"  rx="2" fill="rgba(255,255,255,0.22)" />
        <rect x="140" y="181" width="34" height="4"  rx="2" fill="rgba(255,255,255,0.12)" />
      </g>

      {/* ── Testimonials — step 3 ── */}
      <g style={reveal(stepIndex >= 3, '0.15s')}>
        <rect x="1" y="208" width="198" height="80" fill="#111827" />
        {/* Section label */}
        <rect x="14" y="216" width="54" height="7" rx="3" fill="rgba(255,255,255,0.52)" />
        {/* Stars */}
        {[0,1,2,3,4].map(i => (
          <rect key={i} x={14 + i * 11} y="228" width="8" height="8" rx="2" fill="#F59E0B" opacity="0.95" />
        ))}
        {/* Review text */}
        <rect x="14" y="242" width="148" height="5" rx="2" fill="rgba(255,255,255,0.30)" />
        <rect x="14" y="251" width="100" height="5" rx="2" fill="rgba(255,255,255,0.16)" />
        {/* Reviewer chip */}
        <circle cx="18" cy="270" r="7" fill="#2D3748" />
        <rect x="30"  y="266" width="52" height="5" rx="2" fill="rgba(255,255,255,0.32)" />
        <rect x="30"  y="275" width="36" height="4" rx="2" fill="rgba(255,255,255,0.16)" />
      </g>

      {/* ── CTA banner — step 4 ── */}
      <g style={reveal(stepIndex >= 4, '0.20s')}>
        <rect x="1" y="288" width="198" height="62" fill="url(#gs-cta-grad)" />
        <rect x="14" y="298" width="92" height="10" rx="4" fill="rgba(255,255,255,0.92)" />
        <rect x="14" y="313" width="66" height="7"  rx="3" fill="rgba(255,255,255,0.50)" />
        <rect x="14" y="327" width="80" height="18" rx="5" fill="rgba(255,255,255,0.16)" />
        <rect x="102" y="327" width="80" height="18" rx="5" fill="#fff" opacity="0.92" />
      </g>

      {/* Home indicator */}
      <rect x="75" y="356" width="50" height="4" rx="2" fill="#2D3748" />

      {/* Frame border overlay (keeps border crisp above content) */}
      <rect x="1" y="1" width="198" height="366" rx="22" fill="none" stroke="#374151" strokeWidth="1" />
    </svg>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function GeneratingScreen({ businessName }: Props) {
  const [stepIndex, setStepIndex] = useState(0);
  const [visible,   setVisible]   = useState(true);

  useEffect(() => {
    if (stepIndex >= STEPS.length - 1) return;
    const t = setTimeout(() => {
      setVisible(false);
      setTimeout(() => { setStepIndex(i => i + 1); setVisible(true); }, 350);
    }, STEPS[stepIndex].durationMs);
    return () => clearTimeout(t);
  }, [stepIndex]);

  const progress = Math.min(((stepIndex + 0.6) / STEPS.length) * 92, 92);

  return (
    <div style={{
      position:       'fixed',
      inset:          0,
      zIndex:         400,
      background:     '#0D0F14',
      display:        'flex',
      flexDirection:  'column',
      alignItems:     'center',
      justifyContent: 'center',
      padding:        '24px',
      overflow:       'hidden',
      fontFamily:     'system-ui, -apple-system, sans-serif',
    }}>
      <style suppressHydrationWarning>{`
        @keyframes gs-spin  { to { transform: rotate(360deg); } }
        @keyframes gs-pulse { 0%,100% { opacity: 0.4; transform: scale(1); } 50% { opacity: 0.75; transform: scale(1.08); } }
        @keyframes gs-float { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-8px); } }
        @keyframes gs-in    { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* Ambient glow orbs */}
      <div aria-hidden style={{
        position: 'absolute', top: '6%', right: '8%',
        width: 380, height: 380, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(249,115,22,0.14) 0%, transparent 68%)',
        animation: 'gs-pulse 5s ease-in-out infinite',
        pointerEvents: 'none',
      }} />
      <div aria-hidden style={{
        position: 'absolute', bottom: '8%', left: '4%',
        width: 280, height: 280, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(249,115,22,0.08) 0%, transparent 68%)',
        animation: 'gs-pulse 6s ease-in-out infinite 1.5s',
        pointerEvents: 'none',
      }} />

      {/* Logo */}
      <div style={{ marginBottom: 24, zIndex: 1, animation: 'gs-in 0.5s ease both' }}>
        <span style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.04em', color: '#fff' }}>
          Local<span style={{ color: '#F97316' }}>io</span>
        </span>
      </div>

      {/* Headline */}
      <div style={{ textAlign: 'center', marginBottom: 28, zIndex: 1, animation: 'gs-in 0.55s ease 0.08s both' }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: '#fff', margin: '0 0 7px', letterSpacing: '-0.03em', lineHeight: 1.2 }}>
          {businessName
            ? <>Building <span style={{ color: '#F97316' }}>{businessName}</span>&apos;s website</>
            : 'Building your website…'}
        </h2>
        <p style={{ fontSize: 13, color: '#6B7280', margin: 0 }}>
          Powered by AI · Takes about 30 seconds
        </p>
      </div>

      {/* Floating phone mockup */}
      <div style={{
        zIndex: 1,
        animation: 'gs-float 4s ease-in-out infinite',
        filter: 'drop-shadow(0 24px 48px rgba(0,0,0,0.65))',
        marginBottom: 30,
      }}>
        <PhoneMockup stepIndex={stepIndex} />
      </div>

      {/* Step text + mini spinner */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        marginBottom: 14, minHeight: 24, zIndex: 1,
      }}>
        <div style={{
          width: 13, height: 13, borderRadius: '50%', flexShrink: 0,
          border: '2px solid rgba(249,115,22,0.22)',
          borderTopColor: '#F97316',
          animation: 'gs-spin 0.85s linear infinite',
        }} />
        <span style={{
          fontSize: 14, fontWeight: 500, color: '#D1D5DB',
          transition: 'opacity 0.32s ease, transform 0.32s ease',
          opacity:   visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(5px)',
        }}>
          {STEPS[stepIndex].text}
        </span>
      </div>

      {/* Progress bar */}
      <div style={{
        width: clamp(320), height: 3,
        background: 'rgba(255,255,255,0.06)',
        borderRadius: 2, overflow: 'hidden',
        marginBottom: 22, zIndex: 1,
      }}>
        <div style={{
          height: '100%',
          width: `${progress}%`,
          background: 'linear-gradient(90deg, #EA580C 0%, #F97316 60%, #FB923C 100%)',
          borderRadius: 2,
          transition: 'width 0.9s cubic-bezier(0.4,0,0.2,1)',
          boxShadow: '0 0 10px rgba(249,115,22,0.65)',
        }} />
      </div>

      {/* Trust signals */}
      <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', justifyContent: 'center', zIndex: 1 }}>
        {['No credit card', 'Fully editable', 'Live in minutes'].map((label, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span style={{ fontSize: 12, color: '#6B7280' }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function clamp(px: number) { return `min(${px}px, 88vw)`; }
