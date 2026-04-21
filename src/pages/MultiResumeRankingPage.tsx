import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Upload, Trophy, ChevronDown, ChevronUp, X } from 'lucide-react';
import { analyzeResume } from '@/ai/ml/skillAnalyzer';
import { getDataset } from '@/ai/ml/rolePredictor';

const ROLES = getDataset().map(e => ({ key: e.role, label: e.display }));

function scoreColor(s: number) {
  if (s >= 80) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
  if (s >= 50) return 'text-amber-600 bg-amber-50 border-amber-200';
  return 'text-rose-600 bg-rose-50 border-rose-200';
}

function medalColor(rank: number) {
  if (rank === 1) return 'text-yellow-500';
  if (rank === 2) return 'text-slate-400';
  if (rank === 3) return 'text-amber-600';
  return 'text-muted-foreground';
}

export function MultiResumeRankingPage() {
  const [files, setFiles]           = useState<Array<{ name: string; text: string }>>([]);
  const [targetRole, setTargetRole] = useState('software_developer');
  const [rankings, setRankings]     = useState<any[]>([]);
  const [loading, setLoading]       = useState(false);
  const [expanded, setExpanded]     = useState<string | null>(null);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const dropped = Array.from(e.dataTransfer.files).filter(f =>
      ['text/plain', 'application/pdf'].includes(f.type)
    );
    dropped.forEach(f => {
      const reader = new FileReader();
      reader.onload = () => setFiles(prev => [...prev, { name: f.name, text: reader.result as string }]);
      reader.readAsText(f);
    });
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    Array.from(e.target.files ?? []).forEach(f => {
      const reader = new FileReader();
      reader.onload = () => setFiles(prev => [...prev, { name: f.name, text: reader.result as string }]);
      reader.readAsText(f);
    });
  };

  const handleRank = () => {
    if (files.length === 0) return;
    setLoading(true);
    setTimeout(() => {
      const results = files.map(f => {
        const r = analyzeResume(f.text, targetRole);
        return {
          name:          f.name,
          predictedRole: r.predictedRole,
          matchScore:    r.finalScore,
          matchedSkills: r.matchedSkills.slice(0, 5),
          missingSkills: r.missingSkills,
          mlScore:       r.mlScore,
          fuzzyScore:    r.fuzzyScore,
        };
      }).sort((a, b) => b.matchScore - a.matchScore)
        .map((r, i) => ({ ...r, rank: i + 1 }));
      setRankings(results);
      setLoading(false);
    }, 800);
  };

  return (
    <div className="page-content max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Trophy className="h-6 w-6 text-yellow-500" /> Multi-Resume Ranking
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Upload multiple resumes and rank them against a single job role.
        </p>
      </div>

      {/* Config */}
      <Card>
        <CardContent className="pt-5 space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Target Role</label>
            <select
              value={targetRole}
              onChange={e => setTargetRole(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm bg-background"
            >
              {ROLES.map(r => <option key={r.key} value={r.key}>{r.label}</option>)}
            </select>
          </div>

          {/* Drop zone */}
          <div
            className="border-2 border-dashed border-emerald-300 rounded-xl p-8 text-center cursor-pointer hover:bg-emerald-50 transition-colors"
            onDragOver={e => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => document.getElementById('multi-upload')?.click()}
          >
            <input id="multi-upload" type="file" multiple accept=".txt,.pdf" className="hidden" onChange={handleFileInput} />
            <Upload className="h-8 w-8 mx-auto mb-2 text-emerald-500" />
            <p className="text-sm font-medium">Drop resumes here or click to browse</p>
            <p className="text-xs text-muted-foreground mt-1">TXT or PDF — multiple files supported</p>
          </div>

          {/* File list */}
          {files.length > 0 && (
            <div className="space-y-1.5">
              {files.map((f, i) => (
                <div key={i} className="flex items-center justify-between p-2 bg-muted/30 rounded-lg text-sm">
                  <span className="truncate">{f.name}</span>
                  <button onClick={() => setFiles(prev => prev.filter((_, j) => j !== i))}>
                    <X className="h-4 w-4 text-muted-foreground hover:text-red-500" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <Button
            className="w-full bg-[#1e40af] hover:bg-[#1e3a8a] text-white"
            onClick={handleRank}
            disabled={loading || files.length === 0}
          >
            {loading ? 'Ranking...' : `Rank ${files.length} Resume${files.length !== 1 ? 's' : ''}`}
          </Button>
        </CardContent>
      </Card>

      {/* Rankings table */}
      {rankings.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Rankings — {ROLES.find(r => r.key === targetRole)?.label}</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/30 text-xs uppercase text-muted-foreground">
                    <th className="text-left py-3 px-4">Rank</th>
                    <th className="text-left py-3 px-4">Resume</th>
                    <th className="text-left py-3 px-4">Predicted Role</th>
                    <th className="text-right py-3 px-4">Match %</th>
                    <th className="text-left py-3 px-4">Top Skills</th>
                    <th className="text-right py-3 px-4">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {rankings.map((r, i) => (
                    <>
                      <motion.tr
                        key={r.name}
                        initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className={`border-b hover:bg-blue-50/30 cursor-pointer ${i % 2 === 0 ? '' : 'bg-slate-50/50'}`}
                        onClick={() => setExpanded(expanded === r.name ? null : r.name)}
                      >
                        <td className="py-3 px-4">
                          <span className={`font-bold text-lg ${medalColor(r.rank)}`}>#{r.rank}</span>
                        </td>
                        <td className="py-3 px-4 font-medium truncate max-w-[160px]">{r.name}</td>
                        <td className="py-3 px-4">
                          <Badge variant="secondary" className="text-xs capitalize">
                            {r.predictedRole.replace(/_/g, ' ')}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Progress value={r.matchScore} className="w-16 h-1.5" />
                            <span className={`font-bold text-sm border rounded px-1.5 py-0.5 ${scoreColor(r.matchScore)}`}>
                              {r.matchScore}%
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex flex-wrap gap-1">
                            {r.matchedSkills.map((s: string) => (
                              <Badge key={s} className="text-xs bg-emerald-100 text-emerald-700 capitalize">{s}</Badge>
                            ))}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right">
                          {expanded === r.name
                            ? <ChevronUp className="h-4 w-4 ml-auto text-muted-foreground" />
                            : <ChevronDown className="h-4 w-4 ml-auto text-muted-foreground" />
                          }
                        </td>
                      </motion.tr>
                      {expanded === r.name && (
                        <tr key={`${r.name}-detail`} className="bg-blue-50/20">
                          <td colSpan={6} className="px-4 py-3">
                            <div className="grid grid-cols-3 gap-4 text-xs">
                              <div>
                                <p className="font-semibold text-blue-700 mb-1">ML Score</p>
                                <p className="text-2xl font-bold">{r.mlScore}%</p>
                              </div>
                              <div>
                                <p className="font-semibold text-amber-700 mb-1">Fuzzy Score</p>
                                <p className="text-2xl font-bold">{r.fuzzyScore}%</p>
                              </div>
                              <div>
                                <p className="font-semibold text-rose-700 mb-1">Missing Skills</p>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {r.missingSkills.slice(0, 6).map((s: string) => (
                                    <Badge key={s} className="text-xs bg-rose-100 text-rose-700 capitalize">{s}</Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
