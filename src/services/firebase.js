/**
 * Firebase service - handles all Firebase operations
 * Currently using localStorage as fallback, ready for Firebase integration
 */

// TODO: Uncomment when Firebase is configured
// import { initializeApp } from 'firebase/app'
// import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth'
// import { getFirestore, collection, addDoc, query, where, getDocs } from 'firebase/firestore'

// const firebaseConfig = {
//   apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
//   authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
//   projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
//   storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
//   appId: import.meta.env.VITE_FIREBASE_APP_ID,
// }

// const app = initializeApp(firebaseConfig)
// export const auth = getAuth(app)
// export const db = getFirestore(app)

/**
 * Mock user service for development
 * Replace with Firebase calls once configured
 */

export const authService = {
  /**
   * Sign up new user
   */
  signup: async (email, displayName) => {
    // TODO: Replace with Firebase createUserWithEmailAndPassword
    // Placeholder for now
    return {
      uid: 'mock_' + Date.now(),
      email,
      displayName,
    }
  },

  /**
   * Sign in existing user
   */
  signin: async (email) => {
    // TODO: Replace with Firebase signInWithEmailAndPassword
    return {
      uid: 'mock_' + Date.now(),
      email,
    }
  },

  /**
   * Sign out current user
   */
  signout: async () => {
    // TODO: Replace with Firebase signOut
    return true
  },

  /**
   * Get current user
   */
  getCurrentUser: () => {
    // TODO: Replace with Firebase getCurrentUser
    return null
  },
}

/**
 * Time tracking service
 */
export const timeTrackingService = {
  /**
   * Clock in with geolocation
   */
  clockIn: async (userId, latitude, longitude, photoUrl) => {
    // TODO: Add to Firestore timesheets collection
    return {
      id: 'clockin_' + Date.now(),
      userId,
      clockInTime: new Date(),
      location: { latitude, longitude },
      photoUrl,
    }
  },

  /**
   * Clock out
   */
  clockOut: async (userId, clockInId) => {
    // TODO: Update Firestore timesheet
    return {
      id: clockInId,
      clockOutTime: new Date(),
    }
  },

  /**
   * Get user's timesheets
   */
  getTimesheets: async () => {
    // TODO: Query Firestore for timesheets
    return []
  },
}

/**
 * Daily report service
 */
export const reportService = {
  /**
   * Submit daily report
   */
  submitReport: async (userId, siteId, reportData) => {
    const { workCompleted, remainingTasks, issues, photos } = reportData
    // TODO: Add to Firestore reports collection
    return {
      id: 'report_' + Date.now(),
      userId,
      siteId,
      date: new Date(),
      workCompleted,
      remainingTasks,
      issues,
      photos,
    }
  },

  /**
   * Get site reports
   */
  getSiteReports: async () => {
    // TODO: Query Firestore for site reports
    return []
  },
}

/**
 * Payroll service
 */
export const payrollService = {
  /**
   * Calculate payroll for user
   */
  calculatePayroll: async (userId, startDate, endDate) => {
    // TODO: Query timesheets and calculate
    return {
      userId,
      period: { startDate, endDate },
      totalHours: 0,
      totalPay: 0,
      breakdown: [],
    }
  },

  /**
   * Export payroll as CSV
   */
  exportPayroll: async () => {
    // TODO: Generate CSV file
    return new Blob([], { type: 'text/csv' })
  },
}
