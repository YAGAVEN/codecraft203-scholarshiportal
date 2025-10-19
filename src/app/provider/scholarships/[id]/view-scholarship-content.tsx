'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Edit, 
  Calendar, 
  Globe, 
  Languages, 
  GraduationCap,
  CheckCircle,
  Clock,
  XCircle,
  Loader2,
  Users
} from 'lucide-react';
import { Scholarship } from '@/types/database.types';
import { format } from 'date-fns';

export default function ViewScholarshipContent() {
  const params = useParams();
  const router = useRouter();
  const scholarshipId = params.id as string;
  
  const [scholarship, setScholarship] = useState<Scholarship | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [applicationsCount, setApplicationsCount] = useState(0);

  useEffect(() => {
    if (scholarshipId) {
      fetchScholarship();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scholarshipId]);

  const fetchScholarship = async () => {
    try {
      const response = await fetch(`/api/provider/scholarships/${scholarshipId}`);
      if (!response.ok) throw new Error('Failed to fetch scholarship');

      const data = await response.json();
      setScholarship(data);

      // Fetch applications count
      const appsResponse = await fetch('/api/provider/applications');
      if (appsResponse.ok) {
        const appsData = await appsResponse.json();
        const count = appsData.applications.filter(
          (app: { scholarship_id: string }) => app.scholarship_id === scholarshipId
        ).length;
        setApplicationsCount(count);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <Badge className="bg-green-600 text-white">
            <CheckCircle className="h-3 w-3 mr-1" />
            Approved
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="secondary">
            <Clock className="h-3 w-3 mr-1" />
            Pending Review
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="destructive">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        );
      case 'withdrawn':
        return <Badge variant="outline">Withdrawn</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (error || !scholarship) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="py-12 text-center">
            <h3 className="text-lg font-semibold mb-2 text-destructive">Error</h3>
            <p className="text-muted-foreground mb-4">{error || 'Scholarship not found'}</p>
            <Button onClick={() => router.push('/provider/scholarships')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Scholarships
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          onClick={() => router.push('/provider/scholarships')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => router.push(`/provider/scholarships/${scholarshipId}/edit`)}
            disabled={scholarship.status === 'approved'}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button
            onClick={() => router.push('/provider/applications')}
          >
            <Users className="h-4 w-4 mr-2" />
            View Applications ({applicationsCount})
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <CardTitle className="text-3xl">{scholarship.title}</CardTitle>
                {getStatusBadge(scholarship.status)}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-muted-foreground whitespace-pre-wrap">{scholarship.description}</p>
          </div>

          {/* Key Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 border rounded-lg">
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Deadline</p>
                <p className="font-semibold">
                  {format(new Date(scholarship.deadline), 'PPP')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 border rounded-lg">
              <Globe className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Country</p>
                <p className="font-semibold">{scholarship.country}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 border rounded-lg">
              <Languages className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Language</p>
                <p className="font-semibold">{scholarship.language}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 border rounded-lg">
              <Users className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total Applications</p>
                <p className="font-semibold">{applicationsCount}</p>
              </div>
            </div>
          </div>

          {/* Eligibility Criteria */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Eligibility Criteria
            </h3>
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {scholarship.eligibility_criteria}
              </p>
            </div>
          </div>

          {/* Benefits */}
          {scholarship.benefits && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Benefits</h3>
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {scholarship.benefits}
                </p>
              </div>
            </div>
          )}

          {/* Required Documents */}
          {scholarship.required_documents && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Required Documents</h3>
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {scholarship.required_documents}
                </p>
              </div>
            </div>
          )}

          {/* Application Link */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Application Link</h3>
            <a 
              href={scholarship.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline break-all"
            >
              {scholarship.link}
            </a>
          </div>

          {/* Timestamps */}
          {(scholarship.created_at || scholarship.updated_at) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
              {scholarship.created_at && (
                <div>
                  <p className="text-sm text-muted-foreground">Created On</p>
                  <p className="font-semibold">
                    {format(new Date(scholarship.created_at), 'PPP')}
                  </p>
                </div>
              )}
              {scholarship.updated_at && (
                <div>
                  <p className="text-sm text-muted-foreground">Last Updated</p>
                  <p className="font-semibold">
                    {format(new Date(scholarship.updated_at), 'PPP')}
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
