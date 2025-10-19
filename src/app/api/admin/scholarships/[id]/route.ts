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

// GET - Get scholarship by ID
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

    const { data: scholarship, error } = await supabase
      .from('scholarships')
      .select(`
        *,
        provider:users!scholarships_provider_id_fkey(
          id,
          name,
          email
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching scholarship:', error);
      return NextResponse.json({ error: 'Scholarship not found' }, { status: 404 });
    }

    return NextResponse.json(scholarship);
  } catch (error) {
    console.error('Error fetching scholarship:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH - Update scholarship (full update or status change)
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
    const { action, ...updates } = body;

    let updateData: Record<string, unknown> = { updated_at: new Date().toISOString() };

    // Handle quick actions (approve/reject)
    if (action) {
      if (!['approve', 'reject'].includes(action)) {
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
      }
      updateData.status = action === 'approve' ? 'approved' : 'rejected';
    } else {
      // Full update - allow admin to update any field
      updateData = { ...updates, updated_at: new Date().toISOString() };
    }

    const { data: scholarship, error } = await supabase
      .from('scholarships')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        provider:users!scholarships_provider_id_fkey(
          id,
          name,
          email
        )
      `)
      .single();

    if (error) {
      console.error('Error updating scholarship:', error);
      return NextResponse.json({ error: 'Failed to update scholarship' }, { status: 500 });
    }

    return NextResponse.json(scholarship);
  } catch (error) {
    console.error('Error in scholarship update:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Delete scholarship
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
      .from('scholarships')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting scholarship:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Scholarship deleted successfully' });
  } catch (error) {
    console.error('Error deleting scholarship:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
