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

// GET - Get application by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const auth = await verifyAdmin(supabase);
    
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { id } = await params;

    const { data: application, error } = await supabase
      .from('applications')
      .select(`
        *,
        user:users!applications_user_id_fkey(
          id,
          name,
          email,
          course,
          category,
          economic_background
        ),
        scholarship:scholarships!applications_scholarship_id_fkey(
          id,
          title,
          description,
          provider:users!scholarships_provider_id_fkey(
            id,
            name,
            email
          )
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching application:', error);
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    return NextResponse.json(application);
  } catch (error) {
    console.error('Error fetching application:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH - Update application
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const auth = await verifyAdmin(supabase);
    
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { id } = await params;
    const body = await request.json();
    const updates: Record<string, unknown> = { 
      ...body, 
      updated_at: new Date().toISOString() 
    };

    const { data: application, error } = await supabase
      .from('applications')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        user:users!applications_user_id_fkey(
          id,
          name,
          email
        ),
        scholarship:scholarships!applications_scholarship_id_fkey(
          id,
          title
        )
      `)
      .single();

    if (error) {
      console.error('Error updating application:', error);
      return NextResponse.json({ error: 'Failed to update application' }, { status: 500 });
    }

    return NextResponse.json(application);
  } catch (error) {
    console.error('Error updating application:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Delete application
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const auth = await verifyAdmin(supabase);
    
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { id } = await params;

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
