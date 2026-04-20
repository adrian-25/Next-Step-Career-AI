import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  BookOpen, ExternalLink, Search, Star, Clock, Zap,
  CheckCircle2, Filter, ChevronDown, ChevronUp, GraduationCap,
  Target, TrendingUp, Sparkles,
} from 'lucide-react';
import { learningResources, getResourcesForSkill } from '@/data/learningResources';
import { useNavigate } from 'react-router-dom';

// ── Types ─────────────────────────────────────────────────────────────────────

interface CourseEntry {
  skill: string;
  freeTitle: string;
  freeUrl: string;
  freePlatform: string;
  paidTitle?: string;
  paidUrl?: string;
  paidPlatform?: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  isGap: boolean;
}

// ── Category map ──────────────────────────────────────────────────────────────

const SKILL_CATEGORIES: Record<string, string> = {
  JavaScript: 'Frontend', TypeScript: 'Frontend', React: 'Frontend',
  'Vue.js': 'Frontend', Angular: 'Frontend', 'Next.js': 'Frontend',
  HTML: 'Frontend', CSS: 'Frontend', 'Tailwind CSS': 'Frontend',
  'Node.js': 'Backend', Express: 'Backend', Django: 'Backend',
  'Spring Boot': 'Backend', FastAPI: 'Backend', 'REST API': 'Backend',
  GraphQL: 'Backend',
  SQL: 'Database', PostgreSQL: 'Database', MongoDB: 'Database', Redis: 'Database',
  Docker: 'DevOps', Kubernetes: 'DevOps', AWS: 'DevOps', 'CI/CD': 'DevOps',
  Terraform: 'DevOps', Ansible: 'DevOps', Linux: 'DevOps',
  Python: 'AI/ML', 'Machine Learning': 'AI/ML', 'Deep Learning': 'AI/ML',
  TensorFlow: 'AI/ML', PyTorch: 'AI/ML', 'Scikit-learn': 'AI/ML',
  Pandas: 'AI/ML', NumPy: 'AI/ML', 'Data Visualization': 'AI/ML', Tableau: 'AI/ML',
  Git: 'Tools', Jest: 'Tools', Testing: 'Tools',
  Agile: 'Soft Skills', 'Problem Solving': 'Soft Skills', 'Product Management': 'Soft Skills',
  Jira: 'Tools',
  Java: 'Languages', 'C#': 'Languages', Go: 'Languages', Rust: 'Languages',
};

const SKILL_DIFFICULTY: Record<string, 'beginner' | 'intermediate' | 'advanced'> = {
  HTML: 'beginner', CSS: 'beginner', Git: 'beginner', SQL: 'beginner',
  Agile: 'beginner', 'Problem Solving': 'beginner',
  JavaScript: 'intermediate', TypeScript: 'intermediate', React: 'intermediate',
  Python: 'intermediate', 'Node.js': 'intermediate', PostgreSQL: 'intermediate',
  Docker: 'intermediate', AWS: 'intermediate', 'Machine Learning': 'intermediate',
  Kubernetes: 'advanced', 'Deep Learning': 'advanced', TensorFlow: 'advanced',
  PyTorch: 'advanced', Terraform: 'advanced', Rust: 'advanced',
};

const CATEGORIES = ['All', 'Frontend', 'Backend', 'Database', 'DevOps', 'AI/ML', 'Languages', 'Tools', 'Soft Skills'];

// ── Helpers ───────────────────────────────────────────────────────────────────

function getGapSkills(): string[] {
  try {
    const raw = localStorage.getItem('lastAnalysisResult');
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    const missing = parsed?.skillMatch?.missingSkills ?? parsed?.mlResult?.missingSkills ?? [];
    return missing.map((s: any) => (typeof s === 'string' ? s : s.skill));
  } catch { return []; }
}

function buildCourseList(): CourseEntry[] {
  const gapSet = new Set(getGapSkills().map(s => s.toLowerCase()));
  return Object.entries(learningResources)
    .filter(([, res]) => res.free)
    .map(([skill, res]) => ({
      skill,
      freeTitle:    res.free!.title,
      freeUrl:      res.free!.url,
      freePlatform: res.free!.platform,
      paidTitle:    res.paid?.title,
      paidUrl:      res.paid?.url,
      paidPlatform: res.paid?.platform,
      category:     SKILL_CATEGORIES[skill] ?? 'Other',
      difficulty:   SKILL_DIFFICULTY[skill] ?? 'intermediate',
      isGap:        gapSet.has(skill.toLowerCase()),
    }))
    .sort((a, b) => {
      // Gaps first, then alphabetical
      if (a.isGap && !b.isGap) return -1;
      if (!a.isGap && b.isGap) return 1;
      return a.skill.localeCompare(b.skill);
    });
}

function diffColor(d: 'beginner' | 'intermediate' | 'advanced') {
  if (d === 'beginner')     return 'bg-green-100 text-green-700 border-green-200';
  if (d === 'intermediate') return 'bg-blue-100 text-blue-700 border-blue-200';
  return 'bg-purple-100 text-purple-700 border-purple-200';
}

// ── Course card ───────────────────────────────────────────────────────────────

function CourseCard({ course, index }: { course: CourseEntry; index: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.03, 0.5) }}
      className={`border rounded-xl overflow-hidden transition-shadow hover:shadow-md ${
        course.isGap ? 'border-amber-300 bg-amber-50/30' : 'border-border bg-card'
      }`}
    >
      <div
        className="flex items-center gap-3 px-4 py-3 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        {/* Gap indicator */}
        {course.isGap && (
          <div className="w-2 h-2 rounded-full bg-amber-500 shrink-0" title="Skill gap from your resume" />
        )}

        {/* Skill name */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-sm">{course.skill}</span>
            {course.isGap && (
              <Badge className="text-xs bg-amber-100 text-amber-700 border-amber-200 gap-1">
                <Target className="h-2.5 w-2.5" /> Gap
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">{course.freePlatform}</p>
        </div>

        {/* Badges */}
        <div className="flex items-center gap-1.5 shrink-0">
          <Badge className={`text-xs border ${diffColor(course.difficulty)}`}>
            {course.difficulty}
          </Badge>
          <Badge variant="secondary" className="text-xs">{course.category}</Badge>
          {expanded
            ? <ChevronUp className="h-4 w-4 text-muted-foreground ml-1" />
            : <ChevronDown className="h-4 w-4 text-muted-foreground ml-1" />
          }
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-1 border-t bg-muted/10 space-y-3">
              {/* Free resource */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-1.5 flex items-center gap-1">
                  <BookOpen className="h-3 w-3" /> Free Resource
                </p>
                <a href={course.freeUrl} target="_blank" rel="noopener noreferrer">
                  <div className="flex items-center justify-between p-2.5 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors">
                    <div>
                      <p className="text-sm font-medium text-blue-800">{course.freeTitle}</p>
                      <p className="text-xs text-blue-600">{course.freePlatform}</p>
                    </div>
                    <ExternalLink className="h-4 w-4 text-blue-600 shrink-0" />
                  </div>
                </a>
              </div>

              {/* Paid resource */}
              {course.paidUrl && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-1.5 flex items-center gap-1">
                    <Star className="h-3 w-3" /> Premium Course
                  </p>
                  <a href={course.paidUrl} target="_blank" rel="noopener noreferrer">
                    <div className="flex items-center justify-between p-2.5 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors">
                      <div>
                        <p className="text-sm font-medium text-purple-800">{course.paidTitle}</p>
                        <p className="text-xs text-purple-600">{course.paidPlatform}</p>
                      </div>
                      <ExternalLink className="h-4 w-4 text-purple-600 shrink-0" />
                    </div>
                  </a>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export function Courses() {
  const navigate = useNavigate();
  const allCourses = useMemo(buildCourseList, []);
  const gapSkills  = useMemo(getGapSkills, []);

  const [search, setSearch]       = useState('');
  const [category, setCategory]   = useState('All');
  const [difficulty, setDifficulty] = useState('All');
  const [gapsOnly, setGapsOnly]   = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    return allCourses.filter(c => {
      if (gapsOnly && !c.isGap) return false;
      if (category !== 'All' && c.category !== category) return false;
      if (difficulty !== 'All' && c.difficulty !== difficulty) return false;
      if (search && !c.skill.toLowerCase().includes(search.toLowerCase()) &&
          !c.freeTitle.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [allCourses, search, category, difficulty, gapsOnly]);

  const gapCount = allCourses.filter(c => c.isGap).length;
  const hasResume = gapSkills.length > 0;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-primary" /> Learning Resources
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {hasResume
              ? `${gapCount} courses matched to your skill gaps — ${allCourses.length} total available`
              : `${allCourses.length} curated courses across all tech skills`}
          </p>
        </div>
        {!hasResume && (
          <Button variant="outline" size="sm" onClick={() => navigate('/resume')} className="gap-1">
            <Sparkles className="h-3.5 w-3.5" /> Analyze Resume for Personalized Picks
          </Button>
        )}
      </div>

      {/* Personalized gap banner */}
      {hasResume && gapCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-200 rounded-xl text-sm"
        >
          <Target className="h-5 w-5 text-amber-600 shrink-0" />
          <div className="flex-1">
            <span className="font-semibold text-amber-800">
              {gapCount} courses match your skill gaps
            </span>
            <span className="text-amber-700"> — highlighted with an orange border</span>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="border-amber-300 text-amber-700 hover:bg-amber-100 shrink-0"
            onClick={() => setGapsOnly(!gapsOnly)}
          >
            {gapsOnly ? 'Show All' : 'Gaps Only'}
          </Button>
        </motion.div>
      )}

      {/* Search + filters */}
      <div className="space-y-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search skills or courses..."
              className="pl-9"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="gap-1"
          >
            <Filter className="h-4 w-4" />
            Filters
            {showFilters ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </Button>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <Card>
                <CardContent className="pt-4 pb-4 space-y-3">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2">Category</p>
                    <div className="flex flex-wrap gap-1.5">
                      {CATEGORIES.map(cat => (
                        <button
                          key={cat}
                          onClick={() => setCategory(cat)}
                          className={`px-2.5 py-1 text-xs rounded-full border transition-colors ${
                            category === cat
                              ? 'bg-primary text-white border-primary'
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2">Difficulty</p>
                    <div className="flex gap-1.5">
                      {['All', 'beginner', 'intermediate', 'advanced'].map(d => (
                        <button
                          key={d}
                          onClick={() => setDifficulty(d)}
                          className={`px-2.5 py-1 text-xs rounded-full border transition-colors capitalize ${
                            difficulty === d
                              ? 'bg-primary text-white border-primary'
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-3 pb-3 text-center">
            <p className="text-2xl font-bold text-blue-700">{filtered.length}</p>
            <p className="text-xs text-blue-600">Courses shown</p>
          </CardContent>
        </Card>
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="pt-3 pb-3 text-center">
            <p className="text-2xl font-bold text-amber-700">{filtered.filter(c => c.isGap).length}</p>
            <p className="text-xs text-amber-600">Your skill gaps</p>
          </CardContent>
        </Card>
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-3 pb-3 text-center">
            <p className="text-2xl font-bold text-green-700">{filtered.filter(c => c.paidUrl).length}</p>
            <p className="text-xs text-green-600">With premium option</p>
          </CardContent>
        </Card>
      </div>

      {/* Course list */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <BookOpen className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No courses match your filters</p>
          <p className="text-sm mt-1">Try adjusting the search or category</p>
        </div>
      ) : (
        <div className="space-y-2">
          {/* Gap courses section header */}
          {!gapsOnly && hasResume && filtered.some(c => c.isGap) && (
            <div className="flex items-center gap-2 mb-1">
              <Target className="h-4 w-4 text-amber-600" />
              <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide">
                Your Skill Gaps — Priority Learning
              </p>
            </div>
          )}

          {filtered.map((course, i) => (
            <CourseCard key={course.skill} course={course} index={i} />
          ))}
        </div>
      )}

      {/* Quick links section */}
      <Card className="border-dashed border-2 border-primary/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" /> Top Learning Platforms
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { name: 'freeCodeCamp', url: 'https://www.freecodecamp.org', color: 'bg-green-50 border-green-200 text-green-700' },
              { name: 'Coursera',     url: 'https://www.coursera.org',     color: 'bg-blue-50 border-blue-200 text-blue-700'   },
              { name: 'Udemy',        url: 'https://www.udemy.com',        color: 'bg-purple-50 border-purple-200 text-purple-700' },
              { name: 'MDN Web Docs', url: 'https://developer.mozilla.org', color: 'bg-orange-50 border-orange-200 text-orange-700' },
            ].map(p => (
              <a key={p.name} href={p.url} target="_blank" rel="noopener noreferrer">
                <div className={`flex items-center justify-between p-2.5 rounded-lg border text-xs font-medium hover:opacity-80 transition-opacity ${p.color}`}>
                  {p.name}
                  <ExternalLink className="h-3 w-3" />
                </div>
              </a>
            ))}
          </div>
        </CardContent>
      </Card>

    </div>
  );
}

export default Courses;
