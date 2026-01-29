/**
 * Data Models - Defines structure for Firestore collections
 * Maps to the system architecture schema
 */

/**
 * User Profile Model
 * Path: /artifacts/crewssite/users/{userId}/profile
 */
export class UserProfile {
  constructor(data = {}) {
    this.fullName = data.fullName || ''
    this.email = data.email || ''
    this.hourlyRate = data.hourlyRate || 0 // Private: only visible to Project Head
    this.role = data.role || 'member' // 'member' or 'head'
    this.phone = data.phone || ''
    this.createdAt = data.createdAt || new Date()
  }

  toFirestore() {
    return {
      fullName: this.fullName,
      email: this.email,
      hourlyRate: this.hourlyRate,
      role: this.role,
      phone: this.phone,
      createdAt: this.createdAt,
    }
  }

  static fromFirestore(data) {
    return new UserProfile(data)
  }
}

/**
 * Site Model
 * Path: /artifacts/crewssite/public/data/sites/{siteId}
 */
export class Site {
  constructor(data = {}) {
    this.id = data.id || ''
    this.name = data.name || '' // e.g., "Cambie & Marine Siding"
    this.location = data.location || { latitude: 0, longitude: 0 } // Geopoint
    this.radius = data.radius || 200 // Allowed check-in radius in meters
    this.activeCrew = data.activeCrew || [] // Array of UIDs
    this.managerId = data.managerId || '' // UID of Project Head
    this.address = data.address || ''
    this.createdAt = data.createdAt || new Date()
  }

  toFirestore() {
    return {
      name: this.name,
      location: new window.firebase.firestore.GeoPoint(
        this.location.latitude,
        this.location.longitude
      ),
      radius: this.radius,
      activeCrew: this.activeCrew,
      managerId: this.managerId,
      address: this.address,
      createdAt: this.createdAt,
    }
  }

  static fromFirestore(data, docId) {
    return new Site({
      id: docId,
      ...data,
      location: data.location
        ? {
            latitude: data.location.latitude,
            longitude: data.location.longitude,
          }
        : { latitude: 0, longitude: 0 },
    })
  }
}

/**
 * Attendance Log Model
 * Path: /artifacts/crewssite/users/{userId}/attendance/{logId}
 */
export class AttendanceLog {
  constructor(data = {}) {
    this.id = data.id || ''
    this.siteId = data.siteId || '' // Reference to site
    this.userId = data.userId || ''
    this.clockIn = data.clockIn || null // Timestamp
    this.clockOut = data.clockOut || null // Timestamp
    this.photoUrl = data.photoUrl || '' // Verification photo link
    this.gpsMatch = data.gpsMatch !== undefined ? data.gpsMatch : true // GPS within radius
    this.clockInGps = data.clockInGps || { latitude: 0, longitude: 0 }
    this.clockOutGps = data.clockOutGps || { latitude: 0, longitude: 0 }
    this.status = data.status || 'pending' // pending, verified, out_of_range
  }

  getTotalHours() {
    if (!this.clockIn || !this.clockOut) return 0
    const ms = this.clockOut - this.clockIn.toDate?.() || this.clockOut - this.clockIn
    return ms / (1000 * 60 * 60) // Convert to hours
  }

  toFirestore() {
    return {
      siteId: this.siteId,
      userId: this.userId,
      clockIn: this.clockIn,
      clockOut: this.clockOut,
      photoUrl: this.photoUrl,
      gpsMatch: this.gpsMatch,
      clockInGps: this.clockInGps,
      clockOutGps: this.clockOutGps,
      status: this.status,
    }
  }

  static fromFirestore(data, docId) {
    return new AttendanceLog({
      id: docId,
      ...data,
    })
  }
}

/**
 * Daily Report Model
 * Path: /artifacts/crewssite/users/{userId}/reports/{reportId}
 */
export class DailyReport {
  constructor(data = {}) {
    this.id = data.id || ''
    this.userId = data.userId || ''
    this.siteId = data.siteId || ''
    this.date = data.date || new Date()
    this.hoursWorked = data.hoursWorked || 0
    this.progressMade = data.progressMade || ''
    this.materialsNeeded = data.materialsNeeded || ''
    this.issues = data.issues || []
    this.submitted = data.submitted || false
    this.submittedAt = data.submittedAt || null
  }

  toFirestore() {
    return {
      userId: this.userId,
      siteId: this.siteId,
      date: this.date,
      hoursWorked: this.hoursWorked,
      progressMade: this.progressMade,
      materialsNeeded: this.materialsNeeded,
      issues: this.issues,
      submitted: this.submitted,
      submittedAt: this.submittedAt,
    }
  }

  static fromFirestore(data, docId) {
    return new DailyReport({
      id: docId,
      ...data,
    })
  }
}

/**
 * Chat Message Model
 * Path: /artifacts/crewssite/public/data/chats/{siteId}/messages/{msgId}
 */
export class ChatMessage {
  constructor(data = {}) {
    this.id = data.id || ''
    this.siteId = data.siteId || ''
    this.senderId = data.senderId || ''
    this.senderName = data.senderName || ''
    this.text = data.text || ''
    this.timestamp = data.timestamp || new Date()
    this.type = data.type || 'text' // text, image, file
    this.attachmentUrl = data.attachmentUrl || ''
  }

  toFirestore() {
    return {
      siteId: this.siteId,
      senderId: this.senderId,
      senderName: this.senderName,
      text: this.text,
      timestamp: this.timestamp,
      type: this.type,
      attachmentUrl: this.attachmentUrl,
    }
  }

  static fromFirestore(data, docId) {
    return new ChatMessage({
      id: docId,
      ...data,
    })
  }
}

/**
 * Payroll Summary Model
 * Computed from attendance logs
 */
export class PayrollSummary {
  constructor(data = {}) {
    this.userId = data.userId || ''
    this.userName = data.userName || ''
    this.hourlyRate = data.hourlyRate || 0
    this.startDate = data.startDate || null
    this.endDate = data.endDate || null
    this.entries = data.entries || [] // Array of {site, date, hours, subtotal}
  }

  getTotalHours() {
    return this.entries.reduce((sum, entry) => sum + (entry.hours || 0), 0)
  }

  getTotalPay() {
    return this.getTotalHours() * this.hourlyRate
  }

  toJSON() {
    return {
      userId: this.userId,
      userName: this.userName,
      hourlyRate: this.hourlyRate,
      startDate: this.startDate,
      endDate: this.endDate,
      totalHours: this.getTotalHours(),
      totalPay: this.getTotalPay(),
      entries: this.entries,
    }
  }
}
