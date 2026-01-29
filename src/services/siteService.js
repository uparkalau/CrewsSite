/**
 * Site Management Service - Project Head operations
 * Manage sites, crew assignments, and site-specific settings
 */

import { db, PATHS, ROLES } from '../config/firebase'
import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  getDocs,
  query,
  where,
  GeoPoint,
  Timestamp,
} from 'firebase/firestore'
import { Site } from '../models/dataModels'
import { authService } from './authService'

export const siteService = {
  /**
   * Create new site (Project Head only)
   * @param {string} managerId - Project Head user ID
   * @param {string} siteName - Site name
   * @param {number} lat - Site latitude
   * @param {number} lon - Site longitude
   * @param {number} radius - Geofence radius in meters (default 200)
   */
  createSite: async (managerId, siteName, lat, lon, radius = 200) => {
    try {
      // Verify user is Project Head
      const { role } = await authService.checkUserRole(managerId)
      if (role !== ROLES.PROJECT_HEAD) {
        throw new Error('Only Project Heads can create sites')
      }

      const sitesRef = collection(db, PATHS.PUBLIC.SITES)
      const siteId = `${siteName.replace(/\s+/g, '_')}_${Date.now()}`

      const siteData = new Site({
        name: siteName,
        location: new GeoPoint(lat, lon),
        radius,
        activeCrew: [],
        managerId,
      })

      await setDoc(doc(sitesRef, siteId), siteData.toFirestore())

      return { id: siteId, ...siteData }
    } catch (error) {
      console.error('Error creating site:', error)
      throw error
    }
  },

  /**
   * Get site details
   * @param {string} siteId - Site ID
   */
  getSite: async (siteId) => {
    try {
      const siteRef = doc(db, PATHS.PUBLIC.SITES, siteId)
      const siteSnap = await getDoc(siteRef)

      if (!siteSnap.exists()) {
        throw new Error('Site not found')
      }

      return {
        id: siteSnap.id,
        ...Site.fromFirestore(siteSnap),
      }
    } catch (error) {
      console.error('Error fetching site:', error)
      throw error
    }
  },

  /**
   * Get all sites managed by a Project Head
   * @param {string} managerId - Project Head user ID
   */
  getSitesByManager: async (managerId) => {
    try {
      const sitesRef = collection(db, PATHS.PUBLIC.SITES)
      const q = query(sitesRef, where('managerId', '==', managerId))

      const snapshot = await getDocs(q)
      const sites = []

      snapshot.forEach(doc => {
        sites.push({
          id: doc.id,
          ...Site.fromFirestore(doc),
        })
      })

      return sites
    } catch (error) {
      console.error('Error fetching sites:', error)
      throw error
    }
  },

  /**
   * Update site details
   * @param {string} siteId - Site ID
   * @param {object} updates - Fields to update {name, location, radius}
   */
  updateSite: async (siteId, updates) => {
    try {
      const siteRef = doc(db, PATHS.PUBLIC.SITES, siteId)

      // Prepare update data
      const updateData = {}
      if (updates.name) updateData.name = updates.name
      if (updates.location) updateData.location = new GeoPoint(updates.location.lat, updates.location.lon)
      if (updates.radius) updateData.radius = updates.radius

      await updateDoc(siteRef, updateData)

      return await siteService.getSite(siteId)
    } catch (error) {
      console.error('Error updating site:', error)
      throw error
    }
  },

  /**
   * Add crew member to site
   * @param {string} siteId - Site ID
   * @param {string} userId - Team member user ID
   */
  addCrewMember: async (siteId, userId) => {
    try {
      const siteRef = doc(db, PATHS.PUBLIC.SITES, siteId)
      const siteSnap = await getDoc(siteRef)

      if (!siteSnap.exists()) {
        throw new Error('Site not found')
      }

      const site = Site.fromFirestore(siteSnap)

      // Check if user already in crew
      if (site.activeCrew.includes(userId)) {
        return site
      }

      // Add user to crew
      site.activeCrew.push(userId)

      await updateDoc(siteRef, {
        activeCrew: site.activeCrew,
      })

      return site
    } catch (error) {
      console.error('Error adding crew member:', error)
      throw error
    }
  },

  /**
   * Remove crew member from site
   * @param {string} siteId - Site ID
   * @param {string} userId - Team member user ID
   */
  removeCrewMember: async (siteId, userId) => {
    try {
      const siteRef = doc(db, PATHS.PUBLIC.SITES, siteId)
      const siteSnap = await getDoc(siteRef)

      if (!siteSnap.exists()) {
        throw new Error('Site not found')
      }

      const site = Site.fromFirestore(siteSnap)

      // Remove user from crew
      site.activeCrew = site.activeCrew.filter(id => id !== userId)

      await updateDoc(siteRef, {
        activeCrew: site.activeCrew,
      })

      return site
    } catch (error) {
      console.error('Error removing crew member:', error)
      throw error
    }
  },

  /**
   * Get all active crew members at site
   * @param {string} siteId - Site ID
   */
  getCrewForSite: async (siteId) => {
    try {
      const site = await siteService.getSite(siteId)
      const crewProfiles = []

      for (const userId of site.activeCrew) {
        const profile = await authService.getUserProfile(userId)
        if (profile) {
          crewProfiles.push({
            userId,
            ...profile,
          })
        }
      }

      return crewProfiles
    } catch (error) {
      console.error('Error fetching crew:', error)
      throw error
    }
  },

  /**
   * Update geofence radius (for fine-tuning attendance validation)
   * @param {string} siteId - Site ID
   * @param {number} newRadius - New radius in meters
   */
  updateGeofence: async (siteId, newRadius) => {
    try {
      const siteRef = doc(db, PATHS.PUBLIC.SITES, siteId)

      await updateDoc(siteRef, {
        radius: newRadius,
      })

      return await siteService.getSite(siteId)
    } catch (error) {
      console.error('Error updating geofence:', error)
      throw error
    }
  },
}
