# CrewsSite AI Coding Instructions

## Project Overview
**CrewsSite** is a two-tier mobile-first PWA for construction site management and automated payroll. Workers clock in/out with geo-verified photos; Managers see real-time dashboards, calculate payroll in < 10 minutes, and export data for vendors.

**Target:** Vancouver construction market (PST timezone lock, UBC alpha testing)

---

## Development Plan & Roadmap (8 Phases, 20 Weeks)

| Phase | Duration | Focus | Key Deliverables |
|-------|----------|-------|-------------------|
| Phase 1 | Weeks 1-3 | Foundation & Auth | Firebase setup, Core UI, Geofencing |
| Phase 2 | Weeks 4-6 | Worker Experience | Clock in/out, Photo capture, Timezone |
| Phase 3 | Weeks 7-9 | Manager Portal | Live map, Photo feed, Payroll engine |
| Phase 4 | Weeks 10-11 | Chat & Collaboration | Site group chat, Issue reporting |
| Phase 5 | Weeks 12-13 | Testing & QA | Unit, integration, E2E tests |
| Phase 6 | Weeks 14-15 | PWA & Launch | Service worker, App manifest |
| Phase 7 | Weeks 16-17 | Freemium Model | Stripe integration, Feature gating |
| Phase 8 | Weeks 18-20 | Beta & Validation | UBC alpha testing, Real contractors |

---

## Technology Stack

### Frontend
- React 19.2 (Hooks only, no class components)
- Vite (rolldown) with HMR
- Tailwind CSS v4 (CDN in index.html)
- Firebase ^12.8.0 (Auth, Firestore, Storage, Messaging)
- Mapbox GL JS or Google Maps API
- SheetJS (Excel/CSV export)
- Capacitor (native camera for iOS PWA)

### Backend
- Firebase Firestore (multi-tenant, role-based rules)
- Firebase Cloud Storage (geo-tagged photos)
- Firebase Auth (email/password + optional SMS 2FA)
- Firebase Cloud Messaging (push notifications)
- Stripe (payment processing)

---

## Firestore Multi-Tenancy Schema

```
companies/{companyId}/
├── metadata (name, tier, timezone: America/Vancouver)
├── members/{userId}/ (role, hourly_rate - owner only)
├── sites/{siteId}/ (name, address, lat, lng, radius_meters: 200)
│   ├── timeEntries/{entryId}/ (clock_in/out, hours, photo_url, status)
│   └── messages/{messageId}/ (sender, content, photo, timestamp)
├── payrollConfig (hourly_rate, tax_percentage)
├── payrollSummaries/{weekId}/ (calculated hours, gross pay)
└── subscription (tier, billing_date, stripe_id, status)
```

### Security Rules (Role-Based)
- **Worker**: Read/write own time entries only
- **Foreman**: Read team hours (not rates)
- **Owner**: Full read/write access
- **No salary data visible to workers** (privacy-first)

---

## Project Structure (Phase 1 Target)

```
src/
├── pages/
│   ├── Landing.jsx (public landing)
│   ├── LoginPage.jsx (email/password login)
│   ├── SignupPage.jsx (company + user registration)
│   ├── WorkerDashboard.jsx (clock in/out big buttons)
│   ├── ManagerDashboard.jsx (live map, photo feed, payroll)
│   └── AdminPanel.jsx (owner settings, billing)
├── components/
│   ├── Auth/
│   │   ├── ProtectedRoute.jsx (auth guard)
│   │   ├── RoleGate.jsx (role-based render)
│   │   └── FeatureGate.jsx (subscription gate)
│   ├── Worker/
│   │   ├── ClockInFlow.jsx (camera + GPS)
│   │   ├── ClockOutFlow.jsx (photo + hours)
│   │   └── IssueReportMenu.jsx (floating action)
│   └── Manager/
│       ├── MapView.jsx (live tracking)
│       ├── PhotoFeed.jsx (verification grid)
│       ├── AlertsPanel.jsx (alerts)
│       └── PayrollDashboard.jsx (calculate & export)
├── services/
│   ├── authService.js (Firebase Auth)
│   ├── attendanceService.js (time entries)
│   ├── photoService.js (capture, upload, verify)
│   ├── payrollService.js (calculations, export)
│   ├── mapService.js (geofencing, live tracking)
│   ├── chatService.js (Firestore messages)
│   ├── notificationService.js (FCM push)
│   └── stripeService.js (subscriptions)
├── hooks/
│   ├── useAuth.jsx (auth context)
│   ├── useRole.jsx (user role from Firestore)
│   ├── useGeolocation.js (GPS + site detection)
│   ├── usePhotoCapture.jsx (camera + compression)
│   ├── useLiveMap.jsx (real-time tracking)
│   └── useOfflineQueue.jsx (offline queueing)
├── context/
│   ├── AuthContext.jsx (user + auth state)
│   └── CompanyContext.jsx (selected company + site)
├── utils/
│   ├── gpsUtils.js (Haversine formula)
│   ├── dateTimeUtils.js (PST timezone)
│   ├── validationUtils.js (form validation)
│   ├── imageCompression.js (reduce photo size)
│   ├── offlineStorage.js (localStorage queue)
│   └── firebaseRules.js (security validator)
├── config/
│   ├── firebase.js (Firebase init)
│   └── subscriptionTiers.js (free/pro/enterprise)
├── constants/
│   ├── firebasePaths.js (Firestore paths)
│   ├── appConstants.js (global settings)
│   └── geofencingConfig.js (radius, tolerance)
└── models/
    ├── TimeEntry.js (attendance schema)
    ├── Company.js (company metadata)
    ├── User.js (user profile + role)
    └── PayrollSummary.js (payroll schema)
```

---

## Code Patterns & Conventions

### React Components
- **Functional components only** with Hooks
- State: `useState` for local, Context for global (auth, company)
- Effects: `useEffect` with proper cleanup
- Memoization: `useCallback` for passed handlers

### Firebase Integration
- **Modular imports only**: `import { getFirestore } from 'firebase/firestore'`
- All Firestore queries in `src/services/`
- Use converters for type safety
- Real-time listeners with cleanup:
  ```jsx
  useEffect(() => {
    const unsub = onSnapshot(collection(...), (snap) => {...});
    return unsub;
  }, []);
  ```

### Role-Based Access
- Check role in every sensitive component
- Use `RoleGate` wrapper for conditional rendering
```jsx
if (role !== 'owner') return <AccessDenied />;
```

### Photo Capture & Geofencing
1. Tap "Clock In" → GPS activates
2. Suggest site (within 200m geofence)
3. Open camera → Capture photo (auto-EXIF geotag + timestamp)
4. Verify: Timestamp ±10s? GPS ±200m? → Green checkmark
5. Compress to 300KB → Upload to Storage → Log to Firestore

### Timezone Management (PST Lock)
- Always use `America/Vancouver` for all timestamps
- Use `date-fns-tz` or `dayjs` for conversions
- Test DST edge cases (March/November)

### Offline Support
- Cache forms locally (localStorage)
- Queue photo uploads
- Sync on reconnect (Service Worker)

### Styling
- **Tailwind classes exclusively** for layout/spacing/colors
- Custom CSS in `App.css` **only** if Tailwind can't achieve it
- Mobile-first responsive design

---

## Testing Strategy (Phase 5+)

### Unit Tests (Vitest)
- GPS: Haversine calc (5 scenarios)
- Timezone: PST conversion + DST
- Payroll: Hours aggregation, gross calc
- Photo: Compression
- Role: Access control

### Integration Tests (Playwright)
- Worker: Login → Clock in → Photo → Verify Firestore
- Manager: Map → Worker photo → Download payroll
- Role gates: Worker denied, Foreman limited

### E2E Tests
- Full journey: Signup → Clock in → Export payroll
- Geofencing edge cases
- Offline sync

### Performance Targets
- Photo upload: < 3s on 4G
- Live map: < 2s latency
- Payroll calc (100 workers): < 5s
- App load: < 2s

---

## Privacy & Security

### Data Privacy
- Workers see only their own entries
- Foreman sees team hours (not pay)
- Owner sees all data
- **No salary visible to workers**

### Photo Privacy
- Cloud Storage encrypted at rest
- Signed URLs expire (1 hour)
- GDPR: Users can delete data

### Authentication
- Email/password via Firebase Auth
- Optional SMS 2FA for managers
- Auto-login on page refresh
- Clear data on logout

### Data Retention
- Time entries: 90 days
- Photos: 180 days
- Payroll summaries: Permanent

---

## Success Metrics (Phase 8+)

| Metric | Target | Measurement |
|--------|--------|-------------|
| Worker Completion Time | < 120 seconds | Firebase Analytics |
| Manager Time Savings | < 10 min/week | User interviews |
| Photo Verification Rate | 100% | Firestore audit log |
| Daily Active Users | > 80% (week 4) | Firebase Analytics DAU |
| Error Rate | < 2% | Sentry tracking |
| PWA Install Rate | > 50% | Manifest events |
| Freemium → Pro Conversion | > 10% (3 months) | Stripe metrics |
| App Load Time | < 2s on 4G | Lighthouse CI |

---

## AI Coding Assistant Guidance

1. **Clarify which phase** (reference 8-phase plan)
2. **Respect role-based access** - Don't bypass privacy rules
3. **Use modular Firebase imports** - No default exports
4. **Test timezone edge cases** - DST, UTC vs PST
5. **Mobile-first responsive design**
6. **Include offline support** - Cache, queue, sync
7. **Security-first code** - Firestore rules > client checks
8. **Document assumptions** - GPS accuracy, photo size
9. **Plan for scale** - 100+ workers, 4+ sites
10. **Ask for clarification** - Ambiguous requirements need context

---

## Deployment & CI/CD

### Local Development
```bash
npm run dev          # Start with HMR
npm run lint         # Check code
npm run build        # Production build
```

### Production Release
1. Merge to `master`
2. `npm run build` succeeds
3. Deploy to Vercel (auto-deploy)
4. Monitor Sentry/Firebase for errors

### Version Management
- Semver: v0.1.0 (MVP) → v1.0.0 (Full) → v2.0.0 (API)
- Changelog in GitHub Releases
- In-app update banner for critical fixes
