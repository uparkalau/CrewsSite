/**
 * Firestore Path Constants
 * Centralized database path definitions following /artifacts/crewssite/... structure
 */

const FIREBASE_ROOT = 'artifacts/crewssite'

/**
 * Public data paths (shared across crew)
 */
export const PUBLIC_PATHS = {
  SITES: `${FIREBASE_ROOT}/public/data/sites`,
  SITE_DETAILS: (siteId) => `${FIREBASE_ROOT}/public/data/sites/${siteId}`,
  SITE_CHATS: (siteId) => `${FIREBASE_ROOT}/public/data/chats/${siteId}/messages`,
  SITE_CHAT_MESSAGE: (siteId, messageId) => `${FIREBASE_ROOT}/public/data/chats/${siteId}/messages/${messageId}`,
}

/**
 * Private user data paths
 */
export const USER_PATHS = {
  PROFILE: (userId) => `${FIREBASE_ROOT}/users/${userId}/profile`,
  ATTENDANCE: (userId) => `${FIREBASE_ROOT}/users/${userId}/attendance`,
  ATTENDANCE_LOG: (userId, logId) => `${FIREBASE_ROOT}/users/${userId}/attendance/${logId}`,
  DAILY_REPORTS: (userId) => `${FIREBASE_ROOT}/users/${userId}/dailyReports`,
  DAILY_REPORT: (userId, reportId) => `${FIREBASE_ROOT}/users/${userId}/dailyReports/${reportId}`,
}

/**
 * Payroll data paths (Project Head only)
 */
export const PAYROLL_PATHS = {
  SUMMARIES: (headId) => `${FIREBASE_ROOT}/users/${headId}/payrollSummaries`,
  SUMMARY: (headId, summaryId) => `${FIREBASE_ROOT}/users/${headId}/payrollSummaries/${summaryId}`,
}

export default {
  PUBLIC_PATHS,
  USER_PATHS,
  PAYROLL_PATHS,
}
