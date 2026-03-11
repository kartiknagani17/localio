import { createServerClient } from '@/lib/supabase/server';
import { getTemplateSafe } from '@/templates/registry';
import { SiteRow } from '@/templates/types';

// Published public site — localio.live/[slug]
export default async function PublicSitePage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  const supabase = createServerClient();

  const { data: site } = await supabase
    .from('sites')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single<SiteRow>();

  if (!site) {
    return (
      <div style={{ padding: 48, textAlign: 'center' }}>
        <h1>Site not found</h1>
        <p>This website has not been published yet or does not exist.</p>
      </div>
    );
  }

  const template          = getTemplateSafe(site.template_id);
  const TemplateComponent = template.component;

  return (
    <div style={{ width: '100%', containerType: 'inline-size' } as React.CSSProperties}>
      <TemplateComponent businessData={site.business_data} />
    </div>
  );
}
