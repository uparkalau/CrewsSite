import { FEATURES } from '../constants/config'

function Features() {
  return (
    <section id="features" className="py-16 sm:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-center mb-12">
          Automate The Site, Simplify Your Day
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {FEATURES.map(feature => (
            <div 
              key={feature.id}
              className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition duration-300"
            >
              <div className="flex items-center justify-center w-12 h-12 bg-site-primary/10 text-site-primary rounded-full mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features
