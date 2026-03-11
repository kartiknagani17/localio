'use client';
import { useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';
import type { TemplateProps, ServiceItem, Testimonial, FAQ, Stat } from '../../types';

/* ── Palette ─────────────────────────────────────────────────────────────── */
const P = {
  navy:     '#0f1f3d',
  navyL:    '#1a2f50',
  navyD:    '#070f1e',
  cyan:     '#00c8ff',
  cyanD:    '#0099cc',
  cyanPale: '#e0f7ff',
  white:    '#ffffff',
  gray:     '#f0f4f8',
  text:     '#1a1a2e',
  muted:    '#6b7a99',
  red:      '#e63946',
  green:    '#2ecc71',
  gold:     '#f59e0b',
} as const;

/* ── Hooks ───────────────────────────────────────────────────────────────── */
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

function useCounter(target: number, duration = 2000, active = false): number {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      setVal(Math.floor((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [active, target, duration]);
  return val;
}

/* ── Styles ──────────────────────────────────────────────────────────────── */
const STYLES = `
  .pb1 * { box-sizing: border-box; margin: 0; padding: 0; }
  .pb1 { font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; color: ${P.text}; overflow-x: hidden; container-type: inline-size; }

  /* ── NAV ── */
  .pb1-nav { position: fixed; top: 0; left: 0; right: 0; z-index: 200; padding: 1.2rem 2rem; display: flex; align-items: center; justify-content: space-between; transition: all 0.3s ease; }
  .pb1-nav.scrolled { background: rgba(15,31,61,0.96); backdrop-filter: blur(14px); padding: 0.75rem 2rem; box-shadow: 0 2px 24px rgba(0,200,255,0.12); }
  .pb1-logo { display: flex; align-items: center; gap: 0.4rem; color: white; font-size: 1.45rem; font-weight: 900; text-decoration: none; letter-spacing: -0.5px; cursor: pointer; }
  .pb1-logo-drop { display: inline-block; animation: pb1-drop-bounce 2.5s ease-in-out infinite; }
  .pb1-logo-accent { color: ${P.cyan}; }
  .pb1-desk-links { display: flex; gap: 1.8rem; list-style: none; }
  .pb1-desk-links button { background: none; border: none; color: rgba(255,255,255,0.8); font-size: 0.88rem; font-weight: 500; cursor: pointer; transition: color 0.2s; padding: 0; }
  .pb1-desk-links button:hover { color: ${P.cyan}; }
  .pb1-nav-emg { display: flex; align-items: center; gap: 0.45rem; background: ${P.red}; color: white; padding: 0.55rem 1.1rem; border-radius: 50px; font-weight: 700; font-size: 0.85rem; text-decoration: none; position: relative; white-space: nowrap; }
  .pb1-nav-emg::before { content: ''; position: absolute; inset: -4px; border-radius: 50px; border: 2px solid ${P.red}; animation: pb1-emg-pulse 2s infinite; }
  .pb1-burger { display: none; flex-direction: column; gap: 5px; background: none; border: none; cursor: pointer; padding: 4px; }
  .pb1-burger span { display: block; width: 24px; height: 2px; background: white; border-radius: 2px; transition: all 0.28s; }
  .pb1-burger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
  .pb1-burger.open span:nth-child(2) { opacity: 0; }
  .pb1-burger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }
  .pb1-mob-menu { position: fixed; inset: 0; background: ${P.navy}; z-index: 199; flex-direction: column; align-items: center; justify-content: center; gap: 2rem; display: none; }
  .pb1-mob-menu.open { display: flex; animation: pb1-menu-in 0.28s ease; }
  .pb1-mob-menu button { background: none; border: none; color: white; font-size: 1.5rem; font-weight: 700; cursor: pointer; }
  .pb1-mob-menu button:hover { color: ${P.cyan}; }
  .pb1-mob-emg { color: ${P.cyan} !important; }

  /* ── HERO ── */
  .pb1-hero { min-height: 100vh; background: ${P.navy}; position: relative; overflow: hidden; display: flex; align-items: center; padding: 7rem 2rem 4rem; }
  .pb1-hero-pipes { position: absolute; inset: 0; opacity: 0.13; pointer-events: none; }
  .pb1-pipe { fill: none; stroke: ${P.cyan}; stroke-linecap: round; stroke-linejoin: round; }
  .pb1-pipe-draw { stroke-dasharray: 1200; stroke-dashoffset: 1200; }
  .pb1-pipe-draw-1 { animation: pb1-draw 3.5s 0.2s ease forwards; }
  .pb1-pipe-draw-2 { animation: pb1-draw 3.5s 1.0s ease forwards; }
  .pb1-pipe-draw-3 { animation: pb1-draw 3.5s 1.8s ease forwards; }
  .pb1-pipe-draw-4 { animation: pb1-draw 2s   2.4s ease forwards; }
  .pb1-joint { fill: ${P.cyan}; opacity: 0; }
  .pb1-joint-1 { animation: pb1-joint-pop 0.4s 0.8s ease forwards; }
  .pb1-joint-2 { animation: pb1-joint-pop 0.4s 1.5s ease forwards; }
  .pb1-joint-3 { animation: pb1-joint-pop 0.4s 2.2s ease forwards; }
  .pb1-joint-4 { animation: pb1-joint-pop 0.4s 2.8s ease forwards; }
  .pb1-joint-5 { animation: pb1-joint-pop 0.4s 3.2s ease forwards; }
  .pb1-particles { position: absolute; inset: 0; pointer-events: none; }
  .pb1-particle { position: absolute; border-radius: 50%; background: ${P.cyan}; opacity: 0; animation: pb1-drip linear infinite; }
  .pb1-glow { position: absolute; top: 25%; left: 55%; width: 600px; height: 600px; background: radial-gradient(circle, rgba(0,200,255,0.1) 0%, transparent 70%); pointer-events: none; animation: pb1-glow-pulse 4s ease-in-out infinite; }
  .pb1-hero-inner { position: relative; z-index: 2; max-width: 1200px; margin: 0 auto; width: 100%; display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center; }
  .pb1-hero-badge { display: inline-flex; align-items: center; gap: 0.6rem; background: rgba(0,200,255,0.1); border: 1px solid rgba(0,200,255,0.28); color: ${P.cyan}; padding: 0.45rem 1rem; border-radius: 50px; font-size: 0.8rem; font-weight: 700; margin-bottom: 1.4rem; animation: pb1-fade-up 0.7s ease both; }
  .pb1-live-dot { width: 8px; height: 8px; border-radius: 50%; background: ${P.green}; animation: pb1-blink 1.6s infinite; flex-shrink: 0; }
  .pb1-hero-h1 { font-size: clamp(2.4rem, 5.5vw, 4.2rem); font-weight: 900; color: white; line-height: 1.1; margin-bottom: 1.4rem; animation: pb1-fade-up 0.7s 0.15s ease both; }
  .pb1-hero-h1-glow { color: ${P.cyan}; display: inline-block; animation: pb1-text-glow 3s ease-in-out infinite; }
  .pb1-hero-sub { color: rgba(255,255,255,0.62); font-size: 1rem; line-height: 1.75; margin-bottom: 2rem; animation: pb1-fade-up 0.7s 0.3s ease both; }
  .pb1-hero-ctas { display: flex; gap: 1rem; flex-wrap: wrap; animation: pb1-fade-up 0.7s 0.45s ease both; }
  .pb1-btn-primary { background: ${P.cyan}; color: ${P.navy}; padding: 0.9rem 1.9rem; border-radius: 10px; font-weight: 800; font-size: 0.95rem; text-decoration: none; position: relative; overflow: hidden; display: inline-flex; align-items: center; gap: 0.45rem; transition: transform 0.2s, box-shadow 0.2s; border: none; cursor: pointer; }
  .pb1-btn-primary:hover { transform: translateY(-3px); box-shadow: 0 10px 35px rgba(0,200,255,0.4); }
  .pb1-btn-outline { background: transparent; color: white; border: 2px solid rgba(255,255,255,0.32); padding: 0.9rem 1.9rem; border-radius: 10px; font-weight: 700; font-size: 0.95rem; text-decoration: none; display: inline-flex; align-items: center; gap: 0.45rem; transition: all 0.2s; cursor: pointer; }
  .pb1-btn-outline:hover { border-color: ${P.cyan}; color: ${P.cyan}; }
  .pb1-ripple { position: absolute; border-radius: 50%; background: rgba(255,255,255,0.38); width: 200px; height: 200px; margin: -100px; pointer-events: none; animation: pb1-ripple-out 0.65s linear; }
  .pb1-hero-trust { display: flex; gap: 2rem; margin-top: 2.2rem; animation: pb1-fade-up 0.7s 0.6s ease both; }
  .pb1-trust-num { font-size: 1.55rem; font-weight: 900; color: ${P.cyan}; display: block; }
  .pb1-trust-lbl { font-size: 0.7rem; color: rgba(255,255,255,0.42); text-transform: uppercase; letter-spacing: 0.06em; margin-top: 2px; }
  /* Hero card */
  .pb1-hero-visual { animation: pb1-fade-up 0.7s 0.35s ease both; }
  .pb1-hero-card { background: rgba(255,255,255,0.04); border: 1px solid rgba(0,200,255,0.16); border-radius: 22px; padding: 1.9rem; backdrop-filter: blur(12px); position: relative; overflow: hidden; }
  .pb1-hero-card::before { content: ''; position: absolute; top: -50%; right: -50%; width: 200%; height: 200%; background: radial-gradient(circle at 60% 40%, rgba(0,200,255,0.05) 0%, transparent 60%); pointer-events: none; }
  .pb1-card-icon { width: 60px; height: 60px; background: rgba(0,200,255,0.1); border-radius: 18px; display: flex; align-items: center; justify-content: center; font-size: 1.9rem; margin-bottom: 1.1rem; animation: pb1-float 3s ease-in-out infinite; }
  .pb1-card-title { color: white; font-weight: 800; font-size: 1.05rem; margin-bottom: 0.2rem; }
  .pb1-card-sub { color: rgba(255,255,255,0.42); font-size: 0.8rem; margin-bottom: 1.4rem; }
  .pb1-meter-row { margin-bottom: 1rem; }
  .pb1-meter-head { display: flex; justify-content: space-between; margin-bottom: 0.35rem; }
  .pb1-meter-head span { color: rgba(255,255,255,0.62); font-size: 0.8rem; }
  .pb1-meter-head strong { font-size: 0.8rem; }
  .pb1-meter-track { height: 7px; background: rgba(255,255,255,0.07); border-radius: 4px; overflow: hidden; }
  .pb1-meter-fill { height: 100%; border-radius: 4px; background: linear-gradient(90deg, ${P.cyan}, ${P.green}); animation: pb1-meter-pulse 3s ease-in-out infinite alternate; }
  .pb1-meter-fill-emg { background: linear-gradient(90deg, ${P.green}, #00ff88); animation-delay: 0.5s; }
  .pb1-card-tags { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-top: 1rem; }
  .pb1-card-tag { background: rgba(0,200,255,0.09); border: 1px solid rgba(0,200,255,0.2); color: ${P.cyan}; padding: 0.26rem 0.7rem; border-radius: 50px; font-size: 0.72rem; font-weight: 600; }

  /* ── TICKER ── */
  .pb1-ticker { background: ${P.cyan}; padding: 0.68rem 0; overflow: hidden; white-space: nowrap; }
  .pb1-ticker-track { display: inline-flex; animation: pb1-ticker 35s linear infinite; }
  .pb1-ticker-item { display: inline-flex; align-items: center; gap: 0.9rem; color: ${P.navy}; font-weight: 700; font-size: 0.8rem; padding: 0 2rem; text-transform: uppercase; letter-spacing: 0.06em; }
  .pb1-ticker-sep { width: 5px; height: 5px; border-radius: 50%; background: ${P.navy}; opacity: 0.3; }

  /* ── SECTION BASE ── */
  .pb1-sec { padding: 5.5rem 2rem; }
  .pb1-con { max-width: 1200px; margin: 0 auto; }
  .pb1-eyebrow { font-size: 0.76rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.12em; color: ${P.cyanD}; margin-bottom: 0.55rem; }
  .pb1-h2 { font-size: clamp(2rem, 4vw, 2.75rem); font-weight: 900; color: ${P.navy}; margin-bottom: 0.75rem; line-height: 1.15; }
  .pb1-h2-light { color: white; }
  .pb1-lead { color: ${P.muted}; font-size: 0.97rem; line-height: 1.7; max-width: 580px; }
  .pb1-hdr { margin-bottom: 3.2rem; }
  .pb1-hdr-center { text-align: center; }
  .pb1-hdr-center .pb1-lead { margin: 0 auto; }
  /* Scroll reveal */
  .pb1-rv { opacity: 0; transform: translateY(36px); transition: opacity 0.7s ease, transform 0.7s ease; }
  .pb1-rv.in { opacity: 1; transform: none; }
  .pb1-d1 { transition-delay: 0.1s; } .pb1-d2 { transition-delay: 0.2s; }
  .pb1-d3 { transition-delay: 0.3s; } .pb1-d4 { transition-delay: 0.4s; }

  /* ── WHY US ── */
  .pb1-why { background: ${P.navy}; padding: 3.5rem 2rem; }
  .pb1-why-grid { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: repeat(5, 1fr); }
  .pb1-why-item { display: flex; flex-direction: column; align-items: center; text-align: center; padding: 1.8rem 1.2rem; border-right: 1px solid rgba(255,255,255,0.07); transition: background 0.3s; cursor: default; }
  .pb1-why-item:last-child { border-right: none; }
  .pb1-why-item:hover { background: rgba(0,200,255,0.05); }
  .pb1-why-icon { width: 52px; height: 52px; border-radius: 14px; background: rgba(0,200,255,0.1); display: flex; align-items: center; justify-content: center; font-size: 1.5rem; margin-bottom: 0.9rem; transition: transform 0.32s; }
  .pb1-why-item:hover .pb1-why-icon { transform: scale(1.15) rotate(8deg); }
  .pb1-why-title { color: white; font-weight: 700; font-size: 0.9rem; margin-bottom: 0.3rem; }
  .pb1-why-desc { color: rgba(255,255,255,0.42); font-size: 0.78rem; line-height: 1.5; }

  /* ── SERVICES ── */
  .pb1-svc-bg { background: ${P.gray}; }
  .pb1-svc-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(290px, 1fr)); gap: 1.4rem; }
  .pb1-svc-card { background: white; border-radius: 18px; padding: 1.9rem; position: relative; overflow: hidden; border: 1px solid transparent; transition: transform 0.3s, box-shadow 0.3s, border-color 0.3s; cursor: pointer; }
  .pb1-svc-card::before { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 0; background: linear-gradient(to top, rgba(0,200,255,0.06), rgba(0,200,255,0.01)); transition: height 0.52s cubic-bezier(0.4,0,0.2,1); }
  .pb1-svc-card:hover::before { height: 100%; }
  .pb1-svc-card:hover { transform: translateY(-5px); box-shadow: 0 22px 55px rgba(0,0,0,0.09); border-color: rgba(0,200,255,0.22); }
  .pb1-svc-icon { width: 50px; height: 50px; border-radius: 13px; background: rgba(0,200,255,0.09); font-size: 1.45rem; display: flex; align-items: center; justify-content: center; margin-bottom: 1.1rem; transition: transform 0.32s; }
  .pb1-svc-card:hover .pb1-svc-icon { transform: scale(1.12) rotate(6deg); }
  .pb1-svc-name { font-size: 1.05rem; font-weight: 800; color: ${P.navy}; margin-bottom: 0.4rem; }
  .pb1-svc-desc { font-size: 0.86rem; color: ${P.muted}; line-height: 1.62; }
  .pb1-svc-arrow { margin-top: 1.1rem; color: ${P.cyanD}; font-size: 0.88rem; font-weight: 700; opacity: 0; transform: translateX(-10px); transition: all 0.3s; }
  .pb1-svc-card:hover .pb1-svc-arrow { opacity: 1; transform: translateX(0); }

  /* ── STATS ── */
  .pb1-stats-bg { background: ${P.navy}; position: relative; overflow: hidden; }
  .pb1-wave-deco { position: absolute; left: 0; right: 0; height: 80px; opacity: 0.06; pointer-events: none; }
  .pb1-wave-deco.top { top: 0; transform: rotate(180deg); }
  .pb1-wave-deco.btm { bottom: 0; }
  .pb1-stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; position: relative; z-index: 1; }
  .pb1-stat-card { text-align: center; padding: 2.5rem 1.5rem; }
  .pb1-stat-num { display: block; font-size: clamp(2.8rem, 5vw, 3.8rem); font-weight: 900; color: ${P.cyan}; line-height: 1; }
  .pb1-stat-bar { width: 36px; height: 3px; background: ${P.cyan}; border-radius: 2px; margin: 0.7rem auto; }
  .pb1-stat-lbl { color: rgba(255,255,255,0.52); font-size: 0.86rem; }

  /* ── PROCESS ── */
  .pb1-proc-bg { background: white; }
  .pb1-proc-wrap { position: relative; }
  .pb1-proc-track { position: absolute; top: 44px; left: calc(12.5%); right: calc(12.5%); height: 4px; background: ${P.gray}; border-radius: 2px; z-index: 0; }
  .pb1-proc-fill { height: 100%; width: 0; border-radius: 2px; background: linear-gradient(90deg, ${P.cyan}, ${P.cyanD}); transition: width 2s ease; }
  .pb1-proc-dot { position: absolute; top: -5px; width: 14px; height: 14px; background: ${P.cyan}; border-radius: 50%; box-shadow: 0 0 10px ${P.cyan}; animation: pb1-flow-dot 3.5s linear infinite; }
  .pb1-proc-steps { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0; position: relative; z-index: 1; }
  .pb1-proc-step { display: flex; flex-direction: column; align-items: center; text-align: center; padding: 0 1rem; }
  .pb1-step-bubble { width: 88px; height: 88px; border-radius: 50%; background: white; border: 4px solid ${P.gray}; display: flex; align-items: center; justify-content: center; font-size: 2rem; margin-bottom: 1.4rem; position: relative; transition: all 0.5s; box-shadow: 0 4px 20px rgba(0,0,0,0.06); }
  .pb1-step-badge { position: absolute; top: -6px; right: -6px; width: 26px; height: 26px; border-radius: 50%; background: ${P.cyan}; color: ${P.navy}; font-size: 0.7rem; font-weight: 900; display: flex; align-items: center; justify-content: center; }
  .pb1-proc-wrap.pb1-animated .pb1-step-bubble { border-color: ${P.cyan}; box-shadow: 0 0 0 6px rgba(0,200,255,0.12), 0 4px 20px rgba(0,0,0,0.06); }
  .pb1-proc-wrap.pb1-animated .pb1-proc-fill { width: 100%; }
  .pb1-step-title { font-weight: 800; color: ${P.navy}; font-size: 0.97rem; margin-bottom: 0.4rem; }
  .pb1-step-desc { font-size: 0.83rem; color: ${P.muted}; line-height: 1.55; }

  /* ── TESTIMONIALS ── */
  .pb1-testi-bg { background: ${P.gray}; }
  .pb1-testi-scroll { display: flex; gap: 1.4rem; overflow-x: auto; padding-bottom: 1rem; scroll-snap-type: x mandatory; scrollbar-width: none; }
  .pb1-testi-scroll::-webkit-scrollbar { display: none; }
  .pb1-testi-card { min-width: 310px; max-width: 360px; background: white; border-radius: 18px; padding: 1.7rem; scroll-snap-align: start; border: 1px solid rgba(0,0,0,0.05); transition: transform 0.3s, box-shadow 0.3s; position: relative; overflow: hidden; flex-shrink: 0; }
  .pb1-testi-card::after { content: '"'; position: absolute; bottom: -10px; right: 14px; font-size: 7rem; color: rgba(0,200,255,0.06); font-family: Georgia, serif; line-height: 1; pointer-events: none; }
  .pb1-testi-card:hover { transform: translateY(-5px); box-shadow: 0 20px 55px rgba(0,0,0,0.09); }
  .pb1-testi-stars { color: ${P.gold}; font-size: 0.88rem; letter-spacing: 2px; margin-bottom: 0.85rem; }
  .pb1-testi-text { font-size: 0.92rem; line-height: 1.7; color: ${P.text}; margin-bottom: 1.3rem; }
  .pb1-testi-author { display: flex; align-items: center; gap: 0.7rem; }
  .pb1-testi-avatar { width: 42px; height: 42px; border-radius: 50%; background: linear-gradient(135deg, ${P.cyan}, ${P.navy}); display: flex; align-items: center; justify-content: center; color: white; font-weight: 800; font-size: 0.88rem; flex-shrink: 0; }
  .pb1-testi-name { font-weight: 700; font-size: 0.88rem; color: ${P.navy}; }
  .pb1-testi-loc { font-size: 0.76rem; color: ${P.muted}; }
  .pb1-scroll-dots { display: flex; gap: 0.5rem; justify-content: center; margin-top: 1.4rem; }
  .pb1-sdot { width: 8px; height: 8px; border-radius: 50%; background: ${P.muted}; opacity: 0.3; cursor: pointer; transition: all 0.3s; border: none; padding: 0; }
  .pb1-sdot.active { opacity: 1; background: ${P.cyanD}; width: 24px; border-radius: 4px; }

  /* ── FAQ ── */
  .pb1-faq-bg { background: white; }
  .pb1-faq-wrap { max-width: 780px; margin: 0 auto; }
  .pb1-faq-item { border-bottom: 1px solid rgba(0,0,0,0.07); }
  .pb1-faq-q { width: 100%; text-align: left; padding: 1.35rem 0; font-size: 0.97rem; font-weight: 700; color: ${P.navy}; background: none; border: none; cursor: pointer; display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
  .pb1-faq-icon { width: 30px; height: 30px; min-width: 30px; border-radius: 50%; background: rgba(0,200,255,0.09); display: flex; align-items: center; justify-content: center; color: ${P.cyanD}; font-size: 1.25rem; font-weight: 300; transition: transform 0.32s, background 0.2s; }
  .pb1-faq-item.open .pb1-faq-icon { transform: rotate(45deg); background: rgba(0,200,255,0.18); }
  .pb1-faq-a { max-height: 0; overflow: hidden; transition: max-height 0.4s ease; }
  .pb1-faq-item.open .pb1-faq-a { max-height: 300px; }
  .pb1-faq-a p { padding-bottom: 1.3rem; color: ${P.muted}; line-height: 1.75; font-size: 0.92rem; }

  /* ── SERVICE AREAS ── */
  .pb1-areas-bg { background: ${P.gray}; }
  .pb1-areas-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(165px, 1fr)); gap: 0.9rem; }
  .pb1-area-pill { display: flex; align-items: center; gap: 0.7rem; background: white; border-radius: 13px; padding: 0.85rem 1.1rem; font-weight: 600; color: ${P.navy}; font-size: 0.88rem; border: 1px solid transparent; transition: all 0.3s; }
  .pb1-area-pill:hover { border-color: ${P.cyan}; box-shadow: 0 4px 18px rgba(0,200,255,0.1); }
  .pb1-area-pulse { width: 10px; height: 10px; min-width: 10px; border-radius: 50%; background: ${P.cyan}; position: relative; }
  .pb1-area-pulse::before { content: ''; position: absolute; inset: -4px; border-radius: 50%; background: ${P.cyan}; opacity: 0.28; animation: pb1-area-pulse 2s ease-in-out infinite; }

  /* ── EMERGENCY CTA ── */
  .pb1-emg-sec { background: ${P.navy}; text-align: center; position: relative; overflow: hidden; }
  .pb1-emg-sec::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse at 50% 50%, rgba(0,200,255,0.09) 0%, transparent 65%); animation: pb1-cta-breathe 5s ease-in-out infinite; pointer-events: none; }
  .pb1-emg-inner { position: relative; z-index: 1; }
  .pb1-emg-icon { font-size: 3.2rem; margin-bottom: 0.9rem; display: block; animation: pb1-emg-bounce 1.1s ease-in-out infinite alternate; }
  .pb1-emg-title { font-size: clamp(1.9rem, 4vw, 3rem); font-weight: 900; color: white; margin-bottom: 0.7rem; }
  .pb1-emg-sub { color: rgba(255,255,255,0.52); font-size: 0.97rem; margin-bottom: 2.4rem; }
  .pb1-emg-phone { display: inline-flex; align-items: center; gap: 0.7rem; background: ${P.cyan}; color: ${P.navy}; padding: 1.1rem 2.5rem; border-radius: 13px; font-size: clamp(1.25rem, 3vw, 1.85rem); font-weight: 900; text-decoration: none; position: relative; }
  .pb1-emg-phone::before { content: ''; position: absolute; inset: -8px; border-radius: 20px; border: 3px solid ${P.cyan}; opacity: 0.48; animation: pb1-phone-pulse 1.6s infinite; }
  .pb1-emg-phone::after  { content: ''; position: absolute; inset: -16px; border-radius: 26px; border: 2px solid ${P.cyan}; opacity: 0.2;  animation: pb1-phone-pulse 1.6s 0.4s infinite; }
  .pb1-emg-badges { display: flex; gap: 1.5rem; justify-content: center; margin-top: 2.4rem; flex-wrap: wrap; }
  .pb1-emg-badge { display: flex; align-items: center; gap: 0.42rem; color: rgba(255,255,255,0.62); font-size: 0.83rem; }
  .pb1-emg-badge-icon { color: ${P.cyan}; }

  /* ── FOOTER ── */
  .pb1-footer { background: ${P.navyD}; padding: 4rem 2rem 2rem; }
  .pb1-footer-grid { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 3rem; margin-bottom: 3rem; }
  .pb1-footer-logo { font-size: 1.5rem; font-weight: 900; color: white; margin-bottom: 0.9rem; }
  .pb1-footer-logo-accent { color: ${P.cyan}; }
  .pb1-footer-desc { font-size: 0.86rem; color: rgba(255,255,255,0.42); line-height: 1.7; margin-bottom: 1.4rem; }
  .pb1-footer-row { display: flex; align-items: center; gap: 0.65rem; margin-bottom: 0.65rem; color: rgba(255,255,255,0.58); font-size: 0.86rem; }
  .pb1-footer-row-icon { color: ${P.cyan}; }
  .pb1-f-head { font-size: 0.78rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; color: white; margin-bottom: 1.1rem; }
  .pb1-f-links { list-style: none; }
  .pb1-f-links li { margin-bottom: 0.55rem; }
  .pb1-f-links button { background: none; border: none; color: rgba(255,255,255,0.48); font-size: 0.86rem; cursor: pointer; transition: color 0.2s; padding: 0; text-align: left; }
  .pb1-f-links button:hover { color: ${P.cyan}; }
  .pb1-footer-bottom { max-width: 1200px; margin: 0 auto; padding-top: 1.4rem; border-top: 1px solid rgba(255,255,255,0.07); display: flex; justify-content: space-between; align-items: center; font-size: 0.76rem; color: rgba(255,255,255,0.28); flex-wrap: wrap; gap: 0.5rem; }

  /* ── RESPONSIVE ── */
  @container (max-width: 960px) {
    .pb1-desk-links { display: none !important; }
    .pb1-nav-emg { font-size: 0.76rem; padding: 0.5rem 0.85rem; }
    .pb1-burger { display: flex !important; }
    .pb1-hero-inner { grid-template-columns: 1fr !important; gap: 2rem !important; }
    .pb1-hero-visual { display: none !important; }
    .pb1-why-grid { grid-template-columns: 1fr 1fr !important; }
    .pb1-why-item { border-right: none !important; border-bottom: 1px solid rgba(255,255,255,0.07) !important; }
    .pb1-proc-steps { grid-template-columns: 1fr 1fr !important; gap: 2rem !important; }
    .pb1-proc-track { display: none !important; }
    .pb1-footer-grid { grid-template-columns: 1fr !important; gap: 2rem !important; }
    .pb1-footer-bottom { flex-direction: column !important; text-align: center !important; }
  }
  @container (max-width: 600px) {
    .pb1-nav-emg { display: none !important; }
    .pb1-hero { padding: 6.5rem 1.2rem 3rem !important; }
    .pb1-hero-ctas { flex-direction: column !important; }
    .pb1-hero-trust { gap: 1.2rem !important; }
    .pb1-why-grid { grid-template-columns: 1fr !important; }
    .pb1-proc-steps { grid-template-columns: 1fr !important; }
    .pb1-sec { padding: 4rem 1.2rem !important; }
    .pb1-why { padding: 2.5rem 1.2rem !important; }
    .pb1-emg-sec { padding: 4rem 1.2rem !important; }
    .pb1-footer { padding: 3rem 1.2rem 1.5rem !important; }
    .pb1-emg-badges { gap: 0.8rem !important; }
  }
  @container (max-width: 480px) {
    .pb1-testi-card { min-width: 270px !important; }
  }

  /* ── KEYFRAMES ── */
  @keyframes pb1-drop-bounce  { 0%,100%{transform:translateY(0)}40%{transform:translateY(-5px)}60%{transform:translateY(-3px)} }
  @keyframes pb1-emg-pulse    { 0%,100%{opacity:1;transform:scale(1)}50%{opacity:0;transform:scale(1.18)} }
  @keyframes pb1-menu-in      { from{opacity:0;transform:translateY(-16px)}to{opacity:1;transform:none} }
  @keyframes pb1-draw         { to{stroke-dashoffset:0} }
  @keyframes pb1-joint-pop    { to{opacity:0.65} }
  @keyframes pb1-drip         { 0%{transform:translateY(-30px) scale(1);opacity:0}10%{opacity:0.7}85%{opacity:0.5}100%{transform:translateY(105vh) scale(0.4);opacity:0} }
  @keyframes pb1-glow-pulse   { 0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.6;transform:scale(1.15)} }
  @keyframes pb1-fade-up      { from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:none} }
  @keyframes pb1-blink        { 0%,100%{opacity:1}50%{opacity:0.2} }
  @keyframes pb1-text-glow    { 0%,100%{text-shadow:0 0 20px rgba(0,200,255,0.3)}50%{text-shadow:0 0 50px rgba(0,200,255,0.7),0 0 100px rgba(0,200,255,0.3)} }
  @keyframes pb1-float        { 0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)} }
  @keyframes pb1-meter-pulse  { from{width:62%}to{width:91%} }
  @keyframes pb1-ripple-out   { 0%{transform:scale(0);opacity:1}100%{transform:scale(3.5);opacity:0} }
  @keyframes pb1-ticker       { from{transform:translateX(0)}to{transform:translateX(-50%)} }
  @keyframes pb1-flow-dot     { 0%{left:0;opacity:0}5%{opacity:1}95%{opacity:1}100%{left:calc(100% - 14px);opacity:0} }
  @keyframes pb1-area-pulse   { 0%,100%{transform:scale(1);opacity:0.28}50%{transform:scale(2);opacity:0} }
  @keyframes pb1-phone-pulse  { 0%{transform:scale(1);opacity:0.48}100%{transform:scale(1.1);opacity:0} }
  @keyframes pb1-cta-breathe  { 0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.12);opacity:0.6} }
  @keyframes pb1-emg-bounce   { from{transform:scale(1)}to{transform:scale(1.08)} }
`;

/* ── Default data ─────────────────────────────────────────────────────────── */
const DEF_SERVICES = [
  { name: 'Leak Detection & Repair',    icon: '💧', description: 'We locate hidden leaks fast using advanced equipment — no unnecessary demolition or guesswork.' },
  { name: 'Drain Cleaning',             icon: '🚿', description: 'Clogged drains cleared with professional hydro-jetting and snake equipment. Fast, permanent results.' },
  { name: 'Water Heater Services',      icon: '🔥', description: 'Installation, repair, and replacement of traditional and tankless water heaters. Same-day service available.' },
  { name: 'Pipe Replacement',           icon: '🏠', description: 'Full repiping for old or corroded pipes. Copper and PEX options with minimal disruption to your home.' },
  { name: 'Toilet & Fixture Repair',    icon: '🚽', description: 'Running toilets, broken faucets, and complete fixture installations handled same day.' },
  { name: 'Emergency Plumbing',         icon: '🆘', description: 'Burst pipes, major leaks, flooding — available 24/7 for true emergencies. No call-out fee ever.' },
];

const DEF_STATS: Array<{ value: string; label: string; numericVal: number; suffix: string }> = [
  { value: '2,400+', label: 'Jobs Completed',         numericVal: 2400, suffix: '+' },
  { value: '15',     label: 'Years in Business',       numericVal: 15,   suffix: ' yrs' },
  { value: '98',     label: 'Customer Satisfaction',   numericVal: 98,   suffix: '%' },
  { value: '45',     label: 'Min Avg Response Time',   numericVal: 45,   suffix: ' min' },
];

const DEF_TESTIMONIALS = [
  { name: 'Sarah M.',  initials: 'SM', loc: 'Austin, TX',      stars: 5, text: '"Burst pipe at 2am and they were at my house in 30 minutes. Fixed it cleanly, didn\'t overcharge. Absolute lifesavers."' },
  { name: 'James R.',  initials: 'JR', loc: 'Round Rock, TX',  stars: 5, text: '"Three companies gave me runaround estimates. AquaPro came same day, told me exactly what was wrong, and fixed it for half the price."' },
  { name: 'Linda T.',  initials: 'LT', loc: 'Cedar Park, TX',  stars: 5, text: '"Replaced our entire water heater in under 3 hours. Professional, spotlessly clean, and the price matched the quote exactly."' },
  { name: 'David K.',  initials: 'DK', loc: 'Pflugerville, TX',stars: 5, text: '"Had a slow drain that turned out to be a root intrusion. They diagnosed it with a camera and fixed it same day. Worth every penny."' },
];

const DEF_FAQS = [
  { q: 'Do you charge for emergency after-hours calls?',  a: 'We never charge a call-out fee, even at 2am. Pricing is based on the job only — you\'ll know the full cost before we start. No hidden emergency premiums.' },
  { q: 'How quickly can you arrive?',                     a: 'For emergencies, we aim to arrive within 20–45 minutes in the local area. For scheduled visits, same-day and next-morning slots are almost always available.' },
  { q: 'Are your plumbers licensed and insured?',         a: 'Yes. Every technician holds a valid Master Plumber license and we carry full general liability plus workers\' compensation insurance on every job.' },
  { q: 'Do you offer a warranty on your work?',           a: 'All labor comes with a full 1-year warranty. Parts are covered by manufacturer warranties, which we help you claim if needed.' },
  { q: 'Do you handle commercial properties?',            a: 'Yes — we work with residential homeowners, landlords, property managers, and small commercial businesses. Call us to confirm coverage for your property.' },
];

const DEF_AREAS = ['Downtown', 'Northside', 'Eastside', 'Westside', 'South District', 'Suburbs'];

const DEF_PROCESS = [
  { icon: '📞', num: '1', title: 'You Call or Book',      desc: 'Call our 24/7 line or book online. Get an upfront quote with no obligation.' },
  { icon: '🚐', num: '2', title: 'Fast Arrival',          desc: 'A licensed plumber arrives fully equipped — stocked van, ready to start immediately.' },
  { icon: '🔍', num: '3', title: 'Diagnose & Quote',      desc: 'We inspect, explain the problem clearly, and confirm the price before any work begins.' },
  { icon: '✅', num: '4', title: 'Fixed & Guaranteed',    desc: 'Work done right the first time. We clean up and back every job with a 1-year warranty.' },
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

/* ── Stat counter sub-component ──────────────────────────────────────────── */
function StatCounter({ num, suffix, active }: { num: number; suffix: string; active: boolean }) {
  const val = useCounter(num, 2000, active);
  return <>{num >= 1000 ? val.toLocaleString() : val}{suffix}</>;
}

/* ── Reveal wrapper ──────────────────────────────────────────────────────── */
function Reveal({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const [ref, visible] = useInView(0.1);
  return (
    <div
      ref={ref}
      className={`pb1-rv${visible ? ' in' : ''} ${className}`}
      style={delay ? { transitionDelay: `${delay}s` } : undefined}
    >
      {children}
    </div>
  );
}

/* ── Main component ──────────────────────────────────────────────────────── */
export default function Plumber1({ businessData, isPreview }: TemplateProps) {
  const bd = businessData;

  // ── Data extraction with fallbacks ──
  const name     = bd.name        || 'AquaPro Plumbing';
  const city     = bd.city        || 'Austin';
  const phone    = bd.phone       || '(555) 123-4567';
  const email    = bd.email       || '';
  const tagline  = bd.tagline     || `${city}'s Most Trusted Plumbers`;
  const subTagline = bd.subTagline || `From burst pipes to full installs — our licensed team arrives fast, fixes it right, and leaves no mess behind.`;

  const rawServices = bd.services?.length ? bd.services : null;
  const services = rawServices
    ? rawServices.map((s, i) => ({ name: s.name, icon: DEF_SERVICES[i % DEF_SERVICES.length]?.icon ?? '🔧', description: s.description ?? '' }))
    : DEF_SERVICES;

  const rawStats = bd.stats?.length ? bd.stats : null;
  const stats = rawStats
    ? rawStats.map(s => { const { num, suffix } = parseStat(s); return { num, suffix, label: s.label }; })
    : DEF_STATS.map(s => ({ num: s.numericVal, suffix: s.suffix, label: s.label }));

  const rawTestis = bd.testimonials?.length ? bd.testimonials : null;
  const testis = rawTestis
    ? rawTestis.map((t: Testimonial) => ({ name: t.name, initials: initials(t.name), loc: t.context ?? city, stars: t.rating ?? 5, text: `"${t.text}"` }))
    : DEF_TESTIMONIALS;

  const faqs: FAQ[]   = bd.faq?.length   ? bd.faq   : DEF_FAQS;
  const areas: string[] = bd.serviceAreas?.length ? bd.serviceAreas.map(a => String(a)) : DEF_AREAS;

  const copy = bd.copy;

  // ── State ──
  const [menuOpen,    setMenuOpen]    = useState(false);
  const [scrolled,    setScrolled]    = useState(false);
  const [openFaq,     setOpenFaq]     = useState<number | null>(null);
  const [activeTesti, setActiveTesti] = useState(0);

  // ── Refs ──
  const particlesRef = useRef<HTMLDivElement>(null);
  const procRef      = useRef<HTMLDivElement>(null);
  const statsRef     = useRef<HTMLDivElement>(null);
  const tScrollRef   = useRef<HTMLDivElement>(null);
  const [statsInView, setStatsInView] = useState(false);

  // ── Nav scroll ──
  useEffect(() => {
    if (isPreview) { setScrolled(true); return; }
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, [isPreview]);

  // ── Water particles ──
  useEffect(() => {
    const container = particlesRef.current;
    if (!container) return;
    for (let i = 0; i < 55; i++) {
      const p = document.createElement('div');
      p.className = 'pb1-particle';
      const size = Math.random() * 5 + 2;
      p.style.cssText = `left:${Math.random() * 100}%;width:${size}px;height:${size}px;animation-duration:${Math.random() * 10 + 6}s;animation-delay:${Math.random() * 10}s;`;
      container.appendChild(p);
    }
    return () => { if (container) container.innerHTML = ''; };
  }, []);

  // ── Process pipe fill ──
  useEffect(() => {
    const el = procRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add('pb1-animated'); obs.disconnect(); } },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // ── Stats in view ──
  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setStatsInView(true); obs.disconnect(); } },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // ── Testimonial scroll dots ──
  useEffect(() => {
    const el = tScrollRef.current;
    if (!el) return;
    const handler = () => {
      const cards = el.querySelectorAll<HTMLElement>('.pb1-testi-card');
      if (!cards.length) return;
      const w = cards[0].offsetWidth + 22;
      setActiveTesti(Math.round(el.scrollLeft / w));
    };
    el.addEventListener('scroll', handler, { passive: true });
    return () => el.removeEventListener('scroll', handler);
  }, []);

  const scrollToTesti = (i: number) => {
    const el = tScrollRef.current;
    if (!el) return;
    const cards = el.querySelectorAll<HTMLElement>('.pb1-testi-card');
    if (!cards.length) return;
    el.scrollTo({ left: i * (cards[0].offsetWidth + 22), behavior: 'smooth' });
  };

  // ── Ripple ──
  const addRipple = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const span = document.createElement('span');
    span.className = 'pb1-ripple';
    span.style.left = (e.clientX - rect.left) + 'px';
    span.style.top  = (e.clientY - rect.top)  + 'px';
    btn.appendChild(span);
    setTimeout(() => span.remove(), 700);
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  const tickerItems = ['✅ Licensed & Insured', '🚨 24/7 Emergency Service', '⚡ Same-Day Appointments', '💯 Satisfaction Guaranteed', '🏆 5-Star Rated', '🔧 Upfront Pricing', `📍 Serving ${city}`];

  return (
    <div className="pb1">
      <style>{STYLES}</style>

      {/* ── NAV ── */}
      <nav className={`pb1-nav${scrolled ? ' scrolled' : ''}`} data-ec>
        <div className="pb1-logo">
          <span className="pb1-logo-drop">💧</span>
          {name.split(' ')[0]}<span className="pb1-logo-accent">{name.split(' ').slice(1).join(' ') || 'Pro'}</span>
        </div>
        <ul className="pb1-desk-links">
          {(['services','process','testimonials','faq','areas'] as const).map(id => (
            <li key={id}><button onClick={() => scrollTo(id)}>{id.charAt(0).toUpperCase() + id.slice(1)}</button></li>
          ))}
        </ul>
        {phone && <a href={`tel:${phone.replace(/\D/g,'')}`} className="pb1-nav-emg">🚨 Emergency: {phone}</a>}
        <button
          className={`pb1-burger${menuOpen ? ' open' : ''}`}
          onClick={() => setMenuOpen(v => !v)}
          aria-label="Menu"
        >
          <span/><span/><span/>
        </button>
      </nav>

      {/* ── MOBILE MENU ── */}
      <div className={`pb1-mob-menu${menuOpen ? ' open' : ''}`} data-ec>
        {['services','process','testimonials','faq','areas'].map(id => (
          <button key={id} onClick={() => scrollTo(id)}>{id.charAt(0).toUpperCase() + id.slice(1)}</button>
        ))}
        {phone && <button className="pb1-mob-emg" onClick={() => window.location.href = `tel:${phone.replace(/\D/g,'')}`}>📞 {phone}</button>}
      </div>

      {/* ── HERO ── */}
      <section className="pb1-hero" id="home">
        {/* Animated pipe SVG */}
        <svg className="pb1-hero-pipes" viewBox="0 0 1400 800" preserveAspectRatio="xMidYMid slice">
          <path className="pb1-pipe pb1-pipe-draw pb1-pipe-draw-1" strokeWidth="3"
            d="M0 180 H280 V380 H560 V180 H840 V480 H1120 V280 H1400"/>
          <path className="pb1-pipe pb1-pipe-draw pb1-pipe-draw-2" strokeWidth="2" strokeDasharray="8 5"
            d="M0 480 H200 V280 H500 V80 H780 V380 H1060 V580 H1400"/>
          <path className="pb1-pipe pb1-pipe-draw pb1-pipe-draw-3" strokeWidth="2" strokeDasharray="5 8"
            d="M0 700 H160 V500 H440 V700 H720 V300 H1000 V600 H1400"/>
          <path className="pb1-pipe pb1-pipe-draw pb1-pipe-draw-4" strokeWidth="1.5" strokeDasharray="6 6" opacity="0.5"
            d="M280 0 V380 M560 0 V180 M840 0 V480 M1120 0 V280"/>
          <circle className="pb1-joint pb1-joint-1" cx="280"  cy="180" r="7"/>
          <circle className="pb1-joint pb1-joint-2" cx="560"  cy="380" r="7"/>
          <circle className="pb1-joint pb1-joint-3" cx="840"  cy="180" r="7"/>
          <circle className="pb1-joint pb1-joint-4" cx="1120" cy="480" r="7"/>
          <circle className="pb1-joint pb1-joint-5" cx="200"  cy="280" r="5"/>
        </svg>

        <div className="pb1-particles" ref={particlesRef}/>
        <div className="pb1-glow"/>

        <div className="pb1-hero-inner">
          {/* Left */}
          <div>
            <div className="pb1-hero-badge">
              <div className="pb1-live-dot"/>
              Available 24/7 — Same-Day Service
            </div>
            <h1 className="pb1-hero-h1">
              {city}&apos;s Most<br/>
              <span className="pb1-hero-h1-glow">Trusted Plumbers</span>
            </h1>
            <p className="pb1-hero-sub">{subTagline} Rated 5 stars by hundreds of homeowners.</p>
            <div className="pb1-hero-ctas">
              {phone && (
                <a href={`tel:${phone.replace(/\D/g,'')}`} className="pb1-btn-primary" onClick={addRipple}>
                  📞 {copy?.hero_cta_primary ?? 'Call Now — It\'s Free'}
                </a>
              )}
              <button className="pb1-btn-outline" onClick={() => scrollTo('services')}>
                {copy?.hero_cta_secondary ?? 'View Services ↓'}
              </button>
            </div>
            <div className="pb1-hero-trust">
              {stats.slice(0, 3).map((s, i) => (
                <div key={i}>
                  <span className="pb1-trust-num">{s.num.toLocaleString()}{s.suffix}</span>
                  <span className="pb1-trust-lbl">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Right card */}
          <div className="pb1-hero-visual">
            <div className="pb1-hero-card">
              <div className="pb1-card-icon">🔧</div>
              <div className="pb1-card-title">Live Response Status</div>
              <div className="pb1-card-sub">Average arrival times right now</div>
              <div className="pb1-meter-row">
                <div className="pb1-meter-head"><span>Standard call-out</span><strong style={{color:'var(--pb1-cyan,#00c8ff)'}}>~45 min</strong></div>
                <div className="pb1-meter-track"><div className="pb1-meter-fill"/></div>
              </div>
              <div className="pb1-meter-row">
                <div className="pb1-meter-head"><span>Emergency response</span><strong style={{color:'#2ecc71'}}>~20 min</strong></div>
                <div className="pb1-meter-track"><div className="pb1-meter-fill pb1-meter-fill-emg"/></div>
              </div>
              <div className="pb1-card-tags">
                {services.slice(0, 5).map((s, i) => <span key={i} className="pb1-card-tag">{s.name.split(' ')[0]}</span>)}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TICKER ── */}
      <div className="pb1-ticker" aria-hidden="true">
        <div className="pb1-ticker-track">
          {[...tickerItems, ...tickerItems].map((item, i) => (
            <span key={i} className="pb1-ticker-item">{item}<span className="pb1-ticker-sep"/></span>
          ))}
        </div>
      </div>

      {/* ── WHY US ── */}
      <div className="pb1-why">
        <div className="pb1-why-grid">
          {[
            { icon: '⚡', title: 'Fast Arrival',       desc: '20–45 min emergency response' },
            { icon: '💰', title: 'Upfront Pricing',    desc: 'Full quote before we touch anything' },
            { icon: '🏅', title: 'Master Licensed',    desc: 'Every tech holds a valid license' },
            { icon: '🛡️', title: '1-Year Warranty',   desc: 'All labor guaranteed 12 months' },
            { icon: '🧹', title: 'Clean Job Site',     desc: 'We leave your home spotless' },
          ].map((w, i) => (
            <Reveal key={i} className="pb1-why-item" delay={i * 0.08}>
              <div className="pb1-why-icon">{w.icon}</div>
              <div className="pb1-why-title">{w.title}</div>
              <div className="pb1-why-desc">{w.desc}</div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* ── SERVICES ── */}
      <section className="pb1-sec pb1-svc-bg" id="services">
        <div className="pb1-con">
          <Reveal className="pb1-hdr">
            <div className="pb1-eyebrow">{copy?.services_label ?? 'What We Do'}</div>
            <h2 className="pb1-h2">{copy?.services_heading ?? 'Full-Service Plumbing Solutions'}</h2>
            <p className="pb1-lead">{copy?.services_subheading ?? 'From emergency repairs to full installations — our licensed team handles every job, big or small.'}</p>
          </Reveal>
          <div className="pb1-svc-grid">
            {services.map((s, i) => (
              <Reveal key={i} className="pb1-svc-card" delay={(i % 4) * 0.08}>
                <div className="pb1-svc-icon">{s.icon}</div>
                <div className="pb1-svc-name">{s.name}</div>
                <div className="pb1-svc-desc">{s.description}</div>
                <div className="pb1-svc-arrow">→ Learn more</div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="pb1-sec pb1-stats-bg" id="stats" ref={statsRef}>
        <svg className="pb1-wave-deco top" viewBox="0 0 1200 80" preserveAspectRatio="none">
          <path d="M0 40 C200 0 400 80 600 40 C800 0 1000 80 1200 40 L1200 80 L0 80Z" fill={P.cyan}/>
        </svg>
        <svg className="pb1-wave-deco btm" viewBox="0 0 1200 80" preserveAspectRatio="none">
          <path d="M0 40 C200 0 400 80 600 40 C800 0 1000 80 1200 40 L1200 80 L0 80Z" fill={P.cyan}/>
        </svg>
        <div className="pb1-con">
          <div className="pb1-stats-grid">
            {stats.map((s, i) => (
              <Reveal key={i} className="pb1-stat-card" delay={i * 0.1}>
                <span className="pb1-stat-num">
                  <StatCounter num={s.num} suffix={s.suffix} active={statsInView}/>
                </span>
                <div className="pb1-stat-bar" style={{ background: [P.cyan, P.green, P.gold, P.red][i % 4] }}/>
                <div className="pb1-stat-lbl">{s.label}</div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROCESS ── */}
      <section className="pb1-sec pb1-proc-bg" id="process">
        <div className="pb1-con">
          <Reveal className="pb1-hdr pb1-hdr-center">
            <div className="pb1-eyebrow">How It Works</div>
            <h2 className="pb1-h2">Fixed in 4 Simple Steps</h2>
            <p className="pb1-lead">No runaround, no hidden fees. Here&apos;s exactly what happens when you call us.</p>
          </Reveal>
          <div className="pb1-proc-wrap" ref={procRef}>
            <div className="pb1-proc-track">
              <div className="pb1-proc-fill"/>
              <div className="pb1-proc-dot"/>
            </div>
            <div className="pb1-proc-steps">
              {DEF_PROCESS.map((step, i) => (
                <Reveal key={i} className="pb1-proc-step" delay={i * 0.12}>
                  <div className="pb1-step-bubble">
                    {step.icon}
                    <div className="pb1-step-badge">{step.num}</div>
                  </div>
                  <div className="pb1-step-title">{step.title}</div>
                  <div className="pb1-step-desc">{step.desc}</div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="pb1-sec pb1-testi-bg" id="testimonials">
        <div className="pb1-con">
          <Reveal className="pb1-hdr">
            <div className="pb1-eyebrow">{copy?.testimonials_label ?? 'What People Say'}</div>
            <h2 className="pb1-h2">Loved by Local Homeowners</h2>
          </Reveal>
          <div className="pb1-testi-scroll" ref={tScrollRef}>
            {testis.map((t, i) => (
              <Reveal key={i} className="pb1-testi-card" delay={i * 0.1}>
                <div className="pb1-testi-stars">{'★'.repeat(Math.min(t.stars, 5))}</div>
                <p className="pb1-testi-text">{t.text}</p>
                <div className="pb1-testi-author">
                  <div className="pb1-testi-avatar">{t.initials}</div>
                  <div>
                    <div className="pb1-testi-name">{t.name}</div>
                    <div className="pb1-testi-loc">{t.loc}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="pb1-scroll-dots">
            {testis.map((_, i) => (
              <button key={i} className={`pb1-sdot${activeTesti === i ? ' active' : ''}`} onClick={() => scrollToTesti(i)} aria-label={`Testimonial ${i + 1}`}/>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="pb1-sec pb1-faq-bg" id="faq">
        <div className="pb1-con">
          <Reveal className="pb1-hdr pb1-hdr-center">
            <div className="pb1-eyebrow">{copy?.faq_label ?? 'Common Questions'}</div>
            <h2 className="pb1-h2">{copy?.faq_heading ?? 'Frequently Asked Questions'}</h2>
          </Reveal>
          <div className="pb1-faq-wrap">
            {faqs.map((f, i) => (
              <Reveal key={i} className={`pb1-faq-item${openFaq === i ? ' open' : ''}`} delay={i * 0.06}>
                <button className="pb1-faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span>{f.q}</span>
                  <div className="pb1-faq-icon">+</div>
                </button>
                <div className="pb1-faq-a"><p>{f.a}</p></div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICE AREAS ── */}
      <section className="pb1-sec pb1-areas-bg" id="areas">
        <div className="pb1-con">
          <Reveal className="pb1-hdr pb1-hdr-center">
            <div className="pb1-eyebrow">Where We Work</div>
            <h2 className="pb1-h2">Serving {city} &amp; Surrounding Areas</h2>
            <p className="pb1-lead">Fast response times across all these locations and surrounding communities.</p>
          </Reveal>
          <div className="pb1-areas-grid">
            {areas.map((area, i) => (
              <Reveal key={i} className="pb1-area-pill" delay={(i % 4) * 0.08}>
                <div className="pb1-area-pulse"/>
                {area}
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── EMERGENCY CTA ── */}
      <section className="pb1-sec pb1-emg-sec">
        <div className="pb1-con pb1-emg-inner">
          <Reveal>
            <span className="pb1-emg-icon">🚨</span>
            <h2 className="pb1-emg-title">
              {copy?.cta_heading ?? 'Pipe Burst? Water Flooding?'}<br/>
              Don&apos;t Wait — Call Now.
            </h2>
            <p className="pb1-emg-sub">{copy?.cta_subheading ?? 'Our emergency plumbers are standing by right now. Free to call, fast to arrive, no hidden fees.'}</p>
            {phone && (
              <a href={`tel:${phone.replace(/\D/g,'')}`} className="pb1-emg-phone">📞 {phone}</a>
            )}
            <div className="pb1-emg-badges">
              {['✅ No Call-Out Fee', '⚡ 20–45 Min Response', '🔒 Upfront Pricing', '🛡️ 1-Year Warranty'].map((b, i) => {
                const [icon, ...rest] = b.split(' ');
                return (
                  <div key={i} className="pb1-emg-badge">
                    <span className="pb1-emg-badge-icon">{icon}</span>{rest.join(' ')}
                  </div>
                );
              })}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="pb1-footer">
        <div className="pb1-footer-grid">
          <div>
            <div className="pb1-footer-logo">
              {name.split(' ')[0]}<span className="pb1-footer-logo-accent">{name.split(' ').slice(1).join(' ') || 'Pro'}</span>
            </div>
            <p className="pb1-footer-desc">
              {bd.description ?? `${city}'s trusted plumbing service. Licensed, insured, and available around the clock for everything from a dripping faucet to a full pipe emergency.`}
            </p>
            {phone && <div className="pb1-footer-row"><span className="pb1-footer-row-icon">📞</span>{phone}</div>}
            {email && <div className="pb1-footer-row"><span className="pb1-footer-row-icon">✉️</span>{email}</div>}
            {bd.address && <div className="pb1-footer-row"><span className="pb1-footer-row-icon">📍</span>{bd.address}</div>}
            {!bd.address && <div className="pb1-footer-row"><span className="pb1-footer-row-icon">📍</span>{city}</div>}
          </div>
          <div>
            <div className="pb1-f-head">Services</div>
            <ul className="pb1-f-links">
              {services.slice(0, 5).map((s, i) => (
                <li key={i}><button onClick={() => scrollTo('services')}>{s.name}</button></li>
              ))}
            </ul>
          </div>
          <div>
            <div className="pb1-f-head">Company</div>
            <ul className="pb1-f-links">
              {['About Us', 'Reviews', 'Service Areas', 'Contact', 'Privacy Policy'].map((l, i) => (
                <li key={i}><button>{l}</button></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="pb1-footer-bottom">
          <span>© {new Date().getFullYear()} {name}. All rights reserved.</span>
          <span>Licensed Master Plumber · {city}</span>
        </div>
      </footer>
    </div>
  );
}
