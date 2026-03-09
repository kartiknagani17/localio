'use client';

import React, { useEffect, useRef, useState } from 'react';
import { TemplateProps } from '../types';

/* ── Palette ──────────────────────────────────────────────────────────── */
const P = {
  forest:   '#14532d',
  forestMd: '#166534',
  forestLt: '#15803d',
  emerald:  '#22c55e',
  gold:     '#d97706',
  goldLt:   '#f59e0b',
  cream:    '#fafaf8',
  creamAlt: '#f0ede6',
  charcoal: '#111827',
  gray:     '#6b7280',
  grayLt:   '#d1d5db',
  white:    '#ffffff',
};

/* ── Styles ───────────────────────────────────────────────────────────── */
const STYLES = `
  .pb3-root { font-family: 'Inter', system-ui, -apple-system, sans-serif; background: ${P.cream}; color: ${P.charcoal}; overflow-x: hidden;  container-type: inline-size; }
  .pb3-root * { box-sizing: border-box; margin: 0; padding: 0; }

  /* ── Nav ── */
  .pb3-nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; padding: 1.25rem 2rem; display: flex; align-items: center; justify-content: space-between; transition: background .4s, box-shadow .4s, padding .4s; }
  .pb3-nav.pb3-sc { background: rgba(250,250,248,.96); backdrop-filter: blur(12px); box-shadow: 0 1px 0 rgba(0,0,0,.08); padding: .85rem 2rem; }
  .pb3-nav-logo { font-size: 1.35rem; font-weight: 800; color: ${P.white}; letter-spacing: -.02em; transition: color .4s; }
  .pb3-sc .pb3-nav-logo { color: ${P.charcoal}; }
  .pb3-nav-links { display: flex; gap: 2rem; list-style: none; }
  .pb3-nav-links a { font-size: .875rem; font-weight: 500; text-decoration: none; color: rgba(255,255,255,.85); transition: color .3s; }
  .pb3-sc .pb3-nav-links a { color: ${P.charcoal}; }
  .pb3-nav-links a:hover { color: ${P.emerald} !important; }
  .pb3-nav-cta { background: ${P.gold}; color: ${P.white} !important; padding: .6rem 1.4rem; border-radius: 6px; font-size: .875rem; font-weight: 700; text-decoration: none !important; transition: background .2s, transform .2s; }
  .pb3-nav-cta:hover { background: ${P.goldLt} !important; transform: translateY(-1px); }
  .pb3-nav-mob-btn { display: none; background: none; border: none; cursor: pointer; padding: .5rem; }
  .pb3-ham { display: flex; flex-direction: column; gap: 5px; }
  .pb3-ham span { width: 24px; height: 2px; background: ${P.white}; display: block; border-radius: 2px; transition: background .4s; }
  .pb3-sc .pb3-ham span { background: ${P.charcoal}; }
  .pb3-mob-menu { display: none; position: fixed; inset: 0; background: ${P.forest}; z-index: 200; flex-direction: column; align-items: center; justify-content: center; gap: 2rem; }
  .pb3-mob-menu.pb3-open { display: flex; }
  .pb3-mob-menu a { color: ${P.white}; font-size: 1.5rem; font-weight: 700; text-decoration: none; }
  .pb3-mob-close { position: absolute; top: 1.5rem; right: 1.5rem; background: none; border: none; cursor: pointer; color: ${P.white}; font-size: 2rem; line-height: 1; }

  /* ── Hero ── */
  .pb3-hero { min-height: 100vh; position: relative; display: flex; align-items: center; justify-content: center; overflow: hidden; }
  .pb3-hero-bg { position: absolute; inset: 0; background: linear-gradient(135deg, ${P.forest} 0%, ${P.forestMd} 45%, #0d3321 75%, ${P.charcoal} 100%); }
  .pb3-hero-mesh { position: absolute; inset: 0; background: radial-gradient(ellipse 80% 60% at 20% 50%, rgba(34,197,94,.15) 0%, transparent 60%), radial-gradient(ellipse 60% 80% at 80% 20%, rgba(217,119,6,.1) 0%, transparent 60%), radial-gradient(ellipse 50% 50% at 60% 80%, rgba(34,197,94,.08) 0%, transparent 60%); animation: pb3-mesh 8s ease-in-out infinite alternate; }
  @keyframes pb3-mesh { 0% { opacity: .8; transform: scale(1); } 100% { opacity: 1; transform: scale(1.05); } }
  .pb3-hero-grid { position: absolute; inset: 0; opacity: .04; background-image: linear-gradient(rgba(255,255,255,.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.3) 1px, transparent 1px); background-size: 60px 60px; }
  .pb3-hero-body { position: relative; z-index: 2; text-align: center; padding: 8rem 2rem 5rem; max-width: 860px; }
  .pb3-hero-pill { display: inline-flex; align-items: center; gap: .5rem; background: rgba(255,255,255,.1); border: 1px solid rgba(255,255,255,.2); backdrop-filter: blur(8px); padding: .45rem 1rem; border-radius: 100px; font-size: .8rem; font-weight: 600; color: rgba(255,255,255,.9); margin-bottom: 2rem; animation: pb3-fadeup .6s ease both; }
  .pb3-pulse-dot { width: 7px; height: 7px; border-radius: 50%; background: ${P.emerald}; animation: pb3-pulse 1.8s ease-in-out infinite; }
  @keyframes pb3-pulse { 0%,100% { opacity: 1; transform: scale(1); } 50% { opacity: .5; transform: scale(1.4); } }
  .pb3-hero-h1 { font-size: clamp(2.8rem, 7vw, 5.5rem); font-weight: 900; line-height: 1.05; letter-spacing: -.03em; color: ${P.white}; margin-bottom: 1.5rem; animation: pb3-fadeup .7s .1s ease both; }
  .pb3-hero-h1 em { font-style: normal; color: ${P.goldLt}; position: relative; display: inline-block; }
  .pb3-hero-h1 em::after { content: ''; position: absolute; bottom: 2px; left: 0; right: 0; height: 4px; background: ${P.goldLt}; border-radius: 2px; transform: scaleX(0); transform-origin: left; animation: pb3-ul .8s 1s ease forwards; }
  @keyframes pb3-ul { to { transform: scaleX(1); } }
  .pb3-hero-p { font-size: clamp(1rem, 2vw, 1.2rem); color: rgba(255,255,255,.75); max-width: 520px; margin: 0 auto 2.5rem; line-height: 1.7; animation: pb3-fadeup .7s .2s ease both; }
  .pb3-hero-btns { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; animation: pb3-fadeup .7s .3s ease both; }
  .pb3-btn-gold { background: ${P.gold}; color: ${P.white}; padding: 1rem 2rem; border-radius: 8px; font-size: 1rem; font-weight: 700; text-decoration: none; transition: background .2s, transform .2s, box-shadow .2s; box-shadow: 0 4px 24px rgba(217,119,6,.4); display: inline-block; }
  .pb3-btn-gold:hover { background: ${P.goldLt}; transform: translateY(-2px); box-shadow: 0 8px 32px rgba(217,119,6,.5); }
  .pb3-btn-ghost { background: rgba(255,255,255,.1); color: ${P.white}; padding: 1rem 2rem; border-radius: 8px; font-size: 1rem; font-weight: 600; text-decoration: none; border: 1px solid rgba(255,255,255,.25); backdrop-filter: blur(8px); transition: background .2s; display: inline-block; }
  .pb3-btn-ghost:hover { background: rgba(255,255,255,.18); }
  .pb3-hero-trust { display: flex; gap: 1.5rem; justify-content: center; flex-wrap: wrap; margin-top: 3rem; animation: pb3-fadeup .7s .4s ease both; }
  .pb3-trust-chip { display: flex; align-items: center; gap: .4rem; color: rgba(255,255,255,.7); font-size: .8rem; font-weight: 500; }
  .pb3-trust-check { color: ${P.emerald}; }
  .pb3-scroll-hint { position: absolute; bottom: 2rem; left: 50%; transform: translateX(-50%); display: flex; flex-direction: column; align-items: center; gap: .5rem; color: rgba(255,255,255,.35); font-size: .7rem; letter-spacing: .1em; text-transform: uppercase; animation: pb3-bob 2s ease-in-out infinite; z-index: 2; }
  .pb3-scroll-line { width: 1px; height: 40px; background: linear-gradient(to bottom, rgba(255,255,255,.35), transparent); }
  @keyframes pb3-bob { 0%,100% { transform: translateX(-50%) translateY(0); } 50% { transform: translateX(-50%) translateY(8px); } }
  @keyframes pb3-fadeup { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }

  /* ── Ticker ── */
  .pb3-ticker { background: ${P.gold}; overflow: hidden; padding: .85rem 0; }
  .pb3-ticker-track { display: flex; white-space: nowrap; animation: pb3-tick 28s linear infinite; }
  .pb3-ticker-item { padding: 0 2.5rem; font-size: .875rem; font-weight: 700; color: ${P.white}; letter-spacing: .05em; text-transform: uppercase; display: flex; align-items: center; gap: 1rem; }
  .pb3-tick-sep { width: 4px; height: 4px; border-radius: 50%; background: rgba(255,255,255,.5); flex-shrink: 0; }
  @keyframes pb3-tick { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }

  /* ── Shared section styles ── */
  .pb3-section { padding: 6rem 2rem; }
  .pb3-wrap { max-width: 1200px; margin: 0 auto; }
  .pb3-ey { font-size: .78rem; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; color: ${P.forest}; margin-bottom: .65rem; }
  .pb3-ey-lt { color: ${P.emerald}; }
  .pb3-h2 { font-size: clamp(2rem, 4vw, 3rem); font-weight: 900; letter-spacing: -.03em; line-height: 1.1; color: ${P.charcoal}; }
  .pb3-h2-lt { color: ${P.white}; }
  .pb3-sub { font-size: .95rem; color: ${P.gray}; line-height: 1.7; margin-top: .75rem; }

  /* ── Reveal ── */
  .pb3-rv { opacity: 0; transition: opacity .65s ease, transform .65s ease; }
  .pb3-rv.pb3-up    { transform: translateY(36px); }
  .pb3-rv.pb3-left  { transform: translateX(-36px); }
  .pb3-rv.pb3-right { transform: translateX(36px); }
  .pb3-rv.pb3-scale { transform: scale(.92); }
  .pb3-rv.pb3-vis { opacity: 1; transform: none; }

  /* ── Services ── */
  .pb3-services { background: ${P.white}; }
  .pb3-svc-hdr { display: flex; align-items: flex-end; justify-content: space-between; gap: 2rem; margin-bottom: 3rem; flex-wrap: wrap; }
  .pb3-svc-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
  .pb3-svc-card { background: ${P.cream}; border-radius: 16px; padding: 2rem; position: relative; overflow: hidden; transition: transform .3s, box-shadow .3s; height: 100%; }
  .pb3-svc-card::before { content: ''; position: absolute; inset: 0; background: ${P.forest}; transform: translateY(101%); transition: transform .45s cubic-bezier(.22,1,.36,1); z-index: 0; }
  .pb3-svc-card:hover::before { transform: translateY(0); }
  .pb3-svc-card:hover { transform: translateY(-6px); box-shadow: 0 20px 60px rgba(20,83,45,.25); }
  .pb3-svc-card > * { position: relative; z-index: 1; transition: color .3s; }
  .pb3-svc-card:hover .pb3-svc-num { color: rgba(255,255,255,.1); }
  .pb3-svc-card:hover .pb3-svc-icon { background: rgba(255,255,255,.12); color: ${P.emerald}; }
  .pb3-svc-card:hover .pb3-svc-name { color: ${P.white}; }
  .pb3-svc-card:hover .pb3-svc-desc { color: rgba(255,255,255,.7); }
  .pb3-svc-num { font-size: 3.5rem; font-weight: 900; color: ${P.grayLt}; line-height: 1; margin-bottom: 1rem; letter-spacing: -.04em; }
  .pb3-svc-icon { width: 48px; height: 48px; border-radius: 12px; background: rgba(20,83,45,.08); display: flex; align-items: center; justify-content: center; font-size: 1.4rem; color: ${P.forest}; margin-bottom: 1rem; transition: background .3s, color .3s; }
  .pb3-svc-name { font-size: 1.1rem; font-weight: 700; color: ${P.charcoal}; margin-bottom: .5rem; }
  .pb3-svc-desc { font-size: .875rem; color: ${P.gray}; line-height: 1.65; }

  /* ── Stats ── */
  .pb3-stats { background: ${P.forest}; }
  .pb3-stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); }
  .pb3-stat { padding: 3.5rem 2rem; text-align: center; position: relative; }
  .pb3-stat + .pb3-stat::before { content: ''; position: absolute; left: 0; top: 28%; bottom: 28%; width: 1px; background: rgba(255,255,255,.12); }
  .pb3-stat-n { font-size: clamp(2.5rem, 5vw, 4rem); font-weight: 900; color: ${P.white}; line-height: 1; letter-spacing: -.04em; }
  .pb3-stat-sfx { font-size: .875rem; font-weight: 700; color: ${P.emerald}; margin-top: .25rem; letter-spacing: .05em; text-transform: uppercase; }
  .pb3-stat-lbl { font-size: .8rem; color: rgba(255,255,255,.55); margin-top: .4rem; }

  /* ── Bento (Why Us) ── */
  .pb3-bento { background: ${P.cream}; }
  .pb3-bento-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.25rem; margin-top: 3rem; }
  .pb3-bc { border-radius: 20px; padding: 2rem; display: flex; flex-direction: column; gap: .75rem; height: 100%; }
  .pb3-bc-forest   { background: ${P.forest};   color: ${P.white}; }
  .pb3-bc-charcoal { background: ${P.charcoal}; color: ${P.white}; }
  .pb3-bc-gold     { background: ${P.gold};     color: ${P.white}; }
  .pb3-bc-white    { background: ${P.white};    color: ${P.charcoal}; }
  .pb3-bc-calt     { background: ${P.creamAlt}; color: ${P.charcoal}; }
  .pb3-bc-fmd      { background: ${P.forestMd}; color: ${P.white}; }
  .pb3-bc-emoji { font-size: 2.2rem; }
  .pb3-bc-big { font-size: 3.5rem; font-weight: 900; letter-spacing: -.04em; line-height: 1; color: ${P.goldLt}; }
  .pb3-bc-charcoal .pb3-bc-big { color: ${P.emerald}; }
  .pb3-bc-title { font-size: 1.1rem; font-weight: 800; line-height: 1.2; }
  .pb3-bc-txt { font-size: .875rem; line-height: 1.65; opacity: .8; }

  /* ── Process ── */
  .pb3-process { background: ${P.white}; }
  .pb3-proc-hd { text-align: center; margin-bottom: 4rem; }
  .pb3-proc-list { max-width: 680px; margin: 0 auto; display: flex; flex-direction: column; }
  .pb3-pstep { display: grid; grid-template-columns: 80px 1fr; gap: 1.75rem; padding: 0 0 2.5rem; position: relative; align-items: start; }
  .pb3-pstep:not(:last-child)::after { content: ''; position: absolute; left: 39px; top: 5rem; bottom: 0; width: 2px; background: ${P.grayLt}; transition: background 1s; }
  .pb3-pstep.pb3-pv:not(:last-child)::after { background: linear-gradient(to bottom, ${P.forest}, ${P.grayLt}); }
  .pb3-pnum { width: 80px; height: 80px; border-radius: 50%; background: ${P.cream}; border: 2px solid ${P.grayLt}; display: flex; align-items: center; justify-content: center; font-size: 1.4rem; font-weight: 900; color: ${P.gray}; transition: background .5s, border-color .5s, color .5s; flex-shrink: 0; }
  .pb3-pstep.pb3-pv .pb3-pnum { background: ${P.forest}; border-color: ${P.forest}; color: ${P.white}; }
  .pb3-pinfo { padding-top: 1.35rem; }
  .pb3-ptitle { font-size: 1.1rem; font-weight: 800; color: ${P.charcoal}; margin-bottom: .45rem; }
  .pb3-pdesc { font-size: .875rem; color: ${P.gray}; line-height: 1.7; }

  /* ── Testimonials ── */
  .pb3-testi { background: ${P.creamAlt}; }
  .pb3-testi-hd { text-align: center; margin-bottom: 3rem; }
  .pb3-carousel { position: relative; overflow: hidden; }
  .pb3-car-track { display: flex; transition: transform .5s cubic-bezier(.22,1,.36,1); }
  .pb3-slide { min-width: 100%; padding: 0 .5rem; }
  .pb3-tcard { background: ${P.white}; border-radius: 20px; padding: 3rem; max-width: 800px; margin: 0 auto; position: relative; }
  .pb3-tcard-qmark { font-size: 8rem; line-height: .4; color: ${P.forest}; opacity: .1; font-family: Georgia, serif; position: absolute; top: 2rem; left: 2rem; user-select: none; pointer-events: none; }
  .pb3-tcard-stars { display: flex; gap: .2rem; color: ${P.goldLt}; font-size: 1.2rem; margin-bottom: 1.25rem; }
  .pb3-tcard-text { font-size: clamp(1rem, 2vw, 1.15rem); color: ${P.charcoal}; line-height: 1.8; margin-bottom: 2rem; font-style: italic; }
  .pb3-tcard-auth { display: flex; align-items: center; gap: .9rem; }
  .pb3-tcard-av { width: 50px; height: 50px; border-radius: 50%; background: linear-gradient(135deg, ${P.forest}, ${P.emerald}); display: flex; align-items: center; justify-content: center; font-size: 1.25rem; font-weight: 800; color: ${P.white}; flex-shrink: 0; }
  .pb3-tcard-name { font-weight: 700; color: ${P.charcoal}; font-size: .95rem; }
  .pb3-tcard-role { font-size: .8rem; color: ${P.gray}; }
  .pb3-car-ctrls { display: flex; align-items: center; justify-content: center; gap: 1.25rem; margin-top: 2rem; }
  .pb3-cbtn { width: 46px; height: 46px; border-radius: 50%; border: 2px solid ${P.grayLt}; background: ${P.white}; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; color: ${P.charcoal}; transition: background .2s, border-color .2s, color .2s; }
  .pb3-cbtn:hover { background: ${P.forest}; border-color: ${P.forest}; color: ${P.white}; }
  .pb3-cdots { display: flex; gap: .5rem; }
  .pb3-cdot { width: 8px; height: 8px; border-radius: 50%; background: ${P.grayLt}; cursor: pointer; transition: background .3s, transform .3s; }
  .pb3-cdot.pb3-cdot-on { background: ${P.forest}; transform: scale(1.4); }

  /* ── Gallery ── */
  .pb3-gallery { background: ${P.white}; }
  .pb3-gal-hd { text-align: center; margin-bottom: 3rem; }
  .pb3-gal-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
  .pb3-gal-item { aspect-ratio: 4/3; border-radius: 12px; overflow: hidden; position: relative; }
  .pb3-gal-img { width: 100%; height: 100%; object-fit: cover; transition: transform .5s; display: block; }
  .pb3-gal-item:hover .pb3-gal-img { transform: scale(1.08); }
  .pb3-gal-ov { position: absolute; inset: 0; background: rgba(20,83,45,.55); opacity: 0; transition: opacity .3s; display: flex; align-items: center; justify-content: center; color: ${P.white}; font-size: 2rem; }
  .pb3-gal-item:hover .pb3-gal-ov { opacity: 1; }

  /* ── FAQ ── */
  .pb3-faq { background: ${P.cream}; }
  .pb3-faq-hd { text-align: center; margin-bottom: 3rem; }
  .pb3-faq-list { max-width: 800px; margin: 0 auto; display: flex; flex-direction: column; gap: .85rem; }
  .pb3-fitem { background: ${P.white}; border-radius: 14px; border-left: 4px solid ${P.grayLt}; overflow: hidden; transition: border-left-color .3s; }
  .pb3-fitem.pb3-fo { border-left-color: ${P.forest}; }
  .pb3-fq { padding: 1.2rem 1.5rem; display: flex; align-items: center; justify-content: space-between; gap: 1rem; cursor: pointer; font-weight: 700; color: ${P.charcoal}; font-size: .95rem; user-select: none; }
  .pb3-ficon { width: 28px; height: 28px; border-radius: 50%; background: ${P.cream}; display: flex; align-items: center; justify-content: center; font-size: 1rem; color: ${P.forest}; flex-shrink: 0; transition: background .3s, color .3s, transform .3s; }
  .pb3-fo .pb3-ficon { background: ${P.forest}; color: ${P.white}; transform: rotate(45deg); }
  .pb3-fa { max-height: 0; overflow: hidden; transition: max-height .4s cubic-bezier(.22,1,.36,1); }
  .pb3-fo .pb3-fa { max-height: 300px; }
  .pb3-fa-in { padding: 0 1.5rem 1.2rem; font-size: .875rem; color: ${P.gray}; line-height: 1.75; }

  /* ── Service Areas ── */
  .pb3-areas { background: ${P.forest}; }
  .pb3-areas-hd { text-align: center; margin-bottom: 3rem; }
  .pb3-pills { display: flex; flex-wrap: wrap; gap: .75rem; justify-content: center; }
  .pb3-pill { background: rgba(255,255,255,.1); border: 1px solid rgba(255,255,255,.2); padding: .6rem 1.4rem; border-radius: 100px; color: ${P.white}; font-size: .875rem; font-weight: 500; backdrop-filter: blur(8px); transition: background .2s, border-color .2s; }
  .pb3-pill:hover { background: rgba(255,255,255,.2); border-color: rgba(255,255,255,.4); }

  /* ── CTA ── */
  .pb3-cta { background: ${P.charcoal}; padding: 6rem 2rem; text-align: center; position: relative; overflow: hidden; }
  .pb3-cta::before { content: ''; position: absolute; top: -50%; left: -10%; width: 50%; padding-top: 50%; border-radius: 50%; background: radial-gradient(circle, rgba(20,83,45,.35) 0%, transparent 70%); pointer-events: none; }
  .pb3-cta::after  { content: ''; position: absolute; bottom: -50%; right: -10%; width: 50%; padding-top: 50%; border-radius: 50%; background: radial-gradient(circle, rgba(217,119,6,.2) 0%, transparent 70%); pointer-events: none; }
  .pb3-cta-in { position: relative; z-index: 1; max-width: 680px; margin: 0 auto; }
  .pb3-cta-phone { font-size: clamp(2rem, 5vw, 3.5rem); font-weight: 900; color: ${P.goldLt}; letter-spacing: -.03em; margin: 1.5rem 0; display: block; text-decoration: none; transition: color .2s; }
  .pb3-cta-phone:hover { color: ${P.gold}; }

  /* ── Footer ── */
  .pb3-footer { background: ${P.charcoal}; border-top: 1px solid rgba(255,255,255,.06); padding: 4rem 2rem 2rem; }
  .pb3-ftr-grid { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 3rem; }
  .pb3-ftr-brand { font-size: 1.3rem; font-weight: 800; color: ${P.white}; margin-bottom: .7rem; }
  .pb3-ftr-blurb { font-size: .875rem; color: rgba(255,255,255,.45); line-height: 1.6; }
  .pb3-ftr-contact { margin-top: .75rem; font-size: .875rem; color: rgba(255,255,255,.45); line-height: 1.8; }
  .pb3-ftr-col-hd { font-size: .72rem; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: rgba(255,255,255,.35); margin-bottom: .9rem; }
  .pb3-ftr-links { list-style: none; display: flex; flex-direction: column; gap: .55rem; }
  .pb3-ftr-links a { color: rgba(255,255,255,.55); font-size: .875rem; text-decoration: none; transition: color .2s; }
  .pb3-ftr-links a:hover { color: ${P.emerald}; }
  .pb3-ftr-btm { max-width: 1200px; margin: 2.5rem auto 0; padding-top: 2rem; border-top: 1px solid rgba(255,255,255,.06); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; }
  .pb3-ftr-copy { font-size: .78rem; color: rgba(255,255,255,.3); }
  .pb3-ftr-live { display: flex; align-items: center; gap: .4rem; font-size: .78rem; color: rgba(255,255,255,.3); }
  .pb3-live-dot { width: 6px; height: 6px; border-radius: 50%; background: ${P.emerald}; }

  /* ── Responsive ── */
  @container (max-width: 1024px) {
    .pb3-svc-grid    { grid-template-columns: repeat(2, 1fr); }
    .pb3-stats-grid  { grid-template-columns: repeat(2, 1fr); }
    .pb3-bento-grid  { grid-template-columns: repeat(2, 1fr); }
    .pb3-gal-grid    { grid-template-columns: repeat(2, 1fr); }
    .pb3-ftr-grid    { grid-template-columns: 1fr 1fr; gap: 2rem; }
    .pb3-stat + .pb3-stat::before { display: none; }
  }
  @container (max-width: 768px) {
    .pb3-nav-links, .pb3-nav-cta { display: none; }
    .pb3-nav-mob-btn { display: flex; }
    .pb3-svc-grid   { grid-template-columns: 1fr; }
    .pb3-stats-grid { grid-template-columns: repeat(2, 1fr); }
    .pb3-bento-grid { grid-template-columns: 1fr; }
    .pb3-gal-grid   { grid-template-columns: repeat(2, 1fr); }
    .pb3-ftr-grid   { grid-template-columns: 1fr; gap: 2rem; }
    .pb3-ftr-btm    { flex-direction: column; text-align: center; }
    .pb3-hero-body  { padding: 7rem 1.25rem 4rem; }
    .pb3-section    { padding: 4.5rem 1.25rem; }
  }
  @container (max-width: 480px) {
    .pb3-bento-grid { grid-template-columns: 1fr; }
    .pb3-gal-grid   { grid-template-columns: 1fr; }
    .pb3-hero-trust { gap: .75rem; }
    .pb3-ftr-grid   { grid-template-columns: 1fr; }
  }
`;

/* ── Default data ─────────────────────────────────────────────────────── */
const DEF_SERVICES = [
  { name: 'Drain Cleaning',       description: 'Fast, thorough drain cleaning to restore full flow and prevent future blockages.'     },
  { name: 'Pipe Repair',          description: 'Expert repair of cracked, leaking, or burst pipes using proven modern materials.'     },
  { name: 'Water Heater Service', description: 'Installation, repair, and maintenance of all water heater makes and models.'          },
  { name: 'Leak Detection',       description: 'State-of-the-art equipment locates hidden leaks quickly and non-invasively.'          },
  { name: 'Emergency Plumbing',   description: '24/7 rapid response for any plumbing emergency — residential or commercial.'          },
  { name: 'Fixture Installation', description: 'Professional installation of faucets, toilets, sinks, and all plumbing fixtures.'     },
];

const DEF_STATS = [
  { value: '15',   suffix: '+',  label: 'Years in Business'  },
  { value: '2500', suffix: '+',  label: 'Jobs Completed'     },
  { value: '98',   suffix: '%',  label: 'Satisfaction Rate'  },
  { value: '24',   suffix: '/7', label: 'Emergency Service'  },
];

const DEF_TESTIMONIALS = [
  { author: 'Sarah M.',  role: 'Homeowner',        text: 'They arrived within the hour for an emergency pipe burst. Fixed it fast, cleaned up perfectly. Absolutely outstanding from start to finish.' },
  { author: 'James T.',  role: 'Property Manager', text: 'We rely on this company for all our rental properties. Their professionalism, punctuality, and fair pricing keeps us coming back every time.' },
  { author: 'Linda K.',  role: 'Business Owner',   text: 'Diagnosed a tricky leak that two other plumbers had missed completely. Their expertise saved us thousands in potential water damage.' },
];

const DEF_FAQ = [
  { q: 'Do you offer 24/7 emergency plumbing?',   a: 'Yes — we respond around the clock. Call us any time and a licensed plumber will be on-site within the hour for emergencies.' },
  { q: 'Are your plumbers licensed and insured?',  a: 'All our plumbers are fully licensed, bonded, and insured. We comply with all local codes and carry full liability coverage.' },
  { q: 'Do you provide upfront pricing?',          a: 'Absolutely. We give you a clear itemized quote before any work begins. No hidden fees, no surprises — ever.' },
  { q: 'What areas do you serve?',                 a: 'We serve the metro area and surrounding communities. Give us a call and we\'ll confirm availability at your location.' },
];

const DEF_AREAS = ['Downtown', 'North Side', 'Westfield', 'East End', 'Riverside', 'Midtown', 'South Park', 'Harbor View'];

const PROCESS_STEPS = [
  { num: '01', title: 'Contact Us',   desc: 'Reach us by phone or online form. Our dispatch team takes your details and books the fastest available slot — same day when possible.' },
  { num: '02', title: 'We Diagnose',  desc: 'A licensed plumber arrives on time, assesses the issue thoroughly, and gives you an upfront quote before any work begins.' },
  { num: '03', title: 'We Fix It',    desc: 'Our team uses quality parts and proven methods to get the job done right — first time, every time, on your schedule.' },
  { num: '04', title: 'Guaranteed',   desc: 'All workmanship is fully guaranteed. If anything isn\'t right after we leave, we come back and fix it at no additional charge.' },
];

const SVC_ICONS = ['🚿', '🔧', '🌡️', '🔍', '🚨', '🪠', '🏠', '💧'];

const BENTO_ITEMS = [
  { bg: 'pb3-bc-forest',   big: '',    emoji: '🏆', title: 'Award-Winning',      txt: 'Recognized as the top-rated plumber by thousands of satisfied local customers.'               },
  { bg: 'pb3-bc-charcoal', big: '15+', emoji: '',   title: 'Years of Expertise', txt: 'Over a decade delivering reliable plumbing solutions across the metro area.'                  },
  { bg: 'pb3-bc-calt',     big: '',    emoji: '⚡',  title: 'Rapid Response',     txt: '1-hour emergency dispatch. When you need us, we\'re already on the way.'                      },
  { bg: 'pb3-bc-gold',     big: '',    emoji: '💰',  title: 'Clear Pricing',      txt: 'Itemized upfront quotes before any work starts. Zero hidden fees, ever.'                      },
  { bg: 'pb3-bc-white',    big: '',    emoji: '🛡️', title: 'Fully Licensed',     txt: 'Every plumber is certified, bonded, and fully insured for complete peace of mind.'            },
  { bg: 'pb3-bc-fmd',      big: '',    emoji: '✅',  title: 'Work Guaranteed',    txt: '100% satisfaction guarantee on all labor and parts. We make it right — every time.'           },
];

/* ── Hooks ────────────────────────────────────────────────────────────── */
function useInView(threshold = 0.18) {
  const ref = useRef<HTMLElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, vis };
}

function useCounter(target: number, duration = 2000, active = false) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!active) return;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - t0) / duration, 1);
      setN(Math.round((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration, active]);
  return n;
}

/* ── Sub-components ───────────────────────────────────────────────────── */
function Reveal({
  children, dir = 'up', delay = 0, className = '', style,
}: {
  children: React.ReactNode;
  dir?: 'up' | 'left' | 'right' | 'scale';
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const { ref, vis } = useInView();
  return (
    <div
      ref={ref as React.Ref<HTMLDivElement>}
      className={`pb3-rv pb3-${dir} ${vis ? 'pb3-vis' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms`, ...style }}
    >
      {children}
    </div>
  );
}

function StatBox({ value, suffix, label, active }: { value: string; suffix: string; label: string; active: boolean }) {
  const num = parseInt(value.replace(/\D/g, ''), 10) || 0;
  const count = useCounter(num, 2000, active);
  return (
    <div className="pb3-stat">
      <div className="pb3-stat-n">{count.toLocaleString()}</div>
      <div className="pb3-stat-sfx">{suffix}</div>
      <div className="pb3-stat-lbl">{label}</div>
    </div>
  );
}

function ProcessStep({ step, idx }: { step: typeof PROCESS_STEPS[number]; idx: number }) {
  const { ref, vis } = useInView(0.35);
  return (
    <div
      ref={ref as React.Ref<HTMLDivElement>}
      className={`pb3-pstep ${vis ? 'pb3-pv' : ''}`}
      style={{ transition: 'opacity .6s ease, transform .6s ease', transitionDelay: `${idx * 120}ms`, opacity: vis ? 1 : 0, transform: vis ? 'none' : 'translateX(-20px)' }}
    >
      <div className="pb3-pnum">{step.num}</div>
      <div className="pb3-pinfo">
        <div className="pb3-ptitle">{step.title}</div>
        <div className="pb3-pdesc">{step.desc}</div>
      </div>
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`pb3-fitem ${open ? 'pb3-fo' : ''}`}>
      <div
        className="pb3-fq"
        onClick={() => setOpen(o => !o)}
        role="button" tabIndex={0}
        onKeyDown={e => e.key === 'Enter' && setOpen(o => !o)}
      >
        <span>{q}</span>
        <span className="pb3-ficon">+</span>
      </div>
      <div className="pb3-fa">
        <div className="pb3-fa-in">{a}</div>
      </div>
    </div>
  );
}

/* ── Main Component ───────────────────────────────────────────────────── */
export default function Plumber3({ businessData: bd, isPreview }: TemplateProps) {
  const name    = bd.name     || 'GreenLine Plumbing';
  const city    = bd.city     || 'Your City';
  const phone   = bd.phone    || '(555) 000-0000';
  const email   = bd.email    || '';
  const tagline = bd.tagline  || `${city}'s Most Trusted Plumbing Experts`;
  const subLine = bd.subTagline || 'Licensed, insured, and available 24/7 for all your plumbing needs — residential and commercial.';
  const desc    = bd.description || '';
  const bookUrl = bd.bookingUrl  || `tel:${phone.replace(/\D/g, '')}`;

  /* services */
  const services = (bd.services?.length ? bd.services : DEF_SERVICES).slice(0, 6).map((s, i) => ({
    name: typeof s === 'string' ? s : ((s as any).name  || `Service ${i + 1}`),
    desc: typeof s === 'string' ? '' : ((s as any).description || ''),
    icon: SVC_ICONS[i % SVC_ICONS.length],
    num:  `0${i + 1}`,
  }));

  /* stats */
  const stats = (bd.stats?.length ? bd.stats : DEF_STATS).slice(0, 4).map(s => {
    if (typeof s === 'object' && s !== null) {
      return { value: String((s as any).value ?? '0'), suffix: String((s as any).suffix ?? ''), label: String((s as any).label ?? '') };
    }
    const str = String(s);
    const m = str.match(/^([\d,]+)([^a-z]*)/i);
    return { value: m ? m[1].replace(/,/g, '') : '0', suffix: m ? m[2].trim() : '', label: str };
  });

  /* testimonials */
  const testimonials = (bd.testimonials?.length ? bd.testimonials : DEF_TESTIMONIALS).map(t => ({
    author: typeof t === 'string' ? 'Customer' : ((t as any).author || (t as any).name  || 'Customer'),
    role:   typeof t === 'string' ? city       : ((t as any).role   || (t as any).location || city),
    text:   typeof t === 'string' ? t          : ((t as any).text   || (t as any).review || ''),
  }));

  /* faqs */
  const faqs = (bd.faq?.length ? bd.faq : DEF_FAQ).map(f =>
    typeof f === 'string'
      ? { q: f, a: '' }
      : { q: (f as any).q || (f as any).question || '', a: (f as any).a || (f as any).answer || '' }
  );

  /* areas */
  const areas = bd.serviceAreas?.length ? bd.serviceAreas : [city, ...DEF_AREAS.slice(0, 7)];

  /* gallery */
  const gallery    = (bd.gallery || []).map(g => g.imageUrl).filter(Boolean) as string[];
  const hasGallery = gallery.length >= 3;

  /* nav scroll */
  const [scrolled, setScrolled] = useState(!!isPreview);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    if (isPreview) return;
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, [isPreview]);

  /* stats visibility */
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsOn, setStatsOn] = useState(false);
  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setStatsOn(true); obs.disconnect(); } },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  /* testimonial carousel */
  const [teIdx, setTeIdx] = useState(0);
  const tLen = testimonials.length;
  const tPrev = () => setTeIdx(i => (i - 1 + tLen) % tLen);
  const tNext = () => setTeIdx(i => (i + 1) % tLen);

  /* hero headline split */
  const words = tagline.split(' ');
  const half  = Math.ceil(words.length / 2);
  const h1A   = words.slice(0, half).join(' ');
  const h1B   = words.slice(half).join(' ');

  /* ticker */
  const tickers = [
    'Licensed & Insured', '24/7 Emergency Service', 'Free Estimates',
    `Serving ${city}`, 'Same-Day Appointments', '100% Satisfaction Guaranteed',
    bd.copy?.services_label || 'Expert Plumbing',
  ];

  const navItems = [
    { label: 'Services', href: '#services' },
    { label: 'Process',  href: '#process'  },
    { label: 'About',    href: '#about'    },
    { label: 'Contact',  href: '#contact'  },
  ];

  return (
    <div className="pb3-root">
      <style>{STYLES}</style>

      {/* ── Nav ── */}
      <nav className={`pb3-nav ${scrolled ? 'pb3-sc' : ''}`}>
        <div className="pb3-nav-logo">{name}</div>
        <ul className="pb3-nav-links">
          {navItems.map(l => <li key={l.href}><a href={l.href}>{l.label}</a></li>)}
        </ul>
        <a href={bookUrl} className="pb3-nav-cta" data-ec="true">{bd.copy?.nav_cta || 'Call Now'}</a>
        <button className="pb3-nav-mob-btn" onClick={() => setMenuOpen(true)} aria-label="Open menu" data-ec="true">
          <span className="pb3-ham"><span/><span/><span/></span>
        </button>
      </nav>

      {/* Mobile menu */}
      <div className={`pb3-mob-menu ${menuOpen ? 'pb3-open' : ''}`}>
        <button className="pb3-mob-close" onClick={() => setMenuOpen(false)} data-ec="true">×</button>
        {navItems.map(l => <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)}>{l.label}</a>)}
        <a
          href={bookUrl} onClick={() => setMenuOpen(false)}
          style={{ background: P.gold, padding: '.75rem 2rem', borderRadius: '8px', fontWeight: 700 }}
        >{bd.copy?.nav_cta || 'Call Now'}</a>
      </div>

      {/* ── Hero ── */}
      <section className="pb3-hero">
        <div className="pb3-hero-bg"/>
        <div className="pb3-hero-mesh"/>
        <div className="pb3-hero-grid"/>
        <div className="pb3-hero-body">
          <div className="pb3-hero-pill">
            <span className="pb3-pulse-dot"/>
            {city} &bull; Licensed &amp; Insured
          </div>
          <h1 className="pb3-hero-h1">
            {h1A}{h1B && <><br/><em>{h1B}</em></>}
          </h1>
          <p className="pb3-hero-p">{subLine}</p>
          <div className="pb3-hero-btns">
            <a href={bookUrl} className="pb3-btn-gold">{bd.copy?.hero_cta_primary || 'Get Free Quote'}</a>
            {phone && <a href={`tel:${phone.replace(/\D/g, '')}`} className="pb3-btn-ghost">📞 {phone}</a>}
          </div>
          <div className="pb3-hero-trust">
            {['24/7 Available', 'Licensed & Insured', 'Free Estimates', 'Same-Day Service'].map(t => (
              <div key={t} className="pb3-trust-chip">
                <span className="pb3-trust-check">✓</span> {t}
              </div>
            ))}
          </div>
        </div>
        <div className="pb3-scroll-hint">
          <div className="pb3-scroll-line"/>
          <span>scroll</span>
        </div>
      </section>

      {/* ── Ticker ── */}
      <div className="pb3-ticker" aria-hidden="true">
        <div className="pb3-ticker-track">
          {[...tickers, ...tickers].map((t, i) => (
            <span key={i} className="pb3-ticker-item">
              {t}<span className="pb3-tick-sep"/>
            </span>
          ))}
        </div>
      </div>

      {/* ── Services ── */}
      <section className="pb3-section pb3-services" id="services">
        <div className="pb3-wrap">
          <div className="pb3-svc-hdr">
            <Reveal dir="up">
              <div className="pb3-ey">{bd.copy?.services_label || 'What We Do'}</div>
              <h2 className="pb3-h2">{bd.copy?.services_heading || 'Our Services'}</h2>
            </Reveal>
            <Reveal dir="right">
              <p style={{ fontSize: '.95rem', color: P.gray, maxWidth: '340px', lineHeight: 1.7 }}>
                {bd.copy?.services_subheading || `Complete plumbing solutions for ${city} homes and businesses.`}
              </p>
            </Reveal>
          </div>
          <div className="pb3-svc-grid">
            {services.map((s, i) => (
              <Reveal key={i} dir="up" delay={i * 70} style={{ height: '100%' }}>
                <div className="pb3-svc-card">
                  <div className="pb3-svc-num">{s.num}</div>
                  <div className="pb3-svc-icon">{s.icon}</div>
                  <div className="pb3-svc-name">{s.name}</div>
                  <div className="pb3-svc-desc">{s.desc || `Professional ${s.name.toLowerCase()} services you can rely on.`}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="pb3-section pb3-stats" ref={statsRef}>
        <div className="pb3-wrap">
          <div className="pb3-stats-grid">
            {stats.map((s, i) => (
              <StatBox key={i} value={s.value} suffix={s.suffix} label={s.label} active={statsOn}/>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bento Why Us ── */}
      <section className="pb3-section pb3-bento" id="about">
        <div className="pb3-wrap">
          <Reveal dir="up">
            <div className="pb3-ey">Why Choose Us</div>
            <h2 className="pb3-h2">{bd.copy?.about_heading || `${city}'s Trusted Plumbing Team`}</h2>
            {desc && <p className="pb3-sub" style={{ maxWidth: '560px' }}>{desc}</p>}
          </Reveal>
          <div className="pb3-bento-grid">
            {BENTO_ITEMS.map((b, i) => (
              <Reveal key={i} dir="scale" delay={i * 60} style={{ height: '100%' }}>
                <div className={`pb3-bc ${b.bg}`}>
                  {b.big ? <div className="pb3-bc-big">{b.big}</div> : <div className="pb3-bc-emoji">{b.emoji}</div>}
                  <div className="pb3-bc-title">{b.title}</div>
                  <div className="pb3-bc-txt">{b.txt}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Process ── */}
      <section className="pb3-section pb3-process" id="process">
        <div className="pb3-wrap">
          <div className="pb3-proc-hd">
            <Reveal dir="up">
              <div className="pb3-ey">How It Works</div>
              <h2 className="pb3-h2">Our Simple 4-Step Process</h2>
              <p className="pb3-sub">Getting your plumbing problem solved is easy with us.</p>
            </Reveal>
          </div>
          <div className="pb3-proc-list">
            {PROCESS_STEPS.map((step, i) => <ProcessStep key={i} step={step} idx={i}/>)}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="pb3-section pb3-testi">
        <div className="pb3-wrap">
          <div className="pb3-testi-hd">
            <Reveal dir="up">
              <div className="pb3-ey">What Clients Say</div>
              <h2 className="pb3-h2">{bd.copy?.testimonials_label || 'Customer Reviews'}</h2>
            </Reveal>
          </div>
          <Reveal dir="up" delay={80}>
            <div className="pb3-carousel">
              <div className="pb3-car-track" style={{ transform: `translateX(-${teIdx * 100}%)` }}>
                {testimonials.map((t, i) => (
                  <div key={i} className="pb3-slide">
                    <div className="pb3-tcard">
                      <div className="pb3-tcard-qmark" aria-hidden="true">&ldquo;</div>
                      <div className="pb3-tcard-stars">★★★★★</div>
                      <p className="pb3-tcard-text">&ldquo;{t.text}&rdquo;</p>
                      <div className="pb3-tcard-auth">
                        <div className="pb3-tcard-av">{(t.author[0] || 'C').toUpperCase()}</div>
                        <div>
                          <div className="pb3-tcard-name">{t.author}</div>
                          <div className="pb3-tcard-role">{t.role}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="pb3-car-ctrls">
              <button className="pb3-cbtn" onClick={tPrev} aria-label="Previous">←</button>
              <div className="pb3-cdots">
                {testimonials.map((_, i) => (
                  <div
                    key={i}
                    className={`pb3-cdot ${i === teIdx ? 'pb3-cdot-on' : ''}`}
                    onClick={() => setTeIdx(i)}
                    role="button" tabIndex={0}
                    aria-label={`Review ${i + 1}`}
                  />
                ))}
              </div>
              <button className="pb3-cbtn" onClick={tNext} aria-label="Next">→</button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Gallery (conditional) ── */}
      {hasGallery && (
        <section className="pb3-section pb3-gallery">
          <div className="pb3-wrap">
            <div className="pb3-gal-hd">
              <Reveal dir="up">
                <div className="pb3-ey">Our Work</div>
                <h2 className="pb3-h2">Recent Projects</h2>
              </Reveal>
            </div>
            <div className="pb3-gal-grid">
              {gallery.slice(0, 6).map((src, i) => (
                <Reveal key={i} dir="scale" delay={i * 70}>
                  <div className="pb3-gal-item">
                    <img src={src} alt={`Project ${i + 1}`} className="pb3-gal-img" loading="lazy"/>
                    <div className="pb3-gal-ov">🔍</div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── FAQ ── */}
      <section className="pb3-section pb3-faq" id="faq">
        <div className="pb3-wrap">
          <div className="pb3-faq-hd">
            <Reveal dir="up">
              <div className="pb3-ey">Common Questions</div>
              <h2 className="pb3-h2">{bd.copy?.faq_heading || 'Frequently Asked Questions'}</h2>
            </Reveal>
          </div>
          <div className="pb3-faq-list">
            {faqs.map((f, i) => (
              <Reveal key={i} dir="up" delay={i * 50}>
                <FaqItem q={f.q} a={f.a}/>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Service Areas ── */}
      <section className="pb3-section pb3-areas">
        <div className="pb3-wrap">
          <div className="pb3-areas-hd">
            <Reveal dir="up">
              <div className="pb3-ey pb3-ey-lt">Coverage</div>
              <h2 className="pb3-h2 pb3-h2-lt">{`Serving ${city} & Surrounding Areas`}</h2>
            </Reveal>
          </div>
          <div className="pb3-pills">
            {areas.map((a, i) => (
              <Reveal key={i} dir="scale" delay={i * 40}>
                <div className="pb3-pill">{a}</div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="pb3-cta" id="contact">
        <div className="pb3-cta-in">
          <Reveal dir="up">
            <div className="pb3-ey" style={{ color: P.emerald }}>Get In Touch</div>
            <h2 style={{ fontSize: 'clamp(2rem,4vw,3.2rem)', fontWeight: 900, color: P.white, letterSpacing: '-.03em', lineHeight: 1.1, margin: '.5rem 0 1rem' }}>
              {bd.copy?.cta_heading || 'Ready to Fix Your Plumbing?'}
            </h2>
            <p style={{ color: 'rgba(255,255,255,.55)', fontSize: '.95rem' }}>
              {bd.copy?.cta_subheading || "Call us now or request a free quote. We're available around the clock."}
            </p>
            {phone && <a href={`tel:${phone.replace(/\D/g, '')}`} className="pb3-cta-phone">{phone}</a>}
            <div>
              <a href={bookUrl} className="pb3-btn-gold" style={{ fontSize: '1rem' }}>
                {bd.copy?.hero_cta_primary || 'Request Free Quote'}
              </a>
            </div>
            {email && <p style={{ marginTop: '1.5rem', color: 'rgba(255,255,255,.35)', fontSize: '.85rem' }}>{email}</p>}
          </Reveal>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="pb3-footer">
        <div className="pb3-ftr-grid">
          <div>
            <div className="pb3-ftr-brand">{name}</div>
            <p className="pb3-ftr-blurb">{tagline}</p>
            {(phone || email) && (
              <div className="pb3-ftr-contact">
                {phone && <div>{phone}</div>}
                {email && <div>{email}</div>}
              </div>
            )}
          </div>
          <div>
            <div className="pb3-ftr-col-hd">Services</div>
            <ul className="pb3-ftr-links">
              {services.slice(0, 4).map(s => <li key={s.name}><a href="#services">{s.name}</a></li>)}
            </ul>
          </div>
          <div>
            <div className="pb3-ftr-col-hd">Company</div>
            <ul className="pb3-ftr-links">
              {[['About Us','#about'],['How It Works','#process'],['FAQ','#faq'],['Contact','#contact']].map(([l,h]) => (
                <li key={h}><a href={h}>{l}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <div className="pb3-ftr-col-hd">Service Areas</div>
            <ul className="pb3-ftr-links">
              {areas.slice(0, 5).map(a => <li key={a}><a href="#">{a}</a></li>)}
            </ul>
          </div>
        </div>
        <div className="pb3-ftr-btm">
          <span className="pb3-ftr-copy">© {new Date().getFullYear()} {name}. All rights reserved.</span>
          <span className="pb3-ftr-live"><span className="pb3-live-dot"/>Serving {city}</span>
        </div>
      </footer>
    </div>
  );
}
