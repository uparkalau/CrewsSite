import { useState } from 'react'

/**
 * Simple client-side router
 * Use this for basic routing. For advanced routing, install react-router-dom
 */

export function Router({ routes, defaultRoute = '/' }) {
  const [currentPath, setCurrentPath] = useState(getCurrentPath())

  // Handle browser back/forward buttons
  window.onpopstate = () => {
    setCurrentPath(getCurrentPath())
  }

  // Navigate to a new path
  const navigate = (path) => {
    window.history.pushState(null, '', path)
    setCurrentPath(path)
  }

  // Find matching route
  const route = routes.find(r => {
    // Exact match
    if (r.path === currentPath) return true
    // Wildcard match
    if (r.path === '*') return true
    return false
  })

  const Component = route?.component || routes.find(r => r.path === defaultRoute)?.component

  return {
    currentPath,
    navigate,
    Component,
  }
}

function getCurrentPath() {
  return window.location.pathname
}

/**
 * Link component for navigation
 */
export function Link({ to, children, className = '' }) {
  const handleClick = (e) => {
    e.preventDefault()
    window.history.pushState(null, '', to)
    window.dispatchEvent(new PopStateEvent('popstate'))
  }

  return (
    <a href={to} onClick={handleClick} className={className}>
      {children}
    </a>
  )
}
