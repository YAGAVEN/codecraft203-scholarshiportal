'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, ExternalLink, Search } from 'lucide-react';
import { Scholarship } from '@/types/database.types';
import { formatDistanceToNow } from 'date-fns';
import { createClient } from '@/lib/supabase/client';

export default function ScholarshipsContent() {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [allScholarships, setAllScholarships] = useState<Scholarship[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCountry, setFilterCountry] = useState('all');
  const [applyingId, setApplyingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [countries, setCountries] = useState<string[]>(['all']);

  // Fetch scholarships from database
  useEffect(() => {
    const fetchScholarships = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('scholarships')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        setAllScholarships(data || []);
        setScholarships(data || []);
        
        // Extract unique countries
        const uniqueCountries = Array.from(new Set((data || []).map((s: Scholarship) => s.country)));
        setCountries(['all', ...uniqueCountries]);
      } catch (error) {
        console.error('Error fetching scholarships:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchScholarships();
  }, []);

  // Filter scholarships based on search and country filter
  useEffect(() => {
    let filtered = allScholarships;

    if (searchTerm) {
      filtered = filtered.filter((s: Scholarship) =>
        s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.country.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterCountry !== 'all') {
      filtered = filtered.filter((s: Scholarship) => s.country === filterCountry);
    }

    setScholarships(filtered);
  }, [searchTerm, filterCountry, allScholarships]);

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

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">All Scholarships</h1>
        <p className="text-muted-foreground">
          Browse and search through available scholarships
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search scholarships..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={filterCountry}
              onChange={(e) => setFilterCountry(e.target.value)}
              className="flex h-10 w-full md:w-[200px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {countries.map((country: string) => (
                <option key={country} value={country}>
                  {country === 'all' ? 'All Countries' : country}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {loading ? 'Loading...' : `Showing ${scholarships.length} scholarship${scholarships.length !== 1 ? 's' : ''}`}
        </p>
      </div>

      {/* Scholarships Grid */}
      {loading ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Loading scholarships...</p>
          </CardContent>
        </Card>
      ) : scholarships.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              No scholarships found matching your criteria.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {scholarships.map((scholarship) => (
            <Card key={scholarship.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-lg line-clamp-2">
                    {scholarship.title}
                  </CardTitle>
                  <Badge variant="secondary">{scholarship.country}</Badge>
                </div>
                <CardDescription className="line-clamp-3">
                  {scholarship.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow space-y-3">
                <div>
                  <p className="text-sm font-medium mb-1">Eligibility:</p>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {scholarship.eligibility_criteria}
                  </p>
                </div>
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
  );
}
