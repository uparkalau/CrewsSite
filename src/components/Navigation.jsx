import { useMenuToggle } from '../hooks/useCustom'
import { NAV_LINKS } from '../constants/config'

function Navigation() {
  const [menuOpen, setMenuOpen] = useMenuToggle()

  return (
    <header className="sticky top-0 z-40 bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <svg className="w-6 h-6 text-site-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 20h6M9 14h6m-3-3h.01M9 8h6m-3-3h.01" />
          </svg>
          <span className="text-xl font-bold text-site-dark">Crews<span className="text-site-primary">Site</span></span>
        </div>

        <nav className="hidden md:flex space-x-6 text-sm font-medium">
          {NAV_LINKS.slice(0, -1).map(link => (
            <a 
              key={link.href}
              href={link.href} 
              className="text-gray-600 hover:text-site-primary transition duration-150"
            >
              {link.label}
            </a>
          ))}
          <a 
            href={NAV_LINKS[3].href}
            className="text-gray-600 hover:text-site-primary transition duration-150"
          >
            {NAV_LINKS[3].label}
          </a>
        </nav>

        <a href="#" className="px-4 py-2 bg-site-primary text-white text-sm font-semibold rounded-lg shadow-md hover:bg-site-primary/90 transition duration-300 transform hover:scale-[1.02] hidden sm:inline-flex">
          Start Free Trial
        </a>

        {/* Auth buttons */}
        <div className="hidden sm:flex space-x-2">
          <a 
            href="/login"
            onClick={(e) => {
              e.preventDefault()
              window.history.pushState(null, '', '/login')
              window.dispatchEvent(new PopStateEvent('popstate'))
            }}
            className="px-4 py-2 text-site-primary font-semibold hover:bg-gray-100 rounded-lg transition"
          >
            Sign In
          </a>
          <a 
            href="/signup"
            onClick={(e) => {
              e.preventDefault()
              window.history.pushState(null, '', '/signup')
              window.dispatchEvent(new PopStateEvent('popstate'))
            }}
            className="px-4 py-2 bg-site-secondary text-site-dark font-semibold rounded-lg hover:bg-yellow-400 transition"
          >
            Sign Up
          </a>
        </div>

        <button 
          onClick={() => setMenuOpen(true)} 
          className="md:hidden p-2 rounded-lg text-site-dark hover:bg-gray-100"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

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
            {NAV_LINKS.map(link => (
              <a 
                key={link.href}
                href={link.href} 
                onClick={() => setMenuOpen(false)} 
                className="text-lg font-medium text-gray-700 hover:text-site-primary transition duration-150 p-2 rounded-lg hover:bg-gray-50"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-8">
              <a href="#" className="w-full text-center px-4 py-3 bg-site-primary text-white text-lg font-semibold rounded-lg shadow-md hover:bg-site-primary/90 transition duration-300 block">Start Free Trial</a>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Navigation
