/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, useCallback, useContext } from 'react'
import {
  getAuth,
  onAuthStateChanged,
  signOut as firebaseSignOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from 'firebase/auth'
import { getFirestore, doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { firebaseApp } from '../config/firebase'

// Export Auth Context for use in hooks
export const AuthContext = createContext(null)

/**
 * Auth Provider component - manages authentication state with Firebase
 * Wraps your app to provide user context throughout
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null)
  const [companyId, setCompanyId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const auth = getAuth(firebaseApp)
  const db = getFirestore(firebaseApp)

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true)
      setError(null)

      if (currentUser) {
        setUser(currentUser)
        localStorage.setItem('crewssite_user', JSON.stringify({
          uid: currentUser.uid,
          email: currentUser.email
        }))

        // Fetch user role and company from Firestore
        try {
          // Find which company this user belongs to
          // For Phase 1, we'll query the first company where user is a member
          // TODO: In Phase 7, implement multi-company support with company switcher
          
          // For now, use a pattern where company owns themselves
          const memberDocRef = doc(db, `companies/${currentUser.uid}/members/${currentUser.uid}`)
          const memberDoc = await getDoc(memberDocRef)

          if (memberDoc.exists()) {
            const memberData = memberDoc.data()
            setRole(memberData.role || 'owner')
            setCompanyId(currentUser.uid)
          } else {
            // User is new, assign as owner of their own company
            setRole('owner')
            setCompanyId(currentUser.uid)
          }
        } catch (err) {
          console.error('Error fetching user role:', err)
          setError(err.message)
          setRole('owner')
          setCompanyId(currentUser.uid)
        }
      } else {
        setUser(null)
        setRole(null)
        setCompanyId(null)
        localStorage.removeItem('crewssite_user')
      }

      setLoading(false)
    })

    return unsubscribe
  }, [auth, db])

  const signup = useCallback(async (email, password, companyName) => {
    setLoading(true)
    setError(null)
    try {
      // Create Firebase Auth user
      const { user: newUser } = await createUserWithEmailAndPassword(auth, email, password)

      // Create company document
      const companyRef = doc(db, `companies/${newUser.uid}`)
      await setDoc(companyRef, {
        metadata: {
          name: companyName,
          subscription_tier: 'free',
          timezone: 'America/Vancouver',
          owner_id: newUser.uid,
          created_at: serverTimestamp()
        }
      })

      // Create member document (owner)
      const memberRef = doc(db, `companies/${newUser.uid}/members/${newUser.uid}`)
      await setDoc(memberRef, {
        email,
        role: 'owner',
        name: email.split('@')[0],
        hourly_rate: null,
        joined_at: serverTimestamp()
      })

      return newUser
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [auth, db])

  const login = useCallback(async (email, password) => {
    setLoading(true)
    setError(null)
    try {
      const { user: loginUser } = await signInWithEmailAndPassword(auth, email, password)
      return loginUser
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [auth])

  const logout = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      await firebaseSignOut(auth)
      setUser(null)
      setRole(null)
      setCompanyId(null)
      localStorage.removeItem('crewssite_user')
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [auth])

  return (
    <AuthContext.Provider value={{ user, role, companyId, loading, error, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
