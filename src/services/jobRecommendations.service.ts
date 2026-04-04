import { supabase } from '../integrations/supabase/client';
import { JobRecommendation } from '../ai/types';

/**
 * Job Recommendations Service
 * Manages job recommendations in Supabase
 */

interface JobRecommendationRow {
  id: string;
  user_id: string;
  job_id: string;
  title: string;
  company: string;
  location: string;
  salary_min: number;
  salary_max: number;
  salary_currency: string;
  required_skills: string[];
  match_score: number;
  skill_gaps: any[];
  created_at: string;
  updated_at: string;
}

export class JobRecommendationsService {
  /**
   * Save job recommendations for user
   */
  async saveJobRecommendations(
    userId: string,
    recommendations: JobRecommendation[]
  ): Promise<void> {
    try {
      const rows = recommendations.map(rec => ({
        user_id: userId,
        job_id: rec.jobId,
        title: rec.title,
        company: rec.company,
        location: rec.location,
        salary_min: rec.salaryRange.min,
        salary_max: rec.salaryRange.max,
        salary_currency: rec.salaryRange.currency,
        required_skills: rec.requiredSkills,
        match_score: rec.matchScore,
        skill_gaps: rec.skillGaps,
      }));

      const { error } = await supabase
        .from('job_recommendations')
        .upsert(rows, {
          onConflict: 'user_id,job_id',
        });

      if (error) {
        throw error;
      }

      console.log(`Saved ${rows.length} job recommendations for user ${userId}`);
    } catch (error) {
      console.error('Error saving job recommendations:', error);
      throw error;
    }
  }

  /**
   * Get job recommendations for user
   * Optimized with selective column fetching and pagination
   */
  async getJobRecommendations(
    userId: string,
    filters?: {
      location?: string;
      minSalary?: number;
      experienceLevel?: string;
      minMatchScore?: number;
      limit?: number;
      offset?: number;
    }
  ): Promise<JobRecommendationRow[]> {
    try {
      const limit = filters?.limit || 20;
      const offset = filters?.offset || 0;

      let query = supabase
        .from('job_recommendations')
        .select('id, job_id, title, company, location, salary_min, salary_max, salary_currency, required_skills, match_score, skill_gaps, created_at')
        .eq('user_id', userId)
        .order('match_score', { ascending: false })
        .range(offset, offset + limit - 1);

      // Apply filters
      if (filters?.location) {
        query = query.ilike('location', `%${filters.location}%`);
      }

      if (filters?.minSalary) {
        query = query.gte('salary_min', filters.minSalary);
      }

      if (filters?.minMatchScore) {
        query = query.gte('match_score', filters.minMatchScore);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching job recommendations:', error);
      throw error;
    }
  }

  /**
   * Get job recommendation by ID
   */
  async getJobRecommendationById(recommendationId: string): Promise<JobRecommendationRow | null> {
    try {
      const { data, error } = await supabase
        .from('job_recommendations')
        .select('*')
        .eq('id', recommendationId)
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error fetching job recommendation:', error);
      throw error;
    }
  }

  /**
   * Update recommendations when user profile changes
   */
  async updateRecommendations(
    userId: string,
    newRecommendations: JobRecommendation[]
  ): Promise<void> {
    try {
      // Delete old recommendations
      await this.deleteUserRecommendations(userId);

      // Save new recommendations
      await this.saveJobRecommendations(userId, newRecommendations);

      console.log(`Updated recommendations for user ${userId}`);
    } catch (error) {
      console.error('Error updating recommendations:', error);
      throw error;
    }
  }

  /**
   * Delete all recommendations for user
   */
  async deleteUserRecommendations(userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('job_recommendations')
        .delete()
        .eq('user_id', userId);

      if (error) {
        throw error;
      }

      console.log(`Deleted recommendations for user ${userId}`);
    } catch (error) {
      console.error('Error deleting recommendations:', error);
      throw error;
    }
  }

  /**
   * Get recommendation statistics for user
   */
  async getRecommendationStats(userId: string): Promise<{
    totalRecommendations: number;
    averageMatchScore: number;
    perfectMatches: number;
    topCompanies: string[];
  }> {
    try {
      const { data, error } = await supabase
        .from('job_recommendations')
        .select('match_score, company, skill_gaps')
        .eq('user_id', userId);

      if (error) {
        throw error;
      }

      if (!data || data.length === 0) {
        return {
          totalRecommendations: 0,
          averageMatchScore: 0,
          perfectMatches: 0,
          topCompanies: [],
        };
      }

      const totalRecommendations = data.length;
      const averageMatchScore = Math.round(
        data.reduce((sum, row) => sum + row.match_score, 0) / totalRecommendations
      );
      const perfectMatches = data.filter(row => row.skill_gaps.length === 0).length;

      // Get top companies
      const companyCounts: Record<string, number> = {};
      data.forEach(row => {
        companyCounts[row.company] = (companyCounts[row.company] || 0) + 1;
      });
      const topCompanies = Object.entries(companyCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([company]) => company);

      return {
        totalRecommendations,
        averageMatchScore,
        perfectMatches,
        topCompanies,
      };
    } catch (error) {
      console.error('Error calculating recommendation stats:', error);
      throw error;
    }
  }

  /**
   * Get top recommended jobs (highest match scores)
   */
  async getTopRecommendations(
    userId: string,
    limit: number = 5
  ): Promise<JobRecommendationRow[]> {
    try {
      const { data, error } = await supabase
        .from('job_recommendations')
        .select('*')
        .eq('user_id', userId)
        .order('match_score', { ascending: false })
        .limit(limit);

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching top recommendations:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const jobRecommendationsService = new JobRecommendationsService();
