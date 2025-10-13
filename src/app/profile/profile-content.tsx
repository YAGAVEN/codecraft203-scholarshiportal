'use client';

import { useState } from 'react';
import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { User as UserType } from '@/types/database.types';
import { createClient } from '@/lib/supabase/client';
import { Save, User } from 'lucide-react';

interface ProfileContentProps {
  initialProfile: UserType | null;
}

export default function ProfileContent({ initialProfile }: ProfileContentProps) {
  const [profile, setProfile] = useState({
    name: initialProfile?.name || '',
    email: initialProfile?.email || '',
    course: initialProfile?.course || '',
    category: initialProfile?.category || '',
    economic_background: initialProfile?.economic_background || '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const supabase = createClient();

  // --- Document upload state ---
  const [files, setFiles] = useState<Array<{ name: string; path: string; publicUrl?: string }>>([]);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const BUCKET = 'user-docs'; // make sure this bucket exists in Supabase storage

  useEffect(() => {
    // fetch user's files on mount
    const load = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        const prefix = `${user.id}/`;
        const { data, error } = await supabase.storage.from(BUCKET).list(prefix, { limit: 100, offset: 0, sortBy: { column: 'name', order: 'asc' } });
        if (error) {
          console.error('Error listing files:', error.message || error);
          return;
        }
        const items = (data || []).map((d: any) => ({ name: d.name, path: `${prefix}${d.name}` }));
        // build public URLs where possible
        const withUrls = items.map((it: any) => {
          const { data } = supabase.storage.from(BUCKET).getPublicUrl(it.path);
          return { ...it, publicUrl: data?.publicUrl };
        });
        setFiles(withUrls);
      } catch (e) {
        console.error(e);
      }
    };
    load();
  }, [supabase]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files && e.target.files[0];
    if (f) setSelectedFile(f);
  };

  const uploadDocument = async () => {
    if (!selectedFile) return;
    setUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const path = `${user.id}/${Date.now()}_${selectedFile.name}`;
      const { error } = await supabase.storage.from(BUCKET).upload(path, selectedFile);
      if (error) throw error;

      const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
      setFiles((f) => [{ name: selectedFile.name, path, publicUrl: data?.publicUrl }, ...f]);
      setSelectedFile(null);
    } catch (err) {
      console.error('Upload failed', err);
      setMessage({ type: 'error', text: `Upload failed: ${(err as Error).message}` });
    } finally {
      setUploading(false);
    }
  };

  const deleteDocument = async (path: string) => {
    try {
      const { error } = await supabase.storage.from(BUCKET).remove([path]);
      if (error) throw error;
      setFiles((f) => f.filter((it) => it.path !== path));
    } catch (err) {
      console.error('Delete failed', err);
      setMessage({ type: 'error', text: `Delete failed: ${(err as Error).message}` });
    }
  };

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

      const { error } = await supabase
        .from('users')
        .update({
          name: profile.name,
          course: profile.course,
          category: profile.category,
          economic_background: profile.economic_background,
        })
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
    const fields = [profile.name, profile.email, profile.course, profile.category, profile.economic_background];
    const completed = fields.filter(field => field && field.trim() !== '').length;
    return Math.round((completed / fields.length) * 100);
  };

  const completeness = calculateCompleteness();

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Profile Settings</h1>
        <p className="text-muted-foreground">
          Manage your account information and preferences
        </p>
      </div>

      {/* Profile Completeness */}
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

      {/* Profile Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Personal Information
          </CardTitle>
          <CardDescription>
            Update your personal details and academic information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Full Name
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={profile.name}
                  onChange={handleChange}
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
            Upload supporting documents (e.g., transcripts, certificates) used for scholarship matching. Files are stored in your Supabase storage and will not modify the database schema.
          </p>

          <div className="space-y-2">
            <label className="text-sm font-medium">Upload Document</label>
            <div className="flex items-center gap-2">
              <input type="file" onChange={handleFileChange} />
              <Button onClick={uploadDocument} disabled={!selectedFile || uploading}>{uploading ? 'Uploading...' : 'Upload'}</Button>
            </div>
            {selectedFile && <div className="text-sm text-muted-foreground">Selected: {selectedFile.name}</div>}
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2">Your Documents</h4>
            {files.length === 0 && <div className="text-sm text-muted-foreground">No documents uploaded yet.</div>}
            <div className="space-y-2">
              {files.map((f) => (
                <div key={f.path} className="flex items-center justify-between gap-2 p-2 border rounded">
                  <div className="flex items-center gap-3">
                    <a href={f.publicUrl} target="_blank" rel="noreferrer" className="text-sm text-primary underline">{f.name}</a>
                    <span className="text-xs text-muted-foreground">{f.path.split('/').pop()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => deleteDocument(f.path)}>Delete</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
