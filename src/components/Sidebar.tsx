import React, { useState } from "react"
import { NavLink, useLocation, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import {
  FileText, BarChart3, Briefcase, Trophy, Layers, Search,
  Database, TrendingUp, Route, Bot, Users, GitBranch,
  Award, BookMarked, ChevronLeft, ChevronRight,
  Zap, LogOut, User, Settings, GraduationCap, ShieldCheck,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/AuthContext"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// ── Navigation groups ─────────────────────────────────────────

const NAV_GROUPS = [
  {
    label: 'Resume',
    items: [
      { name: 'Resume Analyzer',  href: '/resume',               icon: FileText,    },
      { name: 'Resume Score',     href: '/score',                icon: Award,       },
      { name: 'Resume Insights',  href: '/analytics',            icon: BarChart3,   },
      { name: 'ATS Checker',      href: '/ats',                  icon: ShieldCheck, },
    ],
  },
  {
    label: 'Matching',
    items: [
      { name: 'Job Matching',     href: '/job-matching',         icon: Briefcase,  },
      { name: 'Resume Ranking',   href: '/ranking',              icon: Trophy,     },
      { name: 'Skill Gap',        href: '/skill-gap',            icon: Layers,     },
      { name: 'Search Resumes',   href: '/search',               icon: Search,     },
    ],
  },
  {
    label: 'Analytics',
    items: [
      { name: 'DBMS Analytics',   href: '/dbms-analytics',       icon: Database,   },
      { name: 'Prod Analytics',   href: '/production-analytics', icon: TrendingUp, },
    ],
  },
  {
    label: 'Learning',
    items: [
      { name: 'Courses',          href: '/courses',              icon: GraduationCap, },
      { name: 'Career Roadmap',   href: '/roadmap',              icon: Route,      },
    ],
  },
  {
    label: 'System',
    items: [
      { name: 'Architecture',     href: '/architecture',         icon: GitBranch,  },
      { name: 'Project Summary',  href: '/summary',              icon: BookMarked, },
    ],
  },
]

// ── Component ─────────────────────────────────────────────────

export function Sidebar() {
  const location = useLocation()
  const navigate  = useNavigate()
  const { user, profile, signOut } = useAuth()
  const [collapsed, setCollapsed] = useState(false)

  const handleSignOut = async () => {
    try { await signOut() } catch { /* ignore */ }
  }

  const getUserInitials = () => {
    if (profile?.full_name) return profile.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    if (user?.email) return user.email[0].toUpperCase()
    return 'G'
  }

  const sidebarWidth = collapsed ? 64 : 240

  return (
    <motion.aside
      animate={{ width: sidebarWidth }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      className="relative flex flex-col h-screen shrink-0 overflow-hidden"
      style={{
        background: 'hsl(var(--sidebar-background))',
        borderRight: '1px solid hsl(var(--sidebar-border))',
      }}
    >
      {/* ── Logo ── */}
      <div className="flex items-center h-14 px-4 shrink-0" style={{ borderBottom: '1px solid hsl(var(--sidebar-border))' }}>
        <div
          className="flex items-center gap-2.5 cursor-pointer min-w-0"
          onClick={() => navigate('/dashboard')}
        >
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: 'var(--gradient-primary)' }}>
            <Zap className="h-4 w-4 text-white" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <p className="font-display font-700 text-sm text-white leading-tight whitespace-nowrap">Next Step</p>
                <p className="text-xs whitespace-nowrap" style={{ color: 'hsl(var(--sidebar-foreground) / 0.5)' }}>Career AI</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto p-1 rounded-md transition-colors"
          style={{ color: 'hsl(var(--sidebar-foreground) / 0.4)' }}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed
            ? <ChevronRight className="h-4 w-4" />
            : <ChevronLeft className="h-4 w-4" />
          }
        </button>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 overflow-y-auto py-3 scrollbar-thin px-2">
        {NAV_GROUPS.map((group, gi) => (
          <div key={group.label} className={gi > 0 ? 'mt-1' : ''}>
            {/* Group label */}
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="nav-group-label"
                >
                  {group.label}
                </motion.div>
              )}
            </AnimatePresence>
            {collapsed && gi > 0 && <div className="nav-divider mx-1 my-2" />}

            {/* Items */}
            {group.items.map(item => {
              const isActive = location.pathname === item.href
              return (
                <NavLink key={item.href} to={item.href} aria-label={item.name}>
                  <div
                    className={cn('nav-item', isActive && 'active')}
                    title={collapsed ? item.name : undefined}
                  >
                    <item.icon
                      className="h-4 w-4 shrink-0"
                      aria-hidden="true"
                      style={{ color: isActive ? 'hsl(var(--sidebar-primary))' : 'hsl(var(--sidebar-foreground) / 0.65)' }}
                    />
                    <AnimatePresence>
                      {!collapsed && (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: 'auto' }}
                          exit={{ opacity: 0, width: 0 }}
                          transition={{ duration: 0.18 }}
                          className="overflow-hidden whitespace-nowrap text-sm"
                        >
                          {item.name}
                        </motion.span>
                      )}
                    </AnimatePresence>
                    {isActive && !collapsed && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="ml-auto w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ background: 'hsl(var(--sidebar-primary))' }}
                      />
                    )}
                  </div>
                </NavLink>
              )
            })}
          </div>
        ))}
      </nav>

      {/* ── User Profile ── */}
      <div className="shrink-0 p-2" style={{ borderTop: '1px solid hsl(var(--sidebar-border))' }}>
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="w-full flex items-center gap-2.5 p-2 rounded-lg transition-colors"
                style={{ color: 'hsl(var(--sidebar-foreground))' }}
                aria-label="User menu"
              >
                <Avatar className="h-7 w-7 shrink-0">
                  <AvatarImage src={profile?.avatar_url} />
                  <AvatarFallback className="text-xs font-semibold"
                    style={{ background: 'hsl(var(--primary) / 0.2)', color: 'hsl(var(--sidebar-primary))' }}>
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
                <AnimatePresence>
                  {!collapsed && (
                    <motion.div
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      className="flex-1 text-left overflow-hidden"
                    >
                      <p className="text-xs font-semibold truncate text-white">
                        {profile?.full_name || user?.email?.split('@')[0] || 'User'}
                      </p>
                      <p className="text-xs truncate" style={{ color: 'hsl(var(--sidebar-foreground) / 0.5)' }}>
                        {profile?.job_title || 'Professional'}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" /> Profile Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" /> Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <button
            onClick={() => navigate('/auth')}
            className="w-full flex items-center gap-2.5 p-2 rounded-lg transition-colors"
            style={{ color: 'hsl(var(--sidebar-foreground) / 0.6)' }}
            aria-label="Login"
          >
            <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
              style={{ background: 'hsl(var(--sidebar-accent))' }}>
              <User className="h-3.5 w-3.5" style={{ color: 'hsl(var(--sidebar-foreground) / 0.6)' }} />
            </div>
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="overflow-hidden"
                >
                  <p className="text-xs font-medium whitespace-nowrap" style={{ color: 'hsl(var(--sidebar-foreground) / 0.6)' }}>
                    Login (Optional)
                  </p>
                  <p className="text-xs whitespace-nowrap" style={{ color: 'hsl(var(--sidebar-foreground) / 0.35)' }}>
                    Demo Mode Active
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        )}
      </div>
    </motion.aside>
  )
}
