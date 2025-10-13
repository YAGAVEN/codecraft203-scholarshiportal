'use client';

import { useEffect, useState, useCallback } from 'react';
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

interface ProviderDashboardProps {
  profile: User;
}

export default function ProviderDashboard({ profile }: ProviderDashboardProps) {
  const [scholarships] = useState<Scholarship[]>([]);
  const [applications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats] = useState({
    totalScholarships: 0,
    pendingApproval: 0,
    activeScholarships: 0,
    totalApplications: 0,
    pendingReview: 0,
  });

  const fetchProviderData = useCallback(async () => {
    try {
      // TODO: Implement API endpoints for provider data
      // For now, using mock data
      console.log('Provider profile:', profile);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching provider data:', error);
      setLoading(false);
    }
  }, [profile]);

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
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Create Scholarship
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Scholarships
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalScholarships}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeScholarships} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Approval
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {stats.pendingApproval}
            </div>
            <p className="text-xs text-muted-foreground">
              Awaiting admin review
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Applications
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalApplications}</div>
            <p className="text-xs text-muted-foreground">
              {stats.pendingReview} need review
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Success Rate
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">0%</div>
            <p className="text-xs text-muted-foreground">
              Applications approved
            </p>
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
          <Button variant="outline" className="h-auto flex-col items-start p-4 space-y-2">
            <Plus className="h-5 w-5 text-primary" />
            <div className="text-left">
              <div className="font-semibold">Create New Scholarship</div>
              <div className="text-xs text-muted-foreground">
                Post a new scholarship opportunity
              </div>
            </div>
          </Button>
          <Button variant="outline" className="h-auto flex-col items-start p-4 space-y-2">
            <Users className="h-5 w-5 text-primary" />
            <div className="text-left">
              <div className="font-semibold">Review Applications</div>
              <div className="text-xs text-muted-foreground">
                Check pending applications
              </div>
            </div>
          </Button>
          <Button variant="outline" className="h-auto flex-col items-start p-4 space-y-2">
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
          <Button variant="outline" size="sm">
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
              <Button>
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
