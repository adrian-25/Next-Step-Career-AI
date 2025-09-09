import React from "react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { 
  FileText, 
  Route, 
  MessageSquare, 
  TrendingUp, 
  Users, 
  Star,
  ArrowRight,
  Sparkles
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const features = [
  {
    title: "Resume Analyzer",
    description: "Upload your resume and get AI-powered insights on strengths, weaknesses, and improvement suggestions.",
    icon: FileText,
    href: "/resume",
    gradient: "from-primary to-secondary",
  },
  {
    title: "Career Roadmap",
    description: "Generate a personalized step-by-step career growth plan with skills, courses, and timelines.",
    icon: Route,
    href: "/roadmap",
    gradient: "from-accent to-success",
  },
  {
    title: "AI Career Mentor",
    description: "Chat with our AI mentor for real-time career advice, job search tips, and professional guidance.",
    icon: MessageSquare,
    href: "/mentor",
    gradient: "from-secondary to-accent",
  },
]

const stats = [
  { label: "Resumes Analyzed", value: "10,000+", icon: FileText },
  { label: "Career Paths", value: "500+", icon: Route },
  { label: "Success Rate", value: "94%", icon: TrendingUp },
  { label: "Happy Users", value: "2,500+", icon: Users },
]

export function Dashboard() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-surface">
      {/* Hero Section */}
      <motion.div 
        className="relative px-8 pt-16 pb-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            className="mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <div className="inline-flex items-center space-x-2 bg-gradient-glow px-4 py-2 rounded-full border border-primary/20">
              <Sparkles className="h-4 w-4 text-primary animate-pulse" />
              <span className="text-sm font-medium text-foreground">Powered by Advanced AI</span>
            </div>
          </motion.div>
          
          <motion.h1 
            className="text-5xl md:text-6xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <span className="gradient-text">Next Step</span>{" "}
            <span className="text-foreground">Career AI</span>
          </motion.h1>
          
          <motion.p 
            className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Accelerate your career growth with AI-powered insights, personalized roadmaps, 
            and expert mentorship. Your future starts here.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Button 
              size="lg" 
              className="gradient-bg text-white hover:shadow-glow transition-all duration-300"
              onClick={() => navigate("/resume")}
            >
              Analyze Resume <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-primary/20 hover:bg-primary/5"
              onClick={() => navigate("/mentor")}
            >
              Chat with AI Mentor
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Stats Section */}
      <motion.div 
        className="px-8 py-12 bg-card/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-3">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Features Section */}
      <div className="px-8 py-20">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <h2 className="text-4xl font-bold mb-4 text-foreground">
              Everything You Need to <span className="gradient-text">Succeed</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive tools and AI guidance to help you navigate your career journey with confidence.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + index * 0.2 }}
                whileHover={{ y: -5 }}
                className="cursor-pointer"
                onClick={() => navigate(feature.href)}
              >
                <Card className="h-full hover:shadow-glow transition-all duration-300 border-border/50 bg-card/80 backdrop-blur-sm">
                  <CardHeader className="space-y-4">
                    <div className={`inline-flex w-fit p-3 rounded-xl bg-gradient-to-br ${feature.gradient}`}>
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold">{feature.title}</CardTitle>
                    <CardDescription className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-between hover:bg-primary/5 text-primary"
                    >
                      Get Started
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}