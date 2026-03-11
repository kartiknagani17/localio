// lib/supabase/auth.ts
//
// Server-side helper: reads the logged-in user from the Supabase session stored
// in cookies. Uses the anon key (not service role) so it respects Supabase Auth.
// Only use this in server components and API routes — never in 'use client' files.

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { User } from '@supabase/supabase-js';

export async function getServerUser(): Promise<User | null> {
  const cookieStore = cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  return user;
}
