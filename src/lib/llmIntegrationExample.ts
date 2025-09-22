/**
 * Example LLM Integration
 * 
 * This file shows how to integrate with a real LLM API (OpenAI, Anthropic, etc.)
 * Replace the mock implementation in resumeAnalysisService.ts with this approach.
 */

import { SkillAnalysis } from '@/components/SkillAnalyzerCard';

// Example with OpenAI API
export class OpenAIIntegration {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string, baseUrl: string = 'https://api.openai.com/v1') {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  async analyzeResume(resumeText: string, targetRole?: string): Promise<SkillAnalysis> {
    const systemPrompt = `You are a helpful resume analyst and career coach. Output must be valid JSON (no extra text) matching the schema specified in the user message. Also, produce a short human-friendly summary at the end (plain text) only inside the JSON fields. Prioritize actionable, prioritized feedback and signal confidence for each suggestion.`;

    const userPrompt = `
Input:
- resume_text: ${resumeText}
- target_role: ${targetRole || 'Not specified'}

Task:
Analyze the resume and return a JSON object that strictly follows the schema below. Provide:
1. Identified user_skills with a confidence score (0-1).
2. Suggested_skills (missing or recommended) prioritized and grouped by importance with short reason.
3. For each skill provide a recommended action (e.g., short resources, practice tasks, project ideas).
4. A skills breakdown mapping skill -> proficiency score (0-100) to drive charts.
5. Overall recommendations (top 5 things to improve now), and estimated impact (low/medium/high).
6. One-line elevator pitch improvement for the resume (what to write at top).
7. A short suggested keywords list for job applications for the target_role.
8. A summary_text field — a short human-friendly summary sentence.

Schema (REQUIRED JSON keys):
{
  "user_skills": [{"name":string,"confidence":number}],
  "suggested_skills": [{"name":string,"priority":"high|medium|low","reason":string,"recommended_action":string}],
  "skills_chart": [{"name":string,"score":number}],        // score 0-100
  "top_recommendations": [{"title":string,"details":string,"impact":"low|medium|high"}],
  "resume_elevator_pitch": string,
  "suggested_keywords": [string],
  "summary_text": string,
  "metadata": {"model_confidence": number}                 // 0-1 global confidence
}

Important:
- Output must be strictly valid JSON matching schema above.
- Prioritize suggestions that are actionable (examples, links, small projects).
- If target_role is provided, tailor suggestions and keywords to that role.
- Keep the number of items manageable (user_skills up to 12, suggested_skills up to 8, skills_chart up to 12, top_recommendations up to 5).
`;

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini', // or gpt-4, gpt-3.5-turbo
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.3, // Lower temperature for more consistent JSON
          max_tokens: 2000,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content;

      if (!content) {
        throw new Error('No content received from OpenAI API');
      }

      // Parse and validate JSON
      const analysis = JSON.parse(content);
      
      // Validate required fields
      this.validateAnalysis(analysis);
      
      return analysis;

    } catch (error) {
      console.error('OpenAI API error:', error);
      throw new Error(`Failed to analyze resume: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private validateAnalysis(analysis: any): asserts analysis is SkillAnalysis {
    const requiredFields = [
      'user_skills', 'suggested_skills', 'skills_chart', 
      'top_recommendations', 'resume_elevator_pitch', 
      'suggested_keywords', 'summary_text', 'metadata'
    ];

    for (const field of requiredFields) {
      if (!(field in analysis)) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    // Validate user_skills structure
    if (!Array.isArray(analysis.user_skills)) {
      throw new Error('user_skills must be an array');
    }

    for (const skill of analysis.user_skills) {
      if (!skill.name || typeof skill.confidence !== 'number') {
        throw new Error('Invalid user_skills structure');
      }
    }

    // Validate suggested_skills structure
    if (!Array.isArray(analysis.suggested_skills)) {
      throw new Error('suggested_skills must be an array');
    }

    for (const skill of analysis.suggested_skills) {
      if (!skill.name || !['high', 'medium', 'low'].includes(skill.priority)) {
        throw new Error('Invalid suggested_skills structure');
      }
    }

    // Validate skills_chart structure
    if (!Array.isArray(analysis.skills_chart)) {
      throw new Error('skills_chart must be an array');
    }

    for (const skill of analysis.skills_chart) {
      if (!skill.name || typeof skill.score !== 'number' || skill.score < 0 || skill.score > 100) {
        throw new Error('Invalid skills_chart structure');
      }
    }
  }
}

// Example with Anthropic Claude API
export class AnthropicIntegration {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string, baseUrl: string = 'https://api.anthropic.com/v1') {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  async analyzeResume(resumeText: string, targetRole?: string): Promise<SkillAnalysis> {
    const prompt = `You are a helpful resume analyst and career coach. Output must be valid JSON (no extra text) matching the schema specified below.

Input:
- resume_text: ${resumeText}
- target_role: ${targetRole || 'Not specified'}

Task:
Analyze the resume and return a JSON object that strictly follows the schema below. Provide:
1. Identified user_skills with a confidence score (0-1).
2. Suggested_skills (missing or recommended) prioritized and grouped by importance with short reason.
3. For each skill provide a recommended action (e.g., short resources, practice tasks, project ideas).
4. A skills breakdown mapping skill -> proficiency score (0-100) to drive charts.
5. Overall recommendations (top 5 things to improve now), and estimated impact (low/medium/high).
6. One-line elevator pitch improvement for the resume (what to write at top).
7. A short suggested keywords list for job applications for the target_role.
8. A summary_text field — a short human-friendly summary sentence.

Schema (REQUIRED JSON keys):
{
  "user_skills": [{"name":string,"confidence":number}],
  "suggested_skills": [{"name":string,"priority":"high|medium|low","reason":string,"recommended_action":string}],
  "skills_chart": [{"name":string,"score":number}],
  "top_recommendations": [{"title":string,"details":string,"impact":"low|medium|high"}],
  "resume_elevator_pitch": string,
  "suggested_keywords": [string],
  "summary_text": string,
  "metadata": {"model_confidence": number}
}

Important:
- Output must be strictly valid JSON matching schema above.
- Prioritize suggestions that are actionable (examples, links, small projects).
- If target_role is provided, tailor suggestions and keywords to that role.
- Keep the number of items manageable (user_skills up to 12, suggested_skills up to 8, skills_chart up to 12, top_recommendations up to 5).`;

    try {
      const response = await fetch(`${this.baseUrl}/messages`, {
        method: 'POST',
        headers: {
          'x-api-key': this.apiKey,
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-3-sonnet-20240229',
          max_tokens: 2000,
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`Anthropic API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const content = data.content[0]?.text;

      if (!content) {
        throw new Error('No content received from Anthropic API');
      }

      // Parse and validate JSON
      const analysis = JSON.parse(content);
      
      // Validate required fields (same validation as OpenAI)
      this.validateAnalysis(analysis);
      
      return analysis;

    } catch (error) {
      console.error('Anthropic API error:', error);
      throw new Error(`Failed to analyze resume: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private validateAnalysis(analysis: any): asserts analysis is SkillAnalysis {
    // Same validation logic as OpenAI integration
    const requiredFields = [
      'user_skills', 'suggested_skills', 'skills_chart', 
      'top_recommendations', 'resume_elevator_pitch', 
      'suggested_keywords', 'summary_text', 'metadata'
    ];

    for (const field of requiredFields) {
      if (!(field in analysis)) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    // Additional validation...
    if (!Array.isArray(analysis.user_skills)) {
      throw new Error('user_skills must be an array');
    }

    for (const skill of analysis.user_skills) {
      if (!skill.name || typeof skill.confidence !== 'number') {
        throw new Error('Invalid user_skills structure');
      }
    }
  }
}

// Usage example:
/*
// In your environment variables:
// VITE_OPENAI_API_KEY=your_openai_key
// VITE_ANTHROPIC_API_KEY=your_anthropic_key

// In resumeAnalysisService.ts, replace the mock implementation:

import { OpenAIIntegration } from './llmIntegrationExample';

const openai = new OpenAIIntegration(import.meta.env.VITE_OPENAI_API_KEY);

export class ResumeAnalysisService {
  static async analyzeResume(request: ResumeAnalysisRequest): Promise<SkillAnalysis> {
    try {
      const analysis = await openai.analyzeResume(
        request.resume_text, 
        request.target_role
      );
      
      // Save to database if user_id is provided
      if (request.user_id) {
        await this.saveAnalysisToDatabase(request.user_id, request, analysis);
      }
      
      return analysis;
    } catch (error) {
      console.error('LLM analysis failed:', error);
      // Fallback to mock data or show error
      throw error;
    }
  }
  
  // ... rest of the methods
}
*/
