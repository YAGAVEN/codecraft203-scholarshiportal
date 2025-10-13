import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { scholarship_id } = await request.json();

    if (!scholarship_id) {
      return NextResponse.json(
        { error: 'Scholarship ID is required' },
        { status: 400 }
      );
    }

    // Check if already applied
    const { data: existing } = await supabase
      .from('applications')
      .select('id')
      .eq('user_id', user.id)
      .eq('scholarship_id', scholarship_id)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'Already applied to this scholarship' },
        { status: 400 }
      );
    }

    // Create application
    const { data: application, error: applicationError } = await supabase
      .from('applications')
      .insert({
        user_id: user.id,
        scholarship_id,
        status: 'applied',
        applied_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (applicationError) {
      throw applicationError;
    }

    // Create notification
    await supabase.from('notifications').insert({
      user_id: user.id,
      message: `You have successfully applied to a scholarship`,
      is_read: false,
      created_at: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      application,
      message: 'Application submitted successfully',
    });
  } catch (error) {
    console.error('Error applying to scholarship:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: applications, error } = await supabase
      .from('applications')
      .select('*')
      .eq('user_id', user.id)
      .order('applied_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ applications });
  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
