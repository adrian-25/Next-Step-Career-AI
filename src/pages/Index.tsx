import React, { useState } from "react";
import { motion } from "framer-motion";
import { Play, TrendingUp, Clock, Video, Headphones, ArrowRight, Zap, Target, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Index = () => {
  const [activeTab, setActiveTab] = useState("Now");

  const tabs = ["Now", "Trending", "Stories", "Videos", "Podcasts"];

  const contentData = {
    Now: [
      {
        id: 1,
        title: "Master React in 2024",
        image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80",
        category: "Train Me",
        type: "Course",
        duration: "8 weeks"
      },
      {
        id: 2,
        title: "AI Career Revolution",
        image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
        category: "Inspire Me",
        type: "Article",
        duration: "5 min read"
      },
      {
        id: 3,
        title: "Full-Stack Mastery Path",
        image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
        category: "Train Me",
        type: "Roadmap",
        duration: "12 weeks"
      }
    ],
    Trending: [
      {
        id: 4,
        title: "Next.js 14 Deep Dive",
        image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80",
        category: "Train Me",
        type: "Tutorial",
        duration: "2 hours"
      },
      {
        id: 5,
        title: "From Zero to Hero Dev",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80",
        category: "Inspire Me",
        type: "Success Story",
        duration: "10 min read"
      }
    ],
    Stories: [
      {
        id: 6,
        title: "My Coding Journey",
        image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80",
        category: "Inspire Me",
        type: "Personal Story",
        duration: "8 min read"
      }
    ],
    Videos: [
      {
        id: 7,
        title: "React Hooks Masterclass",
        image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&q=80",
        category: "Train Me",
        type: "Video Course",
        duration: "3 hours"
      }
    ],
    Podcasts: [
      {
        id: 8,
        title: "Tech Career Insights",
        image: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800&q=80",
        category: "Inspire Me",
        type: "Podcast",
        duration: "45 min"
      }
    ]
  };

  const currentContent = contentData[activeTab as keyof typeof contentData] || [];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="hero-section relative">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1920&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed"
          }}
        >
          <div className="absolute inset-0 hero-bg" />
        </div>

        <div className="hero-content animate-fade-in">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <h1 className="hero-title gradient-text mb-6">
              Next Step<br />
              <span className="neon-text neon-pulse">Career AI</span>
            </h1>
            
            <p className="hero-subtitle mb-8">
              Accelerate your career with AI-powered insights, personalized roadmaps, 
              and cutting-edge skill development that sets you apart.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="neon-glow text-lg px-8 py-4 group">
                <Zap className="mr-2 h-5 w-5 group-hover:animate-pulse" />
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
              
              <Button variant="outline" size="lg" className="glass text-lg px-8 py-4 border-primary/20 hover:border-primary/40">
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 right-20 animate-float">
          <div className="w-16 h-16 rounded-full bg-primary/20 blur-xl"></div>
        </div>
        <div className="absolute bottom-20 left-20 animate-float" style={{ animationDelay: "2s" }}>
          <div className="w-24 h-24 rounded-full bg-accent/20 blur-xl"></div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="sticky top-0 z-50 glass border-b border-border/50 backdrop-blur-xl">
        <div className="container mx-auto">
          <nav className="flex justify-center">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`nav-tab ${activeTab === tab ? 'active' : ''}`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {currentContent.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="content-card group cursor-pointer">
                  <div className="relative overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className={item.category === "Train Me" ? "tag-train" : "tag-inspire"}>
                        {item.category}
                      </Badge>
                    </div>
                    <div className="absolute top-4 right-4">
                      <div className="glass px-2 py-1 rounded-full text-xs text-foreground/80">
                        {item.duration}
                      </div>
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      {item.type === "Video Course" || item.type === "Tutorial" ? (
                        <Video className="h-4 w-4 text-primary" />
                      ) : item.type === "Podcast" ? (
                        <Headphones className="h-4 w-4 text-accent" />
                      ) : item.type === "Course" || item.type === "Roadmap" ? (
                        <Target className="h-4 w-4 text-primary" />
                      ) : (
                        <TrendingUp className="h-4 w-4 text-accent" />
                      )}
                      <span className="text-sm text-muted-foreground">{item.type}</span>
                    </div>
                    
                    <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {item.duration}
                      </div>
                      
                      <ArrowRight className="h-5 w-5 text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Empty State */}
          {currentContent.length === 0 && (
            <div className="text-center py-16">
              <Trophy className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Coming Soon</h3>
              <p className="text-muted-foreground">
                Amazing {activeTab.toLowerCase()} content is being crafted for you.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-t border-border/20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Active Learners", value: "50K+", icon: Target },
              { label: "Success Stories", value: "12K+", icon: Trophy },
              { label: "Career Paths", value: "100+", icon: TrendingUp },
              { label: "Expert Mentors", value: "500+", icon: Zap }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="glass-card p-6 rounded-xl">
                  <stat.icon className="h-8 w-8 text-primary mx-auto mb-4" />
                  <div className="text-3xl font-bold gradient-text mb-2">{stat.value}</div>
                  <div className="text-muted-foreground text-sm">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;