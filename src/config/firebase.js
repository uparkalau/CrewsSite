/* eslint-disable react-refresh/only-export-components */
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// Firebase Configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)

// Firestore Collection Paths (Following artifact structure)
export const PATHS = {
  // Public Data Scope
  PUBLIC: {
    SITES: 'artifacts/crewssite/public/data/sites',
    CHATS: 'artifacts/crewssite/public/data/chats',
  },
  // Private Data Scope
  USERS: {
    PROFILE: (userId) => `artifacts/crewssite/users/${userId}/profile`,
    ATTENDANCE: (userId) => `artifacts/crewssite/users/${userId}/attendance`,
  },
}

// User Roles
export const ROLES = {
  TEAM_MEMBER: 'member',
  PROJECT_HEAD: 'head',
}

export default app
