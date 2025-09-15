import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  FileText, 
  Route, 
  MessageSquare, 
  Target, 
  Code, 
  Users, 
  TrendingUp, 
  Bot,
  ArrowRight,
  Sparkles
} from "lucide-react";

const topics = [
  {
    id: "resume",
    title: "Resume Analyzer",
    description: "AI-powered resume insights with improvement suggestions and job fit analysis",
    icon: FileText,
    route: "/resume",
    color: "from-primary to-accent",
    image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&q=80"
  },
  {
    id: "roadmap",
    title: "Career Roadmap",
    description: "Personalized step-by-step career growth plans with skills and timelines",
    icon: Route,
    route: "/roadmap",
    color: "from-accent to-primary",
    image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&q=80"
  },
  {
    id: "mentor",
    title: "AI Mentor",
    description: "Real-time career advice, job search tips, and professional guidance",
    icon: MessageSquare,
    route: "/mentor",
    color: "from-primary to-secondary",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&q=80"
  },
  {
    id: "jobs",
    title: "Job Match",
    description: "Intelligent job recommendations based on your skills and preferences",
    icon: Target,
    route: "/jobs",
    color: "from-accent to-primary",
    image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400&q=80"
  },
  {
    id: "portfolio",
    title: "Portfolio Ideas",
    description: "AI-generated project suggestions to showcase your skills",
    icon: Code,
    route: "/portfolio",
    color: "from-primary to-accent",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&q=80"
  },
  {
    id: "networking",
    title: "Networking Hub",
    description: "Connect with professionals and build meaningful career relationships",
    icon: Users,
    route: "/networking",
    color: "from-accent to-secondary",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&q=80"
  },
  {
    id: "analytics",
    title: "Career Analytics",
    description: "Track your progress with detailed insights and growth metrics",
    icon: TrendingUp,
    route: "/analytics",
    color: "from-secondary to-accent",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80"
  }
];

export function TopicsPage() {
  const navigate = useNavigate();
  const [hoveredTopic, setHoveredTopic] = useState<string | null>(null);

  const handleTopicClick = (route: string) => {
    navigate(route);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-surface to-surface-light relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-accent/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Header */}
      <div className="relative z-10 pt-20 pb-16 text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="mb-8"
        >
          <div className="inline-flex items-center space-x-2 bg-surface/80 backdrop-blur-sm px-6 py-3 rounded-full border border-primary/20 mb-8">
            <Bot className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Choose Your Path</span>
          </div>
        </motion.div>

        <motion.h1 
          className="text-6xl md:text-7xl font-black mb-6 leading-tight"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.2 }}
        >
          <span className="gradient-text">Career</span><br />
          <span className="neon-text">Intelligence</span>
        </motion.h1>
        
        <motion.p 
          className="text-xl text-muted-foreground max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          Unlock your potential with AI-powered career tools. Select a feature to begin your transformation.
        </motion.p>
      </div>

      {/* Topics Grid */}
      <div className="relative z-10 px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {topics.map((topic, index) => (
              <motion.div
                key={topic.id}
                className="relative group cursor-pointer"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                onHoverStart={() => setHoveredTopic(topic.id)}
                onHoverEnd={() => setHoveredTopic(null)}
                onClick={() => handleTopicClick(topic.route)}
              >
                {/* Circular Card */}
                <div className="relative aspect-square">
                  {/* Background Circle */}
                  <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${topic.color} p-1`}>
                    <div className="w-full h-full rounded-full bg-surface/90 backdrop-blur-sm border border-border/50 overflow-hidden">
                      {/* Background Image */}
                      <div 
                        className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-300"
                        style={{
                          backgroundImage: `url(${topic.image})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center'
                        }}
                      />
                      
                      {/* Content */}
                      <div className="relative z-10 flex flex-col items-center justify-center h-full p-6 text-center">
                        {/* Icon */}
                        <div className={`mb-4 p-4 rounded-full bg-gradient-to-br ${topic.color} group-hover:scale-110 transition-transform duration-300`}>
                          <topic.icon className="h-8 w-8 text-white" />
                        </div>
                        
                        {/* Title */}
                        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                          {topic.title}
                        </h3>
                        
                        {/* Description - only show on hover */}
                        <motion.p 
                          className="text-sm text-muted-foreground leading-relaxed"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: hoveredTopic === topic.id ? 1 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          {topic.description}
                        </motion.p>

                        {/* Arrow indicator */}
                        <motion.div
                          className="mt-4"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ 
                            opacity: hoveredTopic === topic.id ? 1 : 0,
                            x: hoveredTopic === topic.id ? 0 : -10
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          <ArrowRight className="h-5 w-5 text-primary" />
                        </motion.div>
                      </div>
                    </div>
                  </div>

                  {/* Glow Effect */}
                  <motion.div
                    className={`absolute inset-0 rounded-full bg-gradient-to-br ${topic.color} blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500`}
                    initial={{ scale: 0.8 }}
                    animate={{ scale: hoveredTopic === topic.id ? 1.1 : 0.8 }}
                    transition={{ duration: 0.5 }}
                  />
                </div>

                {/* Title Below Circle */}
                <motion.div 
                  className="text-center mt-4"
                  animate={{ y: hoveredTopic === topic.id ? -5 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h4 className="font-semibold text-lg group-hover:gradient-text transition-all duration-300">
                    {topic.title}
                  </h4>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="relative z-10 text-center pb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <p className="text-muted-foreground mb-6">
            Need guidance on where to start?
          </p>
          <motion.button
            className="inline-flex items-center space-x-2 px-6 py-3 bg-surface/80 backdrop-blur-sm rounded-full border border-primary/20 hover:border-primary/40 transition-colors group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/mentor")}
          >
            <Sparkles className="h-4 w-4 text-primary group-hover:animate-pulse" />
            <span>Ask AI Mentor</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}