import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Navbar from '@/components/navbar';
import DashboardContent from './dashboard-content';
import ProviderDashboard from '@/components/provider-dashboard';
import AdminDashboard from '@/components/admin-dashboard';

export default async function DashboardPage() {
  const supabase = await createClient();
  
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    redirect('/login');
  }

  // Get user profile with role
  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  // Render appropriate dashboard based on user role
  let DashboardComponent;
  
  if (profile?.role === 'provider') {
    DashboardComponent = <ProviderDashboard profile={profile} />;
  } else if (profile?.role === 'admin') {
    DashboardComponent = <AdminDashboard profile={profile} />;
  } else {
    // Default to student dashboard
    DashboardComponent = <DashboardContent profile={profile} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {DashboardComponent}
    </div>
  );
}
