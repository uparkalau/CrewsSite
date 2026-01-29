/**
 * Attendance Service - Module B: Geo-Photo Attendance
 * Handles check-in/out with GPS and photo verification
 */

import { addDoc, collection, doc, getDocs, query, Timestamp, updateDoc, where } from 'firebase/firestore'
import { firebaseDb } from '../config/firebase'
import { USER_PATHS } from '../constants/firebasePaths'
import { isLocationWithinGeofence } from '../utils/gpsUtils'

/**
 * Data model for attendance logs
 */
class AttendanceLog {
  constructor(data) {
    this.userId = data.userId
    this.siteId = data.siteId
    this.clockIn = data.clockIn
    this.clockOut = data.clockOut || null
    this.photoUrl = data.photoUrl
    this.clockInGps = data.clockInGps
    this.clockOutGps = data.clockOutGps || null
    this.gpsMatch = data.gpsMatch
    this.status = data.status
  }

  toFirestore() {
    return {
      userId: this.userId,
      siteId: this.siteId,
      clockIn: this.clockIn,
      clockOut: this.clockOut,
      photoUrl: this.photoUrl,
      clockInGps: this.clockInGps,
      clockOutGps: this.clockOutGps,
      gpsMatch: this.gpsMatch,
      status: this.status,
    }
  }

  static fromFirestore(data, documentId) {
    const log = new AttendanceLog(data)
    log.id = documentId
    return log
  }
}

export const attendanceService = {
  /**
   * Clock In - Captures GPS and photo
   * @param {string} userId - User ID
   * @param {string} siteId - Site ID
   * @param {number} latitude - Current latitude
   * @param {number} longitude - Current longitude
   * @param {string} photoUrl - Photo verification URL
   * @param {object} siteLocation - Site center {latitude, longitude}
   * @param {number} radius - Allowed radius in meters
   * @returns {Promise<object>} Clock in record with verification status
   */
  clockIn: async (userId, siteId, latitude, longitude, photoUrl, siteLocation, radius) => {
    try {
      const geofenceResult = isLocationWithinGeofence(
        latitude,
        longitude,
        siteLocation.latitude,
        siteLocation.longitude,
        radius
      )

      const attendanceLog = new AttendanceLog({
        userId,
        siteId,
        clockIn: Timestamp.now(),
        photoUrl,
        clockInGps: { latitude, longitude },
        gpsMatch: geofenceResult.isWithinRadius,
        status: geofenceResult.isWithinRadius ? 'verified' : 'out_of_range',
      })

      const attendancePath = USER_PATHS.ATTENDANCE(userId)
      const documentReference = await addDoc(
        collection(firebaseDb, attendancePath),
        attendanceLog.toFirestore()
      )

      return {
        id: documentReference.id,
        ...attendanceLog,
        distance: geofenceResult.distance,
      }
    } catch (error) {
      console.error('Error during clock in:', error.message)
      throw error
    }
  },

  /**
   * Clock Out - Completes attendance entry
   * @param {string} userId - User ID
   * @param {string} logId - Attendance log ID
   * @param {number} latitude - Clock out latitude
   * @param {number} longitude - Clock out longitude
   * @returns {Promise<boolean>} Success status
   */
  clockOut: async (userId, logId, latitude, longitude) => {
    try {
      const attendancePath = USER_PATHS.ATTENDANCE(userId)
      const documentReference = doc(firebaseDb, attendancePath, logId)

      await updateDoc(documentReference, {
        clockOut: Timestamp.now(),
        clockOutGps: { latitude, longitude },
      })

      return true
    } catch (error) {
      console.error('Error during clock out:', error.message)
      throw error
    }
  },

  /**
   * Get today's attendance log for user (if exists)
   * @param {string} userId - User ID
   * @param {string} siteId - Site ID
   * @returns {Promise<object|null>} Today's attendance log or null
   */
  getTodayLog: async (userId, siteId) => {
    try {
      const todayStartTime = new Date()
      todayStartTime.setHours(0, 0, 0, 0)

      const attendancePath = USER_PATHS.ATTENDANCE(userId)
      const queryBuilder = query(
        collection(firebaseDb, attendancePath),
        where('siteId', '==', siteId),
        where('clockIn', '>=', Timestamp.fromDate(todayStartTime))
      )

      const querySnapshot = await getDocs(queryBuilder)
      if (!querySnapshot.empty) {
        const logData = querySnapshot.docs[0].data()
        return AttendanceLog.fromFirestore(logData, querySnapshot.docs[0].id)
      }
      return null
    } catch (error) {
      console.error('Error getting today log:', error.message)
      throw error
    }
  },

  /**
   * Get attendance history for user (date range)
   * @param {string} userId - User ID
   * @param {Date} startDate - Range start date
   * @param {Date} endDate - Range end date
   * @returns {Promise<Array>} Array of attendance logs
   */
  getAttendanceHistory: async (userId, startDate, endDate) => {
    try {
      const attendancePath = USER_PATHS.ATTENDANCE(userId)
      const queryBuilder = query(
        collection(firebaseDb, attendancePath),
        where('clockIn', '>=', Timestamp.fromDate(startDate)),
        where('clockIn', '<=', Timestamp.fromDate(endDate))
      )

      const querySnapshot = await getDocs(queryBuilder)
      return querySnapshot.docs.map((document) =>
        AttendanceLog.fromFirestore(document.data(), document.id)
      )
    } catch (error) {
      console.error('Error getting attendance history:', error.message)
      throw error
    }
  },

  /**
   * Get attendance logs for entire crew (Project Head only)
   * @param {Array<string>} userIds - Array of user IDs
   * @param {Date} startDate - Range start date
   * @param {Date} endDate - Range end date
   * @returns {Promise<Array>} Combined attendance logs for all crew members
   */
  getCrewAttendance: async (userIds, startDate, endDate) => {
    try {
      const allAttendanceLogs = []

      for (const userId of userIds) {
        const userAttendanceLogs = await attendanceService.getAttendanceHistory(
          userId,
          startDate,
          endDate
        )
        allAttendanceLogs.push(...userAttendanceLogs)
      }

      return allAttendanceLogs
    } catch (error) {
      console.error('Error getting crew attendance:', error.message)
      throw error
    }
  },
}

export default attendanceService
