# Implementation Plan: AI Resume Intelligence Platform

## Overview

This implementation plan upgrades the existing "Next Step Career AI" project into a comprehensive AI-powered Resume Intelligence Platform. The upgrade adds advanced resume parsing, skill matching, scoring, market intelligence, and job recommendations while maintaining full backward compatibility with existing features (file upload, ML integration, analytics dashboard, and authentication).

The implementation follows a modular architecture with clear separation of concerns, organized into AI modules, data structures, services, and UI components. All new features integrate seamlessly with the existing Supabase infrastructure and authentication system.

## Tasks

- [x] 1. Set up AI module infrastructure and data structures
  - [x] 1.1 Create /src/ai directory structure with subdirectories for parser, matcher, scorer, analyzer
    - Create /src/ai/parser for resume parsing logic
    - Create /src/ai/matcher for skill matching algorithms
    - Create /src/ai/scorer for resume scoring logic
    - Create /src/ai/analyzer for section analysis
    - Create /src/ai/types.ts for shared TypeScript interfaces
    - _Requirements: 11.1_

  - [x] 1.2 Create /src/data directory with skill database files
    - Create /src/data/skills directory for role-based skill data
    - Create skill data files for software_developer, aiml_engineer, data_scientist, devops_engineer, product_manager
    - Include at least 50 skills per role with metadata (demand level, category, related skills)
    - _Requirements: 2.1, 2.2, 2.8_

  - [x] 1.3 Define core TypeScript interfaces in /src/ai/types.ts
    - Define ParsedResume interface (text, skills, sections, targetRole)
    - Define SkillMatch interface (matchedSkills, missingSkills, matchScore)
    - Define ResumeScore interface (totalScore, componentScores, breakdown)
    - Define SectionAnalysis interface (sections, quality, recommendations)
    - Define TrendingSkill interface (skill, demandScore, trend, growthRate)
    - Define JobRecommendation interface (jobId, title, company, matchScore, skillGaps)
    - _Requirements: 11.8_

- [x] 2. Implement resume parser with multi-format support
  - [x] 2.1 Create resume parser service in /src/ai/parser/resumeParser.ts
    - Implement parseResume function accepting File object
    - Add PDF parsing using pdf-parse library
    - Add DOC/DOCX parsing using mammoth library
    - Handle file type detection and routing
    - Return ParsedResume with extracted text
    - Include error handling for corrupted files
    - _Requirements: 1.1, 1.2, 1.3, 1.6, 1.9, 1.10_

  - [x]* 2.2 Write unit tests for resume parser
    - Test PDF extraction accuracy
    - Test DOC/DOCX extraction accuracy
    - Test error handling for corrupted files
    - Test file type detection
    - _Requirements: 1.1, 1.2, 1.3_

  - [x] 2.3 Create skill extraction module in /src/ai/parser/skillExtractor.ts
    - Implement extractSkills function using natural and compromise libraries
    - Use NLP to identify technical skills, tools, frameworks, languages
    - Match extracted text against skill database
    - Return array of identified skills with confidence scores
    - _Requirements: 1.4, 1.11_

  - [x]* 2.4 Write unit tests for skill extraction
    - Test skill identification accuracy
    - Test handling of skill variations (e.g., "JS" vs "JavaScript")
    - Test confidence scoring
    - _Requirements: 1.4_

  - [x] 2.5 Create target role detection module in /src/ai/parser/roleDetector.ts
    - Implement detectTargetRole function analyzing resume content
    - Use keyword matching and NLP to identify role indicators
    - Return detected role with confidence score
    - Support roles: software_developer, aiml_engineer, data_scientist, devops_engineer, product_manager
    - _Requirements: 1.5_

- [x] 3. Build skill match engine with scoring algorithms
  - [x] 3.1 Create skill database service in /src/services/skillDatabase.service.ts
    - Implement getSkillsByRole function querying Supabase
    - Implement addSkillsForRole function for new roles
    - Implement updateSkillMetadata function
    - Cache skill data for performance (100ms query requirement)
    - _Requirements: 2.1, 2.3, 2.4, 2.5, 2.6, 2.7_

  - [x] 3.2 Create skill matcher in /src/ai/matcher/skillMatcher.ts
    - Implement calculateSkillMatch function
    - Compare user skills against role requirements
    - Apply importance weights: critical (2x), important (1.5x), nice-to-have (1x)
    - Calculate match percentage: (weighted_matched / weighted_total) * 100
    - Identify matched skills and missing skills
    - Return results within 200ms
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7_

  - [x]* 3.3 Write unit tests for skill matcher
    - Test match score calculation with various skill sets
    - Test importance weighting logic
    - Test edge cases (no skills, all skills matched)
    - Verify 200ms performance requirement
    - _Requirements: 3.1, 3.5, 3.6, 3.7_

  - [x] 3.4 Create match results service in /src/services/skillMatch.service.ts
    - Implement saveSkillMatch function storing results in Supabase
    - Implement getSkillMatchHistory function for user
    - Implement getSkillMatchById function
    - _Requirements: 3.8_

- [x] 4. Implement resume score generator with weighted components
  - [x] 4.1 Create resume scorer in /src/ai/scorer/resumeScorer.ts
    - Implement calculateResumeScore function
    - Calculate skills component score (40% weight)
    - Calculate projects component score (25% weight)
    - Calculate experience component score (20% weight)
    - Calculate education component score (15% weight)
    - Combine weighted scores into final score (0-100)
    - Provide component-level breakdown
    - Flag score quality: <60 needs improvement, 60-80 competitive, >80 excellent
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 4.9, 4.10, 4.11_

  - [x]* 4.2 Write unit tests for resume scorer
    - Test component score calculations
    - Test weighted combination logic
    - Test score quality flagging
    - Test edge cases (missing components)
    - _Requirements: 4.1, 4.6, 4.9, 4.10, 4.11_

  - [x] 4.3 Create score history service in /src/services/resumeScore.service.ts
    - Implement saveResumeScore function storing scores in Supabase
    - Implement getScoreHistory function for trend analysis
    - Implement getLatestScore function
    - _Requirements: 4.12_

- [x] 5. Create section analyzer with NLP
  - [x] 5.1 Implement section analyzer in /src/ai/analyzer/sectionAnalyzer.ts
    - Implement analyzeSections function using NLP
    - Detect sections: skills, projects, experience, education, certifications
    - Handle section name variations ("Work Experience" vs "Professional Experience")
    - Extract section content
    - Analyze section quality (content length, keyword presence)
    - Flag missing required sections
    - Provide improvement recommendations
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8, 5.9, 5.10, 5.11_

  - [x]* 5.2 Write unit tests for section analyzer
    - Test section detection accuracy
    - Test handling of section name variations
    - Test quality analysis logic
    - Test recommendation generation
    - _Requirements: 5.1, 5.8, 5.9, 5.11_

  - [x] 5.3 Create section analysis service in /src/services/sectionAnalysis.service.ts
    - Implement saveSectionAnalysis function
    - Implement getSectionAnalysisHistory function
    - _Requirements: 10.1_

- [x] 6. Build trending skills intelligence engine
  - [x] 6.1 Create trending skills analyzer in /src/ai/analyzer/trendingSkills.ts
    - Implement getTrendingSkills function
    - Calculate trend based on recent resume analyses and job postings
    - Rank skills by market demand score
    - Indicate trend direction: rising, stable, declining
    - Calculate trend percentage change
    - Return top 20 skills for specified role or all roles
    - _Requirements: 6.1, 6.2, 6.3, 6.5, 6.6, 6.7_

  - [x] 6.2 Create trending skills service in /src/services/trendingSkills.service.ts
    - Implement updateTrendingSkills function (weekly update)
    - Implement getTrendingSkillsByRole function
    - Implement storeTrendingData function in Supabase
    - Integrate with existing analytics service
    - _Requirements: 6.4, 6.8, 6.9_

  - [x]* 6.3 Write unit tests for trending skills engine
    - Test trend calculation logic
    - Test ranking algorithm
    - Test trend direction determination
    - _Requirements: 6.1, 6.2, 6.3_

- [x] 7. Implement job recommendation system
  - [x] 7.1 Create job recommender in /src/ai/matcher/jobRecommender.ts
    - Implement generateJobRecommendations function
    - Calculate match score between user skills and job requirements
    - Rank recommendations by match score (descending)
    - Filter out jobs with match score < 50%
    - Identify skill gaps for each job
    - Generate at least 10 recommendations
    - Include job metadata: title, company, location, salary_range, required_skills
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 7.10_

  - [x] 7.2 Create job recommendations service in /src/services/jobRecommendations.service.ts
    - Implement saveJobRecommendations function in Supabase
    - Implement getJobRecommendations function with filtering (location, salary, experience)
    - Implement updateRecommendations function when profile changes
    - _Requirements: 7.8, 7.9, 7.10_

  - [x]* 7.3 Write unit tests for job recommender
    - Test match score calculation
    - Test ranking logic
    - Test filtering by match threshold
    - Test skill gap identification
    - _Requirements: 7.2, 7.3, 7.6, 7.7_

- [x] 8. Create Supabase schema migrations for new tables
  - [x] 8.1 Create migration for skill_database table
    - Create table with columns: id, skill_name, target_role, demand_level, category, related_skills, metadata, created_at, updated_at
    - Add indexes on skill_name and target_role
    - Add row-level security policies
    - _Requirements: 2.7, 10.1, 10.7, 10.8_

  - [x] 8.2 Create migration for resume_scores table
    - Create table with columns: id, user_id, analysis_id, total_score, skills_score, projects_score, experience_score, education_score, score_breakdown, quality_flag, created_at
    - Add foreign key to user_profiles and resume_analyses
    - Add indexes on user_id and created_at
    - Add row-level security policies
    - _Requirements: 4.12, 10.1, 10.6, 10.7, 10.8_

  - [x] 8.3 Create migration for section_analyses table
    - Create table with columns: id, user_id, analysis_id, detected_sections, missing_sections, section_quality, recommendations, created_at
    - Add foreign key to user_profiles and resume_analyses
    - Add indexes on user_id
    - Add row-level security policies
    - _Requirements: 10.1, 10.6, 10.7, 10.8_

  - [x] 8.4 Create migration for trending_skills table
    - Create table with columns: id, skill_name, target_role, demand_score, trend_direction, growth_rate, period_start, period_end, created_at, updated_at
    - Add indexes on skill_name, target_role, and period_end
    - Add row-level security policies
    - _Requirements: 6.8, 10.1, 10.7, 10.8_

  - [x] 8.5 Create migration for job_recommendations table
    - Create table with columns: id, user_id, job_id, title, company, location, salary_range, required_skills, match_score, skill_gaps, created_at, updated_at
    - Add foreign key to user_profiles
    - Add indexes on user_id, match_score, and created_at
    - Add row-level security policies
    - _Requirements: 7.8, 10.1, 10.6, 10.7, 10.8_

  - [x] 8.6 Create migration for skill_matches table
    - Create table with columns: id, user_id, analysis_id, target_role, matched_skills, missing_skills, match_score, created_at
    - Add foreign key to user_profiles and resume_analyses
    - Add indexes on user_id and target_role
    - Add row-level security policies
    - _Requirements: 3.8, 10.1, 10.6, 10.7, 10.8_

- [x] 9. Checkpoint - Verify database migrations and core services
  - Ensure all migrations run successfully
  - Verify table creation and relationships
  - Test basic CRUD operations on new tables
  - Ensure all tests pass, ask the user if questions arise

- [x] 10. Upgrade analytics dashboard with new visualizations
  - [x] 10.1 Extend AnalyticsDashboard component in /src/components/AnalyticsDashboard.tsx
    - Add resume score gauge/progress indicator using Recharts
    - Add skill match percentage display
    - Add bar chart for component scores (skills, projects, experience, education)
    - Add pie chart for skill distribution by category
    - Add line chart for score improvement over time
    - Preserve existing analytics functionality
    - Ensure responsive design for mobile
    - Load all data within 2 seconds
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.8, 8.9, 8.10, 8.11, 8.12_

  - [x] 10.2 Create MissingSkills component in /src/components/analytics/MissingSkills.tsx
    - Display list of missing skills with priority indicators
    - Show skill importance (critical, important, nice-to-have)
    - Provide learning resource links
    - _Requirements: 8.6_

  - [x] 10.3 Create TrendingSkills component in /src/components/analytics/TrendingSkills.tsx
    - Display trending skills for user's target role
    - Show trend direction indicators (rising, stable, declining)
    - Show demand scores and growth rates
    - _Requirements: 8.7_

  - [x] 10.4 Update analytics service integration
    - Extend existing analytics.service.ts with new data fetching methods
    - Add getResumeScoreData function
    - Add getSkillMatchData function
    - Add getComponentScoresData function
    - Maintain backward compatibility with existing methods
    - _Requirements: 8.12, 15.1, 15.5_

- [x] 11. Create job recommendations page
  - [x] 11.1 Create JobRecommendationsPage component in /src/pages/JobRecommendationsPage.tsx
    - Display recommended jobs in card layout
    - Show match score for each job
    - Display skill gap analysis per job
    - Implement filtering by match score threshold
    - Implement sorting by match score, salary, posting date
    - Add to main navigation menu
    - Maintain consistent styling with existing UI
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.9, 9.10_

  - [x] 11.2 Create JobCard component in /src/components/jobs/JobCard.tsx
    - Display job title, company, location, salary range
    - Show match score with visual indicator
    - Highlight matched skills in green
    - Highlight missing skills in red
    - Add "Apply" and "Save" action buttons
    - _Requirements: 9.2, 9.7, 9.8_

  - [x] 11.3 Create JobDetails modal component in /src/components/jobs/JobDetails.tsx
    - Show detailed job information when card is clicked
    - Display full job description
    - Show complete skill requirements
    - Show detailed gap analysis
    - _Requirements: 9.6_

  - [x] 11.4 Add job recommendations route to App.tsx
    - Add route for /job-recommendations
    - Update navigation to include new page
    - Ensure authentication protection
    - _Requirements: 9.9, 10.3_

- [x] 12. Integrate AI modules with existing services
  - [x] 12.1 Update resumeAnalysis.service.ts to use new AI modules
    - Integrate resume parser in saveResumeAnalysis
    - Call skill extractor after parsing
    - Call target role detector
    - Store parsed data in existing resume_analyses table
    - Maintain existing service interface
    - _Requirements: 10.4, 15.1, 15.4_

  - [x] 12.2 Create orchestration service in /src/services/resumeIntelligence.service.ts
    - Implement analyzeResume function orchestrating all AI modules
    - Call parser → skill extractor → role detector → skill matcher → scorer → section analyzer
    - Store results in appropriate tables
    - Return comprehensive analysis result
    - Handle errors gracefully with user-friendly messages
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5_

  - [x] 12.3 Add loading states and progress indicators
    - Create LoadingIndicator component for long-running operations
    - Add progress tracking for multi-step analysis
    - Display success messages on completion
    - Use toast notifications for non-blocking feedback
    - _Requirements: 13.6, 13.7, 13.8, 13.9_

  - [x] 12.4 Implement error handling and logging
    - Add try-catch blocks in all service methods
    - Log errors to audit log service
    - Display user-friendly error messages
    - Maintain application stability on errors
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5, 13.9_

- [x] 13. Implement performance optimizations
  - [x] 13.1 Add caching layer for skill database
    - Implement in-memory cache for frequently accessed skills
    - Cache skill data for 1 hour
    - Invalidate cache on updates
    - _Requirements: 2.5, 14.7_

  - [x] 13.2 Optimize database queries
    - Add database indexes for common queries
    - Use select() to fetch only required columns
    - Implement pagination for large result sets
    - _Requirements: 14.8, 14.9_

  - [x] 13.3 Add concurrent processing support
    - Use Promise.all for independent operations
    - Process multiple resume sections in parallel
    - _Requirements: 14.6_

  - [x]* 13.4 Write performance tests
    - Test 5-page resume parsing completes within 3 seconds
    - Test skill match calculation completes within 200ms
    - Test resume score generation completes within 500ms
    - Test dashboard load time within 2 seconds
    - Test job recommendations load within 1 second
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5_

- [x] 14. Update UI components for resume upload flow
  - [x] 14.1 Update ResumeUploader component in /src/components/ResumeUploader.tsx
    - Add support for DOC and DOCX file types
    - Show upload progress indicator
    - Display parsing status
    - Show extracted skills preview
    - Maintain existing PDF upload functionality
    - _Requirements: 1.1, 1.2, 1.3, 15.3_

  - [x] 14.2 Update PlacementAnalyzer component in /src/components/PlacementAnalyzer.tsx
    - Integrate new resume intelligence features
    - Display resume score prominently
    - Show skill match results
    - Display section analysis results
    - Maintain existing placement prediction functionality
    - _Requirements: 15.3, 15.7_

  - [x] 14.3 Update AnalysisResults component in /src/components/AnalysisResults.tsx
    - Add resume score display
    - Add skill match visualization
    - Add section quality indicators
    - Add trending skills section
    - Maintain existing analysis result display
    - _Requirements: 15.3_

- [x] 15. Implement round-trip validation for parser
  - [x] 15.1 Create pretty printer in /src/ai/parser/prettyPrinter.ts
    - Implement formatParsedResume function
    - Convert ParsedResume back to readable text format
    - Preserve all extracted information
    - _Requirements: 12.1, 12.2_

  - [x]* 15.2 Create round-trip validation tests
    - Test parse → print → parse produces equivalent data
    - Verify 98% data preservation
    - Log any data loss or corruption
    - Flag resumes failing validation for manual review
    - _Requirements: 12.3, 12.4, 12.5, 12.6, 12.7_

- [x] 16. Populate skill database with initial data
  - [x] 16.1 Create seed data for software_developer role
    - Add 50+ skills with metadata
    - Include technical skills, frameworks, languages, tools
    - Set demand levels and categories
    - _Requirements: 2.2_

  - [x] 16.2 Create seed data for aiml_engineer role
    - Add 50+ skills with metadata
    - Include ML frameworks, algorithms, tools
    - Set demand levels and categories
    - _Requirements: 2.2_

  - [x] 16.3 Create seed data for data_scientist role
    - Add 50+ skills with metadata
    - Include data tools, statistics, visualization
    - Set demand levels and categories
    - _Requirements: 2.2_

  - [x] 16.4 Create seed data for devops_engineer role
    - Add 50+ skills with metadata
    - Include cloud platforms, CI/CD, containers
    - Set demand levels and categories
    - _Requirements: 2.2_

  - [x] 16.5 Create seed data for product_manager role
    - Add 50+ skills with metadata
    - Include product tools, methodologies, soft skills
    - Set demand levels and categories
    - _Requirements: 2.2_

  - [x] 16.6 Create database seeding script
    - Implement script to populate skill_database table
    - Run seed script as part of migration
    - _Requirements: 2.1, 2.7_

- [x] 17. Create custom hooks for data fetching
  - [x] 17.1 Create useResumeScore hook in /src/hooks/useResumeScore.ts
    - Fetch resume score data for user
    - Handle loading and error states
    - Provide refetch function
    - _Requirements: 11.4_

  - [x] 17.2 Create useSkillMatch hook in /src/hooks/useSkillMatch.ts
    - Fetch skill match data for user
    - Handle loading and error states
    - Provide refetch function
    - _Requirements: 11.4_

  - [x] 17.3 Create useJobRecommendations hook in /src/hooks/useJobRecommendations.ts
    - Fetch job recommendations for user
    - Support filtering and sorting
    - Handle loading and error states
    - Provide refetch function
    - _Requirements: 11.4_

  - [x] 17.4 Create useTrendingSkills hook in /src/hooks/useTrendingSkills.ts
    - Fetch trending skills for role
    - Handle loading and error states
    - Provide refetch function
    - _Requirements: 11.4_

- [x] 18. Add utility functions for data processing
  - [x] 18.1 Create skill utilities in /src/utils/skillUtils.ts
    - Implement normalizeSkillName function (handle variations)
    - Implement categorizeSkills function
    - Implement calculateSkillImportance function
    - _Requirements: 11.6_

  - [x] 18.2 Create score utilities in /src/utils/scoreUtils.ts
    - Implement formatScore function
    - Implement getScoreColor function (for visual indicators)
    - Implement compareScores function
    - _Requirements: 11.6_

  - [x] 18.3 Create validation utilities in /src/utils/validationUtils.ts
    - Implement validateResumeFile function
    - Implement validateSkillData function
    - Implement validateJobData function
    - _Requirements: 11.6_

- [x] 19. Checkpoint - Integration testing and validation
  - Test complete resume upload and analysis flow
  - Verify all AI modules work together correctly
  - Test analytics dashboard with new data
  - Test job recommendations page
  - Verify backward compatibility with existing features
  - Ensure all tests pass, ask the user if questions arise

- [x] 20. Add JSDoc documentation
  - [x] 20.1 Document AI module functions
    - Add JSDoc comments to all parser functions
    - Add JSDoc comments to all matcher functions
    - Add JSDoc comments to all scorer functions
    - Add JSDoc comments to all analyzer functions
    - _Requirements: 11.10_

  - [x] 20.2 Document service functions
    - Add JSDoc comments to skillDatabase.service.ts
    - Add JSDoc comments to skillMatch.service.ts
    - Add JSDoc comments to resumeScore.service.ts
    - Add JSDoc comments to sectionAnalysis.service.ts
    - Add JSDoc comments to trendingSkills.service.ts
    - Add JSDoc comments to jobRecommendations.service.ts
    - Add JSDoc comments to resumeIntelligence.service.ts
    - _Requirements: 11.10_

  - [x] 20.3 Document React components
    - Add JSDoc comments to all new components
    - Document props interfaces
    - Document component behavior
    - _Requirements: 11.10_

- [x] 21. Final integration and testing
  - [x] 21.1 Test complete user journey
    - Test user registration and login
    - Test resume upload (PDF, DOC, DOCX)
    - Test resume analysis and scoring
    - Test analytics dashboard display
    - Test job recommendations viewing
    - Test filtering and sorting
    - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5, 15.6, 15.7, 15.8, 15.9, 15.10_

  - [x]* 21.2 Run backward compatibility tests
    - Verify existing resume analysis works
    - Verify existing placement prediction works
    - Verify existing analytics work
    - Verify existing authentication works
    - Verify existing audit logging works
    - Verify existing model versioning works
    - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5, 15.6, 15.7, 15.8, 15.9, 15.10_

  - [x] 21.3 Verify error handling across all features
    - Test file upload errors
    - Test parsing errors
    - Test database errors
    - Test network errors
    - Verify user-friendly error messages
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5, 13.8_

  - [x]* 21.4 Performance validation
    - Verify parsing performance meets requirements
    - Verify calculation performance meets requirements
    - Verify dashboard load time meets requirements
    - Verify concurrent processing works correctly
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5, 14.6_

- [x] 22. Final checkpoint - Complete system validation
  - Ensure all features work end-to-end
  - Verify all performance requirements are met
  - Confirm backward compatibility maintained
  - Validate error handling and user feedback
  - Ensure all tests pass, ask the user if questions arise

## Notes

- Tasks marked with `*` are optional testing tasks and can be skipped for faster MVP delivery
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at key milestones
- All new features integrate with existing Supabase infrastructure
- Backward compatibility is maintained throughout implementation
- TypeScript is used for type safety across all modules
- Existing services (resumeAnalysis, placementPrediction, analytics, auth, auditLog, modelVersion) are preserved
- Performance requirements are validated through testing tasks
- Error handling and user feedback are built into each module
