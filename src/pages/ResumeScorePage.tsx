import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  RadialBarChart, RadialBar, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Award, CheckCircle2, XCircle, AlertCircle, ArrowRight,
  FileText, Briefcase, GraduationCap, Code2, Lightbulb,
  TrendingUp, Star, Zap, RotateCcw, Download,
} from 'lucide-react';
import { downloadLastAnalysisReport } from '@/services/resumeExport.service';

// ── Helpers ───────────────────────────────────────────────────────────────────

function getStoredAnalysis() {
  try {
    const raw = localStorage.getItem('lastAnalysisResult');
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function getMLResult() {
  try {
    const raw = localStorage.getItem('lastAnalysisResult');
    if (!raw) return null;
    return JSON.parse(raw)?.mlResult ?? null;
  } catch { return null; }
}

function getRole(): string {
  try { return localStorage.getItem('lastDetectedRole') ?? 'software_developer'; }
  catch { return 'software_developer'; }
}

function scoreColor(s: number): string {
  if (s >= 80) return '#22c55e';
  if (s >= 60) return '#3b82f6';
  if (s >= 40) return '#f59e0b';
  return '#ef4444';
}

function scoreLabel(s: number): string {
  if (s >= 80) return 'Excellent';
  if (s >= 60) return 'Good';
  if (s >= 40) return 'Fair';
  return 'Needs Work';
}

function scoreBg(s: number): string {
  if (s >= 80) return 'border-green-200 bg-green-50 text-green-700';
  if (s >= 60) return 'border-blue-200 bg-blue-50 text-blue-700';
  if (s >= 40) return 'border-amber-200 bg-amber-50 text-amber-700';
  return 'border-red-200 bg-red-50 text-red-700';
}

// ── Score ring ────────────────────────────────────────────────────────────────

function ScoreRing({ score, size = 160 }: { score: number; size?: number }) {
  const r = size / 2 - 14;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const color = scoreColor(score);

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e5e7eb" strokeWidth="12" />
        <motion.circle
          cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke={color} strokeWidth="12"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ - dash }}
          transition={{ duration: 1.4, ease: 'easeOut' }}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute text-center">
        <p className="text-4xl font-bold" style={{ color }}>{score}</p>
        <p className="text-xs text-muted-foreground font-medium">/100</p>
      </div>
    </div>
  );
}

// ── Component score card ──────────────────────────────────────────────────────

function ComponentCard({
  label, score, contribution, weight, icon: Icon, delay,
}: {
  label: string; score: number; contribution: number;
  weight: string; icon: React.ElementType; delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <Card className={`border ${scoreBg(score)}`}>
        <CardContent className="pt-4 pb-3">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <Icon className="h-4 w-4" />
              <span className="text-sm font-semibold">{label}</span>
            </div>
            <Badge className="text-xs bg-white/60 border-current">{weight}</Badge>
          </div>
          <p className="text-3xl font-bold mb-1">{score}</p>
          <Progress value={score} className="h-1.5 mb-1" />
          <p className="text-xs opacity-70">Contributes {contribution} pts to total</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ── Recommendation card ───────────────────────────────────────────────────────

function RecommendationCard({ rec, index }: { rec: string; index: number }) {
  const isPositive = rec.toLowerCase().includes('excellent') ||
    rec.toLowerCase().includes('strong') ||
    rec.toLowerCase().includes('good') ||
    rec.toLowerCase().includes('great');

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.05 * index }}
      className={`flex items-start gap-3 p-3 rounded-lg border text-sm ${
        isPositive
          ? 'bg-green-50 border-green-200 text-green-800'
          : 'bg-amber-50 border-amber-200 text-amber-800'
      }`}
    >
      {isPositive
        ? <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-green-600" />
        : <Lightbulb className="h-4 w-4 shrink-0 mt-0.5 text-amber-600" />
      }
      <span>{rec}</span>
    </motion.div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export function ResumeScorePage() {
  const navigate  = useNavigate();
  const analysis  = useMemo(getStoredAnalysis, []);
  const mlResult  = useMemo(getMLResult, []);
  const role      = useMemo(getRole, []);

  const hasData = analysis !== null || mlResult !== null;

  // Extract scores
  const totalScore: number = analysis?.resumeScore?.totalScore ?? 0;
  const cs = analysis?.resumeScore?.componentScores ?? {};
  const bd = analysis?.resumeScore?.breakdown ?? {};
  const recs: string[] = analysis?.resumeScore?.recommendations ?? [];
  const qualityFlag: string = analysis?.resumeScore?.qualityFlag ?? (totalScore >= 80 ? 'excellent' : totalScore >= 60 ? 'competitive' : 'needs_improvement');

  const skillsScore      = cs.skillsScore      ?? mlResult?.mlScore      ?? 0;
  const projectsScore    = cs.projectsScore    ?? 0;
  const experienceScore  = cs.experienceScore  ?? 0;
  const educationScore   = cs.educationScore   ?? 0;

  const skillsContrib     = bd.skillsContribution     ?? Math.round(skillsScore * 0.40);
  const projectsContrib   = bd.projectsContribution   ?? Math.round(projectsScore * 0.25);
  const experienceContrib = bd.experienceContribution ?? Math.round(experienceScore * 0.20);
  const educationContrib  = bd.educationContribution  ?? Math.round(educationScore * 0.15);

  const factors = bd.factors ?? {};

  // ML scores from mlResult
  const mlScore    = mlResult?.mlScore    ?? 0;
  const fuzzyScore = mlResult?.fuzzyScore ?? 0;
  const finalScore = mlResult?.finalScore ?? 0;

  const roleLabel = role.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase());

  // Bar chart data
  const componentData = [
    { name: 'Skills',     score: skillsScore,     fill: scoreColor(skillsScore)     },
    { name: 'Projects',   score: projectsScore,   fill: scoreColor(projectsScore)   },
    { name: 'Experience', score: experienceScore, fill: scoreColor(experienceScore) },
    { name: 'Education',  score: educationScore,  fill: scoreColor(educationScore)  },
  ];

  // ML breakdown bar chart
  const mlData = [
    { name: 'ML Score',    value: mlScore,    fill: '#1e40af' },
    { name: 'Fuzzy Score', value: fuzzyScore, fill: '#f59e0b' },
    { name: 'Final Score', value: finalScore, fill: '#10b981' },
  ];

  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.35, delay },
  });

  if (!hasData) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center py-20">
        <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-30" />
        <h1 className="text-2xl font-bold mb-2">No Resume Analyzed Yet</h1>
        <p className="text-muted-foreground mb-6">
          Upload and analyze your resume first to see your detailed score breakdown.
        </p>
        <Button onClick={() => navigate('/resume')} className="gap-2">
          <ArrowRight className="h-4 w-4" /> Analyze My Resume
        </Button>
      </div>
    );
  }

  return (
    <div className="page-content max-w-5xl space-y-8">

      {/* Header */}
      <motion.div {...fadeUp()} className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Award className="h-6 w-6 text-primary" /> Resume Score Breakdown
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Detailed analysis for <span className="font-medium text-foreground">{roleLabel}</span>
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline" size="sm"
            onClick={() => {
              const ok = downloadLastAnalysisReport();
              if (!ok) navigate('/resume');
            }}
            className="gap-1 border-blue-300 text-blue-700 hover:bg-blue-50"
          >
            <Download className="h-3.5 w-3.5" /> Export Report
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigate('/resume')} className="gap-1">
            <RotateCcw className="h-3.5 w-3.5" /> Re-analyze
          </Button>
        </div>
      </motion.div>

      {/* Hero score + quality flag */}
      <motion.div {...fadeUp(0.05)}>
        <Card>
          <CardContent className="pt-6 pb-5">
            <div className="flex flex-col sm:flex-row items-center gap-8">
              <ScoreRing score={totalScore} />
              <div className="flex-1 space-y-3 text-center sm:text-left">
                <div className="flex items-center gap-2 justify-center sm:justify-start flex-wrap">
                  <Badge className={`text-sm px-3 py-1 ${scoreBg(totalScore)}`}>
                    {scoreLabel(totalScore)}
                  </Badge>
                  {qualityFlag === 'excellent' && (
                    <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200 gap-1">
                      <Star className="h-3 w-3" /> Top Candidate
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground text-sm max-w-md">
                  {totalScore >= 80
                    ? 'Your resume is highly competitive. You have strong alignment with the target role.'
                    : totalScore >= 60
                    ? 'Good foundation. A few targeted improvements will make you significantly more competitive.'
                    : totalScore >= 40
                    ? 'Fair match. Focus on the skill gaps and project experience to boost your score.'
                    : 'Upload a more detailed resume or work on the key skill areas to improve your score.'}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                  {[
                    { label: 'Skills',     value: skillsContrib,     color: 'text-blue-600'   },
                    { label: 'Projects',   value: projectsContrib,   color: 'text-purple-600' },
                    { label: 'Experience', value: experienceContrib, color: 'text-emerald-600' },
                    { label: 'Education',  value: educationContrib,  color: 'text-amber-600'  },
                  ].map(({ label, value, color }) => (
                    <div key={label} className="text-center">
                      <p className={`text-xl font-bold ${color}`}>{value}</p>
                      <p className="text-xs text-muted-foreground">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Component score cards */}
      <motion.div {...fadeUp(0.1)}>
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
          <Zap className="h-4 w-4" /> Component Scores
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <ComponentCard label="Skills"     score={skillsScore}     contribution={skillsContrib}     weight="40%" icon={Code2}          delay={0.12} />
          <ComponentCard label="Projects"   score={projectsScore}   contribution={projectsContrib}   weight="25%" icon={Briefcase}      delay={0.16} />
          <ComponentCard label="Experience" score={experienceScore} contribution={experienceContrib} weight="20%" icon={TrendingUp}     delay={0.20} />
          <ComponentCard label="Education"  score={educationScore}  contribution={educationContrib}  weight="15%" icon={GraduationCap}  delay={0.24} />
        </div>
      </motion.div>

      {/* Bar chart comparison */}
      <motion.div {...fadeUp(0.18)} className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" /> Component Comparison
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={componentData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v) => [`${v}`, 'Score']} />
                <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                  {componentData.map((e, i) => <Cell key={i} fill={e.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Zap className="h-4 w-4 text-purple-500" /> ML Score Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            {mlScore > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={mlData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v) => [`${v}%`, '']} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {mlData.map((e, i) => <Cell key={i} fill={e.fill} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-muted-foreground text-sm">
                <div className="text-center">
                  <Zap className="h-8 w-8 mx-auto mb-2 opacity-30" />
                  <p>ML scores available after resume analysis</p>
                </div>
              </div>
            )}
            {mlScore > 0 && (
              <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
                <div>
                  <p className="font-bold text-blue-600">{mlScore}%</p>
                  <p className="text-muted-foreground">TF-IDF</p>
                </div>
                <div>
                  <p className="font-bold text-amber-600">{fuzzyScore}%</p>
                  <p className="text-muted-foreground">Fuzzy</p>
                </div>
                <div>
                  <p className="font-bold text-emerald-600">{finalScore}%</p>
                  <p className="text-muted-foreground">Final</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Scoring factors */}
      {Object.keys(factors).length > 0 && (
        <motion.div {...fadeUp(0.24)}>
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
            <FileText className="h-4 w-4" /> Scoring Factors
          </h2>
          <Card>
            <CardContent className="pt-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  { key: 'matchPercentage',    label: 'Skill Match %',       suffix: '%' },
                  { key: 'matchedSkillCount',  label: 'Skills Matched',      suffix: '' },
                  { key: 'missingSkillCount',  label: 'Skills Missing',      suffix: '' },
                  { key: 'experienceYears',    label: 'Experience (years)',  suffix: 'y' },
                  { key: 'projectCount',       label: 'Projects',            suffix: '' },
                  { key: 'certificationCount', label: 'Certifications',      suffix: '' },
                ].filter(f => factors[f.key] !== undefined).map(({ key, label, suffix }) => (
                  <div key={key} className="text-center p-3 bg-muted/30 rounded-lg">
                    <p className="text-2xl font-bold">{factors[key]}{suffix}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Recommendations */}
      {recs.length > 0 && (
        <motion.div {...fadeUp(0.28)}>
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-yellow-500" /> Recommendations
          </h2>
          <div className="space-y-2">
            {recs.map((rec, i) => (
              <RecommendationCard key={i} rec={rec} index={i} />
            ))}
          </div>
        </motion.div>
      )}

      {/* No recommendations fallback */}
      {recs.length === 0 && (
        <motion.div {...fadeUp(0.28)}>
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-yellow-500" /> Improvement Tips
          </h2>
          <div className="space-y-2">
            {[
              totalScore < 80 && skillsScore < 70  && 'Add more technical skills relevant to your target role',
              totalScore < 80 && projectsScore < 60 && 'Include 2–3 detailed project descriptions with technologies used',
              totalScore < 80 && experienceScore < 60 && 'Expand your experience section with quantified achievements',
              totalScore < 80 && educationScore < 60 && 'Add certifications or relevant coursework to strengthen education',
              totalScore >= 80 && 'Your resume is strong — focus on tailoring it to specific job descriptions',
            ].filter(Boolean).map((tip, i) => (
              <RecommendationCard key={i} rec={tip as string} index={i} />
            ))}
          </div>
        </motion.div>
      )}

      {/* CTA row */}
      <motion.div {...fadeUp(0.32)} className="grid sm:grid-cols-3 gap-3">
        <Button variant="outline" onClick={() => navigate('/skill-gap')} className="gap-2">
          <Zap className="h-4 w-4" /> Skill Gap Analysis
        </Button>
        <Button variant="outline" onClick={() => navigate('/analytics')} className="gap-2">
          <TrendingUp className="h-4 w-4" /> Full Insights
        </Button>
        <Button onClick={() => navigate('/resume')} className="gap-2 bg-primary text-white">
          <RotateCcw className="h-4 w-4" /> Re-analyze Resume
        </Button>
      </motion.div>

    </div>
  );
}
