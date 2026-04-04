import React, { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LoginForm } from '@/components/auth/LoginForm';
import { SignUpForm } from '@/components/auth/SignUpForm';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Brain, Database, FileText, TrendingUp, Zap, Sparkles } from 'lucide-react';

export function AuthPage() {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(true);

  // Get the intended destination from location state, default to dashboard
  const from = location.state?.from?.pathname || '/dashboard';

  // Redirect if already authenticated
  if (isAuthenticated && !loading) {
    return <Navigate to={from} replace />;
  }

  const toggleMode = () => {
    setIsLogin(!isLogin);
  };

  const handleSuccess = () => {
    // Navigation will be handled by the auth context
    console.log('Authentication successful');
    // Force navigation to dashboard after successful signup/login
    window.location.href = '/dashboard';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-surface to-surface-light flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-surface to-surface-light">
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-screen">
          {/* Left Side - Branding */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="p-3 rounded-xl neon-glow bg-primary/10">
                  <Zap className="h-8 w-8 text-primary" />
                </div>
                <Sparkles className="absolute -top-1 -right-1 h-5 w-5 text-accent animate-pulse" />
              </div>
              <div>
                <h1 className="text-3xl font-bold gradient-text">Next Step</h1>
                <p className="text-lg text-muted-foreground">Career AI</p>
              </div>
            </div>

            {/* Hero Content */}
            <div className="space-y-6">
              <h2 className="text-4xl lg:text-5xl font-bold leading-tight">
                <span className="gradient-text">AI-Powered Career</span>
                <br />
                Intelligence Platform
              </h2>
              
              <p className="text-xl text-muted-foreground leading-relaxed">
                Advanced DBMS + ML integration for intelligent resume analysis, 
                placement predictions, and career insights.
              </p>

              {/* Feature badges */}
              <div className="flex flex-wrap gap-3">
                <Badge variant="secondary" className="px-3 py-2">
                  <FileText className="w-4 h-4 mr-2" />
                  Resume Analysis
                </Badge>
                <Badge variant="secondary" className="px-3 py-2">
                  <Brain className="w-4 h-4 mr-2" />
                  ML Predictions
                </Badge>
                <Badge variant="secondary" className="px-3 py-2">
                  <Database className="w-4 h-4 mr-2" />
                  Advanced DBMS
                </Badge>
                <Badge variant="secondary" className="px-3 py-2">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Analytics Dashboard
                </Badge>
              </div>

              {/* Key Features */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">What You'll Get:</h3>
                <div className="grid gap-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-muted-foreground">Intelligent resume parsing and skill extraction</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-muted-foreground">ML-powered placement probability predictions</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-muted-foreground">Real-time analytics and insights dashboard</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-muted-foreground">Personalized career recommendations</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Side - Auth Form */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={isLogin ? 'login' : 'signup'}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {isLogin ? (
                  <LoginForm onToggleMode={toggleMode} onSuccess={handleSuccess} />
                ) : (
                  <SignUpForm onToggleMode={toggleMode} onSuccess={handleSuccess} />
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}