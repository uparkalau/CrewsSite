import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { RoleGate } from '../components/Auth/RoleGate'

/**
 * ManagerDashboard - Main interface for managers/foremen
 * Phase 3 will add: Live map tracking, Photo feed, Payroll dashboard
 * Protected by RoleGate (owner/foreman only)
 */
export function ManagerDashboard() {
  const { user, logout } = useAuth()
  const [showMenu, setShowMenu] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  const handleLogout = () => {
    logout()
    window.location.href = '/'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-site-primary">CrewsSite Manager</h1>
            <p className="text-sm text-gray-600">Construction Site Management Dashboard</p>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
            >
              <div className="w-8 h-8 bg-site-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                {user?.email?.[0].toUpperCase()}
              </div>
              <span className="text-sm font-medium text-gray-900">{user?.email}</span>
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4">
          <nav className="flex gap-8">
            {['overview', 'workers', 'payroll', 'sites'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition ${
                  activeTab === tab
                    ? 'border-site-primary text-site-primary'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <StatCard label="Active Workers" value="0" icon="👥" />
              <StatCard label="Clocked In" value="0" icon="✓" />
              <StatCard label="Today's Hours" value="0" icon="⏱" />
              <StatCard label="This Week Cost" value="$0" icon="💰" />
            </div>

            {/* Coming Soon Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <ComingSoonCard 
                title="Live Worker Map" 
                description="Phase 3: Real-time GPS tracking, geofencing, and worker status"
                icon="🗺"
              />
              <ComingSoonCard 
                title="Photo Verification Feed" 
                description="Phase 3: Review and approve geo-tagged clock-in/out photos"
                icon="📸"
              />
            </div>
          </div>
        )}

        {activeTab === 'workers' && (
          <ComingSoonCard 
            title="Worker Management" 
            description="Phase 3: View team hours, attendance, and performance metrics"
            icon="👥"
            fullWidth
          />
        )}

        {activeTab === 'payroll' && (
          <ComingSoonCard 
            title="Payroll Dashboard" 
            description="Phase 3: Calculate hours, generate invoices, and export payroll data"
            icon="📊"
            fullWidth
          />
        )}

        {activeTab === 'sites' && (
          <ComingSoonCard 
            title="Site Management" 
            description="Phase 2: Create sites, set geofence radius, and manage team assignments"
            icon="📍"
            fullWidth
          />
        )}
      </main>
    </div>
  )
}

/**
 * StatCard - Display a key metric
 */
function StatCard({ label, value, icon }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm mb-1">{label}</p>
          <p className="text-3xl font-bold text-site-primary">{value}</p>
        </div>
        <span className="text-4xl opacity-50">{icon}</span>
      </div>
    </div>
  )
}

/**
 * ComingSoonCard - Placeholder for future features
 */
function ComingSoonCard({ title, description, icon, fullWidth }) {
  return (
    <div className={fullWidth ? 'w-full' : ''}>
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-dashed border-blue-300 rounded-lg p-8 text-center">
        <div className="text-5xl mb-4">{icon}</div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        <div className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
          Coming Soon
        </div>
      </div>
    </div>
  )
}

/**
 * Wrapped export with role protection
 */
export function ProtectedManagerDashboard() {
  return (
    <RoleGate roles={['owner', 'foreman']}>
      <ManagerDashboard />
    </RoleGate>
  )
}
