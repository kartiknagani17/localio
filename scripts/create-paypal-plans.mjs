/**
 * One-time script to create PayPal subscription plans for Localio.
 *
 * Usage:
 *   node scripts/create-paypal-plans.mjs
 *
 * Prerequisites — set these in your shell before running:
 *   export PAYPAL_CLIENT_ID=your_client_id
 *   export PAYPAL_CLIENT_SECRET=your_client_secret
 *
 * For sandbox testing use:
 *   export PAYPAL_API_BASE=https://api-m.sandbox.paypal.com
 * For production use:
 *   export PAYPAL_API_BASE=https://api-m.paypal.com  (default)
 *
 * After running, copy the printed plan IDs into your .env.local:
 *   NEXT_PUBLIC_PAYPAL_MONTHLY_PLAN_ID=P-...
 *   NEXT_PUBLIC_PAYPAL_YEARLY_PLAN_ID=P-...
 */

const BASE = process.env.PAYPAL_API_BASE ?? 'https://api-m.paypal.com';
const CLIENT_ID     = process.env.PAYPAL_CLIENT_ID;
const CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('❌  Set PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET before running.');
  process.exit(1);
}

/* ── Helpers ──────────────────────────────────────────────────────────────── */

async function getAccessToken() {
  const auth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
  const res = await fetch(`${BASE}/v1/oauth2/token`, {
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
    const t = await res.text();
    throw new Error(`Token failed: ${t}`);
  }
  const data = await res.json();
  return data.access_token;
}

async function post(token, path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      Prefer: 'return=representation',
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(`POST ${path} failed (${res.status}): ${JSON.stringify(data)}`);
  }
  return data;
}

/* ── Main ─────────────────────────────────────────────────────────────────── */

async function main() {
  console.log(`\n🔑  Getting PayPal access token from ${BASE}…`);
  const token = await getAccessToken();
  console.log('   ✓ Token obtained\n');

  /* 1. Create product ─────────────────────────────────────────────────────── */
  console.log('📦  Creating product…');
  const product = await post(token, '/v1/catalogs/products', {
    name:        'Localio Website Hosting',
    description: 'Publish and host your local business website on Localio.',
    type:        'SERVICE',
    category:    'SOFTWARE',
  });
  console.log(`   ✓ Product created: ${product.id}\n`);

  /* 2. Create monthly plan ($1 first month → $5/month) ───────────────────── */
  console.log('📅  Creating Monthly plan ($1 first month, then $5/month)…');
  const monthly = await post(token, '/v1/billing/plans', {
    product_id:  product.id,
    name:        'Localio Monthly',
    description: '$1 for the first month, then $5/month. Cancel anytime.',
    status:      'ACTIVE',
    billing_cycles: [
      {
        // Trial cycle — $1 for the first month
        tenure_type: 'TRIAL',
        sequence:    1,
        total_cycles: 1,
        frequency: { interval_unit: 'MONTH', interval_count: 1 },
        pricing_scheme: {
          fixed_price: { value: '1', currency_code: 'USD' },
        },
      },
      {
        // Regular cycle — $5/month
        tenure_type: 'REGULAR',
        sequence:    2,
        total_cycles: 0, // 0 = infinite
        frequency: { interval_unit: 'MONTH', interval_count: 1 },
        pricing_scheme: {
          fixed_price: { value: '5', currency_code: 'USD' },
        },
      },
    ],
    payment_preferences: {
      auto_bill_outstanding:     true,
      setup_fee_failure_action:  'CONTINUE',
      payment_failure_threshold: 3,
    },
  });
  console.log(`   ✓ Monthly plan created: ${monthly.id}\n`);

  /* 3. Create yearly plan ($47/year) ─────────────────────────────────────── */
  console.log('🏆  Creating Yearly plan ($47/year)…');
  const yearly = await post(token, '/v1/billing/plans', {
    product_id:  product.id,
    name:        'Localio Yearly',
    description: '$47/year — best value. Billed once annually.',
    status:      'ACTIVE',
    billing_cycles: [
      {
        tenure_type: 'REGULAR',
        sequence:    1,
        total_cycles: 0, // 0 = infinite (renews yearly)
        frequency: { interval_unit: 'YEAR', interval_count: 1 },
        pricing_scheme: {
          fixed_price: { value: '47', currency_code: 'USD' },
        },
      },
    ],
    payment_preferences: {
      auto_bill_outstanding:     true,
      setup_fee_failure_action:  'CONTINUE',
      payment_failure_threshold: 3,
    },
  });
  console.log(`   ✓ Yearly plan created: ${yearly.id}\n`);

  /* 4. Print results ──────────────────────────────────────────────────────── */
  console.log('━'.repeat(60));
  console.log('✅  Done! Add these to your .env.local:\n');
  console.log(`NEXT_PUBLIC_PAYPAL_MONTHLY_PLAN_ID=${monthly.id}`);
  console.log(`NEXT_PUBLIC_PAYPAL_YEARLY_PLAN_ID=${yearly.id}`);
  console.log('━'.repeat(60));
  console.log('\nAlso make sure you have the PayPal JS SDK in your layout:');
  console.log(`<script src="https://www.paypal.com/sdk/js?client-id=YOUR_CLIENT_ID&vault=true&intent=subscription"></script>\n`);
}

main().catch((err) => {
  console.error('\n❌ ', err.message);
  process.exit(1);
});
