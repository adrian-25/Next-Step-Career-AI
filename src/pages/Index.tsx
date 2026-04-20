import { useNavigate } from 'react-router-dom';
import AnimatedGridBackground from '@/components/premium/AnimatedGridBackground';
import HeroSection from '@/components/premium/HeroSection';
import FeatureCardsSection from '@/components/premium/FeatureCardsSection';
import AnalyticsPreviewSection from '@/components/premium/AnalyticsPreviewSection';
import HowItWorksSection from '@/components/premium/HowItWorksSection';
import DBMSSecuritySection from '@/components/premium/DBMSSecuritySection';
import PremiumFooter from '@/components/premium/PremiumFooter';

// Feature flag for premium UI — default ON (premium is the only homepage)
const USE_PREMIUM_UI = import.meta.env.VITE_PREMIUM_UI !== 'false';

// Original homepage component (lazy loaded for code splitting)
const OriginalHomepage = () => {
  // Import and render original homepage if needed
  // For now, redirect to premium version
  return null;
};

const PremiumHomepage = () => {
  const navigate = useNavigate();

  const handleGetStartedClick = () => {
    // DEMO MODE: Go directly to resume analyzer (no auth required)
    navigate('/resume');
  };

  const handleLoginClick = () => {
    // Optional: Users can still create accounts
    navigate('/auth');
  };

  return (
    <div className="relative min-h-screen bg-[#0B0F1A] text-white overflow-x-hidden">
      {/* Animated Grid Background */}
      <AnimatedGridBackground />
      
      {/* Demo Mode Badge */}
      <div className="relative z-20 flex justify-center pt-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#B6FF00]/10 border border-[#B6FF00]/30 rounded-full">
          <span className="w-2 h-2 bg-[#B6FF00] rounded-full animate-pulse"></span>
          <span className="text-[#B6FF00] text-sm font-medium">Demo Mode – No Login Required</span>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <HeroSection
          onAnalyzeClick={handleGetStartedClick}
          onDashboardClick={handleLoginClick}
        />
        
        {/* Feature Cards Section */}
        <FeatureCardsSection features={[
          { id: 'resume-analyzer',  icon: null, title: 'ML Resume Analyzer',   description: 'TF-IDF + Naive Bayes role prediction with fuzzy skill matching',  route: '/resume'       },
          { id: 'job-matching',     icon: null, title: 'Job Matching Engine',   description: 'Compare your resume against any job description — instant score',  route: '/job-matching' },
          { id: 'skill-gap',        icon: null, title: 'Skill Gap Analyzer',    description: 'Current → target role learning plan with timeline & resources',    route: '/skill-gap'    },
          { id: 'dbms-analytics',   icon: null, title: 'ADBMS Analytics',       description: 'Stored procedures, materialized views, GIN indexes & audit logs',  route: '/dbms-analytics' },
        ]} />
        
        {/* Analytics Preview Section */}
        <AnalyticsPreviewSection
          barChartData={[]}
          placementScore={87}
          skillHeatmapData={[]}
          kpiData={[]}
        />
        
        {/* How It Works Section */}
        <HowItWorksSection steps={[
          { number: 1, title: 'Upload Resume',    description: 'Drop a PDF, DOCX, or TXT file — our parser extracts all text instantly',                                icon: null },
          { number: 2, title: 'ML Analysis',      description: 'TF-IDF vectorization + Naive Bayes classifies your role; fuzzy matching scores every skill',           icon: null },
          { number: 3, title: 'Actionable Plan',  description: 'Get your match %, skill gaps, learning resources, and a personalised career roadmap in seconds',       icon: null },
        ]} />
        
        {/* DBMS Security Section */}
        <DBMSSecuritySection features={[]} />
        
        {/* Premium Footer */}
        <PremiumFooter
          logo={null}
          tagline=""
          links={[]}
        />
      </div>
    </div>
  );
};

const Index = () => {
  // Log which version is being rendered
  console.log(`Rendering ${USE_PREMIUM_UI ? 'Premium' : 'Original'} Homepage`);
  
  return USE_PREMIUM_UI ? <PremiumHomepage /> : <OriginalHomepage />;
};

export default Index;
