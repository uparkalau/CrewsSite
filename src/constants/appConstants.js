/**
 * Application Constants & Configuration
 * Centralized values for the entire application
 */

/**
 * User role definitions
 */
export const USER_ROLES = {
  TEAM_MEMBER: 'member',
  PROJECT_HEAD: 'head',
}

/**
 * Attendance status definitions
 */
export const ATTENDANCE_STATUS = {
  VERIFIED: 'verified',
  OUT_OF_RANGE: 'out_of_range',
  PENDING_REVIEW: 'pending_review',
  FLAGGED: 'flagged',
}

/**
 * GPS Geofencing settings
 */
export const GEOFENCING_CONFIG = {
  DEFAULT_RADIUS_METERS: 200,
  EARTH_RADIUS_METERS: 6371e3,
}

/**
 * Daily report settings
 */
export const DAILY_REPORT_CONFIG = {
  DEADLINE_HOUR: 18,
  DEADLINE_MINUTE: 0,
}

/**
 * Form validation rules
 */
export const VALIDATION_RULES = {
  EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_PATTERN: /^[\d\s\-+()]{10,}$/,
  PASSWORD_MIN_LENGTH: 8,
  HOURLY_RATE_MIN: 15,
  HOURLY_RATE_MAX: 200,
}

/**
 * UI/UX constants
 */
export const UI_CONSTANTS = {
  TOAST_DURATION_MS: 3000,
  ANIMATION_DURATION_MS: 300,
  DEBOUNCE_DELAY_MS: 500,
}

export default {
  USER_ROLES,
  ATTENDANCE_STATUS,
  GEOFENCING_CONFIG,
  DAILY_REPORT_CONFIG,
  VALIDATION_RULES,
  UI_CONSTANTS,
}
