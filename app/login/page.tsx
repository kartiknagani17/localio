'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

type Mode = 'signin' | 'signup';

export default function LoginPage() {
  const router = useRouter();

  const [mode, setMode]         = useState<Mode>('signin');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const [info, setInfo]         = useState<string | null>(null);

  // If already logged in, redirect straight to dashboard
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) router.replace('/dashboard');
    });
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setInfo(null);

    const supabase = createClient();

    if (mode === 'signin') {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
        setLoading(false);
      } else {
        router.push('/dashboard');
      }
    } else {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setError(error.message);
        setLoading(false);
      } else if (data.user && data.session) {
        // Auto-confirmed (e.g. email confirmations disabled in Supabase)
        router.push('/dashboard');
      } else {
        // Confirmation email sent
        setInfo('Check your email for a confirmation link, then sign in.');
        setMode('signin');
        setPassword('');
        setLoading(false);
      }
    }
  };

  /* ── Styles ─────────────────────────────────────────────────────────── */
  const S = {
    page: {
      minHeight:      '100vh',
      background:     '#FAFAF8',
      display:        'flex',
      flexDirection:  'column' as const,
      alignItems:     'center',
      justifyContent: 'center',
      padding:        '24px 16px',
      fontFamily:     "var(--font-jakarta, 'Plus Jakarta Sans', sans-serif)",
    },
    card: {
      width:        '100%',
      maxWidth:     420,
      background:   '#FFFFFF',
      borderRadius: 24,
      boxShadow:    '0 8px 40px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.05)',
      overflow:     'hidden',
    },
    cardHeader: {
      padding:      '32px 32px 24px',
      borderBottom: '1px solid #F3F0ED',
    },
    logo: {
      fontSize:   22,
      fontWeight: 800,
      color:      '#111',
      marginBottom: 8,
      letterSpacing: '-0.03em',
    },
    subtitle: {
      fontSize:   14,
      color:      '#6B7280',
      margin:     0,
    },
    cardBody: {
      padding: '28px 32px 32px',
    },
    toggle: {
      display:       'flex',
      gap:           4,
      padding:       4,
      background:    '#F5F5F3',
      borderRadius:  14,
      marginBottom:  24,
    },
    toggleBtn: (active: boolean) => ({
      flex:         1,
      padding:      '9px 0',
      border:       'none',
      borderRadius: 10,
      fontSize:     13,
      fontWeight:   600 as const,
      cursor:       'pointer',
      transition:   'all 0.15s',
      background:   active ? '#fff' : 'transparent',
      color:        active ? '#111' : '#9CA3AF',
      boxShadow:    active ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
      fontFamily:   'inherit',
    }),
    fieldWrap: {
      marginBottom: 16,
    },
    label: {
      display:      'block',
      fontSize:     13,
      fontWeight:   600,
      color:        '#374151',
      marginBottom: 6,
    },
    input: {
      width:        '100%',
      padding:      '11px 14px',
      border:       '1.5px solid #E5E7EB',
      borderRadius: 12,
      fontSize:     14,
      outline:      'none',
      boxSizing:    'border-box' as const,
      fontFamily:   'inherit',
      transition:   'border-color 0.15s',
      color:        '#111',
      background:   '#fff',
    },
    errorBox: {
      padding:      '10px 14px',
      background:   '#FEF2F2',
      border:       '1px solid #FECACA',
      borderRadius: 10,
      fontSize:     13,
      color:        '#DC2626',
      marginBottom: 16,
    },
    infoBox: {
      padding:      '10px 14px',
      background:   '#F0FDF4',
      border:       '1px solid #BBF7D0',
      borderRadius: 10,
      fontSize:     13,
      color:        '#166534',
      marginBottom: 16,
    },
    submitBtn: {
      width:        '100%',
      padding:      '13px',
      background:   '#F97316',
      color:        '#fff',
      border:       'none',
      borderRadius: 14,
      fontSize:     15,
      fontWeight:   700,
      cursor:       loading ? 'not-allowed' : 'pointer',
      opacity:      loading ? 0.7 : 1,
      transition:   'all 0.15s',
      fontFamily:   'inherit',
    },
    backLink: {
      display:    'block',
      textAlign:  'center' as const,
      marginTop:  20,
      fontSize:   13,
      color:      '#9CA3AF',
      textDecoration: 'none',
    },
  };

  return (
    <div style={S.page}>
      <div style={S.card}>

        {/* Header */}
        <div style={S.cardHeader}>
          <div style={S.logo}>Localio</div>
          <p style={S.subtitle}>
            {mode === 'signin'
              ? 'Sign in to manage your websites'
              : 'Create an account to get started'}
          </p>
        </div>

        {/* Body */}
        <div style={S.cardBody}>

          {/* Mode toggle */}
          <div style={S.toggle}>
            <button style={S.toggleBtn(mode === 'signin')} onClick={() => { setMode('signin'); setError(null); setInfo(null); }}>
              Sign in
            </button>
            <button style={S.toggleBtn(mode === 'signup')} onClick={() => { setMode('signup'); setError(null); setInfo(null); }}>
              Create account
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div style={S.fieldWrap}>
              <label style={S.label}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                style={S.input}
                onFocus={(e)  => { e.currentTarget.style.borderColor = '#F97316'; }}
                onBlur={(e)   => { e.currentTarget.style.borderColor = '#E5E7EB'; }}
              />
            </div>

            {/* Password */}
            <div style={S.fieldWrap}>
              <label style={S.label}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                placeholder="At least 6 characters"
                style={S.input}
                onFocus={(e)  => { e.currentTarget.style.borderColor = '#F97316'; }}
                onBlur={(e)   => { e.currentTarget.style.borderColor = '#E5E7EB'; }}
              />
            </div>

            {/* Feedback */}
            {error && <div style={S.errorBox}>{error}</div>}
            {info  && <div style={S.infoBox}>{info}</div>}

            <button type="submit" disabled={loading} style={S.submitBtn}>
              {loading
                ? 'Please wait…'
                : mode === 'signin'
                  ? 'Sign in →'
                  : 'Create account →'}
            </button>
          </form>

          <a href="/" style={S.backLink}>← Back to home</a>
        </div>
      </div>
    </div>
  );
}
