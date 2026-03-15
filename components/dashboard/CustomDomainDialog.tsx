'use client';

// CustomDomainDialog
// - If site is NOT published: shows a "publish first" message + plan cards + CTA to open publish flow
// - If site IS published: shows domain input, DNS instructions, connect/remove actions

import { useState } from 'react';
import Modal from '@/components/ui/Modal';

const F = "var(--font-jakarta, 'Plus Jakarta Sans', sans-serif)";

/* ── Types ──────────────────────────────────────────────────────────────── */
interface CustomDomainDialogProps {
  isOpen:        boolean;
  onClose:       () => void;
  isPublished:   boolean;
  siteId:        string;
  businessName:  string;
  slug:          string;
  currentDomain: string | null;
  onOpenPublish: () => void;                          // opens PublishFlowDialog
  onDomainSaved: (domain: string | null) => void;    // update parent state
}

/* ── Mini plan card (display-only, no PayPal) ───────────────────────────── */
function MiniPlanCard({
  label, price, priceSub, then, badge, savings, highlight,
}: {
  label:     string;
  price:     string;
  priceSub:  string;
  then:      string;
  badge?:    string;
  savings?:  string;
  highlight?: boolean;
}) {
  return (
    <div style={{
      flex:          1,
      display:       'flex',
      flexDirection: 'column',
      gap:           8,
      padding:       '16px 14px',
      borderRadius:  14,
      border:        highlight ? '2px solid #4F46E5' : '1.5px solid #E5E7EB',
      background:    highlight ? '#F5F3FF' : '#FAFAFA',
      position:      'relative',
    }}>
      {badge && (
        <span style={{
          position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)',
          padding: '3px 10px', background: '#4F46E5', color: '#fff',
          borderRadius: 999, fontSize: 10, fontWeight: 700, fontFamily: F,
          whiteSpace: 'nowrap',
        }}>{badge}</span>
      )}
      <div style={{ fontSize: 12, fontWeight: 600, color: '#374151', fontFamily: F }}>{label}</div>
      <div>
        <span style={{ fontSize: 28, fontWeight: 800, color: '#111', letterSpacing: '-0.04em', fontFamily: F }}>{price}</span>
        <span style={{ fontSize: 11, color: '#4B5563', marginLeft: 4, fontFamily: F }}>{priceSub}</span>
      </div>
      <div style={{ fontSize: 11, color: '#4B5563', fontFamily: F }}>{then}</div>
      {savings && (
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          padding: '2px 7px', background: '#DCFCE7',
          borderRadius: 6, fontSize: 10, fontWeight: 700, color: '#15803D', width: 'fit-content',
        }}>
          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
          {savings}
        </div>
      )}
      <div style={{ fontSize: 11, color: '#6B7280', fontFamily: F, display: 'flex', alignItems: 'center', gap: 4 }}>
        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
        Custom domain included
      </div>
    </div>
  );
}

/* ── Main component ─────────────────────────────────────────────────────── */
export default function CustomDomainDialog({
  isOpen,
  onClose,
  isPublished,
  siteId,
  businessName,
  slug,
  currentDomain,
  onOpenPublish,
  onDomainSaved,
}: CustomDomainDialogProps) {

  const [domainInput, setDomainInput]   = useState(currentDomain ?? '');
  const [connecting, setConnecting]     = useState(false);
  const [removing, setRemoving]         = useState(false);
  const [error, setError]               = useState<string | null>(null);
  const [showInstructions, setShowInstructions] = useState(!!currentDomain);

  const appDomain = process.env.NEXT_PUBLIC_SITE_DOMAIN ?? 'localio.live';

  /* ── Connect domain ─────────────────────────────────────────────────── */
  const handleConnect = async () => {
    const raw = domainInput.trim().toLowerCase().replace(/^https?:\/\//, '');
    if (!raw) { setError('Enter a domain name.'); return; }
    if (!/^[a-z0-9.-]+\.[a-z]{2,}$/.test(raw)) {
      setError('Enter a valid domain (e.g. www.mysite.com).');
      return;
    }
    setError(null);
    setConnecting(true);
    try {
      const res = await fetch(`/api/domain/${siteId}`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ domain: raw }),
      });
      const data = await res.json() as { error?: string };
      if (!res.ok) throw new Error(data.error ?? 'Failed to connect domain');
      onDomainSaved(raw);
      setShowInstructions(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setConnecting(false);
    }
  };

  /* ── Remove domain ──────────────────────────────────────────────────── */
  const handleRemove = async () => {
    setError(null);
    setRemoving(true);
    try {
      const res = await fetch(`/api/domain/${siteId}`, { method: 'DELETE' });
      const data = await res.json() as { error?: string };
      if (!res.ok) throw new Error(data.error ?? 'Failed to remove domain');
      onDomainSaved(null);
      setDomainInput('');
      setShowInstructions(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setRemoving(false);
    }
  };

  /* ── Render ─────────────────────────────────────────────────────────── */
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isPublished ? 'Custom Domain' : 'Add a Custom Domain'}
      maxWidth={500}
    >
      <div style={{ fontFamily: F, display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* ── NOT PUBLISHED: teaser + plans ─────────────────────────── */}
        {!isPublished && (
          <>
            {/* Globe icon + message */}
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: 12, padding: '20px 16px',
              background: '#F5F3FF', borderRadius: 14,
              border: '1.5px solid #DDD6FE', textAlign: 'center',
            }}>
              <div style={{
                width: 48, height: 48, borderRadius: '50%',
                background: '#4F46E5', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="2" y1="12" x2="22" y2="12"/>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                </svg>
              </div>
              <div>
                <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#111' }}>
                  Publish {businessName} to unlock custom domains
                </p>
                <p style={{ margin: '6px 0 0', fontSize: 13, color: '#6B7280', lineHeight: 1.5 }}>
                  Your site will be live at{' '}
                  <span style={{ fontFamily: 'monospace', fontSize: 12 }}>{appDomain}/{slug}</span>
                  , and you can point any domain you own to it — included in every paid plan.
                </p>
              </div>
            </div>

            {/* Plan cards */}
            <div style={{ display: 'flex', gap: 12, paddingTop: 4 }}>
              <MiniPlanCard
                label="Monthly"
                price="$1"
                priceSub="first month"
                then="then $5 / month"
              />
              <MiniPlanCard
                label="Yearly"
                price="$47"
                priceSub="per year"
                then="billed once a year"
                badge="Best value"
                savings="Save $13 vs monthly"
                highlight
              />
            </div>

            {/* CTA */}
            <button
              onClick={() => { onClose(); setTimeout(onOpenPublish, 80); }}
              style={{
                width: '100%', padding: '13px 0',
                background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
                color: '#fff', border: 'none', borderRadius: 12,
                fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: F,
                transition: 'opacity 0.15s',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = '0.88'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = '1'; }}
            >
              Publish & unlock custom domain →
            </button>

            <p style={{ margin: 0, textAlign: 'center', fontSize: 12, color: '#9CA3AF' }}>
              No contract. Cancel anytime.
            </p>
          </>
        )}

        {/* ── PUBLISHED: domain input + instructions ─────────────────── */}
        {isPublished && !showInstructions && (
          <>
            <p style={{ margin: 0, fontSize: 14, color: '#374151', lineHeight: 1.6 }}>
              Connect a domain you already own to{' '}
              <strong>{businessName}</strong>. Enter it below — we&apos;ll give you the DNS settings.
            </p>

            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                Your domain
              </label>
              <input
                type="text"
                value={domainInput}
                onChange={(e) => { setDomainInput(e.target.value); setError(null); }}
                placeholder="www.myplumbingco.com"
                onKeyDown={(e) => { if (e.key === 'Enter') handleConnect(); }}
                style={{
                  width: '100%', padding: '10px 14px',
                  border: `1.5px solid ${error ? '#FCA5A5' : '#E5E7EB'}`,
                  borderRadius: 12, fontSize: 14, outline: 'none',
                  boxSizing: 'border-box', fontFamily: F,
                  transition: 'border-color 0.15s',
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = error ? '#EF4444' : '#4F46E5'; }}
                onBlur={(e)  => { e.currentTarget.style.borderColor = error ? '#FCA5A5' : '#E5E7EB'; }}
              />
              {error && (
                <p style={{ margin: '6px 0 0', fontSize: 12, color: '#EF4444' }}>{error}</p>
              )}
            </div>

            <button
              onClick={handleConnect}
              disabled={connecting}
              style={{
                width: '100%', padding: '12px 0',
                background: connecting ? '#818CF8' : '#4F46E5',
                color: '#fff', border: 'none', borderRadius: 12,
                fontSize: 14, fontWeight: 700,
                cursor: connecting ? 'default' : 'pointer',
                fontFamily: F, transition: 'background 0.15s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}
            >
              {connecting && (
                <span style={{
                  width: 14, height: 14, border: '2px solid #fff',
                  borderTopColor: 'transparent', borderRadius: '50%',
                  animation: 'spin 0.7s linear infinite', display: 'inline-block',
                }} />
              )}
              {connecting ? 'Connecting…' : 'Connect domain →'}
            </button>
          </>
        )}

        {/* ── DNS Instructions (after connect or if domain already set) ── */}
        {isPublished && showInstructions && (
          <>
            {/* Connected domain chip */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '12px 16px', background: '#F0FDF4',
              border: '1.5px solid #BBF7D0', borderRadius: 12,
            }}>
              <span style={{
                width: 28, height: 28, background: '#22C55E', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
              </span>
              <span style={{ fontFamily: 'monospace', fontSize: 13, color: '#166534', fontWeight: 600, flex: 1, wordBreak: 'break-all' }}>
                {domainInput || currentDomain}
              </span>
              <button
                onClick={handleRemove}
                disabled={removing}
                style={{
                  fontSize: 12, color: '#EF4444', background: 'none',
                  border: 'none', cursor: removing ? 'default' : 'pointer',
                  fontFamily: F, padding: 0, fontWeight: 600,
                  opacity: removing ? 0.5 : 1,
                }}
              >
                {removing ? 'Removing…' : 'Remove'}
              </button>
            </div>

            {/* DNS instructions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#111' }}>
                Point your DNS to Localio
              </p>
              <p style={{ margin: 0, fontSize: 13, color: '#6B7280', lineHeight: 1.5 }}>
                Log into your domain registrar (GoDaddy, Namecheap, etc.) and add this DNS record:
              </p>

              {/* CNAME record */}
              <div style={{
                background: '#F8F7F4', borderRadius: 10, padding: '14px 16px',
                border: '1px solid #E5E7EB', fontFamily: 'monospace',
                display: 'flex', flexDirection: 'column', gap: 8,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                  <span style={{ color: '#6B7280', fontWeight: 600, fontFamily: F }}>Type</span>
                  <span style={{ color: '#111' }}>CNAME</span>
                </div>
                <div style={{ height: 1, background: '#E5E7EB' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                  <span style={{ color: '#6B7280', fontWeight: 600, fontFamily: F }}>Name / Host</span>
                  <span style={{ color: '#111' }}>www</span>
                </div>
                <div style={{ height: 1, background: '#E5E7EB' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, gap: 8 }}>
                  <span style={{ color: '#6B7280', fontWeight: 600, fontFamily: F, flexShrink: 0 }}>Points to</span>
                  <span style={{ color: '#4F46E5', wordBreak: 'break-all' }}>cname.vercel-dns.com</span>
                </div>
              </div>

              <p style={{ margin: 0, fontSize: 12, color: '#9CA3AF', lineHeight: 1.5 }}>
                DNS changes can take up to 24 hours to propagate. Once active, your site will be accessible at your domain automatically — SSL is included.
              </p>
            </div>

            {error && (
              <p style={{ margin: 0, fontSize: 12, color: '#EF4444' }}>{error}</p>
            )}

            {/* Change domain */}
            <button
              onClick={() => { setShowInstructions(false); setDomainInput(''); setError(null); }}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: 12, color: '#6B7280', fontFamily: F,
                padding: 0, textDecoration: 'underline', textAlign: 'left',
              }}
            >
              Connect a different domain
            </button>
          </>
        )}

      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </Modal>
  );
}
