# CrewsSite - Feature Development Guide

## 📂 Project Structure After Refactoring

```
src/
├── components/          # Landing page components
│   ├── Navigation.jsx
│   ├── Hero.jsx
│   ├── Features.jsx
│   ├── Payroll.jsx
│   ├── Apps.jsx
│   └── Footer.jsx
├── pages/               # App pages (authenticated)
│   ├── Login.jsx        # User login
│   ├── Signup.jsx       # User registration
│   └── Dashboard.jsx    # Main dashboard
├── context/             # React context
│   └── AuthContext.jsx  # Authentication state
├── services/            # Backend integration
│   └── firebase.js      # Firebase & API calls
├── hooks/               # Custom React hooks
│   └── useCustom.js
├── constants/           # App configuration
│   └── config.js
├── utils/               # Utility functions
│   └── router.js        # Simple routing
└── App.jsx              # Main app with routing
```

## 🚀 Current Features Ready to Implement

### 1. Authentication (Pages Created ✅)
- [x] Login page (`/login`)
- [x] Signup page (`/signup`)
- [x] AuthContext with login/logout/signup
- [ ] Firebase integration
- [ ] Password reset
- [ ] Social auth (optional)

**Next Step:** Connect Firebase Authentication

```bash
# In src/services/firebase.js, uncomment Firebase code and add config
```

### 2. Dashboard (Page Created ✅)
- [x] Dashboard layout (`/dashboard`)
- [x] Quick action cards
- [ ] Real-time notifications
- [ ] User profile settings
- [ ] Sidebar navigation

### 3. Time Tracking (Ready to Build)
- [ ] Clock in/out page
- [ ] Geolocation capture
- [ ] Photo verification
- [ ] View timesheets
- [ ] Timesheet history

**File to create:** `src/pages/ClockIn.jsx`

### 4. Daily Reports (Ready to Build)
- [ ] Report submission form
- [ ] Photo upload
- [ ] Work summary
- [ ] Issue reporting
- [ ] Report history

**File to create:** `src/pages/DailyReport.jsx`

### 5. Payroll (Partial - Service Exists ✅)
- [x] Payroll calculation service
- [x] Export to CSV service
- [ ] Payroll view page
- [ ] Historical data
- [ ] Export functionality

**File to create:** `src/pages/Payroll.jsx`

### 6. Chat/Messaging (Not Started)
- [ ] Chat page
- [ ] List conversations
- [ ] Real-time messaging
- [ ] Group chats
- [ ] Notifications

**Files to create:**
- `src/pages/Messages.jsx`
- `src/services/messaging.js`

## 🔧 Configuration - What You Need Now

### Environment Variables
Create `.env.local` with Firebase credentials:

```
VITE_FIREBASE_API_KEY=xxxxx
VITE_FIREBASE_AUTH_DOMAIN=xxxxx
VITE_FIREBASE_PROJECT_ID=xxxxx
VITE_FIREBASE_STORAGE_BUCKET=xxxxx
VITE_FIREBASE_MESSAGING_SENDER_ID=xxxxx
VITE_FIREBASE_APP_ID=xxxxx
```

### Firebase Setup
1. Create Firebase project: https://console.firebase.google.com
2. Enable Authentication (Email/Password)
3. Create Firestore database (Start in test mode)
4. Copy credentials to `.env.local`
5. Uncomment Firebase code in `src/services/firebase.js`

## 📋 Recommended Development Order

### Phase 1: Authentication ⭐ START HERE
1. Set up Firebase project
2. Uncomment Firebase code in `src/services/firebase.js`
3. Test login/signup flow
4. Add error handling and validation
5. Deploy to Vercel

### Phase 2: Dashboard & Navigation
1. Add sidebar navigation
2. Create main layout component
3. Add user profile page
4. Add settings page

### Phase 3: Time Tracking
1. Create clock in/out page
2. Integrate geolocation API
3. Add camera for photos
4. Store in Firestore
5. Create timesheet view

### Phase 4: Daily Reports
1. Create report form
2. Add photo upload to Firebase Storage
3. Save report to Firestore
4. Create report history
5. Add report viewing

### Phase 5: Payroll
1. Create payroll view page
2. Connect to Firebase data
3. Display earnings breakdown
4. Add export to CSV
5. Add filters by date/site

### Phase 6: Messaging
1. Create messages page
2. Set up Firestore collection for chats
3. Real-time message sync
4. Create group chat feature
5. Add notifications

## 🛠️ Development Tips

### Adding a New Page

1. Create file in `src/pages/MyPage.jsx`:
```jsx
function MyPage() {
  return (
    <div className="p-6">
      <h1>My Page</h1>
    </div>
  )
}
export default MyPage
```

2. Import in `src/App.jsx`:
```jsx
import MyPage from './pages/MyPage'
```

3. Add route in App.jsx:
```jsx
else if (currentPath === '/my-page') {
  Component = MyPage
}
```

4. Navigate with:
```jsx
window.history.pushState(null, '', '/my-page')
window.dispatchEvent(new PopStateEvent('popstate'))
```

### Using Firebase Services

```jsx
import { timeTrackingService } from '../services/firebase'

async function clockIn() {
  const clockin = await timeTrackingService.clockIn(
    userId,
    latitude,
    longitude,
    photoUrl
  )
}
```

### Using Auth Context

```jsx
import { useAuth } from '../context/AuthContext'

function MyComponent() {
  const { user, logout, error } = useAuth()
  
  if (!user) {
    return <div>Please login</div>
  }
  
  return <div>Welcome {user.email}</div>
}
```

## 📦 Dependencies to Add (When Ready)

```bash
# For better routing
npm install react-router-dom

# For state management
npm install zustand  # or @reduxjs/toolkit

# For image upload
npm install react-dropzone

# For geolocation
npm install react-geolocated

# For charts/analytics
npm install recharts

# For forms
npm install react-hook-form
```

## 🚀 Deployment to Vercel

The `vercel.json` is already configured. To deploy:

1. Push code to GitHub
2. Connect repo to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy with `vercel deploy`

Or deploy directly:
```bash
npm install -g vercel
vercel
```

## 📚 Resources

- [Firebase Docs](https://firebase.google.com/docs)
- [React Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Vercel Docs](https://vercel.com/docs)

## ✅ Next Steps

1. [ ] Set up Firebase project
2. [ ] Add Firebase credentials to `.env.local`
3. [ ] Uncomment Firebase code in `src/services/firebase.js`
4. [ ] Test login/signup on `localhost:5173/login`
5. [ ] Deploy to Vercel
6. [ ] Start building Phase 1 features

---

**Ready to start? Pick a feature from Phase 1 and let's build it!**
