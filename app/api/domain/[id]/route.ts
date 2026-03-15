import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

const VERCEL_TOKEN      = process.env.VERCEL_TOKEN;
const VERCEL_PROJECT_ID = process.env.VERCEL_PROJECT_ID;
const VERCEL_TEAM_ID    = process.env.VERCEL_TEAM_ID; // optional

function vercelUrl(path: string) {
  const base = `https://api.vercel.com${path}`;
  return VERCEL_TEAM_ID ? `${base}${path.includes('?') ? '&' : '?'}teamId=${VERCEL_TEAM_ID}` : base;
}

function vercelHeaders() {
  return {
    Authorization:  `Bearer ${VERCEL_TOKEN}`,
    'Content-Type': 'application/json',
  };
}

/* ── POST /api/domain/[id] — add custom domain ───────────────────────── */
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!VERCEL_TOKEN || !VERCEL_PROJECT_ID) {
    return NextResponse.json(
      { error: 'Domain management is not configured. Set VERCEL_TOKEN and VERCEL_PROJECT_ID.' },
      { status: 501 }
    );
  }

  const { id } = params;
  const body = await req.json().catch(() => ({})) as { domain?: string };
  const domain = typeof body.domain === 'string' ? body.domain.trim().toLowerCase() : '';

  if (!domain) {
    return NextResponse.json({ error: 'Domain is required.' }, { status: 400 });
  }

  try {
    // 1. Add domain to Vercel project
    const vercelRes = await fetch(
      vercelUrl(`/v9/projects/${VERCEL_PROJECT_ID}/domains`),
      {
        method:  'POST',
        headers: vercelHeaders(),
        body:    JSON.stringify({ name: domain }),
      }
    );

    if (!vercelRes.ok) {
      const err = await vercelRes.json() as { error?: { message?: string } };
      const msg = err?.error?.message ?? 'Vercel rejected the domain.';
      // 409 = domain already exists on project — treat as success
      if (vercelRes.status !== 409) {
        return NextResponse.json({ error: msg }, { status: vercelRes.status });
      }
    }

    // 2. Save custom_domain in Supabase
    const supabase = createServerClient();
    const { error } = await supabase
      .from('sites')
      .update({ custom_domain: domain })
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ domain });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[/api/domain POST]', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/* ── DELETE /api/domain/[id] — remove custom domain ─────────────────── */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const supabase = createServerClient();

    // 1. Look up current custom_domain
    const { data: site, error: fetchErr } = await supabase
      .from('sites')
      .select('custom_domain')
      .eq('id', id)
      .single();

    if (fetchErr || !site) {
      return NextResponse.json({ error: 'Site not found.' }, { status: 404 });
    }

    const domain = site.custom_domain as string | null;

    // 2. Remove from Vercel if configured
    if (domain && VERCEL_TOKEN && VERCEL_PROJECT_ID) {
      await fetch(
        vercelUrl(`/v9/projects/${VERCEL_PROJECT_ID}/domains/${domain}`),
        { method: 'DELETE', headers: vercelHeaders() }
      ).catch(() => { /* best-effort */ });
    }

    // 3. Clear custom_domain in Supabase
    const { error } = await supabase
      .from('sites')
      .update({ custom_domain: null })
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ removed: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[/api/domain DELETE]', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
