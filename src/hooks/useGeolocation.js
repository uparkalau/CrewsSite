/**
 * Custom Hook: useGeolocation
 * Manages device geolocation with error handling
 */

import { useState, useCallback } from 'react'

/**
 * Hook to handle device geolocation
 * @returns {object} Object with getCurrentLocation function and state
 */
export function useGeolocation() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [location, setLocation] = useState(null)

  /**
   * Request current user location
   * @param {object} options - Geolocation options
   * @returns {Promise<object>} Location object with latitude and longitude
   */
  const getCurrentLocation = useCallback(async (options = {}) => {
    setIsLoading(true)
    setError(null)

    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        const errorMessage = 'Geolocation is not supported by this browser'
        setError(errorMessage)
        reject(new Error(errorMessage))
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const locationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: new Date(position.timestamp),
          }

          setLocation(locationData)
          setIsLoading(false)
          resolve(locationData)
        },
        (positionError) => {
          const errorMessage = `Geolocation error: ${positionError.message}`
          setError(errorMessage)
          setIsLoading(false)
          reject(new Error(errorMessage))
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
          ...options,
        }
      )
    })
  }, [])

  return {
    location,
    isLoading,
    error,
    getCurrentLocation,
  }
}

export default useGeolocation
