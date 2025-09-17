import React, { useState } from "react"
import { motion } from "framer-motion"
import { Upload, Search, Target, ExternalLink, TrendingUp, MapPin, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"

interface JobMatch {
  id: string
  title: string
  company: string
  location: string
  salary: string
  fitPercentage: number
  skills: string[]
  type: string
  postedDate: string
  description: string
  applyUrl: string
}

const mockJobs: JobMatch[] = [
  {
    id: "1",
    title: "Senior Frontend Developer",
    company: "Tata Consultancy Services",
    location: "Bangalore, India",
    salary: "₹15-25 LPA",
    fitPercentage: 92,
    skills: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
    type: "Full-time",
    postedDate: "2 days ago",
    description: "We're looking for a senior frontend developer to lead our web application development team in Bangalore.",
    applyUrl: "https://www.naukri.com/job-listings"
  },
  {
    id: "2", 
    title: "Full Stack Developer",
    company: "Flipkart",
    location: "Hyderabad, India",
    salary: "₹12-20 LPA",
    fitPercentage: 87,
    skills: ["Node.js", "React", "MongoDB", "AWS"],
    type: "Full-time",
    postedDate: "1 week ago",
    description: "Join Flipkart's tech team as a full stack developer. Work on high-scale e-commerce solutions.",
    applyUrl: "https://www.flipkartcareers.com/"
  },
  {
    id: "3",
    title: "React Developer",
    company: "Zomato",
    location: "Remote/Gurgaon",
    salary: "₹8-15 LPA",
    fitPercentage: 79,
    skills: ["React", "JavaScript", "CSS", "Git"],
    type: "Full-time",
    postedDate: "3 days ago",
    description: "Remote React developer position for building food-tech applications with millions of users.",
    applyUrl: "https://www.zomato.com/careers"
  },
  {
    id: "4",
    title: "Software Engineer",
    company: "Paytm",
    location: "Noida, India",
    salary: "₹10-18 LPA",
    fitPercentage: 74,
    skills: ["Java", "React", "Spring Boot", "MySQL"],
    type: "Full-time", 
    postedDate: "5 days ago",
    description: "Develop innovative fintech solutions at Paytm. Work with cutting-edge payment technologies.",
    applyUrl: "https://jobs.paytm.com/"
  }
]

export function JobRecommendations() {
  const [file, setFile] = useState<File | null>(null)
  const [jobs, setJobs] = useState<JobMatch[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [hasAnalyzed, setHasAnalyzed] = useState(false)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      if (selectedFile.type === "application/pdf" || selectedFile.type.includes("document")) {
        setFile(selectedFile)
        toast.success("Resume uploaded successfully!")
      } else {
        toast.error("Please upload a PDF or Word document")
      }
    }
  }

  const analyzeResume = async () => {
    if (!file) return

    setIsAnalyzing(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    setJobs(mockJobs)
    setHasAnalyzed(true)
    setIsAnalyzing(false)
    toast.success("Found matching job opportunities!")
  }

  const getFitColor = (percentage: number) => {
    if (percentage >= 85) return "text-success"
    if (percentage >= 70) return "text-warning"
    return "text-destructive"
  }

  const getFitBgColor = (percentage: number) => {
    if (percentage >= 85) return "bg-success/10"
    if (percentage >= 70) return "bg-warning/10"
    return "bg-destructive/10"
  }

  return (
    <div className="min-h-screen bg-gradient-surface p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="mb-8">
          <motion.h1 
            className="text-4xl font-bold mb-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            Job <span className="gradient-text">Recommendations</span>
          </motion.h1>
          <p className="text-muted-foreground text-lg">
            Upload your resume to get AI-powered job matches with live postings and fit analysis.
          </p>
        </div>

        {!hasAnalyzed ? (
          /* Upload Section */
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="max-w-2xl mx-auto">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center space-x-2">
                  <Target className="h-6 w-6 text-primary" />
                  <span>Find Your Perfect Job Match</span>
                </CardTitle>
                <CardDescription>
                  Our AI analyzes your resume against thousands of live job postings to find the best matches for your skills and experience.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="resume-upload"
                  />
                  <label htmlFor="resume-upload" className="cursor-pointer">
                    <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg font-medium mb-2">
                      {file ? file.name : "Upload your resume"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Supports PDF, DOC, DOCX files up to 10MB
                    </p>
                  </label>
                </div>

                <Button
                  onClick={analyzeResume}
                  disabled={!file || isAnalyzing}
                  className="w-full gradient-bg text-white"
                  size="lg"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                      Analyzing Resume & Finding Jobs...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Find Job Matches
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          /* Results Section */
          <div className="space-y-6">
            {/* Summary Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
            >
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-primary">{jobs.length}</div>
                  <div className="text-sm text-muted-foreground">Job Matches Found</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-success">
                    {Math.round(jobs.reduce((acc, job) => acc + job.fitPercentage, 0) / jobs.length)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Average Fit</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-accent">
                    {jobs.filter(job => job.fitPercentage >= 85).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Excellent Matches</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-secondary">
                    {jobs.filter(job => job.type === "Remote" || job.location.includes("Remote")).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Remote Options</div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Job Listings */}
            <div className="space-y-4">
              {jobs.map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-glow transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="text-xl font-bold text-foreground mb-1">{job.title}</h3>
                              <p className="text-lg text-muted-foreground">{job.company}</p>
                            </div>
                            <div className={`px-3 py-1 rounded-full ${getFitBgColor(job.fitPercentage)}`}>
                              <span className={`text-sm font-bold ${getFitColor(job.fitPercentage)}`}>
                                {job.fitPercentage}% Match
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-muted-foreground">
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              {job.location}
                            </div>
                            <div className="flex items-center">
                              <TrendingUp className="h-4 w-4 mr-1" />
                              {job.salary}
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {job.postedDate}
                            </div>
                            <Badge variant={job.type === "Full-time" ? "default" : "secondary"}>
                              {job.type}
                            </Badge>
                          </div>

                          <p className="text-muted-foreground mb-4">{job.description}</p>

                          <div className="flex flex-wrap gap-2 mb-4">
                            {job.skills.map((skill) => (
                              <Badge key={skill} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>

                          <div className="mb-3">
                            <div className="flex justify-between text-sm mb-1">
                              <span>Skill Match</span>
                              <span className={getFitColor(job.fitPercentage)}>{job.fitPercentage}%</span>
                            </div>
                            <Progress value={job.fitPercentage} className="h-2" />
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 min-w-[120px]">
                          <Button 
                            className="w-full gradient-bg text-white"
                            onClick={() => window.open(job.applyUrl, '_blank')}
                          >
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Apply Now
                          </Button>
                          <Button variant="outline" className="w-full">
                            Save Job
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Reset Button */}
            <div className="text-center mt-8">
              <Button
                variant="outline"
                onClick={() => {
                  setHasAnalyzed(false)
                  setJobs([])
                  setFile(null)
                }}
              >
                Analyze New Resume
              </Button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}