# CrewsSite Coding Standards & Best Practices

## Table of Contents
1. [Variable Naming Conventions](#variable-naming-conventions)
2. [Code Organization](#code-organization)
3. [Documentation Standards](#documentation-standards)
4. [Error Handling](#error-handling)
5. [React Patterns](#react-patterns)
6. [Firebase Integration](#firebase-integration)
7. [Testing Guidelines](#testing-guidelines)

---

## Variable Naming Conventions

### ✅ DO:
- **camelCase** for variables, functions, methods
  ```javascript
  const userId = '123'
  const calculateHoursWorked = () => {}
  const userProfile = {}
  ```

- **PascalCase** for classes and components
  ```javascript
  class UserProfile { }
  function DashboardPage() { }
  class AttendanceLog { }
  ```

- **UPPER_SNAKE_CASE** for constants
  ```javascript
  const DEFAULT_RADIUS_METERS = 200
  const DEADLINE_HOUR = 18
  const USER_ROLES = { MEMBER: 'member', HEAD: 'head' }
  ```

- **Descriptive names** in English
  ```javascript
  // Good
  const calculateGpsDistance = (lat1, lat2, lon1, lon2) => {}
  const isLocationWithinGeofence = () => {}
  
  // Bad
  const calcDist = () => {}
  const withinFence = () => {}
  ```

### ❌ DON'T:
- Single-letter variables (except loop iterators)
  ```javascript
  // Bad
  const u = user
  const p = profile
  
  // Good
  for (let i = 0; i < array.length; i++) { }
  ```

- Greek symbols (φ, Δ, λ, etc.)
  ```javascript
  // Bad
  const φ1 = (lat * Math.PI) / 180
  
  // Good
  const lat1Radians = toRadians(lat)
  ```

- Abbreviated names
  ```javascript
  // Bad
  const getUsr = () => {}
  const updProf = () => {}
  
  // Good
  const getUserProfile = () => {}
  const updateUserProfile = () => {}
  ```

---

## Code Organization

### Service Layer Structure
```javascript
/**
 * Service description
 * What this service does
 */

import { dependencies } from 'paths'

/**
 * Data model class (if applicable)
 */
class DataModel {
  constructor(data) { }
  
  toFirestore() { }
  
  static fromFirestore(data, id) { }
}

/**
 * Service export with functions
 */
export const serviceName = {
  /**
   * Function with JSDoc
   */
  functionName: async (params) => {
    try {
      // Logic
      return result
    } catch (error) {
      console.error('Context:', error.message)
      throw error
    }
  },
}

export default serviceName
```

### File Organization
```
src/
├── config/          # Configuration files
├── constants/       # Application constants
├── utils/          # Utility functions
├── hooks/          # React custom hooks
├── services/       # Business logic services
├── components/     # React components
├── pages/          # Page components
├── models/         # Data models (if needed)
└── context/        # React context providers
```

---

## Documentation Standards

### JSDoc Format
Every function should have JSDoc comments:

```javascript
/**
 * Brief, one-line description of what function does
 * 
 * Optional longer description explaining the function's purpose,
 * behavior, and any important implementation details.
 * 
 * @param {type} paramName - Description of parameter
 * @param {string} userId - The user's unique identifier
 * @param {number} latitude - Latitude in degrees (-90 to 90)
 * @param {object} options - Configuration object with optional properties
 * @param {boolean} options.enableHighAccuracy - Use high accuracy mode
 * 
 * @returns {type} Description of return value
 * @returns {Promise<object>} User profile with all data
 * @returns {boolean} True if operation succeeded
 * 
 * @throws {Error} Description of error condition
 * @throws {ValidationError} If email format is invalid
 * 
 * @example
 * const hours = calculateHoursWorked(startTime, endTime)
 * console.log(hours) // 8.5
 */
export function functionName(param1, param2) {
  // Implementation
}
```

### Data Model Documentation
```javascript
/**
 * Data model for [entity]
 * Handles conversion to/from Firestore
 */
class UserProfile {
  /**
   * @param {object} data - Object with properties
   * @param {string} data.uid - User unique ID
   * @param {string} data.email - User email
   */
  constructor(data) {
    this.uid = data.uid
    this.email = data.email
  }

  /**
   * Convert to Firestore document format
   * @returns {object} Firestore-compatible object
   */
  toFirestore() {
    return {
      uid: this.uid,
      email: this.email,
    }
  }

  /**
   * Create instance from Firestore data
   * @param {object} data - Firestore document data
   * @param {string} documentId - Firestore document ID
   * @returns {UserProfile} Instance with all properties
   */
  static fromFirestore(data, documentId) {
    return new UserProfile({
      ...data,
      uid: documentId,
    })
  }
}
```

---

## Error Handling

### Try-Catch Pattern
```javascript
export const myService = {
  riskyOperation: async (params) => {
    try {
      // Validate inputs
      if (!params) throw new Error('Parameters required')
      
      // Perform operation
      const result = await firebaseDb.collection('...').doc('...').get()
      
      // Verify result
      if (!result.exists) throw new Error('Document not found')
      
      return result.data()
    } catch (error) {
      // Log with context
      console.error('Error in riskyOperation:', error.message)
      
      // Re-throw for caller to handle
      throw error
    }
  },
}
```

### Error Messages
```javascript
// Good error messages
throw new Error('User profile not found for userId: ' + userId)
throw new Error('Invalid email format: ' + email)
throw new Error('Hourly rate must be between $15 and $200')

// Bad error messages
throw new Error('Error')
throw new Error('Failed')
throw new Error('Something went wrong')
```

---

## React Patterns

### Functional Components Only
```javascript
/**
 * Brief description
 * @param {object} props - Component props
 * @param {string} props.userId - User identifier
 * @returns {JSX.Element}
 */
export function UserProfile({ userId }) {
  const [userData, setUserData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // Fetch user on mount
  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true)
      try {
        const data = await authService.getUserProfile(userId)
        setUserData(data)
        setError(null)
      } catch (err) {
        console.error('Failed to fetch user:', err)
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUser()
  }, [userId])

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  
  return (
    <div>
      <h1>{userData?.fullName}</h1>
      <p>{userData?.email}</p>
    </div>
  )
}
```

### Hooks with Cleanup
```javascript
// Always return cleanup function from useEffect
useEffect(() => {
  const unsubscribe = firebaseDb.onSnapshot(...)
  
  return () => {
    // Cleanup: unsubscribe from listeners
    unsubscribe()
  }
}, [dependencies])

// Prevent memory leaks with proper cleanup
useEffect(() => {
  let isMounted = true
  
  const fetchData = async () => {
    const data = await api.get()
    if (isMounted) {
      setData(data)
    }
  }
  
  fetchData()
  
  return () => {
    isMounted = false
  }
}, [])
```

### Custom Hooks Pattern
```javascript
/**
 * Custom hook for reusable logic
 * @param {object} config - Configuration
 * @returns {object} Hook state and functions
 */
export function useCustomFeature(config) {
  const [state, setState] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const performAction = useCallback(async () => {
    setIsLoading(true)
    try {
      const result = await api.call(config)
      setState(result)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }, [config])

  useEffect(() => {
    performAction()
  }, [performAction])

  return { state, isLoading, error, performAction }
}
```

---

## Firebase Integration

### Module Imports
```javascript
// ✅ Modular imports (preferred)
import { collection, addDoc, query, where } from 'firebase/firestore'
import { firebaseDb } from '../config/firebase'

// ❌ Avoid importing entire module
// import * as firebase from 'firebase/app'
```

### Path Constants
```javascript
// ✅ Use constants, never magic strings
import { USER_PATHS } from '../constants/firebasePaths'
const profilePath = USER_PATHS.PROFILE(userId)

// ❌ Never hardcode paths
// const profilePath = `artifacts/crewssite/users/${userId}/profile`
```

### Data Models with Converters
```javascript
// ✅ Always use converters for type safety
const userRef = doc(firebaseDb, USER_PATHS.PROFILE(userId))
const userData = await getDoc(userRef)
const userProfile = UserProfile.fromFirestore(userData.data(), userData.id)

// ❌ Don't mix raw data and objects
// const user = userData.data() // Raw, untyped
```

### Timestamp Handling
```javascript
// ✅ Use Firebase Timestamps
import { Timestamp } from 'firebase/firestore'

const clockIn = Timestamp.now()
const attendanceLog = {
  clockIn,
  clockOut: null,
}

// Convert for display
const clockInDate = clockIn.toDate() // JavaScript Date object
const dateString = clockInDate.toLocaleDateString()

// ❌ Don't use raw Date objects
// const clockIn = new Date() // Will fail in Firestore
```

---

## Testing Guidelines

### Unit Test Structure
```javascript
describe('functionName', () => {
  it('should do X when given valid input', () => {
    // Arrange
    const input = { userId: '123' }
    const expected = { success: true }
    
    // Act
    const result = functionName(input)
    
    // Assert
    expect(result).toEqual(expected)
  })

  it('should throw error when given invalid input', () => {
    // Arrange
    const input = null
    
    // Act & Assert
    expect(() => functionName(input)).toThrow('Input required')
  })
})
```

### Async Testing
```javascript
describe('asyncFunction', () => {
  it('should return user profile', async () => {
    // Mock Firebase
    jest.mock('../config/firebase')
    
    // Act
    const result = await authService.getUserProfile('123')
    
    // Assert
    expect(result.uid).toBe('123')
  })
})
```

---

## Common Patterns

### Optional Chaining & Nullish Coalescing
```javascript
// ✅ Safe navigation
const email = user?.profile?.email ?? 'unknown@example.com'
const name = user?.name || 'Guest'

// ❌ Unsafe
// const email = user.profile.email
```

### Destructuring
```javascript
// ✅ Cleaner code
const { userId, siteId, latitude, longitude } = props
const { email, fullName } = userProfile

// ❌ Verbose
const userId = props.userId
const siteId = props.siteId
```

### Template Literals
```javascript
// ✅ Readable
const message = `Error for user ${userId}: ${error.message}`
const path = `${FIREBASE_ROOT}/users/${userId}/profile`

// ❌ String concatenation
// const message = 'Error for user ' + userId + ': ' + error.message
```

---

## Code Review Checklist

- [ ] All variables follow naming conventions (camelCase, PascalCase, UPPER_SNAKE_CASE)
- [ ] All functions have JSDoc comments with @param, @returns, @throws
- [ ] Error handling with try-catch and descriptive messages
- [ ] No Greek symbols or abbreviated names
- [ ] No hardcoded values (use constants)
- [ ] React components are functional (no class components)
- [ ] useEffect has cleanup function if needed
- [ ] Dependencies array is correct in hooks
- [ ] Firebase imports are modular
- [ ] Data models use to/fromFirestore converters
- [ ] No console.log in production code
- [ ] Code passes ESLint
- [ ] Build succeeds without errors
- [ ] No breaking changes from previous version

---

## References

- [React Hooks Documentation](https://react.dev/reference/react/hooks)
- [Firebase Web SDK](https://firebase.google.com/docs/web)
- [JSDoc Reference](https://jsdoc.app/)
- [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- [Google JavaScript Style Guide](https://google.github.io/styleguide/jsguide.html)

---

**Last Updated:** January 29, 2025  
**Version:** 1.0.0
