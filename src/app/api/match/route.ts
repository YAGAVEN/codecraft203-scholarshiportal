/**
 * Scholarship Match Controller
 * Handles HTTP requests for scholarship matching
 */

import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { ScholarshipService } from '@/services';

/**
 * GET /api/match
 * Get matched scholarships for the authenticated user
 */
export async function GET() {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const scholarshipService = new ScholarshipService(supabase);
    const result = await scholarshipService.getMatchedScholarships(user.id);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error matching scholarships:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    
    if (message.includes('not found')) {
      return NextResponse.json({ error: message }, { status: 404 });
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
