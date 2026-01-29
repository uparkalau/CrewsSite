/**
 * Authentication Service - Module A: Safe Login
 * Handles user authentication and profile management
 */

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  setPersistence,
  browserLocalPersistence,
} from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { firebaseAuth, firebaseDb } from '../config/firebase'
import { USER_PATHS } from '../constants/firebasePaths'
import { USER_ROLES } from '../constants/appConstants'

/**
 * Data model for user profile
 */
class UserProfile {
  constructor(data) {
    this.uid = data.uid
    this.fullName = data.fullName
    this.email = data.email
    this.phoneNumber = data.phoneNumber || null
    this.role = data.role || USER_ROLES.TEAM_MEMBER
    this.hourlyRate = data.hourlyRate || 0
    this.profilePhotoUrl = data.profilePhotoUrl || null
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
  }

  toFirestore() {
    return {
      uid: this.uid,
      fullName: this.fullName,
      email: this.email,
      phoneNumber: this.phoneNumber,
      role: this.role,
      hourlyRate: this.hourlyRate,
      profilePhotoUrl: this.profilePhotoUrl,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    }
  }

  static fromFirestore(data, documentId) {
    return new UserProfile({
      ...data,
      uid: documentId,
    })
  }
}

export const authService = {
  /**
   * Register new user with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @param {string} fullName - User's full name
   * @param {string} userRole - User role (member or head)
   * @returns {Promise<object>} New user with profile data
   */
  registerUser: async (email, password, fullName, userRole = USER_ROLES.TEAM_MEMBER) => {
    try {
      await setPersistence(firebaseAuth, browserLocalPersistence)

      const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password)
      const user = userCredential.user

      await updateProfile(user, { displayName: fullName })

      const userProfile = new UserProfile({
        uid: user.uid,
        fullName,
        email,
        role: userRole,
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      const profilePath = USER_PATHS.PROFILE(user.uid)
      await setDoc(doc(firebaseDb, profilePath), userProfile.toFirestore())

      return userProfile
    } catch (error) {
      console.error('Registration error:', error.message)
      throw error
    }
  },

  /**
   * Sign in user with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<object>} Authenticated user profile
   */
  loginUser: async (email, password) => {
    try {
      await setPersistence(firebaseAuth, browserLocalPersistence)

      const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password)
      const user = userCredential.user

      const profilePath = USER_PATHS.PROFILE(user.uid)
      const profileDoc = await getDoc(doc(firebaseDb, profilePath))

      if (!profileDoc.exists()) {
        throw new Error('User profile not found')
      }

      return UserProfile.fromFirestore(profileDoc.data(), user.uid)
    } catch (error) {
      console.error('Login error:', error.message)
      throw error
    }
  },

  /**
   * Sign out current user
   * @returns {Promise<void>}
   */
  logoutUser: async () => {
    try {
      await signOut(firebaseAuth)
    } catch (error) {
      console.error('Logout error:', error.message)
      throw error
    }
  },

  /**
   * Get current user profile
   * @param {string} userId - User ID
   * @returns {Promise<object>} User profile data
   */
  getUserProfile: async (userId) => {
    try {
      const profilePath = USER_PATHS.PROFILE(userId)
      const profileDoc = await getDoc(doc(firebaseDb, profilePath))

      if (!profileDoc.exists()) {
        throw new Error('User profile not found')
      }

      return UserProfile.fromFirestore(profileDoc.data(), userId)
    } catch (error) {
      console.error('Error fetching user profile:', error.message)
      throw error
    }
  },

  /**
   * Update user profile
   * @param {string} userId - User ID
   * @param {object} updateData - Data to update
   * @returns {Promise<object>} Updated user profile
   */
  updateUserProfile: async (userId, updateData) => {
    try {
      const profilePath = USER_PATHS.PROFILE(userId)
      const profileRef = doc(firebaseDb, profilePath)

      const profileDoc = await getDoc(profileRef)
      if (!profileDoc.exists()) {
        throw new Error('User profile not found')
      }

      const currentProfile = UserProfile.fromFirestore(profileDoc.data(), userId)
      const updatedProfile = new UserProfile({
        ...currentProfile,
        ...updateData,
        updatedAt: new Date(),
      })

      await setDoc(profileRef, updatedProfile.toFirestore())

      return updatedProfile
    } catch (error) {
      console.error('Error updating user profile:', error.message)
      throw error
    }
  },

  /**
   * Get current authenticated user
   * @returns {object|null} Current Firebase user or null
   */
  getCurrentUser: () => {
    return firebaseAuth.currentUser
  },

  /**
   * Check if user is authenticated
   * @returns {boolean}
   */
  isAuthenticated: () => {
    return firebaseAuth.currentUser !== null
  },

  /**
   * Check user role and determine redirect
   * @param {string} userId - User ID
   * @returns {Promise<object>} Object with role and profile
   */
  checkUserRole: async (userId) => {
    try {
      const profile = await authService.getUserProfile(userId)
      return {
        role: profile?.role || USER_ROLES.TEAM_MEMBER,
        profile,
      }
    } catch (error) {
      console.error('Error checking role:', error.message)
      throw error
    }
  },
}

export default authService
