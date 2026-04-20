import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  CheckCircle, AlertCircle, ExternalLink, BookOpen, Target,
  ChevronRight, RotateCcw, Briefcase, Brain, Upload,
  FileText, Cpu, ScanText, Search, UploadCloud, CheckCircle2, Award, Download,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { MLAnalysisService, MLAnalysisResult } from '@/services/mlAnalysis.service';
import { downloadAnalysisReport } from '@/services/resumeExport.service';
import { getDataset, JobRoleEntry } from '@/ai/ml/rolePredictor';
import { FileProcessingService } from '@/lib/fileProcessingService';

// ── Role list from dataset ────────────────────────────────────────────────────
const ROLES: { key: string; label: string }[] = getDataset().map((e: JobRoleEntry) => ({
  key:   e.role,
  label: e.display,
}));

// ── Skill card ────────────────────────────────────────────────────────────────
function SkillCard({ skill, variant, resources }: {
  skill: string;
  variant: 'matched' | 'missing';
  resources?: { type: string; title: string; url: string; platform: string }[];
}) {
  const isMatched = variant === 'matched';
  return (
    <motion.div
      variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0, transition: { duration: 0.2 } } }}
      className={`flex items-center justify-between p-2.5 rounded-lg border text-sm ${
        isMatched ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'
      }`}
    >
      <div className="flex items-center gap-2 min-w-0">
        {isMatched
          ? <CheckCircle className="h-3.5 w-3.5 text-green-600 shrink-0" />
          : <AlertCircle className="h-3.5 w-3.5 text-orange-500 shrink-0" />
        }
        <span className="font-medium truncate capitalize">{skill}</span>
      </div>
      {!isMatched && resources && resources.length > 0 && (
        <div className="flex gap-1 shrink-0 ml-2">
          {resources.filter(r => r.type === 'free').slice(0, 1).map(r => (
            <a key={r.url} href={r.url} target="_blank" rel="noopener noreferrer">
              <Badge className="text-xs bg-blue-100 text-blue-700 hover:bg-blue-200 gap-1 cursor-pointer">
                <BookOpen className="h-2.5 w-2.5" /> Free
              </Badge>
            </a>
          ))}
          {resources.filter(r => r.type === 'paid').slice(0, 1).map(r => (
            <a key={r.url} href={r.url} target="_blank" rel="noopener noreferrer">
              <Badge className="text-xs bg-purple-100 text-purple-700 hover:bg-purple-200 gap-1 cursor-pointer">
                <ExternalLink className="h-2.5 w-2.5" /> Course
              </Badge>
            </a>
          ))}
        </div>
      )}
    </motion.div>
  );
}

// ── ML Results view ───────────────────────────────────────────────────────────
function MLResultsView({ result, selectedRole, onReset }: {
  result: MLAnalysisResult;
  selectedRole: string;
  onReset: () => void;
}) {
  const navigate = useNavigate();
  const roleLabel = ROLES.find(r => r.key === selectedRole)?.label ?? selectedRole;
  const recMap = new Map(result.recommendations.map(r => [r.skill.toLowerCase(), r.resources]));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <CheckCircle className="h-6 w-6 text-green-500" />
          <h2 className="text-xl font-semibold">ML Analysis Complete</h2>
          <Badge variant="secondary">{roleLabel}</Badge>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate('/score')}>
            <Award className="h-4 w-4 mr-1" /> View Score
          </Button>
          <Button
            variant="outline" size="sm"
            onClick={() => {
              try {
                const raw = localStorage.getItem('lastAnalysisResult');
                const analysis = raw ? JSON.parse(raw) : null;
                downloadAnalysisReport(result, analysis, selectedRole);
              } catch { /* ignore */ }
            }}
          >
            <Download className="h-4 w-4 mr-1" /> Export Report
          </Button>
          <Button variant="outline" size="sm" onClick={onReset}>
            <RotateCcw className="h-4 w-4 mr-1" /> Start Over
          </Button>
        </div>
      </div>

      {/* ML Prediction card */}
      <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-indigo-50">
        <CardContent className="pt-5">
          <div className="flex items-center gap-2 mb-3">
            <Brain className="h-5 w-5 text-purple-600" />
            <span className="font-semibold text-purple-700">ML + Soft Computing Analysis</span>
            <Badge className="bg-purple-100 text-purple-700 text-xs">
              TF-IDF + Naive Bayes + Fuzzy Logic
            </Badge>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white rounded-lg p-3 border border-purple-100 text-center">
              <p className="text-xs text-muted-foreground mb-1">ML Score</p>
              <p className="text-2xl font-bold text-blue-600">{result.mlScore}%</p>
              <Progress value={result.mlScore} className="h-1 mt-1" />
              <p className="text-xs text-muted-foreground mt-1">TF-IDF match</p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-purple-100 text-center">
              <p className="text-xs text-muted-foreground mb-1">Fuzzy Score</p>
              <p className="text-2xl font-bold text-amber-600">{result.fuzzyScore}%</p>
              <Progress value={result.fuzzyScore} className="h-1 mt-1" />
              <p className="text-xs text-muted-foreground mt-1">Levenshtein</p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-purple-100 text-center">
              <p className="text-xs text-muted-foreground mb-1">Final Score</p>
              <p className="text-2xl font-bold text-purple-700">{result.finalScore}%</p>
              <Progress value={result.finalScore} className="h-1 mt-1" />
              <p className="text-xs text-muted-foreground mt-1">0.7×ML + 0.3×Fuzzy</p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-purple-100 text-center">
              <p className="text-xs text-muted-foreground mb-1">Confidence</p>
              <p className="text-2xl font-bold text-green-600">{result.confidence}%</p>
              <Progress value={result.confidence} className="h-1 mt-1" />
              <p className="text-xs text-muted-foreground mt-1">ML confidence</p>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
            <div>Predicted Role: <span className="font-medium text-purple-700">{result.predictedDisplay}</span></div>
            <div>Skills Extracted: <span className="font-medium">{result.extractedSkills.length}</span></div>
          </div>
        </CardContent>
      </Card>

      {/* Score cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-5 text-center">
            <div className="text-3xl font-bold text-green-700">{result.finalScore}%</div>
            <p className="text-xs text-green-600 mt-1">Final Score</p>
            <Progress value={result.finalScore} className="mt-2 h-1.5" />
          </CardContent>
        </Card>
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-5 text-center">
            <div className="text-3xl font-bold text-blue-700">{result.matchedSkills.length}</div>
            <p className="text-xs text-blue-600 mt-1">Exact Match</p>
            {result.partialSkills?.length > 0 && (
              <p className="text-xs text-amber-600">+{result.partialSkills.length} partial</p>
            )}
          </CardContent>
        </Card>
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="pt-5 text-center">
            <div className="text-3xl font-bold text-orange-700">{result.missingSkills.length}</div>
            <p className="text-xs text-orange-600 mt-1">Missing</p>
          </CardContent>
        </Card>
      </div>

      {/* Matched skills */}
      {result.matchedSkills.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              Matched Skills ({result.matchedSkills.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <motion.div
              className="grid gap-2 sm:grid-cols-2"
              initial="hidden" animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.04 } } }}
            >
              {result.matchedSkills.map(skill => (
                <SkillCard key={skill} skill={skill} variant="matched" />
              ))}
            </motion.div>
          </CardContent>
        </Card>
      )}

      {/* Partial skills (fuzzy matches) */}
      {result.partialSkills && result.partialSkills.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <span className="h-4 w-4 text-amber-500">≈</span>
              Partial Matches — Fuzzy Logic ({result.partialSkills.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground mb-3">
              Skills detected via fuzzy matching (Levenshtein similarity ≥ 50%).
            </p>
            <motion.div
              className="grid gap-2 sm:grid-cols-2"
              initial="hidden" animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.04 } } }}
            >
              {result.partialSkills.map(ps => (
                <motion.div
                  key={ps.skill}
                  variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0, transition: { duration: 0.2 } } }}
                  className="flex items-center justify-between p-2.5 rounded-lg border bg-amber-50 border-amber-200 text-sm"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-amber-500 font-bold shrink-0">≈</span>
                    <span className="font-medium truncate capitalize">{ps.skill}</span>
                    <span className="text-xs text-muted-foreground">via "{ps.matchedTo}"</span>
                  </div>
                  <Badge className="text-xs bg-amber-100 text-amber-700 shrink-0 ml-1">
                    {ps.similarity}%
                  </Badge>
                </motion.div>
              ))}
            </motion.div>
          </CardContent>
        </Card>
      )}

      {/* Missing skills with learning resources */}
      {result.missingSkills.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-orange-500" />
              Skills to Learn ({result.missingSkills.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground mb-3">
              Click Free or Course for learning resources.
            </p>
            <motion.div
              className="grid gap-2 sm:grid-cols-2"
              initial="hidden" animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.04 } } }}
            >
              {result.missingSkills.map(skill => (
                <SkillCard
                  key={skill}
                  skill={skill}
                  variant="missing"
                  resources={recMap.get(skill.toLowerCase())}
                />
              ))}
            </motion.div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// ── Upload widget ─────────────────────────────────────────────────────────────
type StageKey = 'uploading' | 'parsing' | 'extracting' | 'predicting' | 'complete';
const STEPS: Array<{ key: StageKey; label: string; Icon: React.ElementType }> = [
  { key: 'uploading',  label: 'Uploading',   Icon: UploadCloud },
  { key: 'parsing',   label: 'Parsing',      Icon: ScanText    },
  { key: 'extracting',label: 'Extracting',   Icon: Search      },
  { key: 'predicting',label: 'ML Predict',   Icon: Cpu         },
];

function UploadWidget({ targetRole, onComplete }: {
  targetRole: string;
  onComplete: (r: MLAnalysisResult) => void;
}) {
  const [processing, setProcessing] = useState(false);
  const [stage, setStage]           = useState<StageKey | null>(null);
  const [progress, setProgress]     = useState(0);
  const [error, setError]           = useState<string | null>(null);
  const [drag, setDrag]             = useState(false);
  const { toast } = useToast();

  const processFile = useCallback(async (file: File) => {
    const valid = ['application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword', 'text/plain'];
    if (!valid.includes(file.type)) { setError('Upload a PDF, DOC, DOCX, or TXT file.'); return; }
    if (file.size > 10 * 1024 * 1024) { setError('File must be under 10 MB.'); return; }

    setProcessing(true); setError(null);
    setStage('uploading'); setProgress(10);

    try {
      // Extract text via existing FileProcessingService
      setStage('parsing'); setProgress(30);
      const fileResult = await FileProcessingService.processResumeFile(file, targetRole, true,
        (_step, _msg, pct) => {
          setProgress(Math.min(60, 10 + pct * 0.5));
          if (pct < 30) setStage('uploading');
          else if (pct < 55) setStage('parsing');
          else setStage('extracting');
        }
      );

      if (!fileResult.success) throw new Error(fileResult.error ?? 'Parsing failed');

      // Use full resume text — NOT the 500-char preview
      const resumeText = fileResult.comprehensiveAnalysis?.parsedResume?.text
        ?? fileResult.extractedText?.replace(/\.\.\.$/, '') // strip preview ellipsis
        ?? '';

      // Run ML pipeline
      setStage('predicting'); setProgress(75);
      const mlResult = await MLAnalysisService.analyze({
        resumeText,
        fileName:   file.name,
        targetRole,
        userId:     'demo-user',
      });

      setStage('complete'); setProgress(100);

      // Persist for other pages
      try {
        const ca = fileResult.comprehensiveAnalysis;
        if (ca) {
          localStorage.setItem('lastAnalysisResult', JSON.stringify({
            ...ca,
            mlResult,
          }));
          localStorage.setItem('lastDetectedRole', mlResult.predictedRole);
          const history = JSON.parse(localStorage.getItem('analysisHistory') ?? '[]');
          history.push({ score: mlResult.matchPercentage, date: new Date().toISOString() });
          localStorage.setItem('analysisHistory', JSON.stringify(history.slice(-10)));
        }
      } catch { /* ignore */ }

      toast({ title: 'Analysis complete!', description: `${mlResult.matchPercentage}% match for ${targetRole.replace(/_/g, ' ')}` });
      setTimeout(() => onComplete(mlResult), 600);

    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Analysis failed';
      setError(msg);
      setStage(null);
      toast({ title: 'Failed', description: msg, variant: 'destructive' });
    } finally {
      setProcessing(false);
    }
  }, [targetRole, onComplete, toast]);

  const stageOrder: StageKey[] = ['uploading', 'parsing', 'extracting', 'predicting', 'complete'];
  const currentIdx = stage ? stageOrder.indexOf(stage) : -1;

  return (
    <Card className={`border-dashed border-2 transition-colors ${drag ? 'border-primary bg-primary/5' : 'border-primary/20'}`}>
      <CardHeader><CardTitle className="text-center text-base">Upload Your Resume</CardTitle></CardHeader>
      <CardContent>
        <div
          className="text-center p-6"
          onDragEnter={e => { e.preventDefault(); setDrag(true); }}
          onDragLeave={e => { e.preventDefault(); setDrag(false); }}
          onDragOver={e => e.preventDefault()}
          onDrop={e => { e.preventDefault(); setDrag(false); const f = e.dataTransfer.files[0]; if (f) processFile(f); }}
        >
          <input type="file" accept=".pdf,.doc,.docx,.txt" id="ml-upload" className="hidden"
            disabled={processing} onChange={e => { const f = e.target.files?.[0]; if (f) processFile(f); }} />
          <label htmlFor="ml-upload" className="cursor-pointer block">
            <div className="flex flex-col items-center gap-3">
              {processing
                ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                    <Upload className="h-10 w-10 text-primary" />
                  </motion.div>
                : <Upload className="h-10 w-10 text-primary" />
              }
              <p className="font-medium">{processing ? 'Processing…' : 'Drop resume here or click to browse'}</p>
              <p className="text-xs text-muted-foreground">PDF, DOC, DOCX, TXT — max 10 MB</p>
              {!processing && <Button variant="outline" size="sm"><FileText className="h-4 w-4 mr-1" /> Choose File</Button>}
            </div>
          </label>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm">
              <AlertCircle className="h-4 w-4 shrink-0" />{error}
            </div>
          )}

          {stage && stage !== 'complete' && (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="mt-5 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl"
              >
                <div className="flex items-center justify-between mb-4">
                  {STEPS.map((step, i) => {
                    const stepIdx = stageOrder.indexOf(step.key);
                    const isDone  = currentIdx >= stageOrder.length - 1 || stepIdx < currentIdx;
                    const isActive = stepIdx === currentIdx;
                    return (
                      <div key={step.key} className="flex items-center">
                        <div className="flex flex-col items-center gap-1">
                          <motion.div
                            animate={isActive ? { scale: [1, 1.15, 1] } : {}}
                            transition={{ repeat: Infinity, duration: 1.2 }}
                            className={`w-9 h-9 rounded-full flex items-center justify-center border-2 ${
                              isDone ? 'bg-green-500 border-green-500 text-white' :
                              isActive ? 'bg-primary border-primary text-white' :
                              'bg-white border-gray-200 text-gray-400'
                            }`}
                          >
                            {isDone ? <CheckCircle2 className="h-4 w-4" /> : <step.Icon className="h-3.5 w-3.5" />}
                          </motion.div>
                          <span className={`text-xs font-medium ${isActive ? 'text-primary' : isDone ? 'text-green-600' : 'text-gray-400'}`}>
                            {step.label}
                          </span>
                        </div>
                        {i < STEPS.length - 1 && (
                          <div className="w-8 h-0.5 mx-1 mb-4 bg-gray-200 rounded overflow-hidden">
                            <motion.div className="h-full bg-primary" initial={{ width: '0%' }}
                              animate={{ width: isDone ? '100%' : '0%' }} transition={{ duration: 0.4 }} />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="w-full bg-blue-100 rounded-full h-1.5 overflow-hidden">
                  <motion.div className="h-full bg-gradient-to-r from-primary to-indigo-500 rounded-full"
                    animate={{ width: `${progress}%` }} transition={{ duration: 0.5 }} />
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export function ResumeAnalyzer() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [result, setResult]             = useState<MLAnalysisResult | null>(null);

  const handleReset = () => { setResult(null); setSelectedRole(null); };

  if (result && selectedRole) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <MLResultsView result={result} selectedRole={selectedRole} onReset={handleReset} />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-1 flex items-center gap-2">
          <Brain className="h-6 w-6 text-primary" /> ML Resume Analyzer
        </h1>
        <p className="text-muted-foreground text-sm mb-1">
          Powered by TF-IDF vectorization + Naive Bayes classification.
        </p>
        <p className="text-xs text-muted-foreground mb-6">
          Select your target role, upload your resume — the ML model extracts skills, predicts your role, and calculates match %.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {ROLES.map(role => (
            <motion.button
              key={role.key}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedRole(role.key)}
              className={`flex items-center justify-between p-3.5 rounded-xl border-2 text-left transition-colors ${
                selectedRole === role.key
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-border hover:border-primary/40'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Briefcase className={`h-4 w-4 ${selectedRole === role.key ? 'text-primary' : 'text-muted-foreground'}`} />
                <span className="font-medium text-sm">{role.label}</span>
              </div>
              {selectedRole === role.key && <ChevronRight className="h-4 w-4 text-primary" />}
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedRole && (
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Target className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">
                Analyzing for: <span className="text-primary">{ROLES.find(r => r.key === selectedRole)?.label}</span>
              </span>
            </div>
            <UploadWidget targetRole={selectedRole} onComplete={setResult} />
          </motion.div>
        )}
      </AnimatePresence>

      {!selectedRole && (
        <p className="text-center text-sm text-muted-foreground">↑ Select a role above to unlock the upload</p>
      )}
    </div>
  );
}
