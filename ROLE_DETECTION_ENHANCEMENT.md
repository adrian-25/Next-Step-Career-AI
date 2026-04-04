# Role Detection Enhancement

## Issue
The resume analyzer was failing during role detection with the error:
"Failed to detect target role. Please specify a target role manually."

## Solution
Enhanced the AI role detection logic in `src/ai/parser/roleDetector.ts` with comprehensive keyword-based detection for all available roles.

## Changes Made

### 1. Expanded Role Keywords
Added comprehensive keyword sets for all 5 roles in the system:

**Software Developer** (30+ keywords):
- Job titles: software developer, software engineer, full stack, frontend, backend, web developer
- Technologies: javascript, react, node, html, css, typescript, angular, vue
- Concepts: rest api, graphql, responsive design, ui development

**AI/ML Engineer** (27+ keywords):
- Job titles: ai engineer, ml engineer
- Technologies: tensorflow, pytorch, keras, scikit-learn, transformer, bert, gpt, llm
- Concepts: machine learning, deep learning, nlp, computer vision, model training

**Data Scientist** (25+ keywords):
- Job titles: data scientist, data analyst
- Technologies: python, pandas, numpy, matplotlib, seaborn, jupyter, sql, r, tableau, power bi
- Concepts: statistical analysis, data visualization, predictive modeling, feature engineering

**DevOps Engineer** (30+ keywords):
- Job titles: devops engineer, site reliability engineer, sre, cloud engineer
- Technologies: docker, kubernetes, jenkins, terraform, ansible, aws, azure, gcp
- Concepts: ci/cd, infrastructure, monitoring, automation

**Product Manager** (25+ keywords):
- Job titles: product manager, product owner
- Concepts: product strategy, roadmap, agile, scrum, stakeholder management
- Tools: jira, confluence
- Skills: market research, kpi, metrics, user experience

### 2. Multi-Method Detection Algorithm
The role detector uses three scoring methods:

1. **Keyword Matching** (weight: 2x per match)
   - Searches resume text for role-specific keywords
   - Uses regex word boundaries for accurate matching

2. **Skill-Based Detection** (weight: 3x per match)
   - Matches extracted skills against role skill database
   - Higher weight because skills are more reliable indicators

3. **Job Title Detection** (weight: 5x per match)
   - Identifies job titles in resume using pattern matching
   - Highest weight because job titles are strongest indicators

### 3. Automatic Fallback
- Default role: `software_developer`
- Always returns a valid role (never fails)
- Calculates confidence score (0-1) based on match quality

### 4. Debug Logging
Added console logging for debugging:
```javascript
console.log('[RoleDetector] Detected Role:', detectedRole);
console.log('[RoleDetector] Confidence:', confidence.toFixed(2));
console.log('[RoleDetector] Experience Level:', experienceLevel);
console.log('[RoleDetector] All Scores:', allScores);
```

### 5. Experience Level Detection
Automatically detects experience level from:
- Explicit mentions: "5 years of experience"
- Job title keywords: "Senior", "Junior", "Lead", "Principal"
- Classification: Entry Level (<2 years), Mid Level (2-5 years), Senior (5+ years)

## Files Modified
- `src/ai/parser/roleDetector.ts`

## Integration
The role detector is already integrated into the resume analysis pipeline via `src/services/resumeIntelligence.service.ts`:

```typescript
const roleDetection = this.roleDetector.detectRole(
  parsedResume.text,
  extractedSkills
);
parsedResume.targetRole = request.targetRole || roleDetection.detectedRole;
parsedResume.roleConfidence = roleDetection.confidence;
```

## Expected Behavior
1. User uploads resume
2. System extracts text and skills
3. Role detector analyzes text using 3 methods
4. System automatically detects most likely role
5. Resume analysis continues without errors
6. Console shows detection details for debugging

## Testing
To test the enhancement:
1. Start dev server: `npm run dev`
2. Navigate to Resume Analyzer
3. Upload a resume (PDF, DOC, or DOCX)
4. Open browser console to see detection logs
5. Verify role is detected automatically
6. Check that analysis completes successfully

## Example Console Output
```
[RoleDetector] Detected Role: software_developer
[RoleDetector] Confidence: 0.65
[RoleDetector] Experience Level: Mid Level
[RoleDetector] All Scores: {
  software_developer: 45,
  aiml_engineer: 12,
  data_scientist: 8,
  devops_engineer: 5,
  product_manager: 0
}
```

## Benefits
- No more "Failed to detect target role" errors
- Automatic role detection for all 5 supported roles
- Confidence scoring helps identify uncertain detections
- Debug logging aids troubleshooting
- Graceful fallback ensures analysis never fails
