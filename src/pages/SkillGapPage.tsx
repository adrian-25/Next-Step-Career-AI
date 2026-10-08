import { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  ArrowRight, BookOpen, ExternalLink, Target, TrendingUp,
  Zap, Clock, Star, ChevronDown, ChevronUp, Lightbulb,
  CheckCircle2, AlertCircle, Layers, FileText, Loader2, Upload, X,
} from 'lucide-react';
import { getDataset } from '@/ai/ml/rolePredictor';
import { getResourcesForSkill } from '@/data/learningResources';
import { ResumeIntelligenceService } from '@/services/resumeIntelligence.service';

// ── Types ──────────────────────────────────────────────────────────────────────

interface GapSkill {
  skill: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedHours: number;
  demand: 'high' | 'medium' | 'low';
  freeUrl?: string;
  paidUrl?: string;
}

// ── Config ─────────────────────────────────────────────────────────────────────

const DIFF_CONFIG: Record<string, { bg: string; border: string; text: string }> = {
  beginner:     { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400' },
  intermediate: { bg: 'bg-amber-500/10',   border: 'border-amber-500/30',   text: 'text-amber-400' },
  advanced:     { bg: 'bg-rose-500/10',    border: 'border-rose-500/30',    text: 'text-rose-400' },
};

const DEMAND_CONFIG: Record<string, { bg: string; text: string }> = {
  high:   { bg: 'bg-rose-500/10',   text: 'text-rose-400' },
  medium: { bg: 'bg-amber-500/10',  text: 'text-amber-400' },
  low:    { bg: 'bg-white/[0.06]',  text: 'text-white/40' },
};

// ── Animations ─────────────────────────────────────────────────────────────────

const pageVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } },
};
const cardVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.04, duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

// ── Helpers ────────────────────────────────────────────────────────────────────

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

function estimateDifficulty(skill: string): GapSkill['difficulty'] {
  const advanced = ['kubernetes', 'mlops', 'deep learning', 'tensorflow', 'pytorch', 'spark', 'kafka', 'terraform', 'ansible'];
  const beginner = ['html', 'css', 'git', 'sql', 'bash', 'linux', 'agile', 'scrum'];
  const s = skill.toLowerCase();
  if (advanced.some(a => s.includes(a))) return 'advanced';
  if (beginner.some(b => s.includes(b))) return 'beginner';
  return 'intermediate';
}

function stableOffset(value: string, range: number): number {
  return [...value].reduce((hash, char) => (hash * 31 + char.charCodeAt(0)) % range, 0);
}

function estimateHours(skill: string, difficulty: GapSkill['difficulty']): number {
  if (difficulty === 'beginner')     return 10 + stableOffset(skill, 20);
  if (difficulty === 'intermediate') return 30 + stableOffset(skill, 40);
  return 60 + stableOffset(skill, 80);
}

function estimateDemand(skill: string): GapSkill['demand'] {
  const high = ['python', 'javascript', 'typescript', 'react', 'aws', 'docker', 'kubernetes', 'machine learning', 'sql', 'node.js'];
  const s = skill.toLowerCase();
  if (high.some(h => s.includes(h))) return 'high';
  return stableOffset(skill, 3) ? 'medium' : 'low';
}

function buildGapSkills(missing: string[]): GapSkill[] {
  return missing.map(skill => {
    const difficulty = estimateDifficulty(skill);
    const res = getResourcesForSkill(skill);
    return { skill, difficulty, estimatedHours: estimateHours(skill, difficulty), demand: estimateDemand(skill), freeUrl: res.free?.url, paidUrl: res.paid?.url };
  });
}

// ── Skill card ─────────────────────────────────────────────────────────────────

function GapSkillCard({ item, index, expanded, onToggle }: {
  item: GapSkill; index: number; expanded: boolean; onToggle: () => void;
}) {
  const diff   = DIFF_CONFIG[item.difficulty]   ?? DIFF_CONFIG.intermediate;
  const demand = DEMAND_CONFIG[item.demand]       ?? DEMAND_CONFIG.low;

  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      className="rounded-xl border border-white/[0.07] overflow-hidden"
      style={{ background: 'rgba(255,255,255,0.02)' }}
    >
      <motion.button
        className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-white/[0.03] transition-colors"
        onClick={onToggle}
        whileTap={{ scale: 0.995 }}
      >
        <div className="w-7 h-7 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-display text-xs font-bold flex items-center justify-center shrink-0">
          {index + 1}
        </div>
        <span className="flex-1 font-display text-sm font-semibold text-white capitalize">{item.skill}</span>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className={`font-sans text-xs px-2 py-0.5 rounded-full border ${diff.bg} ${diff.border} ${diff.text}`}>
            {item.difficulty}
          </span>
          <span className={`font-sans text-xs px-2 py-0.5 rounded-full ${demand.bg} ${demand.text}`}>
            {item.demand} demand
          </span>
          <span className="font-sans text-xs text-white/30 flex items-center gap-1 ml-1">
            <Clock className="h-3 w-3" /> ~{item.estimatedHours}h
          </span>
          <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown className="h-4 w-4 text-white/25 ml-1" />
          </motion.div>
        </div>
      </motion.button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-2 border-t border-white/[0.06] space-y-3">
              <p className="font-sans text-xs text-white/40">
                Estimated learning time: <span className="text-white/70 font-medium">{item.estimatedHours} hours</span>{' '}
                ({item.difficulty} level)
              </p>
              <div className="flex gap-2 flex-wrap">
                {item.freeUrl && (
                  <a href={item.freeUrl} target="_blank" rel="noopener noreferrer">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button size="sm" variant="outline"
                        className="font-sans h-7 text-xs gap-1 border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10 rounded-lg">
                        <BookOpen className="h-3 w-3" /> Free Resource
                      </Button>
                    </motion.div>
                  </a>
                )}
                {item.paidUrl && (
                  <a href={item.paidUrl} target="_blank" rel="noopener noreferrer">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button size="sm" variant="outline"
                        className="font-sans h-7 text-xs gap-1 border-violet-500/30 text-violet-400 hover:bg-violet-500/10 rounded-lg">
                        <ExternalLink className="h-3 w-3" /> Premium Course
                      </Button>
                    </motion.div>
                  </a>
                )}
                {!item.freeUrl && !item.paidUrl && (
                  <a href={`https://www.google.com/search?q=learn+${encodeURIComponent(item.skill)}+tutorial`}
                    target="_blank" rel="noopener noreferrer">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button size="sm" variant="outline"
                        className="font-sans h-7 text-xs gap-1 border-white/[0.08] text-white/45 hover:text-white rounded-lg">
                        <ExternalLink className="h-3 w-3" /> Search Resources
                      </Button>
                    </motion.div>
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

// ── Timeline ───────────────────────────────────────────────────────────────────

function LearningTimeline({ gapSkills, currentRole, targetRole }: {
  gapSkills: GapSkill[]; currentRole: string; targetRole: string;
}) {
  const phase1 = gapSkills.filter(s => s.difficulty === 'beginner');
  const phase2 = gapSkills.filter(s => s.difficulty === 'intermediate');
  const phase3 = gapSkills.filter(s => s.difficulty === 'advanced');

  const phases = [
    { label: 'Phase 1 — Foundation', skills: phase1, leftColor: 'border-l-emerald-500', bg: 'bg-emerald-500/5 border-emerald-500/20', badge: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400', weeks: '2–4 weeks' },
    { label: 'Phase 2 — Core Skills', skills: phase2, leftColor: 'border-l-indigo-500', bg: 'bg-indigo-500/5 border-indigo-500/20', badge: 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400', weeks: '4–8 weeks' },
    { label: 'Phase 3 — Advanced',    skills: phase3, leftColor: 'border-l-violet-500', bg: 'bg-violet-500/5 border-violet-500/20', badge: 'bg-violet-500/10 border-violet-500/30 text-violet-400', weeks: '8–16 weeks' },
  ].filter(p => p.skills.length > 0);

  const totalHours = gapSkills.reduce((s, g) => s + g.estimatedHours, 0);
  const totalWeeks = Math.ceil(totalHours / 10);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap font-sans text-sm">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white/[0.05] border border-white/[0.08] rounded-full text-white/55">
          <Layers className="h-4 w-4" /> {currentRole || 'Current Role'}
        </div>
        <ArrowRight className="h-4 w-4 text-white/25" />
        <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/25 rounded-full text-indigo-400">
          <Target className="h-4 w-4" /> {targetRole}
        </div>
        <span className="ml-auto font-sans text-xs px-2 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400 flex items-center gap-1">
          <Clock className="h-3 w-3" /> ~{totalWeeks} weeks total
        </span>
      </div>

      {phases.map((phase, i) => (
        <motion.div
          key={phase.label}
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1, duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
          className={`border-l-4 pl-4 py-3 rounded-r-xl border ${phase.leftColor} ${phase.bg}`}
        >
          <div className="flex items-center justify-between mb-2">
            <p className="font-display text-sm font-semibold text-white">{phase.label}</p>
            <div className="flex items-center gap-2">
              <span className={`font-sans text-xs px-2 py-0.5 rounded-full border ${phase.badge}`}>{phase.weeks}</span>
              <span className="font-sans text-xs text-white/35">{phase.skills.length} skills</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {phase.skills.map(s => (
              <span key={s.skill}
                className="font-sans text-xs px-2 py-0.5 rounded-full border border-white/[0.08] bg-white/[0.04] text-white/55 capitalize">
                {s.skill}
              </span>
            ))}
          </div>
        </motion.div>
      ))}

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: phases.length * 0.1 + 0.1 }}
        className="flex items-center gap-3 p-3.5 bg-emerald-500/5 border border-emerald-500/20 rounded-xl"
      >
        <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
        <div>
          <p className="font-display text-sm font-semibold text-emerald-400">Ready for {targetRole}</p>
          <p className="font-sans text-xs text-white/35 mt-0.5">
            After completing all {gapSkills.length} gap skills (~{totalWeeks} weeks)
          </p>
        </div>
      </motion.div>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────────

export function SkillGapPage() {
  const lastRole   = useMemo(getLastRole, []);
  const lastSkills = useMemo(getLastAnalysisSkills, []);

  const [currentRole, setCurrentRole] = useState(lastRole || '');
  const [targetRole, setTargetRole]   = useState('');
  const [expanded, setExpanded]       = useState<string | null>(null);
  const [view, setView]               = useState<'list' | 'timeline'>('list');
  const [resumeSkills, setResumeSkills] = useState<string[]>([]);
  const [resumeFileName, setResumeFileName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const currentSkills = useMemo(() => {
    if (resumeSkills.length > 0) return resumeSkills;
    if (lastSkills.length > 0 && currentRole === lastRole) return lastSkills;
    return getSkillsForRole(currentRole);
  }, [currentRole, lastRole, lastSkills, resumeSkills]);

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
    ? Math.round(matchedCount / targetSkills.length * 100) : 0;
  const totalHours = gapSkills.reduce((s, g) => s + g.estimatedHours, 0);
  const highDemand = gapSkills.filter(g => g.demand === 'high').length;

  const currentLabel = ROLES.find(r => r.key === currentRole)?.label ?? currentRole;
  const targetLabel  = ROLES.find(r => r.key === targetRole)?.label ?? targetRole;

  async function handleResumeUpload(file?: File) {
    if (!file) return;
    setUploading(true);
    setUploadError('');
    try {
      const result = await ResumeIntelligenceService.analyzeResume({
        file,
        userId: 'skill-gap-upload',
        targetRole: targetRole || undefined,
        saveToDatabase: false,
      });
      const skills = result.analysis?.parsedResume.skills.filter(Boolean) ?? [];
      if (!result.success || skills.length === 0) throw new Error(result.error || 'No skills could be extracted from this resume.');
      setResumeSkills([...new Set(skills)]);
      setResumeFileName(file.name);
    } catch (error) {
      setResumeSkills([]);
      setResumeFileName('');
      setUploadError(error instanceof Error ? error.message : 'Could not process this resume.');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  return (
    <motion.div
      className="page-content max-w-5xl space-y-5"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center">
          <Zap className="h-4 w-4 text-indigo-400" />
        </div>
        <div>
          <h1 className="font-display text-xl font-bold text-white">Skill Gap Analyzer</h1>
          <p className="font-sans text-sm text-white/40">
            Compare your current skills against a target role and get a personalised learning plan.
          </p>
        </div>
      </motion.div>

      {/* Resume input + role selectors */}
      <motion.div variants={itemVariants} className="rounded-2xl border border-white/[0.07] p-5" style={{ background: 'rgba(255,255,255,0.02)' }}>
        <div className="mb-5 p-4 rounded-xl border border-dashed border-indigo-500/30 bg-indigo-500/[0.04] flex flex-wrap items-center gap-3">
          <input ref={inputRef} type="file" accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain" className="hidden" onChange={event => void handleResumeUpload(event.target.files?.[0])} />
          <div className="w-9 h-9 rounded-xl bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center"><FileText className="h-4 w-4 text-indigo-400" /></div>
          <div className="flex-1 min-w-[190px]">
            <p className="font-display text-sm font-semibold text-white">Use skills from your resume</p>
            <p className="font-sans text-xs text-white/40 mt-0.5">Upload a PDF, DOCX, or TXT resume, then select the target role to compare.</p>
          </div>
          {resumeFileName ? <div className="flex items-center gap-2"><span className="font-sans text-xs text-emerald-400 max-w-[180px] truncate">{resumeFileName} · {resumeSkills.length} skills</span><Button size="icon" variant="ghost" onClick={() => { setResumeSkills([]); setResumeFileName(''); }} aria-label="Remove uploaded resume" className="h-8 w-8 text-white/40 hover:text-white"><X className="h-4 w-4" /></Button></div> : <Button size="sm" onClick={() => inputRef.current?.click()} disabled={uploading} className="gap-1.5 bg-indigo-500 hover:bg-indigo-400 text-white">{uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}{uploading ? 'Reading resume…' : 'Upload resume'}</Button>}
          {uploadError && <p className="basis-full font-sans text-xs text-rose-300">{uploadError}</p>}
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="font-sans text-xs font-semibold text-white/45 mb-1.5 block flex items-center gap-1.5 uppercase tracking-wide">
              <Layers className="h-3.5 w-3.5" /> Current Role
              {(lastRole || resumeFileName) && (
                <span className="ml-1 px-1.5 py-0.5 rounded-full text-xs bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 normal-case tracking-normal">
                  {resumeFileName ? 'Uploaded resume' : 'From resume'}
                </span>
              )}
            </label>
            <select
              value={currentRole}
              onChange={e => setCurrentRole(e.target.value)}
              className="w-full border border-white/[0.08] rounded-xl px-3 py-2 font-sans text-sm bg-white/[0.03] text-white/75 focus:outline-none focus:border-indigo-500/40"
            >
              <option value="">Select current role…</option>
              {ROLES.map(r => <option key={r.key} value={r.key}>{r.label}</option>)}
            </select>
            {resumeSkills.length > 0 ? (
              <p className="font-sans text-xs text-emerald-400 mt-1 flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Using {resumeSkills.length} extracted resume skills</p>
            ) : lastSkills.length > 0 && currentRole === lastRole && (
              <p className="font-sans text-xs text-emerald-400 mt-1 flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" /> Using {lastSkills.length} skills from your resume
              </p>
            )}
          </div>

          <div>
            <label className="font-sans text-xs font-semibold text-white/45 mb-1.5 block flex items-center gap-1.5 uppercase tracking-wide">
              <Target className="h-3.5 w-3.5" /> Target Role
            </label>
            <select
              value={targetRole}
              onChange={e => setTargetRole(e.target.value)}
              className="w-full border border-white/[0.08] rounded-xl px-3 py-2 font-sans text-sm bg-white/[0.03] text-white/75 focus:outline-none focus:border-indigo-500/40"
            >
              <option value="">Select target role…</option>
              {ROLES.filter(r => r.key !== currentRole).map(r => (
                <option key={r.key} value={r.key}>{r.label}</option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      {/* Empty state */}
      <AnimatePresence>
        {!targetRole && (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-center py-16"
          >
            <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mx-auto mb-4">
              <Lightbulb className="h-6 w-6 text-white/20" />
            </div>
            <p className="font-sans text-sm text-white/35">Select a target role to see your skill gap analysis</p>
            <p className="font-sans text-xs text-white/20 mt-1">We'll show you exactly what to learn and how long it'll take</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      <AnimatePresence>
        {targetRole && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="space-y-5"
          >
            {/* KPI row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { value: `${readiness}%`, label: 'Readiness', sub: null, showProgress: true, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/25' },
                { value: matchedCount,    label: 'Skills Matched', sub: `of ${targetSkills.length} required`, showProgress: false, color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/25' },
                { value: gapSkills.length, label: 'Skills to Learn', sub: `${highDemand} high demand`, showProgress: false, color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/25' },
                { value: `~${Math.ceil(totalHours / 10)}w`, label: 'Est. Timeline', sub: `${totalHours}h at 10h/week`, showProgress: false, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/25' },
              ].map((kpi, i) => (
                <motion.div
                  key={kpi.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.06, duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className={`rounded-2xl border p-4 ${kpi.bg} ${kpi.border}`}
                >
                  <p className={`font-display text-3xl font-bold ${kpi.color}`}>{kpi.value}</p>
                  <p className="font-sans text-xs text-white/45 mt-0.5">{kpi.label}</p>
                  {kpi.sub && <p className="font-sans text-xs text-white/30 mt-0.5">{kpi.sub}</p>}
                  {kpi.showProgress && <Progress value={readiness} className="h-1 mt-2 bg-white/[0.07]" />}
                </motion.div>
              ))}
            </div>

            {/* No gap */}
            {gapSkills.length === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 py-10 text-center"
              >
                <CheckCircle2 className="h-12 w-12 mx-auto mb-3 text-emerald-400" />
                <p className="font-display text-lg font-bold text-white">You're already qualified!</p>
                <p className="font-sans text-sm text-white/40 mt-1">
                  Your current skills cover all requirements for {targetLabel}.
                </p>
              </motion.div>
            )}

            {gapSkills.length > 0 && (
              <>
                {/* View toggle */}
                <div className="flex items-center justify-between">
                  <h2 className="font-sans text-xs font-semibold text-white/40 uppercase tracking-widest flex items-center gap-2">
                    <TrendingUp className="h-3.5 w-3.5" />
                    {currentLabel || 'Current'} → {targetLabel}
                  </h2>
                  <div className="flex gap-0.5 border border-white/[0.08] rounded-xl p-0.5">
                    {(['list', 'timeline'] as const).map(v => (
                      <motion.button
                        key={v}
                        onClick={() => setView(v)}
                        whileTap={{ scale: 0.96 }}
                        className={`px-3 py-1 font-sans text-xs rounded-lg transition-colors capitalize ${
                          view === v
                            ? 'bg-indigo-500 text-white'
                            : 'text-white/40 hover:text-white/70'
                        }`}
                      >
                        {v === 'list' ? 'Skill List' : 'Timeline'}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* List view */}
                <AnimatePresence mode="wait">
                  {view === 'list' && (
                    <motion.div
                      key="list"
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      transition={{ duration: 0.25 }}
                      className="rounded-2xl border border-white/[0.07] overflow-hidden"
                      style={{ background: 'rgba(255,255,255,0.02)' }}
                    >
                      <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/[0.06]">
                        <AlertCircle className="h-4 w-4 text-rose-400" />
                        <span className="font-display text-sm font-semibold text-white">
                          Skills to Acquire ({gapSkills.length})
                        </span>
                        <span className="ml-auto font-sans text-xs px-2 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/25 text-rose-400">
                          Sorted by demand
                        </span>
                      </div>
                      <div className="p-3 space-y-2">
                        {[...gapSkills]
                          .sort((a, b) => ({ high: 0, medium: 1, low: 2 }[a.demand] - { high: 0, medium: 1, low: 2 }[b.demand]))
                          .map((item, i) => (
                            <GapSkillCard
                              key={item.skill}
                              item={item}
                              index={i}
                              expanded={expanded === item.skill}
                              onToggle={() => setExpanded(expanded === item.skill ? null : item.skill)}
                            />
                          ))}
                      </div>
                    </motion.div>
                  )}

                  {view === 'timeline' && (
                    <motion.div
                      key="timeline"
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      transition={{ duration: 0.25 }}
                      className="rounded-2xl border border-white/[0.07] p-5"
                      style={{ background: 'rgba(255,255,255,0.02)' }}
                    >
                      <div className="flex items-center gap-2 mb-4">
                        <Clock className="h-4 w-4 text-amber-400" />
                        <span className="font-display text-sm font-semibold text-white">Learning Timeline</span>
                      </div>
                      <LearningTimeline gapSkills={gapSkills} currentRole={currentLabel} targetRole={targetLabel} />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Already matched */}
                {matchedCount > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.35 }}
                    className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      <span className="font-display text-sm font-semibold text-white">
                        Already Have ({matchedCount} skills)
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {targetSkills
                        .filter(s => currentSkills.map(c => c.toLowerCase()).includes(s.toLowerCase()))
                        .map(s => (
                          <span key={s}
                            className="font-sans text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 capitalize flex items-center gap-1">
                            <CheckCircle2 className="h-2.5 w-2.5" />{s}
                          </span>
                        ))}
                    </div>
                  </motion.div>
                )}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
