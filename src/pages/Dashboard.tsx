import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  FileText, Route, MessageSquare, TrendingUp, Users, ArrowRight,
  Sparkles, Target, Database, Briefcase, BarChart3, Bot,
  CheckCircle2, Clock, Zap, Award, Star, Search, Download,
  Trophy, GitBranch, Layers,
} from 'lucide-react';import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { getAnalyticsOverview, checkBackendHealth, downloadUserBackup } from '@/services/backendApi.service';
import { downloadLastAnalysisReport } from '@/services/resumeExport.service';

// ── Helpers ───────────────────────────────────────────────────────────────────

function getLastAnalysis() {
  try {
    const raw = localStorage.getItem('lastAnalysisResult');
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function getHistory(): Array<{ score: number; date: string }> {
  try {
    const raw = localStorage.getItem('analysisHistory');
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function getRole(): string {
  try { return localStorage.getItem('lastDetectedRole') ?? ''; }
  catch { return ''; }
}

function roleLabel(r: string) {
  return r ? r.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : 'Not set';
}

function scoreColor(s: number) {
  if (s >= 80) return 'text-green-600';
  if (s >= 60) return 'text-blue-600';
  if (s >= 40) return 'text-amber-500';
  return 'text-red-500';
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

// ── Quick actions ─────────────────────────────────────────────────────────────

const QUICK_ACTIONS = [
  { title: 'Resume Analyzer',   desc: 'Upload & analyze your resume',         icon: FileText,      href: '/resume',                gradient: 'from-indigo-500 to-purple-600' },
  { title: 'Resume Score',      desc: 'Detailed score breakdown & tips',       icon: Award,         href: '/score',                 gradient: 'from-amber-500 to-orange-500' },
  { title: 'Resume Insights',   desc: 'View charts & skill breakdown',         icon: BarChart3,     href: '/analytics',             gradient: 'from-blue-500 to-cyan-500' },
  { title: 'Job Matching',      desc: 'Compare resume vs job description',     icon: Briefcase,     href: '/job-matching',          gradient: 'from-emerald-500 to-teal-500' },
  { title: 'Skill Gap',         desc: 'Current → target role learning plan',   icon: Layers,        href: '/skill-gap',             gradient: 'from-violet-500 to-purple-600' },
  { title: 'Resume Ranking',    desc: 'Rank multiple resumes for a role',      icon: Trophy,        href: '/ranking',               gradient: 'from-yellow-500 to-orange-500' },
  { title: 'Search Resumes',    desc: 'Full-text search with PostgreSQL FTS',  icon: Search,        href: '/search',                gradient: 'from-sky-500 to-blue-600' },
  { title: 'DBMS Analytics',    desc: 'Stored procedures & live DB views',     icon: Database,      href: '/dbms-analytics',        gradient: 'from-violet-500 to-pink-500' },
  { title: 'Prod Analytics',    desc: 'Live charts from FastAPI backend',      icon: TrendingUp,    href: '/production-analytics',  gradient: 'from-rose-500 to-pink-600' },
  { title: 'Career Roadmap',    desc: 'Step-by-step growth plan',              icon: Route,         href: '/roadmap',               gradient: 'from-orange-500 to-amber-500' },
  { title: 'AI Career Mentor',  desc: 'Chat with your AI mentor',              icon: MessageSquare, href: '/mentor',                gradient: 'from-fuchsia-500 to-purple-600' },
  { title: 'Architecture',      desc: 'System diagram & ADBMS features',      icon: GitBranch,     href: '/architecture',          gradient: 'from-slate-500 to-gray-600' },
];

// ── Platform stats (static) ───────────────────────────────────────────────────

const PLATFORM_STATS = [
  { label: 'Resumes Analyzed', value: '10,000+', icon: FileText },
  { label: 'Career Paths',     value: '500+',    icon: Route },
  { label: 'Success Rate',     value: '94%',     icon: TrendingUp },
  { label: 'Happy Users',      value: '2,500+',  icon: Users },
];

// ── Component ─────────────────────────────────────────────────────────────────

export function Dashboard() {
  const navigate  = useNavigate();
  const analysis  = useMemo(getLastAnalysis, []);
  const history   = useMemo(getHistory, []);
  const role      = useMemo(getRole, []);

  // Live backend metrics
  const [liveMetrics, setLiveMetrics] = useState<{
    total_resumes: number; avg_match_score: number; total_skills: number; total_analyses: number;
  } | null>(null);
  const [backendOnline, setBackendOnline] = useState(false);

  useEffect(() => {
    checkBackendHealth().then(online => {
      setBackendOnline(online);
      if (online) getAnalyticsOverview().then(setLiveMetrics).catch(() => {});
    });
  }, []);

  const hasAnalysis   = analysis !== null;
  const matchScore    = analysis?.skillMatch?.matchScore ?? 0;
  const totalScore    = analysis?.resumeScore?.totalScore ?? 0;
  const matchedCount  = analysis?.skillMatch?.matchedSkills?.length ?? 0;
  const missingCount  = analysis?.skillMatch?.missingSkills?.length ?? 0;
  const analysisCount = history.length + (hasAnalysis ? 1 : 0);

  // Trend: compare last two history entries
  const prevScore = history.length >= 2 ? history[history.length - 2].score : null;
  const lastScore = history.length >= 1 ? history[history.length - 1].score : null;
  const trend = prevScore !== null && lastScore !== null ? lastScore - prevScore : null;

  // Recent activity from history
  const recentActivity = history
    .slice(-5)
    .reverse()
    .map((h, i) => ({
      label: `Resume analysis #${history.length - i}`,
      score: h.score,
      date: h.date,
    }));

  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, delay },
  });

  return (
    <div className="min-h-screen bg-gradient-surface">
      <div className="max-w-6xl mx-auto px-6 py-10 space-y-10">

        {/* ── Hero ── */}
        <motion.div {...fadeUp()} className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full border border-primary/20">
            <Sparkles className="h-4 w-4 text-primary animate-pulse" />
            <span className="text-sm font-medium">Powered by Advanced AI + DBMS</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold">
            <span className="gradient-text">Next Step</span>{' '}
            <span className="text-foreground">Career AI</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            AI-powered resume analysis, skill matching, and career guidance — all in one place.
          </p>
          <div className="flex flex-wrap gap-3 justify-center pt-2">
            <Button size="lg" className="gradient-bg text-white" onClick={() => navigate('/resume')}>
              Analyze Resume <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/analytics')}>
              View Insights
            </Button>
          </div>
        </motion.div>

        {/* ── Personal stats (live from localStorage) ── */}
        <motion.div {...fadeUp(0.1)}>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4 flex items-center gap-2">
            <Zap className="h-4 w-4" /> Your Progress
          </h2>
          {!hasAnalysis ? (
            <Card className="border-dashed border-2 border-primary/20">
              <CardContent className="py-10 text-center">
                <FileText className="h-10 w-10 mx-auto mb-3 text-muted-foreground opacity-40" />
                <p className="font-medium mb-1">No analysis yet</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Upload your resume to see your personal stats here.
                </p>
                <Button onClick={() => navigate('/resume')}>
                  Analyze My Resume <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                {
                  label: 'Match Score',
                  value: `${matchScore}%`,
                  icon: Target,
                  color: scoreColor(matchScore),
                  sub: trend !== null
                    ? trend > 0 ? `↑ +${trend}% vs last` : trend < 0 ? `↓ ${trend}% vs last` : 'No change'
                    : `${analysisCount} analysis${analysisCount !== 1 ? 'es' : ''}`,
                },
                {
                  label: 'Resume Score',
                  value: `${totalScore}/100`,
                  icon: Award,
                  color: scoreColor(totalScore),
                  sub: totalScore >= 75 ? 'Excellent' : totalScore >= 55 ? 'Competitive' : 'Needs work',
                },
                {
                  label: 'Skills Matched',
                  value: matchedCount,
                  icon: CheckCircle2,
                  color: 'text-green-600',
                  sub: `${missingCount} gaps to close`,
                },
                {
                  label: 'Target Role',
                  value: roleLabel(role).split(' ')[0],
                  icon: Star,
                  color: 'text-purple-600',
                  sub: roleLabel(role),
                },
              ].map(({ label, value, icon: Icon, color, sub }) => (
                <Card key={label}>
                  <CardContent className="pt-5 pb-4">
                    <div className="flex items-start justify-between mb-2">
                      <Icon className={`h-5 w-5 ${color}`} />
                    </div>
                    <p className={`text-2xl font-bold ${color}`}>{value}</p>
                    <p className="text-xs font-medium mt-0.5">{label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </motion.div>

        {/* ── Score progress bar ── */}
        {hasAnalysis && (
          <motion.div {...fadeUp(0.15)}>
            <Card>
              <CardContent className="pt-5 pb-4 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Overall Match Progress</span>
                  <span className={`font-bold ${scoreColor(matchScore)}`}>{matchScore}%</span>
                </div>
                <Progress value={matchScore} className="h-3" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0% — No match</span>
                  <span>40% — Fair</span>
                  <span>60% — Good</span>
                  <span>80%+ — Excellent</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* ── Quick actions grid ── */}
        <motion.div {...fadeUp(0.2)}>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4 flex items-center gap-2">
            <ArrowRight className="h-4 w-4" /> Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {QUICK_ACTIONS.map((action, i) => (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.22 + i * 0.07 }}
                whileHover={{ y: -3, scale: 1.01 }}
                className="cursor-pointer"
                onClick={() => navigate(action.href)}
              >
                <Card className="h-full hover:shadow-md transition-all duration-200 border-border/50">
                  <CardHeader className="pb-2 space-y-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center`}>
                      <action.icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{action.title}</CardTitle>
                      <CardDescription className="text-xs mt-0.5">{action.desc}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Button variant="ghost" size="sm" className="w-full justify-between text-primary hover:bg-primary/5 px-0">
                      Open <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── Recent activity ── */}
        {recentActivity.length > 0 && (
          <motion.div {...fadeUp(0.3)}>
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4 flex items-center gap-2">
              <Clock className="h-4 w-4" /> Recent Activity
            </h2>
            <Card>
              <CardContent className="pt-4 divide-y">
                {recentActivity.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.32 + i * 0.05 }}
                    className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <FileText className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{item.label}</p>
                        <p className="text-xs text-muted-foreground">{timeAgo(item.date)}</p>
                      </div>
                    </div>
                    <Badge
                      className={`text-xs ${
                        item.score >= 80 ? 'bg-green-100 text-green-700' :
                        item.score >= 60 ? 'bg-blue-100 text-blue-700' :
                        item.score >= 40 ? 'bg-amber-100 text-amber-700' :
                                           'bg-red-100 text-red-700'
                      }`}
                    >
                      {item.score}%
                    </Badge>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* ── Platform stats ── */}
        <motion.div {...fadeUp(0.35)}>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4 flex items-center gap-2">
            <Bot className="h-4 w-4" /> Platform Stats
            {backendOnline
              ? <Badge className="text-xs bg-green-100 text-green-700 ml-1">Backend Online</Badge>
              : <Badge className="text-xs bg-gray-100 text-gray-500 ml-1">Browser Mode</Badge>
            }
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {(liveMetrics ? [
              { label: 'Total Resumes',    value: liveMetrics.total_resumes,   icon: FileText },
              { label: 'Avg Match Score',  value: `${liveMetrics.avg_match_score}%`, icon: Target },
              { label: 'Skills Tracked',   value: liveMetrics.total_skills,    icon: TrendingUp },
              { label: 'Analyses Run',     value: liveMetrics.total_analyses,  icon: Users },
            ] : PLATFORM_STATS).map(({ label, value, icon: Icon }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.37 + i * 0.07 }}
              >
                <Card>
                  <CardContent className="pt-5 pb-4 text-center">
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 mb-2">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <p className="text-2xl font-bold">{value}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── Backup / Export ── */}
        <motion.div {...fadeUp(0.4)}>
          <Card className="border-dashed border-2 border-blue-200 bg-blue-50/30">
            <CardContent className="py-5 flex items-center justify-between flex-wrap gap-3">
              <div>
                <p className="font-semibold text-sm">Export Your Data</p>
                <p className="text-xs text-muted-foreground">Download your resume analysis as HTML report or full JSON backup</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-blue-300 text-blue-700 hover:bg-blue-100"
                  onClick={() => downloadLastAnalysisReport()}
                >
                  <Download className="h-4 w-4 mr-1" /> Analysis Report
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-blue-300 text-blue-700 hover:bg-blue-100"
                  onClick={() => downloadUserBackup('00000000-0000-0000-0000-000000000001')}
                >
                  <Download className="h-4 w-4 mr-1" /> JSON Backup
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

      </div>
    </div>
  );
}

