import { useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'

function Dashboard() {
  const { user, logout } = useAuth()

  useEffect(() => {
    if (!user) {
      window.history.pushState(null, '', '/login')
      window.dispatchEvent(new PopStateEvent('popstate'))
    }
  }, [user])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-site-dark">
            Crews<span className="text-site-primary">Site</span> Dashboard
          </h1>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Quick Action Cards */}
          <QuickActionCard
            icon="🕐"
            title="Clock In"
            description="Start your shift"
            href="/clock-in"
          />
          <QuickActionCard
            icon="📝"
            title="Daily Report"
            description="Submit work report"
            href="/daily-report"
          />
          <QuickActionCard
            icon="💬"
            title="Messages"
            description="Team chat"
            href="/messages"
          />
          <QuickActionCard
            icon="💰"
            title="Payroll"
            description="View earnings"
            href="/payroll"
          />
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-site-dark mb-4">Recent Activity</h2>
          <p className="text-gray-600">No activity yet. Start by clocking in or submitting a daily report.</p>
        </div>
      </main>
    </div>
  )
}

function QuickActionCard({ icon, title, description, href }) {
  return (
    <a
      href={href}
      className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition duration-300 cursor-pointer"
    >
      <div className="text-4xl mb-2">{icon}</div>
      <h3 className="font-semibold text-site-dark">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </a>
  )
}

export default Dashboard
