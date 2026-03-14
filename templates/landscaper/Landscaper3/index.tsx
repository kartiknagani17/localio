'use client';
import { useEffect, useRef, useState } from 'react';
import type { TemplateProps } from '../../types';

/* ── Palette ─────────────────────────────────────────────────────────────── */
const P = {
  bg:       '#F7FAF4',
  white:    '#FFFFFF',
  charcoal: '#181E17',
  green:    '#3A7830',
  gLight:   '#55994A',
  lime:     '#8CC63F',
  stone:    '#E6E0D6',
  stoneMd:  '#C4BDB3',
  mid:      '#536050',
  soft:     '#EBF2E6',
  dark:     '#131913',
  gold:     '#C8A040',
  footerBg: '#0F1410',
} as const;

/* ── Styles ──────────────────────────────────────────────────────────────── */
const STYLES = `
  .tr1 * { box-sizing: border-box; margin: 0; padding: 0; }
  .tr1 { font-family: 'Inter', system-ui, sans-serif; background: ${P.bg}; color: ${P.dark}; overflow-x: hidden; container-type: inline-size; }

  /* NAV */
  .tr1-nav { position: fixed; top: 0; left: 0; right: 0; z-index: 200; background: rgba(247,250,244,0.96); backdrop-filter: blur(12px); border-bottom: 1px solid rgba(58,120,48,0.08); transition: box-shadow 0.3s; }
  .tr1-nav.scrolled { box-shadow: 0 2px 24px rgba(19,25,19,0.10); }
  .tr1-nav-inner { max-width: 1220px; margin: 0 auto; padding: 0 32px; height: 62px; display: flex; align-items: center; justify-content: space-between; }
  .tr1-logo { display: flex; align-items: center; gap: 10px; font-weight: 800; font-size: 16px; color: ${P.green}; cursor: pointer; user-select: none; }
  .tr1-logo-ico { width: 32px; height: 32px; background: ${P.green}; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 16px; }
  .tr1-desk-links { display: flex; align-items: center; gap: 26px; }
  .tr1-desk-links button { background: none; border: none; font-size: 13px; font-weight: 500; color: ${P.mid}; cursor: pointer; transition: color 0.2s; padding: 0; }
  .tr1-desk-links button:hover { color: ${P.green}; }
  .tr1-nav-cta { background: ${P.lime}; color: ${P.dark}; border: none; padding: 8px 20px; border-radius: 8px; font-size: 13px; font-weight: 800; cursor: pointer; transition: background 0.2s; }
  .tr1-nav-cta:hover { background: ${P.gLight}; color: #fff; }
  .tr1-burger { display: none; flex-direction: column; gap: 5px; background: none; border: none; cursor: pointer; padding: 4px; }
  .tr1-burger span { width: 22px; height: 2px; background: ${P.green}; border-radius: 2px; transition: all 0.28s; display: block; }
  .tr1-burger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
  .tr1-burger.open span:nth-child(2) { opacity: 0; }
  .tr1-burger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }
  .tr1-mob-menu { position: fixed; top: 62px; left: 0; right: 0; background: ${P.bg}; border-bottom: 1px solid rgba(58,120,48,0.1); padding: 12px 24px 24px; z-index: 199; display: flex; flex-direction: column; gap: 2px; box-shadow: 0 10px 28px rgba(19,25,19,0.10); }
  .tr1-mob-menu button { background: none; border: none; text-align: left; padding: 13px 0; font-size: 16px; font-weight: 500; color: ${P.dark}; cursor: pointer; border-bottom: 1px solid rgba(58,120,48,0.07); }
  .tr1-mob-cta-link { display: block; margin-top: 14px; background: ${P.lime}; color: ${P.dark}; text-align: center; padding: 14px; border-radius: 10px; font-weight: 800; font-size: 16px; text-decoration: none; }

  /* HERO — BENTO GRID */
  .tr1-hero-wrap { padding: 80px 24px 24px; min-height: 100vh; display: flex; align-items: center; background: ${P.bg}; }
  .tr1-bento { display: grid; grid-template-columns: 58% 42%; grid-template-rows: 1fr auto; gap: 12px; width: 100%; max-width: 1220px; margin: 0 auto; min-height: 82vh; }
  .tr1-bento-a { background: ${P.white}; border-radius: 24px; padding: 52px 52px; grid-row: 1 / 3; display: flex; flex-direction: column; justify-content: center; border: 1px solid rgba(58,120,48,0.07); }
  .tr1-bento-b { background: ${P.charcoal}; border-radius: 24px; display: flex; align-items: center; justify-content: center; padding: 32px; position: relative; overflow: hidden; }
  .tr1-bento-b::before { content: ''; position: absolute; inset: 0; background: radial-gradient(circle at 50% 50%, rgba(140,198,63,0.08) 0%, transparent 70%); }
  .tr1-bento-c { background: ${P.stone}; border-radius: 24px; padding: 24px 28px; display: flex; align-items: center; gap: 0; }
  .tr1-bento-eyebrow { font-size: 11px; font-weight: 800; letter-spacing: 0.14em; text-transform: uppercase; color: ${P.lime}; margin-bottom: 20px; display: flex; align-items: center; gap: 8px; }
  .tr1-bento-eyebrow::before { content: ''; width: 16px; height: 2px; background: ${P.lime}; display: block; }
  .tr1-bento-h1 { font-size: clamp(38px, 4.5vw, 64px); font-weight: 900; line-height: 1.05; letter-spacing: -0.03em; color: ${P.dark}; margin-bottom: 22px; }
  .tr1-bento-h1 em { font-style: normal; color: ${P.green}; }
  .tr1-bento-sub { font-size: 16px; color: ${P.mid}; line-height: 1.7; margin-bottom: 36px; max-width: 420px; }
  .tr1-bento-btns { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 40px; }
  .tr1-btn-lime { background: ${P.lime}; color: ${P.dark}; border: none; padding: 14px 28px; border-radius: 10px; font-size: 15px; font-weight: 800; cursor: pointer; transition: background 0.2s, transform 0.2s; }
  .tr1-btn-lime:hover { background: ${P.gLight}; color: #fff; transform: translateY(-1px); }
  .tr1-btn-outline { background: none; color: ${P.green}; border: 2px solid ${P.green}; padding: 12px 26px; border-radius: 10px; font-size: 15px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
  .tr1-btn-outline:hover { background: ${P.soft}; }
  .tr1-bento-trust { display: flex; flex-wrap: wrap; gap: 10px; }
  .tr1-trust-chip { display: flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 600; color: ${P.mid}; background: ${P.soft}; border-radius: 100px; padding: 6px 12px; }
  .tr1-trust-chip::before { content: '✓'; color: ${P.lime}; font-weight: 900; }
  .tr1-bento-stat { flex: 1; text-align: center; padding: 0 16px; position: relative; }
  .tr1-bento-stat:not(:last-child)::after { content: ''; position: absolute; right: 0; top: 10%; height: 80%; width: 1px; background: ${P.stoneMd}; }
  .tr1-bento-stat-val { font-size: 30px; font-weight: 900; color: ${P.green}; letter-spacing: -0.02em; display: block; }
  .tr1-bento-stat-lbl { font-size: 11px; color: ${P.mid}; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; margin-top: 2px; display: block; }

  /* TICKER */
  .tr1-ticker { background: ${P.green}; padding: 10px 0; overflow: hidden; }
  .tr1-ticker-track { display: flex; animation: tr1-scroll 26s linear infinite; white-space: nowrap; width: max-content; }
  .tr1-ticker-chip { display: inline-flex; align-items: center; gap: 6px; background: rgba(255,255,255,0.1); border-radius: 100px; padding: 4px 14px; margin: 0 8px; color: rgba(255,255,255,0.9); font-size: 12px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; }
  .tr1-ticker-dot { width: 5px; height: 5px; border-radius: 50%; background: ${P.lime}; }

  /* SERVICES — horizontal scroll snap */
  .tr1-svc { background: ${P.white}; padding: 96px 0; }
  .tr1-svc-hdr { max-width: 1220px; margin: 0 auto 48px; padding: 0 32px; display: flex; align-items: flex-end; justify-content: space-between; gap: 32px; }
  .tr1-eyebrow { font-size: 11px; font-weight: 800; letter-spacing: 0.14em; text-transform: uppercase; color: ${P.lime}; margin-bottom: 8px; }
  .tr1-h2 { font-size: clamp(28px, 3.5vw, 46px); font-weight: 900; color: ${P.dark}; letter-spacing: -0.025em; line-height: 1.12; }
  .tr1-svc-hdr-hint { font-size: 13px; color: ${P.mid}; display: flex; align-items: center; gap: 6px; white-space: nowrap; }
  .tr1-svc-scroll { display: flex; gap: 20px; overflow-x: auto; scroll-snap-type: x mandatory; padding: 0 32px 24px; -webkit-overflow-scrolling: touch; scrollbar-width: none; }
  .tr1-svc-scroll::-webkit-scrollbar { display: none; }
  .tr1-svc-card { flex: 0 0 360px; scroll-snap-align: start; background: ${P.bg}; border-radius: 20px; padding: 36px 32px; border: 1px solid rgba(58,120,48,0.1); transition: transform 0.25s, box-shadow 0.25s; display: flex; flex-direction: column; }
  .tr1-svc-card:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(58,120,48,0.10); }
  .tr1-svc-card-top { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 20px; }
  .tr1-svc-icon { font-size: 40px; }
  .tr1-svc-price-badge { background: ${P.lime}; color: ${P.dark}; font-size: 13px; font-weight: 800; padding: 5px 12px; border-radius: 100px; }
  .tr1-svc-name { font-size: 22px; font-weight: 900; color: ${P.dark}; margin-bottom: 12px; letter-spacing: -0.015em; }
  .tr1-svc-desc { font-size: 14px; color: ${P.mid}; line-height: 1.68; margin-bottom: 20px; flex: 1; }
  .tr1-svc-divider { width: 100%; height: 1px; background: ${P.stone}; margin-bottom: 18px; }
  .tr1-svc-feats { list-style: none; display: flex; flex-direction: column; gap: 8px; margin-bottom: 24px; }
  .tr1-svc-feat { font-size: 13px; color: ${P.mid}; display: flex; align-items: center; gap: 8px; }
  .tr1-svc-feat::before { content: ''; width: 6px; height: 6px; border-radius: 50%; background: ${P.lime}; flex-shrink: 0; }
  .tr1-svc-book { background: ${P.dark}; color: #fff; border: none; padding: 12px 20px; border-radius: 10px; font-size: 13px; font-weight: 700; cursor: pointer; transition: background 0.2s; text-align: center; }
  .tr1-svc-book:hover { background: ${P.green}; }

  /* STATS BAR */
  .tr1-stats { background: ${P.charcoal}; padding: 56px 32px; }
  .tr1-stats-inner { max-width: 1000px; margin: 0 auto; display: grid; grid-template-columns: repeat(4,1fr); }
  .tr1-stat-cell { text-align: center; padding: 16px 12px; position: relative; }
  .tr1-stat-cell:not(:last-child)::after { content: ''; position: absolute; right: 0; top: 20%; height: 60%; width: 1px; background: rgba(255,255,255,0.1); }
  .tr1-stat-num { font-size: 52px; font-weight: 900; color: ${P.white}; letter-spacing: -0.03em; line-height: 1; display: block; }
  .tr1-stat-suf { color: ${P.lime}; }
  .tr1-stat-lbl { font-size: 12px; color: rgba(255,255,255,0.5); font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; margin-top: 6px; display: block; }

  /* GALLERY — conditional */
  .tr1-gallery { background: ${P.bg}; padding: 96px 32px; }
  .tr1-gallery-hdr { max-width: 1220px; margin: 0 auto 40px; }
  .tr1-gallery-grid { max-width: 1220px; margin: 0 auto; display: grid; grid-template-columns: repeat(3, 1fr); grid-auto-rows: 260px; gap: 12px; }
  .tr1-gallery-item { border-radius: 16px; overflow: hidden; background: ${P.stone}; position: relative; }
  .tr1-gallery-item:nth-child(3n+1) { grid-column: span 2; }
  .tr1-gallery-item img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s; }
  .tr1-gallery-item:hover img { transform: scale(1.04); }

  /* WHY US */
  .tr1-why { background: ${P.soft}; padding: 96px 32px; }
  .tr1-why-inner { max-width: 1100px; margin: 0 auto; }
  .tr1-why-hdr { margin-bottom: 56px; max-width: 480px; }
  .tr1-why-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; }
  .tr1-why-card { background: ${P.white}; border-radius: 18px; padding: 32px 28px; transition: transform 0.22s, box-shadow 0.22s; border: 1px solid rgba(58,120,48,0.07); }
  .tr1-why-card:hover { transform: translateY(-4px); box-shadow: 0 12px 36px rgba(58,120,48,0.09); }
  .tr1-why-ico-wrap { width: 56px; height: 56px; border-radius: 14px; background: ${P.soft}; display: flex; align-items: center; justify-content: center; font-size: 26px; margin-bottom: 18px; transition: background 0.2s; }
  .tr1-why-card:hover .tr1-why-ico-wrap { background: ${P.lime}; }
  .tr1-why-title { font-size: 17px; font-weight: 800; color: ${P.dark}; margin-bottom: 8px; }
  .tr1-why-desc { font-size: 13px; color: ${P.mid}; line-height: 1.68; }

  /* TESTIMONIALS — staggered */
  .tr1-testi { background: ${P.white}; padding: 96px 32px; }
  .tr1-testi-inner { max-width: 1100px; margin: 0 auto; }
  .tr1-testi-hdr { margin-bottom: 56px; }
  .tr1-testi-grid { display: flex; gap: 24px; align-items: flex-start; }
  .tr1-testi-card { flex: 1; background: ${P.bg}; border-radius: 20px; padding: 32px 28px; border: 1px solid rgba(58,120,48,0.08); }
  .tr1-testi-card:nth-child(2) { margin-top: 56px; background: ${P.green}; }
  .tr1-testi-card:nth-child(2) .tr1-testi-quote { color: rgba(255,255,255,0.9); }
  .tr1-testi-card:nth-child(2) .tr1-testi-name { color: ${P.lime}; }
  .tr1-testi-card:nth-child(2) .tr1-testi-detail { color: rgba(255,255,255,0.55); }
  .tr1-testi-card:nth-child(2) .tr1-testi-star { color: ${P.gold}; }
  .tr1-testi-stars { display: flex; gap: 3px; margin-bottom: 16px; }
  .tr1-testi-star { color: ${P.gold}; font-size: 14px; }
  .tr1-testi-quote { font-size: 15px; color: ${P.dark}; line-height: 1.72; font-style: italic; margin-bottom: 20px; }
  .tr1-testi-name { font-size: 14px; font-weight: 800; color: ${P.green}; }
  .tr1-testi-detail { font-size: 12px; color: ${P.mid}; margin-top: 3px; }

  /* SERVICE AREAS */
  .tr1-areas { background: ${P.charcoal}; padding: 88px 32px; text-align: center; }
  .tr1-areas-inner { max-width: 800px; margin: 0 auto; }
  .tr1-areas-h2 { font-size: clamp(28px, 3.5vw, 44px); font-weight: 900; color: ${P.white}; letter-spacing: -0.025em; margin-bottom: 14px; }
  .tr1-areas-sub { font-size: 15px; color: rgba(255,255,255,0.55); margin-bottom: 44px; }
  .tr1-areas-pills { display: flex; flex-wrap: wrap; gap: 12px; justify-content: center; }
  .tr1-area-pill { display: flex; align-items: center; gap: 8px; background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.12); color: rgba(255,255,255,0.88); font-size: 14px; font-weight: 600; padding: 10px 20px; border-radius: 100px; transition: all 0.2s; cursor: default; }
  .tr1-area-pill:hover { background: rgba(140,198,63,0.15); border-color: ${P.lime}; color: ${P.lime}; }
  .tr1-area-dot { width: 7px; height: 7px; border-radius: 50%; background: ${P.lime}; animation: tr1-pulse 2.5s ease-in-out infinite; }
  .tr1-area-pill:nth-child(2) .tr1-area-dot { animation-delay: 0.4s; }
  .tr1-area-pill:nth-child(3) .tr1-area-dot { animation-delay: 0.8s; }
  .tr1-area-pill:nth-child(4) .tr1-area-dot { animation-delay: 1.2s; }
  .tr1-area-pill:nth-child(5) .tr1-area-dot { animation-delay: 1.6s; }

  /* ABOUT — bold statement */
  .tr1-about { background: ${P.bg}; padding: 96px 32px; }
  .tr1-about-inner { max-width: 1100px; margin: 0 auto; }
  .tr1-about-statement { font-size: clamp(34px, 5vw, 66px); font-weight: 900; color: ${P.dark}; letter-spacing: -0.03em; line-height: 1.06; margin-bottom: 40px; }
  .tr1-about-statement em { font-style: normal; color: ${P.green}; }
  .tr1-about-rule { width: 100%; height: 1px; background: ${P.stone}; margin-bottom: 40px; }
  .tr1-about-cols { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; }
  .tr1-about-p { font-size: 16px; color: ${P.mid}; line-height: 1.75; }
  .tr1-cert-list { list-style: none; display: flex; flex-direction: column; gap: 12px; }
  .tr1-cert-item { display: flex; align-items: center; gap: 12px; font-size: 15px; font-weight: 600; color: ${P.dark}; }
  .tr1-cert-icon { width: 32px; height: 32px; border-radius: 8px; background: ${P.soft}; border: 1px solid rgba(58,120,48,0.15); display: flex; align-items: center; justify-content: center; font-size: 14px; flex-shrink: 0; }

  /* FAQ — minimal large text */
  .tr1-faq { background: ${P.white}; padding: 96px 32px; }
  .tr1-faq-inner { max-width: 860px; margin: 0 auto; }
  .tr1-faq-hdr { margin-bottom: 52px; }
  .tr1-faq-item { border-bottom: 1px solid ${P.stone}; }
  .tr1-faq-q { display: flex; align-items: baseline; justify-content: space-between; gap: 24px; padding: 26px 0; cursor: pointer; }
  .tr1-faq-q-text { font-size: clamp(16px, 2vw, 22px); font-weight: 700; color: ${P.dark}; line-height: 1.3; transition: color 0.2s; }
  .tr1-faq-item.open .tr1-faq-q-text { color: ${P.green}; }
  .tr1-faq-q-icon { width: 32px; height: 32px; border-radius: 50%; border: 1.5px solid ${P.stoneMd}; display: flex; align-items: center; justify-content: center; font-size: 18px; color: ${P.mid}; flex-shrink: 0; transition: all 0.3s; font-weight: 300; }
  .tr1-faq-item.open .tr1-faq-q-icon { transform: rotate(45deg); border-color: ${P.green}; color: ${P.green}; }
  .tr1-faq-a { max-height: 0; overflow: hidden; transition: max-height 0.38s ease, padding 0.2s; }
  .tr1-faq-item.open .tr1-faq-a { max-height: 200px; padding-bottom: 24px; }
  .tr1-faq-a p { font-size: 15px; color: ${P.mid}; line-height: 1.75; }

  /* CTA — dark charcoal */
  .tr1-cta { background: ${P.charcoal}; padding: 96px 32px; }
  .tr1-cta-inner { max-width: 1100px; margin: 0 auto; display: grid; grid-template-columns: 1fr auto; gap: 64px; align-items: center; }
  .tr1-cta-h2 { font-size: clamp(32px, 4.5vw, 60px); font-weight: 900; color: ${P.white}; letter-spacing: -0.03em; line-height: 1.07; margin-bottom: 10px; }
  .tr1-cta-h2 em { font-style: normal; color: ${P.lime}; }
  .tr1-cta-sub { font-size: 16px; color: rgba(255,255,255,0.5); margin-bottom: 36px; line-height: 1.6; }
  .tr1-cta-btns { display: flex; gap: 14px; flex-wrap: wrap; }
  .tr1-cta-btn-l { background: ${P.lime}; color: ${P.dark}; border: none; padding: 15px 32px; border-radius: 10px; font-size: 15px; font-weight: 800; cursor: pointer; transition: background 0.2s, transform 0.2s; }
  .tr1-cta-btn-l:hover { background: ${P.gLight}; color: #fff; transform: translateY(-1px); }
  .tr1-cta-btn-gh { background: none; color: rgba(255,255,255,0.75); border: 1.5px solid rgba(255,255,255,0.25); padding: 13px 28px; border-radius: 10px; font-size: 15px; font-weight: 600; cursor: pointer; transition: all 0.2s; text-decoration: none; display: inline-flex; align-items: center; }
  .tr1-cta-btn-gh:hover { border-color: rgba(255,255,255,0.6); color: #fff; }
  .tr1-cta-right { display: flex; flex-direction: column; gap: 0; min-width: 220px; }
  .tr1-cta-fact { padding: 20px 0; border-bottom: 1px solid rgba(255,255,255,0.07); }
  .tr1-cta-fact:first-child { padding-top: 0; }
  .tr1-cta-fact:last-child { border-bottom: none; padding-bottom: 0; }
  .tr1-cta-fact-label { font-size: 10px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; color: ${P.lime}; margin-bottom: 4px; }
  .tr1-cta-fact-val { font-size: 15px; font-weight: 700; color: rgba(255,255,255,0.85); }

  /* FOOTER */
  .tr1-footer { background: ${P.footerBg}; padding: 0 32px; }
  .tr1-footer-top { max-width: 1100px; margin: 0 auto; padding: 48px 0 32px; display: flex; align-items: center; justify-content: space-between; gap: 24px; border-bottom: 1px solid rgba(255,255,255,0.06); flex-wrap: wrap; }
  .tr1-footer-logo { display: flex; align-items: center; gap: 10px; font-weight: 800; font-size: 15px; color: #fff; }
  .tr1-footer-logo-ico { width: 28px; height: 28px; background: ${P.lime}; border-radius: 7px; display: flex; align-items: center; justify-content: center; font-size: 14px; }
  .tr1-footer-nav { display: flex; gap: 24px; flex-wrap: wrap; }
  .tr1-footer-nav button { background: none; border: none; font-size: 13px; color: rgba(255,255,255,0.45); cursor: pointer; transition: color 0.2s; padding: 0; }
  .tr1-footer-nav button:hover { color: ${P.lime}; }
  .tr1-footer-bottom { max-width: 1100px; margin: 0 auto; padding: 24px 0; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; }
  .tr1-footer-contact { display: flex; gap: 20px; flex-wrap: wrap; }
  .tr1-footer-contact a { font-size: 13px; color: rgba(255,255,255,0.55); text-decoration: none; transition: color 0.2s; }
  .tr1-footer-contact a:hover { color: ${P.lime}; }
  .tr1-footer-copy { font-size: 12px; color: rgba(255,255,255,0.22); }

  /* RESPONSIVE */
  @container (max-width: 960px) {
    .tr1-desk-links { display: none !important; }
    .tr1-nav-cta { display: none !important; }
    .tr1-burger { display: flex !important; }
    .tr1-bento { grid-template-columns: 1fr !important; grid-template-rows: auto !important; min-height: auto !important; }
    .tr1-bento-a { grid-row: auto !important; padding: 40px 28px !important; }
    .tr1-bento-b { min-height: 280px !important; }
    .tr1-bento-c { flex-wrap: wrap !important; }
    .tr1-bento-stat { flex: 0 0 50% !important; padding: 12px 8px !important; }
    .tr1-svc-card { flex: 0 0 290px !important; }
    .tr1-stats-inner { grid-template-columns: 1fr 1fr !important; }
    .tr1-stat-cell:nth-child(2)::after { display: none !important; }
    .tr1-why-grid { grid-template-columns: 1fr 1fr !important; }
    .tr1-testi-grid { flex-direction: column !important; }
    .tr1-testi-card:nth-child(2) { margin-top: 0 !important; }
    .tr1-about-cols { grid-template-columns: 1fr !important; gap: 32px !important; }
    .tr1-cta-inner { grid-template-columns: 1fr !important; gap: 40px !important; }
    .tr1-cta-right { flex-direction: row !important; flex-wrap: wrap !important; gap: 16px !important; }
    .tr1-cta-fact { border-bottom: none !important; padding: 0 !important; flex: 1 !important; min-width: 160px !important; }
    .tr1-gallery-grid { grid-template-columns: 1fr 1fr !important; }
    .tr1-gallery-item:nth-child(3n+1) { grid-column: span 1 !important; }
    .tr1-footer-top { flex-direction: column !important; align-items: flex-start !important; }
    .tr1-footer-bottom { flex-direction: column !important; align-items: flex-start !important; }
  }
  @container (max-width: 560px) {
    .tr1-hero-wrap { padding: 72px 14px 14px !important; }
    .tr1-bento-a { padding: 28px 22px !important; }
    .tr1-why-grid { grid-template-columns: 1fr !important; }
    .tr1-stats-inner { grid-template-columns: 1fr 1fr !important; }
    .tr1-svc-scroll { padding: 0 16px 20px !important; }
    .tr1-svc-card { flex: 0 0 280px !important; }
    .tr1-gallery-grid { grid-template-columns: 1fr !important; grid-auto-rows: 200px !important; }
    .tr1-gallery-item:nth-child(3n+1) { grid-column: span 1 !important; }
    .tr1-cta-btns { flex-direction: column !important; }
    .tr1-bento-stat-val { font-size: 22px !important; }
    .tr1-areas-pills { gap: 8px !important; }
    .tr1-footer-contact { flex-direction: column !important; gap: 8px !important; }
  }

  /* KEYFRAMES */
  @keyframes tr1-scroll    { from { transform: translateX(0); } to { transform: translateX(-50%); } }
  @keyframes tr1-spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  @keyframes tr1-pulse     { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(1.5); } }
  @keyframes tr1-fadeUp    { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes tr1-pop       { from { opacity: 0; transform: scale(0.85); } to { opacity: 1; transform: scale(1); } }
  .tr1-bento-a { animation: tr1-fadeUp 0.7s ease 0.1s both; }
  .tr1-bento-b { animation: tr1-pop 0.6s ease 0.3s both; }
  .tr1-bento-c { animation: tr1-fadeUp 0.6s ease 0.5s both; }
`;

/* ── Default data ─────────────────────────────────────────────────────────── */
const DEF_SERVICES = [
  { icon: '🌿', name: 'Lawn Mowing & Edging', price: 'From $49', per: '/ visit', description: 'Precision weekly mowing, edge trimming, and full cleanup. Your lawn, always ready to impress.', features: ['Height-adjusted cutting', 'Edge & border trimming', 'Clipping removal', 'Path sweep', 'Photo update'] },
  { icon: '🌸', name: 'Garden Design', price: 'From $299', per: '/ project', description: 'Custom-designed seasonal gardens with native plants, mulching, and drip irrigation for lasting results.', features: ['On-site consultation', 'Seasonal planting', 'Native plant selection', 'Mulch & soil prep', 'Irrigation setup'] },
  { icon: '🌳', name: 'Tree & Hedge Care', price: 'From $149', per: '/ session', description: 'Expert pruning, crown shaping, and hedge sculpting to keep your property safe and beautiful.', features: ['Crown shaping', 'Dead wood removal', 'Hedge sculpting', 'Stump grinding', 'Full debris hauled'] },
  { icon: '🍂', name: 'Seasonal Clean-Up', price: 'From $99', per: '/ visit', description: 'Spring and autumn clean-ups covering leaf removal, bed prep, and getting your yard season-ready.', features: ['Leaf collection & removal', 'Garden bed clean-out', 'Mulch top-up', 'Debris disposal', 'Gutter clearing'] },
];

const DEF_STATS = [
  { value: 840,  suffix: '+',  label: 'Clients Served',   decimal: false },
  { value: 12,   suffix: '+',  label: 'Years Active',      decimal: false },
  { value: 98,   suffix: '%',  label: 'Satisfaction',      decimal: false },
  { value: 4.9,  suffix: '★', label: 'Avg Rating',        decimal: true  },
];

const DEF_TESTIMONIALS = [
  { quote: 'Absolutely incredible work. They turned our neglected backyard into something we\'re genuinely proud of. The attention to detail is unlike anything we\'ve seen.', name: 'Rachel M.', detail: 'Garden Design Client', stars: 5 },
  { quote: 'Reliable, professional, and the lawn looks better than ever. They show up on time every week without fail. 100% recommend to anyone.', name: 'David L.', detail: 'Weekly Lawn Service', stars: 5 },
  { quote: 'Had them install a native plant border last spring. Everything is thriving — they clearly know exactly what they\'re doing. Outstanding.', name: 'Susan K.', detail: 'Planting Installation', stars: 5 },
];

const DEF_FAQS = [
  { q: 'Do I need to be home during your visits?', a: 'Not at all — most of our clients aren\'t home. As long as we have yard access, we take care of everything and send a photo report when done.' },
  { q: 'How often should my lawn be mowed?', a: 'Weekly during spring and summer, bi-weekly in autumn. We\'ll recommend the right schedule based on your grass type and local growing conditions.' },
  { q: 'Are your quotes really free?', a: 'Completely free with zero obligation. We visit your property, listen to your goals, and provide a detailed written quote within 24 hours.' },
  { q: 'What if it rains on my service day?', a: 'We monitor forecasts and reschedule within 48 hours at no extra charge. Your lawn care stays on track regardless of weather.' },
  { q: 'Do you work year-round?', a: 'Yes — we offer seasonal services throughout the year including spring clean-ups, summer maintenance, autumn leaf removal, and winter garden prep.' },
];

const DEF_WHY = [
  { icon: '🏅', title: 'ISA Certified Arborists', desc: 'Our team holds professional certifications ensuring every cut, prune, and plant decision is backed by real expertise.' },
  { icon: '🌱', title: 'Eco-Friendly Methods', desc: 'We use only low-impact, environmentally responsible products and practices on every job.' },
  { icon: '⏰', title: 'On-Time Guarantee', desc: 'We show up when we say we will. Your time matters, and punctuality is non-negotiable for us.' },
  { icon: '📸', title: 'Photo Updates Every Visit', desc: 'We send before & after photos after every single service so you always know what was done.' },
  { icon: '🛡️', title: 'Fully Licensed & Insured', desc: 'Complete liability insurance on every job, protecting your property and giving you peace of mind.' },
  { icon: '💬', title: 'Free Estimates, Always', desc: 'On-site consultations and detailed written quotes — 100% free, no commitment required.' },
];

const DEF_CERTS = ['ISA Certified Arborist', 'Licensed & Insured', 'Eco-Friendly Products', 'EPA WaterSmart Partner'];
const DEF_AREAS = ['Portland', 'Beaverton', 'Lake Oswego', 'Tigard', 'Tualatin', 'Gresham'];

/* ── Hooks ───────────────────────────────────────────────────────────────── */
function useInView(ref: React.RefObject<HTMLElement>, threshold = 0.2) {
  const [vis, setVis] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return vis;
}

function useCounter(target: number, active: boolean, decimal = false) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    const start = performance.now();
    const dur = 1800;
    const tick = (now: number) => {
      const t = Math.min((now - start) / dur, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      setVal(decimal ? parseFloat((ease * target).toFixed(1)) : Math.floor(ease * target));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [active, target]);
  return val;
}

/* ── Leaf Mandala SVG ────────────────────────────────────────────────────── */
function LeafMandala() {
  const count = 8;
  return (
    <svg viewBox="0 0 260 260" style={{ width: '100%', maxWidth: '240px', animation: 'tr1-spin-slow 22s linear infinite' }}>
      {/* Rings */}
      <circle cx="130" cy="130" r="122" fill="none" stroke={P.lime} strokeWidth="0.8" opacity="0.15" />
      <circle cx="130" cy="130" r="96" fill="none" stroke={P.lime} strokeWidth="0.8" opacity="0.18" />
      <circle cx="130" cy="130" r="68" fill="none" stroke={P.lime} strokeWidth="1" opacity="0.22" />
      {/* Leaf petals */}
      {Array.from({ length: count }, (_, i) => {
        const angle = (i * 360 / count) * Math.PI / 180;
        const dist = 72;
        const cx = 130 + Math.cos(angle - Math.PI / 2) * dist;
        const cy = 130 + Math.sin(angle - Math.PI / 2) * dist;
        const rot = i * (360 / count);
        const isMain = i % 2 === 0;
        return (
          <ellipse key={i} cx={cx} cy={cy}
            rx={isMain ? 13 : 9} ry={isMain ? 36 : 26}
            fill={isMain ? P.lime : P.gLight}
            opacity={isMain ? 0.82 : 0.55}
            transform={`rotate(${rot} ${cx} ${cy})`}
          />
        );
      })}
      {/* Center */}
      <circle cx="130" cy="130" r="20" fill={P.lime} />
      <circle cx="130" cy="130" r="10" fill={P.charcoal} />
      <circle cx="130" cy="130" r="4" fill={P.lime} />
    </svg>
  );
}

/* ── Stat Cell ───────────────────────────────────────────────────────────── */
function StatCell({ value, suffix, label, active, decimal }: { value: number; suffix: string; label: string; active: boolean; decimal?: boolean }) {
  const count = useCounter(value, active, decimal);
  return (
    <div className="tr1-stat-cell">
      <span className="tr1-stat-num">{decimal ? count.toFixed(1) : count}<span className="tr1-stat-suf">{suffix}</span></span>
      <span className="tr1-stat-lbl">{label}</span>
    </div>
  );
}

/* ── FAQ Row ─────────────────────────────────────────────────────────────── */
function FaqRow({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`tr1-faq-item${open ? ' open' : ''}`}>
      <div className="tr1-faq-q" onClick={() => setOpen(o => !o)}>
        <span className="tr1-faq-q-text">{q}</span>
        <span className="tr1-faq-q-icon">+</span>
      </div>
      <div className="tr1-faq-a"><p>{a}</p></div>
    </div>
  );
}

/* ── Main Component ──────────────────────────────────────────────────────── */
export default function Landscaper3({ businessData, isPreview }: TemplateProps) {
  const bd = businessData;
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const statsRef = useRef<HTMLDivElement>(null!);
  const statsVis = useInView(statsRef as React.RefObject<HTMLElement>, 0.3);

  const name     = bd.name         || 'Terrain Landscaping Co.';
  const city     = bd.city         || 'Portland';
  const phone    = bd.phone        || '(503) 724-5510';
  const email    = bd.email        || 'hello@terrainlandscaping.com';
  const tagline  = bd.tagline      || 'Landscape & Garden Experts';
  const services = (bd.services?.length ? bd.services : DEF_SERVICES) as typeof DEF_SERVICES;
  const testis   = bd.testimonials?.length
    ? bd.testimonials.map(t => ({ quote: (t as any).quote || (t as any).text || '', name: t.name, detail: (t as any).detail || (t as any).context || '', stars: (t as any).stars ?? (t as any).rating ?? 5 }))
    : DEF_TESTIMONIALS;
  const faqs     = bd.faq?.length ? bd.faq : DEF_FAQS;
  const certs    = bd.certifications?.length ? bd.certifications.map(c => typeof c === 'string' ? c : (c as any).name ?? String(c)) : DEF_CERTS;
  const areas    = bd.serviceAreas?.length ? bd.serviceAreas.map(a => typeof a === 'string' ? a : String(a)) : DEF_AREAS;
  const hours    = bd.hours || { weekdays: 'Mon – Fri: 7am – 6pm', saturday: 'Sat: 8am – 4pm', sunday: 'Sun: Closed' };
  const rawStats = bd.stats?.length ? bd.stats : DEF_STATS;
  const gallery  = Array.isArray(bd.gallery) ? bd.gallery : [];
  const hasGallery = gallery.length > 0;

  const navCta   = bd.copy?.nav_cta           || 'Free Estimate';
  const heroCta1 = bd.copy?.hero_cta_primary  || 'Get Free Estimate';
  const heroCta2 = bd.copy?.hero_cta_secondary|| 'View Services';
  const bookUrl  = phone ? `tel:${phone.replace(/\D/g, '')}` : '#';

  const baseNavItems: [string, string][] = [
    ['Services', 'services'],
    ...(hasGallery ? [['Gallery', 'gallery'] as [string, string]] : []),
    ['Reviews', 'reviews'],
    ['About', 'about'],
    ['FAQ', 'faq'],
  ];

  const scrollTo = (id: string) => { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); setMenuOpen(false); };

  useEffect(() => {
    if (isPreview) { setScrolled(true); return; }
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isPreview]);

  useEffect(() => {
    if (!menuOpen) return;
    const close = () => setMenuOpen(false);
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [menuOpen]);

  return (
    <div className="tr1" data-ec>
      <style suppressHydrationWarning>{STYLES}</style>

      {/* ── NAV ── */}
      <nav className={`tr1-nav${scrolled ? ' scrolled' : ''}`} data-ec>
        <div className="tr1-nav-inner">
          <div className="tr1-logo" onClick={() => scrollTo('hero')}>
            <div className="tr1-logo-ico">🌿</div>
            {name}
          </div>
          <div className="tr1-desk-links">
            {baseNavItems.map(([label, id]) => <button key={id} onClick={() => scrollTo(id)}>{label}</button>)}
          </div>
          <button className="tr1-nav-cta" onClick={() => window.open(bookUrl)}>{navCta}</button>
          <button className={`tr1-burger${menuOpen ? ' open' : ''}`}
            onClick={e => { e.stopPropagation(); setMenuOpen(o => !o); }}>
            <span /><span /><span />
          </button>
        </div>
        {menuOpen && (
          <div className="tr1-mob-menu" onClick={e => e.stopPropagation()}>
            {baseNavItems.map(([label, id]) => <button key={id} onClick={() => scrollTo(id)}>{label}</button>)}
            <a href={bookUrl} className="tr1-mob-cta-link">{navCta}</a>
          </div>
        )}
      </nav>

      {/* ── HERO — BENTO GRID ── */}
      <div id="hero" className="tr1-hero-wrap">
        <div className="tr1-bento">
          {/* A: headline + CTA */}
          <div className="tr1-bento-a">
            <div className="tr1-bento-eyebrow">{city} · {tagline}</div>
            <h1 className="tr1-bento-h1">
              Landscapes That<br /><em>Make an Impression.</em>
            </h1>
            <p className="tr1-bento-sub">
              Professional lawn care and garden design trusted by homeowners across {city}. Every visit, every season — handled with craft and care.
            </p>
            <div className="tr1-bento-btns">
              <button className="tr1-btn-lime" onClick={() => window.open(bookUrl)}>{heroCta1}</button>
              <button className="tr1-btn-outline" onClick={() => scrollTo('services')}>{heroCta2}</button>
            </div>
            <div className="tr1-bento-trust">
              {['Licensed & Insured', 'Free Estimates', '5-Star Rated'].map(t => (
                <span key={t} className="tr1-trust-chip">{t}</span>
              ))}
            </div>
          </div>
          {/* B: rotating leaf mandala on dark bg */}
          <div className="tr1-bento-b">
            <LeafMandala />
          </div>
          {/* C: quick stats strip */}
          <div className="tr1-bento-c">
            {[
              { val: '840+', lbl: 'Happy Clients' },
              { val: '12+',  lbl: 'Years' },
              { val: '98%',  lbl: 'Satisfaction' },
              { val: '4.9★', lbl: 'Rating' },
            ].map((s, i) => (
              <div key={i} className="tr1-bento-stat">
                <span className="tr1-bento-stat-val">{s.val}</span>
                <span className="tr1-bento-stat-lbl">{s.lbl}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── TICKER ── */}
      <div className="tr1-ticker">
        <div className="tr1-ticker-track">
          {['Lawn Mowing', 'Garden Design', 'Tree Trimming', 'Hedge Care', 'Mulching', 'Seasonal Clean-Up', 'Planting', 'Irrigation', 'Lawn Mowing', 'Garden Design', 'Tree Trimming', 'Hedge Care', 'Mulching', 'Seasonal Clean-Up', 'Planting', 'Irrigation'].map((item, i) => (
            <span key={i} className="tr1-ticker-chip">
              <span className="tr1-ticker-dot" />
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ── SERVICES — horizontal scroll ── */}
      <section id="services" className="tr1-svc">
        <div className="tr1-svc-hdr">
          <div>
            <div className="tr1-eyebrow">What We Do</div>
            <h2 className="tr1-h2">Our Services</h2>
          </div>
          <div className="tr1-svc-hdr-hint">Scroll to explore →</div>
        </div>
        <div className="tr1-svc-scroll">
          {services.map((svc, i) => {
            const icons = ['🌿', '🌸', '🌳', '🍂', '💧', '✂️'];
            return (
              <div key={i} className="tr1-svc-card">
                <div className="tr1-svc-card-top">
                  <span className="tr1-svc-icon">{(svc as typeof DEF_SERVICES[0]).icon ?? icons[i % icons.length]}</span>
                  <span className="tr1-svc-price-badge">{svc.price || 'Custom'}</span>
                </div>
                <div className="tr1-svc-name">{svc.name}</div>
                <p className="tr1-svc-desc">{svc.description}</p>
                <div className="tr1-svc-divider" />
                {Array.isArray(svc.features) && svc.features.length > 0 && (
                  <ul className="tr1-svc-feats">
                    {svc.features.slice(0, 4).map((f: string, j: number) => (
                      <li key={j} className="tr1-svc-feat">{f}</li>
                    ))}
                  </ul>
                )}
                <button className="tr1-svc-book" onClick={() => window.open(bookUrl)}>Book This Service</button>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── STATS ── */}
      <div className="tr1-stats" ref={statsRef}>
        <div className="tr1-stats-inner">
          {rawStats.map((s: any, i) => (
            <StatCell key={i}
              value={typeof s.value === 'number' ? s.value : parseFloat(String(s.value))}
              suffix={s.suffix ?? '+'}
              label={s.label}
              active={statsVis}
              decimal={s.decimal || String(s.value).includes('.')}
            />
          ))}
        </div>
      </div>

      {/* ── GALLERY — conditional ── */}
      {hasGallery && (
        <section id="gallery" className="tr1-gallery">
          <div className="tr1-gallery-hdr">
            <div className="tr1-eyebrow">Our Work</div>
            <h2 className="tr1-h2">See the Difference</h2>
          </div>
          <div className="tr1-gallery-grid">
            {gallery.map((img: any, i: number) => {
              const src = typeof img === 'string' ? img : img.url || img.src || '';
              const alt = typeof img === 'object' ? img.alt || img.caption || `Project ${i + 1}` : `Project ${i + 1}`;
              return (
                <div key={i} className="tr1-gallery-item">
                  {src && <img src={src} alt={alt} loading="lazy" />}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ── WHY US ── */}
      <section className="tr1-why">
        <div className="tr1-why-inner">
          <div className="tr1-why-hdr">
            <div className="tr1-eyebrow">Why Choose Us</div>
            <h2 className="tr1-h2">What Sets Us Apart</h2>
          </div>
          <div className="tr1-why-grid">
            {DEF_WHY.map((item, i) => (
              <div key={i} className="tr1-why-card">
                <div className="tr1-why-ico-wrap">{item.icon}</div>
                <div className="tr1-why-title">{item.title}</div>
                <p className="tr1-why-desc">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS — staggered ── */}
      <section id="reviews" className="tr1-testi">
        <div className="tr1-testi-inner">
          <div className="tr1-testi-hdr">
            <div className="tr1-eyebrow">Client Love</div>
            <h2 className="tr1-h2">What Our Clients Say</h2>
          </div>
          <div className="tr1-testi-grid">
            {testis.slice(0, 3).map((t, i) => (
              <div key={i} className="tr1-testi-card">
                <div className="tr1-testi-stars">
                  {Array.from({ length: t.stars ?? 5 }).map((_, j) => <span key={j} className="tr1-testi-star">★</span>)}
                </div>
                <p className="tr1-testi-quote">"{t.quote}"</p>
                <div className="tr1-testi-name">{t.name}</div>
                <div className="tr1-testi-detail">{t.detail}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICE AREAS ── */}
      <section className="tr1-areas">
        <div className="tr1-areas-inner">
          <div className="tr1-eyebrow" style={{ color: P.lime, justifyContent: 'center', display: 'flex' }}>Coverage</div>
          <h2 className="tr1-areas-h2">Where We Work</h2>
          <p className="tr1-areas-sub">Serving {city} and the surrounding region — professional, on-time, every time.</p>
          <div className="tr1-areas-pills">
            {areas.map((a, i) => (
              <div key={i} className="tr1-area-pill">
                <span className="tr1-area-dot" />
                {a}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT — bold statement ── */}
      <section id="about" className="tr1-about">
        <div className="tr1-about-inner">
          <h2 className="tr1-about-statement">
            Trusted by <em>hundreds of homeowners</em><br />since we first picked up a mower.
          </h2>
          <div className="tr1-about-rule" />
          <div className="tr1-about-cols">
            <p className="tr1-about-p">
              We are {name} — {city}'s dedicated lawn care and landscape design specialists. Every job is handled by a certified, experienced crew that treats your property with the same pride and precision we'd bring to our own homes.
              <br /><br />
              From a single mow to a complete garden transformation, we show up on time, communicate clearly, and deliver results that speak for themselves.
            </p>
            <ul className="tr1-cert-list">
              {certs.map((c, i) => (
                <li key={i} className="tr1-cert-item">
                  <span className="tr1-cert-icon">✓</span>
                  {c}
                </li>
              ))}
              {[
                ['Weekdays', hours.weekdays],
                ['Saturday', hours.saturday],
                ['Sunday',   hours.sunday],
              ].filter(([, v]) => v).map(([label, val]) => (
                <li key={label} className="tr1-cert-item" style={{ marginTop: 8 }}>
                  <span className="tr1-cert-icon">🕐</span>
                  <span style={{ fontSize: 14, color: P.mid }}><strong style={{ color: P.dark }}>{label}:</strong> {val}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="tr1-faq">
        <div className="tr1-faq-inner">
          <div className="tr1-faq-hdr">
            <div className="tr1-eyebrow">Questions</div>
            <h2 className="tr1-h2">Common Questions</h2>
          </div>
          {faqs.map((f, i) => <FaqRow key={i} q={f.q} a={f.a} />)}
        </div>
      </section>

      {/* ── CTA — dark charcoal ── */}
      <section className="tr1-cta">
        <div className="tr1-cta-inner">
          <div>
            <h2 className="tr1-cta-h2">Ready for a yard that <em>turns heads?</em></h2>
            <p className="tr1-cta-sub">Free on-site estimate, no commitment. Just honest advice from people who love what they do.</p>
            <div className="tr1-cta-btns">
              <button className="tr1-cta-btn-l" onClick={() => window.open(bookUrl)}>Get Free Estimate</button>
              <a href={`tel:${phone?.replace(/\D/g, '')}`} className="tr1-cta-btn-gh">📞 {phone}</a>
            </div>
          </div>
          <div className="tr1-cta-right">
            {[
              { label: 'Response Time', val: 'Within 24 Hours' },
              { label: 'Service Areas', val: `${city} & Surroundings` },
              { label: 'Quote Cost', val: 'Always Free' },
            ].map((f, i) => (
              <div key={i} className="tr1-cta-fact">
                <div className="tr1-cta-fact-label">{f.label}</div>
                <div className="tr1-cta-fact-val">{f.val}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="tr1-footer">
        <div className="tr1-footer-top">
          <div className="tr1-footer-logo">
            <div className="tr1-footer-logo-ico">🌿</div>
            {name}
          </div>
          <div className="tr1-footer-nav">
            {baseNavItems.map(([label, id]) => <button key={id} onClick={() => scrollTo(id)}>{label}</button>)}
          </div>
        </div>
        <div className="tr1-footer-bottom">
          <div className="tr1-footer-contact">
            {phone && <a href={`tel:${phone.replace(/\D/g, '')}`}>📞 {phone}</a>}
            {email && <a href={`mailto:${email}`}>✉️ {email}</a>}
          </div>
          <span className="tr1-footer-copy">© {new Date().getFullYear()} {name}. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}
