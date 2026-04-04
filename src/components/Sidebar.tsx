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
  Zap,
  BarChart3,
  Database,
  LogOut,
  User,
  Briefcase
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"

const navigation = [
  { name: "Resume Analyzer",   href: "/resume",           icon: FileText  },
  { name: "Resume Insights",   href: "/analytics",        icon: BarChart3 },
  { name: "DBMS Analytics",    href: "/dbms-analytics",   icon: Database  },
  { name: "Career Roadmap",    href: "/roadmap",          icon: Route     },
  { name: "Job Matches",       href: "/job-recommendations", icon: Briefcase },
  { name: "Job Recommendations", href: "/jobs",           icon: Target    },
  { name: "Networking Hub",    href: "/networking",       icon: Users     },
  { name: "Courses",           href: "/courses",          icon: Bot       },
]

export function Sidebar() {
  const location = useLocation()
  const { user, profile, signOut } = useAuth()

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  const getUserInitials = () => {
    if (profile?.full_name) {
      return profile.full_name
        .split(' ')
        .map(name => name[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    }
    if (user?.email) {
      return user.email[0].toUpperCase()
    }
    return 'G' // Guest
  }

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
              <NavLink to={item.href}>
                {({ isActive: linkActive }) => (
                  <motion.div
                    className={cn(
                      "relative flex items-center space-x-3 px-4 py-3 rounded-xl border cursor-pointer overflow-hidden",
                      linkActive || isActive
                        ? "bg-primary/20 text-primary border-primary/30 neon-glow"
                        : "text-muted-foreground border-transparent"
                    )}
                    whileHover={{ x: 5, scale: 1.02 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                  >
                    {/* Animated background highlight on hover */}
                    <motion.div
                      className="absolute inset-0 rounded-xl bg-primary/10"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: linkActive || isActive ? 0 : 1 }}
                      transition={{ duration: 0.2 }}
                      style={{ position: 'absolute', pointerEvents: 'none' }}
                    />

                    {/* Icon — scales up on hover */}
                    <motion.div
                      whileHover={{ scale: 1.2 }}
                      transition={{ duration: 0.2, ease: 'easeOut' }}
                      className="relative z-10 shrink-0"
                    >
                      <item.icon className={cn(
                        "h-5 w-5",
                        linkActive || isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary"
                      )} />
                    </motion.div>

                    {/* Text — slides right on hover */}
                    <motion.span
                      className="font-medium relative z-10"
                      whileHover={{ x: 3 }}
                      transition={{ duration: 0.2, ease: 'easeOut' }}
                    >
                      {item.name}
                    </motion.span>

                    {(linkActive || isActive) && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="ml-auto w-3 h-3 rounded-full bg-primary animate-pulse relative z-10"
                      />
                    )}
                  </motion.div>
                )}
              </NavLink>
            </motion.div>
          )
        })}
      </nav>

      {/* About Section */}
      <div className="p-4 border-t border-border/20">
        {/* User Profile Section */}
        {user ? (
          <div className="mb-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-start p-2 h-auto">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={profile?.avatar_url} />
                      <AvatarFallback className="bg-primary/10 text-primary text-sm">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium truncate">
                        {profile?.full_name || user?.email?.split('@')[0] || 'User'}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {profile?.job_title || 'Professional'}
                      </p>
                    </div>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <div className="mb-4">
            <NavLink to="/auth">
              <Button variant="outline" className="w-full">
                <User className="mr-2 h-4 w-4" />
                Login (Optional)
              </Button>
            </NavLink>
            <p className="text-xs text-muted-foreground text-center mt-2">
              Demo Mode Active
            </p>
          </div>
        )}

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