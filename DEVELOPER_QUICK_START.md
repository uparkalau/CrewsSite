# CrewsSite Developer Quick Start Guide

## Quick Setup (5 minutes)

### 1. Clone & Install
```bash
git clone https://github.com/uparkalau/CrewsSite.git
cd CrewsSite
npm install
```

### 2. Environment Setup
```bash
# Copy environment template
cp .env.local.example .env.local

# Edit with your Firebase credentials
nano .env.local
```

### 3. Start Development
```bash
npm run dev
# Server runs on http://localhost:5173
```

---

## Project Architecture

### Layer Structure
```
Services (Business Logic)
    ↓
Utilities & Hooks (Reusable Logic)
    ↓
Components (UI Rendering)
    ↓
Firebase (Data Persistence)
```

### Service Layer
- **attendanceService** - GPS-verified clock in/out
- **authService** - User authentication & profiles
- **payrollService** - Payroll calculations & export
- **reportService** - Daily work reports
- **chatService** - Real-time messaging
- **siteService** - Site management

### Utilities
- **gpsUtils** - GPS calculations (Haversine formula)
- **dateTimeUtils** - Vancouver timezone handling
- **validationUtils** - Form validation

### Hooks
- **useGeolocation** - Device location
- **useFormSubmit** - Web3Forms integration
- **useMenuToggle** - Menu state

---

## Common Tasks

### Get Current User Profile
```javascript
import { authService } from '../services/authService'

// Get logged-in user's profile
const currentUser = authService.getCurrentUser()
if (currentUser) {
  const profile = await authService.getUserProfile(currentUser.uid)
  console.log(profile.fullName, profile.role)
}
```

### Clock In with GPS
```javascript
import { attendanceService } from '../services/attendanceService'
import { useGeolocation } from '../hooks/useGeolocation'

export function ClockInButton() {
  const { getCurrentLocation } = useGeolocation()

  const handleClockIn = async () => {
    try {
      const location = await getCurrentLocation()
      
      const result = await attendanceService.clockIn(
        userId,
        siteId,
        location.latitude,
        location.longitude,
        photoUrl,
        { latitude: 49.2827, longitude: -123.1207 },
        200 // radius in meters
      )
      
      if (result.gpsMatch) {
        console.log('Clocked in successfully')
      } else {
        console.warn('Outside geofence:', result.distance, 'meters')
      }
    } catch (error) {
      console.error('Clock in failed:', error.message)
    }
  }

  return <button onClick={handleClockIn}>Clock In</button>
}
```

### Calculate Payroll
```javascript
import { payrollService } from '../services/payrollService'

const crewIds = ['user1', 'user2', 'user3']
const startDate = new Date('2025-01-01')
const endDate = new Date('2025-01-31')

const payrollEntries = await payrollService.calculateCrewPayroll(
  crewIds,
  startDate,
  endDate
)

// Export to Excel
payrollService.exportPayrollToExcel(payrollEntries, 'jan_2025_payroll.xlsx')

// Or CSV
payrollService.exportPayrollToCSV(payrollEntries, 'jan_2025_payroll.csv')
```

### Validate Form Input
```javascript
import { validateEmail, validatePassword, validateRequired } from '../utils/validationUtils'

const emailResult = validateEmail('user@example.com')
if (!emailResult.isValid) {
  console.error(emailResult.error) // "Invalid email format"
}

const pwdResult = validatePassword('SecurePassword123')
if (!pwdResult.isValid) {
  console.error(pwdResult.error) // Password validation error
}

const requiredResult = validateRequired(formValue, 'Full Name')
if (!requiredResult.isValid) {
  console.error(requiredResult.error) // "Full Name is required"
}
```

### Check GPS Geofence
```javascript
import { isLocationWithinGeofence } from '../utils/gpsUtils'

const result = isLocationWithinGeofence(
  userLatitude,
  userLongitude,
  siteLatitude,
  siteLongitude,
  200 // 200 meters
)

console.log(result)
// {
//   isWithinRadius: true,
//   distance: 150.5,
//   radiusMeters: 200
// }
```

### Get Vancouver Time
```javascript
import {
  getCurrentTimeVancouver,
  isPassedDailyReportDeadline
} from '../utils/dateTimeUtils'

const timeInVancouver = getCurrentTimeVancouver()
console.log(timeInVancouver) // "1/29/2025, 3:45:30 PM"

const isPastDeadline = isPassedDailyReportDeadline()
if (isPastDeadline) {
  console.log('Daily report deadline has passed (6 PM PT)')
}
```

### Get Attendance History
```javascript
import { attendanceService } from '../services/attendanceService'

const startDate = new Date('2025-01-01')
const endDate = new Date('2025-01-31')

const history = await attendanceService.getAttendanceHistory(
  userId,
  startDate,
  endDate
)

history.forEach(log => {
  console.log(`${log.date.toLocaleDateString()}: ${log.status}`)
})
```

---

## Code Examples by Use Case

### Authentication Flow
```javascript
// 1. Register new user
const newUser = await authService.registerUser(
  'user@example.com',
  'SecurePassword123',
  'John Doe',
  'member' // or 'head'
)

// 2. Login
const user = await authService.loginUser('user@example.com', 'SecurePassword123')

// 3. Update profile
await authService.updateUserProfile(userId, {
  phoneNumber: '604-555-1234',
  hourlyRate: 25
})

// 4. Logout
await authService.logoutUser()
```

### Real-time Report Checking
```javascript
import { isPassedDailyReportDeadline } from '../utils/dateTimeUtils'

setInterval(() => {
  if (isPassedDailyReportDeadline()) {
    // Show reminder to submit daily report
    showNotification('📝 Daily report due at 6 PM PT')
  }
}, 60000) // Check every minute
```

### Crew Attendance Dashboard
```javascript
const crewIds = ['user1', 'user2', 'user3']
const today = new Date()
today.setHours(0, 0, 0, 0)

const tomorrow = new Date(today)
tomorrow.setDate(tomorrow.getDate() + 1)

const todayAttendance = await attendanceService.getCrewAttendance(
  crewIds,
  today,
  tomorrow
)

const clockedInCount = todayAttendance.filter(log => log.status === 'verified').length
console.log(`${clockedInCount}/${crewIds.length} team members clocked in`)
```

---

## Debugging Tips

### Enable Verbose Logging
```javascript
// In any service file
const DEBUG = true

if (DEBUG) {
  console.log('Starting operation:', { userId, siteId })
}
```

### Check Firebase Connection
```javascript
import { firebaseDb } from '../config/firebase'

try {
  const doc = await getDoc(collection(firebaseDb, 'artifacts/crewssite'))
  console.log('✅ Firebase connected')
} catch (error) {
  console.error('❌ Firebase connection failed:', error)
}
```

### Inspect Data Models
```javascript
import { AttendanceLog } from '../services/attendanceService'

const log = new AttendanceLog(rawData)
console.log('Firestore format:', log.toFirestore())
console.log('Instance:', log)
```

### React DevTools
- Install React DevTools extension
- Inspect component props and state
- Use Profiler tab to track re-renders

---

## File Locations Reference

| Task | File |
|------|------|
| Firebase config | `src/config/firebase.js` |
| Constants | `src/constants/appConstants.js` |
| Firestore paths | `src/constants/firebasePaths.js` |
| GPS calculations | `src/utils/gpsUtils.js` |
| Date helpers | `src/utils/dateTimeUtils.js` |
| Validation | `src/utils/validationUtils.js` |
| Geolocation hook | `src/hooks/useGeolocation.js` |
| Clock in/out | `src/services/attendanceService.js` |
| Auth | `src/services/authService.js` |
| Payroll | `src/services/payrollService.js` |
| Reports | `src/services/reportService.js` |
| Chat | `src/services/chatService.js` |
| Sites | `src/services/siteService.js` |

---

## Common Errors & Solutions

### "Firebase config is not initialized"
```
Solution: Check .env.local has all VITE_FIREBASE_* variables
```

### "User profile not found"
```
Solution: User must exist in Firestore at artifacts/crewssite/users/{uid}/profile
```

### "Cannot read property of undefined"
```
Solution: Use optional chaining (user?.profile?.email) to safely access nested properties
```

### "GPS not available"
```
Solution: 
1. Site must have HTTPS (localhost is OK for dev)
2. User must grant location permission
3. Browser must support Geolocation API
```

### ESLint errors
```bash
# Fix automatically
npm run lint -- --fix

# Or manually review
npm run lint
```

---

## Build & Deployment

### Local Development
```bash
npm run dev          # Start with HMR
npm run lint         # Check code quality
npm run build        # Production build
npm run preview      # Test production build
```

### Production Deployment
```bash
# Build
npm run build

# Test build
npm run preview

# Deploy to Vercel
git push origin master
# Vercel auto-deploys on push
```

### Environment Variables
Required in `.env.local`:
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_WEB3FORMS_ACCESS_KEY`

---

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/my-feature

# Make changes
git add .
git commit -m "feat: Add my feature"

# Push to remote
git push origin feature/my-feature

# Create Pull Request on GitHub
```

### Commit Message Format
```
feat: Add new feature
fix: Fix bug in component
refactor: Restructure code
docs: Update documentation
style: Fix code formatting
test: Add unit tests
chore: Update dependencies
```

---

## Performance Tips

1. **Memoize callbacks**
   ```javascript
   const handleClick = useCallback(() => { }, [deps])
   ```

2. **Use dependency arrays**
   ```javascript
   useEffect(() => { }, [dependency]) // Not []
   ```

3. **Lazy load components**
   ```javascript
   const Dashboard = lazy(() => import('./Dashboard'))
   ```

4. **Optimize re-renders**
   ```javascript
   const config = useMemo(() => ({ }), [deps])
   ```

---

## Resources

- [React Documentation](https://react.dev)
- [Vite Guide](https://vite.dev)
- [Firebase Web SDK](https://firebase.google.com/docs/web)
- [Tailwind CSS](https://tailwindcss.com)
- [Project Standards](./CODING_STANDARDS.md)

---

**Last Updated:** January 29, 2025  
**For Questions:** Check CODING_STANDARDS.md or IMPLEMENTATION_SUMMARY.md
