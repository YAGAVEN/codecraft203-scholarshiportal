'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Award, 
  Calendar,
  ExternalLink,
  AlertCircle
} from 'lucide-react';
import { Scholarship, User } from '@/types/database.types';
import { formatDistanceToNow } from 'date-fns';
import ReadinessDonut from '@/components/ReadinessDonut';

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
  const router = useRouter();
  const [matchedScholarships, setMatchedScholarships] = useState<Scholarship[]>([]);
  const [readinessScore, setReadinessScore] = useState<ReadinessScore | null>(null);
  const [loading, setLoading] = useState(true);
  const [applyingId, setApplyingId] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [matchRes, readinessRes] = await Promise.all([
        fetch('/api/match'),
        fetch('/api/readiness'),
      ]);

      const matchData = await matchRes.json();
      const readinessData = await readinessRes.json();

      setMatchedScholarships(matchData.scholarships || []);
      setReadinessScore(readinessData);
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
          Track your scholarship readiness and discover opportunities
        </p>
      </div>

      {/* HERO: Readiness Score - The Centerpiece */}
      {readinessScore && (
        <Card className="border-2 border-primary/20 shadow-lg">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left: Readiness Donut - Large and Prominent */}
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="relative">
                  <div className="relative w-48 h-48">
                    <ReadinessDonut value={readinessScore.score} size={192} stroke={16} />
                  </div>
                </div>
                <div className="text-center">
                  <h2 className="text-2xl font-bold">Readiness Score</h2>
                  <p className={`text-3xl font-bold mt-2 ${getScoreColor(readinessScore.score)}`}>
                    {readinessScore.score}%
                  </p>
                  <p className="text-lg text-muted-foreground mt-1">
                    {readinessScore.status}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">Overall readiness</p>
                </div>
              </div>

              {/* Middle: Matched Scholarships Counter */}
              <div className="flex flex-col items-center justify-center border-l border-r border-border px-8">
                <Award className="h-16 w-16 text-primary mb-4" />
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-2">Matched Scholarships</h3>
                  <p className="text-6xl font-bold text-primary">{matchedScholarships.length}</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Based on your profile
                  </p>
                  <Button 
                    className="mt-4" 
                    variant="outline"
                    onClick={() => router.push('/scholarships')}
                  >
                    Browse All
                  </Button>
                </div>
              </div>

              {/* Right: Quick Stats */}
              <div className="flex flex-col justify-center space-y-4">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Applications Submitted</p>
                  <p className="text-2xl font-bold">{readinessScore.applicationCount}</p>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Profile Completion</p>
                  <p className="text-2xl font-bold">
                    {readinessScore.factors.find(f => f.name.includes('Profile'))
                      ? Math.round((readinessScore.factors.find(f => f.name.includes('Profile'))!.score / 
                          readinessScore.factors.find(f => f.name.includes('Profile'))!.maxScore) * 100)
                      : 0}%
                  </p>
                </div>
                <Button 
                  className="w-full" 
                  onClick={() => router.push('/profile')}
                >
                  Complete Profile
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Items Section */}
      {readinessScore && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                  Action Items
                </CardTitle>
                <CardDescription className="mt-1">
                  Tasks and missing documents to improve your readiness score
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left: Provided Information */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b">
                  <div className="h-2 w-2 rounded-full bg-green-600"></div>
                  <h3 className="font-semibold text-base">Provided Information</h3>
                </div>
                <div className="space-y-4">
                  {readinessScore.factors.map((f, i) => {
                    const pct = Math.round((f.score / f.maxScore) * 100);
                    const isComplete = pct === 100;
                    return (
                      <div key={i} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`h-2 w-2 rounded-full ${isComplete ? 'bg-green-600' : 'bg-yellow-600'}`}></div>
                            <span className="text-sm font-medium">{f.name}</span>
                          </div>
                          <span className={`text-sm font-semibold ${isComplete ? 'text-green-600' : 'text-yellow-600'}`}>
                            {pct}%
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
                          <div 
                            className={`h-2.5 rounded-full transition-all duration-500 ${
                              isComplete ? 'bg-green-600' : 'bg-yellow-600'
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right: Missing Documents & Details */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b">
                  <div className="h-2 w-2 rounded-full bg-red-600"></div>
                  <h3 className="font-semibold text-base">Missing Documents & Details</h3>
                </div>
                <div className="space-y-3">
                  {readinessScore.recommendations.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 mb-4">
                        <TrendingUp className="h-8 w-8 text-green-600" />
                      </div>
                      <p className="text-sm font-medium">All Set!</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        All required documents provided.
                      </p>
                    </div>
                  ) : (
                    readinessScore.recommendations.map((rec: string, idx: number) => (
                      <div 
                        key={idx} 
                        className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-lg"
                      >
                        <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-red-900 dark:text-red-100">
                            {rec}
                          </p>
                          <p className="text-xs text-red-700 dark:text-red-300 mt-1">
                            Complete this to increase your scholarship match rate
                          </p>
                        </div>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          className="flex-shrink-0"
                          onClick={() => router.push('/profile')}
                        >
                          Add
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Matched Scholarships Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold">Your Matched Scholarships</h2>
            <p className="text-sm text-muted-foreground">
              Opportunities that fit your profile and goals
            </p>
          </div>
          <Button variant="default" size="sm" onClick={() => router.push('/scholarships')}>
            View All {matchedScholarships.length > 6 ? `(${matchedScholarships.length})` : ''}
          </Button>
        </div>

        {matchedScholarships.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-12 text-center">
              <Award className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Matches Yet</h3>
              <p className="text-muted-foreground mb-4">
                Complete your profile to get personalized scholarship recommendations
              </p>
              <Button onClick={() => router.push('/profile')}>
                Complete Your Profile
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {matchedScholarships.slice(0, 6).map((scholarship) => (
              <Card key={scholarship.id} className="flex flex-col hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg line-clamp-2">
                      {scholarship.title}
                    </CardTitle>
                    <Badge variant="secondary" className="flex-shrink-0">
                      {scholarship.country}
                    </Badge>
                  </div>
                  <CardDescription className="line-clamp-3">
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
                    {applyingId === scholarship.id ? 'Applying...' : 'Apply Now'}
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
    </div>
  );
}
