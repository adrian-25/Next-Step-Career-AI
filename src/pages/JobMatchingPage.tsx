import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import {
  CheckCircle2, XCircle, AlertCircle, Upload, Briefcase,
  Target, TrendingUp, BookOpen, ExternalLink,
} from 'lucide-react';
import { analyzeResume } from '@/ai/ml/skillAnalyzer';
import { extractSkillsFromText } from '@/ai/ml/skillAnalyzer';
import { getResourcesForSkill } from '@/data/learningResources';

function scoreColor(s: number) {
  if (s >= 80) return { text: 'text-emerald-600', bg: 'bg-emerald-500', ring: 'ring-emerald-200' };
  if (s >= 50) return { text: 'text-amber-600',   bg: 'bg-amber-500',   ring: 'ring-amber-200'   };
  return              { text: 'text-rose-600',     bg: 'bg-rose-500',    ring: 'ring-rose-200'    };
}

function ScoreCircle({ score }: { score: number }) {
  const c = scoreColor(score);
  const r = 54;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  return (
    <div className={`relative w-36 h-36 flex items-center justify-center rounded-full ring-4 ${c.ring}`}>
      <svg className="absolute inset-0 -rotate-90" width="144" height="144">
        <circle cx="72" cy="72" r={r} fill="none" stroke="#e2e8f0" strokeWidth="10" />
        <motion.circle
          cx="72" cy="72" r={r} fill="none"
          stroke={score >= 80 ? '#10b981' : score >= 50 ? '#f59e0b' : '#e11d48'}
          strokeWidth="10"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ - dash }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          strokeLinecap="round"
        />
      </svg>
      <div className="text-center z-10">
        <p className={`text-3xl font-bold ${c.text}`}>{score}%</p>
        <p className="text-xs text-muted-foreground">Match</p>
      </div>
    </div>
  );
}

export function JobMatchingPage() {
  const [resumeText, setResumeText] = useState('');
  const [jdText, setJdText]         = useState('');
  const [result, setResult]         = useState<any>(null);
  const [loading, setLoading]       = useState(false);

  const handleMatch = () => {
    if (!resumeText.trim() || !jdText.trim()) return;
    setLoading(true);
    setTimeout(() => {
      const resumeSkills = extractSkillsFromText(resumeText);
      const jdSkills     = extractSkillsFromText(jdText);
      const resumeSet    = new Set(resumeSkills.map(s => s.toLowerCase()));
      const jdSet        = new Set(jdSkills.map(s => s.toLowerCase()));
      const matched      = [...resumeSet].filter(s => jdSet.has(s));
      const missing      = [...jdSet].filter(s => !resumeSet.has(s));
      const extra        = [...resumeSet].filter(s => !jdSet.has(s));
      const pct          = jdSet.size > 0 ? Math.round(matched.length / jdSet.size * 100) : 0;
      setResult({ matched, missing, extra, pct, resumeSkills, jdSkills });
      setLoading(false);
    }, 600);
  };

  return (
    <div className="page-content max-w-6xl space-y-6">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ background: 'var(--gradient-primary)' }}>
            <Briefcase className="h-4.5 w-4.5 text-white" aria-hidden="true" />
          </div>
          <div>
            <h1 className="font-display text-xl font-bold">Job Matching Engine</h1>
            <p className="text-sm text-muted-foreground">
              Paste your resume and a job description to see how well you match.
            </p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left: inputs */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Upload className="h-4 w-4 text-primary" /> Your Resume
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Paste your resume text here..."
                className="min-h-[200px] font-mono text-xs resize-none"
                value={resumeText}
                onChange={e => setResumeText(e.target.value)}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-blue-600" /> Job Description
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Paste the job description here..."
                className="min-h-[200px] font-mono text-xs resize-none"
                value={jdText}
                onChange={e => setJdText(e.target.value)}
              />
            </CardContent>
          </Card>

          <Button
            className="w-full bg-[#1e40af] hover:bg-[#1e3a8a] text-white"
            onClick={handleMatch}
            disabled={loading || !resumeText.trim() || !jdText.trim()}
          >
            {loading ? 'Analyzing...' : 'Analyze Match'}
          </Button>
        </div>

        {/* Right: results */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              {/* Score circle */}
              <Card>
                <CardContent className="pt-6 flex flex-col items-center gap-4">
                  <ScoreCircle score={result.pct} />
                  <div className="grid grid-cols-3 gap-4 w-full text-center">
                    <div>
                      <p className="text-2xl font-bold text-emerald-600">{result.matched.length}</p>
                      <p className="text-xs text-muted-foreground">Matched</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-rose-600">{result.missing.length}</p>
                      <p className="text-xs text-muted-foreground">Missing</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-blue-600">{result.jdSkills.length}</p>
                      <p className="text-xs text-muted-foreground">JD Skills</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Skill comparison */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Skill Comparison</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Matched */}
                  {result.matched.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-emerald-700 mb-1.5 flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Matched ({result.matched.length})
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {result.matched.map((s: string) => (
                          <Badge key={s} className="text-xs bg-emerald-100 text-emerald-700 capitalize">{s}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {/* Missing */}
                  {result.missing.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-rose-700 mb-1.5 flex items-center gap-1">
                        <XCircle className="h-3.5 w-3.5" /> Missing ({result.missing.length})
                      </p>
                      <div className="space-y-1.5">
                        {result.missing.slice(0, 8).map((s: string) => {
                          const res = getResourcesForSkill(s);
                          return (
                            <div key={s} className="flex items-center justify-between p-2 bg-rose-50 rounded-lg border border-rose-100">
                              <span className="text-xs font-medium capitalize">{s}</span>
                              <div className="flex gap-1">
                                {res.free && (
                                  <a href={res.free.url} target="_blank" rel="noopener noreferrer">
                                    <Badge className="text-xs bg-blue-100 text-blue-700 gap-1 cursor-pointer">
                                      <BookOpen className="h-2.5 w-2.5" /> Free
                                    </Badge>
                                  </a>
                                )}
                                {res.paid && (
                                  <a href={res.paid.url} target="_blank" rel="noopener noreferrer">
                                    <Badge className="text-xs bg-purple-100 text-purple-700 gap-1 cursor-pointer">
                                      <ExternalLink className="h-2.5 w-2.5" /> Course
                                    </Badge>
                                  </a>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {!result && !loading && (
          <div className="flex items-center justify-center h-full min-h-[300px] text-center text-muted-foreground">
            <div>
              <Target className="h-12 w-12 mx-auto mb-3 opacity-20" />
              <p className="text-sm">Paste your resume and job description, then click Analyze Match</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
