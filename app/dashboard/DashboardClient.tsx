'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import PublishFlowDialog from '@/components/preview/PublishFlowDialog';

/* ── Types ─────────────────────────────────────────────────────────────── */
interface SiteRow {
  id:            string;
  slug:          string;
  template_id:   string;
  status:        'preview' | 'published';
  created_at:    string;
  business_data: {
    name:         string;
    businessType: string;
    city:         string;
  };
}

interface DashboardClientProps {
  userEmail: string;
  sites:     SiteRow[];
}

/* ── Helpers ────────────────────────────────────────────────────────────── */
const DOMAIN = process.env.NEXT_PUBLIC_SITE_DOMAIN ?? 'localio.live';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

function humanType(raw: string) {
  return raw
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/* ── Component ─────────────────────────────────────────────────────────── */
export default function DashboardClient({ userEmail, sites: initialSites }: DashboardClientProps) {
  const router = useRouter();
  const [sites, setSites]               = useState<SiteRow[]>(initialSites);
  const [publishingSite, setPublishingSite] = useState<SiteRow | null>(null);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
  };

  const handlePublished = (siteId: string) => {
    // Optimistically update the card to published
    setSites((prev) =>
      prev.map((s) => s.id === siteId ? { ...s, status: 'published' } : s)
    );
    setPublishingSite(null);
  };

  /* ── Styles ─────────────────────────────────────────────────────────── */
  const F = "var(--font-jakarta, 'Plus Jakarta Sans', sans-serif)";

  return (
    <div style={{ minHeight: '100vh', background: '#F8F7F4', fontFamily: F }}>

      {/* ── Top nav ──────────────────────────────────────────────────── */}
      <header style={{
        position:     'sticky',
        top:          0,
        zIndex:       50,
        background:   '#fff',
        borderBottom: '1px solid #EBEBEB',
        padding:      '0 24px',
        display:      'flex',
        alignItems:   'center',
        height:       60,
        gap:          16,
      }}>
        <a href="/" style={{ fontSize: 20, fontWeight: 800, color: '#111', textDecoration: 'none', letterSpacing: '-0.03em' }}>
          Localio
        </a>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 13, color: '#6B7280' }}>{userEmail}</span>
        <button
          onClick={handleSignOut}
          style={{
            padding:      '7px 14px',
            background:   '#F5F5F3',
            border:       'none',
            borderRadius: 10,
            fontSize:     13,
            fontWeight:   600,
            color:        '#374151',
            cursor:       'pointer',
            fontFamily:   F,
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#EBEBEB'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#F5F5F3'; }}
        >
          Sign out
        </button>
      </header>

      {/* ── Page body ────────────────────────────────────────────────── */}
      <main style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px' }}>

        {/* Page title row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: '#111', letterSpacing: '-0.03em' }}>
              My Sites
            </h1>
            <p style={{ margin: '4px 0 0', fontSize: 14, color: '#6B7280' }}>
              {sites.length === 0
                ? 'No sites yet — build your first one below.'
                : `${sites.length} site${sites.length !== 1 ? 's' : ''}`}
            </p>
          </div>
          <a
            href="/"
            style={{
              display:        'inline-flex',
              alignItems:     'center',
              gap:            8,
              padding:        '12px 22px',
              background:     '#F97316',
              color:          '#fff',
              borderRadius:   14,
              fontSize:       14,
              fontWeight:     700,
              textDecoration: 'none',
              transition:     'background 0.15s',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = '#EA6C0A'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = '#F97316'; }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Build a new site
          </a>
        </div>

        {/* ── Empty state ───────────────────────────────────────────── */}
        {sites.length === 0 && (
          <div style={{
            textAlign:    'center',
            padding:      '80px 24px',
            background:   '#fff',
            borderRadius: 20,
            border:       '1.5px dashed #E5E7EB',
          }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🏗️</div>
            <h2 style={{ margin: '0 0 8px', fontSize: 20, fontWeight: 700, color: '#111' }}>
              No sites yet
            </h2>
            <p style={{ margin: '0 0 24px', color: '#6B7280', fontSize: 14 }}>
              Answer 3 quick questions and we&apos;ll build your business website in seconds.
            </p>
            <a
              href="/"
              style={{
                display:        'inline-flex',
                padding:        '12px 24px',
                background:     '#F97316',
                color:          '#fff',
                borderRadius:   14,
                fontSize:       14,
                fontWeight:     700,
                textDecoration: 'none',
              }}
            >
              Build my first site →
            </a>
          </div>
        )}

        {/* ── Site cards grid ───────────────────────────────────────── */}
        {sites.length > 0 && (
          <div style={{
            display:             'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap:                 20,
          }}>
            {sites.map((site) => (
              <SiteCard
                key={site.id}
                site={site}
                onGoLive={() => setPublishingSite(site)}
              />
            ))}
          </div>
        )}
      </main>

      {/* ── Inline publish flow dialog ────────────────────────────── */}
      {publishingSite && (
        <PublishFlowDialog
          isOpen={!!publishingSite}
          onClose={() => setPublishingSite(null)}
          siteId={publishingSite.id}
          businessName={publishingSite.business_data.name}
          slug={publishingSite.slug}
          onPublished={() => handlePublished(publishingSite.id)}
        />
      )}
    </div>
  );
}

/* ── Site card ──────────────────────────────────────────────────────────── */
function SiteCard({ site, onGoLive }: { site: SiteRow; onGoLive: () => void }) {
  const isPublished  = site.status === 'published';
  const liveUrl      = `https://${DOMAIN}/${site.slug}`;
  const previewUrl   = `/preview/${site.id}`;
  const F            = "var(--font-jakarta, 'Plus Jakarta Sans', sans-serif)";
  const [menuOpen, setMenuOpen] = useState(false);

  const handleShare = async () => {
    setMenuOpen(false);
    if (navigator.share) {
      try { await navigator.share({ title: site.business_data.name, url: liveUrl }); } catch { /* cancelled */ }
    } else {
      try { await navigator.clipboard.writeText(liveUrl); } catch { /* unavailable */ }
    }
  };

  return (
    <article
      style={{
        background:    '#fff',
        borderRadius:  20,
        boxShadow:     '0 2px 12px rgba(0,0,0,0.07)',
        border:        '1px solid #EBEBEB',
        overflow:      'hidden',
        display:       'flex',
        flexDirection: 'column',
        transition:    'box-shadow 0.15s',
        fontFamily:    F,
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 24px rgba(0,0,0,0.12)'; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 12px rgba(0,0,0,0.07)'; }}
    >
      {/* Coloured status strip at top */}
      <div style={{
        height:     6,
        background: isPublished ? '#22C55E' : '#E5E7EB',
      }} />

      {/* Card body */}
      <div style={{ padding: '20px 20px 16px', flex: 1, position: 'relative' }}>

        {/* Status badge row + 3-dot menu (live sites only) */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div>
          {isPublished ? (
            <span style={{
              display:      'inline-flex',
              alignItems:   'center',
              gap:          5,
              padding:      '4px 10px',
              background:   '#DCFCE7',
              color:        '#15803D',
              borderRadius: 999,
              fontSize:     12,
              fontWeight:   700,
            }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
              Live
            </span>
          ) : (
            <span style={{
              display:      'inline-flex',
              alignItems:   'center',
              gap:          5,
              padding:      '4px 10px',
              background:   '#FEF3C7',
              color:        '#92400E',
              borderRadius: 999,
              fontSize:     12,
              fontWeight:   700,
            }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              Draft
            </span>
          )}
          </div>

          {/* 3-dot menu — live sites only */}
          {isPublished && (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setMenuOpen(o => !o)}
                style={{
                  display:    'flex', alignItems: 'center', justifyContent: 'center',
                  width: 32, height: 32, borderRadius: 8,
                  background: menuOpen ? '#F3F4F6' : 'transparent',
                  border: 'none', cursor: 'pointer', color: '#6B7280',
                  transition: 'background 0.15s', fontFamily: F,
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#F3F4F6'; }}
                onMouseLeave={(e) => { if (!menuOpen) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                title="More options"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/>
                </svg>
              </button>

              {/* Dropdown */}
              {menuOpen && (
                <>
                  {/* Click-away backdrop */}
                  <div
                    style={{ position: 'fixed', inset: 0, zIndex: 10 }}
                    onClick={() => setMenuOpen(false)}
                  />
                  <div style={{
                    position: 'absolute', top: 36, right: 0, zIndex: 20,
                    background: '#fff', borderRadius: 12,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.14), 0 1px 4px rgba(0,0,0,0.08)',
                    border: '1px solid #E5E7EB',
                    minWidth: 170, padding: '6px 0', fontFamily: F,
                  }}>
                    {/* Share */}
                    <button
                      onClick={handleShare}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        width: '100%', padding: '10px 16px',
                        background: 'none', border: 'none', cursor: 'pointer',
                        fontSize: 13, fontWeight: 600, color: '#374151',
                        fontFamily: F, textAlign: 'left', transition: 'background 0.1s',
                      }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#F9FAFB'; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'none'; }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                      </svg>
                      Share site
                    </button>

                    <div style={{ height: 1, background: '#F3F4F6', margin: '4px 0' }} />

                    {/* Cancel plan */}
                    <a
                      href="https://www.paypal.com/myaccount/autopay/"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setMenuOpen(false)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        width: '100%', padding: '10px 16px',
                        background: 'none', border: 'none', cursor: 'pointer',
                        fontSize: 13, fontWeight: 600, color: '#EF4444',
                        fontFamily: F, textDecoration: 'none', transition: 'background 0.1s',
                      }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = '#FFF5F5'; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = 'none'; }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>
                      </svg>
                      Cancel plan
                    </a>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Business name */}
        <h2 style={{ margin: '0 0 4px', fontSize: 17, fontWeight: 800, color: '#111', lineHeight: 1.3, letterSpacing: '-0.02em' }}>
          {site.business_data.name}
        </h2>

        {/* Type + city */}
        <p style={{ margin: '0 0 6px', fontSize: 13, color: '#6B7280' }}>
          {humanType(site.business_data.businessType)} · {site.business_data.city}
        </p>

        {/* Date */}
        <p style={{ margin: 0, fontSize: 12, color: '#9CA3AF' }}>
          Created {formatDate(site.created_at)}
        </p>
      </div>

      {/* Card actions */}
      <div style={{
        padding:    '14px 20px',
        borderTop:  '1px solid #F3F4F6',
        display:    'flex',
        gap:        8,
        alignItems: 'center',
        flexWrap:   'wrap',
      }}>

        {/* Edit — always shown */}
        <a
          href={previewUrl}
          style={{
            flex:           '1 1 auto',
            display:        'inline-flex',
            alignItems:     'center',
            justifyContent: 'center',
            gap:            6,
            padding:        '8px 14px',
            background:     '#F5F5F3',
            border:         'none',
            borderRadius:   10,
            fontSize:       13,
            fontWeight:     600,
            color:          '#374151',
            textDecoration: 'none',
            transition:     'background 0.15s',
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = '#EBEBEB'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = '#F5F5F3'; }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
          Edit
        </a>

        {/* View site — published only */}
        {isPublished && (
          <a
            href={liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              flex:           '1 1 auto',
              display:        'inline-flex',
              alignItems:     'center',
              justifyContent: 'center',
              gap:            6,
              padding:        '8px 14px',
              background:     '#111',
              border:         'none',
              borderRadius:   10,
              fontSize:       13,
              fontWeight:     600,
              color:          '#fff',
              textDecoration: 'none',
              transition:     'background 0.15s',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = '#333'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = '#111'; }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              <polyline points="15 3 21 3 21 9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
            View site
          </a>
        )}

        {/* Go Live — draft only */}
        {!isPublished && (
          <button
            onClick={onGoLive}
            style={{
              flex:           '1 1 auto',
              display:        'inline-flex',
              alignItems:     'center',
              justifyContent: 'center',
              gap:            6,
              padding:        '8px 14px',
              background:     'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
              border:         'none',
              borderRadius:   10,
              fontSize:       13,
              fontWeight:     700,
              color:          '#fff',
              cursor:         'pointer',
              fontFamily:     F,
              transition:     'opacity 0.15s',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = '0.88'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = '1'; }}
            title="Publish this site live"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <polyline points="13 17 18 12 13 7"/>
              <polyline points="6 17 11 12 6 7"/>
            </svg>
            Go Live
          </button>
        )}
      </div>
    </article>
  );
}
