import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { JobCard } from '@/components/jobs/JobCard';
import { JobDetails } from '@/components/jobs/JobDetails';
import { Briefcase, Search, RefreshCw, AlertCircle, ExternalLink } from 'lucide-react';
import { fetchJobsForRole, type RealJob } from '@/services/jobFetcher';
import { toast } from 'sonner';

// Detect role from localStorage (set by the resume analysis pipeline)
function getStoredRole(): string {
  try {
    return localStorage.getItem('lastDetectedRole') ?? 'software_developer';
  } catch {
    return 'software_developer';
  }
}

export function JobRecommendationsPage() {
  const [jobs, setJobs]               = useState<RealJob[]>([]);
  const [filtered, setFiltered]       = useState<RealJob[]>([]);
  const [selected, setSelected]       = useState<RealJob | null>(null);
  const [loading, setLoading]         = useState(true);
  const [fetchError, setFetchError]   = useState(false);
  const [isFallback, setIsFallback]   = useState(false);
  const [search, setSearch]           = useState('');
  const [role]                        = useState(getStoredRole);

  const loadJobs = useCallback(async () => {
    setLoading(true);
    setFetchError(false);
    try {
      const result = await fetchJobsForRole(role);
      setJobs(result.jobs);
      setFiltered(result.jobs);
      setIsFallback(result.source === 'fallback');
      if (result.source === 'fallback') {
        toast.info('Showing curated job search links — connect a RapidAPI key for live listings.');
      }
    } catch (err) {
      console.error('[JobRecommendations] fetch failed:', err);
      setFetchError(true);
      setJobs([]);
      setFiltered([]);
    } finally {
      setLoading(false);
    }
  }, [role]);

  useEffect(() => { loadJobs(); }, [loadJobs]);

  useEffect(() => {
    if (!search.trim()) { setFiltered(jobs); return; }
    const q = search.toLowerCase();
    setFiltered(jobs.filter(j =>
      j.title.toLowerCase().includes(q) ||
      j.company.toLowerCase().includes(q) ||
      j.location.toLowerCase().includes(q) ||
      j.requiredSkills.some(s => s.toLowerCase().includes(q))
    ));
  }, [search, jobs]);

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-lg font-medium">Fetching latest job listings…</p>
        </div>
      </div>
    );
  }

  // ── Error ─────────────────────────────────────────────────────────────────
  if (fetchError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="max-w-md w-full text-center">
          <CardContent className="pt-8 pb-6 space-y-4">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
            <CardTitle className="text-xl">Couldn't load job listings</CardTitle>
            <p className="text-sm text-muted-foreground">
              Try loading the latest jobs from Unstop, Internshala, or LinkedIn.
            </p>
            <Button onClick={loadJobs} className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" />
              Load latest jobs from Unstop
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ── Helpers ───────────────────────────────────────────────────────────────
  const roleLabel = role.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  // ── Main render ───────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Briefcase className="h-7 w-7 text-primary" />
            <div>
              <h1 className="text-2xl font-bold">Job Recommendations</h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary">{roleLabel}</Badge>
                {isFallback && (
                  <Badge variant="outline" className="text-xs text-muted-foreground">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Curated links
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <Button variant="outline" onClick={loadJobs} size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-4 pb-3">
              <p className="text-2xl font-bold">{jobs.length}</p>
              <p className="text-xs text-muted-foreground">Jobs found</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-3">
              <p className="text-2xl font-bold">{roleLabel}</p>
              <p className="text-xs text-muted-foreground">Detected role</p>
            </CardContent>
          </Card>
          <Card className="col-span-2 sm:col-span-1">
            <CardContent className="pt-4 pb-3">
              <p className="text-2xl font-bold capitalize">{isFallback ? 'Curated' : 'Live API'}</p>
              <p className="text-xs text-muted-foreground">Source</p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by title, company, location or skill…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Job grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Briefcase className="h-10 w-10 mx-auto mb-3 opacity-40" />
            <p>No jobs match your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((job) => (
              <JobCard
                key={job.jobId}
                job={job}
                onClick={() => setSelected(job)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Job details modal */}
      <JobDetails
        open={selected !== null}
        onOpenChange={(open) => { if (!open) setSelected(null); }}
        job={selected}
      />
    </div>
  );
}
