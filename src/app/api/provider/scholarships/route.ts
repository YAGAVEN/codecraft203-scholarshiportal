import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
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
        { error: 'Only providers can create scholarships' },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Create scholarship with pending status
    const { data: scholarship, error } = await supabase
      .from('scholarships')
      .insert({
        provider_id: user.id,
        title: body.title,
        description: body.description,
        eligibility_criteria: body.eligibility_criteria,
        benefits: body.benefits || '',
        required_documents: body.required_documents || '',
        deadline: body.deadline,
        country: body.country,
        language: body.language,
        link: body.link,
        status: 'pending', // Requires admin approval
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating scholarship:', error);
      return NextResponse.json(
        { error: 'Failed to create scholarship' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      scholarship,
      message: 'Scholarship created successfully and pending admin approval',
    });
  } catch (error) {
    console.error('Error in POST /api/provider/scholarships:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

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

    // Get provider's scholarships
    const { data: scholarships, error } = await supabase
      .from('scholarships')
      .select('*')
      .eq('provider_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching scholarships:', error);
      return NextResponse.json(
        { error: 'Failed to fetch scholarships' },
        { status: 500 }
      );
    }

    return NextResponse.json({ scholarships });
  } catch (error) {
    console.error('Error in GET /api/provider/scholarships:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
