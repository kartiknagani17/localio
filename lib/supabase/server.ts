import { createClient } from '@supabase/supabase-js';

// Service role key — bypasses RLS.
// Only use in API routes and server components.
// Never import in any 'use client' file.
export function createServerClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}
