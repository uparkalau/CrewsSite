/**
 * Firebase Configuration & Initialization
 * Centralized setup for all Firebase services
 */

import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { getMessaging, isSupported } from 'firebase/messaging'

/**
 * Firebase project configuration
 * @type {object}
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || undefined,
}

// Initialize Firebase with safety checks
let firebaseApp = null
let firebaseInitError = null

try {
  firebaseApp = initializeApp(firebaseConfig)
  console.log('Firebase initialized for project:', firebaseConfig.projectId)
} catch (err) {
  firebaseInitError = err
  console.error('Firebase initialization failed:', err && err.message ? err.message : err)
}

// Export Firebase services (may be null if init failed)
export const firebaseAuth = firebaseApp ? getAuth(firebaseApp) : null
export const firebaseDb = firebaseApp ? getFirestore(firebaseApp) : null
export const firebaseStorage = firebaseApp ? getStorage(firebaseApp) : null

export const initializeMessaging = async () => {
  try {
    const supported = await isSupported()
    if (supported) {
      return firebaseApp ? getMessaging(firebaseApp) : null
    }
  } catch (err) {
    // Messaging not available on this platform
    console.warn('FCM not supported:', err?.message || err)
  }
  return null
}

// Backward compatibility exports
export const auth = firebaseAuth
export const db = firebaseDb

export default firebaseApp

export const validateFirebaseConfig = () => {
  const required = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_STORAGE_BUCKET',
    'VITE_FIREBASE_MESSAGING_SENDER_ID',
    'VITE_FIREBASE_APP_ID',
  ]

  const missing = required.filter((k) => !import.meta.env[k])
  return { isValid: missing.length === 0, missing, firebaseInitError }
}

export { firebaseApp, firebaseInitError }
