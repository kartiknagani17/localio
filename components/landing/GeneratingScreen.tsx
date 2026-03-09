'use client';

import { useEffect, useState } from 'react';

const STEPS = [
  { icon: '📋', text: 'Reading your business details...',    durationMs: 2800 },
  { icon: '✨', text: 'Writing your website copy...',        durationMs: 3000 },
  { icon: '🎨', text: 'Selecting the perfect design...',     durationMs: 2600 },
  { icon: '🖼️', text: 'Laying out every section...',        durationMs: 2800 },
  { icon: '🚀', text: 'Almost ready — putting it together...',durationMs: 99999 },
];

export default function GeneratingScreen() {
  const [stepIndex,  setStepIndex]  = useState(0);
  const [textVisible, setTextVisible] = useState(true);
  const [progress,   setProgress]   = useState(0);

  /* Advance through steps */
  useEffect(() => {
    if (stepIndex >= STEPS.length - 1) return;
    const dur = STEPS[stepIndex].durationMs;
    const timer = setTimeout(() => {
      setTextVisible(false);
      setTimeout(() => {
        setStepIndex(i => i + 1);
        setTextVisible(true);
      }, 350);
    }, dur);
    return () => clearTimeout(timer);
  }, [stepIndex]);

  /* Animated progress bar */
  useEffect(() => {
    const totalSteps    = STEPS.length;
    const targetPct     = ((stepIndex + 1) / totalSteps) * 90; // caps at 90% until done
    const step          = (targetPct - progress) / 20;
    const interval = setInterval(() => {
      setProgress(p => {
        const next = p + step;
        if (Math.abs(next - targetPct) < 0.5) return targetPct;
        return next;
      });
    }, 50);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepIndex]);

  const completedCount = stepIndex;

  return (
    <div style={{
      position:       'fixed',
      inset:          0,
      zIndex:         400,
      display:        'flex',
      flexDirection:  'column',
      alignItems:     'center',
      justifyContent: 'center',
      background:     '#FFFFFF',
      padding:        '24px',
    }}>

      {/* Subtle background circles */}
      <div aria-hidden style={{
        position: 'absolute', top: '10%', right: '10%',
        width: 300, height: 300, borderRadius: '50%',
        background: 'radial-gradient(circle, #FFF0E6 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />
      <div aria-hidden style={{
        position: 'absolute', bottom: '10%', left: '8%',
        width: 220, height: 220, borderRadius: '50%',
        background: 'radial-gradient(circle, #FEF9F5 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />

      {/* Logo */}
      <div style={{ marginBottom: 40, position: 'relative', zIndex: 1 }}>
        <span style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.03em', color: '#111' }}>
          Localio
        </span>
      </div>

      {/* Animated spinner */}
      <div style={{
        position:    'relative',
        width:       72,
        height:      72,
        marginBottom: 36,
      }}>
        {/* Outer ring */}
        <div style={{
          position:     'absolute',
          inset:        0,
          borderRadius: '50%',
          border:       '3px solid #F3EDE6',
        }} />
        {/* Spinning arc */}
        <div style={{
          position:     'absolute',
          inset:        0,
          borderRadius: '50%',
          border:       '3px solid transparent',
          borderTopColor: '#E8581A',
          borderRightColor: '#F97316',
          animation:    'spin 0.9s linear infinite',
        }} />
        {/* Step icon in center */}
        <div style={{
          position:       'absolute',
          inset:          0,
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          fontSize:       26,
          transition:     'opacity 0.35s ease',
          opacity:        textVisible ? 1 : 0,
        }}>
          {STEPS[stepIndex].icon}
        </div>
      </div>

      {/* Step text */}
      <div style={{
        height:    32,
        display:   'flex',
        alignItems: 'center',
        marginBottom: 32,
      }}>
        <p style={{
          fontSize:   17,
          fontWeight: 600,
          color:      '#374151',
          margin:     0,
          textAlign:  'center',
          transition: 'opacity 0.35s ease, transform 0.35s ease',
          opacity:    textVisible ? 1 : 0,
          transform:  textVisible ? 'translateY(0)' : 'translateY(6px)',
        }}>
          {STEPS[stepIndex].text}
        </p>
      </div>

      {/* Progress bar */}
      <div style={{
        width:        min(360, '90vw'),
        height:       6,
        background:   '#F3EDE6',
        borderRadius: 3,
        overflow:     'hidden',
        marginBottom: 20,
      }}>
        <div style={{
          height:       '100%',
          width:        `${progress}%`,
          background:   'linear-gradient(90deg, #E8581A 0%, #F97316 100%)',
          borderRadius: 3,
          transition:   'width 0.3s ease',
        }} />
      </div>

      {/* Step indicators */}
      <div style={{
        display:    'flex',
        gap:        8,
        alignItems: 'center',
      }}>
        {STEPS.map((s, i) => (
          <div
            key={s.text}
            style={{
              width:        i === stepIndex ? 20 : 7,
              height:       7,
              borderRadius: 4,
              background:   i < completedCount
                ? '#E8581A'
                : i === stepIndex
                  ? 'linear-gradient(90deg, #E8581A, #F97316)'
                  : '#E5E7EB',
              transition: 'all 0.35s ease',
            }}
          />
        ))}
      </div>

      {/* Encouraging note */}
      <p style={{
        fontSize:   13,
        color:      '#9CA3AF',
        marginTop:  28,
        textAlign:  'center',
        maxWidth:   280,
        lineHeight: 1.6,
      }}>
        We&apos;re building your full website — hang tight, it&apos;ll be worth it! 🎉
      </p>

    </div>
  );
}

/* small helper to avoid Math.min in the JSX width */
function min(a: number, b: string) { return `min(${a}px, ${b})`; }
