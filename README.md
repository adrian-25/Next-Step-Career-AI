# Next Step Career AI — Resume Intelligence Platform

A production-grade AI-powered resume analysis and career guidance platform built with React 18, FastAPI, PostgreSQL (Supabase), and scikit-learn.

## 🚀 Live Demo

- **Frontend:** https://next-step-career-ai.vercel.app
- **Backend API:** https://next-step-career-ai.railway.app
- **API Docs:** https://next-step-career-ai.railway.app/docs

---

## 🏗️ Architecture

```
Frontend (React 18 + Vite + TypeScript + Tailwind CSS)
    ↓ HTTP/REST
Backend (FastAPI Python 3.11)
    ↓ ML Pipeline
ML Layer (TF-IDF + Naive Bayes + Fuzzy Logic — runs in browser too)
    ↓ SQL + JSONB
Database (PostgreSQL 15 / Supabase)
```

---

## ✨ Features

### ML & AI
- **TF-IDF + Naive Bayes** role prediction (browser-based, no server needed)
- **Fuzzy Logic** skill matching (Levenshtein + Jaccard similarity)
- **Weighted scoring**: `final_score = 0.7 × ML + 0.3 × Fuzzy`
- **200+ skill aliases** (React.js → react, sklearn → scikit-learn, etc.)
- **10 job roles** with weighted skill datasets
- **Job compatibility** — scores resume against all 10 roles simultaneously

### ADBMS Features (Migrations 001–017)
- **Table Partitioning** — `job_matches_partitioned` RANGE by month
- **Full-Text Search** — PostgreSQL `tsvector` + GIN index + `search_resumes()` function
- **Stored Procedures** — `calculate_match()`, `get_skill_gap()`, `export_user_data()`
- **Materialized Views** — `top_job_matches_view`, `skill_demand_analysis`
- **Audit Triggers** — auto-log all inserts to `audit_logs`
- **Row Level Security** — users see only their own data
- **Resume Versioning** — auto-version on update via trigger
- **Query Optimization** — 15+ composite indexes on JSONB + timestamp columns
- **Analytics Views** — `daily_upload_stats`, `role_distribution`, `top_skills_view`
- **Skill Gap Sessions** — `skill_gap_sessions` table + `top_skill_gaps` view

### Pages

| Page | Route | Description |
|------|-------|-------------|
| Landing | `/` | Premium dark landing page with feature cards |
| Dashboard | `/dashboard` | Live metrics, recent activity, quick actions |
| Resume Analyzer | `/resume` | Upload PDF/DOCX/TXT + ML analysis |
| Resume Score | `/score` | Detailed score breakdown (Skills/Projects/Experience/Education) |
| Resume Insights | `/analytics` | Radar chart, timeline, job compatibility |
| Job Matching | `/job-matching` | Resume vs job description comparison |
| Resume Ranking | `/ranking` | Multi-resume ranking table with medals |
| Skill Gap | `/skill-gap` | Current → target role gap analysis + learning timeline |
| Search | `/search` | Full-text PostgreSQL search across resumes |
| DBMS Analytics | `/dbms-analytics` | Live stored proc data, audit logs, JSONB queries |
| Prod Analytics | `/production-analytics` | FastAPI backend charts (upload trend, role dist, top skills) |
| Career Roadmap | `/roadmap` | Role-based step-by-step learning path |
| Courses | `/courses` | Personalized course recommender (gap-aware) |
| AI Career Mentor | `/mentor` | Skill analysis + recommendations |
| Career Chatbot | `/chatbot` | AI career Q&A |
| Networking Hub | `/networking` | LinkedIn bio + connection message generator |
| Portfolio | `/portfolio` | Project idea generator |
| Architecture | `/architecture` | SVG system diagram + ADBMS checklist |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite 7, TypeScript, Tailwind CSS, Framer Motion |
| UI Components | shadcn/ui (Radix UI primitives) |
| Charts | Recharts 2 |
| Backend | FastAPI (Python 3.11) |
| ML (Python) | scikit-learn, TF-IDF, Naive Bayes |
| ML (Browser) | Custom TF-IDF + Naive Bayes in TypeScript |
| PDF Parsing | pdfjs-dist (browser), pdfminer (backend) |
| DOCX Parsing | mammoth (browser), python-docx (backend) |
| Database | PostgreSQL 15 (Supabase) |
| Auth | Supabase Auth + JWT |
| Deploy | Vercel (frontend) + Railway (backend) |
| CI/CD | GitHub Actions |

---

## 🚀 Quick Start

### Frontend
```bash
npm install
npm run dev
# Opens at http://localhost:8080
```

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
# API at http://localhost:8000
# Docs at http://localhost:8000/docs
```

### Environment Variables

Create `.env` in root:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_API_URL=http://localhost:8000/api
```

Create `backend/.env`:
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/resume_intelligence
JWT_SECRET=your-secret-key
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_service_key
```

---

## 🗄️ Database Setup

Run migrations in order in Supabase SQL Editor:

```
001_create_skills_tables.sql
002_create_training_logs_table.sql
003_create_user_profiles_table.sql
004_create_skill_database_table.sql
005_create_resume_scores_table.sql
006_create_section_analyses_table.sql
007_create_trending_skills_table.sql
008_create_job_recommendations_table.sql
009_create_skill_matches_table.sql
010_seed_skill_database.sql
011_add_neuro_fuzzy_columns.sql
012_advanced_dbms_features.sql
013_ml_adbms_upgrade.sql
014_demo_data_policy.sql
015_soft_computing_scores.sql
016_production_adbms.sql
017_skill_gap_sessions.sql
```

Then disable RLS for demo mode:
```sql
ALTER TABLE job_matches DISABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs DISABLE ROW LEVEL SECURITY;
```

---

## 🐳 Docker

```bash
cd backend
docker build -t resume-api .
docker run -p 8000:8000 --env-file .env resume-api
```

---

## 📊 ADBMS Concepts (Viva Ready)

| Concept | Implementation |
|---------|---------------|
| Table Partitioning | `job_matches_partitioned` RANGE by `created_at` monthly |
| Full-Text Search | `tsvector` column + GIN index + `plainto_tsquery()` |
| Stored Procedures | `calculate_match()`, `get_skill_gap()`, `export_user_data()` |
| Materialized Views | `top_job_matches_view`, `skill_demand_analysis` |
| Triggers | `trg_resume_insert_audit`, `trg_job_match_insert_audit`, `trg_resume_versioning` |
| JSONB + GIN | `matched_skills`, `missing_skills` stored as JSONB with GIN indexes |
| RLS | Per-user data isolation on all tables |
| Query Optimization | 15+ indexes, EXPLAIN ANALYZE documented |
| Backup | `export_user_data(user_id)` returns full JSONB dump |
| Analytics Views | `daily_upload_stats`, `role_distribution`, `top_skills_view` |
| Skill Gap Sessions | `skill_gap_sessions` table + `top_skill_gaps` + `role_transitions` views |

---

## 🤖 ML Pipeline

```
Resume Text (PDF/DOCX/TXT)
    ↓ pdfjs-dist / mammoth (browser) or pdfminer / python-docx (backend)
Extracted Text
    ↓ Alias Map (200+ mappings: React.js→react, sklearn→scikit-learn, etc.)
Extracted Skills []
    ↓ TF-IDF Vectorizer (unigram + bigram, max 5000 features)
Feature Vector
    ↓ Multinomial Naive Bayes (alpha=0.1)
Predicted Role + Confidence + Probabilities
    ↓ Fuzzy Matcher (Levenshtein + Jaccard, threshold 0.85/0.50)
Matched / Partial / Missing Skills
    ↓ Weighted Scoring
final_score = 0.7 × ML_score + 0.3 × Fuzzy_score
    ↓ Job Compatibility (all 10 roles scored simultaneously)
Ranked Role List
```

---

## 📁 Project Structure

```
├── src/
│   ├── ai/
│   │   ├── ml/         # TF-IDF, Naive Bayes, Fuzzy Matcher, Skill Analyzer, Role Predictor
│   │   ├── fuzzy/      # Fuzzy decision engine
│   │   ├── neuro/      # Neural resume evaluator
│   │   ├── ranking/    # Resume ranking engine
│   │   ├── scorer/     # Resume scorer (Skills/Projects/Experience/Education)
│   │   ├── parser/     # Resume parser, skill extractor, role detector
│   │   └── matcher/    # Skill matcher, job recommender
│   ├── data/
│   │   ├── job_roles_dataset.json   # 10 roles with weighted skills
│   │   ├── learningResources.ts     # 40+ skills with free + paid courses
│   │   └── skills/                  # Per-role skill definitions
│   ├── pages/          # 17 page components
│   ├── services/       # Supabase + FastAPI API services
│   ├── components/     # Reusable UI components
│   └── hooks/          # Custom React hooks
├── backend/
│   ├── main.py         # FastAPI app (CORS, GZip, lifespan)
│   ├── ml/             # Python ML analyzer + parsers
│   ├── routers/        # resume, match, search, analytics, backup, auth
│   ├── core/           # config, database
│   └── Dockerfile
├── supabase/
│   └── migrations/     # 17 SQL migration files (001–017)
└── .github/
    └── workflows/      # CI/CD: Vercel (frontend) + Railway (backend)
```

---

## 👨‍💻 Author

Built by Adrian — Next Step Career AI
