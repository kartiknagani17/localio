'use client';
import { useEffect, useRef, useState } from 'react';
import type { TemplateProps } from '../../types';

/* ── Palette ─────────────────────────────────────────────────────────────── */
const P = {
  cream:    '#F8F6EF',
  paper:    '#EDE8D8',
  green:    '#2A6530',
  gMid:     '#3E8040',
  lime:     '#6BAA26',
  sage:     '#8EBB7D',
  sagePale: '#E8F2DF',
  earth:    '#C4964A',
  dark:     '#1A2E1C',
  mid:      '#456048',
  white:    '#FFFFFF',
  footer:   '#152218',
} as const;

/* ── Styles ──────────────────────────────────────────────────────────────── */
const STYLES = `
  .lg1 * { box-sizing: border-box; margin: 0; padding: 0; }
  .lg1 { font-family: 'Inter', system-ui, sans-serif; background: ${P.cream}; color: ${P.dark}; overflow-x: hidden; container-type: inline-size; }

  /* NAV */
  .lg1-nav { position: fixed; top: 0; left: 0; right: 0; z-index: 200; background: rgba(248,246,239,0.95); backdrop-filter: blur(12px); border-bottom: 1px solid rgba(42,101,48,0.08); transition: box-shadow 0.3s; }
  .lg1-nav.scrolled { box-shadow: 0 2px 20px rgba(26,46,28,0.10); }
  .lg1-nav-inner { max-width: 1200px; margin: 0 auto; padding: 0 32px; height: 64px; display: flex; align-items: center; justify-content: space-between; }
  .lg1-logo { display: flex; align-items: center; gap: 10px; font-weight: 800; font-size: 17px; color: ${P.green}; cursor: pointer; user-select: none; }
  .lg1-logo-ico { width: 34px; height: 34px; background: ${P.green}; border-radius: 9px; display: flex; align-items: center; justify-content: center; font-size: 17px; }
  .lg1-desk-links { display: flex; align-items: center; gap: 30px; }
  .lg1-desk-links button { background: none; border: none; font-size: 14px; font-weight: 500; color: ${P.mid}; cursor: pointer; transition: color 0.2s; padding: 0; }
  .lg1-desk-links button:hover { color: ${P.green}; }
  .lg1-nav-cta { background: ${P.green}; color: #fff; border: none; padding: 9px 20px; border-radius: 8px; font-size: 14px; font-weight: 700; cursor: pointer; transition: background 0.2s; }
  .lg1-nav-cta:hover { background: ${P.gMid}; }
  .lg1-burger { display: none; flex-direction: column; gap: 5px; background: none; border: none; cursor: pointer; padding: 4px; }
  .lg1-burger span { width: 22px; height: 2px; background: ${P.green}; border-radius: 2px; transition: all 0.28s; display: block; }
  .lg1-burger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
  .lg1-burger.open span:nth-child(2) { opacity: 0; }
  .lg1-burger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }
  .lg1-mob-menu { position: fixed; top: 64px; left: 0; right: 0; background: ${P.cream}; border-bottom: 1px solid rgba(42,101,48,0.1); padding: 12px 24px 24px; z-index: 199; display: flex; flex-direction: column; gap: 2px; box-shadow: 0 10px 28px rgba(26,46,28,0.10); }
  .lg1-mob-menu button { background: none; border: none; text-align: left; padding: 13px 0; font-size: 16px; font-weight: 500; color: ${P.dark}; cursor: pointer; border-bottom: 1px solid rgba(42,101,48,0.07); }
  .lg1-mob-cta-link { display: block; margin-top: 14px; background: ${P.green}; color: #fff; text-align: center; padding: 14px; border-radius: 10px; font-weight: 700; font-size: 16px; text-decoration: none; }

  /* HERO — full-width centered, landscape silhouette at bottom */
  .lg1-hero { position: relative; min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 110px 24px 180px; overflow: hidden; background: ${P.cream}; }
  .lg1-hero-leaves { position: absolute; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }
  .lg1-leaf { position: absolute; opacity: 0; animation: lg1-leaf-fall linear infinite; font-size: 20px; }
  .lg1-hero-content { position: relative; z-index: 2; max-width: 780px; margin: 0 auto; }
  .lg1-hero-eyebrow { display: inline-flex; align-items: center; gap: 8px; font-size: 11px; font-weight: 800; letter-spacing: 0.14em; text-transform: uppercase; color: ${P.green}; background: ${P.sagePale}; border: 1px solid ${P.sage}; padding: 6px 16px; border-radius: 100px; margin-bottom: 28px; }
  .lg1-hero-dot { width: 6px; height: 6px; border-radius: 50%; background: ${P.lime}; animation: lg1-pulse 2s ease-in-out infinite; }
  .lg1-hero-h1 { font-size: clamp(44px, 7vw, 88px); font-weight: 900; line-height: 1.02; letter-spacing: -0.03em; color: ${P.dark}; margin-bottom: 22px; }
  .lg1-hero-h1 em { font-style: normal; color: ${P.green}; display: block; }
  .lg1-hero-sub { font-size: 17px; color: ${P.mid}; line-height: 1.7; margin-bottom: 40px; max-width: 520px; margin-left: auto; margin-right: auto; }
  .lg1-hero-btns { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; margin-bottom: 40px; }
  .lg1-btn-g { background: ${P.green}; color: #fff; border: none; padding: 14px 30px; border-radius: 10px; font-size: 15px; font-weight: 700; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; box-shadow: 0 4px 16px rgba(42,101,48,0.28); }
  .lg1-btn-g:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(42,101,48,0.36); }
  .lg1-btn-o { background: transparent; color: ${P.green}; border: 2px solid ${P.green}; padding: 12px 28px; border-radius: 10px; font-size: 15px; font-weight: 600; cursor: pointer; transition: background 0.2s; }
  .lg1-btn-o:hover { background: ${P.sagePale}; }
  .lg1-hero-trust { display: flex; gap: 24px; justify-content: center; flex-wrap: wrap; }
  .lg1-hero-trust span { font-size: 13px; color: ${P.mid}; font-weight: 500; display: flex; align-items: center; gap: 6px; }
  .lg1-hero-trust span::before { content: '✓'; color: ${P.lime}; font-weight: 900; }
  .lg1-landscape { position: absolute; bottom: 0; left: 0; width: 100%; z-index: 1; }

  /* SERVICES — numbered expandable list */
  .lg1-svc-section { background: ${P.white}; padding: 96px 0; }
  .lg1-svc-header-row { max-width: 1100px; margin: 0 auto 56px; padding: 0 32px; display: flex; align-items: flex-end; justify-content: space-between; gap: 24px; }
  .lg1-svc-header-row h2 { font-size: clamp(32px, 4vw, 52px); font-weight: 900; color: ${P.dark}; letter-spacing: -0.03em; line-height: 1.1; }
  .lg1-svc-header-row p { font-size: 14px; color: ${P.mid}; max-width: 280px; line-height: 1.65; text-align: right; }
  .lg1-svc-list { max-width: 1100px; margin: 0 auto; padding: 0 32px; }
  .lg1-svc-row { border-top: 1px solid rgba(42,101,48,0.12); }
  .lg1-svc-row:last-child { border-bottom: 1px solid rgba(42,101,48,0.12); }
  .lg1-svc-trigger { width: 100%; display: grid; grid-template-columns: 64px 1fr auto auto; align-items: center; gap: 24px; padding: 28px 0; cursor: pointer; background: none; border: none; text-align: left; transition: background 0.2s; }
  .lg1-svc-trigger:hover .lg1-svc-title { color: ${P.green}; }
  .lg1-svc-num { font-size: 13px; font-weight: 800; color: ${P.lime}; letter-spacing: 0.08em; }
  .lg1-svc-title { font-size: clamp(20px, 2.5vw, 28px); font-weight: 800; color: ${P.dark}; transition: color 0.2s; }
  .lg1-svc-row.open .lg1-svc-title { color: ${P.green}; }
  .lg1-svc-price-tag { font-size: 18px; font-weight: 900; color: ${P.green}; white-space: nowrap; }
  .lg1-svc-toggle { width: 38px; height: 38px; border-radius: 50%; background: ${P.sagePale}; border: 1.5px solid ${P.sage}; display: flex; align-items: center; justify-content: center; font-size: 20px; color: ${P.green}; transition: all 0.28s; flex-shrink: 0; font-weight: 300; }
  .lg1-svc-row.open .lg1-svc-toggle { background: ${P.green}; color: #fff; border-color: ${P.green}; transform: rotate(45deg); }
  .lg1-svc-detail { overflow: hidden; max-height: 0; transition: max-height 0.4s ease; padding: 0 0 0 88px; }
  .lg1-svc-row.open .lg1-svc-detail { max-height: 320px; }
  .lg1-svc-detail-inner { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; padding-bottom: 36px; }
  .lg1-svc-detail p { font-size: 15px; color: ${P.mid}; line-height: 1.7; }
  .lg1-svc-feat-list { list-style: none; display: flex; flex-direction: column; gap: 8px; }
  .lg1-svc-feat-list li { font-size: 14px; color: ${P.mid}; display: flex; align-items: center; gap: 8px; }
  .lg1-svc-feat-list li::before { content: '—'; color: ${P.lime}; font-weight: 900; flex-shrink: 0; }
  .lg1-svc-book-btn { margin-top: 20px; display: inline-block; background: ${P.green}; color: #fff; border: none; padding: 11px 24px; border-radius: 8px; font-size: 13px; font-weight: 700; cursor: pointer; transition: background 0.2s; }
  .lg1-svc-book-btn:hover { background: ${P.gMid}; }

  /* STATS MARQUEE */
  .lg1-stats-band { background: ${P.sagePale}; border-top: 1px solid rgba(142,187,125,0.3); border-bottom: 1px solid rgba(142,187,125,0.3); padding: 0; overflow: hidden; }
  .lg1-stats-scroll { display: flex; animation: lg1-scroll 28s linear infinite; white-space: nowrap; width: max-content; padding: 28px 0; }
  .lg1-stats-item { display: inline-flex; align-items: baseline; gap: 10px; padding: 0 48px; }
  .lg1-stats-val { font-size: 40px; font-weight: 900; color: ${P.green}; letter-spacing: -0.02em; line-height: 1; }
  .lg1-stats-val em { color: ${P.lime}; font-style: normal; }
  .lg1-stats-lbl { font-size: 13px; font-weight: 600; color: ${P.mid}; text-transform: uppercase; letter-spacing: 0.08em; }
  .lg1-stats-dot { font-size: 24px; color: ${P.sage}; padding: 0 12px; }

  /* TESTIMONIALS — single featured */
  .lg1-testi-section { background: ${P.cream}; padding: 96px 24px; }
  .lg1-testi-inner { max-width: 860px; margin: 0 auto; text-align: center; }
  .lg1-testi-eyebrow { font-size: 11px; font-weight: 800; letter-spacing: 0.14em; text-transform: uppercase; color: ${P.lime}; margin-bottom: 48px; display: flex; align-items: center; gap: 10px; justify-content: center; }
  .lg1-testi-eyebrow::before, .lg1-testi-eyebrow::after { content: ''; flex: 1; max-width: 60px; height: 1px; background: ${P.sage}; display: block; }
  .lg1-big-quote { font-size: 96px; line-height: 0.7; color: ${P.lime}; font-family: Georgia, serif; display: block; margin-bottom: 16px; opacity: 0.5; user-select: none; }
  .lg1-testi-text { font-size: clamp(18px, 2.5vw, 24px); color: ${P.dark}; line-height: 1.6; font-style: italic; font-weight: 400; margin-bottom: 36px; }
  .lg1-testi-stars { display: flex; gap: 4px; justify-content: center; margin-bottom: 20px; }
  .lg1-testi-star { color: ${P.earth}; font-size: 18px; }
  .lg1-testi-name { font-size: 16px; font-weight: 800; color: ${P.green}; }
  .lg1-testi-detail { font-size: 13px; color: ${P.mid}; margin-top: 4px; margin-bottom: 36px; }
  .lg1-testi-dots { display: flex; gap: 10px; justify-content: center; }
  .lg1-testi-dot { width: 10px; height: 10px; border-radius: 50%; background: ${P.sage}; border: none; cursor: pointer; transition: all 0.2s; padding: 0; }
  .lg1-testi-dot.active { background: ${P.green}; transform: scale(1.3); }
  .lg1-testi-nav { display: flex; gap: 12px; justify-content: center; margin-bottom: 28px; }
  .lg1-testi-arrow { width: 44px; height: 44px; border-radius: 50%; border: 1.5px solid ${P.sage}; background: none; cursor: pointer; font-size: 18px; color: ${P.green}; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
  .lg1-testi-arrow:hover { background: ${P.green}; color: #fff; border-color: ${P.green}; }

  /* PROCESS — zigzag alternating */
  .lg1-process { background: ${P.sagePale}; padding: 96px 24px; }
  .lg1-process-inner { max-width: 1000px; margin: 0 auto; }
  .lg1-process-hdr { text-align: center; margin-bottom: 72px; }
  .lg1-process-eyebrow { font-size: 11px; font-weight: 800; letter-spacing: 0.14em; text-transform: uppercase; color: ${P.lime}; margin-bottom: 12px; }
  .lg1-process-h2 { font-size: clamp(28px, 3.5vw, 46px); font-weight: 900; color: ${P.dark}; letter-spacing: -0.025em; }
  .lg1-zz-row { display: grid; grid-template-columns: 1fr 1fr; gap: 0; align-items: center; min-height: 220px; }
  .lg1-zz-row + .lg1-zz-row { border-top: 1px solid rgba(142,187,125,0.25); }
  .lg1-zz-num-side { display: flex; align-items: center; justify-content: center; padding: 40px; }
  .lg1-zz-big-num { font-size: 120px; font-weight: 900; color: ${P.green}; line-height: 1; letter-spacing: -0.04em; opacity: 0.12; user-select: none; }
  .lg1-zz-content-side { padding: 40px; border-left: 1px solid rgba(142,187,125,0.25); }
  .lg1-zz-row.reverse .lg1-zz-num-side { order: 2; }
  .lg1-zz-row.reverse .lg1-zz-content-side { order: 1; border-left: none; border-right: 1px solid rgba(142,187,125,0.25); }
  .lg1-zz-icon { font-size: 40px; margin-bottom: 14px; display: block; }
  .lg1-zz-title { font-size: 22px; font-weight: 800; color: ${P.dark}; margin-bottom: 10px; }
  .lg1-zz-desc { font-size: 14px; color: ${P.mid}; line-height: 1.7; }

  /* ABOUT — split typographic */
  .lg1-about { background: ${P.white}; padding: 96px 32px; }
  .lg1-about-inner { max-width: 1100px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: start; }
  .lg1-about-left { position: sticky; top: 100px; }
  .lg1-about-big-h2 { font-size: clamp(48px, 6vw, 86px); font-weight: 900; line-height: 0.95; letter-spacing: -0.04em; color: ${P.dark}; }
  .lg1-about-big-h2 em { font-style: normal; color: ${P.green}; display: block; }
  .lg1-about-est { display: inline-flex; align-items: center; gap: 8px; margin-top: 24px; font-size: 12px; font-weight: 700; color: ${P.lime}; letter-spacing: 0.1em; text-transform: uppercase; }
  .lg1-about-est::before { content: ''; width: 28px; height: 2px; background: ${P.lime}; display: block; }
  .lg1-about-p { font-size: 15px; color: ${P.mid}; line-height: 1.72; margin-top: 24px; }
  .lg1-about-right { display: flex; flex-direction: column; gap: 20px; }
  .lg1-info-card { background: ${P.cream}; border: 1px solid rgba(142,187,125,0.2); border-radius: 16px; padding: 24px 26px; }
  .lg1-info-card-label { font-size: 10px; font-weight: 800; letter-spacing: 0.14em; text-transform: uppercase; color: ${P.lime}; margin-bottom: 14px; }
  .lg1-cert-tags { display: flex; flex-wrap: wrap; gap: 8px; }
  .lg1-cert-tag { background: ${P.white}; border: 1px solid rgba(142,187,125,0.35); color: ${P.green}; font-size: 12px; font-weight: 600; padding: 5px 12px; border-radius: 100px; }
  .lg1-area-tags { display: flex; flex-wrap: wrap; gap: 8px; }
  .lg1-area-tag { font-size: 13px; color: ${P.mid}; display: flex; align-items: center; gap: 5px; }
  .lg1-hours-list { display: flex; flex-direction: column; gap: 6px; }
  .lg1-hours-row { display: flex; justify-content: space-between; font-size: 13px; padding: 5px 0; border-bottom: 1px dashed rgba(142,187,125,0.2); }
  .lg1-hours-row:last-child { border: none; }
  .lg1-hours-row span:first-child { color: ${P.mid}; }
  .lg1-hours-row span:last-child { color: ${P.green}; font-weight: 700; }

  /* FAQ — two panel */
  .lg1-faq { background: ${P.cream}; padding: 96px 32px; }
  .lg1-faq-inner { max-width: 1100px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 0; border: 1px solid rgba(142,187,125,0.2); border-radius: 20px; overflow: hidden; }
  .lg1-faq-left { border-right: 1px solid rgba(142,187,125,0.2); }
  .lg1-faq-hdr { padding: 28px 32px; border-bottom: 1px solid rgba(142,187,125,0.15); background: ${P.white}; }
  .lg1-faq-hdr p { font-size: 11px; font-weight: 800; letter-spacing: 0.14em; text-transform: uppercase; color: ${P.lime}; margin-bottom: 6px; }
  .lg1-faq-hdr h2 { font-size: clamp(22px, 2.5vw, 32px); font-weight: 900; color: ${P.dark}; letter-spacing: -0.02em; }
  .lg1-faq-q-list { }
  .lg1-faq-q-item { display: grid; grid-template-columns: 40px 1fr 28px; align-items: center; gap: 12px; padding: 20px 32px; cursor: pointer; transition: background 0.18s; border-bottom: 1px solid rgba(142,187,125,0.12); }
  .lg1-faq-q-item:last-child { border-bottom: none; }
  .lg1-faq-q-item:hover { background: ${P.sagePale}; }
  .lg1-faq-q-item.active { background: ${P.sagePale}; }
  .lg1-faq-q-num { font-size: 12px; font-weight: 800; color: ${P.lime}; letter-spacing: 0.06em; }
  .lg1-faq-q-text { font-size: 14px; font-weight: 600; color: ${P.dark}; line-height: 1.4; }
  .lg1-faq-q-item.active .lg1-faq-q-text { color: ${P.green}; }
  .lg1-faq-q-arrow { font-size: 16px; color: ${P.sage}; }
  .lg1-faq-q-item.active .lg1-faq-q-arrow { color: ${P.green}; }
  .lg1-faq-right { background: ${P.white}; display: flex; align-items: center; }
  .lg1-faq-answer { padding: 48px 40px; }
  .lg1-faq-a-q { font-size: 11px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; color: ${P.lime}; margin-bottom: 20px; }
  .lg1-faq-a-text { font-size: 20px; font-weight: 800; color: ${P.dark}; line-height: 1.4; margin-bottom: 20px; }
  .lg1-faq-a-body { font-size: 15px; color: ${P.mid}; line-height: 1.72; }

  /* CTA — asymmetric */
  .lg1-cta { background: ${P.green}; padding: 96px 32px; position: relative; overflow: hidden; }
  .lg1-cta-deco { position: absolute; right: -40px; top: 50%; transform: translateY(-50%); font-size: 300px; opacity: 0.06; user-select: none; pointer-events: none; line-height: 1; }
  .lg1-cta-inner { max-width: 1100px; margin: 0 auto; display: grid; grid-template-columns: 1fr auto; gap: 64px; align-items: center; position: relative; z-index: 1; }
  .lg1-cta-left h2 { font-size: clamp(32px, 4.5vw, 60px); font-weight: 900; color: ${P.white}; letter-spacing: -0.03em; line-height: 1.07; margin-bottom: 28px; }
  .lg1-cta-left h2 em { font-style: normal; color: ${P.lime}; }
  .lg1-cta-btn-wrap { display: flex; gap: 14px; flex-wrap: wrap; }
  .lg1-cta-btn-w { background: #fff; color: ${P.green}; border: none; padding: 14px 30px; border-radius: 10px; font-size: 15px; font-weight: 800; cursor: pointer; transition: transform 0.2s; }
  .lg1-cta-btn-w:hover { transform: translateY(-2px); }
  .lg1-cta-btn-ghost { background: none; color: rgba(255,255,255,0.85); border: 1.5px solid rgba(255,255,255,0.4); padding: 13px 28px; border-radius: 10px; font-size: 15px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
  .lg1-cta-btn-ghost:hover { border-color: #fff; color: #fff; }
  .lg1-cta-right { display: flex; flex-direction: column; gap: 16px; min-width: 240px; }
  .lg1-contact-card { background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); border-radius: 14px; padding: 20px 24px; }
  .lg1-contact-card-label { font-size: 10px; font-weight: 800; color: ${P.lime}; letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 6px; }
  .lg1-contact-card-val { font-size: 16px; font-weight: 700; color: #fff; }

  /* FOOTER — minimal strip */
  .lg1-footer { background: ${P.footer}; padding: 28px 32px; }
  .lg1-footer-strip { max-width: 1100px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; }
  .lg1-footer-brand { display: flex; align-items: center; gap: 10px; font-weight: 800; font-size: 15px; color: rgba(255,255,255,0.9); }
  .lg1-footer-brand-ico { width: 28px; height: 28px; background: ${P.lime}; border-radius: 7px; display: flex; align-items: center; justify-content: center; font-size: 14px; }
  .lg1-footer-right { display: flex; align-items: center; gap: 24px; flex-wrap: wrap; }
  .lg1-footer-right a { font-size: 13px; color: rgba(255,255,255,0.5); text-decoration: none; transition: color 0.2s; }
  .lg1-footer-right a:hover { color: ${P.lime}; }
  .lg1-footer-copy { font-size: 13px; color: rgba(255,255,255,0.28); }

  /* RESPONSIVE */
  @container (max-width: 900px) {
    .lg1-desk-links { display: none !important; }
    .lg1-nav-cta { display: none !important; }
    .lg1-burger { display: flex !important; }
    .lg1-svc-header-row { flex-direction: column !important; align-items: flex-start !important; }
    .lg1-svc-header-row p { text-align: left !important; max-width: 100% !important; }
    .lg1-svc-trigger { grid-template-columns: 48px 1fr auto !important; }
    .lg1-svc-price-tag { display: none !important; }
    .lg1-svc-detail { padding-left: 0 !important; }
    .lg1-svc-detail-inner { grid-template-columns: 1fr !important; }
    .lg1-zz-row { grid-template-columns: 1fr !important; }
    .lg1-zz-num-side { display: none !important; }
    .lg1-zz-row.reverse .lg1-zz-content-side { order: 0 !important; border-right: none !important; }
    .lg1-zz-content-side { border-left: none !important; border-top: 1px solid rgba(142,187,125,0.2) !important; }
    .lg1-about-inner { grid-template-columns: 1fr !important; gap: 40px !important; }
    .lg1-about-left { position: static !important; }
    .lg1-faq-inner { grid-template-columns: 1fr !important; border-radius: 14px !important; }
    .lg1-faq-left { border-right: none !important; border-bottom: 1px solid rgba(142,187,125,0.2) !important; }
    .lg1-faq-right { display: none !important; }
    .lg1-faq-q-item { grid-template-columns: 36px 1fr 24px !important; padding: 18px 20px !important; }
    .lg1-cta-inner { grid-template-columns: 1fr !important; gap: 36px !important; }
    .lg1-cta-right { flex-direction: row !important; flex-wrap: wrap !important; min-width: unset !important; }
    .lg1-contact-card { flex: 1 !important; min-width: 180px !important; }
    .lg1-footer-strip { flex-direction: column !important; align-items: center !important; text-align: center !important; }
    .lg1-footer-right { justify-content: center !important; }
  }
  @container (max-width: 560px) {
    .lg1-hero { padding-bottom: 200px !important; }
    .lg1-hero-btns { flex-direction: column !important; align-items: stretch !important; }
    .lg1-hero-btns button { text-align: center !important; }
    .lg1-svc-section, .lg1-testi-section, .lg1-process, .lg1-about, .lg1-faq, .lg1-cta { padding-left: 20px !important; padding-right: 20px !important; }
    .lg1-svc-list, .lg1-svc-header-row { padding: 0 20px !important; }
    .lg1-big-quote { font-size: 64px !important; }
    .lg1-about-big-h2 { font-size: 52px !important; }
    .lg1-cta-right { flex-direction: column !important; }
  }
  @container (min-width: 1280px) {
    .lg1-hero-h1 { font-size: 96px !important; }
  }

  /* KEYFRAMES */
  @keyframes lg1-scroll    { from { transform: translateX(0); } to { transform: translateX(-50%); } }
  @keyframes lg1-pulse     { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.6; transform: scale(1.4); } }
  @keyframes lg1-leaf-fall { 0% { transform: translateY(-50px) translateX(0) rotate(0deg); opacity: 0; } 6% { opacity: 0.75; } 90% { opacity: 0.35; } 100% { transform: translateY(110vh) translateX(60px) rotate(420deg); opacity: 0; } }
  @keyframes lg1-fade-ans  { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
  .lg1-faq-answer { animation: lg1-fade-ans 0.3s ease; }
`;

/* ── Default data ─────────────────────────────────────────────────────────── */
const DEF_SERVICES = [
  { name: 'Lawn Mowing & Edging', price: '$49', per: '/ visit', description: 'Weekly or bi-weekly mowing, trimming, and precise edging. Every visit leaves your lawn looking magazine-ready.', features: ['Height-adjusted cutting', 'Clean edge trimming', 'Clippings removed', 'Paths swept clean'] },
  { name: 'Garden Design & Planting', price: '$299', per: '/ project', description: 'Custom garden plans using seasonal flowers, native shrubs, and perennials chosen for your soil, light, and style.', features: ['On-site consultation', 'Seasonal planting', 'Mulching & soil prep', 'Irrigation setup'] },
  { name: 'Tree & Hedge Trimming', price: '$149', per: '/ session', description: 'Expert pruning that shapes your trees and hedges for maximum health, safety, and visual impact.', features: ['Crown shaping', 'Dead wood removal', 'Hedge sculpting', 'Full debris hauled away'] },
];

const DEF_STATS = [
  { value: '840+', label: 'Happy Clients' },
  { value: '12+',  label: 'Years Experience' },
  { value: '98%',  label: 'Satisfaction Rate' },
  { value: '4.9★', label: 'Average Rating' },
];

const DEF_TESTIMONIALS = [
  { quote: 'Our backyard went from a wild mess to an absolute showstopper. They listened to every detail and delivered results we could have only dreamed of.', name: 'Rachel M.', detail: 'Garden Design Client', stars: 5 },
  { quote: 'Reliable, professional, and our lawn has never looked better. They show up on time every single week. Best service we\'ve found in years.', name: 'David L.', detail: 'Weekly Lawn Service', stars: 5 },
  { quote: 'They installed a full garden border with native plants. Six months later, everything is thriving beautifully. The work speaks for itself.', name: 'Susan K.', detail: 'Planting Installation', stars: 5 },
];

const DEF_FAQS = [
  { q: 'Do I need to be home during service?', a: 'Not at all — most of our clients aren\'t home during visits. As long as we have yard access, we handle everything and send a photo update when done.' },
  { q: 'How often should my lawn be mowed?', a: 'During spring and summer we recommend weekly or bi-weekly mowing. We\'ll suggest the right schedule for your grass type and local climate.' },
  { q: 'Are your estimates really free?', a: 'Yes, completely free with no obligation. We\'ll walk the property and provide a detailed written quote within 24 hours of visiting.' },
  { q: 'What if it rains on my service day?', a: 'We monitor weather and reschedule within 48 hours at no extra charge. Your lawn care never falls behind because of the weather.' },
];

const DEF_PROCESS = [
  { step: '01', emoji: '📋', title: 'Free Consultation', desc: 'We visit your property, listen to your goals, and build a customized care plan at zero cost and zero commitment.' },
  { step: '02', emoji: '🌱', title: 'We Get to Work', desc: 'Our certified crew arrives on schedule with professional equipment. We treat every property like it\'s our own.' },
  { step: '03', emoji: '✨', title: 'Relax & Enjoy', desc: 'Get photo updates after every visit, ongoing care on your schedule, and a yard that turns heads year-round.' },
];

const DEF_CERTS = ['ISA Certified Arborist', 'Licensed & Insured', 'Eco-Friendly Products', 'EPA WaterSmart'];
const DEF_AREAS = ['Riverside', 'Oakwood', 'Maplewood', 'Greenfield', 'Stonehaven'];

/* ── Landscape Silhouette ───────────────────────────────────────────────── */
function LandscapeSVG() {
  return (
    <svg className="lg1-landscape" viewBox="0 0 1440 200" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
      {/* Back hill layer */}
      <path d="M0 200 L0 160 Q200 60 400 110 Q600 160 800 80 Q1000 0 1200 60 Q1360 110 1440 70 L1440 200 Z" fill={P.sagePale} />
      {/* Pine trees - back row */}
      <polygon points="290,130 304,80 318,130" fill={P.gMid} opacity="0.35" />
      <polygon points="295,110 304,75 313,110" fill={P.gMid} opacity="0.35" />
      <polygon points="610,100 626,44 642,100" fill={P.green} opacity="0.3" />
      <polygon points="615,82 626,40 637,82" fill={P.green} opacity="0.3" />
      <polygon points="990,70 1006,15 1022,70" fill={P.gMid} opacity="0.3" />
      <polygon points="995,52 1006,11 1017,52" fill={P.gMid} opacity="0.3" />
      <polygon points="1270,75 1286,22 1302,75" fill={P.green} opacity="0.25" />
      {/* Mid hill layer */}
      <path d="M0 200 L0 175 Q300 120 600 158 Q900 196 1150 140 Q1320 100 1440 150 L1440 200 Z" fill={P.sage} opacity="0.6" />
      {/* Pine trees - front row */}
      <polygon points="160,175 176,118 192,175" fill={P.green} opacity="0.55" />
      <polygon points="165,155 176,113 187,155" fill={P.green} opacity="0.55" />
      <polygon points="480,165 498,100 516,165" fill={P.gMid} opacity="0.6" />
      <polygon points="485,143 498,96 511,143" fill={P.gMid} opacity="0.6" />
      <polygon points="820,165 838,104 856,165" fill={P.green} opacity="0.55" />
      <polygon points="825,146 838,100 851,146" fill={P.green} opacity="0.55" />
      <polygon points="1100,148 1118,90 1136,148" fill={P.gMid} opacity="0.5" />
      <polygon points="1105,128 1118,86 1131,128" fill={P.gMid} opacity="0.5" />
      <polygon points="1340,160 1358,100 1376,160" fill={P.green} opacity="0.45" />
      {/* Front ground strip */}
      <path d="M0 200 L0 192 Q360 178 720 194 Q1080 210 1440 188 L1440 200 Z" fill={P.sage} />
    </svg>
  );
}

/* ── Falling Leaves ──────────────────────────────────────────────────────── */
function HeroLeaves() {
  const leaves = [
    { left: '5%',  delay: '0s',   dur: '8s'  },
    { left: '15%', delay: '2.2s', dur: '10s' },
    { left: '28%', delay: '0.8s', dur: '9s'  },
    { left: '42%', delay: '3.5s', dur: '11s' },
    { left: '58%', delay: '1.4s', dur: '8.5s'},
    { left: '71%', delay: '4.1s', dur: '10s' },
    { left: '83%', delay: '0.3s', dur: '9.5s'},
    { left: '93%', delay: '2.8s', dur: '12s' },
  ];
  return (
    <div className="lg1-hero-leaves">
      {leaves.map((l, i) => (
        <div key={i} className="lg1-leaf"
          style={{ left: l.left, top: '-30px', animationDelay: l.delay, animationDuration: l.dur }}>
          🍃
        </div>
      ))}
    </div>
  );
}

/* ── Main Component ──────────────────────────────────────────────────────── */
export default function Landscaper1({ businessData, isPreview }: TemplateProps) {
  const bd = businessData;
  const [menuOpen,   setMenuOpen]   = useState(false);
  const [scrolled,   setScrolled]   = useState(false);
  const [openSvc,    setOpenSvc]    = useState<number | null>(0);
  const [activeTesti,setActiveTesti]= useState(0);
  const [activeFaq,  setActiveFaq]  = useState(0);

  const name     = bd.name          || 'GreenCraft Landscaping';
  const city     = bd.city          || 'Austin';
  const phone    = bd.phone         || '(512) 867-4320';
  const email    = bd.email         || 'hello@greencraftlandscaping.com';
  const tagline  = bd.tagline       || 'Premium Lawn & Garden Care';
  const services = (bd.services?.length ? bd.services : DEF_SERVICES) as typeof DEF_SERVICES;
  const testis   = bd.testimonials?.length
    ? bd.testimonials.map(t => ({ quote: (t as any).quote || (t as any).text || '', name: t.name, detail: (t as any).detail || (t as any).context || '', stars: (t as any).stars ?? (t as any).rating ?? 5 }))
    : DEF_TESTIMONIALS;
  const faqs     = bd.faq?.length        ? bd.faq     : DEF_FAQS;
  const certs    = bd.certifications?.length ? bd.certifications.map(c => typeof c === 'string' ? c : (c as any).name ?? String(c)) : DEF_CERTS;
  const areas    = bd.serviceAreas?.length   ? bd.serviceAreas.map(a => typeof a === 'string' ? a : String(a)) : DEF_AREAS;
  const hours    = bd.hours || { weekdays: 'Mon – Fri: 7am – 6pm', saturday: 'Sat: 8am – 4pm', sunday: 'Sun: Closed' };
  const stats    = bd.stats?.length
    ? bd.stats.map(s => ({ value: `${s.value}${(s as any).suffix ?? ''}`, label: s.label }))
    : DEF_STATS;

  const navCta   = bd.copy?.nav_cta           || 'Get Free Quote';
  const heroCta1 = bd.copy?.hero_cta_primary  || 'Get Free Estimate';
  const heroCta2 = bd.copy?.hero_cta_secondary|| 'Our Services';
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

  return (
    <div className="lg1" data-ec>
      <style suppressHydrationWarning>{STYLES}</style>

      {/* ── NAV ── */}
      <nav className={`lg1-nav${scrolled ? ' scrolled' : ''}`} data-ec>
        <div className="lg1-nav-inner">
          <div className="lg1-logo" onClick={() => scrollTo('hero')}>
            <div className="lg1-logo-ico">🌿</div>
            {name}
          </div>
          <div className="lg1-desk-links">
            {navItems.map(([label, id]) => <button key={id} onClick={() => scrollTo(id)}>{label}</button>)}
          </div>
          <button className="lg1-nav-cta" onClick={() => window.open(bookUrl)}>{navCta}</button>
          <button className={`lg1-burger${menuOpen ? ' open' : ''}`}
            onClick={e => { e.stopPropagation(); setMenuOpen(o => !o); }}>
            <span /><span /><span />
          </button>
        </div>
        {menuOpen && (
          <div className="lg1-mob-menu" onClick={e => e.stopPropagation()}>
            {navItems.map(([label, id]) => <button key={id} onClick={() => scrollTo(id)}>{label}</button>)}
            <a href={bookUrl} className="lg1-mob-cta-link">{navCta}</a>
          </div>
        )}
      </nav>

      {/* ── HERO — full-width centered with landscape silhouette ── */}
      <section id="hero" className="lg1-hero">
        <HeroLeaves />
        <div className="lg1-hero-content">
          <div className="lg1-hero-eyebrow">
            <span className="lg1-hero-dot" />
            {city} · {tagline}
          </div>
          <h1 className="lg1-hero-h1">
            Your Garden,
            <em>Elevated.</em>
          </h1>
          <p className="lg1-hero-sub">
            Professional lawn care and landscape design trusted by {stats[0]?.value.replace(/\D/g,'') || '840'}+ homeowners across {city}. Beauty you'll come home to.
          </p>
          <div className="lg1-hero-btns">
            <button className="lg1-btn-g" onClick={() => window.open(bookUrl)}>{heroCta1}</button>
            <button className="lg1-btn-o" onClick={() => scrollTo('services')}>{heroCta2}</button>
          </div>
          <div className="lg1-hero-trust">
            {['Licensed & Insured', 'Free Estimates', '5-Star Rated'].map(t => <span key={t}>{t}</span>)}
          </div>
        </div>
        <LandscapeSVG />
      </section>

      {/* ── SERVICES — numbered expandable list ── */}
      <section id="services" className="lg1-svc-section">
        <div className="lg1-svc-header-row">
          <h2>What We<br />Take Care Of</h2>
          <p>Every service performed by certified professionals using premium, eco-friendly products.</p>
        </div>
        <div className="lg1-svc-list">
          {services.map((svc, i) => (
            <div key={i} className={`lg1-svc-row${openSvc === i ? ' open' : ''}`}>
              <button className="lg1-svc-trigger" onClick={() => setOpenSvc(openSvc === i ? null : i)}>
                <span className="lg1-svc-num">{String(i + 1).padStart(2, '0')}</span>
                <span className="lg1-svc-title">{svc.name}</span>
                <span className="lg1-svc-price-tag">{svc.price || 'Get Quote'}</span>
                <span className="lg1-svc-toggle">+</span>
              </button>
              <div className="lg1-svc-detail">
                <div className="lg1-svc-detail-inner">
                  <div>
                    <p>{svc.description}</p>
                    <button className="lg1-svc-book-btn" onClick={() => window.open(bookUrl)}>Book This Service →</button>
                  </div>
                  {Array.isArray(svc.features) && svc.features.length > 0 && (
                    <ul className="lg1-svc-feat-list">
                      {svc.features.slice(0, 5).map((f: string, j: number) => <li key={j}>{f}</li>)}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── STATS MARQUEE ── */}
      <div className="lg1-stats-band">
        <div className="lg1-stats-scroll">
          {[...stats, ...stats].map((s, i) => (
            <span key={i} className="lg1-stats-item">
              <span className="lg1-stats-val">{s.value}</span>
              <span className="lg1-stats-lbl">{s.label}</span>
              <span className="lg1-stats-dot">·</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── TESTIMONIALS — single featured ── */}
      <section id="reviews" className="lg1-testi-section">
        <div className="lg1-testi-inner">
          <div className="lg1-testi-eyebrow">Client Love</div>
          <span className="lg1-big-quote">"</span>
          <p className="lg1-testi-text">{testis[activeTesti]?.quote}</p>
          <div className="lg1-testi-stars">
            {Array.from({ length: testis[activeTesti]?.stars ?? 5 }).map((_, j) => (
              <span key={j} className="lg1-testi-star">★</span>
            ))}
          </div>
          <div className="lg1-testi-name">{testis[activeTesti]?.name}</div>
          <div className="lg1-testi-detail">{testis[activeTesti]?.detail}</div>
          <div className="lg1-testi-nav">
            <button className="lg1-testi-arrow" onClick={() => setActiveTesti(t => (t - 1 + testis.length) % testis.length)}>←</button>
            <button className="lg1-testi-arrow" onClick={() => setActiveTesti(t => (t + 1) % testis.length)}>→</button>
          </div>
          <div className="lg1-testi-dots">
            {testis.map((_, i) => (
              <button key={i} className={`lg1-testi-dot${i === activeTesti ? ' active' : ''}`} onClick={() => setActiveTesti(i)} />
            ))}
          </div>
        </div>
      </section>

      {/* ── PROCESS — zigzag alternating ── */}
      <section className="lg1-process">
        <div className="lg1-process-inner">
          <div className="lg1-process-hdr">
            <p className="lg1-process-eyebrow">HOW IT WORKS</p>
            <h2 className="lg1-process-h2">From Call to Curb Appeal</h2>
          </div>
          {DEF_PROCESS.map((step, i) => (
            <div key={i} className={`lg1-zz-row${i % 2 === 1 ? ' reverse' : ''}`}>
              <div className="lg1-zz-num-side">
                <span className="lg1-zz-big-num">{step.step}</span>
              </div>
              <div className="lg1-zz-content-side">
                <span className="lg1-zz-icon">{step.emoji}</span>
                <div className="lg1-zz-title">{step.title}</div>
                <p className="lg1-zz-desc">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── ABOUT — split typographic ── */}
      <section id="about" className="lg1-about">
        <div className="lg1-about-inner">
          <div className="lg1-about-left">
            <h2 className="lg1-about-big-h2">
              Precision<br />in every<br /><em>blade.</em>
            </h2>
            <div className="lg1-about-est">Est. 2012</div>
            <p className="lg1-about-p">
              We are {name}, {city}'s trusted landscaping specialists. Professional-grade equipment, genuine love for the outdoors, and an obsessive attention to detail — in every single job.
            </p>
          </div>
          <div className="lg1-about-right">
            {certs.length > 0 && (
              <div className="lg1-info-card">
                <div className="lg1-info-card-label">Certifications</div>
                <div className="lg1-cert-tags">
                  {certs.map((c, i) => <span key={i} className="lg1-cert-tag">{c}</span>)}
                </div>
              </div>
            )}
            {areas.length > 0 && (
              <div className="lg1-info-card">
                <div className="lg1-info-card-label">Service Areas</div>
                <div className="lg1-area-tags">
                  {areas.map((a, i) => <span key={i} className="lg1-area-tag">📍 {a}</span>)}
                </div>
              </div>
            )}
            <div className="lg1-info-card">
              <div className="lg1-info-card-label">Hours</div>
              <div className="lg1-hours-list">
                {[['Weekdays', hours.weekdays], ['Saturday', hours.saturday], ['Sunday', hours.sunday]]
                  .filter(([, v]) => v)
                  .map(([label, val]) => (
                    <div key={label} className="lg1-hours-row">
                      <span>{label}</span><span>{val}</span>
                    </div>
                  ))}
              </div>
            </div>
            <div className="lg1-info-card">
              <div className="lg1-info-card-label">Get In Touch</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {phone && <a href={`tel:${phone.replace(/\D/g,'')}`} style={{ fontSize: 14, color: P.green, fontWeight: 700, textDecoration: 'none' }}>📞 {phone}</a>}
                {email && <a href={`mailto:${email}`} style={{ fontSize: 14, color: P.mid, textDecoration: 'none' }}>✉️ {email}</a>}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ — two-panel interactive ── */}
      <section id="faq" className="lg1-faq">
        <div className="lg1-faq-inner">
          <div className="lg1-faq-left">
            <div className="lg1-faq-hdr">
              <p>Common Questions</p>
              <h2>We've Got<br />Answers</h2>
            </div>
            <div className="lg1-faq-q-list">
              {faqs.map((f, i) => (
                <div key={i} className={`lg1-faq-q-item${activeFaq === i ? ' active' : ''}`} onClick={() => setActiveFaq(i)}>
                  <span className="lg1-faq-q-num">{String(i + 1).padStart(2, '0')}</span>
                  <span className="lg1-faq-q-text">{f.q}</span>
                  <span className="lg1-faq-q-arrow">→</span>
                </div>
              ))}
            </div>
          </div>
          <div className="lg1-faq-right" key={activeFaq}>
            <div className="lg1-faq-answer">
              <div className="lg1-faq-a-q">Answer</div>
              <div className="lg1-faq-a-text">{faqs[activeFaq]?.q}</div>
              <p className="lg1-faq-a-body">{faqs[activeFaq]?.a}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA — asymmetric ── */}
      <section className="lg1-cta">
        <div className="lg1-cta-deco">🌿</div>
        <div className="lg1-cta-inner">
          <div className="lg1-cta-left">
            <h2>Let's transform your outdoor space <em>together.</em></h2>
            <div className="lg1-cta-btn-wrap">
              <button className="lg1-cta-btn-w" onClick={() => window.open(bookUrl)}>Get Free Estimate</button>
              <button className="lg1-cta-btn-ghost" onClick={() => scrollTo('services')}>View Services</button>
            </div>
          </div>
          <div className="lg1-cta-right">
            {phone && (
              <div className="lg1-contact-card">
                <div className="lg1-contact-card-label">Call Us</div>
                <div className="lg1-contact-card-val">{phone}</div>
              </div>
            )}
            {email && (
              <div className="lg1-contact-card">
                <div className="lg1-contact-card-label">Email Us</div>
                <div className="lg1-contact-card-val" style={{ fontSize: 14 }}>{email}</div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── FOOTER — minimal strip ── */}
      <footer className="lg1-footer">
        <div className="lg1-footer-strip">
          <div className="lg1-footer-brand">
            <div className="lg1-footer-brand-ico">🌿</div>
            {name}
          </div>
          <div className="lg1-footer-right">
            {phone && <a href={`tel:${phone.replace(/\D/g,'')}`}>{phone}</a>}
            {email && <a href={`mailto:${email}`}>{email}</a>}
            <span className="lg1-footer-copy">© {new Date().getFullYear()} {name}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
