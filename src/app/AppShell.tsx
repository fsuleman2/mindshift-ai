import { Outlet } from 'react-router-dom'
import { NavBar } from './NavBar'
import { EmergencyMode } from '@/components/features/EmergencyMode'
import { Toaster } from '@/components/ui/sonner'

export function AppShell() {
  return (
    <div className="flex min-h-svh flex-col">
      <NavBar />
      <main className="flex-1">
        <Outlet />
      </main>
      <EmergencyMode />
      <Toaster />
    </div>
  )
}
