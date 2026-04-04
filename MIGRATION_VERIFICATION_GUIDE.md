# Database Migration Verification Guide

## Task 9 Checkpoint: Verify Database Migrations and Core Services

This guide provides step-by-step instructions for running and verifying the 6 new database migrations for the AI Resume Intelligence Platform upgrade.

---

## Migration Files Overview

We have created 6 new migration files that add comprehensive database support for AI-powered resume intelligence:

1. **004_create_skill_database_table.sql** - Comprehensive skill database with metadata
2. **005_create_resume_scores_table.sql** - Resume scoring results with component breakdowns
3. **006_create_section_analyses_table.sql** - Resume section analysis with quality scores
4. **007_create_trending_skills_table.sql** - Trending skills with market demand metrics
5. **008_create_job_recommendations_table.sql** - Personalized job recommendations
6. **009_create_skill_matches_table.sql** - Skill matching results

---

## Step 1: Run Migrations in Supabase

### Instructions:

1. **Open Supabase Dashboard**
   - Go to https://supabase.com/dashboard
   - Select your project: "Next Step Career AI"

2. **Navigate to SQL Editor**
   - Click "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Run Each Migration (in order)**

   **Migration 1: Skill Database Table**
   ```sql
   -- Copy and paste contents of: supabase/migrations/004_create_skill_database_table.sql
   -- Then click "Run" or press Ctrl+Enter
   ```

   **Migration 2: Resume Scores Table**
   ```sql
   -- Copy and paste contents of: supabase/migrations/005_create_resume_scores_table.sql
   -- Then click "Run"
   ```

   **Migration 3: Section Analyses Table**
   ```sql
   -- Copy and paste contents of: supabase/migrations/006_create_section_analyses_table.sql
   -- Then click "Run"
   ```

   **Migration 4: Trending Skills Table**
   ```sql
   -- Copy and paste contents of: supabase/migrations/007_create_trending_skills_table.sql
   -- Then click "Run"
   ```

   **Migration 5: Job Recommendations Table**
   ```sql
   -- Copy and paste contents of: supabase/migrations/008_create_job_recommendations_table.sql
   -- Then click "Run"
   ```

   **Migration 6: Skill Matches Table**
   ```sql
   -- Copy and paste contents of: supabase/migrations/009_create_skill_matches_table.sql
   -- Then click "Run"
   ```

4. **Verify Success**
   - Each migration should show "Success. No rows returned"
   - If you see any errors, check the error message and fix before proceeding

---

## Step 2: Verify Table Creation

### Instructions:

1. **Navigate to Table Editor**
   - Click "Table Editor" in the left sidebar

2. **Verify All 6 New Tables Exist**
   - [ ] `skill_database`
   - [ ] `resume_scores`
   - [ ] `section_analyses`
   - [ ] `trending_skills`
   - [ ] `job_recommendations`
   - [ ] `skill_matches`

3. **Check Table Structure**
   
   For each table, click on it and verify:
   - All columns are present
   - Data types are correct
   - Constraints are applied (CHECK, UNIQUE, FOREIGN KEY)
   - Indexes are created

---

## Step 3: Verify Row Level Security (RLS)

### Instructions:

1. **Navigate to Authentication > Policies**
   - Click "Authentication" in the left sidebar
   - Click "Policies" tab

2. **Verify RLS Policies for Each Table**

   **skill_database:**
   - [ ] "Allow authenticated users to read skill_database" (SELECT)
   - [ ] "Allow service role to manage skill_database" (ALL)

   **resume_scores:**
   - [ ] "Users can read own resume_scores" (SELECT)
   - [ ] "Users can insert own resume_scores" (INSERT)
   - [ ] "Users can update own resume_scores" (UPDATE)
   - [ ] "Users can delete own resume_scores" (DELETE)

   **section_analyses:**
   - [ ] "Users can read own section_analyses" (SELECT)
   - [ ] "Users can insert own section_analyses" (INSERT)
   - [ ] "Users can update own section_analyses" (UPDATE)
   - [ ] "Users can delete own section_analyses" (DELETE)

   **trending_skills:**
   - [ ] "Allow authenticated users to read trending_skills" (SELECT)
   - [ ] "Allow service role to manage trending_skills" (ALL)

   **job_recommendations:**
   - [ ] "Users can read own job_recommendations" (SELECT)
   - [ ] "Users can insert own job_recommendations" (INSERT)
   - [ ] "Users can update own job_recommendations" (UPDATE)
   - [ ] "Users can delete own job_recommendations" (DELETE)

   **skill_matches:**
   - [ ] "Users can read own skill_matches" (SELECT)
   - [ ] "Users can insert own skill_matches" (INSERT)
   - [ ] "Users can update own skill_matches" (UPDATE)
   - [ ] "Users can delete own skill_matches" (DELETE)

---

## Step 4: Verify Indexes

### Instructions:

Run this query in SQL Editor to verify all indexes were created:

```sql
SELECT 
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename IN (
    'skill_database',
    'resume_scores',
    'section_analyses',
    'trending_skills',
    'job_recommendations',
    'skill_matches'
  )
ORDER BY tablename, indexname;
```

**Expected Indexes:**

**skill_database (4 indexes):**
- idx_skill_database_role
- idx_skill_database_skill_name
- idx_skill_database_demand_level
- idx_skill_database_importance

**resume_scores (5 indexes):**
- idx_resume_scores_user_id
- idx_resume_scores_resume_analysis_id
- idx_resume_scores_created_at
- idx_resume_scores_total_score
- idx_resume_scores_quality_flag

**section_analyses (4 indexes):**
- idx_section_analyses_user_id
- idx_section_analyses_resume_analysis_id
- idx_section_analyses_created_at
- idx_section_analyses_completeness

**trending_skills (6 indexes):**
- idx_trending_skills_skill_name
- idx_trending_skills_target_role
- idx_trending_skills_demand_score
- idx_trending_skills_trend_direction
- idx_trending_skills_growth_rate
- idx_trending_skills_period_end

**job_recommendations (6 indexes):**
- idx_job_recommendations_user_id
- idx_job_recommendations_job_id
- idx_job_recommendations_match_score
- idx_job_recommendations_company
- idx_job_recommendations_location
- idx_job_recommendations_created_at

**skill_matches (7 indexes):**
- idx_skill_matches_user_id
- idx_skill_matches_resume_analysis_id
- idx_skill_matches_target_role
- idx_skill_matches_match_score
- idx_skill_matches_weighted_match_score
- idx_skill_matches_match_quality
- idx_skill_matches_created_at

---

## Step 5: Verify Triggers

### Instructions:

Run this query in SQL Editor to verify triggers were created:

```sql
SELECT 
  trigger_name,
  event_object_table,
  action_timing,
  event_manipulation
FROM information_schema.triggers
WHERE event_object_schema = 'public'
  AND event_object_table IN (
    'skill_database',
    'trending_skills',
    'job_recommendations'
  )
ORDER BY event_object_table, trigger_name;
```

**Expected Triggers:**

- **skill_database_updated_at** on skill_database (BEFORE UPDATE)
- **trending_skills_updated_at** on trending_skills (BEFORE UPDATE)
- **job_recommendations_updated_at** on job_recommendations (BEFORE UPDATE)

---

## Step 6: Test Basic CRUD Operations

### Instructions:

Run these test queries in SQL Editor to verify basic operations work:

### Test 1: Insert into skill_database

```sql
-- Insert test skill
INSERT INTO skill_database (role, skill_name, category, demand_level, importance, aliases, related_skills)
VALUES (
  'Software Developer',
  'TypeScript',
  'Programming Languages',
  'high',
  'critical',
  ARRAY['TS'],
  ARRAY['JavaScript', 'Node.js']
);

-- Verify insert
SELECT * FROM skill_database WHERE skill_name = 'TypeScript';

-- Clean up
DELETE FROM skill_database WHERE skill_name = 'TypeScript';
```

### Test 2: Verify Foreign Key Relationships

```sql
-- Check foreign key constraints
SELECT
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_name IN (
    'resume_scores',
    'section_analyses',
    'job_recommendations',
    'skill_matches'
  )
ORDER BY tc.table_name;
```

**Expected Foreign Keys:**

- **resume_scores:** user_id → auth.users(id), resume_analysis_id → resume_analyses(id)
- **section_analyses:** user_id → auth.users(id), resume_analysis_id → resume_analyses(id)
- **job_recommendations:** user_id → auth.users(id)
- **skill_matches:** user_id → auth.users(id), resume_analysis_id → resume_analyses(id)

---

## Step 7: Verify TypeScript Services

### Instructions:

The following TypeScript services have been created and are ready to use:

1. **skillDatabase.service.ts** - Skill database operations
2. **skillMatch.service.ts** - Skill matching operations
3. **resumeScore.service.ts** - Resume scoring operations
4. **sectionAnalysis.service.ts** - Section analysis operations
5. **trendingSkills.service.ts** - Trending skills operations
6. **jobRecommendations.service.ts** - Job recommendations operations

### Verify Services Compile:

```bash
npm run build
```

Expected: No TypeScript errors

---

## Step 8: Verify AI Modules

### Instructions:

The following AI modules have been created:

1. **resumeParser.ts** - Multi-format resume parsing (PDF, DOC, DOCX)
2. **skillExtractor.ts** - NLP-based skill extraction
3. **roleDetector.ts** - Target role detection
4. **skillMatcher.ts** - Skill matching with weighted scoring
5. **resumeScorer.ts** - Resume scoring with component breakdown
6. **sectionAnalyzer.ts** - Section analysis with quality scoring
7. **trendingSkills.ts** - Trending skills intelligence
8. **jobRecommender.ts** - Job recommendation generation

### Verify Modules Compile:

```bash
npm run build
```

Expected: No TypeScript errors

---

## Checkpoint Completion Criteria

✅ **All 6 migrations run successfully**
✅ **All 6 tables created with correct structure**
✅ **All RLS policies created and enabled**
✅ **All indexes created for performance**
✅ **All triggers created for updated_at columns**
✅ **Foreign key relationships verified**
✅ **Basic CRUD operations work**
✅ **TypeScript services compile without errors**
✅ **AI modules compile without errors**

---

## Next Steps

After completing this checkpoint:

1. **Task 10:** Upgrade analytics dashboard with new visualizations
2. **Task 11:** Create job recommendations page
3. **Task 12:** Integrate AI modules with existing services
4. **Task 13:** Implement performance optimizations
5. **Task 14:** Update UI components for resume upload flow

---

## Troubleshooting

### Issue: Migration fails with "relation already exists"

**Solution:** The table was already created. You can either:
- Skip this migration
- Drop the table first: `DROP TABLE IF EXISTS table_name CASCADE;`

### Issue: RLS policy creation fails

**Solution:** Check if policy already exists:
```sql
SELECT * FROM pg_policies WHERE tablename = 'your_table_name';
```

### Issue: Foreign key constraint fails

**Solution:** Verify the referenced table exists:
```sql
SELECT * FROM information_schema.tables WHERE table_name = 'referenced_table';
```

### Issue: TypeScript compilation errors

**Solution:** Run `npm install` to ensure all dependencies are installed:
```bash
npm install
```

---

## Summary

This checkpoint verifies that:
- Database schema is correctly set up
- All tables, indexes, triggers, and policies are in place
- TypeScript services and AI modules are ready to use
- System is ready for UI integration and testing

**Status:** Ready to proceed to Task 10 (Analytics Dashboard Upgrade)
