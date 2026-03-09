'use client';

import { useEffect, useRef, useState } from 'react';

interface HeroProps { onCTAClick: () => void; }

/* ── Palette ───────────────────────────────────────────────────── */
const C = {
  orange:       '#F97316',
  orangeHov:    '#EA6C0A',
  orangeLight:  '#FFF4ED',
  orangeBorder: '#FED7AA',
  orangeGlow:   'rgba(249,115,22,0.22)',
  dark:         '#0F0F15',
  dark2:        '#18181F',
  dark3:        '#222230',
  darkLine:     'rgba(255,255,255,0.07)',
  bg:           '#FFFFFF',
  bgWarm:       '#FAFAF8',
  bgCream:      '#FFF6F0',
  text:         '#111118',
  text2:        '#4B5563',
  muted:        '#9CA3AF',
  border:       '#E8E8EF',
} as const;

/* ── Data ──────────────────────────────────────────────────────── */
const ROTATING_WORDS = ['Plumber', 'Hair Salon', 'Landscaper', 'Auto Detailer', 'Electrician', 'Restaurant', 'Gym', 'Cleaner'];

const MARQUEE = ['Plumbers', 'Hair Salons', 'Landscapers', 'Auto Detailers', 'Electricians', 'Restaurants', 'Gyms', 'Cleaners', 'Contractors', 'Dentists', 'Cafés', 'Yoga Studios', 'Bakers', 'Pet Groomers', 'Painters', 'Roofers', 'Photographers', 'Tutors'];

const STEPS = [
  { num: '1', icon: 'message',  title: 'Answer 3 questions', desc: 'Your business name, your city, and what you do. Just 3 quick answers. Done in 1 minute.' },
  { num: '2', icon: 'cpu',      title: 'We build your site', desc: 'We write all the words, pick your design, and build every page. You do nothing.' },
  { num: '3', icon: 'globe',    title: 'You go live today',  desc: 'Look it over, change anything you want, then hit publish. Your site is online.' },
];

const FEATURES = [
  { icon: 'smartphone', text: 'Looks great on any phone' },
  { icon: 'search',     text: 'Shows up on Google'       },
  { icon: 'phone-call', text: 'One-tap call button'      },
  { icon: 'star',       text: 'Customer reviews section' },
  { icon: 'clock',      text: 'Hours & location'         },
  { icon: 'list',       text: 'All your services listed' },
  { icon: 'camera',     text: 'Photo gallery built in'   },
  { icon: 'help',       text: 'Q&A section'              },
];

const TESTIMONIALS = [
  { name: 'Marcus L.', role: 'Car Detailer · Atlanta, GA', text: 'I had a real website up in 2 minutes. Customers say it looks amazing. And it was free.', avatar: 'ML' },
  { name: 'Priya K.',  role: 'Hair Salon · Austin, TX',    text: 'It wrote everything for me. I didn\'t type a single word myself. Saved me $800 in fees.', avatar: 'PK' },
  { name: 'Tom B.',    role: 'Plumber · Chicago, IL',      text: 'Three new customers called me in the first week from my website. I paid nothing for it.', avatar: 'TB' },
];

const BUSINESS_TYPES = [
  { icon: 'tool',      label: 'Plumbers'      },
  { icon: 'zap',       label: 'Electricians'  },
  { icon: 'leaf',      label: 'Landscapers'   },
  { icon: 'car',       label: 'Auto Detailers'},
  { icon: 'scissors',  label: 'Hair Salons'   },
  { icon: 'utensils',  label: 'Restaurants'   },
  { icon: 'activity',  label: 'Gyms'          },
  { icon: 'droplet',   label: 'Cleaners'      },
  { icon: 'settings',  label: 'Contractors'   },
  { icon: 'coffee',    label: 'Cafés'         },
  { icon: 'heart',     label: 'Yoga Studios'  },
  { icon: 'smile',     label: 'Dentists'      },
];

const FAQS = [
  { q: 'Is it really free?',                   a: 'Yes. 100% free. No credit card. No hidden fees. Your website goes live on the internet and you pay nothing. Not now. Not ever.' },
  { q: 'How fast is it, really?',              a: 'Most people have a full website ready in under 60 seconds. You answer 3 questions and we do everything else. That\'s it.' },
  { q: 'Can I change it after it\'s built?',   a: 'Yes! You get a simple editor where you can change any word, add your own photos, and update anything. No tech skills needed.' },
  { q: 'What if my job type isn\'t on the list?', a: 'Just pick "Other" and type what you do. Our system works for every type of local business — even ones we\'ve never heard of.' },
];

const TRUST = [
  { icon: 'lock',        text: 'No sign up required' },
  { icon: 'credit-card', text: 'No credit card ever'  },
  { icon: 'clock',       text: 'Ready in 60 seconds'  },
  { icon: 'edit',        text: 'Edit anytime, free'   },
];

/* ── Component ─────────────────────────────────────────────────── */
export default function Hero({ onCTAClick }: HeroProps) {
  const [wordIndex, setWordIndex] = useState(0);
  const [typedText, setTypedText]  = useState('');
  const [charIndex, setCharIndex]  = useState(0);
  const [openFaq,   setOpenFaq]    = useState<number | null>(null);
  const [scrolled,  setScrolled]   = useState(false);
  const [menuOpen,  setMenuOpen]   = useState(false);
  const revealRefs = useRef<(HTMLElement | null)[]>([]);

  /* Close menu on Escape + lock body scroll */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [menuOpen]);

  /* Typing animation */
  useEffect(() => {
    const word = ROTATING_WORDS[wordIndex];
    const done = charIndex === word.length;
    const id = done
      ? setTimeout(() => { setCharIndex(0); setTypedText(''); setWordIndex(i => (i + 1) % ROTATING_WORDS.length); }, 1400)
      : setTimeout(() => { setTypedText(word.slice(0, charIndex + 1)); setCharIndex(c => c + 1); }, 80);
    return () => clearTimeout(id);
  }, [charIndex, wordIndex]);

  /* Navbar scroll */
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  /* Scroll reveal */
  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('is-visible'); }),
      { threshold: 0.07 },
    );
    revealRefs.current.forEach(el => { if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  const r = (i: number) => (el: HTMLElement | null) => { revealRefs.current[i] = el; };

  return (
    <div style={{ background: C.bg, overflowX: 'hidden' }}>

      {/* ══════════════════════════════════════════════════════════
          NAVBAR
      ══════════════════════════════════════════════════════════ */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 400,
        background: scrolled ? 'rgba(15,15,21,0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(18px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(18px)' : 'none',
        borderBottom: scrolled ? `1px solid ${C.darkLine}` : 'none',
        transition: 'background 0.35s ease, border-color 0.35s ease',
      }}>
        <div style={{ maxWidth: 1160, margin: '0 auto', padding: '0 24px', height: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 22, fontWeight: 900, letterSpacing: '-0.04em', color: '#fff' }}>
            Localio
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
            <a href="#how" className="hide-mobile" style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.65)', textDecoration: 'none', transition: 'color 0.15s' }}
              onMouseEnter={e => ((e.target as HTMLElement).style.color = '#fff')}
              onMouseLeave={e => ((e.target as HTMLElement).style.color = 'rgba(255,255,255,0.65)')}>
              How it works
            </a>
            <a href="#faq" className="hide-mobile" style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.65)', textDecoration: 'none', transition: 'color 0.15s' }}
              onMouseEnter={e => ((e.target as HTMLElement).style.color = '#fff')}
              onMouseLeave={e => ((e.target as HTMLElement).style.color = 'rgba(255,255,255,0.65)')}>
              FAQ
            </a>
            <button type="button" onClick={onCTAClick} className="btn-shimmer hide-mobile" style={{
              padding: '10px 22px', background: C.orange, color: '#fff',
              border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 14,
              cursor: 'pointer', boxShadow: `0 4px 20px ${C.orangeGlow}`, transition: 'all 0.15s',
            }}
              onMouseEnter={e => { const b = e.currentTarget as HTMLButtonElement; b.style.background = C.orangeHov; b.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { const b = e.currentTarget as HTMLButtonElement; b.style.background = C.orange; b.style.transform = 'translateY(0)'; }}>
              Build Free →
            </button>

            {/* Hamburger — mobile only */}
            <button
              type="button"
              className="show-mobile"
              onClick={() => setMenuOpen(o => !o)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                padding: 8, display: 'flex', flexDirection: 'column',
                justifyContent: 'center', alignItems: 'center', gap: 0,
                width: 40, height: 40,
              }}
            >
              <span style={{
                display: 'block', width: 22, height: 2, background: '#fff', borderRadius: 2,
                transformOrigin: 'center',
                transform: menuOpen ? 'translateY(8px) rotate(45deg)' : 'none',
                transition: 'transform 0.32s cubic-bezier(0.4,0,0.2,1)',
              }} />
              <span style={{
                display: 'block', width: 22, height: 2, background: '#fff', borderRadius: 2,
                margin: '6px 0',
                opacity: menuOpen ? 0 : 1,
                transform: menuOpen ? 'scaleX(0)' : 'scaleX(1)',
                transition: 'opacity 0.2s ease, transform 0.25s ease',
              }} />
              <span style={{
                display: 'block', width: 22, height: 2, background: '#fff', borderRadius: 2,
                transformOrigin: 'center',
                transform: menuOpen ? 'translateY(-8px) rotate(-45deg)' : 'none',
                transition: 'transform 0.32s cubic-bezier(0.4,0,0.2,1)',
              }} />
            </button>
          </div>
        </div>
      </nav>

      {/* ══════════════════════════════════════════════════════════
          MOBILE MENU OVERLAY
      ══════════════════════════════════════════════════════════ */}
      <div style={{
        position: 'fixed', top: 68, left: 0, right: 0, bottom: 0, zIndex: 390,
        background: 'rgba(10,10,16,0.97)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        gap: 8,
        opacity: menuOpen ? 1 : 0,
        pointerEvents: menuOpen ? 'all' : 'none',
        transform: menuOpen ? 'translateY(0)' : 'translateY(-12px)',
        transition: 'opacity 0.3s ease, transform 0.3s ease',
      }}>
        {[
          { label: 'How it works', href: '#how' },
          { label: 'FAQ',          href: '#faq' },
        ].map(({ label, href }, i) => (
          <a
            key={href}
            href={href}
            onClick={() => setMenuOpen(false)}
            style={{
              fontSize: 32, fontWeight: 800, color: '#fff',
              textDecoration: 'none', letterSpacing: '-0.03em',
              padding: '12px 24px',
              opacity: menuOpen ? 1 : 0,
              transform: menuOpen ? 'translateY(0)' : 'translateY(16px)',
              transition: `opacity 0.35s ease ${0.08 + i * 0.07}s, transform 0.35s ease ${0.08 + i * 0.07}s`,
            }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = C.orange)}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = '#fff')}
          >
            {label}
          </a>
        ))}

        <div style={{
          marginTop: 16,
          opacity: menuOpen ? 1 : 0,
          transform: menuOpen ? 'translateY(0)' : 'translateY(16px)',
          transition: 'opacity 0.35s ease 0.22s, transform 0.35s ease 0.22s',
        }}>
          <button
            type="button"
            onClick={() => { setMenuOpen(false); onCTAClick(); }}
            style={{
              padding: '16px 48px', background: C.orange, color: '#fff',
              border: 'none', borderRadius: 14, fontWeight: 900, fontSize: 18,
              cursor: 'pointer', letterSpacing: '-0.02em',
              boxShadow: `0 12px 48px ${C.orangeGlow}`,
            }}
          >
            Build My Free Website →
          </button>
        </div>

        {/* Divider line */}
        <div style={{
          position: 'absolute', top: 0, left: 24, right: 24,
          height: 1, background: 'rgba(255,255,255,0.07)',
        }} />
      </div>


      {/* ══════════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════════ */}
      <section style={{
        background: `radial-gradient(ellipse 80% 60% at 70% 40%, rgba(249,115,22,0.10) 0%, transparent 60%), linear-gradient(160deg, ${C.dark} 0%, ${C.dark2} 100%)`,
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        padding: 'clamp(88px,10vw,110px) 24px clamp(40px,4vw,56px)',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Faint grid */}
        <div aria-hidden style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: `linear-gradient(${C.darkLine} 1px, transparent 1px), linear-gradient(90deg, ${C.darkLine} 1px, transparent 1px)`,
          backgroundSize: '64px 64px', opacity: 0.5,
        }} />

        <div style={{ maxWidth: 860, margin: '0 auto', width: '100%', textAlign: 'center', position: 'relative', zIndex: 1 }}>

          {/* Badge */}
          <div className="anim-fade-up" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.28)',
            borderRadius: 100, padding: '7px 18px', marginBottom: 20,
            fontSize: 13, fontWeight: 700, color: C.orange,
          }}>
            <Icon name="shield" size={13} color={C.orange} />
            Trusted by 1,200+ local businesses — free
          </div>

          {/* Headline — each line is a block so animated word can't shift siblings */}
          <h1 className="anim-fade-up delay-1" style={{
            fontSize: 'clamp(34px, 5.2vw, 68px)', fontWeight: 900,
            lineHeight: 1.06, color: '#fff', margin: '0 0 20px',
            letterSpacing: '-0.04em',
          }}>
            <span style={{ display: 'block' }}>Build your</span>
            <span style={{
              display: 'block', color: C.orange,
              minHeight: '1.1em',
            }}>
              {typedText}
              <span style={{
                display: 'inline-block', width: 3, height: '0.85em',
                marginLeft: 3, background: C.orange,
                verticalAlign: 'middle', borderRadius: 1,
                animation: 'cursorBlink 0.9s step-end infinite',
              }} />
            </span>
            <span style={{ display: 'block' }}>website in 60 seconds —</span>
            <span style={{ display: 'block' }}>no tech skills needed.</span>
          </h1>

          <p className="anim-fade-up delay-2" style={{
            fontSize: 'clamp(15px, 1.6vw, 18px)', color: 'rgba(255,255,255,0.60)',
            lineHeight: 1.7, maxWidth: 500, margin: '0 auto 28px',
          }}>
            Just answer 3 quick questions. We write all the words and build your whole site.
            You go live today.{' '}<strong style={{ color: '#fff' }}>It&apos;s completely free.</strong>
          </p>

          {/* CTA */}
          <div className="anim-fade-up delay-3" style={{ marginBottom: 16 }}>
            <button type="button" onClick={onCTAClick} className="btn-shimmer" style={{
              padding: '18px 52px', background: C.orange, color: '#fff',
              border: 'none', borderRadius: 14, fontWeight: 900, fontSize: 18,
              cursor: 'pointer', letterSpacing: '-0.02em',
              boxShadow: `0 12px 48px ${C.orangeGlow}`, transition: 'all 0.2s',
            }}
              onMouseEnter={e => { const b = e.currentTarget as HTMLButtonElement; b.style.background = C.orangeHov; b.style.transform = 'translateY(-3px)'; b.style.boxShadow = `0 20px 64px rgba(249,115,22,0.35)`; }}
              onMouseLeave={e => { const b = e.currentTarget as HTMLButtonElement; b.style.background = C.orange; b.style.transform = 'translateY(0)'; b.style.boxShadow = `0 12px 48px ${C.orangeGlow}`; }}>
              Build My Free Website →
            </button>
          </div>

          <div className="anim-fade-up delay-4" style={{ display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 0 }}>
            {['No sign up', 'No credit card', 'Live in 60 seconds'].map(t => (
              <span key={t} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'rgba(255,255,255,0.38)', fontWeight: 500 }}>
                <Icon name="check" size={11} color={C.orange} />
                {t}
              </span>
            ))}
          </div>

        </div>
      </section>


      {/* ══════════════════════════════════════════════════════════
          MARQUEE
      ══════════════════════════════════════════════════════════ */}
      <div style={{ background: C.orange, padding: '14px 0', overflow: 'hidden' }}>
        <div className="marquee-inner">
          {[...MARQUEE, ...MARQUEE].map((item, i) => (
            <span key={i} style={{
              display: 'inline-flex', alignItems: 'center', gap: 12,
              marginRight: 44, fontSize: 13, fontWeight: 700,
              color: 'rgba(255,255,255,0.90)', whiteSpace: 'nowrap',
            }}>
              <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(255,255,255,0.55)', flexShrink: 0 }} />
              {item}
            </span>
          ))}
        </div>
      </div>


      {/* ══════════════════════════════════════════════════════════
          STATS
      ══════════════════════════════════════════════════════════ */}
      <section style={{ background: C.bg, padding: '64px 24px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          {[
            { num: '1,200+', label: 'Websites built',     note: 'and counting'      },
            { num: '< 60s',  label: 'Build time',         note: 'not 60 minutes'    },
            { num: '100%',   label: 'Free',                note: 'always, no tricks' },
            { num: '0',      label: 'Tech skills needed', note: 'seriously, zero'   },
          ].map(s => (
            <div key={s.label} style={{
              padding: '32px 20px', textAlign: 'center', borderRadius: 18,
              background: C.bgCream, border: `1.5px solid ${C.orangeBorder}`,
            }}>
              <div style={{ fontSize: 'clamp(34px, 4.5vw, 52px)', fontWeight: 900, color: C.orange, letterSpacing: '-0.05em', lineHeight: 1 }}>{s.num}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: C.text, marginTop: 10 }}>{s.label}</div>
              <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>{s.note}</div>
            </div>
          ))}
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════════
          PROBLEM
      ══════════════════════════════════════════════════════════ */}
      <section ref={r(0)} className="reveal" style={{ background: C.dark, padding: 'clamp(72px,10vw,120px) 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 64, alignItems: 'center' }}>
          <div>
            <p style={{ fontSize: 13, fontWeight: 800, color: C.orange, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 }}>The Problem</p>
            <h2 style={{ fontSize: 'clamp(28px, 4.8vw, 58px)', fontWeight: 900, color: '#fff', margin: '0 0 20px', letterSpacing: '-0.04em', lineHeight: 1.08 }}>
              Every day without a website, you&apos;re invisible.
            </h2>
            <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.50)', lineHeight: 1.75, margin: 0 }}>
              87% of people search online before they call a business. If they can&apos;t find you — they find your competition.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { icon: 'x-circle', text: 'Web designers charge $2,000 or more',      bad: true  },
              { icon: 'x-circle', text: 'DIY builders take weeks to figure out',      bad: true  },
              { icon: 'x-circle', text: 'Your competition already has a website',     bad: true  },
              { icon: 'check-circle', text: 'Localio builds it in under 60 seconds', bad: false },
              { icon: 'check-circle', text: 'No code, no design skills, no cost at all', bad: false },
            ].map((item, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'flex-start', gap: 14,
                padding: '16px 20px', borderRadius: 12,
                background: item.bad ? 'rgba(239,68,68,0.07)' : 'rgba(249,115,22,0.10)',
                border: `1px solid ${item.bad ? 'rgba(239,68,68,0.14)' : 'rgba(249,115,22,0.22)'}`,
              }}>
                <div style={{ flexShrink: 0, marginTop: 1 }}>
                  <Icon name={item.icon} size={16} color={item.bad ? '#F87171' : C.orange} />
                </div>
                <span style={{ fontSize: 15, color: item.bad ? 'rgba(255,255,255,0.55)' : '#fff', fontWeight: item.bad ? 400 : 600, lineHeight: 1.55 }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════════════════════════ */}
      <section id="how" ref={r(1)} className="reveal" style={{ background: C.bgCream, padding: 'clamp(72px,10vw,120px) 24px' }}>
        <div style={{ maxWidth: 1060, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <p style={{ fontSize: 13, fontWeight: 800, color: C.orange, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>How It Works</p>
            <h2 style={SH}>It&apos;s really this simple.</h2>
            <p style={SS}>No computer skills needed. No design skills. Nothing to install. Just answer 3 questions.</p>
          </div>

          <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 32 }}>
            {/* Dashed connector */}
            <div className="hide-mobile" style={{
              position: 'absolute', top: 34, left: '20%', right: '20%', height: 2,
              backgroundImage: `repeating-linear-gradient(90deg, ${C.orangeBorder} 0, ${C.orangeBorder} 8px, transparent 8px, transparent 18px)`,
              zIndex: 0,
            }} />

            {STEPS.map((step, i) => (
              <div key={i} style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
                <div style={{
                  width: 70, height: 70, borderRadius: '50%', margin: '0 auto 24px',
                  background: C.orange, boxShadow: `0 8px 32px ${C.orangeGlow}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: `4px solid ${C.bgCream}`,
                }}>
                  <Icon name={step.icon} size={26} color="#fff" strokeWidth={1.75} />
                </div>
                <div style={{ fontSize: 11, fontWeight: 800, color: C.orange, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Step {step.num}</div>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: C.dark, marginBottom: 10, lineHeight: 1.3 }}>{step.title}</h3>
                <p style={{ fontSize: 14, color: C.text2, lineHeight: 1.75, margin: 0 }}>{step.desc}</p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 56 }}>
            <button type="button" onClick={onCTAClick} className="btn-shimmer" style={OBtn}
              onMouseEnter={e => { const b = e.currentTarget as HTMLButtonElement; b.style.background = C.orangeHov; b.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { const b = e.currentTarget as HTMLButtonElement; b.style.background = C.orange; b.style.transform = 'translateY(0)'; }}>
              Start Now — It&apos;s Free →
            </button>
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════════
          WHAT YOU GET
      ══════════════════════════════════════════════════════════ */}
      <section ref={r(2)} className="reveal" style={{ background: C.bg, padding: 'clamp(72px,10vw,120px) 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 72, alignItems: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <PhoneMockup />
          </div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 800, color: C.orange, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>What&apos;s Included</p>
            <h2 style={{ ...SH, textAlign: 'left', marginBottom: 12 }}>Everything your site needs.</h2>
            <p style={{ ...SS, textAlign: 'left', maxWidth: '100%', marginBottom: 32 }}>We build the whole thing. Here&apos;s what&apos;s on every site — all included, all free.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: 10 }}>
              {FEATURES.map((f, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '13px 16px', background: C.bgCream,
                  border: `1.5px solid ${C.orangeBorder}`, borderRadius: 12,
                  transition: 'transform 0.18s, box-shadow 0.18s',
                }}
                  onMouseEnter={e => { const d = e.currentTarget as HTMLDivElement; d.style.transform = 'translateY(-2px)'; d.style.boxShadow = `0 6px 20px ${C.orangeGlow}`; }}
                  onMouseLeave={e => { const d = e.currentTarget as HTMLDivElement; d.style.transform = 'translateY(0)'; d.style.boxShadow = 'none'; }}>
                  <Icon name={f.icon} size={18} color={C.orange} strokeWidth={1.75} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: C.text, lineHeight: 1.4 }}>{f.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════════
          TESTIMONIALS
      ══════════════════════════════════════════════════════════ */}
      <section ref={r(3)} className="reveal" style={{ background: C.dark, padding: 'clamp(72px,10vw,120px) 24px' }}>
        <div style={{ maxWidth: 1060, margin: '0 auto' }}>
          {/* Big quote */}
          <div style={{ textAlign: 'center', marginBottom: 64, maxWidth: 760, margin: '0 auto 64px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
              <Icon name="quote" size={48} color={C.orange} strokeWidth={1.5} />
            </div>
            <p style={{ fontSize: 'clamp(20px, 3vw, 30px)', fontWeight: 700, color: '#fff', lineHeight: 1.45, fontStyle: 'italic', margin: '0 0 28px' }}>
              Three new customers called me in the first week from my website. I paid nothing for it.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
              <div style={{ width: 46, height: 46, borderRadius: '50%', background: 'rgba(249,115,22,0.18)', border: `2px solid ${C.orange}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 900, color: C.orange }}>TB</div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>Tom B.</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.40)', marginTop: 2 }}>Plumber · Chicago, IL</div>
              </div>
            </div>
          </div>

          {/* 3 cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {TESTIMONIALS.map(t => (
              <div key={t.name} className="card-hover" style={{
                background: C.dark2, border: `1px solid ${C.darkLine}`, borderRadius: 20, padding: '26px 22px',
              }}>
                {/* Star row */}
                <div style={{ display: 'flex', gap: 3, marginBottom: 14 }}>
                  {Array.from({ length: 5 }).map((_, si) => (
                    <Icon key={si} name="star-filled" size={14} color="#FBBF24" />
                  ))}
                </div>
                <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.70)', lineHeight: 1.8, fontStyle: 'italic', margin: '0 0 20px' }}>&ldquo;{t.text}&rdquo;</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 38, height: 38, borderRadius: '50%', background: C.dark3, border: `1px solid rgba(249,115,22,0.25)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: C.orange, flexShrink: 0 }}>{t.avatar}</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.38)', marginTop: 1 }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════════
          BUSINESS TYPES
      ══════════════════════════════════════════════════════════ */}
      <section ref={r(4)} className="reveal" style={{ background: C.bg, padding: 'clamp(64px,8vw,100px) 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: 13, fontWeight: 800, color: C.orange, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>Every Trade Welcome</p>
          <h2 style={SH}>Works for every local business.</h2>
          <p style={{ ...SS, marginBottom: 44 }}>If you work for yourself or run a small local business, this is made for you.</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
            {BUSINESS_TYPES.map(type => (
              <div key={type.label}
                style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '10px 20px', background: C.bgWarm, border: `1.5px solid ${C.border}`, borderRadius: 100, fontSize: 14, fontWeight: 600, color: C.text, cursor: 'default', transition: 'all 0.2s' }}
                onMouseEnter={e => { const d = e.currentTarget as HTMLDivElement; d.style.borderColor = C.orange; d.style.background = C.bgCream; d.style.color = C.orangeHov; }}
                onMouseLeave={e => { const d = e.currentTarget as HTMLDivElement; d.style.borderColor = C.border; d.style.background = C.bgWarm; d.style.color = C.text; }}>
                <Icon name={type.icon} size={15} color={C.orange} strokeWidth={1.75} />
                {type.label}
              </div>
            ))}
          </div>
          <p style={{ fontSize: 14, color: C.muted, marginTop: 28 }}>
            Don&apos;t see yours?{' '}
            <button type="button" onClick={onCTAClick} style={{ background: 'none', border: 'none', color: C.orange, fontWeight: 700, fontSize: 14, cursor: 'pointer', textDecoration: 'underline' }}>
              Try it anyway — it works for everything
            </button>
          </p>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════════
          TRUST STRIP
      ══════════════════════════════════════════════════════════ */}
      <div style={{ background: C.bgCream, borderTop: `1px solid ${C.orangeBorder}`, borderBottom: `1px solid ${C.orangeBorder}`, padding: '28px 24px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 32 }}>
          {TRUST.map(b => (
            <div key={b.text} style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 14, fontWeight: 600, color: C.text2 }}>
              <Icon name={b.icon} size={17} color={C.orange} strokeWidth={1.75} />
              {b.text}
            </div>
          ))}
        </div>
      </div>


      {/* ══════════════════════════════════════════════════════════
          FAQ
      ══════════════════════════════════════════════════════════ */}
      <section id="faq" ref={r(5)} className="reveal" style={{ background: C.bgWarm, padding: 'clamp(64px,8vw,100px) 24px' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 44 }}>
            <p style={{ fontSize: 13, fontWeight: 800, color: C.orange, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>FAQ</p>
            <h2 style={SH}>Questions? We got you.</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {FAQS.map((faq, i) => (
              <div key={i} style={{
                border: `1.5px solid ${openFaq === i ? C.orangeBorder : C.border}`,
                borderRadius: 14, overflow: 'hidden',
                background: openFaq === i ? C.bgCream : C.bg, transition: 'all 0.2s',
              }}>
                <button type="button" onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{
                  width: '100%', padding: '18px 22px', display: 'flex',
                  justifyContent: 'space-between', alignItems: 'center',
                  background: 'none', border: 'none', cursor: 'pointer',
                  textAlign: 'left', fontFamily: 'inherit', gap: 16,
                }}>
                  <span style={{ fontSize: 15, fontWeight: 700, color: C.text, lineHeight: 1.4 }}>{faq.q}</span>
                  <span style={{
                    width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                    background: openFaq === i ? C.orange : C.bgCream,
                    border: `1px solid ${openFaq === i ? C.orange : C.border}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.25s', transform: openFaq === i ? 'rotate(45deg)' : 'rotate(0deg)',
                  }}>
                    <Icon name="plus" size={12} color={openFaq === i ? '#fff' : C.muted} />
                  </span>
                </button>
                {openFaq === i && (
                  <div style={{ padding: '0 22px 18px' }}>
                    <p style={{ fontSize: 15, color: C.text2, lineHeight: 1.8, margin: 0 }}>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════════
          FINAL CTA
      ══════════════════════════════════════════════════════════ */}
      <section ref={r(6)} className="reveal" style={{
        background: `linear-gradient(135deg, ${C.orange} 0%, #FF9A3C 50%, #FFBA6B 100%)`,
        padding: 'clamp(80px,12vw,140px) 24px', textAlign: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        <div aria-hidden style={{ position: 'absolute', top: '-20%', right: '-8%', width: 480, height: 480, borderRadius: '50%', background: 'rgba(255,255,255,0.09)', pointerEvents: 'none' }} />
        <div aria-hidden style={{ position: 'absolute', bottom: '-30%', left: '-5%', width: 380, height: 380, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 640, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.20)', border: '1px solid rgba(255,255,255,0.35)', borderRadius: 100, padding: '6px 20px', marginBottom: 28, fontSize: 13, fontWeight: 700, color: '#fff' }}>
            <Icon name="zap" size={13} color="#fff" />
            Free today. Free tomorrow. Free always.
          </div>
          <h2 style={{ fontSize: 'clamp(30px, 5.5vw, 58px)', fontWeight: 900, color: '#fff', marginBottom: 18, letterSpacing: '-0.04em', lineHeight: 1.07 }}>
            Your website is 60 seconds away.
          </h2>
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.85)', lineHeight: 1.7, maxWidth: 440, margin: '0 auto 44px' }}>
            It&apos;s free. It&apos;s easy. New customers are already searching for you online right now.
          </p>
          <button type="button" onClick={onCTAClick} className="btn-shimmer" style={{
            padding: '20px 56px', background: '#fff', color: C.orange,
            border: 'none', borderRadius: 14, fontWeight: 900, fontSize: 18,
            cursor: 'pointer', letterSpacing: '-0.02em',
            boxShadow: '0 12px 48px rgba(0,0,0,0.14)', transition: 'all 0.2s',
          }}
            onMouseEnter={e => { const b = e.currentTarget as HTMLButtonElement; b.style.transform = 'translateY(-3px)'; b.style.boxShadow = '0 20px 64px rgba(0,0,0,0.20)'; }}
            onMouseLeave={e => { const b = e.currentTarget as HTMLButtonElement; b.style.transform = 'translateY(0)'; b.style.boxShadow = '0 12px 48px rgba(0,0,0,0.14)'; }}>
            Build My Free Website →
          </button>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', marginTop: 18 }}>No sign up · No credit card · No confusion · Takes 60 seconds</p>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════════════════════ */}
      <footer style={{ background: C.dark2, borderTop: `1px solid ${C.darkLine}`, padding: '40px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <span style={{ fontSize: 21, fontWeight: 900, letterSpacing: '-0.04em', color: '#fff' }}>
            Localio
          </span>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.30)', margin: '10px 0 0' }}>
            © {new Date().getFullYear()} Localio · Built for local business owners everywhere
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 28, marginTop: 18, flexWrap: 'wrap' }}>
            <a href="#how" style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}>How it works</a>
            <a href="#faq" style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}>FAQ</a>
            <button type="button" onClick={onCTAClick} style={{ fontSize: 13, color: C.orange, background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }}>Build my website →</button>
          </div>
        </div>
      </footer>

    </div>
  );
}


/* ── Phone Mockup ──────────────────────────────────────────────── */
function PhoneMockup() {
  return (
    <div style={{
      width: 224, background: '#0D0D0D', borderRadius: 42,
      border: '7px solid #1E1E1E', padding: '0 0 10px',
      boxShadow: '0 40px 80px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.04)',
    }}>
      {/* Notch */}
      <div style={{ height: 30, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ width: 68, height: 14, background: '#000', borderRadius: 100 }} />
      </div>
      {/* Screen */}
      <div style={{ background: '#fff', borderRadius: '4px 4px 0 0', overflow: 'hidden' }}>
        {/* Nav */}
        <div style={{ background: '#1A3A64', padding: '10px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 9, fontWeight: 900, color: '#fff', letterSpacing: '-0.02em' }}>ProPlumb Co.</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(249,115,22,0.18)', padding: '3px 8px', borderRadius: 4 }}>
            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
            <span style={{ fontSize: 8, fontWeight: 800, color: '#F97316' }}>Call</span>
          </div>
        </div>
        {/* Hero banner */}
        <div style={{ background: 'linear-gradient(135deg, #1A3A64 0%, #1E52AC 100%)', padding: '20px 12px 16px', textAlign: 'center' }}>
          <div style={{ fontSize: 11, fontWeight: 900, color: '#fff', marginBottom: 4 }}>Trusted Plumbing Service</div>
          <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.65)', marginBottom: 12 }}>Dallas, TX · Since 2008</div>
          <div style={{ background: '#F97316', borderRadius: 6, padding: '6px 12px', fontSize: 8, fontWeight: 900, color: '#fff', display: 'inline-block' }}>Get Free Quote →</div>
        </div>
        {/* Services */}
        <div style={{ padding: '10px 12px' }}>
          <div style={{ fontSize: 7, fontWeight: 800, color: '#111', marginBottom: 7, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Services</div>
          {['Pipe Repair & Installation', 'Drain Cleaning', 'Water Heater Service'].map(s => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 0', borderBottom: '1px solid #F0F0F0' }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#F97316', flexShrink: 0 }} />
              <span style={{ fontSize: 8, color: '#374151' }}>{s}</span>
            </div>
          ))}
        </div>
        {/* Review strip */}
        <div style={{ padding: '8px 12px', background: '#FFFBF8', borderTop: '1px solid #F0EEE8', display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ display: 'flex', gap: 1 }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <svg key={i} width="8" height="8" viewBox="0 0 24 24" fill="#F59E0B" stroke="none">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
            ))}
          </div>
          <span style={{ fontSize: 7, color: '#6B7280', fontStyle: 'italic' }}>&ldquo;Excellent service!&rdquo;</span>
        </div>
      </div>
      {/* Home bar */}
      <div style={{ width: 36, height: 4, background: '#333', borderRadius: 100, margin: '9px auto 0' }} />
    </div>
  );
}


/* ── SVG Icon library (Feather-style, 24×24 viewBox) ──────────── */
function Icon({
  name, size = 20, color = 'currentColor', strokeWidth = 2,
}: {
  name: string; size?: number; color?: string; strokeWidth?: number;
}) {
  const p = { // shared SVG props
    width: size, height: size, viewBox: '0 0 24 24', fill: 'none',
    stroke: color, strokeWidth, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const,
    style: { display: 'block', flexShrink: 0 },
  };

  switch (name) {

    /* ── Navigation / UI ── */
    case 'plus':
      return <svg {...p}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
    case 'check':
      return <svg {...p}><polyline points="20 6 9 17 4 12"/></svg>;
    case 'check-circle':
      return <svg {...p}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;
    case 'x-circle':
      return <svg {...p}><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>;

    /* ── Brand / trust ── */
    case 'shield':
      return <svg {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
    case 'star':
      return <svg {...p}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
    case 'star-filled':
      return <svg {...p} fill={color} stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
    case 'quote':
      return <svg {...p}><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/></svg>;

    /* ── How it works ── */
    case 'message':
      return <svg {...p}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;
    case 'cpu':
      return <svg {...p}><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></svg>;
    case 'globe':
      return <svg {...p}><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>;

    /* ── Features ── */
    case 'smartphone':
      return <svg {...p}><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>;
    case 'search':
      return <svg {...p}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
    case 'phone-call':
      return <svg {...p}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>;
    case 'clock':
      return <svg {...p}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
    case 'list':
      return <svg {...p}><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>;
    case 'camera':
      return <svg {...p}><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>;
    case 'help':
      return <svg {...p}><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;

    /* ── Trust strip ── */
    case 'lock':
      return <svg {...p}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
    case 'credit-card':
      return <svg {...p}><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>;
    case 'edit':
      return <svg {...p}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;

    /* ── CTA / general ── */
    case 'zap':
      return <svg {...p}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>;

    /* ── Business types ── */
    case 'tool':
      return <svg {...p}><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>;
    case 'leaf':
      return <svg {...p}><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>;
    case 'car':
      return <svg {...p}><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>;
    case 'scissors':
      return <svg {...p}><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/></svg>;
    case 'utensils':
      return <svg {...p}><line x1="3" y1="2" x2="3" y2="22"/><path d="M7 2v5a3 3 0 0 0 6 0V2"/><path d="M19 2l-2 7h4l-2 7"/><line x1="19" y1="16" x2="19" y2="22"/></svg>;
    case 'activity':
      return <svg {...p}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>;
    case 'droplet':
      return <svg {...p}><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>;
    case 'settings':
      return <svg {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>;
    case 'coffee':
      return <svg {...p}><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>;
    case 'heart':
      return <svg {...p}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>;
    case 'smile':
      return <svg {...p}><circle cx="12" cy="12" r="10"/><path d="M8 13s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>;

    default:
      return <svg {...p}><circle cx="12" cy="12" r="10"/></svg>;
  }
}


/* ── Shared style constants ────────────────────────────────────── */
const SH: React.CSSProperties = {
  fontSize: 'clamp(24px, 3.8vw, 44px)',
  fontWeight: 900, color: '#111118',
  margin: '0 0 14px', letterSpacing: '-0.035em',
  lineHeight: 1.1, textAlign: 'center',
};
const SS: React.CSSProperties = {
  fontSize: 17, color: '#9CA3AF',
  lineHeight: 1.75, maxWidth: 480, margin: '0 auto', textAlign: 'center',
};
const OBtn: React.CSSProperties = {
  padding: '15px 40px', background: '#F97316',
  color: '#fff', border: 'none', borderRadius: 12,
  fontWeight: 800, fontSize: 16, cursor: 'pointer',
  boxShadow: '0 6px 24px rgba(249,115,22,0.28)',
  letterSpacing: '-0.01em', transition: 'all 0.15s',
};
