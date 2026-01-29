// Form Configuration
export const FORM_CONFIG = {
  endpoint: 'https://api.web3forms.com/submit',
  accessKey: import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || '6fc7e4c7-d72d-44d2-9f79-4a9603119c31',
  subject: 'New Waitlist Sign-up for CrewsSite'
}

// Color Theme
export const THEME_COLORS = {
  primary: '#1D4ED8',
  secondary: '#FBBF24',
  dark: '#0F172A'
}

// Navigation Links
export const NAV_LINKS = [
  { href: '#features', label: 'Features' },
  { href: '#payroll', label: 'Payroll' },
  { href: '#apps', label: 'Apps' },
  { href: '#footer-cta', label: 'Contact' }
]

// Features data
export const FEATURES = [
  {
    id: 1,
    icon: '📸',
    title: 'Geo-Verified Time Clock',
    description: 'Require team members to submit a geo-tagged photo upon arrival and departure. Ensure accurate time logs and location verification for every shift.'
  },
  {
    id: 2,
    icon: '📝',
    title: 'Structured Daily Logs',
    description: 'Team members easily report work completed, remaining tasks, and issues daily. Capture critical project data in a standardized, searchable format.'
  },
  {
    id: 3,
    icon: '💬',
    title: 'Private & Group Chats',
    description: 'Facilitate real-time communication. Enable secure private chats for individual members and group chats dedicated to specific construction sites.'
  }
]

// Payroll data
export const PAYROLL_DATA = [
  { date: '10/25', site: 'Main Street', hours: 8.0, pay: 200.00 },
  { date: '10/26', site: 'Lake View', hours: 7.5, pay: 187.50 },
  { date: '10/27', site: 'Main Street', hours: 9.0, pay: 225.00 }
]

export const PAYROLL_TOTAL = {
  hours: 80.0,
  pay: 2000.00
}

// Apps data
export const APPS = [
  { icon: '📱', name: 'iOS (iPhone)' },
  { icon: '🤖', name: 'Android' },
  { icon: '💻', name: 'Windows PWA' },
  { icon: '🌐', name: 'Web Browser' }
]
