import { supabase } from '@/integrations/supabase/client';
import { SkillAnalysis } from '@/components/SkillAnalyzerCard';

// This would typically be your actual LLM API endpoint
// For now, we'll use a mock implementation that follows the schema
const MOCK_ANALYSIS: SkillAnalysis = {
  user_skills: [
    { name: "Python", confidence: 0.92 },
    { name: "Data Analysis", confidence: 0.88 },
    { name: "Machine Learning", confidence: 0.75 },
    { name: "SQL", confidence: 0.65 },
    { name: "Pandas", confidence: 0.90 },
    { name: "React", confidence: 0.70 }
  ],
  suggested_skills: [
    {
      name: "Docker",
      priority: "high",
      reason: "Essential for modern development workflows and deployment",
      recommended_action: "Complete Docker Fundamentals course at https://www.udemy.com/course/docker-mastery/ and containerize 2-3 projects"
    },
    {
      name: "AWS",
      priority: "high", 
      reason: "Cloud skills are in high demand and can increase salary by 25%",
      recommended_action: "Start with AWS Free Tier at https://aws.amazon.com/free/, complete Solutions Architect Associate certification"
    },
    {
      name: "Kubernetes",
      priority: "medium",
      reason: "Container orchestration is becoming standard in production environments",
      recommended_action: "Learn Kubernetes basics at https://kubernetes.io/docs/tutorials/ and deploy a sample application"
    },
    {
      name: "GraphQL",
      priority: "medium",
      reason: "Modern API development skill that's growing in popularity",
      recommended_action: "Build a GraphQL API with Node.js and React frontend using https://graphql.org/learn/"
    },
    {
      name: "TypeScript",
      priority: "high",
      reason: "Type safety and better developer experience for large codebases",
      recommended_action: "Complete TypeScript course at https://www.udemy.com/course/typescript-course/ and migrate existing JavaScript projects"
    },
    {
      name: "Redis",
      priority: "low",
      reason: "Caching and session management for scalable applications",
      recommended_action: "Learn Redis basics at https://redis.io/docs/ and implement caching in your projects"
    }
  ],
  skills_chart: [
    { name: "Python", score: 85 },
    { name: "Data Analysis", score: 80 },
    { name: "Machine Learning", score: 75 },
    { name: "SQL", score: 65 },
    { name: "Pandas", score: 90 },
    { name: "React", score: 70 },
    { name: "Docker", score: 30 },
    { name: "AWS", score: 25 },
    { name: "Kubernetes", score: 15 },
    { name: "GraphQL", score: 20 }
  ],
  top_recommendations: [
    {
      title: "Add measurable achievements",
      details: "Convert job duties into quantifiable outcomes (e.g., 'reduced load time by 30%')",
      impact: "high"
    },
    {
      title: "Learn cloud technologies",
      details: "Add AWS or Azure experience to increase marketability",
      impact: "high"
    },
    {
      title: "Improve containerization skills",
      details: "Docker and Kubernetes are essential for modern development roles",
      impact: "medium"
    },
    {
      title: "Add project portfolio",
      details: "Include 3-5 key projects with live demos and GitHub links",
      impact: "medium"
    },
    {
      title: "Optimize resume keywords",
      details: "Include more industry-specific terms and technologies",
      impact: "low"
    }
  ],
  resume_elevator_pitch: "Data analyst with 3+ years building analytics pipelines and dashboards that improved decision-making and cut reporting time by 40%.",
  suggested_keywords: ["Python", "SQL", "Tableau", "ETL", "data pipeline", "Machine Learning", "AWS", "Docker"],
  summary_text: "This resume shows strong Python and analytics experience; add cloud technologies and quantify results to get more interviews for data roles.",
  metadata: {
    model_confidence: 0.86
  }
};

export interface ResumeAnalysisRequest {
  resume_text: string;
  target_role?: string;
  existing_skills?: string[];
  experience_years?: number;
  user_id?: string;
}

export class ResumeAnalysisService {
  /**
   * Analyze resume using LLM and return structured results
   * In production, this would call your actual LLM API
   */
  static async analyzeResume(request: ResumeAnalysisRequest): Promise<SkillAnalysis> {
    // TODO: Replace with actual LLM API call
    // For now, return mock data with some randomization
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API delay
    
    // Add some randomization to make it feel more realistic
    const randomizedAnalysis = this.randomizeAnalysis(MOCK_ANALYSIS);
    
    // Save analysis to database if user_id is provided
    if (request.user_id) {
      await this.saveAnalysisToDatabase(request.user_id, request, randomizedAnalysis);
    }
    
    return randomizedAnalysis;
  }

  /**
   * Save analysis results to Supabase
   */
  private static async saveAnalysisToDatabase(
    userId: string, 
    request: ResumeAnalysisRequest, 
    analysis: SkillAnalysis
  ) {
    try {
      // Save the analysis result
      const { error: analysisError } = await supabase
        .from('resume_analyses')
        .insert({
          user_id: userId,
          resume_text: request.resume_text,
          target_role: request.target_role || null,
          experience_years: request.experience_years || null,
          analysis_result: analysis
        });

      if (analysisError) {
        console.error('Error saving analysis:', analysisError);
        return;
      }

      // Save user skills
      const userSkillsData = analysis.user_skills.map(skill => ({
        user_id: userId,
        skill_name: skill.name,
        confidence: skill.confidence,
        score: analysis.skills_chart.find(s => s.name === skill.name)?.score || null
      }));

      const { error: skillsError } = await supabase
        .from('user_skills')
        .insert(userSkillsData);

      if (skillsError) {
        console.error('Error saving user skills:', skillsError);
      }

      // Save skill suggestions
      const suggestionsData = analysis.suggested_skills.map(skill => ({
        user_id: userId,
        skill_name: skill.name,
        priority: skill.priority,
        reason: skill.reason,
        recommended_action: skill.recommended_action
      }));

      const { error: suggestionsError } = await supabase
        .from('skill_suggestions')
        .insert(suggestionsData);

      if (suggestionsError) {
        console.error('Error saving skill suggestions:', suggestionsError);
      }

    } catch (error) {
      console.error('Error saving to database:', error);
    }
  }

  /**
   * Add some randomization to make mock data feel more realistic
   */
  private static randomizeAnalysis(analysis: SkillAnalysis): SkillAnalysis {
    const randomizeScore = (score: number) => {
      const variation = Math.random() * 20 - 10; // ±10 points
      return Math.max(0, Math.min(100, Math.round(score + variation)));
    };

    const randomizeConfidence = (confidence: number) => {
      const variation = (Math.random() * 0.2 - 0.1); // ±0.1
      return Math.max(0, Math.min(1, confidence + variation));
    };

    return {
      ...analysis,
      user_skills: analysis.user_skills.map(skill => ({
        ...skill,
        confidence: randomizeConfidence(skill.confidence)
      })),
      skills_chart: analysis.skills_chart.map(skill => ({
        ...skill,
        score: randomizeScore(skill.score)
      })),
      metadata: {
        model_confidence: randomizeConfidence(analysis.metadata.model_confidence)
      }
    };
  }

  /**
   * Get user's saved skills
   */
  static async getUserSkills(userId: string) {
    const { data, error } = await supabase
      .from('user_skills')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user skills:', error);
      return [];
    }

    return data || [];
  }

  /**
   * Get user's skill suggestions
   */
  static async getSkillSuggestions(userId: string) {
    const { data, error } = await supabase
      .from('skill_suggestions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching skill suggestions:', error);
      return [];
    }

    return data || [];
  }

  /**
   * Add a skill to user's profile
   */
  static async addUserSkill(userId: string, skillName: string, confidence: number = 0.5) {
    const { data, error } = await supabase
      .from('user_skills')
      .insert({
        user_id: userId,
        skill_name: skillName,
        confidence: confidence,
        score: Math.round(confidence * 100)
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding user skill:', error);
      throw error;
    }

    return data;
  }

  /**
   * Get user's recent analyses
   */
  static async getRecentAnalyses(userId: string, limit: number = 5) {
    const { data, error } = await supabase
      .from('resume_analyses')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching recent analyses:', error);
      return [];
    }

    return data || [];
  }
}
