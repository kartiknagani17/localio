import { NextRequest, NextResponse } from 'next/server';

const MAIN_DOMAIN   = process.env.NEXT_PUBLIC_SITE_DOMAIN ?? 'localio.live';
const SUPABASE_URL  = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY  = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function middleware(req: NextRequest) {
  const host = req.headers.get('host') ?? '';

  // Pass through for: main domain, localhost, Vercel preview URLs, API/Next internals
  if (
    host.includes(MAIN_DOMAIN) ||
    host.includes('localhost') ||
    host.includes('vercel.app') ||
    req.nextUrl.pathname.startsWith('/_next') ||
    req.nextUrl.pathname.startsWith('/api')
  ) {
    return NextResponse.next();
  }

  // Custom domain — look up the site slug from Supabase
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/sites?custom_domain=eq.${encodeURIComponent(host)}&status=eq.published&select=slug&limit=1`,
      {
        headers: {
          apikey:        SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
      }
    );

    if (res.ok) {
      const rows = await res.json() as { slug: string }[];
      if (rows.length > 0) {
        // Rewrite to the public site page, keeping custom domain in the address bar
        const url = req.nextUrl.clone();
        url.pathname = `/p/${rows[0].slug}`;
        return NextResponse.rewrite(url);
      }
    }
  } catch { /* network error — fall through */ }

  // Domain not found — serve a 404-like page
  const url = req.nextUrl.clone();
  url.pathname = '/not-found';
  return NextResponse.rewrite(url);
}

export const config = {
  // Run on all paths except static assets
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
