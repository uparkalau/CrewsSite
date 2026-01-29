# CrewsSite - Quick Setup Guide

## Prerequisites
- Node.js (v16+)
- npm or yarn

## Installation & Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
```bash
cp .env.local.example .env.local
```

Then edit `.env.local` and add your configuration:
```
VITE_WEB3FORMS_ACCESS_KEY=your_access_key_here
```

### 3. Development Server
```bash
npm run dev
```
The app will be available at `http://localhost:5173`

### 4. Build for Production
```bash
npm run build
```

Output will be in the `dist/` directory

### 5. Preview Production Build
```bash
npm run preview
```

## Code Quality

### Linting
```bash
npm run lint
```

### Linting with Auto-fix
```bash
npx eslint . --fix
```

## Project Architecture

### Components (`src/components/`)
- **Navigation.jsx** - Header with responsive mobile menu
- **Hero.jsx** - Main hero section with CTAs
- **Features.jsx** - Features showcase (3-column grid)
- **Payroll.jsx** - Payroll demo with sample table
- **Apps.jsx** - Platform availability section
- **Footer.jsx** - Footer with email signup form

### Utilities
- **hooks/useCustom.js** - Reusable custom hooks
  - `useMenuToggle()` - Menu state management
  - `useFormSubmit()` - Form submission logic
- **constants/config.js** - Centralized configuration and data

### Styles
- **index.css** - Global styles and Tailwind directives
- **App.css** - App-specific styles
- All component styling uses Tailwind CSS classes

## Key Technologies

- **React 19.2** - UI library
- **Vite (rolldown)** - Build tool with HMR
- **Tailwind CSS v4** - Utility-first styling (via CDN)
- **Firebase ^12.8.0** - Backend services (ready for integration)
- **Web3Forms** - Email form submissions

## Deployment

### To Firebase Hosting
```bash
npm run build
firebase deploy
```

### To Vercel
```bash
vercel
```

### To Netlify
```bash
netlify deploy --prod
```

## Troubleshooting

### Port 5173 already in use
```bash
lsof -i :5173
kill -9 <PID>
```

### Environment variables not loading
- Ensure `.env.local` file exists
- Restart the dev server after changes
- Prefix variables with `VITE_` for client-side access

### Build fails
```bash
rm -rf dist node_modules
npm install
npm run build
```

## Contributing

1. Create a new branch: `git checkout -b feature/my-feature`
2. Make your changes
3. Run linting: `npm run lint`
4. Commit: `git commit -m "Add my feature"`
5. Push: `git push origin feature/my-feature`
6. Create a Pull Request

## Support

For issues or questions, refer to the project documentation or open an issue on GitHub.
