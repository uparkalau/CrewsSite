import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

/**
 * SignupPage - Company & user registration
 * Creates new company + user in Firestore
 * Handles company name, email, password setup
 */
export function SignupPage() {
  const { signup, loading, error: authError } = useAuth()
  const [companyName, setCompanyName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [step, setStep] = useState(1) // Step 1: Company | Step 2: Credentials

  const handleNext = (e) => {
    e.preventDefault()
    if (!companyName.trim()) {
      setError('Company name required')
      return
    }
    setError('')
    setStep(2)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      if (!email || !password || !confirmPassword) {
        setError('All fields required')
        setIsSubmitting(false)
        return
      }

      if (password !== confirmPassword) {
        setError('Passwords do not match')
        setIsSubmitting(false)
        return
      }

      if (password.length < 8) {
        setError('Password must be at least 8 characters')
        setIsSubmitting(false)
        return
      }

      await signup(email, password, companyName)
      // Redirect to dashboard on success (handled by AuthContext)
      window.location.href = '/dashboard'
    } catch (err) {
      setError(err.message || 'Signup failed')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-site-primary to-site-dark flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-site-primary mb-2">CrewsSite</h1>
          <p className="text-gray-600 mb-8">Get Started with Site Management</p>

          {/* Progress Bar */}
          <div className="flex gap-2 mb-8">
            <div className={`flex-1 h-2 rounded ${step >= 1 ? 'bg-site-primary' : 'bg-gray-300'}`}></div>
            <div className={`flex-1 h-2 rounded ${step >= 2 ? 'bg-site-primary' : 'bg-gray-300'}`}></div>
          </div>

          <form onSubmit={step === 1 ? handleNext : handleSubmit} className="space-y-4">
            {/* Error Messages */}
            {(error || authError) && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error || authError}
              </div>
            )}

            {step === 1 ? (
              <>
                {/* Step 1: Company Info */}
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Create Your Company</h2>

                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
                    Company Name
                  </label>
                  <input
                    id="companyName"
                    type="text"
                    placeholder="e.g., ABC Construction Ltd"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-site-primary focus:border-transparent"
                    disabled={loading || isSubmitting}
                  />
                </div>

                <p className="text-sm text-gray-500 mt-4">
                  You'll be set up as the owner. You can add team members after creating your account.
                </p>

                <button
                  type="submit"
                  disabled={loading || isSubmitting}
                  className="w-full bg-site-primary hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
                >
                  Next →
                </button>
              </>
            ) : (
              <>
                {/* Step 2: Credentials */}
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Create Your Account</h2>

                <div className="bg-blue-50 border border-blue-200 p-3 rounded text-sm text-blue-700 mb-4">
                  <p className="font-medium">Company: {companyName}</p>
                </div>

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
                  <p className="text-xs text-gray-500 mt-1">At least 8 characters</p>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-site-primary focus:border-transparent"
                    disabled={loading || isSubmitting}
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    disabled={loading || isSubmitting}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 disabled:bg-gray-400 text-gray-900 font-bold py-2 px-4 rounded-lg transition duration-200"
                  >
                    ← Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading || isSubmitting}
                    className="flex-1 bg-site-primary hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
                  >
                    {isSubmitting ? 'Creating...' : 'Create Account'}
                  </button>
                </div>
              </>
            )}
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <a href="/login" className="text-site-primary hover:underline font-medium">
                Sign in here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
