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

export async function PATCH(request: Request) {
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
        { error: 'Only providers can update applications' },
        { status: 403 }
      );
    }

    // Get request body
    const body = await request.json();
    const { application_id, status } = body;

    if (!application_id || !status) {
      return NextResponse.json(
        { error: 'Application ID and status are required' },
        { status: 400 }
      );
    }

    // Validate status
    const validStatuses = ['pending', 'shortlisted', 'selected', 'rejected'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status value' },
        { status: 400 }
      );
    }

    // Verify the application belongs to provider's scholarship
    const { data: application, error: fetchError } = await supabase
      .from('applications')
      .select(`
        *,
        scholarship:scholarships!inner(provider_id)
      `)
      .eq('id', application_id)
      .single();

    if (fetchError || !application) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }

    if (application.scholarship.provider_id !== user.id) {
      return NextResponse.json(
        { error: 'You can only update applications for your own scholarships' },
        { status: 403 }
      );
    }

    // Update application status
    const { data: updatedApplication, error: updateError } = await supabase
      .from('applications')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', application_id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating application:', updateError);
      return NextResponse.json(
        { error: 'Failed to update application' },
        { status: 500 }
      );
    }

    // Create notification for the applicant
    try {
      const statusMessages: Record<string, string> = {
        shortlisted: 'Your application has been shortlisted! 🎉',
        selected: 'Congratulations! You have been selected for the scholarship! 🎓',
        rejected: 'Your application status has been updated.',
      };

      if (status in statusMessages) {
        await supabase.from('notifications').insert({
          user_id: application.user_id,
          title: 'Application Status Update',
          message: statusMessages[status],
          is_read: false,
        });
      }
    } catch (notifError) {
      console.error('Error creating notification:', notifError);
      // Don't fail the request if notification fails
    }

    return NextResponse.json({ 
      success: true, 
      application: updatedApplication 
    });
  } catch (error) {
    console.error('Error in PATCH /api/provider/applications:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
