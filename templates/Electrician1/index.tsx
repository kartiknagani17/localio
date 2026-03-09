'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { TemplateProps, ServiceItem, Testimonial, Stat } from '../types';

// ── Default data ──────────────────────────────────────────────────────────────
const DEFAULT_SERVICES: ServiceItem[] = [
  { name: 'Panel Upgrades',       description: 'Upgrade your electrical panel to handle modern power demands safely and efficiently.' },
  { name: 'Lighting Installation',description: 'Recessed lighting, fixtures, dimmer switches, and full indoor/outdoor lighting systems.' },
  { name: 'Outlet & Switch Work', description: 'New outlets, GFCI protection, USB ports, and smart switch installation.' },
  { name: 'EV Charger Install',   description: 'Level 2 home EV charger installation — charge your car overnight, every night.' },
  { name: 'Smart Home Wiring',    description: 'Full smart home integration: thermostats, security systems, automated lighting.' },
  { name: 'Safety Inspections',   description: 'Thorough electrical safety audits for home buyers, sellers, and peace of mind.' },
  { name: 'Commercial Panels',    description: 'Three-phase panel installation and upgrades for offices, retail, and warehouses.' },
  { name: 'Office Wiring',        description: 'Full office electrical buildouts, dedicated circuits, workstation power, and data drops.' },
  { name: 'LED Retrofit',         description: 'Commercial LED lighting upgrades that cut energy bills by up to 60%.' },
  { name: 'Emergency Lighting',   description: 'Code-compliant emergency exit lighting and battery backup systems installed fast.' },
  { name: 'EV Fleet Charging',    description: 'Multi-bay commercial EV charging stations for employee and customer fleets.' },
  { name: 'Code Compliance',      description: 'Bring your facility up to current NEC code. We handle all permits and inspections.' },
];

const DEFAULT_STATS: Stat[] = [
  { value: 12,   label: 'Years in Business', suffix: '+' },
  { value: 1800, label: 'Jobs Completed',    suffix: '+' },
  { value: 99,   label: 'Satisfaction Rate', suffix: '%' },
  { value: 24,   label: 'Emergency Service', suffix: '/7' },
];

const DEFAULT_TESTIMONIALS: Testimonial[] = [
  { name: 'James R.',  text: 'Had my panel upgraded from 100A to 200A. The crew was in and out in half a day. Clean work, honest price. Already recommended to three neighbors.',                                                                                     rating: 5, context: 'Homeowner'        },
  { name: 'Amanda L.', text: 'Fast response, no nonsense. Someone came out same-day when our kitchen circuit kept tripping. Fixed it in an hour. The whole team is a pleasure — we won\'t use anyone else.',                                                          rating: 5, context: 'Homeowner'        },
  { name: 'Tom C.',    text: 'Got two EV chargers installed in our garage. Handled everything from the permit to final inspection. Couldn\'t be happier.',                                                                                                            rating: 5, context: 'Homeowner'        },
  { name: 'Maria G.',  text: 'Rewired our entire restaurant during a weekend closure. Zero issues when we opened Monday morning. These guys are pros — worth every penny.',                                                                                           rating: 5, context: 'Restaurant Owner'  },
  { name: 'Steve K.',  text: 'Called at 9pm for an electrical emergency. Someone was at my door within 45 minutes. Problem solved before midnight. Genuinely impressive.',                                                                                           rating: 5, context: 'Homeowner'        },
  { name: 'Rachel P.', text: 'Smart home conversion done flawlessly. Every switch, outlet, and fixture now works with our system. The team was clean, professional, and clearly knew exactly what they were doing.',                                                  rating: 5, context: 'Homeowner'        },
];

const DEFAULT_CERTIFICATIONS = [
  'Licensed Master Electrician',
  'OSHA 30 Certified',
  'NFPA 70E Compliant',
  'BBB Accredited',
  '$2M Liability Insurance',
  'Permit Ready',
];

const CERT_SUBTITLES: Record<string, string> = {
  'Licensed Master Electrician': 'State Licensed & Certified',
  'OSHA 30 Certified':           'Workplace Safety Trained',
  'NFPA 70E Compliant':          'Arc Flash Safety',
  'BBB Accredited':              'A+ Rating',
  '$2M Liability Insurance':     'Fully Bonded & Covered',
  'Permit Ready':                'We Handle All Permits',
};

const PROCESS_STEPS = [
  {
    icon: '📞', num: 'Step 01', title: 'Call & Schedule',
    short: 'We answer fast. Tell us your issue and we\'ll book the earliest slot — often same day.',
    full:  'We answer fast. Tell us your issue and we\'ll book the earliest available slot — often same day. Our friendly team is standing by to help you right now.',
    note:  '⏱️ Average response time: under 2 minutes',
  },
  {
    icon: '🔍', num: 'Step 02', title: 'On-Site Assessment',
    short: 'A licensed electrician inspects your system and gives you a clear, itemized quote before any work begins.',
    full:  'A licensed electrician arrives on time, thoroughly inspects your system, and gives you a clear itemized quote before a single wire is touched. No pressure, ever.',
    note:  '📋 Written quote provided before work starts',
  },
  {
    icon: '⚡', num: 'Step 03', title: 'Expert Installation',
    short: 'We do the work safely, up to code, with zero mess left behind. Permits handled — always.',
    full:  'We execute the job safely, up to NEC code, with every permit pulled and every detail documented. We leave the workspace cleaner than we found it.',
    note:  '🏅 100% code-compliant work, guaranteed',
  },
  {
    icon: '✅', num: 'Step 04', title: 'Final Inspection',
    short: 'We test every circuit, sign off on the work, and ensure you\'re 100% satisfied before we leave.',
    full:  'Every circuit is tested and verified. We walk you through what was done, answer any questions, and don\'t leave until you\'re completely satisfied with the result.',
    note:  '🛡️ All work covered by our satisfaction guarantee',
  },
];

const TICKER_SERVICES = [
  'Panel Upgrades','EV Charger Install','Lighting Design','Smart Home Wiring',
  'Safety Inspections','Generator Hookup','Outlet Installation','Rewiring Services',
  'Ceiling Fan Install','LED Retrofit','Commercial Wiring','Code Compliance',
];

const SVC_ICONS = ['⚡','💡','🔌','🚗','🏠','🔍','🏢','💼','🌿','🚨','🔋','📋'];
const RING_PCTS = [88, 95, 99, 80, 90, 85, 75, 92];

// ── Helpers ───────────────────────────────────────────────────────────────────
function getInitials(name: string | undefined): string {
  if (!name) return '?';
  return name.split(' ').slice(0, 2).map(w => w[0] ?? '').join('').toUpperCase();
}
function starStr(rating: number | undefined): string {
  const r = typeof rating === 'number' ? rating : 5;
  return '★'.repeat(Math.max(0, Math.min(5, Math.round(r))));
}

// ── Hook: useInView ───────────────────────────────────────────────────────────
function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.unobserve(el); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

// ── Sub: Reveal ───────────────────────────────────────────────────────────────
function Reveal({
  children, delay = 0, dir,
}: {
  children: React.ReactNode; delay?: number; dir?: 'left' | 'right';
}) {
  const { ref, visible } = useInView();
  const tx = dir === 'left' ? '-28px' : dir === 'right' ? '28px' : '0';
  const ty = dir ? '0' : '28px';
  return (
    <div
      ref={ref}
      style={{
        opacity:    visible ? 1 : 0,
        transform:  visible ? 'none' : `translate(${tx}, ${ty})`,
        transition: `opacity .65s ease ${delay}s, transform .65s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const STYLES = `
.ec1-wrap{font-family:'Inter',system-ui,-apple-system,sans-serif;background:#f8fafc;color:#0f172a;overflow-x:hidden; container-type:inline-size; }
.ec1-wrap *,.ec1-wrap *::before,.ec1-wrap *::after{box-sizing:border-box;}
.ec1-wrap a{text-decoration:none;color:inherit;}
.ec1-wrap button{font-family:inherit;cursor:pointer;}
.ec1-inner{max-width:1200px;margin:0 auto;}
.ec1-sec{padding:6rem 2.5rem;}

/* Nav */
.ec1-nav{position:fixed;top:0;left:0;right:0;z-index:100;display:flex;align-items:center;justify-content:space-between;padding:1.1rem 2.5rem;background:rgba(255,255,255,.97);backdrop-filter:blur(12px);border-bottom:1px solid transparent;transition:border-color .3s,box-shadow .3s,padding .3s;}
.ec1-nav.sc{border-color:#e2e8f0;box-shadow:0 1px 16px rgba(0,0,0,.06);padding:.75rem 2.5rem;}
.ec1-logo{font-size:1.25rem;font-weight:800;color:#0f172a;letter-spacing:-.03em;display:flex;align-items:center;gap:.45rem;}
.ec1-logo-bolt{color:#f97316;}
.ec1-nav-links{display:flex;gap:2rem;list-style:none;margin:0;padding:0;}
.ec1-nav-links a{font-size:.875rem;font-weight:500;color:#64748b;transition:color .2s;}
.ec1-nav-links a:hover{color:#0284c7;}
.ec1-nav-cta{background:#f97316;color:#fff;padding:.6rem 1.4rem;border-radius:8px;font-size:.875rem;font-weight:700;border:none;transition:background .2s,transform .2s;}
.ec1-nav-cta:hover{background:#ea580c;transform:translateY(-1px);}
.ec1-nav-mob{display:none;background:none;border:none;flex-direction:column;gap:5px;padding:.5rem;}
.ec1-nav-mob span{width:22px;height:2px;background:#0f172a;border-radius:2px;display:block;}
.ec1-mob-menu{display:none;position:fixed;inset:0;background:#0f172a;z-index:200;flex-direction:column;align-items:center;justify-content:center;gap:2rem;}
.ec1-mob-menu.open{display:flex;}
.ec1-mob-menu a{color:#fff;font-size:1.4rem;font-weight:700;}
.ec1-mob-close{position:absolute;top:1.5rem;right:1.5rem;background:none;border:none;color:#fff;font-size:2rem;line-height:1;}
.ec1-mob-cta{background:#f97316;padding:.75rem 2rem;border-radius:8px;font-weight:700;color:#fff;border:none;font-size:1rem;}

/* Hero */
.ec1-hero{min-height:100vh;padding:7rem 2.5rem 5rem;display:grid;grid-template-columns:1fr 1fr;gap:4rem;align-items:center;max-width:1280px;margin:0 auto;}
.ec1-eyebrow-pill{display:inline-flex;align-items:center;gap:.5rem;background:#f0f9ff;color:#0284c7;padding:.4rem 1rem;border-radius:100px;font-size:.78rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;margin-bottom:1.75rem;}
.ec1-eyebrow-dot{width:6px;height:6px;border-radius:50%;background:#0284c7;animation:ec1-blink 1.5s ease-in-out infinite;}
@keyframes ec1-blink{0%,100%{opacity:1;}50%{opacity:.2;}}
.ec1-h1{font-size:clamp(2.6rem,5vw,4.2rem);font-weight:900;letter-spacing:-.04em;line-height:1.05;color:#0f172a;margin-bottom:1.25rem;}
.ec1-accent{color:#0284c7;position:relative;display:inline-block;}
.ec1-accent::after{content:'';position:absolute;bottom:-2px;left:0;right:0;height:4px;background:#f97316;border-radius:2px;transform:scaleX(0);transform-origin:left;animation:ec1-ul .7s .8s ease forwards;}
@keyframes ec1-ul{to{transform:scaleX(1);}}
.ec1-hero-sub{font-size:1.05rem;color:#64748b;line-height:1.75;max-width:480px;margin-bottom:2.25rem;}
.ec1-hero-btns{display:flex;gap:.9rem;flex-wrap:wrap;margin-bottom:2.5rem;}
.ec1-btn-p{background:#0284c7;color:#fff;padding:.9rem 2rem;border-radius:8px;font-weight:700;font-size:.95rem;border:none;transition:background .2s,transform .2s,box-shadow .2s;box-shadow:0 4px 20px rgba(2,132,199,.3);display:inline-flex;align-items:center;gap:.5rem;}
.ec1-btn-p:hover{background:#0369a1;transform:translateY(-2px);box-shadow:0 8px 28px rgba(2,132,199,.4);}
.ec1-btn-o{background:transparent;color:#0f172a;padding:.9rem 2rem;border-radius:8px;font-weight:600;font-size:.95rem;border:2px solid #e2e8f0;transition:border-color .2s,color .2s;display:inline-flex;align-items:center;gap:.5rem;}
.ec1-btn-o:hover{border-color:#0284c7;color:#0284c7;}
.ec1-hero-trust{display:flex;gap:1.5rem;flex-wrap:wrap;}
.ec1-trust-chip{display:flex;align-items:center;gap:.4rem;font-size:.8rem;color:#64748b;font-weight:500;}
.ec1-trust-icon{width:18px;height:18px;border-radius:50%;background:#f0f9ff;display:flex;align-items:center;justify-content:center;font-size:.65rem;color:#0284c7;flex-shrink:0;}

/* Hero card */
.ec1-card{position:relative;width:100%;background:#0f172a;border-radius:24px;padding:3rem 2rem 2rem;overflow:hidden;border:1px solid rgba(255,255,255,.06);}
.ec1-glow1{position:absolute;top:-40%;left:-20%;width:80%;padding-top:80%;border-radius:50%;background:radial-gradient(circle,rgba(2,132,199,.25) 0%,transparent 70%);pointer-events:none;}
.ec1-glow2{position:absolute;bottom:-30%;right:-10%;width:50%;padding-top:50%;border-radius:50%;background:radial-gradient(circle,rgba(249,115,22,.15) 0%,transparent 70%);pointer-events:none;}
.ec1-bolt-svg{width:72px;height:110px;margin:0 auto 1.5rem;display:block;}
.ec1-bolt-path{fill:none;stroke:#f97316;stroke-width:4;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:400;stroke-dashoffset:400;animation:ec1-bolt-draw 1.2s .3s ease forwards;}
@keyframes ec1-bolt-draw{to{stroke-dashoffset:0;}}
.ec1-bolt-fill{fill:#f97316;opacity:0;animation:ec1-bolt-fill .4s 1.5s ease forwards;}
@keyframes ec1-bolt-fill{to{opacity:.15;}}
.ec1-bolt-lbl{text-align:center;color:rgba(255,255,255,.5);font-size:.72rem;font-weight:600;letter-spacing:.12em;text-transform:uppercase;margin-bottom:1rem;}
.ec1-ticker-wrap{position:relative;height:220px;overflow:hidden;width:100%;}
.ec1-ticker-wrap::before{content:'';position:absolute;top:0;left:0;right:0;height:50px;background:linear-gradient(to bottom,#0f172a,transparent);z-index:2;}
.ec1-ticker-wrap::after{content:'';position:absolute;bottom:0;left:0;right:0;height:50px;background:linear-gradient(to top,#0f172a,transparent);z-index:2;}
.ec1-ticker-track{display:flex;flex-direction:column;animation:ec1-ticker 14s linear infinite;}
.ec1-ticker-track:hover{animation-play-state:paused;}
.ec1-ticker-item{padding:.75rem 1.25rem;display:flex;align-items:center;gap:.75rem;border-radius:10px;margin-bottom:.35rem;}
.ec1-ticker-dot{width:7px;height:7px;border-radius:50%;background:#0284c7;flex-shrink:0;}
.ec1-ticker-name{font-size:.95rem;font-weight:600;color:rgba(255,255,255,.85);}
@keyframes ec1-ticker{0%{transform:translateY(0);}100%{transform:translateY(-50%);}}

/* Trust strip */
.ec1-trust-strip{background:#fff;border-top:1px solid #e2e8f0;border-bottom:1px solid #e2e8f0;padding:.9rem 2.5rem;display:flex;align-items:center;justify-content:center;gap:3rem;flex-wrap:wrap;}
.ec1-strip-item{display:flex;align-items:center;gap:.5rem;font-size:.8rem;font-weight:600;color:#64748b;white-space:nowrap;}

/* Section labels */
.ec1-eyebrow{font-size:.72rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#0284c7;margin-bottom:.65rem;}
.ec1-h2{font-size:clamp(1.9rem,3.5vw,2.8rem);font-weight:900;letter-spacing:-.03em;line-height:1.1;color:#0f172a;}
.ec1-sub{font-size:.95rem;color:#64748b;line-height:1.7;margin-top:.75rem;}

/* Toggle services */
.ec1-toggle-bg{background:#fff;}
.ec1-toggle-hd{text-align:center;margin-bottom:2.5rem;}
.ec1-tabs{display:flex;background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:4px;width:fit-content;margin:0 auto 3rem;}
.ec1-tab{padding:.6rem 1.6rem;border-radius:8px;border:none;background:transparent;font-size:.875rem;font-weight:600;color:#64748b;transition:background .25s,color .25s,box-shadow .25s;}
.ec1-tab.on{background:#fff;color:#0284c7;box-shadow:0 1px 8px rgba(0,0,0,.1);}
.ec1-svc-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1.25rem;animation:ec1-tab-fade .3s ease;}
@keyframes ec1-tab-fade{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:none;}}
.ec1-svc-card{background:#f8fafc;border:1px solid #e2e8f0;border-radius:14px;padding:1.75rem;transition:border-color .25s,box-shadow .25s,transform .25s;position:relative;overflow:hidden;}
.ec1-svc-card::before{content:'';position:absolute;top:0;left:0;width:4px;height:100%;background:#0284c7;transform:scaleY(0);transform-origin:bottom;transition:transform .35s cubic-bezier(.22,1,.36,1);border-radius:0 2px 2px 0;}
.ec1-svc-card:hover{border-color:#bae6fd;box-shadow:0 4px 24px rgba(2,132,199,.1);transform:translateY(-3px);}
.ec1-svc-card:hover::before{transform:scaleY(1);}
.ec1-svc-icon{width:44px;height:44px;border-radius:10px;background:#f0f9ff;display:flex;align-items:center;justify-content:center;font-size:1.3rem;margin-bottom:1rem;}
.ec1-svc-name{font-size:1rem;font-weight:700;color:#0f172a;margin-bottom:.4rem;}
.ec1-svc-desc{font-size:.85rem;color:#64748b;line-height:1.6;}

/* Stats */
.ec1-stats-bg{background:#0369a1;}
.ec1-stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:2rem;}
.ec1-stat-item{text-align:center;}
.ec1-ring-wrap{position:relative;width:120px;height:120px;margin:0 auto 1.25rem;}
.ec1-ring-svg{transform:rotate(-90deg);}
.ec1-ring-bg{fill:none;stroke:rgba(255,255,255,.12);stroke-width:8;}
.ec1-ring-fill{fill:none;stroke:#f97316;stroke-width:8;stroke-linecap:round;transition:stroke-dasharray 1.4s cubic-bezier(.22,1,.36,1);}
.ec1-ring-num{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:1.6rem;font-weight:900;color:#fff;letter-spacing:-.03em;}
.ec1-ring-sfx{font-size:1rem;color:#f97316;margin-left:1px;}
.ec1-stat-lbl{font-size:.85rem;color:rgba(255,255,255,.65);font-weight:500;}

/* Process */
.ec1-proc-bg{background:#f8fafc;}
.ec1-proc-grid{display:grid;grid-template-columns:1fr 1fr;gap:4rem;align-items:start;margin-top:3rem;}
.ec1-psteps{display:flex;flex-direction:column;gap:.5rem;}
.ec1-pstep{padding:1.25rem 1.5rem;border-radius:12px;cursor:pointer;transition:background .2s;border-left:3px solid transparent;}
.ec1-pstep:hover{background:#fff;}
.ec1-pstep.on{background:#fff;border-left-color:#0284c7;box-shadow:0 2px 16px rgba(0,0,0,.06);}
.ec1-pstep-num{font-size:.72rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#0284c7;margin-bottom:.3rem;}
.ec1-pstep-title{font-size:1rem;font-weight:700;color:#0f172a;}
.ec1-pstep-short{font-size:.85rem;color:#64748b;line-height:1.6;margin-top:.4rem;max-height:0;overflow:hidden;transition:max-height .3s ease,opacity .3s ease;opacity:0;}
.ec1-pstep.on .ec1-pstep-short{max-height:100px;opacity:1;}
.ec1-proc-panel{background:#fff;border-radius:20px;padding:2.5rem;border:1px solid #e2e8f0;position:sticky;top:5rem;transition:opacity .25s ease,transform .25s ease;}
.ec1-proc-panel.sw{opacity:0;transform:translateY(8px);}
.ec1-proc-icon{width:64px;height:64px;border-radius:16px;background:#f0f9ff;display:flex;align-items:center;justify-content:center;font-size:2rem;margin-bottom:1.5rem;}
.ec1-proc-title{font-size:1.4rem;font-weight:800;color:#0f172a;margin-bottom:.75rem;}
.ec1-proc-desc{font-size:.95rem;color:#64748b;line-height:1.75;margin-bottom:1.5rem;}
.ec1-proc-note{display:flex;align-items:center;gap:.6rem;background:#f0f9ff;padding:.75rem 1rem;border-radius:8px;font-size:.82rem;color:#0284c7;font-weight:600;}

/* Gallery */
.ec1-gallery-bg{background:#fff;}
.ec1-gallery-hd{display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:2rem;gap:2rem;}
.ec1-gallery-wrap{position:relative;overflow:hidden;}
.ec1-gallery-wrap::after{content:'';position:absolute;top:0;right:0;bottom:0;width:80px;background:linear-gradient(to left,#fff,transparent);pointer-events:none;z-index:2;}
.ec1-gallery-track{display:flex;gap:1.25rem;overflow-x:auto;padding-bottom:1rem;cursor:grab;user-select:none;scrollbar-width:none;-ms-overflow-style:none;}
.ec1-gallery-track::-webkit-scrollbar{display:none;}
.ec1-gallery-track:active{cursor:grabbing;}
.ec1-proj-card{min-width:280px;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;flex-shrink:0;transition:transform .3s,box-shadow .3s;}
.ec1-proj-card:hover{transform:translateY(-4px);box-shadow:0 12px 36px rgba(0,0,0,.1);}
.ec1-proj-img{height:180px;background:linear-gradient(135deg,#1e293b,#0f172a);display:flex;align-items:center;justify-content:center;font-size:3rem;position:relative;}
.ec1-proj-tag{position:absolute;top:.75rem;left:.75rem;background:#0284c7;color:#fff;padding:.3rem .8rem;border-radius:100px;font-size:.72rem;font-weight:700;}
.ec1-proj-body{padding:1.25rem;}
.ec1-proj-name{font-size:.95rem;font-weight:700;color:#0f172a;margin-bottom:.3rem;}
.ec1-proj-loc{font-size:.8rem;color:#64748b;}

/* Team */
.ec1-team-bg{background:#f8fafc;}
.ec1-team-hd{text-align:center;margin-bottom:3rem;}
.ec1-team-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1.5rem;}
.ec1-team-card{background:#fff;border-radius:16px;padding:2rem;text-align:center;border:1px solid #e2e8f0;transition:transform .3s,box-shadow .3s;}
.ec1-team-card:hover{transform:translateY(-4px);box-shadow:0 8px 32px rgba(0,0,0,.08);}
.ec1-team-avatar{width:72px;height:72px;border-radius:50%;background:linear-gradient(135deg,#0369a1,#0284c7);display:flex;align-items:center;justify-content:center;font-size:1.6rem;font-weight:900;color:#fff;margin:0 auto 1.1rem;}
.ec1-team-name{font-size:1.05rem;font-weight:800;color:#0f172a;margin-bottom:.25rem;}
.ec1-team-role{font-size:.85rem;color:#0284c7;font-weight:600;margin-bottom:.5rem;}
.ec1-team-exp{font-size:.8rem;color:#64748b;}
.ec1-team-badge{display:inline-block;margin-top:.75rem;background:#f0f9ff;color:#0284c7;padding:.3rem .75rem;border-radius:100px;font-size:.72rem;font-weight:700;}

/* Compliance */
.ec1-comp-bg{background:#fff;}
.ec1-comp-hd{text-align:center;margin-bottom:3rem;}
.ec1-comp-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1.25rem;}
.ec1-cert-card{background:#f8fafc;border:1px solid #e2e8f0;border-radius:14px;padding:1.5rem;display:flex;align-items:center;gap:1rem;transition:border-color .25s,box-shadow .25s;}
.ec1-cert-card:hover{border-color:#bae6fd;box-shadow:0 2px 16px rgba(2,132,199,.08);}
.ec1-cert-svg-wrap{width:40px;height:40px;flex-shrink:0;}
.ec1-cert-svg{width:40px;height:40px;}
.ec1-cert-bg{fill:#f0f9ff;}
.ec1-cert-circle{fill:none;stroke:#bae6fd;stroke-width:2;}
.ec1-cert-mark{fill:none;stroke:#0284c7;stroke-width:2.5;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:20;stroke-dashoffset:20;transition:stroke-dashoffset .5s ease;}
.ec1-cert-card.ck .ec1-cert-mark{stroke-dashoffset:0;}
.ec1-cert-name{font-size:.9rem;font-weight:700;color:#0f172a;}
.ec1-cert-sub{font-size:.8rem;color:#64748b;margin-top:.2rem;}

/* Testimonials masonry */
.ec1-testi-bg{background:#f8fafc;}
.ec1-testi-hd{text-align:center;margin-bottom:3rem;}
.ec1-masonry{columns:3;gap:1.25rem;}
.ec1-tcard{background:#fff;border:1px solid #e2e8f0;border-radius:16px;padding:1.75rem;break-inside:avoid;margin-bottom:1.25rem;}
.ec1-tcard.hl{background:#f0f9ff;border-color:#bae6fd;}
.ec1-tcard-stars{display:flex;gap:.2rem;color:#f59e0b;font-size:1rem;margin-bottom:1rem;}
.ec1-tcard-text{font-size:.9rem;color:#1e293b;line-height:1.75;font-style:italic;margin-bottom:1.25rem;}
.ec1-tcard.hl .ec1-tcard-text{color:#0369a1;}
.ec1-tcard-author{display:flex;align-items:center;gap:.75rem;}
.ec1-tcard-av{width:38px;height:38px;border-radius:50%;background:linear-gradient(135deg,#0369a1,#0284c7);display:flex;align-items:center;justify-content:center;font-size:.9rem;font-weight:800;color:#fff;flex-shrink:0;}
.ec1-tcard-name{font-size:.875rem;font-weight:700;color:#0f172a;}
.ec1-tcard-role{font-size:.75rem;color:#64748b;}

/* CTA diagonal split */
.ec1-cta{position:relative;overflow:hidden;min-height:420px;display:flex;}
.ec1-cta-l{flex:1;background:#0f172a;display:flex;flex-direction:column;justify-content:center;clip-path:polygon(0 0,56% 0,50% 100%,0 100%);padding:5rem 12% 5rem 2.5rem;}
.ec1-cta-r{flex:1;background:#0284c7;display:flex;flex-direction:column;justify-content:center;margin-left:-8%;padding:5rem 2.5rem 5rem 12%;}
.ec1-cta-ey{font-size:.72rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:rgba(255,255,255,.5);margin-bottom:.75rem;}
.ec1-cta-h{font-size:clamp(1.6rem,3vw,2.4rem);font-weight:900;color:#fff;letter-spacing:-.03em;line-height:1.15;margin-bottom:.75rem;}
.ec1-cta-phone{font-size:clamp(1.8rem,4vw,2.8rem);font-weight:900;color:#f97316;letter-spacing:-.03em;margin:.5rem 0 1rem;display:block;transition:color .2s;}
.ec1-cta-phone:hover{color:#ea580c;}
.ec1-cta-email{color:rgba(255,255,255,.5);font-size:.875rem;}
.ec1-cta-avail{margin-top:1.25rem;color:rgba(255,255,255,.4);font-size:.8rem;}
.ec1-cta-form{display:flex;flex-direction:column;gap:.75rem;}
.ec1-cta-lbl{font-size:.78rem;font-weight:600;color:rgba(255,255,255,.7);display:block;margin-bottom:.25rem;}
.ec1-cta-input,.ec1-cta-select{width:100%;padding:.75rem 1rem;border-radius:8px;border:1px solid rgba(255,255,255,.2);background:rgba(255,255,255,.1);color:#fff;font-size:.9rem;font-family:inherit;transition:border-color .2s,background .2s;}
.ec1-cta-input::placeholder{color:rgba(255,255,255,.4);}
.ec1-cta-input:focus,.ec1-cta-select:focus{outline:none;border-color:rgba(255,255,255,.5);background:rgba(255,255,255,.15);}
.ec1-cta-select option{background:#0369a1;color:#fff;}
.ec1-cta-submit{background:#fff;color:#0284c7;padding:.85rem;border-radius:8px;font-weight:700;font-size:.95rem;border:none;cursor:pointer;margin-top:.25rem;transition:background .2s,transform .2s;width:100%;}
.ec1-cta-submit:hover{background:#f0f9ff;transform:translateY(-1px);}

/* Footer */
.ec1-footer{background:#0f172a;padding:4rem 2.5rem 2rem;}
.ec1-footer-grid{max-width:1200px;margin:0 auto;display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:3rem;}
.ec1-footer-brand{font-size:1.2rem;font-weight:800;color:#fff;margin-bottom:.75rem;display:flex;align-items:center;gap:.4rem;}
.ec1-footer-bolt{color:#f97316;}
.ec1-footer-blurb{font-size:.875rem;color:rgba(255,255,255,.4);line-height:1.6;}
.ec1-footer-contact{margin-top:.75rem;font-size:.875rem;color:rgba(255,255,255,.4);line-height:1.9;}
.ec1-footer-col-hd{font-size:.7rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.3);margin-bottom:.9rem;}
.ec1-footer-links{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:.55rem;}
.ec1-footer-links a{color:rgba(255,255,255,.55);font-size:.875rem;transition:color .2s;}
.ec1-footer-links a:hover{color:#f97316;}
.ec1-footer-bottom{max-width:1200px;margin:2.5rem auto 0;padding-top:2rem;border-top:1px solid rgba(255,255,255,.06);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1rem;}
.ec1-footer-copy{font-size:.78rem;color:rgba(255,255,255,.28);}
.ec1-footer-live{display:flex;align-items:center;gap:.4rem;font-size:.78rem;color:rgba(255,255,255,.28);}
.ec1-live-dot{width:6px;height:6px;border-radius:50%;background:#22c55e;}

/* Responsive */
@container(max-width:1024px){
  .ec1-hero{grid-template-columns:1fr;gap:3rem;padding-top:6rem;}
  .ec1-stats-grid{grid-template-columns:repeat(2,1fr);gap:2.5rem;}
  .ec1-proc-grid{grid-template-columns:1fr;gap:2rem;}
  .ec1-proc-panel{position:static;}
  .ec1-comp-grid{grid-template-columns:repeat(2,1fr);}
  .ec1-footer-grid{grid-template-columns:1fr 1fr;gap:2rem;}
  .ec1-svc-grid{grid-template-columns:repeat(2,1fr);}
  .ec1-team-grid{grid-template-columns:repeat(2,1fr);}
}
@container(max-width:768px){
  .ec1-nav-links,.ec1-nav-cta{display:none;}
  .ec1-nav-mob{display:flex;}
  .ec1-sec{padding:4rem 1.25rem;}
  .ec1-nav{padding:.9rem 1.25rem;}
  .ec1-nav.sc{padding:.7rem 1.25rem;}
  .ec1-trust-strip{gap:1.25rem;padding:.75rem 1.25rem;}
  .ec1-svc-grid{grid-template-columns:1fr;}
  .ec1-stats-grid{grid-template-columns:repeat(2,1fr);}
  .ec1-masonry{columns:1;}
  .ec1-comp-grid{grid-template-columns:1fr;}
  .ec1-team-grid{grid-template-columns:1fr;}
  .ec1-footer-grid{grid-template-columns:1fr;gap:2rem;}
  .ec1-footer-bottom{flex-direction:column;text-align:center;}
  .ec1-cta{flex-direction:column;}
  .ec1-cta-l{clip-path:none;padding:3.5rem 1.25rem 2.5rem;}
  .ec1-cta-r{margin-left:0;padding:2.5rem 1.25rem 3.5rem;}
  .ec1-gallery-hd{flex-direction:column;align-items:flex-start;}
  .ec1-hero{padding:6rem 1.25rem 3rem;}
}
@container(max-width:480px){
  .ec1-stats-grid{grid-template-columns:1fr 1fr;}
  .ec1-h1{font-size:2.2rem;}
}
`;

// ── Component ─────────────────────────────────────────────────────────────────
export default function Electrician1({ businessData: bd, isPreview }: TemplateProps) {
  const services     = bd.services?.length      ? bd.services      : DEFAULT_SERVICES;
  const testimonials = bd.testimonials?.length   ? bd.testimonials  : DEFAULT_TESTIMONIALS;
  const stats        = bd.stats?.length          ? bd.stats         : DEFAULT_STATS;
  const certs        = bd.certifications?.length ? bd.certifications : DEFAULT_CERTIFICATIONS;
  const areas        = bd.serviceAreas           ?? [];

  // Split services: first half residential, second half commercial
  const half    = Math.ceil(services.length / 2);
  const resSvcs = services.slice(0, half);
  const comSvcs = services.slice(half).length ? services.slice(half) : services.slice(0, half);

  // State
  const [scrolled,       setScrolled]       = useState(false);
  const [mobileOpen,     setMobileOpen]     = useState(false);
  const [activeTab,      setActiveTab]      = useState<'res' | 'com'>('res');
  const [activeStep,     setActiveStep]     = useState(0);
  const [panelSw,        setPanelSw]        = useState(false);
  const [statVals,       setStatVals]       = useState<number[]>(stats.map(() => 0));
  const [rings,          setRings]          = useState<number[]>(stats.map(() => 0));
  const [certChecked,    setCertChecked]    = useState<boolean[]>(certs.map(() => false));

  const statsRef   = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const certRefs   = useRef<(HTMLDivElement | null)[]>([]);

  const circumference = 2 * Math.PI * 45;

  // Nav scroll
  useEffect(() => {
    if (isPreview) return;
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, [isPreview]);

  // Circular stats animation
  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      obs.disconnect();
      setRings(stats.map((_, i) => circumference * ((RING_PCTS[i % RING_PCTS.length] ?? 80) / 100)));
      stats.forEach((stat, i) => {
        const raw    = typeof stat.value === 'string' ? parseFloat(stat.value.replace(/[^0-9.]/g, '')) : stat.value;
        const target = isNaN(raw) ? 0 : raw;
        const start  = performance.now();
        const tick   = (now: number) => {
          const p     = Math.min((now - start) / 1600, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          setStatVals(prev => { const n = [...prev]; n[i] = Math.round(eased * target); return n; });
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [stats, circumference]);

  // Cert checkmark draw animations
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    certRefs.current.forEach((el, i) => {
      if (!el) return;
      const obs = new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting) return;
        setCertChecked(prev => { const n = [...prev]; n[i] = true; return n; });
        obs.unobserve(el);
      }, { threshold: 0.4 });
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  }, [certs.length]);

  // Gallery drag scroll
  useEffect(() => {
    const el = galleryRef.current;
    if (!el) return;
    let dragging = false, startX = 0, scrollL = 0;
    const onDown = (e: MouseEvent) => { dragging = true; startX = e.pageX - el.offsetLeft; scrollL = el.scrollLeft; };
    const onUp   = () => { dragging = false; };
    const onMove = (e: MouseEvent) => {
      if (!dragging) return;
      e.preventDefault();
      el.scrollLeft = scrollL - (e.pageX - el.offsetLeft - startX);
    };
    el.addEventListener('mousedown', onDown);
    document.addEventListener('mouseup', onUp);
    document.addEventListener('mousemove', onMove);
    return () => {
      el.removeEventListener('mousedown', onDown);
      document.removeEventListener('mouseup', onUp);
      document.removeEventListener('mousemove', onMove);
    };
  }, []);

  // Process step switch with fade
  const switchStep = useCallback((idx: number) => {
    if (idx === activeStep) return;
    setPanelSw(true);
    setTimeout(() => { setActiveStep(idx); setPanelSw(false); }, 220);
  }, [activeStep]);

  const year        = new Date().getFullYear();
  const footerAreas = areas.length ? areas.slice(0, 5) : [bd.city];

  const scrollTo = (id: string) => {
    if (typeof window === 'undefined') return;
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const GALLERY_CARDS = [
    { icon: '🏠', tag: 'Panel Upgrade', name: '200A Panel Upgrade'      },
    { icon: '🚗', tag: 'EV Charger',    name: 'EV Charger Install'       },
    { icon: '💡', tag: 'Lighting',      name: 'Full Home LED Retrofit'   },
    { icon: '🏢', tag: 'Commercial',    name: 'Office Suite Rewiring'    },
    { icon: '🏡', tag: 'Smart Home',    name: 'Smart Home Automation'    },
    { icon: '🔋', tag: 'Generator',     name: 'Whole-Home Generator'     },
  ];

  const TEAM = [
    { initials: 'MR', name: 'Mike Reynolds', role: 'Master Electrician',    exp: '18 years of experience', badge: 'Founder & Lead'    },
    { initials: 'SL', name: 'Sarah Lawton',  role: 'Journeyman Electrician', exp: '11 years of experience', badge: 'EV Specialist'      },
    { initials: 'DK', name: 'David Kim',     role: 'Journeyman Electrician', exp: '7 years of experience',  badge: 'Smart Home Expert' },
  ];

  return (
    <div className="ec1-wrap">
      <style suppressHydrationWarning>{STYLES}</style>

      {/* ── Nav ── */}
      <nav className={`ec1-nav${scrolled ? ' sc' : ''}`}>
        <div className="ec1-logo">
          <span className="ec1-logo-bolt">⚡</span>
          {bd.name}
        </div>
        <ul className="ec1-nav-links">
          <li><a href="#ec1-services">Services</a></li>
          <li><a href="#ec1-process">How It Works</a></li>
          <li><a href="#ec1-team">Team</a></li>
          <li><a href="#ec1-contact">Contact</a></li>
        </ul>
        <button className="ec1-nav-cta" onClick={() => scrollTo('ec1-contact')}>
          {bd.copy?.nav_cta || 'Get a Free Quote'}
        </button>
        <button className="ec1-nav-mob" onClick={() => setMobileOpen(true)} aria-label="Menu">
          <span /><span /><span />
        </button>
      </nav>

      {/* ── Mobile menu ── */}
      <div className={`ec1-mob-menu${mobileOpen ? ' open' : ''}`}>
        <button className="ec1-mob-close" onClick={() => setMobileOpen(false)}>×</button>
        {['Services', 'How It Works', 'Team', 'Contact'].map((label, i) => (
          <a
            key={label}
            href={['#ec1-services','#ec1-process','#ec1-team','#ec1-contact'][i]}
            onClick={() => setMobileOpen(false)}
          >
            {label}
          </a>
        ))}
        <button
          className="ec1-mob-cta"
          onClick={() => { setMobileOpen(false); scrollTo('ec1-contact'); }}
        >
          {bd.copy?.nav_cta || 'Get a Free Quote'}
        </button>
      </div>

      {/* ── Hero ── */}
      <section className="ec1-hero">
        {/* Left */}
        <div>
          <Reveal>
            <div className="ec1-eyebrow-pill">
              <span className="ec1-eyebrow-dot" />
              Licensed Electricians · {bd.city}
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="ec1-h1">
              {bd.tagline ? (
                <>{bd.tagline}</>
              ) : (
                <>Power Your {bd.city}.<br />Trust the <span className="ec1-accent">Experts.</span></>
              )}
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="ec1-hero-sub">
              {bd.subTagline || bd.description ||
                `Certified electricians serving ${bd.city} and surrounding areas. Fast, safe, to-code — backed by a 100% satisfaction guarantee.`}
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="ec1-hero-btns">
              <button className="ec1-btn-p" onClick={() => scrollTo('ec1-contact')}>
                ⚡ {bd.copy?.hero_cta_primary || 'Get Free Quote'}
              </button>
              {bd.phone && (
                <a href={`tel:${bd.phone.replace(/\D/g, '')}`} className="ec1-btn-o">
                  📞 {bd.phone}
                </a>
              )}
            </div>
          </Reveal>
          <Reveal delay={0.4}>
            <div className="ec1-hero-trust">
              {['Licensed & Insured', 'Same-Day Service', 'Upfront Pricing', '5-Star Rated'].map(t => (
                <div key={t} className="ec1-trust-chip">
                  <div className="ec1-trust-icon">✓</div> {t}
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        {/* Right — dark bolt card */}
        <Reveal delay={0.2} dir="right">
          <div className="ec1-card">
            <div className="ec1-glow1" />
            <div className="ec1-glow2" />
            <svg className="ec1-bolt-svg" viewBox="0 0 80 120">
              <path className="ec1-bolt-fill" d="M58 4 L14 66 L38 66 L22 116 L68 48 L44 48 Z" />
              <path className="ec1-bolt-path"  d="M58 4 L14 66 L38 66 L22 116 L68 48 L44 48 Z" />
            </svg>
            <div className="ec1-bolt-lbl">Services We Cover</div>
            <div className="ec1-ticker-wrap">
              <div className="ec1-ticker-track">
                {[...TICKER_SERVICES, ...TICKER_SERVICES].map((s, i) => (
                  <div key={i} className="ec1-ticker-item">
                    <span className="ec1-ticker-dot" />
                    <span className="ec1-ticker-name">{s}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── Trust Strip ── */}
      <div className="ec1-trust-strip">
        {[
          { icon: '🏅', text: 'Master Electrician License'    },
          { icon: '🛡️', text: '$2M Liability Coverage'        },
          { icon: '⭐', text: '4.9 / 5 Rating (380+ Reviews)' },
          { icon: '🚨', text: '24/7 Emergency Response'       },
          { icon: '🔧', text: 'Work Guaranteed'               },
        ].map(item => (
          <div key={item.text} className="ec1-strip-item">
            <span>{item.icon}</span> {item.text}
          </div>
        ))}
      </div>

      {/* ── Toggle Services ── */}
      <section className="ec1-sec ec1-toggle-bg" id="ec1-services">
        <div className="ec1-inner">
          <div className="ec1-toggle-hd">
            <Reveal><div className="ec1-eyebrow">{bd.copy?.services_label || 'What We Do'}</div></Reveal>
            <Reveal delay={0.05}><h2 className="ec1-h2">{bd.copy?.services_heading || 'Expert Electrical Services'}</h2></Reveal>
            <Reveal delay={0.1}>
              <p className="ec1-sub" style={{ maxWidth: 500, margin: '0 auto' }}>
                {bd.copy?.services_subheading || "Whether it's your home or business, we handle every job safely and up to code."}
              </p>
            </Reveal>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="ec1-tabs">
              <button className={`ec1-tab${activeTab === 'res' ? ' on' : ''}`} onClick={() => setActiveTab('res')}>🏠 Residential</button>
              <button className={`ec1-tab${activeTab === 'com' ? ' on' : ''}`} onClick={() => setActiveTab('com')}>🏢 Commercial</button>
            </div>
          </div>
          <div className="ec1-svc-grid">
            {(activeTab === 'res' ? resSvcs : comSvcs).map((svc, i) => (
              <div key={`${activeTab}-${i}`} className="ec1-svc-card">
                <div className="ec1-svc-icon">{SVC_ICONS[i % SVC_ICONS.length]}</div>
                <div className="ec1-svc-name">{svc.name}</div>
                {svc.description && <div className="ec1-svc-desc">{svc.description}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="ec1-sec ec1-stats-bg" ref={statsRef}>
        <div className="ec1-inner">
          <div className="ec1-stats-grid">
            {stats.map((stat, i) => {
              const filled     = rings[i] ?? 0;
              const displayVal = statVals[i] >= 1000 ? (statVals[i] ?? 0).toLocaleString() : statVals[i];
              return (
                <div key={i} className="ec1-stat-item">
                  <div className="ec1-ring-wrap">
                    <svg className="ec1-ring-svg" viewBox="0 0 100 100" width="120" height="120">
                      <circle className="ec1-ring-bg"   cx="50" cy="50" r="45" />
                      <circle
                        className="ec1-ring-fill"
                        cx="50" cy="50" r="45"
                        style={{ strokeDasharray: `${filled} ${circumference}` }}
                      />
                    </svg>
                    <div className="ec1-ring-num">
                      {displayVal}<span className="ec1-ring-sfx">{stat.suffix ?? ''}</span>
                    </div>
                  </div>
                  <div className="ec1-stat-lbl">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Process ── */}
      <section className="ec1-sec ec1-proc-bg" id="ec1-process">
        <div className="ec1-inner">
          <Reveal><div className="ec1-eyebrow">How It Works</div></Reveal>
          <Reveal delay={0.05}><h2 className="ec1-h2">Simple. Safe. Done Right.</h2></Reveal>
          <div className="ec1-proc-grid">
            <div className="ec1-psteps">
              {PROCESS_STEPS.map((step, i) => (
                <Reveal key={i} delay={i * 0.08}>
                  <div
                    className={`ec1-pstep${activeStep === i ? ' on' : ''}`}
                    onClick={() => switchStep(i)}
                  >
                    <div className="ec1-pstep-num">{step.num}</div>
                    <div className="ec1-pstep-title">{step.title}</div>
                    <div className="ec1-pstep-short">{step.short}</div>
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal dir="right">
              <div className={`ec1-proc-panel${panelSw ? ' sw' : ''}`}>
                <div className="ec1-proc-icon">{PROCESS_STEPS[activeStep]?.icon}</div>
                <div className="ec1-proc-title">{PROCESS_STEPS[activeStep]?.title}</div>
                <div className="ec1-proc-desc">{PROCESS_STEPS[activeStep]?.full}</div>
                <div className="ec1-proc-note">{PROCESS_STEPS[activeStep]?.note}</div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Project Gallery ── */}
      <section className="ec1-sec ec1-gallery-bg">
        <div className="ec1-inner">
          <div className="ec1-gallery-hd">
            <div>
              <Reveal><div className="ec1-eyebrow">{bd.copy?.gallery_label || 'Recent Work'}</div></Reveal>
              <Reveal delay={0.05}><h2 className="ec1-h2">{bd.copy?.gallery_heading || "Jobs We've Completed"}</h2></Reveal>
            </div>
            <Reveal dir="right">
              <p className="ec1-sub" style={{ maxWidth: 300 }}>
                Scroll through recent projects across {bd.city} and surrounding areas.
              </p>
            </Reveal>
          </div>
          <Reveal>
            <div className="ec1-gallery-wrap">
              <div className="ec1-gallery-track" ref={galleryRef}>
                {GALLERY_CARDS.map((proj, i) => (
                  <div key={i} className="ec1-proj-card">
                    <div className="ec1-proj-img">
                      {proj.icon}
                      <div className="ec1-proj-tag">{proj.tag}</div>
                    </div>
                    <div className="ec1-proj-body">
                      <div className="ec1-proj-name">{proj.name}</div>
                      <div className="ec1-proj-loc">📍 {bd.city}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Team ── */}
      <section className="ec1-sec ec1-team-bg" id="ec1-team">
        <div className="ec1-inner">
          <div className="ec1-team-hd">
            <Reveal><div className="ec1-eyebrow">{bd.copy?.team_label || 'Our Electricians'}</div></Reveal>
            <Reveal delay={0.05}><h2 className="ec1-h2">{bd.copy?.team_heading || 'Meet the Team'}</h2></Reveal>
            <Reveal delay={0.1}>
              <p className="ec1-sub" style={{ maxWidth: 460, margin: '0 auto' }}>
                Every technician is licensed, background-checked, and committed to doing the job right.
              </p>
            </Reveal>
          </div>
          <div className="ec1-team-grid">
            {TEAM.map((m, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="ec1-team-card">
                  <div className="ec1-team-avatar">{m.initials}</div>
                  <div className="ec1-team-name">{m.name}</div>
                  <div className="ec1-team-role">{m.role}</div>
                  <div className="ec1-team-exp">{m.exp}</div>
                  <div className="ec1-team-badge">{m.badge}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Compliance ── */}
      <section className="ec1-sec ec1-comp-bg">
        <div className="ec1-inner">
          <div className="ec1-comp-hd">
            <Reveal><div className="ec1-eyebrow">Credentials</div></Reveal>
            <Reveal delay={0.05}><h2 className="ec1-h2">Licensed, Certified &amp; Compliant</h2></Reveal>
            <Reveal delay={0.1}>
              <p className="ec1-sub" style={{ maxWidth: 480, margin: '0 auto' }}>
                We carry every licence and certification required to work safely and legally in your home or business.
              </p>
            </Reveal>
          </div>
          <div className="ec1-comp-grid">
            {certs.map((cert, i) => (
              <div
                key={i}
                className={`ec1-cert-card${certChecked[i] ? ' ck' : ''}`}
                ref={el => { certRefs.current[i] = el; }}
              >
                <div className="ec1-cert-svg-wrap">
                  <svg className="ec1-cert-svg" viewBox="0 0 40 40">
                    <circle className="ec1-cert-bg"     cx="20" cy="20" r="19" />
                    <circle className="ec1-cert-circle" cx="20" cy="20" r="19" />
                    <polyline className="ec1-cert-mark" points="12,21 18,27 28,14" />
                  </svg>
                </div>
                <div>
                  <div className="ec1-cert-name">{cert}</div>
                  <div className="ec1-cert-sub">{CERT_SUBTITLES[cert] || 'Verified & Certified'}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials Masonry ── */}
      <section className="ec1-sec ec1-testi-bg">
        <div className="ec1-inner">
          <div className="ec1-testi-hd">
            <Reveal><div className="ec1-eyebrow">{bd.copy?.testimonials_label || 'Reviews'}</div></Reveal>
            <Reveal delay={0.05}><h2 className="ec1-h2">What Our Customers Say</h2></Reveal>
          </div>
          <Reveal>
            <div className="ec1-masonry">
              {testimonials.map((t, i) => (
                <div key={i} className={`ec1-tcard${i === 1 ? ' hl' : ''}`}>
                  <div className="ec1-tcard-stars">{starStr(t.rating)}</div>
                  <p className="ec1-tcard-text">&ldquo;{t.text}&rdquo;</p>
                  <div className="ec1-tcard-author">
                    <div className="ec1-tcard-av">{getInitials(t.name)}</div>
                    <div>
                      <div className="ec1-tcard-name">{t.name}</div>
                      {t.context && <div className="ec1-tcard-role">{t.context}</div>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── CTA Diagonal Split ── */}
      <div className="ec1-cta" id="ec1-contact">
        <div className="ec1-cta-l">
          <div className="ec1-cta-ey">Get In Touch</div>
          <div className="ec1-cta-h">{bd.copy?.cta_heading || 'Ready to get started?'}</div>
          {bd.phone && (
            <a href={`tel:${bd.phone.replace(/\D/g, '')}`} className="ec1-cta-phone">
              📞 {bd.phone}
            </a>
          )}
          {bd.email && <div className="ec1-cta-email">{bd.email}</div>}
          <div className="ec1-cta-avail">Available 24/7 for emergencies</div>
        </div>
        <div className="ec1-cta-r">
          <div className="ec1-cta-ey" style={{ color: 'rgba(255,255,255,.65)' }}>Request a Quote</div>
          <div className="ec1-cta-h" style={{ fontSize: '1.5rem', marginBottom: '1.25rem' }}>
            {bd.copy?.cta_subheading || "We'll get back to you within the hour."}
          </div>
          <form className="ec1-cta-form" onSubmit={e => e.preventDefault()}>
            <div>
              <label className="ec1-cta-lbl">Your Name</label>
              <input type="text" className="ec1-cta-input" placeholder="John Smith" />
            </div>
            <div>
              <label className="ec1-cta-lbl">Phone Number</label>
              <input type="tel" className="ec1-cta-input" placeholder="(555) 000-0000" />
            </div>
            <div>
              <label className="ec1-cta-lbl">Service Needed</label>
              <select className="ec1-cta-select">
                <option value="">Select a service…</option>
                {services.slice(0, 7).map(s => <option key={s.name}>{s.name}</option>)}
                <option>Emergency Service</option>
                <option>Other</option>
              </select>
            </div>
            <button type="submit" className="ec1-cta-submit">
              {bd.copy?.cta_primary || 'Send Request ⚡'}
            </button>
          </form>
        </div>
      </div>

      {/* ── Footer ── */}
      <footer className="ec1-footer">
        <div className="ec1-footer-grid">
          <div>
            <div className="ec1-footer-brand">
              <span className="ec1-footer-bolt">⚡</span>{bd.name}
            </div>
            <p className="ec1-footer-blurb">
              Licensed electricians serving {bd.city} and surrounding areas. Residential, commercial, and emergency electrical services.
            </p>
            <div className="ec1-footer-contact">
              {bd.phone   && <div>{bd.phone}</div>}
              {bd.email   && <div>{bd.email}</div>}
              {bd.address ? <div>{bd.address}</div> : <div>{bd.city}</div>}
            </div>
          </div>
          <div>
            <div className="ec1-footer-col-hd">Services</div>
            <ul className="ec1-footer-links">
              {services.slice(0, 4).map(s => (
                <li key={s.name}><a href="#ec1-services">{s.name}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <div className="ec1-footer-col-hd">Company</div>
            <ul className="ec1-footer-links">
              {['About Us', 'Our Team', 'Reviews', 'Contact'].map(l => (
                <li key={l}><a href={l === 'Contact' ? '#ec1-contact' : '#'}>{l}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <div className="ec1-footer-col-hd">Service Areas</div>
            <ul className="ec1-footer-links">
              {footerAreas.map(a => <li key={a}><a href="#">{a}</a></li>)}
            </ul>
          </div>
        </div>
        <div className="ec1-footer-bottom">
          <span className="ec1-footer-copy">© {year} {bd.name}. All rights reserved.</span>
          <span className="ec1-footer-live">
            <span className="ec1-live-dot" />Serving {bd.city}
          </span>
        </div>
      </footer>
    </div>
  );
}
