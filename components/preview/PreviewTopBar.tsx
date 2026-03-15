'use client';
import { useState } from 'react';
import Button from '@/components/ui/Button';
import PublishFlowDialog from '@/components/preview/PublishFlowDialog';

interface PreviewTopBarProps {
  siteId:          string;
  slug:            string;
  status:          'preview' | 'published';
  templateName:    string;
  businessName:    string;
  isPreviewMode:   boolean;
  onTogglePreview: () => void;
}

export default function PreviewTopBar({
  siteId,
  slug,
  status,
  templateName,
  businessName,
  isPreviewMode,
  onTogglePreview,
}: PreviewTopBarProps) {
  const [showPublishDialog, setShowPublishDialog] = useState(false);
  const [publishedUrl, setPublishedUrl]           = useState<string | null>(null);

  const domain      = process.env.NEXT_PUBLIC_SITE_DOMAIN ?? 'localio.live';
  const isPublished = status === 'published' || !!publishedUrl;
  const liveUrl     = publishedUrl ?? (status === 'published' ? `https://${domain}/${slug}` : null);

  const F = "var(--font-jakarta, 'Plus Jakarta Sans', sans-serif)";

  return (
    <>
      {/* ── Main top bar ───────────────────────────────────────────── */}
      <header style={{
        position:   'sticky',
        top:        0,
        zIndex:     40,
        background: '#fff',
        borderBottom: '1px solid #E5E7EB',
        boxShadow:  '0 1px 4px rgba(0,0,0,0.06)',
        height:     54,
        display:    'flex',
        alignItems: 'center',
        padding:    '0 16px',
        gap:        10,
        fontFamily: F,
        overflow:   'hidden',
      }}>

        {/* ── NORMAL MODE ──────────────────────────────────────────── */}
        {/* Dashboard button */}
        <a
          href="/dashboard"
          style={{
            display:        'inline-flex',
            alignItems:     'center',
            gap:            6,
            padding:        '7px 14px',
            background:     '#F3F4F6',
            border:         '1px solid #E5E7EB',
            borderRadius:   10,
            fontSize:       13,
            fontWeight:     600,
            color:          '#374151',
            textDecoration: 'none',
            flexShrink:     0,
            opacity:        isPreviewMode ? 0 : 1,
            transition:     'all 0.25s ease',
            pointerEvents:  isPreviewMode ? 'none' : 'auto',
            position:       isPreviewMode ? 'absolute' : 'relative',
            fontFamily:     F,
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
          fontSize: 12, fontFamily: 'monospace',
          display: 'none',  /* shown via @media below */
          opacity:    isPreviewMode ? 0 : 1,
          transition: 'opacity 0.3s ease',
          pointerEvents: isPreviewMode ? 'none' : 'auto',
        }} className="preview-url-pill">
          {!isPublished && (
            <span style={{
              marginRight: 5, padding: '2px 6px',
              background: '#FEF3C7', color: '#92400E',
              borderRadius: 6, fontSize: 10, fontWeight: 700,
            }}>
              Draft
            </span>
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
            display:    'flex',
            alignItems: 'center',
            gap:        6,
            padding:    '7px 14px',
            background: isPreviewMode ? 'transparent' : '#F3F4F6',
            border:     isPreviewMode ? 'none' : '1px solid #E5E7EB',
            borderRadius: 10,
            fontSize:   13,
            fontWeight: 600,
            color:      isPreviewMode ? 'transparent' : '#374151',
            cursor:     'pointer',
            fontFamily: F,
            transition: 'all 0.25s ease',
            pointerEvents: isPreviewMode ? 'none' : 'auto',
            flexShrink: 0,
          }}
          onMouseEnter={(e) => {
            if (!isPreviewMode) (e.currentTarget as HTMLButtonElement).style.background = '#E5E7EB';
          }}
          onMouseLeave={(e) => {
            if (!isPreviewMode) (e.currentTarget as HTMLButtonElement).style.background = '#F3F4F6';
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
          Preview
        </button>

        {/* Publish button */}
        <Button
          onClick={() => { if (!isPublished) setShowPublishDialog(true); }}
          disabled={isPublished}
          style={{
            flexShrink:    0,
            opacity:       isPreviewMode ? 0 : 1,
            transition:    'opacity 0.25s ease',
            pointerEvents: isPreviewMode ? 'none' : 'auto',
            ...(isPublished ? { background: '#22C55E' } : {}),
          }}
        >
          {isPublished ? '✓ Published' : 'Publish'}
        </Button>

        {/* ── PREVIEW MODE: Exit bar content ───────────────────────── */}
        {/* Absolute-positioned strip that fades in on top */}
        <div style={{
          position:   'absolute',
          inset:      0,
          display:    'flex',
          alignItems: 'center',
          padding:    '0 16px',
          gap:        12,
          opacity:    isPreviewMode ? 1 : 0,
          pointerEvents: isPreviewMode ? 'auto' : 'none',
          transition: 'opacity 0.3s ease',
        }}>
          {/* Exit preview */}
          <button
            onClick={onTogglePreview}
            style={{
              display:    'flex',
              alignItems: 'center',
              gap:        6,
              padding:    '7px 16px',
              background: '#111',
              color:      '#fff',
              border:     'none',
              borderRadius: 10,
              fontSize:   13,
              fontWeight: 700,
              cursor:     'pointer',
              fontFamily: F,
              transition: 'background 0.15s',
              flexShrink: 0,
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

          {/* Publish button stays visible in preview mode too */}
          <Button
            onClick={() => { if (!isPublished) setShowPublishDialog(true); }}
            disabled={isPublished}
            style={{ flexShrink: 0, ...(isPublished ? { background: '#22C55E' } : {}) }}
          >
            {isPublished ? '✓ Published' : 'Publish'}
          </Button>
        </div>
      </header>

      {/* Publish dialog */}
      <PublishFlowDialog
        isOpen={showPublishDialog}
        onClose={() => setShowPublishDialog(false)}
        siteId={siteId}
        businessName={businessName}
        slug={slug}
        onPublished={(url) => {
          setPublishedUrl(url);
        }}
      />

      <style>{`
        @media (min-width: 600px) {
          .preview-url-pill { display: inline-flex !important; align-items: center; }
        }
      `}</style>
    </>
  );
}
