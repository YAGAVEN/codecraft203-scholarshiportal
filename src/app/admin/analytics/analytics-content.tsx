'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users,
  FileText,
  TrendingUp,
  Award,
  CheckCircle,
  XCircle,
  Clock,
  BarChart3
} from 'lucide-react';

interface AnalyticsData {
  totalUsers: number;
  totalStudents: number;
  totalProviders: number;
  totalScholarships: number;
  pendingApproval: number;
  activeScholarships: number;
  rejectedScholarships: number;
  totalApplications: number;
  pendingApplications: number;
  shortlistedApplications: number;
  selectedApplications: number;
  rejectedApplications: number;
}

export default function AnalyticsContent() {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalUsers: 0,
    totalStudents: 0,
    totalProviders: 0,
    totalScholarships: 0,
    pendingApproval: 0,
    activeScholarships: 0,
    rejectedScholarships: 0,
    totalApplications: 0,
    pendingApplications: 0,
    shortlistedApplications: 0,
    selectedApplications: 0,
    rejectedApplications: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/admin/analytics');
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setLoading(false);
    }
  };

  const applicationSuccessRate = analytics.totalApplications > 0
    ? ((analytics.selectedApplications / analytics.totalApplications) * 100).toFixed(1)
    : '0';

  const scholarshipApprovalRate = analytics.totalScholarships > 0
    ? ((analytics.activeScholarships / analytics.totalScholarships) * 100).toFixed(1)
    : '0';

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-muted rounded w-1/4"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-32 bg-muted rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Platform Analytics</h1>
        <p className="text-muted-foreground">
          Detailed statistics and insights across the scholarship portal
        </p>
      </div>

      {/* User Analytics */}
      <div>
        <h2 className="text-xl font-semibold mb-4">User Statistics</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:col-span-1">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.totalUsers}</div>
                <p className="text-xs text-muted-foreground">
                  All registered accounts
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Students</CardTitle>
                <Users className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{analytics.totalStudents}</div>
                <p className="text-xs text-muted-foreground">
                  {analytics.totalUsers > 0 
                    ? `${((analytics.totalStudents / analytics.totalUsers) * 100).toFixed(1)}% of total`
                    : '0% of total'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Providers</CardTitle>
                <Users className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">{analytics.totalProviders}</div>
                <p className="text-xs text-muted-foreground">
                  {analytics.totalUsers > 0 
                    ? `${((analytics.totalProviders / analytics.totalUsers) * 100).toFixed(1)}% of total`
                    : '0% of total'}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Donut Chart for User Distribution */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>User Distribution</CardTitle>
              <CardDescription>Breakdown by role</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center gap-8">
                <div className="relative w-40 h-40">
                  <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 120 120">
                    {analytics.totalUsers > 0 ? (
                      <>
                        {/* Students segment */}
                        <circle
                          cx="60"
                          cy="60"
                          r="50"
                          fill="none"
                          stroke="rgb(37, 99, 235)"
                          strokeWidth="20"
                          strokeDasharray={`${(analytics.totalStudents / analytics.totalUsers) * 314} 314`}
                          strokeDashoffset="0"
                        />
                        {/* Providers segment */}
                        <circle
                          cx="60"
                          cy="60"
                          r="50"
                          fill="none"
                          stroke="rgb(147, 51, 234)"
                          strokeWidth="20"
                          strokeDasharray={`${(analytics.totalProviders / analytics.totalUsers) * 314} 314`}
                          strokeDashoffset={`-${(analytics.totalStudents / analytics.totalUsers) * 314}`}
                        />
                        {/* Admins segment */}
                        <circle
                          cx="60"
                          cy="60"
                          r="50"
                          fill="none"
                          stroke="rgb(239, 68, 68)"
                          strokeWidth="20"
                          strokeDasharray={`${((analytics.totalUsers - analytics.totalStudents - analytics.totalProviders) / analytics.totalUsers) * 314} 314`}
                          strokeDashoffset={`-${((analytics.totalStudents + analytics.totalProviders) / analytics.totalUsers) * 314}`}
                        />
                      </>
                    ) : (
                      <circle
                        cx="60"
                        cy="60"
                        r="50"
                        fill="none"
                        stroke="rgb(229, 231, 235)"
                        strokeWidth="20"
                      />
                    )}
                    {/* Center circle */}
                    <circle cx="60" cy="60" r="35" fill="currentColor" className="text-background" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{analytics.totalUsers}</div>
                      <div className="text-xs text-muted-foreground">Total</div>
                    </div>
                  </div>
                </div>
                
                {/* Legend */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                    <span className="text-sm">Students ({analytics.totalStudents})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-purple-600"></div>
                    <span className="text-sm">Providers ({analytics.totalProviders})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-600"></div>
                    <span className="text-sm">Admins ({analytics.totalUsers - analytics.totalStudents - analytics.totalProviders})</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Scholarship Analytics */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Scholarship Statistics</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Scholarship Stats Cards */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.totalScholarships}</div>
                <p className="text-xs text-muted-foreground">All scholarships</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{analytics.activeScholarships}</div>
                <p className="text-xs text-muted-foreground">Approved</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                <Clock className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{analytics.pendingApproval}</div>
                <p className="text-xs text-muted-foreground">Awaiting</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Rejected</CardTitle>
                <XCircle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{analytics.rejectedScholarships}</div>
                <p className="text-xs text-muted-foreground">Not approved</p>
              </CardContent>
            </Card>
          </div>

          {/* Bar Chart for Scholarship Status */}
          <Card>
            <CardHeader>
              <CardTitle>Scholarship Status Overview</CardTitle>
              <CardDescription>Distribution by status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Active */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium">Active</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {analytics.activeScholarships} ({analytics.totalScholarships > 0 
                        ? ((analytics.activeScholarships / analytics.totalScholarships) * 100).toFixed(0)
                        : 0}%)
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3">
                    <div 
                      className="bg-green-600 h-3 rounded-full transition-all"
                      style={{ 
                        width: `${analytics.totalScholarships > 0 
                          ? (analytics.activeScholarships / analytics.totalScholarships) * 100 
                          : 0}%` 
                      }}
                    ></div>
                  </div>
                </div>

                {/* Pending */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm font-medium">Pending</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {analytics.pendingApproval} ({analytics.totalScholarships > 0 
                        ? ((analytics.pendingApproval / analytics.totalScholarships) * 100).toFixed(0)
                        : 0}%)
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3">
                    <div 
                      className="bg-yellow-600 h-3 rounded-full transition-all"
                      style={{ 
                        width: `${analytics.totalScholarships > 0 
                          ? (analytics.pendingApproval / analytics.totalScholarships) * 100 
                          : 0}%` 
                      }}
                    ></div>
                  </div>
                </div>

                {/* Rejected */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-red-600" />
                      <span className="text-sm font-medium">Rejected</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {analytics.rejectedScholarships} ({analytics.totalScholarships > 0 
                        ? ((analytics.rejectedScholarships / analytics.totalScholarships) * 100).toFixed(0)
                        : 0}%)
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3">
                    <div 
                      className="bg-red-600 h-3 rounded-full transition-all"
                      style={{ 
                        width: `${analytics.totalScholarships > 0 
                          ? (analytics.rejectedScholarships / analytics.totalScholarships) * 100 
                          : 0}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Application Analytics */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Application Statistics</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Application Stats Cards */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.totalApplications}</div>
                <p className="text-xs text-muted-foreground">All applications</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                <Clock className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{analytics.pendingApplications}</div>
                <p className="text-xs text-muted-foreground">Under review</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Shortlisted</CardTitle>
                <FileText className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{analytics.shortlistedApplications}</div>
                <p className="text-xs text-muted-foreground">Considered</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Selected</CardTitle>
                <Award className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{analytics.selectedApplications}</div>
                <p className="text-xs text-muted-foreground">Successful</p>
              </CardContent>
            </Card>
          </div>

          {/* Bar Chart for Application Status */}
          <Card>
            <CardHeader>
              <CardTitle>Application Workflow</CardTitle>
              <CardDescription>Pipeline by status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Pending */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm font-medium">Pending</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {analytics.pendingApplications} ({analytics.totalApplications > 0 
                        ? ((analytics.pendingApplications / analytics.totalApplications) * 100).toFixed(0)
                        : 0}%)
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3">
                    <div 
                      className="bg-yellow-600 h-3 rounded-full transition-all"
                      style={{ 
                        width: `${analytics.totalApplications > 0 
                          ? (analytics.pendingApplications / analytics.totalApplications) * 100 
                          : 0}%` 
                      }}
                    ></div>
                  </div>
                </div>

                {/* Shortlisted */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium">Shortlisted</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {analytics.shortlistedApplications} ({analytics.totalApplications > 0 
                        ? ((analytics.shortlistedApplications / analytics.totalApplications) * 100).toFixed(0)
                        : 0}%)
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3">
                    <div 
                      className="bg-blue-600 h-3 rounded-full transition-all"
                      style={{ 
                        width: `${analytics.totalApplications > 0 
                          ? (analytics.shortlistedApplications / analytics.totalApplications) * 100 
                          : 0}%` 
                      }}
                    ></div>
                  </div>
                </div>

                {/* Selected */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium">Selected</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {analytics.selectedApplications} ({analytics.totalApplications > 0 
                        ? ((analytics.selectedApplications / analytics.totalApplications) * 100).toFixed(0)
                        : 0}%)
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3">
                    <div 
                      className="bg-green-600 h-3 rounded-full transition-all"
                      style={{ 
                        width: `${analytics.totalApplications > 0 
                          ? (analytics.selectedApplications / analytics.totalApplications) * 100 
                          : 0}%` 
                      }}
                    ></div>
                  </div>
                </div>

                {/* Rejected */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-red-600" />
                      <span className="text-sm font-medium">Rejected</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {analytics.rejectedApplications} ({analytics.totalApplications > 0 
                        ? ((analytics.rejectedApplications / analytics.totalApplications) * 100).toFixed(0)
                        : 0}%)
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3">
                    <div 
                      className="bg-red-600 h-3 rounded-full transition-all"
                      style={{ 
                        width: `${analytics.totalApplications > 0 
                          ? (analytics.rejectedApplications / analytics.totalApplications) * 100 
                          : 0}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Performance Metrics */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Performance Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Application Success Rate</CardTitle>
                  <CardDescription>Selected / Total Applications</CardDescription>
                </div>
                <BarChart3 className="h-5 w-5 text-green-600" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-center">
                <div className="relative w-32 h-32">
                  <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                    {/* Background circle */}
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="12"
                      className="text-muted"
                      opacity="0.2"
                    />
                    {/* Progress circle */}
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      fill="none"
                      stroke="rgb(34, 197, 94)"
                      strokeWidth="12"
                      strokeDasharray={`${(parseFloat(applicationSuccessRate) / 100) * 314} 314`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{applicationSuccessRate}%</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Selected:</span>
                  <span className="font-medium text-green-600">{analytics.selectedApplications}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Applications:</span>
                  <span className="font-medium">{analytics.totalApplications}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Scholarship Approval Rate</CardTitle>
                  <CardDescription>Approved / Total Scholarships</CardDescription>
                </div>
                <BarChart3 className="h-5 w-5 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-center">
                <div className="relative w-32 h-32">
                  <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                    {/* Background circle */}
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="12"
                      className="text-muted"
                      opacity="0.2"
                    />
                    {/* Progress circle */}
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      fill="none"
                      stroke="rgb(59, 130, 246)"
                      strokeWidth="12"
                      strokeDasharray={`${(parseFloat(scholarshipApprovalRate) / 100) * 314} 314`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{scholarshipApprovalRate}%</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Approved:</span>
                  <span className="font-medium text-blue-600">{analytics.activeScholarships}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Scholarships:</span>
                  <span className="font-medium">{analytics.totalScholarships}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Additional Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Platform Insights</CardTitle>
          <CardDescription>Key observations and trends</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="h-2 w-2 rounded-full bg-green-600 mt-2"></div>
            <div>
              <p className="font-medium">Active Scholarships</p>
              <p className="text-sm text-muted-foreground">
                {analytics.activeScholarships} scholarships are currently accepting applications
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="h-2 w-2 rounded-full bg-yellow-600 mt-2"></div>
            <div>
              <p className="font-medium">Pending Reviews</p>
              <p className="text-sm text-muted-foreground">
                {analytics.pendingApproval} scholarships awaiting admin approval and {analytics.pendingApplications} applications under review
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="h-2 w-2 rounded-full bg-blue-600 mt-2"></div>
            <div>
              <p className="font-medium">User Engagement</p>
              <p className="text-sm text-muted-foreground">
                Average of {analytics.totalStudents > 0 
                  ? (analytics.totalApplications / analytics.totalStudents).toFixed(1) 
                  : '0'} applications per student
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
