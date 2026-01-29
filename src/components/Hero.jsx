function Hero() {
  return (
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
            <img 
              src="https://placehold.co/800x450/1D4ED8/ffffff?text=CrewsSite+App+Mockup+-+Time+Entry+%26+Photo+Report" 
              alt="CrewsSite App"
              className="rounded-lg shadow-xl w-full"
              onError={(e) => e.target.src = 'https://placehold.co/800x450/374151/E5E7EB?text=CrewsSite+App+Screen'}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
