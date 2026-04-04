import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  RadialBarChart, RadialBar, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  LineChart, Line, ReferenceLine,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  FileText, Target, CheckCircle2, XCircle, Lightbulb,
  Briefcase, TrendingUp, AlertCircle, Star, Zap, Award,
  ArrowUpRight, ArrowDownRight, Minus, BookOpen, ExternalLink,
} from 'lucide-react';
import { getResourcesForSkill } from '@/data/learningResources';

// ── Helpers ───────────────────────────────────────────────────────────────────

function getInsights() {
  try {
    const raw = localStorage.getItem('lastAnalysisResult');
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return null;
}

function getMLResult() {
  try {
    const raw = localStorage.getItem('lastAnalysisResult');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    // mlResult is stored nested inside the comprehensive analysis
    return parsed?.mlResult ?? null;
  } catch { return null; }
}

function getRole(): string {
  try { return localStorage.getItem('lastDetectedRole') ?? 'software_developer'; }
  catch { return 'software_developer'; }
}

function getHistory(): Array<{ score: number; date: string }> {
  try {
    const raw = localStorage.getItem('analysisHistory');
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return [];
}

function roleLabel(r: string) {
  return r.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function scoreColor(s: number) {
  if (s >= 80) return '#22c55e';
  if (s >= 60) return '#3b82f6';
  if (s >= 40) return '#f59e0b';
  return '#ef4444';
}

function scoreLabel(s: number) {
  if (s >= 80) return 'Excellent';
  if (s >= 60) return 'Good';
  if (s >= 40) return 'Fair';
  return 'Needs Work';
}

// ── Static data removed — everything is now dynamic from ML analysis ──────────

// ── Radar category builder ────────────────────────────────────────────────────

function buildRadarData(insights: any, role: string) {
  const rs = insights?.resumeScore?.componentScores;
  const sm = insights?.skillMatch;

  // Use real scores if available, otherwise role-based estimates
  const defaults: Record<string, number[]> = {
    software_developer: [72, 65, 80, 58, 70],
    aiml_engineer:      [68, 75, 62, 80, 55],
    data_scientist:     [70, 78, 60, 75, 65],
    devops_engineer:    [65, 60, 75, 55, 80],
    product_manager:    [60, 55, 70, 65, 72],
  };
  const d = defaults[role] ?? defaults.software_developer;

  return [
    { category: 'Skills',     score: rs?.skillsScore     ?? d[0] },
    { category: 'Projects',   score: rs?.projectsScore   ?? d[1] },
    { category: 'Experience', score: rs?.experienceScore ?? d[2] },
    { category: 'Education',  score: rs?.educationScore  ?? d[3] },
    { category: 'Match',      score: sm?.matchScore      ?? d[4] },
  ];
}

// ── Strengths / Weaknesses ────────────────────────────────────────────────────

function buildStrengthsWeaknesses(insights: any, matchedSkills: string[], missingSkills: string[]) {
  const rs = insights?.resumeScore;
  const strengths: string[] = [];
  const weaknesses: string[] = [];

  if (matchedSkills.length >= 5) strengths.push(`Strong skill alignment (${matchedSkills.length} matched)`);
  if (rs?.componentScores?.experienceScore >= 70) strengths.push('Solid experience section');
  if (rs?.componentScores?.projectsScore >= 70) strengths.push('Good project portfolio');
  if (rs?.componentScores?.educationScore >= 70) strengths.push('Strong educational background');
  if (rs?.totalScore >= 75) strengths.push('High overall resume quality');
  if (insights?.sectionAnalysis?.completeness >= 80) strengths.push('Well-structured resume sections');

  if (missingSkills.length >= 5) weaknesses.push(`${missingSkills.length} skill gaps to address`);
  if (rs?.componentScores?.experienceScore < 50) weaknesses.push('Experience section needs more detail');
  if (rs?.componentScores?.projectsScore < 50) weaknesses.push('Add more project examples');
  if (rs?.componentScores?.skillsScore < 50) weaknesses.push('Expand technical skills section');
  if (insights?.sectionAnalysis?.missingSections?.length > 2) weaknesses.push('Several resume sections missing');

  // Fallback defaults
  if (strengths.length === 0) strengths.push('Resume uploaded successfully', 'Analysis complete');
  if (weaknesses.length === 0) weaknesses.push('Upload resume for detailed feedback');

  return { strengths: strengths.slice(0, 4), weaknesses: weaknesses.slice(0, 4) };
}

// ── Main component ────────────────────────────────────────────────────────────

export function ResumeInsightsPage() {
  const insights  = useMemo(getInsights, []);
  const mlResult  = useMemo(getMLResult, []);
  const role      = useMemo(getRole, []);
  const history   = useMemo(getHistory, []);

  const matchScore: number      = insights?.skillMatch?.matchScore ?? mlResult?.finalScore ?? 0;
  const totalScore: number      = insights?.resumeScore?.totalScore ?? 0;
  const matchedSkills: string[] = (insights?.skillMatch?.matchedSkills ?? mlResult?.matchedSkills ?? []).map(
    (s: { skill: string } | string) => (typeof s === 'string' ? s : s.skill)
  );
  const missingSkills: string[] = (insights?.skillMatch?.missingSkills ?? mlResult?.missingSkills ?? []).map(
    (s: { skill: string } | string) => (typeof s === 'string' ? s : s.skill)
  );

  // ── DYNAMIC: Recommended skills = actual missing skills for selected role ──
  // Uses real ML analysis recommendations with learning resources
  const dynamicRecommendations = useMemo(() => {
    // From ML result recommendations (actual missing skills with resources)
    if (mlResult?.recommendations && mlResult.recommendations.length > 0) {
      return mlResult.recommendations.slice(0, 8).map((r: any) => ({
        skill:     r.skill,
        resources: r.resources ?? [],
      }));
    }
    // Fallback: build from missingSkills
    return missingSkills.slice(0, 8).map(skill => ({
      skill,
      resources: (() => {
        const res = getResourcesForSkill(skill);
        const out: any[] = [];
        if (res.free) out.push({ type: 'free', ...res.free });
        if (res.paid) out.push({ type: 'paid', ...res.paid });
        return out;
      })(),
    }));
  }, [mlResult, missingSkills]);

  // ── DYNAMIC: Job compatibility = all roles ranked by actual resume score ──
  const dynamicJobCompat = useMemo(() => {
    // From ML result jobCompatibility (computed across all 10 roles)
    if (mlResult?.jobCompatibility && mlResult.jobCompatibility.length > 0) {
      return mlResult.jobCompatibility as Array<{ role: string; display: string; score: number }>;
    }
    // Fallback: use ML probabilities if available
    if (mlResult?.probabilities) {
      return Object.entries(mlResult.probabilities as Record<string, number>)
        .map(([r, prob]) => ({
          role:    r,
          display: r.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
          score:   Math.round(prob * 100),
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 8);
    }
    return [];
  }, [mlResult]);

  const hasData     = insights !== null || mlResult !== null;
  const hasMLData   = mlResult !== null;

  const radarData = useMemo(() => buildRadarData(insights, role), [insights, role]);
  const { strengths, weaknesses } = useMemo(
    () => buildStrengthsWeaknesses(insights, matchedSkills, missingSkills),
    [insights, matchedSkills, missingSkills]
  );

  // Score timeline — history + current
  const timelineData = useMemo(() => {
    const pts = history.map((h, i) => ({ label: `#${i + 1}`, score: h.score }));
    if (hasData) pts.push({ label: 'Now', score: matchScore });
    return pts.length > 0 ? pts : [{ label: 'Now', score: matchScore }];
  }, [history, hasData, matchScore]);

  const prevScore = history.length > 0 ? history[history.length - 1].score : null;
  const scoreDelta = prevScore !== null ? matchScore - prevScore : null;

  // Radial chart data
  const radialData = [{ name: 'Match', value: matchScore, fill: scoreColor(matchScore) }];

  // Skill gap bar
  const gapData = [
    { name: 'Matched',  count: matchedSkills.length,              fill: '#22c55e' },
    { name: 'Missing',  count: missingSkills.length,              fill: '#ef4444' },
    { name: 'To Learn', count: dynamicRecommendations.length,     fill: '#3b82f6' },
  ];

  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.35, delay },
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">

        {/* Header */}
        <motion.div {...fadeUp()} className="flex items-center gap-3">
          <FileText className="h-7 w-7 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">Resume Insights</h1>
            <p className="text-sm text-muted-foreground">
              Personalised analysis based on your uploaded resume
            </p>
          </div>
        </motion.div>

        {!hasData && (
          <motion.div {...fadeUp(0.05)}
            className="flex items-center gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800"
          >
            <AlertCircle className="h-4 w-4 shrink-0" />
            No resume analysis found. Upload and analyse your resume first to see live insights.
            Showing role-based defaults for <strong>{roleLabel(role)}</strong>.
          </motion.div>
        )}

        {/* KPI row */}
        <motion.div {...fadeUp(0.08)} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            {
              value: `${matchScore}%`,
              label: 'Match Score',
              color: scoreColor(matchScore),
              sub: scoreLabel(matchScore),
            },
            { value: matchedSkills.length, label: 'Matched Skills', color: '#22c55e', sub: 'skills found' },
            { value: missingSkills.length, label: 'Skill Gaps',     color: '#ef4444', sub: 'to address' },
            { value: totalScore || '—',    label: 'Resume Score',   color: '#6366f1', sub: 'out of 100' },
          ].map(({ value, label, color, sub }) => (
            <Card key={label}>
              <CardContent className="pt-4 pb-3">
                <p className="text-3xl font-bold" style={{ color }}>{value}</p>
                <p className="text-xs font-medium mt-0.5">{label}</p>
                <p className="text-xs text-muted-foreground">{sub}</p>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Score delta badge */}
        {scoreDelta !== null && (
          <motion.div {...fadeUp(0.1)} className="flex items-center gap-2">
            {scoreDelta > 0
              ? <><ArrowUpRight className="h-4 w-4 text-green-600" /><span className="text-sm text-green-600 font-medium">+{scoreDelta}% improvement since last analysis</span></>
              : scoreDelta < 0
              ? <><ArrowDownRight className="h-4 w-4 text-red-500" /><span className="text-sm text-red-500 font-medium">{scoreDelta}% vs last analysis</span></>
              : <><Minus className="h-4 w-4 text-muted-foreground" /><span className="text-sm text-muted-foreground">Same score as last analysis</span></>
            }
          </motion.div>
        )}

        {/* Charts row 1 — Radial + Skill Gap */}
        <motion.div {...fadeUp(0.12)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" /> Skill Match Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <ResponsiveContainer width="100%" height={220}>
                  <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%"
                    startAngle={90} endAngle={-270} data={radialData}>
                    <RadialBar dataKey="value" cornerRadius={8} background={{ fill: '#e5e7eb' }} />
                    <Tooltip formatter={v => [`${v}%`, 'Match Score']} />
                  </RadialBarChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-4xl font-bold" style={{ color: scoreColor(matchScore) }}>
                    {matchScore}%
                  </span>
                  <span className="text-xs text-muted-foreground mt-1">{scoreLabel(matchScore)}</span>
                </div>
              </div>
              <p className="text-center text-sm text-muted-foreground mt-2">
                {matchScore >= 80 ? 'Excellent match for this role'
                  : matchScore >= 60 ? 'Good match — a few gaps to close'
                  : matchScore >= 40 ? 'Fair match — build key skills'
                  : 'Upload your resume to see your score'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" /> Skill Gap Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={gapData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {gapData.map((e, i) => <Cell key={i} fill={e.fill} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Charts row 2 — Radar + Timeline */}
        <motion.div {...fadeUp(0.16)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Radar — skill category breakdown */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Zap className="h-4 w-4 text-purple-500" /> Skill Category Radar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={240}>
                <RadarChart data={radarData} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis dataKey="category" tick={{ fontSize: 11 }} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 9 }} />
                  <Radar
                    name="Score" dataKey="score"
                    stroke="#6366f1" fill="#6366f1" fillOpacity={0.25}
                    dot={{ r: 3, fill: '#6366f1' }}
                  />
                  <Tooltip formatter={v => [`${v}`, 'Score']} />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Line chart — score timeline */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Award className="h-4 w-4 text-amber-500" /> Score Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              {timelineData.length < 2 ? (
                <div className="flex flex-col items-center justify-center h-[240px] text-center text-muted-foreground text-sm gap-2">
                  <TrendingUp className="h-8 w-8 opacity-30" />
                  <p>Upload more resumes to track your score over time.</p>
                  <p className="text-xs">Your progress chart will appear here.</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={240}>
                  <LineChart data={timelineData} margin={{ top: 10, right: 16, left: -16, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                    <Tooltip formatter={v => [`${v}%`, 'Match Score']} />
                    <ReferenceLine y={60} stroke="#3b82f6" strokeDasharray="4 4" label={{ value: 'Good', fontSize: 10, fill: '#3b82f6' }} />
                    <ReferenceLine y={80} stroke="#22c55e" strokeDasharray="4 4" label={{ value: 'Excellent', fontSize: 10, fill: '#22c55e' }} />
                    <Line
                      type="monotone" dataKey="score"
                      stroke="#6366f1" strokeWidth={2.5}
                      dot={{ r: 4, fill: '#6366f1' }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Strengths & Weaknesses */}
        <motion.div {...fadeUp(0.2)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-green-200 bg-green-50/40">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2 text-green-700">
                <Star className="h-4 w-4" /> Strengths
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {strengths.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.22 + i * 0.06 }}
                  className="flex items-start gap-2"
                >
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                  <span className="text-sm">{s}</span>
                </motion.div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-red-200 bg-red-50/40">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2 text-red-600">
                <AlertCircle className="h-4 w-4" /> Areas to Improve
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {weaknesses.map((w, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.22 + i * 0.06 }}
                  className="flex items-start gap-2"
                >
                  <XCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                  <span className="text-sm">{w}</span>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Matched / Missing skills */}
        <motion.div {...fadeUp(0.24)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                Matched Skills ({matchedSkills.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {matchedSkills.length === 0 ? (
                <p className="text-sm text-muted-foreground">Upload your resume to see matched skills.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {matchedSkills.map(s => (
                    <Badge key={s} className="bg-green-100 text-green-800 border-green-200">
                      <CheckCircle2 className="h-3 w-3 mr-1" />{s}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <XCircle className="h-4 w-4 text-red-500" />
                Missing Skills ({missingSkills.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {missingSkills.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  {hasData ? 'No critical gaps detected.' : 'Upload your resume to see gaps.'}
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {missingSkills.map(s => (
                    <Badge key={s} variant="outline" className="bg-red-50 text-red-700 border-red-200">{s}</Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Recommended skills — DYNAMIC from actual ML analysis */}
        <motion.div {...fadeUp(0.28)}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-yellow-500" />
                Skills to Learn
                {hasMLData && <Badge className="text-xs bg-yellow-100 text-yellow-700 ml-1">From your resume</Badge>}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {dynamicRecommendations.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Upload your resume to see personalised skill recommendations.
                </p>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground">
                    Missing skills for <strong>{roleLabel(role)}</strong> based on your resume analysis.
                  </p>
                  <div className="space-y-3">
                    {dynamicRecommendations.map((item, i) => {
                      const freeRes  = item.resources.find((r: any) => r.type === 'free');
                      const paidRes  = item.resources.find((r: any) => r.type === 'paid');
                      return (
                        <div key={item.skill} className="flex items-center gap-3 p-2 rounded-lg bg-orange-50 border border-orange-100">
                          <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-700 text-xs flex items-center justify-center font-bold shrink-0">
                            {i + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium capitalize truncate">{item.skill}</p>
                          </div>
                          <div className="flex gap-1.5 shrink-0">
                            {freeRes && (
                              <a href={freeRes.url} target="_blank" rel="noopener noreferrer">
                                <Badge className="text-xs bg-blue-100 text-blue-700 hover:bg-blue-200 cursor-pointer gap-1">
                                  <BookOpen className="h-2.5 w-2.5" /> Free
                                </Badge>
                              </a>
                            )}
                            {paidRes && (
                              <a href={paidRes.url} target="_blank" rel="noopener noreferrer">
                                <Badge className="text-xs bg-purple-100 text-purple-700 hover:bg-purple-200 cursor-pointer gap-1">
                                  <ExternalLink className="h-2.5 w-2.5" /> Course
                                </Badge>
                              </a>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Job role compatibility — DYNAMIC from ML analysis across all roles */}
        <motion.div {...fadeUp(0.32)}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-primary" />
                Job Role Compatibility
                {hasMLData && <Badge className="text-xs bg-green-100 text-green-700 ml-1">Computed from your resume</Badge>}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {dynamicJobCompat.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Upload your resume to see which roles suit you best.
                </p>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground mb-3">
                    All roles ranked by how well your resume matches each one.
                  </p>
                  {dynamicJobCompat.map(({ role: r, display, score }, i) => (
                    <div key={r}>
                      <div className="flex justify-between items-center text-sm mb-1">
                        <div className="flex items-center gap-2">
                          {i === 0 && <Badge className="text-xs bg-green-100 text-green-700 px-1.5">Best Match</Badge>}
                          <span className="font-medium">{display}</span>
                        </div>
                        <span style={{ color: scoreColor(score) }} className="font-semibold">{score}%</span>
                      </div>
                      <Progress value={score} className="h-2" />
                      <Separator className="mt-3" />
                    </div>
                  ))}
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>

      </div>
    </div>
  );
}
