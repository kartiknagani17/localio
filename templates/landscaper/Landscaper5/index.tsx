'use client';

import { useEffect, useRef, useState } from 'react';
import type { TemplateProps, BusinessData, Stat, SiteCopy } from '../../types';

// ─── Copy fallbacks ────────────────────────────────────────────────────────
function getCopy(d: BusinessData): Required<SiteCopy> {
  const c = d.copy ?? {} as SiteCopy;
  return {
    nav_cta:             c.nav_cta             ?? 'Free Estimate',
    hero_cta_primary:    c.hero_cta_primary    ?? 'View Our Work',
    hero_cta_secondary:  c.hero_cta_secondary  ?? 'Call Us',
    services_label:      c.services_label      ?? 'What We Offer',
    services_heading:    c.services_heading    ?? 'Expert Landscaping Services',
    services_subheading: c.services_subheading ?? 'Professional results delivered with care and precision.',
    services_item_cta:   c.services_item_cta   ?? 'Get Started',
    gallery_label:       c.gallery_label       ?? 'Portfolio',
    gallery_heading:     c.gallery_heading     ?? 'Transformations We\'re Proud Of',
    gallery_subheading:  c.gallery_subheading  ?? 'Every project delivered to the highest standard.',
    gallery_cta:         c.gallery_cta         ?? 'View Full Gallery',
    testimonials_label:  c.testimonials_label  ?? 'Client Stories',
    team_label:          c.team_label          ?? 'Our Team',
    team_heading:        c.team_heading        ?? 'The Experts Behind Every Beautiful Yard',
    about_label:         c.about_label         ?? 'About Us',
    about_heading:       c.about_heading       ?? 'Passionate Landscapers, Proven Results',
    about_cta:           c.about_cta           ?? 'Explore Our Services',
    faq_label:           c.faq_label           ?? 'FAQ',
    faq_heading:         c.faq_heading         ?? 'Common Questions, Honest Answers',
    cta_label:           c.cta_label           ?? 'Get Started Today',
    cta_heading:         c.cta_heading         ?? 'Transform Your Outdoor Space',
    cta_subheading:      c.cta_subheading      ?? 'Contact us for a free, no-obligation estimate.',
    cta_primary:         c.cta_primary         ?? 'Get My Free Estimate',
  };
}

// ─── Hooks ─────────────────────────────────────────────────────────────────
function useNavScrolled() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);
  return scrolled;
}

function useInView(threshold = 0.2) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e?.isIntersecting) setVisible(true); }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible] as const;
}

function useCounter(target: number, active: boolean, isFloat = false) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    const start = performance.now();
    const dur = 2000;
    const tick = (now: number) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(isFloat ? parseFloat((eased * target).toFixed(1)) : Math.floor(eased * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [active, target, isFloat]);
  return val;
}

function statNum(s: Stat) {
  const v = s.value;
  if (typeof v === 'number') return v;
  const n = parseFloat(String(v).replace(/[^0-9.]/g, ''));
  return Number.isFinite(n) ? n : 0;
}

// ─── SVG Icons ─────────────────────────────────────────────────────────────
const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" width={15} height={15}><polyline points="20 6 9 17 4 12"/></svg>
);
const PlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} width={13} height={13}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
);
const PinIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={13} height={13}><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
);
const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" width={17} height={17}><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.82 19.79 19.79 0 01.02 1.18 2 2 0 012 .02h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14.92z"/></svg>
);
const StarIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={15} height={15}><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
);
const LeafIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={20} height={20}><path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 008 20C19 20 22 3 22 3c-1 2-8 2-5 5z"/></svg>
);
const MailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={17} height={17}><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="2,4 12,13 22,4"/></svg>
);
const MapIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={17} height={17}><path d="M3 7l6-3 6 3 6-3v13l-6 3-6-3-6 3V7z"/><line x1="9" y1="4" x2="9" y2="18"/><line x1="15" y1="7" x2="15" y2="21"/></svg>
);

// ─── Static content ─────────────────────────────────────────────────────────
const WHY_US = [
  { icon: '🌱', title: 'Local Expertise', desc: 'Deep knowledge of local climate, soil, and plant species for results that last.' },
  { icon: '⭐', title: 'Proven Track Record', desc: 'Hundreds of 5-star reviews and satisfied clients across the region.' },
  { icon: '🔒', title: 'Fully Licensed & Insured', desc: 'Your property is safe in professional, fully-covered hands.' },
  { icon: '💬', title: 'Clear Communication', desc: 'Upfront quotes, no hidden fees, and regular updates on every job.' },
];

const PROCESS_STEPS = [
  { num: '01', title: 'Request a Free Estimate', desc: "Fill in the form or give us a call. We respond within 2 hours to confirm your details and book a time." },
  { num: '02', title: 'Site Visit & Written Quote', desc: "We visit your property, assess the space carefully, and send you a detailed written proposal — no surprises." },
  { num: '03', title: 'Professional Crew Gets to Work', desc: "Our fully-equipped team arrives on schedule and handles everything from start to clean-up." },
  { num: '04', title: 'You Enjoy the Results', desc: "We send before-and-after photos when done and follow up to make sure you're 100% satisfied." },
];

const GAL_BGS = [
  'linear-gradient(135deg,#1a3510,#3a8c22)',
  'linear-gradient(135deg,#c8963c,#e8c547)',
  'linear-gradient(135deg,#2d5a1b,#5aab32)',
  'linear-gradient(135deg,#0f2008,#1a3510)',
  'linear-gradient(135deg,#a87c2e,#c8963c)',
  'linear-gradient(135deg,#3a6b25,#6ab835)',
];

// ─── Main component ─────────────────────────────────────────────────────────
export default function Landscaper5({ businessData: d, isPreview }: TemplateProps) {
  const copy        = getCopy(d);
  const navScrolled = useNavScrolled();
  const [menuOpen, setMenuOpen] = useState(false);
  const [faqOpen,  setFaqOpen]  = useState<number | null>(null);

  const [statsRef, statsVisible] = useInView(0.3) as [React.RefObject<HTMLElement>, boolean];

  const services      = d.services      ?? [];
  const testimonials  = d.testimonials  ?? [];
  const faq           = d.faq           ?? [];
  const stats         = d.stats         ?? [];
  const certs         = d.certifications ?? [];
  const serviceAreas  = d.serviceAreas  ?? [d.city];
  const gallery       = d.gallery       ?? [];

  const s0 = stats[0]; const s1 = stats[1]; const s2 = stats[2]; const s3 = stats[3];
  const c0 = useCounter(s0 ? statNum(s0) : 840,  statsVisible, false);
  const c1 = useCounter(s1 ? statNum(s1) : 12,   statsVisible, false);
  const c2 = useCounter(s2 ? statNum(s2) : 98,   statsVisible, false);
  const c3 = useCounter(s3 ? statNum(s3) : 4.9,  statsVisible, s3 ? String(s3.value).includes('.') : true);

  // SSR-safe floating shapes
  const [shapes, setShapes] = useState<{ id: number; x: number; y: number; size: number; dur: number; delay: number; opacity: number }[]>([]);
  useEffect(() => {
    setShapes(Array.from({ length: 10 }, (_, i) => ({
      id: i,
      x:       Math.random() * 100,
      y:       Math.random() * 100,
      size:    24 + Math.random() * 56,
      dur:     10 + Math.random() * 14,
      delay:   Math.random() * 8,
      opacity: 0.04 + Math.random() * 0.07,
    })));
  }, []);

  const phone      = d.phone ? `tel:${d.phone.replace(/\D/g, '').replace(/^(\d{1,3})(\d{3})(\d{4})$/, '+$1-$2-$3')}` : '#';
  const bookingUrl = d.bookingUrl ?? '#contact';
  const hoursStr   = d.hours
    ? [d.hours.weekdays, d.hours.saturday, d.hours.sunday].filter(Boolean).join(' · ')
    : 'Mon–Fri 7am–6pm · Sat 8am–4pm · Sun Closed';

  const featuredTestimonial = testimonials[0] ?? {
    name: 'Happy Client', text: 'Exceptional work — our property has never looked better. Truly transformed our outdoor space.', rating: 5, context: d.city,
  };
  const sideTestimonials = testimonials.length > 1 ? testimonials.slice(1, 3) : [
    { name: 'D. Wilson', text: 'Punctual, professional, and the results are stunning.', rating: 5, context: d.city },
    { name: 'M. Chen',   text: 'Best landscaping service in the area. Always exceeds expectations.', rating: 5, context: d.city },
  ];

  // Split FAQ into two columns
  const faqMid  = Math.ceil(faq.length / 2);
  const faqCol1 = faq.slice(0, faqMid);
  const faqCol2 = faq.slice(faqMid);

  return (
    <div className="ls5-root">
      <style dangerouslySetInnerHTML={{ __html: LS5_STYLES }} />

      {/* ── FAB ─────────────────────────────────────────── */}
      {!isPreview && d.phone && (
        <a href={phone} className="ls5-fab" aria-label="Call us"><PhoneIcon /></a>
      )}

      {/* ── NAV ─────────────────────────────────────────── */}
      <nav className={`ls5-nav${navScrolled ? ' scrolled' : ''}`}>
        <a href="#hero" className="ls5-logo">
          <span className="ls5-logo-icon"><LeafIcon /></span>
          {d.name}
        </a>
        <div className="ls5-nav-links">
          <a href="#services">Services</a>
          <a href="#about">About</a>
          <a href="#gallery">Gallery</a>
          <a href="#testimonials">Reviews</a>
          <a href="#process">Process</a>
          <a href="#faq">FAQ</a>
        </div>
        <div className="ls5-nav-right">
          {d.phone && <a href={phone} className="ls5-nav-phone">{d.phone}</a>}
          <a href={bookingUrl} className="ls5-nav-cta">{copy.nav_cta}</a>
        </div>
        <button className={`ls5-hamburger${menuOpen ? ' open' : ''}`} onClick={() => setMenuOpen(v => !v)} aria-label="Menu">
          <span /><span /><span />
        </button>
      </nav>

      {/* ── MOBILE MENU ──────────────────────────────────── */}
      {menuOpen && (
        <div className="ls5-mob-menu">
          {([['Services','#services'],['About','#about'],['Gallery','#gallery'],['Reviews','#testimonials'],['Process','#process'],['FAQ','#faq']] as [string,string][]).map(([lbl, href]) => (
            <a key={href} href={href} onClick={() => setMenuOpen(false)}>{lbl}</a>
          ))}
          <a href={bookingUrl} className="ls5-mob-cta" onClick={() => setMenuOpen(false)}>{copy.nav_cta}</a>
        </div>
      )}

      {/* ── HERO ─────────────────────────────────────────── */}
      <section id="hero" className="ls5-hero">
        <div className="ls5-hero-shapes" aria-hidden>
          {shapes.map(s => (
            <span key={s.id} className="ls5-shape" style={{
              left: `${s.x}%`, top: `${s.y}%`,
              width: s.size, height: s.size,
              opacity: s.opacity,
              animationDuration: `${s.dur}s`,
              animationDelay: `${s.delay}s`,
            }} />
          ))}
        </div>

        <div className="ls5-hero-inner">
          <div className="ls5-hero-text">
            <div className="ls5-hero-tag"><StarIcon />Serving {d.city} &amp; Surrounding Areas</div>
            <h1 className="ls5-hero-h1">
              {d.tagline   || 'Professional Landscaping'}<br/>
              <em>{d.subTagline || 'For Every Season'}</em>
            </h1>
            <p className="ls5-hero-sub">{d.description || `Premium lawn care and landscaping in ${d.city}. Licensed, insured, and dedicated to your outdoor space.`}</p>
            <div className="ls5-hero-btns">
              <a href="#gallery"   className="ls5-btn ls5-btn-gold">{copy.hero_cta_primary}</a>
              {d.phone && <a href={phone} className="ls5-btn ls5-btn-ghost"><PhoneIcon />{copy.hero_cta_secondary}</a>}
            </div>
            <div className="ls5-hero-badges">
              {(certs.length ? certs.slice(0, 3) : ['Licensed & Insured', 'Free Estimates', '5-Star Rated']).map((c, i) => (
                <span key={i} className="ls5-badge"><CheckIcon />{c}</span>
              ))}
            </div>
          </div>

          <div className="ls5-hero-card">
            <div className="ls5-hero-card-eyebrow">Free Estimate</div>
            <div className="ls5-hero-card-title">{copy.cta_primary}</div>
            <p className="ls5-hero-card-sub">We&apos;ll respond within 2 hours</p>
            <form onSubmit={e => e.preventDefault()}>
              <input className="ls5-input" type="text" placeholder="Your full name"      readOnly={!!isPreview} />
              <input className="ls5-input" type="tel"  placeholder={d.phone ?? 'Your phone number'} readOnly={!!isPreview} />
              <select className="ls5-select" disabled={!!isPreview}>
                <option value="">Service needed…</option>
                {services.map((s, i) => <option key={i}>{s.name}</option>)}
                {services.length === 0 && <option>Lawn Mowing & Maintenance</option>}
              </select>
              <a href={bookingUrl} className="ls5-btn ls5-btn-gold ls5-btn-full">Request Free Estimate →</a>
            </form>
          </div>
        </div>

        <div className="ls5-hero-wave" aria-hidden>
          <svg viewBox="0 0 1440 110" preserveAspectRatio="none">
            <path fill="#f7f5f0" d="M0,50 C360,110 1080,0 1440,70 L1440,110 L0,110 Z"/>
          </svg>
        </div>
      </section>

      {/* ── WHY US ───────────────────────────────────────── */}
      <section className="ls5-why">
        <div className="ls5-why-grid">
          {WHY_US.map((w, i) => (
            <div key={i} className="ls5-why-card">
              <div className="ls5-why-icon">{w.icon}</div>
              <h3 className="ls5-why-title">{w.title}</h3>
              <p  className="ls5-why-desc">{w.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── SERVICES ─────────────────────────────────────── */}
      <section id="services" className="ls5-services">
        <div className="ls5-wrap">
          <div className="ls5-services-header">
            <div>
              <span className="ls5-label">{copy.services_label}</span>
              <h2 className="ls5-h2">{copy.services_heading}</h2>
            </div>
            <p className="ls5-sub">{copy.services_subheading}</p>
          </div>
          <div className="ls5-services-grid">
            {services.slice(0, 6).map((s, i) => (
              <div key={i} className="ls5-svc-card">
                <div className="ls5-svc-num">0{i + 1}</div>
                <h3 className="ls5-svc-name">{s.name}</h3>
                <p  className="ls5-svc-desc">{s.description}</p>
                {s.price && <div className="ls5-svc-price">{s.price}</div>}
                {s.features?.length ? (
                  <ul className="ls5-svc-feats">
                    {s.features.slice(0, 4).map((f, j) => <li key={j}><CheckIcon />{f}</li>)}
                  </ul>
                ) : null}
                <a href={bookingUrl} className="ls5-svc-link">{copy.services_item_cta} →</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT ────────────────────────────────────────── */}
      <section id="about" className="ls5-about">
        <div className="ls5-wrap ls5-about-wrap">
          <div className="ls5-about-visual">
            <div className="ls5-about-img-main" />
            <div className="ls5-about-img-side" />
            <div className="ls5-about-years-badge">
              <strong>{s1 ? statNum(s1) : 12}+</strong>
              <span>Years of Excellence</span>
            </div>
          </div>
          <div className="ls5-about-content">
            <span className="ls5-label">{copy.about_label}</span>
            <h2 className="ls5-h2">{copy.about_heading}</h2>
            <p className="ls5-about-desc">
              {d.description || `${d.name} has been proudly serving ${d.city} and surrounding areas with professional, reliable landscaping. Our team is passionate about outdoor spaces and committed to delivering exceptional results every time.`}
            </p>
            <div className="ls5-about-certs">
              {(certs.length ? certs : ['Licensed & Insured', 'Eco-Friendly Methods', 'Satisfaction Guaranteed']).map((c, i) => (
                <div key={i} className="ls5-cert-row"><CheckIcon />{c}</div>
              ))}
            </div>
            <a href="#services" className="ls5-btn ls5-btn-green">{copy.about_cta}</a>
          </div>
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────────── */}
      <section className="ls5-stats" ref={statsRef as React.RefObject<HTMLElement>}>
        <div className="ls5-stats-grid">
          {[
            { val: s0 ? c0 : 840,  suf: s0?.suffix ?? '+',   lbl: s0?.label ?? 'Happy Clients'    },
            { val: s1 ? c1 : 12,   suf: s1?.suffix ?? '+',   lbl: s1?.label ?? 'Years Experience'  },
            { val: s2 ? c2 : 98,   suf: s2?.suffix ?? '%',   lbl: s2?.label ?? 'Satisfaction Rate' },
            { val: s3 ? c3 : 4.9,  suf: s3?.suffix ?? '★',   lbl: s3?.label ?? 'Average Rating'    },
          ].map((st, i) => (
            <div key={i} className="ls5-stat">
              <div className="ls5-stat-num">{st.val}<span>{st.suf}</span></div>
              <div className="ls5-stat-lbl">{st.lbl}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── GALLERY ──────────────────────────────────────── */}
      <section id="gallery" className="ls5-gallery">
        <div className="ls5-wrap">
          <div className="ls5-gallery-header">
            <div>
              <span className="ls5-label ls5-label-dk">{copy.gallery_label}</span>
              <h2 className="ls5-h2">{copy.gallery_heading}</h2>
            </div>
            <a href={bookingUrl} className="ls5-btn ls5-btn-outline-dk">{copy.gallery_cta}</a>
          </div>
          <div className="ls5-gal-grid">
            {Array.from({ length: 6 }, (_, i) => gallery[i] ?? { imageUrl: '', label: `Project ${i + 1}`, type: 'general' as const }).map((g, i) => (
              <div key={i} className={`ls5-gal-item ls5-gal-${['wide','norm','norm','norm','norm','wide'][i]}`}>
                <div className="ls5-gal-bg" style={g.imageUrl ? { backgroundImage: `url(${g.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : { background: GAL_BGS[i % 6] }} />
                <div className="ls5-gal-overlay"><span>{g.label || `Project ${i + 1}`}</span></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────── */}
      <section id="testimonials" className="ls5-testi">
        <div className="ls5-wrap">
          <div className="ls5-testi-header">
            <span className="ls5-label">{copy.testimonials_label}</span>
            <h2 className="ls5-h2">What Our Clients Say</h2>
          </div>
          <div className="ls5-testi-layout">
            {/* Featured */}
            <div className="ls5-testi-feat">
              <div className="ls5-testi-feat-quote">&ldquo;</div>
              <div className="ls5-testi-stars">
                {Array.from({ length: 5 }).map((_, i) => <StarIcon key={i} />)}
              </div>
              <p className="ls5-testi-feat-text">{featuredTestimonial.text}</p>
              <div className="ls5-testi-feat-author">
                <div className="ls5-testi-avatar">{featuredTestimonial.name.charAt(0)}</div>
                <div>
                  <strong>{featuredTestimonial.name}</strong>
                  <span>{featuredTestimonial.context ?? d.city}</span>
                </div>
              </div>
            </div>
            {/* Side cards */}
            <div className="ls5-testi-side">
              {sideTestimonials.map((t, i) => (
                <div key={i} className="ls5-testi-mini">
                  <div className="ls5-mini-stars">{Array.from({ length: Math.min(5, t.rating || 5) }).map((_, j) => <StarIcon key={j} />)}</div>
                  <p className="ls5-mini-text">{t.text}</p>
                  <div className="ls5-mini-author">
                    <span className="ls5-mini-avatar">{t.name.charAt(0)}</span>
                    <strong>{t.name}</strong>
                  </div>
                </div>
              ))}
              <a href={bookingUrl} className="ls5-btn ls5-btn-green ls5-btn-full" style={{ marginTop: 4 }}>Get My Free Estimate</a>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROCESS ──────────────────────────────────────── */}
      <section id="process" className="ls5-process">
        <div className="ls5-process-inner">
          <div className="ls5-process-header">
            <span className="ls5-label ls5-label-gold">How It Works</span>
            <h2 className="ls5-h2 ls5-h2-light">Simple &amp; Stress-Free from Start to Finish</h2>
          </div>
          <div className="ls5-timeline">
            {PROCESS_STEPS.map((step, i) => (
              <div key={i} className="ls5-tl-item">
                <div className="ls5-tl-left">
                  <div className="ls5-tl-num">{step.num}</div>
                  {i < PROCESS_STEPS.length - 1 && <div className="ls5-tl-line" />}
                </div>
                <div className="ls5-tl-content">
                  <h3 className="ls5-tl-title">{step.title}</h3>
                  <p  className="ls5-tl-desc">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PACKAGES ─────────────────────────────────────── */}
      <section id="packages" className="ls5-packages">
        <div className="ls5-wrap">
          <div className="ls5-center">
            <span className="ls5-label">Pricing</span>
            <h2 className="ls5-h2">Clear, Honest Pricing</h2>
            <p className="ls5-sub ls5-sub-center">Every quote is tailored to your property — no surprises, ever.</p>
          </div>
          <div className="ls5-pkg-grid">
            {services.slice(0, 3).map((s, i) => (
              <div key={i} className={`ls5-pkg-card${i === 1 ? ' featured' : ''}`}>
                {i === 1 && <div className="ls5-pkg-badge">Most Popular</div>}
                <div className="ls5-pkg-name">{s.name}</div>
                <div className="ls5-pkg-price">{s.price || 'Custom'}</div>
                <div className="ls5-pkg-per">{s.duration || 'per visit'}</div>
                <div className="ls5-pkg-divider" />
                <ul className="ls5-pkg-feats">
                  {(s.features ?? []).slice(0, 5).map((f, j) => <li key={j}><CheckIcon />{f}</li>)}
                </ul>
                <a href={bookingUrl} className={`ls5-btn ls5-btn-full${i === 1 ? ' ls5-btn-gold' : ' ls5-btn-outline-dk'}`}>
                  {copy.services_item_cta}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────── */}
      <section id="faq" className="ls5-faq">
        <div className="ls5-wrap">
          <div className="ls5-faq-header">
            <span className="ls5-label">{copy.faq_label}</span>
            <h2 className="ls5-h2">{copy.faq_heading}</h2>
          </div>
          <div className="ls5-faq-cols">
            {[faqCol1, faqCol2].map((col, ci) => (
              <div key={ci} className="ls5-faq-col">
                {col.map((f, i) => {
                  const idx = ci * faqMid + i;
                  return (
                    <div key={idx} className={`ls5-faq-item${faqOpen === idx ? ' open' : ''}`}>
                      <button type="button" className="ls5-faq-q" onClick={() => setFaqOpen(faqOpen === idx ? null : idx)}>
                        {f.q}<span className="ls5-faq-icon"><PlusIcon /></span>
                      </button>
                      <div className="ls5-faq-a">{f.a}</div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICE AREAS ────────────────────────────────── */}
      <section id="areas" className="ls5-areas">
        <div className="ls5-wrap">
          <span className="ls5-label ls5-label-lt">Where We Work</span>
          <h2 className="ls5-h2 ls5-h2-light">Serving {d.city} &amp; Beyond</h2>
          <div className="ls5-areas-tags">
            {serviceAreas.map((a, i) => (
              <div key={i} className="ls5-area-tag"><PinIcon />{a}</div>
            ))}
          </div>
          <p className="ls5-areas-note">Not on the list? Call us — we may still cover your area.</p>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section id="contact" className="ls5-cta">
        <div className="ls5-wrap ls5-cta-wrap">
          <div className="ls5-cta-text">
            <span className="ls5-label ls5-label-gold">{copy.cta_label}</span>
            <h2 className="ls5-h2 ls5-h2-light">{copy.cta_heading}</h2>
            <p className="ls5-cta-sub">{copy.cta_subheading}</p>
            <div className="ls5-cta-btns">
              <a href="#hero"  className="ls5-btn ls5-btn-gold">{copy.cta_primary}</a>
              {d.phone && <a href={phone} className="ls5-btn ls5-btn-ghost"><PhoneIcon />{d.phone}</a>}
            </div>
            {d.hours && <p className="ls5-cta-hours">{hoursStr}</p>}
          </div>
          <div className="ls5-cta-info">
            <div className="ls5-cta-info-card">
              {d.phone && (
                <div className="ls5-cta-row">
                  <span className="ls5-cta-row-icon"><PhoneIcon /></span>
                  <div><strong>Call us</strong><span>{d.phone}</span></div>
                </div>
              )}
              {d.email && (
                <div className="ls5-cta-row">
                  <span className="ls5-cta-row-icon"><MailIcon /></span>
                  <div><strong>Email us</strong><span>{d.email}</span></div>
                </div>
              )}
              {d.address && (
                <div className="ls5-cta-row">
                  <span className="ls5-cta-row-icon"><MapIcon /></span>
                  <div><strong>Find us</strong><span>{d.address}</span></div>
                </div>
              )}
              <div className="ls5-cta-row">
                <span className="ls5-cta-row-icon"><PinIcon /></span>
                <div><strong>Serving</strong><span>{d.city} &amp; surrounding areas</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────── */}
      <footer className="ls5-footer">
        <div className="ls5-wrap ls5-footer-wrap">
          <div className="ls5-footer-brand">
            <div className="ls5-footer-logo">{d.name}</div>
            <p className="ls5-footer-desc">{d.description || `Premium landscaping services in ${d.city}.`}</p>
          </div>
          <div className="ls5-footer-col">
            <h4>Services</h4>
            <ul>{services.slice(0, 5).map((s, i) => <li key={i}><a href="#services">{s.name}</a></li>)}</ul>
          </div>
          <div className="ls5-footer-col">
            <h4>Areas</h4>
            <ul>{serviceAreas.slice(0, 5).map((a, i) => <li key={i}><a href="#areas">{a}</a></li>)}</ul>
          </div>
          <div className="ls5-footer-col">
            <h4>Contact</h4>
            <ul>
              {d.phone   && <li><a href={phone}>{d.phone}</a></li>}
              {d.email   && <li><a href={`mailto:${d.email}`}>{d.email}</a></li>}
              {d.address && <li>{d.address}</li>}
              <li className="ls5-footer-hours">{hoursStr}</li>
            </ul>
          </div>
        </div>
        <div className="ls5-wrap ls5-footer-bottom">
          <span>© {new Date().getFullYear()} {d.name}. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}

// ─── Styles (scoped with ls5-*) ────────────────────────────────────────────
const LS5_STYLES = `
  .ls5-root { font-family: 'Inter', system-ui, sans-serif; color: #1c2e14; background: #f7f5f0; overflow-x: hidden; container-type: inline-size; }
  .ls5-root * { box-sizing: border-box; margin: 0; padding: 0; }
  .ls5-root a { text-decoration: none; color: inherit; }
  .ls5-root ul { list-style: none; }
  .ls5-root button { font-family: inherit; }
  .ls5-wrap { max-width: 1200px; margin: 0 auto; padding: 0 40px; }
  .ls5-center { text-align: center; display: flex; flex-direction: column; align-items: center; }

  /* ── Keyframes ── */
  @keyframes ls5-blob { 0%,100% { border-radius:60% 40% 70% 30%/50% 60% 40% 50%; transform:translateY(0) rotate(0deg); } 50% { border-radius:40% 60% 30% 70%/60% 40% 60% 40%; transform:translateY(-18px) rotate(12deg); } }
  @keyframes ls5-pulse { 0%{box-shadow:0 0 0 0 rgba(58,140,34,.4)} 70%{box-shadow:0 0 0 14px rgba(58,140,34,0)} 100%{box-shadow:0 0 0 0 rgba(58,140,34,0)} }
  @keyframes ls5-mob-in { from{opacity:0;transform:translateY(-10px)} to{opacity:1;transform:none} }

  /* ── Typography helpers ── */
  .ls5-h2 { font-family:'Playfair Display',Georgia,serif; font-size:clamp(1.85rem,3.5vw,2.8rem); font-weight:900; color:#1c2e14; line-height:1.15; margin-bottom:.4rem; }
  .ls5-h2-light { color:#fff; }
  .ls5-sub { font-size:1rem; color:#6b7a5e; line-height:1.72; max-width:520px; }
  .ls5-sub-center { text-align:center; margin:12px auto 0; }
  .ls5-label { display:inline-flex; align-items:center; gap:5px; background:#e8f5e0; color:#3a8c22; font-size:.7rem; font-weight:700; letter-spacing:.12em; text-transform:uppercase; padding:4px 13px; border-radius:999px; margin-bottom:12px; }
  .ls5-label-dk { background:#2d3a22; color:#7ab832; }
  .ls5-label-gold { background:rgba(200,150,60,.15); color:#c8963c; }
  .ls5-label-lt { background:rgba(255,255,255,.14); color:rgba(255,255,255,.8); }

  /* ── Buttons ── */
  .ls5-btn { display:inline-flex; align-items:center; gap:8px; padding:13px 28px; border-radius:8px; font-size:.94rem; font-weight:700; cursor:pointer; border:2px solid transparent; transition:all .25s ease; }
  .ls5-btn-gold { background:#c8963c; color:#fff; border-color:#c8963c; }
  .ls5-btn-gold:hover { background:#a87c2e; border-color:#a87c2e; transform:translateY(-2px); box-shadow:0 6px 20px rgba(200,150,60,.35); }
  .ls5-btn-green { background:#3a8c22; color:#fff; border-color:#3a8c22; }
  .ls5-btn-green:hover { background:#2d7018; transform:translateY(-2px); box-shadow:0 6px 20px rgba(58,140,34,.35); }
  .ls5-btn-ghost { background:transparent; color:rgba(255,255,255,.9); border-color:rgba(255,255,255,.4); }
  .ls5-btn-ghost:hover { background:rgba(255,255,255,.1); border-color:rgba(255,255,255,.7); }
  .ls5-btn-outline-dk { background:transparent; color:#1c2e14; border-color:#1c2e14; }
  .ls5-btn-outline-dk:hover { background:#1c2e14; color:#f7f5f0; transform:translateY(-2px); }
  .ls5-btn-full { width:100%; justify-content:center; }

  /* ── FAB ── */
  .ls5-fab { position:fixed; bottom:28px; right:28px; z-index:500; width:54px; height:54px; border-radius:50%; background:#3a8c22; display:flex; align-items:center; justify-content:center; color:#fff; box-shadow:0 4px 18px rgba(58,140,34,.45); animation:ls5-pulse 2.4s infinite; }
  .ls5-fab:hover { background:#2d7018; transform:scale(1.1); }

  /* ── NAV ── */
  .ls5-nav { position:fixed; top:0; left:0; right:0; z-index:1000; padding:20px 40px; display:flex; align-items:center; gap:28px; transition:all .35s ease; }
  .ls5-nav.scrolled { background:#0f2008; box-shadow:0 2px 20px rgba(0,0,0,.28); padding:13px 40px; }
  .ls5-logo { display:flex; align-items:center; gap:10px; font-family:'Playfair Display',Georgia,serif; font-weight:700; font-size:1.22rem; color:#fff; flex-shrink:0; }
  .ls5-logo-icon { width:36px; height:36px; border-radius:8px; background:rgba(200,150,60,.22); display:flex; align-items:center; justify-content:center; color:#c8963c; }
  .ls5-nav-links { display:flex; align-items:center; gap:22px; flex:1; justify-content:center; }
  .ls5-nav-links a { font-size:.87rem; font-weight:500; color:rgba(255,255,255,.8); transition:color .25s; }
  .ls5-nav-links a:hover { color:#c8963c; }
  .ls5-nav-right { display:flex; align-items:center; gap:14px; flex-shrink:0; }
  .ls5-nav-phone { font-size:.87rem; font-weight:600; color:rgba(255,255,255,.75); transition:color .25s; }
  .ls5-nav-phone:hover { color:#c8963c; }
  .ls5-nav-cta { padding:9px 22px; background:#c8963c; color:#fff; font-size:.84rem; font-weight:700; border-radius:7px; transition:all .25s; }
  .ls5-nav-cta:hover { background:#a87c2e; transform:translateY(-1px); }

  /* ── Hamburger ── */
  .ls5-hamburger { display:none; flex-direction:column; justify-content:center; align-items:center; gap:5px; width:42px; height:42px; background:rgba(255,255,255,.1); border:1.5px solid rgba(255,255,255,.25); border-radius:8px; cursor:pointer; padding:0; transition:all .25s; flex-shrink:0; }
  .ls5-hamburger span { display:block; width:20px; height:2px; background:#fff; border-radius:2px; transition:all .3s ease; transform-origin:center; }
  .ls5-hamburger.open span:nth-child(1) { transform:translateY(7px) rotate(45deg); }
  .ls5-hamburger.open span:nth-child(2) { opacity:0; transform:scaleX(0); }
  .ls5-hamburger.open span:nth-child(3) { transform:translateY(-7px) rotate(-45deg); }
  @container(max-width:900px) { .ls5-nav-links,.ls5-nav-right{display:none} .ls5-hamburger{display:flex} .ls5-nav{padding:14px 24px} .ls5-nav.scrolled{padding:10px 24px} }

  /* ── Mobile menu ── */
  .ls5-mob-menu { position:fixed; top:64px; left:0; right:0; z-index:999; background:#0f2008; padding:16px 20px 24px; display:flex; flex-direction:column; gap:4px; border-top:2px solid #c8963c; animation:ls5-mob-in .2s ease; }
  .ls5-mob-menu a { display:block; padding:13px 16px; font-size:1rem; font-weight:600; color:rgba(255,255,255,.85); border-radius:8px; transition:background .2s,color .2s; }
  .ls5-mob-menu a:hover { background:rgba(255,255,255,.08); color:#c8963c; }
  .ls5-mob-cta { background:#c8963c!important; color:#fff!important; text-align:center; margin-top:10px; }
  .ls5-mob-cta:hover { background:#a87c2e!important; }

  /* ── HERO ── */
  .ls5-hero { position:relative; min-height:100vh; background:linear-gradient(155deg,#0f2008 0%,#1a3510 50%,#0d1f0a 100%); overflow:hidden; display:flex; align-items:center; padding-bottom:80px; }
  .ls5-hero-shapes { position:absolute; inset:0; pointer-events:none; }
  .ls5-shape { position:absolute; border-radius:60% 40% 70% 30%/50% 60% 40% 50%; background:rgba(200,150,60,.12); animation:ls5-blob ease-in-out infinite; }
  .ls5-hero-inner { position:relative; z-index:10; width:100%; max-width:1200px; margin:0 auto; padding:120px 40px 60px; display:grid; grid-template-columns:1fr 420px; gap:56px; align-items:center; }
  .ls5-hero-tag { display:inline-flex; align-items:center; gap:7px; background:rgba(200,150,60,.15); color:#c8963c; font-size:.78rem; font-weight:600; letter-spacing:.08em; padding:5px 13px; border-radius:6px; margin-bottom:20px; border:1px solid rgba(200,150,60,.25); }
  .ls5-hero-h1 { font-family:'Playfair Display',Georgia,serif; font-size:clamp(2.4rem,5vw,4rem); font-weight:900; color:#fff; line-height:1.1; margin-bottom:20px; }
  .ls5-hero-h1 em { color:#c8963c; font-style:italic; }
  .ls5-hero-sub { font-size:1.04rem; color:rgba(255,255,255,.76); line-height:1.75; margin-bottom:30px; max-width:480px; }
  .ls5-hero-btns { display:flex; gap:13px; flex-wrap:wrap; margin-bottom:28px; }
  .ls5-hero-badges { display:flex; flex-wrap:wrap; gap:12px; }
  .ls5-badge { display:flex; align-items:center; gap:6px; font-size:.8rem; font-weight:600; color:rgba(255,255,255,.8); }
  .ls5-badge svg { color:#c8963c; }
  .ls5-hero-card { background:#fff; border-radius:16px; padding:30px; box-shadow:0 24px 60px rgba(0,0,0,.35); }
  .ls5-hero-card-eyebrow { font-size:.7rem; font-weight:700; text-transform:uppercase; letter-spacing:.12em; color:#c8963c; margin-bottom:6px; }
  .ls5-hero-card-title { font-family:'Playfair Display',Georgia,serif; font-size:1.45rem; font-weight:800; color:#1c2e14; margin-bottom:4px; }
  .ls5-hero-card-sub { font-size:.8rem; color:#6b7a5e; margin-bottom:20px; }
  .ls5-input { width:100%; padding:11px 13px; border:1.5px solid #e0ddd5; border-radius:8px; font-size:.92rem; color:#1c2e14; background:#fafaf7; margin-bottom:11px; display:block; font-family:inherit; }
  .ls5-input:focus { outline:none; border-color:#3a8c22; }
  .ls5-select { width:100%; padding:11px 13px; border:1.5px solid #e0ddd5; border-radius:8px; font-size:.92rem; color:#1c2e14; background:#fafaf7; margin-bottom:16px; display:block; font-family:inherit; appearance:none; }
  .ls5-hero-wave { position:absolute; bottom:0; left:0; right:0; height:110px; }
  .ls5-hero-wave svg { width:100%; height:100%; }
  @container(max-width:1000px) { .ls5-hero-inner{grid-template-columns:1fr;padding:110px 24px 80px} .ls5-hero-card{max-width:480px} }
  @container(max-width:600px) { .ls5-hero-inner{padding:100px 20px 80px} .ls5-hero-h1{font-size:clamp(2rem,8.5vw,2.7rem)} .ls5-hero-btns{flex-direction:column} .ls5-hero-btns .ls5-btn{justify-content:center} }

  /* ── WHY US ── */
  .ls5-why { background:#f7f5f0; padding:56px 40px; border-bottom:1px solid #e8e4dc; }
  .ls5-why-grid { max-width:1200px; margin:0 auto; display:grid; grid-template-columns:repeat(4,1fr); gap:22px; }
  .ls5-why-card { text-align:center; padding:28px 20px; background:#fff; border-radius:12px; border:1px solid #e8e4dc; transition:all .3s; }
  .ls5-why-card:hover { transform:translateY(-4px); box-shadow:0 8px 32px rgba(0,0,0,.08); border-color:#c8963c; }
  .ls5-why-icon { font-size:2.2rem; margin-bottom:13px; }
  .ls5-why-title { font-weight:700; font-size:.97rem; color:#1c2e14; margin-bottom:7px; }
  .ls5-why-desc { font-size:.84rem; color:#6b7a5e; line-height:1.62; }
  @container(max-width:900px) { .ls5-why-grid{grid-template-columns:1fr 1fr} }
  @container(max-width:500px) { .ls5-why-grid{grid-template-columns:1fr} .ls5-why{padding:40px 20px} }

  /* ── SERVICES ── */
  .ls5-services { padding:100px 0; background:#fff; }
  .ls5-services-header { display:flex; justify-content:space-between; align-items:flex-end; gap:24px; flex-wrap:wrap; margin-bottom:52px; }
  .ls5-services-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:22px; }
  .ls5-svc-card { border:1.5px solid #e8e4dc; border-radius:12px; padding:30px; position:relative; overflow:hidden; transition:all .3s; background:#fafaf7; }
  .ls5-svc-card::after { content:''; position:absolute; bottom:0; left:0; right:0; height:3px; background:#c8963c; transform:scaleX(0); transform-origin:left; transition:transform .35s; }
  .ls5-svc-card:hover { border-color:#c8963c; transform:translateY(-4px); box-shadow:0 12px 40px rgba(0,0,0,.09); background:#fff; }
  .ls5-svc-card:hover::after { transform:scaleX(1); }
  .ls5-svc-num { font-family:'Playfair Display',Georgia,serif; font-size:3rem; font-weight:900; color:#e8e4dc; line-height:1; margin-bottom:10px; transition:color .3s; }
  .ls5-svc-card:hover .ls5-svc-num { color:#f0e8d0; }
  .ls5-svc-name { font-weight:700; font-size:1.13rem; color:#1c2e14; margin-bottom:9px; }
  .ls5-svc-desc { font-size:.87rem; color:#6b7a5e; line-height:1.65; margin-bottom:12px; }
  .ls5-svc-price { display:inline-flex; background:#e8f5e0; color:#3a8c22; font-size:.83rem; font-weight:700; padding:4px 11px; border-radius:6px; margin-bottom:12px; }
  .ls5-svc-feats { display:flex; flex-direction:column; gap:6px; margin-bottom:16px; }
  .ls5-svc-feats li { display:flex; align-items:center; gap:7px; font-size:.81rem; color:#6b7a5e; }
  .ls5-svc-feats li svg { color:#3a8c22; flex-shrink:0; }
  .ls5-svc-link { font-size:.87rem; font-weight:700; color:#c8963c; transition:color .25s; }
  .ls5-svc-link:hover { color:#a87c2e; }
  @container(max-width:900px) { .ls5-services-grid{grid-template-columns:1fr 1fr} }
  @container(max-width:580px) { .ls5-services-grid{grid-template-columns:1fr} }

  /* ── ABOUT ── */
  .ls5-about { padding:100px 0; background:#f7f5f0; }
  .ls5-about-wrap { display:grid; grid-template-columns:1fr 1fr; gap:80px; align-items:center; }
  .ls5-about-visual { position:relative; }
  .ls5-about-img-main { width:100%; aspect-ratio:4/5; border-radius:16px; background:linear-gradient(135deg,#2d5a1b,#4caf50); box-shadow:0 16px 48px rgba(0,0,0,.14); }
  .ls5-about-img-side { position:absolute; bottom:-22px; right:-22px; width:54%; aspect-ratio:1; border-radius:12px; background:linear-gradient(135deg,#c8963c,#e8c547); border:4px solid #f7f5f0; box-shadow:0 8px 24px rgba(0,0,0,.12); }
  .ls5-about-years-badge { position:absolute; top:22px; left:-20px; background:#0f2008; border-radius:12px; padding:16px 20px; text-align:center; }
  .ls5-about-years-badge strong { display:block; font-family:'Playfair Display',Georgia,serif; font-size:2rem; font-weight:900; color:#c8963c; line-height:1; }
  .ls5-about-years-badge span { display:block; font-size:.7rem; color:rgba(255,255,255,.65); margin-top:4px; font-weight:500; }
  .ls5-about-desc { color:#6b7a5e; line-height:1.76; margin:14px 0 22px; }
  .ls5-about-certs { display:flex; flex-direction:column; gap:10px; margin-bottom:26px; }
  .ls5-cert-row { display:flex; align-items:center; gap:9px; font-size:.9rem; font-weight:600; color:#1c2e14; }
  .ls5-cert-row svg { color:#3a8c22; }
  @container(max-width:900px) { .ls5-about-wrap{grid-template-columns:1fr} .ls5-about-img-side{right:-10px;bottom:-10px} }

  /* ── STATS ── */
  .ls5-stats { padding:76px 40px; background:#0f2008; }
  .ls5-stats-grid { max-width:1100px; margin:0 auto; display:grid; grid-template-columns:repeat(4,1fr); gap:40px; text-align:center; }
  .ls5-stat-num { font-family:'Playfair Display',Georgia,serif; font-size:clamp(2.4rem,4.5vw,3.8rem); font-weight:900; color:#fff; line-height:1; }
  .ls5-stat-num span { color:#c8963c; }
  .ls5-stat-lbl { font-size:.87rem; color:rgba(255,255,255,.6); margin-top:8px; }
  @container(max-width:700px) { .ls5-stats-grid{grid-template-columns:repeat(2,1fr)} }

  /* ── GALLERY ── */
  .ls5-gallery { padding:100px 0; background:#fff; }
  .ls5-gallery-header { display:flex; justify-content:space-between; align-items:flex-end; gap:24px; flex-wrap:wrap; margin-bottom:44px; }
  .ls5-gal-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:14px; }
  .ls5-gal-item { border-radius:12px; overflow:hidden; position:relative; cursor:pointer; }
  .ls5-gal-wide { grid-column:span 2; aspect-ratio:16/7; }
  .ls5-gal-norm { aspect-ratio:4/3; }
  .ls5-gal-bg { width:100%; height:100%; transition:transform .5s ease; }
  .ls5-gal-item:hover .ls5-gal-bg { transform:scale(1.07); }
  .ls5-gal-overlay { position:absolute; inset:0; background:linear-gradient(to top,rgba(15,32,8,.72) 0%,transparent 60%); display:flex; align-items:flex-end; padding:18px; opacity:0; transition:opacity .35s; }
  .ls5-gal-item:hover .ls5-gal-overlay { opacity:1; }
  .ls5-gal-overlay span { color:#fff; font-size:.9rem; font-weight:600; }
  @container(max-width:700px) { .ls5-gal-grid{grid-template-columns:1fr 1fr;grid-template-rows:auto} .ls5-gal-wide,.ls5-gal-norm{aspect-ratio:4/3;grid-column:auto} }
  @container(max-width:480px) { .ls5-gal-grid{grid-template-columns:1fr} }

  /* ── TESTIMONIALS ── */
  .ls5-testi { padding:100px 0; background:#f7f5f0; }
  .ls5-testi-header { text-align:center; margin-bottom:56px; }
  .ls5-testi-layout { display:grid; grid-template-columns:1.3fr 1fr; gap:36px; align-items:start; }
  .ls5-testi-feat { background:#0f2008; border-radius:20px; padding:44px 38px; }
  .ls5-testi-feat-quote { font-family:'Playfair Display',Georgia,serif; font-size:5rem; line-height:1; color:#c8963c; margin-bottom:-16px; }
  .ls5-testi-stars { display:flex; gap:3px; color:#c8963c; margin-bottom:18px; }
  .ls5-testi-feat-text { font-size:1.08rem; color:rgba(255,255,255,.84); line-height:1.75; font-style:italic; margin-bottom:26px; }
  .ls5-testi-feat-author { display:flex; align-items:center; gap:13px; }
  .ls5-testi-avatar { width:48px; height:48px; border-radius:50%; background:#c8963c; display:flex; align-items:center; justify-content:center; font-family:'Playfair Display',Georgia,serif; font-size:1.2rem; font-weight:700; color:#fff; flex-shrink:0; }
  .ls5-testi-feat-author strong { display:block; font-size:.93rem; color:#fff; margin-bottom:2px; }
  .ls5-testi-feat-author span { font-size:.78rem; color:rgba(255,255,255,.55); }
  .ls5-testi-side { display:flex; flex-direction:column; gap:18px; }
  .ls5-testi-mini { background:#fff; border-radius:14px; padding:22px; border:1px solid #e8e4dc; transition:all .3s; }
  .ls5-testi-mini:hover { border-color:#c8963c; transform:translateX(4px); }
  .ls5-mini-stars { display:flex; gap:3px; color:#c8963c; margin-bottom:9px; }
  .ls5-mini-text { font-size:.88rem; color:#6b7a5e; line-height:1.65; font-style:italic; margin-bottom:13px; }
  .ls5-mini-author { display:flex; align-items:center; gap:9px; font-size:.84rem; font-weight:700; color:#1c2e14; }
  .ls5-mini-avatar { width:30px; height:30px; border-radius:50%; background:#e8f5e0; display:flex; align-items:center; justify-content:center; font-size:.88rem; font-weight:700; color:#3a8c22; flex-shrink:0; }
  @container(max-width:900px) { .ls5-testi-layout{grid-template-columns:1fr} }

  /* ── PROCESS ── */
  .ls5-process { padding:100px 40px; background:#1a3510; }
  .ls5-process-inner { max-width:780px; margin:0 auto; }
  .ls5-process-header { text-align:center; margin-bottom:56px; }
  .ls5-timeline { display:flex; flex-direction:column; }
  .ls5-tl-item { display:grid; grid-template-columns:72px 1fr; gap:22px; }
  .ls5-tl-left { display:flex; flex-direction:column; align-items:center; }
  .ls5-tl-num { width:60px; height:60px; border-radius:50%; background:#0f2008; border:2px solid #c8963c; display:flex; align-items:center; justify-content:center; font-family:'Playfair Display',Georgia,serif; font-size:1rem; font-weight:900; color:#c8963c; flex-shrink:0; }
  .ls5-tl-line { flex:1; width:2px; background:rgba(200,150,60,.28); margin:7px 0; min-height:36px; }
  .ls5-tl-content { padding-bottom:38px; }
  .ls5-tl-title { font-weight:700; font-size:1.07rem; color:#fff; margin-bottom:7px; padding-top:16px; }
  .ls5-tl-desc { font-size:.88rem; color:rgba(255,255,255,.62); line-height:1.72; }
  @container(max-width:600px) { .ls5-process{padding:80px 20px} .ls5-tl-item{grid-template-columns:52px 1fr;gap:14px} .ls5-tl-num{width:48px;height:48px;font-size:.88rem} }

  /* ── PACKAGES ── */
  .ls5-packages { padding:100px 0; background:#f7f5f0; }
  .ls5-packages .ls5-center { margin-bottom:52px; }
  .ls5-pkg-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:22px; }
  .ls5-pkg-card { border:2px solid #e8e4dc; border-radius:14px; padding:34px 26px; position:relative; background:#fff; transition:all .3s; }
  .ls5-pkg-card:hover { border-color:#c8963c; transform:translateY(-4px); box-shadow:0 12px 40px rgba(0,0,0,.09); }
  .ls5-pkg-card.featured { background:#0f2008; border-color:#c8963c; }
  .ls5-pkg-card.featured:hover { transform:translateY(-4px); box-shadow:0 16px 48px rgba(15,32,8,.4); }
  .ls5-pkg-badge { position:absolute; top:-13px; left:50%; transform:translateX(-50%); background:#c8963c; color:#fff; font-size:.7rem; font-weight:800; padding:4px 14px; border-radius:999px; letter-spacing:.08em; text-transform:uppercase; white-space:nowrap; }
  .ls5-pkg-name { font-size:.78rem; font-weight:700; text-transform:uppercase; letter-spacing:.1em; color:#6b7a5e; margin-bottom:10px; }
  .ls5-pkg-card.featured .ls5-pkg-name { color:rgba(255,255,255,.55); }
  .ls5-pkg-price { font-family:'Playfair Display',Georgia,serif; font-size:2.8rem; font-weight:900; color:#1c2e14; line-height:1; }
  .ls5-pkg-card.featured .ls5-pkg-price { color:#fff; }
  .ls5-pkg-per { font-size:.8rem; color:#6b7a5e; margin-bottom:20px; }
  .ls5-pkg-card.featured .ls5-pkg-per { color:rgba(255,255,255,.52); }
  .ls5-pkg-divider { height:1px; background:#e8e4dc; margin:18px 0; }
  .ls5-pkg-card.featured .ls5-pkg-divider { background:rgba(255,255,255,.12); }
  .ls5-pkg-feats { display:flex; flex-direction:column; gap:9px; margin-bottom:26px; }
  .ls5-pkg-feats li { display:flex; align-items:center; gap:8px; font-size:.86rem; color:#6b7a5e; }
  .ls5-pkg-card.featured .ls5-pkg-feats li { color:rgba(255,255,255,.72); }
  .ls5-pkg-feats svg { color:#3a8c22; flex-shrink:0; }
  .ls5-pkg-card.featured .ls5-pkg-feats svg { color:#c8963c; }
  @container(max-width:900px) { .ls5-pkg-grid{grid-template-columns:1fr;max-width:420px;margin:0 auto} }

  /* ── FAQ ── */
  .ls5-faq { padding:100px 0; background:#fff; }
  .ls5-faq-header { text-align:center; margin-bottom:52px; }
  .ls5-faq-cols { display:grid; grid-template-columns:1fr 1fr; gap:20px; }
  .ls5-faq-col { display:flex; flex-direction:column; gap:10px; }
  .ls5-faq-item { border:1.5px solid #e8e4dc; border-radius:10px; overflow:hidden; transition:border-color .25s; }
  .ls5-faq-item.open { border-color:#c8963c; }
  .ls5-faq-q { width:100%; padding:17px 18px; display:flex; align-items:center; justify-content:space-between; background:none; border:none; cursor:pointer; text-align:left; font-size:.94rem; font-weight:600; color:#1c2e14; font-family:inherit; gap:12px; }
  .ls5-faq-icon { width:26px; height:26px; border-radius:50%; background:#f7f5f0; flex-shrink:0; display:flex; align-items:center; justify-content:center; transition:transform .3s,background .3s; }
  .ls5-faq-item.open .ls5-faq-icon { transform:rotate(45deg); background:#c8963c; color:#fff; }
  .ls5-faq-a { max-height:0; overflow:hidden; transition:max-height .4s ease,padding .4s ease; padding:0 18px; font-size:.89rem; color:#6b7a5e; line-height:1.75; }
  .ls5-faq-item.open .ls5-faq-a { max-height:300px; padding:0 18px 16px; }
  @container(max-width:700px) { .ls5-faq-cols{grid-template-columns:1fr} }

  /* ── AREAS ── */
  .ls5-areas { padding:76px 40px; background:#0f2008; }
  .ls5-areas .ls5-wrap { display:flex; flex-direction:column; align-items:flex-start; gap:0; }
  .ls5-areas-tags { display:flex; flex-wrap:wrap; gap:11px; margin:26px 0 12px; }
  .ls5-area-tag { display:flex; align-items:center; gap:6px; padding:8px 17px; border-radius:6px; border:1px solid rgba(200,150,60,.28); background:rgba(200,150,60,.07); font-size:.87rem; color:rgba(255,255,255,.78); transition:all .25s; }
  .ls5-area-tag:hover { background:rgba(200,150,60,.2); border-color:#c8963c; color:#fff; }
  .ls5-area-tag svg { color:#c8963c; }
  .ls5-areas-note { font-size:.84rem; color:rgba(255,255,255,.38); }

  /* ── CTA ── */
  .ls5-cta { padding:96px 0; background:#1a3510; }
  .ls5-cta-wrap { display:grid; grid-template-columns:1.2fr 1fr; gap:56px; align-items:center; }
  .ls5-cta-sub { font-size:.98rem; color:rgba(255,255,255,.68); line-height:1.7; margin:10px 0 26px; }
  .ls5-cta-btns { display:flex; gap:12px; flex-wrap:wrap; margin-bottom:16px; }
  .ls5-cta-hours { font-size:.8rem; color:rgba(255,255,255,.38); }
  .ls5-cta-info-card { background:rgba(255,255,255,.06); border:1px solid rgba(255,255,255,.1); border-radius:14px; padding:26px; display:flex; flex-direction:column; gap:18px; }
  .ls5-cta-row { display:flex; align-items:flex-start; gap:13px; }
  .ls5-cta-row-icon { color:#c8963c; flex-shrink:0; margin-top:2px; }
  .ls5-cta-row strong { display:block; font-size:.88rem; font-weight:700; color:#fff; margin-bottom:2px; }
  .ls5-cta-row span { font-size:.83rem; color:rgba(255,255,255,.62); }
  @container(max-width:900px) { .ls5-cta-wrap{grid-template-columns:1fr} .ls5-cta-btns{flex-direction:column} .ls5-cta-btns .ls5-btn{justify-content:center} }

  /* ── FOOTER ── */
  .ls5-footer { background:#0f2008; color:rgba(255,255,255,.65); padding:68px 0 28px; }
  .ls5-footer-wrap { display:grid; grid-template-columns:2fr 1fr 1fr 1.2fr; gap:44px; margin-bottom:44px; }
  .ls5-footer-logo { font-family:'Playfair Display',Georgia,serif; font-weight:700; font-size:1.18rem; color:#fff; margin-bottom:13px; }
  .ls5-footer-desc { font-size:.85rem; line-height:1.7; }
  .ls5-footer-col h4 { font-size:.72rem; font-weight:700; text-transform:uppercase; letter-spacing:.12em; color:rgba(255,255,255,.38); margin-bottom:15px; }
  .ls5-footer-col ul { display:flex; flex-direction:column; gap:8px; }
  .ls5-footer-col li { font-size:.85rem; }
  .ls5-footer-col a { color:rgba(255,255,255,.58); transition:color .25s; }
  .ls5-footer-col a:hover { color:#c8963c; }
  .ls5-footer-hours { color:rgba(255,255,255,.38); font-size:.8rem; line-height:1.5; }
  .ls5-footer-bottom { padding-top:22px; border-top:1px solid rgba(255,255,255,.06); font-size:.77rem; color:rgba(255,255,255,.28); }
  @container(max-width:1000px) { .ls5-footer-wrap{grid-template-columns:1fr 1fr} }
  @container(max-width:580px) { .ls5-footer-wrap{grid-template-columns:1fr} .ls5-footer{padding:44px 0 20px} }
  @container(max-width:580px) { .ls5-wrap{padding:0 20px} .ls5-about{padding:80px 0} .ls5-services,.ls5-gallery,.ls5-testi,.ls5-packages,.ls5-faq,.ls5-cta{padding:80px 0} }
`;
