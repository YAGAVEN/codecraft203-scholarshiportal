'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Plus,
  Users,
  FileText,
  Clock,
  Edit,
  Eye,
  TrendingUp
} from 'lucide-react';
import { Scholarship, Application } from '@/types/database.types';
import { formatDistanceToNow } from 'date-fns';
import { User } from '@/types/database.types';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface ProviderDashboardProps {
  profile: User;
}

export default function ProviderDashboard({ profile }: ProviderDashboardProps) {
  const router = useRouter();
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalScholarships: 0,
    pendingApproval: 0,
    activeScholarships: 0,
    totalApplications: 0,
    pendingReview: 0,
    selectedApplications: 0,
  });

  const fetchProviderData = useCallback(async () => {
    try {
      // Log provider info for debugging
      console.log('Fetching data for provider:', profile.id, profile.name);
      
      // Fetch scholarships
      const scholarshipsResponse = await fetch('/api/provider/scholarships');
      if (!scholarshipsResponse.ok) throw new Error('Failed to fetch scholarships');
      const scholarshipsData = await scholarshipsResponse.json();
      const fetchedScholarships = scholarshipsData.scholarships || [];
      setScholarships(fetchedScholarships);

      // Fetch applications
      const applicationsResponse = await fetch('/api/provider/applications');
      if (!applicationsResponse.ok) throw new Error('Failed to fetch applications');
      const applicationsData = await applicationsResponse.json();
      const fetchedApplications = applicationsData.applications || [];
      setApplications(fetchedApplications);

      // Calculate stats
      const totalScholarships = fetchedScholarships.length;
      const pendingApproval = fetchedScholarships.filter((s: Scholarship) => s.status === 'pending').length;
      const activeScholarships = fetchedScholarships.filter((s: Scholarship) => s.status === 'approved').length;
      const totalApplications = fetchedApplications.length;
      const pendingReview = fetchedApplications.filter((a: Application) => a.status === 'pending').length;
      const selectedApplications = fetchedApplications.filter((a: Application) => a.status === 'selected').length;

      setStats({
        totalScholarships,
        pendingApproval,
        activeScholarships,
        totalApplications,
        pendingReview,
        selectedApplications,
      });

      setLoading(false);
    } catch (error) {
      console.error('Error fetching provider data:', error);
      setLoading(false);
    }
  }, [profile.id, profile.name]);

  useEffect(() => {
    fetchProviderData();
  }, [fetchProviderData]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
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
          <h1 className="text-3xl font-bold">Provider Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your scholarships and review applications
          </p>
        </div>
        <Button className="gap-2" onClick={() => router.push('/provider/scholarships/create')}>
          <Plus className="h-4 w-4" />
          Create Scholarship
        </Button>
      </div>

      {/* Stats Overview with Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Scholarships Overview - Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Scholarships Overview
            </CardTitle>
            <CardDescription>Distribution of scholarship statuses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Active', value: stats.activeScholarships, color: '#22c55e' },
                      { name: 'Pending', value: stats.pendingApproval, color: '#eab308' },
                      { name: 'Inactive', value: stats.totalScholarships - stats.activeScholarships - stats.pendingApproval, color: '#ef4444' }
                    ].filter(item => item.value > 0)}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                  >
                    {[
                      { name: 'Active', value: stats.activeScholarships, color: '#22c55e' },
                      { name: 'Pending', value: stats.pendingApproval, color: '#eab308' },
                      { name: 'Inactive', value: stats.totalScholarships - stats.activeScholarships - stats.pendingApproval, color: '#ef4444' }
                    ].filter(item => item.value > 0).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">{stats.activeScholarships}</div>
                <p className="text-xs text-muted-foreground">Active</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-600">{stats.pendingApproval}</div>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.totalScholarships}</div>
                <p className="text-xs text-muted-foreground">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Applications Overview - Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Applications Overview
            </CardTitle>
            <CardDescription>Application status breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    {
                      name: 'Status',
                      Pending: stats.pendingReview,
                      Shortlisted: applications.filter(a => a.status === 'shortlisted').length,
                      Selected: stats.selectedApplications,
                      Rejected: applications.filter(a => a.status === 'rejected').length,
                    }
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Pending" fill="#3b82f6" />
                  <Bar dataKey="Shortlisted" fill="#eab308" />
                  <Bar dataKey="Selected" fill="#22c55e" />
                  <Bar dataKey="Rejected" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-4 gap-2 text-center">
              <div>
                <div className="text-xl font-bold text-blue-600">{stats.pendingReview}</div>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
              <div>
                <div className="text-xl font-bold text-yellow-600">
                  {applications.filter(a => a.status === 'shortlisted').length}
                </div>
                <p className="text-xs text-muted-foreground">Shortlisted</p>
              </div>
              <div>
                <div className="text-xl font-bold text-green-600">{stats.selectedApplications}</div>
                <p className="text-xs text-muted-foreground">Selected</p>
              </div>
              <div>
                <div className="text-xl font-bold text-red-600">
                  {applications.filter(a => a.status === 'rejected').length}
                </div>
                <p className="text-xs text-muted-foreground">Rejected</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Scholarships
            </CardTitle>
            <FileText className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalScholarships}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeScholarships} active scholarships
            </p>
            <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 transition-all" 
                style={{ width: `${stats.totalScholarships > 0 ? (stats.activeScholarships / stats.totalScholarships) * 100 : 0}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Approval
            </CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {stats.pendingApproval}
            </div>
            <p className="text-xs text-muted-foreground">
              Awaiting admin review
            </p>
            <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-yellow-500 transition-all" 
                style={{ width: `${stats.totalScholarships > 0 ? (stats.pendingApproval / stats.totalScholarships) * 100 : 0}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Applications
            </CardTitle>
            <Users className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalApplications}</div>
            <p className="text-xs text-muted-foreground">
              {stats.pendingReview} need review
            </p>
            <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-purple-500 transition-all" 
                style={{ width: `${stats.totalApplications > 0 ? (stats.pendingReview / stats.totalApplications) * 100 : 0}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Success Rate
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.totalApplications > 0 
                ? Math.round((stats.selectedApplications / stats.totalApplications) * 100)
                : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.selectedApplications} of {stats.totalApplications} selected
            </p>
            <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-500 transition-all" 
                style={{ width: `${stats.totalApplications > 0 ? (stats.selectedApplications / stats.totalApplications) * 100 : 0}%` }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks for scholarship management</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button 
            variant="outline" 
            className="h-auto flex-col items-start p-4 space-y-2"
            onClick={() => router.push('/provider/scholarships/create')}
          >
            <Plus className="h-5 w-5 text-primary" />
            <div className="text-left">
              <div className="font-semibold">Create New Scholarship</div>
              <div className="text-xs text-muted-foreground">
                Post a new scholarship opportunity
              </div>
            </div>
          </Button>
          <Button 
            variant="outline" 
            className="h-auto flex-col items-start p-4 space-y-2"
            onClick={() => router.push('/provider/applications')}
          >
            <Users className="h-5 w-5 text-primary" />
            <div className="text-left">
              <div className="font-semibold">Review Applications</div>
              <div className="text-xs text-muted-foreground">
                Check pending applications
              </div>
            </div>
          </Button>
          <Button 
            variant="outline" 
            className="h-auto flex-col items-start p-4 space-y-2"
            onClick={() => router.push('/provider/scholarships')}
          >
            <FileText className="h-5 w-5 text-primary" />
            <div className="text-left">
              <div className="font-semibold">Manage Scholarships</div>
              <div className="text-xs text-muted-foreground">
                Edit or withdraw scholarships
              </div>
            </div>
          </Button>
        </CardContent>
      </Card>

      {/* My Scholarships */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">My Scholarships</h2>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => router.push('/provider/scholarships')}
          >
            View All
          </Button>
        </div>

        {scholarships.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No scholarships yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first scholarship to start receiving applications
              </p>
              <Button onClick={() => router.push('/provider/scholarships/create')}>
                <Plus className="h-4 w-4 mr-2" />
                Create Scholarship
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {scholarships.map((scholarship) => (
              <Card key={scholarship.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold">{scholarship.title}</h3>
                        <Badge
                          variant={
                            scholarship.status === 'approved'
                              ? 'default'
                              : scholarship.status === 'pending'
                              ? 'secondary'
                              : 'destructive'
                          }
                        >
                          {scholarship.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {scholarship.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          Deadline: {formatDistanceToNow(new Date(scholarship.deadline), { addSuffix: true })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          0 applications
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Recent Applications */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Applications</CardTitle>
          <CardDescription>Latest applications for your scholarships</CardDescription>
        </CardHeader>
        <CardContent>
          {applications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No applications yet
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map((app) => (
                <div key={app.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-semibold">Student Name</h4>
                    <p className="text-sm text-muted-foreground">
                      Applied {formatDistanceToNow(new Date(app.applied_at), { addSuffix: true })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge>{app.status}</Badge>
                    <Button variant="outline" size="sm">
                      Review
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
