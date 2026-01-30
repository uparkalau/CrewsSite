import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

/**
 * LoginPage - Email/password authentication
 * Handles user login with Firebase Auth
 * Redirects to dashboard on successful login
 */
export function LoginPage() {
  const { login, loading, error: authError } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      if (!email || !password) {
        setError('Email and password required')
        setIsSubmitting(false)
        return
      }

      await login(email, password)
      // Redirect to dashboard on success (handled by AuthContext)
      window.location.href = '/dashboard'
    } catch (err) {
      setError(err.message || 'Login failed')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-site-primary to-site-dark flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-site-primary mb-2">CrewsSite</h1>
          <p className="text-gray-600 mb-8">Construction Site Management</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error Messages */}
            {(error || authError) && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error || authError}
              </div>
            )}

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-site-primary focus:border-transparent"
                disabled={loading || isSubmitting}
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-site-primary focus:border-transparent"
                disabled={loading || isSubmitting}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || isSubmitting}
              className="w-full bg-site-primary hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
            >
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Signup Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <a href="/signup" className="text-site-primary hover:underline font-medium">
                Sign up here
              </a>
            </p>
          </div>

          {/* Demo Credentials (Development Only) */}
          {import.meta.env.DEV && (
            <div className="mt-6 p-3 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
              <p className="font-semibold mb-1">Demo Credentials (Development):</p>
              <p>Email: demo@crewssite.com</p>
              <p>Password: DemoPassword123!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
