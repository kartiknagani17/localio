'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { TemplateProps, ServiceItem, Testimonial, Stat, FAQ } from '../types';

// ── Default data ──────────────────────────────────────────────────────────────
const DEFAULT_SERVICES: ServiceItem[] = [
  { name: 'Panel Upgrades & Replacement',     price: 'From $1,200', description: 'Upgrade aging 100A panels to modern 200A or 400A service. Code-compliant work with city permit filing included.' },
  { name: 'EV Charger Installation',          price: 'From $599',   description: 'Level 2 home charger installation for all EV models. Dedicated 50A circuit with weatherproof exterior outlet.' },
  { name: 'Emergency Electrical Repairs',     price: 'Call for pricing', description: 'Tripped breakers, flickering lights, burning smells — we respond within 2 hours. Available 24/7 for urgent issues.' },
  { name: 'Smart Home Wiring',                price: 'From $450',   description: 'Structured data cabling, smart switch pre-wiring, whole-home surge protection, and home automation integration.' },
  { name: 'LED & Lighting Upgrades',          price: 'From $175',   description: 'Recessed lighting installation, under-cabinet LEDs, dimmer upgrades, and exterior security lighting.' },
  { name: 'Safety Inspections & Compliance',  price: 'From $249',   description: 'Full home electrical inspection with written report. GFCI/AFCI upgrades, smoke detector wiring, and code corrections.' },
];

const DEFAULT_STATS: Stat[] = [
  { value: 98, label: 'Customer Satisfaction', suffix: '%' },
  { value: 94, label: 'Same-Day Response Rate', suffix: '%' },
  { value: 91, label: 'First-Visit Fix Rate', suffix: '%' },
  { value: 87, label: '5-Star Google Reviews', suffix: '%' },
];

const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    name: 'Marcus R.',
    text: 'Our panel was 40 years old and starting to arc. They showed up the same afternoon I called, gave a straight price, and had the new 200A panel installed by 5pm. The electrician even labeled every breaker and cleaned up every scrap of wire. None of the three electrical companies I\'ve hired over the years come close to this level of professionalism.',
    rating: 5,
    context: 'Panel Upgrade — Austin TX',
  },
  {
    name: 'Jennifer T.',
    text: 'Had two EV chargers installed in my garage — one for my Tesla and one for my wife\'s Ioniq. Job was done in under 4 hours, permits handled, no mess. Would 100% recommend.',
    rating: 5,
    context: 'EV Charger Install',
  },
  {
    name: 'David K.',
    text: 'Burning smell from an outlet at 9pm — they were at my door by 11pm. Fixed a dangerous loose connection that could have started a fire. Honest, fast, and fairly priced.',
    rating: 5,
    context: 'Emergency Repair',
  },
];

const DEFAULT_FAQS: FAQ[] = [
  { q: 'Are you licensed and insured?', a: 'Yes — we hold a valid Master Electrician license and carry $2 million in general liability insurance plus workers\' compensation. We\'ll email you our certificates of insurance before any job starts.' },
  { q: 'Do you handle both residential and commercial?', a: 'Absolutely. We work on single-family homes, multi-family buildings, offices, retail spaces, and light industrial facilities. Our commercial team has experience with 3-phase power, switchgear, and tenant fit-outs.' },
  { q: 'How quickly can you respond to an emergency?', a: 'We aim to be on-site within 2 hours for genuine electrical emergencies (sparking outlets, burning smells, complete power loss). We\'re available 24/7 — call our emergency line and a live dispatcher will answer.' },
  { q: 'Will you pull the necessary permits?', a: 'Yes — we handle all permit applications and city inspections on your behalf for work that requires it. Permit costs are itemized separately on your quote so there are no surprises.' },
];

const DEFAULT_AREAS = ['Downtown', 'North Side', 'South Side', 'East Side', 'West Side', 'Suburbs'];

const PROCESS_STEPS = [
  { num: '1', title: 'Call or Book Online',  desc: 'Describe your issue. We\'ll give you an upfront estimate and schedule a time that works for you.' },
  { num: '2', title: 'On-Site Diagnosis',    desc: 'Our licensed electrician arrives on time, fully stocked, and diagnoses the issue thoroughly.' },
  { num: '3', title: 'Transparent Quote',    desc: 'You approve the price before any work begins. Zero hidden fees or surprise add-ons.' },
  { num: '4', title: 'Clean Completion',     desc: 'Work is done right, inspected, and the area is left cleaner than we found it. Guaranteed.' },
];

// Bar data is derived from stats — pct comes from stat.value parsed as number
function getPct(v: string | number): number {
  const n = typeof v === 'number' ? v : parseFloat(String(v).replace(/[^0-9.]/g, ''));
  return isNaN(n) ? 80 : Math.max(5, Math.min(100, n));
}

function getInitials(name: string | undefined): string {
  if (!name) return '?';
  return name.split(' ').slice(0, 2).map(w => w[0] ?? '').join('').toUpperCase();
}

function starStr(rating: number | undefined): string {
  const r = typeof rating === 'number' ? rating : 5;
  return '★'.repeat(Math.max(0, Math.min(5, Math.round(r))));
}

// ── SVC icon set (SVG path data only — stroked icons) ────────────────────────
const SVC_ICONS: string[] = [
  // briefcase
  'M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zm-8-4H8v4h8V3h-4z',
  // home
  'M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z M9 21V12h6v9',
  // alert-circle
  'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm0-6v-4m0 8h.01',
  // zap (bolt)
  'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
  // sun
  'M12 17A5 5 0 1 0 12 7a5 5 0 0 0 0 10zm0-15v2m0 18v2M5.64 5.64l1.42 1.42m9.9 9.9 1.42 1.42M2 12h2m18 0h2M5.64 18.36l1.42-1.42m9.9-9.9 1.42-1.42',
  // check-circle
  'M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4 12 14.01l-3-3',
];

// ── CSS ───────────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap');

.ec2-root {
  font-family: 'Space Grotesk', system-ui, sans-serif;
  background: #fff;
  color: #1e1b4b;
  overflow-x: hidden;
  container-type: inline-size;
  --ec2-indigo: #4f46e5;
  --ec2-indigo-dark: #3730a3;
  --ec2-indigo-xdark: #1e1b4b;
  --ec2-yellow: #facc15;
  --ec2-yellow-dark: #eab308;
  --ec2-gray-50: #f8f7ff;
  --ec2-gray-100: #f1f0fd;
  --ec2-gray-200: #e0deff;
  --ec2-gray-600: #4b5563;
  --ec2-radius: 12px;
  --ec2-shadow: 0 4px 24px rgba(79,70,229,.12);
  --ec2-shadow-lg: 0 12px 48px rgba(79,70,229,.18);
}
.ec2-root *, .ec2-root *::before, .ec2-root *::after { box-sizing: border-box; margin: 0; padding: 0; }

/* ── NAV ── */
.ec2-nav {
  position: sticky; top: 0; z-index: 100;
  background: rgba(255,255,255,.96);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--ec2-gray-200);
  transition: box-shadow .3s;
}
.ec2-nav.ec2-scrolled { box-shadow: var(--ec2-shadow); }
.ec2-nav-inner {
  max-width: 1200px; margin: 0 auto; padding: 0 24px;
  height: 68px; display: flex; align-items: center; justify-content: space-between; gap: 16px;
}
.ec2-logo { display: flex; align-items: center; gap: 10px; text-decoration: none; }
.ec2-logo-icon {
  width: 36px; height: 36px; border-radius: 8px;
  background: var(--ec2-indigo); display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.ec2-logo-icon svg { width: 20px; height: 20px; }
.ec2-logo-text { font-size: 1.1rem; font-weight: 700; color: var(--ec2-indigo-xdark); letter-spacing: -.3px; }
.ec2-nav-links { display: flex; align-items: center; gap: 28px; list-style: none; }
.ec2-nav-links a { font-size: .88rem; font-weight: 500; color: var(--ec2-gray-600); text-decoration: none; transition: color .2s; }
.ec2-nav-links a:hover { color: var(--ec2-indigo); }
.ec2-nav-cta {
  background: var(--ec2-yellow); color: var(--ec2-indigo-xdark);
  font-size: .88rem; font-weight: 700; padding: 10px 20px; border-radius: 8px;
  text-decoration: none; white-space: nowrap; transition: background .2s, transform .15s;
}
.ec2-nav-cta:hover { background: var(--ec2-yellow-dark); transform: translateY(-1px); }
.ec2-menu-btn {
  display: none; background: none; border: none; cursor: pointer;
  padding: 4px; flex-shrink: 0; align-items: center; justify-content: center;
}
.ec2-mobile-nav {
  display: none; position: sticky; top: 68px; z-index: 99; left: 0; right: 0;
  background: rgba(255,255,255,.98); backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--ec2-gray-200);
  flex-direction: column; align-items: center; gap: 20px; padding: 32px 24px 40px;
}
.ec2-mobile-nav.ec2-open { display: flex; }
.ec2-mobile-nav a { font-size: 1.2rem; font-weight: 600; color: var(--ec2-indigo-xdark); text-decoration: none; }
.ec2-mobile-nav-cta {
  background: var(--ec2-yellow); color: var(--ec2-indigo-xdark);
  font-size: 1rem; font-weight: 700; padding: 14px 32px; border-radius: 10px; text-decoration: none;
  margin-top: 8px;
}

/* ── HERO ── */
.ec2-hero {
  min-height: 100svh; padding: 80px 24px 80px;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  text-align: center; position: relative; overflow: hidden;
  background: #fafafe;
}
.ec2-hero-circuit {
  position: absolute; inset: 0; pointer-events: none; opacity: .06; overflow: hidden;
}
.ec2-hero-circuit svg { width: 100%; height: 100%; }
.ec2-circuit-line {
  stroke: #4f46e5; stroke-width: 1.5; fill: none;
  stroke-dasharray: 700; stroke-dashoffset: 700;
  animation: ec2-circuit-draw 3.5s ease forwards;
}
.ec2-circuit-line:nth-child(2) { stroke-dasharray: 900; stroke-dashoffset: 900; animation-delay: .5s; animation-duration: 4s; }
.ec2-circuit-line:nth-child(3) { stroke-dasharray: 800; stroke-dashoffset: 800; animation-delay: 1s; animation-duration: 4.5s; }
.ec2-circuit-line:nth-child(4) { stroke-dasharray: 600; stroke-dashoffset: 600; animation-delay: .3s; animation-duration: 3.2s; }
.ec2-circuit-dot { fill: #facc15; opacity: 0; animation: ec2-circuit-fade 1s ease forwards; }
.ec2-circuit-dot:nth-child(5) { animation-delay: 2.5s; }
.ec2-circuit-dot:nth-child(6) { animation-delay: 3.1s; }
.ec2-circuit-dot:nth-child(7) { animation-delay: 3.5s; }
@keyframes ec2-circuit-draw { to { stroke-dashoffset: 0; } }
@keyframes ec2-circuit-fade { to { opacity: 1; } }

.ec2-hero-badge {
  display: inline-flex; align-items: center; gap: 8px;
  background: #fff; border: 1.5px solid var(--ec2-gray-200);
  color: var(--ec2-indigo); font-size: .8rem; font-weight: 600;
  padding: 6px 14px; border-radius: 100px; margin-bottom: 28px;
  box-shadow: 0 2px 12px rgba(79,70,229,.08); position: relative; z-index: 1;
}
.ec2-hero-badge-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--ec2-yellow); flex-shrink: 0; }

.ec2-hero-h1 {
  font-size: clamp(2.4rem, 6vw, 4.2rem); font-weight: 700; line-height: 1.08;
  letter-spacing: -.04em; color: var(--ec2-indigo-xdark); max-width: 840px;
  margin: 0 auto 8px; position: relative; z-index: 1;
}
.ec2-hero-highlight { position: relative; color: var(--ec2-indigo); display: inline-block; white-space: nowrap; }
.ec2-hero-underline {
  position: absolute; bottom: -4px; left: 0; right: 0; height: 5px;
  background: var(--ec2-yellow); border-radius: 3px;
  transform: scaleX(0); transform-origin: left;
  animation: ec2-underline-draw .6s ease .9s forwards;
}
@keyframes ec2-underline-draw { to { transform: scaleX(1); } }

.ec2-hero-sub {
  font-size: clamp(.95rem, 2.2vw, 1.15rem); color: var(--ec2-gray-600);
  max-width: 580px; margin: 20px auto 36px; line-height: 1.6; position: relative; z-index: 1;
}
.ec2-hero-btns { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; margin-bottom: 48px; position: relative; z-index: 1; }
.ec2-btn-primary {
  background: var(--ec2-indigo); color: #fff;
  font-size: 1rem; font-weight: 700; padding: 15px 32px; border-radius: 10px;
  text-decoration: none; transition: background .2s, transform .15s, box-shadow .2s;
  box-shadow: 0 4px 16px rgba(79,70,229,.3);
}
.ec2-btn-primary:hover { background: var(--ec2-indigo-dark); transform: translateY(-2px); box-shadow: 0 8px 24px rgba(79,70,229,.4); }
.ec2-btn-outline {
  background: #fff; color: var(--ec2-indigo); border: 2px solid var(--ec2-indigo);
  font-size: 1rem; font-weight: 600; padding: 13px 28px; border-radius: 10px;
  text-decoration: none; transition: background .2s, transform .15s;
}
.ec2-btn-outline:hover { background: var(--ec2-gray-100); transform: translateY(-2px); }

.ec2-hero-chips { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; position: relative; z-index: 1; }
.ec2-chip {
  background: #fff; border: 1.5px solid var(--ec2-gray-200);
  display: flex; align-items: center; gap: 8px;
  padding: 10px 18px; border-radius: 100px;
  box-shadow: var(--ec2-shadow);
  font-size: .85rem; font-weight: 600; color: var(--ec2-indigo-xdark);
  opacity: 0; animation: ec2-chip-rise .5s ease both;
}
.ec2-chip:nth-child(1) { animation-delay: 1s; }
.ec2-chip:nth-child(2) { animation-delay: 1.15s; }
.ec2-chip:nth-child(3) { animation-delay: 1.3s; }
@keyframes ec2-chip-rise { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
.ec2-chip-num { color: var(--ec2-indigo); font-weight: 700; }

/* ── MARQUEE ── */
.ec2-marquee-wrap { background: var(--ec2-indigo-xdark); padding: 14px 0; overflow: hidden; }
.ec2-marquee-row { display: flex; gap: 0; white-space: nowrap; overflow: hidden; }
.ec2-marquee-row + .ec2-marquee-row { margin-top: 8px; }
.ec2-marquee-track {
  display: inline-flex; gap: 48px; align-items: center;
  animation: ec2-marquee-right 28s linear infinite; flex-shrink: 0;
}
.ec2-marquee-rev .ec2-marquee-track { animation-name: ec2-marquee-left; }
@keyframes ec2-marquee-right { from { transform: translateX(0); } to { transform: translateX(-50%); } }
@keyframes ec2-marquee-left { from { transform: translateX(-50%); } to { transform: translateX(0); } }
.ec2-marquee-item {
  display: flex; align-items: center; gap: 10px;
  font-size: .8rem; font-weight: 600; color: rgba(255,255,255,.65);
  letter-spacing: .04em; text-transform: uppercase;
}
.ec2-marquee-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--ec2-yellow); flex-shrink: 0; }

/* ── SECTION BASE ── */
.ec2-section { padding: 96px 24px; }
.ec2-section-inner { max-width: 1200px; margin: 0 auto; }
.ec2-label {
  display: inline-block; font-size: .75rem; font-weight: 700; letter-spacing: .1em;
  text-transform: uppercase; color: var(--ec2-indigo); margin-bottom: 12px;
}
.ec2-h2 {
  font-size: clamp(1.8rem, 4vw, 2.8rem); font-weight: 700; line-height: 1.15;
  letter-spacing: -.03em; color: var(--ec2-indigo-xdark); margin-bottom: 16px;
}
.ec2-sub { font-size: 1.05rem; color: var(--ec2-gray-600); line-height: 1.65; max-width: 580px; }

/* ── SERVICES ── */
.ec2-services { background: #fff; }
.ec2-services-head { margin-bottom: 56px; }
.ec2-svc-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; }
.ec2-svc-card {
  background: var(--ec2-gray-50); border: 1.5px solid var(--ec2-gray-200);
  border-radius: var(--ec2-radius); padding: 28px;
  display: flex; gap: 20px; align-items: flex-start;
  transition: border-color .25s, box-shadow .25s, transform .25s;
  opacity: 0; transform: translateX(-32px);
}
.ec2-svc-card.ec2-visible { opacity: 1; transform: none; }
.ec2-svc-card.ec2-from-right { transform: translateX(32px); }
.ec2-svc-card.ec2-from-right.ec2-visible { transform: none; }
.ec2-svc-card:hover { border-color: var(--ec2-indigo); box-shadow: var(--ec2-shadow-lg); transform: translateY(-4px) !important; }
.ec2-svc-card:hover .ec2-svc-icon-wrap { background: var(--ec2-indigo); }
.ec2-svc-card:hover .ec2-svc-icon-wrap svg { stroke: #fff; }
.ec2-svc-icon-wrap {
  width: 52px; height: 52px; border-radius: 12px; flex-shrink: 0;
  background: var(--ec2-gray-200); display: flex; align-items: center; justify-content: center;
  transition: background .25s;
}
.ec2-svc-icon-wrap svg { width: 24px; height: 24px; stroke: var(--ec2-indigo); fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; transition: stroke .25s; }
.ec2-svc-name { font-size: 1.05rem; font-weight: 700; color: var(--ec2-indigo-xdark); margin-bottom: 6px; }
.ec2-svc-desc { font-size: .9rem; color: var(--ec2-gray-600); line-height: 1.55; margin-bottom: 10px; }
.ec2-svc-price { display: inline-block; font-size: .8rem; font-weight: 700; color: var(--ec2-indigo); background: var(--ec2-gray-100); padding: 3px 10px; border-radius: 6px; }
.ec2-svc-cta-row { margin-top: 40px; text-align: center; }

/* ── STATS ── */
.ec2-stats { background: var(--ec2-indigo-xdark); padding: 80px 24px; }
.ec2-stats-inner { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center; }
.ec2-stats-left .ec2-h2 { color: #fff; }
.ec2-stats-left .ec2-sub { color: rgba(255,255,255,.65); max-width: 420px; }
.ec2-stats-phone {
  display: inline-flex; align-items: center; gap: 10px; margin-top: 24px;
  color: var(--ec2-yellow); font-size: 1.15rem; font-weight: 700; text-decoration: none; transition: opacity .2s;
}
.ec2-stats-phone:hover { opacity: .8; }
.ec2-stats-phone-icon {
  width: 38px; height: 38px; border-radius: 50%; flex-shrink: 0;
  background: rgba(250,204,21,.15); display: flex; align-items: center; justify-content: center;
}
.ec2-bars { display: flex; flex-direction: column; gap: 24px; }
.ec2-bar-meta { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 8px; }
.ec2-bar-lbl { font-size: .9rem; font-weight: 600; color: rgba(255,255,255,.85); }
.ec2-bar-val { font-size: 1rem; font-weight: 700; color: var(--ec2-yellow); }
.ec2-bar-track { height: 8px; background: rgba(255,255,255,.12); border-radius: 100px; overflow: hidden; }
.ec2-bar-fill { height: 100%; border-radius: 100px; width: 0; transition: width 1.2s cubic-bezier(.22,1,.36,1); }
.ec2-bar-fill.ec2-bar-yellow { background: linear-gradient(90deg, var(--ec2-yellow-dark) 0%, var(--ec2-yellow) 100%); }
.ec2-bar-fill.ec2-bar-indigo { background: linear-gradient(90deg, var(--ec2-indigo) 0%, #818cf8 100%); }

/* ── PROCESS ── */
.ec2-process { background: var(--ec2-gray-50); }
.ec2-process-head { text-align: center; margin-bottom: 64px; }
.ec2-process-head .ec2-sub { margin: 0 auto; }
.ec2-process-row { position: relative; display: grid; grid-template-columns: repeat(4, 1fr); gap: 0; }
.ec2-connector {
  position: absolute; top: 36px; left: calc(100% / 8); right: calc(100% / 8);
  height: 3px; background: var(--ec2-gray-200); border-radius: 3px; z-index: 0; overflow: hidden;
}
.ec2-connector-fill { height: 100%; background: var(--ec2-indigo); border-radius: 3px; width: 0; transition: width 1.8s cubic-bezier(.22,1,.36,1); }
.ec2-proc-step {
  display: flex; flex-direction: column; align-items: center; text-align: center;
  padding: 0 16px; z-index: 1;
  opacity: 0; transform: translateY(20px);
  transition: opacity .5s ease, transform .5s ease;
}
.ec2-proc-step.ec2-visible { opacity: 1; transform: none; }
.ec2-proc-step:nth-child(3) { transition-delay: .15s; }
.ec2-proc-step:nth-child(4) { transition-delay: .3s; }
.ec2-proc-step:nth-child(5) { transition-delay: .45s; }
.ec2-step-num {
  width: 72px; height: 72px; border-radius: 50%;
  background: #fff; border: 3px solid var(--ec2-gray-200);
  display: flex; align-items: center; justify-content: center;
  font-size: 1.3rem; font-weight: 700; color: var(--ec2-indigo-xdark);
  position: relative; z-index: 1; margin-bottom: 20px;
  transition: border-color .4s, background .4s, color .4s;
  box-shadow: 0 2px 12px rgba(79,70,229,.08);
}
.ec2-proc-step.ec2-visible .ec2-step-num { border-color: var(--ec2-indigo); background: var(--ec2-indigo); color: #fff; }
.ec2-step-title { font-size: 1rem; font-weight: 700; color: var(--ec2-indigo-xdark); margin-bottom: 8px; }
.ec2-step-desc { font-size: .88rem; color: var(--ec2-gray-600); line-height: 1.55; }

/* ── FAQ ── */
.ec2-faq { background: #fff; }
.ec2-faq-wrap { display: grid; grid-template-columns: 1fr 1.6fr; gap: 64px; align-items: start; }
.ec2-faq-left p { font-size: .95rem; color: var(--ec2-gray-600); line-height: 1.65; margin-bottom: 28px; }
.ec2-faq-cta {
  display: inline-flex; align-items: center; gap: 8px;
  background: var(--ec2-indigo); color: #fff;
  font-size: .9rem; font-weight: 700; padding: 12px 22px; border-radius: 8px;
  text-decoration: none; transition: background .2s;
}
.ec2-faq-cta:hover { background: var(--ec2-indigo-dark); }
.ec2-acc-item { border-bottom: 1.5px solid var(--ec2-gray-200); }
.ec2-acc-item:first-child { border-top: 1.5px solid var(--ec2-gray-200); }
.ec2-acc-btn {
  width: 100%; display: flex; align-items: center; justify-content: space-between;
  gap: 16px; padding: 20px 0; background: none; border: none; cursor: pointer; text-align: left;
}
.ec2-acc-q { font-size: .97rem; font-weight: 600; color: var(--ec2-indigo-xdark); line-height: 1.4; }
.ec2-acc-icon {
  width: 28px; height: 28px; border-radius: 6px; background: var(--ec2-gray-100);
  display: flex; align-items: center; justify-content: center;
  font-size: 1.1rem; color: var(--ec2-indigo); flex-shrink: 0;
  transition: background .2s, transform .3s; line-height: 1; font-style: normal;
}
.ec2-acc-item.ec2-open .ec2-acc-icon { background: var(--ec2-indigo); color: #fff; transform: rotate(45deg); }
.ec2-acc-body { max-height: 0; overflow: hidden; transition: max-height .4s cubic-bezier(.22,1,.36,1), padding-bottom .3s; }
.ec2-acc-item.ec2-open .ec2-acc-body { max-height: 400px; padding-bottom: 20px; }
.ec2-acc-a { font-size: .9rem; color: var(--ec2-gray-600); line-height: 1.65; }

/* ── TESTIMONIALS ── */
.ec2-testimonials { background: var(--ec2-gray-50); }
.ec2-testi-head { margin-bottom: 56px; }
.ec2-testi-layout { display: grid; grid-template-columns: 1.5fr 1fr; gap: 28px; align-items: start; }
.ec2-testi-feature {
  background: #fff; border: 1.5px solid var(--ec2-gray-200);
  border-radius: var(--ec2-radius); padding: 40px;
  box-shadow: var(--ec2-shadow); position: relative; overflow: hidden;
}
.ec2-testi-feature::before {
  content: '\u201C'; position: absolute; top: -8px; left: 24px;
  font-size: 9rem; line-height: 1; font-family: Georgia, serif;
  color: var(--ec2-gray-200); pointer-events: none; z-index: 0;
}
.ec2-testi-feature-body { position: relative; z-index: 1; }
.ec2-testi-stars { color: var(--ec2-yellow-dark); font-size: 1.2rem; margin-bottom: 20px; letter-spacing: 2px; }
.ec2-testi-text { font-size: 1.1rem; font-weight: 500; color: var(--ec2-indigo-xdark); line-height: 1.6; margin-bottom: 24px; }
.ec2-testi-author { display: flex; align-items: center; gap: 14px; }
.ec2-testi-avatar {
  width: 48px; height: 48px; border-radius: 50%;
  background: var(--ec2-indigo); color: #fff;
  display: flex; align-items: center; justify-content: center;
  font-size: .85rem; font-weight: 700; flex-shrink: 0;
}
.ec2-testi-name { font-size: .95rem; font-weight: 700; color: var(--ec2-indigo-xdark); }
.ec2-testi-ctx { font-size: .82rem; color: var(--ec2-gray-600); }
.ec2-testi-stack { display: flex; flex-direction: column; gap: 20px; }
.ec2-testi-mini {
  background: #fff; border: 1.5px solid var(--ec2-gray-200);
  border-radius: var(--ec2-radius); padding: 24px;
  box-shadow: 0 2px 12px rgba(79,70,229,.06);
  transition: box-shadow .25s, transform .25s;
}
.ec2-testi-mini:hover { box-shadow: var(--ec2-shadow); transform: translateY(-2px); }
.ec2-testi-mini-stars { color: var(--ec2-yellow-dark); font-size: .9rem; margin-bottom: 12px; letter-spacing: 2px; }
.ec2-testi-mini-text { font-size: .88rem; color: var(--ec2-gray-600); line-height: 1.55; margin-bottom: 16px; }
.ec2-testi-mini-author { display: flex; align-items: center; gap: 10px; }
.ec2-testi-mini-avatar {
  width: 36px; height: 36px; border-radius: 50%;
  background: var(--ec2-indigo); color: #fff;
  display: flex; align-items: center; justify-content: center;
  font-size: .72rem; font-weight: 700; flex-shrink: 0;
}
.ec2-testi-mini-name { font-size: .85rem; font-weight: 700; color: var(--ec2-indigo-xdark); }

/* ── SERVICE AREAS ── */
.ec2-areas { background: #fff; }
.ec2-areas-head { text-align: center; margin-bottom: 52px; }
.ec2-areas-head .ec2-sub { margin: 0 auto; }
.ec2-areas-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; }
.ec2-area-card {
  background: var(--ec2-gray-50); border: 1.5px solid var(--ec2-gray-200);
  border-radius: var(--ec2-radius); padding: 20px;
  display: flex; align-items: center; gap: 14px;
  transition: border-color .2s, box-shadow .2s, transform .2s;
}
.ec2-area-card:hover { border-color: var(--ec2-indigo); box-shadow: var(--ec2-shadow); transform: translateY(-2px); }
.ec2-area-pin {
  width: 38px; height: 38px; border-radius: 50%; flex-shrink: 0;
  background: var(--ec2-gray-200); display: flex; align-items: center; justify-content: center;
  position: relative;
}
.ec2-area-pin svg { width: 18px; height: 18px; stroke: var(--ec2-indigo); fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
.ec2-area-pulse {
  position: absolute; inset: -4px; border-radius: 50%;
  border: 2px solid var(--ec2-indigo); opacity: 0;
  animation: ec2-pulse 2.5s ease-in-out infinite;
}
.ec2-area-card:nth-child(even) .ec2-area-pulse { animation-delay: .8s; }
.ec2-area-card:nth-child(3n) .ec2-area-pulse { animation-delay: 1.5s; }
@keyframes ec2-pulse {
  0% { transform: scale(.9); opacity: .5; }
  60% { transform: scale(1.35); opacity: 0; }
  100% { transform: scale(1.35); opacity: 0; }
}
.ec2-area-name { font-size: .95rem; font-weight: 700; color: var(--ec2-indigo-xdark); }

/* ── CTA ── */
.ec2-cta { background: var(--ec2-indigo); padding: 96px 24px; text-align: center; position: relative; overflow: hidden; }
.ec2-cta::before {
  content: ''; position: absolute; top: -80px; left: 50%; transform: translateX(-50%);
  width: 600px; height: 600px; border-radius: 50%;
  background: rgba(255,255,255,.04); pointer-events: none;
}
.ec2-cta-inner { max-width: 640px; margin: 0 auto; position: relative; z-index: 1; }
.ec2-cta-label { font-size: .75rem; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: var(--ec2-yellow); margin-bottom: 14px; }
.ec2-cta-h2 { font-size: clamp(2rem, 5vw, 3rem); font-weight: 700; line-height: 1.1; letter-spacing: -.03em; color: #fff; margin-bottom: 16px; }
.ec2-cta-sub { font-size: 1rem; color: rgba(255,255,255,.75); line-height: 1.6; margin-bottom: 32px; }
.ec2-cta-phone {
  display: inline-flex; align-items: center; gap: 10px;
  font-size: 1.8rem; font-weight: 700; color: var(--ec2-yellow); text-decoration: none;
  margin-bottom: 36px; transition: opacity .2s;
}
.ec2-cta-phone:hover { opacity: .85; }
.ec2-cta-form { display: flex; gap: 12px; max-width: 520px; margin: 0 auto; }
.ec2-cta-input {
  flex: 1; padding: 14px 18px; border-radius: 10px;
  border: none; background: rgba(255,255,255,.15);
  color: #fff; font-size: .95rem; font-family: inherit;
  outline: none; transition: background .2s;
}
.ec2-cta-input::placeholder { color: rgba(255,255,255,.5); }
.ec2-cta-input:focus { background: rgba(255,255,255,.22); }
.ec2-cta-submit {
  background: var(--ec2-yellow); color: var(--ec2-indigo-xdark);
  border: none; cursor: pointer; font-size: .95rem; font-weight: 700;
  padding: 14px 24px; border-radius: 10px; white-space: nowrap;
  transition: background .2s, transform .15s; font-family: inherit;
}
.ec2-cta-submit:hover { background: var(--ec2-yellow-dark); transform: translateY(-1px); }

/* ── FOOTER ── */
.ec2-footer { background: var(--ec2-indigo-xdark); padding: 64px 24px 32px; }
.ec2-footer-inner { max-width: 1200px; margin: 0 auto; }
.ec2-footer-top { display: grid; grid-template-columns: 1.5fr 1fr 1fr; gap: 48px; margin-bottom: 48px; }
.ec2-footer-logo { display: flex; align-items: center; gap: 10px; margin-bottom: 16px; text-decoration: none; }
.ec2-footer-logo-text { font-size: 1rem; font-weight: 700; color: #fff; }
.ec2-footer-about { font-size: .88rem; color: rgba(255,255,255,.5); line-height: 1.65; max-width: 280px; }
.ec2-footer-col-title { font-size: .8rem; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: rgba(255,255,255,.4); margin-bottom: 16px; }
.ec2-footer-links { list-style: none; display: flex; flex-direction: column; gap: 10px; }
.ec2-footer-links a { font-size: .9rem; color: rgba(255,255,255,.6); text-decoration: none; transition: color .2s; }
.ec2-footer-links a:hover { color: var(--ec2-yellow); }
.ec2-footer-divider { border: none; border-top: 1px solid rgba(255,255,255,.08); margin-bottom: 24px; }
.ec2-footer-bottom { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; }
.ec2-footer-copy { font-size: .82rem; color: rgba(255,255,255,.35); }
.ec2-footer-badge { font-size: .75rem; font-weight: 600; color: rgba(255,255,255,.4); background: rgba(255,255,255,.06); padding: 4px 10px; border-radius: 100px; }

/* ── RESPONSIVE ── */
@container (max-width: 900px) {
  .ec2-nav-links { display: none; }
  .ec2-menu-btn { display: flex; }
  .ec2-stats-inner { grid-template-columns: 1fr; gap: 40px; }
  .ec2-testi-layout { grid-template-columns: 1fr; }
  .ec2-faq-wrap { grid-template-columns: 1fr; gap: 40px; }
  .ec2-footer-top { grid-template-columns: 1fr 1fr; gap: 36px; }
}
@container (max-width: 680px) {
  .ec2-svc-grid { grid-template-columns: 1fr; }
  .ec2-process-row { grid-template-columns: 1fr 1fr; gap: 32px; }
  .ec2-connector { display: none; }
  .ec2-footer-top { grid-template-columns: 1fr; gap: 32px; }
  .ec2-footer-about { max-width: 100%; }
  .ec2-cta-form { flex-direction: column; }
}
@container (max-width: 480px) {
  .ec2-hero { padding: 90px 20px 60px; }
  .ec2-section { padding: 72px 20px; }
  .ec2-process-row { grid-template-columns: 1fr; }
  .ec2-hero-chips { flex-direction: column; align-items: center; }
  .ec2-stats { padding: 64px 20px; }
}
`;

// ── Marquee items ─────────────────────────────────────────────────────────────
const MARQUEE_ROW1 = ['Panel Upgrades', 'EV Charger Installation', 'Smart Home Wiring', 'Emergency Repairs', 'Outlet & Switch Work', 'Whole-Home Rewire', 'LED Lighting Upgrades', 'Commercial Electrical'];
const MARQUEE_ROW2 = ['Ceiling Fans', 'Generator Installation', 'Surge Protection', 'Code Compliance', 'Circuit Breaker Repair', 'Landscape Lighting', 'Dedicated Circuits', 'Safety Inspections'];

// ── Component ─────────────────────────────────────────────────────────────────
export default function Electrician2({ businessData, isPreview }: TemplateProps) {
  const { name, city, phone, email, tagline, subTagline, services, stats, testimonials, faq, serviceAreas, copy } = businessData;

  const svcs   = (services  && services.length  > 0) ? services  : DEFAULT_SERVICES;
  const sts    = (stats     && stats.length     > 0) ? stats     : DEFAULT_STATS;
  const testis = (testimonials && testimonials.length > 0) ? testimonials : DEFAULT_TESTIMONIALS;
  const faqs   = (faq       && faq.length       > 0) ? faq       : DEFAULT_FAQS;
  const areas  = (serviceAreas && serviceAreas.length > 0) ? serviceAreas : DEFAULT_AREAS;

  const heroTitle     = tagline    ?? `${city}'s Most Trusted`;
  const heroHighlight = subTagline ?? 'Electrical Experts';
  const heroSub       = copy?.cta_subheading ?? `From emergency repairs to full rewires — ${name} delivers fast, safe, and code-compliant electrical work for homes and businesses across ${city}.`;
  const navCta        = copy?.nav_cta ?? 'Get a Quote';
  const ctaLabel      = copy?.cta_label ?? 'Ready to Get Started?';
  const ctaHeading    = copy?.cta_heading ?? 'Let\'s Fix It Today';
  const ctaSub        = copy?.cta_subheading ?? `Call now for an upfront quote, or drop your name and number below and we\'ll reach out within 30 minutes.`;
  const svcLabel      = copy?.services_label ?? 'What We Do';
  const svcHeading    = copy?.services_heading ?? 'Electrical Services Done Right';
  const svcSub        = copy?.services_subheading ?? `Every job — from a single outlet to a full commercial fit-out — is backed by our licensed master electricians and a 100% satisfaction guarantee.`;

  const displayPhone = phone ?? '(512) 555-0192';
  const displayEmail = email ?? `info@${name.toLowerCase().replace(/\s+/g, '')}electric.com`;

  const yearsIn   = new Date().getFullYear() - 2009;
  const chip1 = `${yearsIn}+ Years Experience`;

  // Feature testimonial = first; mini = second + third
  const featureT = testis[0];
  const miniTs   = testis.slice(1, 3);

  // ── State ──────────────────────────────────────────────────────────────────
  const [navScrolled, setNavScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number>(0);

  // ── Refs ───────────────────────────────────────────────────────────────────
  const barsRef    = useRef<HTMLDivElement>(null);
  const procRef    = useRef<HTMLDivElement>(null);
  const connRef    = useRef<HTMLDivElement>(null);
  const barFillRefs = useRef<(HTMLDivElement | null)[]>([]);

  // ── Nav scroll shadow ──────────────────────────────────────────────────────
  useEffect(() => {
    const root = document.querySelector('.ec2-root') as HTMLElement | null;
    const scrollEl = isPreview ? root : window;
    if (!scrollEl) return;
    const onScroll = () => {
      const y = isPreview ? (root?.scrollTop ?? 0) : window.scrollY;
      setNavScrolled(y > 40);
    };
    scrollEl.addEventListener('scroll', onScroll, { passive: true });
    return () => scrollEl.removeEventListener('scroll', onScroll);
  }, [isPreview]);

  // ── Stat bars IntersectionObserver ────────────────────────────────────────
  useEffect(() => {
    if (!barsRef.current) return;
    const obs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        barFillRefs.current.forEach((el, i) => {
          if (el) el.style.width = getPct(sts[i]?.value ?? 0) + '%';
        });
        obs.disconnect();
      }
    }, { threshold: 0.3 });
    obs.observe(barsRef.current);
    return () => obs.disconnect();
  }, [sts]);

  // ── Service card slide-in ──────────────────────────────────────────────────
  useEffect(() => {
    const cards = document.querySelectorAll('.ec2-svc-card');
    if (!cards.length) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('ec2-visible'); obs.unobserve(e.target); } });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    cards.forEach(c => obs.observe(c));
    return () => obs.disconnect();
  }, []);

  // ── Process steps + connector ──────────────────────────────────────────────
  useEffect(() => {
    if (!procRef.current) return;
    const obs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        document.querySelectorAll('.ec2-proc-step').forEach(s => s.classList.add('ec2-visible'));
        if (connRef.current) connRef.current.style.width = '100%';
        obs.disconnect();
      }
    }, { threshold: 0.2 });
    obs.observe(procRef.current);
    return () => obs.disconnect();
  }, []);

  // ── Close menu on link click ───────────────────────────────────────────────
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  // ── Prevent body scroll when menu is open ─────────────────────────────────
  useEffect(() => {
    if (isPreview) return;
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen, isPreview]);

  return (
    <div className="ec2-root">
      <style suppressHydrationWarning>{CSS}</style>

      {/* ── NAV ── */}
      <nav className={`ec2-nav${navScrolled ? ' ec2-scrolled' : ''}`}>
        <div className="ec2-nav-inner">
          <a href="#ec2-home" className="ec2-logo">
            <div className="ec2-logo-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            </div>
            <span className="ec2-logo-text">{name}</span>
          </a>
          <ul className="ec2-nav-links">
            <li><a href="#ec2-services">Services</a></li>
            <li><a href="#ec2-process">Process</a></li>
            <li><a href="#ec2-faq">FAQ</a></li>
            <li><a href="#ec2-areas">Service Areas</a></li>
          </ul>
          <a href={`tel:${displayPhone.replace(/\D/g, '')}`} className="ec2-nav-cta">{navCta}</a>
          <button
            className="ec2-menu-btn"
            aria-label="Toggle menu"
            onClick={() => setMenuOpen(o => !o)}
          >
            {menuOpen
              ? <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1e1b4b" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              : <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1e1b4b" strokeWidth="2.5" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
            }
          </button>
        </div>
      </nav>

      {/* Mobile nav */}
      <div className={`ec2-mobile-nav${menuOpen ? ' ec2-open' : ''}`}>
        <a href="#ec2-services" onClick={closeMenu}>Services</a>
        <a href="#ec2-process" onClick={closeMenu}>Process</a>
        <a href="#ec2-faq" onClick={closeMenu}>FAQ</a>
        <a href="#ec2-areas" onClick={closeMenu}>Service Areas</a>
        <a href={`tel:${displayPhone.replace(/\D/g, '')}`} className="ec2-mobile-nav-cta" onClick={closeMenu}>{navCta}</a>
      </div>

      {/* ── HERO ── */}
      <section className="ec2-hero" id="ec2-home">
        <div className="ec2-hero-circuit" aria-hidden="true">
          <svg viewBox="0 0 1440 800" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
            <path className="ec2-circuit-line" d="M0 200 H 300 V 350 H 600 V 200 H 900 V 400 H 1200 V 250 H 1440" />
            <path className="ec2-circuit-line" d="M0 500 H 200 V 600 H 500 V 450 H 800 V 600 H 1100 V 500 H 1440" />
            <path className="ec2-circuit-line" d="M720 0 V 120 H 550 V 250 H 720 V 400 H 900 V 550 H 720 V 800" />
            <path className="ec2-circuit-line" d="M200 0 V 150 H 350 V 300 H 200 V 500 H 400 V 700 H 200 V 800" />
            <circle className="ec2-circuit-dot" cx="300" cy="350" r="5" />
            <circle className="ec2-circuit-dot" cx="600" cy="200" r="5" />
            <circle className="ec2-circuit-dot" cx="720" cy="400" r="7" />
          </svg>
        </div>

        <div className="ec2-hero-badge">
          <span className="ec2-hero-badge-dot" />
          Licensed &amp; Insured Master Electrician
        </div>

        <h1 className="ec2-hero-h1">
          {heroTitle}<br />
          <span className="ec2-hero-highlight">
            {heroHighlight}
            <span className="ec2-hero-underline" />
          </span>
        </h1>

        <p className="ec2-hero-sub">{heroSub}</p>

        <div className="ec2-hero-btns">
          <a href={`tel:${displayPhone.replace(/\D/g, '')}`} className="ec2-btn-primary">Call {displayPhone}</a>
          <a href="#ec2-services" className="ec2-btn-outline">View Services</a>
        </div>

        <div className="ec2-hero-chips">
          <div className="ec2-chip"><span className="ec2-chip-num">⚡</span><span>{chip1}</span></div>
          <div className="ec2-chip"><span className="ec2-chip-num">⏱</span><span><span className="ec2-chip-num">Same-Day</span> Service Available</span></div>
          <div className="ec2-chip"><span className="ec2-chip-num">✓</span><span><span className="ec2-chip-num">500+</span> Projects Completed</span></div>
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <div className="ec2-marquee-wrap" aria-hidden="true">
        <div className="ec2-marquee-row">
          {[0, 1].map(k => (
            <div className="ec2-marquee-track" key={k} aria-hidden={k === 1}>
              {MARQUEE_ROW1.map(item => (
                <span className="ec2-marquee-item" key={item}>
                  <span className="ec2-marquee-dot" />{item}
                </span>
              ))}
            </div>
          ))}
        </div>
        <div className="ec2-marquee-row ec2-marquee-rev">
          {[0, 1].map(k => (
            <div className="ec2-marquee-track" key={k} aria-hidden={k === 1}>
              {MARQUEE_ROW2.map(item => (
                <span className="ec2-marquee-item" key={item}>
                  <span className="ec2-marquee-dot" />{item}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── SERVICES ── */}
      <section className="ec2-section ec2-services" id="ec2-services">
        <div className="ec2-section-inner">
          <div className="ec2-services-head">
            <span className="ec2-label">{svcLabel}</span>
            <h2 className="ec2-h2">{svcHeading}</h2>
            <p className="ec2-sub">{svcSub}</p>
          </div>
          <div className="ec2-svc-grid">
            {svcs.slice(0, 6).map((svc, i) => (
              <div
                key={i}
                className={`ec2-svc-card${i % 2 === 1 ? ' ec2-from-right' : ''}`}
                style={{ transitionDelay: `${(i % 2) * 0.08}s` }}
              >
                <div className="ec2-svc-icon-wrap">
                  <svg viewBox="0 0 24 24">
                    <path d={SVC_ICONS[i % SVC_ICONS.length]} />
                  </svg>
                </div>
                <div>
                  <div className="ec2-svc-name">{svc.name}</div>
                  {svc.description && <div className="ec2-svc-desc">{svc.description}</div>}
                  {svc.price && <span className="ec2-svc-price">{svc.price}</span>}
                </div>
              </div>
            ))}
          </div>
          <div className="ec2-svc-cta-row">
            <a href={`tel:${displayPhone.replace(/\D/g, '')}`} className="ec2-btn-primary">Book a Service Call</a>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="ec2-stats" id="ec2-stats">
        <div className="ec2-stats-inner">
          <div className="ec2-stats-left">
            <span className="ec2-label" style={{ color: 'var(--ec2-yellow)' }}>By the Numbers</span>
            <h2 className="ec2-h2">Why {city} Chooses {name}</h2>
            <p className="ec2-sub">Over {yearsIn} years of reliable electrical work — every number below is a promise we&apos;ve kept to real {city} families and businesses.</p>
            <a href={`tel:${displayPhone.replace(/\D/g, '')}`} className="ec2-stats-phone">
              <span className="ec2-stats-phone-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#facc15" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </span>
              {displayPhone}
            </a>
          </div>
          <div className="ec2-bars" ref={barsRef}>
            {sts.slice(0, 4).map((st, i) => (
              <div key={i}>
                <div className="ec2-bar-meta">
                  <span className="ec2-bar-lbl">{st.label}</span>
                  <span className="ec2-bar-val">{st.value}{st.suffix}</span>
                </div>
                <div className="ec2-bar-track">
                  <div
                    className={`ec2-bar-fill ${i % 2 === 0 ? 'ec2-bar-yellow' : 'ec2-bar-indigo'}`}
                    ref={el => { barFillRefs.current[i] = el; }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROCESS ── */}
      <section className="ec2-section ec2-process" id="ec2-process">
        <div className="ec2-section-inner">
          <div className="ec2-process-head">
            <span className="ec2-label">How It Works</span>
            <h2 className="ec2-h2">From Call to Completion</h2>
            <p className="ec2-sub">Four simple steps. No surprises on the invoice. Every time.</p>
          </div>
          <div className="ec2-process-row" ref={procRef}>
            <div className="ec2-connector">
              <div className="ec2-connector-fill" ref={connRef} />
            </div>
            {PROCESS_STEPS.map((step, i) => (
              <div className="ec2-proc-step" key={i}>
                <div className="ec2-step-num">{step.num}</div>
                <div className="ec2-step-title">{step.title}</div>
                <div className="ec2-step-desc">{step.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="ec2-section ec2-faq" id="ec2-faq">
        <div className="ec2-section-inner">
          <div className="ec2-faq-wrap">
            <div className="ec2-faq-left">
              <span className="ec2-label">{copy?.faq_label ?? 'FAQ'}</span>
              <h2 className="ec2-h2">{copy?.faq_heading ?? 'Common Questions'}</h2>
              <p>Can&apos;t find your answer here? We&apos;re happy to talk through any electrical concern — no pressure, no charge for a quick phone consult.</p>
              <a href={`tel:${displayPhone.replace(/\D/g, '')}`} className="ec2-faq-cta">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                Call Us Free
              </a>
            </div>
            <div className="ec2-accordion">
              {faqs.map((item, i) => (
                <div key={i} className={`ec2-acc-item${openFaq === i ? ' ec2-open' : ''}`}>
                  <button className="ec2-acc-btn" onClick={() => setOpenFaq(openFaq === i ? -1 : i)}>
                    <span className="ec2-acc-q">{item.q}</span>
                    <em className="ec2-acc-icon">+</em>
                  </button>
                  <div className="ec2-acc-body">
                    <p className="ec2-acc-a">{item.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="ec2-section ec2-testimonials" id="ec2-testimonials">
        <div className="ec2-section-inner">
          <div className="ec2-testi-head">
            <span className="ec2-label">{copy?.testimonials_label ?? 'What Clients Say'}</span>
            <h2 className="ec2-h2">Real Reviews from Real Customers</h2>
          </div>
          <div className="ec2-testi-layout">
            {/* Feature */}
            <div className="ec2-testi-feature">
              <div className="ec2-testi-feature-body">
                <div className="ec2-testi-stars">{starStr(featureT.rating)}</div>
                <p className="ec2-testi-text">&ldquo;{featureT.text}&rdquo;</p>
                <div className="ec2-testi-author">
                  <div className="ec2-testi-avatar">{getInitials(featureT.name)}</div>
                  <div>
                    <div className="ec2-testi-name">{featureT.name}</div>
                    {featureT.context && <div className="ec2-testi-ctx">{featureT.context}</div>}
                  </div>
                </div>
              </div>
            </div>
            {/* Mini stack */}
            <div className="ec2-testi-stack">
              {miniTs.map((t, i) => (
                <div className="ec2-testi-mini" key={i}>
                  <div className="ec2-testi-mini-stars">{starStr(t.rating)}</div>
                  <p className="ec2-testi-mini-text">&ldquo;{t.text}&rdquo;</p>
                  <div className="ec2-testi-mini-author">
                    <div className="ec2-testi-mini-avatar">{getInitials(t.name)}</div>
                    <div><div className="ec2-testi-mini-name">{t.name}{t.context ? ` — ${t.context}` : ''}</div></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICE AREAS ── */}
      <section className="ec2-section ec2-areas" id="ec2-areas">
        <div className="ec2-section-inner">
          <div className="ec2-areas-head">
            <span className="ec2-label">Coverage</span>
            <h2 className="ec2-h2">Areas We Serve</h2>
            <p className="ec2-sub">Serving {city} and all surrounding communities. Not sure if we cover your area? Just call — we probably do.</p>
          </div>
          <div className="ec2-areas-grid">
            {areas.map((area, i) => (
              <div className="ec2-area-card" key={i}>
                <div className="ec2-area-pin">
                  <svg viewBox="0 0 24 24">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span className="ec2-area-pulse" />
                </div>
                <span className="ec2-area-name">{area}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="ec2-cta" id="ec2-contact">
        <div className="ec2-cta-inner">
          <div className="ec2-cta-label">{ctaLabel}</div>
          <h2 className="ec2-cta-h2">{ctaHeading}</h2>
          <p className="ec2-cta-sub">{ctaSub}</p>
          <a href={`tel:${displayPhone.replace(/\D/g, '')}`} className="ec2-cta-phone">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            {displayPhone}
          </a>
          <form className="ec2-cta-form" onSubmit={e => e.preventDefault()}>
            <input className="ec2-cta-input" type="text" placeholder="Your name" />
            <input className="ec2-cta-input" type="tel" placeholder="Phone number" />
            <button className="ec2-cta-submit" type="submit">Call Me →</button>
          </form>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="ec2-footer">
        <div className="ec2-footer-inner">
          <div className="ec2-footer-top">
            <div>
              <a href="#ec2-home" className="ec2-footer-logo">
                <div className="ec2-logo-icon" style={{ width: 30, height: 30 }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16 }}>
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                  </svg>
                </div>
                <span className="ec2-footer-logo-text">{name}</span>
              </a>
              <p className="ec2-footer-about">Licensed master electricians serving {city} and surrounding areas. Residential, commercial, and emergency electrical services.</p>
            </div>
            <div>
              <div className="ec2-footer-col-title">Services</div>
              <ul className="ec2-footer-links">
                {svcs.slice(0, 5).map((s, i) => <li key={i}><a href="#ec2-services">{s.name}</a></li>)}
              </ul>
            </div>
            <div>
              <div className="ec2-footer-col-title">Contact</div>
              <ul className="ec2-footer-links">
                <li><a href={`tel:${displayPhone.replace(/\D/g, '')}`}>{displayPhone}</a></li>
                <li><a href={`mailto:${displayEmail}`}>{displayEmail}</a></li>
                <li><a href="#ec2-areas">{city} &amp; Surrounding Areas</a></li>
                <li><a href="#ec2-contact">Get a Free Quote</a></li>
                <li><a href={`tel:${displayPhone.replace(/\D/g, '')}`}>24/7 Emergency Line</a></li>
              </ul>
            </div>
          </div>
          <hr className="ec2-footer-divider" />
          <div className="ec2-footer-bottom">
            <span className="ec2-footer-copy">© {new Date().getFullYear()} {name}. All rights reserved.</span>
            <span className="ec2-footer-badge">⚡ Powered by Localio</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
