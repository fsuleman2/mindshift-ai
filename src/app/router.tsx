import { lazy, Suspense, type JSX, type LazyExoticComponent } from 'react'
import { createHashRouter } from 'react-router-dom'
import { AppShell } from './AppShell'
import { ProtectedRoute } from './ProtectedRoute'
import { PageLoader } from './PageLoader'

const Landing = lazy(() => import('@/pages/Landing'))
const HabitSelect = lazy(() => import('@/pages/HabitSelect'))
const Assessment = lazy(() => import('@/pages/Assessment'))
const Blueprint = lazy(() => import('@/pages/Blueprint'))
const Dashboard = lazy(() => import('@/pages/Dashboard'))
const CheckIn = lazy(() => import('@/pages/CheckIn'))
const Coach = lazy(() => import('@/pages/Coach'))
const Journal = lazy(() => import('@/pages/Journal'))
const Progress = lazy(() => import('@/pages/Progress'))
const Settings = lazy(() => import('@/pages/Settings'))
const NotFound = lazy(() => import('@/pages/NotFound'))

function withSuspense(Component: LazyExoticComponent<() => JSX.Element>) {
  return (
    <Suspense fallback={<PageLoader />}>
      <Component />
    </Suspense>
  )
}

export const router = createHashRouter([
  {
    element: <AppShell />,
    children: [
      { path: '/', element: withSuspense(Landing) },
      { path: '/start', element: withSuspense(HabitSelect) },
      { path: '/assessment', element: withSuspense(Assessment) },
      { path: '/blueprint', element: withSuspense(Blueprint) },
      {
        element: <ProtectedRoute />,
        children: [
          { path: '/dashboard', element: withSuspense(Dashboard) },
          { path: '/check-in', element: withSuspense(CheckIn) },
          { path: '/coach', element: withSuspense(Coach) },
          { path: '/journal', element: withSuspense(Journal) },
          { path: '/progress', element: withSuspense(Progress) },
          { path: '/settings', element: withSuspense(Settings) },
        ],
      },
      { path: '*', element: withSuspense(NotFound) },
    ],
  },
])
