'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User as UserType } from '@/types/database.types';
import { createClient } from '@/lib/supabase/client';
import { Save, User, Building2, Shield } from 'lucide-react';
import DocumentUploader from '@/components/DocumentUploader';

interface ProfileContentProps {
  initialProfile: UserType | null;
}

export default function ProfileContent({ initialProfile }: ProfileContentProps) {
  const [profile, setProfile] = useState({
    name: initialProfile?.name || '',
    email: initialProfile?.email || '',
    role: initialProfile?.role || 'student',
    // Student fields
    course: initialProfile?.course || '',
    category: initialProfile?.category || '',
    economic_background: initialProfile?.economic_background || '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const supabase = createClient();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Build update object based on role
      const updateData: Record<string, string> = {
        name: profile.name,
      };

      // Only include student-specific fields for students
      if (profile.role === 'student') {
        updateData.course = profile.course;
        updateData.category = profile.category;
        updateData.economic_background = profile.economic_background;
      }

      const { error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', user.id);

      if (error) throw error;

      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const calculateCompleteness = () => {
    let fields: string[];
    
    if (profile.role === 'student') {
      fields = [profile.name, profile.email, profile.course, profile.category, profile.economic_background];
    } else {
      // Provider and Admin only need basic info
      fields = [profile.name, profile.email];
    }
    
    const completed = fields.filter(field => field && field.trim() !== '').length;
    return Math.round((completed / fields.length) * 100);
  };

  const completeness = calculateCompleteness();
  
  const getRoleDisplay = () => {
    const roles = {
      student: { label: 'Student', icon: User, color: 'bg-blue-500' },
      provider: { label: 'Provider', icon: Building2, color: 'bg-green-500' },
      admin: { label: 'Admin', icon: Shield, color: 'bg-purple-500' },
    };
    return roles[profile.role as keyof typeof roles] || roles.student;
  };
  
  const roleDisplay = getRoleDisplay();

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Profile Settings</h1>
          <p className="text-muted-foreground">
            Manage your account information and preferences
          </p>
        </div>
        <Badge variant="outline" className="gap-2 px-4 py-2">
          <roleDisplay.icon className="h-4 w-4" />
          {roleDisplay.label}
        </Badge>
      </div>

      {/* Profile Completeness - Only show for students */}
      {profile.role === 'student' && (
        <Card>
          <CardHeader>
            <CardTitle>Profile Completeness</CardTitle>
            <CardDescription>
              Complete your profile to get better scholarship matches
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Progress</span>
                <span className="text-muted-foreground">{completeness}%</span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${completeness}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Profile Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <roleDisplay.icon className="h-5 w-5" />
            {profile.role === 'provider' ? 'Organization Information' : 
             profile.role === 'admin' ? 'Administrator Information' : 
             'Personal Information'}
          </CardTitle>
          <CardDescription>
            {profile.role === 'provider' 
              ? 'Update your organization details' 
              : profile.role === 'admin'
              ? 'Manage your administrator profile'
              : 'Update your personal details and academic information'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Basic Info - All Roles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  {profile.role === 'provider' ? 'Organization Name' : 
                   profile.role === 'admin' ? 'Full Name' : 'Full Name'}
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={profile.name}
                  onChange={handleChange}
                  placeholder={profile.role === 'provider' ? 'e.g., ABC Foundation' : 'Your full name'}
                  required
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={profile.email}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  Email cannot be changed
                </p>
              </div>
            </div>

            {/* Student-specific fields */}
            {profile.role === 'student' && (
              <>
                <div className="space-y-2">
                  <label htmlFor="course" className="text-sm font-medium">
                    Course/Field of Study
                  </label>
                  <Input
                    id="course"
                    name="course"
                    type="text"
                    placeholder="e.g., Computer Science, Medicine, Engineering"
                    value={profile.course}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="category" className="text-sm font-medium">
                      Category
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={profile.category}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="">Select category</option>
                      <option value="General">General</option>
                      <option value="OBC">OBC</option>
                      <option value="SC">SC</option>
                      <option value="ST">ST</option>
                      <option value="EWS">EWS</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="economic_background" className="text-sm font-medium">
                      Economic Background
                    </label>
                    <select
                      id="economic_background"
                      name="economic_background"
                      value={profile.economic_background}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="">Select background</option>
                      <option value="Below Poverty Line">Below Poverty Line</option>
                      <option value="Low Income">Low Income</option>
                      <option value="Middle Income">Middle Income</option>
                      <option value="High Income">High Income</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            {/* Provider-specific info */}
            {profile.role === 'provider' && (
              <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Provider Account</strong><br />
                  You can create and manage scholarships through your dashboard. 
                  All scholarships require admin approval before they go live.
                </p>
              </div>
            )}

            {/* Admin-specific info */}
            {profile.role === 'admin' && (
              <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Administrator Account</strong><br />
                  You have full access to manage scholarships, users, and platform settings.
                  Use your privileges responsibly.
                </p>
              </div>
            )}

            {message && (
              <div
                className={`text-sm p-3 rounded-md ${
                  message.type === 'success'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                    : 'bg-destructive/10 text-destructive'
                }`}
              >
                {message.text}
              </div>
            )}

            <Button type="submit" className="w-full md:w-auto" disabled={loading}>
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Document Upload Section - Only for Students */}
      {profile.role === 'student' && initialProfile?.id && (
        <DocumentUploader 
          userId={initialProfile.id}
          onDocumentsChange={(docs) => {
            console.log('Documents updated:', docs.length);
          }}
        />
      )}

      {/* Additional Settings Card */}
      <Card>
        <CardHeader>
          <CardTitle>Account Actions</CardTitle>
          <CardDescription>
            Manage your account preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Need to change your password or delete your account? Contact support.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
