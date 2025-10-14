'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, FileText, CheckCircle, XCircle, Loader2, Clock, Mail, BookOpen, DollarSign, X } from 'lucide-react';
import { Application } from '@/types/database.types';
import { formatDistanceToNow } from 'date-fns';

export default function ReviewApplicationsContent() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await fetch('/api/provider/applications');
      if (!response.ok) throw new Error('Failed to fetch applications');

      const data = await response.json();
      setApplications(data.applications);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (applicationId: string, newStatus: 'shortlisted' | 'selected' | 'rejected') => {
    setActionLoading(applicationId);
    try {
      const response = await fetch('/api/provider/applications', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          application_id: applicationId,
          status: newStatus,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update application');
      }

      // Update local state
      setApplications((prev) =>
        prev.map((app) =>
          app.id === applicationId ? { ...app, status: newStatus } : app
        )
      );

      // Show success message
      alert(`Application ${newStatus} successfully!`);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setActionLoading(null);
    }
  };

  const handleShortlist = (applicationId: string) => {
    if (confirm('Are you sure you want to shortlist this application?')) {
      updateApplicationStatus(applicationId, 'shortlisted');
    }
  };

  const handleReject = (applicationId: string) => {
    if (confirm('Are you sure you want to reject this application? This action cannot be undone.')) {
      updateApplicationStatus(applicationId, 'rejected');
    }
  };

  const handleSelect = (applicationId: string) => {
    if (confirm('Are you sure you want to select this applicant for the scholarship?')) {
      updateApplicationStatus(applicationId, 'selected');
    }
  };

  const handleViewDetails = (application: Application) => {
    setSelectedApplication(application);
  };

  const closeDetailsModal = () => {
    setSelectedApplication(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'shortlisted':
        return <Badge className="bg-blue-600"><FileText className="h-3 w-3 mr-1" />Shortlisted</Badge>;
      case 'selected':
        return <Badge className="bg-green-600"><CheckCircle className="h-3 w-3 mr-1" />Selected</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Review Applications</h1>
        <p className="text-muted-foreground">
          Manage applications for your scholarships
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{applications.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {applications.filter((a) => a.status === 'pending').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Shortlisted</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {applications.filter((a) => a.status === 'shortlisted').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Selected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {applications.filter((a) => a.status === 'selected').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-destructive/15 text-destructive px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Applications List */}
      {applications.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No applications yet</h3>
            <p className="text-muted-foreground">
              Applications to your scholarships will appear here
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {applications.map((application) => (
            <Card key={application.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-lg">
                        {application.scholarship?.title || 'Scholarship'}
                      </CardTitle>
                      {getStatusBadge(application.status)}
                    </div>
                    <CardDescription>
                      Applied {formatDistanceToNow(new Date(application.applied_at), { addSuffix: true })}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {application.user?.name || 'Unknown'}
                    </p>
                    <p className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {application.user?.email || 'No email'}
                    </p>
                    {application.documents_submitted && (
                      <p className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Documents: {application.documents_submitted}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewDetails(application)}
                    >
                      <FileText className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                    {application.status === 'pending' && (
                      <>
                        <Button 
                          size="sm" 
                          variant="default"
                          onClick={() => handleShortlist(application.id)}
                          disabled={actionLoading === application.id}
                        >
                          {actionLoading === application.id ? (
                            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                          ) : (
                            <CheckCircle className="h-4 w-4 mr-1" />
                          )}
                          Shortlist
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleReject(application.id)}
                          disabled={actionLoading === application.id}
                        >
                          {actionLoading === application.id ? (
                            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                          ) : (
                            <XCircle className="h-4 w-4 mr-1" />
                          )}
                          Reject
                        </Button>
                      </>
                    )}
                    {application.status === 'shortlisted' && (
                      <>
                        <Button 
                          size="sm" 
                          variant="default"
                          onClick={() => handleSelect(application.id)}
                          disabled={actionLoading === application.id}
                        >
                          {actionLoading === application.id ? (
                            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                          ) : (
                            <CheckCircle className="h-4 w-4 mr-1" />
                          )}
                          Select
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleReject(application.id)}
                          disabled={actionLoading === application.id}
                        >
                          {actionLoading === application.id ? (
                            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                          ) : (
                            <XCircle className="h-4 w-4 mr-1" />
                          )}
                          Reject
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Details Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-2xl mb-2">Application Details</CardTitle>
                  <CardDescription>
                    Review complete application information
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={closeDetailsModal}
                  className="flex-shrink-0"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Status */}
              <div>
                <h3 className="font-semibold mb-2">Application Status</h3>
                {getStatusBadge(selectedApplication.status)}
              </div>

              {/* Applicant Information */}
              <div>
                <h3 className="font-semibold mb-3">Applicant Information</h3>
                <div className="space-y-2 bg-muted/50 p-4 rounded-lg">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Name:</span>
                    <span>{selectedApplication.user?.name || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Email:</span>
                    <span>{selectedApplication.user?.email || 'N/A'}</span>
                  </div>
                  {selectedApplication.user?.course && (
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Course:</span>
                      <span>{selectedApplication.user.course}</span>
                    </div>
                  )}
                  {selectedApplication.user?.category && (
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Category:</span>
                      <Badge variant="outline">{selectedApplication.user.category}</Badge>
                    </div>
                  )}
                  {selectedApplication.user?.economic_background && (
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Economic Background:</span>
                      <span>{selectedApplication.user.economic_background}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Scholarship Information */}
              <div>
                <h3 className="font-semibold mb-3">Scholarship Information</h3>
                <div className="space-y-2 bg-muted/50 p-4 rounded-lg">
                  <div>
                    <span className="font-medium">Title:</span>
                    <p className="mt-1">{selectedApplication.scholarship?.title || 'N/A'}</p>
                  </div>
                  {selectedApplication.scholarship?.description && (
                    <div>
                      <span className="font-medium">Description:</span>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {selectedApplication.scholarship.description}
                      </p>
                    </div>
                  )}
                  {selectedApplication.scholarship?.deadline && (
                    <div>
                      <span className="font-medium">Deadline:</span>
                      <p className="mt-1">
                        {new Date(selectedApplication.scholarship.deadline).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Documents */}
              {selectedApplication.documents_submitted && (
                <div>
                  <h3 className="font-semibold mb-2">Documents Submitted</h3>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="text-sm">{selectedApplication.documents_submitted}</p>
                  </div>
                </div>
              )}

              {/* Application Date */}
              <div>
                <h3 className="font-semibold mb-2">Application Date</h3>
                <p className="text-sm text-muted-foreground">
                  {new Date(selectedApplication.applied_at).toLocaleString()} 
                  <span className="ml-2">
                    ({formatDistanceToNow(new Date(selectedApplication.applied_at), { addSuffix: true })})
                  </span>
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4 border-t">
                {selectedApplication.status === 'pending' && (
                  <>
                    <Button 
                      className="flex-1"
                      onClick={() => {
                        handleShortlist(selectedApplication.id);
                        closeDetailsModal();
                      }}
                      disabled={actionLoading === selectedApplication.id}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Shortlist
                    </Button>
                    <Button 
                      variant="destructive"
                      className="flex-1"
                      onClick={() => {
                        handleReject(selectedApplication.id);
                        closeDetailsModal();
                      }}
                      disabled={actionLoading === selectedApplication.id}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                  </>
                )}
                {selectedApplication.status === 'shortlisted' && (
                  <>
                    <Button 
                      className="flex-1"
                      onClick={() => {
                        handleSelect(selectedApplication.id);
                        closeDetailsModal();
                      }}
                      disabled={actionLoading === selectedApplication.id}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Select
                    </Button>
                    <Button 
                      variant="destructive"
                      className="flex-1"
                      onClick={() => {
                        handleReject(selectedApplication.id);
                        closeDetailsModal();
                      }}
                      disabled={actionLoading === selectedApplication.id}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                  </>
                )}
                {(selectedApplication.status === 'selected' || selectedApplication.status === 'rejected') && (
                  <Button 
                    variant="outline"
                    className="flex-1"
                    onClick={closeDetailsModal}
                  >
                    Close
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
