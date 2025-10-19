/**
 * Application Controller
 * Handles HTTP requests for scholarship applications
 */

import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { ApplicationService } from '@/services';
import { CreateApplicationDTO } from '@/dtos';

/**
 * POST /api/apply
 * Apply to a scholarship
 */
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: CreateApplicationDTO = await request.json();

    if (!body.scholarship_id) {
      return NextResponse.json(
        { error: 'Scholarship ID is required' },
        { status: 400 }
      );
    }

    const applicationService = new ApplicationService(supabase);
    const result = await applicationService.applyToScholarship(
      user.id,
      body.scholarship_id
    );

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Error applying to scholarship:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    
    if (message.includes('Already applied')) {
      return NextResponse.json({ error: message }, { status: 400 });
    }
    
    if (message.includes('not found')) {
      return NextResponse.json({ error: message }, { status: 404 });
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/apply
 * Get all applications for the authenticated user
 */
export async function GET() {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const applicationService = new ApplicationService(supabase);
    const result = await applicationService.getUserApplications(user.id);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
