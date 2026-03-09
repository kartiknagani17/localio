import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { v4 as uuid } from 'uuid';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerClient();
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const type = (formData.get('type') as string) ?? 'general';
    const label = (formData.get('label') as string) ?? '';

    if (!file) {
      return NextResponse.json({ error: 'No file' }, { status: 400 });
    }
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'Max 5MB' }, { status: 400 });
    }

    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type)) {
      return NextResponse.json({ error: 'JPG/PNG/WEBP only' }, { status: 400 });
    }

    const ext = file.name.split('.').pop() ?? 'jpg';
    const path = `${params.id}/${uuid()}.${ext}`;

    const { error: uploadErr } = await supabase.storage
      .from('business-photos')
      .upload(path, file, { contentType: file.type, upsert: false });

    if (uploadErr) {
      return NextResponse.json({ error: uploadErr.message }, { status: 500 });
    }

    const { data: { publicUrl } } = supabase.storage
      .from('business-photos')
      .getPublicUrl(path);

    await supabase.from('uploads').insert({
      site_id: params.id,
      storage_url: publicUrl,
      type,
      label,
    });

    return NextResponse.json({ url: publicUrl, type, label });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
