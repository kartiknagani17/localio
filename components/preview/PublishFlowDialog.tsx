'use client';

// PublishFlowDialog — full publish flow in one dialog, 4 steps:
//   auth       → email / password sign-in or sign-up
//   confirm    → ready-to-publish confirmation + PayPal button
//   processing → spinner while we verify payment + call /api/publish
//   success    → live URL with Copy Link and Share buttons

import { useState, useEffect, useRef, useCallback } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { createClient } from '@/lib/supabase/client';

/* ── PayPal type shim ──────────────────────────────────────────────────── */
type PayPalActions = {
  subscription: { create: (o: { plan_id: string }) => Promise<string> };
};
declare global {
  interface Window {
    paypal?: {
      Buttons: (cfg: {
        createSubscription: (data: unknown, actions: PayPalActions) => Promise<string>;
        onApprove:          (data: { subscriptionID: string }) => void;
        onError:            (err: unknown) => void;
        onCancel:           () => void;
        style?:             { shape?: string; color?: string };
      }) => { render: (el: HTMLElement) => Promise<void> };
    };
  }
}

/* ── Props ─────────────────────────────────────────────────────────────── */
interface PublishFlowDialogProps {
  isOpen:      boolean;
  onClose:     () => void;
  siteId:      string;
  businessName: string;
  slug:        string;
  /** Called as soon as the publish API responds with a URL */
  onPublished: (publicUrl: string) => void;
}

type Step = 'auth' | 'confirm' | 'processing' | 'success';
type AuthMode = 'signin' | 'signup';

/* ── Component ─────────────────────────────────────────────────────────── */
export default function PublishFlowDialog({
  isOpen,
  onClose,
  siteId,
  businessName,
  slug,
  onPublished,
}: PublishFlowDialogProps) {
  const [step, setStep]             = useState<Step>('auth');
  const [userId, setUserId]         = useState<string | null>(null);
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null);

  // ── Auth form state ──────────────────────────────────────────────────
  const [authMode, setAuthMode]     = useState<AuthMode>('signin');
  const [email, setEmail]           = useState('');
  const [password, setPassword]     = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError]   = useState<string | null>(null);

  // ── PayPal state ─────────────────────────────────────────────────────
  const [sdkReady, setSdkReady]     = useState(false);
  const [paypalError, setPaypalError] = useState<string | null>(null);
  const containerRef                = useRef<HTMLDivElement>(null);
  const buttonsRendered             = useRef(false);

  // ── Copy / Share state ───────────────────────────────────────────────
  const [copied, setCopied]         = useState(false);

  const planId  = process.env.NEXT_PUBLIC_PAYPAL_PLAN_ID ?? '';
  const domain  = process.env.NEXT_PUBLIC_SITE_DOMAIN ?? 'localio.live';
  const liveUrl = publishedUrl ?? `https://${domain}/${slug}`;

  // ── On open: check if already logged in ─────────────────────────────
  useEffect(() => {
    if (!isOpen) return;
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUserId(data.user.id);
        setStep('confirm');
      } else {
        setStep('auth');
      }
    });
  }, [isOpen]);

  // ── Reset all state when dialog closes ──────────────────────────────
  useEffect(() => {
    if (!isOpen) {
      setStep('auth');
      setUserId(null);
      setEmail('');
      setPassword('');
      setAuthError(null);
      setPaypalError(null);
      setPublishedUrl(null);
      setCopied(false);
      setSdkReady(false);
      buttonsRendered.current = false;
    }
  }, [isOpen]);

  // ── Poll for PayPal SDK when on confirm step ─────────────────────────
  useEffect(() => {
    if (step !== 'confirm' || !isOpen) return;
    if (window.paypal) { setSdkReady(true); return; }
    const t = setInterval(() => {
      if (window.paypal) { setSdkReady(true); clearInterval(t); }
    }, 200);
    return () => clearInterval(t);
  }, [step, isOpen]);

  // ── Render PayPal buttons when SDK ready ─────────────────────────────
  useEffect(() => {
    if (
      step !== 'confirm' ||
      !sdkReady ||
      !planId ||
      !containerRef.current ||
      buttonsRendered.current
    ) return;

    buttonsRendered.current = true;
    const container = containerRef.current;

    window.paypal!.Buttons({
      style: { shape: 'pill', color: 'gold' },
      createSubscription(_data, actions) {
        setPaypalError(null);
        return actions.subscription.create({ plan_id: planId });
      },
      onApprove(data) {
        handlePublish(data.subscriptionID);
      },
      onError(err) {
        const msg =
          typeof err === 'object' && err !== null && 'message' in err
            ? String((err as { message: unknown }).message)
            : 'Payment failed. Please try again.';
        setPaypalError(msg);
        buttonsRendered.current = false;
      },
      onCancel() {
        // User dismissed PayPal — stay on confirm step
      },
    })
      .render(container)
      .catch((err: unknown) => {
        setPaypalError(
          err instanceof Error ? err.message : 'PayPal failed to load. Refresh and try again.'
        );
        buttonsRendered.current = false;
      });

    return () => {
      if (container) container.innerHTML = '';
      buttonsRendered.current = false;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, sdkReady, planId]);

  // ── Auth submit ───────────────────────────────────────────────────────
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);

    const supabase = createClient();
    const { data, error } =
      authMode === 'signin'
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });

    if (error) {
      setAuthError(error.message);
    } else if (data.user) {
      setUserId(data.user.id);
      setStep('confirm');
    } else {
      // sign up → confirmation email sent
      setAuthError(
        'Check your email for a confirmation link, then sign in.'
      );
    }
    setAuthLoading(false);
  };

  // ── Publish API call ─────────────────────────────────────────────────
  const handlePublish = useCallback(async (subscriptionId: string) => {
    setStep('processing');
    try {
      const res = await fetch(`/api/publish/${siteId}`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ subscriptionId, userId }),
      });
      const responseData = await res.json() as { publicUrl?: string; error?: string };
      if (!res.ok) throw new Error(responseData.error ?? 'Publish failed');

      const url = responseData.publicUrl!;
      setPublishedUrl(url);
      onPublished(url);        // tell PreviewTopBar to update its UI
      setStep('success');
    } catch (err) {
      setPaypalError(err instanceof Error ? err.message : 'Publish failed. Please try again.');
      setStep('confirm');
      buttonsRendered.current = false; // re-render PayPal buttons
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteId, userId]);

  // ── Copy URL ─────────────────────────────────────────────────────────
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(liveUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch { /* clipboard unavailable */ }
  };

  // ── Web Share ────────────────────────────────────────────────────────
  const handleShare = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: businessName, url: liveUrl }); } catch { /* cancelled */ }
    } else {
      handleCopy();
    }
  };

  const canClose = step !== 'processing';

  const TITLES: Record<Step, string> = {
    auth:       'Sign in to publish',
    confirm:    'Publish your site',
    processing: 'Publishing…',
    success:    'Your site is live! 🎉',
  };

  /* ── Render ─────────────────────────────────────────────────────────── */
  return (
    <Modal
      isOpen={isOpen}
      onClose={canClose ? onClose : () => {}}
      title={TITLES[step]}
      maxWidth={440}
    >
      <div style={{ fontFamily: "var(--font-jakarta, 'Plus Jakarta Sans', sans-serif)" }}>

        {/* ── STEP: AUTH ─────────────────────────────────────────────── */}
        {step === 'auth' && (
          <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Sign in / Create account toggle */}
            <div style={{
              display:       'flex',
              gap:           4,
              padding:       4,
              background:    '#F5F5F3',
              borderRadius:  14,
            }}>
              {(['signin', 'signup'] as AuthMode[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => { setAuthMode(m); setAuthError(null); }}
                  style={{
                    flex:         1,
                    padding:      '8px 0',
                    border:       'none',
                    borderRadius: 10,
                    fontSize:     13,
                    fontWeight:   600,
                    cursor:       'pointer',
                    transition:   'all 0.15s',
                    background:   authMode === m ? '#fff' : 'transparent',
                    color:        authMode === m ? '#111' : '#888',
                    boxShadow:    authMode === m ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                    fontFamily:   'inherit',
                  }}
                >
                  {m === 'signin' ? 'Sign in' : 'Create account'}
                </button>
              ))}
            </div>

            {/* Email */}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                style={{
                  width:        '100%',
                  padding:      '10px 14px',
                  border:       '1.5px solid #E5E7EB',
                  borderRadius: 12,
                  fontSize:     14,
                  outline:      'none',
                  boxSizing:    'border-box',
                  fontFamily:   'inherit',
                  transition:   'border-color 0.15s',
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = '#F97316'; }}
                onBlur={(e)  => { e.currentTarget.style.borderColor = '#E5E7EB'; }}
              />
            </div>

            {/* Password */}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                minLength={6}
                style={{
                  width:        '100%',
                  padding:      '10px 14px',
                  border:       '1.5px solid #E5E7EB',
                  borderRadius: 12,
                  fontSize:     14,
                  outline:      'none',
                  boxSizing:    'border-box',
                  fontFamily:   'inherit',
                  transition:   'border-color 0.15s',
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = '#F97316'; }}
                onBlur={(e)  => { e.currentTarget.style.borderColor = '#E5E7EB'; }}
              />
            </div>

            {authError && (
              <div style={{
                padding:      '10px 14px',
                background:   '#FEF2F2',
                border:       '1px solid #FECACA',
                borderRadius: 10,
                fontSize:     13,
                color:        '#DC2626',
              }}>
                {authError}
              </div>
            )}

            <Button type="submit" disabled={authLoading} size="lg" style={{ width: '100%' }}>
              {authLoading
                ? 'Please wait…'
                : authMode === 'signin'
                  ? 'Sign in & continue →'
                  : 'Create account & continue →'}
            </Button>

            <p style={{ textAlign: 'center', fontSize: 12, color: '#9CA3AF', margin: 0 }}>
              Your site is saved. Sign in to publish it live.
            </p>
          </form>
        )}

        {/* ── STEP: CONFIRM ──────────────────────────────────────────── */}
        {step === 'confirm' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <p style={{ margin: 0, fontSize: 14, color: '#6B7280', lineHeight: 1.6 }}>
              Subscribe once to publish <strong style={{ color: '#111' }}>{businessName}</strong> and
              get your live link at <span style={{ fontFamily: 'monospace', fontSize: 13 }}>localio.live/{slug}</span>.
              You can cancel anytime.
            </p>

            {!planId && (
              <div style={{
                padding:      '10px 14px',
                background:   '#FFFBEB',
                border:       '1px solid #FDE68A',
                borderRadius: 10,
                fontSize:     13,
                color:        '#92400E',
              }}>
                PayPal plan not configured. Set{' '}
                <code style={{ fontSize: 11 }}>NEXT_PUBLIC_PAYPAL_PLAN_ID</code> in your environment.
              </div>
            )}

            {planId && !sdkReady && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '24px 0', color: '#6B7280', fontSize: 14 }}>
                <span style={{ display: 'inline-block', width: 20, height: 20, border: '2px solid #F97316', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                Loading PayPal…
              </div>
            )}

            {planId && sdkReady && (
              <div style={{ position: 'relative' }}>
                <div ref={containerRef} style={{ minHeight: 45 }} />
              </div>
            )}

            {paypalError && (
              <div style={{
                padding:      '10px 14px',
                background:   '#FEF2F2',
                border:       '1px solid #FECACA',
                borderRadius: 10,
                fontSize:     13,
                color:        '#DC2626',
              }}>
                {paypalError}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="ghost" onClick={onClose}>Cancel</Button>
            </div>
          </div>
        )}

        {/* ── STEP: PROCESSING ───────────────────────────────────────── */}
        {step === 'processing' && (
          <div style={{
            display:        'flex',
            flexDirection:  'column',
            alignItems:     'center',
            gap:            16,
            padding:        '40px 0',
          }}>
            <span style={{
              display:    'inline-block',
              width:      44,
              height:     44,
              border:     '3px solid #F97316',
              borderTopColor: 'transparent',
              borderRadius: '50%',
              animation:  'spin 0.7s linear infinite',
            }} />
            <p style={{ margin: 0, fontSize: 14, color: '#6B7280', textAlign: 'center' }}>
              Verifying payment and publishing your site…
            </p>
          </div>
        )}

        {/* ── STEP: SUCCESS ──────────────────────────────────────────── */}
        {step === 'success' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Live URL box */}
            <div style={{
              display:       'flex',
              alignItems:    'center',
              gap:           10,
              padding:       '12px 16px',
              background:    '#F0FDF4',
              border:        '1.5px solid #BBF7D0',
              borderRadius:  14,
            }}>
              <span style={{
                display:     'inline-flex',
                alignItems:  'center',
                justifyContent: 'center',
                width:       28,
                height:      28,
                background:  '#22C55E',
                borderRadius: '50%',
                flexShrink:  0,
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
              <span style={{ flex: 1, fontSize: 13, fontFamily: 'monospace', color: '#166534', wordBreak: 'break-all' }}>
                {liveUrl}
              </span>
              <a
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#16A34A', fontSize: 16, textDecoration: 'none', flexShrink: 0 }}
                title="Open in new tab"
              >
                ↗
              </a>
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: 10 }}>
              <Button onClick={handleCopy} style={{ flex: 1 }}>
                {copied ? '✓ Copied!' : '📋 Copy Link'}
              </Button>
              <Button variant="secondary" onClick={handleShare} style={{ flex: 1 }}>
                🔗 Share
              </Button>
            </div>

            {/* Dashboard link */}
            <div style={{ textAlign: 'center', paddingTop: 4 }}>
              <a
                href="/dashboard"
                style={{ fontSize: 13, color: '#F97316', textDecoration: 'none', fontWeight: 600 }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.textDecoration = 'underline'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.textDecoration = 'none'; }}
              >
                View all my sites →
              </a>
            </div>

            <Button variant="ghost" onClick={onClose} style={{ width: '100%' }}>
              Back to editor
            </Button>
          </div>
        )}

      </div>

      {/* Keyframe for spinner — injected once */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </Modal>
  );
}
