'use client';
import { useState, useEffect, useRef } from 'react';
import type { RefObject } from 'react';
import type { TemplateProps, ServiceItem, Testimonial, FAQ, Stat } from '../../types';

// ── Design tokens ────────────────────────────────────────────────────────────
const P = {
  bg:        '#07090D',
  surface:   '#0C1220',
  card:      '#101927',
  cardHov:   '#162235',
  border:    '#1A2D42',
  blue:      '#00BAFF',
  blueDk:    '#0099D6',
  blueGlow:  'rgba(0,186,255,0.12)',
  white:     '#FFFFFF',
  offWhite:  '#D4E4F0',
  silver:    '#8BAABB',
  muted:     '#4A6275',
  orange:    '#FF6B1A',
  grad:      'linear-gradient(135deg, #07090D 0%, #0C1A2E 100%)',
};

// ── Hooks ────────────────────────────────────────────────────────────────────
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

function useCounter(target: number, duration = 1800, active = false): number {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    const start = performance.now();
    const raf = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      setVal((1 - Math.pow(1 - p, 3)) * target);
      if (p < 1) requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }, [active, target, duration]);
  return val;
}

// ── Default fallback data ─────────────────────────────────────────────────────
const DEF_SERVICES: ServiceItem[] = [
  {
    name: 'Essential Wash',
    price: '$79',
    duration: '1.5 hr',
    description: 'Hand wash, interior vacuum, windows, and tyre dressing.',
    features: ['Exterior hand wash', 'Interior vacuum', 'Window cleaning', 'Tyre & wheel shine', 'Air freshener'],
  },
  {
    name: 'Premium Detail',
    price: '$199',
    duration: '4 hr',
    description: 'Full interior & exterior detail with paint decontamination.',
    features: ['Everything in Essential', 'Clay bar treatment', 'Paint decontamination', 'Interior deep clean', 'Leather conditioning', 'Engine bay wipe-down'],
  },
  {
    name: 'Elite Correction',
    price: '$399',
    duration: '8 hr',
    description: 'Machine polish + ceramic coating for showroom-level results.',
    features: ['Everything in Premium', 'Machine polish (1-stage)', 'Ceramic coating', 'Paint sealant', 'Headlight restoration', '6-month protection'],
  },
];

const DEF_TESTIMONIALS: Testimonial[] = [
  { name: 'Marcus T.', text: 'These guys transformed my Mustang. The paint looked like it just rolled off the factory floor. Absolutely elite work.', rating: 5, context: 'Ford Mustang GT — Elite Correction' },
  { name: 'Sarah K.', text: "I've tried three other detailers and nobody comes close. The attention to detail is unmatched. Worth every penny.", rating: 5, context: 'Tesla Model 3 — Premium Detail' },
  { name: 'James R.', text: 'Brought my truck in after a road trip. They made it look brand new inside and out. Fast, professional, honest pricing.', rating: 5, context: 'RAM 1500 — Essential Wash' },
];

const DEF_FAQS: FAQ[] = [
  { q: 'How long does a full detail take?', a: 'Essential Wash is ~1.5 hours, Premium Detail is 3–4 hours, and Elite Correction can take up to 8 hours for the best results.' },
  { q: 'Do you offer mobile detailing?', a: 'Yes! We come to your home or office within a 20-mile radius. Book online or call us to schedule.' },
  { q: 'What products do you use?', a: 'We use professional-grade products including Gyeon, Koch-Chemie, and Gtechniq coatings. No cheap consumer products — ever.' },
  { q: 'Is ceramic coating worth it?', a: 'Absolutely. It provides 2–5 years of protection, makes washing easier, and dramatically enhances gloss.' },
  { q: 'Do I need to be there during the detail?', a: "No — many clients drop off and pick up when done. We'll send you a text when it's ready." },
];

const DEF_STATS: Stat[] = [
  { value: 2400, label: 'Cars Detailed', suffix: '+' },
  { value: 8,    label: 'Years in Business', suffix: '+' },
  { value: 99,   label: 'Satisfaction Rate', suffix: '%' },
  { value: 4.9,  label: 'Google Rating', suffix: '★' },
];

// ── NavBar ───────────────────────────────────────────────────────────────────
function NavBar({ name, phone, bookingUrl }: { name: string; phone?: string; bookingUrl?: string }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn, { passive: true });
    fn();
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      height: 68,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 40px',
      background: scrolled ? 'rgba(7,9,13,0.94)' : 'transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      borderBottom: `1px solid ${scrolled ? P.border : 'transparent'}`,
      transition: 'background 0.3s, border-color 0.3s, backdrop-filter 0.3s',
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 34, height: 34, borderRadius: 8,
          background: P.blue,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="3" fill="#07090D"/>
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="#07090D"/>
            <path d="M12 6l1.5 4.5H18l-3.75 2.73 1.43 4.39L12 15l-3.68 2.62 1.43-4.39L6 10.5h4.5z" fill="#07090D"/>
          </svg>
        </div>
        <span style={{ color: P.white, fontWeight: 800, fontSize: 16, letterSpacing: '-0.3px' }}>
          {name}
        </span>
      </div>

      {/* Links */}
      <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
        {['Services', 'Reviews', 'FAQ', 'Contact'].map(l => (
          <a key={l} href={`#${l.toLowerCase()}`} style={{
            color: P.silver, fontSize: 14, fontWeight: 500,
            textDecoration: 'none', letterSpacing: '0.3px',
            transition: 'color 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = P.white)}
          onMouseLeave={e => (e.currentTarget.style.color = P.silver)}
          >{l}</a>
        ))}
      </div>

      {/* CTA */}
      <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
        {phone && (
          <a href={`tel:${phone}`} style={{ color: P.silver, fontSize: 14, textDecoration: 'none', fontWeight: 500 }}>
            {phone}
          </a>
        )}
        <a href={bookingUrl || '#contact'} style={{
          background: P.blue, color: P.bg,
          padding: '10px 22px', borderRadius: 8,
          fontWeight: 700, fontSize: 14, textDecoration: 'none',
          transition: 'background 0.2s, transform 0.15s',
          display: 'inline-block',
        }}
        onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = '#33CAFF'; el.style.transform = 'translateY(-1px)'; }}
        onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = P.blue; el.style.transform = ''; }}
        >Book Now</a>
      </div>
    </nav>
  );
}

// ── Hero ─────────────────────────────────────────────────────────────────────
function Hero({ name, city, tagline, subTagline, phone, bookingUrl }: {
  name: string; city: string; tagline?: string; subTagline?: string;
  phone?: string; bookingUrl?: string;
}) {
  return (
    <section style={{
      minHeight: '100vh',
      background: P.bg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative', overflow: 'hidden',
      paddingTop: 68,
    }}>
      {/* Grid background */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: `
          linear-gradient(rgba(0,186,255,0.045) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,186,255,0.045) 1px, transparent 1px)
        `,
        backgroundSize: '64px 64px',
        maskImage: 'radial-gradient(ellipse 80% 60% at 50% 40%, black 0%, transparent 100%)',
        WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 40%, black 0%, transparent 100%)',
      }} />

      {/* Glow blob */}
      <div style={{
        position: 'absolute', top: '15%', left: '50%',
        transform: 'translateX(-50%)',
        width: 700, height: 500,
        background: `radial-gradient(ellipse, rgba(0,186,255,0.07) 0%, transparent 65%)`,
        pointerEvents: 'none',
      }} />

      {/* Top accent line */}
      <div style={{
        position: 'absolute', top: 0, left: '50%',
        transform: 'translateX(-50%)',
        width: 1, height: 100,
        background: `linear-gradient(to bottom, transparent, ${P.blue})`,
      }} />

      {/* Content */}
      <div style={{ position: 'relative', textAlign: 'center', maxWidth: 860, padding: '0 32px' }}>

        {/* Eyebrow badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: P.blueGlow,
          border: `1px solid rgba(0,186,255,0.22)`,
          borderRadius: 100, padding: '7px 18px',
          marginBottom: 36,
        }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: P.blue, boxShadow: `0 0 8px ${P.blue}` }} />
          <span style={{ color: P.blue, fontSize: 12, fontWeight: 700, letterSpacing: '1.8px', textTransform: 'uppercase' }}>
            {city} Auto Detailing
          </span>
        </div>

        {/* Headline */}
        <h1 style={{
          color: P.white,
          fontSize: 'clamp(38px, 6.5vw, 80px)',
          fontWeight: 900,
          lineHeight: 1.04,
          letterSpacing: '-3px',
          margin: '0 0 24px',
        }}>
          {tagline || `Your Car Deserves\nPerfection.`}
        </h1>

        {/* Sub */}
        <p style={{
          color: P.silver,
          fontSize: 'clamp(16px, 2vw, 20px)',
          lineHeight: 1.7,
          margin: '0 auto 52px',
          maxWidth: 560,
        }}>
          {subTagline || `Premium hand detailing in ${city}. Every surface. Every time. Results that speak for themselves.`}
        </p>

        {/* CTAs */}
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href={bookingUrl || '#services'} style={{
            background: P.blue, color: P.bg,
            padding: '17px 40px', borderRadius: 10,
            fontWeight: 800, fontSize: 16, textDecoration: 'none',
            transition: 'all 0.2s',
            boxShadow: `0 0 24px rgba(0,186,255,0.3)`,
          }}
          onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = '#33CAFF'; el.style.transform = 'translateY(-2px)'; el.style.boxShadow = '0 0 36px rgba(0,186,255,0.45)'; }}
          onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = P.blue; el.style.transform = ''; el.style.boxShadow = '0 0 24px rgba(0,186,255,0.3)'; }}
          >Book a Detail</a>

          <a href="#services" style={{
            background: 'transparent', color: P.offWhite,
            padding: '17px 40px', borderRadius: 10,
            fontWeight: 600, fontSize: 16, textDecoration: 'none',
            border: `1px solid ${P.border}`,
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.borderColor = P.blue; el.style.color = P.blue; }}
          onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.borderColor = P.border; el.style.color = P.offWhite; }}
          >View Packages</a>
        </div>

        {/* Trust badges */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 36, marginTop: 68, flexWrap: 'wrap' }}>
          {[
            { icon: '★', text: '4.9 Google Rating' },
            { icon: '✓', text: 'Fully Insured' },
            { icon: '◎', text: '100% Satisfaction Guaranteed' },
          ].map(({ icon, text }) => (
            <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: P.blue, fontSize: 15 }}>{icon}</span>
              <span style={{ color: P.muted, fontSize: 13, fontWeight: 500 }}>{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom fade */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 100,
        background: `linear-gradient(to bottom, transparent, ${P.bg})`,
        pointerEvents: 'none',
      }} />
    </section>
  );
}

// ── Services ─────────────────────────────────────────────────────────────────
function Services({ services, bookingUrl }: { services: ServiceItem[]; bookingUrl?: string }) {
  const [ref, visible] = useInView();
  const tiers = services.length >= 3 ? services.slice(0, 3) : DEF_SERVICES;

  return (
    <section id="services" style={{ background: P.surface, padding: '100px 32px' }} ref={ref}>
      <div style={{ maxWidth: 1120, margin: '0 auto' }}>

        <div style={{ textAlign: 'center', marginBottom: 72 }}>
          <span style={{ color: P.blue, fontSize: 11, fontWeight: 700, letterSpacing: '2.5px', textTransform: 'uppercase', display: 'block', marginBottom: 14 }}>
            Our Packages
          </span>
          <h2 style={{ color: P.white, fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: 900, margin: '0 0 14px', letterSpacing: '-1.5px' }}>
            Choose Your Level of Clean
          </h2>
          <p style={{ color: P.silver, fontSize: 17, margin: 0 }}>No upsells. No hidden fees. Just exceptional results.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {tiers.map((svc, i) => {
            const featured = i === 1;
            return (
              <div key={svc.name} style={{
                background: featured ? P.blue : P.card,
                border: featured ? 'none' : `1px solid ${P.border}`,
                borderRadius: 20,
                padding: featured ? '44px 36px' : '40px 32px',
                position: 'relative',
                opacity: visible ? 1 : 0,
                transform: visible ? (featured ? 'translateY(-10px) scale(1.02)' : 'translateY(0)') : 'translateY(28px)',
                transition: `all 0.55s ${i * 0.12}s cubic-bezier(0.23,1,0.32,1)`,
                boxShadow: featured ? `0 24px 64px rgba(0,186,255,0.25)` : 'none',
              }}>

                {featured && (
                  <div style={{
                    position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)',
                    background: P.orange, color: '#fff',
                    fontSize: 10, fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase',
                    padding: '5px 16px', borderRadius: 100,
                    whiteSpace: 'nowrap',
                  }}>Most Popular</div>
                )}

                {/* Package name & desc */}
                <h3 style={{ color: featured ? P.bg : P.white, fontSize: 22, fontWeight: 800, margin: '0 0 8px', letterSpacing: '-0.5px' }}>
                  {svc.name}
                </h3>
                <p style={{ color: featured ? 'rgba(7,9,13,0.65)' : P.muted, fontSize: 14, margin: '0 0 28px', lineHeight: 1.55 }}>
                  {svc.description || ''}
                </p>

                {/* Price */}
                <div style={{ marginBottom: 28 }}>
                  <span style={{ color: featured ? P.bg : P.blue, fontSize: 48, fontWeight: 900, letterSpacing: '-2px' }}>
                    {svc.price || 'Call'}
                  </span>
                  {svc.duration && (
                    <span style={{ color: featured ? 'rgba(7,9,13,0.55)' : P.muted, fontSize: 13, marginLeft: 8 }}>
                      · {svc.duration}
                    </span>
                  )}
                </div>

                {/* Divider */}
                <div style={{ height: 1, background: featured ? 'rgba(7,9,13,0.12)' : P.border, marginBottom: 24 }} />

                {/* Features */}
                <ul style={{ listStyle: 'none', margin: '0 0 32px', padding: 0, display: 'flex', flexDirection: 'column', gap: 11 }}>
                  {(svc.features || []).map(f => (
                    <li key={f} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                      <span style={{
                        width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
                        background: featured ? 'rgba(7,9,13,0.12)' : P.blueGlow,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 10, color: featured ? P.bg : P.blue, fontWeight: 800, marginTop: 1,
                      }}>✓</span>
                      <span style={{ color: featured ? P.bg : P.offWhite, fontSize: 14, lineHeight: 1.45 }}>{f}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <a href={bookingUrl || '#contact'} style={{
                  display: 'block', textAlign: 'center',
                  padding: '14px', borderRadius: 10,
                  fontWeight: 700, fontSize: 15, textDecoration: 'none',
                  background: featured ? P.bg : 'transparent',
                  color: featured ? P.blue : P.white,
                  border: featured ? 'none' : `1px solid ${P.border}`,
                  transition: 'all 0.2s',
                }}>
                  Book This Package →
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ── Stats ────────────────────────────────────────────────────────────────────
function StatItem({ stat, visible, delay }: { stat: Stat; visible: boolean; delay: number }) {
  const numVal = typeof stat.value === 'number' ? stat.value : parseFloat(String(stat.value));
  const isFloat = Math.floor(numVal) !== numVal;
  const count = useCounter(numVal, 1800, visible);

  return (
    <div style={{
      textAlign: 'center',
      opacity: visible ? 1 : 0,
      transform: visible ? 'none' : 'translateY(20px)',
      transition: `all 0.5s ${delay}s ease`,
    }}>
      <div style={{
        fontSize: 'clamp(44px, 5.5vw, 66px)', fontWeight: 900,
        color: P.blue, letterSpacing: '-2.5px', lineHeight: 1,
      }}>
        {isFloat ? count.toFixed(1) : Math.floor(count)}{stat.suffix || ''}
      </div>
      <div style={{
        color: P.muted, fontSize: 13, fontWeight: 600,
        marginTop: 10, textTransform: 'uppercase', letterSpacing: '1.5px',
      }}>
        {stat.label}
      </div>
    </div>
  );
}

function Stats({ stats }: { stats: Stat[] }) {
  const [ref, visible] = useInView();
  const items = stats.length > 0 ? stats.slice(0, 4) : DEF_STATS;
  return (
    <section ref={ref} style={{
      background: P.bg, padding: '80px 32px',
      borderTop: `1px solid ${P.border}`, borderBottom: `1px solid ${P.border}`,
    }}>
      <div style={{
        maxWidth: 960, margin: '0 auto',
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 32,
      }}>
        {items.map((s, i) => <StatItem key={s.label} stat={s} visible={visible} delay={i * 0.1} />)}
      </div>
    </section>
  );
}

// ── How It Works ─────────────────────────────────────────────────────────────
function Process() {
  const [ref, visible] = useInView();
  const steps = [
    { num: '01', title: 'Book Online', body: 'Pick your package, choose a date, and confirm in under 2 minutes. No phone tag required.' },
    { num: '02', title: 'We Detail', body: 'Our certified technicians go to work using professional-grade products and meticulous technique.' },
    { num: '03', title: 'Drive Proud', body: 'Pick up your car looking showroom-fresh. We\'ll even send you before & after photos.' },
  ];
  return (
    <section style={{ background: P.surface, padding: '100px 32px' }} ref={ref}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 72 }}>
          <span style={{ color: P.blue, fontSize: 11, fontWeight: 700, letterSpacing: '2.5px', textTransform: 'uppercase', display: 'block', marginBottom: 14 }}>
            How It Works
          </span>
          <h2 style={{ color: P.white, fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: 900, margin: 0, letterSpacing: '-1.5px' }}>
            Simple. Fast. Immaculate.
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32 }}>
          {steps.map((s, i) => (
            <div key={s.num} style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'none' : 'translateY(24px)',
              transition: `all 0.5s ${i * 0.14}s ease`,
            }}>
              {/* Step number */}
              <div style={{
                fontSize: 64, fontWeight: 900, letterSpacing: '-3px',
                color: P.border, lineHeight: 1, marginBottom: 20,
              }}>
                {s.num}
              </div>
              {/* Accent line */}
              <div style={{ width: 40, height: 3, background: P.blue, borderRadius: 2, marginBottom: 20 }} />
              <h3 style={{ color: P.white, fontSize: 22, fontWeight: 800, margin: '0 0 12px', letterSpacing: '-0.5px' }}>
                {s.title}
              </h3>
              <p style={{ color: P.silver, fontSize: 15, lineHeight: 1.7, margin: 0 }}>
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Testimonials ──────────────────────────────────────────────────────────────
function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  const [ref, visible] = useInView();
  const items = testimonials.length > 0 ? testimonials.slice(0, 3) : DEF_TESTIMONIALS;
  return (
    <section id="reviews" style={{ background: P.bg, padding: '100px 32px' }} ref={ref}>
      <div style={{ maxWidth: 1120, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 72 }}>
          <span style={{ color: P.blue, fontSize: 11, fontWeight: 700, letterSpacing: '2.5px', textTransform: 'uppercase', display: 'block', marginBottom: 14 }}>
            Client Reviews
          </span>
          <h2 style={{ color: P.white, fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: 900, margin: 0, letterSpacing: '-1.5px' }}>
            Don't Take Our Word for It
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {items.map((t, i) => (
            <div key={t.name} style={{
              background: P.card, border: `1px solid ${P.border}`,
              borderRadius: 18, padding: '32px',
              opacity: visible ? 1 : 0,
              transform: visible ? 'none' : 'translateY(28px)',
              transition: `all 0.55s ${i * 0.12}s ease`,
              display: 'flex', flexDirection: 'column',
            }}>
              {/* Stars */}
              <div style={{ marginBottom: 18 }}>
                {Array.from({ length: t.rating }).map((_, si) => (
                  <span key={si} style={{ color: P.orange, fontSize: 17, marginRight: 2 }}>★</span>
                ))}
              </div>

              {/* Quote */}
              <p style={{
                color: P.offWhite, fontSize: 15, lineHeight: 1.75,
                margin: '0 0 auto', paddingBottom: 24,
                fontStyle: 'italic',
              }}>
                "{t.text}"
              </p>

              {/* Author */}
              <div style={{ borderTop: `1px solid ${P.border}`, paddingTop: 18 }}>
                <div style={{ color: P.white, fontWeight: 700, fontSize: 15 }}>{t.name}</div>
                {t.context && <div style={{ color: P.muted, fontSize: 13, marginTop: 3 }}>{t.context}</div>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── FAQ ───────────────────────────────────────────────────────────────────────
function FAQSection({ faqs }: { faqs: FAQ[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const items = faqs.length > 0 ? faqs : DEF_FAQS;
  return (
    <section id="faq" style={{ background: P.surface, padding: '100px 32px' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <span style={{ color: P.blue, fontSize: 11, fontWeight: 700, letterSpacing: '2.5px', textTransform: 'uppercase', display: 'block', marginBottom: 14 }}>
            FAQ
          </span>
          <h2 style={{ color: P.white, fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: 900, margin: 0, letterSpacing: '-1.5px' }}>
            Common Questions
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {items.map((f, i) => (
            <div key={i} style={{
              background: P.card,
              border: `1px solid ${open === i ? P.blue : P.border}`,
              borderRadius: 14, overflow: 'hidden',
              transition: 'border-color 0.2s',
            }}>
              <button onClick={() => setOpen(open === i ? null : i)} style={{
                width: '100%', textAlign: 'left',
                background: 'none', border: 'none', cursor: 'pointer',
                padding: '20px 24px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16,
              }}>
                <span style={{ color: P.white, fontSize: 16, fontWeight: 600, lineHeight: 1.4 }}>{f.q}</span>
                <span style={{
                  color: P.blue, fontSize: 22, lineHeight: 1, flexShrink: 0,
                  transform: open === i ? 'rotate(45deg)' : 'none',
                  transition: 'transform 0.2s',
                }}>+</span>
              </button>
              {open === i && (
                <div style={{ padding: '0 24px 22px' }}>
                  <p style={{ color: P.silver, fontSize: 15, lineHeight: 1.75, margin: 0 }}>{f.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Contact / CTA ─────────────────────────────────────────────────────────────
function Contact({ name, phone, email, address, hours, bookingUrl, serviceAreas }: {
  name: string; phone?: string; email?: string; address?: string;
  hours?: { weekdays?: string; saturday?: string; sunday?: string };
  bookingUrl?: string; serviceAreas?: string[];
}) {
  return (
    <section id="contact" style={{ background: P.bg, padding: '100px 32px' }}>
      <div style={{ maxWidth: 1120, margin: '0 auto' }}>

        {/* CTA Banner */}
        <div style={{
          background: P.surface,
          border: `1px solid ${P.border}`,
          borderRadius: 24, padding: '72px 56px',
          textAlign: 'center', marginBottom: 72,
          position: 'relative', overflow: 'hidden',
        }}>
          {/* Glow */}
          <div style={{
            position: 'absolute', top: -80, left: '50%', transform: 'translateX(-50%)',
            width: 500, height: 300,
            background: `radial-gradient(ellipse, rgba(0,186,255,0.07) 0%, transparent 70%)`,
            pointerEvents: 'none',
          }} />

          <h2 style={{
            color: P.white,
            fontSize: 'clamp(30px, 4.5vw, 60px)',
            fontWeight: 900, margin: '0 0 16px', letterSpacing: '-2px',
          }}>
            Ready to Transform Your Car?
          </h2>
          <p style={{ color: P.silver, fontSize: 18, margin: '0 0 44px' }}>
            Book online or give us a call. Same-week appointments available.
          </p>

          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href={bookingUrl || '#'} style={{
              background: P.blue, color: P.bg,
              padding: '17px 44px', borderRadius: 10,
              fontWeight: 800, fontSize: 17, textDecoration: 'none',
              boxShadow: `0 0 28px rgba(0,186,255,0.3)`,
              transition: 'all 0.2s',
            }}>Book Online</a>
            {phone && (
              <a href={`tel:${phone}`} style={{
                background: 'transparent', color: P.white,
                padding: '17px 44px', borderRadius: 10,
                fontWeight: 600, fontSize: 17, textDecoration: 'none',
                border: `1px solid ${P.border}`,
              }}>{phone}</a>
            )}
          </div>
        </div>

        {/* Info grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 40 }}>
          {address && (
            <div>
              <div style={{ color: P.blue, fontSize: 11, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 14 }}>Location</div>
              <p style={{ color: P.silver, fontSize: 15, lineHeight: 1.65, margin: 0 }}>{address}</p>
            </div>
          )}
          {hours && (hours.weekdays || hours.saturday || hours.sunday) && (
            <div>
              <div style={{ color: P.blue, fontSize: 11, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 14 }}>Hours</div>
              {hours.weekdays && <p style={{ color: P.silver, fontSize: 15, margin: '0 0 4px' }}>{hours.weekdays}</p>}
              {hours.saturday && <p style={{ color: P.silver, fontSize: 15, margin: '0 0 4px' }}>{hours.saturday}</p>}
              {hours.sunday && <p style={{ color: P.silver, fontSize: 15, margin: 0 }}>{hours.sunday}</p>}
            </div>
          )}
          {serviceAreas && serviceAreas.length > 0 && (
            <div>
              <div style={{ color: P.blue, fontSize: 11, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 14 }}>Service Areas</div>
              <p style={{ color: P.silver, fontSize: 15, lineHeight: 1.65, margin: 0 }}>{serviceAreas.join(' · ')}</p>
            </div>
          )}
          {email && (
            <div>
              <div style={{ color: P.blue, fontSize: 11, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 14 }}>Email</div>
              <a href={`mailto:${email}`} style={{ color: P.blue, fontSize: 15, textDecoration: 'none' }}>{email}</a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────
function Footer({ name, city }: { name: string; city: string }) {
  return (
    <footer style={{
      background: P.surface, borderTop: `1px solid ${P.border}`,
      padding: '28px 40px',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      flexWrap: 'wrap', gap: 12,
    }}>
      <p style={{ color: P.muted, fontSize: 14, margin: 0 }}>
        © {new Date().getFullYear()} {name} · {city}
      </p>
      <p style={{ color: P.muted, fontSize: 13, margin: 0 }}>
        Powered by Localio
      </p>
    </footer>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
export default function CarDetailing2({ businessData: d }: TemplateProps) {
  const services     = d.services?.length     ? d.services     : DEF_SERVICES;
  const testimonials = d.testimonials?.length ? d.testimonials : DEF_TESTIMONIALS;
  const faqs         = d.faq?.length          ? d.faq          : DEF_FAQS;
  const stats        = d.stats?.length        ? d.stats        : DEF_STATS;

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", background: P.bg }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { margin: 0; }
      `}</style>

      <NavBar name={d.name} phone={d.phone} bookingUrl={d.bookingUrl} />
      <Hero
        name={d.name} city={d.city}
        tagline={d.tagline} subTagline={d.subTagline}
        phone={d.phone} bookingUrl={d.bookingUrl}
      />
      <Services services={services} bookingUrl={d.bookingUrl} />
      <Stats stats={stats} />
      <Process />
      <Testimonials testimonials={testimonials} />
      <FAQSection faqs={faqs} />
      <Contact
        name={d.name} phone={d.phone} email={d.email}
        address={d.address} hours={d.hours}
        bookingUrl={d.bookingUrl} serviceAreas={d.serviceAreas}
      />
      <Footer name={d.name} city={d.city} />
    </div>
  );
}
