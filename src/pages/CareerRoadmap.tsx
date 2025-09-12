import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Target, 
  Clock, 
  CheckCircle, 
  Circle, 
  Book, 
  Award, 
  TrendingUp,
  Sparkles,
  ArrowRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { SkillCourseDrawer } from "@/components/SkillCourseDrawer"

interface RoadmapStep {
  id: string
  title: string
  description: string
  type: "skill" | "course" | "certification" | "experience"
  duration: string
  priority: "high" | "medium" | "low"
  completed: boolean
  skills: string[]
}

interface Roadmap {
  title: string
  description: string
  timeline: string
  completionRate: number
  steps: RoadmapStep[]
}

const sampleRoadmap: Roadmap = {
  title: "Senior Full-Stack Developer",
  description: "Complete roadmap to become a senior full-stack developer with modern technologies",
  timeline: "12-18 months",
  completionRate: 35,
  steps: [
    {
      id: "1",
      title: "Master Advanced React Patterns",
      description: "Learn Context API, Custom Hooks, and Performance optimization techniques",
      type: "skill",
      duration: "4-6 weeks",
      priority: "high",
      completed: true,
      skills: ["React", "Hooks", "Context API", "Performance"]
    },
    {
      id: "2", 
      title: "TypeScript Fundamentals & Advanced Types",
      description: "Master TypeScript for type-safe development and better code maintainability",
      type: "course",
      duration: "3-4 weeks",
      priority: "high",
      completed: true,
      skills: ["TypeScript", "Type Safety", "Generics"]
    },
    {
      id: "3",
      title: "Node.js & Express Backend Development",
      description: "Build scalable backend services with Node.js, Express, and database integration",
      type: "skill",
      duration: "6-8 weeks",
      priority: "high",
      completed: false,
      skills: ["Node.js", "Express", "APIs", "Database"]
    },
    {
      id: "4",
      title: "AWS Cloud Practitioner Certification",
      description: "Get certified in AWS cloud services and deployment strategies",
      type: "certification",
      duration: "8-10 weeks",
      priority: "medium",
      completed: false,
      skills: ["AWS", "Cloud", "DevOps", "Deployment"]
    },
    {
      id: "5",
      title: "Lead a Full-Stack Project",
      description: "Take ownership of a complete project from design to deployment",
      type: "experience",
      duration: "12-16 weeks",
      priority: "medium",
      completed: false,
      skills: ["Leadership", "Project Management", "Full-Stack"]
    },
    {
      id: "6",
      title: "System Design & Architecture",
      description: "Learn to design scalable systems and make architectural decisions",
      type: "course",
      duration: "6-8 weeks",
      priority: "medium",
      completed: false,
      skills: ["System Design", "Architecture", "Scalability"]
    }
  ]
}

export function CareerRoadmap() {
  const [careerGoal, setCareerGoal] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null)
  const { toast } = useToast()

  const generateRoadmap = async () => {
    if (!careerGoal.trim()) {
      toast({
        title: "Please enter a career goal",
        description: "Tell us what role or skill you want to achieve.",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
    
    // TODO: Implement actual AI roadmap generation
    // Simulating API call for now
    setTimeout(() => {
      setRoadmap(sampleRoadmap)
      setIsGenerating(false)
      toast({
        title: "Roadmap generated!",
        description: "Your personalized career roadmap is ready.",
      })
    }, 2500)
  }

  const toggleStepCompletion = (stepId: string) => {
    if (!roadmap) return
    
    const updatedSteps = roadmap.steps.map(step => 
      step.id === stepId ? { ...step, completed: !step.completed } : step
    )
    
    const completedSteps = updatedSteps.filter(step => step.completed).length
    const completionRate = Math.round((completedSteps / updatedSteps.length) * 100)
    
    setRoadmap({
      ...roadmap,
      steps: updatedSteps,
      completionRate
    })
  }

  const getStepIcon = (type: string) => {
    switch (type) {
      case "skill": return Target
      case "course": return Book
      case "certification": return Award
      case "experience": return TrendingUp
      default: return Circle
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-destructive text-destructive-foreground"
      case "medium": return "bg-warning text-warning-foreground"
      case "low": return "bg-muted text-muted-foreground"
      default: return "bg-muted text-muted-foreground"
    }
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
            <span className="gradient-text">Career</span> Roadmap
          </h1>
          <p className="text-lg text-muted-foreground">
            Get a personalized step-by-step plan to achieve your career goals with AI-powered recommendations.
          </p>
        </motion.div>

        {!roadmap && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-gradient-glow border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <span>Generate Your Roadmap</span>
                </CardTitle>
                <CardDescription>
                  Tell us your career goal and we'll create a personalized learning path
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="e.g., Senior Full-Stack Developer, Data Scientist, Product Manager..."
                  value={careerGoal}
                  onChange={(e) => setCareerGoal(e.target.value)}
                  className="text-lg"
                />
                <Button 
                  onClick={generateRoadmap} 
                  disabled={isGenerating}
                  className="w-full gradient-bg"
                  size="lg"
                >
                  {isGenerating ? "Generating Roadmap..." : "Generate Roadmap"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Loading State */}
        <AnimatePresence>
          {isGenerating && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="mt-6"
            >
              <Card className="bg-card/80 backdrop-blur-sm">
                <CardContent className="pt-6">
                  <div className="text-center space-y-4">
                    <div className="inline-flex p-4 bg-primary/10 rounded-full animate-pulse">
                      <Target className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold">Creating Your Roadmap</h3>
                    <p className="text-muted-foreground">
                      Analyzing market trends and skills requirements for "{careerGoal}"...
                    </p>
                    <Progress value={60} className="max-w-md mx-auto" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Generated Roadmap */}
        <AnimatePresence>
          {roadmap && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6 mt-6"
            >
              {/* Roadmap Header */}
              <Card className="bg-gradient-glow border-primary/20">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl gradient-text">{roadmap.title}</CardTitle>
                      <CardDescription className="mt-2 text-base">
                        {roadmap.description}
                      </CardDescription>
                    </div>
                    <Badge className="bg-accent text-accent-foreground">
                      <Clock className="w-3 h-3 mr-1" />
                      {roadmap.timeline}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{roadmap.completionRate}% complete</span>
                    </div>
                    <Progress value={roadmap.completionRate} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              {/* Roadmap Steps */}
              <div className="space-y-4">
                {roadmap.steps.map((step, index) => {
                  const StepIcon = getStepIcon(step.type)
                  return (
                    <motion.div
                      key={step.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card 
                        className={`cursor-pointer transition-all duration-300 hover:shadow-glow ${
                          step.completed ? "bg-success/5 border-success/20" : "bg-card/80 backdrop-blur-sm"
                        }`}
                        onClick={() => toggleStepCompletion(step.id)}
                      >
                        <CardContent className="pt-6">
                          <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0">
                              {step.completed ? (
                                <CheckCircle className="h-6 w-6 text-success" />
                              ) : (
                                <Circle className="h-6 w-6 text-muted-foreground" />
                              )}
                            </div>
                            <div className="flex-1 space-y-3">
                              <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-lg">{step.title}</h3>
                                <div className="flex items-center space-x-2">
                                  <Badge className={getPriorityColor(step.priority)}>
                                    {step.priority}
                                  </Badge>
                                  <Badge variant="outline" className="flex items-center space-x-1">
                                    <StepIcon className="w-3 h-3" />
                                    <span>{step.type}</span>
                                  </Badge>
                                </div>
                              </div>
                              <p className="text-muted-foreground">{step.description}</p>
                              <div className="flex items-center justify-between">
                                <div className="flex flex-wrap gap-1">
                                  {step.skills.map((skill, skillIndex) => (
                                    <SkillCourseDrawer key={skillIndex} skill={skill}>
                                      <Badge 
                                        variant="secondary" 
                                        className="text-xs cursor-pointer hover:bg-primary/20 transition-colors"
                                      >
                                        {skill}
                                      </Badge>
                                    </SkillCourseDrawer>
                                  ))}
                                </div>
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {step.duration}
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })}
              </div>

              {/* Generate New Roadmap */}
              <Card className="bg-muted/50">
                <CardContent className="pt-6 text-center">
                  <p className="text-muted-foreground mb-4">
                    Want to create a roadmap for a different career goal?
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setRoadmap(null)
                      setCareerGoal("")
                    }}
                  >
                    Generate New Roadmap
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}