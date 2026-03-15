'use client';
import { useState, useEffect, useCallback } from 'react';
import Button from '@/components/ui/Button';
import PublishFlowDialog from '@/components/preview/PublishFlowDialog';

interface PreviewTopBarProps {
  siteId:            string;
  slug:              string;
  status:            'preview' | 'published';
  templateName:      string;
  businessName:      string;
  isPreviewMode:     boolean;
  hasMadeChanges:    boolean;
  isSaving:          boolean;
  onTogglePreview:   () => void;
  onPublishChanges:  () => Promise<void>;
}

export default function PreviewTopBar({
  siteId,
  slug,
  status,
  templateName,
  businessName,
  isPreviewMode,
  hasMadeChanges,
  isSaving,
  onTogglePreview,
  onPublishChanges,
}: PreviewTopBarProps) {
  const [showPublishDialog, setShowPublishDialog] = useState(false);
  const [publishedUrl, setPublishedUrl]           = useState<string | null>(null);

  // "Publish Changes" button state
  const [publishing, setPublishing]     = useState(false);
  const [justPublished, setJustPublished] = useState(false);

  // Leave-page confirmation dialog
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);
  const [pendingUrl, setPendingUrl]           = useState<string | null>(null);

  const domain      = process.env.NEXT_PUBLIC_SITE_DOMAIN ?? 'localio.live';
  const isPublished = status === 'published' || !!publishedUrl;
  const liveUrl     = publishedUrl ?? (status === 'published' ? `https://${domain}/${slug}` : null);

  const F = "var(--font-jakarta, 'Plus Jakarta Sans', sans-serif)";

  /* ── "Publish Changes" click ──────────────────────────────────────────── */
  const handlePublishChangesClick = useCallback(async () => {
    setPublishing(true);
    await onPublishChanges();
    setPublishing(false);
    setJustPublished(true);
    setTimeout(() => setJustPublished(false), 2500);
  }, [onPublishChanges]);

  /* ── beforeunload — warn on browser close/refresh ────────────────────── */
  useEffect(() => {
    if (!isPublished || !hasMadeChanges) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [isPublished, hasMadeChanges]);

  /* ── Dashboard link intercept ────────────────────────────────────────── */
  const handleDashboardClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isPublished && hasMadeChanges) {
      e.preventDefault();
      setPendingUrl('/dashboard');
      setShowLeaveDialog(true);
    }
  }, [isPublished, hasMadeChanges]);

  /* ── Leave dialog actions ────────────────────────────────────────────── */
  const handlePublishAndLeave = useCallback(async () => {
    setPublishing(true);
    await onPublishChanges();
    setPublishing(false);
    setShowLeaveDialog(false);
    if (pendingUrl) window.location.href = pendingUrl;
  }, [onPublishChanges, pendingUrl]);

  const handleDiscardAndLeave = useCallback(() => {
    setShowLeaveDialog(false);
    if (pendingUrl) window.location.href = pendingUrl;
  }, [pendingUrl]);

  /* ── Publish button (shared between normal + preview overlay) ─────────── */
  const renderPublishButton = (inPreviewOverlay = false) => {
    const hiddenStyle = !inPreviewOverlay && isPreviewMode
      ? { opacity: 0, pointerEvents: 'none' as const, transition: 'opacity 0.25s ease' }
      : { opacity: 1, pointerEvents: 'auto' as const, transition: 'opacity 0.25s ease' };

    // Not published yet → original "Publish" button
    if (!isPublished) {
      return (
        <Button onClick={() => setShowPublishDialog(true)} style={{ flexShrink: 0, ...hiddenStyle }}>
          Publish
        </Button>
      );
    }

    // Published + has unsaved/in-flight changes → orange "Publish Changes"
    if (hasMadeChanges || isSaving) {
      const label = publishing
        ? 'Publishing…'
        : justPublished
          ? '✓ Published!'
          : isSaving && !publishing
            ? 'Saving…'
            : 'Publish Changes';

      return (
        <button
          onClick={!publishing ? handlePublishChangesClick : undefined}
          disabled={publishing}
          style={{
            flexShrink: 0, display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '8px 16px',
            background: justPublished ? '#22C55E' : '#F97316',
            color: '#fff', border: 'none', borderRadius: 10,
            fontSize: 13, fontWeight: 700,
            cursor: publishing ? 'default' : 'pointer',
            fontFamily: F,
            ...hiddenStyle,
          }}
          onMouseEnter={(e) => {
            if (!publishing && !justPublished)
              (e.currentTarget as HTMLButtonElement).style.background = '#EA6C0A';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background =
              justPublished ? '#22C55E' : '#F97316';
          }}
        >
          {publishing ? (
            <span style={{
              width: 12, height: 12,
              border: '2px solid rgba(255,255,255,0.5)', borderTopColor: '#fff',
              borderRadius: '50%', animation: 'spin 0.7s linear infinite',
              display: 'inline-block', flexShrink: 0,
            }} />
          ) : (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              {justPublished
                ? <polyline points="20 6 9 17 4 12"/>
                : <><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></>
              }
            </svg>
          )}
          {label}
        </button>
      );
    }

    // Published, no pending changes → green "✓ Published" (disabled)
    return (
      <Button
        disabled
        style={{ flexShrink: 0, background: '#22C55E', ...hiddenStyle }}
      >
        ✓ Published
      </Button>
    );
  };

  return (
    <>
      {/* ── Leave-page confirmation dialog ─────────────────────────────── */}
      {showLeaveDialog && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 2000,
          background: 'rgba(0,0,0,0.45)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 16, backdropFilter: 'blur(3px)', fontFamily: F,
        }}>
          <div style={{
            background: '#fff', borderRadius: 20,
            padding: '28px 28px 24px', maxWidth: 400, width: '100%',
            boxShadow: '0 24px 80px rgba(0,0,0,0.25)',
          }}>
            <div style={{
              width: 44, height: 44, background: '#FFF7ED', borderRadius: 12,
              display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16,
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </div>

            <h3 style={{ margin: '0 0 8px', fontSize: 17, fontWeight: 800, color: '#111', letterSpacing: '-0.02em' }}>
              Unpublished changes
            </h3>
            <p style={{ margin: '0 0 24px', fontSize: 14, color: '#6B7280', lineHeight: 1.6 }}>
              You&apos;ve made changes that haven&apos;t been published yet. Publish them now, or discard and leave.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button
                onClick={handlePublishAndLeave}
                disabled={publishing}
                style={{
                  width: '100%', padding: '12px 0',
                  background: publishing ? '#F97316cc' : '#F97316',
                  color: '#fff', border: 'none', borderRadius: 12,
                  fontSize: 14, fontWeight: 700,
                  cursor: publishing ? 'default' : 'pointer',
                  fontFamily: F,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => { if (!publishing) (e.currentTarget as HTMLButtonElement).style.background = '#EA6C0A'; }}
                onMouseLeave={(e) => { if (!publishing) (e.currentTarget as HTMLButtonElement).style.background = '#F97316'; }}
              >
                {publishing && (
                  <span style={{
                    width: 14, height: 14,
                    border: '2px solid rgba(255,255,255,0.5)', borderTopColor: '#fff',
                    borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block',
                  }} />
                )}
                {publishing ? 'Publishing…' : 'Publish & Leave'}
              </button>

              <button
                onClick={handleDiscardAndLeave}
                disabled={publishing}
                style={{
                  width: '100%', padding: '12px 0',
                  background: '#F5F5F3', color: '#374151',
                  border: 'none', borderRadius: 12,
                  fontSize: 14, fontWeight: 600, cursor: 'pointer',
                  fontFamily: F, transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#EBEBEB'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#F5F5F3'; }}
              >
                Discard &amp; Leave
              </button>

              <button
                onClick={() => setShowLeaveDialog(false)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: 13, color: '#9CA3AF', fontFamily: F, padding: '4px 0',
                }}
              >
                Cancel — keep editing
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Main top bar ────────────────────────────────────────────────── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 40,
        background: '#fff', borderBottom: '1px solid #E5E7EB',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        height: 54, display: 'flex', alignItems: 'center',
        padding: '0 16px', gap: 10, fontFamily: F, overflow: 'hidden',
      }}>

        {/* Dashboard button */}
        <a
          href="/dashboard"
          onClick={handleDashboardClick}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '7px 14px', background: '#F3F4F6',
            border: '1px solid #E5E7EB', borderRadius: 10,
            fontSize: 13, fontWeight: 600, color: '#374151',
            textDecoration: 'none', flexShrink: 0,
            opacity: isPreviewMode ? 0 : 1, transition: 'all 0.25s ease',
            pointerEvents: isPreviewMode ? 'none' : 'auto',
            position: isPreviewMode ? 'absolute' : 'relative',
            fontFamily: F,
          }}
          onMouseEnter={(e) => { if (!isPreviewMode) (e.currentTarget as HTMLAnchorElement).style.background = '#E5E7EB'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = '#F3F4F6'; }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
          </svg>
          Dashboard
        </a>

        <div style={{ flex: 1 }} />

        {/* Status URL pill */}
        <span style={{
          fontSize: 12, fontFamily: 'monospace', display: 'none',
          opacity: isPreviewMode ? 0 : 1, transition: 'opacity 0.3s ease',
          pointerEvents: isPreviewMode ? 'none' : 'auto',
        }} className="preview-url-pill">
          {!isPublished && (
            <span style={{
              marginRight: 5, padding: '2px 6px',
              background: '#FEF3C7', color: '#92400E',
              borderRadius: 6, fontSize: 10, fontWeight: 700,
            }}>Draft</span>
          )}
          <span style={{ color: isPublished ? '#16A34A' : '#9CA3AF' }}>
            {isPublished && liveUrl ? liveUrl.replace('https://', '') : `draft — localio.live/${slug}`}
          </span>
        </span>

        {/* Preview button */}
        <button
          onClick={onTogglePreview}
          title="Preview as visitor"
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '7px 14px',
            background: isPreviewMode ? 'transparent' : '#F3F4F6',
            border: isPreviewMode ? 'none' : '1px solid #E5E7EB',
            borderRadius: 10, fontSize: 13, fontWeight: 600,
            color: isPreviewMode ? 'transparent' : '#374151',
            cursor: 'pointer', fontFamily: F,
            transition: 'all 0.25s ease',
            pointerEvents: isPreviewMode ? 'none' : 'auto',
            flexShrink: 0,
          }}
          onMouseEnter={(e) => { if (!isPreviewMode) (e.currentTarget as HTMLButtonElement).style.background = '#E5E7EB'; }}
          onMouseLeave={(e) => { if (!isPreviewMode) (e.currentTarget as HTMLButtonElement).style.background = '#F3F4F6'; }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
          Preview
        </button>

        {renderPublishButton(false)}

        {/* ── PREVIEW MODE overlay ─────────────────────────────────────── */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center',
          padding: '0 16px', gap: 12,
          opacity: isPreviewMode ? 1 : 0,
          pointerEvents: isPreviewMode ? 'auto' : 'none',
          transition: 'opacity 0.3s ease',
        }}>
          <button
            onClick={onTogglePreview}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '7px 16px', background: '#111', color: '#fff',
              border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 700,
              cursor: 'pointer', fontFamily: F, transition: 'background 0.15s', flexShrink: 0,
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#333'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#111'; }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
            </svg>
            Exit Preview
          </button>

          <span style={{ fontSize: 13, color: '#9CA3AF', fontStyle: 'italic' }}>
            Previewing as a visitor — {businessName}
          </span>

          <div style={{ flex: 1 }} />

          {renderPublishButton(true)}
        </div>
      </header>

      {/* Publish dialog (first-time publish for unpublished sites) */}
      <PublishFlowDialog
        isOpen={showPublishDialog}
        onClose={() => setShowPublishDialog(false)}
        siteId={siteId}
        businessName={businessName}
        slug={slug}
        onPublished={(url) => { setPublishedUrl(url); }}
      />

      <style>{`
        @media (min-width: 600px) {
          .preview-url-pill { display: inline-flex !important; align-items: center; }
        }
      `}</style>
    </>
  );
}
