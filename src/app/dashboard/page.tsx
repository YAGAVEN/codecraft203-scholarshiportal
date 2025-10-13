import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Navbar from '@/components/navbar';
import DashboardContent from './dashboard-content';

export default async function DashboardPage() {
  const supabase = await createClient();
  
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    redirect('/login');
  }

  // Get user profile
  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <DashboardContent profile={profile} />
    </div>
  );
}
