import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { BusinessData, BusinessDataPatch, SiteRow } from '@/templates/types';

type UpdateBody = BusinessDataPatch & { template_id?: string };

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerClient();
    const body = (await req.json()) as UpdateBody;
    const { template_id: templateId, ...patch } = body;

    const updates: Partial<Pick<SiteRow, 'business_data' | 'template_id'>> = {};

    if (templateId !== undefined && typeof templateId === 'string' && templateId.trim() !== '') {
      updates.template_id = templateId.trim();
    }

    if (Object.keys(patch).length > 0) {
      const { data: existing, error: fetchErr } = await supabase
        .from('sites')
        .select('business_data')
        .eq('id', params.id)
        .single<Pick<SiteRow, 'business_data'>>();

      if (fetchErr || !existing) {
        return NextResponse.json({ error: 'Site not found' }, { status: 404 });
      }

      const updated = { ...existing.business_data, ...patch };
      updates.business_data = updated;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({});
    }

    const { error: updateErr } = await supabase
      .from('sites')
      .update(updates)
      .eq('id', params.id);

    if (updateErr) throw new Error(updateErr.message);

    const res: { businessData?: BusinessData; template_id?: string } = {};
    if (updates.business_data) res.businessData = updates.business_data;
    if (updates.template_id) res.template_id = updates.template_id;
    return NextResponse.json(res);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    console.error('[/api/update]', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
