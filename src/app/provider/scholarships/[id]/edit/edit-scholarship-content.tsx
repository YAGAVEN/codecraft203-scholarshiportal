'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import { Scholarship } from '@/types/database.types';

export default function EditScholarshipContent() {
  const params = useParams();
  const router = useRouter();
  const scholarshipId = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<Partial<Scholarship>>({
    title: '',
    description: '',
    eligibility_criteria: '',
    benefits: '',
    required_documents: '',
    deadline: '',
    country: '',
    language: '',
    link: '',
  });

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
      
      // Check if scholarship can be edited
      if (data.status === 'approved') {
        setError('Cannot edit approved scholarships');
        setLoading(false);
        return;
      }
      
      setFormData({
        title: data.title || '',
        description: data.description || '',
        eligibility_criteria: data.eligibility_criteria || '',
        benefits: data.benefits || '',
        required_documents: data.required_documents || '',
        deadline: data.deadline ? data.deadline.split('T')[0] : '',
        country: data.country || '',
        language: data.language || '',
        link: data.link || '',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const response = await fetch(`/api/provider/scholarships/${scholarshipId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update scholarship');
      }

      // Redirect to view page
      router.push(`/provider/scholarships/${scholarshipId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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

  if (error && !formData.title) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="py-12 text-center">
            <h3 className="text-lg font-semibold mb-2 text-destructive">Error</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
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
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button 
          variant="ghost" 
          onClick={() => router.push(`/provider/scholarships/${scholarshipId}`)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Edit Scholarship</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-destructive/15 text-destructive px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Title */}
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Scholarship Title *
              </label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter scholarship title"
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description *
              </label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the scholarship program"
                rows={4}
                required
              />
            </div>

            {/* Eligibility Criteria */}
            <div className="space-y-2">
              <label htmlFor="eligibility_criteria" className="text-sm font-medium">
                Eligibility Criteria *
              </label>
              <Textarea
                id="eligibility_criteria"
                name="eligibility_criteria"
                value={formData.eligibility_criteria}
                onChange={handleChange}
                placeholder="List the eligibility requirements"
                rows={4}
                required
              />
            </div>

            {/* Benefits */}
            <div className="space-y-2">
              <label htmlFor="benefits" className="text-sm font-medium">
                Benefits
              </label>
              <Textarea
                id="benefits"
                name="benefits"
                value={formData.benefits}
                onChange={handleChange}
                placeholder="Describe the benefits (e.g., tuition coverage, stipend)"
                rows={3}
              />
            </div>

            {/* Required Documents */}
            <div className="space-y-2">
              <label htmlFor="required_documents" className="text-sm font-medium">
                Required Documents
              </label>
              <Textarea
                id="required_documents"
                name="required_documents"
                value={formData.required_documents}
                onChange={handleChange}
                placeholder="List required documents (e.g., transcripts, letters)"
                rows={3}
              />
            </div>

            {/* Deadline, Country, Language */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label htmlFor="deadline" className="text-sm font-medium">
                  Deadline *
                </label>
                <Input
                  id="deadline"
                  name="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="country" className="text-sm font-medium">
                  Country *
                </label>
                <Input
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="e.g., USA, UK"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="language" className="text-sm font-medium">
                  Language *
                </label>
                <Input
                  id="language"
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  placeholder="e.g., English"
                  required
                />
              </div>
            </div>

            {/* Application Link */}
            <div className="space-y-2">
              <label htmlFor="link" className="text-sm font-medium">
                Application Link *
              </label>
              <Input
                id="link"
                name="link"
                type="url"
                value={formData.link}
                onChange={handleChange}
                placeholder="https://example.com/apply"
                required
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(`/provider/scholarships/${scholarshipId}`)}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
