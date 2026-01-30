import { useAuth } from '../../context/AuthContext'

/**
 * ProtectedRoute - Prevents unauthenticated access
 * Usage: <ProtectedRoute><ManagerDashboard /></ProtectedRoute>
 */
export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-site-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    // Redirect to login
    window.history.pushState(null, '', '/login')
    window.dispatchEvent(new PopStateEvent('popstate'))
    return null
  }

  return children
}
