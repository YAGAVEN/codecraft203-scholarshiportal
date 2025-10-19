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

    // Fetch comprehensive analytics
    const [usersResult, scholarshipsResult, applicationsResult] = await Promise.all([
      supabase.from('users').select('role', { count: 'exact' }),
      supabase.from('scholarships').select('status', { count: 'exact' }),
      supabase.from('applications').select('status', { count: 'exact' }),
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
    const rejectedScholarships = scholarships.filter((s) => s.status === 'rejected').length;
    const totalScholarships = scholarshipsResult.count || 0;

    // Count applications by status
    const applications = applicationsResult.data || [];
    const pendingApplications = applications.filter((a) => a.status === 'pending').length;
    const shortlistedApplications = applications.filter((a) => a.status === 'shortlisted').length;
    const selectedApplications = applications.filter((a) => a.status === 'selected').length;
    const rejectedApplications = applications.filter((a) => a.status === 'rejected').length;
    const totalApplications = applicationsResult.count || 0;

    return NextResponse.json({
      totalUsers,
      totalStudents,
      totalProviders,
      totalScholarships,
      pendingApproval,
      activeScholarships,
      rejectedScholarships,
      totalApplications,
      pendingApplications,
      shortlistedApplications,
      selectedApplications,
      rejectedApplications,
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
