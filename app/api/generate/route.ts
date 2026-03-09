import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { extractBusinessData } from '@/lib/gemini/extract';
import { selectTemplate } from '@/lib/gemini/selectTemplate';
import { uniqueSlug } from '@/lib/slugify';
import { QuickFormData } from '@/templates/types';

export async function POST(req: NextRequest) {
  try {
    const supabase = createServerClient();
    const body = (await req.json()) as QuickFormData;

    if (!body.businessName?.trim() || !body.city?.trim() || !body.businessType?.trim()) {
      return NextResponse.json(
        { error: 'businessName, city, and businessType are required' },
        { status: 400 }
      );
    }

    const businessData = await extractBusinessData({
      businessName: body.businessName,
      city: body.city,
      businessType: body.businessType,
    });

    const templateId = selectTemplate(businessData);
    const slug = uniqueSlug(businessData.name);

    const { data: site, error: dbError } = await supabase
      .from('sites')
      .insert({
        slug,
        template_id: templateId,
        business_data: businessData,
        status: 'preview',
      })
      .select('id')
      .single();

    if (dbError) throw new Error(dbError.message);

    return NextResponse.json({
      siteId: site.id,
      previewUrl: `/preview/${site.id}`,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    console.error('[/api/generate]', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
