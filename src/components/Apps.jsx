import { APPS } from '../constants/config'

function Apps() {
  return (
    <section id="apps" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-extrabold text-site-dark mb-4">Works Everywhere Your Team Works</h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          CrewsSite is built as a highly responsive web application, ready to be installed as a Progressive Web App (PWA) on Windows, Android, and iOS.
        </p>
        <div className="flex flex-wrap justify-center items-center space-x-6">
          {APPS.map((app, idx) => (
            <div key={idx} className="text-center p-4 rounded-lg">
              <span className="text-5xl">{app.icon}</span>
              <p className="mt-2 text-lg font-medium">{app.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Apps
