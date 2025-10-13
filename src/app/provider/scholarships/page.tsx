import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import ManageScholarshipsContent from './manage-scholarships-content';

export default async function ManageScholarshipsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Get user profile to verify they're a provider
  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!profile || profile.role !== 'provider') {
    redirect('/dashboard');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ManageScholarshipsContent />
    </div>
  );
}
