import { useFormSubmit } from '../hooks/useCustom'
import { FORM_CONFIG } from '../constants/config'

function Footer() {
  const { feedback, isDisabled, handleSubmit } = useFormSubmit(FORM_CONFIG.endpoint, FORM_CONFIG.accessKey)

  return (
    <footer id="footer-cta" className="bg-site-dark pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h3 className="text-3xl font-bold text-white mb-4">Join the CrewsSite Waitlist!</h3>
        <p className="text-gray-300 mb-6">Be the first to know when CrewsSite launches and get exclusive early access.</p>

        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <input type="hidden" name="access_key" value={FORM_CONFIG.accessKey} />
          <input type="hidden" name="subject" value={FORM_CONFIG.subject} />

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
              disabled={isDisabled}
              className="w-full sm:w-2/5 px-6 py-3 bg-site-secondary text-site-dark font-bold rounded-xl shadow-lg hover:bg-yellow-400 transition duration-300 transform hover:scale-[1.02] disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Join Waitlist
            </button>
          </div>
          {feedback && <p className="mt-4 text-sm font-medium text-green-400">{feedback}</p>}
        </form>

        <div className="mt-12 border-t border-gray-700 pt-8">
          <p className="text-sm text-gray-500">&copy; 2025 CrewsSite. All rights reserved. | Built for modern teams.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
