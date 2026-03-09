'use client';
import { useState, useEffect, useRef } from 'react';
import type { RefObject } from 'react';
import type { TemplateProps, ServiceItem, Testimonial, FAQ, Stat } from '../types';

// ── Palette ────────────────────────────────────────────────────────────────
const P = {
  white:      '#FFFFFF',
  pearl:      '#F7F8FC',
  surface:    '#EEF1F8',
  border:     '#DDE2F0',
  orange:     '#FF4500',
  orangeMid:  '#FF6B35',
  orangeGold: '#FFAA00',
  orangeGlow: 'rgba(255,69,0,0.10)',
  ink:        '#0D0D18',
  dark:       '#111124',
  darkMid:    '#1C1C30',
  mid:        '#52527A',
  light:      '#9090B0',
  silver:     '#C4C8DC',
};

// ── Global CSS ─────────────────────────────────────────────────────────────
const STYLES = `
  .v3-root { overflow-x: hidden; container-type: inline-size; }
  /* ── Keyframes ──────────────────────────────────────────────────────── */
  @keyframes v3-speedLine {
    0%   { transform: translateX(-110%) skewX(-20deg); opacity: 0; }
    12%  { opacity: 1; }
    88%  { opacity: 0.8; }
    100% { transform: translateX(130vw) skewX(-20deg); opacity: 0; }
  }
  @keyframes v3-carFloat {
    0%, 100% { transform: translateY(0px) rotate(-0.5deg); }
    50%       { transform: translateY(-14px) rotate(0.5deg); }
  }
  @keyframes v3-fadeUp {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes v3-slideRight {
    from { opacity: 0; transform: translateX(50px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes v3-shimmer {
    0%   { background-position: -250% center; }
    100% { background-position: 250% center; }
  }
  @keyframes v3-spinWheel {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes v3-pulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(255,69,0,0.5); }
    50%       { box-shadow: 0 0 0 14px rgba(255,69,0,0); }
  }
  @keyframes v3-gradientShift {
    0%   { background-position: 0% 50%; }
    50%  { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  @keyframes v3-tickerScroll {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }
  @keyframes v3-mobileMenuIn {
    from { opacity: 0; transform: translateY(-8px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── Reusable classes ───────────────────────────────────────────────── */
  .v3-nav-link {
    background: none; border: none; cursor: pointer;
    font-size: 14px; font-weight: 500; color: #52527A;
    padding: 4px 0; position: relative; transition: color 0.2s;
  }
  .v3-nav-link::after {
    content: ''; position: absolute; bottom: -2px; left: 0;
    width: 0; height: 2px; background: #FF4500; transition: width 0.25s ease;
  }
  .v3-nav-link:hover { color: #FF4500; }
  .v3-nav-link:hover::after { width: 100%; }

  .v3-btn-primary {
    display: inline-block; position: relative; overflow: hidden;
    transition: transform 0.2s ease, box-shadow 0.2s ease; text-decoration: none;
  }
  .v3-btn-primary::after {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.28) 50%, transparent 100%);
    background-size: 250% 100%; animation: v3-shimmer 2.8s infinite linear; pointer-events: none;
  }
  .v3-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 14px 40px rgba(255,69,0,0.45); }

  .v3-btn-outline {
    display: inline-block; text-decoration: none; transition: all 0.2s ease;
    cursor: pointer; background: transparent;
  }
  .v3-btn-outline:hover { border-color: #FF4500 !important; color: #FF4500 !important; transform: translateY(-2px); }

  .v3-service-card { transition: transform 0.3s ease, box-shadow 0.3s ease; }
  .v3-service-card:hover {
    transform: translateY(-10px) scale(1.01);
    box-shadow: 0 24px 64px rgba(255,69,0,0.14), 0 8px 24px rgba(0,0,0,0.08);
  }

  .v3-testimonial-card { transition: transform 0.3s ease, box-shadow 0.3s ease; }
  .v3-testimonial-card:hover { transform: translateY(-5px); box-shadow: 0 20px 56px rgba(0,0,0,0.18); }

  .v3-faq-row { cursor: pointer; transition: background 0.18s; }
  .v3-faq-row:hover { background: rgba(255,69,0,0.03); }

  /* ── Hamburger ──────────────────────────────────────────────────────── */
  .v3-hamburger {
    display: none; flex-direction: column; gap: 5px;
    background: none; border: none; cursor: pointer; padding: 6px;
  }
  .v3-hamburger span {
    display: block; width: 22px; height: 2px; border-radius: 2px;
    background: #111124; transition: all 0.25s ease;
  }
  .v3-hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
  .v3-hamburger.open span:nth-child(2) { opacity: 0; }
  .v3-hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

  /* ── Mobile menu ────────────────────────────────────────────────────── */
  .v3-mobile-menu {
    position: fixed; top: 68px; left: 0; right: 0; z-index: 99;
    background: rgba(255,255,255,0.97); backdrop-filter: blur(20px);
    border-bottom: 1px solid #DDE2F0;
    padding: 12px 5% 20px;
    display: flex; flex-direction: column; gap: 2px;
    box-shadow: 0 12px 40px rgba(0,0,0,0.10);
    animation: v3-mobileMenuIn 0.2s ease;
  }
  .v3-mobile-menu button {
    background: none; border: none; cursor: pointer;
    text-align: left; padding: 12px 0; font-size: 16px;
    font-weight: 600; color: #111124;
    border-bottom: 1px solid #EEF1F8;
    transition: color 0.2s;
  }
  .v3-mobile-menu button:hover { color: #FF4500; }
  .v3-mobile-menu button:last-child { border-bottom: none; }

  /* ── Desktop-only elements ──────────────────────────────────────────── */
  .v3-desktop-links { display: flex; align-items: center; gap: 30px; }
  .v3-ghost-number  { display: block; }
  .v3-cta-wheels    { display: flex; }

  /* ── Responsive ─────────────────────────────────────────────────────── */
  @container (max-width: 768px) {
    /* Nav */
    .v3-desktop-links { display: none !important; }
    .v3-hamburger     { display: flex !important; }

    /* Hero */
    .v3-hero-grid {
      grid-template-columns: 1fr !important;
      text-align: center !important;
      gap: 32px !important;
      padding-top: 32px !important;
      padding-bottom: 60px !important;
    }
    .v3-hero-ctas  { justify-content: center !important; }
    .v3-hero-trust { justify-content: center !important; }
    .v3-hero-car   { max-width: 320px !important; margin: 0 auto !important; }
    .v3-hero-spin-row { display: none !important; }
    .v3-ghost-number  { display: none !important; }

    /* Stats */
    .v3-stats-grid {
      grid-template-columns: 1fr 1fr !important;
      gap: 0 !important;
    }
    .v3-stat-divider-v { display: none !important; }

    /* Services */
    .v3-services-grid { grid-template-columns: 1fr !important; }

    /* Testimonials */
    .v3-testimonials-grid { grid-template-columns: 1fr !important; }

    /* About */
    .v3-about-grid { grid-template-columns: 1fr !important; gap: 28px !important; }

    /* CTA */
    .v3-cta-wheels { display: none !important; }
    .v3-cta-btns {
      flex-direction: column !important;
      align-items: stretch !important;
      gap: 12px !important;
    }
    .v3-cta-btns > * { text-align: center !important; width: 100% !important; box-sizing: border-box !important; }

    /* Footer */
    .v3-footer-inner  { flex-direction: column !important; text-align: center !important; gap: 14px !important; }
    .v3-footer-links  { flex-direction: column !important; gap: 6px !important; align-items: center !important; }
  }

  @container (max-width: 480px) {
    .v3-stats-grid { grid-template-columns: 1fr 1fr !important; }
    .v3-stat-num   { font-size: 38px !important; letter-spacing: -1px !important; }
    .v3-service-card:hover { transform: none !important; box-shadow: none !important; }
    .v3-testimonial-card:hover { transform: none !important; box-shadow: none !important; }
  }

  /* Mac / large screens */
  @container (min-width: 1280px) {
    .v3-hero-grid { gap: 80px !important; }
  }
`;

// ── Hooks ──────────────────────────────────────────────────────────────────
function useInView(threshold = 0.12): [RefObject<HTMLDivElement>, boolean] {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

function useCounter(target: number, duration = 2200, active = false, isFloat = false): number {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 4);
      const cur = eased * target;
      setVal(isFloat ? Math.round(cur * 10) / 10 : Math.floor(cur));
      if (p < 1) requestAnimationFrame(tick);
      else setVal(target);
    };
    requestAnimationFrame(tick);
  }, [active, target, duration, isFloat]);
  return val;
}

// ── Default placeholder data ───────────────────────────────────────────────
const DEF_SERVICES: ServiceItem[] = [
  {
    name: 'Essential Wash',
    price: '$79',
    duration: '1.5 hr',
    description: 'A thorough hand wash, interior vacuum, streak-free windows and tyre dressing.',
    features: ['Exterior hand wash & rinse', 'Interior vacuum & wipe-down', 'Window cleaning (in & out)', 'Tyre & wheel shine', 'Air freshener finish'],
  },
  {
    name: 'Premium Detail',
    price: '$199',
    duration: '4 hr',
    description: 'Full interior and exterior deep-clean with professional paint decontamination.',
    features: ['Everything in Essential', 'Clay bar treatment', 'Paint decontamination', 'Interior deep clean & steam', 'Leather conditioning', 'Engine bay wipe-down'],
  },
  {
    name: 'Elite Correction',
    price: '$399',
    duration: '8 hr',
    description: 'Machine polish and ceramic coating for a factory-fresh, showroom-level result.',
    features: ['Everything in Premium', 'Machine polish (1-stage)', 'Ceramic coating applied', 'Paint sealant protection', 'Headlight restoration', '6-month protection warranty'],
  },
];

const DEF_STATS: Stat[] = [
  { value: 2400, label: 'Cars Detailed',     suffix: '+' },
  { value: 8,    label: 'Years in Business', suffix: '+' },
  { value: 99,   label: 'Satisfaction Rate', suffix: '%' },
  { value: 4.9,  label: 'Google Rating',     suffix: '★' },
];

const DEF_TESTIMONIALS: Testimonial[] = [
  {
    name: 'Marcus T.',
    text: 'These guys transformed my Mustang. The paint looked like it just rolled off the factory floor. Absolutely elite work — I could not be happier.',
    rating: 5,
    context: 'Ford Mustang GT — Elite Correction',
  },
  {
    name: 'Sarah K.',
    text: "I've tried three other detailers in the city and nobody comes close. The attention to detail is unmatched. Worth every single penny.",
    rating: 5,
    context: 'Tesla Model 3 — Premium Detail',
  },
  {
    name: 'James R.',
    text: 'Brought my truck in after a long road trip. They made it look brand new inside and out. Fast, professional, and honest pricing. Will be back.',
    rating: 5,
    context: 'RAM 1500 — Essential Wash',
  },
];

const DEF_FAQS: FAQ[] = [
  { q: 'How long does a full detail take?',    a: 'An Essential Wash takes around 1.5 hrs. Premium Detail runs 3–4 hrs. Elite Correction can take up to 8 hrs — we never rush perfection.' },
  { q: 'Do you offer mobile detailing?',       a: 'Yes! We come directly to your home or office within a 20-mile radius. Book online or call us and we\'ll set up a time that works for you.' },
  { q: 'What products do you use?',            a: 'Only professional-grade products: Gyeon, Koch-Chemie and Gtechniq coatings. No cheap consumer shortcuts — ever. Your car deserves the best.' },
  { q: 'Is ceramic coating worth it?',         a: 'Absolutely. It provides 2–5 years of protection, dramatically enhances gloss, repels water and contaminants, and makes future washing much easier.' },
  { q: 'Do I need to stay while you work?',    a: 'Not at all. Many clients drop off and pick up when we\'re done. We\'ll send you a text or call when your vehicle is ready.' },
];

const DEF_CERTIFICATIONS = [
  'IDA Certified Detailer',
  'Gtechniq Approved Installer',
  'XPEL Certified Applicator',
  'Koch-Chemie Pro Partner',
];

const DEF_SERVICE_AREAS = ['Chicago', 'Evanston', 'Oak Park', 'Naperville', 'Schaumburg'];

// ── Sub-components ─────────────────────────────────────────────────────────

function SpeedLines({ opacity = 1 }: { opacity?: number }) {
  const lines = [
    { top: '10%', h: 2, delay: 0.0, dur: 2.6, op: 0.22 },
    { top: '22%', h: 1, delay: 0.5, dur: 3.1, op: 0.13 },
    { top: '35%', h: 3, delay: 0.9, dur: 2.3, op: 0.26 },
    { top: '48%', h: 1, delay: 1.4, dur: 3.5, op: 0.10 },
    { top: '61%', h: 2, delay: 0.3, dur: 2.7, op: 0.19 },
    { top: '73%', h: 4, delay: 1.7, dur: 2.1, op: 0.15 },
    { top: '84%', h: 1, delay: 0.7, dur: 3.2, op: 0.09 },
    { top: '92%', h: 2, delay: 1.1, dur: 2.5, op: 0.12 },
  ];
  return (
    <>
      {lines.map((l, i) => (
        <div key={i} style={{
          position: 'absolute', top: l.top, left: 0, right: 0, height: l.h,
          background: `linear-gradient(90deg, transparent 0%, ${P.orange} 25%, ${P.orangeGold} 65%, transparent 100%)`,
          opacity: l.op * opacity,
          animation: `v3-speedLine ${l.dur}s ${l.delay}s infinite linear`,
          pointerEvents: 'none',
        }} />
      ))}
    </>
  );
}

function CarSVG({ visible }: { visible: boolean }) {
  return (
    <svg viewBox="0 0 560 240" fill="none"
      style={{ width: '100%', filter: 'drop-shadow(0 20px 55px rgba(255,69,0,0.20))' }}
      aria-hidden>
      <defs>
        <linearGradient id="v3carGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor={P.orange} />
          <stop offset="45%"  stopColor={P.orangeGold} />
          <stop offset="100%" stopColor={P.orange} />
        </linearGradient>
      </defs>
      {/* Ground shadow */}
      <ellipse cx="280" cy="222" rx="215" ry="9" fill="rgba(255,100,0,0.07)" />
      {/* Car body */}
      <path d="M 45 172 L 45 138 C 45 115 78 90 120 75 L 192 55 C 224 46 264 42 300 44 L 368 42 C 410 42 452 58 475 94 L 502 126 L 512 158 L 512 178 Z"
        stroke="url(#v3carGrad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
        fill="rgba(255,90,0,0.04)"
        style={{
          strokeDasharray: 1400, strokeDashoffset: visible ? 0 : 1400,
          transition: visible ? 'stroke-dashoffset 2.2s cubic-bezier(0.4,0,0.2,1)' : 'none',
          animation: visible ? 'v3-carFloat 4.5s ease-in-out 2.4s infinite' : 'none',
        }} />
      {/* Windows */}
      <path d="M 126 75 L 162 56 L 256 47 L 302 48 L 368 44 L 384 72 Z"
        stroke="url(#v3carGrad)" strokeWidth="1.8" fill="rgba(255,170,50,0.07)"
        style={{ strokeDasharray: 650, strokeDashoffset: visible ? 0 : 650, transition: visible ? 'stroke-dashoffset 1.8s 0.4s ease' : 'none' }} />
      {/* Door line */}
      <line x1="256" y1="47" x2="250" y2="114" stroke={P.orange} strokeWidth="1.5" strokeOpacity="0.6"
        style={{ strokeDasharray: 70, strokeDashoffset: visible ? 0 : 70, transition: visible ? 'stroke-dashoffset 0.9s 1.0s ease' : 'none' }} />
      {/* Door handle */}
      <line x1="230" y1="96" x2="248" y2="96" stroke={P.orangeGold} strokeWidth="2.5" strokeLinecap="round"
        style={{ strokeDasharray: 20, strokeDashoffset: visible ? 0 : 20, transition: visible ? 'stroke-dashoffset 0.5s 1.4s ease' : 'none' }} />
      {/* Rear wheel */}
      <circle cx="128" cy="176" r="40" stroke="url(#v3carGrad)" strokeWidth="2.5" fill="rgba(255,69,0,0.04)"
        style={{ strokeDasharray: 252, strokeDashoffset: visible ? 0 : 252, transition: visible ? 'stroke-dashoffset 1.6s 0.7s ease' : 'none' }} />
      <circle cx="128" cy="176" r="24" stroke={P.orange} strokeWidth="1.5" fill="none" strokeOpacity="0.45"
        style={{ strokeDasharray: 151, strokeDashoffset: visible ? 0 : 151, transition: visible ? 'stroke-dashoffset 1.4s 0.9s ease' : 'none' }} />
      {[0,51.4,102.9,154.3,205.7,257.1,308.6].map((deg, i) => {
        const r = (deg * Math.PI) / 180;
        return <line key={i} x1={128+8*Math.cos(r)} y1={176+8*Math.sin(r)} x2={128+24*Math.cos(r)} y2={176+24*Math.sin(r)} stroke={P.orange} strokeWidth="1.2" strokeOpacity="0.35" />;
      })}
      {/* Front wheel */}
      <circle cx="412" cy="176" r="40" stroke="url(#v3carGrad)" strokeWidth="2.5" fill="rgba(255,69,0,0.04)"
        style={{ strokeDasharray: 252, strokeDashoffset: visible ? 0 : 252, transition: visible ? 'stroke-dashoffset 1.6s 0.9s ease' : 'none' }} />
      <circle cx="412" cy="176" r="24" stroke={P.orange} strokeWidth="1.5" fill="none" strokeOpacity="0.45"
        style={{ strokeDasharray: 151, strokeDashoffset: visible ? 0 : 151, transition: visible ? 'stroke-dashoffset 1.4s 1.1s ease' : 'none' }} />
      {[0,51.4,102.9,154.3,205.7,257.1,308.6].map((deg, i) => {
        const r = (deg * Math.PI) / 180;
        return <line key={i} x1={412+8*Math.cos(r)} y1={176+8*Math.sin(r)} x2={412+24*Math.cos(r)} y2={176+24*Math.sin(r)} stroke={P.orange} strokeWidth="1.2" strokeOpacity="0.35" />;
      })}
      {/* Headlight */}
      <path d="M 496 116 L 514 128 L 512 148 L 492 143 Z" stroke={P.orangeGold} strokeWidth="1.5" fill="rgba(255,170,0,0.18)"
        style={{ strokeDasharray: 90, strokeDashoffset: visible ? 0 : 90, transition: visible ? 'stroke-dashoffset 0.7s 1.6s ease' : 'none' }} />
      {/* Tail light */}
      <path d="M 46 118 L 30 124 L 28 144 L 46 140 Z" stroke={P.orange} strokeWidth="1.5" fill="rgba(255,69,0,0.22)"
        style={{ strokeDasharray: 90, strokeDashoffset: visible ? 0 : 90, transition: visible ? 'stroke-dashoffset 0.7s 1.6s ease' : 'none' }} />
      {/* Exhaust */}
      <rect x="30" y="162" width="18" height="7" rx="3.5" stroke={P.silver} strokeWidth="1.2" fill="rgba(200,200,220,0.2)"
        style={{ strokeDasharray: 50, strokeDashoffset: visible ? 0 : 50, transition: visible ? 'stroke-dashoffset 0.5s 1.8s ease' : 'none' }} />
      <rect x="30" y="152" width="18" height="7" rx="3.5" stroke={P.silver} strokeWidth="1.2" fill="rgba(200,200,220,0.2)"
        style={{ strokeDasharray: 50, strokeDashoffset: visible ? 0 : 50, transition: visible ? 'stroke-dashoffset 0.5s 1.9s ease' : 'none' }} />
    </svg>
  );
}

function SpinWheel({ size = 72 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none"
      style={{ animation: 'v3-spinWheel 9s linear infinite', flexShrink: 0 }} aria-hidden>
      <circle cx="40" cy="40" r="37" stroke={P.orange} strokeWidth="1.8" strokeOpacity="0.25" />
      <circle cx="40" cy="40" r="27" stroke={P.orange} strokeWidth="1.5" strokeOpacity="0.18" />
      <circle cx="40" cy="40" r="7"  fill={P.orange} fillOpacity="0.5" />
      {[0,45,90,135,180,225,270,315].map((deg, i) => {
        const r = (deg * Math.PI) / 180;
        return <line key={i} x1={40+8*Math.cos(r)} y1={40+8*Math.sin(r)} x2={40+27*Math.cos(r)} y2={40+27*Math.sin(r)} stroke={P.orange} strokeWidth="1.5" strokeOpacity="0.45" />;
      })}
      {Array.from({ length: 20 }).map((_, i) => {
        const a = (i * 18 * Math.PI) / 180;
        return <line key={i} x1={40+31*Math.cos(a)} y1={40+31*Math.sin(a)} x2={40+37*Math.cos(a)} y2={40+37*Math.sin(a)} stroke={P.orange} strokeWidth="2.2" strokeOpacity="0.20" />;
      })}
    </svg>
  );
}

function Stars({ rating }: { rating: number }) {
  return (
    <div style={{ display: 'flex', gap: 3 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="15" height="15" viewBox="0 0 24 24"
          fill={i < rating ? P.orange : 'none'} stroke={i < rating ? P.orange : P.silver} strokeWidth="2">
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
        </svg>
      ))}
    </div>
  );
}

function Check() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
      stroke={P.orange} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <polyline points="20,6 9,17 4,12" />
    </svg>
  );
}

function StatBox({ stat, active, delay = 0 }: { stat: Stat; active: boolean; delay?: number }) {
  const target = typeof stat.value === 'number' ? stat.value : parseFloat(String(stat.value)) || 0;
  const isFloat = String(stat.value).includes('.');
  const count = useCounter(target, 2400, active, isFloat);
  const display = isFloat ? count.toFixed(1) : Math.floor(count).toLocaleString();
  return (
    <div style={{
      textAlign: 'center', padding: '28px 16px',
      opacity: active ? 1 : 0, transform: active ? 'none' : 'translateY(20px)',
      transition: `opacity 0.5s ${delay}s ease, transform 0.5s ${delay}s ease`,
    }}>
      <div className="v3-stat-num" style={{
        fontSize: 52, fontWeight: 900, lineHeight: 1,
        background: `linear-gradient(135deg, ${P.orange} 0%, ${P.orangeGold} 100%)`,
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        backgroundClip: 'text', letterSpacing: '-2px',
      }}>
        {display}{stat.suffix}
      </div>
      <div style={{ color: P.light, fontSize: 11, fontWeight: 700, marginTop: 8, textTransform: 'uppercase', letterSpacing: '0.12em' }}>
        {stat.label}
      </div>
    </div>
  );
}

function FaqRow({ faq, isLast }: { faq: FAQ; isLast: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="v3-faq-row" style={{ borderBottom: isLast ? 'none' : `1px solid ${P.border}` }}
      onClick={() => setOpen(o => !o)}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', gap: 16 }}>
        <span style={{ fontWeight: 600, fontSize: 15, color: P.ink, lineHeight: 1.4 }}>{faq.q}</span>
        <div style={{
          width: 28, height: 28, borderRadius: '50%',
          border: `2px solid ${open ? P.orange : P.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: open ? P.orange : P.mid, fontWeight: 700, fontSize: 20, flexShrink: 0,
          transition: 'all 0.25s', transform: open ? 'rotate(45deg)' : 'none',
        }}>+</div>
      </div>
      <div style={{ maxHeight: open ? 240 : 0, overflow: 'hidden', transition: 'max-height 0.4s cubic-bezier(0.16,1,0.3,1)' }}>
        <p style={{ margin: 0, padding: '0 24px 20px', color: P.mid, fontSize: 14, lineHeight: 1.75 }}>{faq.a}</p>
      </div>
    </div>
  );
}

function Ticker({ items }: { items: string[] }) {
  const repeated = [...items, ...items];
  return (
    <div style={{ overflow: 'hidden', background: P.orange, padding: '11px 0' }}>
      <div style={{ display: 'flex', width: 'max-content', animation: 'v3-tickerScroll 18s linear infinite', whiteSpace: 'nowrap' }}>
        {repeated.map((item, i) => (
          <span key={i} style={{ fontSize: 11, fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.14em', padding: '0 28px' }}>
            {item} <span style={{ opacity: 0.5 }}>✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ── Label component ────────────────────────────────────────────────────────
function SectionLabel({ text }: { text: string }) {
  return (
    <p style={{ fontSize: 11, fontWeight: 700, color: P.orange, textTransform: 'uppercase', letterSpacing: '0.18em', margin: '0 0 10px' }}>
      {text}
    </p>
  );
}

// ── Main Template ──────────────────────────────────────────────────────────
export default function CarDetailing3({ businessData: d, isPreview }: TemplateProps) {
  const services     = d.services?.length     ? d.services     : DEF_SERVICES;
  const stats        = d.stats?.length        ? d.stats        : DEF_STATS;
  const testimonials = d.testimonials?.length ? d.testimonials : DEF_TESTIMONIALS;
  const faqs         = d.faq?.length          ? d.faq          : DEF_FAQS;
  const certifications = d.certifications?.length ? d.certifications : DEF_CERTIFICATIONS;
  const serviceAreas   = d.serviceAreas?.length   ? d.serviceAreas   : DEF_SERVICE_AREAS;
  const copy           = d.copy;
  const bookingUrl     = d.bookingUrl || '#';

  const [scrolled,    setScrolled]    = useState(false);
  const [menuOpen,    setMenuOpen]    = useState(false);
  const [heroVisible, setHeroVisible] = useState(false);

  const [statsRef,        statsVisible]        = useInView(0.2);
  const [servicesRef,     servicesVisible]     = useInView(0.08);
  const [aboutRef,        aboutVisible]        = useInView(0.12);
  const [faqRef,          faqVisible]          = useInView(0.08);
  const [ctaRef,          ctaVisible]          = useInView(0.15);
  const [testimonialsRef, testimonialsVisible] = useInView(0.08);

  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 120);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (isPreview) return;
    const fn = () => { setScrolled(window.scrollY > 60); };
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, [isPreview]);

  // Close mobile menu on outside click
  useEffect(() => {
    if (!menuOpen) return;
    const fn = () => setMenuOpen(false);
    document.addEventListener('click', fn);
    return () => document.removeEventListener('click', fn);
  }, [menuOpen]);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const navItems: [string, string][] = [
    ['Services', 'services'],
    ['Gallery',  'gallery'],
    ['Reviews',  'testimonials'],
    ['About',    'about'],
    ['FAQ',      'faq'],
  ];

  const tickerItems = [
    'Paint Correction', 'Ceramic Coating', 'Mobile Detailing',
    'Interior Deep Clean', 'Paint Protection Film', 'Engine Bay Detail',
    'Headlight Restoration', 'Wheel & Tire Care',
  ];

  // ── Shared heading style ─────────────────────────────────────────────────
  const sectionH2: React.CSSProperties = {
    fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: 900,
    color: P.dark, margin: 0, letterSpacing: '-1.5px', lineHeight: 1.08,
  };

  return (
    <div className="v3-root">
      {/* suppressHydrationWarning prevents SSR/client CSS mismatch */}
      <style suppressHydrationWarning>{STYLES}</style>

      {/* ════════════════════════════════════════════════════════════
          NAV
      ════════════════════════════════════════════════════════════ */}
      <nav style={{
        position: isPreview ? 'sticky' : 'fixed',
        top: 0, left: 0, right: 0, zIndex: 100,
        transition: 'all 0.3s ease',
        background: (scrolled || menuOpen) ? 'rgba(255,255,255,0.94)' : 'transparent',
        backdropFilter: (scrolled || menuOpen) ? 'blur(18px)' : 'none',
        boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.07)' : 'none',
        padding: '0 5%',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 68, maxWidth: 1200, margin: '0 auto' }}>

          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 9,
              background: `linear-gradient(135deg, ${P.orange}, ${P.orangeGold})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              animation: 'v3-pulse 3s ease-in-out infinite', flexShrink: 0,
            }}>
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2C12 2 5 9.5 5 14a7 7 0 0 0 14 0C19 9.5 12 2 12 2Z" />
                <path d="M9 15a3.5 3.5 0 0 0 6 0" strokeOpacity="0.6" />
              </svg>
            </div>
            <span style={{ fontWeight: 800, fontSize: 16, color: P.dark, letterSpacing: '-0.4px', whiteSpace: 'nowrap' }}>
              {d.name}
            </span>
          </div>

          {/* Desktop nav links */}
          <div className="v3-desktop-links">
            {navItems.map(([label, id]) => (
              <button key={id} className="v3-nav-link" onClick={() => scrollTo(id)}>{label}</button>
            ))}
            <a href={bookingUrl} className="v3-btn-primary" style={{
              padding: '10px 22px', borderRadius: 8,
              background: `linear-gradient(135deg, ${P.orange}, ${P.orangeMid})`,
              color: '#fff', fontWeight: 700, fontSize: 14,
            }}>
              {copy?.nav_cta || 'Book Now'}
            </a>
          </div>

          {/* Hamburger (mobile only) */}
          <button
            className={`v3-hamburger ${menuOpen ? 'open' : ''}`}
            onClick={e => { e.stopPropagation(); setMenuOpen(o => !o); }}
            aria-label="Toggle menu">
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="v3-mobile-menu" onClick={e => e.stopPropagation()}>
          {navItems.map(([label, id]) => (
            <button key={id} onClick={() => scrollTo(id)}>{label}</button>
          ))}
          <a href={bookingUrl} className="v3-btn-primary" style={{
            marginTop: 8, padding: '13px 0', borderRadius: 9, textAlign: 'center',
            background: `linear-gradient(135deg, ${P.orange}, ${P.orangeMid})`,
            color: '#fff', fontWeight: 700, fontSize: 15,
          }}>
            {copy?.nav_cta || 'Book Now'}
          </a>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════
          HERO
      ════════════════════════════════════════════════════════════ */}
      <section style={{
        position: 'relative', minHeight: '100vh', background: P.white,
        overflow: 'hidden', display: 'flex', alignItems: 'center', paddingTop: 68,
      }}>
        <SpeedLines />
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: `radial-gradient(ellipse 55% 55% at 82% 65%, rgba(255,90,0,0.09) 0%, transparent 70%)`,
        }} />

        {/* Ghost "01" — desktop only via CSS */}
        <div className="v3-ghost-number" style={{
          position: 'absolute', right: '-4%', top: '50%', transform: 'translateY(-50%)',
          fontSize: 'min(48vw, 460px)', fontWeight: 900, color: 'rgba(255,69,0,0.04)',
          lineHeight: 1, userSelect: 'none', pointerEvents: 'none', letterSpacing: '-10px',
        }}>01</div>

        {/* Content grid */}
        <div className="v3-hero-grid" style={{
          maxWidth: 1200, margin: '0 auto', padding: '60px 5%',
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          gap: 56, alignItems: 'center', width: '100%',
          position: 'relative', zIndex: 1, boxSizing: 'border-box',
        }}>
          {/* Left — copy */}
          <div>
            {/* Pill badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '6px 16px', borderRadius: 100,
              border: `1px solid ${P.border}`, background: P.pearl, marginBottom: 24,
              opacity: heroVisible ? 1 : 0,
              animation: heroVisible ? 'v3-fadeUp 0.6s ease both' : 'none',
            }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: P.orange, display: 'inline-block', animation: 'v3-pulse 2s infinite' }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: P.mid, textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                {d.city} • Premium Auto Detailing
              </span>
            </div>

            {/* Headline */}
            <h1 style={{
              fontSize: 'clamp(36px, 5.5vw, 80px)', fontWeight: 900, lineHeight: 1.0,
              letterSpacing: '-2.5px', color: P.dark, margin: '0 0 18px',
              opacity: heroVisible ? 1 : 0,
              animation: heroVisible ? 'v3-fadeUp 0.7s 0.1s ease both' : 'none',
            }}>
              <span style={{
                display: 'block',
                background: `linear-gradient(135deg, ${P.orange} 0%, ${P.orangeGold} 40%, ${P.orange} 100%)`,
                backgroundSize: '200% auto',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                animation: heroVisible ? 'v3-gradientShift 3.5s ease infinite 0.6s' : 'none',
              }}>
                {(d.tagline || 'Restore. Protect.').split(' ').slice(0, 2).join(' ')}
              </span>
              {(d.tagline || 'Restore. Protect. Perfect.').split(' ').slice(2).join(' ') || 'Perfect.'}
            </h1>

            {/* Sub-tagline */}
            <p style={{
              fontSize: 'clamp(15px, 2vw, 17px)', color: P.mid, lineHeight: 1.75, maxWidth: 460, margin: '0 0 32px',
              opacity: heroVisible ? 1 : 0, animation: heroVisible ? 'v3-fadeUp 0.7s 0.2s ease both' : 'none',
            }}>
              {d.subTagline || d.description || 'Hand-crafted detailing that protects your investment and turns heads everywhere you drive.'}
            </p>

            {/* CTAs */}
            <div className="v3-hero-ctas" style={{
              display: 'flex', gap: 12, flexWrap: 'wrap',
              opacity: heroVisible ? 1 : 0, animation: heroVisible ? 'v3-fadeUp 0.7s 0.3s ease both' : 'none',
            }}>
              <a href={bookingUrl} className="v3-btn-primary" style={{
                padding: '15px 32px', borderRadius: 10,
                background: `linear-gradient(135deg, ${P.orange} 0%, ${P.orangeMid} 100%)`,
                color: '#fff', fontWeight: 800, fontSize: 15,
              }}>
                {copy?.hero_cta_primary || 'Book a Detail'}
              </a>
              <button onClick={() => scrollTo('services')} className="v3-btn-outline" style={{
                padding: '15px 32px', borderRadius: 10, border: `2px solid ${P.border}`,
                color: P.dark, fontWeight: 700, fontSize: 15,
              }}>
                {copy?.hero_cta_secondary || 'See Packages'}
              </button>
            </div>

            {/* Trust row */}
            <div className="v3-hero-trust" style={{
              display: 'flex', alignItems: 'center', gap: 18, marginTop: 32, flexWrap: 'wrap',
              opacity: heroVisible ? 1 : 0, animation: heroVisible ? 'v3-fadeUp 0.7s 0.4s ease both' : 'none',
            }}>
              {d.phone && (
                <>
                  <div style={{ width: 1, height: 24, background: P.border }} />
                  <a href={`tel:${d.phone}`} style={{ color: P.mid, fontSize: 14, textDecoration: 'none', fontWeight: 500 }}>
                    📞 {d.phone}
                  </a>
                </>
              )}
              {serviceAreas.length > 0 && (
                <>
                  <div style={{ width: 1, height: 24, background: P.border }} />
                  <span style={{ color: P.light, fontSize: 13 }}>
                    📍 {serviceAreas.slice(0, 3).join(' · ')}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Right — animated car */}
          <div className="v3-hero-car" style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            opacity: heroVisible ? 1 : 0,
            animation: heroVisible ? 'v3-slideRight 1.1s 0.3s ease both' : 'none',
          }}>
            <CarSVG visible={heroVisible} />
            <div className="v3-hero-spin-row" style={{ display: 'flex', gap: 28, marginTop: 20, opacity: 0.55 }}>
              <SpinWheel size={48} />
              <SpinWheel size={34} />
              <SpinWheel size={48} />
            </div>
          </div>
        </div>

        {/* Wave into ticker */}
        <div style={{ position: 'absolute', bottom: -1, left: 0, right: 0 }}>
          <svg viewBox="0 0 1440 48" fill={P.orange} style={{ display: 'block' }}>
            <path d="M0,32 C360,0 1080,48 1440,16 L1440,48 L0,48 Z" />
          </svg>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          TICKER
      ════════════════════════════════════════════════════════════ */}
      <Ticker items={tickerItems} />

      {/* ════════════════════════════════════════════════════════════
          STATS
      ════════════════════════════════════════════════════════════ */}
      <section ref={statsRef} style={{ background: P.pearl, padding: '64px 5% 48px' }}>
        <div className="v3-stats-grid" style={{
          maxWidth: 1100, margin: '0 auto',
          display: 'grid', gridTemplateColumns: `repeat(${Math.min(stats.length, 4)}, 1fr)`,
        }}>
          {stats.slice(0, 4).map((s, i) => (
            <div key={i} style={{ position: 'relative' }}>
              <StatBox stat={s} active={statsVisible} delay={i * 0.1} />
              {i < Math.min(stats.length, 4) - 1 && (
                <div className="v3-stat-divider-v" style={{
                  position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)',
                  width: 1, height: 40, background: P.border,
                }} />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          SERVICES
      ════════════════════════════════════════════════════════════ */}
      <section id="services" ref={servicesRef} style={{ background: P.white, padding: '90px 5%' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>

          <div style={{
            marginBottom: 52,
            opacity: servicesVisible ? 1 : 0, transform: servicesVisible ? 'none' : 'translateY(24px)',
            transition: 'all 0.6s ease',
          }}>
            <SectionLabel text={copy?.services_label || 'What We Offer'} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap' }}>
              <h2 style={sectionH2}>{copy?.services_heading || 'Detail Packages'}</h2>
              <SpinWheel size={26} />
            </div>
            <p style={{ fontSize: 15, color: P.mid, margin: '12px 0 0', maxWidth: 500, lineHeight: 1.7 }}>
              {copy?.services_subheading || 'Every service performed by certified technicians using only professional-grade products.'}
            </p>
          </div>

          <div className="v3-services-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: 22 }}>
            {services.map((s, i) => (
              <div key={i} className="v3-service-card" style={{
                background: P.white, border: `1px solid ${P.border}`,
                borderRadius: 18, padding: '30px 26px',
                position: 'relative', overflow: 'hidden',
                opacity: servicesVisible ? 1 : 0, transform: servicesVisible ? 'none' : 'translateY(36px)',
                transition: `opacity 0.55s ${0.1 + i * 0.13}s ease, transform 0.55s ${0.1 + i * 0.13}s ease`,
              }}>
                {/* Top stripe */}
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: 4,
                  background: i === 1 ? `linear-gradient(90deg, ${P.orange}, ${P.orangeGold})`
                    : i === 2 ? `linear-gradient(90deg, ${P.orangeGold}, ${P.orange})`
                    : `linear-gradient(90deg, ${P.orange}70, ${P.orange}25)`,
                }} />

                {i === 1 && (
                  <div style={{
                    position: 'absolute', top: 14, right: 14,
                    background: `linear-gradient(135deg, ${P.orange}, ${P.orangeGold})`,
                    color: '#fff', fontSize: 9, fontWeight: 800,
                    padding: '3px 10px', borderRadius: 100,
                    textTransform: 'uppercase', letterSpacing: '0.08em',
                  }}>Most Popular</div>
                )}

                <h3 style={{ fontSize: 20, fontWeight: 800, color: P.dark, margin: '0 0 6px', letterSpacing: '-0.4px' }}>{s.name}</h3>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 12 }}>
                  <span style={{ fontSize: 34, fontWeight: 900, color: P.orange, letterSpacing: '-1px' }}>{s.price || ''}</span>
                  {s.duration && <span style={{ color: P.light, fontSize: 13, fontWeight: 500 }}>/ {s.duration}</span>}
                </div>
                {s.description && (
                  <p style={{ fontSize: 14, color: P.mid, lineHeight: 1.65, margin: '0 0 18px' }}>{s.description}</p>
                )}
                {s.features && (
                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'flex', flexDirection: 'column', gap: 9 }}>
                    {s.features.map((f, fi) => (
                      <li key={fi} style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 13, color: P.mid }}>
                        <Check />{f}
                      </li>
                    ))}
                  </ul>
                )}
                <a href={bookingUrl}
                  className={i === 1 ? 'v3-btn-primary' : 'v3-btn-outline'}
                  style={{
                    display: 'block', textAlign: 'center', padding: '12px', borderRadius: 8,
                    ...(i === 1
                      ? { background: `linear-gradient(135deg, ${P.orange}, ${P.orangeMid})`, color: '#fff', fontWeight: 700, fontSize: 14 }
                      : { border: `2px solid ${P.border}`, color: P.dark, fontWeight: 700, fontSize: 14 }),
                  }}>
                  {copy?.services_item_cta || 'Book This Package'}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          GALLERY (only when photos exist)
      ════════════════════════════════════════════════════════════ */}
      {(d.gallery?.length ?? 0) > 0 && (
        <section id="gallery" style={{ background: P.pearl, padding: '90px 5%' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <SectionLabel text={copy?.gallery_label || 'The Results'} />
            <h2 style={{ ...sectionH2, marginBottom: 40 }}>{copy?.gallery_heading || 'Before & After'}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 260px), 1fr))', gap: 16 }}>
              {d.gallery!.map((g, i) => (
                <div key={i} style={{ borderRadius: 14, overflow: 'hidden', border: `1px solid ${P.border}`, aspectRatio: '4/3', position: 'relative' }}>
                  <img src={g.imageUrl} alt={g.label || ''} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  {g.label && (
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '8px 12px', background: 'rgba(0,0,0,0.55)', color: '#fff', fontSize: 12, fontWeight: 600 }}>
                      {g.label}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ════════════════════════════════════════════════════════════
          TESTIMONIALS
      ════════════════════════════════════════════════════════════ */}
      <section id="testimonials" ref={testimonialsRef}
        style={{ background: P.dark, padding: '90px 5%', position: 'relative', overflow: 'hidden' }}>
        {/* Ghost watermark */}
        <div style={{
          position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)',
          fontSize: 'min(28vw, 300px)', fontWeight: 900, color: 'rgba(255,255,255,0.025)',
          whiteSpace: 'nowrap', userSelect: 'none', pointerEvents: 'none', letterSpacing: -8,
        }}>CLEAN</div>
        {/* Spinning wheels — desktop only */}
        <div className="v3-cta-wheels" style={{ position: 'absolute', left: '2%', top: '50%', transform: 'translateY(-50%)', opacity: 0.12 }}>
          <SpinWheel size={100} />
        </div>
        <div className="v3-cta-wheels" style={{ position: 'absolute', right: '2%', top: '50%', transform: 'translateY(-50%)', opacity: 0.12 }}>
          <SpinWheel size={100} />
        </div>

        <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{
            marginBottom: 52,
            opacity: testimonialsVisible ? 1 : 0, transform: testimonialsVisible ? 'none' : 'translateY(24px)',
            transition: 'all 0.6s ease',
          }}>
            <SectionLabel text={copy?.testimonials_label || 'What Clients Say'} />
            <h2 style={{ ...sectionH2, color: '#fff' }}>Real Results,<br />Real People.</h2>
          </div>

          <div className="v3-testimonials-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: 20 }}>
            {testimonials.map((t, i) => (
              <div key={i} className="v3-testimonial-card" style={{
                background: P.darkMid, border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 18, padding: '26px',
                opacity: testimonialsVisible ? 1 : 0, transform: testimonialsVisible ? 'none' : 'translateY(28px)',
                transition: `opacity 0.55s ${i * 0.15}s ease, transform 0.55s ${i * 0.15}s ease`,
              }}>
                <div style={{ fontSize: 64, lineHeight: 0.7, color: P.orange, opacity: 0.35, fontFamily: 'Georgia,serif', marginBottom: 14 }}>"</div>
                <Stars rating={t.rating} />
                <p style={{ color: 'rgba(255,255,255,0.78)', fontSize: 14, lineHeight: 1.75, margin: '14px 0 18px', fontStyle: 'italic' }}>
                  "{t.text}"
                </p>
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 14 }}>
                  <div style={{ fontWeight: 700, color: '#fff', fontSize: 14 }}>{t.name}</div>
                  {t.context && <div style={{ color: 'rgba(255,255,255,0.32)', fontSize: 12, marginTop: 3 }}>{t.context}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          ABOUT
      ════════════════════════════════════════════════════════════ */}
      <section id="about" ref={aboutRef}
        style={{ background: P.white, padding: '90px 5%', position: 'relative', overflow: 'hidden' }}>
        <div className="v3-ghost-number" style={{
          position: 'absolute', left: -60, top: '50%', transform: 'translateY(-50%)',
          fontSize: 320, fontWeight: 900, color: 'rgba(255,69,0,0.035)',
          lineHeight: 1, userSelect: 'none', pointerEvents: 'none', letterSpacing: -10,
        }}>02</div>

        <div className="v3-about-grid" style={{
          maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1,
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center',
        }}>
          {/* Left — info card */}
          <div style={{
            opacity: aboutVisible ? 1 : 0, transform: aboutVisible ? 'none' : 'translateX(-40px)', transition: 'all 0.7s ease',
          }}>
            <div style={{
              borderRadius: 20, border: `1px solid ${P.border}`,
              background: `linear-gradient(145deg, rgba(255,90,0,0.05) 0%, rgba(255,170,0,0.04) 100%)`,
              padding: 32, position: 'relative', overflow: 'hidden',
            }}>
              {/* Certifications */}
              {certifications.length > 0 && (
                <div style={{ marginBottom: 26 }}>
                  <p style={{ fontSize: 10, fontWeight: 700, color: P.orange, textTransform: 'uppercase', letterSpacing: '0.14em', margin: '0 0 10px' }}>Certifications</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                    {certifications.map((c, i) => (
                      <span key={i} style={{ padding: '5px 12px', borderRadius: 100, background: P.white, border: `1px solid ${P.border}`, fontSize: 12, fontWeight: 600, color: P.dark }}>
                        🏅 {c}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Service areas */}
              {serviceAreas.length > 0 && (
                <div style={{ marginBottom: 26 }}>
                  <p style={{ fontSize: 10, fontWeight: 700, color: P.orange, textTransform: 'uppercase', letterSpacing: '0.14em', margin: '0 0 10px' }}>Service Areas</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                    {serviceAreas.map((a, i) => (
                      <span key={i} style={{ padding: '5px 12px', borderRadius: 100, background: P.white, border: `1px solid ${P.border}`, fontSize: 12, fontWeight: 600, color: P.dark }}>
                        📍 {a}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Hours */}
              {d.hours && (
                <div>
                  <p style={{ fontSize: 10, fontWeight: 700, color: P.orange, textTransform: 'uppercase', letterSpacing: '0.14em', margin: '0 0 10px' }}>Hours</p>
                  {(['weekdays', 'saturday', 'sunday'] as const).map(day => {
                    const val = d.hours?.[day];
                    return val ? (
                      <div key={day} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13, color: P.mid, padding: '7px 0', borderBottom: `1px solid ${P.border}` }}>
                        <span style={{ textTransform: 'capitalize', fontWeight: 600 }}>{day}</span>
                        <span>{val}</span>
                      </div>
                    ) : null;
                  })}
                </div>
              )}

              {/* Spinning wheel watermark */}
              <div style={{ position: 'absolute', bottom: -28, right: -28, opacity: 0.12 }}>
                <SpinWheel size={120} />
              </div>
            </div>
          </div>

          {/* Right — copy */}
          <div style={{
            opacity: aboutVisible ? 1 : 0, transform: aboutVisible ? 'none' : 'translateX(40px)', transition: 'all 0.7s 0.2s ease',
          }}>
            <SectionLabel text={copy?.about_label || 'Our Story'} />
            <h2 style={{ ...sectionH2, marginBottom: 18 }}>{copy?.about_heading || 'Precision in every pass.'}</h2>
            <p style={{ fontSize: 15, color: P.mid, lineHeight: 1.8, margin: '0 0 24px' }}>
              {d.description || `We are ${d.name}, ${d.city}'s premier auto detailing studio. We combine professional-grade products with meticulous attention to detail to deliver results that protect your vehicle and exceed every expectation.`}
            </p>
            {d.email && (
              <p style={{ fontSize: 14, color: P.mid, margin: '0 0 8px' }}>
                📧 <a href={`mailto:${d.email}`} style={{ color: P.orange, textDecoration: 'none' }}>{d.email}</a>
              </p>
            )}
            {d.address && <p style={{ fontSize: 14, color: P.mid, margin: '0 0 26px' }}>📍 {d.address}</p>}
            <a href={bookingUrl} className="v3-btn-primary" style={{
              padding: '14px 30px', borderRadius: 10,
              background: `linear-gradient(135deg, ${P.orange}, ${P.orangeMid})`,
              color: '#fff', fontWeight: 700, fontSize: 15,
            }}>
              {copy?.about_cta || 'Book Your Detail'}
            </a>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          FAQ
      ════════════════════════════════════════════════════════════ */}
      <section id="faq" ref={faqRef} style={{ background: P.pearl, padding: '90px 5%' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div style={{
            textAlign: 'center', marginBottom: 48,
            opacity: faqVisible ? 1 : 0, transform: faqVisible ? 'none' : 'translateY(24px)', transition: 'all 0.6s ease',
          }}>
            <SectionLabel text={copy?.faq_label || 'Got Questions?'} />
            <h2 style={sectionH2}>{copy?.faq_heading || 'Common Questions'}</h2>
          </div>
          <div style={{
            background: P.white, borderRadius: 18, border: `1px solid ${P.border}`, overflow: 'hidden',
            opacity: faqVisible ? 1 : 0, transform: faqVisible ? 'none' : 'translateY(24px)', transition: 'all 0.6s 0.18s ease',
          }}>
            {faqs.map((f, i) => <FaqRow key={i} faq={f} isLast={i === faqs.length - 1} />)}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          CTA
      ════════════════════════════════════════════════════════════ */}
      <section ref={ctaRef} style={{
        padding: '110px 5%', position: 'relative', overflow: 'hidden',
        background: `linear-gradient(160deg, ${P.dark} 0%, #1C1A2E 100%)`,
        textAlign: 'center',
      }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.18 }}><SpeedLines /></div>
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
          fontSize: 'min(26vw, 290px)', fontWeight: 900, color: 'rgba(255,255,255,0.025)',
          whiteSpace: 'nowrap', userSelect: 'none', pointerEvents: 'none', letterSpacing: -8,
        }}>DETAIL</div>
        <div className="v3-cta-wheels" style={{ position: 'absolute', left: '3%', top: '50%', transform: 'translateY(-50%)', opacity: 0.18 }}>
          <SpinWheel size={110} />
        </div>
        <div className="v3-cta-wheels" style={{ position: 'absolute', right: '3%', top: '50%', transform: 'translateY(-50%)', opacity: 0.18 }}>
          <SpinWheel size={110} />
        </div>

        <div style={{
          position: 'relative', zIndex: 1,
          opacity: ctaVisible ? 1 : 0, transform: ctaVisible ? 'none' : 'translateY(32px)', transition: 'all 0.7s ease',
        }}>
          <SectionLabel text={copy?.cta_label || 'Get In Touch'} />
          <h2 style={{
            fontSize: 'clamp(32px, 5.5vw, 74px)', fontWeight: 900, color: '#fff',
            margin: '0 0 16px', letterSpacing: '-2.5px', lineHeight: 1.05,
          }}>
            {copy?.cta_heading || 'Ready for a showroom finish?'}
          </h2>
          <p style={{ fontSize: 'clamp(14px, 2vw, 17px)', color: 'rgba(255,255,255,0.5)', margin: '0 auto 40px', maxWidth: 440, lineHeight: 1.65 }}>
            {copy?.cta_subheading || 'Book online in 60 seconds or give us a call.'}
          </p>
          <div className="v3-cta-btns" style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href={bookingUrl} className="v3-btn-primary" style={{
              padding: '17px 44px', borderRadius: 10,
              background: `linear-gradient(135deg, ${P.orange} 0%, ${P.orangeGold} 100%)`,
              color: '#fff', fontWeight: 800, fontSize: 16,
            }}>
              {copy?.cta_primary || 'Book Online'}
            </a>
            {d.phone && (
              <a href={`tel:${d.phone}`} className="v3-btn-outline" style={{
                padding: '17px 44px', borderRadius: 10,
                border: '2px solid rgba(255,255,255,0.18)', color: '#fff', fontWeight: 700, fontSize: 16,
              }}>
                📞 {d.phone}
              </a>
            )}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          FOOTER
      ════════════════════════════════════════════════════════════ */}
      <footer style={{ background: '#08080F', padding: '36px 5%', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="v3-footer-inner" style={{
          maxWidth: 1200, margin: '0 auto',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 28, height: 28, borderRadius: 6,
              background: `linear-gradient(135deg, ${P.orange}, ${P.orangeGold})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round">
                <path d="M12 2C12 2 5 9.5 5 14a7 7 0 0 0 14 0C19 9.5 12 2 12 2Z" />
              </svg>
            </div>
            <span style={{ fontWeight: 700, color: 'rgba(255,255,255,0.75)', fontSize: 14 }}>{d.name}</span>
          </div>
          <div className="v3-footer-links" style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            {d.phone   && <a href={`tel:${d.phone}`}    style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13, textDecoration: 'none' }}>{d.phone}</a>}
            {d.email   && <a href={`mailto:${d.email}`} style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13, textDecoration: 'none' }}>{d.email}</a>}
            {d.address && <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13 }}>{d.address}</span>}
          </div>
          <span style={{ color: 'rgba(255,255,255,0.18)', fontSize: 12 }}>© {new Date().getFullYear()} {d.name}</span>
        </div>
      </footer>
    </div>
  );
}
