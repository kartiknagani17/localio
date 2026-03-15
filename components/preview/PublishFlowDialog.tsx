'use client';

// PublishFlowDialog — full publish flow in one dialog, 5 steps:
//   auth       → email / password sign-in or sign-up
//   plans      → choose monthly ($1→$5/mo) or yearly ($47/yr)
//   payment    → PayPal button for the chosen plan
//   processing → spinner while we verify payment + call /api/publish
//   success    → live URL with Copy Link and Share buttons

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
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
        style?:             { shape?: string; color?: string; label?: string };
      }) => { render: (el: HTMLElement) => Promise<void> };
    };
  }
}

/* ── Props ─────────────────────────────────────────────────────────────── */
interface PublishFlowDialogProps {
  isOpen:       boolean;
  onClose:      () => void;
  siteId:       string;
  businessName: string;
  slug:         string;
  onPublished:  (publicUrl: string) => void;
}

type Step     = 'auth' | 'plans' | 'payment' | 'processing' | 'success';
type AuthMode = 'signin' | 'signup';
type Plan     = 'monthly' | 'yearly';

/* ── Component ─────────────────────────────────────────────────────────── */
export default function PublishFlowDialog({
  isOpen,
  onClose,
  siteId,
  businessName,
  slug,
  onPublished,
}: PublishFlowDialogProps) {
  const [step, setStep]                 = useState<Step>('auth');
  const [userId, setUserId]             = useState<string | null>(null);
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null);

  // Auth
  const [authMode, setAuthMode]         = useState<AuthMode>('signin');
  const [email, setEmail]               = useState('');
  const [password, setPassword]         = useState('');
  const [authLoading, setAuthLoading]   = useState(false);
  const [authError, setAuthError]       = useState<string | null>(null);

  // Plan selection
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  // PayPal
  const [sdkReady, setSdkReady]         = useState(false);
  const [paypalError, setPaypalError]   = useState<string | null>(null);
  const containerRef                     = useRef<HTMLDivElement>(null);
  const buttonsRendered                  = useRef(false);

  // Draft saving
  const [draftLoading, setDraftLoading] = useState(false);

  // Auth check done (prevents flash of auth step when already logged in)
  const [authChecked, setAuthChecked]   = useState(false);

  // Copy / Share
  const [copied, setCopied]             = useState(false);

  const router = useRouter();

  const monthlyPlanId = process.env.NEXT_PUBLIC_PAYPAL_MONTHLY_PLAN_ID
    ?? process.env.NEXT_PUBLIC_PAYPAL_PLAN_ID
    ?? '';
  const yearlyPlanId  = process.env.NEXT_PUBLIC_PAYPAL_YEARLY_PLAN_ID ?? '';
  const domain        = process.env.NEXT_PUBLIC_SITE_DOMAIN ?? 'localio.live';
  const liveUrl       = publishedUrl ?? `https://${domain}/${slug}`;

  const activePlanId = selectedPlan === 'monthly' ? monthlyPlanId : yearlyPlanId;

  /* ── Check if already logged in when dialog opens ───────────────────── */
  useEffect(() => {
    if (!isOpen) return;
    setAuthChecked(false);
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUserId(data.user.id);
        setStep('plans');
      } else {
        setStep('auth');
      }
      setAuthChecked(true);
    });
  }, [isOpen]);

  /* ── Reset state when dialog closes ─────────────────────────────────── */
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
      setSelectedPlan(null);
      setDraftLoading(false);
      setAuthChecked(false);
      buttonsRendered.current = false;
    }
  }, [isOpen]);

  /* ── Poll for PayPal SDK when on payment step ────────────────────────── */
  useEffect(() => {
    if (step !== 'payment' || !isOpen) return;
    if (window.paypal) { setSdkReady(true); return; }
    const t = setInterval(() => {
      if (window.paypal) { setSdkReady(true); clearInterval(t); }
    }, 200);
    return () => clearInterval(t);
  }, [step, isOpen]);

  /* ── Render PayPal button when SDK ready ─────────────────────────────── */
  useEffect(() => {
    if (
      step !== 'payment' ||
      !sdkReady ||
      !activePlanId ||
      !containerRef.current ||
      buttonsRendered.current
    ) return;

    buttonsRendered.current = true;
    const container = containerRef.current;

    window.paypal!.Buttons({
      style: { shape: 'pill', color: 'gold', label: 'subscribe' },
      createSubscription(_data, actions) {
        setPaypalError(null);
        return actions.subscription.create({ plan_id: activePlanId });
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
        // stay on payment step
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
  }, [step, sdkReady, activePlanId]);

  /* ── Auth submit ─────────────────────────────────────────────────────── */
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
      setStep('plans');
    } else {
      setAuthError('Check your email for a confirmation link, then sign in.');
    }
    setAuthLoading(false);
  };

  /* ── Plan select → payment ───────────────────────────────────────────── */
  const handleChoosePlan = (plan: Plan) => {
    setSelectedPlan(plan);
    setPaypalError(null);
    setSdkReady(false);
    buttonsRendered.current = false;
    setStep('payment');
  };

  /* ── Publish API call ────────────────────────────────────────────────── */
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
      onPublished(url);
      setStep('success');
    } catch (err) {
      setPaypalError(err instanceof Error ? err.message : 'Publish failed. Please try again.');
      setStep('payment');
      buttonsRendered.current = false;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteId, userId]);

  /* ── Copy URL ────────────────────────────────────────────────────────── */
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(liveUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch { /* clipboard unavailable */ }
  };

  /* ── Web Share ───────────────────────────────────────────────────────── */
  const handleShare = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: businessName, url: liveUrl }); } catch { /* cancelled */ }
    } else {
      handleCopy();
    }
  };

  /* ── Save as draft: claim site for user + go to dashboard ───────────── */
  const handleSaveAsDraft = useCallback(async () => {
    setDraftLoading(true);
    if (userId) {
      try {
        await fetch(`/api/claim/${siteId}`, { method: 'POST' });
      } catch { /* ignore — site still saves in preview, user can find it */ }
    }
    router.push('/dashboard');
  }, [siteId, userId, router]);

  const canClose = step !== 'processing';

  const TITLES: Record<Step, string> = {
    auth:       'Sign in to publish',
    plans:      'Choose your plan',
    payment:    'Complete payment',
    processing: 'Publishing…',
    success:    'Your site is live!',
  };

  const F = "var(--font-jakarta, 'Plus Jakarta Sans', sans-serif)";

  /* ── Render ──────────────────────────────────────────────────────────── */
  return (
    <Modal
      isOpen={isOpen}
      onClose={canClose ? onClose : () => {}}
      title={TITLES[step]}
      maxWidth={560}
    >
      <div style={{ fontFamily: F }}>

        {/* ── Auth check spinner (prevents flash of auth form if already logged in) */}
        {!authChecked && isOpen && (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 10, padding: '48px 0', color: '#6B7280', fontSize: 14,
          }}>
            <span style={{
              display: 'inline-block', width: 22, height: 22,
              border: '2.5px solid #4F46E5', borderTopColor: 'transparent',
              borderRadius: '50%', animation: 'spin 0.7s linear infinite',
            }} />
            Loading…
          </div>
        )}

        {/* ── STEP: AUTH ──────────────────────────────────────────────── */}
        {authChecked && step === 'auth' && (
          <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            <div style={{
              display: 'flex', gap: 4, padding: 4,
              background: '#F5F5F3', borderRadius: 14,
            }}>
              {(['signin', 'signup'] as AuthMode[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => { setAuthMode(m); setAuthError(null); }}
                  style={{
                    flex: 1, padding: '8px 0', border: 'none', borderRadius: 10,
                    fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
                    background: authMode === m ? '#fff' : 'transparent',
                    color:      authMode === m ? '#111' : '#888',
                    boxShadow:  authMode === m ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                    fontFamily: F,
                  }}
                >
                  {m === 'signin' ? 'Sign in' : 'Create account'}
                </button>
              ))}
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                Email
              </label>
              <input
                type="email" value={email}
                onChange={(e) => setEmail(e.target.value)}
                required placeholder="you@example.com"
                style={{
                  width: '100%', padding: '10px 14px',
                  border: '1.5px solid #E5E7EB', borderRadius: 12,
                  fontSize: 14, outline: 'none', boxSizing: 'border-box',
                  fontFamily: F, transition: 'border-color 0.15s',
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = '#4F46E5'; }}
                onBlur={(e)  => { e.currentTarget.style.borderColor = '#E5E7EB'; }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                Password
              </label>
              <input
                type="password" value={password}
                onChange={(e) => setPassword(e.target.value)}
                required placeholder="••••••••" minLength={6}
                style={{
                  width: '100%', padding: '10px 14px',
                  border: '1.5px solid #E5E7EB', borderRadius: 12,
                  fontSize: 14, outline: 'none', boxSizing: 'border-box',
                  fontFamily: F, transition: 'border-color 0.15s',
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = '#4F46E5'; }}
                onBlur={(e)  => { e.currentTarget.style.borderColor = '#E5E7EB'; }}
              />
            </div>

            {authError && (
              <div style={{
                padding: '10px 14px', background: '#FEF2F2',
                border: '1px solid #FECACA', borderRadius: 10,
                fontSize: 13, color: '#DC2626',
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

        {/* ── STEP: PLANS ─────────────────────────────────────────────── */}
        {authChecked && step === 'plans' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            <p style={{ margin: 0, fontSize: 14, color: '#6B7280', lineHeight: 1.6 }}>
              Publish <strong style={{ color: '#111' }}>{businessName}</strong> and get your
              live link at <span style={{ fontFamily: 'monospace', fontSize: 13 }}>localio.live/{slug}</span>.
              Cancel anytime.
            </p>

            <div style={{ display: 'flex', gap: 12 }}>
              <PlanCard
                label="Monthly"
                badge={null}
                price="$1"
                priceSub="first month"
                then="then $5 / month"
                onSelect={() => handleChoosePlan('monthly')}
              />

              <PlanCard
                label="Yearly"
                badge="Best value"
                price="$47"
                priceSub="per year"
                then="billed once a year"
                savings="Save $13 vs monthly"
                onSelect={() => handleChoosePlan('yearly')}
              />
            </div>

            <div style={{ textAlign: 'center', paddingTop: 8, borderTop: '1px solid #F3F4F6' }}>
              <button
                onClick={handleSaveAsDraft}
                disabled={draftLoading}
                style={{
                  background: 'none', border: 'none',
                  cursor: draftLoading ? 'default' : 'pointer',
                  fontSize: 12, color: '#4B5563', transition: 'color 0.15s',
                  fontFamily: F, padding: 0,
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  opacity: draftLoading ? 0.7 : 1,
                }}
                onMouseEnter={(e) => { if (!draftLoading) (e.currentTarget as HTMLButtonElement).style.color = '#111827'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#4B5563'; }}
              >
                {draftLoading && (
                  <span style={{
                    display: 'inline-block', width: 11, height: 11,
                    border: '1.5px solid #4B5563', borderTopColor: 'transparent',
                    borderRadius: '50%', animation: 'spin 0.7s linear infinite',
                    flexShrink: 0,
                  }} />
                )}
                {draftLoading ? 'Saving draft…' : 'Save as draft — go to dashboard'}
              </button>
            </div>
          </div>
        )}

        {/* ── STEP: PAYMENT ───────────────────────────────────────────── */}
        {authChecked && step === 'payment' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Selected plan recap */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '12px 16px', background: '#F5F3FF',
              border: '1.5px solid #DDD6FE', borderRadius: 14,
            }}>
              <span style={{ fontSize: 20 }}>{selectedPlan === 'yearly' ? '🏆' : '📅'}</span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#111' }}>
                  {selectedPlan === 'monthly' ? 'Monthly plan' : 'Yearly plan'}
                </div>
                <div style={{ fontSize: 12, color: '#6B7280' }}>
                  {selectedPlan === 'monthly' ? '$1 today, then $5/month' : '$47/year — billed once'}
                </div>
              </div>
              <div style={{ flex: 1 }} />
              <button
                onClick={() => {
                  setStep('plans');
                  setPaypalError(null);
                  setSdkReady(false);
                  buttonsRendered.current = false;
                }}
                style={{
                  fontSize: 12, color: '#7C3AED', background: 'none',
                  border: 'none', cursor: 'pointer', fontFamily: F,
                  padding: 0, textDecoration: 'underline',
                }}
              >
                Change
              </button>
            </div>

            {!activePlanId && (
              <div style={{
                padding: '10px 14px', background: '#FFFBEB',
                border: '1px solid #FDE68A', borderRadius: 10,
                fontSize: 13, color: '#92400E',
              }}>
                PayPal plan not configured. Set{' '}
                <code style={{ fontSize: 11 }}>
                  {selectedPlan === 'monthly'
                    ? 'NEXT_PUBLIC_PAYPAL_MONTHLY_PLAN_ID'
                    : 'NEXT_PUBLIC_PAYPAL_YEARLY_PLAN_ID'}
                </code>{' '}
                in your environment.
              </div>
            )}

            {activePlanId && !sdkReady && (
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: 8, padding: '24px 0', color: '#6B7280', fontSize: 14,
              }}>
                <span style={{
                  display: 'inline-block', width: 20, height: 20,
                  border: '2px solid #4F46E5', borderTopColor: 'transparent',
                  borderRadius: '50%', animation: 'spin 0.7s linear infinite',
                }} />
                Loading PayPal…
              </div>
            )}

            {activePlanId && sdkReady && (
              <div style={{ position: 'relative' }}>
                <div ref={containerRef} style={{ minHeight: 45 }} />
              </div>
            )}

            {paypalError && (
              <div style={{
                padding: '10px 14px', background: '#FEF2F2',
                border: '1px solid #FECACA', borderRadius: 10,
                fontSize: 13, color: '#DC2626',
              }}>
                {paypalError}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="ghost" onClick={onClose}>Cancel</Button>
            </div>
          </div>
        )}

        {/* ── STEP: PROCESSING ────────────────────────────────────────── */}
        {step === 'processing' && (
          <div style={{
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', gap: 16, padding: '40px 0',
          }}>
            <span style={{
              display: 'inline-block', width: 44, height: 44,
              border: '3px solid #4F46E5', borderTopColor: 'transparent',
              borderRadius: '50%', animation: 'spin 0.7s linear infinite',
            }} />
            <p style={{ margin: 0, fontSize: 14, color: '#6B7280', textAlign: 'center' }}>
              Verifying payment and publishing your site…
            </p>
          </div>
        )}

        {/* ── STEP: SUCCESS ───────────────────────────────────────────── */}
        {step === 'success' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '12px 16px', background: '#F0FDF4',
              border: '1.5px solid #BBF7D0', borderRadius: 14,
            }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: 28, height: 28, background: '#22C55E',
                borderRadius: '50%', flexShrink: 0,
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
              <span style={{ flex: 1, fontSize: 13, fontFamily: 'monospace', color: '#166534', wordBreak: 'break-all' }}>
                {liveUrl}
              </span>
              <a
                href={liveUrl} target="_blank" rel="noopener noreferrer"
                style={{ color: '#16A34A', fontSize: 16, textDecoration: 'none', flexShrink: 0 }}
                title="Open in new tab"
              >↗</a>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <Button onClick={handleCopy} style={{ flex: 1 }}>
                {copied ? '✓ Copied!' : '📋 Copy Link'}
              </Button>
              <Button variant="secondary" onClick={handleShare} style={{ flex: 1 }}>
                🔗 Share
              </Button>
            </div>

            <div style={{ textAlign: 'center', paddingTop: 4 }}>
              <a
                href="/dashboard"
                style={{ fontSize: 13, color: '#4F46E5', textDecoration: 'none', fontWeight: 600 }}
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

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </Modal>
  );
}

/* ── Plan card sub-component ────────────────────────────────────────────── */

function PlanCard({
  label,
  badge,
  price,
  priceSub,
  then,
  savings,
  onSelect,
}: {
  label:    string;
  badge:    string | null;
  price:    string;
  priceSub: string;
  then:     string;
  savings?: string | null;
  onSelect: () => void;
}) {
  const F = "var(--font-jakarta, 'Plus Jakarta Sans', sans-serif)";
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={onSelect}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flex:          1,
        display:       'flex',
        flexDirection: 'column',
        gap:           10,
        padding:       '18px 16px',
        borderRadius:  16,
        border:        hovered ? '2px solid #4F46E5' : '1.5px solid #E5E7EB',
        background:    hovered ? '#F5F3FF' : '#FAFAFA',
        cursor:        'pointer',
        transition:    'all 0.15s',
        position:      'relative',
      }}
    >
      {/* Badge */}
      {badge && (
        <span style={{
          position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)',
          padding: '3px 10px', background: '#4F46E5', color: '#fff',
          borderRadius: 999, fontSize: 10, fontWeight: 700, fontFamily: F,
          whiteSpace: 'nowrap',
        }}>
          {badge}
        </span>
      )}

      {/* Label */}
      <div style={{ fontSize: 13, fontWeight: 600, color: '#374151', fontFamily: F }}>
        {label}
      </div>

      {/* Price */}
      <div>
        <span style={{ fontSize: 32, fontWeight: 800, color: '#111', letterSpacing: '-0.04em', fontFamily: F }}>
          {price}
        </span>
        <span style={{ fontSize: 12, color: '#4B5563', marginLeft: 4, fontFamily: F }}>
          {priceSub}
        </span>
      </div>

      {/* Then */}
      <div style={{ fontSize: 12, color: '#4B5563', fontFamily: F }}>
        {then}
      </div>

      {/* Savings tag */}
      {savings && (
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          padding: '3px 8px', background: '#DCFCE7',
          borderRadius: 6, fontSize: 11, fontWeight: 700, color: '#15803D',
          width: 'fit-content',
        }}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
          {savings}
        </div>
      )}

      {/* Features */}
      <div style={{ fontSize: 11, color: '#6B7280', fontFamily: F, display: 'flex', alignItems: 'center', gap: 5 }}>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
        Custom domain included
      </div>

      {/* CTA */}
      <div style={{
        marginTop:    4,
        padding:      '9px 0',
        background:   hovered ? '#4F46E5' : '#F3F4F6',
        color:        hovered ? '#fff' : '#374151',
        borderRadius: 10,
        fontSize:     13,
        fontWeight:   700,
        textAlign:    'center',
        transition:   'all 0.15s',
        fontFamily:   F,
      }}>
        Choose {label} →
      </div>

    </div>
  );
}
