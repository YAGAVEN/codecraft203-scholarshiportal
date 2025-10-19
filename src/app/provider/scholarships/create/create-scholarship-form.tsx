'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Loader2 } from 'lucide-react';

interface CreateScholarshipFormProps {
  providerId: string;
}

export default function CreateScholarshipForm({ providerId }: CreateScholarshipFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eligibility_criteria: '',
    benefits: '',
    required_documents: '',
    deadline: '',
    country: 'India',
    language: 'English',
    link: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/provider/scholarships', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          provider_id: providerId,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create scholarship');
      }

      // Redirect to scholarships page on success
      router.push('/provider/scholarships');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Create Scholarship</h1>
          <p className="text-muted-foreground">
            Post a new scholarship opportunity
          </p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Scholarship Details</CardTitle>
          <CardDescription>
            Fill in the details for your scholarship. It will be reviewed by admins before going live.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-destructive/15 text-destructive px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Title */}
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Scholarship Title <span className="text-destructive">*</span>
              </label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Tech Excellence Scholarship 2025"
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description <span className="text-destructive">*</span>
              </label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the scholarship, its purpose, and what makes it unique..."
                rows={4}
                required
              />
            </div>

            {/* Eligibility Criteria */}
            <div className="space-y-2">
              <label htmlFor="eligibility_criteria" className="text-sm font-medium">
                Eligibility Criteria <span className="text-destructive">*</span>
              </label>
              <Textarea
                id="eligibility_criteria"
                name="eligibility_criteria"
                value={formData.eligibility_criteria}
                onChange={handleChange}
                placeholder="List the requirements students must meet to apply..."
                rows={3}
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
                placeholder="What financial aid or other benefits will students receive?"
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
                placeholder="List the documents students need to submit..."
                rows={3}
              />
            </div>

            {/* Deadline */}
            <div className="space-y-2">
              <label htmlFor="deadline" className="text-sm font-medium">
                Application Deadline <span className="text-destructive">*</span>
              </label>
              <Input
                id="deadline"
                name="deadline"
                type="date"
                value={formData.deadline}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            {/* Country and Language */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="country" className="text-sm font-medium">
                  Country <span className="text-destructive">*</span>
                </label>
                <Input
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="e.g., India"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="language" className="text-sm font-medium">
                  Language <span className="text-destructive">*</span>
                </label>
                <Input
                  id="language"
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  placeholder="e.g., English, Hindi"
                  required
                />
              </div>
            </div>

            {/* Application Link */}
            <div className="space-y-2">
              <label htmlFor="link" className="text-sm font-medium">
                Application Link <span className="text-destructive">*</span>
              </label>
              <Input
                id="link"
                name="link"
                type="url"
                value={formData.link}
                onChange={handleChange}
                placeholder="https://example.com/scholarship-application"
                required
              />
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? 'Creating...' : 'Create Scholarship'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
