import React from "react"
import { Outlet, useLocation, useNavigate } from "react-router-dom"
import { Sidebar } from "@/components/Sidebar"
import { ChevronRight, Home, User, Building2 } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"

// ── Breadcrumb map ────────────────────────────────────────────

const ROUTE_LABELS: Record<string, string> = {
  '/dashboard':             'Dashboard',
  '/resume':                'Resume Analyzer',
  '/score':                 'Resume Score',
  '/analytics':             'Resume Insights',
  '/ats':                   'ATS Checker',
  '/builder':               'Resume Builder',
  '/improver':              'Auto Improver',
  '/job-matching':          'Job Matching',
  '/ranking':               'Resume Ranking',
  '/skill-gap':             'Skill Gap',
  '/search':                'Search Resumes',
  '/employer':              'Employer Dashboard',
  '/dbms-analytics':        'DBMS Analytics',
  '/production-analytics':  'Prod Analytics',
  '/roadmap':               'Career Roadmap',
  '/courses':               'Courses',
  '/architecture':          'Architecture',
  '/summary':               'Project Summary',
  '/job-matches':           'Job Matches',
  '/portfolio':             'Portfolio',
  '/networking':            'Networking Hub',
  '/mentor':                'AI Mentor',
  '/chatbot':               'Career Chatbot',
}

// ── Employer-only routes ──────────────────────────────────────

const EMPLOYER_ROUTES = new Set([
  '/employer', '/dbms-analytics', '/production-analytics',
]);

// ── User-only routes (hidden from employers) ──────────────────

const USER_ROUTES = new Set([
  '/resume', '/score', '/analytics', '/ats', '/builder', '/improver',
  '/job-matching', '/ranking', '/skill-gap', '/search',
]);

export function Layout() {
  const location = useLocation()
  const navigate  = useNavigate()
  const { userRole, isEmployer, user } = useAuth()
  const label = ROUTE_LABELS[location.pathname] ?? 'Page'

  // Determine home route based on role
  const homeRoute = isEmployer ? '/employer' : '/dashboard'

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
              onClick={() => navigate(homeRoute)}
              className="flex items-center gap-1 transition-colors hover:text-primary"
              style={{ color: 'hsl(var(--muted-foreground))' }}
              aria-label="Home"
            >
              <Home className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
            <ChevronRight className="h-3.5 w-3.5" style={{ color: 'hsl(var(--border))' }} aria-hidden="true" />
            <span
              className="font-medium text-sm"
              style={{ color: 'hsl(var(--foreground))' }}
              aria-current="page"
            >
              {label}
            </span>
          </nav>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Role badge */}
          {userRole === 'employer' ? (
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
              style={{
                background: 'hsl(var(--success) / 0.1)',
                color: 'hsl(160 84% 28%)',
                border: '1px solid hsl(var(--success) / 0.2)',
              }}
            >
              <Building2 className="h-3 w-3" aria-hidden="true" />
              Employer
            </div>
          ) : userRole === 'user' && user ? (
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
              style={{
                background: 'hsl(var(--primary) / 0.08)',
                color: 'hsl(var(--primary))',
                border: '1px solid hsl(var(--primary) / 0.2)',
              }}
            >
              <User className="h-3 w-3" aria-hidden="true" />
              {user.email?.split('@')[0] ?? 'User'}
            </div>
          ) : (
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
          )}
        </header>

        {/* ── Page Content ── */}
        <main className="flex-1 overflow-auto" role="main">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
