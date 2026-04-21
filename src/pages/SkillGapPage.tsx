import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  ArrowRight, BookOpen, ExternalLink, Target, TrendingUp,
  Zap, Clock, Star, ChevronDown, ChevronUp, Lightbulb,
  CheckCircle2, AlertCircle, Layers,
} from 'lucide-react';
import { getDataset } from '@/ai/ml/rolePredictor';
import { getResourcesForSkill } from '@/data/learningResources';

// ── Types ─────────────────────────────────────────────────────────────────────

interface GapSkill {
  skill: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedHours: number;
  demand: 'high' | 'medium' | 'low';
  freeUrl?: string;
  paidUrl?: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const ROLES = getDataset().map(e => ({ key: e.role, label: e.display }));

function getSkillsForRole(roleKey: string): string[] {
  const entry = getDataset().find(e => e.role === roleKey);
  if (!entry) return [];
  return entry.skills.map((s: any) => (typeof s === 'string' ? s : s.name));
}

function getLastAnalysisSkills(): string[] {
  try {
    const raw = localStorage.getItem('lastAnalysisResult');
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    const matched = parsed?.skillMatch?.matchedSkills ?? parsed?.mlResult?.matchedSkills ?? [];
    return matched.map((s: any) => (typeof s === 'string' ? s : s.skill));
  } catch { return []; }
}

function getLastRole(): string {
  try { return localStorage.getItem('lastDetectedRole') ?? ''; }
  catch { return ''; }
}

function difficultyColor(d: GapSkill['difficulty']) {
  if (d === 'beginner')     return 'bg-green-100 text-green-700 border-green-200';
  if (d === 'intermediate') return 'bg-amber-100 text-amber-700 border-amber-200';
  return 'bg-red-100 text-red-700 border-red-200';
}

function demandColor(d: GapSkill['demand']) {
  if (d === 'high')   return 'bg-rose-100 text-rose-700';
  if (d === 'medium') return 'bg-amber-100 text-amber-700';
  return 'bg-slate-100 text-slate-600';
}

function estimateDifficulty(skill: string): GapSkill['difficulty'] {
  const advanced = ['kubernetes', 'mlops', 'deep learning', 'tensorflow', 'pytorch', 'spark', 'kafka', 'terraform', 'ansible'];
  const beginner = ['html', 'css', 'git', 'sql', 'bash', 'linux', 'agile', 'scrum'];
  const s = skill.toLowerCase();
  if (advanced.some(a => s.includes(a))) return 'advanced';
  if (beginner.some(b => s.includes(b))) return 'beginner';
  return 'intermediate';
}

function estimateHours(difficulty: GapSkill['difficulty']): number {
  if (difficulty === 'beginner')     return Math.floor(Math.random() * 20) + 10;
  if (difficulty === 'intermediate') return Math.floor(Math.random() * 40) + 30;
  return Math.floor(Math.random() * 80) + 60;
}

function estimateDemand(skill: string): GapSkill['demand'] {
  const high = ['python', 'javascript', 'typescript', 'react', 'aws', 'docker', 'kubernetes', 'machine learning', 'sql', 'node.js'];
  const s = skill.toLowerCase();
  if (high.some(h => s.includes(h))) return 'high';
  if (Math.random() > 0.5) return 'medium';
  return 'low';
}

function buildGapSkills(missing: string[]): GapSkill[] {
  return missing.map(skill => {
    const difficulty = estimateDifficulty(skill);
    const res = getResourcesForSkill(skill);
    return {
      skill,
      difficulty,
      estimatedHours: estimateHours(difficulty),
      demand: estimateDemand(skill),
      freeUrl: res.free?.url,
      paidUrl: res.paid?.url,
    };
  });
}

// ── Skill card ────────────────────────────────────────────────────────────────

function GapSkillCard({ item, index, expanded, onToggle }: {
  item: GapSkill;
  index: number;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="border rounded-xl overflow-hidden"
    >
      <button
        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted/30 transition-colors"
        onClick={onToggle}
      >
        {/* Rank */}
        <div className="w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">
          {index + 1}
        </div>

        {/* Skill name */}
        <span className="flex-1 font-medium text-sm capitalize">{item.skill}</span>

        {/* Badges */}
        <div className="flex items-center gap-1.5 shrink-0">
          <Badge className={`text-xs border ${difficultyColor(item.difficulty)}`}>
            {item.difficulty}
          </Badge>
          <Badge className={`text-xs ${demandColor(item.demand)}`}>
            {item.demand} demand
          </Badge>
          <span className="text-xs text-muted-foreground flex items-center gap-0.5 ml-1">
            <Clock className="h-3 w-3" /> ~{item.estimatedHours}h
          </span>
          {expanded ? <ChevronUp className="h-4 w-4 text-muted-foreground ml-1" /> : <ChevronDown className="h-4 w-4 text-muted-foreground ml-1" />}
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-1 bg-muted/20 border-t space-y-3">
              <p className="text-xs text-muted-foreground">
                Estimated learning time: <strong>{item.estimatedHours} hours</strong> ({item.difficulty} level)
              </p>
              <div className="flex gap-2 flex-wrap">
                {item.freeUrl && (
                  <a href={item.freeUrl} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" variant="outline" className="h-7 text-xs gap-1 border-blue-300 text-blue-700 hover:bg-blue-50">
                      <BookOpen className="h-3 w-3" /> Free Resource
                    </Button>
                  </a>
                )}
                {item.paidUrl && (
                  <a href={item.paidUrl} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" variant="outline" className="h-7 text-xs gap-1 border-purple-300 text-purple-700 hover:bg-purple-50">
                      <ExternalLink className="h-3 w-3" /> Premium Course
                    </Button>
                  </a>
                )}
                {!item.freeUrl && !item.paidUrl && (
                  <a
                    href={`https://www.google.com/search?q=learn+${encodeURIComponent(item.skill)}+tutorial`}
                    target="_blank" rel="noopener noreferrer"
                  >
                    <Button size="sm" variant="outline" className="h-7 text-xs gap-1">
                      <ExternalLink className="h-3 w-3" /> Search Resources
                    </Button>
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Timeline view ─────────────────────────────────────────────────────────────

function LearningTimeline({ gapSkills, currentRole, targetRole }: {
  gapSkills: GapSkill[];
  currentRole: string;
  targetRole: string;
}) {
  // Group by difficulty into phases
  const phase1 = gapSkills.filter(s => s.difficulty === 'beginner');
  const phase2 = gapSkills.filter(s => s.difficulty === 'intermediate');
  const phase3 = gapSkills.filter(s => s.difficulty === 'advanced');

  const phases = [
    { label: 'Phase 1 — Foundation', skills: phase1, color: 'border-green-400 bg-green-50', badge: 'bg-green-100 text-green-700', weeks: '2–4 weeks' },
    { label: 'Phase 2 — Core Skills', skills: phase2, color: 'border-blue-400 bg-blue-50', badge: 'bg-blue-100 text-blue-700', weeks: '4–8 weeks' },
    { label: 'Phase 3 — Advanced', skills: phase3, color: 'border-purple-400 bg-purple-50', badge: 'bg-purple-100 text-purple-700', weeks: '8–16 weeks' },
  ].filter(p => p.skills.length > 0);

  const totalHours = gapSkills.reduce((s, g) => s + g.estimatedHours, 0);
  const totalWeeks = Math.ceil(totalHours / 10); // ~10h/week

  return (
    <div className="space-y-4">
      {/* Timeline header */}
      <div className="flex items-center gap-3 flex-wrap text-sm">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full font-medium">
          <Layers className="h-4 w-4 text-slate-600" />
          {currentRole || 'Current Role'}
        </div>
        <ArrowRight className="h-4 w-4 text-muted-foreground" />
        <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-full font-medium text-primary">
          <Target className="h-4 w-4" />
          {targetRole}
        </div>
        <Badge className="bg-amber-100 text-amber-700 ml-auto">
          <Clock className="h-3 w-3 mr-1" /> ~{totalWeeks} weeks total
        </Badge>
      </div>

      {/* Phases */}
      {phases.map((phase, i) => (
        <motion.div
          key={phase.label}
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
          className={`border-l-4 pl-4 py-3 rounded-r-xl ${phase.color}`}
        >
          <div className="flex items-center justify-between mb-2">
            <p className="font-semibold text-sm">{phase.label}</p>
            <div className="flex items-center gap-2">
              <Badge className={`text-xs ${phase.badge}`}>{phase.weeks}</Badge>
              <span className="text-xs text-muted-foreground">{phase.skills.length} skills</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {phase.skills.map(s => (
              <Badge key={s.skill} variant="outline" className="text-xs capitalize bg-white">
                {s.skill}
              </Badge>
            ))}
          </div>
        </motion.div>
      ))}

      {/* Destination */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: phases.length * 0.1 + 0.1 }}
        className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl"
      >
        <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
        <div>
          <p className="text-sm font-semibold text-emerald-700">Ready for {targetRole}</p>
          <p className="text-xs text-emerald-600">After completing all {gapSkills.length} gap skills (~{totalWeeks} weeks)</p>
        </div>
      </motion.div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export function SkillGapPage() {
  const lastRole    = useMemo(getLastRole, []);
  const lastSkills  = useMemo(getLastAnalysisSkills, []);

  const [currentRole, setCurrentRole] = useState(lastRole || '');
  const [targetRole, setTargetRole]   = useState('');
  const [expanded, setExpanded]       = useState<string | null>(null);
  const [view, setView]               = useState<'list' | 'timeline'>('list');

  // Compute gap
  const currentSkills = useMemo(() => {
    if (lastSkills.length > 0 && currentRole === lastRole) return lastSkills;
    return getSkillsForRole(currentRole);
  }, [currentRole, lastRole, lastSkills]);

  const targetSkills = useMemo(() => getSkillsForRole(targetRole), [targetRole]);

  const gapSkills = useMemo((): GapSkill[] => {
    if (!targetRole) return [];
    const currentSet = new Set(currentSkills.map(s => s.toLowerCase()));
    const missing = targetSkills.filter(s => !currentSet.has(s.toLowerCase()));
    return buildGapSkills(missing);
  }, [currentSkills, targetSkills, targetRole]);

  const matchedCount = useMemo(() => {
    if (!targetRole) return 0;
    const currentSet = new Set(currentSkills.map(s => s.toLowerCase()));
    return targetSkills.filter(s => currentSet.has(s.toLowerCase())).length;
  }, [currentSkills, targetSkills, targetRole]);

  const readiness = targetSkills.length > 0
    ? Math.round(matchedCount / targetSkills.length * 100)
    : 0;

  const totalHours = gapSkills.reduce((s, g) => s + g.estimatedHours, 0);
  const highDemand = gapSkills.filter(g => g.demand === 'high').length;

  const currentLabel = ROLES.find(r => r.key === currentRole)?.label ?? currentRole;
  const targetLabel  = ROLES.find(r => r.key === targetRole)?.label ?? targetRole;

  return (
    <div className="page-content max-w-5xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Zap className="h-6 w-6 text-primary" /> Skill Gap Analyzer
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Compare your current skills against a target role and get a personalised learning plan.
        </p>
      </div>

      {/* Role selectors */}
      <Card>
        <CardContent className="pt-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block flex items-center gap-1.5">
                <Layers className="h-4 w-4 text-slate-500" /> Current Role
                {lastRole && <Badge className="text-xs bg-green-100 text-green-700 ml-1">From resume</Badge>}
              </label>
              <select
                value={currentRole}
                onChange={e => setCurrentRole(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm bg-background"
              >
                <option value="">Select current role…</option>
                {ROLES.map(r => <option key={r.key} value={r.key}>{r.label}</option>)}
              </select>
              {lastSkills.length > 0 && currentRole === lastRole && (
                <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> Using {lastSkills.length} skills from your resume
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block flex items-center gap-1.5">
                <Target className="h-4 w-4 text-primary" /> Target Role
              </label>
              <select
                value={targetRole}
                onChange={e => setTargetRole(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm bg-background"
              >
                <option value="">Select target role…</option>
                {ROLES.filter(r => r.key !== currentRole).map(r => (
                  <option key={r.key} value={r.key}>{r.label}</option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Empty state */}
      {!targetRole && (
        <div className="text-center py-16 text-muted-foreground">
          <Lightbulb className="h-12 w-12 mx-auto mb-3 opacity-20" />
          <p className="text-sm">Select a target role to see your skill gap analysis</p>
          <p className="text-xs mt-1">We'll show you exactly what to learn and how long it'll take</p>
        </div>
      )}

      {/* Results */}
      <AnimatePresence>
        {targetRole && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* KPI row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Card className="border-emerald-200 bg-emerald-50">
                <CardContent className="pt-4 pb-3 text-center">
                  <p className="text-3xl font-bold text-emerald-700">{readiness}%</p>
                  <p className="text-xs text-emerald-600 mt-0.5">Readiness</p>
                  <Progress value={readiness} className="h-1.5 mt-2" />
                </CardContent>
              </Card>
              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="pt-4 pb-3 text-center">
                  <p className="text-3xl font-bold text-blue-700">{matchedCount}</p>
                  <p className="text-xs text-blue-600 mt-0.5">Skills Matched</p>
                  <p className="text-xs text-muted-foreground">of {targetSkills.length} required</p>
                </CardContent>
              </Card>
              <Card className="border-rose-200 bg-rose-50">
                <CardContent className="pt-4 pb-3 text-center">
                  <p className="text-3xl font-bold text-rose-700">{gapSkills.length}</p>
                  <p className="text-xs text-rose-600 mt-0.5">Skills to Learn</p>
                  <p className="text-xs text-muted-foreground">{highDemand} high demand</p>
                </CardContent>
              </Card>
              <Card className="border-amber-200 bg-amber-50">
                <CardContent className="pt-4 pb-3 text-center">
                  <p className="text-3xl font-bold text-amber-700">~{Math.ceil(totalHours / 10)}w</p>
                  <p className="text-xs text-amber-600 mt-0.5">Est. Timeline</p>
                  <p className="text-xs text-muted-foreground">{totalHours}h at 10h/week</p>
                </CardContent>
              </Card>
            </div>

            {/* No gap */}
            {gapSkills.length === 0 && (
              <Card className="border-emerald-200 bg-emerald-50">
                <CardContent className="py-10 text-center">
                  <CheckCircle2 className="h-12 w-12 mx-auto mb-3 text-emerald-500" />
                  <p className="font-semibold text-emerald-700">You're already qualified!</p>
                  <p className="text-sm text-emerald-600 mt-1">
                    Your current skills cover all requirements for {targetLabel}.
                  </p>
                </CardContent>
              </Card>
            )}

            {gapSkills.length > 0 && (
              <>
                {/* View toggle */}
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    {currentLabel || 'Current'} → {targetLabel}
                  </h2>
                  <div className="flex gap-1 border rounded-lg p-0.5">
                    <button
                      onClick={() => setView('list')}
                      className={`px-3 py-1 text-xs rounded-md transition-colors ${view === 'list' ? 'bg-primary text-white' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                      Skill List
                    </button>
                    <button
                      onClick={() => setView('timeline')}
                      className={`px-3 py-1 text-xs rounded-md transition-colors ${view === 'timeline' ? 'bg-primary text-white' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                      Timeline
                    </button>
                  </div>
                </div>

                {/* List view */}
                {view === 'list' && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-rose-500" />
                        Skills to Acquire ({gapSkills.length})
                        <Badge className="text-xs bg-rose-100 text-rose-700 ml-1">
                          Sorted by demand
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {[...gapSkills]
                        .sort((a, b) => {
                          const order = { high: 0, medium: 1, low: 2 };
                          return order[a.demand] - order[b.demand];
                        })
                        .map((item, i) => (
                          <GapSkillCard
                            key={item.skill}
                            item={item}
                            index={i}
                            expanded={expanded === item.skill}
                            onToggle={() => setExpanded(expanded === item.skill ? null : item.skill)}
                          />
                        ))}
                    </CardContent>
                  </Card>
                )}

                {/* Timeline view */}
                {view === 'timeline' && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Clock className="h-4 w-4 text-amber-500" />
                        Learning Timeline
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <LearningTimeline
                        gapSkills={gapSkills}
                        currentRole={currentLabel}
                        targetRole={targetLabel}
                      />
                    </CardContent>
                  </Card>
                )}

                {/* Already matched skills */}
                {matchedCount > 0 && (
                  <Card className="border-emerald-200">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        Already Have ({matchedCount} skills)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-1.5">
                        {targetSkills
                          .filter(s => currentSkills.map(c => c.toLowerCase()).includes(s.toLowerCase()))
                          .map(s => (
                            <Badge key={s} className="text-xs bg-emerald-100 text-emerald-700 border-emerald-200 capitalize">
                              <CheckCircle2 className="h-2.5 w-2.5 mr-1" />{s}
                            </Badge>
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
