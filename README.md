# Momentum Mind AI

## 🚀 Next-Step Career AI Platform

An intelligent career guidance platform that empowers professionals with AI-driven resume analysis, job matching, career roadmaps, and networking assistance.

**Live URL**: [https://momentum-mind-ai.vercel.app/](https://momentum-mind-ai.vercel.app/)

## ✨ Features

### 🎯 Enhanced Resume Analyzer
- **Dynamic Role Support**: Works with 17+ career roles including Software Engineer, Data Scientist, AI/ML Engineer, Cloud Engineer, Game Developer, Web Developer, Mobile App Developer, Database Administrator, DevOps Engineer, UI/UX Designer, Product Manager, IT Project Manager, Systems Architect, Blockchain Developer, Research Scientist, QA Engineer, Network Engineer, Business Analyst
- **Comprehensive Skill Analysis**: 
  - ✅ **Matched Skills**: Identifies skills already present in your resume
  - ❌ **Missing Skills**: Highlights skills needed for your target role
  - 📊 **Match Score**: Calculates percentage match with target role requirements
  - 🔴 **Critical Missing Skills**: Essential skills marked as high priority
  - 🟡 **Important Missing Skills**: Valuable skills for career advancement
- **Intelligent Skill Matching**: Uses fuzzy matching and related skills for accurate detection
- **Role-Specific Recommendations**: Tailored suggestions based on your selected career path
- **Real-time Analysis**: Instant feedback with detailed skill gap analysis

### 🛣️ Additional Features
- **Career Roadmap**: Personalized career progression pathways
- **Job Recommendations**: Intelligent job matching based on skills and experience
- **Networking Hub**: Professional networking assistance and connections
- **Career Mentorship**: AI-powered career guidance and advice
- **Courses**: Personalized learning recommendations

## 🛠️ Tech Stack

This project is built with:

- **Vite** - Next-generation frontend tooling
- **TypeScript** - Type-safe JavaScript
- **React** - UI library
- **shadcn-ui** - Modern UI components
- **Tailwind CSS** - Utility-first CSS framework
- **Supabase** - Backend and database
- **Framer Motion** - Smooth animations
- **React Router** - Client-side routing
- **TensorFlow.js** - Machine learning capabilities

## 📦 Installation

Follow these steps to get started:

```sh
# Step 1: Clone the repository
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory
cd momentum-mind-ai

# Step 3: Install dependencies
npm install

# Step 4: Start the development server
npm run dev
```

## 🚀 Development

```sh
# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🆕 Recent Updates

### Enhanced Resume Analyzer (Latest Release)
The Resume Analyzer has been completely upgraded with dynamic role support and comprehensive skill analysis:

1. **Select Your Target Role**: Choose from 17+ career roles in the dropdown
2. **Upload Your Resume**: Paste your resume content or upload a file
3. **Get Instant Analysis**: Receive detailed skill matching and gap analysis
4. **View Results**: See matched skills, missing skills, and match percentage
5. **Take Action**: Get specific recommendations for skill development

### Example Results:
- **Web Developer**: 106% match with HTML, CSS, JavaScript skills
- **AI/ML Engineer**: 48% match with Python, TensorFlow, PyTorch skills  
- **Data Scientist**: 17% match with limited relevant skills

The system automatically adapts to any selected role and provides role-specific insights and recommendations.

## 📝 Project Structure

```
src/
├── components/        # Reusable UI components
│   ├── EnhancedResumeAnalyzer.tsx  # Main resume analysis component
│   ├── SkillAnalyzerCard.tsx       # Skill analysis display
│   └── SkillsComparisonChart.tsx   # Skills visualization
├── pages/            # Route pages
├── lib/              # Utility functions and services
│   ├── enhancedResumeAnalysisService.ts  # Enhanced analysis logic
│   ├── roleDataService.ts               # Role definitions and skill matching
│   └── resumeAnalysisService.ts         # Original analysis service
├── hooks/            # Custom React hooks
├── integrations/     # External service integrations
└── main.tsx          # Application entry point
```

## 🔧 Technical Implementation

### Enhanced Resume Analyzer Architecture
- **Role Data Service**: Comprehensive skill definitions for 17+ career roles
- **Skill Matching Engine**: Fuzzy matching with related skills for accurate detection
- **Analysis Pipeline**: Extract → Match → Categorize → Recommend
- **Dynamic UI**: Real-time updates based on selected role
- **Priority System**: Critical vs Important vs Nice-to-have skill categorization

## 🌐 Deployment

The project is deployed on **Vercel** for automatic deployments from GitHub.

## 👤 Built By

Developed by **Adrian** - Focused on empowering professionals with AI-driven career guidance, resume tools, job matching, and analytics.

## 📄 License

All rights reserved.
