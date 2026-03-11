'use client';
import { useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';
import type { TemplateProps, ServiceItem, Testimonial, FAQ, Stat } from '../../types';

/* ── Palette ─────────────────────────────────────────────────────────────── */
const P = {
  white:   '#ffffff',
  cream:   '#fafaf8',
  offwhite:'#f5f2ee',
  amber:   '#fff7ed',
  orange:  '#f97316',
  orangeD: '#ea6c0a',
  orangeL: '#fdba74',
  charcoal:'#1c1c1e',
  gray:    '#6b7280',
  border:  '#ede9e3',
  shadow:  'rgba(0,0,0,0.06)',
  green:   '#16a34a',
} as const;

/* ── Hooks ───────────────────────────────────────────────────────────────── */
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

/* ── Styles ──────────────────────────────────────────────────────────────── */
const STYLES = `
  .pb2 * { box-sizing: border-box; margin: 0; padding: 0; }
  .pb2 { font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; color: ${P.charcoal}; background: ${P.cream}; overflow-x: hidden;  container-type: inline-size; }

  /* ── NAV ── */
  .pb2-nav { position: fixed; top: 0; left: 0; right: 0; z-index: 200; background: rgba(250,250,248,0.96); backdrop-filter: blur(14px); border-bottom: 1px solid ${P.border}; padding: 0 2rem; height: 68px; display: flex; align-items: center; justify-content: space-between; transition: box-shadow 0.3s; }
  .pb2-nav.scrolled { box-shadow: 0 2px 20px rgba(0,0,0,0.08); }
  .pb2-logo { font-size: 1.4rem; font-weight: 900; color: ${P.charcoal}; cursor: pointer; letter-spacing: -0.5px; display: flex; align-items: center; gap: 0.4rem; }
  .pb2-logo-accent { color: ${P.orange}; }
  .pb2-desk-links { display: flex; gap: 1.8rem; list-style: none; }
  .pb2-desk-links button { background: none; border: none; color: ${P.gray}; font-size: 0.88rem; font-weight: 500; cursor: pointer; transition: color 0.2s; padding: 0; }
  .pb2-desk-links button:hover { color: ${P.charcoal}; }
  .pb2-nav-cta { background: ${P.orange}; color: white; padding: 0.55rem 1.3rem; border-radius: 8px; font-weight: 700; font-size: 0.88rem; text-decoration: none; transition: background 0.2s, transform 0.2s; border: none; cursor: pointer; }
  .pb2-nav-cta:hover { background: ${P.orangeD}; transform: translateY(-1px); }
  .pb2-burger { display: none; flex-direction: column; gap: 5px; background: none; border: none; cursor: pointer; padding: 4px; }
  .pb2-burger span { display: block; width: 24px; height: 2px; background: ${P.charcoal}; border-radius: 2px; transition: all 0.28s; }
  .pb2-burger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
  .pb2-burger.open span:nth-child(2) { opacity: 0; }
  .pb2-burger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }
  .pb2-mob-menu { display: none; position: fixed; top: 68px; left: 0; right: 0; background: ${P.white}; border-bottom: 1px solid ${P.border}; padding: 1rem 2rem 1.5rem; flex-direction: column; z-index: 199; box-shadow: 0 8px 30px rgba(0,0,0,0.08); }
  .pb2-mob-menu.open { display: flex; animation: pb2-mob-slide 0.25s ease; }
  .pb2-mob-menu button { padding: 0.9rem 0; color: ${P.charcoal}; font-weight: 600; font-size: 1rem; border-bottom: 1px solid ${P.border}; background: none; border-left: none; border-right: none; border-top: none; cursor: pointer; text-align: left; }
  .pb2-mob-menu button:last-child { border-bottom: none; }
  .pb2-mob-phone { color: ${P.orange} !important; }

  /* ── HERO ── */
  .pb2-hero { min-height: 100vh; display: grid; grid-template-columns: 1fr 1fr; padding-top: 68px; overflow: hidden; }
  .pb2-hero-left { background: ${P.cream}; padding: 5rem 3rem 5rem 4rem; display: flex; flex-direction: column; justify-content: center; position: relative; z-index: 1; animation: pb2-hero-left-in 0.9s ease both; }
  .pb2-hero-right { background: ${P.amber}; padding: 5rem 4rem 5rem 5rem; display: flex; flex-direction: column; justify-content: center; align-items: flex-start; clip-path: polygon(8% 0, 100% 0, 100% 100%, 0% 100%); position: relative; overflow: hidden; animation: pb2-hero-right-in 0.9s 0.2s ease both; }
  .pb2-hero-right::before { content: ''; position: absolute; top: -80px; right: -80px; width: 300px; height: 300px; border-radius: 50%; background: rgba(249,115,22,0.1); pointer-events: none; }
  .pb2-hero-right::after  { content: ''; position: absolute; bottom: -60px; left: 20%; width: 200px; height: 200px; border-radius: 50%; background: rgba(249,115,22,0.07); pointer-events: none; }
  .pb2-hero-tag { display: inline-flex; align-items: center; gap: 0.5rem; background: ${P.amber}; border: 1px solid ${P.orangeL}; color: ${P.orangeD}; padding: 0.38rem 0.9rem; border-radius: 50px; font-size: 0.78rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 1.6rem; width: fit-content; }
  .pb2-tag-dot { width: 7px; height: 7px; border-radius: 50%; background: ${P.orange}; animation: pb2-blink 1.8s infinite; flex-shrink: 0; }
  .pb2-hero-h1 { font-size: clamp(2.6rem, 5vw, 4rem); font-weight: 900; color: ${P.charcoal}; line-height: 1.1; margin-bottom: 1.4rem; }
  .pb2-hero-h1-accent { position: relative; display: inline-block; color: ${P.orange}; }
  .pb2-hero-h1-accent::after { content: ''; position: absolute; bottom: -4px; left: 0; right: 0; height: 4px; background: ${P.orange}; border-radius: 2px; animation: pb2-underline-grow 0.8s 0.6s ease both; transform-origin: left; }
  .pb2-hero-sub { color: ${P.gray}; font-size: 1rem; line-height: 1.75; margin-bottom: 2rem; max-width: 480px; }
  .pb2-hero-bullets { display: flex; flex-direction: column; gap: 0.6rem; margin-bottom: 2.5rem; }
  .pb2-hero-bullet { display: flex; align-items: center; gap: 0.65rem; font-size: 0.9rem; font-weight: 600; color: ${P.charcoal}; opacity: 0; transform: translateX(-16px); animation: pb2-bullet-in 0.5s ease forwards; }
  .pb2-hero-bullet:nth-child(1) { animation-delay: 0.4s; }
  .pb2-hero-bullet:nth-child(2) { animation-delay: 0.55s; }
  .pb2-hero-bullet:nth-child(3) { animation-delay: 0.7s; }
  .pb2-bullet-icon { width: 26px; height: 26px; border-radius: 50%; background: ${P.amber}; display: flex; align-items: center; justify-content: center; font-size: 0.85rem; flex-shrink: 0; }
  .pb2-hero-ctas { display: flex; gap: 1rem; flex-wrap: wrap; }
  /* Hero right */
  .pb2-tool-wrap { position: relative; height: 200px; display: flex; align-items: center; justify-content: center; width: 100%; margin-bottom: 2.5rem; }
  .pb2-hero-tool { font-size: 7rem; display: inline-block; animation: pb2-tool-wobble 2.5s ease-in-out infinite; filter: drop-shadow(0 16px 32px rgba(249,115,22,0.3)); position: relative; z-index: 1; }
  .pb2-orbit { position: absolute; border-radius: 50%; border: 2px dashed rgba(249,115,22,0.25); top: 50%; left: 50%; transform: translate(-50%,-50%); }
  .pb2-orbit-1 { width: 160px; height: 160px; animation: pb2-orbit-spin 8s linear infinite; }
  .pb2-orbit-2 { width: 220px; height: 220px; animation: pb2-orbit-spin 12s linear infinite reverse; }
  .pb2-orbit-dot { width: 10px; height: 10px; background: ${P.orange}; border-radius: 50%; position: absolute; top: -5px; left: 50%; margin-left: -5px; box-shadow: 0 0 8px rgba(249,115,22,0.5); }
  .pb2-phone-card { background: ${P.white}; border-radius: 18px; padding: 1.8rem 2rem; box-shadow: 0 12px 40px rgba(0,0,0,0.1); position: relative; z-index: 1; width: 100%; }
  .pb2-phone-label { font-size: 0.72rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; color: ${P.gray}; margin-bottom: 0.4rem; }
  .pb2-phone-number { font-size: clamp(1.5rem, 3vw, 2rem); font-weight: 900; color: ${P.charcoal}; margin-bottom: 0.4rem; }
  .pb2-phone-avail { display: flex; align-items: center; gap: 0.5rem; font-size: 0.8rem; color: ${P.green}; font-weight: 600; margin-bottom: 1.2rem; }
  .pb2-avail-dot { width: 8px; height: 8px; border-radius: 50%; background: ${P.green}; animation: pb2-blink 1.5s infinite; flex-shrink: 0; }
  .pb2-phone-cta { display: block; background: ${P.orange}; color: white; text-align: center; padding: 0.8rem; border-radius: 10px; font-weight: 800; font-size: 0.9rem; text-decoration: none; transition: background 0.2s; }
  .pb2-phone-cta:hover { background: ${P.orangeD}; }

  /* ── BUTTONS ── */
  .pb2-btn-orange { background: ${P.orange}; color: white; padding: 0.9rem 1.9rem; border-radius: 10px; font-weight: 800; font-size: 0.95rem; text-decoration: none; border: none; cursor: pointer; display: inline-flex; align-items: center; gap: 0.45rem; transition: background 0.2s, transform 0.2s, box-shadow 0.2s; position: relative; overflow: hidden; }
  .pb2-btn-orange::after { content: ''; position: absolute; inset: 0; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent); transform: translateX(-100%); transition: transform 0.4s; }
  .pb2-btn-orange:hover::after { transform: translateX(100%); }
  .pb2-btn-orange:hover { background: ${P.orangeD}; transform: translateY(-2px); box-shadow: 0 8px 28px rgba(249,115,22,0.35); }
  .pb2-btn-ghost { background: transparent; color: ${P.charcoal}; border: 2px solid ${P.border}; padding: 0.9rem 1.9rem; border-radius: 10px; font-weight: 700; font-size: 0.95rem; text-decoration: none; cursor: pointer; display: inline-flex; align-items: center; gap: 0.45rem; transition: all 0.2s; }
  .pb2-btn-ghost:hover { border-color: ${P.orange}; color: ${P.orange}; }

  /* ── TRUST BADGES ── */
  .pb2-trust { background: ${P.white}; border-bottom: 1px solid ${P.border}; padding: 2rem; }
  .pb2-trust-inner { max-width: 1100px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; gap: 1rem; flex-wrap: wrap; }
  .pb2-badge { display: flex; align-items: center; gap: 0.7rem; font-size: 0.88rem; font-weight: 700; color: ${P.charcoal}; opacity: 0; transform: scale(0.85); transition: opacity 0.5s ease, transform 0.5s ease; }
  .pb2-badge.in { opacity: 1; transform: scale(1); }
  .pb2-badge:nth-child(1) { transition-delay: 0.05s; }
  .pb2-badge:nth-child(2) { transition-delay: 0.15s; }
  .pb2-badge:nth-child(3) { transition-delay: 0.25s; }
  .pb2-badge:nth-child(4) { transition-delay: 0.35s; }
  .pb2-badge:nth-child(5) { transition-delay: 0.45s; }
  .pb2-badge-icon { width: 40px; height: 40px; border-radius: 10px; background: ${P.amber}; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; flex-shrink: 0; }
  .pb2-badge-main { font-weight: 800; font-size: 0.85rem; color: ${P.charcoal}; display: block; }
  .pb2-badge-sub  { font-size: 0.72rem; font-weight: 500; color: ${P.gray}; display: block; }

  /* ── SECTION BASE ── */
  .pb2-sec { padding: 5.5rem 2rem; }
  .pb2-con { max-width: 1100px; margin: 0 auto; }
  .pb2-eyebrow { font-size: 0.74rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.12em; color: ${P.orange}; margin-bottom: 0.55rem; }
  .pb2-h2 { font-size: clamp(2rem, 4vw, 2.75rem); font-weight: 900; color: ${P.charcoal}; margin-bottom: 0.75rem; line-height: 1.15; }
  .pb2-lead { color: ${P.gray}; font-size: 0.96rem; line-height: 1.7; max-width: 560px; }
  .pb2-hdr { margin-bottom: 3rem; }
  .pb2-hdr-center { text-align: center; }
  .pb2-hdr-center .pb2-lead { margin: 0 auto; }
  /* Reveal */
  .pb2-rv       { opacity: 0; transform: translateY(36px);   transition: opacity 0.65s ease, transform 0.65s ease; }
  .pb2-rv-left  { opacity: 0; transform: translateX(-36px);  transition: opacity 0.65s ease, transform 0.65s ease; }
  .pb2-rv-right { opacity: 0; transform: translateX(36px);   transition: opacity 0.65s ease, transform 0.65s ease; }
  .pb2-rv.in, .pb2-rv-left.in, .pb2-rv-right.in { opacity: 1; transform: none; }
  .pb2-d1 { transition-delay: 0.1s; } .pb2-d2 { transition-delay: 0.2s; }
  .pb2-d3 { transition-delay: 0.3s; } .pb2-d4 { transition-delay: 0.4s; }

  /* ── SERVICES (TABBED) ── */
  .pb2-svc-bg { background: ${P.cream}; }
  .pb2-tabs-nav { display: flex; border-bottom: 2px solid ${P.border}; margin-bottom: 2.5rem; gap: 0; overflow-x: auto; scrollbar-width: none; }
  .pb2-tabs-nav::-webkit-scrollbar { display: none; }
  .pb2-tab-btn { padding: 1rem 1.4rem; background: none; border: none; border-bottom: 3px solid transparent; font-weight: 700; font-size: 0.88rem; color: ${P.gray}; cursor: pointer; margin-bottom: -2px; white-space: nowrap; transition: all 0.22s; display: flex; align-items: center; gap: 0.45rem; }
  .pb2-tab-btn:hover { color: ${P.charcoal}; }
  .pb2-tab-btn.active { color: ${P.orange}; border-bottom-color: ${P.orange}; }
  .pb2-tab-panel { display: none; }
  .pb2-tab-panel.active { display: grid; grid-template-columns: 1fr 1fr; gap: 3.5rem; align-items: center; animation: pb2-tab-slide 0.32s ease; }
  .pb2-tab-icon { font-size: 3.5rem; margin-bottom: 1.2rem; display: block; animation: pb2-icon-pop 0.4s ease; }
  .pb2-tab-title { font-size: 1.6rem; font-weight: 900; color: ${P.charcoal}; margin-bottom: 0.75rem; }
  .pb2-tab-desc { color: ${P.gray}; font-size: 0.94rem; line-height: 1.7; margin-bottom: 1.5rem; }
  .pb2-tab-feats { list-style: none; display: flex; flex-direction: column; gap: 0.65rem; margin-bottom: 1.8rem; }
  .pb2-tab-feats li { display: flex; align-items: center; gap: 0.65rem; font-size: 0.9rem; font-weight: 600; color: ${P.charcoal}; }
  .pb2-feat-check { width: 22px; height: 22px; border-radius: 50%; background: ${P.amber}; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 0.7rem; color: ${P.orange}; font-weight: 900; }
  .pb2-tab-visual { background: ${P.amber}; border-radius: 20px; padding: 3rem; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; min-height: 260px; }
  .pb2-tab-visual-icon { font-size: 7rem; filter: drop-shadow(0 10px 30px rgba(249,115,22,0.25)); animation: pb2-visual-float 3s ease-in-out infinite; position: relative; z-index: 1; }
  .pb2-tab-visual::before { content: ''; position: absolute; top: -30px; right: -30px; width: 150px; height: 150px; border-radius: 50%; background: rgba(249,115,22,0.12); }
  .pb2-tab-visual::after  { content: ''; position: absolute; bottom: -20px; left: 20px; width: 100px; height: 100px; border-radius: 50%; background: rgba(249,115,22,0.08); }

  /* ── STATS ── */
  .pb2-stats-bg { background: ${P.orange}; padding: 4.5rem 2rem; position: relative; overflow: hidden; }
  .pb2-stats-bg::before { content: ''; position: absolute; top: -80px; left: -80px; width: 300px; height: 300px; border-radius: 50%; background: rgba(255,255,255,0.07); pointer-events: none; }
  .pb2-stats-bg::after  { content: ''; position: absolute; bottom: -60px; right: -40px; width: 250px; height: 250px; border-radius: 50%; background: rgba(255,255,255,0.05); pointer-events: none; }
  .pb2-stats-grid { max-width: 1100px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0; position: relative; z-index: 1; }
  .pb2-stat-item { text-align: center; padding: 2rem 1.5rem; border-right: 1px solid rgba(255,255,255,0.2); }
  .pb2-stat-item:last-child { border-right: none; }
  .pb2-stat-num-wrap { display: flex; align-items: baseline; justify-content: center; gap: 0.1rem; margin-bottom: 0.6rem; }
  .pb2-slot-machine { display: inline-flex; align-items: baseline; font-size: clamp(2.8rem, 5vw, 3.8rem); font-weight: 900; color: white; line-height: 1; }
  .pb2-slot-reel { height: 1em; overflow: hidden; display: inline-block; vertical-align: bottom; }
  .pb2-slot-strip { display: flex; flex-direction: column; transition: transform 1.2s cubic-bezier(0.23,1,0.32,1); }
  .pb2-slot-digit { height: 1em; line-height: 1; display: block; text-align: center; }
  .pb2-stat-suffix { font-size: clamp(1.4rem, 2.5vw, 2rem); font-weight: 900; color: rgba(255,255,255,0.75); }
  .pb2-stat-divider { width: 32px; height: 2px; background: rgba(255,255,255,0.4); border-radius: 2px; margin: 0.6rem auto 0.5rem; }
  .pb2-stat-label { font-size: 0.84rem; color: rgba(255,255,255,0.8); font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; }

  /* ── ABOUT ── */
  .pb2-about-bg { background: ${P.white}; }
  .pb2-about-inner { display: grid; grid-template-columns: 1fr 1.4fr; gap: 5rem; align-items: center; }
  .pb2-about-big-num { font-size: clamp(7rem, 14vw, 11rem); font-weight: 900; color: ${P.charcoal}; line-height: 0.9; letter-spacing: -0.04em; display: block; }
  .pb2-about-big-num-accent { color: ${P.orange}; }
  .pb2-about-years-lbl { font-size: 1.05rem; font-weight: 700; color: ${P.gray}; margin-top: 0.5rem; text-transform: uppercase; letter-spacing: 0.08em; }
  .pb2-about-deco-line { width: 60px; height: 4px; background: ${P.orange}; border-radius: 2px; margin: 1.5rem 0; }
  .pb2-about-tagline { font-size: clamp(1.4rem, 3vw, 1.9rem); font-weight: 900; color: ${P.charcoal}; line-height: 1.25; margin-bottom: 1rem; }
  .pb2-about-p { font-size: 0.94rem; color: ${P.gray}; line-height: 1.75; margin-bottom: 1rem; }
  .pb2-cert-tags { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.5rem; }
  .pb2-cert-tag { background: ${P.amber}; border: 1px solid ${P.orangeL}; color: ${P.orangeD}; font-size: 0.78rem; font-weight: 700; padding: 0.3rem 0.85rem; border-radius: 50px; }

  /* ── PROCESS (VERTICAL TIMELINE) ── */
  .pb2-proc-bg { background: ${P.cream}; }
  .pb2-timeline { position: relative; max-width: 860px; margin: 0 auto; }
  .pb2-tl-line { position: absolute; left: 50%; top: 0; bottom: 0; width: 3px; background: ${P.border}; transform: translateX(-50%); }
  .pb2-tl-fill { width: 100%; background: ${P.orange}; height: 0; transition: height 2s ease; border-radius: 2px; }
  .pb2-timeline.pb2-animated .pb2-tl-fill { height: 100%; }
  .pb2-tl-item { display: grid; grid-template-columns: 1fr 60px 1fr; align-items: center; margin-bottom: 3rem; }
  .pb2-tl-item:last-child { margin-bottom: 0; }
  .pb2-tl-left  { padding-right: 2rem; text-align: right; }
  .pb2-tl-right { padding-left: 2rem; text-align: left; }
  .pb2-tl-empty { /* filler col */ }
  .pb2-tl-dot { width: 52px; height: 52px; border-radius: 50%; background: ${P.orange}; color: white; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; position: relative; z-index: 1; box-shadow: 0 0 0 6px ${P.amber}, 0 4px 20px rgba(249,115,22,0.3); justify-self: center; }
  .pb2-timeline.pb2-animated .pb2-tl-dot { animation: pb2-dot-pop 0.4s ease both; }
  .pb2-tl-item:nth-child(1) .pb2-tl-dot { animation-delay: 0.3s; }
  .pb2-tl-item:nth-child(2) .pb2-tl-dot { animation-delay: 0.7s; }
  .pb2-tl-item:nth-child(3) .pb2-tl-dot { animation-delay: 1.1s; }
  .pb2-tl-item:nth-child(4) .pb2-tl-dot { animation-delay: 1.5s; }
  .pb2-tl-card { background: ${P.white}; border-radius: 16px; padding: 1.5rem 1.8rem; box-shadow: 0 4px 24px ${P.shadow}; border: 1px solid ${P.border}; transition: transform 0.3s, box-shadow 0.3s; }
  .pb2-tl-card:hover { transform: translateY(-3px); box-shadow: 0 12px 40px rgba(0,0,0,0.1); }
  .pb2-tl-step-num { font-size: 0.72rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; color: ${P.orange}; margin-bottom: 0.4rem; }
  .pb2-tl-title { font-weight: 800; font-size: 1.05rem; color: ${P.charcoal}; margin-bottom: 0.4rem; }
  .pb2-tl-desc  { font-size: 0.86rem; color: ${P.gray}; line-height: 1.6; }

  /* ── TESTIMONIALS (STACKED) ── */
  .pb2-testi-bg { background: ${P.offwhite}; }
  .pb2-testi-stack { display: flex; flex-direction: column; gap: 1.4rem; }
  .pb2-testi-card { background: ${P.white}; border-radius: 18px; padding: 1.8rem 2rem; display: grid; grid-template-columns: 1fr auto; gap: 2rem; align-items: start; border: 1px solid ${P.border}; box-shadow: 0 2px 16px ${P.shadow}; transition: transform 0.3s, box-shadow 0.3s; }
  .pb2-testi-card:hover { transform: translateX(6px); box-shadow: 0 8px 32px rgba(0,0,0,0.09); }
  .pb2-testi-quote { font-size: 3rem; color: ${P.orangeL}; font-family: Georgia, serif; line-height: 0.8; margin-bottom: 0.5rem; display: block; }
  .pb2-testi-text { font-size: 0.95rem; line-height: 1.72; color: ${P.charcoal}; margin-bottom: 1.2rem; font-style: italic; }
  .pb2-testi-author-row { display: flex; align-items: center; gap: 0.7rem; }
  .pb2-testi-avatar { width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, ${P.orange}, ${P.orangeD}); display: flex; align-items: center; justify-content: center; color: white; font-weight: 800; font-size: 0.85rem; flex-shrink: 0; }
  .pb2-testi-name { font-weight: 800; font-size: 0.88rem; color: ${P.charcoal}; }
  .pb2-testi-loc  { font-size: 0.76rem; color: ${P.gray}; }
  .pb2-rating-wrap { display: flex; flex-direction: column; align-items: center; gap: 0.35rem; min-width: 70px; }
  .pb2-rating-num { font-size: 1.6rem; font-weight: 900; color: ${P.orange}; line-height: 1; }
  .pb2-rating-stars { color: ${P.orange}; font-size: 0.75rem; letter-spacing: 1px; }
  .pb2-rating-sub { font-size: 0.68rem; color: ${P.gray}; text-align: center; }

  /* ── FAQ (TWO PANEL) ── */
  .pb2-faq-bg { background: ${P.white}; }
  .pb2-faq-inner { display: grid; grid-template-columns: 1fr 1fr; border: 1px solid ${P.border}; border-radius: 20px; overflow: hidden; }
  .pb2-faq-left { border-right: 1px solid ${P.border}; }
  .pb2-faq-hdr { padding: 1.8rem 2rem; background: ${P.cream}; border-bottom: 1px solid ${P.border}; }
  .pb2-faq-hdr-eyebrow { font-size: 0.72rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.12em; color: ${P.orange}; margin-bottom: 0.4rem; }
  .pb2-faq-hdr-title { font-size: 1.2rem; font-weight: 900; color: ${P.charcoal}; }
  .pb2-faq-q-item { padding: 1.1rem 2rem; cursor: pointer; border-bottom: 1px solid ${P.border}; transition: background 0.2s; display: flex; align-items: center; gap: 0.75rem; }
  .pb2-faq-q-item:last-child { border-bottom: none; }
  .pb2-faq-q-item:hover { background: ${P.cream}; }
  .pb2-faq-q-item.active { background: ${P.amber}; }
  .pb2-faq-q-num  { font-size: 0.75rem; font-weight: 800; color: ${P.orangeL}; min-width: 28px; }
  .pb2-faq-q-item.active .pb2-faq-q-num { color: ${P.orange}; }
  .pb2-faq-q-text { font-size: 0.88rem; font-weight: 600; color: ${P.charcoal}; line-height: 1.4; flex: 1; }
  .pb2-faq-q-item.active .pb2-faq-q-text { color: ${P.orangeD}; }
  .pb2-faq-q-arrow { color: ${P.border}; font-size: 1rem; transition: color 0.2s; }
  .pb2-faq-q-item.active .pb2-faq-q-arrow { color: ${P.orange}; }
  .pb2-faq-right { background: ${P.white}; display: flex; align-items: center; min-height: 280px; }
  .pb2-faq-answer { padding: 2.5rem; animation: pb2-faq-fade 0.32s ease; }
  .pb2-faq-a-eyebrow { font-size: 0.7rem; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; color: ${P.orange}; margin-bottom: 0.9rem; }
  .pb2-faq-a-q { font-size: 1.1rem; font-weight: 800; color: ${P.charcoal}; margin-bottom: 1rem; line-height: 1.35; }
  .pb2-faq-a-text { font-size: 0.92rem; color: ${P.gray}; line-height: 1.75; }

  /* ── SERVICE AREAS ── */
  .pb2-areas-bg { background: ${P.cream}; }
  .pb2-areas-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(185px, 1fr)); gap: 1rem; }
  .pb2-area-item { display: flex; align-items: center; gap: 0.75rem; background: ${P.white}; border-radius: 12px; padding: 0.9rem 1.1rem; border: 1px solid ${P.border}; transition: all 0.25s; font-weight: 600; font-size: 0.88rem; color: ${P.charcoal}; }
  .pb2-area-item:hover { border-color: ${P.orange}; box-shadow: 0 4px 18px rgba(249,115,22,0.1); transform: translateY(-2px); }
  .pb2-area-dot { width: 10px; height: 10px; border-radius: 50%; background: ${P.orange}; flex-shrink: 0; position: relative; }
  .pb2-area-dot::after { content: ''; position: absolute; inset: -3px; border-radius: 50%; background: ${P.orange}; opacity: 0.25; animation: pb2-area-pulse 2s infinite; }

  /* ── CTA SPLIT ── */
  .pb2-cta-bg { background: ${P.cream}; }
  .pb2-cta-inner { display: grid; grid-template-columns: 1fr 1fr; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.1); }
  .pb2-cta-left { background: ${P.charcoal}; padding: 4rem; display: flex; flex-direction: column; justify-content: center; }
  .pb2-cta-eyebrow { font-size: 0.74rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.12em; color: ${P.orangeL}; margin-bottom: 0.8rem; }
  .pb2-cta-h2 { font-size: clamp(1.8rem, 3.5vw, 2.5rem); font-weight: 900; color: white; line-height: 1.15; margin-bottom: 1.2rem; }
  .pb2-cta-h2-accent { color: ${P.orange}; }
  .pb2-cta-sub { color: rgba(255,255,255,0.52); font-size: 0.95rem; line-height: 1.7; margin-bottom: 2rem; }
  .pb2-cta-badges { display: flex; flex-direction: column; gap: 0.6rem; }
  .pb2-cta-badge { display: flex; align-items: center; gap: 0.6rem; color: rgba(255,255,255,0.68); font-size: 0.84rem; }
  .pb2-cta-badge-icon { color: ${P.orange}; }
  .pb2-cta-right { background: ${P.orange}; padding: 4rem; display: flex; flex-direction: column; justify-content: center; gap: 1.4rem; }
  .pb2-contact-card { background: rgba(255,255,255,0.18); border: 1px solid rgba(255,255,255,0.3); border-radius: 16px; padding: 1.3rem 1.5rem; }
  .pb2-cc-label { font-size: 0.7rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; color: rgba(255,255,255,0.7); margin-bottom: 0.3rem; }
  .pb2-cc-value    { font-size: 1.2rem; font-weight: 900; color: white; }
  .pb2-cc-value-sm { font-size: 0.88rem; font-weight: 700; color: rgba(255,255,255,0.9); line-height: 1.7; }
  .pb2-cta-call { display: block; background: white; color: ${P.orange}; text-align: center; padding: 1rem; border-radius: 12px; font-weight: 900; font-size: 1.1rem; text-decoration: none; transition: transform 0.2s, box-shadow 0.2s; }
  .pb2-cta-call:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.2); }

  /* ── FOOTER ── */
  .pb2-footer { background: ${P.charcoal}; padding: 4rem 2rem 2rem; position: relative; overflow: hidden; }
  .pb2-footer-wm { position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); font-size: clamp(6rem, 15vw, 12rem); font-weight: 900; color: rgba(255,255,255,0.03); white-space: nowrap; pointer-events: none; letter-spacing: -0.04em; user-select: none; }
  .pb2-footer-grid { max-width: 1100px; margin: 0 auto; display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 3rem; margin-bottom: 3rem; position: relative; z-index: 1; }
  .pb2-footer-logo { font-size: 1.5rem; font-weight: 900; color: white; margin-bottom: 0.9rem; }
  .pb2-footer-logo-accent { color: ${P.orange}; }
  .pb2-footer-desc { font-size: 0.86rem; color: rgba(255,255,255,0.4); line-height: 1.7; margin-bottom: 1.4rem; }
  .pb2-footer-row { display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.6rem; color: rgba(255,255,255,0.58); font-size: 0.86rem; }
  .pb2-footer-row-icon { color: ${P.orange}; }
  .pb2-f-head { font-size: 0.78rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; color: white; margin-bottom: 1.1rem; }
  .pb2-f-links { list-style: none; }
  .pb2-f-links li { margin-bottom: 0.55rem; }
  .pb2-f-links button { background: none; border: none; color: rgba(255,255,255,0.45); font-size: 0.86rem; cursor: pointer; transition: color 0.2s; padding: 0; text-align: left; }
  .pb2-f-links button:hover { color: ${P.orange}; }
  .pb2-footer-bottom { max-width: 1100px; margin: 0 auto; padding-top: 1.4rem; border-top: 1px solid rgba(255,255,255,0.07); display: flex; justify-content: space-between; font-size: 0.76rem; color: rgba(255,255,255,0.25); flex-wrap: wrap; gap: 0.5rem; position: relative; z-index: 1; }

  /* ── RESPONSIVE ── */
  @container (max-width: 860px) {
    .pb2-desk-links { display: none !important; }
    .pb2-nav-cta { display: none !important; }
    .pb2-burger { display: flex !important; }
    .pb2-hero { grid-template-columns: 1fr !important; }
    .pb2-hero-right { clip-path: none !important; padding: 3rem 1.5rem !important; }
    .pb2-hero-left { padding: 3rem 1.5rem 2rem !important; }
    .pb2-about-inner { grid-template-columns: 1fr !important; gap: 2.5rem !important; }
    .pb2-cta-inner { grid-template-columns: 1fr !important; }
    .pb2-footer-grid { grid-template-columns: 1fr !important; gap: 2rem !important; }
    .pb2-footer-bottom { flex-direction: column !important; text-align: center !important; }
    .pb2-trust-inner { justify-content: center !important; }
  }
  @container (max-width: 700px) {
    .pb2-tab-panel.active { grid-template-columns: 1fr !important; gap: 2rem !important; }
    .pb2-faq-inner { grid-template-columns: 1fr !important; }
    .pb2-faq-right { display: none !important; }
    .pb2-testi-card { grid-template-columns: 1fr !important; gap: 1rem !important; }
  }
  @container (max-width: 640px) {
    .pb2-tl-item { grid-template-columns: 48px 1fr !important; }
    .pb2-tl-line { left: 24px !important; }
    .pb2-tl-left { display: none !important; }
    .pb2-tl-right, .pb2-tl-empty { grid-column: auto !important; padding-left: 1rem !important; text-align: left !important; }
    .pb2-stat-item { border-right: none !important; border-bottom: 1px solid rgba(255,255,255,0.15) !important; }
    .pb2-stat-item:last-child { border-bottom: none !important; }
    .pb2-sec { padding: 4rem 1.2rem !important; }
    .pb2-trust { padding: 1.5rem 1.2rem !important; }
  }

  /* ── KEYFRAMES ── */
  @keyframes pb2-mob-slide      { from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:none} }
  @keyframes pb2-hero-left-in   { from{opacity:0;transform:translateX(-40px)}to{opacity:1;transform:none} }
  @keyframes pb2-hero-right-in  { from{opacity:0;clip-path:polygon(100% 0,100% 0,100% 100%,100% 100%)}to{opacity:1;clip-path:polygon(8% 0,100% 0,100% 100%,0% 100%)} }
  @keyframes pb2-blink          { 0%,100%{opacity:1}50%{opacity:0.3} }
  @keyframes pb2-underline-grow { from{transform:scaleX(0)}to{transform:scaleX(1)} }
  @keyframes pb2-bullet-in      { from{opacity:0;transform:translateX(-16px)}to{opacity:1;transform:none} }
  @keyframes pb2-tool-wobble    { 0%,100%{transform:rotate(-12deg) scale(1)}25%{transform:rotate(14deg) scale(1.05)}50%{transform:rotate(-8deg) scale(1)}75%{transform:rotate(10deg) scale(1.03)} }
  @keyframes pb2-orbit-spin     { from{transform:translate(-50%,-50%) rotate(0deg)}to{transform:translate(-50%,-50%) rotate(360deg)} }
  @keyframes pb2-tab-slide      { from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:none} }
  @keyframes pb2-icon-pop       { from{transform:scale(0.6) rotate(-10deg)}to{transform:scale(1) rotate(0deg)} }
  @keyframes pb2-visual-float   { 0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)} }
  @keyframes pb2-dot-pop        { 0%{transform:scale(0)}70%{transform:scale(1.15)}100%{transform:scale(1)} }
  @keyframes pb2-faq-fade       { from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none} }
  @keyframes pb2-area-pulse     { 0%,100%{transform:scale(1);opacity:0.25}50%{transform:scale(2);opacity:0} }
`;

/* ── Default data ─────────────────────────────────────────────────────────── */
const DEF_SERVICES = [
  { icon: '💧', name: 'Leak Detection & Repair',    desc: 'We locate hidden leaks fast using advanced acoustic and thermal detection — no tearing apart walls unnecessarily. Most leaks fixed same day.',           features: ['Non-invasive detection technology', 'Slab & pipe leak specialists', 'Emergency shutoffs handled immediately', 'Full repair with warranty'] },
  { icon: '🚿', name: 'Drain Cleaning',             desc: 'Stubborn clogs cleared with professional hydro-jetting equipment that blasts buildup and root intrusions from the inside out. Permanent, not temporary.',   features: ['Hydro-jetting up to 4,000 PSI', 'Camera inspection included', 'Kitchen, bath & main line drains', 'Root intrusion removal'] },
  { icon: '🔥', name: 'Water Heater Services',      desc: 'Traditional tank and tankless water heater installation, repair, and replacement. Same-day service available. We carry all major brands in our vans.',       features: ['Tank & tankless installation', 'Same-day replacement', 'Energy-efficient upgrades', 'All major brands stocked'] },
  { icon: '🏠', name: 'Full Repiping',              desc: 'Old galvanized or corroded pipes replaced with modern copper or PEX. Minimal disruption, clean finish, and a 25-year pipe warranty on all repiping work.',  features: ['Copper and PEX options', 'Minimal wall disruption', '25-year pipe warranty', 'Pressure tested before closeout'] },
  { icon: '🚽', name: 'Toilet & Fixture Repair',   desc: 'Running toilets, dripping faucets, broken garbage disposals, and full fixture installations handled same day. We stock parts for all common brands.',       features: ['Running & clogged toilet repair', 'Faucet & fixture installation', 'Garbage disposal service', 'Bathroom & kitchen upgrades'] },
  { icon: '🆘', name: 'Emergency Plumbing',         desc: 'Burst pipes, active flooding, sewage backup — our emergency team is available 24/7 with a 20-minute response target. No call-out fee, ever.',             features: ['24/7 — including holidays', '20-minute response target', 'No call-out or emergency fee', 'Flood mitigation assistance'] },
];

const DEF_STATS = [
  { num: 2400, suffix: '+',    label: 'Jobs Completed' },
  { num: 15,   suffix: ' yrs', label: 'Years in Business' },
  { num: 98,   suffix: '%',    label: '5-Star Reviews' },
  { num: 45,   suffix: ' min', label: 'Avg Response Time' },
];

const DEF_TESTIMONIALS = [
  { name: 'Sarah M.',  initials: 'SM', loc: 'Austin, TX',       stars: 5, text: 'Burst pipe at 2am and they were at my door in 28 minutes. The technician was calm, explained everything clearly, and had it fixed in under an hour. I\'ve used them three times since and they\'re consistently excellent.' },
  { name: 'James R.',  initials: 'JR', loc: 'Round Rock, TX',   stars: 5, text: 'Three other companies gave me vague estimates over the phone. They came out same morning, showed me exactly what was wrong with a camera, gave me a written quote, and fixed it for less than everyone else quoted.' },
  { name: 'Linda T.',  initials: 'LT', loc: 'Cedar Park, TX',   stars: 5, text: 'Had our entire house repiped after discovering galvanized pipes. The crew finished in two days, patched everything, and left the place spotless. The 25-year warranty gave us real peace of mind.' },
];

const DEF_FAQS: FAQ[] = [
  { q: 'Do you charge for after-hours emergencies?', a: 'We never charge a call-out fee — not even at 2am on a holiday. Our pricing is based entirely on the job. You\'ll receive a firm written quote before we start any work, so there are zero surprises on the invoice.' },
  { q: 'How fast can you arrive?',                   a: 'For emergencies we target 20–45 minutes anywhere in the local area. For scheduled work, same-day and next-morning slots are almost always available. We text you an ETA when dispatched.' },
  { q: 'Are your plumbers licensed?',                a: 'Every technician holds an active Master Plumber license and passes a full background check before joining our team. We carry $2M general liability and full workers\' compensation insurance on every job.' },
  { q: 'What does your warranty cover?',             a: 'All labor is covered by a 1-year written warranty — if the same issue returns, we come back and fix it for free. Pipe materials carry a separate 25-year manufacturer warranty that we register for you.' },
  { q: 'Do you serve commercial properties?',        a: 'Yes. We work with homeowners, landlords, property managers, restaurants, and small commercial businesses. Give us a call and we\'ll confirm scope and scheduling for your property type.' },
];

const DEF_AREAS = ['Downtown', 'Northside', 'Eastside', 'Westside', 'South District', 'Lakeside', 'Midtown', 'Suburbs'];

const DEF_PROCESS = [
  { icon: '📞', num: 'Step 01', title: 'You Call or Book Online',   desc: 'Call our 24/7 line or book through our site. Describe the issue and we\'ll give you a ballpark estimate immediately — no commitment required.' },
  { icon: '🚐', num: 'Step 02', title: 'We Arrive Fast',            desc: 'A licensed plumber arrives on time in a fully stocked van. No waiting for parts. We\'re ready to diagnose and fix immediately on arrival.' },
  { icon: '🔍', num: 'Step 03', title: 'Clear Diagnosis & Price',   desc: 'We inspect the problem, explain exactly what\'s wrong in plain English, and give you a firm written price before we touch a thing.' },
  { icon: '✅', num: 'Step 04', title: 'Fixed, Cleaned, Guaranteed', desc: 'We complete the job, test everything, clean up completely, and back all labor with a 1-year written warranty.' },
];

/* ── Helpers ──────────────────────────────────────────────────────────────── */
function parseStat(s: Stat): { num: number; suffix: string } {
  const raw = String(s.value);
  const num = parseInt(raw.replace(/[^0-9]/g, ''), 10) || 0;
  const trail = raw.match(/[^0-9]+$/)?.[0] ?? '';
  return { num, suffix: trail + (s.suffix ?? '') };
}

function initials(name: string): string {
  return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
}

/* ── Slot machine counter ─────────────────────────────────────────────────── */
function buildSlot(container: HTMLElement, target: number) {
  container.innerHTML = '';
  String(target).split('').forEach((digit, di) => {
    const d = parseInt(digit);
    const reel = document.createElement('div');
    reel.className = 'pb2-slot-reel';
    const strip = document.createElement('div');
    strip.className = 'pb2-slot-strip';
    for (let n = 0; n <= 9; n++) {
      const span = document.createElement('span');
      span.className = 'pb2-slot-digit';
      span.textContent = String(n);
      strip.appendChild(span);
    }
    reel.appendChild(strip);
    container.appendChild(reel);
    setTimeout(() => {
      strip.style.transitionDelay = (di * 120) + 'ms';
      strip.style.transform = `translateY(calc(-${d} * 1em))`;
    }, 200);
  });
}

/* ── Reveal wrapper ──────────────────────────────────────────────────────── */
function Reveal({ children, className = '', delay = 0, dir = 'up' }: { children: React.ReactNode; className?: string; delay?: number; dir?: 'up' | 'left' | 'right' }) {
  const cls = dir === 'left' ? 'pb2-rv-left' : dir === 'right' ? 'pb2-rv-right' : 'pb2-rv';
  const [ref, visible] = useInView(0.1);
  return (
    <div ref={ref} className={`${cls}${visible ? ' in' : ''} ${className}`} style={delay ? { transitionDelay: `${delay}s` } : undefined}>
      {children}
    </div>
  );
}

/* ── Main component ──────────────────────────────────────────────────────── */
export default function Plumber2({ businessData, isPreview }: TemplateProps) {
  const bd = businessData;

  // ── Data extraction ──
  const name       = bd.name        || 'ForgePro Plumbing';
  const city       = bd.city        || 'Austin';
  const phone      = bd.phone       || '(555) 123-4567';
  const email      = bd.email       || '';
  const tagline    = bd.tagline     || `Fast, Reliable Plumbing You Can Trust`;
  const subTagline = bd.subTagline  || `Licensed master plumbers serving ${city} and surrounding areas. We show up on time, fix it right, and treat your home with respect.`;
  const description = bd.description || `${city}'s trusted plumbing professionals. Licensed, insured, and available around the clock.`;

  const rawServices = bd.services?.length ? bd.services : null;
  const services = rawServices
    ? rawServices.map((s: ServiceItem, i: number) => ({
        icon:     DEF_SERVICES[i % DEF_SERVICES.length]?.icon ?? '🔧',
        name:     s.name,
        desc:     s.description ?? '',
        features: s.features ?? DEF_SERVICES[i % DEF_SERVICES.length]?.features ?? [],
      }))
    : DEF_SERVICES;

  const rawStats = bd.stats?.length ? bd.stats : null;
  const stats = rawStats
    ? rawStats.map((s: Stat) => { const { num, suffix } = parseStat(s); return { num, suffix, label: s.label }; })
    : DEF_STATS;

  const rawTestis = bd.testimonials?.length ? bd.testimonials : null;
  const testis = rawTestis
    ? rawTestis.map((t: Testimonial) => ({ name: t.name, initials: initials(t.name), loc: t.context ?? city, stars: t.rating ?? 5, text: t.text }))
    : DEF_TESTIMONIALS;

  const faqs  = bd.faq?.length          ? bd.faq          : DEF_FAQS;
  const areas = bd.serviceAreas?.length ? bd.serviceAreas.map(a => String(a)) : DEF_AREAS;
  const certs = bd.certifications?.length ? bd.certifications.map(c => String(c)) : ['Master Licensed', 'Fully Insured', 'BBB A+ Rated', 'EPA WaterSense'];
  const hours = bd.hours;

  const copy = bd.copy;

  // ── State ──
  const [menuOpen,    setMenuOpen]    = useState(false);
  const [scrolled,    setScrolled]    = useState(false);
  const [activeTab,   setActiveTab]   = useState(0);
  const [activeFaq,   setActiveFaq]   = useState(0);

  // ── Refs ──
  const tlRef    = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const slotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const trustRef = useRef<HTMLDivElement>(null);
  const [statsTriggered, setStatsTriggered] = useState(false);

  // ── Nav scroll ──
  useEffect(() => {
    if (isPreview) { setScrolled(true); return; }
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, [isPreview]);

  // ── Timeline animation ──
  useEffect(() => {
    const el = tlRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add('pb2-animated'); obs.disconnect(); } },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // ── Stats slot machine ──
  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !statsTriggered) {
          setStatsTriggered(true);
          stats.forEach((s, i) => {
            const container = slotRefs.current[i];
            if (container) buildSlot(container, s.num);
          });
          obs.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [stats, statsTriggered]);

  // ── Trust badges reveal ──
  useEffect(() => {
    const el = trustRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.querySelectorAll<HTMLElement>('.pb2-badge').forEach(b => b.classList.add('in'));
          obs.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  const trustBadges = [
    { icon: '🏅', main: 'Master Licensed',        sub: 'State Certified Plumbers' },
    { icon: '🛡️', main: 'Fully Insured',          sub: '$2M Liability Coverage' },
    { icon: '⭐', main: '5-Star Rated',            sub: '500+ Verified Reviews' },
    { icon: '🚨', main: '24/7 Emergency',          sub: 'Always Available' },
    { icon: '✅', main: 'Satisfaction Guaranteed', sub: 'Or We Come Back Free' },
  ];

  return (
    <div className="pb2">
      <style>{STYLES}</style>

      {/* ── NAV ── */}
      <nav className={`pb2-nav${scrolled ? ' scrolled' : ''}`} data-ec>
        <div className="pb2-logo">
          🔧 {name.split(' ')[0]}<span className="pb2-logo-accent">{name.split(' ').slice(1).join(' ') || 'Pro'}</span>
        </div>
        <ul className="pb2-desk-links">
          {[['services','Services'],['process','Process'],['testimonials','Reviews'],['faq','FAQ'],['areas','Areas']].map(([id, label]) => (
            <li key={id}><button onClick={() => scrollTo(id)}>{label}</button></li>
          ))}
        </ul>
        {phone && <a href={`tel:${phone.replace(/\D/g,'')}`} className="pb2-nav-cta">📞 Book Now</a>}
        <button className={`pb2-burger${menuOpen ? ' open' : ''}`} onClick={() => setMenuOpen(v => !v)} aria-label="Menu" data-ec>
          <span/><span/><span/>
        </button>
      </nav>

      {/* ── MOBILE MENU ── */}
      <div className={`pb2-mob-menu${menuOpen ? ' open' : ''}`} data-ec>
        {[['services','Services'],['process','How It Works'],['testimonials','Reviews'],['faq','FAQ'],['areas','Areas']].map(([id, label]) => (
          <button key={id} onClick={() => scrollTo(id)}>{label}</button>
        ))}
        {phone && <button className="pb2-mob-phone" onClick={() => { window.location.href = `tel:${phone.replace(/\D/g,'')}`; }}>📞 {phone}</button>}
      </div>

      {/* ── HERO ── */}
      <section className="pb2-hero" id="home">
        {/* Left */}
        <div className="pb2-hero-left">
          <div className="pb2-hero-tag"><div className="pb2-tag-dot"/>{city}&apos;s #1 Rated Plumbers</div>
          <h1 className="pb2-hero-h1">
            Fast, Reliable<br/>
            <span className="pb2-hero-h1-accent">Plumbing</span><br/>
            You Can Trust
          </h1>
          <p className="pb2-hero-sub">{subTagline}</p>
          <div className="pb2-hero-bullets">
            <div className="pb2-hero-bullet"><div className="pb2-bullet-icon">⚡</div>Same-day &amp; emergency service</div>
            <div className="pb2-hero-bullet"><div className="pb2-bullet-icon">💰</div>Upfront pricing — no surprises</div>
            <div className="pb2-hero-bullet"><div className="pb2-bullet-icon">🛡️</div>1-year workmanship warranty</div>
          </div>
          <div className="pb2-hero-ctas">
            {phone && <a href={`tel:${phone.replace(/\D/g,'')}`} className="pb2-btn-orange">📞 {copy?.hero_cta_primary ?? 'Call Now — Free Quote'}</a>}
            <button className="pb2-btn-ghost" onClick={() => scrollTo('services')}>{copy?.hero_cta_secondary ?? 'Our Services ↓'}</button>
          </div>
        </div>

        {/* Right */}
        <div className="pb2-hero-right">
          <div className="pb2-tool-wrap">
            <div className="pb2-orbit pb2-orbit-1"><div className="pb2-orbit-dot"/></div>
            <div className="pb2-orbit pb2-orbit-2"><div className="pb2-orbit-dot"/></div>
            <div className="pb2-hero-tool">🔧</div>
          </div>
          <div className="pb2-phone-card">
            <div className="pb2-phone-label">Emergency &amp; Bookings</div>
            {phone && <div className="pb2-phone-number">{phone}</div>}
            <div className="pb2-phone-avail"><div className="pb2-avail-dot"/>Technicians available right now</div>
            {phone && <a href={`tel:${phone.replace(/\D/g,'')}`} className="pb2-phone-cta">Call for an Instant Quote →</a>}
          </div>
        </div>
      </section>

      {/* ── TRUST BADGES ── */}
      <div className="pb2-trust" ref={trustRef}>
        <div className="pb2-trust-inner">
          {trustBadges.map((b, i) => (
            <div key={i} className="pb2-badge">
              <div className="pb2-badge-icon">{b.icon}</div>
              <div><span className="pb2-badge-main">{b.main}</span><span className="pb2-badge-sub">{b.sub}</span></div>
            </div>
          ))}
        </div>
      </div>

      {/* ── SERVICES ── */}
      <section className="pb2-sec pb2-svc-bg" id="services">
        <div className="pb2-con">
          <Reveal className="pb2-hdr">
            <div className="pb2-eyebrow">{copy?.services_label ?? 'What We Do'}</div>
            <h2 className="pb2-h2">{copy?.services_heading ?? 'Every Plumbing Job, Done Right'}</h2>
            <p className="pb2-lead">{copy?.services_subheading ?? 'From a dripping faucet to a complete repipe, our team handles it all with the same care and professionalism.'}</p>
          </Reveal>
          {/* Tab nav */}
          <div className="pb2-tabs-nav">
            {services.map((s, i) => (
              <button key={i} className={`pb2-tab-btn${activeTab === i ? ' active' : ''}`} onClick={() => setActiveTab(i)}>
                {s.icon} {s.name.split(' ')[0]}
              </button>
            ))}
          </div>
          {/* Tab panels */}
          {services.map((s, i) => (
            <div key={i} className={`pb2-tab-panel${activeTab === i ? ' active' : ''}`}>
              <div>
                <span className="pb2-tab-icon">{s.icon}</span>
                <div className="pb2-tab-title">{s.name}</div>
                <p className="pb2-tab-desc">{s.desc}</p>
                {s.features.length > 0 && (
                  <ul className="pb2-tab-feats">
                    {s.features.map((f: string, fi: number) => (
                      <li key={fi}><span className="pb2-feat-check">✓</span>{f}</li>
                    ))}
                  </ul>
                )}
                {phone && <a href={`tel:${phone.replace(/\D/g,'')}`} className="pb2-btn-orange">Book {s.name.split(' ')[0]} Service →</a>}
              </div>
              <div className="pb2-tab-visual"><span className="pb2-tab-visual-icon">{s.icon}</span></div>
            </div>
          ))}
        </div>
      </section>

      {/* ── STATS ── */}
      <div className="pb2-stats-bg" id="stats" ref={statsRef}>
        <div className="pb2-stats-grid">
          {stats.map((s, i) => (
            <Reveal key={i} className="pb2-stat-item" delay={i * 0.1}>
              <div className="pb2-stat-num-wrap">
                <div className="pb2-slot-machine" ref={el => { slotRefs.current[i] = el; }}>
                  {/* slots injected by JS */}
                </div>
                <span className="pb2-stat-suffix">{s.suffix}</span>
              </div>
              <div className="pb2-stat-divider"/>
              <div className="pb2-stat-label">{s.label}</div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* ── ABOUT ── */}
      <section className="pb2-sec pb2-about-bg" id="about">
        <div className="pb2-con pb2-about-inner">
          <Reveal dir="left">
            <span className="pb2-about-big-num">
              {stats[1]?.num ?? 15}<span className="pb2-about-big-num-accent">+</span>
            </span>
            <div className="pb2-about-years-lbl">Years Serving {city}</div>
            <div className="pb2-about-deco-line"/>
          </Reveal>
          <Reveal dir="right">
            <div className="pb2-about-tagline">We built our reputation one fixed pipe at a time.</div>
            <p className="pb2-about-p">{description}</p>
            <p className="pb2-about-p">Every technician on our team is background-checked, licensed, and trained to treat your home like their own. No subcontractors, no surprises.</p>
            {certs.length > 0 && (
              <div className="pb2-cert-tags">
                {certs.map((c, i) => <span key={i} className="pb2-cert-tag">{c}</span>)}
              </div>
            )}
          </Reveal>
        </div>
      </section>

      {/* ── PROCESS ── */}
      <section className="pb2-sec pb2-proc-bg" id="process">
        <div className="pb2-con">
          <Reveal className="pb2-hdr pb2-hdr-center">
            <div className="pb2-eyebrow">How It Works</div>
            <h2 className="pb2-h2">Simple. Transparent. Done Right.</h2>
            <p className="pb2-lead">Here&apos;s exactly what happens from the moment you call to the moment we leave.</p>
          </Reveal>
          <div className="pb2-timeline" ref={tlRef}>
            <div className="pb2-tl-line"><div className="pb2-tl-fill"/></div>
            {DEF_PROCESS.map((step, i) => {
              const isLeft = i % 2 === 0;
              return (
                <Reveal key={i} className="pb2-tl-item" dir={isLeft ? 'left' : 'right'} delay={i * 0.15}>
                  {isLeft ? (
                    <>
                      <div className="pb2-tl-left">
                        <div className="pb2-tl-card">
                          <div className="pb2-tl-step-num">{step.num}</div>
                          <div className="pb2-tl-title">{step.title}</div>
                          <div className="pb2-tl-desc">{step.desc}</div>
                        </div>
                      </div>
                      <div className="pb2-tl-dot">{step.icon}</div>
                      <div className="pb2-tl-empty pb2-tl-right"/>
                    </>
                  ) : (
                    <>
                      <div className="pb2-tl-empty pb2-tl-left"/>
                      <div className="pb2-tl-dot">{step.icon}</div>
                      <div className="pb2-tl-right">
                        <div className="pb2-tl-card">
                          <div className="pb2-tl-step-num">{step.num}</div>
                          <div className="pb2-tl-title">{step.title}</div>
                          <div className="pb2-tl-desc">{step.desc}</div>
                        </div>
                      </div>
                    </>
                  )}
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="pb2-sec pb2-testi-bg" id="testimonials">
        <div className="pb2-con">
          <Reveal className="pb2-hdr">
            <div className="pb2-eyebrow">{copy?.testimonials_label ?? 'Customer Reviews'}</div>
            <h2 className="pb2-h2">What {city} Homeowners Say</h2>
          </Reveal>
          <div className="pb2-testi-stack">
            {testis.map((t, i) => (
              <Reveal key={i} className="pb2-testi-card" delay={i * 0.12}>
                <div>
                  <span className="pb2-testi-quote">&ldquo;</span>
                  <p className="pb2-testi-text">{t.text}</p>
                  <div className="pb2-testi-author-row">
                    <div className="pb2-testi-avatar">{t.initials}</div>
                    <div>
                      <div className="pb2-testi-name">{t.name}</div>
                      <div className="pb2-testi-loc">{t.loc}</div>
                    </div>
                  </div>
                </div>
                <div className="pb2-rating-wrap">
                  <div className="pb2-rating-num">{t.stars}.0</div>
                  <div className="pb2-rating-stars">{'★'.repeat(Math.min(t.stars, 5))}</div>
                  <div className="pb2-rating-sub">Verified Review</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="pb2-sec pb2-faq-bg" id="faq">
        <div className="pb2-con">
          <Reveal className="pb2-hdr pb2-hdr-center">
            <div className="pb2-eyebrow">{copy?.faq_label ?? 'FAQ'}</div>
            <h2 className="pb2-h2">{copy?.faq_heading ?? 'Frequently Asked Questions'}</h2>
          </Reveal>
          <Reveal className="pb2-faq-inner">
            <div className="pb2-faq-left">
              <div className="pb2-faq-hdr">
                <div className="pb2-faq-hdr-eyebrow">Questions</div>
                <div className="pb2-faq-hdr-title">Click to read answers</div>
              </div>
              {faqs.map((f, i) => (
                <div key={i} className={`pb2-faq-q-item${activeFaq === i ? ' active' : ''}`} onClick={() => setActiveFaq(i)}>
                  <span className="pb2-faq-q-num">{String(i + 1).padStart(2, '0')}</span>
                  <span className="pb2-faq-q-text">{f.q}</span>
                  <span className="pb2-faq-q-arrow">›</span>
                </div>
              ))}
            </div>
            <div className="pb2-faq-right">
              <div className="pb2-faq-answer" key={activeFaq}>
                <div className="pb2-faq-a-eyebrow">Answer</div>
                <div className="pb2-faq-a-q">{faqs[activeFaq]?.q}</div>
                <div className="pb2-faq-a-text">{faqs[activeFaq]?.a}</div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── SERVICE AREAS ── */}
      <section className="pb2-sec pb2-areas-bg" id="areas">
        <div className="pb2-con">
          <Reveal className="pb2-hdr pb2-hdr-center">
            <div className="pb2-eyebrow">Where We Work</div>
            <h2 className="pb2-h2">Serving {city} &amp; Surrounding Areas</h2>
            <p className="pb2-lead">Fast response times across the whole metro and beyond.</p>
          </Reveal>
          <div className="pb2-areas-grid">
            {areas.map((area, i) => (
              <Reveal key={i} className="pb2-area-item" delay={(i % 4) * 0.08}>
                <div className="pb2-area-dot"/>{area}
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA SPLIT ── */}
      <section className="pb2-sec pb2-cta-bg">
        <div className="pb2-con">
          <Reveal className="pb2-cta-inner">
            <div className="pb2-cta-left">
              <div className="pb2-cta-eyebrow">{copy?.cta_label ?? 'Ready to Get Started?'}</div>
              <h2 className="pb2-cta-h2">
                {copy?.cta_heading
                  ? copy.cta_heading
                  : <>Don&apos;t let a small leak become a <span className="pb2-cta-h2-accent">big problem.</span></>
                }
              </h2>
              <p className="pb2-cta-sub">{copy?.cta_subheading ?? 'Call now for a free, no-obligation quote. Most jobs booked and fixed same day.'}</p>
              <div className="pb2-cta-badges">
                {['No call-out fee', 'Same-day service available', '1-year labor warranty', 'Upfront written quotes'].map((b, i) => (
                  <div key={i} className="pb2-cta-badge"><span className="pb2-cta-badge-icon">✓</span>{b}</div>
                ))}
              </div>
            </div>
            <div className="pb2-cta-right">
              {phone && (
                <div className="pb2-contact-card">
                  <div className="pb2-cc-label">Call or Text Anytime</div>
                  <div className="pb2-cc-value">{phone}</div>
                </div>
              )}
              {hours && (
                <div className="pb2-contact-card">
                  <div className="pb2-cc-label">Business Hours</div>
                  <div className="pb2-cc-value-sm">
                    {hours.weekdays && <>{hours.weekdays}<br/></>}
                    {hours.saturday && <>{hours.saturday}<br/></>}
                    {hours.sunday   && <>{hours.sunday}</>}
                  </div>
                </div>
              )}
              {email && (
                <div className="pb2-contact-card">
                  <div className="pb2-cc-label">Email Us</div>
                  <div className="pb2-cc-value-sm">{email}</div>
                </div>
              )}
              {phone && (
                <a href={`tel:${phone.replace(/\D/g,'')}`} className="pb2-cta-call">
                  📞 {copy?.cta_primary ?? 'Call for Free Quote'}
                </a>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="pb2-footer">
        <div className="pb2-footer-wm">{name}</div>
        <div className="pb2-footer-grid">
          <div>
            <div className="pb2-footer-logo">🔧 {name.split(' ')[0]}<span className="pb2-footer-logo-accent">{name.split(' ').slice(1).join(' ') || 'Pro'}</span></div>
            <p className="pb2-footer-desc">{description}</p>
            {phone   && <div className="pb2-footer-row"><span className="pb2-footer-row-icon">📞</span>{phone}</div>}
            {email   && <div className="pb2-footer-row"><span className="pb2-footer-row-icon">✉️</span>{email}</div>}
            <div className="pb2-footer-row"><span className="pb2-footer-row-icon">📍</span>{bd.address ?? city}</div>
          </div>
          <div>
            <div className="pb2-f-head">Services</div>
            <ul className="pb2-f-links">
              {services.slice(0, 5).map((s, i) => (
                <li key={i}><button onClick={() => scrollTo('services')}>{s.name}</button></li>
              ))}
            </ul>
          </div>
          <div>
            <div className="pb2-f-head">Company</div>
            <ul className="pb2-f-links">
              {['About Us', 'Reviews', 'Service Areas', 'Contact', 'Privacy Policy'].map((l, i) => (
                <li key={i}><button>{l}</button></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="pb2-footer-bottom">
          <span>© {new Date().getFullYear()} {name}. All rights reserved.</span>
          <span>Licensed Master Plumber · {city}</span>
        </div>
      </footer>
    </div>
  );
}
