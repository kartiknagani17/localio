import { createServerClient } from '@/lib/supabase/server';
import { getTemplateSafe, getTemplateById, getTemplatesForBusinessType } from '@/templates/registry';
import PreviewClient from './PreviewClient';
import { SiteRow } from '@/templates/types';

export default async function PreviewPage({
  params,
  searchParams,
}: {
  params:       { id: string };
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const { id } = params;
  const supabase = createServerClient();

  const { data: site } = await supabase
    .from('sites')
    .select('*')
    .eq('id', id)
    .single<SiteRow>();

  if (!site) {
    return (
      <div style={{ padding: 48, textAlign: 'center' }}>
        <h1>Site not found</h1>
        <p>This preview link may be invalid or expired.</p>
      </div>
    );
  }

  // If a template was passed via ?t= URL param (from choose-theme's fire-and-forget
  // PATCH), use it immediately so the correct theme renders without waiting for the
  // DB write to complete. Falls back to site.template_id if param is absent/invalid.
  const tParam = typeof searchParams?.t === 'string' ? searchParams.t : undefined;
  const effectiveTemplateId =
    tParam && getTemplateById(tParam) ? tParam : site.template_id;

  const template           = getTemplateSafe(effectiveTemplateId);
  const availableTemplates = getTemplatesForBusinessType(site.business_data);

  return (
    <PreviewClient
      siteId={site.id}
      slug={site.slug}
      status={site.status}
      currentTemplateId={effectiveTemplateId}
      availableTemplates={availableTemplates.map((t) => ({
        id:          t.id,
        name:        t.name,
        description: t.description,
      }))}
      initialTemplateName={template.name}
      initialData={site.business_data}
      initialTemplateComponent={template.component}
    />
  );
}
