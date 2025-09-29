import React from "react"
import { NavLink, useLocation } from "react-router-dom"
import { motion } from "framer-motion"
import { 
  Home, 
  FileText, 
  Route, 
  Bot,
  Sparkles,
  Target,
  Users,
  TrendingUp,
  Zap
} from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Resume Analyzer", href: "/resume", icon: FileText },
  { name: "Career Roadmap", href: "/roadmap", icon: Route },
  { name: "Job Recommendations", href: "/jobs", icon: Target },
  { name: "Networking Hub", href: "/networking", icon: Users },
  { name: "Career Analytics", href: "/analytics", icon: TrendingUp },
  { name: "Courses", href: "/courses", icon: Bot },
]

export function Sidebar() {
  const location = useLocation()

  return (
    <motion.div 
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      className="flex h-screen w-64 flex-col glass border-r border-border/20 backdrop-blur-xl"
    >
      {/* Logo Section */}
      <div className="flex h-20 items-center px-6 border-b border-border/20">
        <motion.div 
          className="flex items-center space-x-3"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <div className="relative">
            <div className="p-2 rounded-xl neon-glow bg-primary/10">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-accent animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-bold gradient-text">Next Step</h1>
            <p className="text-sm text-muted-foreground">Career AI</p>
          </div>
        </motion.div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item, index) => {
          const isActive = location.pathname === item.href
          return (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <NavLink
                to={item.href}
                className={cn(
                  "flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group",
                  isActive
                    ? "bg-primary/20 text-primary border border-primary/30 neon-glow"
                    : "text-muted-foreground hover:bg-surface-light hover:text-primary border border-transparent"
                )}
              >
                <item.icon className={cn(
                  "h-5 w-5 transition-all duration-300",
                  isActive ? "text-primary" : "group-hover:text-primary"
                )} />
                <span className="font-medium">{item.name}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="ml-auto w-2 h-2 rounded-full bg-primary animate-pulse"
                  />
                )}
              </NavLink>
            </motion.div>
          )
        })}
      </nav>

      {/* About Section */}
      <div className="p-4 border-t border-border/20">
        <div className="text-xs text-muted-foreground space-y-2">
          <p className="font-semibold text-foreground">About</p>
          <p>
            This platform was built by Adrian, focused on empowering professionals with
            AI-driven career guidance, resume tools, job matching, and analytics.
          </p>
        </div>
      </div>
    </motion.div>
  )
}