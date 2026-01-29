/**
 * GPS and Geolocation Utilities
 * Handles distance calculations and geofencing logic
 */

import { GEOFENCING_CONFIG } from '../constants/appConstants'

/**
 * Calculate distance between two GPS coordinates using Haversine formula
 * @param {number} latitude1 - Starting latitude in degrees
 * @param {number} longitude1 - Starting longitude in degrees
 * @param {number} latitude2 - Ending latitude in degrees
 * @param {number} longitude2 - Ending longitude in degrees
 * @returns {number} Distance in meters
 * @throws {Error} If coordinates are invalid
 */
export function calculateGpsDistance(latitude1, longitude1, latitude2, longitude2) {
  if (!isValidCoordinate(latitude1, longitude1) || !isValidCoordinate(latitude2, longitude2)) {
    throw new Error('Invalid GPS coordinates provided')
  }

  const lat1Radians = toRadians(latitude1)
  const lat2Radians = toRadians(latitude2)
  const deltaLatitude = toRadians(latitude2 - latitude1)
  const deltaLongitude = toRadians(longitude2 - longitude1)

  const haversineA = Math.sin(deltaLatitude / 2) * Math.sin(deltaLatitude / 2) +
    Math.cos(lat1Radians) * Math.cos(lat2Radians) *
    Math.sin(deltaLongitude / 2) * Math.sin(deltaLongitude / 2)

  const haversineC = 2 * Math.atan2(Math.sqrt(haversineA), Math.sqrt(1 - haversineA))

  return GEOFENCING_CONFIG.EARTH_RADIUS_METERS * haversineC
}

/**
 * Check if user location is within allowed geofence radius
 * @param {number} userLatitude - User's current latitude
 * @param {number} userLongitude - User's current longitude
 * @param {number} siteLatitude - Site center latitude
 * @param {number} siteLongitude - Site center longitude
 * @param {number} radiusMeters - Allowed radius in meters (default 200m)
 * @returns {object} Object with isWithinRadius boolean and distance in meters
 */
export function isLocationWithinGeofence(userLatitude, userLongitude, siteLatitude, siteLongitude, radiusMeters = GEOFENCING_CONFIG.DEFAULT_RADIUS_METERS) {
  const distance = calculateGpsDistance(userLatitude, userLongitude, siteLatitude, siteLongitude)
  const isWithinRadius = distance <= radiusMeters

  return {
    isWithinRadius,
    distance,
    radiusMeters,
  }
}

/**
 * Convert degrees to radians
 * @param {number} degrees - Angle in degrees
 * @returns {number} Angle in radians
 * @private
 */
function toRadians(degrees) {
  return (degrees * Math.PI) / 180
}

/**
 * Validate GPS coordinate values
 * @param {number} latitude - Latitude value (-90 to 90)
 * @param {number} longitude - Longitude value (-180 to 180)
 * @returns {boolean} True if coordinates are valid
 * @private
 */
function isValidCoordinate(latitude, longitude) {
  return (
    typeof latitude === 'number' &&
    typeof longitude === 'number' &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180
  )
}

export default {
  calculateGpsDistance,
  isLocationWithinGeofence,
}
