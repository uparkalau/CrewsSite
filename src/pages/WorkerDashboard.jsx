import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

/**
 * WorkerDashboard - Main interface for workers
 * Features: Clock In/Out big buttons, Issue reporting, Status display
 * Phase 2 will add: Photo capture, GPS verification, Geofencing
 */
export function WorkerDashboard() {
  const { user, role, logout } = useAuth()
  const [clockedIn, setClockedIn] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())

  // Update time display
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      hour12: true 
    })
  }

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    })
  }

  const handleClockIn = () => {
    // Phase 2: Add GPS verification + photo capture
    setClockedIn(true)
    console.log('Clock in triggered - Phase 2: Add GPS + photo')
  }

  const handleClockOut = () => {
    // Phase 2: Add GPS verification + photo capture
    setClockedIn(false)
    console.log('Clock out triggered - Phase 2: Add GPS + photo + hours calculation')
  }

  const handleReportIssue = () => {
    // Phase 4: Add chat + issue reporting
    console.log('Issue reporting - Phase 4: Implement chat system')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-site-primary">CrewsSite</h1>
            <p className="text-sm text-gray-600">Worker Dashboard</p>
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
                  onClick={() => {
                    logout()
                    window.location.href = '/'
                  }}
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Status Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="grid grid-cols-2 gap-8 text-center mb-8">
            <div>
              <p className="text-gray-600 text-sm mb-1">Current Time</p>
              <p className="text-4xl font-bold text-site-primary font-mono">
                {formatTime(currentTime)}
              </p>
            </div>
            <div>
              <p className="text-gray-600 text-sm mb-1">Date</p>
              <p className="text-lg font-semibold text-gray-900">
                {formatDate(currentTime)}
              </p>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Current Status</p>
                <p className="text-xl font-bold">
                  {clockedIn ? (
                    <span className="text-green-600 flex items-center gap-2">
                      <span className="inline-block w-3 h-3 bg-green-600 rounded-full animate-pulse"></span>
                      Clocked In
                    </span>
                  ) : (
                    <span className="text-gray-500 flex items-center gap-2">
                      <span className="inline-block w-3 h-3 bg-gray-400 rounded-full"></span>
                      Clocked Out
                    </span>
                  )}
                </p>
              </div>
              <p className="text-sm text-gray-500">Role: {role || 'worker'}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Clock In Button */}
          <button
            onClick={handleClockIn}
            disabled={clockedIn}
            className={`h-40 rounded-lg font-bold text-xl transition transform active:scale-95 ${
              clockedIn
                ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                : 'bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl'
            }`}
          >
            <div className="flex flex-col items-center justify-center h-full">
              <span className="text-4xl mb-2">🟢</span>
              <span>Clock In</span>
            </div>
          </button>

          {/* Clock Out Button */}
          <button
            onClick={handleClockOut}
            disabled={!clockedIn}
            className={`h-40 rounded-lg font-bold text-xl transition transform active:scale-95 ${
              !clockedIn
                ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                : 'bg-red-500 hover:bg-red-600 text-white shadow-lg hover:shadow-xl'
            }`}
          >
            <div className="flex flex-col items-center justify-center h-full">
              <span className="text-4xl mb-2">🔴</span>
              <span>Clock Out</span>
            </div>
          </button>
        </div>

        {/* Report Issue Button */}
        <button
          onClick={handleReportIssue}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-4 px-6 rounded-lg transition transform active:scale-95 shadow-lg hover:shadow-xl"
        >
          <span className="text-lg">📋 Report Issue</span>
        </button>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm font-semibold text-blue-900 mb-1">Today's Hours</p>
            <p className="text-2xl font-bold text-blue-600">0 hours</p>
            <p className="text-xs text-blue-700 mt-1">Phase 2: Calculated from clock in/out</p>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <p className="text-sm font-semibold text-purple-900 mb-1">Site Location</p>
            <p className="text-2xl font-bold text-purple-600">--</p>
            <p className="text-xs text-purple-700 mt-1">Phase 2: GPS verification</p>
          </div>
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
            <p className="text-sm font-semibold text-indigo-900 mb-1">This Week</p>
            <p className="text-2xl font-bold text-indigo-600">0 hours</p>
            <p className="text-xs text-indigo-700 mt-1">Phase 3: Payroll calculation</p>
          </div>
        </div>
      </main>
    </div>
  )
}
