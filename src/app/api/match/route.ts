import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { mockScholarships } from '@/data/scholarships';

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

    // Simple matching logic based on profile
    // In a real app, this would be more sophisticated
    const matchedScholarships = mockScholarships.filter(() => {
      // Match based on economic background
      const economicMatch = 
        profile.economic_background === 'Below Poverty Line' ||
        profile.economic_background === 'Low Income';
      
      // You can add more sophisticated matching logic here
      return economicMatch || Math.random() > 0.3; // For demo, show most scholarships
    });

    return NextResponse.json({
      scholarships: matchedScholarships,
      count: matchedScholarships.length,
    });
  } catch (error) {
    console.error('Error matching scholarships:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
