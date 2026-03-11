import { redirect }          from 'next/navigation';
import { getServerUser }     from '@/lib/supabase/auth';
import { createServerClient } from '@/lib/supabase/server';
import DashboardClient        from './DashboardClient';

export const metadata = { title: 'My Sites — Localio' };

export default async function DashboardPage() {
  // Verify the user is logged in (reads Supabase session from cookies)
  const user = await getServerUser();
  if (!user) redirect('/login');

  // Fetch all this user's sites (newest first)
  const supabase = createServerClient();
  const { data: sites } = await supabase
    .from('sites')
    .select('id, slug, template_id, business_data, status, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <DashboardClient
      userEmail={user.email ?? ''}
      sites={sites ?? []}
    />
  );
}
