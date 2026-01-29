/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect } from 'react'

// Export Auth Context for use in hooks
export const AuthContext = createContext(null)

/**
 * Auth Provider component - manages authentication state
 * Wraps your app to provide user context throughout
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Initialize auth state on mount (check localStorage or Firebase)
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // TODO: Check Firebase auth state here
        const storedUser = localStorage.getItem('crewssite_user')
        if (storedUser) {
          setUser(JSON.parse(storedUser))
        }
      } catch (err) {
        console.error('Auth check failed:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email) => {
    setLoading(true)
    setError(null)
    try {
      // TODO: Implement Firebase authentication
      const userData = { email, id: 'temp_id' }
      setUser(userData)
      localStorage.setItem('crewssite_user', JSON.stringify(userData))
      return userData
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('crewssite_user')
  }

  const signup = async (email, password, name) => {
    setLoading(true)
    setError(null)
    try {
      // TODO: Implement Firebase signup
      const userData = { email, name, id: 'temp_id' }
      setUser(userData)
      localStorage.setItem('crewssite_user', JSON.stringify(userData))
      return userData
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  )
}
