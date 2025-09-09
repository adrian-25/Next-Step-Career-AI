import React, { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Upload, FileText, CheckCircle, AlertCircle, TrendingUp, Target, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

interface AnalysisResult {
  score: number
  strengths: string[]
  improvements: string[]
  jobFit: {
    role: string
    matchPercentage: number
    skills: string[]
  }
  suggestions: string[]
}

export function ResumeAnalyzer() {
  const [file, setFile] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
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
    
    // TODO: Implement actual file upload and AI analysis
    // Simulating API call for now
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
          "Add more specific metrics and quantifiable achievements",
          "Include relevant certifications or continuing education",
          "Strengthen the summary section with career objectives",
          "Add more keywords relevant to target job descriptions"
        ],
        jobFit: {
          role: "Senior Frontend Developer",
          matchPercentage: 92,
          skills: ["React", "TypeScript", "JavaScript", "CSS", "HTML", "Git"]
        },
        suggestions: [
          "Consider adding AWS or cloud platform experience",
          "Highlight leadership and mentoring experience more prominently",
          "Include specific examples of problem-solving and impact",
          "Add any open-source contributions or technical blog posts"
        ]
      })
      setIsAnalyzing(false)
      toast({
        title: "Analysis complete!",
        description: "Your resume has been analyzed successfully.",
      })
    }, 3000)
  }

  const resetAnalysis = () => {
    setFile(null)
    setAnalysis(null)
  }

  return (
    <div className="min-h-screen bg-gradient-surface p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-4">
            <span className="gradient-text">Resume</span> Analyzer
          </h1>
          <p className="text-lg text-muted-foreground">
            Upload your resume and get AI-powered insights to improve your chances of landing your dream job.
          </p>
        </motion.div>

        <div className="grid gap-8">
          {/* Upload Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-dashed border-2 border-primary/20 bg-gradient-glow">
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
                    <div className="p-4 bg-primary/10 rounded-full mb-4">
                      <Upload className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">
                      {file ? file.name : "Upload Your Resume"}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      PDF, DOC, or DOCX files accepted (max 5MB)
                    </p>
                  </label>
                  
                  {file && (
                    <div className="flex justify-center space-x-4 mt-6">
                      <Button onClick={analyzeResume} disabled={isAnalyzing} className="gradient-bg">
                        {isAnalyzing ? "Analyzing..." : "Analyze Resume"}
                      </Button>
                      <Button variant="outline" onClick={resetAnalysis}>
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
                <Card className="bg-card/80 backdrop-blur-sm">
                  <CardContent className="pt-6">
                    <div className="text-center space-y-4">
                      <div className="inline-flex p-4 bg-primary/10 rounded-full animate-pulse">
                        <FileText className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold">Analyzing Your Resume</h3>
                      <p className="text-muted-foreground">
                        Our AI is examining your resume for strengths, improvements, and job fit...
                      </p>
                      <Progress value={75} className="max-w-md mx-auto" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Analysis Results */}
          <AnimatePresence>
            {analysis && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Overall Score */}
                <Card className="bg-gradient-glow border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Star className="h-5 w-5 text-primary" />
                      <span>Resume Score</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-5xl font-bold gradient-text mb-2">{analysis.score}/100</div>
                      <p className="text-muted-foreground">Your resume is performing well!</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Strengths & Improvements */}
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="bg-card/80 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2 text-success">
                        <CheckCircle className="h-5 w-5" />
                        <span>Strengths</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {analysis.strengths.map((strength, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start space-x-2"
                        >
                          <CheckCircle className="h-4 w-4 text-success mt-1 flex-shrink-0" />
                          <span className="text-sm">{strength}</span>
                        </motion.div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card className="bg-card/80 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2 text-warning">
                        <AlertCircle className="h-5 w-5" />
                        <span>Areas for Improvement</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {analysis.improvements.map((improvement, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start space-x-2"
                        >
                          <AlertCircle className="h-4 w-4 text-warning mt-1 flex-shrink-0" />
                          <span className="text-sm">{improvement}</span>
                        </motion.div>
                      ))}
                    </CardContent>
                  </Card>
                </div>

                {/* Job Fit Analysis */}
                <Card className="bg-card/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Target className="h-5 w-5 text-accent" />
                      <span>Job Fit Analysis</span>
                    </CardTitle>
                    <CardDescription>
                      Based on current market trends and your profile
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{analysis.jobFit.role}</span>
                      <Badge className="bg-accent text-accent-foreground">
                        {analysis.jobFit.matchPercentage}% Match
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Matching Skills:</p>
                      <div className="flex flex-wrap gap-2">
                        {analysis.jobFit.skills.map((skill, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* AI Suggestions */}
                <Card className="bg-card/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      <span>AI Suggestions</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {analysis.suggestions.map((suggestion, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-3 bg-primary/5 rounded-lg border border-primary/10"
                      >
                        <span className="text-sm">{suggestion}</span>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}