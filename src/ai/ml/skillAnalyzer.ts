/**
 * ML + Soft Computing Skill Analyzer
 *
 * Pipeline:
 * 1. Extract skills from resume text (TF-IDF keyword matching)
 * 2. Fuzzy match extracted skills against weighted role requirements
 * 3. Calculate:
 *    - ml_score    = simple match % (TF-IDF based)
 *    - fuzzy_score = fuzzy membership-weighted score
 *    - final_score = 0.7 * ml_score + 0.3 * fuzzy_score
 */

import { getDataset, JobRoleEntry } from './rolePredictor';
import { fuzzySkillMatch, WeightedSkill, FuzzyMatchResult } from './fuzzyMatcher';
import { getResourcesForSkill } from '../../data/learningResources';

export interface SkillRecommendation {
  skill: string;
  resources: {
    type: 'free' | 'paid';
    title: string;
    url: string;
    platform: string;
  }[];
}

export interface SkillAnalysisResult {
  // Legacy fields (backward compat)
  extractedSkills:  string[];
  matchedSkills:    string[];
  missingSkills:    string[];
  matchPercentage:  number;
  recommendations:  SkillRecommendation[];

  // Soft Computing fields
  partialSkills:    Array<{ skill: string; similarity: number; matchedTo: string }>;
  mlScore:          number;   // 0–100 simple match
  fuzzyScore:       number;   // 0–100 fuzzy weighted
  weightedScore:    number;   // 0–100 importance-weighted
  finalScore:       number;   // 0.7 * mlScore + 0.3 * fuzzyScore
  confidence:       number;   // 0–100 based on skill count + match strength
}

// ── Master skill set ──────────────────────────────────────────────────────────

function buildMasterSkillSet(): Set<string> {
  const set = new Set<string>();
  getDataset().forEach((entry: JobRoleEntry) => {
    const skills = entry.skills as unknown as Array<{ name: string } | string>;
    skills.forEach(s => {
      const name = typeof s === 'string' ? s : s.name;
      set.add(name.toLowerCase().trim());
    });
  });
  return set;
}

let _masterSkills: Set<string> | null = null;
function getMasterSkills(): Set<string> {
  if (!_masterSkills) _masterSkills = buildMasterSkillSet();
  return _masterSkills;
}

// ── Skill extraction ──────────────────────────────────────────────────────────

export function extractSkillsFromText(text: string): string[] {
  const masterSkills = getMasterSkills();
  const found = new Set<string>();
  const lower = text.toLowerCase().replace(/[^\w\s.#+/]/g, ' ');

  masterSkills.forEach(skill => {
    const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = skill.length <= 3
      ? new RegExp(`\\b${escaped}\\b`, 'i')
      : new RegExp(escaped, 'i');
    if (pattern.test(lower)) found.add(skill);
  });

  const tokens = lower.split(/\s+/).filter(t => t.length > 1);
  for (let i = 0; i < tokens.length; i++) {
    const unigram = tokens[i];
    const bigram  = i < tokens.length - 1 ? `${tokens[i]} ${tokens[i + 1]}` : '';
    if (masterSkills.has(unigram)) found.add(unigram);
    if (bigram && masterSkills.has(bigram)) found.add(bigram);
  }

  return Array.from(found);
}

// ── Get weighted skills for a role ───────────────────────────────────────────

function getWeightedSkills(role: string): WeightedSkill[] {
  const entry = getDataset().find((e: JobRoleEntry) => e.role === role);
  if (!entry) return [];
  const skills = entry.skills as unknown as Array<{ name: string; weight: number } | string>;
  return skills.map(s =>
    typeof s === 'string'
      ? { name: s, weight: 0.7 }
      : { name: s.name, weight: s.weight }
  );
}

// ── Confidence calculation ────────────────────────────────────────────────────

function calcConfidence(
  extractedCount: number,
  matchedCount: number,
  partialCount: number,
  finalScore: number
): number {
  // More skills detected → higher confidence
  const skillFactor  = Math.min(1, extractedCount / 15);
  // Higher match → higher confidence
  const matchFactor  = finalScore / 100;
  // Partial matches reduce confidence slightly
  const partialPenalty = partialCount > 0 ? 0.05 * Math.min(partialCount, 5) : 0;

  return Math.round(
    Math.min(100, (skillFactor * 0.3 + matchFactor * 0.7 - partialPenalty) * 100)
  );
}

// ── Main analysis function ────────────────────────────────────────────────────

export function analyzeResume(
  resumeText: string,
  targetRole: string
): SkillAnalysisResult {
  // 1. Extract skills
  const extractedSkills = extractSkillsFromText(resumeText);

  // 2. Get weighted role requirements
  const weightedRequired = getWeightedSkills(targetRole);
  const requiredNames    = weightedRequired.map(s => s.name);

  // 3. ML score — simple exact match %
  const userSkillSet = new Set(extractedSkills.map(s => s.toLowerCase().trim()));
  const exactMatched = requiredNames.filter(r => userSkillSet.has(r.toLowerCase().trim()));
  const mlScore = requiredNames.length === 0 ? 0
    : Math.round((exactMatched.length / requiredNames.length) * 100);

  // 4. Fuzzy match (Soft Computing)
  const fuzzyResult: FuzzyMatchResult = fuzzySkillMatch(extractedSkills, weightedRequired);

  // 5. Final score = 0.7 * ML + 0.3 * Fuzzy
  const finalScore = Math.round(0.7 * mlScore + 0.3 * fuzzyResult.fuzzyScore);

  // 6. Confidence
  const confidence = calcConfidence(
    extractedSkills.length,
    fuzzyResult.matchedSkills.length,
    fuzzyResult.partialSkills.length,
    finalScore
  );

  // 7. Build recommendations for missing + partial skills
  const missingNames = fuzzyResult.missingSkills.map(s => s.skill);
  const recommendations: SkillRecommendation[] = missingNames.map(skill => {
    const res = getResourcesForSkill(skill);
    const resources: SkillRecommendation['resources'] = [];
    if (res.free) resources.push({ type: 'free', ...res.free });
    if (res.paid) resources.push({ type: 'paid', ...res.paid });
    return { skill, resources };
  });

  return {
    // Legacy
    extractedSkills,
    matchedSkills:   fuzzyResult.matchedSkills.map(s => s.skill),
    missingSkills:   missingNames,
    matchPercentage: finalScore,
    recommendations,

    // Soft Computing
    partialSkills:   fuzzyResult.partialSkills.map(s => ({
      skill:     s.skill,
      similarity: Math.round(s.similarity * 100),
      matchedTo: s.matchedTo,
    })),
    mlScore,
    fuzzyScore:    fuzzyResult.fuzzyScore,
    weightedScore: fuzzyResult.weightedScore,
    finalScore,
    confidence,
  };
}
