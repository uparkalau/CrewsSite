# CrewsSite AI Coding Instructions

## Project Overview
CrewsSite is a React + Vite site management and payroll automation platform for construction companies. The application uses Tailwind CSS for styling, Firebase for backend services, and Vite's rolldown for fast builds.

## Architecture & Key Dependencies

### Frontend Stack
- **React 19.2** with Hooks-based patterns (no class components)
- **Vite (rolldown)** - Build tool with HMR for development
- **Tailwind CSS v4** - Utility-first styling via CDN in `index.html`
- **Firebase ^12.8.0** - Backend services (firestore/auth/hosting integration expected)
- **Lucide React** - Icon library for UI components
- **SheetJS** - Spreadsheet processing (likely for payroll/site data import/export)

### Project Structure
```
src/
  ├── App.jsx         # Main component with form submission & menu logic
  ├── App.css         # Component-specific styles
  ├── main.jsx        # React entry point
  ├── index.css       # Global styles
  └── assets/         # Static images/resources
```

## Development Workflow

### Commands
```bash
npm run dev       # Start Vite dev server with HMR (port 5173 default)
npm run build     # Production build to dist/
npm run lint      # Run ESLint checks
npm run preview   # Preview production build locally
```

### Styling Approach
- **Tailwind CSS via CDN** with custom theme config in `index.html`
- Custom colors defined: `site-primary` (#1D4ED8), `site-secondary` (#FBBF24), `site-dark` (#0F172A)
- Font: Inter (web font loaded in HTML head)
- **Do not** create separate CSS files for utilities - use Tailwind classes
- Component-specific styles go in `App.css` only if Tailwind classes are insufficient

## Code Patterns & Conventions

### React Component Patterns
- Use **functional components with Hooks** exclusively
- State management: `useState` for local component state
- Side effects: `useEffect` for DOM manipulation, lifecycle events (see `App.jsx` lines 8-17 for body overflow handling pattern)
- Event handlers: Inline arrow functions or named functions in component body

### Form Handling
- Web3Forms integration for contact forms (see `App.jsx` lines 24-49)
- Access key stored as form hidden field: `<input type="hidden" name="access_key" value="..."/>`
- Errors handled gracefully with user feedback via `setFormFeedback` state
- **Critical**: Validate access key configuration before submission

### Firebase Integration
- FireBase SDK imported but pattern not yet established in codebase
- When implementing Firebase features: use modular imports (`firebase/firestore`, `firebase/auth`)
- Store Firebase config in environment variables (`.env.local`)

### Menu/Navigation Pattern
- `menuOpen` state controls overlay visibility
- Side effect manages `document.body.style.overflow` to prevent scroll when menu open (see `App.jsx` lines 8-17)
- Cleanup function required in useEffect to reset body styles

## ESLint & Code Quality

### ESLint Configuration
- Uses `@eslint/js` recommended config + React Hooks rules + React Refresh rules
- Rule customization: `no-unused-vars` ignores uppercase/underscore-prefixed variables (constants/React components)
- Global ignore: `dist/` directory

### Linting Before Commits
```bash
npm run lint
```
Fix issues with `eslint --fix` before opening PRs.

## Important Implementation Notes

### Tailwind CSS Setup Issue
- The project loads Tailwind via CDN in `index.html` (not PostCSS/build-time)
- Run `npx tailwindcss init -p` to generate `tailwind.config.js` if needed for JIT compilation
- Keep theme extensions in `index.html` script block for CDN setup

### Third-Party API Integration
- **Web3Forms API**: Contact form submission endpoint
- Requests sent to `https://api.web3forms.com/submit` with FormData
- Response validation required (check both `response.ok` and `result.success`)

### Data Processing
- SheetJS used for Excel/CSV imports - pattern location: TBD (implement with streaming for large payroll files)
- Firebase Firestore likely for site/crew/payroll data storage

## Git & Development Workflow
- Branch from `master` (default branch)
- Keep commits atomic and descriptive
- Run lint before pushing: `npm run lint`
- Rebuild locally: `npm run build` to verify production build

## External References
- [Vite Docs](https://vite.dev) - Build tool configuration
- [React 19 Hooks](https://react.dev/reference/react/hooks) - Function component patterns
- [Tailwind CSS v4](https://tailwindcss.com) - Utility class reference
- [Firebase Web SDK](https://firebase.google.com/docs/web) - Backend integration
- [Web3Forms Docs](https://web3forms.com) - Contact form API
