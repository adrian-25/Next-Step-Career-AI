export interface LiveJob {
  id: string;
  title: string;
  company: string;
  locations: string[];
  publishedAt?: string;
  url: string;
  description: string;
}

export interface LiveJobsResult {
  source: string;
  queriedAt: string;
  role: string;
  city: string;
  totalFromSource: number;
  jobs: LiveJob[];
  topSkills: Array<{ name: string; count: number }>;
  topCompanies: Array<{ name: string; count: number }>;
}

const apiBase = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/$/, '');

export async function fetchLiveJobs(role: string, city: string): Promise<LiveJobsResult> {
  const params = new URLSearchParams({ role, city });
  const response = await fetch(`${apiBase}/api/jobs/search?${params}`);
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.detail || 'Could not load current job listings.');
  }
  return response.json();
}
