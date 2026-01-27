import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [formFeedback, setFormFeedback] = useState('')
  const [buttonDisabled, setButtonDisabled] = useState(false)

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    setButtonDisabled(true)
    setFormFeedback('')

    const formData = new FormData(e.target)
    const accessKey = formData.get('access_key')
    
    if (!accessKey || accessKey === 'YOUR_WEB3FORMS_ACCESS_KEY') {
      setFormFeedback('Please configure your Web3Forms access key to enable submissions.')
      setButtonDisabled(false)
      return
    }

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      })

      const result = await response.json()

      if (response.ok && result.success) {
        setFormFeedback('Success! We will be in touch shortly.')
        e.target.reset()
      } else {
        setFormFeedback(result.message || 'Oops! Something went wrong. Please try again.')
      }
    } catch (error) {
      console.error('Error:', error)
      setFormFeedback('A connection error occurred. Please check your network.')
    } finally {
      setTimeout(() => setButtonDisabled(false), 1500)
    }
  }

  return (
    <>
      {/* Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <svg className="w-6 h-6 text-site-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 20h6M9 14h6m-3-3h.01M9 8h6m-3-3h.01" />
            </svg>
            <span className="text-xl font-bold text-site-dark">Crews<span className="text-site-primary">Site</span></span>
          </div>

          <nav className="hidden md:flex space-x-6 text-sm font-medium">
            <a href="#features" className="text-gray-600 hover:text-site-primary transition duration-150">Features</a>
            <a href="#payroll" className="text-gray-600 hover:text-site-primary transition duration-150">Payroll</a>
            <a href="#apps" className="text-gray-600 hover:text-site-primary transition duration-150">Apps</a>
            <a href="#footer-cta" className="text-gray-600 hover:text-site-primary transition duration-150">Contact</a>
          </nav>

          <a href="#" className="px-4 py-2 bg-site-primary text-white text-sm font-semibold rounded-lg shadow-md hover:bg-site-primary/90 transition duration-300 transform hover:scale-[1.02] hidden sm:inline-flex">
            Start Free Trial
          </a>

          <button onClick={() => setMenuOpen(true)} className="md:hidden p-2 rounded-lg text-site-dark hover:bg-gray-100">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 md:hidden" onClick={() => setMenuOpen(false)}>
          <div className="absolute right-0 top-0 h-full w-64 bg-white shadow-2xl p-6 flex flex-col space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
              <span className="text-xl font-bold text-site-dark">Menu</span>
              <button onClick={() => setMenuOpen(false)} className="p-2 rounded-lg text-site-dark hover:bg-gray-100">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <a href="#features" onClick={() => setMenuOpen(false)} className="text-lg font-medium text-gray-700 hover:text-site-primary transition duration-150 p-2 rounded-lg hover:bg-gray-50">Features</a>
            <a href="#payroll" onClick={() => setMenuOpen(false)} className="text-lg font-medium text-gray-700 hover:text-site-primary transition duration-150 p-2 rounded-lg hover:bg-gray-50">Payroll</a>
            <a href="#apps" onClick={() => setMenuOpen(false)} className="text-lg font-medium text-gray-700 hover:text-site-primary transition duration-150 p-2 rounded-lg hover:bg-gray-50">Apps</a>
            <a href="#footer-cta" onClick={() => setMenuOpen(false)} className="text-lg font-medium text-gray-700 hover:text-site-primary transition duration-150 p-2 rounded-lg hover:bg-gray-50">Contact Us</a>
            <div className="pt-8">
              <a href="#" className="w-full text-center px-4 py-3 bg-site-primary text-white text-lg font-semibold rounded-lg shadow-md hover:bg-site-primary/90 transition duration-300 block">Start Free Trial</a>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="hero-bg py-20 sm:py-32 text-white overflow-hidden shadow-inner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-6xl font-extrabold mb-4 leading-tight text-shadow-custom">
            Manage Your <span className="text-site-secondary">Crew,</span> Capture The <span className="text-site-secondary">Work.</span>
          </h1>
          <p className="text-xl sm:text-2xl mb-8 text-gray-300 max-w-3xl mx-auto">
            CrewsSite provides secure login, geo-verified time tracking, daily reporting, and automated payroll for modern construction teams.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <a href="#" className="w-full sm:w-auto px-8 py-3 bg-site-secondary text-site-dark font-bold text-lg rounded-xl shadow-lg hover:bg-yellow-400 transition duration-300 transform hover:scale-[1.05] ring-4 ring-site-secondary/50">
              Get Started Today
            </a>
            <a href="#features" className="w-full sm:w-auto px-8 py-3 border border-gray-400 text-white font-semibold text-lg rounded-xl hover:bg-site-primary/50 transition duration-300 transform hover:scale-[1.02]">
              See How It Works
            </a>
          </div>
          <div className="mt-12">
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl max-w-4xl mx-auto shadow-2xl border border-white/20">
              <img src="https://placehold.co/800x450/1D4ED8/ffffff?text=CrewsSite+App+Mockup+-+Time+Entry+%26+Photo+Report" 
                   alt="CrewsSite App Mockup"
                   className="rounded-lg shadow-xl w-full"
                   onError={(e) => e.target.src = 'https://placehold.co/800x450/374151/E5E7EB?text=CrewsSite+App+Screen'}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 sm:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-center mb-12">
            Automate The Site, Simplify Your Day
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition duration-300">
              <div className="flex items-center justify-center w-12 h-12 bg-site-primary/10 text-site-primary rounded-full mb-4">📸</div>
              <h3 className="text-xl font-bold mb-2">Geo-Verified Time Clock</h3>
              <p className="text-gray-600">Require team members to submit a geo-tagged photo upon arrival and departure. Ensure accurate time logs and location verification for every shift.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition duration-300">
              <div className="flex items-center justify-center w-12 h-12 bg-site-primary/10 text-site-primary rounded-full mb-4">📝</div>
              <h3 className="text-xl font-bold mb-2">Structured Daily Logs</h3>
              <p className="text-gray-600">Team members easily report work completed, remaining tasks, and issues daily. Capture critical project data in a standardized, searchable format.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition duration-300">
              <div className="flex items-center justify-center w-12 h-12 bg-site-primary/10 text-site-primary rounded-full mb-4">💬</div>
              <h3 className="text-xl font-bold mb-2">Private & Group Chats</h3>
              <p className="text-gray-600">Facilitate real-time communication. Enable secure private chats for individual members and group chats dedicated to specific construction sites.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Payroll Section */}
      <section id="payroll" className="py-16 sm:py-24 bg-site-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:space-x-12">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <div className="inline-block px-3 py-1 text-sm font-semibold bg-site-secondary text-site-dark rounded-full mb-4">
                FOR PROJECT HEADS
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">Payroll Done in Minutes, Not Hours.</h2>
              <p className="text-xl mb-6 text-gray-200">Stop manual calculations. CrewsSite automatically aggregates verified hours by site, calculates bi-weekly pay, and provides a clear, exportable summary.</p>
              <ul className="space-y-3 text-lg">
                <li className="flex items-center"><span className="mr-2 text-site-secondary">✅</span> Automated Bi-Weekly Salary Calculation.</li>
                <li className="flex items-center"><span className="mr-2 text-site-secondary">✅</span> Exportable Data Table (CSV/Excel).</li>
                <li className="flex items-center"><span className="mr-2 text-site-secondary">✅</span> Site-Specific Hour Tracking & Management.</li>
                <li className="flex items-center"><span className="mr-2 text-site-secondary">✅</span> Automated Notifications for Missing Logs.</li>
              </ul>
              <a href="#" className="mt-8 inline-block px-6 py-3 bg-site-secondary text-site-dark font-bold rounded-lg shadow-xl hover:bg-yellow-400 transition duration-300">
                See Payroll Demo
              </a>
            </div>

            <div className="md:w-1/2">
              <div className="bg-white p-6 rounded-xl shadow-2xl">
                <p className="text-sm font-semibold text-gray-500 mb-4">PAYROLL SUMMARY: OCT 21 - NOV 3</p>
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Site</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hours</th>
                      <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Pay ($)</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr><td className="px-3 py-2">10/25</td><td className="px-3 py-2">Main Street</td><td className="px-3 py-2">8.0</td><td className="px-3 py-2 text-right font-semibold">$200.00</td></tr>
                    <tr><td className="px-3 py-2">10/26</td><td className="px-3 py-2">Lake View</td><td className="px-3 py-2">7.5</td><td className="px-3 py-2 text-right font-semibold">$187.50</td></tr>
                    <tr><td className="px-3 py-2">10/27</td><td className="px-3 py-2">Main Street</td><td className="px-3 py-2">9.0</td><td className="px-3 py-2 text-right font-semibold">$225.00</td></tr>
                    <tr className="bg-gray-100 font-bold">
                      <td className="px-3 py-2" colSpan={2}>Total for Jane Doe</td>
                      <td className="px-3 py-2">80.0</td>
                      <td className="px-3 py-2 text-right text-site-primary">$2000.00</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Apps Section */}
      <section id="apps" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-site-dark mb-4">Works Everywhere Your Team Works</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            CrewsSite is built as a highly responsive web application, ready to be installed as a Progressive Web App (PWA) on Windows, Android, and iOS.
          </p>
          <div className="flex flex-wrap justify-center items-center space-x-6">
            <div className="text-center p-4 rounded-lg"><span className="text-5xl">📱</span><p className="mt-2 text-lg font-medium">iOS (iPhone)</p></div>
            <div className="text-center p-4 rounded-lg"><span className="text-5xl">🤖</span><p className="mt-2 text-lg font-medium">Android</p></div>
            <div className="text-center p-4 rounded-lg"><span className="text-5xl">💻</span><p className="mt-2 text-lg font-medium">Windows PWA</p></div>
            <div className="text-center p-4 rounded-lg"><span className="text-5xl">🌐</span><p className="mt-2 text-lg font-medium">Web Browser</p></div>
          </div>
        </div>
      </section>

      {/* Footer / CTA */}
      <footer id="footer-cta" className="bg-site-dark pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">Join the CrewsSite Waitlist!</h3>
          <p className="text-gray-300 mb-6">Be the first to know when CrewsSite launches and get exclusive early access.</p>

          <form onSubmit={handleFormSubmit} className="max-w-md mx-auto">
            <input type="hidden" name="access_key" value="6fc7e4c7-d72d-44d2-9f79-4a9603119c31" />
            <input type="hidden" name="subject" value="New Waitlist Sign-up for CrewsSite" />

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <input 
                type="email" 
                name="email" 
                required 
                placeholder="Enter your email address" 
                className="w-full sm:w-3/5 p-3 rounded-xl border border-gray-300 focus:ring-site-secondary focus:border-site-secondary text-site-dark shadow-inner"
              />
              <button 
                type="submit" 
                disabled={buttonDisabled}
                className="w-full sm:w-2/5 px-6 py-3 bg-site-secondary text-site-dark font-bold rounded-xl shadow-lg hover:bg-yellow-400 transition duration-300 transform hover:scale-[1.02] disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Join Waitlist
              </button>
            </div>
            {formFeedback && <p className="mt-4 text-sm font-medium text-green-400">{formFeedback}</p>}
          </form>

          <div className="mt-12 border-t border-gray-700 pt-8">
            <p className="text-sm text-gray-500">&copy; 2025 CrewsSite. All rights reserved. | Built for modern teams.</p>
          </div>
        </div>
      </footer>
    </>
  )
}

export default App
