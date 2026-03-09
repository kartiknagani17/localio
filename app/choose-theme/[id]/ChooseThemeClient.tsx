'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TemplateColors } from '@/templates/registry';

// ── Mini site preview SVG ────────────────────────────────────────────────────
// A small browser-mockup built entirely from SVG primitives using the
// template's actual color palette — no screenshots needed.

function MiniSitePreview({ bg, nav, accent, dark }: TemplateColors) {
  const heroText    = dark ? 'rgba(255,255,255,0.92)' : 'rgba(12,12,12,0.85)';
  const heroTextSub = dark ? 'rgba(255,255,255,0.48)' : 'rgba(12,12,12,0.38)';
  // Dark themes re-use the nav bg for the hero; light themes stay on their page bg
  const heroBg   = dark ? nav   : bg;
  const cardBg   = dark ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.88)';
  const sectionBg = dark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.025)';

  return (
    <svg
      viewBox="0 0 240 160"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', display: 'block' }}
      aria-hidden
    >
      {/* Page background */}
      <rect width="240" height="160" fill={bg} />

      {/* ── Nav bar ── */}
      <rect width="240" height="30" fill={nav} />
      {/* Logo dot */}
      <circle cx="14" cy="15" r="5" fill={accent} opacity="0.95" />
      {/* Logo wordmark placeholder */}
      <rect x="24" y="11" width="44" height="8" rx="3" fill="rgba(255,255,255,0.72)" />
      {/* Nav links */}
      <rect x="134" y="12" width="22" height="6" rx="2" fill="rgba(255,255,255,0.28)" />
      <rect x="162" y="12" width="22" height="6" rx="2" fill="rgba(255,255,255,0.28)" />
      {/* Nav CTA button */}
      <rect x="194" y="8" width="38" height="14" rx="5" fill={accent} />

      {/* ── Hero section ── */}
      <rect x="0" y="30" width="240" height="76" fill={heroBg} />
      {/* Headline lines */}
      <rect x="16" y="46" width="116" height="11" rx="3" fill={heroText} />
      <rect x="16" y="62"  width="88"  height="8"  rx="3" fill={heroTextSub} />
      <rect x="16" y="74"  width="64"  height="6"  rx="2" fill={heroTextSub} opacity="0.55" />
      {/* Primary CTA */}
      <rect x="16" y="86"  width="62"  height="16" rx="5" fill={accent} />
      {/* Ghost secondary CTA */}
      <rect x="84" y="86"  width="54"  height="16" rx="5"
        fill="none" stroke={heroText} strokeWidth="1.4" opacity="0.32" />

      {/* ── Services section ── */}
      <rect x="0" y="106" width="240" height="54" fill={sectionBg} />
      {/* Section label */}
      <rect x="16" y="112" width="56" height="7" rx="3" fill={heroText} opacity="0.52" />
      {/* Three cards */}
      <rect x="14" y="122" width="62" height="30" rx="5" fill={cardBg} />
      <rect x="89" y="122" width="62" height="30" rx="5" fill={cardBg} />
      <rect x="164" y="122" width="62" height="30" rx="5" fill={cardBg} />
      {/* Card accent bar */}
      <rect x="18" y="127" width="30" height="4" rx="2" fill={accent} opacity="0.82" />
      <rect x="93" y="127" width="30" height="4" rx="2" fill={accent} opacity="0.82" />
      <rect x="168" y="127" width="30" height="4" rx="2" fill={accent} opacity="0.82" />
      {/* Card text lines */}
      <rect x="18" y="135" width="48" height="3" rx="1.5" fill={heroText} opacity="0.24" />
      <rect x="93" y="135" width="48" height="3" rx="1.5" fill={heroText} opacity="0.24" />
      <rect x="168" y="135" width="48" height="3" rx="1.5" fill={heroText} opacity="0.24" />
      <rect x="18" y="141" width="36" height="3" rx="1.5" fill={heroText} opacity="0.14" />
      <rect x="93" y="141" width="36" height="3" rx="1.5" fill={heroText} opacity="0.14" />
      <rect x="168" y="141" width="36" height="3" rx="1.5" fill={heroText} opacity="0.14" />
    </svg>
  );
}

// ── Types ────────────────────────────────────────────────────────────────────

interface TemplateCardData {
  id:          string;
  name:        string;
  description: string;
  colors:      TemplateColors;
}

interface ChooseThemeClientProps {
  siteId:        string;
  recommendedId: string;
  templates:     TemplateCardData[];
}

// ── Main component ───────────────────────────────────────────────────────────

export default function ChooseThemeClient({
  siteId,
  recommendedId,
  templates,
}: ChooseThemeClientProps) {
  const router = useRouter();
  const [selectedId, setSelectedId]     = useState(recommendedId);
  const [isNavigating, setIsNavigating] = useState(false);

  const handleContinue = async () => {
    setIsNavigating(true);
    try {
      // Only patch if the user changed from the AI-recommended template
      if (selectedId !== recommendedId) {
        await fetch(`/api/update/${siteId}`, {
          method:  'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ template_id: selectedId }),
        });
      }
      router.push(`/preview/${siteId}`);
    } catch {
      setIsNavigating(false);
    }
  };

  return (
    <div style={{
      minHeight:      '100vh',
      background:     '#f5f4f1',
      display:        'flex',
      flexDirection:  'column',
      fontFamily:     'system-ui, -apple-system, sans-serif',
    }}>

      {/* ── Header ── */}
      <div style={{ textAlign: 'center', padding: '52px 24px 36px' }}>

        {/* "Site ready" pill */}
        <div style={{
          display:        'inline-flex',
          alignItems:     'center',
          gap:            6,
          padding:        '5px 13px',
          borderRadius:   100,
          background:     '#FFF4ED',
          border:         '1px solid #FED7AA',
          marginBottom:   18,
        }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="#E8581A" stroke="none">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          <span style={{
            fontSize:      11,
            fontWeight:    700,
            color:         '#E8581A',
            letterSpacing: '0.07em',
          }}>
            YOUR SITE IS READY
          </span>
        </div>

        <h1 style={{
          fontSize:      34,
          fontWeight:    800,
          color:         '#111',
          margin:        '0 0 10px',
          letterSpacing: '-0.03em',
          lineHeight:    1.15,
        }}>
          Pick your style
        </h1>
        <p style={{
          fontSize:     15,
          color:        '#6B7280',
          margin:       '0 auto',
          maxWidth:     400,
          lineHeight:   1.65,
        }}>
          Pick the look that fits your business. You can edit every word and photo after.
        </p>
      </div>

      {/* ── Template grid ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4" style={{
        flex:         1,
        maxWidth:     1040,
        width:        '100%',
        marginInline: 'auto',
        padding:      '0 24px 140px',
        gap:          16,
        alignContent: 'start',
      }}>
        {templates.map(t => {
          const selected    = t.id === selectedId;
          const recommended = t.id === recommendedId;

          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setSelectedId(t.id)}
              style={{
                all:           'unset',
                cursor:        'pointer',
                display:       'flex',
                flexDirection: 'column',
                borderRadius:  14,
                overflow:      'hidden',
                // Orange ring when selected, transparent border otherwise so layout doesn't shift
                border:     selected
                  ? '3px solid #E8581A'
                  : '3px solid rgba(0,0,0,0.07)',
                boxShadow:  selected
                  ? '0 0 0 3px rgba(232,88,26,0.18), 0 8px 32px rgba(0,0,0,0.12)'
                  : '0 2px 12px rgba(0,0,0,0.07)',
                transition:    'border-color 0.18s ease, box-shadow 0.18s ease, transform 0.14s ease',
                background:    '#fff',
                position:      'relative',
                transform:     selected ? 'translateY(-2px)' : 'none',
              }}
            >

              {/* Selected checkmark */}
              {selected && (
                <div style={{
                  position:        'absolute',
                  top:             10,
                  right:           10,
                  zIndex:          2,
                  width:           24,
                  height:          24,
                  borderRadius:    '50%',
                  background:      '#E8581A',
                  display:         'flex',
                  alignItems:      'center',
                  justifyContent:  'center',
                  boxShadow:       '0 2px 8px rgba(232,88,26,0.4)',
                }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                    stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
              )}

              {/* Mini site preview */}
              <div style={{ pointerEvents: 'none', lineHeight: 0, flexShrink: 0 }}>
                <MiniSitePreview {...t.colors} />
              </div>

              {/* One-line tagline */}
              <div style={{
                padding:    '8px 10px 10px',
                background: '#fff',
                fontSize:   11,
                color:      '#6B7280',
                lineHeight: 1.4,
                textAlign:  'center',
              }}>
                {t.description}
              </div>

            </button>
          );
        })}
      </div>

      {/* ── Sticky bottom CTA ── */}
      <div style={{
        position:        'fixed',
        bottom:          0,
        left:            0,
        right:           0,
        zIndex:          50,
        padding:         '12px 16px',
        background:      'rgba(245,244,241,0.94)',
        backdropFilter:  'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        borderTop:       '1px solid rgba(0,0,0,0.07)',
        display:         'flex',
        justifyContent:  'center',
        alignItems:      'center',
      }}>
        <button
          type="button"
          onClick={handleContinue}
          disabled={isNavigating}
          className="choose-theme-cta"
          style={{
            width:         '100%',
            maxWidth:      400,
            padding:       '16px 24px',
            background:    isNavigating
              ? '#ccc'
              : 'linear-gradient(135deg, #E8581A 0%, #F97316 100%)',
            color:         '#fff',
            border:        'none',
            borderRadius:  14,
            cursor:        isNavigating ? 'wait' : 'pointer',
            fontWeight:    800,
            fontSize:      17,
            boxShadow:     isNavigating ? 'none' : '0 6px 28px rgba(232,88,26,0.30)',
            letterSpacing: '-0.01em',
            transition:    'all 0.18s ease',
          }}
        >
          {isNavigating ? 'Opening editor…' : 'Continue with this theme →'}
        </button>
      </div>
    </div>
  );
}
