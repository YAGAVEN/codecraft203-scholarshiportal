import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { id } = await params;
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get scholarship
    const { data: scholarship, error: scholarshipError } = await supabase
      .from('scholarships')
      .select('*')
      .eq('id', id)
      .eq('provider_id', user.id)
      .single();

    if (scholarshipError) {
      console.error('Error fetching scholarship:', scholarshipError);
      return NextResponse.json(
        { error: 'Scholarship not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(scholarship);
  } catch (error) {
    console.error('Error in GET /api/provider/scholarships/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { id } = await params;
    const body = await request.json();
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if scholarship exists and belongs to user
    const { data: existingScholarship, error: fetchError } = await supabase
      .from('scholarships')
      .select('status, provider_id')
      .eq('id', id)
      .single();

    if (fetchError || !existingScholarship) {
      return NextResponse.json(
        { error: 'Scholarship not found' },
        { status: 404 }
      );
    }

    if (existingScholarship.provider_id !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized to edit this scholarship' },
        { status: 403 }
      );
    }

    // Cannot edit approved scholarships
    if (existingScholarship.status === 'approved') {
      return NextResponse.json(
        { error: 'Cannot edit approved scholarships' },
        { status: 400 }
      );
    }

    // Update scholarship
    const { data: updatedScholarship, error: updateError } = await supabase
      .from('scholarships')
      .update({
        ...body,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating scholarship:', updateError);
      return NextResponse.json(
        { error: 'Failed to update scholarship' },
        { status: 500 }
      );
    }

    return NextResponse.json(updatedScholarship);
  } catch (error) {
    console.error('Error in PATCH /api/provider/scholarships/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
