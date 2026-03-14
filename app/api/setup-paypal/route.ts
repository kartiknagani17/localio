/**
 * ONE-TIME SETUP ROUTE
 * Hit this once to create the PayPal product + two billing plans in your account.
 * Plans created:
 *   1. Monthly  — $1 for the first month, then $5/month
 *   2. Yearly   — $47/year
 *
 * After you copy the plan IDs into .env.local, this route is no longer needed.
 *
 * Usage: GET http://localhost:3000/api/setup-paypal
 */

import { NextResponse } from 'next/server';

const PAYPAL_API_BASE = process.env.PAYPAL_API_BASE ?? 'https://api-m.sandbox.paypal.com';

async function getAccessToken(): Promise<string> {
  const clientId     = process.env.PAYPAL_CLIENT_ID!;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET!;
  const auth         = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  const res = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Accept:            'application/json',
      'Accept-Language': 'en_US',
      'Content-Type':    'application/x-www-form-urlencoded',
      Authorization:     `Basic ${auth}`,
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
      Authorization:  `Bearer ${token}`,
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

async function createMonthlyPlan(
  token: string,
  productId: string
): Promise<{ id: string; status: string }> {
  const res = await fetch(`${PAYPAL_API_BASE}/v1/billing/plans`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization:  `Bearer ${token}`,
      Prefer:         'return=representation',
    },
    body: JSON.stringify({
      product_id:  productId,
      name:        'Localio Monthly — Intro Offer',
      description: 'First month $1, then $5/month.',
      status:      'ACTIVE',
      billing_cycles: [
        {
          frequency:    { interval_unit: 'MONTH', interval_count: 1 },
          tenure_type:  'TRIAL',
          sequence:     1,
          total_cycles: 1,
          pricing_scheme: {
            fixed_price: { value: '1.00', currency_code: 'USD' },
          },
        },
        {
          frequency:    { interval_unit: 'MONTH', interval_count: 1 },
          tenure_type:  'REGULAR',
          sequence:     2,
          total_cycles: 0,
          pricing_scheme: {
            fixed_price: { value: '5.00', currency_code: 'USD' },
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

  if (!res.ok) throw new Error(`Create monthly plan error: ${await res.text()}`);
  return res.json() as Promise<{ id: string; status: string }>;
}

async function createYearlyPlan(
  token: string,
  productId: string
): Promise<{ id: string; status: string }> {
  const res = await fetch(`${PAYPAL_API_BASE}/v1/billing/plans`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization:  `Bearer ${token}`,
      Prefer:         'return=representation',
    },
    body: JSON.stringify({
      product_id:  productId,
      name:        'Localio Yearly',
      description: '$47/year — best value.',
      status:      'ACTIVE',
      billing_cycles: [
        {
          frequency:    { interval_unit: 'YEAR', interval_count: 1 },
          tenure_type:  'REGULAR',
          sequence:     1,
          total_cycles: 0,
          pricing_scheme: {
            fixed_price: { value: '47.00', currency_code: 'USD' },
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

  if (!res.ok) throw new Error(`Create yearly plan error: ${await res.text()}`);
  return res.json() as Promise<{ id: string; status: string }>;
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
    const monthly   = await createMonthlyPlan(token, productId);
    const yearly    = await createYearlyPlan(token, productId);

    return NextResponse.json({
      success:           true,
      productId,
      monthlyPlanId:     monthly.id,
      monthlyPlanStatus: monthly.status,
      yearlyPlanId:      yearly.id,
      yearlyPlanStatus:  yearly.status,
      message:           'Done! Add both plan IDs to your .env.local and restart the server.',
      env: [
        `NEXT_PUBLIC_PAYPAL_MONTHLY_PLAN_ID=${monthly.id}`,
        `NEXT_PUBLIC_PAYPAL_YEARLY_PLAN_ID=${yearly.id}`,
        `# Legacy fallback (used if MONTHLY_PLAN_ID is not set):`,
        `NEXT_PUBLIC_PAYPAL_PLAN_ID=${monthly.id}`,
      ].join('\n'),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[/api/setup-paypal]', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
