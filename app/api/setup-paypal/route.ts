/**
 * ONE-TIME SETUP ROUTE
 * Hit this once to create the PayPal product + billing plan in your account.
 * After you copy the plan ID into .env.local, this route is no longer needed.
 *
 * Usage: GET http://localhost:3000/api/setup-paypal
 */

import { NextResponse } from 'next/server';

const PAYPAL_API_BASE = process.env.PAYPAL_API_BASE ?? 'https://api-m.paypal.com';

async function getAccessToken(): Promise<string> {
  const clientId     = process.env.PAYPAL_CLIENT_ID!;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET!;
  const auth         = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

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

  if (!res.ok) throw new Error(`Token error: ${await res.text()}`);
  const data = await res.json() as { access_token: string };
  return data.access_token;
}

async function createProduct(token: string): Promise<string> {
  const res = await fetch(`${PAYPAL_API_BASE}/v1/catalogs/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name:        'Localio — Publish',
      description: 'Publish your local business website and get a live link.',
      type:        'SERVICE',
      category:    'SOFTWARE',
    }),
  });

  if (!res.ok) throw new Error(`Create product error: ${await res.text()}`);
  const data = await res.json() as { id: string };
  return data.id;
}

async function createPlan(token: string, productId: string): Promise<{ id: string; status: string }> {
  const res = await fetch(`${PAYPAL_API_BASE}/v1/billing/plans`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      'Prefer': 'return=representation',
    },
    body: JSON.stringify({
      product_id: productId,
      name:       'Localio Monthly — Intro Offer',
      description: 'First month $0.99, then $4.99/month.',
      status:     'ACTIVE',
      billing_cycles: [
        {
          // Intro / trial: $0.99 for the first month
          frequency: {
            interval_unit:  'MONTH',
            interval_count: 1,
          },
          tenure_type:  'TRIAL',
          sequence:     1,
          total_cycles: 1,
          pricing_scheme: {
            fixed_price: {
              value:         '0.99',
              currency_code: 'USD',
            },
          },
        },
        {
          // Regular: $4.99/month indefinitely
          frequency: {
            interval_unit:  'MONTH',
            interval_count: 1,
          },
          tenure_type:  'REGULAR',
          sequence:     2,
          total_cycles: 0,   // 0 = never ends
          pricing_scheme: {
            fixed_price: {
              value:         '4.99',
              currency_code: 'USD',
            },
          },
        },
      ],
      payment_preferences: {
        auto_bill_outstanding:     true,
        setup_fee_failure_action:  'CONTINUE',
        payment_failure_threshold: 3,
      },
    }),
  });

  if (!res.ok) throw new Error(`Create plan error: ${await res.text()}`);
  const data = await res.json() as { id: string; status: string };
  return data;
}

export async function GET() {
  try {
    if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
      return NextResponse.json(
        { error: 'PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET must be set in .env.local' },
        { status: 500 }
      );
    }

    const token     = await getAccessToken();
    const productId = await createProduct(token);
    const plan      = await createPlan(token, productId);

    return NextResponse.json({
      success:   true,
      productId,
      planId:    plan.id,
      planStatus: plan.status,
      message:   `Done! Copy the planId below into your .env.local as PAYPAL_PLAN_ID and NEXT_PUBLIC_PAYPAL_PLAN_ID, then restart the dev server.`,
      env:       `PAYPAL_PLAN_ID=${plan.id}\nNEXT_PUBLIC_PAYPAL_PLAN_ID=${plan.id}`,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[/api/setup-paypal]', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
