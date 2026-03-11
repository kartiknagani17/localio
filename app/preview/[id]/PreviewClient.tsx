'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { BusinessData, TemplateProps } from '@/templates/types';
import { useBusinessData } from '@/hooks/useBusinessData';
import PreviewTopBar from '@/components/preview/PreviewTopBar';
import EditDashboard from '@/components/dashboard/EditDashboard';
import { TemplateLoaders } from '@/templates/clientLoaders';

export interface AvailableTemplate {
  id: string;
  name: string;
  description?: string;
}

interface PreviewClientProps {
  siteId: string;
  slug: string;
  status: 'preview' | 'published';
  currentTemplateId: string;
  availableTemplates: AvailableTemplate[];
  initialTemplateName: string;
  initialData: BusinessData;
  initialTemplateComponent: React.ComponentType<TemplateProps>;
}

const DESKTOP_BREAKPOINT = 768;
const MIN_SIDEBAR = 280;
const MAX_SIDEBAR = 600;
const DEFAULT_SIDEBAR = 360;

const PRESETS = [
  { id: 'mobile',  label: 'Mobile',  width: 390,  icon: PhoneIcon  },
  { id: 'tablet',  label: 'Tablet',  width: 768,  icon: TabletIcon },
  { id: 'desktop', label: 'Full',    width: null,  icon: MonitorIcon },
] as const;

type PresetId = typeof PRESETS[number]['id'];

// ── Tiny SVG icons ──────────────────────────────────────────────────────────

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
  const [templateId, setTemplateId] = useState(currentTemplateId);
  const [loadedTemplates, setLoadedTemplates] = useState<Record<string, React.ComponentType<TemplateProps>>>({});
  const [templateSaveError, setTemplateSaveError] = useState<string | null>(null);
  const [sidebarWidth, setSidebarWidth]     = useState(DEFAULT_SIDEBAR);
  const [isDesktop, setIsDesktop]           = useState(true);
  const [containerWidth, setContainerWidth] = useState<number | null>(null);
  const [presetId, setPresetId]             = useState<PresetId>('desktop');
  const [isDragging, setIsDragging]         = useState(false);

  const displayTemplateName = availableTemplates.find((t) => t.id === templateId)?.name ?? initialTemplateName;

  // Load template component when switching to a non-initial id
  useEffect(() => {
    if (templateId === currentTemplateId || loadedTemplates[templateId]) return;
    const loader = TemplateLoaders[templateId];
    if (!loader) return;
    loader().then((m) => {
      setLoadedTemplates((prev) => ({ ...prev, [templateId]: m.default }));
    });
  }, [templateId, currentTemplateId, loadedTemplates]);

  // Persist template_id when user selects a different template
  const handleSelectTemplate = useCallback(
    (id: string) => {
      if (id === templateId) return;
      setTemplateId(id);
      setTemplateSaveError(null);
      if (id === currentTemplateId) return;
      fetch(`/api/update/${siteId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ template_id: id }),
      })
        .then((res) => {
          if (!res.ok) return res.json().then((d) => Promise.reject(new Error(d.error ?? 'Save failed')));
        })
        .catch((err) => setTemplateSaveError(err instanceof Error ? err.message : 'Failed to save template'));
    },
    [siteId, templateId, currentTemplateId]
  );

  const activeTemplateComponent =
    templateId === currentTemplateId
      ? initialTemplateComponent
      : loadedTemplates[templateId] ?? null;
  const showTemplateLoading = templateId !== currentTemplateId && !loadedTemplates[templateId];

  const previewRef   = useRef<HTMLDivElement>(null);
  const dragging     = useRef(false);
  const startX       = useRef(0);
  const startWidth   = useRef(DEFAULT_SIDEBAR);

  const activePreset = PRESETS.find(p => p.id === presetId) ?? PRESETS[2];

  // If a preset width is set AND it's narrower than the container, use the preset width.
  // Otherwise fill the container so the template reflows with every pixel of resize.
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

  // Desktop vs mobile breakpoint
  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= DESKTOP_BREAKPOINT);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Measure preview container so the template reflows with every resize drag
  useEffect(() => {
    const el = previewRef.current;
    if (!el) return;
    const obs = new ResizeObserver(() => setContainerWidth(el.clientWidth));
    obs.observe(el);
    setContainerWidth(el.clientWidth);
    return () => obs.disconnect();
  // sidebarWidth intentionally excluded: the ResizeObserver fires automatically
  // when the preview pane width changes due to dragging, so reconnecting on every
  // drag pixel would thrash without benefit.
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
      `}</style>

      {/*
        DRAG OVERLAY
        A fixed fullscreen transparent div shown only while the resize handle
        is being dragged. It sits above everything (z-index 9999) and carries
        cursor: col-resize so the drag cursor is consistent even when the
        pointer moves over the template or the sidebar.
        pointer-events is set to none so it doesn't interfere with mouseup
        on the document.
      */}
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

      <div className="flex flex-col h-screen overflow-hidden" style={{ background: '#f1f3f5' }}>

        {/* ── Top bar (editor chrome) ─────────────────────────────────── */}
        <div data-ec>
          <PreviewTopBar
            siteId={siteId}
            slug={slug}
            status={status}
            templateName={displayTemplateName}
            businessName={data.name}
          />
        </div>

        {/* ── Template strip (horizontal scroll) ───────────────────────── */}
        <div data-ec className="shrink-0 overflow-x-auto border-b border-gray-200 bg-white">
          <div className="flex items-center gap-2 px-3 py-2 min-w-0">
            {availableTemplates.map((t) => {
              const active = t.id === templateId;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => handleSelectTemplate(t.id)}
                  title={t.description}
                  className={`shrink-0 px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                    active
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {t.name}
                </button>
              );
            })}
          </div>
          {templateSaveError && (
            <p className="px-3 pb-2 text-xs text-red-600">{templateSaveError}</p>
          )}
        </div>

        {/* ── Viewport preset bar (desktop only) ─────────────────────── */}
        {isDesktop && (
          <div
            data-ec
            className="flex items-center justify-center gap-1.5 px-4 py-2 bg-white border-b border-gray-200 shrink-0"
          >
            {PRESETS.map(preset => {
              const Icon    = preset.icon;
              const active  = presetId === preset.id;
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

            {/* Live viewport width readout */}
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

          {/* ── Preview pane ─────────────────────────────────────────── */}
          <div
            ref={previewRef}
            className="flex-1 min-w-0 overflow-auto flex flex-col items-center"
            style={{ background: '#e5e7eb' }}
          >
            {/* Inner frame: constrained width + optional device shadow */}
            <div
              style={{
                width: effectiveWidth != null ? `${effectiveWidth}px` : '100%',
                maxWidth: '100%',
                minHeight: '100%',
                /* translateZ(0) makes position:fixed children inside the template
                   be positioned relative to this element instead of the viewport,
                   preventing the template's sticky nav from overlapping the editor. */
                transform: 'translateZ(0)',
                /* container-type: inline-size lets templates use @container queries
                   that respond to THIS element's width (390 / 768 / full) rather
                   than the browser viewport, so mobile preview actually goes mobile. */
                containerType: 'inline-size',
                background: '#fff',
                flexShrink: 0,
                ...(isFramed
                  ? {
                      marginTop: 24,
                      marginBottom: 24,
                      borderRadius: 10,
                      boxShadow: '0 8px 40px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.08)',
                      overflow: 'hidden',
                    }
                  : {}),
              }}
            >
              {showTemplateLoading && (
                <div className="flex items-center justify-center min-h-[200px] text-gray-500 text-sm">
                  Loading theme…
                </div>
              )}
              {!showTemplateLoading && activeTemplateComponent && (() => {
                const Resolved = activeTemplateComponent;
                return <Resolved businessData={data} isPreview={true} />;
              })()}
              {!showTemplateLoading && !activeTemplateComponent && (
                <div className="flex items-center justify-center min-h-[200px] text-gray-500 text-sm">
                  Theme not available
                </div>
              )}
            </div>
          </div>

          {/* ── Resize handle (desktop only) ──────────────────────────── */}
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
                  width: 16,
                  background: isDragging ? '#818cf8' : '#d1d5db',
                  cursor: 'col-resize',
                  zIndex: 10,
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = '#a5b4fc'; }}
                onMouseLeave={e => { if (!isDragging) (e.currentTarget as HTMLDivElement).style.background = '#d1d5db'; }}
              >
                {/* Grip lines — 6 dots in 2 columns */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, pointerEvents: 'none' }}>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      style={{
                        width: 3, height: 3, borderRadius: '50%',
                        background: isDragging ? '#fff' : '#6b7280',
                        transition: 'background 0.15s',
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* ── Editor sidebar ──────────────────────────────────────── */}
              <div
                data-ec
                className="flex flex-col overflow-hidden bg-white border-l border-gray-200 shrink-0"
                style={{ width: sidebarWidth }}
              >
                <EditDashboard {...dashboardProps} />
              </div>
            </>
          )}

          {/* Mobile: bottom sheet (EditDashboard renders its own UI in this case) */}
          {!isDesktop && <EditDashboard {...dashboardProps} />}
        </div>
      </div>
    </>
  );
}
