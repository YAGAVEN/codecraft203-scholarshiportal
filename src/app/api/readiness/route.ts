import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Calculate readiness score (0-100)
    let score = 0;
    const factors: { name: string; score: number; maxScore: number }[] = [];

    // Profile completeness (40 points)
    let profileScore = 0;
    if (profile.name) profileScore += 8;
    if (profile.email) profileScore += 8;
    if (profile.course) profileScore += 8;
    if (profile.category) profileScore += 8;
    if (profile.economic_background) profileScore += 8;
    
    factors.push({
      name: 'Profile Completeness',
      score: profileScore,
      maxScore: 40,
    });
    score += profileScore;

    // Applications submitted (30 points)
    const { data: applications } = await supabase
      .from('applications')
      .select('id')
      .eq('user_id', user.id);

    const applicationCount = applications?.length || 0;
    const applicationScore = Math.min(30, applicationCount * 10);
    
    factors.push({
      name: 'Applications Submitted',
      score: applicationScore,
      maxScore: 30,
    });
    score += applicationScore;

    // Mock documents uploaded (30 points)
    // In a real app, you would check actual document uploads
    const documentsScore = 0; // Placeholder
    factors.push({
      name: 'Documents Uploaded',
      score: documentsScore,
      maxScore: 30,
    });
    score += documentsScore;

    // Calculate percentage
    const readinessPercentage = Math.round((score / 100) * 100);

    // Determine status
    let status: 'Not Ready' | 'Getting Started' | 'In Progress' | 'Almost Ready' | 'Ready';
    if (readinessPercentage < 20) status = 'Not Ready';
    else if (readinessPercentage < 40) status = 'Getting Started';
    else if (readinessPercentage < 60) status = 'In Progress';
    else if (readinessPercentage < 80) status = 'Almost Ready';
    else status = 'Ready';

    // Recommendations
    const recommendations: string[] = [];
    if (profileScore < 40) {
      recommendations.push('Complete your profile information');
    }
    if (applicationCount === 0) {
      recommendations.push('Apply to your first scholarship');
    }
    if (documentsScore < 30) {
      recommendations.push('Upload required documents (transcripts, CV, letters)');
    }

    return NextResponse.json({
      score: readinessPercentage,
      status,
      factors,
      recommendations,
      applicationCount,
    });
  } catch (error) {
    console.error('Error calculating readiness score:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
