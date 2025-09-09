import React, { useState } from "react"
import { motion } from "framer-motion"
import { TrendingUp, FileText, Users, Target, Calendar, BarChart3, PieChart, Activity } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface SkillTrend {
  skill: string
  demand: number
  growth: number
  category: string
}

interface PlatformStats {
  totalResumes: number
  totalRoadmaps: number
  totalChatSessions: number
  avgSuccessRate: number
}

const skillTrends: SkillTrend[] = [
  { skill: "React", demand: 95, growth: 8, category: "Frontend" },
  { skill: "TypeScript", demand: 88, growth: 15, category: "Language" },
  { skill: "Node.js", demand: 82, growth: 5, category: "Backend" },
  { skill: "Python", demand: 90, growth: 12, category: "Language" },
  { skill: "AI/ML", demand: 85, growth: 25, category: "Emerging Tech" },
  { skill: "AWS", demand: 78, growth: 18, category: "Cloud" },
  { skill: "Docker", demand: 75, growth: 10, category: "DevOps" },
  { skill: "GraphQL", demand: 65, growth: 22, category: "Backend" }
]

const platformStats: PlatformStats = {
  totalResumes: 12847,
  totalRoadmaps: 8392,
  totalChatSessions: 15623,
  avgSuccessRate: 94
}

const monthlyData = [
  { month: "Jan", resumes: 1200, roadmaps: 800, chats: 1400 },
  { month: "Feb", resumes: 1350, roadmaps: 900, chats: 1580 },
  { month: "Mar", resumes: 1100, roadmaps: 750, chats: 1320 },
  { month: "Apr", resumes: 1500, roadmaps: 1100, chats: 1750 },
  { month: "May", resumes: 1800, roadmaps: 1300, chats: 2100 },
  { month: "Jun", resumes: 2200, roadmaps: 1600, chats: 2400 }
]

export function Analytics() {
  const [selectedTab, setSelectedTab] = useState("overview")

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Frontend": return "bg-primary/10 text-primary"
      case "Backend": return "bg-secondary/10 text-secondary"
      case "Language": return "bg-accent/10 text-accent"
      case "Cloud": return "bg-success/10 text-success"
      case "DevOps": return "bg-warning/10 text-warning"
      case "Emerging Tech": return "bg-destructive/10 text-destructive"
      default: return "bg-muted/10 text-muted-foreground"
    }
  }

  const getGrowthIndicator = (growth: number) => {
    if (growth > 15) return "🔥"
    if (growth > 8) return "📈"
    return "📊"
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
            Career <span className="gradient-text">Analytics</span>
          </motion.h1>
          <p className="text-muted-foreground text-lg">
            Insights into skill trends, platform usage, and career development patterns to help you make informed decisions.
          </p>
        </div>

        {/* Main Content */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Platform Overview</span>
            </TabsTrigger>
            <TabsTrigger value="skill-trends" className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span>Skill Trends</span>
            </TabsTrigger>
            <TabsTrigger value="usage-stats" className="flex items-center space-x-2">
              <Activity className="h-4 w-4" />
              <span>Usage Statistics</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 rounded-xl bg-primary/10">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{platformStats.totalResumes.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">Resumes Analyzed</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 rounded-xl bg-secondary/10">
                      <Target className="h-6 w-6 text-secondary" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{platformStats.totalRoadmaps.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">Career Roadmaps</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 rounded-xl bg-accent/10">
                      <Users className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{platformStats.totalChatSessions.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">AI Chat Sessions</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 rounded-xl bg-success/10">
                      <TrendingUp className="h-6 w-6 text-success" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{platformStats.avgSuccessRate}%</div>
                      <div className="text-sm text-muted-foreground">Success Rate</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Monthly Growth Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    <span>Monthly Usage Growth</span>
                  </CardTitle>
                  <CardDescription>
                    Platform engagement across all services over the past 6 months.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {monthlyData.map((data, index) => (
                      <div key={data.month} className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                          <span className="font-medium">{data.month}</span>
                          <span className="text-muted-foreground">
                            {(data.resumes + data.roadmaps + data.chats).toLocaleString()} total activities
                          </span>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <div className="w-16 text-xs text-muted-foreground">Resumes</div>
                            <Progress value={(data.resumes / 2500) * 100} className="flex-1 h-2" />
                            <div className="w-12 text-xs text-right">{data.resumes}</div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-16 text-xs text-muted-foreground">Roadmaps</div>
                            <Progress value={(data.roadmaps / 2500) * 100} className="flex-1 h-2" />
                            <div className="w-12 text-xs text-right">{data.roadmaps}</div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-16 text-xs text-muted-foreground">Chats</div>
                            <Progress value={(data.chats / 2500) * 100} className="flex-1 h-2" />
                            <div className="w-12 text-xs text-right">{data.chats}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Skill Trends Tab */}
          <TabsContent value="skill-trends" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <span>In-Demand Skills & Growth Trends</span>
                  </CardTitle>
                  <CardDescription>
                    Real-time market demand and growth rates for popular tech skills based on job postings and career roadmaps.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {skillTrends.map((skill, index) => (
                      <motion.div
                        key={skill.skill}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center space-x-4 p-4 rounded-lg border bg-card/50"
                      >
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-semibold text-lg">{skill.skill}</h3>
                            <Badge className={getCategoryColor(skill.category)}>
                              {skill.category}
                            </Badge>
                            <span className="text-lg">{getGrowthIndicator(skill.growth)}</span>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-muted-foreground">Market Demand</span>
                              <span className="font-medium">{skill.demand}%</span>
                            </div>
                            <Progress value={skill.demand} className="h-2" />
                            
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-muted-foreground">Growth Rate (YoY)</span>
                              <span className={`font-medium ${skill.growth > 15 ? 'text-success' : skill.growth > 8 ? 'text-warning' : 'text-muted-foreground'}`}>
                                +{skill.growth}%
                              </span>
                            </div>
                            <Progress value={(skill.growth / 30) * 100} className="h-2" />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Trending Categories */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <PieChart className="h-5 w-5 text-primary" />
                    <span>Trending Categories</span>
                  </CardTitle>
                  <CardDescription>
                    Skill categories with the highest growth and demand.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {Array.from(new Set(skillTrends.map(s => s.category))).map(category => {
                      const categorySkills = skillTrends.filter(s => s.category === category)
                      const avgGrowth = categorySkills.reduce((acc, s) => acc + s.growth, 0) / categorySkills.length
                      
                      return (
                        <div key={category} className="text-center p-4 rounded-lg bg-muted/30">
                          <div className="text-2xl font-bold text-primary mb-1">+{Math.round(avgGrowth)}%</div>
                          <div className="text-sm font-medium">{category}</div>
                          <div className="text-xs text-muted-foreground">{categorySkills.length} skills tracked</div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Usage Statistics Tab */}
          <TabsContent value="usage-stats" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {/* Feature Usage */}
              <Card>
                <CardHeader>
                  <CardTitle>Feature Usage Distribution</CardTitle>
                  <CardDescription>Most popular features on the platform</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Resume Analyzer</span>
                        <span>45%</span>
                      </div>
                      <Progress value={45} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>AI Mentor Chat</span>
                        <span>32%</span>
                      </div>
                      <Progress value={32} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Career Roadmap</span>
                        <span>23%</span>
                      </div>
                      <Progress value={23} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* User Success Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle>Success Metrics</CardTitle>
                  <CardDescription>Platform effectiveness indicators</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 rounded-lg bg-success/10">
                      <div className="text-2xl font-bold text-success">94%</div>
                      <div className="text-xs text-muted-foreground">User Satisfaction</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-primary/10">
                      <div className="text-2xl font-bold text-primary">78%</div>
                      <div className="text-xs text-muted-foreground">Career Progress</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-accent/10">
                      <div className="text-2xl font-bold text-accent">85%</div>
                      <div className="text-xs text-muted-foreground">Return Users</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-secondary/10">
                      <div className="text-2xl font-bold text-secondary">67%</div>
                      <div className="text-xs text-muted-foreground">Goal Achievement</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Peak Usage Times */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    <span>Usage Patterns</span>
                  </CardTitle>
                  <CardDescription>
                    When users are most active on the platform.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-7 gap-2 mb-6">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
                      const usage = [85, 92, 88, 90, 75, 45, 35][index]
                      return (
                        <div key={day} className="text-center">
                          <div className="text-xs text-muted-foreground mb-2">{day}</div>
                          <div className="h-20 bg-muted/30 rounded flex items-end justify-center p-1">
                            <div 
                              className="w-full bg-primary rounded transition-all duration-1000"
                              style={{ height: `${usage}%` }}
                            />
                          </div>
                          <div className="text-xs font-medium mt-2">{usage}%</div>
                        </div>
                      )
                    })}
                  </div>
                  
                  <div className="text-center text-sm text-muted-foreground">
                    Peak usage: Tuesday-Thursday, 2-4 PM EST
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}