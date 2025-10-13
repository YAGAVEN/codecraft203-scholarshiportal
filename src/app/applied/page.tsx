import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Navbar from '@/components/navbar';
import AppliedContent from './applied-content';

export default async function AppliedPage() {
  const supabase = await createClient();
  
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <AppliedContent />
    </div>
  );
}
