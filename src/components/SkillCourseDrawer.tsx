import { useState } from "react"
import { ExternalLink, BookOpen, GraduationCap, Star, Bookmark } from "lucide-react"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

interface CourseResource {
  title: string
  provider: string
  url: string
  type: "free" | "paid"
  description: string
  rating?: number
  price?: string
}

interface SkillCourseData {
  skill: string
  description: string
  free: CourseResource
  paid: CourseResource
  persuasiveMessage: string
}

// Course database - modular and expandable
const skillCoursesDb: Record<string, SkillCourseData> = {
  "React": {
    skill: "React",
    description: "Master the most popular frontend library",
    free: {
      title: "React Official Tutorial",
      provider: "React.dev",
      url: "https://react.dev/learn",
      type: "free",
      description: "Official React documentation and tutorial"
    },
    paid: {
      title: "The Complete React Developer Course",
      provider: "Udemy",
      url: "https://udemy.com/course/react-redux/?referralCode=CAREER2024",
      type: "paid",
      description: "Comprehensive React course with projects",
      rating: 4.7,
      price: "$84.99"
    },
    persuasiveMessage: "Free resources help you get started, but paid courses give you structured learning, real projects, expert guidance, and certificates to showcase your React skills. Think of it as an investment in your career."
  },
  "TypeScript": {
    skill: "TypeScript",
    description: "Add type safety to your JavaScript projects",
    free: {
      title: "TypeScript Handbook",
      provider: "TypeScript.org",
      url: "https://www.typescriptlang.org/docs/",
      type: "free",
      description: "Official TypeScript documentation"
    },
    paid: {
      title: "Understanding TypeScript - 2024 Edition",
      provider: "Udemy",
      url: "https://udemy.com/course/understanding-typescript/?referralCode=CAREER2024",
      type: "paid",
      description: "Master TypeScript from basics to advanced",
      rating: 4.8,
      price: "$94.99"
    },
    persuasiveMessage: "While free docs teach syntax, paid TypeScript courses provide real-world patterns, debugging techniques, and industry best practices that will make you a confident TypeScript developer."
  },
  "Node.js": {
    skill: "Node.js",
    description: "Build scalable backend applications",
    free: {
      title: "Node.js Guide",
      provider: "Node.js.org",
      url: "https://nodejs.org/en/docs/guides/",
      type: "free",
      description: "Official Node.js guides and documentation"
    },
    paid: {
      title: "The Complete Node.js Developer Course",
      provider: "Udemy",
      url: "https://udemy.com/course/the-complete-nodejs-developer-course-2/?referralCode=CAREER2024",
      type: "paid",
      description: "Build real Node.js apps and APIs",
      rating: 4.6,
      price: "$84.99"
    },
    persuasiveMessage: "Free Node.js resources cover basics, but paid courses teach you production-ready patterns, security best practices, and deployment strategies that employers actually want."
  },
  "AWS": {
    skill: "AWS",
    description: "Master cloud computing with Amazon Web Services",
    free: {
      title: "AWS Free Tier Training",
      provider: "AWS Skill Builder",
      url: "https://skillbuilder.aws/",
      type: "free",
      description: "Free AWS training courses and labs"
    },
    paid: {
      title: "AWS Certified Solutions Architect",
      provider: "A Cloud Guru",
      url: "https://acloudguru.com/course/aws-certified-solutions-architect-associate-saa-c03?referralCode=CAREER2024",
      type: "paid",
      description: "Complete AWS certification prep course",
      rating: 4.9,
      price: "$39/month"
    },
    persuasiveMessage: "AWS certification is worth $130k+ average salary. Free resources are scattered, but structured paid courses provide certification-focused learning with hands-on labs and job-ready skills."
  }
}

// Generic fallback for skills not in database
const getGenericCourseData = (skill: string): SkillCourseData => ({
  skill,
  description: `Learn ${skill} effectively`,
  free: {
    title: `${skill} Documentation`,
    provider: "Official Docs",
    url: `https://www.google.com/search?q=${encodeURIComponent(skill)}+official+documentation`,
    type: "free",
    description: `Official ${skill} documentation and guides`
  },
  paid: {
    title: `Master ${skill} - Complete Course`,
    provider: "Udemy",
    url: `https://www.udemy.com/courses/search/?q=${encodeURIComponent(skill)}&referralCode=CAREER2024`,
    type: "paid",
    description: `Comprehensive ${skill} course with projects`,
    rating: 4.5,
    price: "$79.99"
  },
  persuasiveMessage: `Free resources help you get started with ${skill}, but paid courses give you structured learning, real projects, expert guidance, and certificates to showcase your skills. Think of it as an investment in your career.`
})

interface SkillCourseDrawerProps {
  skill: string
  children: React.ReactNode
}

export function SkillCourseDrawer({ skill, children }: SkillCourseDrawerProps) {
  const [isBookmarked, setIsBookmarked] = useState(false)
  const { toast } = useToast()
  
  const courseData = skillCoursesDb[skill] || getGenericCourseData(skill)

  const trackClick = (type: "free" | "paid", skillName: string) => {
    // Analytics tracking
    console.log(`Course click: ${type} - ${skillName}`)
    
    // Here you would send to your analytics service
    // analytics.track('course_click', { skill: skillName, type })
  }

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
    toast({
      title: isBookmarked ? "Removed from roadmap" : "Added to roadmap",
      description: `${courseData.skill} course ${isBookmarked ? "removed from" : "added to"} your learning path.`,
    })
  }

  const handleCourseClick = (course: CourseResource) => {
    trackClick(course.type, courseData.skill)
    window.open(course.url, "_blank")
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>
        {children}
      </DrawerTrigger>
      <DrawerContent className="max-w-md mx-auto">
        <DrawerHeader className="text-center">
          <DrawerTitle className="flex items-center justify-center space-x-2">
            <GraduationCap className="h-5 w-5 text-primary" />
            <span>Learn {courseData.skill}</span>
          </DrawerTitle>
          <DrawerDescription>
            {courseData.description}
          </DrawerDescription>
        </DrawerHeader>
        
        <div className="p-4 space-y-4">
          {/* Free Resource */}
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    Free - Quick Start
                  </Badge>
                </div>
              </div>
              <h3 className="font-semibold mb-1">{courseData.free.title}</h3>
              <p className="text-sm text-muted-foreground mb-3">
                {courseData.free.description}
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => handleCourseClick(courseData.free)}
              >
                <ExternalLink className="h-3 w-3 mr-2" />
                Start Free Course
              </Button>
            </CardContent>
          </Card>

          {/* Paid Resource */}
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
            <CardContent className="pt-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4 text-primary" />
                  <Badge className="bg-primary text-primary-foreground">
                    Recommended 🚀
                  </Badge>
                </div>
                {courseData.paid.rating && (
                  <div className="flex items-center space-x-1 text-sm">
                    <Star className="h-3 w-3 fill-current text-yellow-500" />
                    <span>{courseData.paid.rating}</span>
                  </div>
                )}
              </div>
              <h3 className="font-semibold mb-1">{courseData.paid.title}</h3>
              <p className="text-sm text-muted-foreground mb-2">
                {courseData.paid.description}
              </p>
              {courseData.paid.price && (
                <p className="text-sm font-medium text-primary mb-3">
                  {courseData.paid.price}
                </p>
              )}
              <Button 
                className="w-full gradient-bg"
                onClick={() => handleCourseClick(courseData.paid)}
              >
                <ExternalLink className="h-3 w-3 mr-2" />
                Deep Dive Course
              </Button>
            </CardContent>
          </Card>

          {/* Persuasive Message */}
          <div className="bg-muted/50 rounded-lg p-3">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {courseData.persuasiveMessage}
            </p>
          </div>

          {/* Actions */}
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleBookmark}
              className="flex-1"
            >
              <Bookmark className={`h-3 w-3 mr-2 ${isBookmarked ? "fill-current" : ""}`} />
              {isBookmarked ? "Bookmarked" : "Bookmark"}
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}