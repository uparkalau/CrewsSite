# CrewsSite Services Architecture Documentation

## Overview
All service modules are located in `src/services/` and follow a consistent pattern:
- **Single Responsibility**: Each service handles one domain (Auth, Attendance, Reports, etc.)
- **Firebase Integration**: All services use Firestore for data persistence
- **Error Handling**: Try-catch blocks with descriptive error messages
- **Type Safety**: Return objects matching data models from `src/models/dataModels.js`

## Service Modules

### 1. **authService.js** - User Authentication & Profiles (Module A)
**Responsibility**: User account management, role checking, profile operations

**Functions**:
- `createUserProfile(userId, email, fullName, role)` - Create new user profile
  - Path: `/artifacts/crewssite/users/{userId}/profile`
  - Returns: UserProfile object
  
- `getUserProfile(userId)` - Retrieve user profile
  - Returns: UserProfile with hourlyRate (encrypted), role, contact info
  
- `updateUserProfile(userId, updates)` - Update profile fields
  - Allows: phone, hourlyRate (admin only in production)
  - Returns: Updated UserProfile
  
- `checkUserRole(userId)` - Determine user role for routing
  - Returns: `{role: 'member' | 'head', profile: UserProfile}`
  - **Usage**: In Dashboard.jsx to route Team Members vs Project Heads

**Integration Example**:
```jsx
import { authService } from '../services/authService'

const handleLogin = async (userId) => {
  const { role, profile } = await authService.checkUserRole(userId)
  if (role === 'head') {
    navigate('/admin/dashboard')
  } else {
    navigate('/member/clock-in')
  }
}
```

---

### 2. **attendanceService.js** - Geo-Fenced Attendance (Module B)
**Responsibility**: Clock in/out with GPS validation, attendance history

**Key Algorithm**: 
- **Haversine Formula** calculates accurate distance between two GPS points
- Distance compared against site radius (default 200m)
- If `distance > radius`: status = 'out_of_range' (flagged for review)

**Functions**:
- `clockIn(userId, siteId, lat, lon, photoUrl, siteLocation, radius)`
  - Validates: GPS within site radius using Haversine
  - Stores: Clock-in time, photo, GPS coordinates, gpsMatch boolean
  - Returns: `{id, gpsMatch: true|false, distance: meters}`
  - Path: `/artifacts/crewssite/users/{userId}/attendance/{logId}`
  
- `clockOut(userId, logId, lat, lon)`
  - Updates: Existing log with clock-out time and GPS
  - Calculates: Total hours worked
  - Returns: Updated AttendanceLog
  
- `getTodayLog(userId, siteId)`
  - Returns: Active clock-in log for today (null if clocked out)
  
- `getAttendanceHistory(userId, startDate, endDate)`
  - Returns: Array of AttendanceLog objects for date range
  
- `getCrewAttendance(userIds[], startDate, endDate)`
  - Returns: Aggregated attendance for all crew members
  - **Usage**: Project Head payroll calculations

**Integration Example**:
```jsx
import { attendanceService } from '../services/attendanceService'

const handleClockIn = async () => {
  // Get device GPS
  navigator.geolocation.getCurrentPosition(async (position) => {
    const { latitude, longitude } = position.coords
    
    // Capture photo with camera API
    const photoUrl = await capturePhoto()
    
    // Clock in with validation
    const result = await attendanceService.clockIn(
      userId,
      siteId,
      latitude,
      longitude,
      photoUrl,
      site.location,  // GeoPoint from firestore
      site.radius     // Default 200m
    )
    
    if (!result.gpsMatch) {
      showWarning(`You are ${result.distance}m outside the site boundary!`)
    }
  })
}
```

---

### 3. **reportService.js** - Daily Work Reports (Module C)
**Responsibility**: Daily report submission, validation, crew aggregation

**Features**:
- Mandatory report submission at end of shift
- Missing report detection (after 6 PM / 18:00)
- Crew-level aggregation for Project Head review

**Functions**:
- `submitReport(userId, siteId, reportData)`
  - Creates: Daily report with work summary
  - reportData: `{hoursWorked, progressMade, materialsNeeded, issues[]}`
  - Returns: Report with submittedAt timestamp
  - Path: `/artifacts/crewssite/users/{userId}/reports/{reportId}`
  
- `getTodayReport(userId, siteId)`
  - Returns: Report submitted today (null if none)
  
- `getReportHistory(userId, startDate, endDate)`
  - Returns: Array of DailyReport objects
  
- `getSiteReportsForCrew(userIds[], siteId, startDate, endDate)`
  - Returns: All reports from crew at specific site
  - **Usage**: Project Head review dashboard
  
- `checkMissingReport(userId, siteId)`
  - Returns: true if after 6 PM AND no report submitted today
  - **Usage**: Trigger notification/alert

**Integration Example**:
```jsx
import { reportService, chatService } from '../services'

const handleClockOut = async (logId) => {
  // Clock out
  await attendanceService.clockOut(userId, logId, lat, lon)
  
  // Check if report needed
  const isMissing = await reportService.checkMissingReport(userId, siteId)
  if (isMissing) {
    // Redirect to report form
    navigate('/report-form')
  } else {
    showSuccess('Clocked out successfully')
  }
}

// Report submission
const submitDailyReport = async (reportData) => {
  await reportService.submitReport(userId, siteId, reportData)
  await chatService.sendMessage(
    siteId,
    'system',
    'CrewsSite',
    `${userName} submitted daily report`,
    'message'
  )
  navigate('/dashboard')
}
```

---

### 4. **payrollService.js** - Payroll Calculations (Module D - Project Head Only)
**Responsibility**: Payroll calculations, export to Excel/CSV

**Key Feature**: 
- Calculates hourly pay based on verified attendance logs
- Out-of-range GPS entries flagged for manual review
- Supports multiple export formats

**Functions**:
- `calculatePayroll(userIds[], startDate, endDate)`
  - Returns: Array of payroll entries per user
  - Each entry includes: hours, hourly rate, total pay, site breakdown
  - Validates: Only verified (gpsMatch=true) logs included
  
- `exportToCSV(payrollData, periodLabel)`
  - Creates: CSV file with payroll summary
  - Includes: Employee name, hours, rate, subtotal by date/site
  - Action: Auto-downloads file to device
  
- `exportToExcel(payrollData, periodLabel)`
  - Creates: Excel workbook with 2 sheets (Summary + Details)
  - Uses: SheetJS library if available, falls back to CSV
  
- `getPayrollSummary(payrollData)`
  - Returns: Aggregated totals (total people, hours, payroll amount)

**Integration Example**:
```jsx
import { payrollService, attendanceService, authService } from '../services'

const generatePayroll = async (startDate, endDate) => {
  // Get site crew
  const crew = await siteService.getCrewForSite(siteId)
  const userIds = crew.map(m => m.userId)
  
  // Calculate payroll
  const payroll = await payrollService.calculatePayroll(
    userIds,
    startDate,
    endDate
  )
  
  // Display summary
  const summary = payrollService.getPayrollSummary(payroll)
  console.log(`Total Payroll: $${summary.totalPayroll.toFixed(2)}`)
  
  // Export
  await payrollService.exportToExcel(payroll, 'Oct 21 - Nov 3')
}
```

---

### 5. **chatService.js** - Site Crew Communication
**Responsibility**: Real-time and stored messaging between crew and project heads

**Features**:
- Real-time message updates with Firestore listeners
- Message types: normal, alerts, attachments (photos)
- System alerts for missing reports, attendance issues

**Functions**:
- `sendMessage(siteId, userId, senderName, text, type, attachmentUrl)`
  - Creates: Message in site chat
  - Returns: Message with auto-generated ID and timestamp
  - Path: `/artifacts/crewssite/public/data/chats/{siteId}/{msgId}`
  
- `getMessages(siteId, limitCount=50)`
  - Returns: Last N messages from site chat (chronological)
  
- `subscribeToChat(siteId, onMessageAdded)`
  - Sets up: Real-time listener for new messages
  - Returns: Unsubscribe function to stop listening
  
- `getMessageHistory(siteId, startDate, endDate)`
  - Returns: All messages in date range
  
- `sendAlert(siteId, alertMessage)`
  - Sends: System alert to crew
  - **Usage**: Missing report notifications, emergency alerts

**Integration Example**:
```jsx
import { chatService } from '../services/chatService'

// Real-time chat listener
useEffect(() => {
  const unsubscribe = chatService.subscribeToChat(siteId, (message) => {
    setMessages(prev => [...prev, message])
  })
  
  return unsubscribe // Cleanup on unmount
}, [siteId])

// Send message
const handleSendMessage = async (text) => {
  await chatService.sendMessage(siteId, userId, userName, text)
}

// Auto-alert for missing reports (in service worker or backend)
if (time > 18:00 && missingReport) {
  await chatService.sendAlert(siteId, `${userName} missing daily report`)
}
```

---

### 6. **siteService.js** - Site Management (Project Head Only)
**Responsibility**: Site CRUD operations, crew assignment, geofence management

**Functions**:
- `createSite(managerId, siteName, lat, lon, radius=200)`
  - Creates: New construction site with geofence
  - Validates: User is Project Head
  - Returns: Site object with auto-generated ID
  
- `getSite(siteId)`
  - Returns: Site details including crew list
  
- `getSitesByManager(managerId)`
  - Returns: All sites managed by Project Head
  
- `updateSite(siteId, updates)`
  - Updates: Site name, location, radius
  - Returns: Updated site object
  
- `addCrewMember(siteId, userId)`
  - Adds: Team member to active crew
  
- `removeCrewMember(siteId, userId)`
  - Removes: Team member from active crew
  
- `getCrewForSite(siteId)`
  - Returns: Array of full crew profiles (names, IDs, hourly rates)
  
- `updateGeofence(siteId, newRadius)`
  - Updates: GPS radius for attendance validation
  - Returns: Updated site

**Integration Example**:
```jsx
import { siteService } from '../services/siteService'

// Create new site
const createNewSite = async (siteName, lat, lon) => {
  const site = await siteService.createSite(managerId, siteName, lat, lon)
  showSuccess(`Site "${siteName}" created`)
}

// Manage crew
const addWorkerToSite = async (siteId, workerId) => {
  await siteService.addCrewMember(siteId, workerId)
  const crew = await siteService.getCrewForSite(siteId)
  setCrew(crew)
}
```

---

## Firestore Collection Paths Reference

```
/artifacts/crewssite/
  ├── public/
  │   ├── data/
  │   │   ├── sites/ ............... Site definitions (geofence, crew)
  │   │   ├── chats/
  │   │   │   └── {siteId}/ ......... Messages per site
  │   │   └── announcements/ ........ Global notifications
  │   └── metadata/ ................ App configuration
  │
  └── users/
      └── {userId}/
          ├── profile/ ............. User account (email, role, hourlyRate)
          ├── attendance/ ........... Clock-in/out logs
          ├── reports/ ............. Daily work reports
          └── settings/ ............ User preferences
```

---

## Firebase Configuration Requirements

Create `.env.local` file in project root:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

All services automatically read from `src/config/firebase.js` which loads these environment variables.

---

## Usage Patterns

### In React Components

```jsx
// Option 1: Import individual services
import { authService, attendanceService } from '../services/authService'

// Option 2: Import all at once (recommended)
import { authService, attendanceService, reportService } from '../services'

// Async operations
useEffect(() => {
  const loadData = async () => {
    try {
      const data = await authService.getUserProfile(userId)
      setData(data)
    } catch (error) {
      console.error('Load failed:', error)
      setError(error.message)
    }
  }
  
  loadData()
}, [userId])
```

### Error Handling

```jsx
try {
  const result = await attendanceService.clockIn(...)
  if (!result.gpsMatch) {
    setWarning(`Outside geofence by ${result.distance}m`)
  }
} catch (error) {
  if (error.code === 'permission-denied') {
    setError('You do not have permission to clock in')
  } else {
    setError(error.message)
  }
}
```

---

## Next Steps: Component Integration

### For Team Members (Mobile):
1. **ClockIn.jsx** - Uses: attendanceService.clockIn()
2. **DailyReport.jsx** - Uses: reportService.submitReport()
3. **AttendanceHistory.jsx** - Uses: attendanceService.getAttendanceHistory()

### For Project Heads (Desktop):
1. **AdminDashboard.jsx** - Uses: siteService.getSitesByManager()
2. **CrewManagement.jsx** - Uses: siteService.addCrewMember(), removeCrewMember()
3. **PayrollDashboard.jsx** - Uses: payrollService.calculatePayroll(), exportToExcel()
4. **SiteReports.jsx** - Uses: reportService.getSiteReportsForCrew()

All services are ready for integration. Start with Team Member features (ClockIn.jsx).
