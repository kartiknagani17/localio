'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BusinessData, TemplateProps } from '@/templates/types';
import { TemplateColors } from '@/templates/registry';
import { TemplateLoaders } from '@/templates/clientLoaders';

/* ── Types ──────────────────────────────────────────────────────────────── */

interface TemplateCardData {
  id:          string;
  name:        string;
  description: string;
  colors?:     TemplateColors;
}

interface ChooseThemeClientProps {
  siteId:        string;
  recommendedId: string;
  businessData:  BusinessData;
  templates:     TemplateCardData[];
}

/* ── Thumbnail constants ────────────────────────────────────────────────── */

const THUMB_W = 280;
const THUMB_H = 182;
const INNER_W = 1280;
const SCALE   = THUMB_W / INNER_W;

/* ── Theme card ─────────────────────────────────────────────────────────── */

function ThemeCard({
  template,
  selected,
  recommended,
  onClick,
  component,
  businessData,
}: {
  template:     TemplateCardData;
  selected:     boolean;
  recommended:  boolean;
  onClick:      () => void;
  component:    React.ComponentType<TemplateProps> | null;
  businessData: BusinessData;
}) {
  const [hovered, setHovered] = useState(false);
  const c = template.colors;
  const Comp = component;

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        all:           'unset',
        cursor:        'pointer',
        display:       'flex',
        flexDirection: 'column',
        borderRadius:  14,
        overflow:      'hidden',
        border:        selected
          ? '3px solid #E8581A'
          : hovered
          ? '3px solid rgba(0,0,0,0.2)'
          : '3px solid rgba(0,0,0,0.07)',
        boxShadow: selected
          ? '0 0 0 3px rgba(232,88,26,0.18), 0 8px 32px rgba(0,0,0,0.12)'
          : hovered
          ? '0 4px 20px rgba(0,0,0,0.12)'
          : '0 2px 12px rgba(0,0,0,0.07)',
        transition:  'border-color 0.18s ease, box-shadow 0.18s ease, transform 0.14s ease',
        background:  '#fff',
        position:    'relative',
        transform:   selected ? 'translateY(-3px)' : hovered ? 'translateY(-1px)' : 'none',
      }}
    >
      {/* Selected checkmark */}
      {selected && (
        <div style={{
          position:       'absolute',
          top:            10,
          right:          10,
          zIndex:         2,
          width:          26,
          height:         26,
          borderRadius:   '50%',
          background:     '#E8581A',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          boxShadow:      '0 2px 8px rgba(232,88,26,0.4)',
        }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
            stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
      )}

      {/* Recommended badge */}
      {recommended && !selected && (
        <div style={{
          position:      'absolute',
          top:           10,
          right:         10,
          zIndex:        2,
          padding:       '3px 8px',
          borderRadius:  100,
          background:    '#4F46E5',
          color:         '#fff',
          fontSize:      10,
          fontWeight:    700,
          letterSpacing: '0.05em',
        }}>
          BEST MATCH
        </div>
      )}

      {/* Thumbnail */}
      <div style={{
        width:      THUMB_W,
        height:     THUMB_H,
        overflow:   'hidden',
        flexShrink: 0,
        background: c?.bg ?? '#F3F4F6',
        position:   'relative',
        lineHeight: 0,
      }}>
        {Comp ? (
          <div style={{
            width:           INNER_W,
            height:          Math.round(THUMB_H / SCALE),
            transform:       `scale(${SCALE})`,
            transformOrigin: 'top left',
            containerType:   'inline-size',
            pointerEvents:   'none',
            userSelect:      'none',
          }}>
            <Comp businessData={businessData} isPreview={true} />
          </div>
        ) : (
          /* Color swatch fallback while loading */
          c ? (
            <div style={{ display: 'flex', width: '100%', height: '100%' }}>
              <div style={{ flex: 2, background: c.bg }} />
              <div style={{ flex: 1.5, background: c.nav }} />
              <div style={{ flex: 1, background: c.accent }} />
            </div>
          ) : (
            <div style={{ width: '100%', height: '100%', background: '#E5E7EB' }} />
          )
        )}
      </div>

      {/* Name + description */}
      <div style={{
        padding:    '10px 12px 12px',
        background: '#fff',
      }}>
        <div style={{
          fontSize:   13,
          fontWeight: selected ? 700 : 600,
          color:      selected ? '#E8581A' : '#111',
          marginBottom: 2,
        }}>
          {template.name}
        </div>
        <div style={{
          fontSize:   11,
          color:      '#6B7280',
          lineHeight: 1.45,
        }}>
          {template.description}
        </div>
      </div>
    </button>
  );
}

/* ── Full-screen theme preview modal ────────────────────────────────────── */

function ThemePreviewModal({
  template,
  businessData,
  component,
  loading,
  onUse,
  onClose,
}: {
  template:     TemplateCardData;
  businessData: BusinessData;
  component:    React.ComponentType<TemplateProps> | null;
  loading:      boolean;
  onUse:        () => void;
  onClose:      () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const c = template.colors;

  return (
    <div
      style={{
        position:       'fixed',
        inset:          0,
        zIndex:         1000,
        background:     'rgba(0,0,0,0.55)',
        display:        'flex',
        flexDirection:  'column',
        alignItems:     'center',
        padding:        '16px',
        backdropFilter: 'blur(4px)',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        width:         '100%',
        maxWidth:      1100,
        flex:          1,
        display:       'flex',
        flexDirection: 'column',
        background:    '#fff',
        borderRadius:  16,
        overflow:      'hidden',
        boxShadow:     '0 24px 80px rgba(0,0,0,0.35)',
        minHeight:     0,
      }}>
        {/* Header */}
        <div style={{
          display:      'flex',
          alignItems:   'center',
          gap:          12,
          padding:      '12px 20px',
          borderBottom: '1px solid #E5E7EB',
          background:   '#FAFAFA',
          flexShrink:   0,
        }}>
          {c && (
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <div style={{ width: 14, height: 14, borderRadius: '50%', background: c.bg,     border: '1px solid rgba(0,0,0,0.12)' }} />
              <div style={{ width: 14, height: 14, borderRadius: '50%', background: c.nav,    border: '1px solid rgba(0,0,0,0.12)' }} />
              <div style={{ width: 14, height: 14, borderRadius: '50%', background: c.accent, border: '1px solid rgba(0,0,0,0.12)' }} />
            </div>
          )}

          <div>
            <span style={{ fontWeight: 700, fontSize: 15, color: '#111' }}>{template.name}</span>
            {template.description && (
              <span style={{ marginLeft: 8, fontSize: 13, color: '#6B7280' }}>{template.description}</span>
            )}
          </div>

          <div style={{ flex: 1 }} />

          <button
            onClick={onUse}
            style={{
              padding:      '9px 20px',
              background:   '#E8581A',
              color:        '#fff',
              border:       'none',
              borderRadius: 10,
              fontSize:     13,
              fontWeight:   700,
              cursor:       'pointer',
            }}
          >
            Use This Theme
          </button>

          <button
            onClick={onClose}
            style={{
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
              width:          34,
              height:         34,
              background:     '#F3F4F6',
              border:         'none',
              borderRadius:   8,
              cursor:         'pointer',
              color:          '#374151',
            }}
            title="Close (Esc)"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Template render */}
        <div style={{ flex: 1, overflow: 'auto', background: '#E5E7EB' }}>
          {loading && (
            <div style={{
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
              height:         '100%',
              minHeight:      300,
              gap:            12,
              color:          '#6B7280',
              fontSize:       14,
            }}>
              <span style={{
                width: 22, height: 22,
                border: '2.5px solid #E8581A',
                borderTopColor: 'transparent',
                borderRadius: '50%',
                animation: 'spin 0.7s linear infinite',
                display: 'inline-block',
              }} />
              Loading preview…
            </div>
          )}
          {!loading && component && (() => {
            const Comp = component;
            return (
              <div style={{ background: '#fff', transform: 'translateZ(0)', containerType: 'inline-size' }}>
                <Comp businessData={businessData} isPreview={true} />
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}

/* ── Main component ─────────────────────────────────────────────────────── */

export default function ChooseThemeClient({
  siteId,
  recommendedId,
  businessData,
  templates,
}: ChooseThemeClientProps) {
  const router = useRouter();
  const [selectedId, setSelectedId]       = useState(recommendedId);
  const [loadedTemplates, setLoadedTemplates] = useState<Record<string, React.ComponentType<TemplateProps>>>({});
  const [previewingId, setPreviewingId]   = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [isNavigating, setIsNavigating]   = useState(false);

  /* ── Lazy load a template component ──────────────────────────────────── */
  const ensureLoaded = useCallback((id: string): Promise<React.ComponentType<TemplateProps>> => {
    if (loadedTemplates[id]) return Promise.resolve(loadedTemplates[id]);
    const loader = TemplateLoaders[id];
    if (!loader) return Promise.reject(new Error(`No loader for ${id}`));
    return loader().then((m) => {
      setLoadedTemplates((prev) => ({ ...prev, [id]: m.default }));
      return m.default;
    });
  }, [loadedTemplates]);

  /* ── Preload all available templates on mount ─────────────────────────── */
  useEffect(() => {
    templates.forEach((t) => { ensureLoaded(t.id).catch(() => {}); });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Open preview modal ───────────────────────────────────────────────── */
  const openPreview = useCallback((id: string) => {
    setPreviewingId(id);
    if (!loadedTemplates[id]) {
      setPreviewLoading(true);
      ensureLoaded(id)
        .then(() => setPreviewLoading(false))
        .catch(() => setPreviewLoading(false));
    } else {
      setPreviewLoading(false);
    }
  }, [loadedTemplates, ensureLoaded]);

  /* ── "Use This Theme" from modal ──────────────────────────────────────── */
  const handleUseTheme = useCallback((id: string) => {
    setSelectedId(id);
    setPreviewingId(null);
  }, []);

  /* ── Continue → save template + navigate to preview editor ───────────── */
  const handleContinue = () => {
    setIsNavigating(true);
    if (selectedId !== recommendedId) {
      fetch(`/api/update/${siteId}`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ template_id: selectedId }),
      }).catch(console.error);
    }
    router.push(`/preview/${siteId}?t=${encodeURIComponent(selectedId)}`);
  };

  const previewingTemplate = templates.find(t => t.id === previewingId) ?? null;
  const previewingComponent: React.ComponentType<TemplateProps> | null =
    previewingId ? (loadedTemplates[previewingId] ?? null) : null;

  return (
    <>
      <style suppressHydrationWarning>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      {/* Theme preview modal */}
      {previewingId && previewingTemplate && (
        <ThemePreviewModal
          template={previewingTemplate}
          businessData={businessData}
          component={previewingComponent}
          loading={previewLoading}
          onUse={() => handleUseTheme(previewingId)}
          onClose={() => setPreviewingId(null)}
        />
      )}

      <div style={{
        minHeight:     '100vh',
        background:    '#f5f4f1',
        display:       'flex',
        flexDirection: 'column',
        fontFamily:    'system-ui, -apple-system, sans-serif',
      }}>

        {/* Header */}
        <div style={{ textAlign: 'center', padding: '52px 24px 36px' }}>
          <div style={{
            display:     'inline-flex',
            alignItems:  'center',
            gap:         6,
            padding:     '5px 13px',
            borderRadius: 100,
            background:  '#FFF4ED',
            border:      '1px solid #FED7AA',
            marginBottom: 18,
          }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="#E8581A" stroke="none">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#E8581A', letterSpacing: '0.07em' }}>
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
            fontSize:   15,
            color:      '#6B7280',
            margin:     '0 auto',
            maxWidth:   400,
            lineHeight: 1.65,
          }}>
            Pick the look that fits your business. You can edit every word and photo after.
          </p>
        </div>

        {/* Template grid */}
        <div style={{
          flex:          1,
          maxWidth:      1100,
          width:         '100%',
          marginInline:  'auto',
          padding:       '0 24px 140px',
          display:       'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap:           20,
          alignContent:  'start',
        }}>
          {templates.map(t => (
            <ThemeCard
              key={t.id}
              template={t}
              selected={t.id === selectedId}
              recommended={t.id === recommendedId}
              onClick={() => openPreview(t.id)}
              component={loadedTemplates[t.id] ?? null}
              businessData={businessData}
            />
          ))}
        </div>

        {/* Sticky bottom CTA */}
        <div style={{
          position:            'fixed',
          bottom:              0,
          left:                0,
          right:               0,
          zIndex:              50,
          padding:             '12px 16px',
          background:          'rgba(245,244,241,0.94)',
          backdropFilter:      'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          borderTop:           '1px solid rgba(0,0,0,0.07)',
          display:             'flex',
          justifyContent:      'center',
          alignItems:          'center',
        }}>
          <button
            type="button"
            onClick={handleContinue}
            disabled={isNavigating}
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
    </>
  );
}
