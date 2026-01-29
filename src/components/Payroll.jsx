import { PAYROLL_DATA, PAYROLL_TOTAL } from '../constants/config'

function Payroll() {
  return (
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
                  {PAYROLL_DATA.map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2">{row.date}</td>
                      <td className="px-3 py-2">{row.site}</td>
                      <td className="px-3 py-2">{row.hours}</td>
                      <td className="px-3 py-2 text-right font-semibold">${row.pay.toFixed(2)}</td>
                    </tr>
                  ))}
                  <tr className="bg-gray-100 font-bold">
                    <td className="px-3 py-2" colSpan={2}>Total for Jane Doe</td>
                    <td className="px-3 py-2">{PAYROLL_TOTAL.hours}</td>
                    <td className="px-3 py-2 text-right text-site-primary">${PAYROLL_TOTAL.pay.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Payroll
