# Next Step Career AI — Resume Intelligence Platform

A production-grade AI-powered resume analysis and career guidance platform built with React, FastAPI, PostgreSQL, and scikit-learn.

## 🚀 Live Demo

- **Frontend:** https://next-step-career-ai.vercel.app
- **Backend API:** https://next-step-career-ai.railway.app
- **API Docs:** https://next-step-career-ai.railway.app/docs

---

## 🏗️ Architecture

```
Frontend (React + Vite + Tailwind)
    ↓ HTTP/REST
Backend (FastAPI Python)
    ↓ ML Pipeline
ML Layer (scikit-learn TF-IDF + Naive Bayes + Fuzzy Logic)
    ↓ SQL + JSONB
Database (PostgreSQL / Supabase)
```

---

## ✨ Features

### ML & AI
- **TF-IDF + Naive Bayes** role prediction (browser-based, no server needed)
- **Fuzzy Logic** skill matching (Levenshtein + Jaccard similarity)
- **Weighted scoring**: `final_score = 0.7 × ML + 0.3 × Fuzzy`
- **200+ skill aliases** (React.js → react, sklearn → scikit-learn, etc.)
- **10 job roles** with weighted skill datasets

### ADBMS Features
- **Table Partitioning** — `job_matches` partitioned by month (RANGE)
- **Full-Text Search** — PostgreSQL `tsvector` + GIN index + `search_resumes()` function
- **Stored Procedures** — `calculate_match()`, `get_skill_gap()`, `export_user_data()`
- **Materialized Views** — `top_job_matches_view`, `skill_demand_analysis`
- **Audit Triggers** — auto-log all inserts to `audit_logs`
- **Row Level Security** — users see only their own data
- **Resume Versioning** — auto-version on update
- **Query Optimization** — 15+ composite indexes on JSONB + timestamp columns

### Pages
| Page | Route | Description |
|------|-------|-------------|
| Dashboard | `/dashboard` | Live metrics + recent activity |
| Resume Analyzer | `/resume` | Upload + ML analysis |
| Job Matching | `/job-matching` | Resume vs JD comparison |
| Resume Ranking | `/ranking` | Multi-resume ranking table |
| Search | `/search` | Full-text PostgreSQL search |
| Resume Insights | `/analytics` | Radar chart + timeline |
| DBMS Analytics | `/dbms-analytics` | Live DB stored proc data |
| Career Roadmap | `/roadmap` | Role-based learning path |
| Architecture | `/architecture` | System diagram + ADBMS checklist |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, TypeScript, Tailwind CSS, Framer Motion |
| Charts | Recharts |
| Backend | FastAPI (Python 3.11) |
| ML | scikit-learn, TF-IDF, Naive Bayes |
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
...
013_ml_adbms_upgrade.sql
014_demo_data_policy.sql
015_soft_computing_scores.sql
016_production_adbms.sql
```

Then disable RLS for demo mode:
```sql
ALTER TABLE job_matches DISABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs DISABLE ROW LEVEL SECURITY;
```

---

## 🐳 Docker

```bash
# Backend only
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

---

## 🤖 ML Pipeline

```
Resume Text (PDF/DOCX/TXT)
    ↓ pdfjs-dist / mammoth
Extracted Text
    ↓ Alias Map (200+ mappings)
Extracted Skills []
    ↓ TF-IDF Vectorizer
Feature Vector
    ↓ Multinomial Naive Bayes
Predicted Role + Confidence
    ↓ Fuzzy Matcher (Levenshtein + Jaccard)
Matched / Partial / Missing Skills
    ↓ Weighted Scoring
final_score = 0.7 × ML_score + 0.3 × Fuzzy_score
```

---

## 📁 Project Structure

```
├── src/
│   ├── ai/ml/          # TF-IDF, Naive Bayes, Fuzzy Matcher, Skill Analyzer
│   ├── data/           # job_roles_dataset.json, learningResources.ts
│   ├── pages/          # All page components
│   ├── services/       # API services (Supabase + FastAPI backend)
│   └── components/     # Reusable UI components
├── backend/
│   ├── main.py         # FastAPI app
│   ├── ml/             # Python ML analyzer + parsers
│   ├── routers/        # API route handlers
│   └── Dockerfile
├── supabase/
│   └── migrations/     # 016 SQL migration files
└── .github/
    └── workflows/      # CI/CD deploy pipeline
```

---

## 👨‍💻 Author

Built by Adrian — Next Step Career AI
