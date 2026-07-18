import { Navigate, Outlet } from 'react-router-dom'
import { useLocalStorage } from '@/hooks/useLocalStorage'

/** Guards routes that require a completed onboarding profile, redirecting to /start otherwise. */
export function ProtectedRoute() {
  const profile = useLocalStorage('profile')

  if (!profile) {
    return <Navigate to="/start" replace />
  }

  return <Outlet />
}
