/**
 * Payroll Service - Module D: Payroll Engine
 * Handles payroll calculations and export
 */

import { collection, doc, getDocs, query, setDoc, Timestamp, where } from 'firebase/firestore'
import * as XLSX from 'xlsx'
import { firebaseDb } from '../config/firebase'
import { PAYROLL_PATHS, USER_PATHS } from '../constants/firebasePaths'
import { calculateHoursWorked } from '../utils/dateTimeUtils'

/**
 * Data model for payroll summary
 */
class PayrollSummary {
  constructor(data) {
    this.headId = data.headId
    this.periodStartDate = data.periodStartDate
    this.periodEndDate = data.periodEndDate
    this.entries = data.entries || []
    this.totalAmount = data.totalAmount || 0
    this.createdAt = data.createdAt
    this.exportedAt = data.exportedAt || null
  }

  toFirestore() {
    return {
      headId: this.headId,
      periodStartDate: this.periodStartDate,
      periodEndDate: this.periodEndDate,
      entries: this.entries,
      totalAmount: this.totalAmount,
      createdAt: this.createdAt,
      exportedAt: this.exportedAt,
    }
  }

  static fromFirestore(data, documentId) {
    const summary = new PayrollSummary(data)
    summary.id = documentId
    return summary
  }
}

export const payrollService = {
  /**
   * Calculate payroll for crew members
   * @param {Array<string>} crewUserIds - Array of crew member user IDs
   * @param {Date} startDate - Period start date
   * @param {Date} endDate - Period end date
   * @returns {Promise<Array>} Payroll entries with hours and amounts
   */
  calculateCrewPayroll: async (crewUserIds, startDate, endDate) => {
    try {
      const payrollEntries = []

      for (const userId of crewUserIds) {
        const userProfile = await payrollService.getUserPayrollData(userId)
        const attendanceLogs = await payrollService.getAttendanceLogsForPeriod(userId, startDate, endDate)

        for (const log of attendanceLogs) {
          if (log.clockOut) {
            const hoursWorked = calculateHoursWorked(log.clockIn.toDate(), log.clockOut.toDate())
            const subtotal = hoursWorked * userProfile.hourlyRate

            payrollEntries.push({
              userId,
              fullName: userProfile.fullName,
              siteId: log.siteId,
              date: new Date(log.clockIn.toDate()).toLocaleDateString(),
              hoursWorked: parseFloat(hoursWorked.toFixed(2)),
              hourlyRate: userProfile.hourlyRate,
              subtotal: parseFloat(subtotal.toFixed(2)),
              gpsVerified: log.gpsMatch,
            })
          }
        }
      }

      return payrollEntries
    } catch (error) {
      console.error('Error calculating payroll:', error.message)
      throw error
    }
  },

  /**
   * Get user payroll data (hourly rate and profile)
   * @param {string} userId - User ID
   * @returns {Promise<object>} User profile with hourly rate
   */
  getUserPayrollData: async (userId) => {
    try {
      const profilePath = USER_PATHS.PROFILE(userId)
      const profileDoc = await getDocs(query(collection(firebaseDb, profilePath)))

      if (profileDoc.empty) {
        throw new Error(`User profile not found for ${userId}`)
      }

      return profileDoc.docs[0].data()
    } catch (error) {
      console.error('Error getting user payroll data:', error.message)
      throw error
    }
  },

  /**
   * Get attendance logs for date period
   * @param {string} userId - User ID
   * @param {Date} startDate - Period start
   * @param {Date} endDate - Period end
   * @returns {Promise<Array>} Attendance logs
   */
  getAttendanceLogsForPeriod: async (userId, startDate, endDate) => {
    try {
      const attendancePath = USER_PATHS.ATTENDANCE(userId)
      const queryBuilder = query(
        collection(firebaseDb, attendancePath),
        where('clockIn', '>=', Timestamp.fromDate(startDate)),
        where('clockIn', '<=', Timestamp.fromDate(endDate))
      )

      const querySnapshot = await getDocs(queryBuilder)
      return querySnapshot.docs.map((document) => document.data())
    } catch (error) {
      console.error('Error getting attendance logs:', error.message)
      throw error
    }
  },

  /**
   * Export payroll to Excel format
   * @param {Array} payrollEntries - Payroll calculation entries
   * @param {string} fileName - Output file name
   * @returns {void} Downloads Excel file
   */
  exportPayrollToExcel: (payrollEntries, fileName = 'payroll_export.xlsx') => {
    try {
      const workbook = XLSX.utils.book_new()

      // Create summary sheet
      const summaryData = [
        ['Payroll Export Report'],
        ['Export Date', new Date().toLocaleDateString()],
        ['Total Entries', payrollEntries.length],
        ['Total Amount', `$${payrollEntries.reduce((sum, entry) => sum + entry.subtotal, 0).toFixed(2)}`],
      ]

      const summarySheet = XLSX.utils.aoa_to_sheet(summaryData)
      XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary')

      // Create detailed sheet
      const detailSheet = XLSX.utils.json_to_sheet(payrollEntries)
      XLSX.utils.book_append_sheet(workbook, detailSheet, 'Details')

      // Download
      XLSX.writeFile(workbook, fileName)
    } catch (error) {
      console.error('Error exporting payroll to Excel:', error.message)
      throw error
    }
  },

  /**
   * Export payroll to CSV format
   * @param {Array} payrollEntries - Payroll calculation entries
   * @param {string} fileName - Output file name
   * @returns {void} Downloads CSV file
   */
  exportPayrollToCSV: (payrollEntries, fileName = 'payroll_export.csv') => {
    try {
      const csvContent = [
        ['User ID', 'Full Name', 'Site ID', 'Date', 'Hours Worked', 'Hourly Rate', 'Subtotal', 'GPS Verified'],
        ...payrollEntries.map((entry) => [
          entry.userId,
          entry.fullName,
          entry.siteId,
          entry.date,
          entry.hoursWorked,
          entry.hourlyRate,
          entry.subtotal,
          entry.gpsVerified ? 'Yes' : 'No',
        ]),
      ]

      const csvText = csvContent.map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n')
      const blob = new Blob([csvText], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = fileName
      link.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error exporting payroll to CSV:', error.message)
      throw error
    }
  },

  /**
   * Save payroll summary to Firebase
   * @param {string} headId - Project Head ID
   * @param {Date} startDate - Period start
   * @param {Date} endDate - Period end
   * @param {Array} payrollEntries - Calculated payroll entries
   * @returns {Promise<object>} Saved payroll summary
   */
  savePayrollSummary: async (headId, startDate, endDate, payrollEntries) => {
    try {
      const totalAmount = payrollEntries.reduce((sum, entry) => sum + entry.subtotal, 0)

      const summary = new PayrollSummary({
        headId,
        periodStartDate: startDate,
        periodEndDate: endDate,
        entries: payrollEntries,
        totalAmount: parseFloat(totalAmount.toFixed(2)),
        createdAt: new Date(),
      })

      const summaryPath = PAYROLL_PATHS.SUMMARIES(headId)
      const newDocRef = doc(collection(firebaseDb, summaryPath))
      await setDoc(newDocRef, summary.toFirestore())

      return PayrollSummary.fromFirestore(summary.toFirestore(), newDocRef.id)
    } catch (error) {
      console.error('Error saving payroll summary:', error.message)
      throw error
    }
  },

  /**
   * Get payroll summary for display
   * @param {Array} payrollData - Payroll calculation results
   * @returns {object} Summary statistics
   */
  getPayrollSummary: (payrollData) => {
    const summary = {
      totalPeople: payrollData.length,
      totalHours: 0,
      totalPayroll: 0,
      entries: [],
    }

    payrollData.forEach((person) => {
      summary.totalHours += person.hoursWorked
      summary.totalPayroll += person.subtotal
      summary.entries.push({
        name: person.fullName,
        hours: person.hoursWorked,
        rate: person.hourlyRate,
        pay: person.subtotal,
      })
    })

    return summary
  },
}

export default payrollService
