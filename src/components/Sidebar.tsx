import React from "react"
import { NavLink, useLocation } from "react-router-dom"
import { motion } from "framer-motion"
import { 
  Home, 
  FileText, 
  Route, 
  MessageSquare, 
  Moon, 
  Sun, 
  Bot,
  Sparkles,
  Target,
  Code,
  Users,
  TrendingUp
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useTheme } from "@/components/ThemeProvider"
import { Button } from "@/components/ui/button"

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Resume Analyzer", href: "/resume", icon: FileText },
  { name: "Career Roadmap", href: "/roadmap", icon: Route },
  { name: "AI Mentor", href: "/mentor", icon: MessageSquare },
  { name: "Job Recommendations", href: "/jobs", icon: Target },
  { name: "Portfolio Ideas", href: "/portfolio", icon: Code },
  { name: "Networking", href: "/networking", icon: Users },
  { name: "Analytics", href: "/analytics", icon: TrendingUp },
]

export function Sidebar() {
  const location = useLocation()
  const { theme, setTheme } = useTheme()

  return (
    <motion.div 
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      className="flex h-screen w-64 flex-col bg-sidebar border-r border-sidebar-border"
    >
      {/* Logo Section */}
      <div className="flex h-20 items-center px-6 border-b border-sidebar-border">
        <motion.div 
          className="flex items-center space-x-3"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <div className="relative">
            <Bot className="h-8 w-8 text-sidebar-primary" />
            <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-accent animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-bold gradient-text">Next Step</h1>
            <p className="text-sm text-sidebar-foreground/70">Career AI</p>
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
                  "flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-primary shadow-glow-sm"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-primary"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.name}</span>
              </NavLink>
            </motion.div>
          )
        })}
      </nav>

      {/* Theme Toggle */}
      <div className="p-4 border-t border-sidebar-border">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="w-full justify-start space-x-2"
        >
          {theme === "light" ? (
            <>
              <Moon className="h-4 w-4" />
              <span>Dark Mode</span>
            </>
          ) : (
            <>
              <Sun className="h-4 w-4" />
              <span>Light Mode</span>
            </>
          )}
        </Button>
      </div>
    </motion.div>
  )
}