# CrewsSite Development Strategy - Modern Implementation

**TL;DR:** Build a two-tier mobile-first PWA (worker + manager) with strict role-based access, real-time geo-verification, and a freemium model. Start with Vancouver MVP (UBC alpha), validate with 5-10 contractors, then scale nationally. Tech: React 19 + Vite, Firebase (Auth/Firestore/Storage), Mapbox/Google Maps, SheetJS, Web3Forms.

## Phase 1: Foundation & Architecture (Weeks 1-3)

### 1.1 Project Setup & Infrastructure
- **Firebase Organization:**
  - Multi-tenancy schema: `companies/{companyId}/sites`, `companies/{companyId}/members`, `companies/{companyId}/timeEntries`
  - Firestore security rules: Role-based read/write access (member sees only own data, manager sees team data)
  - Storage: Geo-tagged photos in `gs://crewssite/companies/{companyId}/sites/{siteId}/photos/`
  - Real-time listeners for live map updates

- **Database Schema (Firestore):**
  ```
  companies/
    ├── {companyId}/
    │   ├── metadata (name, subscription tier, timezone: America/Vancouver)
    │   ├── members/
    │   │   └── {userId}/ (role: owner|foreman|worker)
    │   ├── sites/
    │   │   ├── {siteId}/ (name, address, lat, lng, radius_meters: 200)
    │   │   └── timeEntries/
    │   │       └── {entryId}/ (user_id, clock_in_time, clock_out_time, hours, verified_photo_url, status)
    │   ├── payrollConfig/ (hourly_rate, tax_deductions)
    │   └── payrollSummaries/
    │       └── {weekId}/ (calculated hours by site, total pay, export_data)
  ```

- **Security & Privacy:**
  - Firestore rules enforce: Workers read only own entries; Managers read team entries; No salary data visible to workers
  - Authentication: Email/password (Firebase Auth) + optional SMS 2FA for managers
  - GDPR compliance: Data retention policy (90 days archived, then deleted)

### 1.2 Core Mobile UI - "Two-Tap Workflow"
- **Landing Page Component (Landing.jsx):**
  - Hero section matching Vercel design (site-primary #1D4ED8, site-secondary #FBBF24)
  - Waitlist signup (Web3Forms integration)
  - Feature highlights (Geo-verification, Instant Payroll, No Manual Texting)

- **Worker Dashboard (WorkerDashboard.jsx):**
  - **Big Button Layout:**
    - Clock In button (opens camera, geo-locates, suggests site)
    - Clock Out button (photo + hours + notes form)
    - Report Issue floating action button (+ icon)
    - Floating action menu for quick actions

- **Real-time GPS Integration:**
  - Use `useGeolocation` hook (custom, already in codebase)
  - Auto-suggest site when within 200m geofence (Haversine formula)
  - Verify geo-tag: Worker photo timestamp + location match within 10 seconds

### 1.3 Authentication & Role-Based Routing
- **Auth Context (AuthContext.jsx - enhance existing):**
  - User roles: `owner`, `foreman`, `worker`
  - Protected routes: Worker sees Dashboard; Manager sees ManagerDashboard; Owner sees AdminPanel
  - Session persistence: Firebase Auth auto-login on app restart

- **Components:**
  - `ProtectedRoute.jsx`: Redirect if unauthorized
  - `RoleGate.jsx`: Show/hide features based on role
  - `LoginPage.jsx` & `SignupPage.jsx`: Email/password forms with validation

---

## Phase 2: Worker Experience & Real-Time Capture (Weeks 4-6)

### 2.1 Mobile-First Time Entry System
- **Clock In Flow (ClockInFlow.jsx):**
  1. Tap "Clock In" → Firestore logs timestamp (server-side for accuracy)
  2. GPS auto-activates → Detects site based on geofence
  3. Camera opens (React Photo-Camera or native camera via Capacitor PWA)
  4. Worker snaps selfie at job site (auto-geotagged with photo metadata)
  5. System verifies: Is photo timestamp within 10s of clock-in? Is location within 200m radius?
  6. Green checkmark = Verified → Sync to Firestore
  7. Silent notification: "Logged in at [Site Name] · 6:45 AM"

- **Clock Out Flow (ClockOutFlow.jsx):**
  - Similar: Photo proof of work, select hours (or system auto-calculates), short text field ("work completed: ____")
  - Optional: Voice-to-text for notes (use Web Speech API for accessibility)
  - Before submit: Show summary → "You worked 8.5 hrs on UBC Project" → Tap confirm

- **Issue Report Floating Button (IssueReportMenu.jsx):**
  - Categories: Materials, Safety, Delay, Other
  - Tap → Photo + 1-2 sentence caption → Auto-post to site group chat
  - Real-time delivery to foreman's phone (push notification)

### 2.2 Photo Management & Verification
- **Photo Service (photoService.js - new):**
  - Capture: Auto-attach geo-coordinates (lat, lng, timestamp) via EXIF
  - Upload: Compressed (500KB max) to Firebase Storage with signed URL
  - Verification: Compare timestamp (clock-in) vs photo timestamp (tolerance: ±10s) and GPS (within 200m)
  - Archive: Store reference in Firestore for audit trail

- **PWA Camera Optimization:**
  - Use `getUserMedia()` API for camera access
  - Compress image before upload (reduce from 3MB to 300KB)
  - Offline queue: If offline, cache photo locally; sync when online
  - iOS PWA consideration: Use Capacitor for native camera if needed

### 2.3 Local Time Management (Vancouver PST)
- **Timezone Enforcement (dateTimeUtils.js - enhance existing):**
  - Enforce `America/Vancouver` for all timestamps
  - Daily deadline: 6 PM PST for clock-out reminders
  - Show local time in UI (not UTC)
  - If worker is in different timezone temporarily, still use company timezone for payroll

---

## Phase 3: Manager Portal & Real-Time Oversight (Weeks 7-9)

### 3.1 Live Manager Dashboard (ManagerDashboard.jsx)
- **Components:**
  1. **Live Map (MapView.jsx):**
     - Mapbox GL or Google Maps integration
     - Show sites as markers (color-coded: green=in progress, gray=inactive)
     - Show worker avatars on map in real-time (update every 30s)
     - Tap worker → See: Name, clock-in time, current site, last photo
     - Privacy: Only show aggregate worker count to non-managers

  2. **Daily Photo Feed (PhotoFeed.jsx):**
     - Grid of worker photos (clock-in, clock-out, issue reports)
     - Tap photo → Expand and verify geo-tag (Show: "✅ Verified at UBC Project, 6:45 AM")
     - Filter by: Site, Date, Worker, Verification Status
     - Export batch: Select photos for report

  3. **Alerts Panel (AlertsPanel.jsx):**
     - "Worker forgot to clock out at 6:30 PM" → Manager can clock them out
     - "Duplicate clock-in detected at same site within 2 mins" → Flag for review
     - "Photo geo-tag mismatch" → Manual verification required

### 3.2 Payroll Engine (PayrollDashboard.jsx)
- **Automated Calculation:**
  - On-demand: Manager clicks "Calculate This Week" (Monday 12:01 AM - Sunday 11:59 PM PST)
  - System aggregates:
    - All verified hours for each worker
    - Filter by site (if multi-site project)
    - Apply hourly rate from `payrollConfig`
    - Calculate gross pay (hours × rate)
    - Deductions: Tax (if configured), benefits (future)
  - Result: Table showing Worker | Site | Hours | Rate | Gross

- **Privacy Enforcement (Firestore Rules):**
  ```
  allow read: if request.auth.uid == resource.data.worker_id || 
             (get(/databases/$(database)/documents/companies/$(resource.data.company_id)/members/$(request.auth.uid)).data.role == 'owner')
  ```
  - Workers see only their own payroll entry
  - Foreman sees team hours (not rates/pay)
  - Owner sees all data

- **Export Functionality (exportPayrollToExcel - enhance existing):**
  - One-click download: "Export for Vendor"
  - Include: Worker name, site, hours, total cost
  - Format: XLSX or PDF
  - Filename: `Payroll_Week-of-[DATE]_CompanyName.xlsx`

### 3.3 Real-Time Notifications (NotificationService.js - new)
- **Push Notifications (Firebase Cloud Messaging):**
  - Worker forgets to clock out: "🔔 You forgot to clock out at Main St. Site. Do it now?"
  - Manager submits payroll: Worker gets "✅ Your hours for the week have been submitted for payment"
  - Issue reported: "🔔 [Worker] reported: Need more plywood at UBC Project"
  - Delivery: Immediately for workers, queued daily for non-urgent manager alerts

---

## Phase 4: Chat & Collaboration (Weeks 10-11)

### 4.1 Site Group Chat (SiteChat.jsx)
- **Features:**
  - Private to company + site members only
  - Messages + photo support
  - Auto-notify: Issue report posts as message
  - Timestamp: Shown in local PST
  - Edit/delete: Only your own messages

- **Messages Schema (Firestore):**
  ```
  companies/{companyId}/sites/{siteId}/messages/
    ├── {messageId}/
    │   ├── sender_id, content, photo_url (optional)
    │   ├── timestamp (server timestamp)
    │   └── read_by: [list of user IDs who've read]
  ```

### 4.2 Private 1:1 Chat (Pro tier feature)
- Available only in Pro/Enterprise plans
- Use Firestore collection: `companies/{companyId}/chats/{chatId}/messages/`

---

## Phase 5: Testing & Quality Assurance (Weeks 12-13)

### 5.1 Testing Strategy
- **Unit Tests (Vitest):**
  - `gpsUtils.js`: Haversine distance calculation (test 5 scenarios: exact match, 199m away, 201m away)
  - `dateTimeUtils.js`: Timezone conversion (UTC → PST, daylight savings edge cases)
  - `payrollService.js`: Gross pay calculation (40h @ $25/h = $1000)

- **Integration Tests (Playwright):**
  - Worker flow: Clock in → Photo → Clock out → Verify in DB
  - Manager flow: View live map → See worker photo → Download payroll
  - Role access: Worker cannot see payroll data; Foreman cannot see manager settings

- **E2E Tests (Playwright or Cypress):**
  - Full user journey: Login → Clock in → Clock out → See in Dashboard → Export payroll
  - Geofencing: Clock in outside 200m radius → Rejection + error message
  - Offline behavior: Go offline → Queue photo → Come online → Auto-sync

- **Performance Testing:**
  - Time to photo upload: Target < 3s on 4G LTE
  - Live map update: Real-time < 2s latency
  - Payroll calculation: 100 workers, 4 weeks of data = < 5s

### 5.2 Security Audit
- Firestore rule testing: Attempt to read other user's payroll → Denied
- Photo URL security: Signed URLs expire after 1 hour
- API rate limiting: Prevent mass data exfiltration
- OWASP Top 10: SQL injection (N/A - Firestore), XSS (sanitize all inputs), CSRF (Firebase auto-handles)

---

## Phase 6: PWA & Launch (Weeks 14-15)

### 6.1 Progressive Web App Setup
- **Web App Manifest (public/manifest.json):**
  ```json
  {
    "name": "CrewsSite",
    "start_url": "/",
    "display": "standalone",
    "icons": [
      { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
      { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" }
    ]
  }
  ```

- **Service Worker (public/sw.js - optional):**
  - Cache static assets (JS, CSS)
  - Network-first for API calls (offline support)
  - Background sync: Queue clock-in attempts if offline, sync on reconnect

- **Installation Prompts:**
  - iOS: Detect Safari → Show "Add to Home Screen" banner
  - Android: Native install prompt via beforeinstallprompt
  - Desktop PWA: Windows/Mac install from browser menu

### 6.2 Analytics & Monitoring
- **Firebase Analytics:**
  - Track: App installs, daily active users, clock-in completion rate
  - Goal: Worker completion time < 120 seconds (measure via event logging)

- **Error Tracking (Sentry or Firebase Crashlytics):**
  - Monitor: Camera permission denials, geo-tag failures, upload errors
  - Alert threshold: > 5% error rate on any feature

---

## Phase 7: Freemium Model & Monetization (Weeks 16-17)

### 7.1 Subscription Tier Implementation
- **Firestore Document (companies/{companyId}/subscription):**
  ```
  {
    "tier": "free" | "pro" | "enterprise",
    "billing_cycle_start": timestamp,
    "next_billing_date": timestamp,
    "stripe_customer_id": "cus_xxxxx",
    "status": "active" | "suspended" | "cancelled"
  }
  ```

- **Feature Gating (FeatureGate.jsx - new component):**
  - Free: 1 company, 1 site, 3 crew members
  - Pro: Unlimited sites, 15 members, exports, 1:1 chat
  - Detect: Attempt to add 4th member → Modal: "Upgrade to Pro ($29/mo)"

### 7.2 Stripe Integration
- Payment processing via Stripe (test with Stripe test cards)
- Webhook listener for subscription events: upgrade, downgrade, failed payment
- On upgrade: Immediately unlock Pro features
- On downgrade: Graceful degradation (keep data, hide Pro buttons)

---

## Phase 8: Vancouver Beta & Real-World Validation (Weeks 18-20)

### 8.1 UBC Alpha Testing
- **Recruit 3-5 small contractors (1-10 person teams):**
  - Partner with 1-2 general contractors working in Vancouver
  - Use one real active site as test ground (e.g., residential renovation, commercial build)

- **Metrics to track:**
  - Worker adoption: Do they open the app daily?
  - Completion time: Average clock-in time (target: < 2 mins)
  - Photo quality: Are geotagged photos reliable?
  - Manager satisfaction: Can they run payroll in < 10 mins?

- **Feedback loop:**
  - Weekly check-ins with beta partners
  - Document pain points (e.g., "Camera app crashes on Pixel 4")
  - Iterate: Fix top 3 issues, redeploy within 5 days

### 8.2 Edge Case Handling
- **Scenario: Worker at edge of geofence (200m boundary)**
  - Solution: Show warning "You're at the edge of the site boundary. Clock in anyway?" with manual confirmation

- **Scenario: Poor GPS signal (GPS drifts 50m in 2 mins)**
  - Solution: Take 3 GPS samples, use median value; tolerance: 250m for clock-in

- **Scenario: Worker forgets phone at site, boss clocks them out**
  - Solution: Allow manager override (with audit log note: "Clocked out by [Manager] — photo not captured")

---

## Deployment & Rollout Strategy

### Staging Environment:
- Separate Firebase project for testing (firestore-staging)
- Deploy to GitHub Pages staging URL for testing before production
- Run full test suite before promoting to production

### Production Release:
1. Build: `npm run build` → Optimized Vite bundle
2. Deploy to Vercel (auto-deploy on master branch push)
3. Enable Firebase authentication allowlist (development.firebaseapp.com, production.firebaseapp.com)
4. Monitor: Check Sentry for errors in first 24 hours

### Version Management:
- Semver: v0.1.0 (MVP) → v1.0.0 (Full features) → v2.0.0 (API expansion)
- Changelog in GitHub releases
- In-app update prompt: If critical fix, show banner "Please refresh your app"

---

## Success Metrics (Ongoing Measurement)

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| Worker Completion Time | < 120 seconds | Firebase Analytics event time |
| Manager Time Savings | < 10 min/week for payroll | User interviews, time logs |
| Photo Verification Accuracy | 100% geo-tag match | Firestore audit log |
| Daily Active Users | > 80% adoption by week 4 | Firebase Analytics DAU |
| Error Rate | < 2% | Sentry error tracking |
| App Install (PWA) | > 50% of workers | Manifest install events |
| Freemium → Pro Conversion | > 10% within 3 months | Stripe subscription metrics |
| Feature Completion Time | Clock-in < 1.5m, Clock-out < 2m, Payroll export < 1m | Instrumentation logging |

---

## Risk Mitigation

| Risk | Impact | Mitigation |
|------|--------|-----------|
| GPS inaccuracy in urban canyons | Workers can't verify location | Use WiFi + GPS fusion; manual override option |
| High photo upload failures | Workers frustrated | Offline queue + retry logic; show upload progress |
| Firebase quota exhaustion | App becomes slow/unresponsive | Set Firestore soft limit alerts; paginate queries |
| Worker privacy concerns | Legal liability | Transparent privacy policy; data only on Firebase (encrypted at rest) |
| Contractor resistance to adoption | Low DAU | Free tier removes friction; show payroll savings (e.g., "Save 5 hours/week on admin") |
| iOS PWA limitations | Camera, notification issues | Test on actual devices; fallback: web-only for iOS until features improve |

---

## Technology Stack Summary

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Frontend | React 19 + Vite | Fast HMR; modern hooks API; optimized build output |
| Styling | Tailwind CSS (CDN) | Rapid prototyping; responsive design; matches design system |
| Backend | Firebase (Firestore + Auth) | Serverless; real-time listeners; built-in security rules; no ops overhead |
| Storage | Firebase Cloud Storage | Secure photo uploads; signed URLs; geo-redundancy |
| Payments | Stripe + Firebase Extensions | Recurring subscriptions; webhook-driven feature gating |
| Maps | Mapbox GL JS or Google Maps API | Live worker tracking; geofencing visualization |
| Data Export | SheetJS (xlsx) | Client-side Excel generation; privacy (no server processing) |
| Notifications | Firebase Cloud Messaging (FCM) | Cross-platform push (iOS, Android, Web); Firestore triggers |
| Monitoring | Sentry (errors) + Firebase Analytics | Proactive error tracking; user behavior insights |
| Deployment | Vercel (frontend) + Firebase Hosting (PWA) | Auto-deploy on git push; global CDN; serverless |

---

## Next Steps (Recommended Immediate Actions)

1. **Week 1:** Set up Firebase project structure, confirm with team on privacy/role model
2. **Week 1-2:** Build core components (Navigation, Hero, LoginPage, WorkerDashboard)
3. **Week 2-3:** Implement Clock In/Out photo capture + geofencing
4. **Week 3-4:** Manager dashboard with live map + photo feed
5. **Week 5:** Start beta testing with 2-3 real contractors

This plan balances the ambitious "two-tap workflow" UX with production-grade safety, privacy, and real-world construction workflows. 🚀
