/**
 * Daily Report Service - Module C: Daily Reporting
 * Handles daily work reports submission and tracking
 */

import { db, PATHS } from '../config/firebase'
import { collection, addDoc, query, where, getDocs, Timestamp } from 'firebase/firestore'
import { DailyReport } from '../models/dataModels'

export const reportService = {
  /**
   * Submit daily report
   * @param {string} userId - User ID
   * @param {string} siteId - Site ID
   * @param {object} reportData - {hoursWorked, progressMade, materialsNeeded, issues}
   */
  submitReport: async (userId, siteId, reportData) => {
    try {
      const report = new DailyReport({
        userId,
        siteId,
        date: new Date(),
        hoursWorked: reportData.hoursWorked || 0,
        progressMade: reportData.progressMade || '',
        materialsNeeded: reportData.materialsNeeded || '',
        issues: reportData.issues || [],
        submitted: true,
        submittedAt: new Date(),
      })

      // Create collection if it doesn't exist
      const reportPath = `${PATHS.USERS.ATTENDANCE(userId)}_reports`
      const docRef = await addDoc(collection(db, reportPath), report.toFirestore())

      return {
        id: docRef.id,
        ...report,
      }
    } catch (error) {
      console.error('Error submitting report:', error)
      throw error
    }
  },

  /**
   * Get today's report for user (if exists)
   */
  getTodayReport: async (userId, siteId) => {
    try {
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const reportPath = `${PATHS.USERS.ATTENDANCE(userId)}_reports`
      const q = query(
        collection(db, reportPath),
        where('siteId', '==', siteId),
        where('date', '>=', Timestamp.fromDate(today))
      )

      const snapshot = await getDocs(q)
      if (!snapshot.empty) {
        const data = snapshot.docs[0].data()
        return DailyReport.fromFirestore(data, snapshot.docs[0].id)
      }
      return null
    } catch (error) {
      console.error('Error getting today report:', error)
      throw error
    }
  },

  /**
   * Get report history for user
   */
  getReportHistory: async (userId, startDate, endDate) => {
    try {
      const reportPath = `${PATHS.USERS.ATTENDANCE(userId)}_reports`
      const q = query(
        collection(db, reportPath),
        where('date', '>=', Timestamp.fromDate(startDate)),
        where('date', '<=', Timestamp.fromDate(endDate))
      )

      const snapshot = await getDocs(q)
      return snapshot.docs.map(doc => DailyReport.fromFirestore(doc.data(), doc.id))
    } catch (error) {
      console.error('Error getting report history:', error)
      throw error
    }
  },

  /**
   * Get all reports for site crew (Project Head only)
   */
  getSiteReportsForCrew: async (userIds, siteId, startDate, endDate) => {
    try {
      const allReports = []

      for (const userId of userIds) {
        const reportPath = `${PATHS.USERS.ATTENDANCE(userId)}_reports`
        const q = query(
          collection(db, reportPath),
          where('siteId', '==', siteId),
          where('date', '>=', Timestamp.fromDate(startDate)),
          where('date', '<=', Timestamp.fromDate(endDate))
        )

        const snapshot = await getDocs(q)
        allReports.push(
          ...snapshot.docs.map(doc => DailyReport.fromFirestore(doc.data(), doc.id))
        )
      }

      return allReports
    } catch (error) {
      console.error('Error getting site reports for crew:', error)
      throw error
    }
  },

  /**
   * Check if user has submitted report today (by 6 PM local time)
   * Used to trigger notifications
   */
  checkMissingReport: async (userId, siteId) => {
    try {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const reportHour = 18 // 6 PM

      const now = new Date()
      const currentHour = now.getHours()

      // Only check after 6 PM
      if (currentHour < reportHour) {
        return false
      }

      const report = await reportService.getTodayReport(userId, siteId)
      return !report?.submitted
    } catch (error) {
      console.error('Error checking missing report:', error)
      return false
    }
  },
}
