import { createServerClient } from '@/lib/supabase/server';
import { getTemplatesForBusinessType } from '@/templates/registry';
import { SiteRow } from '@/templates/types';
import ChooseThemeClient from './ChooseThemeClient';

export default async function ChooseThemePage({
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
        <p>This link may be invalid or expired.</p>
      </div>
    );
  }

  const available = getTemplatesForBusinessType(site.business_data);

  return (
    <ChooseThemeClient
      siteId={site.id}
      recommendedId={site.template_id}
      businessData={site.business_data}
      templates={available.map(t => ({
        id:          t.id,
        name:        t.name,
        description: t.description,
        colors:      t.colors,
      }))}
    />
  );
}
