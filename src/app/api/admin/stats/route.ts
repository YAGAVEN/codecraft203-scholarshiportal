import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createClient();

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify admin role
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Fetch all stats in parallel
    const [usersResult, scholarshipsResult, applicationsResult] = await Promise.all([
      supabase.from('users').select('role', { count: 'exact' }),
      supabase.from('scholarships').select('status', { count: 'exact' }),
      supabase.from('applications').select('id', { count: 'exact' }),
    ]);

    // Count users by role
    const users = usersResult.data || [];
    const totalStudents = users.filter((u) => u.role === 'student').length;
    const totalProviders = users.filter((u) => u.role === 'provider').length;
    const totalUsers = usersResult.count || 0;

    // Count scholarships by status
    const scholarships = scholarshipsResult.data || [];
    const pendingApproval = scholarships.filter((s) => s.status === 'pending').length;
    const activeScholarships = scholarships.filter((s) => s.status === 'approved').length;
    const totalScholarships = scholarshipsResult.count || 0;

    // Total applications
    const totalApplications = applicationsResult.count || 0;

    return NextResponse.json({
      totalUsers,
      totalStudents,
      totalProviders,
      totalScholarships,
      pendingApproval,
      activeScholarships,
      totalApplications,
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
