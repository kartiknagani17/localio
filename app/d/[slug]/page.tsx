import { createServerClient } from '@/lib/supabase/server';
import { getTemplateSafe } from '@/templates/registry';
import { SiteRow } from '@/templates/types';

// Draft preview site — localio.live/d/[slug]
// Visible before publishing so the owner can share a live preview with clients.
// Once published the canonical URL becomes localio.live/[slug].
export default async function DraftSitePage({
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
    .eq('status', 'preview')
    .single<SiteRow>();

  if (!site) {
    return (
      <div style={{ padding: 48, textAlign: 'center' }}>
        <h1>Draft not found</h1>
        <p>This draft does not exist or has already been published.</p>
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
