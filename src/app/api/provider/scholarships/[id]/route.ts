import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const supabase = await createClient();

    // Verify user is authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify user is a provider
    const { data: profile, error: profileErr } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileErr || !profile || profile.role !== 'provider') {
      return NextResponse.json(
        { error: 'Only providers can delete scholarships' },
        { status: 403 }
      );
    }

    // Fetch the scholarship to verify ownership and status
    const { data: scholarship, error: fetchErr } = await supabase
      .from('scholarships')
      .select('id, provider_id, status')
      .eq('id', id)
      .single();

    if (fetchErr || !scholarship) {
      return NextResponse.json({ error: 'Scholarship not found' }, { status: 404 });
    }

    if (scholarship.provider_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Prevent deleting approved scholarships
    if (scholarship.status === 'approved') {
      return NextResponse.json(
        { error: 'Cannot delete an approved scholarship' },
        { status: 403 }
      );
    }

    const { error: deleteErr } = await supabase
      .from('scholarships')
      .delete()
      .eq('id', id);

    if (deleteErr) {
      console.error('Error deleting scholarship:', deleteErr);
      return NextResponse.json({ error: 'Failed to delete scholarship' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Scholarship deleted' });
  } catch (error) {
    console.error('Error in DELETE /api/provider/scholarships/[id]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
