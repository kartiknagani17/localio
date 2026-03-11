import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

const PAYPAL_API_BASE = process.env.PAYPAL_API_BASE ?? 'https://api-m.paypal.com';

async function getPayPalAccessToken(): Promise<string> {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error('PayPal credentials not configured');
  }
  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const res = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-Language': 'en_US',
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${auth}`,
    },
    body: 'grant_type=client_credentials',
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`PayPal token failed: ${err}`);
  }
  const data = (await res.json()) as { access_token: string };
  return data.access_token;
}

async function getSubscriptionStatus(subscriptionId: string): Promise<string> {
  const token = await getPayPalAccessToken();
  const res = await fetch(`${PAYPAL_API_BASE}/v1/billing/subscriptions/${subscriptionId}`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    if (res.status === 404) return 'NOT_FOUND';
    const err = await res.text();
    throw new Error(`PayPal subscription fetch failed: ${err}`);
  }
  const data = (await res.json()) as { status?: string };
  return data.status ?? 'UNKNOWN';
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json().catch(() => ({})) as { subscriptionId?: string; userId?: string };
    const subscriptionId = typeof body.subscriptionId === 'string' ? body.subscriptionId.trim() : '';
    const userId         = typeof body.userId         === 'string' ? body.userId.trim()         : null;

    if (!subscriptionId) {
      return NextResponse.json(
        { error: 'A subscription is required to publish. Complete payment in the modal.' },
        { status: 402 }
      );
    }

    const status = await getSubscriptionStatus(subscriptionId);
    if (status !== 'ACTIVE') {
      return NextResponse.json(
        {
          error:
            status === 'NOT_FOUND'
              ? 'Subscription not found. Please try again after completing payment.'
              : `Subscription is not active (${status}). Only active subscriptions can publish.`,
        },
        { status: 402 }
      );
    }

    const supabase = createServerClient();

    // Build the update payload — include user_id only when provided
    const updatePayload: Record<string, unknown> = {
      status: 'published',
      payment_subscription_id: subscriptionId,
    };
    if (userId) updatePayload.user_id = userId;

    const { data: site, error } = await supabase
      .from('sites')
      .update(updatePayload)
      .eq('id', id)
      .select('slug')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const domain = process.env.NEXT_PUBLIC_SITE_DOMAIN ?? 'localio.live';
    const publicUrl = `https://${domain}/${site.slug}`;

    return NextResponse.json({ publicUrl, slug: site.slug });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[/api/publish]', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
