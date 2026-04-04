import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Layout } from "@/components/Layout";
import Index from "@/pages/Index";
import { TopicsPage } from "@/pages/TopicsPage";
import { Dashboard } from "@/pages/Dashboard";
import { ResumeAnalyzer } from "@/pages/ResumeAnalyzer";
import { ResumeInsightsPage } from "@/pages/ResumeInsightsPage";
import { DBMSAnalyticsPage } from "@/pages/DBMSAnalyticsPage";
import { CareerRoadmap } from "@/pages/CareerRoadmap";
import { CareerMentorPage } from "@/pages/CareerMentorPage";
import { CareerChatbotPage } from "@/pages/CareerChatbotPage";
import { JobRecommendations } from "@/pages/JobRecommendations";
import { JobRecommendationsPage } from "@/pages/JobRecommendationsPage";
import { PortfolioSuggestions } from "@/pages/PortfolioSuggestions";
import { NetworkingAssistant } from "@/pages/NetworkingAssistant";
import { Courses } from "@/pages/Courses";
import { AuthPage } from "@/pages/AuthPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="career-ai-theme">
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Landing Page - No Layout, No Auth Required */}
                <Route path="/" element={<Index />} />
                
                {/* Topics Page - No Layout, No Auth Required */}
                <Route path="/topics" element={<TopicsPage />} />
                
                {/* Authentication Page - Optional (No Layout) */}
                <Route path="/auth" element={<AuthPage />} />
                
                {/* DEMO MODE: All App Pages - With Layout, NO Authentication Required */}
                <Route element={<Layout />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/resume" element={<ResumeAnalyzer />} />
                  <Route path="/analytics" element={<ResumeInsightsPage />} />
                  <Route path="/dbms-analytics" element={<DBMSAnalyticsPage />} />
                  <Route path="/roadmap" element={<CareerRoadmap />} />
                  <Route path="/mentor" element={<CareerMentorPage />} />
                  <Route path="/chatbot" element={<CareerChatbotPage />} />
                  <Route path="/jobs" element={<JobRecommendations />} />
                  <Route path="/job-recommendations" element={<JobRecommendationsPage />} />
                  <Route path="/portfolio" element={<PortfolioSuggestions />} />
                  <Route path="/networking" element={<NetworkingAssistant />} />
                  <Route path="/courses" element={<Courses />} />
                </Route>
                
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
