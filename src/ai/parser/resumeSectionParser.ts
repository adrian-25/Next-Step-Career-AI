/**
 * Resume Section Parser — FIX 2
 * 4-Step regex-based section detection and structured data extraction
 * Viva: "The parser uses regex-based heading detection to segment resume text
 * into semantic blocks, then extracts structured fields from each block
 * to compute section-level scores."
 */

// ── Step 1: Section heading patterns ─────────────────────────────────────────

const SECTION_PATTERNS = {
  projects:   /(projects?|personal\s+projects?|academic\s+projects?|portfolio|work\s+samples?)/i,
  experience: /(experience|internship|work\s+experience|employment|work\s+history|career|professional\s+background)/i,
  education:  /(education|academic\s+background|degree|university|college|qualification|schooling)/i,
  skills:     /(skills?|technical\s+skills?|competencies|technologies|expertise|proficiencies)/i,
  summary:    /(summary|objective|profile|about\s+me|professional\s+summary|career\s+objective)/i,
  certifications: /(certifications?|certificates?|credentials?|licenses?|accreditations?)/i,
};

// ── Types ─────────────────────────────────────────────────────────────────────

export interface ProjectEntry {
  name: string;
  techStack: string[];
  description: string;
}

export interface ExperienceEntry {
  company: string;
  role: string;
  duration: string;
  description: string;
}

export interface EducationEntry {
  degree: string;
  institution: string;
  year: string;
}

export interface ParsedSections {
  projects:       ProjectEntry[];
  experience:     ExperienceEntry[];
  education:      EducationEntry[];
  skills:         string[];
  summary:        string;
  certifications: string[];
  rawBlocks:      Record<string, string>;
}

export interface SectionScores {
  projectsScore:   number;   // 0–25
  experienceScore: number;   // 0–20
  educationScore:  number;   // 0–15
  skillsScore:     number;   // 0–40 (from skill matching)
  totalDetected:   number;   // sections found
}

// ── Step 2: Split resume into content blocks ──────────────────────────────────

function splitIntoBlocks(text: string): Record<string, string> {
  const lines = text.split(/\n/);
  const blocks: Record<string, string> = {};
  let currentSection = 'header';
  let currentLines: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Check if this line is a section heading
    let matched = false;
    for (const [sectionKey, pattern] of Object.entries(SECTION_PATTERNS)) {
      // A heading is typically short (< 50 chars) and matches the pattern
      if (trimmed.length < 50 && pattern.test(trimmed)) {
        // Save previous block
        if (currentLines.length > 0) {
          blocks[currentSection] = (blocks[currentSection] ?? '') + '\n' + currentLines.join('\n');
        }
        currentSection = sectionKey;
        currentLines = [];
        matched = true;
        break;
      }
    }

    if (!matched) {
      currentLines.push(line);
    }
  }

  // Save last block
  if (currentLines.length > 0) {
    blocks[currentSection] = (blocks[currentSection] ?? '') + '\n' + currentLines.join('\n');
  }

  return blocks;
}

// ── Step 3: Extract structured data per section ───────────────────────────────

// Tech stack keywords for project extraction
const TECH_KEYWORDS = [
  'react', 'vue', 'angular', 'node', 'python', 'java', 'javascript', 'typescript',
  'django', 'flask', 'fastapi', 'spring', 'express', 'next.js', 'html', 'css',
  'sql', 'postgresql', 'mongodb', 'redis', 'mysql', 'sqlite',
  'docker', 'kubernetes', 'aws', 'azure', 'gcp', 'terraform',
  'tensorflow', 'pytorch', 'scikit-learn', 'pandas', 'numpy',
  'git', 'github', 'ci/cd', 'jenkins', 'graphql', 'rest api',
  'tailwind', 'bootstrap', 'firebase', 'supabase',
];

function extractProjects(block: string): ProjectEntry[] {
  if (!block.trim()) return [];
  const projects: ProjectEntry[] = [];
  const lines = block.split('\n').filter(l => l.trim());

  // Split by bullet points or numbered items or blank lines
  const projectChunks: string[][] = [];
  let current: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    // New project starts with bullet, number, or capitalized title
    if (/^[•\-\*\d]/.test(trimmed) || /^[A-Z][A-Za-z\s]+:/.test(trimmed)) {
      if (current.length > 0) projectChunks.push(current);
      current = [trimmed];
    } else if (trimmed) {
      current.push(trimmed);
    }
  }
  if (current.length > 0) projectChunks.push(current);

  // If no clear structure, treat each non-empty line as a project
  const chunks = projectChunks.length > 0 ? projectChunks : lines.map(l => [l]);

  for (const chunk of chunks.slice(0, 10)) {
    const text = chunk.join(' ');
    if (text.length < 5) continue;

    // Extract project name (first line, cleaned)
    const name = chunk[0]
      .replace(/^[•\-\*\d\.\)]\s*/, '')
      .replace(/[:—–].*$/, '')
      .trim()
      .slice(0, 80);

    // Extract tech stack from the chunk
    const lowerText = text.toLowerCase();
    const techStack = TECH_KEYWORDS.filter(t => lowerText.includes(t));

    // Also look for "Tech: X, Y, Z" or "Technologies: X, Y" patterns
    const techMatch = text.match(/(?:tech(?:nologies)?|stack|built\s+with|using)[:\s]+([^.]+)/i);
    if (techMatch) {
      const extraTech = techMatch[1].split(/[,;]/).map(t => t.trim().toLowerCase()).filter(t => t.length > 1);
      extraTech.forEach(t => { if (!techStack.includes(t)) techStack.push(t); });
    }

    projects.push({
      name: name || 'Project',
      techStack: [...new Set(techStack)].slice(0, 8),
      description: chunk.slice(1).join(' ').trim().slice(0, 200),
    });
  }

  return projects.filter(p => p.name.length > 2);
}

function extractExperience(block: string): ExperienceEntry[] {
  if (!block.trim()) return [];
  const entries: ExperienceEntry[] = [];
  const lines = block.split('\n').filter(l => l.trim());

  // Duration patterns
  const durationPattern = /(\d{4}|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|january|february|march|april|june|july|august|september|october|november|december|present|current)/i;
  const dateRangePattern = /(\w+\s+\d{4}|\d{4})\s*[-–—to]+\s*(\w+\s+\d{4}|\d{4}|present|current)/i;

  // Group lines into experience entries
  const chunks: string[][] = [];
  let current: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    // New entry: line with company/role indicators
    if (
      /^[A-Z]/.test(trimmed) &&
      (durationPattern.test(trimmed) || /\b(engineer|developer|analyst|manager|intern|lead|senior|junior|associate)\b/i.test(trimmed))
    ) {
      if (current.length > 0) chunks.push(current);
      current = [trimmed];
    } else if (trimmed) {
      current.push(trimmed);
    }
  }
  if (current.length > 0) chunks.push(current);

  // Fallback: split by blank lines
  if (chunks.length === 0) {
    const text = block.trim();
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim());
    paragraphs.forEach(p => chunks.push(p.split('\n').filter(l => l.trim())));
  }

  for (const chunk of chunks.slice(0, 8)) {
    if (chunk.length === 0) continue;
    const firstLine = chunk[0].trim();

    // Extract duration
    const durationMatch = firstLine.match(dateRangePattern) ?? chunk.join(' ').match(dateRangePattern);
    const duration = durationMatch ? durationMatch[0] : '';

    // Extract role and company
    const cleanFirst = firstLine.replace(dateRangePattern, '').trim();
    const parts = cleanFirst.split(/[,|@\-–—at]/i).map(p => p.trim()).filter(Boolean);
    const role    = parts[0] ?? cleanFirst;
    const company = parts[1] ?? '';

    entries.push({
      role:        role.slice(0, 80),
      company:     company.slice(0, 80),
      duration:    duration.slice(0, 40),
      description: chunk.slice(1).join(' ').trim().slice(0, 300),
    });
  }

  return entries.filter(e => e.role.length > 2);
}

function extractEducation(block: string): EducationEntry[] {
  if (!block.trim()) return [];
  const entries: EducationEntry[] = [];
  const lines = block.split('\n').filter(l => l.trim());

  const degreeKeywords = /\b(b\.?tech|b\.?e|b\.?sc|b\.?com|b\.?a|m\.?tech|m\.?sc|m\.?e|mba|phd|bachelor|master|doctorate|diploma|associate|degree|engineering|science|arts|commerce)\b/i;
  const yearPattern = /\b(19|20)\d{2}\b/;

  // Group into education entries
  const chunks: string[][] = [];
  let current: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (degreeKeywords.test(trimmed) || /^[A-Z]/.test(trimmed) && yearPattern.test(trimmed)) {
      if (current.length > 0) chunks.push(current);
      current = [trimmed];
    } else if (trimmed) {
      current.push(trimmed);
    }
  }
  if (current.length > 0) chunks.push(current);

  if (chunks.length === 0) {
    chunks.push(lines);
  }

  for (const chunk of chunks.slice(0, 5)) {
    const text = chunk.join(' ');
    const yearMatch = text.match(/\b(19|20)\d{2}\b/g);
    const year = yearMatch ? yearMatch.join('–') : '';

    // Find degree
    const degreeMatch = text.match(degreeKeywords);
    const degree = degreeMatch
      ? text.slice(0, text.indexOf(degreeMatch[0]) + degreeMatch[0].length + 30).trim()
      : chunk[0].trim();

    // Find institution (usually the longer part or second line)
    const institution = chunk.length > 1
      ? chunk[1].trim()
      : text.replace(degree, '').replace(year, '').trim().slice(0, 80);

    entries.push({
      degree:      degree.slice(0, 100),
      institution: institution.slice(0, 100),
      year:        year.slice(0, 20),
    });
  }

  return entries.filter(e => e.degree.length > 2 || e.institution.length > 2);
}

// ── Step 4: Score each section ────────────────────────────────────────────────

export function scoreSections(parsed: ParsedSections, skillMatchScore = 0): SectionScores {
  // Per spec:
  // projectsScore   = detectedProjects.length   > 0 ? 25 : 0
  // experienceScore = detectedExperience.length  > 0 ? 20 : 0
  // educationScore  = detectedEducation.length   > 0 ? 15 : 0
  // skillsScore     = from ML skill matching (0–40)

  const projectsScore   = parsed.projects.length   > 0
    ? Math.min(25, 10 + parsed.projects.length * 5)
    : 0;

  const experienceScore = parsed.experience.length > 0
    ? Math.min(20, 8 + parsed.experience.length * 4)
    : 0;

  const educationScore  = parsed.education.length  > 0
    ? Math.min(15, 8 + parsed.education.length * 3)
    : 0;

  const skillsScore = Math.round(Math.min(40, skillMatchScore * 0.4));

  const totalDetected = [
    parsed.projects.length > 0,
    parsed.experience.length > 0,
    parsed.education.length > 0,
    parsed.skills.length > 0,
    parsed.summary.length > 0,
  ].filter(Boolean).length;

  return { projectsScore, experienceScore, educationScore, skillsScore, totalDetected };
}

// ── Main parser function ──────────────────────────────────────────────────────

export function parseResumeSections(resumeText: string): ParsedSections {
  // Step 2: Split into blocks
  const rawBlocks = splitIntoBlocks(resumeText);

  // Step 3: Extract structured data
  const projects   = extractProjects(rawBlocks.projects ?? '');
  const experience = extractExperience(rawBlocks.experience ?? '');
  const education  = extractEducation(rawBlocks.education ?? '');

  // Extract skills list
  const skillsBlock = rawBlocks.skills ?? '';
  const skills = skillsBlock
    .split(/[,\n•\-\*]/)
    .map(s => s.trim())
    .filter(s => s.length > 1 && s.length < 40)
    .slice(0, 30);

  // Extract summary
  const summary = (rawBlocks.summary ?? '').trim().slice(0, 500);

  // Extract certifications
  const certBlock = rawBlocks.certifications ?? '';
  const certifications = certBlock
    .split(/\n/)
    .map(s => s.replace(/^[•\-\*]\s*/, '').trim())
    .filter(s => s.length > 3)
    .slice(0, 10);

  return {
    projects,
    experience,
    education,
    skills,
    summary,
    certifications,
    rawBlocks,
  };
}
