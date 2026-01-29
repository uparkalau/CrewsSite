import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

/**
 * Hook to use auth context
 * Usage: const { user, login, logout } = useAuth()
 */
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
