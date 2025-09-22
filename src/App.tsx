import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Layout } from "@/components/Layout";
import Index from "@/pages/Index";
import { TopicsPage } from "@/pages/TopicsPage";
import { Dashboard } from "@/pages/Dashboard";
import { ResumeAnalyzer } from "@/pages/ResumeAnalyzer";
import { CareerRoadmap } from "@/pages/CareerRoadmap";
import { CareerMentorPage } from "@/pages/CareerMentorPage";
import { CareerChatbotPage } from "@/pages/CareerChatbotPage";
import { JobRecommendations } from "@/pages/JobRecommendations";
import { PortfolioSuggestions } from "@/pages/PortfolioSuggestions";
import { NetworkingAssistant } from "@/pages/NetworkingAssistant";
import { Analytics } from "@/pages/Analytics";
import { Courses } from "@/pages/Courses";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark" storageKey="career-ai-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Landing Page - No Layout */}
            <Route path="/" element={<Index />} />
            
            {/* Topics Page - No Layout */}
            <Route path="/topics" element={<TopicsPage />} />
            
            {/* App Pages - With Layout */}
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/resume" element={<ResumeAnalyzer />} />
              <Route path="/roadmap" element={<CareerRoadmap />} />
              <Route path="/mentor" element={<CareerMentorPage />} />
              <Route path="/chatbot" element={<CareerChatbotPage />} />
              <Route path="/jobs" element={<JobRecommendations />} />
              <Route path="/portfolio" element={<PortfolioSuggestions />} />
              <Route path="/networking" element={<NetworkingAssistant />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/courses" element={<Courses />} />
            </Route>
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
