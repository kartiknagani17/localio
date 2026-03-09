'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import type { TemplateProps, BusinessData, FAQ, Stat, SiteCopy } from '../types';

// ─── Default copy fallbacks ────────────────────────────────────────────────
function getCopy(d: BusinessData): Required<SiteCopy> {
  const c = d.copy ?? {} as SiteCopy;
  return {
    nav_cta: c.nav_cta ?? 'Free Quote',
    hero_cta_primary: c.hero_cta_primary ?? 'View Packages',
    hero_cta_secondary: c.hero_cta_secondary ?? 'Call Us',
    services_label: c.services_label ?? 'What We Do',
    services_heading: c.services_heading ?? 'Premium Landscaping Services',
    services_subheading: c.services_subheading ?? 'Every service delivered with care and precision.',
    services_item_cta: c.services_item_cta ?? 'Get Started',
    gallery_label: c.gallery_label ?? 'Our Work',
    gallery_heading: c.gallery_heading ?? 'Before & After — Real Results',
    gallery_subheading: c.gallery_subheading ?? 'Recent transformations from properties like yours.',
    gallery_cta: c.gallery_cta ?? 'See Full Portfolio',
    testimonials_label: c.testimonials_label ?? 'Reviews',
    team_label: c.team_label ?? 'Meet the Team',
    team_heading: c.team_heading ?? 'The People Behind Your Perfect Lawn',
    about_label: c.about_label ?? 'Our Story',
    about_heading: c.about_heading ?? 'We Love What We Do — And It Shows',
    about_cta: c.about_cta ?? 'Get Started Today',
    faq_label: c.faq_label ?? 'FAQ',
    faq_heading: c.faq_heading ?? 'Questions We Hear Every Day',
    cta_label: c.cta_label ?? 'Limited Spots Available',
    cta_heading: c.cta_heading ?? "Ready for the Lawn You've Always Wanted?",
    cta_subheading: c.cta_subheading ?? "Get your free quote today — we'll call you back within 2 hours.",
    cta_primary: c.cta_primary ?? 'Get My Free Quote',
  };
}

// ─── Hooks ─────────────────────────────────────────────────────────────────
function useNavScrolled() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return scrolled;
}

function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e?.isIntersecting) setVisible(true);
    }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible] as const;
}

function useCounter(target: number, active: boolean, isFloat = false): number {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    const start = performance.now();
    const duration = 1800;
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const v = eased * target;
      setVal(isFloat ? parseFloat(v.toFixed(1)) : Math.floor(v));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [active, target, isFloat]);
  return val;
}

// ─── Stat value (Gemini may send string or number) ─────────────────────────
function statValue(s: Stat): number {
  const v = s.value;
  if (typeof v === 'number') return v;
  const n = parseFloat(String(v).replace(/[^0-9.]/g, ''));
  return Number.isFinite(n) ? n : 0;
}

// ─── Icons (shared SVGs) ───────────────────────────────────────────────────
const Check = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={14} height={14}><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
);
const Plus = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} width={14} height={14}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
);
const Pin = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={14} height={14}><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
);
const Phone = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" width={18} height={18}><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.82 19.79 19.79 0 01.02 1.18 2 2 0 012 .02h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14.92z"/></svg>
);
const Star = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={18} height={18}><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
);

// ─── Process steps (static copy; could move to copy later) ──────────────────
const PROCESS_STEPS = [
  { title: 'Free Consultation', desc: "Call or submit the form. We'll reach out within 2 hours to discuss your needs and schedule a visit." },
  { title: 'Property Walk-Through', desc: "Our team visits your property, assesses the work, and provides a detailed written quote — no hidden fees." },
  { title: 'We Get to Work', desc: 'On your chosen date, our crew arrives on time, fully equipped, and takes care of everything start to finish.' },
  { title: 'You Enjoy the Results', desc: "We send you a photo update when done. You admire your gorgeous yard. We'll see you next visit!" },
];

// ─── Ticker items from stats/certs ─────────────────────────────────────────
function buildTickerItems(d: BusinessData): string[] {
  const items: string[] = [];
  if (d.certifications?.length) items.push(`✅ ${d.certifications[0]}`);
  items.push('🌿 Free Estimates — No Obligation');
  if (d.stats?.length) items.push(`⭐ ${d.stats[0]?.label ?? 'Happy Clients'}`);
  items.push('📞 Call-back in 2 Hours');
  items.push('💯 Satisfaction Guaranteed');
  return items.length ? items : ['🌱 Licensed & Insured', '🌿 Free Estimates', '💯 Satisfaction Guaranteed'];
}

// ─── Placeholder team (no team[] in BusinessData) ──────────────────────────
const PLACEHOLDER_TEAM = [
  { name: 'Our Crew', role: 'Landscaping Experts', bio: 'Professional, licensed, and passionate about every yard we care for.', color: 'ls4-tp-1' },
  { name: 'Our Crew', role: 'Garden & Design', bio: 'From seasonal plantings to full landscape design — we bring your vision to life.', color: 'ls4-tp-2' },
  { name: 'Our Crew', role: 'Lawn Care', bio: 'Weekly mowing, edging, and maintenance so your property always looks its best.', color: 'ls4-tp-3' },
];

const GALLERY_GRADIENTS = ['ls4-g-color-1', 'ls4-g-color-2', 'ls4-g-color-3', 'ls4-g-color-4', 'ls4-g-color-5', 'ls4-g-color-6'] as const;
const PARTICLE_CHARS = ['🍀', '🌿', '🍃', '🌱', '🌾', '🍂', '🌸'];

export default function Landscaper4({ businessData: d, isPreview }: TemplateProps) {
  const copy = getCopy(d);
  const navScrolled = useNavScrolled();
  const [faqOpen, setFaqOpen]     = useState<number | null>(null);
  const [menuOpen, setMenuOpen]   = useState(false);
  const [statsRef, statsVisible] = useInView(0.3);

  const services = d.services ?? [];
  const testimonials = d.testimonials ?? [];
  const faq = d.faq ?? [];
  const stats = d.stats ?? [];
  const certifications = d.certifications ?? [];
  const serviceAreas = d.serviceAreas ?? [d.city];
  const gallery = d.gallery ?? [];

  const tickerItems = useMemo(() => buildTickerItems(d), [d.certifications, d.stats]);
  const stat0 = stats[0]; const stat1 = stats[1]; const stat2 = stats[2]; const stat3 = stats[3];
  const count0 = useCounter(stat0 ? statValue(stat0) : 840, statsVisible, false);
  const count1 = useCounter(stat1 ? statValue(stat1) : 12, statsVisible, false);
  const count2 = useCounter(stat2 ? statValue(stat2) : 98, statsVisible, false);
  const count3 = useCounter(stat3 ? statValue(stat3) : 49, statsVisible, stat3 ? String(stat3.value).includes('.') : false);

  const aboutBullets = useMemo(() => {
    const b: { title: string; desc: string }[] = [];
    if (certifications.length) b.push({ title: certifications[0], desc: 'Professional standards you can trust.' });
    b.push({ title: 'Licensed & Fully Insured', desc: 'Your property is fully protected.' });
    b.push({ title: 'Eco-Friendly Products', desc: 'We use EPA-certified, pet-safe treatments.' });
    return b.slice(0, 3);
  }, [certifications]);

  const [grassBlades, setGrassBlades] = useState<{ id: number; left: number; height: number; width: number; duration: number; delay: number; opacity: number; color: string }[]>([]);
  const [particles, setParticles] = useState<{ id: number; char: string; left: number; bottom: number; size: number; duration: number; delay: number }[]>([]);

  useEffect(() => {
    setGrassBlades(Array.from({ length: 60 }, (_, i) => ({
      id: i,
      left: (i / 60) * 100 + (Math.random() - 0.5) * 2,
      height: 40 + Math.random() * 100,
      width: 5 + Math.random() * 7,
      duration: 1.8 + Math.random() * 2,
      delay: Math.random() * 2,
      opacity: 0.5 + Math.random() * 0.5,
      color: Math.random() > 0.5 ? '#4caf50' : '#8bc34a',
    })));
    setParticles(Array.from({ length: 18 }, (_, i) => ({
      id: i,
      char: PARTICLE_CHARS[Math.floor(Math.random() * PARTICLE_CHARS.length)],
      left: Math.random() * 100,
      bottom: 15 + Math.random() * 30,
      size: 0.8 + Math.random() * 1.2,
      duration: 4 + Math.random() * 6,
      delay: Math.random() * 6,
    })));
  }, []);

  const phone = d.phone ? `tel:${d.phone.replace(/\D/g, '').replace(/^(\d{1,3})(\d{3})(\d{4})$/, '+$1-$2-$3')}` : '#';
  const bookingUrl = d.bookingUrl ?? '#hero';

  const hoursStr = d.hours
    ? [d.hours.weekdays, d.hours.saturday, d.hours.sunday].filter(Boolean).join(' · ')
    : 'Mon–Fri: 7am–6pm · Sat: 8am–4pm · Sun: Closed';

  return (
    <div className="ls4-root">
      <style dangerouslySetInnerHTML={{ __html: LS4_STYLES }} />

      {/* FAB */}
      {!isPreview && d.phone && (
        <a href={phone} className="ls4-fab" title="Call us" aria-label="Call">
          <Phone />
        </a>
      )}

      {/* NAV */}
      <nav className={`ls4-nav ${navScrolled ? 'ls4-nav-scrolled' : ''}`}>
        <a href="#hero" className="ls4-logo">
          <span className="ls4-logo-svg" />
          {d.name}
        </a>
        <div className="ls4-nav-links">
          <a href="#services">Services</a>
          <a href="#about">About</a>
          <a href="#gallery">Gallery</a>
          <a href="#testimonials">Reviews</a>
          <a href="#packages">Packages</a>
          <a href="#faq">FAQ</a>
        </div>
        <div className="ls4-nav-cta">
          {d.phone && <a href={phone}>{d.phone}</a>}
          <a href={bookingUrl} className="ls4-nav-cta-btn">{copy.nav_cta}</a>
        </div>
        <button
          className={`ls4-hamburger${menuOpen ? ' open' : ''}`}
          onClick={() => setMenuOpen(v => !v)}
          aria-label="Menu"
        >
          <span /><span /><span />
        </button>
      </nav>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="ls4-mob-menu">
          {([['Services','#services'],['About','#about'],['Gallery','#gallery'],['Reviews','#testimonials'],['Packages','#packages'],['FAQ','#faq']] as [string,string][]).map(([lbl, href]) => (
            <a key={href} href={href} onClick={() => setMenuOpen(false)}>{lbl}</a>
          ))}
          <a href={bookingUrl} className="ls4-mob-cta-btn" onClick={() => setMenuOpen(false)}>
            {copy.nav_cta}
          </a>
        </div>
      )}

      {/* HERO */}
      <section id="hero" className="ls4-hero">
        <div className="ls4-hero-sky" />
        <div className="ls4-particles">
          {particles.map((p) => (
            <span
              key={p.id}
              className="ls4-particle"
              style={{
                left: `${p.left}%`,
                bottom: `${p.bottom}%`,
                fontSize: `${p.size}rem`,
                animationDuration: `${p.duration}s`,
                animationDelay: `${p.delay}s`,
              }}
            >
              {p.char}
            </span>
          ))}
        </div>
        <div className="ls4-hero-bird" aria-hidden />
        <div className="ls4-hero-grass">
          {grassBlades.map((b) => (
            <span
              key={b.id}
              className="ls4-blade"
              style={{
                left: `${b.left}%`,
                height: b.height,
                width: b.width,
                animationDuration: `${b.duration}s`,
                animationDelay: `${b.delay}s`,
                opacity: b.opacity,
                background: `linear-gradient(to top, #0d3305, ${b.color})`,
              }}
            />
          ))}
        </div>
        <svg className="ls4-hero-hills" viewBox="0 0 1440 180" preserveAspectRatio="none">
          <path fill="rgba(27,77,11,.4)" d="M0,80 Q120,20 240,80 Q360,140 480,80 Q600,20 720,80 Q840,140 960,80 Q1080,20 1200,80 Q1320,140 1440,80 L1440,180 L0,180 Z"/>
          <path fill="rgba(27,77,11,.6)" d="M0,100 Q180,40 360,100 Q540,160 720,100 Q900,40 1080,100 Q1260,160 1440,100 L1440,180 L0,180 Z"/>
          <path fill="rgba(15,50,5,.8)" d="M0,130 Q240,80 480,130 Q720,180 960,130 Q1200,80 1440,130 L1440,180 L0,180 Z"/>
        </svg>
        <div className="ls4-hero-content">
          <div className="ls4-hero-left">
            <div className="ls4-hero-badge">Serving {d.city}</div>
            <h1 className="ls4-hero-title">
              {d.tagline || 'Your Outdoor Space,'}<br/>
              <em>{d.subTagline || 'Beautifully Cared For'}</em>
            </h1>
            <p className="ls4-hero-subtitle">{d.description || `Premium lawn care and landscaping in ${d.city}.`}</p>
            <div className="ls4-hero-actions">
              <a href="#packages" className="ls4-btn ls4-btn-white"><Star />{copy.hero_cta_primary}</a>
              {d.phone && <a href={phone} className="ls4-btn ls4-btn-outline-w"> <Phone />{copy.hero_cta_secondary}</a>}
            </div>
            <div className="ls4-hero-trust">
              {certifications.slice(0, 3).map((c, i) => (
                <div key={i} className="ls4-hero-trust-item"><Check />{c}</div>
              ))}
              {certifications.length === 0 && (
                <>
                  <div className="ls4-hero-trust-item"><Check />Licensed & Insured</div>
                  <div className="ls4-hero-trust-item"><Check />Free Estimates</div>
                  <div className="ls4-hero-trust-item"><Check />Satisfaction Guaranteed</div>
                </>
              )}
            </div>
          </div>
          <div className="ls4-hero-card">
            <div className="ls4-hero-card-title">{copy.cta_primary}</div>
            <form action={bookingUrl} className="ls4-hero-card-form">
              <div className="ls4-hero-card-field">
                <label>Your name</label>
                <input type="text" placeholder="Your name" readOnly={!!isPreview} />
              </div>
              <div className="ls4-hero-card-field">
                <label>Phone</label>
                <input type="tel" placeholder={d.phone || 'Phone'} readOnly={!!isPreview} />
              </div>
              <a href={bookingUrl} className="ls4-hero-card-btn">Request My Free Quote →</a>
            </form>
            {d.phone && <p className="ls4-hero-card-note">We&apos;ll call you within 2 hours</p>}
          </div>
        </div>
      </section>

      {/* TICKER */}
      <div className="ls4-ticker-strip">
        <div className="ls4-ticker-inner">
          {[...tickerItems, ...tickerItems].map((txt, i) => (
            <span key={i} className="ls4-ticker-item"><span className="ls4-ticker-dot" />{txt}</span>
          ))}
        </div>
      </div>

      {/* SERVICES */}
      <section id="services" className="ls4-section ls4-services">
        <div className="ls4-services-wrap">
          <div className="ls4-services-header">
            <div className="ls4-reveal ls4-visible">
              <div className="ls4-section-label">{copy.services_label}</div>
              <h2 className="ls4-section-title">{copy.services_heading}</h2>
            </div>
            <div className="ls4-reveal ls4-visible">
              <p className="ls4-section-sub">{copy.services_subheading}</p>
              <a href="#packages" className="ls4-btn ls4-btn-outline" style={{ marginTop: 20 }}>See All Packages</a>
            </div>
          </div>
          <div className="ls4-services-grid">
            {services.slice(0, 6).map((s, i) => (
              <div key={i} className="ls4-service-card">
                <div className="ls4-service-icon"><span className="ls4-service-icon-inner" /></div>
                <div className="ls4-service-name">{s.name}</div>
                <div className="ls4-service-desc">{s.description || ''}</div>
                {s.price && <div className="ls4-service-price-tag">{s.price}</div>}
                {s.features?.length ? (
                  <ul className="ls4-service-features">
                    {s.features.map((f, j) => (
                      <li key={j}><Check />{f}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section id="stats" className="ls4-stats" ref={statsRef}>
        <span className="ls4-stats-leaf" style={{ top: -40, left: '5%' }} aria-hidden>🌿</span>
        <span className="ls4-stats-leaf" style={{ bottom: -40, right: '5%' }} aria-hidden>🍀</span>
        <div className="ls4-stats-wrap">
          <div className="ls4-stats-grid">
            <div className="ls4-stat-item">
              <div className="ls4-stat-num">{stat0 ? count0 : '840'}<span className="ls4-stat-suffix">{stat0?.suffix ?? '+'}</span></div>
              <div className="ls4-stat-divider" />
              <div className="ls4-stat-label">{stat0?.label ?? 'Happy Clients'}</div>
            </div>
            <div className="ls4-stat-item">
              <div className="ls4-stat-num">{stat1 ? count1 : '12'}<span className="ls4-stat-suffix">{stat1?.suffix ?? ' yrs'}</span></div>
              <div className="ls4-stat-divider" />
              <div className="ls4-stat-label">{stat1?.label ?? 'Years Experience'}</div>
            </div>
            <div className="ls4-stat-item">
              <div className="ls4-stat-num">{stat2 ? count2 : '98'}<span className="ls4-stat-suffix">{stat2?.suffix ?? '%'}</span></div>
              <div className="ls4-stat-divider" />
              <div className="ls4-stat-label">{stat2?.label ?? 'Satisfaction Rate'}</div>
            </div>
            <div className="ls4-stat-item">
              <div className="ls4-stat-num">{stat3 ? count3 : '4.9'}<span className="ls4-stat-suffix">{stat3?.suffix ?? '★'}</span></div>
              <div className="ls4-stat-divider" />
              <div className="ls4-stat-label">{stat3?.label ?? 'Average Rating'}</div>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="ls4-about">
        <div className="ls4-about-wrap">
          <div className="ls4-about-image-stack ls4-reveal-left ls4-visible">
            <div className="ls4-about-img-main" />
            <div className="ls4-about-img-secondary" />
            <div className="ls4-about-badge-float">
              <div className="ls4-about-badge-icon"><Star /></div>
              <div><strong>4.9 ★</strong><span>Trusted by clients</span></div>
            </div>
          </div>
          <div className="ls4-about-text ls4-reveal-right ls4-visible">
            <div className="ls4-section-label">{copy.about_label}</div>
            <h2 className="ls4-section-title">{copy.about_heading}</h2>
            <p className="ls4-about-p">{d.description}</p>
            <div className="ls4-about-bullets">
              {aboutBullets.map((b, i) => (
                <div key={i} className="ls4-about-bullet">
                  <div className="ls4-about-bullet-icon"><Check /></div>
                  <div className="ls4-about-bullet-text"><strong>{b.title}</strong><span>{b.desc}</span></div>
                </div>
              ))}
            </div>
            <a href="#packages" className="ls4-btn ls4-btn-primary">{copy.about_cta} →</a>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section id="process" className="ls4-process">
        <div className="ls4-process-wrap">
          <div className="ls4-center ls4-reveal ls4-visible">
            <div className="ls4-section-label">Simple Process</div>
            <h2 className="ls4-section-title">Up and Running in 4 Easy Steps</h2>
            <p className="ls4-section-sub">We make it effortless from the first call to a lawn you&apos;re proud of.</p>
          </div>
          <div className="ls4-process-steps">
            {PROCESS_STEPS.map((step, i) => (
              <div key={i} className="ls4-process-step">
                <div className="ls4-process-num">{String(i + 1).padStart(2, '0')}</div>
                <div className="ls4-process-step-title">{step.title}</div>
                <div className="ls4-process-step-desc">{step.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section id="gallery" className="ls4-gallery">
        <div className="ls4-gallery-wrap">
          <div className="ls4-center ls4-reveal ls4-visible">
            <div className="ls4-section-label">{copy.gallery_label}</div>
            <h2 className="ls4-section-title">{copy.gallery_heading}</h2>
            <p className="ls4-section-sub">{copy.gallery_subheading}</p>
          </div>
          <div className="ls4-gallery-grid">
            {Array.from({ length: 6 }, (_, i) => gallery[i] ?? { imageUrl: '', label: `Project ${i + 1}`, type: 'general' as const }).map((g, i) => (
              <div key={i} className={`ls4-gallery-item ${i === 0 || i === 3 ? 'ls4-gallery-item-wide' : ''}`}>
                <div
                  className={`ls4-gallery-bg ${GALLERY_GRADIENTS[i % 6]}`}
                  style={g.imageUrl ? { backgroundImage: `url(${g.imageUrl})`, backgroundSize: 'cover' } : undefined}
                />
                <div className="ls4-gallery-overlay">
                  <h4>{g.label || 'Project'}</h4>
                  <span>{d.city}</span>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 36 }}>
            <a href="#cta-banner" className="ls4-btn ls4-btn-outline">{copy.gallery_cta}</a>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="ls4-testimonials">
        <div className="ls4-testimonials-wrap">
          <div className="ls4-center ls4-reveal ls4-visible">
            <div className="ls4-section-label">{copy.testimonials_label}</div>
            <h2 className="ls4-section-title">What Our Clients Say</h2>
            <p className="ls4-section-sub">We let the results speak for themselves.</p>
          </div>
          <div className="ls4-testimonials-grid">
            {(testimonials.length ? testimonials : [{ name: 'Client', text: 'Professional and reliable. Highly recommend.', rating: 5, context: d.city }]).slice(0, 3).map((t, i) => {
              const name = t?.name ?? 'Client';
              const text = t?.text ?? '';
              return (
                <div key={i} className="ls4-testimonial-card">
                  <div className="ls4-testimonial-quote">&quot;</div>
                  <div className="ls4-testimonial-stars">
                    {Array.from({ length: Math.min(5, t?.rating ?? 5) }).map((_, j) => <span key={j} className="ls4-star">★</span>)}
                  </div>
                  <p className="ls4-testimonial-text">{text}</p>
                  <div className="ls4-testimonial-author">
                    <div className="ls4-testimonial-avatar">{name.charAt(0)}</div>
                    <div><strong>{name}</strong><span>{t?.context ?? d.city}</span></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* PACKAGES (first 3 services as cards) */}
      <section id="packages" className="ls4-packages">
        <div className="ls4-packages-wrap">
          <div className="ls4-center ls4-reveal ls4-visible">
            <div className="ls4-section-label">Pricing</div>
            <h2 className="ls4-section-title">Simple, Transparent Packages</h2>
            <p className="ls4-section-sub">Pick a plan that fits your yard and your budget.</p>
          </div>
          <div className="ls4-packages-grid">
            {services.slice(0, 3).map((s, i) => (
              <div key={i} className={`ls4-package-card ${i === 1 ? 'ls4-package-featured' : ''}`}>
                {i === 1 && <div className="ls4-package-badge">Most Popular</div>}
                <div className="ls4-package-name">{s.name}</div>
                <div className="ls4-package-price">{s.price || '—'}</div>
                <div className="ls4-package-period">{s.duration || 'per visit'}</div>
                <div className="ls4-package-divider" />
                <ul className="ls4-package-features">
                  {s.features?.slice(0, 6).map((f, j) => (
                    <li key={j} className="ls4-package-feat-item"><Check />{f}</li>
                  ))}
                </ul>
                <a href={bookingUrl} className={`ls4-btn ${i === 1 ? 'ls4-btn-lime' : 'ls4-btn-outline'}`} style={{ width: '100%', justifyContent: 'center' }}>{copy.services_item_cta}</a>
              </div>
            ))}
          </div>
          <p className="ls4-packages-note">All packages include a free initial assessment. <a href="#hero">Get a custom quote →</a></p>
        </div>
      </section>

      {/* TEAM */}
      <section id="team" className="ls4-team">
        <div className="ls4-team-wrap">
          <div className="ls4-center ls4-reveal ls4-visible">
            <div className="ls4-section-label">{copy.team_label}</div>
            <h2 className="ls4-section-title">{copy.team_heading}</h2>
            <p className="ls4-section-sub">Our crew brings professionalism and local knowledge to every yard.</p>
          </div>
          <div className="ls4-team-grid">
            {PLACEHOLDER_TEAM.map((t, i) => (
              <div key={i} className="ls4-team-card">
                <div className="ls4-team-photo"><div className={`ls4-team-photo-bg ${t.color}`} /></div>
                <div className="ls4-team-info">
                  <div className="ls4-team-name">{t.name}</div>
                  <div className="ls4-team-role">{t.role}</div>
                  <div className="ls4-team-bio">{t.bio}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="ls4-faq">
        <div className="ls4-faq-wrap">
          <div className="ls4-center ls4-reveal ls4-visible">
            <div className="ls4-section-label">{copy.faq_label}</div>
            <h2 className="ls4-section-title">{copy.faq_heading}</h2>
            <p className="ls4-section-sub">Browse our most common questions below or call us directly.</p>
          </div>
          <div className="ls4-faq-list">
            {faq.map((f, i) => (
              <div key={i} className={`ls4-faq-item ${faqOpen === i ? 'ls4-faq-open' : ''}`}>
                <button type="button" className="ls4-faq-q" onClick={() => setFaqOpen(faqOpen === i ? null : i)}>
                  {f.q}
                  <span className="ls4-faq-icon"><Plus /></span>
                </button>
                <div className="ls4-faq-a">{f.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICE AREAS */}
      <section id="areas" className="ls4-areas">
        <div className="ls4-areas-wrap">
          <div className="ls4-areas-header">
            <div>
              <div className="ls4-section-label">Where We Serve</div>
              <h2 className="ls4-section-title">Serving {d.city} & Surrounding Areas</h2>
            </div>
            <p className="ls4-section-sub" style={{ maxWidth: 380 }}>Not sure if we cover your area? Give us a call.</p>
          </div>
          <div className="ls4-areas-grid">
            {serviceAreas.map((area, i) => (
              <div key={i} className="ls4-area-tag"><Pin />{area}</div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section id="cta-banner" className="ls4-cta-banner">
        <span className="ls4-cta-leaf" style={{ top: '10%', left: '8%' }} aria-hidden>🌿</span>
        <span className="ls4-cta-leaf" style={{ bottom: '10%', right: '8%' }} aria-hidden>🍃</span>
        <div className="ls4-cta-content ls4-reveal ls4-visible">
          <div className="ls4-cta-label">{copy.cta_label}</div>
          <h2 className="ls4-cta-title">{copy.cta_heading}</h2>
          <p className="ls4-cta-sub">{copy.cta_subheading}</p>
          <div className="ls4-cta-actions">
            <a href="#hero" className="ls4-btn ls4-btn-white"><Star />{copy.cta_primary}</a>
            {d.phone && <a href={phone} className="ls4-btn ls4-btn-outline-w"><Phone />Call Now</a>}
          </div>
          {d.phone && (
            <p className="ls4-cta-phone">Talk to a real person: <a href={phone}>{d.phone}</a></p>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="ls4-footer">
        <div className="ls4-footer-grid">
          <div>
            <div className="ls4-footer-logo">{d.name}</div>
            <p className="ls4-footer-desc">{d.description || `Premium lawn care and landscaping in ${d.city}.`}</p>
          </div>
          <div className="ls4-footer-col">
            <h4>Services</h4>
            <ul>{services.slice(0, 6).map((s, i) => <li key={i}><a href="#services">{s.name}</a></li>)}</ul>
          </div>
          <div className="ls4-footer-col">
            <h4>Contact</h4>
            <ul>
              {d.phone && <li><a href={phone}>{d.phone}</a></li>}
              {d.email && <li><a href={`mailto:${d.email}`}>{d.email}</a></li>}
              {d.address && <li><a href="#">{d.address}</a></li>}
              <li className="ls4-footer-hours">{hoursStr}</li>
            </ul>
          </div>
        </div>
        <div className="ls4-footer-bottom">
          <span>© {new Date().getFullYear()} {d.name}. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}

// ─── CSS (scoped with .ls4-*) ─────────────────────────────────────────────
const LS4_STYLES = `
  .ls4-root { font-family: 'Inter', system-ui, sans-serif; color: #1a2e10; background: #fff; overflow-x: hidden; container-type: inline-size; }
  .ls4-root * { box-sizing: border-box; }
  .ls4-root a { text-decoration: none; color: inherit; }
  .ls4-root ul { list-style: none; margin: 0; padding: 0; }

  .ls4-reveal { opacity: 0; transform: translateY(40px); transition: opacity .7s ease, transform .7s ease; }
  .ls4-reveal.ls4-visible { opacity: 1; transform: none; }
  .ls4-reveal-left { opacity: 0; transform: translateX(-50px); transition: opacity .7s ease, transform .7s ease; }
  .ls4-reveal-right { opacity: 0; transform: translateX(50px); transition: opacity .7s ease, transform .7s ease; }
  .ls4-reveal-left.ls4-visible, .ls4-reveal-right.ls4-visible { opacity: 1; transform: none; }

  @keyframes ls4-float { 0% { transform: translateY(0) rotate(0deg); opacity: .7; } 50% { transform: translateY(-60px) rotate(15deg); opacity: .5; } 100% { transform: translateY(-130px) rotate(-10deg); opacity: 0; } }
  @keyframes ls4-sway { 0%, 100% { transform: rotate(-6deg); } 50% { transform: rotate(6deg); } }
  @keyframes ls4-sway2 { 0%, 100% { transform: rotate(5deg); } 50% { transform: rotate(-8deg); } }
  @keyframes ls4-ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
  @keyframes ls4-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  @keyframes ls4-bird { 0% { transform: translate(0,0) scaleX(1); } 45% { transform: translate(200px,-30px) scaleX(1); } 50% { transform: translate(210px,-32px) scaleX(-1); } 95% { transform: translate(10px,-2px) scaleX(-1); } 100% { transform: translate(0,0) scaleX(1); } }
  @keyframes ls4-pulse { 0% { box-shadow: 0 0 0 0 rgba(45,122,27,.4); } 70% { box-shadow: 0 0 0 16px rgba(45,122,27,0); } 100% { box-shadow: 0 0 0 0 rgba(45,122,27,0); } }

  .ls4-section-label { display: inline-flex; align-items: center; gap: 6px; background: #e8f5e3; color: #2d7a1b; font-size: .75rem; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; padding: 5px 14px; border-radius: 999px; margin-bottom: 14px; }
  .ls4-section-title { font-family: 'Playfair Display', Georgia, serif; font-size: clamp(1.9rem, 4vw, 3rem); font-weight: 900; color: #1a2e10; line-height: 1.15; margin-bottom: .5rem; }
  .ls4-section-sub { font-size: 1.05rem; color: #5a6b50; max-width: 540px; line-height: 1.7; }
  .ls4-center { text-align: center; display: flex; flex-direction: column; align-items: center; }

  .ls4-btn { display: inline-flex; align-items: center; gap: 8px; padding: 14px 28px; border-radius: 999px; font-size: 1rem; font-weight: 600; cursor: pointer; border: none; transition: all .25s ease; }
  .ls4-btn-primary { background: #2d7a1b; color: #fff; box-shadow: 0 4px 16px rgba(45,122,27,.35); }
  .ls4-btn-primary:hover { background: #1e5c11; transform: translateY(-2px); }
  .ls4-btn-outline { background: transparent; color: #2d7a1b; border: 2px solid #2d7a1b; }
  .ls4-btn-outline:hover { background: #2d7a1b; color: #fff; transform: translateY(-2px); }
  .ls4-btn-white { background: #fff; color: #2d7a1b; box-shadow: 0 4px 20px rgba(0,0,0,.12); }
  .ls4-btn-white:hover { background: #e8f5e3; transform: translateY(-2px); }
  .ls4-btn-outline-w { background: transparent; color: #fff; border: 2px solid rgba(255,255,255,.5); }
  .ls4-btn-outline-w:hover { background: #fff; color: #2d7a1b; transform: translateY(-2px); }
  .ls4-btn-lime { background: #8bc34a; color: #1a2e10; }
  .ls4-btn-lime:hover { background: #2d7a1b; color: #fff; transform: translateY(-2px); }

  .ls4-fab { position: fixed; bottom: 30px; right: 30px; z-index: 500; width: 58px; height: 58px; border-radius: 50%; background: #2d7a1b; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 20px rgba(45,122,27,.45); animation: ls4-pulse 2.4s infinite; }
  .ls4-fab:hover { transform: scale(1.1); background: #1e5c11; }

  .ls4-nav { position: fixed; top: 0; left: 0; right: 0; z-index: 1000; padding: 18px 32px; display: flex; align-items: center; justify-content: space-between; transition: all .35s ease; }
  .ls4-nav-scrolled { background: #fff; box-shadow: 0 2px 16px rgba(0,0,0,.08); padding: 12px 32px; }
  .ls4-logo { display: flex; align-items: center; gap: 10px; font-family: 'Playfair Display', Georgia, serif; font-weight: 700; font-size: 1.3rem; color: #fff; transition: color .35s; }
  .ls4-nav-scrolled .ls4-logo { color: #1a2e10; }
  .ls4-logo-svg { width: 34px; height: 34px; border-radius: 50%; background: rgba(255,255,255,.2); }
  .ls4-nav-scrolled .ls4-logo-svg { background: #e8f5e3; }
  .ls4-nav-links { display: flex; align-items: center; gap: 28px; }
  .ls4-nav-links a { font-size: .9rem; font-weight: 500; color: rgba(255,255,255,.9); transition: color .25s; }
  .ls4-nav-scrolled .ls4-nav-links a { color: #5a6b50; }
  .ls4-nav-links a:hover { color: #8bc34a; }
  .ls4-nav-scrolled .ls4-nav-links a:hover { color: #2d7a1b; }
  .ls4-nav-cta { display: flex; align-items: center; gap: 12px; }
  .ls4-nav-cta a { font-size: .9rem; font-weight: 600; color: rgba(255,255,255,.9); }
  .ls4-nav-scrolled .ls4-nav-cta a { color: #5a6b50; }
  .ls4-nav-cta-btn { padding: 9px 22px; background: #8bc34a; color: #1a2e10; font-size: .88rem; font-weight: 700; border-radius: 999px; transition: all .25s; }
  .ls4-nav-cta-btn:hover { background: #2d7a1b; color: #fff; transform: scale(1.05); }
  /* ── Hamburger button (hidden on desktop) ── */
  .ls4-hamburger { display: none; flex-direction: column; justify-content: center; align-items: center; gap: 5px; width: 42px; height: 42px; background: rgba(255,255,255,.15); border: 1.5px solid rgba(255,255,255,.3); border-radius: 10px; cursor: pointer; padding: 0; transition: all .25s; flex-shrink: 0; }
  .ls4-nav-scrolled .ls4-hamburger { background: #e8f5e3; border-color: #c8e6b8; }
  .ls4-hamburger span { display: block; width: 20px; height: 2px; background: #fff; border-radius: 2px; transition: all .3s ease; transform-origin: center; }
  .ls4-nav-scrolled .ls4-hamburger span { background: #1a2e10; }
  .ls4-hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
  .ls4-hamburger.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
  .ls4-hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

  /* ── Mobile dropdown menu ── */
  .ls4-mob-menu { position: fixed; top: 64px; left: 0; right: 0; z-index: 999; background: #fff; box-shadow: 0 8px 32px rgba(0,0,0,.14); padding: 16px 20px 24px; display: flex; flex-direction: column; gap: 4px; border-top: 3px solid #8bc34a; animation: ls4-mob-slide-in .2s ease; }
  @keyframes ls4-mob-slide-in { from { opacity: 0; transform: translateY(-12px); } to { opacity: 1; transform: none; } }
  .ls4-mob-menu a { display: block; padding: 13px 16px; font-size: 1rem; font-weight: 600; color: #1a2e10; border-radius: 10px; transition: background .2s, color .2s; }
  .ls4-mob-menu a:hover { background: #e8f5e3; color: #2d7a1b; }
  .ls4-mob-cta-btn { background: #2d7a1b !important; color: #fff !important; text-align: center; margin-top: 10px; border-radius: 999px !important; padding: 14px 16px !important; }
  .ls4-mob-cta-btn:hover { background: #1e5c11 !important; }

  /* ── Mobile nav breakpoint ── */
  @container (max-width: 768px) {
    .ls4-nav-links { display: none; }
    .ls4-nav-cta { display: none; }
    .ls4-hamburger { display: flex; }
    .ls4-nav { padding: 14px 20px; }
    .ls4-nav-scrolled { padding: 10px 20px; }
  }

  .ls4-hero { position: relative; min-height: 100vh; background: linear-gradient(170deg, #1b4d0b 0%, #2d7a1b 40%, #4caf50 75%, #8bc34a 100%); overflow: hidden; display: flex; align-items: center; }
  .ls4-hero-sky { position: absolute; inset: 0; background: linear-gradient(180deg, #b8e4f9 0%, #d4edda 45%, transparent 100%); opacity: .18; }
  .ls4-particles { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }
  .ls4-particle { position: absolute; bottom: 20%; animation: ls4-float linear infinite; }
  .ls4-hero-bird { position: absolute; top: 18%; left: 12%; width: 28px; height: 14px; background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 28 14'%3E%3Cpath d='M14 7 Q8 0 0 3' stroke='rgba(255,255,255,.7)' stroke-width='2' fill='none'/%3E%3Cpath d='M14 7 Q20 0 28 3' stroke='rgba(255,255,255,.7)' stroke-width='2' fill='none'/%3E%3C/svg%3E") no-repeat; animation: ls4-bird 14s ease-in-out infinite; }
  .ls4-hero-grass { position: absolute; bottom: 0; left: 0; right: 0; height: 180px; overflow: hidden; }
  .ls4-blade { position: absolute; bottom: 0; border-radius: 50% 50% 0 0; transform-origin: bottom center; }
  .ls4-blade:nth-child(odd) { animation: ls4-sway 2.4s ease-in-out infinite; }
  .ls4-blade:nth-child(even) { animation: ls4-sway2 3.1s ease-in-out infinite; }
  .ls4-hero-hills { position: absolute; bottom: 0; left: 0; right: 0; width: 100%; height: 180px; }
  .ls4-hero-content { position: relative; z-index: 10; max-width: 1200px; margin: 0 auto; padding: 120px 32px 180px; display: grid; grid-template-columns: 1fr 1fr; align-items: center; gap: 60px; }
  .ls4-hero-badge { display: inline-flex; align-items: center; gap: 8px; background: rgba(255,255,255,.18); backdrop-filter: blur(8px); color: #fff; font-size: .8rem; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; padding: 6px 16px; border-radius: 999px; margin-bottom: 20px; border: 1px solid rgba(255,255,255,.3); }
  .ls4-hero-title { font-family: 'Playfair Display', Georgia, serif; font-size: clamp(2.6rem, 5.5vw, 4.2rem); font-weight: 900; color: #fff; line-height: 1.1; margin-bottom: 20px; }
  .ls4-hero-title em { font-style: italic; color: #8bc34a; }
  .ls4-hero-subtitle { font-size: 1.1rem; color: rgba(255,255,255,.85); line-height: 1.7; margin-bottom: 36px; max-width: 460px; }
  .ls4-hero-actions { display: flex; gap: 14px; flex-wrap: wrap; }
  .ls4-hero-trust { margin-top: 40px; display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
  .ls4-hero-trust-item { display: flex; align-items: center; gap: 6px; font-size: .82rem; font-weight: 600; color: rgba(255,255,255,.9); }
  .ls4-hero-trust-item svg { color: #8bc34a; }
  .ls4-hero-card { background: rgba(255,255,255,.95); backdrop-filter: blur(12px); border-radius: 20px; padding: 32px; box-shadow: 0 12px 48px rgba(45,122,27,.18); }
  .ls4-hero-card-title { font-family: 'Playfair Display', Georgia, serif; font-size: 1.4rem; font-weight: 700; color: #1a2e10; margin-bottom: 20px; }
  .ls4-hero-card-field { margin-bottom: 14px; }
  .ls4-hero-card-field label { display: block; font-size: .78rem; font-weight: 600; color: #5a6b50; margin-bottom: 5px; text-transform: uppercase; letter-spacing: .06em; }
  .ls4-hero-card-field input { width: 100%; padding: 11px 14px; border: 1.5px solid #e0e8d8; border-radius: 10px; font-size: .95rem; background: #fff; color: #1a2e10; }
  .ls4-hero-card-btn { width: 100%; padding: 13px; background: #2d7a1b; color: #fff; font-size: 1rem; font-weight: 700; border: none; border-radius: 999px; cursor: pointer; transition: all .25s; margin-top: 6px; display: block; text-align: center; }
  .ls4-hero-card-btn:hover { background: #1e5c11; transform: translateY(-2px); }
  .ls4-hero-card-note { text-align: center; font-size: .75rem; color: #5a6b50; margin-top: 10px; }
  @container (max-width: 900px) {
    .ls4-hero-content { grid-template-columns: 1fr; padding: 110px 32px 160px; gap: 40px; }
    .ls4-hero-card { max-width: 480px; }
  }
  @container (max-width: 600px) {
    .ls4-hero-content { padding: 100px 20px 180px; gap: 32px; }
    .ls4-hero-title { font-size: clamp(2rem, 9vw, 2.8rem); }
    .ls4-hero-subtitle { font-size: .97rem; margin-bottom: 28px; }
    .ls4-hero-actions { flex-direction: column; align-items: flex-start; gap: 10px; }
    .ls4-hero-actions .ls4-btn { width: 100%; justify-content: center; }
    .ls4-hero-trust { gap: 10px; }
    .ls4-hero-card { padding: 24px 18px; border-radius: 16px; }
    .ls4-hero-card-title { font-size: 1.15rem; }
    .ls4-hero-badge { font-size: .72rem; padding: 5px 12px; }
  }

  .ls4-ticker-strip { background: #2d7a1b; color: #fff; padding: 12px 0; overflow: hidden; }
  .ls4-ticker-inner { display: flex; width: max-content; animation: ls4-ticker 28s linear infinite; }
  .ls4-ticker-item { white-space: nowrap; padding: 0 40px; font-size: .88rem; font-weight: 600; display: flex; align-items: center; gap: 12px; }
  .ls4-ticker-dot { width: 6px; height: 6px; background: #8bc34a; border-radius: 50%; }

  .ls4-services { padding: 100px 32px; background: #fafaf7; }
  .ls4-services-wrap { max-width: 1200px; margin: 0 auto; }
  .ls4-services-header { display: flex; justify-content: space-between; align-items: flex-end; gap: 30px; flex-wrap: wrap; margin-bottom: 60px; }
  .ls4-services-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 28px; }
  .ls4-service-card { background: #fff; border-radius: 14px; padding: 32px; box-shadow: 0 2px 12px rgba(0,0,0,.06); border: 1.5px solid transparent; transition: all .3s ease; position: relative; overflow: hidden; }
  .ls4-service-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 4px; background: #2d7a1b; transform: scaleX(0); transform-origin: left; transition: transform .35s; }
  .ls4-service-card:hover { transform: translateY(-8px); box-shadow: 0 12px 48px rgba(45,122,27,.18); border-color: #e8f5e3; }
  .ls4-service-card:hover::before { transform: scaleX(1); }
  .ls4-service-icon { width: 56px; height: 56px; border-radius: 16px; background: #e8f5e3; display: flex; align-items: center; justify-content: center; margin-bottom: 20px; transition: all .3s; }
  .ls4-service-card:hover .ls4-service-icon { background: #2d7a1b; }
  .ls4-service-icon-inner { width: 26px; height: 26px; border-radius: 4px; background: #2d7a1b; transition: background .3s; }
  .ls4-service-card:hover .ls4-service-icon-inner { background: #fff; }
  .ls4-service-name { font-family: 'Playfair Display', Georgia, serif; font-size: 1.2rem; font-weight: 700; color: #1a2e10; margin-bottom: 8px; }
  .ls4-service-desc { font-size: .9rem; color: #5a6b50; line-height: 1.6; margin-bottom: 16px; }
  .ls4-service-price-tag { display: inline-flex; background: #e8f5e3; color: #2d7a1b; font-size: .85rem; font-weight: 700; padding: 5px 12px; border-radius: 999px; }
  .ls4-service-features { margin-top: 16px; border-top: 1px solid #f0f0f0; padding-top: 16px; display: flex; flex-direction: column; gap: 6px; }
  .ls4-service-features li { display: flex; align-items: center; gap: 8px; font-size: .83rem; color: #5a6b50; }
  .ls4-service-features li svg { color: #8bc34a; flex-shrink: 0; }
  @container (max-width: 900px) { .ls4-services-grid { grid-template-columns: 1fr 1fr; } }
  @container (max-width: 600px) { .ls4-services-grid { grid-template-columns: 1fr; } }

  .ls4-stats { padding: 80px 32px; background: linear-gradient(135deg, #1b4d0b 0%, #2d7a1b 50%, #3a8a22 100%); position: relative; overflow: hidden; }
  .ls4-stats::before { content: ''; position: absolute; inset: 0; background-image: radial-gradient(rgba(255,255,255,.06) 1px, transparent 1px); background-size: 28px 28px; }
  .ls4-stats-leaf { position: absolute; font-size: 6rem; opacity: .06; animation: ls4-spin 20s linear infinite; }
  .ls4-stats-wrap { max-width: 1100px; margin: 0 auto; position: relative; z-index: 1; }
  .ls4-stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 40px; }
  .ls4-stat-item { text-align: center; }
  .ls4-stat-num { font-family: 'Playfair Display', Georgia, serif; font-size: clamp(2.6rem, 5vw, 4.2rem); font-weight: 900; color: #fff; line-height: 1; }
  .ls4-stat-suffix { color: #8bc34a; }
  .ls4-stat-label { font-size: .9rem; color: rgba(255,255,255,.7); margin-top: 6px; }
  .ls4-stat-divider { width: 30px; height: 2px; background: #8bc34a; margin: 10px auto 0; border-radius: 2px; }
  @container (max-width: 700px) { .ls4-stats-grid { grid-template-columns: repeat(2, 1fr); } }

  .ls4-about { padding: 100px 32px; background: #fff; }
  .ls4-about-wrap { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }
  .ls4-about-img-main { width: 100%; border-radius: 20px; aspect-ratio: 4/5; background: linear-gradient(135deg, #b8e4a2 0%, #5cb85c 50%, #2d7a1b 100%); box-shadow: 0 12px 48px rgba(45,122,27,.18); }
  .ls4-about-img-secondary { position: absolute; bottom: -30px; right: -30px; width: 52%; border-radius: 16px; aspect-ratio: 1; background: linear-gradient(135deg, #e8f5e3 0%, #a8d5a2 100%); box-shadow: 0 4px 24px rgba(45,122,27,.12); border: 4px solid #fff; }
  .ls4-about-image-stack { position: relative; }
  .ls4-about-badge-float { position: absolute; top: 20px; left: -20px; background: #fff; border-radius: 14px; padding: 14px 18px; box-shadow: 0 4px 24px rgba(45,122,27,.12); display: flex; align-items: center; gap: 12px; }
  .ls4-about-badge-icon { width: 40px; height: 40px; border-radius: 10px; background: #e8f5e3; display: flex; align-items: center; justify-content: center; color: #2d7a1b; }
  .ls4-about-badge-float strong { font-size: 1.1rem; font-weight: 800; color: #1a2e10; display: block; }
  .ls4-about-badge-float span { font-size: .75rem; color: #5a6b50; }
  .ls4-about-p { color: #5a6b50; line-height: 1.75; margin-top: 14px; }
  .ls4-about-bullets { margin: 28px 0; display: flex; flex-direction: column; gap: 12px; }
  .ls4-about-bullet { display: flex; align-items: flex-start; gap: 12px; padding: 14px 16px; border-radius: 12px; background: #e8f5e3; transition: background .25s, transform .25s; }
  .ls4-about-bullet:hover { background: #d4edda; transform: translateX(4px); }
  .ls4-about-bullet-icon { width: 32px; height: 32px; border-radius: 8px; background: #2d7a1b; flex-shrink: 0; display: flex; align-items: center; justify-content: center; color: #fff; }
  .ls4-about-bullet-text strong { font-size: .95rem; font-weight: 600; color: #1a2e10; display: block; margin-bottom: 2px; }
  .ls4-about-bullet-text span { font-size: .82rem; color: #5a6b50; }
  @container (max-width: 900px) { .ls4-about-wrap { grid-template-columns: 1fr; } .ls4-about-img-secondary { right: -10px; bottom: -10px; } }

  .ls4-process { padding: 100px 32px; background: #f5f0e8; }
  .ls4-process-wrap { max-width: 1100px; margin: 0 auto; }
  .ls4-process-steps { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0; margin-top: 60px; position: relative; }
  .ls4-process-steps::before { content: ''; position: absolute; top: 40px; left: 10%; right: 10%; height: 2px; background: linear-gradient(to right, #2d7a1b, #8bc34a); z-index: 0; }
  .ls4-process-step { text-align: center; position: relative; z-index: 1; padding: 0 12px; }
  .ls4-process-num { width: 80px; height: 80px; border-radius: 50%; background: #fff; border: 3px solid #2d7a1b; display: flex; align-items: center; justify-content: center; font-family: 'Playfair Display', Georgia, serif; font-size: 1.6rem; font-weight: 900; color: #2d7a1b; margin: 0 auto 20px; transition: all .35s; box-shadow: 0 4px 16px rgba(45,122,27,.18); }
  .ls4-process-step:hover .ls4-process-num { background: #2d7a1b; color: #fff; transform: scale(1.1); }
  .ls4-process-step-title { font-weight: 700; font-size: 1rem; color: #1a2e10; margin-bottom: 8px; }
  .ls4-process-step-desc { font-size: .85rem; color: #5a6b50; line-height: 1.6; }
  @container (max-width: 700px) { .ls4-process-steps { grid-template-columns: 1fr 1fr; gap: 30px; } .ls4-process-steps::before { display: none; } }
  @container (max-width: 480px) { .ls4-process-steps { grid-template-columns: 1fr; } }

  .ls4-gallery { padding: 100px 32px; background: #fff; }
  .ls4-gallery-wrap { max-width: 1200px; margin: 0 auto; }
  .ls4-gallery-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 50px; }
  .ls4-gallery-item { border-radius: 16px; overflow: hidden; position: relative; cursor: pointer; aspect-ratio: 4/3; }
  .ls4-gallery-item-wide { grid-column: span 2; aspect-ratio: 16/7; }
  .ls4-gallery-bg { width: 100%; height: 100%; transition: transform .5s ease; }
  .ls4-gallery-item:hover .ls4-gallery-bg { transform: scale(1.07); }
  .ls4-gallery-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(30,80,10,.75) 0%, transparent 60%); display: flex; flex-direction: column; justify-content: flex-end; padding: 20px; opacity: 0; transition: opacity .35s; }
  .ls4-gallery-item:hover .ls4-gallery-overlay { opacity: 1; }
  .ls4-gallery-overlay h4 { color: #fff; font-size: 1rem; font-weight: 700; margin-bottom: 4px; }
  .ls4-gallery-overlay span { color: rgba(255,255,255,.8); font-size: .8rem; }
  .ls4-g-color-1 { background: linear-gradient(135deg,#c8e6c9,#66bb6a); }
  .ls4-g-color-2 { background: linear-gradient(135deg,#e8f5e9,#81c784); }
  .ls4-g-color-3 { background: linear-gradient(135deg,#dcedc8,#aed581); }
  .ls4-g-color-4 { background: linear-gradient(135deg,#f0f4c3,#d4e157); }
  .ls4-g-color-5 { background: linear-gradient(135deg,#ffe082,#ffb300); }
  .ls4-g-color-6 { background: linear-gradient(135deg,#b2dfdb,#4db6ac); }
  @container (max-width: 700px) { .ls4-gallery-grid { grid-template-columns: 1fr 1fr; } .ls4-gallery-item-wide { grid-column: span 2; } }
  @container (max-width: 480px) { .ls4-gallery-grid { grid-template-columns: 1fr; } .ls4-gallery-item-wide { grid-column: span 1; } }

  .ls4-testimonials { padding: 100px 32px; background: #e8f5e3; }
  .ls4-testimonials-wrap { max-width: 1200px; margin: 0 auto; }
  .ls4-testimonials-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 28px; margin-top: 50px; }
  .ls4-testimonial-card { background: #fff; border-radius: 14px; padding: 32px; box-shadow: 0 2px 12px rgba(0,0,0,.06); transition: transform .3s, box-shadow .3s; }
  .ls4-testimonial-card:hover { transform: translateY(-6px); box-shadow: 0 12px 48px rgba(45,122,27,.18); }
  .ls4-testimonial-quote { font-size: 3rem; line-height: 1; color: #a8d5a2; font-family: 'Playfair Display', Georgia, serif; font-weight: 900; margin-bottom: 14px; }
  .ls4-testimonial-stars { display: flex; gap: 3px; margin-bottom: 16px; }
  .ls4-star { color: #e6a817; font-size: 1rem; }
  .ls4-testimonial-text { font-size: .95rem; color: #5a6b50; line-height: 1.75; margin-bottom: 22px; font-style: italic; }
  .ls4-testimonial-author { display: flex; align-items: center; gap: 12px; }
  .ls4-testimonial-avatar { width: 44px; height: 44px; border-radius: 50%; background: linear-gradient(135deg, #e8f5e3, #a8d5a2); display: flex; align-items: center; justify-content: center; font-family: 'Playfair Display', Georgia, serif; font-weight: 700; font-size: 1.1rem; color: #2d7a1b; flex-shrink: 0; }
  .ls4-testimonial-author strong { font-size: .9rem; font-weight: 700; color: #1a2e10; display: block; }
  .ls4-testimonial-author span { font-size: .78rem; color: #5a6b50; }
  @container (max-width: 900px) { .ls4-testimonials-grid { grid-template-columns: 1fr 1fr; } }
  @container (max-width: 600px) { .ls4-testimonials-grid { grid-template-columns: 1fr; } }

  .ls4-packages { padding: 100px 32px; background: #fff; }
  .ls4-packages-wrap { max-width: 1100px; margin: 0 auto; }
  .ls4-packages-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 28px; margin-top: 50px; }
  .ls4-package-card { border-radius: 14px; padding: 36px 30px; border: 2px solid #e8eee4; position: relative; transition: all .3s; text-align: center; }
  .ls4-package-card:hover { border-color: #2d7a1b; transform: translateY(-6px); box-shadow: 0 12px 48px rgba(45,122,27,.18); }
  .ls4-package-featured { border-color: #2d7a1b; background: #1a2e10; color: #fff; transform: scale(1.04); }
  .ls4-package-badge { position: absolute; top: -14px; left: 50%; transform: translateX(-50%); background: #8bc34a; color: #1a2e10; font-size: .75rem; font-weight: 800; padding: 4px 16px; border-radius: 999px; letter-spacing: .06em; text-transform: uppercase; }
  .ls4-package-name { font-size: .82rem; font-weight: 700; text-transform: uppercase; letter-spacing: .1em; color: #5a6b50; margin-bottom: 12px; }
  .ls4-package-featured .ls4-package-name { color: rgba(255,255,255,.65); }
  .ls4-package-price { font-family: 'Playfair Display', Georgia, serif; font-size: 3rem; font-weight: 900; color: #1a2e10; line-height: 1; }
  .ls4-package-featured .ls4-package-price { color: #fff; }
  .ls4-package-period { font-size: .85rem; color: #5a6b50; margin-bottom: 24px; }
  .ls4-package-featured .ls4-package-period { color: rgba(255,255,255,.6); }
  .ls4-package-divider { height: 1px; background: #e8eee4; margin: 24px 0; }
  .ls4-package-featured .ls4-package-divider { background: rgba(255,255,255,.15); }
  .ls4-package-features { text-align: left; margin-bottom: 30px; display: flex; flex-direction: column; gap: 10px; list-style: none; padding: 0; }
  .ls4-package-feat-item { display: flex; align-items: center; gap: 10px; font-size: .88rem; color: #5a6b50; }
  .ls4-package-featured .ls4-package-feat-item { color: rgba(255,255,255,.8); }
  .ls4-package-feat-item svg { color: #8bc34a; flex-shrink: 0; }
  .ls4-packages-note { text-align: center; color: #5a6b50; font-size: .88rem; margin-top: 24px; }
  .ls4-packages-note a { color: #2d7a1b; font-weight: 600; }
  @container (max-width: 900px) { .ls4-packages-grid { grid-template-columns: 1fr; max-width: 440px; margin-left: auto; margin-right: auto; } .ls4-package-featured { transform: none; } }

  .ls4-team { padding: 100px 32px; background: #fafaf7; }
  .ls4-team-wrap { max-width: 1100px; margin: 0 auto; }
  .ls4-team-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 28px; margin-top: 50px; }
  .ls4-team-card { border-radius: 14px; overflow: hidden; background: #fff; box-shadow: 0 2px 12px rgba(0,0,0,.06); transition: transform .3s, box-shadow .3s; }
  .ls4-team-card:hover { transform: translateY(-6px); box-shadow: 0 12px 48px rgba(45,122,27,.18); }
  .ls4-team-photo { height: 260px; position: relative; overflow: hidden; }
  .ls4-team-photo-bg { width: 100%; height: 100%; transition: transform .5s; }
  .ls4-team-card:hover .ls4-team-photo-bg { transform: scale(1.06); }
  .ls4-tp-1 { background: linear-gradient(135deg, #a8d5a2, #2d7a1b); }
  .ls4-tp-2 { background: linear-gradient(135deg, #ffe082, #e6a817); }
  .ls4-tp-3 { background: linear-gradient(135deg, #b2dfdb, #00897b); }
  .ls4-team-info { padding: 24px; }
  .ls4-team-name { font-family: 'Playfair Display', Georgia, serif; font-size: 1.15rem; font-weight: 700; color: #1a2e10; margin-bottom: 3px; }
  .ls4-team-role { font-size: .82rem; color: #2d7a1b; font-weight: 600; text-transform: uppercase; letter-spacing: .06em; margin-bottom: 10px; }
  .ls4-team-bio { font-size: .85rem; color: #5a6b50; line-height: 1.6; }
  @container (max-width: 900px) { .ls4-team-grid { grid-template-columns: 1fr 1fr; } }
  @container (max-width: 600px) { .ls4-team-grid { grid-template-columns: 1fr; } }

  .ls4-faq { padding: 100px 32px; background: #e8f5e3; }
  .ls4-faq-wrap { max-width: 860px; margin: 0 auto; }
  .ls4-faq-list { margin-top: 50px; display: flex; flex-direction: column; gap: 14px; }
  .ls4-faq-item { background: #fff; border-radius: 14px; overflow: hidden; box-shadow: 0 1px 6px rgba(0,0,0,.05); transition: box-shadow .25s; }
  .ls4-faq-item:hover { box-shadow: 0 4px 16px rgba(45,122,27,.12); }
  .ls4-faq-q { width: 100%; padding: 20px 24px; display: flex; align-items: center; justify-content: space-between; background: none; border: none; cursor: pointer; text-align: left; font-size: 1rem; font-weight: 600; color: #1a2e10; font-family: inherit; gap: 16px; }
  .ls4-faq-icon { width: 28px; height: 28px; border-radius: 50%; background: #e8f5e3; flex-shrink: 0; display: flex; align-items: center; justify-content: center; transition: transform .3s, background .3s; }
  .ls4-faq-open .ls4-faq-icon { transform: rotate(45deg); background: #2d7a1b; color: #fff; }
  .ls4-faq-a { max-height: 0; overflow: hidden; transition: max-height .4s ease, padding .4s ease; padding: 0 24px; font-size: .93rem; color: #5a6b50; line-height: 1.75; }
  .ls4-faq-open .ls4-faq-a { max-height: 300px; padding: 0 24px 20px; }

  .ls4-areas { padding: 80px 32px; background: #fff; }
  .ls4-areas-wrap { max-width: 1100px; margin: 0 auto; }
  .ls4-areas-header { display: flex; align-items: flex-end; justify-content: space-between; flex-wrap: wrap; gap: 20px; margin-bottom: 0; }
  .ls4-areas-grid { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 36px; }
  .ls4-area-tag { display: flex; align-items: center; gap: 7px; padding: 9px 18px; border-radius: 999px; border: 1.5px solid #d4e8cc; background: #fafaf7; font-size: .88rem; font-weight: 500; color: #5a6b50; transition: all .25s; cursor: default; }
  .ls4-area-tag:hover { background: #2d7a1b; border-color: #2d7a1b; color: #fff; transform: scale(1.06); }
  .ls4-area-tag svg { flex-shrink: 0; }

  .ls4-cta-banner { padding: 100px 32px; background: linear-gradient(135deg, #1b4d0b 0%, #2d7a1b 50%, #4caf50 100%); position: relative; overflow: hidden; text-align: center; }
  .ls4-cta-banner::before { content: ''; position: absolute; inset: 0; background-image: radial-gradient(rgba(255,255,255,.06) 1px, transparent 1px); background-size: 24px 24px; }
  .ls4-cta-leaf { position: absolute; font-size: 5rem; opacity: .07; animation: ls4-spin 30s linear infinite; }
  .ls4-cta-content { position: relative; z-index: 1; max-width: 700px; margin: 0 auto; }
  .ls4-cta-label { display: inline-block; background: rgba(255,255,255,.15); color: #fff; font-size: .75rem; font-weight: 700; letter-spacing: .1em; padding: 5px 14px; border-radius: 999px; margin-bottom: 14px; }
  .ls4-cta-title { font-family: 'Playfair Display', Georgia, serif; font-size: clamp(2rem, 4.5vw, 3.4rem); font-weight: 900; color: #fff; margin-bottom: 16px; }
  .ls4-cta-sub { font-size: 1.1rem; color: rgba(255,255,255,.8); margin-bottom: 36px; line-height: 1.7; }
  .ls4-cta-actions { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }
  .ls4-cta-phone { margin-top: 16px; color: rgba(255,255,255,.85); font-size: 1rem; }
  .ls4-cta-phone a { color: #8bc34a; font-weight: 700; font-size: 1.2rem; }

  .ls4-footer { background: #1a2e10; color: rgba(255,255,255,.75); padding: 72px 32px 36px; }
  .ls4-footer-grid { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 48px; }
  .ls4-footer-logo { font-family: 'Playfair Display', Georgia, serif; font-weight: 700; font-size: 1.2rem; color: #fff; margin-bottom: 16px; }
  .ls4-footer-desc { font-size: .88rem; line-height: 1.7; margin-bottom: 22px; }
  .ls4-footer-col h4 { font-size: .82rem; font-weight: 700; text-transform: uppercase; letter-spacing: .1em; color: rgba(255,255,255,.5); margin-bottom: 18px; }
  .ls4-footer-col ul { display: flex; flex-direction: column; gap: 9px; }
  .ls4-footer-col a { font-size: .88rem; color: rgba(255,255,255,.65); transition: color .25s; }
  .ls4-footer-col a:hover { color: #8bc34a; }
  .ls4-footer-hours { color: rgba(255,255,255,.5); font-size: .85rem; }
  .ls4-footer-bottom { max-width: 1200px; margin: 48px auto 0; padding-top: 24px; border-top: 1px solid rgba(255,255,255,.08); font-size: .8rem; color: rgba(255,255,255,.4); }
  @container (max-width: 900px) { .ls4-footer-grid { grid-template-columns: 1fr 1fr; } }
  @container (max-width: 600px) { .ls4-footer-grid { grid-template-columns: 1fr; } }
`;
