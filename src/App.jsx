import { useState, useEffect } from 'react'
import './App.css'
import { AuthProvider } from './context/AuthContext'
import { CompanyProvider } from './context/CompanyContext'

// Landing page components
import Navigation from './components/Navigation'
import Hero from './components/Hero'
import Features from './components/Features'
import Payroll from './components/Payroll'
import Apps from './components/Apps'
import Footer from './components/Footer'

// Auth pages (Phase 1)
import { LoginPage } from './pages/LoginPage'
import { SignupPage } from './pages/SignupPage'

// Dashboard pages (Phase 1-3)
import { WorkerDashboard } from './pages/WorkerDashboard'
import { ProtectedManagerDashboard } from './pages/ManagerDashboard'

// Auth components (Phase 1)
import { ProtectedRoute } from './components/Auth/ProtectedRoute'
import { useAuth } from './context/AuthContext'

/**
 * LandingPage - Public landing page
 */
function LandingPage() {
  return (
    <>
      <Navigation />
      <Hero />
      <Features />
      <Payroll />
      <Apps />
      <Footer />
    </>
  )
}

/**
 * DashboardRouter - Route to correct dashboard based on role
 */
function DashboardRouter() {
  const { role } = useAuth()

  if (role === 'owner' || role === 'foreman') {
    return <ProtectedManagerDashboard />
  }

  return <WorkerDashboard />
}

/**
 * DashboardPage - Wrapper component for protected dashboard routes
 */
function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardRouter />
    </ProtectedRoute>
  )
}

/**
 * App - Main router and provider setup
 * Supports: /, /login, /signup, /dashboard, /manager
 */
function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname)

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname)
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const navigate = (path) => {
    window.history.pushState(null, '', path)
    setCurrentPath(path)
  }

  // Determine which component to render
  let Component

  switch (currentPath) {
    case '/':
    case '':
      Component = LandingPage
      break
    case '/login':
      Component = LoginPage
      break
    case '/signup':
      Component = SignupPage
      break
    case '/dashboard':
    case '/manager':
    case '/worker':
      Component = DashboardPage
      break
    default:
      Component = LandingPage
  }

  return (
    <AuthProvider>
      <CompanyProvider>
        <Component navigate={navigate} />
      </CompanyProvider>
    </AuthProvider>
  )
}

export default App
