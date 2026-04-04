import { useNavigate } from 'react-router-dom';
import AnimatedGridBackground from '@/components/premium/AnimatedGridBackground';
import HeroSection from '@/components/premium/HeroSection';
import FeatureCardsSection from '@/components/premium/FeatureCardsSection';
import AnalyticsPreviewSection from '@/components/premium/AnalyticsPreviewSection';
import HowItWorksSection from '@/components/premium/HowItWorksSection';
import DBMSSecuritySection from '@/components/premium/DBMSSecuritySection';
import PremiumFooter from '@/components/premium/PremiumFooter';

// Feature flag for premium UI (can be toggled via environment variable)
const USE_PREMIUM_UI = import.meta.env.VITE_PREMIUM_UI === 'true';

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
        <FeatureCardsSection features={[]} />
        
        {/* Analytics Preview Section */}
        <AnalyticsPreviewSection
          barChartData={[]}
          placementScore={87}
          skillHeatmapData={[]}
          kpiData={[]}
        />
        
        {/* How It Works Section */}
        <HowItWorksSection steps={[]} />
        
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
