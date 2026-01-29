/**
 * Attendance Service - Module B: Geo-Photo Attendance
 * Handles check-in/out with GPS and photo verification
 */

import { db, PATHS } from '../config/firebase'
import { collection, addDoc, updateDoc, doc, query, where, getDocs, Timestamp } from 'firebase/firestore'
import { AttendanceLog } from '../models/dataModels'

/**
 * Calculate distance between two GPS coordinates (in meters)
 * Uses Haversine formula
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3 // Earth radius in meters
/**
 * Converts the first latitude value from degrees to radians
 * @type {number}
 */
  const φ1 = (lat1 * Math.PI) / 180
  const φ2 = (lat2 * Math.PI) / 180
  const Δφ = ((lat2 - lat1) * Math.PI) / 180
  const Δλ = ((lon2 - lon1) * Math.PI) / 180

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
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
   */
  clockIn: async (userId, siteId, latitude, longitude, photoUrl, siteLocation, radius) => {
    try {
      // Check if GPS is within allowed radius
      const distance = calculateDistance(
        latitude,
        longitude,
        siteLocation.latitude,
        siteLocation.longitude
      )
      const gpsMatch = distance <= radius

      const log = new AttendanceLog({
        userId,
        siteId,
        clockIn: Timestamp.now(),
        photoUrl,
        clockInGps: { latitude, longitude },
        gpsMatch,
        status: gpsMatch ? 'verified' : 'out_of_range',
      })

      const attendancePath = PATHS.USERS.ATTENDANCE(userId)
      const docRef = await addDoc(collection(db, attendancePath), log.toFirestore())

      return {
        id: docRef.id,
        ...log,
        gpsMatch,
        distance,
      }
    } catch (error) {
      console.error('Error during clock in:', error)
      throw error
    }
  },

  /**
   * Clock Out - Completes attendance entry
   */
  clockOut: async (userId, logId, latitude, longitude) => {
    try {
      const attendancePath = PATHS.USERS.ATTENDANCE(userId)
      const docRef = doc(db, attendancePath, logId)

      await updateDoc(docRef, {
        clockOut: Timestamp.now(),
        clockOutGps: { latitude, longitude },
      })

      return true
    } catch (error) {
      console.error('Error during clock out:', error)
      throw error
    }
  },

  /**
   * Get today's attendance log for user (if exists)
   */
  getTodayLog: async (userId, siteId) => {
    try {
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const attendancePath = PATHS.USERS.ATTENDANCE(userId)
      const q = query(
        collection(db, attendancePath),
        where('siteId', '==', siteId),
        where('clockIn', '>=', Timestamp.fromDate(today))
      )

      const snapshot = await getDocs(q)
      if (!snapshot.empty) {
        const data = snapshot.docs[0].data()
        return AttendanceLog.fromFirestore(data, snapshot.docs[0].id)
      }
      return null
    } catch (error) {
      console.error('Error getting today log:', error)
      throw error
    }
  },

  /**
   * Get attendance history for user (date range)
   */
  getAttendanceHistory: async (userId, startDate, endDate) => {
    try {
      const attendancePath = PATHS.USERS.ATTENDANCE(userId)
      const q = query(
        collection(db, attendancePath),
        where('clockIn', '>=', Timestamp.fromDate(startDate)),
        where('clockIn', '<=', Timestamp.fromDate(endDate))
      )

      const snapshot = await getDocs(q)
      return snapshot.docs.map(doc => AttendanceLog.fromFirestore(doc.data(), doc.id))
    } catch (error) {
      console.error('Error getting attendance history:', error)
      throw error
    }
  },

  /**
   * Get attendance logs for entire crew (Project Head only)
   */
  getCrewAttendance: async (userIds, startDate, endDate) => {
    try {
      const allLogs = []

      for (const userId of userIds) {
        const logs = await attendanceService.getAttendanceHistory(userId, startDate, endDate)
        allLogs.push(...logs)
      }

      return allLogs
    } catch (error) {
      console.error('Error getting crew attendance:', error)
      throw error
    }
  },
}
