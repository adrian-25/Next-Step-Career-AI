import React from "react"
import { Outlet, useLocation, useNavigate } from "react-router-dom"
import { Sidebar } from "@/components/Sidebar"
import { ChevronRight, Home } from "lucide-react"

// ── Breadcrumb map ────────────────────────────────────────────

const ROUTE_LABELS: Record<string, string> = {
  '/dashboard':           'Dashboard',
  '/resume':              'Resume Analyzer',
  '/score':               'Resume Score',
  '/analytics':           'Resume Insights',
  '/job-matching':        'Job Matching',
  '/ranking':             'Resume Ranking',
  '/skill-gap':           'Skill Gap',
  '/search':              'Search Resumes',
  '/dbms-analytics':      'DBMS Analytics',
  '/production-analytics':'Prod Analytics',
  '/roadmap':             'Career Roadmap',
  '/courses':             'Courses',
  '/networking':          'Networking Hub',
  '/mentor':              'AI Career Mentor',
  '/chatbot':             'Career Chatbot',
  '/architecture':        'Architecture',
  '/summary':             'Project Summary',
  '/job-matches':         'Job Matches',
  '/portfolio':           'Portfolio',
}

export function Layout() {
  const location = useLocation()
  const navigate  = useNavigate()
  const label = ROUTE_LABELS[location.pathname] ?? 'Page'

  return (
    <div className="flex h-screen w-full overflow-hidden" style={{ background: 'hsl(var(--background))' }}>
      <Sidebar />

      {/* Main area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">

        {/* ── Top Header Bar ── */}
        <header
          className="flex items-center h-14 px-6 shrink-0 gap-3"
          style={{
            background: 'hsl(var(--card))',
            borderBottom: '1px solid hsl(var(--border))',
            boxShadow: 'var(--shadow-xs)',
          }}
        >
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-1.5 text-sm" aria-label="Breadcrumb">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-1 transition-colors hover:text-primary"
              style={{ color: 'hsl(var(--muted-foreground))' }}
              aria-label="Dashboard"
            >
              <Home className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
            <ChevronRight className="h-3.5 w-3.5" style={{ color: 'hsl(var(--border))' }} aria-hidden="true" />
            <span
              className="font-medium"
              style={{ color: 'hsl(var(--foreground))' }}
              aria-current="page"
            >
              {label}
            </span>
          </nav>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Status badge */}
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
            style={{
              background: 'hsl(var(--success) / 0.1)',
              color: 'hsl(160 84% 28%)',
              border: '1px solid hsl(var(--success) / 0.2)',
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
            Demo Mode
          </div>
        </header>

        {/* ── Page Content ── */}
        <main className="flex-1 overflow-auto" role="main">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
