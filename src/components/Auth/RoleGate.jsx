import { useAuth } from '../../context/AuthContext'

/**
 * RoleGate - Conditionally renders content based on user role
 * Usage: <RoleGate roles={['owner', 'foreman']}><PayrollDashboard /></RoleGate>
 */
export function RoleGate({ roles, children, fallback = null }) {
  const { role, loading } = useAuth()

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading...</div>
  }

  if (!roles.includes(role)) {
    return fallback || (
      <div className="flex items-center justify-center p-8 text-red-600">
        <p>You don't have permission to view this content.</p>
      </div>
    )
  }

  return children
}

/**
 * AccessDenied - Default component shown when user lacks permission
 */
export function AccessDenied() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-3xl font-bold text-site-dark">Access Denied</h1>
      <p className="text-gray-600">You don't have permission to access this page.</p>
      <a href="/" className="px-4 py-2 bg-site-primary text-white rounded-lg">
        Go Home
      </a>
    </div>
  )
}
