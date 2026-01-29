/**
 * Date and Time Utilities
 * Handles timezone-aware date operations for Vancouver (PT)
 */

import { DAILY_REPORT_CONFIG } from '../constants/appConstants'

/**
 * Get current time in Vancouver timezone
 * @returns {Date} Current date and time in PT
 */
export function getCurrentTimeVancouver() {
  return new Date().toLocaleString('en-US', { timeZone: 'America/Vancouver' })
}

/**
 * Get today's date at midnight in Vancouver timezone
 * @returns {Date} Today at 00:00:00 PT
 */
export function getTodayMidnightVancouver() {
  const now = new Date()
  const vancouverTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/Vancouver' }))
  vancouverTime.setHours(0, 0, 0, 0)
  return vancouverTime
}

/**
 * Check if time has passed the daily report deadline
 * @param {Date} referenceDate - Date to check against
 * @param {number} deadlineHour - Hour of deadline (0-23)
 * @param {number} deadlineMinute - Minute of deadline (0-59)
 * @returns {boolean} True if current time is past deadline
 */
export function isPassedDailyReportDeadline(referenceDate = new Date(), deadlineHour = DAILY_REPORT_CONFIG.DEADLINE_HOUR, deadlineMinute = DAILY_REPORT_CONFIG.DEADLINE_MINUTE) {
  const vancouverDate = new Date(referenceDate.toLocaleString('en-US', { timeZone: 'America/Vancouver' }))
  const currentHour = vancouverDate.getHours()
  const currentMinute = vancouverDate.getMinutes()

  return currentHour > deadlineHour || (currentHour === deadlineHour && currentMinute >= deadlineMinute)
}

/**
 * Format date for display
 * @param {Date} date - Date to format
 * @param {string} format - Format pattern (e.g., 'YYYY-MM-DD', 'MM/DD/YYYY')
 * @returns {string} Formatted date string
 */
export function formatDate(date, format = 'YYYY-MM-DD') {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const seconds = String(d.getSeconds()).padStart(2, '0')

  const formatMap = {
    'YYYY-MM-DD': `${year}-${month}-${day}`,
    'MM/DD/YYYY': `${month}/${day}/${year}`,
    'DD-MM-YYYY': `${day}-${month}-${year}`,
    'YYYY-MM-DD HH:MM:SS': `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`,
  }

  return formatMap[format] || formatMap['YYYY-MM-DD']
}

/**
 * Calculate hours between two timestamps
 * @param {Date} startTime - Start timestamp
 * @param {Date} endTime - End timestamp
 * @returns {number} Hours worked (decimal)
 */
export function calculateHoursWorked(startTime, endTime) {
  const millisecondsPerHour = 1000 * 60 * 60
  const differenceMilliseconds = new Date(endTime) - new Date(startTime)
  return differenceMilliseconds / millisecondsPerHour
}

export default {
  getCurrentTimeVancouver,
  getTodayMidnightVancouver,
  isPassedDailyReportDeadline,
  formatDate,
  calculateHoursWorked,
}
