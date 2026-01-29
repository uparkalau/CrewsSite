/**
 * Payroll Service - Module D: Payroll Engine (Project Head Only)
 * Handles payroll calculations and Excel export
 */

import { attendanceService } from './attendanceService'
import { authService } from './authService'
import { PayrollSummary } from '../models/dataModels'

export const payrollService = {
  /**
   * Calculate payroll for crew members in date range
   * @param {array} userIds - Array of team member UIDs
   * @param {Date} startDate - Start of payroll period
   * @param {Date} endDate - End of payroll period
   */
  calculatePayroll: async (userIds, startDate, endDate) => {
    try {
      const payrollEntries = []

      for (const userId of userIds) {
        // Get user profile for hourly rate
        const profile = await authService.getUserProfile(userId)
        if (!profile) continue

        // Get all attendance logs for user in date range
        const logs = await attendanceService.getAttendanceHistory(userId, startDate, endDate)

        // Group by site and date
        const siteBreakdown = {}
        let totalHours = 0

        logs.forEach(log => {
          if (!log.clockOut) return // Only count completed shifts

          const hours = log.getTotalHours()
          totalHours += hours

          if (!siteBreakdown[log.siteId]) {
            siteBreakdown[log.siteId] = []
          }

          siteBreakdown[log.siteId].push({
            date: log.clockIn.toDate?.() || log.clockIn,
            hours: hours.toFixed(2),
            verified: log.gpsMatch,
            subtotal: (hours * profile.hourlyRate).toFixed(2),
          })
        })

        // Create payroll summary for user
        const entries = []
        for (const [siteId, logs] of Object.entries(siteBreakdown)) {
          logs.forEach(log => {
            entries.push({
              site: siteId,
              date: log.date.toLocaleDateString(),
              hours: parseFloat(log.hours),
              verified: log.verified,
              subtotal: parseFloat(log.subtotal),
            })
          })
        }

        payrollEntries.push({
          userId,
          userName: profile.fullName,
          hourlyRate: profile.hourlyRate,
          entries,
          totalHours: parseFloat(totalHours.toFixed(2)),
          totalPay: parseFloat((totalHours * profile.hourlyRate).toFixed(2)),
        })
      }

      return payrollEntries
    } catch (error) {
      console.error('Error calculating payroll:', error)
      throw error
    }
  },

  /**
   * Export payroll to Excel format (CSV)
   * @param {array} payrollData - Result from calculatePayroll
   * @param {string} periodLabel - e.g., "Oct 21 - Nov 3"
   */
  exportToCSV: (payrollData, periodLabel = '') => {
    try {
      let csv = `CrewsSite Payroll Export\n`
      csv += `Period: ${periodLabel}\n`
      csv += `Generated: ${new Date().toLocaleString()}\n\n`

      payrollData.forEach(person => {
        csv += `\nEmployee: ${person.userName}\n`
        csv += `Hourly Rate: $${person.hourlyRate.toFixed(2)}\n`
        csv += `Date,Site,Hours,Verified,Subtotal\n`

        person.entries.forEach(entry => {
          csv += `${entry.date},${entry.site},${entry.hours},${entry.verified ? 'Yes' : 'No'},$${entry.subtotal.toFixed(2)}\n`
        })

        csv += `\nTotal Hours: ${person.totalHours}\n`
        csv += `Total Pay: $${person.totalPay.toFixed(2)}\n`
        csv += `---\n`
      })

      // Create blob and trigger download
      const blob = new Blob([csv], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `payroll_${new Date().getTime()}.csv`
      a.click()
      window.URL.revokeObjectURL(url)

      return true
    } catch (error) {
      console.error('Error exporting payroll:', error)
      throw error
    }
  },

  /**
   * Export payroll to Excel format (using SheetJS if available)
   * Falls back to CSV if SheetJS not available
   */
  exportToExcel: async (payrollData, periodLabel = '') => {
    try {
      // Check if SheetJS is available
      if (typeof window !== 'undefined' && window.XLSX) {
        const workbook = window.XLSX.utils.book_new()

        // Create summary sheet
        const summaryData = payrollData.map(person => ({
          'Employee': person.userName,
          'Hourly Rate': `$${person.hourlyRate.toFixed(2)}`,
          'Total Hours': person.totalHours,
          'Total Pay': `$${person.totalPay.toFixed(2)}`,
        }))

        const summarySheet = window.XLSX.utils.json_to_sheet(summaryData)
        window.XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary')

        // Create detailed sheet
        const detailData = []
        payrollData.forEach(person => {
          person.entries.forEach(entry => {
            detailData.push({
              'Employee': person.userName,
              'Date': entry.date,
              'Site': entry.site,
              'Hours': entry.hours,
              'Hourly Rate': `$${person.hourlyRate.toFixed(2)}`,
              'Subtotal': `$${entry.subtotal.toFixed(2)}`,
              'Verified': entry.verified ? 'Yes' : 'No',
            })
          })
        })

        const detailSheet = window.XLSX.utils.json_to_sheet(detailData)
        window.XLSX.utils.book_append_sheet(workbook, detailSheet, 'Details')

        // Generate file
        const filename = `payroll_${new Date().getTime()}.xlsx`
        window.XLSX.writeFile(workbook, filename)

        return true
      } else {
        // Fallback to CSV
        console.warn('SheetJS not available, exporting as CSV')
        return payrollService.exportToCSV(payrollData, periodLabel)
      }
    } catch (error) {
      console.error('Error exporting to Excel:', error)
      throw error
    }
  },

  /**
   * Get payroll summary for display
   */
  getPayrollSummary: (payrollData) => {
    const summary = {
      totalPeople: payrollData.length,
      totalHours: 0,
      totalPayroll: 0,
      entries: [],
    }

    payrollData.forEach(person => {
      summary.totalHours += person.totalHours
      summary.totalPayroll += person.totalPay
      summary.entries.push({
        name: person.userName,
        hours: person.totalHours,
        rate: person.hourlyRate,
        pay: person.totalPay,
      })
    })

    return summary
  },
}
