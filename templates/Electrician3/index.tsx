'use client';

import React, { useEffect, useRef, useState } from 'react';
import { TemplateProps, ServiceItem, Testimonial, Stat } from '../types';

// ── Default data ──────────────────────────────────────────────────────────────
const DEFAULT_SERVICES: ServiceItem[] = [
  { name: 'Panel Upgrades', price: 'From $1,200', description: 'Upgrade aging 100A panels to modern 200A or 400A service. We handle the permit, city inspection, and full switchover.', features: ['100A → 200A', '200A → 400A', 'Permit included', 'City inspection', 'Breaker labeling'] },
  { name: 'EV Charger Install', price: 'From $599', description: 'Level 2 home charger on a dedicated 50A circuit. Works with all EV brands.', features: [] },
  { name: 'Emergency Repairs', price: 'Call for pricing', description: "Sparks, burning smells, complete outages — we're on-site within 2 hours, 24/7.", features: [] },
  { name: 'LED & Lighting', price: 'From $175', description: 'Recessed lighting, dimmer upgrades, under-cabinet LEDs, and outdoor security lights.', features: [] },
  { name: 'Smart Home Wiring', price: 'From $450', description: 'Pre-wire for smart switches, surge protection, and home automation systems.', features: [] },
  { name: 'Safety Inspections', price: 'From $249', description: 'Full inspection with written report. GFCI/AFCI upgrades and code corrections.', features: [] },
];

const DEFAULT_STATS: Stat[] = [
  { value: '15',   label: 'Years of Experience',   suffix: '+' },
  { value: '1800', label: 'Jobs Completed',         suffix: '+' },
  { value: '98',   label: 'Customer Satisfaction',  suffix: '%' },
  { value: '2',    label: 'Emergency Response',     suffix: 'hr' },
];

const DEFAULT_TESTIMONIALS: Testimonial[] = [
  { name: 'Marcus R.',   text: "Spark replaced our 40-year-old panel the same day I called. Clean work, honest price, and they labeled every single breaker. Absolutely outstanding.", rating: 5, context: 'Panel Upgrade · Zilker' },
  { name: 'Jennifer T.', text: "Had two Level 2 chargers installed for my Tesla and my wife's Ioniq. Done in under 4 hours, permits handled. Couldn't ask for better service.", rating: 5, context: 'EV Charger · South Austin' },
  { name: 'David K.',    text: "Burning smell from an outlet at 9pm. They were at my door by 11pm and fixed a dangerous loose connection. Genuinely impressive response time.", rating: 5, context: 'Emergency Repair · Hyde Park' },
  { name: 'Rachel P.',   text: "Full smart home pre-wire for our new build. The team was clean, professional, and clearly understood every aspect of the automation system.", rating: 5, context: 'Smart Home Wiring · Mueller' },
  { name: 'Tom C.',      text: "Converted our entire office to LED recessed lighting. Significant energy savings and the install was spotless. Would absolutely hire again.", rating: 5, context: 'LED Retrofit · Domain Area' },
  { name: 'Maria G.',    text: "Rewired our entire restaurant over a weekend closure. Zero issues when we opened Monday. These guys are true professionals — worth every penny.", rating: 5, context: 'Rewire · East Austin' },
];

const DEFAULT_AREAS = ['North Side', 'South Side', 'East Side', 'West Side', 'Suburbs'];

const PROCESS_STEPS = [
  { num: '01', title: 'Call or Request Online',       desc: "Describe your issue — we'll ask a few questions, give you a ballpark estimate, and lock in the earliest slot. Often same-day." },
  { num: '02', title: 'On-Site Arrival & Diagnosis',  desc: "Your technician arrives in a marked van, in uniform, on time. They'll diagnose the full scope and explain everything in plain language." },
  { num: '03', title: 'You Approve the Price',        desc: "We present a written flat-rate quote. No work begins until you give the green light. The price you approve is the price you pay." },
  { num: '04', title: 'Work & Final Inspection',      desc: "We complete the job, test everything, clean up, and walk you through what was done. Permits filed and inspection scheduled if required." },
];

const GUARANTEE_ITEMS = [
  { title: 'Upfront flat-rate pricing',  desc: "You approve the price before a single wire is touched. No hidden add-ons." },
  { title: 'On-time or we pay you',      desc: "We give a 2-hour arrival window. If we're late without notice, your service is discounted." },
  { title: '2-year labor warranty',      desc: "If anything we installed fails within 2 years due to our work, we'll fix it free." },
  { title: 'Clean job site, always',     desc: "We protect your floors, clean up every scrap, and leave the area better than we found it." },
  { title: 'Permit-ready for every job', desc: "We handle all permit applications and city inspections — fully documented for your records." },
];

const DEFAULT_CERTS = ['OSHA 30 Certified', 'NFPA 70E', 'BBB A+', 'EVITP Certified', '$2M Insured', 'Permit Ready'];

// ── Bento service icon SVG paths ──────────────────────────────────────────────
const BENTO_ICONS: string[] = [
  'M2 7h20v14H2zM16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16',
  'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
  'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 8v4m0 4h.01',
  'M12 17A5 5 0 1 0 12 7a5 5 0 0 0 0 10zm0-15v2m0 18v2M5.64 5.64l1.42 1.42m9.9 9.9 1.42 1.42M2 12h2m18 0h2M5.64 18.36l1.42-1.42m9.9-9.9 1.42-1.42',
  'M5 12H2l10-10 10 10h-3M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7',
  'M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4 12 14.01l-3-3',
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function getInitials(name: string | undefined): string {
  if (!name) return '?';
  return name.split(' ').slice(0, 2).map(w => w[0] ?? '').join('').toUpperCase();
}
function starStr(rating: number | undefined): string {
  const r = typeof rating === 'number' ? rating : 5;
  return '★'.repeat(Math.max(0, Math.min(5, Math.round(r))));
}
function parseStatVal(v: string | number): number {
  if (typeof v === 'number') return v;
  return parseFloat(String(v).replace(/[^0-9.]/g, '')) || 0;
}

type LetterChar = { ch: string; delay: number; isSpace: boolean };
function buildLetterReveal(lines: string[]): LetterChar[][] {
  let delay = 0;
  return lines.map(line => {
    const chars = line.split('').map((ch): LetterChar => {
      const d = delay; delay += 28;
      return { ch, delay: d, isSpace: ch === ' ' };
    });
    delay += 60;
    return chars;
  });
}

// ── CSS ───────────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

.ec3-root {
  font-family: 'Inter', system-ui, sans-serif;
  background: #fff;
  color: #1c1917;
  overflow-x: hidden;
  container-type: inline-size;
  --ec3-red: #dc2626;
  --ec3-red-dark: #b91c1c;
  --ec3-red-light: #fef2f2;
  --ec3-red-mid: #fee2e2;
  --ec3-stone: #78716c;
  --ec3-charcoal: #1c1917;
  --ec3-border: #e7e5e4;
  --ec3-warm-bg: #fafaf9;
  --ec3-gold: #f59e0b;
  --ec3-radius: 14px;
  --ec3-shadow: 0 4px 20px rgba(0,0,0,.07);
  --ec3-shadow-lg: 0 12px 48px rgba(220,38,38,.12);
}
.ec3-root *, .ec3-root *::before, .ec3-root *::after { box-sizing: border-box; margin: 0; padding: 0; }
.ec3-root * { overflow-wrap: break-word; word-break: break-word; min-width: 0; }

/* ── NAV ── */
.ec3-nav {
  position: sticky; top: 0; left: 0; right: 0; z-index: 100;
  background: rgba(255,255,255,.95); backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--ec3-border); transition: box-shadow .3s;
}
.ec3-nav.ec3-scrolled { box-shadow: 0 2px 20px rgba(0,0,0,.08); }
.ec3-nav-inner {
  max-width: 1200px; margin: 0 auto; padding: 0 24px; height: 68px;
  display: flex; align-items: center; justify-content: space-between; gap: 16px;
}
.ec3-logo { display: flex; align-items: center; gap: 10px; text-decoration: none; }
.ec3-logo-mark {
  width: 36px; height: 36px; border-radius: 8px; background: var(--ec3-red);
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.ec3-logo-mark svg { width: 20px; height: 20px; }
.ec3-logo-text { font-size: 1.1rem; font-weight: 800; color: var(--ec3-charcoal); letter-spacing: -.3px; }
.ec3-nav-links { display: flex; align-items: center; gap: 28px; list-style: none; }
.ec3-nav-links a {
  font-size: .88rem; font-weight: 500; color: var(--ec3-stone); text-decoration: none;
  transition: color .2s; position: relative; padding-bottom: 4px;
}
.ec3-nav-links a::after {
  content: ''; position: absolute; bottom: 0; left: 0; width: 0; height: 2px;
  background: var(--ec3-red); border-radius: 2px; transition: width .25s;
}
.ec3-nav-links a:hover { color: var(--ec3-charcoal); }
.ec3-nav-links a:hover::after { width: 100%; }
.ec3-nav-cta {
  background: var(--ec3-red); color: #fff; font-size: .88rem; font-weight: 700;
  padding: 10px 22px; border-radius: 100px; text-decoration: none;
  transition: background .2s, transform .15s, box-shadow .2s;
  box-shadow: 0 2px 12px rgba(220,38,38,.3);
}
.ec3-nav-cta:hover { background: var(--ec3-red-dark); transform: translateY(-1px); box-shadow: 0 4px 20px rgba(220,38,38,.4); }
.ec3-menu-btn { display: none; background: none; border: none; cursor: pointer; padding: 4px; flex-shrink: 0; align-items: center; justify-content: center; }
.ec3-mobile-nav {
  display: none; position: fixed; top: 68px; left: 0; right: 0; z-index: 99;
  background: rgba(255,255,255,.98); backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--ec3-border);
  flex-direction: column; align-items: center; justify-content: center; gap: 28px;
  padding: 40px 24px 48px;
  opacity: 0; pointer-events: none; transition: opacity .3s;
}
.ec3-mobile-nav.ec3-open { opacity: 1; pointer-events: auto; }
.ec3-mobile-nav a { font-size: 1.5rem; font-weight: 700; color: var(--ec3-charcoal); text-decoration: none; }
.ec3-mobile-cta {
  background: var(--ec3-red); color: #fff; font-size: 1rem; font-weight: 700;
  padding: 14px 36px; border-radius: 100px; text-decoration: none; margin-top: 8px;
}

/* ── HERO ── */
.ec3-hero {
  min-height: 80svh; padding: 80px 24px 80px;
  display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: center;
  max-width: 1200px; margin: 0 auto;
}
.ec3-hero-eyebrow {
  display: inline-flex; align-items: center; gap: 8px;
  background: var(--ec3-red-light); color: var(--ec3-red);
  font-size: .78rem; font-weight: 700; letter-spacing: .08em; text-transform: uppercase;
  padding: 6px 14px; border-radius: 100px; margin-bottom: 24px;
  border: 1px solid var(--ec3-red-mid);
}
.ec3-hero-eyebrow-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--ec3-red); flex-shrink: 0; animation: ec3-blink 1.5s ease-in-out infinite; }
@keyframes ec3-blink { 0%, 100% { opacity: 1; } 50% { opacity: .3; } }
.ec3-hero-h1 {
  font-size: clamp(2.6rem, 5.5vw, 4.4rem); font-weight: 900; line-height: 1.04;
  letter-spacing: -.05em; color: var(--ec3-charcoal); margin-bottom: 24px; overflow: hidden;
}
.ec3-char {
  display: inline-block; opacity: 0; transform: translateY(60px) rotate(3deg);
  animation: ec3-char-in .5s cubic-bezier(.22,1,.36,1) forwards;
}
.ec3-word-break { display: block; }
@keyframes ec3-char-in { to { opacity: 1; transform: none; } }
.ec3-hero-sub { font-size: 1.05rem; color: var(--ec3-stone); line-height: 1.7; max-width: 480px; margin-bottom: 36px; }
.ec3-hero-btns { display: flex; gap: 14px; flex-wrap: wrap; margin-bottom: 40px; }
.ec3-btn-red {
  background: var(--ec3-red); color: #fff; font-size: 1rem; font-weight: 700;
  padding: 15px 32px; border-radius: 100px; text-decoration: none;
  box-shadow: 0 4px 20px rgba(220,38,38,.3); transition: background .2s, transform .15s, box-shadow .2s;
}
.ec3-btn-red:hover { background: var(--ec3-red-dark); transform: translateY(-2px); box-shadow: 0 8px 28px rgba(220,38,38,.4); }
.ec3-btn-ghost {
  background: #fff; color: var(--ec3-charcoal); border: 2px solid var(--ec3-border);
  font-size: 1rem; font-weight: 600; padding: 13px 28px; border-radius: 100px;
  text-decoration: none; transition: border-color .2s, transform .15s;
}
.ec3-btn-ghost:hover { border-color: var(--ec3-charcoal); transform: translateY(-2px); }
.ec3-hero-micro { display: flex; gap: 24px; flex-wrap: wrap; }
.ec3-micro { display: flex; align-items: center; gap: 6px; font-size: .82rem; font-weight: 600; color: var(--ec3-stone); }
.ec3-micro-icon { color: var(--ec3-red); font-size: .95rem; }
.ec3-hero-right { display: flex; align-items: center; justify-content: center; position: relative; }
.ec3-house-wrap { width: 100%; max-width: 480px; position: relative; }
.ec3-house-svg { width: 100%; height: auto; }
.ec3-house-wall { fill: #f5f5f4; stroke: var(--ec3-border); stroke-width: 2; }
.ec3-house-roof { fill: var(--ec3-red-mid); stroke: var(--ec3-red); stroke-width: 2; opacity: .8; }
.ec3-house-door { fill: var(--ec3-border); stroke: #d6d3d1; stroke-width: 1.5; }
.ec3-house-chimney { fill: #e7e5e4; stroke: var(--ec3-border); stroke-width: 1.5; }
.ec3-win {
  rx: 3; fill: #fef9c3; stroke: #fde047; stroke-width: 1.5;
  opacity: 0; filter: drop-shadow(0 0 6px rgba(250,204,21,.6)); transition: opacity .3s;
}
.ec3-win.ec3-win-lit { opacity: 1; animation: ec3-win-glow 2s ease-in-out infinite alternate; }
@keyframes ec3-win-glow {
  from { filter: drop-shadow(0 0 6px rgba(250,204,21,.5)); }
  to   { filter: drop-shadow(0 0 16px rgba(250,204,21,.9)); }
}
.ec3-bolt-path {
  stroke: var(--ec3-red); stroke-width: 3; fill: none;
  stroke-dasharray: 200; stroke-dashoffset: 200; stroke-linecap: round; stroke-linejoin: round;
  animation: ec3-bolt-draw .8s ease .3s forwards;
}
@keyframes ec3-bolt-draw { to { stroke-dashoffset: 0; } }
.ec3-bolt-fill { fill: var(--ec3-red); opacity: 0; animation: ec3-bolt-appear .4s ease 1.1s forwards; }
@keyframes ec3-bolt-appear { to { opacity: 1; } }
.ec3-spark {
  position: absolute; width: 8px; height: 8px; border-radius: 50%; background: var(--ec3-gold);
  animation: ec3-spark-fly 2s ease-in-out infinite; opacity: 0;
}
.ec3-spark:nth-child(1) { top: 20%; left: 55%; animation-delay: 0s; }
.ec3-spark:nth-child(2) { top: 35%; left: 72%; animation-delay: .4s; }
.ec3-spark:nth-child(3) { top: 15%; left: 68%; animation-delay: .8s; }
.ec3-spark:nth-child(4) { top: 40%; left: 60%; animation-delay: 1.2s; }
@keyframes ec3-spark-fly {
  0%   { opacity: 0; transform: translate(0,0) scale(0); }
  20%  { opacity: 1; transform: translate(-8px,-16px) scale(1); }
  80%  { opacity: .6; transform: translate(-16px,-32px) scale(.6); }
  100% { opacity: 0; transform: translate(-20px,-48px) scale(0); }
}

/* ── TRUST STRIP ── */
.ec3-trust { background: var(--ec3-warm-bg); padding: 32px 24px; border-top: 1px solid var(--ec3-border); border-bottom: 1px solid var(--ec3-border); }
.ec3-trust-inner { max-width: 1200px; margin: 0 auto; display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
.ec3-trust-badge {
  background: #fff; border: 1.5px solid var(--ec3-border); border-radius: var(--ec3-radius);
  padding: 14px 20px; display: flex; align-items: center; gap: 12px;
  box-shadow: var(--ec3-shadow);
  opacity: 0; transform: translateY(24px); transition: opacity .5s ease, transform .5s ease;
  flex: 1; min-width: 160px; max-width: 220px;
}
.ec3-trust-badge.ec3-visible { opacity: 1; transform: none; }
.ec3-trust-badge-icon {
  width: 40px; height: 40px; border-radius: 10px; background: var(--ec3-red-light);
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.ec3-trust-badge-icon svg { width: 20px; height: 20px; stroke: var(--ec3-red); fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
.ec3-trust-badge-text { font-size: .82rem; font-weight: 700; color: var(--ec3-charcoal); line-height: 1.3; }
.ec3-trust-badge-sub { font-size: .72rem; color: var(--ec3-stone); margin-top: 2px; }

/* ── SECTION BASE ── */
.ec3-section { padding: 100px 24px; }
.ec3-section-inner { max-width: 1200px; margin: 0 auto; }
.ec3-label { display: inline-block; font-size: .72rem; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--ec3-red); margin-bottom: 12px; }
.ec3-h2 { font-size: clamp(1.9rem,4vw,3rem); font-weight: 800; line-height: 1.12; letter-spacing: -.04em; color: var(--ec3-charcoal); margin-bottom: 16px; }
.ec3-sub { font-size: 1rem; color: var(--ec3-stone); line-height: 1.7; max-width: 560px; }

/* ── SERVICES BENTO ── */
.ec3-services { background: #fff; }
.ec3-services-head { max-width: 680px; margin-bottom: 52px; }
.ec3-bento { display: grid; grid-template-columns: repeat(3,1fr); grid-template-rows: auto auto; gap: 18px; }
.ec3-bento-card {
  background: var(--ec3-warm-bg); border: 1.5px solid var(--ec3-border);
  border-radius: var(--ec3-radius); padding: 28px;
  transition: border-color .25s, box-shadow .25s, transform .25s;
  position: relative; overflow: hidden;
}
.ec3-bento-card::before {
  content: ''; position: absolute; inset: 0; border-radius: var(--ec3-radius);
  background: radial-gradient(circle at 0% 100%, rgba(220,38,38,.06) 0%, transparent 70%);
  opacity: 0; transition: opacity .3s; pointer-events: none;
}
.ec3-bento-card:hover { border-color: var(--ec3-red); box-shadow: var(--ec3-shadow-lg); transform: translateY(-4px); }
.ec3-bento-card:hover::before { opacity: 1; }
.ec3-bento-wide { grid-column: span 2; }
.ec3-bento-icon {
  width: 48px; height: 48px; border-radius: 12px; background: var(--ec3-red-light);
  display: flex; align-items: center; justify-content: center; margin-bottom: 16px;
  transition: background .25s;
}
.ec3-bento-card:hover .ec3-bento-icon { background: var(--ec3-red); }
.ec3-bento-icon svg { width: 24px; height: 24px; stroke: var(--ec3-red); fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; transition: stroke .25s; }
.ec3-bento-card:hover .ec3-bento-icon svg { stroke: #fff; }
.ec3-bento-name { font-size: 1.05rem; font-weight: 700; color: var(--ec3-charcoal); margin-bottom: 8px; }
.ec3-bento-desc { font-size: .88rem; color: var(--ec3-stone); line-height: 1.6; }
.ec3-bento-price {
  display: inline-block; font-size: .8rem; font-weight: 700; color: var(--ec3-red);
  background: var(--ec3-red-light); padding: 4px 10px; border-radius: 6px; margin-top: 12px;
}
.ec3-bento-wide .ec3-bento-name { font-size: 1.25rem; }
.ec3-bento-wide .ec3-bento-desc { max-width: 420px; }
.ec3-bento-feature-list { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 14px; }
.ec3-feature-tag {
  font-size: .75rem; font-weight: 600; color: var(--ec3-red);
  background: var(--ec3-red-light); padding: 4px 10px; border-radius: 100px;
  border: 1px solid var(--ec3-red-mid);
}

/* ── STATS ── */
.ec3-stats { background: var(--ec3-warm-bg); border-top: 1px solid var(--ec3-border); border-bottom: 1px solid var(--ec3-border); padding: 80px 24px; }
.ec3-stats-inner { max-width: 1200px; margin: 0 auto; }
.ec3-stats-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 2px; }
.ec3-stat-card {
  background: #fff; padding: 40px 28px; text-align: center;
  border: 1px solid var(--ec3-border);
  transition: box-shadow .25s, transform .25s; position: relative;
}
.ec3-stat-card:first-child { border-radius: var(--ec3-radius) 0 0 var(--ec3-radius); }
.ec3-stat-card:last-child  { border-radius: 0 var(--ec3-radius) var(--ec3-radius) 0; }
.ec3-stat-card:hover { box-shadow: var(--ec3-shadow-lg); transform: translateY(-6px); z-index: 1; border-color: var(--ec3-red); }
.ec3-stat-num {
  font-size: clamp(2.8rem,5vw,4rem); font-weight: 900; letter-spacing: -.04em;
  color: var(--ec3-charcoal); line-height: 1;
  display: flex; align-items: baseline; justify-content: center; gap: 2px;
}
.ec3-stat-suffix { font-size: clamp(1.5rem,2.5vw,2rem); color: var(--ec3-red); font-weight: 900; }
.ec3-stat-label { font-size: .88rem; font-weight: 600; color: var(--ec3-stone); margin-top: 10px; }
.ec3-stat-counter { display: inline-block; }

/* ── GUARANTEE ── */
.ec3-guarantee { background: #fff; }
.ec3-guarantee-wrap { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }
.ec3-checklist { display: flex; flex-direction: column; gap: 20px; margin-top: 36px; }
.ec3-check-item {
  display: flex; align-items: flex-start; gap: 16px;
  opacity: 0; transform: translateX(-24px);
  transition: opacity .5s ease, transform .5s ease;
}
.ec3-check-item.ec3-visible { opacity: 1; transform: none; }
.ec3-check-item:nth-child(2) { transition-delay: .1s; }
.ec3-check-item:nth-child(3) { transition-delay: .2s; }
.ec3-check-item:nth-child(4) { transition-delay: .3s; }
.ec3-check-item:nth-child(5) { transition-delay: .4s; }
.ec3-check-circle {
  width: 28px; height: 28px; border-radius: 50%; background: var(--ec3-red-light);
  border: 2px solid var(--ec3-red-mid); flex-shrink: 0; display: flex; align-items: center; justify-content: center;
  margin-top: 2px; overflow: hidden;
}
.ec3-check-svg { width: 14px; height: 14px; }
.ec3-check-path {
  stroke: var(--ec3-red); stroke-width: 2.5; fill: none; stroke-linecap: round; stroke-linejoin: round;
  stroke-dasharray: 20; stroke-dashoffset: 20; transition: stroke-dashoffset .4s ease;
}
.ec3-check-item.ec3-visible .ec3-check-path { stroke-dashoffset: 0; }
.ec3-check-title { font-size: .97rem; font-weight: 700; color: var(--ec3-charcoal); margin-bottom: 3px; }
.ec3-check-desc { font-size: .85rem; color: var(--ec3-stone); line-height: 1.55; }
.ec3-badge-side { display: flex; flex-direction: column; align-items: center; gap: 24px; }
.ec3-cert-badge {
  width: 200px; height: 200px; border-radius: 50%;
  background: var(--ec3-red-light); border: 4px solid var(--ec3-red-mid);
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 8px; text-align: center; padding: 24px;
  animation: ec3-badge-pulse 3s ease-in-out infinite;
}
@keyframes ec3-badge-pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(220,38,38,.2); }
  50%       { box-shadow: 0 0 0 20px rgba(220,38,38,0); }
}
.ec3-cert-badge-icon { font-size: 2.5rem; }
.ec3-cert-badge-title { font-size: .85rem; font-weight: 800; color: var(--ec3-charcoal); letter-spacing: .02em; }
.ec3-cert-badge-sub { font-size: .72rem; color: var(--ec3-stone); }
.ec3-cert-chips { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; max-width: 300px; }
.ec3-cert-chip {
  background: var(--ec3-warm-bg); border: 1.5px solid var(--ec3-border);
  font-size: .78rem; font-weight: 600; color: var(--ec3-charcoal);
  padding: 6px 14px; border-radius: 100px;
  transition: border-color .2s, background .2s;
}
.ec3-cert-chip:hover { border-color: var(--ec3-red); background: var(--ec3-red-light); }

/* ── PROCESS TIMELINE ── */
.ec3-process { background: var(--ec3-warm-bg); }
.ec3-process-head { text-align: center; margin-bottom: 72px; }
.ec3-process-head .ec3-sub { margin: 0 auto; }
.ec3-timeline { display: flex; flex-direction: column; gap: 0; position: relative; max-width: 800px; margin: 0 auto; }
.ec3-timeline::before {
  content: ''; position: absolute; left: 50%; top: 0; bottom: 0; width: 2px;
  background: linear-gradient(to bottom, transparent, var(--ec3-border) 5%, var(--ec3-border) 95%, transparent);
  transform: translateX(-50%); z-index: 0;
}
.ec3-tl-item {
  display: grid; grid-template-columns: 1fr 60px 1fr; align-items: start;
  position: relative; margin-bottom: 48px; opacity: 0;
}
.ec3-tl-item.ec3-visible { opacity: 1; }
.ec3-tl-content {
  background: #fff; border: 1.5px solid var(--ec3-border); border-radius: var(--ec3-radius);
  padding: 24px 28px; box-shadow: var(--ec3-shadow);
  transition: border-color .25s, box-shadow .25s;
}
.ec3-tl-content:hover { border-color: var(--ec3-red); box-shadow: var(--ec3-shadow-lg); }
.ec3-tl-step-num {
  width: 44px; height: 44px; border-radius: 50%; background: var(--ec3-red); color: #fff;
  font-size: 1rem; font-weight: 800;
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto; position: relative; z-index: 1; flex-shrink: 0; align-self: center;
  box-shadow: 0 0 0 6px var(--ec3-red-mid);
}
.ec3-tl-empty {}
.ec3-tl-item.ec3-tl-right .ec3-tl-content { grid-column: 3; }
.ec3-tl-item.ec3-tl-right .ec3-tl-step-num { grid-column: 2; grid-row: 1; }
.ec3-tl-item.ec3-tl-right .ec3-tl-empty { grid-column: 1; grid-row: 1; }
.ec3-tl-item:not(.ec3-tl-right) .ec3-tl-content { transform: translateX(-32px); transition: opacity .5s ease, transform .5s ease, border-color .25s, box-shadow .25s; }
.ec3-tl-item.ec3-tl-right .ec3-tl-content { transform: translateX(32px); transition: opacity .5s ease, transform .5s ease, border-color .25s, box-shadow .25s; }
.ec3-tl-item.ec3-visible .ec3-tl-content { transform: none; }
.ec3-tl-step-label { font-size: .72rem; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--ec3-red); margin-bottom: 6px; }
.ec3-tl-title { font-size: 1.05rem; font-weight: 700; color: var(--ec3-charcoal); margin-bottom: 8px; }
.ec3-tl-desc { font-size: .88rem; color: var(--ec3-stone); line-height: 1.6; }

/* ── TESTIMONIALS CAROUSEL ── */
.ec3-testimonials { background: #fff; overflow: hidden; }
.ec3-testi-head { max-width: 1200px; margin: 0 auto; margin-bottom: 48px; padding: 0 24px; }
.ec3-carousel-wrap { overflow: hidden; position: relative; }
.ec3-carousel-wrap::before, .ec3-carousel-wrap::after {
  content: ''; position: absolute; top: 0; bottom: 0; width: 120px; z-index: 2; pointer-events: none;
}
.ec3-carousel-wrap::before { left: 0; background: linear-gradient(to right, #fff, transparent); }
.ec3-carousel-wrap::after  { right: 0; background: linear-gradient(to left,  #fff, transparent); }
.ec3-carousel-track {
  display: flex; gap: 20px;
  animation: ec3-carousel-scroll 36s linear infinite;
  width: max-content; padding: 8px 20px;
}
.ec3-carousel-wrap:hover .ec3-carousel-track { animation-play-state: paused; }
@keyframes ec3-carousel-scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
.ec3-testi-card {
  width: 340px; flex-shrink: 0;
  background: var(--ec3-warm-bg); border: 1.5px solid var(--ec3-border);
  border-radius: var(--ec3-radius); padding: 28px;
  transition: border-color .25s, box-shadow .25s, transform .25s;
}
.ec3-testi-card:hover { border-color: var(--ec3-red); box-shadow: var(--ec3-shadow-lg); transform: translateY(-4px); }
.ec3-testi-stars { color: var(--ec3-gold); font-size: .95rem; margin-bottom: 14px; letter-spacing: 2px; }
.ec3-testi-text { font-size: .9rem; color: var(--ec3-charcoal); line-height: 1.65; margin-bottom: 18px; }
.ec3-testi-author { display: flex; align-items: center; gap: 12px; }
.ec3-testi-av {
  width: 38px; height: 38px; border-radius: 50%; background: var(--ec3-red); color: #fff;
  display: flex; align-items: center; justify-content: center; font-size: .72rem; font-weight: 700; flex-shrink: 0;
}
.ec3-testi-name { font-size: .88rem; font-weight: 700; color: var(--ec3-charcoal); }
.ec3-testi-ctx  { font-size: .78rem; color: var(--ec3-stone); }

/* ── SERVICE AREAS ── */
.ec3-areas { background: var(--ec3-warm-bg); }
.ec3-areas-head { text-align: center; margin-bottom: 52px; }
.ec3-areas-head .ec3-sub { margin: 0 auto; }
.ec3-areas-radial { display: grid; grid-template-columns: repeat(4,1fr); gap: 14px; max-width: 900px; margin: 0 auto; }
.ec3-area-tile {
  background: #fff; border: 1.5px solid var(--ec3-border); border-radius: var(--ec3-radius);
  padding: 18px 20px; text-align: center;
  transition: border-color .2s, box-shadow .2s, transform .2s;
}
.ec3-area-tile:hover { border-color: var(--ec3-red); box-shadow: var(--ec3-shadow-lg); transform: translateY(-3px); }
.ec3-area-hub {
  grid-column: 2/4; background: var(--ec3-red-light); border-color: var(--ec3-red-mid);
  display: flex; align-items: center; justify-content: center; gap: 10px; padding: 22px;
}
.ec3-area-hub-dot { width: 12px; height: 12px; border-radius: 50%; background: var(--ec3-red); position: relative; flex-shrink: 0; }
.ec3-area-hub-dot::after {
  content: ''; position: absolute; inset: -6px; border-radius: 50%;
  border: 2px solid var(--ec3-red); opacity: 0;
  animation: ec3-ripple 2s ease-in-out infinite;
}
@keyframes ec3-ripple { 0% { transform: scale(.8); opacity: .6; } 100% { transform: scale(1.8); opacity: 0; } }
.ec3-area-hub-name { font-size: 1rem; font-weight: 800; color: var(--ec3-red); }
.ec3-area-tile-icon { font-size: 1.1rem; margin-bottom: 4px; }
.ec3-area-tile-name { font-size: .9rem; font-weight: 600; color: var(--ec3-charcoal); }
.ec3-area-tile-dist { font-size: .75rem; color: var(--ec3-stone); margin-top: 2px; }

/* ── CTA ── */
.ec3-cta { background: var(--ec3-red-light); padding: 96px 24px; position: relative; overflow: hidden; }
.ec3-cta::before {
  content: ''; position: absolute; top: -100px; right: -100px;
  width: 400px; height: 400px; border-radius: 50%;
  background: var(--ec3-red-mid); opacity: .4; pointer-events: none;
}
.ec3-cta::after {
  content: ''; position: absolute; bottom: -80px; left: -80px;
  width: 300px; height: 300px; border-radius: 50%;
  background: var(--ec3-red-mid); opacity: .3; pointer-events: none;
}
.ec3-cta-inner { max-width: 680px; margin: 0 auto; text-align: center; position: relative; z-index: 1; }
.ec3-cta-label { font-size: .72rem; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: var(--ec3-red); margin-bottom: 14px; }
.ec3-cta-h2 { font-size: clamp(2rem,5vw,3.2rem); font-weight: 900; letter-spacing: -.04em; color: var(--ec3-charcoal); margin-bottom: 16px; line-height: 1.08; }
.ec3-cta-sub { font-size: 1rem; color: var(--ec3-stone); line-height: 1.65; margin-bottom: 36px; }
.ec3-cta-phone {
  display: inline-flex; align-items: center; gap: 12px;
  font-size: 2rem; font-weight: 900; color: var(--ec3-red); text-decoration: none;
  margin-bottom: 36px; letter-spacing: -.03em; transition: opacity .2s;
}
.ec3-cta-phone:hover { opacity: .8; }
.ec3-cta-phone-icon {
  width: 48px; height: 48px; border-radius: 50%; background: var(--ec3-red); color: #fff;
  display: flex; align-items: center; justify-content: center;
  animation: ec3-phone-ring 2.5s ease-in-out infinite;
}
@keyframes ec3-phone-ring {
  0%, 90%, 100% { transform: rotate(0); }
  92% { transform: rotate(-12deg); } 94% { transform: rotate(10deg); }
  96% { transform: rotate(-8deg); }  98% { transform: rotate(6deg); }
}
.ec3-cta-form { display: flex; gap: 12px; max-width: 500px; margin: 0 auto; }
.ec3-cta-input {
  flex: 1; padding: 14px 18px; border-radius: 100px;
  border: 2px solid var(--ec3-red-mid); background: #fff;
  color: var(--ec3-charcoal); font-size: .95rem; font-family: inherit; outline: none;
  transition: border-color .2s;
}
.ec3-cta-input:focus { border-color: var(--ec3-red); }
.ec3-cta-submit {
  background: var(--ec3-red); color: #fff; border: none; cursor: pointer;
  font-size: .95rem; font-weight: 700; padding: 14px 24px; border-radius: 100px;
  white-space: nowrap; font-family: inherit;
  box-shadow: 0 4px 16px rgba(220,38,38,.3); transition: background .2s, transform .15s;
}
.ec3-cta-submit:hover { background: var(--ec3-red-dark); transform: translateY(-1px); }

/* ── FOOTER ── */
.ec3-footer { background: var(--ec3-warm-bg); border-top: 1px solid var(--ec3-border); padding: 64px 24px 32px; }
.ec3-footer-inner { max-width: 1200px; margin: 0 auto; }
.ec3-footer-top { display: grid; grid-template-columns: 1.6fr 1fr 1fr; gap: 48px; margin-bottom: 48px; }
.ec3-footer-logo { display: flex; align-items: center; gap: 10px; margin-bottom: 16px; text-decoration: none; }
.ec3-footer-logo-text { font-size: 1rem; font-weight: 800; color: var(--ec3-charcoal); }
.ec3-footer-about { font-size: .88rem; color: var(--ec3-stone); line-height: 1.65; max-width: 280px; }
.ec3-footer-col-title { font-size: .72rem; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--ec3-stone); margin-bottom: 16px; }
.ec3-footer-links { list-style: none; display: flex; flex-direction: column; gap: 10px; }
.ec3-footer-links a { font-size: .9rem; color: var(--ec3-stone); text-decoration: none; transition: color .2s; }
.ec3-footer-links a:hover { color: var(--ec3-red); }
.ec3-footer-divider { border: none; border-top: 1px solid var(--ec3-border); margin-bottom: 24px; }
.ec3-footer-bottom { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; }
.ec3-footer-copy { font-size: .82rem; color: var(--ec3-stone); }
.ec3-footer-badge {
  font-size: .75rem; font-weight: 600; color: var(--ec3-stone);
  background: #fff; border: 1px solid var(--ec3-border); padding: 4px 12px; border-radius: 100px;
}

/* ── RESPONSIVE — container queries so preview pane breakpoints work ── */
@container (max-width: 960px) {
  .ec3-nav-links { display: none; }
  .ec3-nav-cta   { display: none; }
  .ec3-menu-btn  { display: flex; }
  .ec3-mobile-nav { display: flex; }
  .ec3-hero {
    grid-template-columns: 1fr; gap: 20px; text-align: center;
    min-height: auto; padding: 40px 20px 52px;
  }
  .ec3-hero-left  { order: 2; }
  .ec3-hero-right { order: 1; max-width: 240px; margin: 0 auto; }
  .ec3-hero-h1 { font-size: 2.5rem; }
  .ec3-hero-sub   { margin-left: auto; margin-right: auto; }
  .ec3-hero-micro { margin-left: auto; margin-right: auto; justify-content: center; }
  .ec3-hero-btns  { justify-content: center; flex-direction: column; align-items: center; }
  .ec3-btn-red, .ec3-btn-ghost { width: 100%; max-width: 300px; text-align: center; }
  .ec3-stats-grid { grid-template-columns: repeat(2,1fr); }
  .ec3-stat-card:first-child { border-radius: var(--ec3-radius) 0 0 0; }
  .ec3-stat-card:last-child  { border-radius: 0 var(--ec3-radius) var(--ec3-radius) 0; }
  .ec3-guarantee-wrap { grid-template-columns: 1fr; gap: 40px; }
  .ec3-badge-side { flex-direction: row; flex-wrap: wrap; justify-content: center; }
  .ec3-footer-top { grid-template-columns: 1fr 1fr; gap: 36px; }
  .ec3-section { padding: 72px 20px; }
  .ec3-stats { padding: 72px 20px; }
}
@container (max-width: 720px) {
  .ec3-hero-h1 { font-size: 2.1rem; }
  .ec3-bento { grid-template-columns: 1fr 1fr; }
  .ec3-bento-wide { grid-column: span 2; }
  .ec3-timeline::before { left: 24px; }
  .ec3-tl-item { grid-template-columns: 48px 1fr; }
  /* Left items: step number in col 1, content in col 2 */
  .ec3-tl-item:not(.ec3-tl-right) .ec3-tl-step-num { grid-column: 1; grid-row: 1; }
  .ec3-tl-item:not(.ec3-tl-right) .ec3-tl-content  { grid-column: 2; grid-row: 1; }
  /* Right items: same layout */
  .ec3-tl-item.ec3-tl-right .ec3-tl-content { grid-column: 2; grid-row: 1; }
  .ec3-tl-item.ec3-tl-right .ec3-tl-step-num { grid-column: 1; grid-row: 1; }
  .ec3-tl-item.ec3-tl-right .ec3-tl-empty { display: none; }
  .ec3-tl-empty { display: none; }
  .ec3-tl-item:not(.ec3-tl-right) .ec3-tl-content { transform: translateX(0); }
  .ec3-tl-item.ec3-tl-right     .ec3-tl-content { transform: translateX(0); }
  .ec3-areas-radial { grid-template-columns: repeat(2,1fr); }
  .ec3-area-hub { grid-column: span 2; }
  .ec3-footer-top { grid-template-columns: 1fr; gap: 32px; }
  .ec3-cta-form { flex-direction: column; }
  .ec3-cta-input, .ec3-cta-submit { border-radius: 12px; width: 100%; }
  .ec3-trust-inner { flex-wrap: wrap; }
  .ec3-trust-badge { flex: 0 1 calc(50% - 8px); min-width: 0; max-width: none; }
}
@container (max-width: 480px) {
  .ec3-hero { padding: 28px 16px 44px; }
  .ec3-hero-h1 { font-size: 1.85rem; }
  .ec3-hero-eyebrow { font-size: .7rem; }
  .ec3-section { padding: 56px 16px; }
  .ec3-stats { padding: 52px 16px; }
  .ec3-bento { grid-template-columns: 1fr; }
  .ec3-bento-wide { grid-column: span 1; }
  .ec3-stats-grid { grid-template-columns: 1fr 1fr; }
  .ec3-stat-card { padding: 24px 12px; }
  .ec3-stat-num { font-size: 2.4rem; }
  .ec3-trust { padding: 20px 16px; }
  .ec3-trust-inner { gap: 8px; }
  .ec3-trust-badge { flex: 0 1 calc(50% - 4px); min-width: 0; max-width: none; padding: 12px 14px; gap: 8px; }
  .ec3-trust-badge-icon { width: 32px; height: 32px; border-radius: 8px; flex-shrink: 0; }
  .ec3-trust-badge-icon svg { width: 16px; height: 16px; }
  .ec3-cta-phone { font-size: 1.5rem; flex-wrap: wrap; justify-content: center; }
  .ec3-cta-h2 { font-size: 1.9rem; }
  .ec3-nav-inner { padding: 0 16px; }
  .ec3-logo-text { font-size: .95rem; }
  .ec3-process-head { margin-bottom: 48px; }
  .ec3-areas-radial { grid-template-columns: 1fr 1fr; gap: 10px; }
  .ec3-footer { padding: 48px 16px 24px; }
  .ec3-footer-bottom { flex-direction: column; align-items: flex-start; gap: 8px; }
}
`;

// ── Component ─────────────────────────────────────────────────────────────────
export default function Electrician3({ businessData, isPreview }: TemplateProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled]     = useState(false);
  const [litWindows, setLitWindows] = useState([false, false, false, false]);

  const rootRef      = useRef<HTMLDivElement>(null);
  const trustRef     = useRef<HTMLDivElement>(null);
  const checklistRef = useRef<HTMLDivElement>(null);
  const timelineRef  = useRef<HTMLDivElement>(null);
  const statsGridRef = useRef<HTMLDivElement>(null);
  const statsDoneRef = useRef(false);

  // ── Data ──────────────────────────────────────────────────────────────────
  const name         = businessData.name         || 'Spark Electric';
  const city         = businessData.city         || 'Your City';
  const phone        = businessData.phone        || '(555) 000-0000';
  const email        = businessData.email        || `info@${name.toLowerCase().replace(/\s+/g, '')}.com`;
  const description  = businessData.description  || `Licensed master electricians serving ${city} and surrounding communities. Residential, commercial, and 24/7 emergency electrical services.`;

  const svcList  = (businessData.services?.length      ? businessData.services      : DEFAULT_SERVICES).slice(0, 6);
  const testiList = businessData.testimonials?.length  ? businessData.testimonials  : DEFAULT_TESTIMONIALS;
  const statList  = (businessData.stats?.length        ? businessData.stats         : DEFAULT_STATS).slice(0, 4);
  const rawAreas  = businessData.serviceAreas?.length  ? businessData.serviceAreas  : DEFAULT_AREAS;
  const areaList  = rawAreas.filter(a => a.toLowerCase() !== city.toLowerCase()).slice(0, 5);
  const certList  = businessData.certifications?.length ? businessData.certifications : DEFAULT_CERTS;

  // ── Hero headline (letter reveal) ────────────────────────────────────────
  const heroLines  = [`${city}'s Most`, 'Reliable Electricians'];
  const letterData = buildLetterReveal(heroLines);

  // ── Nav scroll (listen on root div, since nav is sticky) ─────────────────
  useEffect(() => {
    const el = rootRef.current?.closest('.overflow-auto, .overflow-y-auto') as HTMLElement | null
      ?? (typeof window !== 'undefined' ? window as unknown as HTMLElement : null);
    if (!el) return;
    const handler = () => {
      const scrollY = el === (window as unknown as HTMLElement) ? window.scrollY : (el as HTMLElement).scrollTop;
      setScrolled(scrollY > 40);
    };
    el.addEventListener('scroll', handler, { passive: true });
    return () => el.removeEventListener('scroll', handler);
  }, []);

  // ── House window light-up ─────────────────────────────────────────────────
  useEffect(() => {
    const ts = [0,1,2,3].map(i =>
      setTimeout(() => setLitWindows(p => { const n = [...p]; n[i] = true; return n; }), 1200 + i * 400)
    );
    return () => ts.forEach(clearTimeout);
  }, []);

  // ── Trust badges IntersectionObserver ────────────────────────────────────
  useEffect(() => {
    const c = trustRef.current; if (!c) return;
    const obs = new IntersectionObserver(es => {
      es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('ec3-visible'); obs.unobserve(e.target); } });
    }, { threshold: 0.2 });
    c.querySelectorAll('.ec3-trust-badge').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  // ── Checklist IntersectionObserver ───────────────────────────────────────
  useEffect(() => {
    const c = checklistRef.current; if (!c) return;
    const obs = new IntersectionObserver(es => {
      es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('ec3-visible'); obs.unobserve(e.target); } });
    }, { threshold: 0.2 });
    c.querySelectorAll('.ec3-check-item').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  // ── Timeline IntersectionObserver ────────────────────────────────────────
  useEffect(() => {
    const c = timelineRef.current; if (!c) return;
    const obs = new IntersectionObserver(es => {
      es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('ec3-visible'); obs.unobserve(e.target); } });
    }, { threshold: 0.25 });
    c.querySelectorAll('.ec3-tl-item').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  // ── Odometer counters ─────────────────────────────────────────────────────
  useEffect(() => {
    const grid = statsGridRef.current; if (!grid) return;
    const obs = new IntersectionObserver(es => {
      if (es[0].isIntersecting && !statsDoneRef.current) {
        statsDoneRef.current = true;
        grid.querySelectorAll<HTMLElement>('.ec3-stat-counter').forEach(el => {
          const target   = parseInt(el.dataset.target || '0', 10);
          const duration = 1800;
          const startT   = performance.now();
          const step = (now: number) => {
            const p    = Math.min((now - startT) / duration, 1);
            const ease = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.round(target * ease).toLocaleString();
            if (p < 1) requestAnimationFrame(step);
            else el.textContent = target.toLocaleString();
          };
          requestAnimationFrame(step);
        });
        obs.disconnect();
      }
    }, { threshold: 0.4 });
    obs.observe(grid);
    return () => obs.disconnect();
  }, []);

  // ── Mobile overflow lock ──────────────────────────────────────────────────
  useEffect(() => {
    if (isPreview) return;
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen, isPreview]);

  const yr = new Date().getFullYear();

  // ── JSX ───────────────────────────────────────────────────────────────────
  return (
    <div className="ec3-root" ref={rootRef} data-ec>
      <style suppressHydrationWarning>{CSS}</style>

      {/* NAV */}
      <nav className={`ec3-nav${scrolled ? ' ec3-scrolled' : ''}`}>
        <div className="ec3-nav-inner">
          <a href="#" className="ec3-logo">
            <div className="ec3-logo-mark">
              <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
              </svg>
            </div>
            <span className="ec3-logo-text">{name}</span>
          </a>
          <ul className="ec3-nav-links">
            <li><a href="#services">Services</a></li>
            <li><a href="#process">Process</a></li>
            <li><a href="#testimonials">Reviews</a></li>
            <li><a href="#areas">Service Areas</a></li>
          </ul>
          <a href={`tel:${phone.replace(/\D/g,'')}`} className="ec3-nav-cta">{businessData.copy?.nav_cta || 'Free Estimate'}</a>
          <button className="ec3-menu-btn" onClick={() => setMobileOpen(o => !o)} aria-label="Menu">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1c1917" strokeWidth="2.5" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
        </div>
      </nav>

      {/* MOBILE NAV */}
      <div className={`ec3-mobile-nav${mobileOpen ? ' ec3-open' : ''}`}>
        <a href="#services"    onClick={() => setMobileOpen(false)}>Services</a>
        <a href="#process"     onClick={() => setMobileOpen(false)}>Process</a>
        <a href="#testimonials" onClick={() => setMobileOpen(false)}>Reviews</a>
        <a href="#areas"       onClick={() => setMobileOpen(false)}>Service Areas</a>
        <a href={`tel:${phone.replace(/\D/g,'')}`} className="ec3-mobile-cta" onClick={() => setMobileOpen(false)}>Free Estimate</a>
      </div>

      {/* HERO */}
      <section className="ec3-hero" id="home">
        <div className="ec3-hero-left">
          <div className="ec3-hero-eyebrow">
            <span className="ec3-hero-eyebrow-dot"/>
            Available 24/7 for Emergencies
          </div>

          <h1 className="ec3-hero-h1" aria-label={heroLines.join(' ')}>
            {letterData.map((line, li) => (
              <span key={li} className="ec3-word-break">
                {line.map((c, ci) =>
                  c.isSpace
                    ? <span key={ci}>&nbsp;</span>
                    : <span key={ci} className="ec3-char" style={{ animationDelay: `${c.delay}ms` }}>{c.ch}</span>
                )}
              </span>
            ))}
          </h1>

          <p className="ec3-hero-sub">
            {businessData.description
              ? businessData.description.split('.').slice(0,2).join('.') + '.'
              : `Licensed, insured, and same-day ready. ${name} handles everything from a tripped breaker to a full home rewire — done right the first time.`}
          </p>

          <div className="ec3-hero-btns">
            <a href={`tel:${phone.replace(/\D/g,'')}`} className="ec3-btn-red">Call {phone}</a>
            <a href="#services" className="ec3-btn-ghost">View Services ↓</a>
          </div>

          <div className="ec3-hero-micro">
            <div className="ec3-micro"><span className="ec3-micro-icon">✓</span> Licensed Master Electrician</div>
            <div className="ec3-micro"><span className="ec3-micro-icon">✓</span> $2M Insured</div>
            <div className="ec3-micro"><span className="ec3-micro-icon">✓</span> Same-Day Service</div>
          </div>
        </div>

        <div className="ec3-hero-right">
          <div className="ec3-house-wrap">
            <div className="ec3-spark"/>
            <div className="ec3-spark"/>
            <div className="ec3-spark"/>
            <div className="ec3-spark"/>

            <svg className="ec3-house-svg" viewBox="0 0 500 420" xmlns="http://www.w3.org/2000/svg" fill="none">
              <ellipse cx="250" cy="410" rx="200" ry="10" fill="#f5f5f4"/>
              <rect x="320" y="110" width="40" height="70" rx="4" className="ec3-house-chimney"/>
              <rect x="315" y="106" width="50" height="12" rx="3" fill="#d6d3d1" stroke="#d6d3d1" strokeWidth="1"/>
              <circle cx="340" cy="90" r="8" fill="#e7e5e4" opacity="0">
                <animate attributeName="cy"      from="90" to="60" dur="3s" begin="1.5s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0;0.4;0" dur="3s" begin="1.5s" repeatCount="indefinite"/>
                <animate attributeName="r"       from="8" to="16"  dur="3s" begin="1.5s" repeatCount="indefinite"/>
              </circle>
              <rect x="80" y="220" width="340" height="185" rx="4" className="ec3-house-wall" stroke="#e7e5e4" strokeWidth="2" fill="#f5f5f4"/>
              <polygon points="60,225 250,80 440,225" className="ec3-house-roof"/>
              <line x1="250" y1="80" x2="250" y2="82" stroke="#dc2626" strokeWidth="4" strokeLinecap="round"/>
              <rect x="210" y="310" width="80" height="95" rx="4" className="ec3-house-door"/>
              <rect x="227" y="325" width="46" height="28" rx="3" fill="#dbeafe" stroke="#bfdbfe" strokeWidth="1.5" opacity="0.9"/>
              <circle cx="282" cy="362" r="4" fill="#a8a29e"/>
              <rect x="100" y="270" width="70" height="55" rx="5" className={`ec3-win${litWindows[0] ? ' ec3-win-lit' : ''}`}/>
              <rect x="330" y="270" width="70" height="55" rx="5" className={`ec3-win${litWindows[1] ? ' ec3-win-lit' : ''}`}/>
              <rect x="175" y="155" width="55" height="45" rx="5" className={`ec3-win${litWindows[2] ? ' ec3-win-lit' : ''}`}/>
              <rect x="270" y="155" width="55" height="45" rx="5" className={`ec3-win${litWindows[3] ? ' ec3-win-lit' : ''}`}/>
              <line x1="135" y1="270" x2="135" y2="325" stroke="#e7e5e4" strokeWidth="1.5" opacity={litWindows[0] ? 0.6 : 0}/>
              <line x1="100" y1="297" x2="170" y2="297" stroke="#e7e5e4" strokeWidth="1.5" opacity={litWindows[0] ? 0.6 : 0}/>
              <line x1="365" y1="270" x2="365" y2="325" stroke="#e7e5e4" strokeWidth="1.5" opacity={litWindows[1] ? 0.6 : 0}/>
              <line x1="330" y1="297" x2="400" y2="297" stroke="#e7e5e4" strokeWidth="1.5" opacity={litWindows[1] ? 0.6 : 0}/>
              <rect x="195" y="400" width="110" height="8" rx="2" fill="#e7e5e4"/>
              <rect x="205" y="393" width="90"  height="8" rx="2" fill="#e7e5e4"/>
              <path d="M260 30 L240 65 L255 65 L235 100 L270 55 L255 55 Z" fill="none" className="ec3-bolt-path"/>
              <path d="M260 30 L240 65 L255 65 L235 100 L270 55 L255 55 Z" className="ec3-bolt-fill"/>
            </svg>
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <div className="ec3-trust" ref={trustRef}>
        <div className="ec3-trust-inner">
          {[
            { icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z', title: 'Licensed & Insured', sub: `Master Electrician ${city.split(',').pop()?.trim() || 'Licensed'}` },
            { icon: 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 6v6l4 2', title: 'Same-Day Service', sub: 'On-site within 2 hours' },
            { icon: 'M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4 12 14.01l-3-3', title: '2-Year Warranty', sub: 'On all labor' },
            { icon: 'M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6', title: 'Upfront Pricing', sub: 'No hidden fees' },
            { icon: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z', title: '4.9★ Rating', sub: '500+ Google reviews' },
          ].map((b, i) => (
            <div key={i} className="ec3-trust-badge">
              <div className="ec3-trust-badge-icon">
                <svg viewBox="0 0 24 24"><path d={b.icon}/></svg>
              </div>
              <div>
                <div className="ec3-trust-badge-text">{b.title}</div>
                <div className="ec3-trust-badge-sub">{b.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SERVICES BENTO */}
      <section className="ec3-section ec3-services" id="services">
        <div className="ec3-section-inner">
          <div className="ec3-services-head">
            <span className="ec3-label">{businessData.copy?.services_label || 'What We Do'}</span>
            <h2 className="ec3-h2">{businessData.copy?.services_heading || 'Every Electrical Service You Need'}</h2>
            <p className="ec3-sub">{businessData.copy?.services_subheading || `From emergency repairs to major installations — fully licensed, fully insured, and backed by a 2-year workmanship guarantee.`}</p>
          </div>

          <div className="ec3-bento">
            {svcList.map((svc, i) => (
              <div key={i} className={`ec3-bento-card${i === 0 ? ' ec3-bento-wide' : ''}`}>
                <div className="ec3-bento-icon">
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d={BENTO_ICONS[i % BENTO_ICONS.length]}/>
                  </svg>
                </div>
                <div className="ec3-bento-name">{svc.name}</div>
                <div className="ec3-bento-desc">{svc.description}</div>
                {i === 0 && svc.features?.length ? (
                  <div className="ec3-bento-feature-list">
                    {svc.features.map((f, fi) => <span key={fi} className="ec3-feature-tag">{f}</span>)}
                  </div>
                ) : null}
                {svc.price && <span className="ec3-bento-price">{svc.price}</span>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <div className="ec3-stats" id="stats">
        <div className="ec3-stats-inner">
          <div className="ec3-stats-grid" ref={statsGridRef}>
            {statList.map((s, i) => {
              const num = parseStatVal(s.value);
              return (
                <div key={i} className="ec3-stat-card">
                  <div className="ec3-stat-num">
                    <span className="ec3-stat-counter" data-target={String(num)}>{num.toLocaleString()}</span>
                    <span className="ec3-stat-suffix">{s.suffix}</span>
                  </div>
                  <div className="ec3-stat-label">{s.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* GUARANTEE */}
      <section className="ec3-section ec3-guarantee" id="guarantee">
        <div className="ec3-section-inner">
          <div className="ec3-guarantee-wrap">
            <div>
              <span className="ec3-label">Our Commitment</span>
              <h2 className="ec3-h2">What You Can Always Expect</h2>
              <p className="ec3-sub">Every technician, every job, every time — these are the non-negotiables at {name}.</p>
              <div className="ec3-checklist" ref={checklistRef}>
                {GUARANTEE_ITEMS.map((g, i) => (
                  <div key={i} className="ec3-check-item">
                    <div className="ec3-check-circle">
                      <svg className="ec3-check-svg" viewBox="0 0 14 14">
                        <polyline className="ec3-check-path" points="2,7 5.5,10.5 12,3"/>
                      </svg>
                    </div>
                    <div>
                      <div className="ec3-check-title">{g.title}</div>
                      <div className="ec3-check-desc">{g.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="ec3-badge-side">
              <div className="ec3-cert-badge">
                <span className="ec3-cert-badge-icon">⚡</span>
                <div className="ec3-cert-badge-title">Licensed Master Electrician</div>
                <div className="ec3-cert-badge-sub">{city} · Since {yr - 15}</div>
              </div>
              <div className="ec3-cert-chips">
                {certList.slice(0, 6).map((c, i) => (
                  <span key={i} className="ec3-cert-chip">{c}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROCESS TIMELINE */}
      <section className="ec3-section ec3-process" id="process">
        <div className="ec3-section-inner">
          <div className="ec3-process-head">
            <span className="ec3-label">How It Works</span>
            <h2 className="ec3-h2">From First Call to Final Inspection</h2>
            <p className="ec3-sub">{"We've simplified the process so you always know exactly what's happening and what's next."}</p>
          </div>
          <div className="ec3-timeline" ref={timelineRef}>
            {PROCESS_STEPS.map((step, i) => {
              const isRight = i % 2 === 1;
              return (
                <div key={i} className={`ec3-tl-item${isRight ? ' ec3-tl-right' : ''}`}>
                  {isRight ? (
                    <>
                      <div className="ec3-tl-empty"/>
                      <div className="ec3-tl-step-num">{i + 1}</div>
                      <div className="ec3-tl-content">
                        <div className="ec3-tl-step-label">Step {step.num}</div>
                        <div className="ec3-tl-title">{step.title}</div>
                        <div className="ec3-tl-desc">{step.desc}</div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="ec3-tl-content">
                        <div className="ec3-tl-step-label">Step {step.num}</div>
                        <div className="ec3-tl-title">{step.title}</div>
                        <div className="ec3-tl-desc">{step.desc}</div>
                      </div>
                      <div className="ec3-tl-step-num">{i + 1}</div>
                      <div className="ec3-tl-empty"/>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS CAROUSEL */}
      <section className="ec3-section ec3-testimonials" id="testimonials" style={{ paddingBottom: 60 }}>
        <div className="ec3-testi-head">
          <span className="ec3-label">{businessData.copy?.testimonials_label || 'What Clients Say'}</span>
          <h2 className="ec3-h2">Trusted by {city} Homeowners</h2>
        </div>
        <div className="ec3-carousel-wrap">
          <div className="ec3-carousel-track">
            {[...testiList, ...testiList].map((t, i) => (
              <div key={i} className="ec3-testi-card">
                <div className="ec3-testi-stars">{starStr(t.rating)}</div>
                <div className="ec3-testi-text">&ldquo;{t.text}&rdquo;</div>
                <div className="ec3-testi-author">
                  <div className="ec3-testi-av">{getInitials(t.name)}</div>
                  <div>
                    <div className="ec3-testi-name">{t.name}</div>
                    <div className="ec3-testi-ctx">{t.context || ''}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICE AREAS */}
      <section className="ec3-section ec3-areas" id="areas">
        <div className="ec3-section-inner">
          <div className="ec3-areas-head">
            <span className="ec3-label">Coverage</span>
            <h2 className="ec3-h2">Serving {city} &amp; Surrounding Areas</h2>
            <p className="ec3-sub">{"Not sure if we cover your location? Give us a call — we likely do."}</p>
          </div>
          <div className="ec3-areas-radial">
            {areaList[0] && (
              <div className="ec3-area-tile">
                <div className="ec3-area-tile-icon">📍</div>
                <div className="ec3-area-tile-name">{areaList[0]}</div>
                <div className="ec3-area-tile-dist">Nearby</div>
              </div>
            )}
            <div className="ec3-area-tile ec3-area-hub">
              <div className="ec3-area-hub-dot"/>
              <div className="ec3-area-hub-name">{city}</div>
            </div>
            {areaList[1] && (
              <div className="ec3-area-tile">
                <div className="ec3-area-tile-icon">📍</div>
                <div className="ec3-area-tile-name">{areaList[1]}</div>
                <div className="ec3-area-tile-dist">Nearby</div>
              </div>
            )}
            {areaList.slice(2).map((a, i) => (
              <div key={i} className="ec3-area-tile">
                <div className="ec3-area-tile-icon">📍</div>
                <div className="ec3-area-tile-name">{a}</div>
                <div className="ec3-area-tile-dist">Nearby</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="ec3-cta" id="contact">
        <div className="ec3-cta-inner">
          <div className="ec3-cta-label">Ready to Get Started?</div>
          <h2 className="ec3-cta-h2">{businessData.copy?.cta_heading || 'Get Your Free Estimate Today'}</h2>
          <p className="ec3-cta-sub">{businessData.copy?.cta_subheading || 'No obligation. No sales pressure. Just an honest, upfront quote from a licensed master electrician.'}</p>
          <a href={`tel:${phone.replace(/\D/g,'')}`} className="ec3-cta-phone">
            <div className="ec3-cta-phone-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
            </div>
            {phone}
          </a>
          <form className="ec3-cta-form" onSubmit={e => e.preventDefault()}>
            <input className="ec3-cta-input" type="text" placeholder="Your name"/>
            <input className="ec3-cta-input" type="tel"  placeholder="Phone number"/>
            <button className="ec3-cta-submit" type="submit">{businessData.copy?.cta_primary || 'Call Me →'}</button>
          </form>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="ec3-footer">
        <div className="ec3-footer-inner">
          <div className="ec3-footer-top">
            <div>
              <a href="#" className="ec3-footer-logo">
                <div className="ec3-logo-mark" style={{ width: 28, height: 28 }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 15, height: 15 }}>
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                  </svg>
                </div>
                <span className="ec3-footer-logo-text">{name}</span>
              </a>
              <p className="ec3-footer-about">{description.split('.').slice(0,2).join('.')}.</p>
            </div>
            <div>
              <div className="ec3-footer-col-title">Services</div>
              <ul className="ec3-footer-links">
                {svcList.slice(0,5).map((s, i) => <li key={i}><a href="#services">{s.name}</a></li>)}
              </ul>
            </div>
            <div>
              <div className="ec3-footer-col-title">Contact</div>
              <ul className="ec3-footer-links">
                <li><a href={`tel:${phone.replace(/\D/g,'')}`}>{phone}</a></li>
                <li><a href={`mailto:${email}`}>{email}</a></li>
                <li><a href="#">{city}</a></li>
                {businessData.hours?.weekdays && <li><a href="#">{businessData.hours.weekdays}</a></li>}
                <li><a href="#">24/7 Emergency Line</a></li>
              </ul>
            </div>
          </div>
          <hr className="ec3-footer-divider"/>
          <div className="ec3-footer-bottom">
            <span className="ec3-footer-copy">© {yr} {name}. All rights reserved.</span>
            <span className="ec3-footer-badge">⚡ Powered by Localio</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
