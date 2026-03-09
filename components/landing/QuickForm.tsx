'use client';

import { useState, useEffect, useRef } from 'react';
import GeneratingScreen from './GeneratingScreen';

const BUSINESS_TYPES = [
  { value: 'car_detailer',  label: 'Car Detailer'  },
  { value: 'hair_salon',    label: 'Hair Salon'    },
  { value: 'barbershop',    label: 'Barbershop'    },
  { value: 'restaurant',    label: 'Restaurant'    },
  { value: 'cafe',          label: 'Café'          },
  { value: 'plumber',       label: 'Plumber'       },
  { value: 'electrician',   label: 'Electrician'   },
  { value: 'landscaper',    label: 'Landscaper'    },
  { value: 'contractor',    label: 'Contractor'    },
  { value: 'gym',           label: 'Gym / Fitness' },
  { value: 'yoga_studio',   label: 'Yoga / Pilates'},
  { value: 'cleaner',       label: 'Cleaning'      },
  { value: 'spa',           label: 'Spa / Massage' },
  { value: 'dentist',       label: 'Dentist'       },
  { value: 'other',         label: 'Other'         },
];

function BizIcon({ type }: { type: string }) {
  const p = {
    width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none',
    stroke: '#E8581A', strokeWidth: 2,
    strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const,
    style: { flexShrink: 0, display: 'block' },
  };
  switch (type) {
    case 'car_detailer':
      return <svg {...p}><path d="M5 17H3a2 2 0 0 1-2-2V9l3-4h14l3 4v6a2 2 0 0 1-2 2h-2"/><line x1="9" y1="17" x2="15" y2="17"/><circle cx="7.5" cy="17.5" r="2.5"/><circle cx="16.5" cy="17.5" r="2.5"/></svg>;
    case 'hair_salon':
      return <svg {...p}><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/></svg>;
    case 'barbershop':
      return <svg {...p}><rect x="2" y="9" width="20" height="6" rx="2"/><line x1="7" y1="9" x2="7" y2="15"/><line x1="12" y1="9" x2="12" y2="15"/><line x1="17" y1="9" x2="17" y2="15"/></svg>;
    case 'restaurant':
      return <svg {...p}><path d="M3 2v7c0 1.1.9 2 2 2 1.1 0 2-.9 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6h5z"/><path d="M21 15v7"/></svg>;
    case 'cafe':
      return <svg {...p}><path d="M17 8h1a4 4 0 0 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8z"/><line x1="6" y1="2" x2="6" y2="5"/><line x1="10" y1="2" x2="10" y2="5"/><line x1="14" y1="2" x2="14" y2="5"/></svg>;
    case 'plumber':
      return <svg {...p}><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>;
    case 'electrician':
      return <svg {...p}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>;
    case 'landscaper':
      return <svg {...p}><path d="M17 8C8 10 5.9 16.17 3.82 20.4"/><path d="M10.62 11.05C7.45 12.3 5.4 15.8 3.82 20.4"/><path d="M20 3s-8 0-12 6c2-1 4-2 7-2-3 3-5 7-5 7"/></svg>;
    case 'contractor':
      return <svg {...p}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
    case 'gym':
      return <svg {...p}><line x1="6" y1="12" x2="18" y2="12"/><line x1="4" y1="8" x2="4" y2="16"/><line x1="2" y1="9" x2="2" y2="15"/><line x1="20" y1="8" x2="20" y2="16"/><line x1="22" y1="9" x2="22" y2="15"/></svg>;
    case 'yoga_studio':
      return <svg {...p}><circle cx="12" cy="4" r="2"/><path d="M6 18l1.5-5L12 16l4.5-3L18 18"/><path d="M6.5 11c1.5-1.5 3.5-2 5.5-2s4 .5 5.5 2"/></svg>;
    case 'cleaner':
      return <svg {...p}><path d="M3 6l3-3 9 9-3 3L3 6z"/><path d="M15 3l3 3"/><path d="M9 15l-3 3a2 2 0 0 0 3 3l3-3"/></svg>;
    case 'spa':
      return <svg {...p}><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>;
    case 'dentist':
      return <svg {...p}><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>;
    case 'other':
    default:
      return <svg {...p}><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>;
  }
}

interface StepConfig {
  stepLabel: string;
  title: string;
  subtitle: string;
  placeholder?: string;
  tip?: string;
}

const STEP_CONFIG: StepConfig[] = [
  {
    stepLabel: 'Step 1 of 3',
    title: "What's your business called?",
    subtitle: "This becomes your site's main headline — use the name your customers know.",
    placeholder: 'e.g. Apex Auto Detailing',
    tip: '💡 Use your full business name, exactly how customers know it.',
  },
  {
    stepLabel: 'Step 2 of 3',
    title: 'Which city are you based in?',
    subtitle: "We'll tailor your site to attract local customers in your area.",
    placeholder: 'e.g. Boston, MA',
    tip: '💡 Include the state for best local SEO (e.g. "Austin, TX").',
  },
  {
    stepLabel: 'Step 3 of 3',
    title: 'What type of business do you run?',
    subtitle: "Pick the closest match — we'll design everything around your industry.",
  },
];

interface QuickFormProps {
  onClose: () => void;
}

export default function QuickForm({ onClose }: QuickFormProps) {
  const [step, setStep]               = useState(0);
  const [transitioning, setTrans]     = useState(false);
  const [slideDir, setSlideDir]       = useState<1 | -1>(1);

  const [businessName, setBusinessName] = useState('');
  const [city, setCity]                 = useState('');
  const [businessType, setBusinessType] = useState('');
  const [otherText, setOtherText]       = useState('');
  const [error, setError]               = useState<string | null>(null);

  const [isGenerating, setIsGenerating] = useState(false);
  const [mounted, setMounted]           = useState(false);
  const [isMobile, setIsMobile]         = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  /* Mount + mobile detection */
  useEffect(() => {
    requestAnimationFrame(() => setMounted(true));
    document.body.style.overflow = 'hidden';
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener('resize', check);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('resize', check);
    };
  }, []);

  /* Auto-focus text inputs */
  useEffect(() => {
    if (mounted && step < 2) {
      const t = setTimeout(() => inputRef.current?.focus(), 360);
      return () => clearTimeout(t);
    }
  }, [step, mounted]);

  const resolvedType = businessType === 'other'
    ? otherText.trim().replace(/\s+/g, '_').toLowerCase()
    : businessType;

  const validate = (): boolean => {
    if (step === 0 && !businessName.trim()) { setError('Please enter your business name.'); return false; }
    if (step === 1 && !city.trim())          { setError('Please enter your city.');           return false; }
    if (step === 2 && !resolvedType)         { setError('Please select a business type.');    return false; }
    return true;
  };

  const goTo = (nextStep: number, dir: 1 | -1) => {
    setSlideDir(dir);
    setTrans(true);
    setError(null);
    setTimeout(() => { setStep(nextStep); setTrans(false); }, 200);
  };

  const next = () => {
    if (!validate()) return;
    if (step < 2) goTo(step + 1, 1);
    else submit();
  };

  const back = () => { if (step > 0) goTo(step - 1, -1); };

  const submit = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const res  = await fetch('/api/generate', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ businessName: businessName.trim(), city: city.trim(), businessType: resolvedType }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Generation failed');
      // Route through theme picker before landing in the editor
      window.location.href = `/choose-theme/${data.siteId}`;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setIsGenerating(false);
    }
  };

  if (isGenerating) return <GeneratingScreen />;

  const progress    = ((step + 1) / 3) * 100;
  const cfg         = STEP_CONFIG[step];

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 300,
      display: 'flex',
      alignItems:     isMobile ? 'flex-end' : 'center',
      justifyContent: 'center',
      padding: isMobile ? 0 : '16px',
    }}>

      {/* ── Backdrop ── */}
      <div
        onClick={onClose}
        aria-hidden
        style={{
          position: 'absolute', inset: 0,
          background: 'rgba(0,0,0,0.55)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          transition: 'opacity 0.3s ease',
          opacity: mounted ? 1 : 0,
        }}
      />

      {/* ── Modal ── */}
      <div style={{
        position:   'relative',
        background: '#fff',
        borderRadius: isMobile ? '24px 24px 0 0' : '24px',
        width:      '100%',
        maxWidth:   isMobile ? '100%' : 500,
        maxHeight:  isMobile ? '92vh' : '90vh',
        overflowY:  'auto',
        boxShadow:  isMobile
          ? '0 -16px 60px rgba(0,0,0,0.18)'
          : '0 32px 80px rgba(0,0,0,0.20)',
        transform: mounted
          ? 'translateY(0) scale(1)'
          : isMobile ? 'translateY(100%)' : 'translateY(28px) scale(0.96)',
        transition: 'transform 0.42s cubic-bezier(0.34,1.1,0.64,1), opacity 0.3s ease',
        opacity: mounted ? 1 : 0,
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}>

        {/* ── Progress bar ── */}
        <div style={{
          height: 5,
          background: '#F3EDE6',
          borderRadius: isMobile ? '24px 24px 0 0' : '24px 24px 0 0',
          overflow: 'hidden',
        }}>
          <div style={{
            height:     '100%',
            width:      `${progress}%`,
            background: 'linear-gradient(90deg, #E8581A 0%, #F97316 100%)',
            transition: 'width 0.55s cubic-bezier(0.4,0,0.2,1)',
          }} />
        </div>

        {/* ── Drag handle (mobile only) ── */}
        {isMobile && (
          <div style={{ width: 40, height: 4, background: '#E5E7EB', borderRadius: 2, margin: '12px auto 0' }} />
        )}

        <div style={{ padding: isMobile ? '20px 20px 24px' : '28px 32px 32px' }}>

          {/* ── Step header row ── */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 26 }}>

            {/* Dots */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  height:       7,
                  width:        i === step ? 24 : 7,
                  borderRadius: 4,
                  background:   i < step
                    ? '#E8581A'
                    : i === step
                      ? 'linear-gradient(90deg, #E8581A, #F97316)'
                      : '#E5E7EB',
                  transition: 'all 0.4s ease',
                }} />
              ))}
              <span style={{ fontSize: 12, color: '#9CA3AF', marginLeft: 6, fontWeight: 600 }}>
                {step + 1} / 3
              </span>
            </div>

            {/* Close */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              style={{
                width: 34, height: 34, borderRadius: '50%',
                border: '1.5px solid #E5E7EB', background: '#FAFAF8',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', flexShrink: 0, transition: 'background 0.15s',
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

          {/* ── Step content (animated) ── */}
          <div style={{
            opacity:   transitioning ? 0 : 1,
            transform: transitioning ? `translateX(${slideDir * 18}px)` : 'translateX(0)',
            transition: 'opacity 0.18s ease, transform 0.18s ease',
          }}>
            {/* Step label */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <span style={{
                fontSize: 11, fontWeight: 700, color: '#E8581A',
                letterSpacing: '0.07em', textTransform: 'uppercase',
              }}>
                {cfg.stepLabel}
              </span>
            </div>

            <h2 style={{
              fontSize: 21, fontWeight: 800, color: '#111',
              margin: '0 0 7px', letterSpacing: '-0.025em', lineHeight: 1.25,
            }}>
              {cfg.title}
            </h2>
            <p style={{ fontSize: 14, color: '#6B7280', margin: '0 0 22px', lineHeight: 1.65 }}>
              {cfg.subtitle}
            </p>

            {/* ── Error banner ── */}
            {error && (
              <div style={{
                marginBottom: 16, padding: '10px 14px',
                background: '#FEF2F2', border: '1px solid #FECACA',
                borderRadius: 10, display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                <p style={{ fontSize: 13, color: '#DC2626', margin: 0, lineHeight: 1.45 }}>{error}</p>
              </div>
            )}

            {/* ── Step 0 — Business Name ── */}
            {step === 0 && (
              <div>
                <input
                  ref={inputRef}
                  type="text"
                  value={businessName}
                  onChange={e => { setBusinessName(e.target.value); setError(null); }}
                  onKeyDown={e => e.key === 'Enter' && next()}
                  placeholder={cfg.placeholder}
                  className="input-field"
                  style={{ fontSize: 16, padding: '15px 16px' }}
                />
                <p style={{ fontSize: 12, color: '#9CA3AF', marginTop: 9, lineHeight: 1.5 }}>{cfg.tip?.replace('💡 ', '')}</p>
              </div>
            )}

            {/* ── Step 1 — City ── */}
            {step === 1 && (
              <div>
                <input
                  ref={inputRef}
                  type="text"
                  value={city}
                  onChange={e => { setCity(e.target.value); setError(null); }}
                  onKeyDown={e => e.key === 'Enter' && next()}
                  placeholder={cfg.placeholder}
                  className="input-field"
                  style={{ fontSize: 16, padding: '15px 16px' }}
                />
                <p style={{ fontSize: 12, color: '#9CA3AF', marginTop: 9, lineHeight: 1.5 }}>{cfg.tip?.replace('💡 ', '')}</p>
              </div>
            )}

            {/* ── Step 2 — Business Type ── */}
            {step === 2 && (
              <div>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(118px, 1fr))',
                  gap: 8,
                  maxHeight: 270,
                  overflowY: 'auto',
                  paddingRight: 2,
                }}>
                  {BUSINESS_TYPES.map(opt => {
                    const sel = businessType === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => { setBusinessType(opt.value); setError(null); }}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 7,
                          padding: '10px 12px', borderRadius: 10,
                          border:     `1.5px solid ${sel ? '#E8581A' : '#E5E7EB'}`,
                          background: sel ? '#FFF4ED' : '#FAFAF8',
                          color:      sel ? '#C94F18' : '#374151',
                          fontWeight: sel ? 700 : 500,
                          fontSize: 13, cursor: 'pointer',
                          transition: 'all 0.15s ease', textAlign: 'left',
                        }}
                      >
                        <BizIcon type={opt.value} />
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {opt.label}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {businessType === 'other' && (
                  <input
                    type="text"
                    value={otherText}
                    onChange={e => setOtherText(e.target.value)}
                    placeholder="e.g. Pet Grooming"
                    className="input-field"
                    style={{ marginTop: 12 }}
                  />
                )}
              </div>
            )}
          </div>

          {/* ── Navigation buttons ── */}
          <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
            {step > 0 && (
              <button
                type="button"
                onClick={back}
                style={{
                  flexShrink: 0,
                  padding:    '14px 18px',
                  background: '#F4F3F1',
                  border:     '1.5px solid #E5E7EB',
                  borderRadius: 12,
                  cursor:     'pointer',
                  fontSize:   15, fontWeight: 600, color: '#374151',
                  display:    'flex', alignItems: 'center', gap: 4,
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#ECEAE7'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#F4F3F1'; }}
              >
                ← Back
              </button>
            )}

            <button
              type="button"
              onClick={next}
              className="btn-shimmer"
              style={{
                flex:          1,
                padding:       '14px',
                background:    'linear-gradient(135deg, #E8581A 0%, #F97316 100%)',
                color:         '#fff',
                border:        'none',
                borderRadius:  12,
                cursor:        'pointer',
                fontWeight:    800,
                fontSize:      16,
                boxShadow:     '0 6px 28px rgba(232,88,26,0.30)',
                letterSpacing: '-0.01em',
                transition:    'transform 0.15s, box-shadow 0.15s',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.transform  = 'translateY(-2px)';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 12px 36px rgba(232,88,26,0.38)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.transform  = 'translateY(0)';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 6px 28px rgba(232,88,26,0.30)';
              }}
            >
              {step < 2 ? 'Continue →' : 'Build My Free Website →'}
            </button>
          </div>

          <p style={{ textAlign: 'center', fontSize: 12, color: '#9CA3AF', marginTop: 14, marginBottom: 0, lineHeight: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#E8581A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            No account · No credit card · Ready in 60 seconds
          </p>
        </div>
      </div>
    </div>
  );
}
