/**
 * useJobRecommendations Hook
 * Custom hook for fetching and managing job recommendation data
 */

import { useState, useEffect, useCallback } from 'react';
import { JobRecommendationsService } from '../services/jobRecommendations.service';

interface SkillGap {
  skill: string;
  importance: 'critical' | 'important' | 'nice-to-have';
}

interface JobRecommendationData {
  id: string;
  userId: string;
  jobId: string;
  title: string;
  company: string;
  location: string;
  salaryMin: number;
  salaryMax: number;
  salaryCurrency: string;
  requiredSkills: string[];
  matchScore: number;
  skillGaps: SkillGap[];
  createdAt: string;
  updatedAt: string;
}

interface JobFilters {
  location?: string;
  minSalary?: number;
  maxSalary?: number;
  minMatchScore?: number;
}

interface UseJobRecommendationsResult {
  jobs: JobRecommendationData[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch job recommendations for a user
 * @param userId - User ID to fetch recommendations for
 * @param filters - Optional filters for location, salary, and match score
 * @returns Job recommendations, loading state, error, and refetch function
 */
export function useJobRecommendations(
  userId: string | null,
  filters?: JobFilters
): UseJobRecommendationsResult {
  const [jobs, setJobs] = useState<JobRecommendationData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchJobs = useCallback(async () => {
    if (!userId) {
      setJobs([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const jobRecommendationsService = new JobRecommendationsService();
      const recommendations = await jobRecommendationsService.getJobRecommendations(
        userId,
        filters
      );

      const formattedJobs = recommendations.map((job) => ({
        id: job.id,
        userId: job.user_id,
        jobId: job.job_id,
        title: job.title,
        company: job.company,
        location: job.location,
        salaryMin: job.salary_min,
        salaryMax: job.salary_max,
        salaryCurrency: job.salary_currency,
        requiredSkills: job.required_skills || [],
        matchScore: job.match_score,
        skillGaps: job.skill_gaps || [],
        createdAt: job.created_at,
        updatedAt: job.updated_at,
      }));

      setJobs(formattedJobs);
    } catch (err) {
      console.error('Error fetching job recommendations:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch job recommendations'));
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, [userId, filters]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  return {
    jobs,
    loading,
    error,
    refetch: fetchJobs,
  };
}

/**
 * Hook to fetch top job recommendations sorted by match score
 * @param userId - User ID to fetch recommendations for
 * @param limit - Maximum number of jobs to fetch (default: 10)
 * @returns Top job recommendations, loading state, error, and refetch function
 */
export function useTopJobRecommendations(
  userId: string | null,
  limit: number = 10
): UseJobRecommendationsResult {
  const [jobs, setJobs] = useState<JobRecommendationData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchTopJobs = useCallback(async () => {
    if (!userId) {
      setJobs([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const jobRecommendationsService = new JobRecommendationsService();
      const recommendations = await jobRecommendationsService.getTopRecommendations(
        userId,
        limit
      );

      const formattedJobs = recommendations.map((job) => ({
        id: job.id,
        userId: job.user_id,
        jobId: job.job_id,
        title: job.title,
        company: job.company,
        location: job.location,
        salaryMin: job.salary_min,
        salaryMax: job.salary_max,
        salaryCurrency: job.salary_currency,
        requiredSkills: job.required_skills || [],
        matchScore: job.match_score,
        skillGaps: job.skill_gaps || [],
        createdAt: job.created_at,
        updatedAt: job.updated_at,
      }));

      setJobs(formattedJobs);
    } catch (err) {
      console.error('Error fetching top job recommendations:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch top job recommendations'));
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, [userId, limit]);

  useEffect(() => {
    fetchTopJobs();
  }, [fetchTopJobs]);

  return {
    jobs,
    loading,
    error,
    refetch: fetchTopJobs,
  };
}

/**
 * Hook to fetch job recommendations with sorting
 * @param userId - User ID to fetch recommendations for
 * @param sortBy - Field to sort by ('matchScore' | 'salary' | 'postedDate')
 * @param sortOrder - Sort order ('asc' | 'desc')
 * @returns Sorted job recommendations, loading state, error, and refetch function
 */
export function useSortedJobRecommendations(
  userId: string | null,
  sortBy: 'matchScore' | 'salary' | 'postedDate' = 'matchScore',
  sortOrder: 'asc' | 'desc' = 'desc'
): UseJobRecommendationsResult {
  const [jobs, setJobs] = useState<JobRecommendationData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchSortedJobs = useCallback(async () => {
    if (!userId) {
      setJobs([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const jobRecommendationsService = new JobRecommendationsService();
      const recommendations = await jobRecommendationsService.getJobRecommendations(userId);

      const formattedJobs = recommendations.map((job) => ({
        id: job.id,
        userId: job.user_id,
        jobId: job.job_id,
        title: job.title,
        company: job.company,
        location: job.location,
        salaryMin: job.salary_min,
        salaryMax: job.salary_max,
        salaryCurrency: job.salary_currency,
        requiredSkills: job.required_skills || [],
        matchScore: job.match_score,
        skillGaps: job.skill_gaps || [],
        createdAt: job.created_at,
        updatedAt: job.updated_at,
      }));

      // Sort the jobs
      const sortedJobs = [...formattedJobs].sort((a, b) => {
        let compareValue = 0;

        switch (sortBy) {
          case 'matchScore':
            compareValue = a.matchScore - b.matchScore;
            break;
          case 'salary':
            compareValue = a.salaryMax - b.salaryMax;
            break;
          case 'postedDate':
            compareValue = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            break;
        }

        return sortOrder === 'asc' ? compareValue : -compareValue;
      });

      setJobs(sortedJobs);
    } catch (err) {
      console.error('Error fetching sorted job recommendations:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch sorted job recommendations'));
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, [userId, sortBy, sortOrder]);

  useEffect(() => {
    fetchSortedJobs();
  }, [fetchSortedJobs]);

  return {
    jobs,
    loading,
    error,
    refetch: fetchSortedJobs,
  };
}
