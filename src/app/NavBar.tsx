import { NavLink } from 'react-router-dom'
import { BookOpen, LayoutDashboard, MessageCircle, Settings as SettingsIcon, Sparkles, TrendingUp } from 'lucide-react'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { cn } from '@/utils/cn'

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/coach', label: 'Coach', icon: MessageCircle },
  { to: '/journal', label: 'Journal', icon: BookOpen },
  { to: '/progress', label: 'Progress', icon: TrendingUp },
  { to: '/settings', label: 'Settings', icon: SettingsIcon },
] as const

export function NavBar() {
  const profile = useLocalStorage('profile')

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <NavLink
          to={profile ? '/dashboard' : '/'}
          className="flex items-center gap-2 font-heading text-lg font-semibold"
        >
          <Sparkles className="size-5 text-primary" aria-hidden="true" />
          MindShift AI
        </NavLink>
        {profile && (
          <nav aria-label="Main navigation" className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                aria-label={item.label}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors',
                    isActive ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:text-foreground',
                  )
                }
              >
                <item.icon className="size-4" aria-hidden="true" />
                <span className="hidden sm:inline">{item.label}</span>
              </NavLink>
            ))}
          </nav>
        )}
      </div>
    </header>
  )
}
