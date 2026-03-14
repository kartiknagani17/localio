'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { BusinessData, TemplateProps } from '@/templates/types';
import { useBusinessData } from '@/hooks/useBusinessData';
import PreviewTopBar from '@/components/preview/PreviewTopBar';
import EditDashboard from '@/components/dashboard/EditDashboard';
import { TemplateLoaders } from '@/templates/clientLoaders';

/* ── Types ──────────────────────────────────────────────────────────────── */

export interface TemplateColors {
  bg:     string;
  nav:    string;
  accent: string;
  dark:   boolean;
}

export interface AvailableTemplate {
  id:           string;
  name:         string;
  description?: string;
  colors?:      TemplateColors;
}

interface PreviewClientProps {
  siteId:                   string;
  slug:                     string;
  status:                   'preview' | 'published';
  currentTemplateId:        string;
  availableTemplates:       AvailableTemplate[];
  initialTemplateName:      string;
  initialData:              BusinessData;
  initialTemplateComponent: React.ComponentType<TemplateProps>;
}

/* ── Constants ──────────────────────────────────────────────────────────── */

const DESKTOP_BREAKPOINT = 768;
const MIN_SIDEBAR        = 280;
const MAX_SIDEBAR        = 600;
const DEFAULT_SIDEBAR    = 360;

const PRESETS = [
  { id: 'mobile',  label: 'Mobile',  width: 390,  icon: PhoneIcon  },
  { id: 'tablet',  label: 'Tablet',  width: 768,  icon: TabletIcon },
  { id: 'desktop', label: 'Full',    width: null,  icon: MonitorIcon },
] as const;

type PresetId = typeof PRESETS[number]['id'];

/* ── Tiny SVG icons ─────────────────────────────────────────────────────── */

function PhoneIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="2" />
      <line x1="12" y1="18" x2="12.01" y2="18" />
    </svg>
  );
}

function TabletIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <line x1="12" y1="18" x2="12.01" y2="18" />
    </svg>
  );
}

function MonitorIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  );
}

/* ── Theme thumbnail card ───────────────────────────────────────────────── */

const THUMB_W = 148;
const THUMB_H = 96;
const INNER_W = 1280;
const SCALE   = THUMB_W / INNER_W;

function ThemeCard({
  template,
  active,
  onClick,
  component,
  businessData,
}: {
  template:     AvailableTemplate;
  active:       boolean;
  onClick:      () => void;
  component:    React.ComponentType<TemplateProps> | null;
  businessData: BusinessData;
}) {
  const c = template.colors;
  const Comp = component;
  return (
    <button
      type="button"
      onClick={onClick}
      title={template.description ?? template.name}
      style={{
        flexShrink:    0,
        display:       'flex',
        flexDirection: 'column',
        gap:           5,
        alignItems:    'center',
        padding:       '6px 6px 8px',
        borderRadius:  12,
        border:        active ? '2.5px solid #4F46E5' : '2px solid transparent',
        background:    active ? '#EEF2FF' : 'transparent',
        cursor:        'pointer',
        transition:    'all 0.15s',
      }}
      onMouseEnter={(e) => { if (!active) (e.currentTarget as HTMLButtonElement).style.background = '#F3F4F6'; }}
      onMouseLeave={(e) => { if (!active) (e.currentTarget as HTMLButtonElement).style.background = active ? '#EEF2FF' : 'transparent'; }}
    >
      {/* Thumbnail */}
      <div style={{
        width:        THUMB_W,
        height:       THUMB_H,
        borderRadius: 8,
        overflow:     'hidden',
        border:       '1px solid rgba(0,0,0,0.08)',
        flexShrink:   0,
        background:   c?.bg ?? '#F3F4F6',
        position:     'relative',
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
      {/* Name */}
      <span style={{
        fontSize:   11,
        fontWeight: active ? 700 : 500,
        color:      active ? '#4F46E5' : '#374151',
        whiteSpace: 'nowrap',
        lineHeight: 1.2,
      }}>
        {template.name}
      </span>
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
  template:     AvailableTemplate;
  businessData: BusinessData;
  component:    React.ComponentType<TemplateProps> | null;
  loading:      boolean;
  onUse:        () => void;
  onClose:      () => void;
}) {
  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const c = template.colors;

  return (
    <div
      style={{
        position:   'fixed',
        inset:      0,
        zIndex:     1000,
        background: 'rgba(0,0,0,0.55)',
        display:    'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding:    '16px',
        backdropFilter: 'blur(4px)',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Modal chrome */}
      <div style={{
        width:     '100%',
        maxWidth:  1100,
        flex:      1,
        display:   'flex',
        flexDirection: 'column',
        background: '#fff',
        borderRadius: 16,
        overflow:  'hidden',
        boxShadow: '0 24px 80px rgba(0,0,0,0.35)',
        minHeight: 0,
      }}>
        {/* Header bar */}
        <div style={{
          display:      'flex',
          alignItems:   'center',
          gap:          12,
          padding:      '12px 20px',
          borderBottom: '1px solid #E5E7EB',
          background:   '#FAFAFA',
          flexShrink:   0,
        }}>
          {/* Colour dots */}
          {c && (
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <div style={{ width: 14, height: 14, borderRadius: '50%', background: c.bg,     border: '1px solid rgba(0,0,0,0.12)' }} title="Background" />
              <div style={{ width: 14, height: 14, borderRadius: '50%', background: c.nav,    border: '1px solid rgba(0,0,0,0.12)' }} title="Nav" />
              <div style={{ width: 14, height: 14, borderRadius: '50%', background: c.accent, border: '1px solid rgba(0,0,0,0.12)' }} title="Accent" />
            </div>
          )}

          <div>
            <span style={{ fontWeight: 700, fontSize: 15, color: '#111' }}>{template.name}</span>
            {template.description && (
              <span style={{ marginLeft: 8, fontSize: 13, color: '#6B7280' }}>{template.description}</span>
            )}
          </div>

          <div style={{ flex: 1 }} />

          {/* Use this theme */}
          <button
            onClick={onUse}
            style={{
              padding:      '9px 20px',
              background:   '#4F46E5',
              color:        '#fff',
              border:       'none',
              borderRadius: 10,
              fontSize:     13,
              fontWeight:   700,
              cursor:       'pointer',
              transition:   'background 0.15s',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#4338CA'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#4F46E5'; }}
          >
            Use This Theme
          </button>

          {/* Close */}
          <button
            onClick={onClose}
            style={{
              display:      'flex',
              alignItems:   'center',
              justifyContent: 'center',
              width:        34,
              height:       34,
              background:   '#F3F4F6',
              border:       'none',
              borderRadius: 8,
              cursor:       'pointer',
              color:        '#374151',
              transition:   'background 0.15s',
            }}
            title="Close preview"
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#E5E7EB'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#F3F4F6'; }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Template render area (scrollable) */}
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
                border: '2.5px solid #4F46E5',
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
              <div style={{
                background:    '#fff',
                transform:     'translateZ(0)',
                containerType: 'inline-size',
              }}>
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

export default function PreviewClient({
  siteId,
  slug,
  status,
  currentTemplateId,
  availableTemplates,
  initialTemplateName,
  initialData,
  initialTemplateComponent,
}: PreviewClientProps) {
  const { data, update, isSaving, lastSaved, saveError } = useBusinessData(siteId, initialData);

  // Active template (in-use for the live preview pane)
  const [templateId, setTemplateId]         = useState(currentTemplateId);
  const [loadedTemplates, setLoadedTemplates] = useState<Record<string, React.ComponentType<TemplateProps>>>({});
  const [templateSaveError, setTemplateSaveError] = useState<string | null>(null);

  // Theme preview modal state
  const [previewingId, setPreviewingId]     = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  // Full-screen preview mode (visitor preview)
  const [isPreviewMode, setIsPreviewMode]   = useState(false);

  // Layout
  const [sidebarWidth, setSidebarWidth]     = useState(DEFAULT_SIDEBAR);
  const [isDesktop, setIsDesktop]           = useState(true);
  const [containerWidth, setContainerWidth] = useState<number | null>(null);
  const [presetId, setPresetId]             = useState<PresetId>('desktop');
  const [isDragging, setIsDragging]         = useState(false);

  const displayTemplateName = availableTemplates.find((t) => t.id === templateId)?.name ?? initialTemplateName;

  /* ── Load a template component by id (lazy) ──────────────────────────── */
  const ensureLoaded = useCallback((id: string): Promise<React.ComponentType<TemplateProps>> => {
    // Already the initial one
    if (id === currentTemplateId) {
      return Promise.resolve(initialTemplateComponent);
    }
    // Already lazily loaded
    if (loadedTemplates[id]) {
      return Promise.resolve(loadedTemplates[id]);
    }
    const loader = TemplateLoaders[id];
    if (!loader) return Promise.reject(new Error(`No loader for ${id}`));
    return loader().then((m) => {
      setLoadedTemplates((prev) => ({ ...prev, [id]: m.default }));
      return m.default;
    });
  }, [currentTemplateId, initialTemplateComponent, loadedTemplates]);

  /* ── Preload template when switching active template ─────────────────── */
  useEffect(() => {
    if (templateId === currentTemplateId || loadedTemplates[templateId]) return;
    ensureLoaded(templateId).catch(() => {});
  }, [templateId, currentTemplateId, loadedTemplates, ensureLoaded]);

  /* ── Preload all available templates for thumbnails ──────────────────── */
  useEffect(() => {
    availableTemplates.forEach((t) => {
      ensureLoaded(t.id).catch(() => {});
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Open theme preview modal ────────────────────────────────────────── */
  const openPreview = useCallback((id: string) => {
    setPreviewingId(id);
    // If not yet loaded, trigger load and show spinner
    if (id !== currentTemplateId && !loadedTemplates[id]) {
      setPreviewLoading(true);
      ensureLoaded(id).then(() => setPreviewLoading(false)).catch(() => setPreviewLoading(false));
    } else {
      setPreviewLoading(false);
    }
  }, [currentTemplateId, loadedTemplates, ensureLoaded]);

  const closePreview = useCallback(() => setPreviewingId(null), []);

  /* ── "Use this theme" from modal ─────────────────────────────────────── */
  const handleSelectTemplate = useCallback((id: string) => {
    setPreviewingId(null);
    if (id === templateId) return;
    setTemplateId(id);
    setTemplateSaveError(null);
    if (id === currentTemplateId) return;
    fetch(`/api/update/${siteId}`, {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ template_id: id }),
    })
      .then((res) => {
        if (!res.ok) return res.json().then((d) => Promise.reject(new Error(d.error ?? 'Save failed')));
      })
      .catch((err) => setTemplateSaveError(err instanceof Error ? err.message : 'Failed to save template'));
  }, [siteId, templateId, currentTemplateId]);

  /* ── Active component for main preview pane ──────────────────────────── */
  const activeTemplateComponent =
    templateId === currentTemplateId
      ? initialTemplateComponent
      : loadedTemplates[templateId] ?? null;
  const showTemplateLoading = templateId !== currentTemplateId && !loadedTemplates[templateId];

  /* ── Resize drag handle ──────────────────────────────────────────────── */
  const previewRef   = useRef<HTMLDivElement>(null);
  const dragging     = useRef(false);
  const startX       = useRef(0);
  const startWidth   = useRef(DEFAULT_SIDEBAR);

  const activePreset = PRESETS.find(p => p.id === presetId) ?? PRESETS[2];

  const effectiveWidth: number | null =
    activePreset.width !== null &&
    containerWidth !== null &&
    activePreset.width < containerWidth
      ? activePreset.width
      : containerWidth;

  const isFramed =
    activePreset.width !== null &&
    containerWidth !== null &&
    activePreset.width < containerWidth;

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= DESKTOP_BREAKPOINT);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    const el = previewRef.current;
    if (!el) return;
    const obs = new ResizeObserver(() => setContainerWidth(el.clientWidth));
    obs.observe(el);
    setContainerWidth(el.clientWidth);
    return () => obs.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDesktop]);

  const onHandleMouseDown = useCallback((e: React.MouseEvent) => {
    dragging.current   = true;
    startX.current     = e.clientX;
    startWidth.current = sidebarWidth;
    setIsDragging(true);
    e.preventDefault();
  }, [sidebarWidth]);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!dragging.current) return;
      const delta = startX.current - e.clientX;
      const next  = Math.min(MAX_SIDEBAR, Math.max(MIN_SIDEBAR, startWidth.current + delta));
      setSidebarWidth(next);
    };
    const onMouseUp = () => {
      if (!dragging.current) return;
      dragging.current = false;
      setIsDragging(false);
    };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup',  onMouseUp);
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup',  onMouseUp);
    };
  }, []);

  /* ── Previewing template component ───────────────────────────────────── */
  const previewingTemplate = availableTemplates.find(t => t.id === previewingId) ?? null;
  const previewingComponent: React.ComponentType<TemplateProps> | null = previewingId
    ? (previewingId === currentTemplateId
        ? initialTemplateComponent
        : loadedTemplates[previewingId] ?? null)
    : null;

  const dashboardProps = { siteId, data, update, isSaving, lastSaved, saveError };

  return (
    <>
      {/*
        CURSOR FIX
        The CarDetailing template (and potentially others) inject:
            * { cursor: none !important; }
        globally to power a custom cursor effect. Since templates render
        inside the page (not an iframe) this hides the native cursor
        throughout the editor too. We win the specificity battle by using
        an attribute selector (0,1,0) which beats the universal selector (0,0,0)
        even when both carry !important.
      */}
      <style suppressHydrationWarning>{`
        [data-ec] { cursor: auto !important; }
        [data-ec] * { cursor: auto !important; }
        [data-ec] button,
        [data-ec] a,
        [data-ec] label,
        [data-ec] select { cursor: pointer !important; }
        [data-ec] input[type="text"],
        [data-ec] input[type="email"],
        [data-ec] input[type="url"],
        [data-ec] input[type="number"],
        [data-ec] textarea { cursor: text !important; }
        [data-ec] input[type="range"] { cursor: ew-resize !important; }
        [data-ec] [data-resize-handle] { cursor: col-resize !important; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      {/* DRAG OVERLAY */}
      {isDragging && (
        <div
          aria-hidden
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            cursor: 'col-resize',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* THEME PREVIEW MODAL */}
      {previewingId && previewingTemplate && (
        <ThemePreviewModal
          template={previewingTemplate}
          businessData={data}
          component={previewingComponent}
          loading={previewLoading}
          onUse={() => handleSelectTemplate(previewingId)}
          onClose={closePreview}
        />
      )}

      <div className="flex flex-col h-screen overflow-hidden" style={{ background: '#f1f3f5' }}>

        {/* ── Top bar ──────────────────────────────────────────────────── */}
        <div data-ec>
          <PreviewTopBar
            siteId={siteId}
            slug={slug}
            status={status}
            templateName={displayTemplateName}
            businessName={data.name}
            isPreviewMode={isPreviewMode}
            onTogglePreview={() => setIsPreviewMode(m => !m)}
          />
        </div>

        {/* ── Theme selector strip — hides smoothly in preview mode ─────── */}
        <div data-ec className="shrink-0 border-b border-gray-200 bg-white"
          style={{
            overflow:   'hidden',
            maxHeight:  isPreviewMode ? 0 : 140,
            opacity:    isPreviewMode ? 0 : 1,
            transition: 'max-height 0.4s cubic-bezier(0.4,0,0.2,1), opacity 0.3s ease',
          }}
        >
          <div style={{
            display:    'flex',
            alignItems: 'center',
            gap:        4,
            padding:    '6px 12px',
            overflowX:  'auto',
          }}>
            {/* Label */}
            <span style={{
              fontSize:   11,
              fontWeight: 600,
              color:      '#9CA3AF',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              whiteSpace: 'nowrap',
              marginRight: 6,
              flexShrink: 0,
            }}>
              Themes
            </span>

            {availableTemplates.map((t) => (
              <ThemeCard
                key={t.id}
                template={t}
                active={t.id === templateId}
                onClick={() => openPreview(t.id)}
                component={
                  t.id === currentTemplateId
                    ? initialTemplateComponent
                    : (loadedTemplates[t.id] ?? null)
                }
                businessData={data}
              />
            ))}
          </div>

          {templateSaveError && (
            <p style={{ margin: 0, padding: '0 12px 8px', fontSize: 12, color: '#DC2626' }}>
              {templateSaveError}
            </p>
          )}
        </div>

        {/* ── Viewport preset bar (desktop only) — hides in preview mode ── */}
        {isDesktop && (
          <div
            data-ec
            className="flex items-center justify-center gap-1.5 px-4 py-2 bg-white border-b border-gray-200 shrink-0"
            style={{
              overflow:   'hidden',
              maxHeight:  isPreviewMode ? 0 : 52,
              opacity:    isPreviewMode ? 0 : 1,
              transition: 'max-height 0.4s cubic-bezier(0.4,0,0.2,1), opacity 0.3s ease 0.05s',
            }}
          >
            {PRESETS.map(preset => {
              const Icon   = preset.icon;
              const active = presetId === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => setPresetId(preset.id)}
                  title={`${preset.label}${preset.width ? ` — ${preset.width}px` : ' — fills preview'}`}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all select-none ${
                    active
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Icon size={13} />
                  <span>{preset.label}</span>
                  {preset.width !== null && (
                    <span className={`font-mono tabular-nums ${active ? 'text-indigo-200' : 'text-gray-400'}`}>
                      {preset.width}
                    </span>
                  )}
                </button>
              );
            })}

            <span
              className="ml-3 font-mono tabular-nums text-xs text-gray-400 select-none min-w-[56px] text-right"
              title="Current preview viewport width"
            >
              {effectiveWidth != null ? `${effectiveWidth}px` : ''}
            </span>
          </div>
        )}

        {/* ── Main area: preview + resize handle + sidebar ────────────── */}
        <div className="flex-1 flex overflow-hidden min-h-0">

          {/* Preview pane */}
          <div
            ref={previewRef}
            className="flex-1 min-w-0 overflow-auto flex flex-col items-center"
            style={{
              background: isPreviewMode ? '#fff' : '#e5e7eb',
              transition: 'background 0.4s ease',
            }}
          >
            <div
              style={{
                width:     effectiveWidth != null ? `${effectiveWidth}px` : '100%',
                maxWidth:  '100%',
                minHeight: '100%',
                transform: 'translateZ(0)',
                containerType: 'inline-size',
                background: '#fff',
                flexShrink: 0,
                ...(isFramed && !isPreviewMode
                  ? {
                      marginTop:    24,
                      marginBottom: 24,
                      borderRadius: 10,
                      boxShadow:    '0 8px 40px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.08)',
                      overflow:     'hidden',
                    }
                  : {}),
              }}
            >
              {showTemplateLoading && (
                <div className="flex items-center justify-center min-h-[200px] text-gray-500 text-sm gap-3">
                  <span style={{
                    width: 20, height: 20,
                    border: '2.5px solid #4F46E5',
                    borderTopColor: 'transparent',
                    borderRadius: '50%',
                    animation: 'spin 0.7s linear infinite',
                    display: 'inline-block',
                  }} />
                  Loading theme…
                </div>
              )}
              {!showTemplateLoading && activeTemplateComponent && (() => {
                const Resolved = activeTemplateComponent;
                // isPreview=false in full preview mode so the template runs without restrictions
                return <Resolved businessData={data} isPreview={!isPreviewMode} />;
              })()}
              {!showTemplateLoading && !activeTemplateComponent && (
                <div className="flex items-center justify-center min-h-[200px] text-gray-500 text-sm">
                  Theme not available
                </div>
              )}
            </div>
          </div>

          {/* Resize handle (desktop only) */}
          {isDesktop && (
            <>
              <div
                data-ec
                data-resize-handle
                role="separator"
                aria-label="Drag to resize preview"
                onMouseDown={onHandleMouseDown}
                title="Drag to resize — see how the website adapts to different screen widths"
                className="flex-shrink-0 flex items-center justify-center transition-colors group"
                style={{
                  width:      isPreviewMode ? 0 : 16,
                  overflow:   'hidden',
                  background: isDragging ? '#818cf8' : '#d1d5db',
                  cursor:     'col-resize',
                  zIndex:     10,
                  transition: 'width 0.45s cubic-bezier(0.4,0,0.2,1)',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = '#a5b4fc'; }}
                onMouseLeave={e => { if (!isDragging) (e.currentTarget as HTMLDivElement).style.background = '#d1d5db'; }}
              >
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, pointerEvents: 'none' }}>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      style={{
                        width:      3,
                        height:     3,
                        borderRadius: '50%',
                        background: isDragging ? '#fff' : '#6b7280',
                        transition: 'background 0.15s',
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Editor sidebar — smoothly slides out in preview mode */}
              <div
                data-ec
                className="flex flex-col overflow-hidden bg-white border-l border-gray-200 shrink-0"
                style={{
                  width:      isPreviewMode ? 0 : sidebarWidth,
                  opacity:    isPreviewMode ? 0 : 1,
                  transition: 'width 0.45s cubic-bezier(0.4,0,0.2,1), opacity 0.3s ease',
                }}
              >
                <EditDashboard {...dashboardProps} />
              </div>
            </>
          )}

          {/* Mobile: bottom sheet — hidden in preview mode */}
          {!isDesktop && !isPreviewMode && <EditDashboard {...dashboardProps} />}
        </div>
      </div>
    </>
  );
}
