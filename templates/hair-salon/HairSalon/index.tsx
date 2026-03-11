// @ts-nocheck
'use client';
import { useState, useEffect, useRef } from 'react';
import { TemplateProps, SiteCopy } from '../../types';

// ── Palette ────────────────────────────────────────────────────────────────
const P = {
  velvet:    '#1A0A0F',
  velvetMid: '#2D1420',
  velvetLt:  '#3D1E2C',
  champagne: '#E8D5B0',
  champLt:   '#F5ECD8',
  rose:      '#C4956A',
  roseLt:    '#D4AA85',
  cream:     '#FAF7F2',
  ink:       '#1A0A0F',
  mid:       '#6B4F5A',
  light:     '#A08898',
  border:    '#E8D5B033',
  borderSolid: '#E8D5B050',
};

// ── Placeholder data ───────────────────────────────────────────────────────
const DEFAULTS = {
  name:       'Maison Dorée',
  city:       'New York, NY',
  tagline:    'Where Beauty Becomes Art.',
  subTagline: 'Bespoke colour, cut and styling for women who demand more than ordinary.',
  description: 'Maison Dorée was born from a belief that a great salon is more than a service — it\'s a ritual. Our master stylists blend European technique with an intimate, unhurried approach. Every appointment is an experience designed entirely around you.',
  phone:      '(212) 555-0192',
  email:      'hello@maisondoree.com',
  address:    '142 W 57th Street, New York, NY 10019',
  bookingUrl: '#book',
  hours:      { weekdays: 'Tue – Fri: 10am – 7pm', saturday: 'Sat: 9am – 6pm', sunday: 'Sun: 11am – 5pm' },
  stats: [
    { value: 12,   suffix: '+', label: 'Years of Excellence' },
    { value: 4.9,  suffix: '★', label: 'Client Rating' },
    { value: 3200, suffix: '+', label: 'Happy Clients' },
    { value: 8,    suffix: '',  label: 'Master Stylists' },
  ],
  certifications: [
    'Schwarzkopf Professional Partner',
    'Olaplex Certified Studio',
    'Wella Colour Expert',
    'Goldwell Specialist',
  ],
  services: [
    {
      name: 'Signature Colour',
      price: 'From $185',
      duration: '2.5 hrs',
      description: 'Full colour transformation using premium European pigments. Includes toner, gloss treatment and blowout.',
      features: ['Balayage', 'Full colour', 'Highlights', 'Toner & gloss', 'Blowout finish'],
    },
    {
      name: 'Precision Cut',
      price: 'From $95',
      duration: '1 hr',
      description: 'Architectural cutting tailored to your face shape, lifestyle and texture. No two cuts are the same.',
      features: ['Consultation', 'Wash & condition', 'Precision cut', 'Blowdry & style'],
    },
    {
      name: 'Keratin Treatment',
      price: 'From $280',
      duration: '3 hrs',
      description: 'Smoothing treatment that eliminates frizz and adds mirror-like shine lasting up to 4 months.',
      features: ['Deep cleanse', 'Keratin application', 'Flat iron seal', 'Shine finish', 'Aftercare kit'],
    },
    {
      name: 'Bridal Package',
      price: 'From $450',
      duration: 'Half day',
      description: 'Complete bridal styling experience including trial, morning-of preparation and touch-up kit.',
      features: ['Trial session', 'Morning-of styling', 'Bridesmaid add-ons', 'Touch-up kit', 'Champagne service'],
    },
  ],
  gallery: [
    { imageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80', label: 'Balayage' },
    { imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80', label: 'Precision Cut' },
    { imageUrl: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&q=80', label: 'Colour & Style' },
    { imageUrl: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=800&q=80', label: 'Bridal' },
    { imageUrl: 'https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?w=800&q=80', label: 'The Salon' },
    { imageUrl: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=800&q=80', label: 'Styling' },
  ],
  testimonials: [
    { name: 'Isabelle R.', context: 'Colour Client', rating: 5, text: 'I\'ve been to salons across three continents and Maison Dorée is unmatched. The balayage they did makes me look like I\'ve just come back from the south of France. Life-changing.' },
    { name: 'Priya N.',    context: 'Bridal Client',  rating: 5, text: 'They did my hair for my wedding and I wept — in the best way. The trial, the communication, the actual day. Everything was perfect. My photos are stunning.' },
    { name: 'Chloe M.',    context: 'Regular Client', rating: 5, text: 'I\'ve been coming every 8 weeks for two years. My stylist knows my hair better than I do. I never even show a reference photo anymore. She just knows.' },
    { name: 'Diana F.',    context: 'Keratin Client',  rating: 5, text: 'The keratin treatment completely changed my mornings. Hair that used to take 45 minutes now takes 10. Worth every penny and then some.' },
    { name: 'Mara T.',     context: 'Cut & Colour',    rating: 5, text: 'Finally a salon that actually listens. I asked for something specific, they understood it, and executed it better than I even imagined. Truly remarkable team.' },
    { name: 'Sofia K.',    context: 'New Client',      rating: 5, text: 'First visit and I was made to feel like a regular. The space, the service, the results — it all feels completely different from any salon I\'ve been to before.' },
  ],
  faq: [
    { q: 'How far in advance should I book?',         a: 'We recommend 2–3 weeks for colour appointments and 1 week for cuts. Bridal packages require a minimum of 3 months advance booking.' },
    { q: 'Do you offer a consultation before colour?', a: 'Yes — every colour client receives a complimentary consultation, either in person or via our virtual assessment before booking.' },
    { q: 'What products do you use?',                  a: 'We exclusively use Schwarzkopf Professional, Olaplex, Wella and Goldwell — professional lines that protect and enhance hair health.' },
    { q: 'What is your cancellation policy?',          a: 'We ask for 48 hours notice for cancellations or changes. Late cancellations may incur a 50% charge of the service booked.' },
    { q: 'Do you cater for textured and curly hair?',  a: 'Absolutely. Several of our stylists specialise in curly and textured hair. Please mention your hair type when booking so we match you accordingly.' },
  ],
  serviceAreas: ['Manhattan', 'Brooklyn', 'Hoboken', 'Jersey City', 'Astoria'],
  copy: {
    nav_cta:             'Book Now',
    hero_cta_primary:    'Book an Appointment',
    hero_cta_secondary:  'View Gallery',
    services_label:      'Our Services',
    services_heading:    'Crafted for you, every time.',
    services_subheading: 'For every hair type, texture and style.',
    services_item_cta:   'Book This Service',
    gallery_label:       'The Work',
    gallery_heading:     'Beauty that speaks for itself.',
    gallery_subheading:  'Every cut, colour and transformation we love.',
    gallery_cta:         'Book Now →',
    testimonials_label:  'Client Love',
    team_label:          'The Team',
    team_heading:        'Artists, not just stylists.',
    about_label:         'Our Philosophy',
    about_heading:       'More than a salon. A ritual.',
    about_cta:           'Book a Consultation',
    faq_label:           'Questions',
    faq_heading:         'Everything you need to know.',
    cta_label:           'Begin Your Experience',
    cta_heading:         'Your transformation starts here.',
    cta_subheading:      'Reserve your chair and let us take care of the rest.',
    cta_primary:         'Reserve Your Appointment',
  } as SiteCopy,
  stylists: [
    { name: 'Céline Moreau',  role: 'Creative Director & Colour Specialist', bio: '18 years. Trained in Paris. Specialist in lived-in colour and European blonding techniques.' },
    { name: 'Adaora Obi',     role: 'Master Stylist & Curl Expert',           bio: 'Certified Curl Specialist with a following built entirely on word of mouth. Textured hair authority.' },
    { name: 'Tomás Reyes',    role: 'Senior Stylist & Bridal Lead',           bio: 'Beloved for precision cuts and calm energy. Leads all bridal styling and editorial work.' },
    { name: 'Yuki Tanaka',    role: 'Colour Technician',                      bio: 'Goldwell colour champion. Obsessive about tone, dimension and the science behind great hair colour.' },
  ],
};

// ── Hooks ──────────────────────────────────────────────────────────────────
function useInView(threshold = 0.12) {
  const ref = useRef<Element>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, vis];
}

// ── Custom Cursor ──────────────────────────────────────────────────────────
//
// Coordinate-offset fix
// ---------------------
// When rendered inside the preview editor, the cursor elements are
// `position:fixed` but their containing block is the `transform:translateZ(0)`
// preview wrapper — not the real viewport. This means `top:0;left:0` places
// them at the top-left of that div, and a naive `translate(clientX, clientY)`
// pushes them ~96px too far down (the editor toolbar height), clipping them
// off-screen in the lower portion of the window.
//
// Fix: at mount we walk up the DOM to find the nearest transformed ancestor.
// On every mousemove we subtract that ancestor's current bounding-rect offset
// so the cursor stays exactly under the pointer regardless of where the editor
// chrome starts or how far the preview has been scrolled.
//
// On the published site there is no transformed ancestor, so the code falls
// back to plain clientX/clientY — identical to the original behaviour.
function Cursor() {
  const cross     = useRef<HTMLDivElement>(null);
  const ring      = useRef<HTMLDivElement>(null);
  const sentinel  = useRef<HTMLDivElement>(null); // tiny hidden div to locate our position in the DOM
  const container = useRef<HTMLElement | null>(null); // nearest transformed ancestor, or null on live site
  const pos       = useRef({ x: -100, y: -100 });
  const lag       = useRef({ x: -100, y: -100 });
  const raf       = useRef<number | null>(null);

  useEffect(() => {
    // Walk up from the sentinel to find the first transformed ancestor.
    let el = sentinel.current?.parentElement ?? null;
    while (el) {
      if (window.getComputedStyle(el).transform !== 'none') {
        container.current = el;
        break;
      }
      el = el.parentElement;
    }

    const toLocal = (e: MouseEvent) => {
      if (container.current) {
        const r = container.current.getBoundingClientRect();
        return { x: e.clientX - r.left, y: e.clientY - r.top };
      }
      return { x: e.clientX, y: e.clientY };
    };

    const move = (e: MouseEvent) => { pos.current = toLocal(e); };
    const over = (e: MouseEvent) => {
      const t = (e.target as HTMLElement).closest('[data-cursor]');
      const type = (t as HTMLElement | null)?.dataset.cursor || 'default';
      cross.current?.setAttribute('data-type', type);
      ring.current?.setAttribute('data-type', type);
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseover', over);
    const animate = () => {
      lag.current.x += (pos.current.x - lag.current.x) * 0.1;
      lag.current.y += (pos.current.y - lag.current.y) * 0.1;
      if (cross.current) cross.current.style.transform = `translate(${pos.current.x}px,${pos.current.y}px) translate(-50%,-50%)`;
      if (ring.current)  ring.current.style.transform  = `translate(${lag.current.x}px,${lag.current.y}px) translate(-50%,-50%)`;
      raf.current = requestAnimationFrame(animate);
    };
    raf.current = requestAnimationFrame(animate);
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseover', over);
      if (raf.current !== null) cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <>
      {/* Sentinel: only used to locate the DOM position at mount — never visible */}
      <div ref={sentinel} aria-hidden style={{ display:'none' }} />
      <style dangerouslySetInnerHTML={{ __html: `
        * { cursor: none !important; }
        #hs-cross {
          position:fixed;top:0;left:0;width:16px;height:16px;
          pointer-events:none;z-index:99999;
          transition:transform 0s;
        }
        #hs-cross::before,#hs-cross::after {
          content:'';position:absolute;background:${P.rose};
          transition:background .2s,width .2s,height .2s;
        }
        #hs-cross::before { width:1px;height:16px;left:50%;top:0;transform:translateX(-50%); }
        #hs-cross::after  { width:16px;height:1px;top:50%;left:0;transform:translateY(-50%); }
        #hs-cross[data-type="link"]::before,#hs-cross[data-type="link"]::after { background:${P.champagne}; }
        #hs-cross[data-type="btn"]::before,#hs-cross[data-type="btn"]::after   { background:${P.velvet};width:20px;height:1px; }
        #hs-cross[data-type="btn"]::before { width:1px;height:20px; }
        #hs-ring {
          position:fixed;top:0;left:0;width:40px;height:40px;
          border-radius:50%;border:1px solid ${P.rose};
          pointer-events:none;z-index:99998;
          transition:width .3s,height .3s,border-color .3s,background .3s,border-radius .3s;
        }
        #hs-ring[data-type="link"] { width:56px;height:56px;border-color:${P.champagne};background:${P.champagne}10; }
        #hs-ring[data-type="btn"]  { width:64px;height:64px;border-color:${P.rose};background:${P.rose}15;border-radius:4px; }
      ` }} />
      <div id="hs-cross" ref={cross} data-type="default" />
      <div id="hs-ring"  ref={ring}  data-type="default" />
    </>
  );
}

// ── Floating petals (always moving) ───────────────────────────────────────
function Petals({ count = 18, dark = false }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = canvas.current; if (!c) return;
    const ctx = c.getContext('2d'); if (!ctx) return;
    let W = c.offsetWidth, H = c.offsetHeight;
    c.width = W; c.height = H;
    const color = dark ? '232,213,176' : '196,149,106';
    const petals = Array.from({ length: count }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 3 + 1.5,
      vx: (Math.random() - 0.5) * 0.4,
      vy: Math.random() * 0.3 + 0.1,
      angle: Math.random() * Math.PI * 2,
      va: (Math.random() - 0.5) * 0.02,
      opacity: Math.random() * 0.4 + 0.1,
    }));
    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      petals.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.angle += p.va;
        if (p.y > H + 10) { p.y = -10; p.x = Math.random() * W; }
        if (p.x < -10) p.x = W + 10;
        if (p.x > W + 10) p.x = -10;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.beginPath();
        ctx.ellipse(0, 0, p.r * 2, p.r, 0, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color},${p.opacity})`;
        ctx.fill();
        ctx.restore();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    const resize = () => { W = c.offsetWidth; H = c.offsetHeight; c.width = W; c.height = H; };
    window.addEventListener('resize', resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, [count, dark]);
  return <canvas ref={canvas} style={{ position:'absolute',inset:0,width:'100%',height:'100%',pointerEvents:'none',zIndex:1 }} />;
}

// ── Fade in ────────────────────────────────────────────────────────────────
function Reveal({ children, delay = 0, dir = 'up', distance = 40 }) {
  const [ref, vis] = useInView();
  const dirs = {
    up:    `translateY(${distance}px)`,
    down:  `translateY(-${distance}px)`,
    left:  `translateX(${distance}px)`,
    right: `translateX(-${distance}px)`,
  };
  return (
    <div ref={ref} style={{
      opacity: vis ? 1 : 0,
      transform: vis ? 'none' : dirs[dir],
      transition: `opacity .9s ${delay}s cubic-bezier(.16,1,.3,1), transform .9s ${delay}s cubic-bezier(.16,1,.3,1)`,
    }}>
      {children}
    </div>
  );
}

// ── Text mask reveal ───────────────────────────────────────────────────────
function MaskReveal({ children, delay = 0 }) {
  const [ref, vis] = useInView(0.3);
  return (
    <div ref={ref} style={{ overflow:'hidden' }}>
      <div style={{
        transform: vis ? 'translateY(0)' : 'translateY(110%)',
        transition: `transform 1s ${delay}s cubic-bezier(.16,1,.3,1)`,
      }}>
        {children}
      </div>
    </div>
  );
}

// ── Stat counter ───────────────────────────────────────────────────────────
function StatNum({ value, suffix, label }) {
  const [ref, vis] = useInView(0.3);
  const n = typeof value === 'number' ? value : parseFloat(String(value).replace(/[^0-9.]/g,'')) || 0;
  const isFloat = !Number.isInteger(n);
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!vis) return;
    const start = performance.now();
    const dur = 1600;
    const tick = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setCount(isFloat ? parseFloat((e * n).toFixed(1)) : Math.floor(e * n));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [vis, n, isFloat]);
  return (
    <div ref={ref} style={{ textAlign:'center' }}>
      <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:52, fontWeight:600, color:P.champagne, lineHeight:1, letterSpacing:'-0.02em' }}>
        {count}{suffix}
      </div>
      <div style={{ fontSize:12, color:P.light, marginTop:8, letterSpacing:'.12em', textTransform:'uppercase', fontFamily:"'Jost',sans-serif", fontWeight:400 }}>
        {label}
      </div>
    </div>
  );
}

// ── FAQ ────────────────────────────────────────────────────────────────────
function FaqItem({ q, a, i }) {
  const [open, setOpen] = useState(false);
  return (
    <Reveal delay={i * 0.07}>
      <div data-cursor="link" onClick={() => setOpen(o => !o)}
        style={{ borderBottom:`1px solid ${P.borderSolid}`, padding:'22px 0', cursor:'default' }}
      >
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', gap:20 }}>
          <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:19, fontWeight:500, color:P.champagne, lineHeight:1.3 }}>{q}</span>
          <div style={{ width:24, height:24, borderRadius:'50%', border:`1px solid ${P.rose}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, transition:'transform .3s,background .3s', transform: open ? 'rotate(45deg)' : 'none', background: open ? P.rose : 'transparent' }}>
            <svg width="10" height="10" viewBox="0 0 10 10"><path d="M5 1v8M1 5h8" stroke={open ? P.velvet : P.rose} strokeWidth="1.5" strokeLinecap="round"/></svg>
          </div>
        </div>
        <div style={{ maxHeight: open ? 200 : 0, overflow:'hidden', transition:'max-height .4s cubic-bezier(.16,1,.3,1)' }}>
          <p style={{ margin:'14px 0 4px', fontSize:15, color:P.light, lineHeight:1.8, fontFamily:"'Jost',sans-serif" }}>{a}</p>
        </div>
      </div>
    </Reveal>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════════════════════
export default function HairSalonTemplate({ businessData }: TemplateProps) {
  // Merge real data over defaults — missing fields always show placeholder
  const d = { ...DEFAULTS };
  const bd = businessData;
  if (bd.name)        d.name        = bd.name;
  if (bd.city)        d.city        = bd.city;
  if (bd.tagline)     d.tagline     = bd.tagline;
  if (bd.subTagline)  d.subTagline  = bd.subTagline;
  if (bd.description) d.description = bd.description;
  if (bd.phone)       d.phone       = bd.phone;
  if (bd.email)       d.email       = bd.email;
  if (bd.address)     d.address     = bd.address;
  if (bd.bookingUrl)  d.bookingUrl  = bd.bookingUrl;
  if (bd.hours)       d.hours       = bd.hours;
  if (bd.stats        && bd.stats.length > 0)        d.stats        = bd.stats;
  if (bd.certifications && bd.certifications.length > 0) d.certifications = bd.certifications;
  if (bd.services     && bd.services.length > 0)     d.services     = bd.services;
  if (bd.gallery      && bd.gallery.length > 0)      d.gallery      = bd.gallery;
  if (bd.testimonials && bd.testimonials.length > 0) d.testimonials = bd.testimonials;
  if (bd.faq          && bd.faq.length > 0)          d.faq          = bd.faq;
  if (bd.serviceAreas && bd.serviceAreas.length > 0) d.serviceAreas = bd.serviceAreas;
  if (bd.stylists     && bd.stylists.length > 0)     d.stylists     = bd.stylists;
  if (bd.copy)                                        d.copy         = { ...d.copy, ...bd.copy };

  const { name, city, tagline, subTagline, description, phone, email, address,
          bookingUrl, hours, stats, certifications, services, gallery,
          testimonials, faq, serviceAreas, stylists } = d;
  const copy = d.copy;

  // UI state only
  const [scrolled,        setScrolled]        = useState(false);
  const [activeService,   setActiveService]   = useState(0);
  const [reviewPage,      setReviewPage]      = useState(0);
  const [hoveredImg,      setHoveredImg]      = useState(null);
  const [mobileMenuOpen,  setMobileMenuOpen]  = useState(false);

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
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const reviewsPerPage   = 3;
  const totalReviewPages = Math.max(1, Math.ceil(testimonials.length / reviewsPerPage));
  useEffect(() => {
    if (testimonials.length <= reviewsPerPage) return;
    const t = setInterval(() => setReviewPage(p => (p + 1) % totalReviewPages), 6000);
    return () => clearInterval(t);
  }, [testimonials.length, totalReviewPages]);

  const visibleReviews = testimonials.slice(reviewPage * reviewsPerPage, reviewPage * reviewsPerPage + reviewsPerPage);
  const avgRating = (testimonials.reduce((s, t) => s + (t.rating || 5), 0) / testimonials.length).toFixed(1);
  const hoursArr = hours ? Object.values(hours).filter(Boolean) : [];

  // Marquee items
  const marqueeItems = [...certifications, ...serviceAreas.map(a => `${a}`), ...certifications, ...serviceAreas.map(a => `${a}`)];

  return (
    <div ref={rootRef} style={{ fontFamily:"'Jost',sans-serif", background:P.cream, color:P.ink, overflowX:'hidden' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Jost:wght@300;400;500;600&display=swap');
        @keyframes hs-drift  { 0%,100%{transform:translateY(0) rotate(0deg)} 33%{transform:translateY(-8px) rotate(1deg)} 66%{transform:translateY(4px) rotate(-1deg)} }
        @keyframes hs-glow   { 0%,100%{opacity:.6} 50%{opacity:1} }
        @keyframes hs-marquee{ from{transform:translateX(0)} to{transform:translateX(-50%)} }
        @keyframes hs-shimmer{ 0%{background-position:-400px 0} 100%{background-position:400px 0} }
        @keyframes hs-line   { from{width:0} to{width:100%} }
        .hs-service-card {
          position:relative;border-radius:2px;
          background:${P.velvet};
          border:1px solid ${P.borderSolid};
          padding:36px 32px;
          transition:transform .4s cubic-bezier(.16,1,.3,1),box-shadow .4s,border-color .4s;
          overflow:hidden;cursor:default;
        }
        .hs-service-card::before {
          content:'';position:absolute;inset:0;
          background:linear-gradient(135deg,${P.rose}08,transparent 60%);
          opacity:0;transition:opacity .4s;
        }
        .hs-service-card:hover { transform:translateY(-6px);border-color:${P.rose}80;box-shadow:0 20px 60px rgba(26,10,15,.4); }
        .hs-service-card:hover::before { opacity:1; }
        .hs-service-card.active { border-color:${P.rose};transform:translateY(-6px);box-shadow:0 20px 60px rgba(26,10,15,.4); }
        .hs-service-card.active::before { opacity:1; }
        .hs-gallery-item {
          border-radius:2px;overflow:hidden;cursor:default;
          transition:transform .5s cubic-bezier(.16,1,.3,1);position:relative;
        }
        .hs-gallery-item:hover { transform:scale(1.02); }
        .hs-gallery-item img { width:100%;height:100%;object-fit:cover;display:block;transition:transform .6s cubic-bezier(.16,1,.3,1); }
        .hs-gallery-item:hover img { transform:scale(1.08); }
        .hs-gallery-item .hs-overlay {
          position:absolute;inset:0;
          background:linear-gradient(to top,${P.velvet}CC,transparent 50%);
          opacity:0;transition:opacity .4s;
          display:flex;align-items:flex-end;padding:20px;
        }
        .hs-gallery-item:hover .hs-overlay { opacity:1; }
      ` }} />

      <Cursor />

      {/* ── NAV ─────────────────────────────────────────────────────────── */}
      <nav style={{
        position:'fixed',top:0,left:0,right:0,zIndex:1000,
        padding:'0 5%',
        background: scrolled ? `${P.velvet}F0` : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? `1px solid ${P.borderSolid}` : 'none',
        transition:'all .5s cubic-bezier(.16,1,.3,1)',
      }}>
        <div style={{ maxWidth:1280, margin:'0 auto', height:72, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          {/* Logo */}
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ width:36, height:36, borderRadius:'50%', border:`1px solid ${P.rose}`, display:'flex', alignItems:'center', justifyContent:'center', animation:'hs-glow 3s ease-in-out infinite' }}>
              <span style={{ fontSize:14, color:P.rose }}>✦</span>
            </div>
            <div>
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:18, fontWeight:500, color:P.champagne, letterSpacing:'.04em', lineHeight:1 }}>{name}</div>
              <div style={{ fontSize:10, color:P.light, letterSpacing:'.16em', textTransform:'uppercase', marginTop:2 }}>{city}</div>
            </div>
          </div>
          {/* Links */}
          <div style={{ display: isMobile ? 'none' : 'flex', alignItems:'center', gap:36 }}>
            {['Services','Gallery','Stylists','Reviews'].map(l => (
              <a key={l} href={`#${l.toLowerCase()}`} data-cursor="link"
                style={{ fontSize:13, letterSpacing:'.1em', textTransform:'uppercase', color:P.champagne, textDecoration:'none', opacity:.6, transition:'opacity .2s', fontWeight:400 }}
                onMouseEnter={e => (e.target as HTMLAnchorElement).style.opacity = '1'}
                onMouseLeave={e => (e.target as HTMLAnchorElement).style.opacity = '.6'}
              >{l}</a>
            ))}
            <a href={bookingUrl} data-cursor="btn"
              style={{ padding:'10px 24px', border:`1px solid ${P.rose}`, color:P.rose, fontSize:12, letterSpacing:'.14em', textTransform:'uppercase', textDecoration:'none', fontWeight:500, transition:'all .3s', background:'transparent' }}
              onMouseEnter={e => { e.currentTarget.style.background = P.rose; e.currentTarget.style.color = P.velvet; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = P.rose; }}
            >{copy.nav_cta}</a>
          </div>
          {/* Mobile hamburger */}
          {isMobile && (
            <button
              onClick={() => setMobileMenuOpen(o => !o)}
              style={{ background:'none', border:'none', cursor:'pointer', padding:8, display:'flex', flexDirection:'column', gap:5 }}
            >
              <span style={{ display:'block', width:22, height:2, background:P.champagne, borderRadius:2 }} />
              <span style={{ display:'block', width:22, height:2, background:P.champagne, borderRadius:2 }} />
              <span style={{ display:'block', width:22, height:2, background:P.champagne, borderRadius:2 }} />
            </button>
          )}
        </div>
        {/* Mobile menu dropdown */}
        {isMobile && mobileMenuOpen && (
          <div style={{ position:'absolute', top:'100%', left:0, right:0, background:P.velvet, borderTop:`1px solid ${P.borderSolid}`, padding:'16px 5%', display:'flex', flexDirection:'column', gap:16, zIndex:99 }}>
            {['Services','Gallery','Stylists','Reviews'].map(l => (
              <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setMobileMenuOpen(false)}
                style={{ fontSize:16, color:P.champagne, textDecoration:'none', fontWeight:500, padding:'8px 0', borderBottom:`1px solid ${P.borderSolid}` }}
              >{l}</a>
            ))}
            <a href={bookingUrl} style={{ padding:'12px 24px', background:P.rose, color:P.velvet, textAlign:'center', textDecoration:'none', fontWeight:600, fontSize:14 }}>{copy.nav_cta}</a>
          </div>
        )}
      </nav>

      {/* ── HERO ────────────────────────────────────────────────────────── */}
      <section style={{ position:'relative', height:'100vh', minHeight:700, overflow:'hidden', background:P.velvet }}>
        {/* Background image */}
        <div style={{ position:'absolute', inset:0 }}>
          <img
            src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1600&q=85"
            alt="Salon"
            style={{ width:'100%', height:'100%', objectFit:'cover', opacity:.45, transform:'scale(1.04)', animation:'hs-drift 18s ease-in-out infinite' }}
          />
          <div style={{ position:'absolute', inset:0, background:`linear-gradient(to bottom,${P.velvet}60 0%,transparent 30%,transparent 50%,${P.velvet}CC 80%,${P.velvet} 100%)` }} />
          <div style={{ position:'absolute', inset:0, background:`radial-gradient(ellipse at 70% 40%,${P.rose}12,transparent 60%)` }} />
        </div>

        {/* Petals */}
        <Petals count={22} dark={false} />

        {/* Content */}
        <div style={{ position:'relative', zIndex:2, height:'100%', display:'flex', flexDirection:'column', justifyContent:'flex-end', padding:'0 5% 80px', maxWidth:1280, margin:'0 auto', width:'100%' }}>
          {/* Tag line */}
          <MaskReveal delay={0.2}>
            <div style={{ display:'inline-flex', alignItems:'center', gap:12, marginBottom:28 }}>
              <div style={{ width:32, height:1, background:P.rose }} />
              <span style={{ fontSize:12, letterSpacing:'.2em', color:P.rose, textTransform:'uppercase', fontWeight:400 }}>{city}</span>
            </div>
          </MaskReveal>

          {/* Main headline */}
          <div style={{ marginBottom:24 }}>
            {tagline.split(' ').reduce((acc, word, i, arr) => {
              if (i % 4 === 0) acc.push([]);
              acc[acc.length - 1].push(word);
              return acc;
            }, []).map((line, i) => (
              <MaskReveal key={i} delay={0.3 + i * 0.12}>
                <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(52px,7vw,96px)', fontWeight:300, color:P.champagne, margin:0, lineHeight:.95, letterSpacing:'-0.01em', fontStyle: i % 2 === 1 ? 'italic' : 'normal' }}>
                  {line.join(' ')}
                </h1>
              </MaskReveal>
            ))}
          </div>

          {/* Sub + CTA */}
          <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', flexWrap:'wrap', gap:24 }}>
            <MaskReveal delay={0.6}>
              <p style={{ fontSize:16, color:P.champagne, opacity:.7, maxWidth:480, lineHeight:1.7, fontWeight:300, margin:0 }}>
                {subTagline}
              </p>
            </MaskReveal>
            <MaskReveal delay={0.72}>
              <div style={{ display:'flex', gap:14, alignItems:'center' }}>
                <a href={bookingUrl} data-cursor="btn"
                  style={{ padding:'16px 36px', background:P.rose, color:P.velvet, fontSize:12, letterSpacing:'.16em', textTransform:'uppercase', textDecoration:'none', fontWeight:600, transition:'all .3s', display:'inline-flex', alignItems:'center', gap:12 }}
                  onMouseEnter={e => { e.currentTarget.style.background = P.roseLt; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = P.rose; e.currentTarget.style.transform = 'none'; }}
                >
                  {copy.hero_cta_primary}
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </a>
                <a href="#gallery" data-cursor="link"
                  style={{ fontSize:12, letterSpacing:'.16em', textTransform:'uppercase', color:P.champagne, textDecoration:'none', opacity:.6, transition:'opacity .2s', fontWeight:400 }}
                  onMouseEnter={e => e.currentTarget.style.opacity = 1}
                  onMouseLeave={e => e.currentTarget.style.opacity = '.6'}
                >{copy.hero_cta_secondary}</a>
              </div>
            </MaskReveal>
          </div>
        </div>

        {/* Scroll line */}
        <div style={{ position:'absolute', bottom:0, left:'5%', width:1, height:60, background:`linear-gradient(${P.rose},transparent)`, zIndex:2 }} />
      </section>

      {/* ── MARQUEE ──────────────────────────────────────────────────────── */}
      <div style={{ background:P.velvetMid, padding:'12px 0', overflow:'hidden', borderTop:`1px solid ${P.borderSolid}`, borderBottom:`1px solid ${P.borderSolid}` }}>
        <div style={{ display:'flex', animation:'hs-marquee 28s linear infinite', width:'max-content' }}>
          {marqueeItems.map((t, i) => (
            <span key={i} style={{ display:'inline-flex', alignItems:'center', gap:20, padding:'0 32px', fontSize:12, letterSpacing:'.14em', textTransform:'uppercase', color:P.champagne, opacity:.5, fontWeight:400, whiteSpace:'nowrap' }}>
              <span style={{ color:P.rose, fontSize:8 }}>◆</span>{t}
            </span>
          ))}
        </div>
      </div>

      {/* ── STATS ────────────────────────────────────────────────────────── */}
      <section style={{ background:P.velvet, padding:'80px 5%' }}>
        <div style={{ maxWidth:1280, margin:'0 auto', display:'grid', gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)', gap:40, position:'relative' }}>
          {stats.slice(0, 4).map((s, i) => (
            <div key={i} style={{ borderRight: i < 3 ? `1px solid ${P.borderSolid}` : 'none' }}>
              <StatNum value={s.value} suffix={s.suffix || ''} label={s.label} />
            </div>
          ))}
        </div>
      </section>

      {/* ── SERVICES ─────────────────────────────────────────────────────── */}
      <section id="services" style={{ padding:'120px 5%', background:P.cream, position:'relative', overflow:'hidden' }}>
        {/* Decorative */}
        <div style={{ position:'absolute', right:'-5%', top:'10%', width:500, height:500, borderRadius:'50%', border:`1px solid ${P.rose}10`, pointerEvents:'none' }} />
        <div style={{ position:'absolute', right:'5%', top:'15%', width:300, height:300, borderRadius:'50%', border:`1px solid ${P.rose}08`, pointerEvents:'none' }} />

        <div style={{ maxWidth:1280, margin:'0 auto' }}>
          <Reveal>
            <div style={{ marginBottom:72 }}>
              <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:16 }}>
                <div style={{ width:40, height:1, background:P.rose }} />
                <span style={{ fontSize:11, letterSpacing:'.2em', color:P.rose, textTransform:'uppercase' }}>{copy.services_label}</span>
              </div>
              <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(36px,4vw,60px)', fontWeight:300, color:P.velvet, margin:0, lineHeight:1.05, letterSpacing:'-0.01em' }}>
                {copy.services_heading}
              </h2>
            </div>
          </Reveal>

          <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2,1fr)' : 'repeat(4,1fr)', gap:16 }}>
            {services.map((s, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div
                  data-cursor="link"
                  className={`hs-service-card${activeService === i ? ' active' : ''}`}
                  onClick={() => setActiveService(i)}
                  onMouseEnter={() => setActiveService(i)}
                >
                  <div style={{ fontSize:11, letterSpacing:'.14em', textTransform:'uppercase', color:P.rose, marginBottom:20, fontWeight:500 }}>0{i + 1}</div>
                  <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:24, fontWeight:400, color:P.champagne, margin:'0 0 8px', lineHeight:1.1 }}>{s.name}</h3>
                  {s.price && <div style={{ fontSize:13, color:P.rose, marginBottom:4, fontWeight:500, letterSpacing:'.04em' }}>{s.price}</div>}
                  {s.duration && <div style={{ fontSize:12, color:P.light, marginBottom:20, letterSpacing:'.06em' }}>{s.duration}</div>}
                  {s.description && <p style={{ fontSize:14, color:P.light, lineHeight:1.7, marginBottom:24, fontWeight:300 }}>{s.description}</p>}
                  <div style={{ borderTop:`1px solid ${P.borderSolid}`, paddingTop:20 }}>
                    {(s.features || []).slice(0, 4).map((f, j) => (
                      <div key={j} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
                        <span style={{ width:4, height:4, borderRadius:'50%', background:P.rose, flexShrink:0 }} />
                        <span style={{ fontSize:13, color:P.light, fontWeight:300 }}>{f}</span>
                      </div>
                    ))}
                  </div>
                  <a href={bookingUrl} data-cursor="btn"
                    style={{ display:'block', marginTop:24, padding:'12px', border:`1px solid ${activeService === i ? P.rose : P.borderSolid}`, color: activeService === i ? P.velvet : P.rose, background: activeService === i ? P.rose : 'transparent', fontSize:11, letterSpacing:'.14em', textTransform:'uppercase', textDecoration:'none', textAlign:'center', fontWeight:500, transition:'all .3s' }}>
                    {copy.services_item_cta}
                  </a>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── MOOD GALLERY ─────────────────────────────────────────────────── */}
      <section id="gallery" style={{ padding:'120px 5%', background:P.velvet, position:'relative', overflow:'hidden' }}>
        <Petals count={12} dark={true} />
        <div style={{ maxWidth:1280, margin:'0 auto', position:'relative', zIndex:2 }}>
          <Reveal>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:56 }}>
              <div>
                <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:16 }}>
                  <div style={{ width:40, height:1, background:P.rose }} />
                  <span style={{ fontSize:11, letterSpacing:'.2em', color:P.rose, textTransform:'uppercase' }}>{copy.gallery_label}</span>
                </div>
                <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(36px,4vw,60px)', fontWeight:300, color:P.champagne, margin:0, lineHeight:1.05, letterSpacing:'-0.01em' }}>
                  {copy.gallery_heading}
                </h2>
              </div>
              <a href={bookingUrl} data-cursor="link" style={{ fontSize:12, letterSpacing:'.14em', textTransform:'uppercase', color:P.rose, textDecoration:'none', opacity:.8, transition:'opacity .2s', alignSelf:'flex-end', paddingBottom:8 }}
                onMouseEnter={e => e.currentTarget.style.opacity = 1}
                onMouseLeave={e => e.currentTarget.style.opacity = '.8'}
              >{copy.gallery_cta}</a>
            </div>
          </Reveal>

          {/* Asymmetric grid */}
          <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr 1fr', gridTemplateRows: isMobile ? 'auto' : '320px 240px', gap:12 }}>
            {gallery.slice(0, 5).map((img, i) => {
              const desktopSpans = [
                { gridColumn:'1', gridRow:'1 / 3' },
                { gridColumn:'2', gridRow:'1' },
                { gridColumn:'3', gridRow:'1' },
                { gridColumn:'2', gridRow:'2' },
                { gridColumn:'3', gridRow:'2' },
              ];
              const spanStyle = isMobile ? { gridColumn:'auto', gridRow:'auto' } : desktopSpans[i];
              return (
                <Reveal key={i} delay={i * 0.08}>
                  <div
                    data-cursor="link"
                    className="hs-gallery-item"
                    style={{ ...spanStyle, height: isMobile ? 220 : '100%' }}
                    onMouseEnter={() => setHoveredImg(i)}
                    onMouseLeave={() => setHoveredImg(null)}
                  >
                    <img src={img.imageUrl} alt={img.label || ''} onError={e => { e.target.style.background = P.velvetMid; e.target.style.opacity = '.5'; }} />
                    <div className="hs-overlay">
                      <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:16, fontStyle:'italic', color:P.champagne, opacity:.9 }}>{img.label}</span>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── STYLISTS ─────────────────────────────────────────────────────── */}
      <section id="stylists" style={{ padding:'120px 5%', background:P.cream }}>
        <div style={{ maxWidth:1280, margin:'0 auto' }}>
          <Reveal>
            <div style={{ textAlign:'center', marginBottom:72 }}>
              <div style={{ display:'inline-flex', alignItems:'center', gap:16, marginBottom:16 }}>
                <div style={{ width:32, height:1, background:P.rose }} />
                <span style={{ fontSize:11, letterSpacing:'.2em', color:P.rose, textTransform:'uppercase' }}>{copy.team_label}</span>
                <div style={{ width:32, height:1, background:P.rose }} />
              </div>
              <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(36px,4vw,60px)', fontWeight:300, color:P.velvet, margin:0, lineHeight:1.05, letterSpacing:'-0.01em' }}>
                {copy.team_heading}
              </h2>
            </div>
          </Reveal>

          <div style={{ display:'grid', gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)', gap:24 }}>
            {stylists.map((stylist, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div data-cursor="link" style={{ cursor:'default' }}>
                  {/* Avatar placeholder */}
                  <div style={{ width:'100%', aspectRatio:'3/4', background:`linear-gradient(135deg,${P.velvetMid},${P.velvetLt})`, borderRadius:2, marginBottom:20, display:'flex', alignItems:'flex-end', justifyContent:'center', overflow:'hidden', position:'relative', border:`1px solid ${P.borderSolid}` }}>
                    <Petals count={6} dark={true} />
                    <div style={{ position:'relative', zIndex:2, padding:'20px', textAlign:'center' }}>
                      <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:32, color:P.champagne, opacity:.3, fontStyle:'italic' }}>
                        {stylist.name.split(' ').map(n => n[0]).join('')}
                      </div>
                    </div>
                  </div>
                  <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:20, fontWeight:500, color:P.velvet, marginBottom:4 }}>{stylist.name}</div>
                  <div style={{ fontSize:12, color:P.rose, letterSpacing:'.08em', textTransform:'uppercase', marginBottom:10, fontWeight:500 }}>{stylist.role}</div>
                  <p style={{ fontSize:14, color:P.mid, lineHeight:1.7, fontWeight:300 }}>{stylist.bio}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────────────── */}
      <section id="reviews" style={{ padding:'120px 5%', background:P.velvetMid, position:'relative', overflow:'hidden' }}>
        <Petals count={14} dark={true} />
        <div style={{ maxWidth:1280, margin:'0 auto', position:'relative', zIndex:2 }}>
          <Reveal>
            <div style={{ textAlign:'center', marginBottom:72 }}>
              <div style={{ display:'inline-flex', alignItems:'center', gap:16, marginBottom:16 }}>
                <div style={{ width:32, height:1, background:P.rose }} />
                <span style={{ fontSize:11, letterSpacing:'.2em', color:P.rose, textTransform:'uppercase' }}>{copy.testimonials_label}</span>
                <div style={{ width:32, height:1, background:P.rose }} />
              </div>
              <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(36px,4vw,60px)', fontWeight:300, color:P.champagne, margin:0, lineHeight:1.05, letterSpacing:'-0.01em' }}>
                <em>{avgRating}</em> out of five.<br />Every single time.
              </h2>
            </div>
          </Reveal>

          <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2,1fr)' : 'repeat(3,1fr)', gap:20 }}>
            {visibleReviews.map((r, i) => (
              <Reveal key={`${reviewPage}-${i}`} delay={i * 0.1}>
                <div style={{ background:P.velvetLt, borderRadius:2, padding:32, border:`1px solid ${P.borderSolid}` }}>
                  <div style={{ display:'flex', gap:4, marginBottom:20 }}>
                    {Array(r.rating || 5).fill(null).map((_, j) => <span key={j} style={{ color:P.rose, fontSize:14 }}>★</span>)}
                  </div>
                  <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:18, color:P.champagne, lineHeight:1.7, margin:'0 0 24px', fontStyle:'italic', fontWeight:300 }}>
                    "{r.text}"
                  </p>
                  <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                    <div style={{ width:36, height:36, borderRadius:'50%', border:`1px solid ${P.rose}50`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:16, color:P.rose }}>{(r.name || '?')[0]}</span>
                    </div>
                    <div>
                      <div style={{ fontSize:14, color:P.champagne, fontWeight:500 }}>{r.name}</div>
                      {r.context && <div style={{ fontSize:12, color:P.light, letterSpacing:'.04em' }}>{r.context}</div>}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {totalReviewPages > 1 && (
            <div style={{ display:'flex', justifyContent:'center', gap:8, marginTop:40 }}>
              {Array.from({ length: totalReviewPages }, (_, i) => (
                <button key={i} data-cursor="link" onClick={() => setReviewPage(i)}
                  style={{ width: reviewPage === i ? 32 : 8, height:8, borderRadius:4, border:'none', cursor:'default', transition:'all .4s', padding:0, background: reviewPage === i ? P.rose : P.borderSolid }}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── ABOUT / DESCRIPTION ──────────────────────────────────────────── */}
      <section style={{ padding:'120px 5%', background:P.cream }}>
        <div style={{ maxWidth:1280, margin:'0 auto', display:'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap:100, alignItems:'center' }}>
          <Reveal dir="right">
            <div style={{ position:'relative' }}>
              <div style={{ width:'100%', aspectRatio:'4/5', background:`linear-gradient(160deg,${P.velvetMid},${P.velvet})`, borderRadius:2, overflow:'hidden', position:'relative', border:`1px solid ${P.borderSolid}` }}>
                <img src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80" alt="Salon interior" style={{ width:'100%', height:'100%', objectFit:'cover', opacity:.6, mixBlendMode:'luminosity' }} onError={() => {}} />
                <div style={{ position:'absolute', inset:0, background:`linear-gradient(to top,${P.velvet}90,transparent 50%)` }} />
                <Petals count={8} dark={true} />
                {/* Floating stat */}
                <div style={{ position:'absolute', bottom:24, left:24, right:24, background:`${P.velvet}CC`, backdropFilter:'blur(8px)', border:`1px solid ${P.borderSolid}`, borderRadius:2, padding:'20px 24px', zIndex:2 }}>
                  <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:40, color:P.champagne, lineHeight:1, marginBottom:4 }}>
                    {stats[0]?.value}{stats[0]?.suffix}
                  </div>
                  <div style={{ fontSize:12, color:P.light, letterSpacing:'.12em', textTransform:'uppercase' }}>{stats[0]?.label}</div>
                </div>
              </div>
              {/* Decorative line */}
              <div style={{ position:'absolute', top:-20, left:-20, width:100, height:100, border:`1px solid ${P.rose}30`, borderRadius:2, zIndex:-1 }} />
            </div>
          </Reveal>

          <Reveal dir="left" delay={0.15}>
            <div>
              <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:20 }}>
                <div style={{ width:40, height:1, background:P.rose }} />
                <span style={{ fontSize:11, letterSpacing:'.2em', color:P.rose, textTransform:'uppercase' }}>{copy.about_label}</span>
              </div>
              <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(32px,3.5vw,52px)', fontWeight:300, color:P.velvet, margin:'0 0 24px', lineHeight:1.1, letterSpacing:'-0.01em' }}>
                {copy.about_heading}
              </h2>
              <p style={{ fontSize:16, color:P.mid, lineHeight:1.9, marginBottom:32, fontWeight:300 }}>
                {description}
              </p>
              {/* Hours */}
              {hoursArr.length > 0 && (
                <div style={{ marginBottom:36, paddingTop:28, borderTop:`1px solid ${P.rose}20` }}>
                  <div style={{ fontSize:11, letterSpacing:'.16em', textTransform:'uppercase', color:P.rose, marginBottom:14, fontWeight:500 }}>Hours</div>
                  {hoursArr.map((h, i) => (
                    <div key={i} style={{ fontSize:14, color:P.mid, lineHeight:2, fontWeight:300 }}>{h}</div>
                  ))}
                </div>
              )}
              <a href={bookingUrl} data-cursor="btn"
                style={{ display:'inline-flex', alignItems:'center', gap:12, padding:'14px 32px', background:P.velvet, color:P.champagne, fontSize:12, letterSpacing:'.16em', textTransform:'uppercase', textDecoration:'none', fontWeight:500, transition:'all .3s' }}
                onMouseEnter={e => { e.currentTarget.style.background = P.velvetMid; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = P.velvet; e.currentTarget.style.transform = 'none'; }}
              >
                {copy.about_cta}
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section style={{ padding:'120px 5%', background:P.velvet }}>
        <div style={{ maxWidth:860, margin:'0 auto' }}>
          <Reveal>
            <div style={{ textAlign:'center', marginBottom:64 }}>
              <div style={{ display:'inline-flex', alignItems:'center', gap:16, marginBottom:16 }}>
                <div style={{ width:32, height:1, background:P.rose }} />
                <span style={{ fontSize:11, letterSpacing:'.2em', color:P.rose, textTransform:'uppercase' }}>{copy.faq_label}</span>
                <div style={{ width:32, height:1, background:P.rose }} />
              </div>
              <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(32px,4vw,56px)', fontWeight:300, color:P.champagne, margin:0, lineHeight:1.05, letterSpacing:'-0.01em' }}>
                {copy.faq_heading}
              </h2>
            </div>
          </Reveal>
          {faq.map((f, i) => <FaqItem key={i} q={f.q} a={f.a} i={i} />)}
        </div>
      </section>

      {/* ── BOOKING CTA ──────────────────────────────────────────────────── */}
      <section style={{ padding:'140px 5%', background:P.cream, position:'relative', overflow:'hidden', textAlign:'center' }}>
        {/* Decorative circles */}
        <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:600, height:600, borderRadius:'50%', border:`1px solid ${P.rose}08`, pointerEvents:'none' }} />
        <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:400, height:400, borderRadius:'50%', border:`1px solid ${P.rose}12`, pointerEvents:'none' }} />
        <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:200, height:200, borderRadius:'50%', border:`1px solid ${P.rose}18`, pointerEvents:'none' }} />

        <div style={{ position:'relative', zIndex:1 }}>
          <Reveal>
            <div style={{ display:'inline-flex', alignItems:'center', gap:16, marginBottom:20 }}>
              <div style={{ width:32, height:1, background:P.rose }} />
              <span style={{ fontSize:11, letterSpacing:'.2em', color:P.rose, textTransform:'uppercase' }}>{copy.cta_label}</span>
              <div style={{ width:32, height:1, background:P.rose }} />
            </div>
          </Reveal>
          <MaskReveal delay={0.1}>
            <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(40px,6vw,80px)', fontWeight:300, color:P.velvet, margin:'0 0 16px', lineHeight:.95, letterSpacing:'-0.02em' }}>
              {copy.cta_heading}
            </h2>
          </MaskReveal>
          <Reveal delay={0.25}>
            <p style={{ fontSize:16, color:P.mid, maxWidth:440, margin:'16px auto 48px', lineHeight:1.7, fontWeight:300 }}>
              {address}
              {phone && <><br /><span style={{ color:P.rose }}>{phone}</span></>}
            </p>
          </Reveal>
          <Reveal delay={0.35}>
            <div style={{ display:'flex', gap:16, justifyContent:'center', flexWrap:'wrap' }}>
              <a href={bookingUrl} data-cursor="btn"
                style={{ padding:'18px 48px', background:P.velvet, color:P.champagne, fontSize:12, letterSpacing:'.18em', textTransform:'uppercase', textDecoration:'none', fontWeight:500, transition:'all .3s' }}
                onMouseEnter={e => { e.currentTarget.style.background = P.velvetMid; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = P.velvet; e.currentTarget.style.transform = 'none'; }}
              >{copy.cta_primary}</a>
              {phone && (
                <a href={`tel:${phone}`} data-cursor="link"
                  style={{ padding:'18px 48px', background:'transparent', color:P.velvet, fontSize:12, letterSpacing:'.18em', textTransform:'uppercase', textDecoration:'none', fontWeight:500, border:`1px solid ${P.velvet}30`, transition:'all .3s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = P.velvet; e.currentTarget.style.background = `${P.velvet}06`; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = `${P.velvet}30`; e.currentTarget.style.background = 'transparent'; }}
                >{phone}</a>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer style={{ background:P.velvet, padding:'40px 5%', borderTop:`1px solid ${P.borderSolid}` }}>
        <div style={{ maxWidth:1280, margin:'0 auto', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:16 }}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <span style={{ color:P.rose, fontSize:10 }}>✦</span>
            <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:16, color:P.champagne, opacity:.7, letterSpacing:'.06em' }}>{name}</span>
          </div>
          <span style={{ fontSize:12, color:P.champagne, opacity:.3, letterSpacing:'.08em' }}>
            © {new Date().getFullYear()} {name} · {city}
          </span>
          <div style={{ display:'flex', gap:24 }}>
            {['Instagram','Privacy','Contact'].map(l => (
              <a key={l} href="#" data-cursor="link"
                style={{ fontSize:12, letterSpacing:'.1em', textTransform:'uppercase', color:P.champagne, textDecoration:'none', opacity:.35, transition:'opacity .2s', fontWeight:400 }}
                onMouseEnter={e => e.target.style.opacity = .8}
                onMouseLeave={e => e.target.style.opacity = .35}
              >{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
