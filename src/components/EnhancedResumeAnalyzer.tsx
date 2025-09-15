import React, { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Upload, FileText, CheckCircle, AlertCircle, TrendingUp, Target, Star, DollarSign, BarChart3, ExternalLink, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface SkillSuggestion {
  skill: string
  reason: string
  impact: string
  courses: {
    free: { name: string; url: string }
    paid: { name: string; url: string; price: string }
  }
}

interface JobFitAnalysis {
  role: string
  matchPercentage: number
  skills: string[]
  salaryRange: string
  demandLevel: "High" | "Medium" | "Low"
  readinessScore: number
}

interface AnalysisResult {
  score: number
  strengths: string[]
  improvements: { text: string; clickable: boolean; skill?: string }[]
  jobFit: JobFitAnalysis
  suggestions: string[]
  skillSuggestions: SkillSuggestion[]
  salaryBenchmark: {
    current: number
    potential: number
    afterImprovement: number
  }
  trendingSkills: string[]
}

export function EnhancedResumeAnalyzer() {
  const [file, setFile] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [selectedSkill, setSelectedSkill] = useState<SkillSuggestion | null>(null)
  const { toast } = useToast()

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      if (selectedFile.type === "application/pdf" || selectedFile.type.includes("document")) {
        setFile(selectedFile)
        setAnalysis(null)
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF or Word document.",
          variant: "destructive",
        })
      }
    }
  }, [toast])

  const analyzeResume = async () => {
    if (!file) return

    setIsAnalyzing(true)
    
    // Enhanced mock data with new features
    setTimeout(() => {
      setAnalysis({
        score: 85,
        strengths: [
          "Strong technical skills in React, TypeScript, and Node.js",
          "Excellent project portfolio with measurable impacts",
          "Clear progression in responsibilities and leadership roles",
          "Good education background in Computer Science"
        ],
        improvements: [
          { text: "Add more specific metrics and quantifiable achievements", clickable: false },
          { text: "Include relevant certifications or continuing education", clickable: false },
          { text: "Learn AWS for cloud expertise", clickable: true, skill: "AWS" },
          { text: "Master Docker and containerization", clickable: true, skill: "Docker" }
        ],
        jobFit: {
          role: "Senior Frontend Developer",
          matchPercentage: 92,
          skills: ["React", "TypeScript", "JavaScript", "CSS", "HTML", "Git"],
          salaryRange: "$85,000 - $120,000",
          demandLevel: "High",
          readinessScore: 88
        },
        suggestions: [
          "Consider adding AWS or cloud platform experience",
          "Highlight leadership and mentoring experience more prominently",
          "Include specific examples of problem-solving and impact"
        ],
        skillSuggestions: [
          {
            skill: "AWS",
            reason: "Cloud skills are in high demand and can increase salary by 25%",
            impact: "Opens opportunities at top tech companies",
            courses: {
              free: { name: "AWS Free Tier Training", url: "https://aws.amazon.com/training/" },
              paid: { name: "AWS Solutions Architect Course", url: "https://udemy.com/aws-architect", price: "₹449" }
            }
          },
          {
            skill: "Docker", 
            reason: "Containerization is essential for modern development workflows",
            impact: "Increases job market fit by 40%",
            courses: {
              free: { name: "Docker Official Tutorial", url: "https://docs.docker.com/get-started/" },
              paid: { name: "Complete Docker Mastery", url: "https://udemy.com/docker-mastery", price: "₹399" }
            }
          }
        ],
        salaryBenchmark: {
          current: 95000,
          potential: 120000,
          afterImprovement: 140000
        },
        trendingSkills: ["Next.js", "GraphQL", "Kubernetes", "Terraform", "Microservices"]
      })
      setIsAnalyzing(false)
      toast({
        title: "Enhanced analysis complete!",
        description: "Your resume has been analyzed with advanced AI insights.",
      })
    }, 3000)
  }

  const openSkillModal = (skill: SkillSuggestion) => {
    setSelectedSkill(skill)
  }

  const resetAnalysis = () => {
    setFile(null)
    setAnalysis(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-surface to-surface-light p-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-5xl font-black mb-4">
            <span className="gradient-text">Enhanced Resume</span> Analyzer
          </h1>
          <p className="text-xl text-muted-foreground">
            Advanced AI analysis with salary insights, skill recommendations, and career roadmaps.
          </p>
        </motion.div>

        <div className="grid gap-8">
          {/* Upload Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-dashed border-2 border-primary/20 glass-card">
              <CardContent className="pt-6">
                <div className="text-center">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="resume-upload"
                  />
                  <label
                    htmlFor="resume-upload"
                    className="flex flex-col items-center cursor-pointer"
                  >
                    <div className="p-6 bg-primary/10 rounded-full mb-6 neon-glow">
                      <Upload className="h-12 w-12 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3">
                      {file ? file.name : "Upload Your Resume"}
                    </h3>
                    <p className="text-muted-foreground mb-6 text-lg">
                      Get advanced AI insights, salary projections, and skill recommendations
                    </p>
                  </label>
                  
                  {file && (
                    <div className="flex justify-center space-x-6 mt-8">
                      <Button onClick={analyzeResume} disabled={isAnalyzing} size="lg" className="gradient-bg px-8 py-4">
                        {isAnalyzing ? "Analyzing..." : "Analyze Resume"}
                      </Button>
                      <Button variant="outline" onClick={resetAnalysis} size="lg">
                        Upload Different File
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Loading State */}
          <AnimatePresence>
            {isAnalyzing && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <Card className="glass-card">
                  <CardContent className="pt-6">
                    <div className="text-center space-y-6">
                      <div className="inline-flex p-6 bg-primary/10 rounded-full animate-pulse neon-glow">
                        <FileText className="h-12 w-12 text-primary" />
                      </div>
                      <h3 className="text-2xl font-bold">Advanced AI Analysis in Progress</h3>
                      <p className="text-muted-foreground text-lg">
                        Analyzing skills, calculating salary potential, and generating personalized recommendations...
                      </p>
                      <Progress value={75} className="max-w-md mx-auto h-3" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Enhanced Analysis Results */}
          <AnimatePresence>
            {analysis && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                {/* Score and Salary Overview */}
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="glass-card neon-glow">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Star className="h-6 w-6 text-primary" />
                        <span>Resume Score</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <div className="text-6xl font-black gradient-text mb-4">{analysis.score}/100</div>
                      <Progress value={analysis.score} className="mb-4" />
                      <p className="text-muted-foreground">Excellent performance!</p>
                    </CardContent>
                  </Card>

                  <Card className="glass-card">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <DollarSign className="h-6 w-6 text-accent" />
                        <span>Salary Projection</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Current Market Value</span>
                            <span className="font-semibold">${analysis.salaryBenchmark.current.toLocaleString()}</span>
                          </div>
                          <Progress value={70} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>With Improvements</span>
                            <span className="font-semibold text-accent">${analysis.salaryBenchmark.afterImprovement.toLocaleString()}</span>
                          </div>
                          <Progress value={95} className="h-2" />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Potential increase: <span className="text-accent font-semibold">
                            ${(analysis.salaryBenchmark.afterImprovement - analysis.salaryBenchmark.current).toLocaleString()}
                          </span>
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Job Fit Analysis with Charts */}
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <BarChart3 className="h-6 w-6 text-accent" />
                      <span>Job Market Analysis</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold mb-2">{analysis.jobFit.matchPercentage}%</div>
                        <p className="text-sm text-muted-foreground">Job Match</p>
                        <Progress value={analysis.jobFit.matchPercentage} className="mt-2" />
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold mb-2">{analysis.jobFit.readinessScore}%</div>
                        <p className="text-sm text-muted-foreground">Market Readiness</p>
                        <Progress value={analysis.jobFit.readinessScore} className="mt-2" />
                      </div>
                      <div className="text-center">
                        <Badge className={`${analysis.jobFit.demandLevel === 'High' ? 'bg-accent' : 'bg-warning'} text-white text-lg px-4 py-2`}>
                          {analysis.jobFit.demandLevel} Demand
                        </Badge>
                        <p className="text-sm text-muted-foreground mt-2">{analysis.jobFit.salaryRange}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Clickable Improvements */}
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <AlertCircle className="h-6 w-6 text-warning" />
                      <span>Smart Recommendations</span>
                    </CardTitle>
                    <CardDescription>
                      Click on skill recommendations to see learning paths and courses
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {analysis.improvements.map((improvement, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-4 rounded-lg border ${
                          improvement.clickable 
                            ? "border-primary/20 bg-primary/5 cursor-pointer hover:bg-primary/10 transition-colors" 
                            : "border-border bg-surface/50"
                        }`}
                        onClick={() => {
                          if (improvement.clickable && improvement.skill) {
                            const skillSuggestion = analysis.skillSuggestions.find(s => s.skill === improvement.skill)
                            if (skillSuggestion) openSkillModal(skillSuggestion)
                          }
                        }}
                      >
                        <div className="flex items-start space-x-3">
                          <AlertCircle className="h-5 w-5 text-warning mt-1 flex-shrink-0" />
                          <div className="flex-1">
                            <span className="text-sm">{improvement.text}</span>
                            {improvement.clickable && (
                              <div className="flex items-center mt-1">
                                <ExternalLink className="h-4 w-4 text-primary mr-1" />
                                <span className="text-xs text-primary">Click for courses & roadmap</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>

                {/* Trending Skills */}
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <TrendingUp className="h-6 w-6 text-primary" />
                      <span>Trending Skills in Your Field</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-3">
                      {analysis.trendingSkills.map((skill) => (
                        <Badge key={skill} variant="outline" className="px-4 py-2 text-sm hover:bg-primary/10 cursor-pointer">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Skill Course Modal */}
          <Dialog open={!!selectedSkill} onOpenChange={() => setSelectedSkill(null)}>
            <DialogContent className="max-w-2xl glass-card">
              <DialogHeader>
                <DialogTitle className="text-2xl gradient-text">
                  Master {selectedSkill?.skill}
                </DialogTitle>
                <DialogDescription className="text-lg">
                  {selectedSkill?.reason}
                </DialogDescription>
              </DialogHeader>
              
              {selectedSkill && (
                <div className="space-y-6 mt-6">
                  <div className="p-4 bg-accent/10 rounded-lg">
                    <h4 className="font-semibold text-accent mb-2">Career Impact</h4>
                    <p className="text-sm">{selectedSkill.impact}</p>
                  </div>

                  <div className="grid gap-4">
                    <Card className="border-success/20 bg-success/5">
                      <CardHeader>
                        <CardTitle className="text-lg text-success">Free – Quick Start</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="mb-4">{selectedSkill.courses.free.name}</p>
                        <Button variant="outline" className="border-success hover:bg-success/10" asChild>
                          <a href={selectedSkill.courses.free.url} target="_blank" rel="noopener noreferrer">
                            <BookOpen className="mr-2 h-4 w-4" />
                            Start Free Course
                          </a>
                        </Button>
                      </CardContent>
                    </Card>

                    <Card className="border-primary/20 bg-primary/5">
                      <CardHeader>
                        <CardTitle className="text-lg text-primary flex items-center justify-between">
                          Paid – Deep Dive 🚀
                          <Badge className="bg-primary text-primary-foreground">{selectedSkill.courses.paid.price}</Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="mb-4">{selectedSkill.courses.paid.name}</p>
                        <p className="text-sm text-muted-foreground mb-4">
                          Structured learning with projects, certificates, and lifetime access. 
                          A small investment that can 10x your career opportunities.
                        </p>
                        <Button className="gradient-bg" asChild>
                          <a href={selectedSkill.courses.paid.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Enroll Now - {selectedSkill.courses.paid.price}
                          </a>
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  )
}