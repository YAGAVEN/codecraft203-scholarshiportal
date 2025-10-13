import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createClient();

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify admin role
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Fetch pending scholarships with provider information
    const { data: scholarships, error } = await supabase
      .from('scholarships')
      .select(`
        *,
        provider:users!scholarships_provider_id_fkey(
          id,
          name,
          email
        )
      `)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching scholarships:', error);
      return NextResponse.json({ error: 'Failed to fetch scholarships' }, { status: 500 });
    }

    return NextResponse.json(scholarships || []);
  } catch (error) {
    console.error('Error fetching admin scholarships:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
