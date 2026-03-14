import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { getServerUser } from '@/lib/supabase/auth';

// POST /api/claim/:id
// Associates an existing site (created anonymously) with the currently
// authenticated user. Safe to call multiple times — idempotent.
export async function POST(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getServerUser();
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const supabase = createServerClient();
    const { error } = await supabase
      .from('sites')
      .update({ user_id: user.id })
      .eq('id', params.id);

    if (error) throw new Error(error.message);

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    console.error('[/api/claim]', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
