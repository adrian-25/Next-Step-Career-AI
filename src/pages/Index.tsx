import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, Zap, Sparkles, Play, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative overflow-hidden">
      {/* Fullscreen Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-surface to-surface-light">
          <div 
            className="absolute inset-0 opacity-50"
            style={{
              backgroundImage: `radial-gradient(circle at 20% 50%, hsl(var(--primary)) 0%, transparent 50%), 
                               radial-gradient(circle at 80% 20%, hsl(var(--accent)) 0%, transparent 50%),
                               radial-gradient(circle at 40% 80%, hsl(var(--primary)) 0%, transparent 50%)`,
              filter: 'blur(40px)',
              transform: `translateY(${scrollY * 0.3}px)`
            }}
          />
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-primary/30 rounded-full"
              initial={{ 
                x: Math.random() * window.innerWidth, 
                y: Math.random() * window.innerHeight,
                scale: Math.random() * 0.5 + 0.5
              }}
              animate={{
                y: [null, -100],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
            />
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-6 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="mb-8"
          >
            <div className="inline-flex items-center space-x-2 bg-surface/80 backdrop-blur-sm px-6 py-3 rounded-full border border-primary/20 mb-8">
              <Sparkles className="h-4 w-4 text-primary animate-pulse" />
              <span className="text-sm font-medium">Powered by Advanced AI</span>
            </div>
          </motion.div>

          <motion.h1 
            className="text-7xl md:text-8xl lg:text-9xl font-black mb-8 leading-none"
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, delay: 0.2, ease: "easeOut" }}
          >
            <span className="gradient-text">NEXT</span>
            <br />
            <span className="neon-text neon-pulse">STEP</span>
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto font-light"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            The future of career acceleration. AI-powered insights that transform 
            ambition into achievement.
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            <Button 
              size="lg" 
              className="text-xl px-12 py-6 neon-glow group"
              onClick={() => navigate("/topics")}
            >
              <Zap className="mr-3 h-6 w-6 group-hover:animate-pulse" />
              Enter Platform
              <ArrowRight className="ml-3 h-6 w-6 transition-transform group-hover:translate-x-1" />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="text-xl px-12 py-6 glass border-primary/30 hover:border-primary/50"
            >
              <Play className="mr-3 h-6 w-6" />
              Watch Demo
            </Button>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 0.8 }}
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex flex-col items-center cursor-pointer"
              onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
            >
              <span className="text-sm text-muted-foreground mb-2">Scroll to explore</span>
              <ChevronDown className="h-6 w-6 text-primary animate-bounce" />
            </motion.div>
          </motion.div>
        </div>

        {/* Cinematic Glow Effects */}
        <div className="absolute top-20 right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </section>

      {/* Preview Section */}
      <section className="min-h-screen flex items-center justify-center bg-surface/50 backdrop-blur-sm">
        <motion.div 
          className="text-center px-6"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-8">
            <span className="gradient-text">Revolutionary</span><br />
            Career Intelligence
          </h2>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Experience the next generation of career guidance with immersive AI interactions,
            real-time insights, and personalized growth pathways.
          </p>
          <Button 
            size="lg"
            className="text-lg px-8 py-4 gradient-bg"
            onClick={() => navigate("/topics")}
          >
            Explore Features
          </Button>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {[
              { label: "Career Accelerations", value: "50K+", desc: "Lives transformed" },
              { label: "AI Insights", value: "1M+", desc: "Generated daily" },
              { label: "Success Rate", value: "94%", desc: "Goal achievement" },
              { label: "Global Reach", value: "150+", desc: "Countries served" }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-5xl font-black gradient-text mb-2">{stat.value}</div>
                <div className="text-foreground font-semibold mb-1">{stat.label}</div>
                <div className="text-muted-foreground text-sm">{stat.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;