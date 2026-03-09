import { createServerClient } from '@/lib/supabase/server';
import { getTemplateSafe, getTemplatesForBusinessType } from '@/templates/registry';
import PreviewClient from './PreviewClient';
import { SiteRow } from '@/templates/types';

export default async function PreviewPage({
  params,
}: {
  params: { id: string };
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

  const template = getTemplateSafe(site.template_id);
  const availableTemplates = getTemplatesForBusinessType(site.business_data);

  return (
    <PreviewClient
      siteId={site.id}
      slug={site.slug}
      status={site.status}
      currentTemplateId={site.template_id}
      availableTemplates={availableTemplates.map((t) => ({
        id: t.id,
        name: t.name,
        description: t.description,
      }))}
      initialTemplateName={template.name}
      initialData={site.business_data}
      initialTemplateComponent={template.component}
    />
  );
}
