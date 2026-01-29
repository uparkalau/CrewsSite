import { useState, useEffect } from 'react'
import './App.css'
import { AuthProvider } from './context/AuthContext'

// Landing page components
import Navigation from './components/Navigation'
import Hero from './components/Hero'
import Features from './components/Features'
import Payroll from './components/Payroll'
import Apps from './components/Apps'
import Footer from './components/Footer'

// App pages
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'

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

  // Route to correct component
  let Component

  if (currentPath === '/' || currentPath === '') {
    Component = LandingPage
  } else if (currentPath === '/login') {
    Component = Login
  } else if (currentPath === '/signup') {
    Component = Signup
  } else if (currentPath === '/dashboard') {
    Component = Dashboard
  } else {
    Component = LandingPage // Default to landing page
  }

  return (
    <AuthProvider>
      <Component navigate={navigate} />
    </AuthProvider>
  )
}

export default App
