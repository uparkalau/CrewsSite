/**
 * Form and Data Validation Utilities
 * Centralized validation logic
 */

import { VALIDATION_RULES } from '../constants/appConstants'

/**
 * Validate email format
 * @param {string} email - Email address to validate
 * @returns {object} Validation result with isValid boolean and error message
 */
export function validateEmail(email) {
  if (!email || typeof email !== 'string') {
    return { isValid: false, error: 'Email is required' }
  }

  if (!VALIDATION_RULES.EMAIL_PATTERN.test(email)) {
    return { isValid: false, error: 'Invalid email format' }
  }

  return { isValid: true, error: null }
}

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {object} Validation result with isValid boolean and error message
 */
export function validatePassword(password) {
  if (!password || typeof password !== 'string') {
    return { isValid: false, error: 'Password is required' }
  }

  if (password.length < VALIDATION_RULES.PASSWORD_MIN_LENGTH) {
    return { isValid: false, error: `Password must be at least ${VALIDATION_RULES.PASSWORD_MIN_LENGTH} characters` }
  }

  const hasUppercase = /[A-Z]/.test(password)
  const hasLowercase = /[a-z]/.test(password)
  const hasNumbers = /\d/.test(password)

  if (!hasUppercase || !hasLowercase || !hasNumbers) {
    return { isValid: false, error: 'Password must contain uppercase, lowercase, and numbers' }
  }

  return { isValid: true, error: null }
}

/**
 * Validate hourly rate
 * @param {number} hourlyRate - Hourly rate in dollars
 * @returns {object} Validation result with isValid boolean and error message
 */
export function validateHourlyRate(hourlyRate) {
  const rate = Number(hourlyRate)

  if (isNaN(rate)) {
    return { isValid: false, error: 'Hourly rate must be a number' }
  }

  if (rate < VALIDATION_RULES.HOURLY_RATE_MIN || rate > VALIDATION_RULES.HOURLY_RATE_MAX) {
    return { isValid: false, error: `Hourly rate must be between $${VALIDATION_RULES.HOURLY_RATE_MIN} and $${VALIDATION_RULES.HOURLY_RATE_MAX}` }
  }

  return { isValid: true, error: null }
}

/**
 * Validate phone number format
 * @param {string} phoneNumber - Phone number to validate
 * @returns {object} Validation result with isValid boolean and error message
 */
export function validatePhoneNumber(phoneNumber) {
  if (!phoneNumber || typeof phoneNumber !== 'string') {
    return { isValid: false, error: 'Phone number is required' }
  }

  if (!VALIDATION_RULES.PHONE_PATTERN.test(phoneNumber)) {
    return { isValid: false, error: 'Invalid phone number format' }
  }

  return { isValid: true, error: null }
}

/**
 * Validate required field
 * @param {any} value - Value to check
 * @param {string} fieldName - Name of field for error message
 * @returns {object} Validation result
 */
export function validateRequired(value, fieldName = 'This field') {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return { isValid: false, error: `${fieldName} is required` }
  }

  return { isValid: true, error: null }
}

export default {
  validateEmail,
  validatePassword,
  validateHourlyRate,
  validatePhoneNumber,
  validateRequired,
}
