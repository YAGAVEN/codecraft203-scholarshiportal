import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

// Helper function to verify admin
async function verifyAdmin(supabase: Awaited<ReturnType<typeof createClient>>) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Unauthorized', status: 401 };
  }

  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!profile || profile.role !== 'admin') {
    return { error: 'Forbidden', status: 403 };
  }

  return { user, profile };
}

// GET - Fetch all applications with filters
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const auth = await verifyAdmin(supabase);
    
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const userId = searchParams.get('userId');
    const scholarshipId = searchParams.get('scholarshipId');

    let query = supabase
      .from('applications')
      .select(`
        *,
        user:users!applications_user_id_fkey(
          id,
          name,
          email,
          course
        ),
        scholarship:scholarships!applications_scholarship_id_fkey(
          id,
          title,
          provider_id,
          provider:users!scholarships_provider_id_fkey(
            id,
            name,
            email
          )
        )
      `)
      .order('applied_at', { ascending: false });

    if (status && ['pending', 'shortlisted', 'selected', 'rejected'].includes(status)) {
      query = query.eq('status', status);
    }

    if (userId) {
      query = query.eq('user_id', userId);
    }

    if (scholarshipId) {
      query = query.eq('scholarship_id', scholarshipId);
    }

    const { data: applications, error } = await query;

    if (error) {
      console.error('Error fetching applications:', error);
      return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 });
    }

    return NextResponse.json(applications || []);
  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Create application (admin can create on behalf of user)
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const auth = await verifyAdmin(supabase);
    
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const body = await request.json();
    const { user_id, scholarship_id, documents_submitted, notes, status = 'pending' } = body;

    if (!user_id || !scholarship_id) {
      return NextResponse.json(
        { error: 'Missing required fields: user_id, scholarship_id' },
        { status: 400 }
      );
    }

    const { data: application, error } = await supabase
      .from('applications')
      .insert({
        user_id,
        scholarship_id,
        documents_submitted,
        notes,
        status,
      })
      .select(`
        *,
        user:users!applications_user_id_fkey(
          id,
          name,
          email,
          course
        ),
        scholarship:scholarships!applications_scholarship_id_fkey(
          id,
          title
        )
      `)
      .single();

    if (error) {
      console.error('Error creating application:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(application, { status: 201 });
  } catch (error) {
    console.error('Error creating application:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Delete application
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    const auth = await verifyAdmin(supabase);
    
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Application ID is required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('applications')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting application:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Application deleted successfully' });
  } catch (error) {
    console.error('Error deleting application:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
