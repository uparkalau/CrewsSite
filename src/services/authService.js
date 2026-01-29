/**
 * Authentication Service - Module A: Safe Login
 * Handles user login, role checking, and profile management
 */

import { db, PATHS, ROLES } from '../config/firebase'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { UserProfile } from '../models/dataModels'

export const authService = {
  /**
   * Create user profile after signup
   */
  createUserProfile: async (userId, email, fullName, role = ROLES.TEAM_MEMBER) => {
    try {
      const profilePath = PATHS.USERS.PROFILE(userId)
      const profile = new UserProfile({
        email,
        fullName,
        role,
        createdAt: new Date(),
      })
      await setDoc(doc(db, profilePath), profile.toFirestore())
      return profile
    } catch (error) {
      console.error('Error creating profile:', error)
      throw error
    }
  },

  /**
   * Get user profile
   */
  getUserProfile: async (userId) => {
    try {
      const profilePath = PATHS.USERS.PROFILE(userId)
      const docSnap = await getDoc(doc(db, profilePath))
      if (docSnap.exists()) {
        return UserProfile.fromFirestore(docSnap.data())
      }
      return null
    } catch (error) {
      console.error('Error getting profile:', error)
      throw error
    }
  },

  /**
   * Update user profile (hourly rate, phone, etc.)
   */
  updateUserProfile: async (userId, updates) => {
    try {
      const profilePath = PATHS.USERS.PROFILE(userId)
      await updateDoc(doc(db, profilePath), updates)
      return true
    } catch (error) {
      console.error('Error updating profile:', error)
      throw error
    }
  },

  /**
   * Check user role and determine redirect
   * Returns: { role: 'member' | 'head', profile: UserProfile }
   */
  checkUserRole: async (userId) => {
    try {
      const profile = await authService.getUserProfile(userId)
      return {
        role: profile?.role || ROLES.TEAM_MEMBER,
        profile,
      }
    } catch (error) {
      console.error('Error checking role:', error)
      throw error
    }
  },
}
