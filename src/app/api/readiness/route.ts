/**
 * Readiness Controller
 * Handles HTTP requests for readiness score calculation
 */

import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { ReadinessService } from '@/services';

/**
 * GET /api/readiness?documentScore=0
 * Calculate and return the readiness score for the authenticated user
 * Query params:
 * - documentScore: Optional document score from client-side localStorage (0-30)
 */
export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get document score from query params
    const { searchParams } = new URL(request.url);
    const documentScore = parseInt(searchParams.get('documentScore') || '0', 10);

    const readinessService = new ReadinessService(supabase);
    const result = await readinessService.calculateReadinessScore(user.id, documentScore);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error calculating readiness score:', error);
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
