import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QuickStartMenu } from "@/components/QuickStartMenu";
import { CareerMentor } from "@/components/CareerMentor";
import { ArrowLeft, MessageSquare, Lightbulb } from "lucide-react";

// Mock skill analysis for demonstration
const mockSkillAnalysis = {
  user_skills: [
    { name: "JavaScript", confidence: 0.85 },
    { name: "React", confidence: 0.80 },
    { name: "Node.js", confidence: 0.75 },
    { name: "Python", confidence: 0.70 },
    { name: "SQL", confidence: 0.65 }
  ],
  suggested_skills: [
    {
      name: "TypeScript",
      priority: "high",
      reason: "Type safety and better developer experience for large codebases",
      recommended_action: "Complete TypeScript course and migrate existing JavaScript projects"
    },
    {
      name: "AWS",
      priority: "high",
      reason: "Cloud skills are in high demand and can increase salary by 25%",
      recommended_action: "Start with AWS Free Tier and complete Solutions Architect Associate certification"
    },
    {
      name: "Docker",
      priority: "medium",
      reason: "Essential for modern development workflows and deployment",
      recommended_action: "Learn Docker fundamentals and containerize 2-3 projects"
    },
    {
      name: "GraphQL",
      priority: "medium",
      reason: "Modern API development skill that's growing in popularity",
      recommended_action: "Build a GraphQL API with Node.js and React frontend"
    }
  ],
  skills_chart: [
    { name: "JavaScript", score: 85 },
    { name: "React", score: 80 },
    { name: "Node.js", score: 75 },
    { name: "Python", score: 70 },
    { name: "SQL", score: 65 },
    { name: "TypeScript", score: 30 },
    { name: "AWS", score: 25 },
    { name: "Docker", score: 20 },
    { name: "GraphQL", score: 15 }
  ],
  top_recommendations: [
    {
      title: "Learn TypeScript",
      details: "Add TypeScript to your skill set to improve code quality and developer experience",
      impact: "high"
    },
    {
      title: "Get Cloud Certified",
      details: "AWS or Azure certification can significantly boost your market value",
      impact: "high"
    },
    {
      title: "Build Portfolio Projects",
      details: "Create 2-3 full-stack projects showcasing your skills",
      impact: "medium"
    }
  ],
  resume_elevator_pitch: "Full-stack developer with 3+ years building scalable web applications using React and Node.js, with experience in improving application performance by 40% and leading development teams.",
  suggested_keywords: ["JavaScript", "React", "Node.js", "TypeScript", "AWS", "Docker", "Full-stack", "API Development"],
  summary_text: "Strong technical foundation with JavaScript and React; focus on TypeScript and cloud technologies to advance to senior roles.",
  metadata: {
    model_confidence: 0.88
  }
};

export function CareerMentorPage() {
  const [selectedQuestion, setSelectedQuestion] = useState<string>("");
  const [customQuestion, setCustomQuestion] = useState<string>("");
  const [showAnalysis, setShowAnalysis] = useState<boolean>(false);

  const handleQuestionSelect = (question: string) => {
    setSelectedQuestion(question);
    setShowAnalysis(true);
  };

  const handleCustomQuestion = () => {
    if (customQuestion.trim()) {
      setSelectedQuestion(customQuestion);
      setShowAnalysis(true);
    }
  };

  const handleBackToMenu = () => {
    setSelectedQuestion("");
    setShowAnalysis(false);
  };

  if (showAnalysis && selectedQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-surface to-surface-light p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <Button 
              variant="ghost" 
              onClick={handleBackToMenu}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Quick Start Menu
            </Button>
            <h1 className="text-3xl font-bold mb-2">Career Mentor Response</h1>
            <p className="text-muted-foreground">Your question: "{selectedQuestion}"</p>
          </div>

          <CareerMentor 
            analysis={mockSkillAnalysis}
            userSkills={["JavaScript", "React", "Node.js"]}
            targetRole="Senior Full-Stack Developer"
            experienceYears={3}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-surface to-surface-light p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-5xl font-black mb-4">
            <span className="gradient-text">AI Career</span> Mentor
          </h1>
          <p className="text-xl text-muted-foreground">
            Get personalized career guidance, skill recommendations, and actionable advice.
          </p>
        </div>

        <Tabs defaultValue="quickstart" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="quickstart">Quick Start</TabsTrigger>
            <TabsTrigger value="custom">Custom Question</TabsTrigger>
            <TabsTrigger value="analysis">Resume Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="quickstart" className="mt-6">
            <QuickStartMenu onQuestionSelect={handleQuestionSelect} />
          </TabsContent>

          <TabsContent value="custom" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  Ask a Custom Question
                </CardTitle>
                <CardDescription>
                  Have a specific career question? Ask me anything!
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="custom-question" className="text-sm font-medium">
                    Your Career Question
                  </label>
                  <Input
                    id="custom-question"
                    placeholder="e.g., How do I transition from frontend to full-stack development?"
                    value={customQuestion}
                    onChange={(e) => setCustomQuestion(e.target.value)}
                    className="h-12"
                  />
                </div>
                <Button 
                  onClick={handleCustomQuestion}
                  disabled={!customQuestion.trim()}
                  className="w-full"
                >
                  Get Career Advice
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analysis" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-yellow-500" />
                  Resume-Based Career Guidance
                </CardTitle>
                <CardDescription>
                  Upload your resume to get personalized career advice based on your experience and skills
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">
                    This feature is available in the Resume Analyzer section.
                  </p>
                  <Button asChild>
                    <a href="/resume-analyzer">Go to Resume Analyzer</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
