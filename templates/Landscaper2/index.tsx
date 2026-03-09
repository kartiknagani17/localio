'use client';
import { useEffect, useRef, useState } from 'react';
import type { TemplateProps } from '../types';

/* ── Palette ─────────────────────────────────────────────────────────────── */
const P = {
  parchment: '#F6F1E8',
  sand:      '#EAE0CC',
  olive:     '#364F32',
  oliveMid:  '#4F7249',
  amber:     '#C07638',
  gold:      '#D4A040',
  earth:     '#8B6040',
  dark:      '#231C10',
  mid:       '#6B5438',
  white:     '#FFFFFF',
  terra:     '#A84E22',
  softGreen: '#DCE8D0',
  footerBg:  '#1C1408',
} as const;

/* ── Styles ──────────────────────────────────────────────────────────────── */
const STYLES = `
  .bt1 * { box-sizing: border-box; margin: 0; padding: 0; }
  .bt1 { font-family: 'Inter', system-ui, sans-serif; background: ${P.parchment}; color: ${P.dark}; overflow-x: hidden; container-type: inline-size; }

  /* NAV */
  .bt1-nav { position: fixed; top: 0; left: 0; right: 0; z-index: 200; background: rgba(246,241,232,0.96); backdrop-filter: blur(10px); border-bottom: 1px solid rgba(54,79,50,0.08); transition: box-shadow 0.3s; }
  .bt1-nav.scrolled { box-shadow: 0 2px 20px rgba(35,28,16,0.10); }
  .bt1-nav-inner { max-width: 1200px; margin: 0 auto; padding: 0 32px; height: 64px; display: flex; align-items: center; justify-content: space-between; }
  .bt1-logo { display: flex; align-items: center; gap: 10px; font-weight: 800; font-size: 17px; color: ${P.olive}; cursor: pointer; user-select: none; }
  .bt1-logo-ico { width: 34px; height: 34px; background: ${P.olive}; border-radius: 9px; display: flex; align-items: center; justify-content: center; font-size: 17px; }
  .bt1-desk-links { display: flex; align-items: center; gap: 28px; }
  .bt1-desk-links button { background: none; border: none; font-size: 14px; font-weight: 500; color: ${P.mid}; cursor: pointer; transition: color 0.2s; }
  .bt1-desk-links button:hover { color: ${P.olive}; }
  .bt1-nav-cta { background: ${P.amber}; color: #fff; border: none; padding: 9px 22px; border-radius: 8px; font-size: 14px; font-weight: 700; cursor: pointer; transition: background 0.2s; }
  .bt1-nav-cta:hover { background: ${P.terra}; }
  .bt1-burger { display: none; flex-direction: column; gap: 5px; background: none; border: none; cursor: pointer; padding: 4px; }
  .bt1-burger span { width: 22px; height: 2px; background: ${P.olive}; border-radius: 2px; transition: all 0.28s; display: block; }
  .bt1-burger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
  .bt1-burger.open span:nth-child(2) { opacity: 0; }
  .bt1-burger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }
  .bt1-mob-menu { position: fixed; top: 64px; left: 0; right: 0; background: ${P.parchment}; border-bottom: 1px solid rgba(54,79,50,0.1); padding: 12px 24px 24px; z-index: 199; display: flex; flex-direction: column; gap: 2px; box-shadow: 0 10px 28px rgba(35,28,16,0.10); }
  .bt1-mob-menu button { background: none; border: none; text-align: left; padding: 13px 0; font-size: 16px; font-weight: 500; color: ${P.dark}; cursor: pointer; border-bottom: 1px solid rgba(54,79,50,0.08); }
  .bt1-mob-cta-link { display: block; margin-top: 14px; background: ${P.amber}; color: #fff; text-align: center; padding: 14px; border-radius: 10px; font-weight: 700; font-size: 16px; text-decoration: none; }

  /* HERO — vertical split */
  .bt1-hero { display: grid; grid-template-columns: 45% 55%; min-height: 100vh; }
  .bt1-hero-left { background: ${P.olive}; display: flex; flex-direction: column; justify-content: center; padding: 120px 56px 80px; position: relative; overflow: hidden; }
  .bt1-hero-left::after { content: ''; position: absolute; bottom: -60px; right: -60px; width: 200px; height: 200px; border-radius: 50%; background: rgba(255,255,255,0.04); }
  .bt1-hero-left::before { content: ''; position: absolute; top: -40px; left: -40px; width: 160px; height: 160px; border-radius: 50%; background: rgba(255,255,255,0.03); }
  .bt1-hero-eyebrow { display: inline-flex; align-items: center; gap: 8px; font-size: 11px; font-weight: 800; letter-spacing: 0.14em; text-transform: uppercase; color: ${P.gold}; margin-bottom: 28px; }
  .bt1-hero-eyebrow::before { content: ''; width: 20px; height: 1px; background: ${P.gold}; display: block; }
  .bt1-hero-h1 { font-size: clamp(40px, 4vw, 62px); font-weight: 900; color: ${P.white}; line-height: 1.06; letter-spacing: -0.03em; margin-bottom: 22px; }
  .bt1-hero-h1 em { font-style: normal; color: ${P.gold}; }
  .bt1-hero-sub { font-size: 16px; color: rgba(255,255,255,0.72); line-height: 1.72; margin-bottom: 40px; max-width: 380px; }
  .bt1-hero-btns { display: flex; gap: 14px; flex-wrap: wrap; margin-bottom: 44px; }
  .bt1-btn-amber { background: ${P.amber}; color: #fff; border: none; padding: 14px 30px; border-radius: 10px; font-size: 15px; font-weight: 700; cursor: pointer; transition: background 0.2s, transform 0.2s; }
  .bt1-btn-amber:hover { background: ${P.terra}; transform: translateY(-1px); }
  .bt1-btn-ghost-w { background: none; color: rgba(255,255,255,0.85); border: 1.5px solid rgba(255,255,255,0.3); padding: 13px 28px; border-radius: 10px; font-size: 15px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
  .bt1-btn-ghost-w:hover { border-color: rgba(255,255,255,0.7); color: #fff; }
  .bt1-hero-trust { display: flex; flex-direction: column; gap: 10px; }
  .bt1-trust-item { display: flex; align-items: center; gap: 10px; font-size: 13px; color: rgba(255,255,255,0.6); font-weight: 500; }
  .bt1-trust-dot { width: 6px; height: 6px; border-radius: 50%; background: ${P.gold}; flex-shrink: 0; }
  .bt1-hero-right { background: ${P.sand}; display: flex; align-items: center; justify-content: center; padding: 80px 40px; position: relative; overflow: hidden; }
  .bt1-hero-right::before { content: ''; position: absolute; top: -80px; right: -80px; width: 300px; height: 300px; border-radius: 50%; background: rgba(54,79,50,0.06); }
  .bt1-hero-right::after { content: ''; position: absolute; bottom: -60px; left: -60px; width: 220px; height: 220px; border-radius: 50%; background: rgba(192,118,56,0.07); }

  /* SERVICES — tabbed */
  .bt1-svc { background: ${P.white}; padding: 96px 0; }
  .bt1-svc-top { max-width: 1100px; margin: 0 auto 0; padding: 0 32px; display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 48px; }
  .bt1-svc-hdr h2 { font-size: clamp(28px, 3.5vw, 46px); font-weight: 900; color: ${P.dark}; letter-spacing: -0.025em; line-height: 1.12; }
  .bt1-svc-hdr p { font-size: 14px; color: ${P.mid}; margin-top: 8px; line-height: 1.6; }
  .bt1-tabs { max-width: 1100px; margin: 0 auto; padding: 0 32px; display: flex; gap: 0; border-bottom: 2px solid ${P.sand}; }
  .bt1-tab { background: none; border: none; padding: 14px 28px; font-size: 15px; font-weight: 700; color: ${P.mid}; cursor: pointer; position: relative; transition: color 0.2s; border-bottom: 3px solid transparent; margin-bottom: -2px; }
  .bt1-tab:hover { color: ${P.olive}; }
  .bt1-tab.active { color: ${P.olive}; border-bottom-color: ${P.amber}; }
  .bt1-tab-icon { margin-right: 8px; font-size: 16px; }
  .bt1-tab-panel { max-width: 1100px; margin: 0 auto; padding: 48px 32px 0; display: none; }
  .bt1-tab-panel.active { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: start; }
  .bt1-panel-left h3 { font-size: clamp(26px, 3vw, 38px); font-weight: 900; color: ${P.dark}; letter-spacing: -0.02em; margin-bottom: 16px; }
  .bt1-panel-left p { font-size: 15px; color: ${P.mid}; line-height: 1.72; margin-bottom: 24px; }
  .bt1-panel-price { font-size: 36px; font-weight: 900; color: ${P.olive}; margin-bottom: 6px; }
  .bt1-panel-per { font-size: 14px; color: ${P.mid}; font-weight: 400; }
  .bt1-panel-book { display: inline-block; margin-top: 20px; background: ${P.olive}; color: #fff; border: none; padding: 13px 28px; border-radius: 10px; font-size: 14px; font-weight: 700; cursor: pointer; transition: background 0.2s; }
  .bt1-panel-book:hover { background: ${P.oliveMid}; }
  .bt1-panel-right { background: ${P.parchment}; border-radius: 20px; padding: 32px; }
  .bt1-feat-list { list-style: none; display: flex; flex-direction: column; gap: 14px; }
  .bt1-feat-item { display: flex; align-items: flex-start; gap: 14px; font-size: 14px; color: ${P.dark}; line-height: 1.5; }
  .bt1-feat-check { width: 22px; height: 22px; border-radius: 50%; background: ${P.softGreen}; border: 1.5px solid ${P.oliveMid}; display: flex; align-items: center; justify-content: center; font-size: 11px; color: ${P.olive}; font-weight: 900; flex-shrink: 0; margin-top: 1px; }

  /* STATS — staggered strips */
  .bt1-stats { }
  .bt1-stat-strip { display: grid; grid-template-columns: auto 1fr; align-items: center; gap: 48px; padding: 48px 80px; }
  .bt1-stat-strip:nth-child(1) { background: ${P.parchment}; }
  .bt1-stat-strip:nth-child(2) { background: ${P.sand}; }
  .bt1-stat-strip:nth-child(3) { background: ${P.softGreen}; }
  .bt1-stat-strip:nth-child(4) { background: ${P.olive}; }
  .bt1-stat-big { font-size: clamp(60px, 8vw, 100px); font-weight: 900; letter-spacing: -0.04em; line-height: 1; white-space: nowrap; }
  .bt1-stat-strip:nth-child(1) .bt1-stat-big { color: ${P.olive}; }
  .bt1-stat-strip:nth-child(2) .bt1-stat-big { color: ${P.amber}; }
  .bt1-stat-strip:nth-child(3) .bt1-stat-big { color: ${P.olive}; }
  .bt1-stat-strip:nth-child(4) .bt1-stat-big { color: ${P.gold}; }
  .bt1-stat-info-label { font-size: clamp(18px, 2.5vw, 28px); font-weight: 800; letter-spacing: -0.01em; margin-bottom: 6px; }
  .bt1-stat-strip:nth-child(4) .bt1-stat-info-label { color: rgba(255,255,255,0.9); }
  .bt1-stat-info-desc { font-size: 14px; line-height: 1.6; }
  .bt1-stat-strip:nth-child(4) .bt1-stat-info-desc { color: rgba(255,255,255,0.6); }
  .bt1-stat-divider { width: 1px; height: 60px; background: rgba(0,0,0,0.12); }
  .bt1-stat-strip:nth-child(4) .bt1-stat-divider { background: rgba(255,255,255,0.2); }

  /* TESTIMONIALS — horizontal scroll */
  .bt1-testi { background: ${P.olive}; padding: 88px 0 88px 32px; overflow: hidden; }
  .bt1-testi-hdr { padding-right: 32px; max-width: 1100px; margin: 0 auto 48px; display: flex; align-items: flex-end; justify-content: space-between; }
  .bt1-testi-hdr h2 { font-size: clamp(28px, 3.5vw, 46px); font-weight: 900; color: ${P.white}; letter-spacing: -0.025em; line-height: 1.12; }
  .bt1-testi-hdr p { font-size: 14px; color: rgba(255,255,255,0.55); max-width: 200px; text-align: right; }
  .bt1-testi-scroll { display: flex; gap: 20px; overflow-x: auto; scroll-snap-type: x mandatory; padding-right: 32px; padding-bottom: 8px; -webkit-overflow-scrolling: touch; scrollbar-width: none; }
  .bt1-testi-scroll::-webkit-scrollbar { display: none; }
  .bt1-testi-card { flex: 0 0 340px; scroll-snap-align: start; border-radius: 18px; padding: 32px 28px; position: relative; }
  .bt1-testi-card:nth-child(odd) { background: rgba(255,255,255,0.08); }
  .bt1-testi-card:nth-child(even) { background: ${P.oliveMid}; }
  .bt1-testi-stars { display: flex; gap: 3px; margin-bottom: 18px; }
  .bt1-testi-star { color: ${P.gold}; font-size: 15px; }
  .bt1-testi-quote { font-size: 15px; color: rgba(255,255,255,0.9); line-height: 1.72; font-style: italic; margin-bottom: 24px; }
  .bt1-testi-divider { width: 32px; height: 2px; background: ${P.gold}; margin-bottom: 16px; }
  .bt1-testi-name { font-size: 14px; font-weight: 800; color: ${P.white}; }
  .bt1-testi-detail { font-size: 12px; color: rgba(255,255,255,0.5); margin-top: 4px; }

  /* PROCESS — vertical timeline */
  .bt1-process { background: ${P.parchment}; padding: 96px 24px; }
  .bt1-process-hdr { text-align: center; margin-bottom: 72px; }
  .bt1-process-eyebrow { font-size: 11px; font-weight: 800; letter-spacing: 0.14em; text-transform: uppercase; color: ${P.amber}; margin-bottom: 10px; }
  .bt1-process-h2 { font-size: clamp(28px, 3.5vw, 46px); font-weight: 900; color: ${P.dark}; letter-spacing: -0.025em; }
  .bt1-timeline { max-width: 800px; margin: 0 auto; position: relative; }
  .bt1-timeline::before { content: ''; position: absolute; left: 50%; transform: translateX(-50%); top: 0; bottom: 0; width: 2px; background: linear-gradient(to bottom, ${P.sand}, ${P.oliveMid}, ${P.sand}); }
  .bt1-tl-step { display: grid; grid-template-columns: 1fr 56px 1fr; gap: 0; align-items: center; min-height: 160px; }
  .bt1-tl-step + .bt1-tl-step { margin-top: 0; }
  .bt1-tl-left { text-align: right; padding: 28px 40px 28px 0; }
  .bt1-tl-right { padding: 28px 0 28px 40px; }
  .bt1-tl-empty { }
  .bt1-tl-node { width: 56px; height: 56px; border-radius: 50%; background: ${P.white}; border: 3px solid ${P.olive}; display: flex; align-items: center; justify-content: center; font-size: 22px; z-index: 1; position: relative; box-shadow: 0 0 0 6px ${P.parchment}; transition: all 0.3s; }
  .bt1-tl-step:hover .bt1-tl-node { background: ${P.olive}; transform: scale(1.1); }
  .bt1-tl-content-title { font-size: 19px; font-weight: 800; color: ${P.dark}; margin-bottom: 8px; }
  .bt1-tl-content-desc { font-size: 13px; color: ${P.mid}; line-height: 1.68; }
  .bt1-tl-step-num { font-size: 11px; font-weight: 800; letter-spacing: 0.1em; color: ${P.amber}; margin-bottom: 6px; text-transform: uppercase; }

  /* ABOUT — full bleed warm */
  .bt1-about { background: linear-gradient(135deg, ${P.terra} 0%, ${P.amber} 60%, ${P.gold} 100%); padding: 96px 32px; text-align: center; position: relative; overflow: hidden; }
  .bt1-about-blob1 { position: absolute; top: -60px; left: -60px; width: 280px; height: 280px; border-radius: 50%; background: rgba(255,255,255,0.05); pointer-events: none; }
  .bt1-about-blob2 { position: absolute; bottom: -80px; right: -40px; width: 360px; height: 360px; border-radius: 50%; background: rgba(0,0,0,0.06); pointer-events: none; }
  .bt1-about-inner { max-width: 800px; margin: 0 auto; position: relative; z-index: 1; }
  .bt1-about-eyebrow { font-size: 11px; font-weight: 800; letter-spacing: 0.14em; text-transform: uppercase; color: rgba(255,255,255,0.7); margin-bottom: 20px; }
  .bt1-about-h2 { font-size: clamp(36px, 5vw, 64px); font-weight: 900; color: ${P.white}; letter-spacing: -0.03em; line-height: 1.08; margin-bottom: 24px; }
  .bt1-about-p { font-size: 16px; color: rgba(255,255,255,0.82); line-height: 1.72; margin-bottom: 48px; }
  .bt1-about-chips { display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; margin-bottom: 32px; }
  .bt1-about-chip { background: rgba(255,255,255,0.14); border: 1px solid rgba(255,255,255,0.25); color: rgba(255,255,255,0.95); font-size: 13px; font-weight: 600; padding: 8px 18px; border-radius: 100px; }
  .bt1-about-contact { display: flex; gap: 20px; justify-content: center; flex-wrap: wrap; }
  .bt1-about-contact a { font-size: 15px; font-weight: 700; color: rgba(255,255,255,0.9); text-decoration: none; display: flex; align-items: center; gap: 8px; padding: 12px 24px; background: rgba(255,255,255,0.12); border-radius: 10px; transition: background 0.2s; }
  .bt1-about-contact a:hover { background: rgba(255,255,255,0.22); }

  /* FAQ */
  .bt1-faq { background: ${P.sand}; padding: 88px 32px; }
  .bt1-faq-inner { max-width: 760px; margin: 0 auto; }
  .bt1-faq-hdr { margin-bottom: 48px; }
  .bt1-faq-eyebrow { font-size: 11px; font-weight: 800; letter-spacing: 0.14em; text-transform: uppercase; color: ${P.amber}; margin-bottom: 10px; }
  .bt1-faq-h2 { font-size: clamp(28px, 3.5vw, 44px); font-weight: 900; color: ${P.dark}; letter-spacing: -0.025em; }
  .bt1-faq-list { display: flex; flex-direction: column; gap: 10px; }
  .bt1-faq-item { background: ${P.white}; border-radius: 14px; overflow: hidden; border-left: 4px solid transparent; transition: border-color 0.25s, box-shadow 0.25s; }
  .bt1-faq-item.open { border-left-color: ${P.amber}; box-shadow: 0 6px 28px rgba(192,118,56,0.12); }
  .bt1-faq-q { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 20px 24px; cursor: pointer; }
  .bt1-faq-q-text { font-size: 15px; font-weight: 700; color: ${P.dark}; line-height: 1.4; }
  .bt1-faq-item.open .bt1-faq-q-text { color: ${P.olive}; }
  .bt1-faq-ico { width: 30px; height: 30px; border-radius: 50%; background: ${P.parchment}; border: 1.5px solid ${P.sand}; display: flex; align-items: center; justify-content: center; font-size: 16px; color: ${P.mid}; flex-shrink: 0; transition: all 0.28s; font-weight: 300; }
  .bt1-faq-item.open .bt1-faq-ico { transform: rotate(45deg); background: ${P.amber}; color: #fff; border-color: ${P.amber}; }
  .bt1-faq-a { max-height: 0; overflow: hidden; transition: max-height 0.36s ease, padding 0.2s; padding: 0 24px; }
  .bt1-faq-item.open .bt1-faq-a { max-height: 220px; padding: 0 24px 20px; }
  .bt1-faq-a p { font-size: 14px; color: ${P.mid}; line-height: 1.72; border-top: 1px solid ${P.parchment}; padding-top: 14px; }

  /* CTA */
  .bt1-cta { background: ${P.olive}; padding: 96px 32px; text-align: center; position: relative; overflow: hidden; }
  .bt1-cta-plant { position: absolute; right: -20px; bottom: -20px; font-size: 200px; opacity: 0.05; pointer-events: none; line-height: 1; user-select: none; }
  .bt1-cta-plant2 { position: absolute; left: -20px; top: -20px; font-size: 160px; opacity: 0.04; pointer-events: none; line-height: 1; user-select: none; transform: rotate(180deg); }
  .bt1-cta-inner { max-width: 680px; margin: 0 auto; position: relative; z-index: 1; }
  .bt1-cta-eyebrow { font-size: 11px; font-weight: 800; letter-spacing: 0.14em; text-transform: uppercase; color: ${P.gold}; margin-bottom: 20px; }
  .bt1-cta h2 { font-size: clamp(32px, 4.5vw, 58px); font-weight: 900; color: ${P.white}; letter-spacing: -0.03em; line-height: 1.07; margin-bottom: 18px; }
  .bt1-cta p { font-size: 16px; color: rgba(255,255,255,0.7); margin-bottom: 40px; line-height: 1.65; }
  .bt1-cta-btns { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }
  .bt1-cta-btn-a { background: ${P.amber}; color: #fff; border: none; padding: 15px 36px; border-radius: 10px; font-size: 15px; font-weight: 800; cursor: pointer; transition: background 0.2s, transform 0.2s; }
  .bt1-cta-btn-a:hover { background: ${P.terra}; transform: translateY(-2px); }
  .bt1-cta-btn-outline { background: none; color: rgba(255,255,255,0.85); border: 1.5px solid rgba(255,255,255,0.35); padding: 13px 32px; border-radius: 10px; font-size: 15px; font-weight: 600; cursor: pointer; transition: all 0.2s; text-decoration: none; display: inline-block; }
  .bt1-cta-btn-outline:hover { border-color: rgba(255,255,255,0.8); color: #fff; }

  /* FOOTER — 3 column */
  .bt1-footer { background: ${P.footerBg}; padding: 60px 32px 32px; }
  .bt1-footer-grid { max-width: 1100px; margin: 0 auto 40px; display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 48px; padding-bottom: 40px; border-bottom: 1px solid rgba(255,255,255,0.07); }
  .bt1-footer-logo { display: flex; align-items: center; gap: 10px; font-weight: 800; font-size: 16px; color: #fff; margin-bottom: 12px; }
  .bt1-footer-logo-ico { width: 30px; height: 30px; background: ${P.amber}; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 15px; }
  .bt1-footer-brand-desc { font-size: 13px; color: rgba(255,255,255,0.42); line-height: 1.65; margin-bottom: 20px; max-width: 260px; }
  .bt1-footer-contact-list { display: flex; flex-direction: column; gap: 10px; }
  .bt1-footer-contact-item { font-size: 13px; color: rgba(255,255,255,0.6); text-decoration: none; display: flex; align-items: center; gap: 8px; transition: color 0.2s; }
  .bt1-footer-contact-item:hover { color: ${P.gold}; }
  .bt1-footer-col-title { font-size: 11px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; color: ${P.amber}; margin-bottom: 18px; }
  .bt1-footer-links { display: flex; flex-direction: column; gap: 10px; }
  .bt1-footer-links button { background: none; border: none; text-align: left; font-size: 13px; color: rgba(255,255,255,0.55); cursor: pointer; transition: color 0.2s; padding: 0; }
  .bt1-footer-links button:hover { color: ${P.gold}; }
  .bt1-footer-hours { display: flex; flex-direction: column; gap: 8px; }
  .bt1-footer-hour-row { display: flex; justify-content: space-between; font-size: 12px; padding: 5px 0; border-bottom: 1px solid rgba(255,255,255,0.06); }
  .bt1-footer-hour-row:last-child { border: none; }
  .bt1-footer-hour-row span:first-child { color: rgba(255,255,255,0.45); }
  .bt1-footer-hour-row span:last-child { color: rgba(255,255,255,0.75); font-weight: 600; }
  .bt1-footer-copy { max-width: 1100px; margin: 0 auto; font-size: 12px; color: rgba(255,255,255,0.22); text-align: center; }

  /* RESPONSIVE */
  @container (max-width: 900px) {
    .bt1-desk-links { display: none !important; }
    .bt1-nav-cta { display: none !important; }
    .bt1-burger { display: flex !important; }
    .bt1-hero { grid-template-columns: 1fr !important; min-height: auto !important; }
    .bt1-hero-left { padding: 100px 28px 48px !important; min-height: 60vh !important; }
    .bt1-hero-right { min-height: 45vh !important; padding: 40px 24px !important; }
    .bt1-tab-panel.active { grid-template-columns: 1fr !important; gap: 28px !important; }
    .bt1-tabs { overflow-x: auto !important; -webkit-overflow-scrolling: touch !important; }
    .bt1-stat-strip { grid-template-columns: auto 1fr !important; padding: 32px 28px !important; gap: 24px !important; }
    .bt1-tl-step { grid-template-columns: 1fr !important; }
    .bt1-tl-step .bt1-tl-empty, .bt1-tl-step .bt1-tl-node { display: none !important; }
    .bt1-tl-left, .bt1-tl-right { text-align: left !important; padding: 20px 0 !important; border-left: 3px solid ${P.oliveMid}; padding-left: 20px !important; }
    .bt1-timeline::before { display: none !important; }
    .bt1-footer-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
    .bt1-about-contact { flex-direction: column !important; align-items: center !important; }
    .bt1-cta-btns { flex-direction: column !important; align-items: center !important; }
    .bt1-svc-top { flex-direction: column !important; align-items: flex-start !important; }
    .bt1-testi-hdr { flex-direction: column !important; align-items: flex-start !important; gap: 12px !important; }
    .bt1-testi-hdr p { text-align: left !important; max-width: 100% !important; }
  }
  @container (max-width: 560px) {
    .bt1-hero-left { padding: 90px 20px 40px !important; }
    .bt1-stat-big { font-size: 52px !important; }
    .bt1-stat-strip { padding: 24px 20px !important; gap: 16px !important; }
    .bt1-stat-divider { display: none !important; }
    .bt1-faq { padding: 72px 20px !important; }
    .bt1-about-h2 { font-size: 38px !important; }
    .bt1-testi-card { flex: 0 0 280px !important; }
  }

  /* KEYFRAMES */
  @keyframes bt1-draw  { from { stroke-dashoffset: 600; } to { stroke-dashoffset: 0; } }
  @keyframes bt1-pop   { from { opacity: 0; transform: scale(0.5); } to { opacity: 1; transform: scale(1); } }
  @keyframes bt1-sway  { 0%, 100% { transform: rotate(-1deg); } 50% { transform: rotate(1.5deg); } }
  @keyframes bt1-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
  @keyframes bt1-fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
`;

/* ── Default data ─────────────────────────────────────────────────────────── */
const DEF_SERVICES = [
  { name: 'Lawn Mowing & Edging', price: '$49', per: '/ visit', icon: '🌿', description: 'Precision mowing, clean edge trimming, and thorough cleanup every visit. Your lawn, always at its best.', features: ['Custom height adjustment', 'Edge & border trimming', 'Clipping removal', 'Path & driveway sweep', 'Post-service photo update'] },
  { name: 'Garden Design & Planting', price: '$299', per: '/ project', icon: '🌸', description: 'From concept to planting day — we design gardens that thrive through every season and match your outdoor vision.', features: ['On-site design consultation', 'Seasonal plant selection', 'Native & drought-resistant options', 'Mulching & soil prep', 'Drip irrigation setup'] },
  { name: 'Tree & Hedge Trimming', price: '$149', per: '/ session', icon: '🌳', description: 'Expert pruning for healthier trees, safer branches, and sculpted hedges that define your property beautifully.', features: ['Crown shaping & reduction', 'Dead & diseased wood removal', 'Hedge sculpting & levelling', 'Stump grinding available', 'All debris hauled away'] },
];

const DEF_STATS = [
  { value: '840+', label: 'Happy Clients',     desc: 'Homeowners who trust us with their outdoor spaces season after season.' },
  { value: '12+',  label: 'Years in Business', desc: 'Over a decade serving our local community with award-winning results.' },
  { value: '98%',  label: 'Satisfaction Rate', desc: 'Based on post-service reviews and annual client surveys.' },
  { value: '4.9★', label: 'Average Rating',    desc: 'Five-star reviews from clients who become friends for life.' },
];

const DEF_TESTIMONIALS = [
  { quote: 'Our backyard was completely transformed. We couldn\'t believe the difference after just one season. Truly exceptional work from a team that cares.', name: 'Rachel M.', detail: 'Garden Design Client', stars: 5 },
  { quote: 'They show up on time, every time, without us ever having to follow up. The lawn has genuinely never looked this good in 10 years.', name: 'David L.', detail: 'Weekly Lawn Service', stars: 5 },
  { quote: 'We had a full garden border installed with native plants. Six months later and every single plant is flourishing. Incredible expertise.', name: 'Susan K.', detail: 'Planting Installation', stars: 5 },
  { quote: 'From the free estimate to the last leaf being swept — the whole experience was professional, friendly, and absolutely worth every cent.', name: 'Tom B.', detail: 'Annual Maintenance Plan', stars: 5 },
];

const DEF_FAQS = [
  { q: 'Do I need to be home when you come?', a: 'Not at all. Most of our clients aren\'t home. As long as we can access the yard, we take care of everything and send you a photo report when done.' },
  { q: 'How often do you recommend lawn mowing?', a: 'Weekly during peak growing season (spring and summer), and bi-weekly in autumn. We\'ll recommend the ideal schedule based on your specific grass type.' },
  { q: 'Are your estimates really free with no strings?', a: 'Completely free, no commitment required. We\'ll visit the property, walk through your goals, and provide a detailed written quote within 24 hours.' },
  { q: 'What happens if it rains on my scheduled day?', a: 'We keep a close eye on forecasts and proactively reschedule within 48 hours — at no extra charge. Your service stays consistent no matter what.' },
];

const DEF_PROCESS = [
  { step: '01', emoji: '📋', title: 'Free Consultation', desc: 'We come to you, walk the property, listen to your goals, and put together a fully tailored care plan — free of charge, with zero obligation.' },
  { step: '02', emoji: '🌿', title: 'Scheduled Service Begins', desc: 'Our certified crew arrives on time with professional-grade equipment and treats your space with the same care we\'d give our own.' },
  { step: '03', emoji: '✨', title: 'You Enjoy the Results', desc: 'Receive a photo report after every visit. Relax knowing your outdoor space is always ready to impress.' },
];

const DEF_CERTS = ['ISA Certified Arborist', 'Licensed & Insured', 'Eco-Friendly Products', 'EPA WaterSmart Partner'];
const DEF_AREAS = ['Riverside', 'Oakwood', 'Maplewood', 'Greenfield', 'Stonehaven'];

/* ── Botanical SVG ───────────────────────────────────────────────────────── */
function BotanicalSVG({ visible }: { visible: boolean }) {
  const branches = [
    { d: 'M 180 440 C 178 380 182 300 180 60', len: 400, w: 3.5, color: P.olive,    delay: 0 },
    { d: 'M 180 390 C 148 368 110 345 82 318', len: 120, w: 2,   color: P.oliveMid, delay: 0.5 },
    { d: 'M 180 330 C 214 308 252 282 282 252', len: 130, w: 2,   color: P.oliveMid, delay: 0.65 },
    { d: 'M 180 270 C 145 246 108 220 82 188',  len: 125, w: 2,   color: P.oliveMid, delay: 0.8 },
    { d: 'M 180 210 C 218 188 258 162 290 130', len: 132, w: 2,   color: P.oliveMid, delay: 0.95 },
    { d: 'M 180 155 C 148 130 116 104 92 74',   len: 118, w: 1.5, color: P.oliveMid, delay: 1.1 },
    { d: 'M 180 110 C 216 88 250 62 278 36',    len: 120, w: 1.5, color: P.oliveMid, delay: 1.25 },
  ];

  const leaves = [
    { cx: 82,  cy: 318, rx: 20, ry: 8,  rotate: 145 },
    { cx: 282, cy: 252, rx: 22, ry: 9,  rotate: 45  },
    { cx: 82,  cy: 188, rx: 20, ry: 8,  rotate: 140 },
    { cx: 290, cy: 130, rx: 22, ry: 9,  rotate: 40  },
    { cx: 92,  cy: 74,  rx: 16, ry: 7,  rotate: 148 },
    { cx: 278, cy: 36,  rx: 16, ry: 7,  rotate: 38  },
  ];

  const pods = [
    { cx: 148, cy: 355, r: 6 },
    { cx: 218, cy: 292, r: 5 },
    { cx: 145, cy: 232, r: 6 },
    { cx: 220, cy: 172, r: 5 },
    { cx: 148, cy: 115, r: 5 },
  ];

  return (
    <svg viewBox="0 0 360 480" style={{ width: '100%', maxWidth: '400px', animation: visible ? 'bt1-float 6s ease-in-out 2.5s infinite' : 'none' }}>
      {/* Background circle */}
      <circle cx="180" cy="240" r="175" fill={P.softGreen} opacity="0.35" />
      <circle cx="180" cy="240" r="175" fill="none" stroke={P.oliveMid} strokeWidth="1" strokeDasharray="6 8" opacity="0.25" />
      {/* Branches drawn in sequence */}
      {branches.map((b, i) => (
        <path
          key={i} d={b.d} fill="none" stroke={b.color}
          strokeWidth={b.w} strokeLinecap="round" strokeLinejoin="round"
          style={{
            strokeDasharray: b.len,
            strokeDashoffset: visible ? 0 : b.len,
            transition: visible ? `stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1) ${b.delay}s` : 'none',
          }}
        />
      ))}
      {/* Leaf shapes appearing */}
      {leaves.map((l, i) => (
        <ellipse
          key={i} cx={l.cx} cy={l.cy} rx={l.rx} ry={l.ry}
          fill={P.oliveMid} transform={`rotate(${l.rotate} ${l.cx} ${l.cy})`}
          style={{
            opacity: visible ? 0.75 : 0,
            transition: visible ? `opacity 0.4s ease ${1.2 + i * 0.12}s` : 'none',
          }}
        />
      ))}
      {/* Seed pods */}
      {pods.map((pod, i) => (
        <circle
          key={i} cx={pod.cx} cy={pod.cy} r={pod.r}
          fill={P.amber}
          style={{
            opacity: visible ? 0.7 : 0,
            transition: visible ? `opacity 0.35s ease ${1.6 + i * 0.1}s` : 'none',
          }}
        />
      ))}
      {/* Ground roots hint */}
      <path d="M 180 440 C 155 450 130 455 110 460" fill="none" stroke={P.earth} strokeWidth="2" strokeLinecap="round"
        style={{ opacity: visible ? 0.5 : 0, transition: visible ? 'opacity 0.4s ease 0.3s' : 'none' }} />
      <path d="M 180 440 C 205 450 228 455 248 462" fill="none" stroke={P.earth} strokeWidth="2" strokeLinecap="round"
        style={{ opacity: visible ? 0.5 : 0, transition: visible ? 'opacity 0.4s ease 0.4s' : 'none' }} />
    </svg>
  );
}

/* ── FAQ Row ─────────────────────────────────────────────────────────────── */
function FaqRow({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`bt1-faq-item${open ? ' open' : ''}`}>
      <div className="bt1-faq-q" onClick={() => setOpen(o => !o)}>
        <span className="bt1-faq-q-text">{q}</span>
        <span className="bt1-faq-ico">+</span>
      </div>
      <div className="bt1-faq-a"><p>{a}</p></div>
    </div>
  );
}

/* ── Main Component ──────────────────────────────────────────────────────── */
export default function Landscaper2({ businessData, isPreview }: TemplateProps) {
  const bd = businessData;
  const [menuOpen,  setMenuOpen]  = useState(false);
  const [scrolled,  setScrolled]  = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const heroRef = useRef<HTMLDivElement>(null!);
  const [heroVis, setHeroVis] = useState(false);

  const name     = bd.name          || 'GreenRoots Landscaping';
  const city     = bd.city          || 'Portland';
  const phone    = bd.phone         || '(503) 724-5510';
  const email    = bd.email         || 'hello@greenrootslandscape.com';
  const tagline  = bd.tagline       || 'Landscape & Garden Specialists';
  const services = (bd.services?.length ? bd.services : DEF_SERVICES) as typeof DEF_SERVICES;
  const testis   = bd.testimonials?.length
    ? bd.testimonials.map(t => ({ quote: (t as any).quote || (t as any).text || '', name: t.name, detail: (t as any).detail || (t as any).context || '', stars: (t as any).stars ?? (t as any).rating ?? 5 }))
    : DEF_TESTIMONIALS;
  const faqs     = bd.faq?.length  ? bd.faq  : DEF_FAQS;
  const certs    = bd.certifications?.length ? bd.certifications.map(c => typeof c === 'string' ? c : (c as any).name ?? String(c)) : DEF_CERTS;
  const areas    = bd.serviceAreas?.length   ? bd.serviceAreas.map(a => typeof a === 'string' ? a : String(a)) : DEF_AREAS;
  const hours    = bd.hours || { weekdays: 'Mon – Fri: 7am – 6pm', saturday: 'Sat: 8am – 4pm', sunday: 'Sun: Closed' };
  const stats    = bd.stats?.length
    ? bd.stats.map((s, i) => ({ value: `${s.value}${(s as any).suffix ?? ''}`, label: s.label, desc: DEF_STATS[i]?.desc ?? '' }))
    : DEF_STATS;

  const navCta   = bd.copy?.nav_cta           || 'Free Estimate';
  const heroCta1 = bd.copy?.hero_cta_primary  || 'Get Free Estimate';
  const heroCta2 = bd.copy?.hero_cta_secondary|| 'See Our Work';
  const bookUrl  = phone ? `tel:${phone.replace(/\D/g, '')}` : '#';

  const navItems: [string, string][] = [['Services','services'],['Reviews','reviews'],['About','about'],['FAQ','faq']];
  const scrollTo = (id: string) => { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); setMenuOpen(false); };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const close = () => setMenuOpen(false);
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [menuOpen]);

  useEffect(() => {
    if (!heroRef.current) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setHeroVis(true); obs.disconnect(); } }, { threshold: 0.1 });
    obs.observe(heroRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div className="bt1" data-ec>
      <style suppressHydrationWarning>{STYLES}</style>

      {/* ── NAV ── */}
      <nav className={`bt1-nav${scrolled ? ' scrolled' : ''}`} data-ec>
        <div className="bt1-nav-inner">
          <div className="bt1-logo" onClick={() => scrollTo('hero')}>
            <div className="bt1-logo-ico">🌿</div>
            {name}
          </div>
          <div className="bt1-desk-links">
            {navItems.map(([label, id]) => <button key={id} onClick={() => scrollTo(id)}>{label}</button>)}
          </div>
          <button className="bt1-nav-cta" onClick={() => window.open(bookUrl)}>{navCta}</button>
          <button className={`bt1-burger${menuOpen ? ' open' : ''}`}
            onClick={e => { e.stopPropagation(); setMenuOpen(o => !o); }}>
            <span /><span /><span />
          </button>
        </div>
        {menuOpen && (
          <div className="bt1-mob-menu" onClick={e => e.stopPropagation()}>
            {navItems.map(([label, id]) => <button key={id} onClick={() => scrollTo(id)}>{label}</button>)}
            <a href={bookUrl} className="bt1-mob-cta-link">{navCta}</a>
          </div>
        )}
      </nav>

      {/* ── HERO — vertical split ── */}
      <section id="hero" ref={heroRef}>
        <div className="bt1-hero">
          <div className="bt1-hero-left">
            <div className="bt1-hero-eyebrow">{city} · {tagline}</div>
            <h1 className="bt1-hero-h1">
              Growing <em>Beautiful</em><br />Spaces That Last
            </h1>
            <p className="bt1-hero-sub">
              Professional landscape design and lawn care crafted for homeowners who want results that speak for themselves.
            </p>
            <div className="bt1-hero-btns">
              <button className="bt1-btn-amber" onClick={() => window.open(bookUrl)}>{heroCta1}</button>
              <button className="bt1-btn-ghost-w" onClick={() => scrollTo('services')}>{heroCta2}</button>
            </div>
            <div className="bt1-hero-trust">
              {['Licensed & Insured', 'Free On-Site Estimates', '5-Star Rated Service'].map(t => (
                <div key={t} className="bt1-trust-item"><span className="bt1-trust-dot" />{t}</div>
              ))}
            </div>
          </div>
          <div className="bt1-hero-right">
            <BotanicalSVG visible={heroVis} />
          </div>
        </div>
      </section>

      {/* ── SERVICES — tabbed ── */}
      <section id="services" className="bt1-svc">
        <div className="bt1-svc-top">
          <div className="bt1-svc-hdr">
            <h2>Services We Offer</h2>
            <p>Click a service to see what's included.</p>
          </div>
        </div>
        <div className="bt1-tabs">
          {services.map((svc, i) => (
            <button key={i} className={`bt1-tab${activeTab === i ? ' active' : ''}`} onClick={() => setActiveTab(i)}>
              <span className="bt1-tab-icon">{(svc as typeof DEF_SERVICES[0]).icon ?? '🌿'}</span>
              {svc.name}
            </button>
          ))}
        </div>
        {services.map((svc, i) => (
          <div key={i} className={`bt1-tab-panel${activeTab === i ? ' active' : ''}`}>
            <div className="bt1-panel-left">
              <h3>{svc.name}</h3>
              <p>{svc.description}</p>
              <div className="bt1-panel-price">{svc.price || 'Custom'}<span className="bt1-panel-per"> {(svc as typeof DEF_SERVICES[0]).per ?? '/ visit'}</span></div>
              <button className="bt1-panel-book" onClick={() => window.open(bookUrl)}>Book This Service →</button>
            </div>
            <div className="bt1-panel-right">
              {Array.isArray(svc.features) && svc.features.length > 0 && (
                <ul className="bt1-feat-list">
                  {svc.features.map((f: string, j: number) => (
                    <li key={j} className="bt1-feat-item">
                      <span className="bt1-feat-check">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))}
      </section>

      {/* ── STATS — staggered strips ── */}
      <div className="bt1-stats">
        {stats.map((s, i) => (
          <div key={i} className="bt1-stat-strip">
            <div className="bt1-stat-big">{s.value}</div>
            <div className="bt1-stat-divider" />
            <div>
              <div className="bt1-stat-info-label">{s.label}</div>
              <div className="bt1-stat-info-desc">{s.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── TESTIMONIALS — horizontal scroll ── */}
      <section id="reviews" className="bt1-testi">
        <div className="bt1-testi-hdr">
          <h2>What Our<br />Clients Say</h2>
          <p>Scroll to read more stories →</p>
        </div>
        <div className="bt1-testi-scroll">
          {testis.map((t, i) => (
            <div key={i} className="bt1-testi-card">
              <div className="bt1-testi-stars">
                {Array.from({ length: t.stars }).map((_, j) => <span key={j} className="bt1-testi-star">★</span>)}
              </div>
              <p className="bt1-testi-quote">"{t.quote}"</p>
              <div className="bt1-testi-divider" />
              <div className="bt1-testi-name">{t.name}</div>
              <div className="bt1-testi-detail">{t.detail}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PROCESS — vertical timeline ── */}
      <section className="bt1-process">
        <div className="bt1-process-hdr">
          <div className="bt1-process-eyebrow">HOW IT WORKS</div>
          <h2 className="bt1-process-h2">Simple Process, Stunning Results</h2>
        </div>
        <div className="bt1-timeline">
          {DEF_PROCESS.map((step, i) => {
            const isLeft = i % 2 === 0;
            return (
              <div key={i} className="bt1-tl-step">
                {isLeft ? (
                  <>
                    <div className="bt1-tl-left">
                      <div className="bt1-tl-step-num">{step.step}</div>
                      <div className="bt1-tl-content-title">{step.title}</div>
                      <p className="bt1-tl-content-desc">{step.desc}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <div className="bt1-tl-node">{step.emoji}</div>
                    </div>
                    <div className="bt1-tl-empty" />
                  </>
                ) : (
                  <>
                    <div className="bt1-tl-empty" />
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <div className="bt1-tl-node">{step.emoji}</div>
                    </div>
                    <div className="bt1-tl-right">
                      <div className="bt1-tl-step-num">{step.step}</div>
                      <div className="bt1-tl-content-title">{step.title}</div>
                      <p className="bt1-tl-content-desc">{step.desc}</p>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ── ABOUT — full-bleed warm ── */}
      <section id="about" className="bt1-about">
        <div className="bt1-about-blob1" />
        <div className="bt1-about-blob2" />
        <div className="bt1-about-inner">
          <div className="bt1-about-eyebrow">About {name}</div>
          <h2 className="bt1-about-h2">Rooted in Craft.<br />Grown by Trust.</h2>
          <p className="bt1-about-p">
            We are {name}, {city}'s dedicated landscape and lawn care specialists. Every property we touch gets the full attention of a certified, passionate crew — because great outdoor spaces are built one careful detail at a time.
          </p>
          <div className="bt1-about-chips">
            {[...certs, ...areas.map(a => `📍 ${a}`)].map((chip, i) => (
              <span key={i} className="bt1-about-chip">{chip}</span>
            ))}
          </div>
          <div className="bt1-about-contact">
            {phone && <a href={`tel:${phone.replace(/\D/g,'')}`}>📞 {phone}</a>}
            {email && <a href={`mailto:${email}`}>✉️ {email}</a>}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="bt1-faq">
        <div className="bt1-faq-inner">
          <div className="bt1-faq-hdr">
            <div className="bt1-faq-eyebrow">Common Questions</div>
            <h2 className="bt1-faq-h2">Quick Answers</h2>
          </div>
          <div className="bt1-faq-list">
            {faqs.map((f, i) => <FaqRow key={i} q={f.q} a={f.a} />)}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bt1-cta">
        <div className="bt1-cta-plant">🌿</div>
        <div className="bt1-cta-plant2">🌿</div>
        <div className="bt1-cta-inner">
          <div className="bt1-cta-eyebrow">Let's Get Started</div>
          <h2>Your Best-Looking Yard Starts with One Call</h2>
          <p>Free estimate, no commitment. Just honest advice from people who love what they do.</p>
          <div className="bt1-cta-btns">
            <button className="bt1-cta-btn-a" onClick={() => window.open(bookUrl)}>Get Free Estimate</button>
            <a href={`tel:${phone?.replace(/\D/g,'')}`} className="bt1-cta-btn-outline">📞 {phone}</a>
          </div>
        </div>
      </section>

      {/* ── FOOTER — 3 column ── */}
      <footer className="bt1-footer">
        <div className="bt1-footer-grid">
          <div>
            <div className="bt1-footer-logo">
              <div className="bt1-footer-logo-ico">🌿</div>
              {name}
            </div>
            <p className="bt1-footer-brand-desc">{tagline} — serving {city} and the surrounding region.</p>
            <div className="bt1-footer-contact-list">
              {phone && <a href={`tel:${phone.replace(/\D/g,'')}`} className="bt1-footer-contact-item">📞 {phone}</a>}
              {email && <a href={`mailto:${email}`} className="bt1-footer-contact-item">✉️ {email}</a>}
            </div>
          </div>
          <div>
            <div className="bt1-footer-col-title">Quick Links</div>
            <div className="bt1-footer-links">
              {navItems.map(([label, id]) => <button key={id} onClick={() => scrollTo(id)}>{label}</button>)}
            </div>
          </div>
          <div>
            <div className="bt1-footer-col-title">Hours</div>
            <div className="bt1-footer-hours">
              {[['Weekdays', hours.weekdays], ['Saturday', hours.saturday], ['Sunday', hours.sunday]]
                .filter(([, v]) => v)
                .map(([label, val]) => (
                  <div key={label} className="bt1-footer-hour-row">
                    <span>{label}</span><span>{val}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
        <p className="bt1-footer-copy">© {new Date().getFullYear()} {name}. All rights reserved.</p>
      </footer>
    </div>
  );
}
