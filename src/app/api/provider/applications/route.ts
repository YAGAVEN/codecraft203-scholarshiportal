import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();

    // Verify user is authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify user is a provider
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || profile.role !== 'provider') {
      return NextResponse.json(
        { error: 'Only providers can view applications' },
        { status: 403 }
      );
    }

    // Get applications for provider's scholarships
    const { data: applications, error } = await supabase
      .from('applications')
      .select(`
        *,
        scholarship:scholarships (
          id,
          title,
          provider_id
        ),
        user:users (
          id,
          name,
          email
        )
      `)
      .eq('scholarship.provider_id', user.id)
      .order('applied_at', { ascending: false });

    if (error) {
      console.error('Error fetching applications:', error);
      return NextResponse.json(
        { error: 'Failed to fetch applications' },
        { status: 500 }
      );
    }

    return NextResponse.json({ applications: applications || [] });
  } catch (error) {
    console.error('Error in GET /api/provider/applications:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
