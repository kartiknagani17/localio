'use client';

import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

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
export default function DashboardClient({ userEmail, sites }: DashboardClientProps) {
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
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
              display:      'inline-flex',
              alignItems:   'center',
              gap:          8,
              padding:      '12px 22px',
              background:   '#F97316',
              color:        '#fff',
              borderRadius: 14,
              fontSize:     14,
              fontWeight:   700,
              textDecoration: 'none',
              transition:   'background 0.15s',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = '#EA6C0A'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = '#F97316'; }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
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
                display:      'inline-flex',
                padding:      '12px 24px',
                background:   '#F97316',
                color:        '#fff',
                borderRadius: 14,
                fontSize:     14,
                fontWeight:   700,
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
              <SiteCard key={site.id} site={site} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

/* ── Site card ──────────────────────────────────────────────────────────── */
function SiteCard({ site }: { site: SiteRow }) {
  const isPublished = site.status === 'published';
  const liveUrl     = `https://${DOMAIN}/${site.slug}`;
  const previewUrl  = `/preview/${site.id}`;
  const F           = "var(--font-jakarta, 'Plus Jakarta Sans', sans-serif)";

  return (
    <article style={{
      background:   '#fff',
      borderRadius: 20,
      boxShadow:    '0 2px 12px rgba(0,0,0,0.07)',
      border:       '1px solid #EBEBEB',
      overflow:     'hidden',
      display:      'flex',
      flexDirection: 'column',
      transition:   'box-shadow 0.15s',
      fontFamily:   F,
    }}
    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 24px rgba(0,0,0,0.12)'; }}
    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 12px rgba(0,0,0,0.07)'; }}
    >
      {/* Card header — coloured strip */}
      <div style={{
        height:     6,
        background: isPublished ? '#22C55E' : '#E5E7EB',
      }} />

      {/* Card body */}
      <div style={{ padding: '20px 20px 16px', flex: 1 }}>

        {/* Status badge */}
        <div style={{ marginBottom: 12 }}>
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
              Published
            </span>
          ) : (
            <span style={{
              display:      'inline-flex',
              alignItems:   'center',
              gap:          5,
              padding:      '4px 10px',
              background:   '#F3F4F6',
              color:        '#6B7280',
              borderRadius: 999,
              fontSize:     12,
              fontWeight:   700,
            }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              Draft
            </span>
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
        padding:      '14px 20px',
        borderTop:    '1px solid #F3F4F6',
        display:      'flex',
        gap:          8,
        alignItems:   'center',
        flexWrap:     'wrap',
      }}>

        {/* Edit button — always shown */}
        <a
          href={previewUrl}
          style={{
            flex:         '1 1 auto',
            display:      'inline-flex',
            alignItems:   'center',
            justifyContent: 'center',
            gap:          6,
            padding:      '8px 14px',
            background:   '#F5F5F3',
            border:       'none',
            borderRadius: 10,
            fontSize:     13,
            fontWeight:   600,
            color:        '#374151',
            textDecoration: 'none',
            transition:   'background 0.15s',
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = '#EBEBEB'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = '#F5F5F3'; }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          Edit
        </a>

        {/* View button — only when published */}
        {isPublished && (
          <a
            href={liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              flex:         '1 1 auto',
              display:      'inline-flex',
              alignItems:   'center',
              justifyContent: 'center',
              gap:          6,
              padding:      '8px 14px',
              background:   '#111',
              border:       'none',
              borderRadius: 10,
              fontSize:     13,
              fontWeight:   600,
              color:        '#fff',
              textDecoration: 'none',
              transition:   'background 0.15s',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = '#333'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = '#111'; }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            View site
          </a>
        )}

        {/* Upgrade button — only when draft */}
        {!isPublished && (
          <a
            href={previewUrl}
            style={{
              flex:         '1 1 auto',
              display:      'inline-flex',
              alignItems:   'center',
              justifyContent: 'center',
              gap:          6,
              padding:      '8px 14px',
              background:   'linear-gradient(135deg, #F97316 0%, #EF4444 100%)',
              border:       'none',
              borderRadius: 10,
              fontSize:     13,
              fontWeight:   700,
              color:        '#fff',
              textDecoration: 'none',
              transition:   'opacity 0.15s',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = '0.9'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = '1'; }}
            title="Go to editor and publish this site"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="13 17 18 12 13 7"/><polyline points="6 17 11 12 6 7"/></svg>
            Publish ✨
          </a>
        )}
      </div>
    </article>
  );
}
