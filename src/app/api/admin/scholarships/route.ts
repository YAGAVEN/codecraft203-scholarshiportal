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

// GET - Fetch scholarships with filters
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const auth = await verifyAdmin(supabase);
    
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const providerId = searchParams.get('providerId');
    const search = searchParams.get('search');

    let query = supabase
      .from('scholarships')
      .select(`
        *,
        provider:users!scholarships_provider_id_fkey(
          id,
          name,
          email
        )
      `)
      .order('created_at', { ascending: false });

    // Default to pending if no status specified
    if (status) {
      if (['pending', 'approved', 'rejected', 'withdrawn'].includes(status)) {
        query = query.eq('status', status);
      }
    } else {
      query = query.eq('status', 'pending');
    }

    if (providerId) {
      query = query.eq('provider_id', providerId);
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    const { data: scholarships, error } = await query;

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

// POST - Create a new scholarship (admin can create on behalf of provider)
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const auth = await verifyAdmin(supabase);
    
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const body = await request.json();
    const {
      provider_id,
      title,
      description,
      eligibility_criteria,
      benefits,
      required_documents,
      deadline,
      country,
      language,
      link,
      status = 'approved', // Admin-created scholarships are auto-approved
    } = body;

    // Validate required fields
    if (!title || !description || !eligibility_criteria || !deadline || !country || !language || !link) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { data: scholarship, error } = await supabase
      .from('scholarships')
      .insert({
        provider_id,
        title,
        description,
        eligibility_criteria,
        benefits,
        required_documents,
        deadline,
        country,
        language,
        link,
        status,
      })
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
      console.error('Error creating scholarship:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(scholarship, { status: 201 });
  } catch (error) {
    console.error('Error creating scholarship:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Delete scholarship
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
      return NextResponse.json({ error: 'Scholarship ID is required' }, { status: 400 });
    }

    // Delete scholarship (will cascade delete applications)
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
