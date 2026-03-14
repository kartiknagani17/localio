'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import type { RefObject, ReactNode } from 'react';
import { TemplateProps, BusinessHours, GalleryItem, SiteCopy } from '../../types';

// ── Palette ────────────────────────────────────────────────────────────────
const P = {
  cream:   '#F8F6F1',
  white:   '#FFFFFF',
  surface: '#EFEFEA',
  navy:    '#0F1F3D',
  navyMid: '#1A3460',
  gold:    '#C9A84C',
  goldLt:  '#F0D98A',
  ink:     '#111118',
  mid:     '#4A4A58',
  light:   '#9090A0',
  border:  '#E2E0D8',
};

// ── Hooks ──────────────────────────────────────────────────────────────────
function useInView(threshold = 0.15): [RefObject<HTMLDivElement>, boolean] {
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

function useCounter(target: number, duration = 1800, active = false, isFloat = false): number {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(isFloat ? parseFloat((eased * target).toFixed(1)) : Math.floor(eased * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [active, target, duration, isFloat]);
  return val;
}

// ── Cursor ─────────────────────────────────────────────────────────────────
function Cursor({ isPreview }: { isPreview?: boolean }) {
  const dot   = useRef<HTMLDivElement>(null);
  const ring  = useRef<HTMLDivElement>(null);
  const pos   = useRef({ x: 0, y: 0 });
  const lag   = useRef({ x: 0, y: 0 });
  const label = useRef<HTMLSpanElement>(null);
  const raf   = useRef<number | null>(null);

  // All hooks called unconditionally (Rules of Hooks).
  // isPreview guard inside the effect prevents event listeners / rAF from attaching.
  // The render guard below prevents the cursor style tag from being injected.
  useEffect(() => {
    if (isPreview) return;
    const move = (e: MouseEvent) => { pos.current = { x: e.clientX, y: e.clientY }; };
    const over = (e: MouseEvent) => {
      const t    = (e.target as HTMLElement).closest('[data-cursor]') as HTMLElement | null;
      const type = t?.dataset.cursor || 'default';
      if (dot.current)   dot.current.dataset.type   = type;
      if (ring.current)  ring.current.dataset.type  = type;
      if (label.current) label.current.textContent  = t?.dataset.cursorLabel || '';
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseover', over);
    const animate = () => {
      lag.current.x += (pos.current.x - lag.current.x) * 0.12;
      lag.current.y += (pos.current.y - lag.current.y) * 0.12;
      if (dot.current)  dot.current.style.transform  = `translate(${pos.current.x - 5}px,${pos.current.y - 5}px)`;
      if (ring.current) ring.current.style.transform = `translate(${lag.current.x - 22}px,${lag.current.y - 22}px)`;
      raf.current = requestAnimationFrame(animate);
    };
    raf.current = requestAnimationFrame(animate);
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseover', over);
      if (raf.current !== null) cancelAnimationFrame(raf.current);
    };
  }, [isPreview]);

  if (isPreview) return null;

  return (
    <>
      <style suppressHydrationWarning dangerouslySetInnerHTML={{ __html: `
        * { cursor: none !important; }
        #cd2-dot { position:fixed;top:0;left:0;width:10px;height:10px;border-radius:50%;background:${P.navy};z-index:99999;pointer-events:none;transition:width .2s,height .2s,background .2s,border-radius .2s; }
        #cd2-dot[data-type="link"] { width:8px;height:8px;background:${P.gold}; }
        #cd2-dot[data-type="drag"] { width:6px;height:6px;background:${P.navy}; }
        #cd2-dot[data-type="btn"]  { width:12px;height:12px;background:${P.white}; }
        #cd2-ring { position:fixed;top:0;left:0;width:44px;height:44px;border-radius:50%;border:1.5px solid ${P.navy};z-index:99998;pointer-events:none;transition:width .25s,height .25s,border-color .25s,border-radius .25s,background .25s;display:flex;align-items:center;justify-content:center; }
        #cd2-ring[data-type="link"] { width:54px;height:54px;border-color:${P.gold};background:rgba(201,168,76,0.06); }
        #cd2-ring[data-type="drag"] { width:72px;height:72px;border-color:${P.navy};border-radius:12px;background:rgba(15,31,61,0.04); }
        #cd2-ring[data-type="btn"]  { width:64px;height:64px;border-color:${P.navy};background:rgba(15,31,61,0.05); }
        #cd2-label { font:700 11px/1 'Inter',sans-serif;letter-spacing:.08em;color:${P.navy};text-transform:uppercase;opacity:0;transition:opacity .2s; }
        #cd2-ring[data-type="drag"] #cd2-label { opacity:1; }
        #cd2-ring[data-type="btn"]  #cd2-label { opacity:1; }
      `}} />
      <div id="cd2-dot"  ref={dot}  data-type="default" />
      <div id="cd2-ring" ref={ring} data-type="default">
        <span id="cd2-label" ref={label} />
      </div>
    </>
  );
}

// ── Particles ──────────────────────────────────────────────────────────────
type Particle = { x: number; y: number; vx: number; vy: number; r: number; pulse: number };

function Particles({ count = 32, color = P.navy, opacity = 0.12 }: { count?: number; color?: string; opacity?: number }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = canvas.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    let W = c.offsetWidth, H = c.offsetHeight;
    c.width = W; c.height = H;
    const pts: Particle[] = Array.from({ length: count }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 2 + 1, pulse: Math.random() * Math.PI * 2,
    }));
    const toRgb = (h: string) => {
      const r = parseInt(h.slice(1,3),16), g = parseInt(h.slice(3,5),16), b = parseInt(h.slice(5,7),16);
      return `rgba(${r},${g},${b},`;
    };
    const rgb = toRgb(color);
    let rafId: number;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      pts.forEach((p: Particle) => {
        p.x += p.vx; p.y += p.vy; p.pulse += 0.02;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        const a = opacity * (0.6 + 0.4 * Math.sin(p.pulse));
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = rgb + a + ')'; ctx.fill();
      });
      pts.forEach((a: Particle, i: number) => pts.slice(i + 1).forEach((b: Particle) => {
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < 120) {
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = rgb + (opacity * 0.4 * (1 - d / 120)) + ')';
          ctx.lineWidth = 0.6; ctx.stroke();
        }
      }));
      rafId = requestAnimationFrame(draw);
    };
    draw();
    const resize = () => { W = c.offsetWidth; H = c.offsetHeight; c.width = W; c.height = H; };
    window.addEventListener('resize', resize);
    return () => { cancelAnimationFrame(rafId); window.removeEventListener('resize', resize); };
  }, [color, count, opacity]);
  return <canvas ref={canvas} style={{ position:'absolute',inset:0,width:'100%',height:'100%',pointerEvents:'none' }} />;
}

// ── Fade wrapper ───────────────────────────────────────────────────────────
interface FadeProps { children: ReactNode; delay?: number; dir?: 'up' | 'down' | 'left' | 'right'; }

function Fade({ children, delay = 0, dir = 'up' }: FadeProps) {
  const [ref, vis] = useInView();
  const t: Record<'up' | 'down' | 'left' | 'right', string> = {
    up:    'translateY(32px)',
    down:  'translateY(-32px)',
    left:  'translateX(-32px)',
    right: 'translateX(32px)',
  };
  return (
    <div ref={ref} style={{
      opacity: vis ? 1 : 0,
      transform: vis ? 'none' : t[dir],
      transition: `opacity .7s ${delay}s cubic-bezier(.16,1,.3,1), transform .7s ${delay}s cubic-bezier(.16,1,.3,1)`,
    }}>
      {children}
    </div>
  );
}

// ── Stat counter ───────────────────────────────────────────────────────────
interface StatCounterProps { value: string | number; suffix: string; label: string; }

function StatCounter({ value, suffix, label }: StatCounterProps) {
  const [ref, vis] = useInView(0.3);
  const numeric = typeof value === 'number' ? value : parseFloat(String(value).replace(/[^0-9.]/g, '')) || 0;
  const isFloat  = !Number.isInteger(numeric);
  const count    = useCounter(numeric, 1800, vis, isFloat);
  return (
    <div ref={ref} style={{ textAlign:'center', padding:'0 24px' }}>
      <div style={{ fontSize:52, fontWeight:800, color:P.navy, lineHeight:1, fontFamily:'Inter,sans-serif', letterSpacing:'-0.02em' }}>
        {count}{suffix}
      </div>
      <div style={{ fontSize:14, color:P.mid, marginTop:8, fontWeight:500, letterSpacing:'.06em', textTransform:'uppercase' }}>
        {label}
      </div>
    </div>
  );
}

// ── Before/After Slider ────────────────────────────────────────────────────
interface SliderProps { before: string; after: string; label?: string; }

function Slider({ before, after, label }: SliderProps) {
  const [pos, setPos]   = useState(50);
  const dragging        = useRef(false);
  const container       = useRef<HTMLDivElement>(null);

  const updatePos = useCallback((clientX: number) => {
    const r = container.current?.getBoundingClientRect();
    if (!r) return;
    setPos(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)));
  }, []);

  return (
    <div
      ref={container}
      data-cursor="drag" data-cursor-label="DRAG"
      onMouseDown={e => { dragging.current = true; updatePos(e.clientX); }}
      onMouseMove={e => { if (dragging.current) updatePos(e.clientX); }}
      onMouseUp={() => { dragging.current = false; }}
      onMouseLeave={() => { dragging.current = false; }}
      onTouchStart={e => updatePos(e.touches[0].clientX)}
      onTouchMove={e => updatePos(e.touches[0].clientX)}
      style={{ position:'relative', width:'100%', aspectRatio:'16/9', borderRadius:16, overflow:'hidden', userSelect:'none' }}
    >
      <img src={before} alt="Before" style={{ position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover' }} onError={e => { (e.currentTarget as HTMLImageElement).style.background = '#ccc'; }} />
      <div style={{ position:'absolute', inset:0, clipPath:`inset(0 ${100 - pos}% 0 0)` }}>
        <img src={after} alt="After" style={{ position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover' }} onError={e => { (e.currentTarget as HTMLImageElement).style.background = '#eee'; }} />
      </div>
      <div style={{ position:'absolute',top:0,bottom:0,left:`${pos}%`,width:2,background:P.white,transform:'translateX(-50%)',pointerEvents:'none' }} />
      <div style={{ position:'absolute',top:'50%',left:`${pos}%`,transform:'translate(-50%,-50%)',width:44,height:44,borderRadius:'50%',background:P.white,boxShadow:'0 2px 16px rgba(0,0,0,0.2)',display:'flex',alignItems:'center',justifyContent:'center',pointerEvents:'none' }}>
        <svg width="20" height="14" viewBox="0 0 20 14" fill="none">
          <path d="M5 7H15M1 7L5 3M1 7L5 11M19 7L15 3M19 7L15 11" stroke={P.navy} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div style={{ position:'absolute',top:14,left:14,background:'rgba(15,31,61,0.75)',color:P.white,fontSize:12,fontWeight:700,padding:'4px 10px',borderRadius:6,letterSpacing:'.06em',pointerEvents:'none' }}>BEFORE</div>
      <div style={{ position:'absolute',top:14,right:14,background:'rgba(15,31,61,0.75)',color:P.white,fontSize:12,fontWeight:700,padding:'4px 10px',borderRadius:6,letterSpacing:'.06em',pointerEvents:'none' }}>AFTER</div>
      {label && (
        <div style={{ position:'absolute',bottom:0,left:0,right:0,padding:'32px 16px 14px',background:'linear-gradient(transparent,rgba(15,31,61,0.7))',color:P.white,fontSize:13,fontWeight:600,textAlign:'center',pointerEvents:'none' }}>{label}</div>
      )}
    </div>
  );
}

// ── FAQ item ───────────────────────────────────────────────────────────────
interface FaqItemProps { q: string; a: string; i: number; }

function FaqItem({ q, a, i }: FaqItemProps) {
  const [open, setOpen] = useState(false);
  return (
    <Fade delay={i * 0.06}>
      <div
        data-cursor="link"
        onClick={() => setOpen(o => !o)}
        style={{ borderBottom:`1px solid ${P.border}`, padding:'20px 0', cursor:'default' }}
      >
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', gap:16 }}>
          <span style={{ fontSize:16, fontWeight:600, color:P.ink }}>{q}</span>
          <div style={{ width:28, height:28, borderRadius:'50%', border:`1.5px solid ${P.navy}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, transition:'transform .3s', transform: open ? 'rotate(45deg)' : 'none' }}>
            <svg width="12" height="12" viewBox="0 0 12 12"><path d="M6 1v10M1 6h10" stroke={P.navy} strokeWidth="1.8" strokeLinecap="round"/></svg>
          </div>
        </div>
        <div style={{ maxHeight: open ? 300 : 0, overflow:'hidden', transition:'max-height .4s cubic-bezier(.16,1,.3,1)' }}>
          <p style={{ margin:'12px 0 4px', fontSize:15, color:P.mid, lineHeight:1.7 }}>{a}</p>
        </div>
      </div>
    </Fade>
  );
}

// ── Nav ────────────────────────────────────────────────────────────────────
interface NavProps { scrolled: boolean; name: string; bookingUrl?: string; navCta?: string; isMobile?: boolean; }

function Nav({ scrolled, name, bookingUrl, navCta, isMobile }: NavProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <nav style={{
      position:'fixed', top:0, left:0, right:0, zIndex:1000,
      background: scrolled ? 'rgba(248,246,241,0.95)' : 'transparent',
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
      borderBottom: scrolled ? `1px solid ${P.border}` : 'none',
      transition:'all .4s cubic-bezier(.16,1,.3,1)',
      padding:'0 5%',
    }}>
      <div style={{ maxWidth:1200, margin:'0 auto', height:68, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        {/* Logo */}
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:32, height:32, borderRadius:8, background:`linear-gradient(135deg,${P.navy},${P.navyMid})`, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 11 L3 6 L6 5 L10 5 L13 6 L14 11 Z" stroke={P.white} strokeWidth="1.2" fill="none" strokeLinejoin="round" />
              <circle cx="5"  cy="11.5" r="1.5" fill={P.gold} />
              <circle cx="11" cy="11.5" r="1.5" fill={P.gold} />
            </svg>
          </div>
          <span style={{ fontSize:15, fontWeight:800, color:P.navy, letterSpacing:'-0.01em' }}>
            {name}
          </span>
        </div>
        {/* Desktop Links */}
        <div style={{ display: isMobile ? 'none' : 'flex', alignItems:'center', gap:32 }}>
          {['Services','Gallery','Reviews','FAQ'].map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} data-cursor="link"
              style={{ fontSize:14, fontWeight:500, color:P.navy, textDecoration:'none', opacity:.75, transition:'opacity .2s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = '1'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = '.75'; }}
            >{l}</a>
          ))}
          {bookingUrl && (
            <a href={bookingUrl} data-cursor="btn" data-cursor-label="BOOK"
              style={{ padding:'10px 22px', background:P.navy, color:P.white, borderRadius:8, fontSize:14, fontWeight:700, textDecoration:'none', letterSpacing:'.02em', transition:'background .2s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = P.navyMid; }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = P.navy; }}
            >{navCta ?? 'Book Now'}</a>
          )}
        </div>
        {/* Mobile hamburger */}
        {isMobile && (
          <button
            onClick={() => setMenuOpen(o => !o)}
            style={{ background:'none', border:'none', cursor:'pointer', padding:8, display:'flex', flexDirection:'column', gap:5 }}
          >
            <span style={{ display:'block', width:22, height:2, background:P.navy, borderRadius:2 }} />
            <span style={{ display:'block', width:22, height:2, background:P.navy, borderRadius:2 }} />
            <span style={{ display:'block', width:22, height:2, background:P.navy, borderRadius:2 }} />
          </button>
        )}
      </div>
      {/* Mobile menu dropdown */}
      {isMobile && menuOpen && (
        <div style={{ position:'absolute', top:'100%', left:0, right:0, background:'rgba(248,246,241,0.98)', borderTop:`1px solid ${P.border}`, padding:'16px 5%', display:'flex', flexDirection:'column', gap:16, zIndex:99, backdropFilter:'blur(12px)' }}>
          {['Services','Gallery','Reviews','FAQ'].map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setMenuOpen(false)}
              style={{ fontSize:16, color:P.navy, textDecoration:'none', fontWeight:600, padding:'8px 0', borderBottom:`1px solid ${P.border}` }}
            >{l}</a>
          ))}
          {bookingUrl && (
            <a href={bookingUrl} style={{ padding:'12px 24px', background:P.navy, color:P.white, textAlign:'center', textDecoration:'none', fontWeight:700, fontSize:14, borderRadius:8 }}>{navCta ?? 'Book Now'}</a>
          )}
        </div>
      )}
    </nav>
  );
}

// ── Helpers ────────────────────────────────────────────────────────────────
function formatHours(hours: BusinessHours | undefined | null): string | null {
  if (!hours) return null;
  const parts: string[] = [];
  if (hours.weekdays) parts.push(hours.weekdays);
  if (hours.saturday) parts.push(hours.saturday);
  if (hours.sunday)   parts.push(hours.sunday);
  return parts.join('  ·  ') || null;
}

type SliderPair = { before: string; after: string; label: string };

function getSliderPairs(gallery: GalleryItem[]): SliderPair[] {
  if (!gallery || gallery.length === 0) return [];
  const befores = gallery.filter(g => g.type === 'before');
  const afters  = gallery.filter(g => g.type === 'after');
  const general = gallery.filter(g => g.type === 'general');

  if (befores.length > 0 && afters.length > 0) {
    const count = Math.min(befores.length, afters.length);
    return Array.from({ length: count }, (_, i) => ({
      before: befores[i].imageUrl,
      after:  afters[i].imageUrl,
      label:  befores[i].label || afters[i].label || '',
    }));
  }

  if (general.length >= 2) {
    return [{ before: general[0].imageUrl, after: general[1].imageUrl, label: general[0].label || '' }];
  }

  const img = gallery[0];
  return [{ before: img.imageUrl, after: img.imageUrl, label: img.label || '' }];
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN TEMPLATE COMPONENT
// ══════════════════════════════════════════════════════════════════════════════
export default function CarDetailingTemplate({ businessData, isPreview }: TemplateProps) {

  // ── Read directly from prop — null-safe, never copy data into useState ─────
  const name           = businessData.name           || 'Your Business Name';
  const city           = businessData.city           || 'Your City';
  const tagline        = businessData.tagline        || 'Showroom Condition. Every Time.';
  const subTagline     = businessData.subTagline     || 'Professional detailing services trusted by vehicle owners across the area.';
  const description    = businessData.description    || 'We started with one belief: every vehicle deserves the same level of care you\'d give a brand-new car. Our certified technicians use only professional-grade products — no shortcuts, no filler services.';
  const phone          = businessData.phone          || '(555) 000-0000';
  const email          = businessData.email          || 'hello@yourbusiness.com';
  const address        = businessData.address        || '123 Main St, Your City';
  const bookingUrl     = businessData.bookingUrl     || '#';
  const hours          = businessData.hours;
  // Use ?? [] so null values (from Gemini/DB) fall through to the fallback defaults below
  const services       = businessData.services       ?? [];
  const gallery        = businessData.gallery        ?? [];
  const testimonials   = businessData.testimonials   ?? [];
  const faq            = businessData.faq            ?? [];
  const stats          = businessData.stats          ?? [];
  const certifications = businessData.certifications ?? [];
  const serviceAreas   = businessData.serviceAreas   ?? [];
  const copy           = businessData.copy           ?? {} as SiteCopy;

  // ── Fallback data — used when AI hasn't generated content yet ────────────
  const resolvedServices = services.length > 0 ? services : [
    { name: 'Essential Wash',   price: '$79',  duration: '2–3 hrs', description: 'A thorough exterior wash, tire dressing, window clean, and interior vacuum.',                          features: ['Best Value',     'Hand wash & dry',       'Wheel & tire clean', 'Window polish',    'Interior vacuum']   },
    { name: 'Full Detail',      price: '$249', duration: '5–7 hrs', description: 'Our signature full-car detail — exterior polish, deep interior clean, and leather conditioning.',        features: ['Most Popular',   'Clay bar treatment',    'One-step polish',    'Leather condition', 'Engine bay clean']  },
    { name: 'Ceramic Coat',     price: '$899', duration: '2 days',  description: 'Professional-grade ceramic coating with up to 5 years of hydrophobic paint protection.',               features: ['Best Protection','Paint decontamination', 'Paint correction',   '5-year coating',   'Warranty card']     },
    { name: 'Paint Correction', price: '$449', duration: '1–2 days',description: 'Multi-stage machine polish to eliminate swirls, scratches, and oxidation.',                           features: ['Specialist',     'Swirl removal',         'Scratch reduction',  'Oxidation removal','High-gloss finish'] },
  ];

  const resolvedStats = stats.length > 0 ? stats : [
    { value: '2400', suffix: '+', label: 'Cars Detailed'      },
    { value: '11',   suffix: '+', label: 'Years in Business'  },
    { value: '4.9',  suffix: '★', label: 'Average Rating'     },
    { value: '100',  suffix: '%', label: 'Satisfaction Rate'  },
  ];

  const resolvedCerts = certifications.length > 0 ? certifications : [
    'IDA Certified Detailer',
    'Ceramic Pro Certified',
    '3M Authorized Installer',
    'PPF Certified Applicator',
  ];

  const resolvedAreas = serviceAreas.length > 0 ? serviceAreas : [city];

  const resolvedTestimonials = testimonials.length > 0 ? testimonials : [
    { name: 'Marcus T.', context: 'Tesla Model S',      rating: 5, text: 'Absolutely obsessed with the result. My car looks better than when I drove it off the lot. The ceramic coat is insane — water just sheets right off.' },
    { name: 'Sarah K.',  context: 'Audi Q7',            rating: 5, text: 'I\'ve tried three other detailers in the area. None of them come close. These guys are meticulous, professional, and the results speak for themselves.' },
    { name: 'Daniel R.', context: 'Ford F-150',         rating: 5, text: 'Brought in my truck after a road trip — it was filthy inside and out. Got it back looking brand new. Worth every cent and more.' },
    { name: 'Priya M.',  context: 'BMW X5',             rating: 5, text: 'The paint correction removed scratches I\'d accepted as permanent. Genuinely shocked at what they can do. Will be back every quarter.' },
    { name: 'James L.',  context: 'Corvette C8',        rating: 5, text: 'They treated my car like it was their own. The attention to detail is unmatched — every crevice, every panel. Truly a cut above.' },
    { name: 'Olivia B.', context: 'Range Rover Sport',  rating: 5, text: 'Booked the full detail before selling it. The buyer offered asking price on the spot. Best ROI of any service I\'ve ever paid for.' },
  ];

  const resolvedFaq = faq.length > 0 ? faq : [
    { q: 'How long does a full detail take?',       a: 'Our Full Detail takes 5–7 hours. We ask that you drop off in the morning and collect in the afternoon. For ceramic coatings, allow 2 full days.' },
    { q: 'Do you offer mobile detailing?',          a: 'Yes — we offer mobile service for Essential Wash and Full Detail packages within a 15-mile radius. An additional travel fee applies.' },
    { q: 'How often should I get my car detailed?', a: 'For daily drivers, we recommend a full detail every 3–4 months. Ceramic-coated vehicles need a maintenance wash every 6–8 weeks.' },
    { q: 'Is ceramic coating worth it?',            a: 'For any vehicle you plan to keep for 2+ years, absolutely. The coating protects your paint from UV, road grime, and light scratches.' },
    { q: 'How should I prepare for my appointment?',a: 'Remove all personal items from the interior. Empty the trunk. That\'s it — we handle everything else from there.' },
  ];

  const resolvedGallery = gallery.length > 0 ? gallery : [
    { type: 'before' as const, imageUrl: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=800&q=80', label: 'Before' },
    { type: 'after'  as const, imageUrl: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=800&q=80', label: 'After'  },
    { type: 'before' as const, imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80', label: 'Before' },
    { type: 'after'  as const, imageUrl: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&q=80', label: 'After'  },
  ];

  const resolvedHours = (hours && formatHours(hours))
    ? hours
    : { weekdays: 'Mon – Fri: 9am – 6pm', saturday: 'Sat: 9am – 4pm', sunday: 'Sun: Closed' };

  // ── UI state only (not data) ───────────────────────────────────────────────
  const [scrolled,      setScrolled]      = useState(false);
  const [activeService, setActiveService] = useState(0);
  const [galleryIdx,    setGalleryIdx]    = useState(0);
  const [reviewPage,    setReviewPage]    = useState(0);

  // Container-width tracking for responsive inline styles
  const rootRef = useRef<HTMLDivElement>(null);
  const [cw, setCw] = useState(1280);
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const obs = new ResizeObserver(() => setCw(el.clientWidth));
    obs.observe(el);
    setCw(el.clientWidth);
    return () => obs.disconnect();
  }, []);
  const isMobile = cw < 768;
  const isTablet = cw < 1024;

  useEffect(() => {
    if (isPreview) { setScrolled(true); return; }
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, [isPreview]);

  useEffect(() => { setGalleryIdx(0); }, [gallery.length]);

  const reviewsPerPage   = 3;
  const totalReviewPages = Math.max(1, Math.ceil(resolvedTestimonials.length / reviewsPerPage));
  useEffect(() => {
    if (resolvedTestimonials.length <= reviewsPerPage) return;
    const t = setInterval(() => setReviewPage(p => (p + 1) % totalReviewPages), 5000);
    return () => clearInterval(t);
  }, [resolvedTestimonials.length, totalReviewPages]);

  // ── Derived display values ─────────────────────────────────────────────────
  const visibleReviews = resolvedTestimonials.slice(reviewPage * reviewsPerPage, reviewPage * reviewsPerPage + reviewsPerPage);
  const sliderPairs    = getSliderPairs(resolvedGallery);
  const hoursString    = formatHours(resolvedHours);

  const marqueeItems = [
    ...resolvedCerts,
    ...resolvedAreas.map(a => `Serving ${a}`),
    ...resolvedCerts,
    ...resolvedAreas.map(a => `Serving ${a}`),
  ];

  const heroBadge = `${resolvedCerts[0].toUpperCase()} · ${city.toUpperCase()}`;

  const heroTrustItems = [
    `✓ ${resolvedStats[2]?.value ?? 4.9}${resolvedStats[2]?.suffix ?? '★'} Rating`,
    `✓ ${resolvedStats[1]?.value ?? 10}${resolvedStats[1]?.suffix ?? '+'} Years Experience`,
    `✓ ${resolvedStats[3]?.value ?? 100}${resolvedStats[3]?.suffix ?? '%'} Satisfaction`,
  ];

  const reviewCount = `${resolvedStats[0]?.value ?? '500'}${resolvedStats[0]?.suffix ?? '+'} Happy Customers`;

  const avgRating = resolvedTestimonials.length > 0
    ? (resolvedTestimonials.reduce((sum, t) => sum + (t.rating || 5), 0) / resolvedTestimonials.length).toFixed(1)
    : '5.0';

  return (
    <div ref={rootRef} style={{ fontFamily:"'Inter','Helvetica Neue',sans-serif", background:P.cream, color:P.ink, overflowX:'hidden' }}>
      <style suppressHydrationWarning dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        @keyframes cd2-float   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes cd2-spin    { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes cd2-blink   { 0%,100%{opacity:1} 50%{opacity:.3} }
        @keyframes cd2-marquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        .cd2-cert-badge {
          display:inline-flex;align-items:center;gap:8px;
          padding:8px 16px;border-radius:100px;
          background:linear-gradient(135deg,${P.gold}22,${P.goldLt}11);
          border:1px solid ${P.gold}55;
          font-size:13px;font-weight:600;color:${P.navy};white-space:nowrap;
        }
        .cd2-service-card {
          border-radius:16px;padding:28px;
          background:${P.white};border:1.5px solid ${P.border};
          transition:transform .3s cubic-bezier(.16,1,.3,1),box-shadow .3s,border-color .3s;
          cursor:default;
        }
        .cd2-service-card.active {
          border-color:${P.navy};
          box-shadow:0 8px 40px rgba(15,31,61,.12);
          transform:translateY(-4px);
        }
        .cd2-review-card {
          background:${P.white};border-radius:16px;padding:28px;
          border:1px solid ${P.border};transition:box-shadow .3s;
        }
        .cd2-review-card:hover { box-shadow:0 8px 32px rgba(15,31,61,.08); }
      `}} />

      <Cursor isPreview={isPreview} />
      <Nav scrolled={scrolled} name={name} bookingUrl={bookingUrl} navCta={copy.nav_cta} isMobile={isMobile} />

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section style={{ position:'relative', minHeight:'100vh', display:'flex', alignItems:'center', background:`linear-gradient(160deg,${P.white} 0%,${P.cream} 60%,${P.surface} 100%)`, overflow:'hidden', paddingTop:68 }}>
        <Particles count={40} color={P.navy} opacity={0.08} />
        <div style={{ position:'absolute', right:'-8%', top:'10%', width:600, height:600, borderRadius:'50%', border:`1.5px solid ${P.navy}15`, animation:'cd2-spin 40s linear infinite', pointerEvents:'none' }} />
        <div style={{ position:'absolute', right:'-4%', top:'15%', width:440, height:440, borderRadius:'50%', border:`1.5px solid ${P.gold}30`, animation:'cd2-spin 28s linear infinite reverse', pointerEvents:'none' }} />

        <div style={{ maxWidth:1200, margin:'0 auto', padding:'80px 5%', width:'100%', display:'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap:80, alignItems:'center' }}>
          {/* Left */}
          <div>
            {/* Trust badge */}
            <div style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'7px 14px', borderRadius:100, background:`${P.gold}18`, border:`1px solid ${P.gold}50`, marginBottom:28 }}>
              <div style={{ width:8, height:8, borderRadius:'50%', background:P.gold, animation:'cd2-blink 2s infinite' }} />
              <span style={{ fontSize:12, fontWeight:700, color:P.navy, letterSpacing:'.08em' }}>{heroBadge}</span>
            </div>

            <h1 style={{ fontSize:'clamp(40px,5vw,64px)', fontWeight:900, lineHeight:1.06, color:P.navy, margin:'0 0 20px', letterSpacing:'-0.03em' }}>
              {tagline
                ? tagline.split('.').filter(Boolean).map((part, i, arr) => (
                    <span key={i} style={{ display:'block', animation:`cd2-float ${3.5 + i * 0.5}s ease-in-out infinite`, animationDelay:`${i * 0.4}s` }}>
                      {part.trim()}{i < arr.length - 1 ? '.' : ''}
                    </span>
                  ))
                : <span style={{ display:'block', animation:'cd2-float 3.5s ease-in-out infinite' }}>{name}</span>
              }
            </h1>

            <p style={{ fontSize:18, color:P.mid, lineHeight:1.7, maxWidth:480, margin:'0 0 36px' }}>
              {subTagline || `Professional detailing services in ${city}. Book your appointment today.`}
            </p>

            <div style={{ display:'flex', gap:14, flexWrap:'wrap' }}>
              <a href={bookingUrl} data-cursor="btn" data-cursor-label="BOOK"
                style={{ padding:'15px 32px', background:P.navy, color:P.white, borderRadius:10, fontSize:15, fontWeight:700, textDecoration:'none', letterSpacing:'.01em', transition:'all .2s', display:'flex', alignItems:'center', gap:10 }}
                onMouseEnter={e => { e.currentTarget.style.background = P.navyMid; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = P.navy;    e.currentTarget.style.transform = 'none'; }}
              >
                {copy.hero_cta_primary ?? 'Book a Detail'}
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </a>
              <a href="#gallery" data-cursor="link"
                style={{ padding:'15px 32px', background:'transparent', color:P.navy, borderRadius:10, fontSize:15, fontWeight:600, textDecoration:'none', border:`1.5px solid ${P.navy}40`, transition:'all .2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = P.navy;        e.currentTarget.style.background = `${P.navy}06`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = `${P.navy}40`; e.currentTarget.style.background = 'transparent'; }}
              >{copy.hero_cta_secondary ?? 'See Results'}</a>
            </div>

            <div style={{ display:'flex', alignItems:'center', gap:20, marginTop:36, flexWrap:'wrap' }}>
              {heroTrustItems.map(t => (
                <span key={t} style={{ fontSize:13, color:P.mid, fontWeight:500 }}>{t}</span>
              ))}
            </div>
          </div>

          {/* Right — floating car graphic */}
          <div style={{ position:'relative', display: isMobile ? 'none' : 'flex', alignItems:'center', justifyContent:'center' }}>
            <div style={{ position:'relative', animation:'cd2-float 5s ease-in-out infinite' }}>
              <div style={{ width:460, height:300, borderRadius:20, background:`linear-gradient(135deg,${P.navy},${P.navyMid})`, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 32px 80px rgba(15,31,61,.25), 0 0 0 1px rgba(15,31,61,.08)', overflow:'hidden', position:'relative' }}>
                <Particles count={18} color={P.white} opacity={0.15} />
                <svg width="320" height="160" viewBox="0 0 320 160" fill="none" style={{ position:'relative', zIndex:1 }}>
                  <path d="M40 110 L55 75 L80 55 L140 48 L200 48 L245 55 L275 75 L280 110 Z" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinejoin="round" />
                  <path d="M85 55 L95 72 L225 72 L235 55 Z" fill="rgba(255,255,255,0.18)" />
                  <circle cx="95"  cy="110" r="26" fill="rgba(255,255,255,0.1)"  stroke="rgba(255,255,255,0.35)" strokeWidth="2" />
                  <circle cx="95"  cy="110" r="14" fill="rgba(255,255,255,0.15)" />
                  <circle cx="225" cy="110" r="26" fill="rgba(255,255,255,0.1)"  stroke="rgba(255,255,255,0.35)" strokeWidth="2" />
                  <circle cx="225" cy="110" r="14" fill="rgba(255,255,255,0.15)" />
                  <path d="M55 75 L275 75" stroke={P.gold} strokeWidth="1" opacity="0.6" />
                  <circle cx="95"  cy="110" r="6" fill={P.gold} opacity="0.8" />
                  <circle cx="225" cy="110" r="6" fill={P.gold} opacity="0.8" />
                  <path d="M110 58 L105 70" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M130 54 L126 66" stroke="rgba(255,255,255,0.3)" strokeWidth="1"   strokeLinecap="round" />
                </svg>
              </div>
              <div style={{ position:'absolute', bottom:-20, left:'10%', right:'10%', height:40, borderRadius:'50%', background:P.navy, filter:'blur(24px)', opacity:.3 }} />
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{ position:'absolute', bottom:36, left:'50%', transform:'translateX(-50%)', display:'flex', flexDirection:'column', alignItems:'center', gap:8 }}>
          <span style={{ fontSize:11, letterSpacing:'.1em', color:P.light, fontWeight:600, textTransform:'uppercase' }}>Scroll</span>
          <div style={{ width:1, height:40, background:`linear-gradient(${P.navy},transparent)`, animation:'cd2-float 2s ease-in-out infinite' }} />
        </div>
      </section>

      {/* ── TRUST MARQUEE ─────────────────────────────────────────────────── */}
      <div style={{ background:P.navy, padding:'14px 0', overflow:'hidden' }}>
        <div style={{ display:'flex', animation:'cd2-marquee 22s linear infinite', width:'max-content' }}>
          {marqueeItems.map((t, i) => (
            <span key={i} style={{ display:'inline-flex', alignItems:'center', gap:24, padding:'0 28px', fontSize:13, fontWeight:600, color:'rgba(255,255,255,0.7)', letterSpacing:'.06em', whiteSpace:'nowrap' }}>
              <span style={{ color:P.gold }}>✦</span>{t}
            </span>
          ))}
        </div>
      </div>

      {/* ── STATS ─────────────────────────────────────────────────────────── */}
      <section style={{ background:P.white, padding:'72px 5%', borderBottom:`1px solid ${P.border}` }}>
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <div style={{ display:'grid', gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : `repeat(${Math.min(resolvedStats.length, 4)},1fr)`, gap:0 }}>
            {resolvedStats.slice(0, 4).map((s, i) => (
              <div key={i} style={{ borderRight: i < Math.min(resolvedStats.length, 4) - 1 ? `1px solid ${P.border}` : 'none' }}>
                <StatCounter value={s.value} suffix={s.suffix || ''} label={s.label} />
              </div>
            ))}
          </div>
          <Fade delay={0.2}>
            <div style={{ display:'flex', flexWrap:'wrap', gap:10, justifyContent:'center', marginTop:48, paddingTop:40, borderTop:`1px solid ${P.border}` }}>
              {resolvedCerts.map((c, i) => (
                <div key={i} className="cd2-cert-badge">
                  <span style={{ color:P.gold }}>★</span>{c}
                </div>
              ))}
            </div>
          </Fade>
        </div>
      </section>

      {/* ── SERVICES ──────────────────────────────────────────────────────── */}
      <section id="services" style={{ padding:'96px 5%', background:P.cream }}>
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <Fade>
            <div style={{ textAlign:'center', marginBottom:56 }}>
              <p style={{ fontSize:12, letterSpacing:'.12em', fontWeight:700, color:P.gold, textTransform:'uppercase', marginBottom:12 }}>{copy.services_label ?? 'What We Offer'}</p>
              <h2 style={{ fontSize:42, fontWeight:800, color:P.navy, margin:0, letterSpacing:'-0.02em' }}>{copy.services_heading ?? 'Detail Packages'}</h2>
              <p style={{ fontSize:17, color:P.mid, marginTop:14, maxWidth:520, margin:'14px auto 0', lineHeight:1.6 }}>{copy.services_subheading ?? 'Every service performed by certified technicians with premium products.'}</p>
            </div>
          </Fade>
          <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2,1fr)' : `repeat(${Math.min(resolvedServices.length, 4)},1fr)`, gap:20 }}>
            {resolvedServices.map((s, i) => (
              <Fade key={i} delay={i * 0.1}>
                <div
                  data-cursor="link"
                  className={`cd2-service-card${activeService === i ? ' active' : ''}`}
                  onClick={() => setActiveService(i)}
                  onMouseEnter={() => setActiveService(i)}
                >
                  <div style={{ fontSize:11, fontWeight:700, color:P.gold, letterSpacing:'.08em', textTransform:'uppercase', marginBottom:16 }}>
                    {s.features?.[0] || 'Service'}
                  </div>
                  <h3 style={{ fontSize:20, fontWeight:800, color:P.navy, margin:'0 0 6px', letterSpacing:'-0.01em' }}>{s.name}</h3>
                  {s.price && <div style={{ fontSize:32, fontWeight:900, color:P.navy, margin:'12px 0 4px', letterSpacing:'-0.02em' }}>{s.price}</div>}
                  {s.duration && <div style={{ fontSize:13, color:P.light, marginBottom:16 }}>{s.duration}</div>}
                  {s.description && <p style={{ fontSize:14, color:P.mid, lineHeight:1.65, marginBottom:20 }}>{s.description}</p>}
                  {s.features && s.features.length > 1 && (
                    <ul style={{ listStyle:'none', margin:0, padding:0 }}>
                      {s.features.slice(1).map((f, j) => (
                        <li key={j} style={{ fontSize:14, color:P.mid, padding:'5px 0', display:'flex', alignItems:'center', gap:10, borderTop:`1px solid ${P.border}` }}>
                          <span style={{ width:16, height:16, borderRadius:'50%', background:`${P.navy}12`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                            <svg width="8" height="8" viewBox="0 0 8 8"><path d="M1 4l2 2 4-4" stroke={P.navy} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
                          </span>
                          {f}
                        </li>
                      ))}
                    </ul>
                  )}
                  <a href={bookingUrl} data-cursor="btn" data-cursor-label="BOOK"
                    style={{ display:'block', marginTop:24, padding:'12px', background: activeService === i ? P.navy : P.surface, color: activeService === i ? P.white : P.navy, borderRadius:8, fontSize:14, fontWeight:700, textDecoration:'none', textAlign:'center', transition:'all .25s' }}>
                    {copy.services_item_cta ?? 'Book This Package'}
                  </a>
                </div>
              </Fade>
            ))}
          </div>
        </div>
      </section>

      {/* ── BEFORE / AFTER ────────────────────────────────────────────────── */}
      <section id="gallery" style={{ padding:'96px 5%', background:P.navy, position:'relative', overflow:'hidden' }}>
        <Particles count={24} color={P.white} opacity={0.06} />
        <div style={{ maxWidth:1200, margin:'0 auto', position:'relative', zIndex:1 }}>
          <Fade>
            <div style={{ textAlign:'center', marginBottom:56 }}>
              <p style={{ fontSize:12, letterSpacing:'.12em', fontWeight:700, color:P.gold, textTransform:'uppercase', marginBottom:12 }}>{copy.gallery_label ?? 'The Results'}</p>
              <h2 style={{ fontSize:42, fontWeight:800, color:P.white, margin:0, letterSpacing:'-0.02em' }}>{copy.gallery_heading ?? 'Before & After'}</h2>
              <p style={{ fontSize:17, color:'rgba(255,255,255,.55)', marginTop:14, maxWidth:480, margin:'14px auto 0', lineHeight:1.6 }}>{copy.gallery_subheading ?? 'Drag the slider to see what a professional detail actually looks like.'}</p>
            </div>
          </Fade>
          <Fade delay={0.15}>
            <Slider {...(sliderPairs[galleryIdx] || sliderPairs[0])} />
          </Fade>
          {sliderPairs.length > 1 && (
            <div style={{ display:'flex', justifyContent:'center', gap:12, marginTop:20 }}>
              {sliderPairs.map((_, i) => (
                <button key={i} data-cursor="link"
                  onClick={() => setGalleryIdx(i)}
                  style={{ width:10, height:10, borderRadius:'50%', background: galleryIdx === i ? P.gold : 'rgba(255,255,255,.25)', border:'none', cursor:'default', transition:'all .25s', padding:0, transform: galleryIdx === i ? 'scale(1.3)' : 'none' }}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────────────── */}
      <section id="reviews" style={{ padding:'96px 5%', background:P.white }}>
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <Fade>
            <div style={{ textAlign:'center', marginBottom:56 }}>
              <p style={{ fontSize:12, letterSpacing:'.12em', fontWeight:700, color:P.gold, textTransform:'uppercase', marginBottom:12 }}>{copy.testimonials_label ?? 'What Clients Say'}</p>
              <h2 style={{ fontSize:42, fontWeight:800, color:P.navy, margin:0, letterSpacing:'-0.02em' }}>{reviewCount}</h2>
              <div style={{ display:'flex', justifyContent:'center', alignItems:'center', gap:6, marginTop:14 }}>
                {'★★★★★'.split('').map((s, i) => <span key={i} style={{ fontSize:22, color:P.gold }}>{s}</span>)}
                <span style={{ fontSize:16, color:P.mid, marginLeft:8, fontWeight:600 }}>{avgRating} / 5.0 · Google Reviews</span>
              </div>
            </div>
          </Fade>
          <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2,1fr)' : `repeat(${Math.min(visibleReviews.length, 3)},1fr)`, gap:20 }}>
            {visibleReviews.map((r, i) => (
              <Fade key={`${reviewPage}-${i}`} delay={i * 0.1}>
                <div className="cd2-review-card">
                  <div style={{ display:'flex', gap:2, marginBottom:16 }}>
                    {Array(r.rating || 5).fill('★').map((s, j) => <span key={j} style={{ fontSize:16, color:P.gold }}>{s}</span>)}
                  </div>
                  <p style={{ fontSize:15, color:P.mid, lineHeight:1.75, margin:'0 0 20px', fontStyle:'italic' }}>&ldquo;{r.text}&rdquo;</p>
                  <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                    <div style={{ width:38, height:38, borderRadius:'50%', background:`linear-gradient(135deg,${P.navy},${P.navyMid})`, display:'flex', alignItems:'center', justifyContent:'center', color:P.white, fontSize:14, fontWeight:700 }}>
                      {(r.name || '?')[0]}
                    </div>
                    <div>
                      <div style={{ fontSize:14, fontWeight:700, color:P.ink }}>{r.name}</div>
                      {r.context && <div style={{ fontSize:12, color:P.light }}>{r.context}</div>}
                    </div>
                  </div>
                </div>
              </Fade>
            ))}
          </div>
          {totalReviewPages > 1 && (
            <div style={{ display:'flex', justifyContent:'center', gap:8, marginTop:32 }}>
              {Array.from({ length: totalReviewPages }, (_, i) => (
                <button key={i} data-cursor="link"
                  onClick={() => setReviewPage(i)}
                  style={{ width:28, height:6, borderRadius:3, border:'none', cursor:'default', transition:'all .3s', padding:0, background: reviewPage === i ? P.navy : P.border }}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── ABOUT ─────────────────────────────────────────────────────────── */}
      <section style={{ padding:'96px 5%', background:P.cream }}>
        <div style={{ maxWidth:1200, margin:'0 auto', display:'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap:80, alignItems:'center' }}>
          <Fade dir="left">
            <div style={{ background:`linear-gradient(135deg,${P.navy}08,${P.navy}14)`, borderRadius:20, padding:48, border:`1px solid ${P.border}`, position:'relative', overflow:'hidden' }}>
              <Particles count={16} color={P.navy} opacity={0.07} />
              <div style={{ position:'relative', zIndex:1 }}>
                {resolvedCerts.slice(0, 4).map((c, i) => (
                  <div key={i} style={{ display:'flex', gap:16, alignItems:'flex-start', marginBottom: i < 3 ? 24 : 0 }}>
                    <div style={{ fontSize:24, lineHeight:1 }}>{(['🏆','🧴','📍','⏱'] as const)[i]}</div>
                    <div style={{ fontSize:15, fontWeight:700, color:P.navy }}>{c}</div>
                  </div>
                ))}
              </div>
            </div>
          </Fade>
          <Fade dir="right" delay={0.15}>
            <div>
              <p style={{ fontSize:12, letterSpacing:'.12em', fontWeight:700, color:P.gold, textTransform:'uppercase', marginBottom:12 }}>{copy.about_label ?? 'Our Story'}</p>
              <h2 style={{ fontSize:38, fontWeight:800, color:P.navy, margin:'0 0 20px', letterSpacing:'-0.02em', lineHeight:1.1 }}>{tagline}</h2>
              <p style={{ fontSize:16, color:P.mid, lineHeight:1.75, marginBottom:32 }}>{description}</p>
              <a href={bookingUrl} data-cursor="btn" data-cursor-label="BOOK"
                style={{ display:'inline-flex', alignItems:'center', gap:10, padding:'14px 28px', background:P.navy, color:P.white, borderRadius:10, fontSize:15, fontWeight:700, textDecoration:'none', transition:'all .2s' }}
                onMouseEnter={e => { e.currentTarget.style.background = P.navyMid; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = P.navy;    e.currentTarget.style.transform = 'none'; }}
              >
                {copy.about_cta ?? 'Book Your Detail'}
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </a>
            </div>
          </Fade>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────────── */}
      <section id="faq" style={{ padding:'96px 5%', background:P.white }}>
        <div style={{ maxWidth:780, margin:'0 auto' }}>
          <Fade>
            <div style={{ textAlign:'center', marginBottom:56 }}>
              <p style={{ fontSize:12, letterSpacing:'.12em', fontWeight:700, color:P.gold, textTransform:'uppercase', marginBottom:12 }}>{copy.faq_label ?? 'Got Questions?'}</p>
              <h2 style={{ fontSize:42, fontWeight:800, color:P.navy, margin:0, letterSpacing:'-0.02em' }}>{copy.faq_heading ?? 'Common Questions'}</h2>
            </div>
          </Fade>
          {resolvedFaq.map((f, i) => <FaqItem key={i} q={f.q} a={f.a} i={i} />)}
        </div>
      </section>

      {/* ── CONTACT CTA ───────────────────────────────────────────────────── */}
      <section style={{ padding:'96px 5%', background:`linear-gradient(135deg,${P.navy} 0%,${P.navyMid} 100%)`, position:'relative', overflow:'hidden' }}>
        <Particles count={30} color={P.white} opacity={0.05} />
        <div style={{ maxWidth:1200, margin:'0 auto', display:'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap:80, alignItems:'center', position:'relative', zIndex:1 }}>
          <Fade dir="left">
            <div>
              <p style={{ fontSize:12, letterSpacing:'.12em', fontWeight:700, color:P.gold, textTransform:'uppercase', marginBottom:12 }}>{copy.cta_label ?? 'Get In Touch'}</p>
              <h2 style={{ fontSize:42, fontWeight:800, color:P.white, margin:'0 0 24px', letterSpacing:'-0.02em', lineHeight:1.1 }}>{copy.cta_heading ?? 'Ready for a showroom finish?'}</h2>
              <p style={{ fontSize:17, color:'rgba(255,255,255,.6)', lineHeight:1.7, marginBottom:36 }}>
                {copy.cta_subheading ?? 'Book online in 60 seconds or give us a call. Same-day quotes available.'}
              </p>
              <div style={{ display:'flex', gap:14, flexWrap:'wrap' }}>
                <a href={bookingUrl} data-cursor="btn" data-cursor-label="BOOK"
                  style={{ padding:'15px 32px', background:P.gold, color:P.navy, borderRadius:10, fontSize:15, fontWeight:800, textDecoration:'none', transition:'all .2s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = P.goldLt; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = P.gold;   e.currentTarget.style.transform = 'none'; }}
                >{copy.cta_primary ?? 'Book Online'}</a>
                <a href={`tel:${phone}`} data-cursor="link"
                  style={{ padding:'15px 32px', background:'transparent', color:P.white, borderRadius:10, fontSize:15, fontWeight:600, textDecoration:'none', border:'1.5px solid rgba(255,255,255,.25)', transition:'all .2s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,.6)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,.25)'; }}
                >{phone}</a>
              </div>
            </div>
          </Fade>
          <Fade dir="right" delay={0.15}>
            <div style={{ background:'rgba(255,255,255,.06)', borderRadius:20, padding:36, border:'1px solid rgba(255,255,255,.12)', backdropFilter:'blur(8px)' }}>
              {(
                [
                  ['📍', 'Location',      address],
                  ['🕐', 'Hours',         hoursString],
                  ['✉️', 'Email',         email],
                  ['🗺️', 'Service Areas', resolvedAreas.join(' · ')],
                ] as [string, string, string | null][]
              ).map(([icon, lbl, val]) => (
                <div key={lbl} style={{ display:'flex', gap:16, alignItems:'flex-start', marginBottom:22 }}>
                  <span style={{ fontSize:20 }}>{icon}</span>
                  <div>
                    <div style={{ fontSize:12, fontWeight:700, color:P.gold, letterSpacing:'.06em', textTransform:'uppercase', marginBottom:3 }}>{lbl}</div>
                    <div style={{ fontSize:14, color:'rgba(255,255,255,.75)', lineHeight:1.6 }}>{val}</div>
                  </div>
                </div>
              ))}
            </div>
          </Fade>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <footer style={{ background:P.ink, padding:'32px 5%' }}>
        <div style={{ maxWidth:1200, margin:'0 auto', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:16 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:28, height:28, borderRadius:6, background:`linear-gradient(135deg,${P.navy},${P.navyMid})`, border:`1px solid ${P.gold}40`, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <span style={{ fontSize:12, color:P.gold }}>✦</span>
            </div>
            <span style={{ fontSize:14, fontWeight:700, color:'rgba(255,255,255,.7)' }}>{name}</span>
          </div>
          <span style={{ fontSize:13, color:'rgba(255,255,255,.3)' }}>© {new Date().getFullYear()} {name} · {city}</span>
          <div style={{ display:'flex', gap:24 }}>
            {['Privacy','Terms','Contact'].map(l => (
              <a key={l} href="#" data-cursor="link"
                style={{ fontSize:13, color:'rgba(255,255,255,.35)', textDecoration:'none', transition:'color .2s' }}
                onMouseEnter={e => { e.currentTarget.style.color = 'rgba(255,255,255,.7)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,.35)'; }}
              >{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
