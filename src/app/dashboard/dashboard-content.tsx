'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Bell, 
  Award, 
  Calendar,
  ExternalLink,
  AlertCircle
} from 'lucide-react';
import { Scholarship } from '@/types/database.types';
import { formatDistanceToNow } from 'date-fns';
import { User, Notification } from '@/types/database.types';

interface ReadinessScore {
  score: number;
  status: string;
  factors: Array<{ name: string; score: number; maxScore: number }>;
  recommendations: string[];
  applicationCount: number;
}

interface DashboardContentProps {
  profile: User | null;
}

export default function DashboardContent({ profile }: DashboardContentProps) {
  const [matchedScholarships, setMatchedScholarships] = useState<Scholarship[]>([]);
  const [readinessScore, setReadinessScore] = useState<ReadinessScore | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [applyingId, setApplyingId] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [matchRes, readinessRes, notifRes] = await Promise.all([
        fetch('/api/match'),
        fetch('/api/readiness'),
        fetch('/api/notifications'),
      ]);

      const matchData = await matchRes.json();
      const readinessData = await readinessRes.json();
      const notifData = await notifRes.json();

      setMatchedScholarships(matchData.scholarships || []);
      setReadinessScore(readinessData);
      setNotifications(notifData.notifications || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (scholarshipId: string) => {
    setApplyingId(scholarshipId);
    try {
      const res = await fetch('/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scholarship_id: scholarshipId }),
      });

      const data = await res.json();

      if (res.ok) {
        alert('Application submitted successfully!');
        fetchDashboardData(); // Refresh data
      } else {
        alert(data.error || 'Failed to apply');
      }
    } catch (error) {
      console.error('Error applying:', error);
      alert('An error occurred while applying');
    } finally {
      setApplyingId(null);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {profile?.name || 'Student'}!</h1>
        <p className="text-muted-foreground">
          Here&apos;s your scholarship dashboard overview
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Readiness Score */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Readiness Score
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getScoreColor(readinessScore?.score || 0)}`}>
              {readinessScore?.score || 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              {readinessScore?.status || 'Loading...'}
            </p>
          </CardContent>
        </Card>

        {/* Matched Scholarships */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Matched Scholarships
            </CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{matchedScholarships.length}</div>
            <p className="text-xs text-muted-foreground">
              Based on your profile
            </p>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Notifications
            </CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {notifications.filter((n) => !n.is_read).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Unread notifications
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Readiness Recommendations */}
      {readinessScore && readinessScore.recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Action Items
            </CardTitle>
            <CardDescription>
              Complete these tasks to improve your readiness score
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {readinessScore.recommendations.map((rec: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Matched Scholarships */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Matched Scholarships</h2>
          <Button variant="outline" size="sm" asChild>
            <a href="/scholarships">View All</a>
          </Button>
        </div>

        {matchedScholarships.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">
                No scholarships matched yet. Complete your profile to get better matches.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {matchedScholarships.slice(0, 6).map((scholarship) => (
              <Card key={scholarship.id} className="flex flex-col">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg line-clamp-2">
                      {scholarship.title}
                    </CardTitle>
                    <Badge variant="secondary">{scholarship.country}</Badge>
                  </div>
                  <CardDescription className="line-clamp-2">
                    {scholarship.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Deadline: {formatDistanceToNow(new Date(scholarship.deadline), { addSuffix: true })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{scholarship.language}</Badge>
                  </div>
                </CardContent>
                <CardContent className="pt-0 flex gap-2">
                  <Button
                    className="flex-1"
                    onClick={() => handleApply(scholarship.id)}
                    disabled={applyingId === scholarship.id}
                  >
                    {applyingId === scholarship.id ? 'Applying...' : 'Apply'}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    asChild
                  >
                    <a href={scholarship.link} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Recent Notifications */}
      {notifications.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Notifications</CardTitle>
            <CardDescription>Stay updated with your applications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {notifications.slice(0, 5).map((notification) => (
                <div
                  key={notification.id}
                  className={`flex items-start gap-3 p-3 rounded-lg ${
                    notification.is_read ? 'bg-muted/50' : 'bg-primary/10'
                  }`}
                >
                  <Bell className="h-4 w-4 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm">{notification.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
