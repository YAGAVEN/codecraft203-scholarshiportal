import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { id } = await params;

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

    // Get action from request body
    const body = await request.json();
    const { action } = body; // 'approve' or 'reject'

    if (!action || !['approve', 'reject'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    // Update scholarship status
    const newStatus = action === 'approve' ? 'approved' : 'rejected';
    const { data: scholarship, error } = await supabase
      .from('scholarships')
      .update({ 
        status: newStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating scholarship:', error);
      return NextResponse.json({ error: 'Failed to update scholarship' }, { status: 500 });
    }

    return NextResponse.json(scholarship);
  } catch (error) {
    console.error('Error in scholarship approval:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
