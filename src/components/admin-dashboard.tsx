'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  BarChart3,
  Bell
} from 'lucide-react';
import { User, Scholarship } from '@/types/database.types';
import { formatDistanceToNow } from 'date-fns';

interface AdminDashboardProps {
  profile: User;
}

interface ScholarshipWithProvider extends Scholarship {
  provider: {
    id: string;
    name: string;
    email: string;
  };
}

export default function AdminDashboard({ profile }: AdminDashboardProps) {
  const [pendingScholarships, setPendingScholarships] = useState<ScholarshipWithProvider[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStudents: 0,
    totalProviders: 0,
    totalScholarships: 0,
    pendingApproval: 0,
    activeScholarships: 0,
    totalApplications: 0,
  });

  const fetchAdminData = useCallback(async () => {
    try {
      console.log('Fetching admin data for profile:', profile.id);
      
      // Fetch stats, scholarships, and users in parallel
      const [statsRes, scholarshipsRes, usersRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/scholarships'),
        fetch('/api/admin/users'),
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      if (scholarshipsRes.ok) {
        const scholarshipsData = await scholarshipsRes.json();
        setPendingScholarships(scholarshipsData);
      }

      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      setLoading(false);
    }
  }, [profile.id]);

  useEffect(() => {
    fetchAdminData();
  }, [fetchAdminData]);

  const handleApproveScholarship = async (scholarshipId: string) => {
    try {
      const response = await fetch(`/api/admin/scholarships/${scholarshipId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'approve' }),
      });

      if (response.ok) {
        // Refresh data
        await fetchAdminData();
      } else {
        console.error('Failed to approve scholarship');
      }
    } catch (error) {
      console.error('Error approving scholarship:', error);
    }
  };

  const handleRejectScholarship = async (scholarshipId: string) => {
    try {
      const response = await fetch(`/api/admin/scholarships/${scholarshipId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'reject' }),
      });

      if (response.ok) {
        // Refresh data
        await fetchAdminData();
      } else {
        console.error('Failed to reject scholarship');
      }
    } catch (error) {
      console.error('Error rejecting scholarship:', error);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            System overview and moderation tools
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <Bell className="h-4 w-4" />
          Send Broadcast
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalStudents} students, {stats.totalProviders} providers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Scholarships</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalScholarships}</div>
            <p className="text-xs text-muted-foreground">
              Across all providers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {stats.pendingApproval}
            </div>
            <p className="text-xs text-muted-foreground">
              Requires your review
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalApplications}</div>
            <p className="text-xs text-muted-foreground">
              Submitted by students
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Scholarships</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.activeScholarships}
            </div>
            <p className="text-xs text-muted-foreground">
              Approved and live
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Platform Health</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Healthy</div>
            <p className="text-xs text-muted-foreground">
              All systems operational
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Scholarships for Approval */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Scholarship Approvals</CardTitle>
          <CardDescription>
            Review and approve/reject scholarships submitted by providers
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pendingScholarships.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 mx-auto text-green-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">All caught up!</h3>
              <p className="text-muted-foreground">
                No scholarships pending approval at this time
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingScholarships.map((scholarship) => (
                <div
                  key={scholarship.id}
                  className="border rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold">{scholarship.title}</h3>
                        <Badge variant="secondary">Pending Review</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Provider: {scholarship.provider?.name || 'Unknown'} ({scholarship.provider?.email || ''})
                      </p>
                      <p className="text-sm mb-3">{scholarship.description}</p>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="font-medium">Country:</span> {scholarship.country}
                        </div>
                        <div>
                          <span className="font-medium">Deadline:</span>{' '}
                          {formatDistanceToNow(new Date(scholarship.deadline), { addSuffix: true })}
                        </div>
                        <div>
                          <span className="font-medium">Language:</span> {scholarship.language}
                        </div>
                        <div>
                          <span className="font-medium">Benefits:</span> {scholarship.benefits || 'Not specified'}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      className="gap-2"
                      onClick={() => handleApproveScholarship(scholarship.id)}
                    >
                      <CheckCircle className="h-4 w-4" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="gap-2"
                      onClick={() => handleRejectScholarship(scholarship.id)}
                    >
                      <XCircle className="h-4 w-4" />
                      Reject
                    </Button>
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Users */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Users</CardTitle>
              <CardDescription>Latest registrations on the platform</CardDescription>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.location.href = '/admin/users'}
            >
              Manage Users
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No users registered yet
            </div>
          ) : (
            <div className="space-y-3">
              {users.slice(0, 5).map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={user.role === 'student' ? 'default' : user.role === 'provider' ? 'secondary' : 'outline'}>
                      {user.role}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => window.location.href = '/admin/analytics'}
        >
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold">View Analytics</h3>
              <p className="text-sm text-muted-foreground">
                Detailed platform statistics and insights
              </p>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => window.location.href = '/admin/users'}
        >
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-semibold">User Management</h3>
              <p className="text-sm text-muted-foreground">
                Manage student and provider accounts
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                <Bell className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-semibold">Send Notification</h3>
              <p className="text-sm text-muted-foreground">
                Broadcast message to all users (Coming Soon)
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
