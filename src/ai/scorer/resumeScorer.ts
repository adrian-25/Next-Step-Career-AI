import { ResumeScore, ComponentScores, ScoreBreakdown, ScoringFactors, ParsedResume, SkillMatch } from '../types';

/**
 * Resume Scorer Service
 * Calculates comprehensive resume scores with weighted components
 */

export class ResumeScorer {
  // Component weights (must sum to 100%)
  private readonly COMPONENT_WEIGHTS = {
    skills: 0.40,      // 40%
    projects: 0.25,    // 25%
    experience: 0.20,  // 20%
    education: 0.15,   // 15%
  };

  // Quality thresholds
  private readonly QUALITY_THRESHOLDS = {
    excellent: 80,
    competitive: 60,
  };

  /**
   * Calculate comprehensive resume score
   */
  calculateResumeScore(
    parsedResume: ParsedResume,
    skillMatch: SkillMatch
  ): ResumeScore {
    // Calculate component scores
    const skillsScore = this.calculateSkillsScore(skillMatch);
    const projectsScore = this.calculateProjectsScore(parsedResume);
    const experienceScore = this.calculateExperienceScore(parsedResume);
    const educationScore = this.calculateEducationScore(parsedResume);

    const componentScores: ComponentScores = {
      skillsScore,
      projectsScore,
      experienceScore,
      educationScore,
    };

    // Calculate weighted contributions
    const skillsContribution = skillsScore * this.COMPONENT_WEIGHTS.skills;
    const projectsContribution = projectsScore * this.COMPONENT_WEIGHTS.projects;
    const experienceContribution = experienceScore * this.COMPONENT_WEIGHTS.experience;
    const educationContribution = educationScore * this.COMPONENT_WEIGHTS.education;

    // Calculate total score
    const totalScore = Math.round(
      skillsContribution +
      projectsContribution +
      experienceContribution +
      educationContribution
    );

    // Calculate scoring factors
    const factors = this.calculateScoringFactors(parsedResume, skillMatch);

    // Create breakdown
    const breakdown: ScoreBreakdown = {
      skillsContribution: Math.round(skillsContribution),
      projectsContribution: Math.round(projectsContribution),
      experienceContribution: Math.round(experienceContribution),
      educationContribution: Math.round(educationContribution),
      factors,
    };

    // Determine quality flag
    const qualityFlag = this.determineQualityFlag(totalScore);

    // Generate recommendations
    const recommendations = this.generateRecommendations(
      componentScores,
      factors,
      qualityFlag
    );

    return {
      totalScore,
      componentScores,
      breakdown,
      qualityFlag,
      recommendations,
    };
  }

  /**
   * Calculate skills component score (0-100)
   */
  private calculateSkillsScore(skillMatch: SkillMatch): number {
    // Base score from weighted match
    let score = skillMatch.weightedMatchScore;

    // Bonus for skill diversity (up to +10 points)
    const totalSkills = skillMatch.matchedSkills.length + skillMatch.missingSkills.length;
    const matchedCount = skillMatch.matchedSkills.length;
    
    if (matchedCount >= 15) {
      score += 10;
    } else if (matchedCount >= 10) {
      score += 7;
    } else if (matchedCount >= 5) {
      score += 5;
    }

    // Penalty for critical missing skills (-5 points each, max -20)
    const criticalMissing = skillMatch.missingSkills.filter(
      s => s.importance === 'critical'
    ).length;
    score -= Math.min(criticalMissing * 5, 20);

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Calculate projects component score (0-100)
   */
  private calculateProjectsScore(parsedResume: ParsedResume): number {
    const projectsSection = parsedResume.sections.projects;
    
    if (!projectsSection) {
      return 0;
    }

    let score = 0;

    // Base score from section quality
    score += projectsSection.qualityScore * 0.4; // Up to 40 points

    // Content length score (up to 30 points)
    const contentLength = projectsSection.content.length;
    if (contentLength > 1000) {
      score += 30;
    } else if (contentLength > 500) {
      score += 20;
    } else if (contentLength > 200) {
      score += 10;
    }

    // Project count estimation (up to 30 points)
    const projectCount = this.estimateProjectCount(projectsSection.content);
    if (projectCount >= 5) {
      score += 30;
    } else if (projectCount >= 3) {
      score += 20;
    } else if (projectCount >= 1) {
      score += 10;
    }

    return Math.round(Math.min(100, score));
  }

  /**
   * Calculate experience component score (0-100)
   */
  private calculateExperienceScore(parsedResume: ParsedResume): number {
    const experienceSection = parsedResume.sections.experience;
    
    if (!experienceSection) {
      return 0;
    }

    let score = 0;

    // Base score from section quality
    score += experienceSection.qualityScore * 0.4; // Up to 40 points

    // Experience level score (up to 40 points)
    switch (parsedResume.experienceLevel) {
      case 'Executive':
        score += 40;
        break;
      case 'Senior Level':
        score += 35;
        break;
      case 'Mid Level':
        score += 25;
        break;
      case 'Entry Level':
        score += 15;
        break;
    }

    // Content richness (up to 20 points)
    const content = experienceSection.content.toLowerCase();
    const actionVerbs = ['developed', 'implemented', 'managed', 'led', 'created', 'designed', 'achieved', 'improved'];
    const verbCount = actionVerbs.filter(verb => content.includes(verb)).length;
    score += Math.min(verbCount * 3, 20);

    return Math.round(Math.min(100, score));
  }

  /**
   * Calculate education component score (0-100)
   */
  private calculateEducationScore(parsedResume: ParsedResume): number {
    const educationSection = parsedResume.sections.education;
    const certificationsSection = parsedResume.sections.certifications;
    
    let score = 0;

    // Education section score (up to 70 points)
    if (educationSection) {
      score += educationSection.qualityScore * 0.7;
    }

    // Certifications bonus (up to 30 points)
    if (certificationsSection) {
      const certCount = this.estimateCertificationCount(certificationsSection.content);
      if (certCount >= 5) {
        score += 30;
      } else if (certCount >= 3) {
        score += 20;
      } else if (certCount >= 1) {
        score += 10;
      }
    }

    return Math.round(Math.min(100, score));
  }

  /**
   * Calculate detailed scoring factors
   */
  private calculateScoringFactors(
    parsedResume: ParsedResume,
    skillMatch: SkillMatch
  ): ScoringFactors {
    const skillCount = skillMatch.matchedSkills.length;
    
    // Calculate skill diversity (unique categories)
    const categories = new Set(skillMatch.matchedSkills.map(s => s.category));
    const skillDiversity = Math.round((categories.size / 6) * 100); // 6 possible categories

    const projectCount = this.estimateProjectCount(
      parsedResume.sections.projects?.content || ''
    );

    const projectComplexity = this.estimateProjectComplexity(
      parsedResume.sections.projects?.content || ''
    );

    const experienceYears = this.estimateExperienceYears(parsedResume);

    const experienceRelevance = this.calculateExperienceRelevance(
      parsedResume,
      skillMatch
    );

    const educationLevel = this.calculateEducationLevel(parsedResume);

    const certificationsCount = this.estimateCertificationCount(
      parsedResume.sections.certifications?.content || ''
    );

    return {
      skillCount,
      skillDiversity,
      projectCount,
      projectComplexity,
      experienceYears,
      experienceRelevance,
      educationLevel,
      certificationsCount,
    };
  }

  /**
   * Estimate project count from content
   */
  private estimateProjectCount(content: string): number {
    if (!content) return 0;
    
    // Count bullet points or numbered items
    const bullets = (content.match(/[•\-\*]\s/g) || []).length;
    const numbers = (content.match(/^\d+\./gm) || []).length;
    
    return Math.max(bullets, numbers, 1);
  }

  /**
   * Estimate project complexity
   */
  private estimateProjectComplexity(content: string): number {
    if (!content) return 0;
    
    const complexityKeywords = [
      'architecture', 'scalable', 'distributed', 'microservices',
      'optimization', 'algorithm', 'machine learning', 'ai',
      'cloud', 'deployment', 'ci/cd', 'testing'
    ];
    
    const lowerContent = content.toLowerCase();
    const keywordCount = complexityKeywords.filter(kw => lowerContent.includes(kw)).length;
    
    return Math.round((keywordCount / complexityKeywords.length) * 100);
  }

  /**
   * Estimate years of experience
   */
  private estimateExperienceYears(parsedResume: ParsedResume): number {
    const experienceMap = {
      'Entry Level': 1,
      'Mid Level': 3,
      'Senior Level': 7,
      'Executive': 12,
    };
    
    return experienceMap[parsedResume.experienceLevel] || 0;
  }

  /**
   * Calculate experience relevance
   */
  private calculateExperienceRelevance(
    parsedResume: ParsedResume,
    skillMatch: SkillMatch
  ): number {
    const experienceContent = parsedResume.sections.experience?.content.toLowerCase() || '';
    
    if (!experienceContent) return 0;
    
    // Check how many matched skills appear in experience section
    const matchedSkillsInExperience = skillMatch.matchedSkills.filter(skill =>
      experienceContent.includes(skill.skill.toLowerCase())
    ).length;
    
    const totalMatchedSkills = skillMatch.matchedSkills.length;
    
    return totalMatchedSkills > 0
      ? Math.round((matchedSkillsInExperience / totalMatchedSkills) * 100)
      : 0;
  }

  /**
   * Calculate education level score
   */
  private calculateEducationLevel(parsedResume: ParsedResume): number {
    const educationContent = parsedResume.sections.education?.content.toLowerCase() || '';
    
    if (!educationContent) return 0;
    
    if (educationContent.includes('phd') || educationContent.includes('doctorate')) {
      return 100;
    } else if (educationContent.includes('master') || educationContent.includes('msc') || educationContent.includes('mba')) {
      return 80;
    } else if (educationContent.includes('bachelor') || educationContent.includes('bsc') || educationContent.includes('btech')) {
      return 60;
    } else if (educationContent.includes('diploma') || educationContent.includes('associate')) {
      return 40;
    }
    
    return 20;
  }

  /**
   * Estimate certification count
   */
  private estimateCertificationCount(content: string): number {
    if (!content) return 0;
    
    const bullets = (content.match(/[•\-\*]\s/g) || []).length;
    const lines = content.split('\n').filter(line => line.trim().length > 10).length;
    
    return Math.max(bullets, Math.floor(lines / 2), 0);
  }

  /**
   * Determine quality flag
   */
  private determineQualityFlag(
    totalScore: number
  ): 'excellent' | 'competitive' | 'needs_improvement' {
    if (totalScore >= this.QUALITY_THRESHOLDS.excellent) {
      return 'excellent';
    } else if (totalScore >= this.QUALITY_THRESHOLDS.competitive) {
      return 'competitive';
    } else {
      return 'needs_improvement';
    }
  }

  /**
   * Generate improvement recommendations
   */
  private generateRecommendations(
    componentScores: ComponentScores,
    factors: ScoringFactors,
    qualityFlag: string
  ): string[] {
    const recommendations: string[] = [];

    // Skills recommendations
    if (componentScores.skillsScore < 70) {
      if (factors.skillCount < 10) {
        recommendations.push('Add more relevant technical skills to your resume');
      }
      if (factors.skillDiversity < 50) {
        recommendations.push('Diversify your skill set across different categories');
      }
    }

    // Projects recommendations
    if (componentScores.projectsScore < 60) {
      if (factors.projectCount < 3) {
        recommendations.push('Include at least 3-5 significant projects');
      }
      if (factors.projectComplexity < 40) {
        recommendations.push('Highlight technical complexity and impact of your projects');
      }
    }

    // Experience recommendations
    if (componentScores.experienceScore < 60) {
      if (factors.experienceRelevance < 50) {
        recommendations.push('Emphasize relevant experience that showcases your skills');
      }
      recommendations.push('Use strong action verbs to describe your achievements');
    }

    // Education recommendations
    if (componentScores.educationScore < 50) {
      if (factors.certificationsCount === 0) {
        recommendations.push('Consider adding relevant certifications to strengthen your profile');
      }
    }

    // General recommendations based on quality
    if (qualityFlag === 'needs_improvement') {
      recommendations.push('Focus on quantifiable achievements and measurable impact');
      recommendations.push('Ensure your resume is well-structured with clear sections');
    }

    return recommendations;
  }
}

// Export singleton instance
export const resumeScorer = new ResumeScorer();
