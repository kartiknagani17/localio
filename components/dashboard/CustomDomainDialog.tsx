'use client';

// CustomDomainDialog — full self-contained flow:
//   If NOT published:  plans → (auth if needed) → payment → processing → domain_input
//   If published:      domain_input → dns_instructions

import { useState, useEffect, useRef, useCallback } from 'react';
import Modal from '@/components/ui/Modal';
import { createClient } from '@/lib/supabase/client';

const F = "var(--font-jakarta, 'Plus Jakarta Sans', sans-serif)";

/* ── PayPal type shim ────────────────────────────────────────────────────── */
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

/* ── Types ──────────────────────────────────────────────────────────────── */
type FlowStep = 'plans' | 'auth' | 'payment' | 'processing' | 'domain_input' | 'dns_instructions';
type AuthMode = 'signin' | 'signup';
type Plan     = 'monthly' | 'yearly';

interface CustomDomainDialogProps {
  isOpen:        boolean;
  onClose:       () => void;
  isPublished:   boolean;
  siteId:        string;
  businessName:  string;
  slug:          string;
  currentDomain: string | null;
  onPublished:   () => void;                         // notify parent site is now live
  onDomainSaved: (domain: string | null) => void;
}

/* ── Clickable plan card ─────────────────────────────────────────────────── */
function PlanCard({
  label, price, priceSub, then, badge, savings, onSelect,
}: {
  label:    string;
  price:    string;
  priceSub: string;
  then:     string;
  badge?:   string;
  savings?: string;
  onSelect: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={onSelect}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flex: 1, display: 'flex', flexDirection: 'column', gap: 8,
        padding: '16px 14px', borderRadius: 14, cursor: 'pointer',
        border:      hovered ? '2px solid #4F46E5' : (badge ? '2px solid #E5E7EB' : '1.5px solid #E5E7EB'),
        background:  hovered ? '#F5F3FF' : (badge ? '#FAFAFA' : '#FAFAFA'),
        position: 'relative', transition: 'all 0.15s',
      }}
    >
      {badge && (
        <span style={{
          position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)',
          padding: '3px 10px', background: '#4F46E5', color: '#fff',
          borderRadius: 999, fontSize: 10, fontWeight: 700, fontFamily: F, whiteSpace: 'nowrap',
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
      <div style={{
        marginTop: 4, padding: '8px 0', borderRadius: 8, fontSize: 12, fontWeight: 700,
        textAlign: 'center', transition: 'all 0.15s',
        background: hovered ? '#4F46E5' : '#F3F4F6',
        color:      hovered ? '#fff'    : '#374151',
        fontFamily: F,
      }}>
        Choose {label} →
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
  onPublished,
  onDomainSaved,
}: CustomDomainDialogProps) {

  /* ── Step state ──────────────────────────────────────────────────────── */
  const initialStep: FlowStep = isPublished
    ? (currentDomain ? 'dns_instructions' : 'domain_input')
    : 'plans';

  const [step, setStep]             = useState<FlowStep>(initialStep);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [userId, setUserId]         = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  /* ── Auth ────────────────────────────────────────────────────────────── */
  const [authMode, setAuthMode]     = useState<AuthMode>('signin');
  const [email, setEmail]           = useState('');
  const [password, setPassword]     = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError]   = useState<string | null>(null);

  /* ── PayPal ──────────────────────────────────────────────────────────── */
  const [sdkReady, setSdkReady]     = useState(false);
  const [paypalError, setPaypalError] = useState<string | null>(null);
  const containerRef                = useRef<HTMLDivElement>(null);
  const buttonsRendered             = useRef(false);

  /* ── Domain ──────────────────────────────────────────────────────────── */
  const [domainInput, setDomainInput] = useState(currentDomain ?? '');
  const [connecting, setConnecting] = useState(false);
  const [removing, setRemoving]     = useState(false);
  const [domainError, setDomainError] = useState<string | null>(null);

  const appDomain    = process.env.NEXT_PUBLIC_SITE_DOMAIN ?? 'localio.live';
  const monthlyPlanId = process.env.NEXT_PUBLIC_PAYPAL_MONTHLY_PLAN_ID
    ?? process.env.NEXT_PUBLIC_PAYPAL_PLAN_ID ?? '';
  const yearlyPlanId  = process.env.NEXT_PUBLIC_PAYPAL_YEARLY_PLAN_ID ?? '';
  const activePlanId  = selectedPlan === 'monthly' ? monthlyPlanId : yearlyPlanId;

  const TITLES: Partial<Record<FlowStep, string>> = {
    plans:            'Choose your plan',
    auth:             'Sign in to publish',
    payment:          'Complete payment',
    processing:       'Publishing…',
    domain_input:     'Custom Domain',
    dns_instructions: 'Custom Domain',
  };

  /* ── Reset on open/close ─────────────────────────────────────────────── */
  useEffect(() => {
    if (!isOpen) {
      setStep(isPublished ? (currentDomain ? 'dns_instructions' : 'domain_input') : 'plans');
      setSelectedPlan(null);
      setUserId(null);
      setAuthChecked(false);
      setEmail(''); setPassword('');
      setAuthError(null); setPaypalError(null);
      setSdkReady(false);
      buttonsRendered.current = false;
      setDomainError(null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  /* ── Check auth when dialog opens (for plan step) ────────────────────── */
  useEffect(() => {
    if (!isOpen || isPublished) return;
    setAuthChecked(false);
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setUserId(data.user.id);
      setAuthChecked(true);
    });
  }, [isOpen, isPublished]);

  /* ── Poll for PayPal SDK ─────────────────────────────────────────────── */
  useEffect(() => {
    if (step !== 'payment' || !isOpen) return;
    if (window.paypal) { setSdkReady(true); return; }
    const t = setInterval(() => {
      if (window.paypal) { setSdkReady(true); clearInterval(t); }
    }, 200);
    return () => clearInterval(t);
  }, [step, isOpen]);

  /* ── Render PayPal button ────────────────────────────────────────────── */
  useEffect(() => {
    if (
      step !== 'payment' || !sdkReady || !activePlanId ||
      !containerRef.current || buttonsRendered.current
    ) return;

    buttonsRendered.current = true;
    const container = containerRef.current;

    window.paypal!.Buttons({
      style: { shape: 'pill', color: 'gold', label: 'subscribe' },
      createSubscription(_data, actions) {
        setPaypalError(null);
        return actions.subscription.create({ plan_id: activePlanId });
      },
      onApprove(data) { handlePublish(data.subscriptionID); },
      onError(err) {
        const msg = typeof err === 'object' && err !== null && 'message' in err
          ? String((err as { message: unknown }).message)
          : 'Payment failed. Please try again.';
        setPaypalError(msg);
        buttonsRendered.current = false;
      },
      onCancel() { /* stay */ },
    })
      .render(container)
      .catch((err: unknown) => {
        setPaypalError(err instanceof Error ? err.message : 'PayPal failed to load.');
        buttonsRendered.current = false;
      });

    return () => {
      if (container) container.innerHTML = '';
      buttonsRendered.current = false;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, sdkReady, activePlanId]);

  /* ── Handlers ────────────────────────────────────────────────────────── */

  const handleSelectPlan = (plan: Plan) => {
    setSelectedPlan(plan);
    setPaypalError(null); setSdkReady(false);
    buttonsRendered.current = false;
    // If already logged in, skip auth
    if (userId) { setStep('payment'); }
    else        { setStep('auth'); }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true); setAuthError(null);
    const supabase = createClient();
    const { data, error } = authMode === 'signin'
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });
    if (error) {
      setAuthError(error.message);
    } else if (data.user) {
      setUserId(data.user.id);
      setStep('payment');
    } else {
      setAuthError('Check your email for a confirmation link, then sign in.');
    }
    setAuthLoading(false);
  };

  const handlePublish = useCallback(async (subscriptionId: string) => {
    setStep('processing');
    try {
      const res = await fetch(`/api/publish/${siteId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscriptionId, userId }),
      });
      const responseData = await res.json() as { error?: string };
      if (!res.ok) throw new Error(responseData.error ?? 'Publish failed');
      onPublished();
      setStep('domain_input');
    } catch (err) {
      setPaypalError(err instanceof Error ? err.message : 'Publish failed.');
      setStep('payment');
      buttonsRendered.current = false;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteId, userId]);

  const handleConnect = async () => {
    const raw = domainInput.trim().toLowerCase().replace(/^https?:\/\//, '');
    if (!raw) { setDomainError('Enter a domain name.'); return; }
    if (!/^[a-z0-9.-]+\.[a-z]{2,}$/.test(raw)) {
      setDomainError('Enter a valid domain (e.g. www.mysite.com).'); return;
    }
    setDomainError(null); setConnecting(true);
    try {
      const res = await fetch(`/api/domain/${siteId}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain: raw }),
      });
      const data = await res.json() as { error?: string };
      if (!res.ok) throw new Error(data.error ?? 'Failed to connect domain');
      onDomainSaved(raw);
      setStep('dns_instructions');
    } catch (err) {
      setDomainError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally { setConnecting(false); }
  };

  const handleRemove = async () => {
    setDomainError(null); setRemoving(true);
    try {
      const res = await fetch(`/api/domain/${siteId}`, { method: 'DELETE' });
      const data = await res.json() as { error?: string };
      if (!res.ok) throw new Error(data.error ?? 'Failed to remove domain');
      onDomainSaved(null);
      setDomainInput('');
      setStep('domain_input');
    } catch (err) {
      setDomainError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally { setRemoving(false); }
  };

  const canClose = step !== 'processing';

  /* ── Render ─────────────────────────────────────────────────────────── */
  return (
    <Modal
      isOpen={isOpen}
      onClose={canClose ? onClose : () => {}}
      title={TITLES[step] ?? 'Custom Domain'}
      maxWidth={520}
    >
      <div style={{ fontFamily: F, display: 'flex', flexDirection: 'column', gap: 18 }}>

        {/* ── STEP: PLANS ───────────────────────────────────────────── */}
        {step === 'plans' && (
          <>
            {/* Premium hero banner */}
            <div style={{
              background:   'linear-gradient(135deg, #1E1B4B 0%, #4C1D95 60%, #6D28D9 100%)',
              borderRadius: 16,
              padding:      '20px 20px 18px',
              display:      'flex',
              flexDirection:'column',
              gap:          10,
              position:     'relative',
              overflow:     'hidden',
            }}>
              {/* Decorative orb */}
              <div style={{
                position:     'absolute',
                top: -30, right: -30,
                width: 120, height: 120,
                background:   'rgba(255,255,255,0.07)',
                borderRadius: '50%',
              }} />
              <div style={{
                display:    'flex',
                alignItems: 'center',
                gap:        8,
              }}>
                <span style={{
                  display:      'inline-flex',
                  alignItems:   'center',
                  justifyContent:'center',
                  width:        28, height: 28,
                  background:   'rgba(255,255,255,0.15)',
                  borderRadius: 8,
                  fontSize:     15,
                }}>✦</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#C4B5FD', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: F }}>
                  Premium
                </span>
              </div>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.3, fontFamily: F }}>
                Go live + use your own domain
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                {[
                  'Your site live at localio.live/' + slug,
                  'Connect your own domain (e.g. www.yourbusiness.com)',
                  'SSL certificate included — free',
                ].map((feat) => (
                  <div key={feat} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, color: '#DDD6FE', fontFamily: F }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#A78BFA" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                    {feat}
                  </div>
                ))}
              </div>
            </div>

            {/* Subtext */}
            <p style={{ margin: 0, fontSize: 13, color: '#6B7280', lineHeight: 1.6, textAlign: 'center' }}>
              Pick a plan to publish <strong style={{ color: '#111' }}>{businessName}</strong>
            </p>

            {/* Plan cards */}
            {!authChecked ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 0', gap: 8, color: '#6B7280', fontSize: 14 }}>
                <span style={{
                  display: 'inline-block', width: 18, height: 18,
                  border: '2px solid #4F46E5', borderTopColor: 'transparent',
                  borderRadius: '50%', animation: 'spin 0.7s linear infinite',
                }} />
                Loading…
              </div>
            ) : (
              <div style={{ display: 'flex', gap: 12, paddingTop: 4 }}>
                <PlanCard
                  label="Monthly"
                  price="$1"
                  priceSub="first month"
                  then="then $5 / month"
                  onSelect={() => handleSelectPlan('monthly')}
                />
                <PlanCard
                  label="Yearly"
                  price="$47"
                  priceSub="per year"
                  then="billed once a year"
                  badge="Best value"
                  savings="Save $13 vs monthly"
                  onSelect={() => handleSelectPlan('yearly')}
                />
              </div>
            )}

            <p style={{ margin: 0, textAlign: 'center', fontSize: 12, color: '#9CA3AF' }}>
              No contract. Cancel anytime.
            </p>
          </>
        )}

        {/* ── STEP: AUTH ────────────────────────────────────────────── */}
        {step === 'auth' && (
          <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

            <div style={{ display: 'flex', gap: 4, padding: 4, background: '#F5F5F3', borderRadius: 14 }}>
              {(['signin', 'signup'] as AuthMode[]).map((m) => (
                <button
                  key={m} type="button"
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

            {(['email', 'password'] as const).map((field) => (
              <div key={field}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6, textTransform: 'capitalize' }}>
                  {field}
                </label>
                <input
                  type={field === 'password' ? 'password' : 'email'}
                  value={field === 'email' ? email : password}
                  onChange={(e) => field === 'email' ? setEmail(e.target.value) : setPassword(e.target.value)}
                  required placeholder={field === 'email' ? 'you@example.com' : '••••••••'}
                  minLength={field === 'password' ? 6 : undefined}
                  style={{
                    width: '100%', padding: '10px 14px',
                    border: '1.5px solid #E5E7EB', borderRadius: 12,
                    fontSize: 14, outline: 'none', boxSizing: 'border-box', fontFamily: F,
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = '#4F46E5'; }}
                  onBlur={(e)  => { e.currentTarget.style.borderColor = '#E5E7EB'; }}
                />
              </div>
            ))}

            {authError && (
              <div style={{ padding: '10px 14px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10, fontSize: 13, color: '#DC2626' }}>
                {authError}
              </div>
            )}

            <button
              type="submit" disabled={authLoading}
              style={{
                width: '100%', padding: '12px 0', background: '#4F46E5', color: '#fff',
                border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 700,
                cursor: authLoading ? 'default' : 'pointer', fontFamily: F,
                opacity: authLoading ? 0.7 : 1,
              }}
            >
              {authLoading ? 'Please wait…' : authMode === 'signin' ? 'Sign in & continue →' : 'Create account & continue →'}
            </button>

            <button
              type="button"
              onClick={() => { setStep('plans'); setAuthError(null); }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: '#6B7280', fontFamily: F, padding: 0, textAlign: 'center' }}
            >
              ← Back to plans
            </button>
          </form>
        )}

        {/* ── STEP: PAYMENT ─────────────────────────────────────────── */}
        {step === 'payment' && (
          <>
            {/* Plan recap chip */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '12px 16px', background: '#F5F3FF',
              border: '1.5px solid #DDD6FE', borderRadius: 14,
            }}>
              <span style={{ fontSize: 18 }}>{selectedPlan === 'yearly' ? '🏆' : '📅'}</span>
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
                onClick={() => { setStep('plans'); setPaypalError(null); setSdkReady(false); buttonsRendered.current = false; }}
                style={{ fontSize: 12, color: '#7C3AED', background: 'none', border: 'none', cursor: 'pointer', fontFamily: F, padding: 0, textDecoration: 'underline' }}
              >
                Change
              </button>
            </div>

            {!activePlanId && (
              <div style={{ padding: '10px 14px', background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 10, fontSize: 13, color: '#92400E' }}>
                PayPal plan not configured. Set <code style={{ fontSize: 11 }}>NEXT_PUBLIC_PAYPAL_{selectedPlan?.toUpperCase()}_PLAN_ID</code> in your environment.
              </div>
            )}

            {activePlanId && !sdkReady && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '20px 0', color: '#6B7280', fontSize: 14 }}>
                <span style={{ display: 'inline-block', width: 18, height: 18, border: '2px solid #4F46E5', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                Loading PayPal…
              </div>
            )}

            {activePlanId && sdkReady && (
              <div ref={containerRef} style={{ minHeight: 45 }} />
            )}

            {paypalError && (
              <div style={{ padding: '10px 14px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10, fontSize: 13, color: '#DC2626' }}>
                {paypalError}
              </div>
            )}
          </>
        )}

        {/* ── STEP: PROCESSING ──────────────────────────────────────── */}
        {step === 'processing' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, padding: '36px 0' }}>
            <span style={{ display: 'inline-block', width: 40, height: 40, border: '3px solid #4F46E5', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
            <p style={{ margin: 0, fontSize: 14, color: '#6B7280', textAlign: 'center' }}>
              Verifying payment and publishing your site…
            </p>
          </div>
        )}

        {/* ── STEP: DOMAIN INPUT ────────────────────────────────────── */}
        {step === 'domain_input' && (
          <>
            {/* Published success banner (shown after payment) */}
            {!isPublished && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '12px 16px', background: '#F0FDF4',
                border: '1.5px solid #BBF7D0', borderRadius: 12,
              }}>
                <span style={{ width: 26, height: 26, background: '#22C55E', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                </span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#166534' }}>Site is live!</div>
                  <div style={{ fontSize: 12, color: '#16A34A', fontFamily: 'monospace' }}>{appDomain}/{slug}</div>
                </div>
              </div>
            )}

            <p style={{ margin: 0, fontSize: 14, color: '#374151', lineHeight: 1.6 }}>
              Enter the domain you own — we&apos;ll give you the DNS record to point it here.
            </p>

            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Your domain</label>
              <input
                type="text"
                value={domainInput}
                onChange={(e) => { setDomainInput(e.target.value); setDomainError(null); }}
                placeholder="www.myplumbingco.com"
                onKeyDown={(e) => { if (e.key === 'Enter') handleConnect(); }}
                style={{
                  width: '100%', padding: '10px 14px',
                  border: `1.5px solid ${domainError ? '#FCA5A5' : '#E5E7EB'}`,
                  borderRadius: 12, fontSize: 14, outline: 'none',
                  boxSizing: 'border-box', fontFamily: F,
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = domainError ? '#EF4444' : '#4F46E5'; }}
                onBlur={(e)  => { e.currentTarget.style.borderColor = domainError ? '#FCA5A5' : '#E5E7EB'; }}
              />
              {domainError && <p style={{ margin: '6px 0 0', fontSize: 12, color: '#EF4444' }}>{domainError}</p>}
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
                fontFamily: F, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}
            >
              {connecting && <span style={{ width: 14, height: 14, border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />}
              {connecting ? 'Connecting…' : 'Connect domain →'}
            </button>

            <button
              onClick={onClose}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: '#9CA3AF', fontFamily: F, padding: 0, textAlign: 'center' }}
            >
              Skip for now
            </button>
          </>
        )}

        {/* ── STEP: DNS INSTRUCTIONS ────────────────────────────────── */}
        {step === 'dns_instructions' && (
          <>
            {/* Connected domain chip */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '12px 16px', background: '#F0FDF4',
              border: '1.5px solid #BBF7D0', borderRadius: 12,
            }}>
              <span style={{ width: 28, height: 28, background: '#22C55E', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
              </span>
              <span style={{ fontFamily: 'monospace', fontSize: 13, color: '#166534', fontWeight: 600, flex: 1, wordBreak: 'break-all' }}>
                {domainInput || currentDomain}
              </span>
              <button
                onClick={handleRemove} disabled={removing}
                style={{ fontSize: 12, color: '#EF4444', background: 'none', border: 'none', cursor: removing ? 'default' : 'pointer', fontFamily: F, padding: 0, fontWeight: 600, opacity: removing ? 0.5 : 1 }}
              >
                {removing ? 'Removing…' : 'Remove'}
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#111' }}>Point your DNS to Localio</p>
              <p style={{ margin: 0, fontSize: 13, color: '#6B7280', lineHeight: 1.5 }}>
                Log into your domain registrar (GoDaddy, Namecheap, etc.) and add this DNS record:
              </p>

              <div style={{
                background: '#F8F7F4', borderRadius: 10, padding: '14px 16px',
                border: '1px solid #E5E7EB', display: 'flex', flexDirection: 'column', gap: 8,
              }}>
                {[['Type', 'CNAME'], ['Name / Host', 'www'], ['Points to', 'cname.vercel-dns.com']].map(([label, value], i, arr) => (
                  <div key={label}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                      <span style={{ color: '#6B7280', fontWeight: 600, fontFamily: F }}>{label}</span>
                      <span style={{ fontFamily: 'monospace', color: label === 'Points to' ? '#4F46E5' : '#111', wordBreak: 'break-all' }}>{value}</span>
                    </div>
                    {i < arr.length - 1 && <div style={{ height: 1, background: '#E5E7EB', marginTop: 8 }} />}
                  </div>
                ))}
              </div>

              <p style={{ margin: 0, fontSize: 12, color: '#9CA3AF', lineHeight: 1.5 }}>
                DNS changes can take up to 24 hours to propagate. SSL is included automatically.
              </p>
            </div>

            {domainError && <p style={{ margin: 0, fontSize: 12, color: '#EF4444' }}>{domainError}</p>}

            <button
              onClick={() => { setStep('domain_input'); setDomainInput(''); setDomainError(null); }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: '#6B7280', fontFamily: F, padding: 0, textDecoration: 'underline', textAlign: 'left' }}
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
