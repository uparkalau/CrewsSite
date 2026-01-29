import { useState, useEffect } from 'react'

/**
 * Custom hook for managing menu state with body overflow handling
 * @returns {[boolean, Function, Function]} - menuOpen state, setMenuOpen function, and closeMenu function
 */
export function useMenuToggle() {
  const [menuOpen, setMenuOpen] = useState(false)

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

  const closeMenu = () => setMenuOpen(false)

  return [menuOpen, setMenuOpen, closeMenu]
}

/**
 * Custom hook for form submission with Web3Forms
 * @returns {object} - { feedback, isDisabled, handleSubmit }
 */
export function useFormSubmit(endpoint, accessKey) {
  const [feedback, setFeedback] = useState('')
  const [isDisabled, setIsDisabled] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsDisabled(true)
    setFeedback('')

    if (!accessKey || accessKey === 'YOUR_WEB3FORMS_ACCESS_KEY') {
      setFeedback('Please configure your Web3Forms access key to enable submissions.')
      setIsDisabled(false)
      return
    }

    try {
      const formData = new FormData(e.target)
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      })

      const result = await response.json()

      if (response.ok && result.success) {
        setFeedback('Success! We will be in touch shortly.')
        e.target.reset()
      } else {
        setFeedback(result.message || 'Oops! Something went wrong. Please try again.')
      }
    } catch (error) {
      console.error('Error:', error)
      setFeedback('A connection error occurred. Please check your network.')
    } finally {
      setTimeout(() => setIsDisabled(false), 1500)
    }
  }

  return { feedback, isDisabled, handleSubmit }
}
