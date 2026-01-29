/**
 * Chat Service - Site crew communication
 * Handles messages between team members and project heads on each site
 */

import { db, PATHS } from '../config/firebase'
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  addDoc,
  Timestamp,
  onSnapshot,
} from 'firebase/firestore'
import { ChatMessage } from '../models/dataModels'

export const chatService = {
  /**
   * Send message to site chat
   * @param {string} siteId - Site ID
   * @param {string} userId - Sender user ID
   * @param {string} senderName - Sender display name
   * @param {string} text - Message text
   * @param {string} type - 'message' | 'alert' | 'attachment'
   * @param {string} attachmentUrl - Optional photo/file URL
   */
  sendMessage: async (siteId, userId, senderName, text, type = 'message', attachmentUrl = null) => {
    try {
      const chatRef = collection(db, PATHS.PUBLIC.CHATS(siteId))

      const messageData = {
        senderId: userId,
        senderName,
        text,
        timestamp: Timestamp.now(),
        type,
        attachmentUrl,
      }

      const docRef = await addDoc(chatRef, messageData)

      return {
        id: docRef.id,
        ...messageData,
      }
    } catch (error) {
      console.error('Error sending message:', error)
      throw error
    }
  },

  /**
   * Get recent messages from site chat
   * @param {string} siteId - Site ID
   * @param {number} limitCount - Max messages to retrieve (default 50)
   */
  getMessages: async (siteId, limitCount = 50) => {
    try {
      const chatRef = collection(db, PATHS.PUBLIC.CHATS(siteId))

      const q = query(
        chatRef,
        orderBy('timestamp', 'desc'),
        limit(limitCount)
      )

      const snapshot = await getDocs(q)
      const messages = []

      snapshot.forEach(doc => {
        messages.push({
          id: doc.id,
          ...ChatMessage.fromFirestore(doc),
        })
      })

      // Reverse to get chronological order
      return messages.reverse()
    } catch (error) {
      console.error('Error fetching messages:', error)
      throw error
    }
  },

  /**
   * Subscribe to real-time chat messages
   * @param {string} siteId - Site ID
   * @param {function} onMessageAdded - Callback when new message arrives
   */
  subscribeToChat: (siteId, onMessageAdded) => {
    try {
      const chatRef = collection(db, PATHS.PUBLIC.CHATS(siteId))

      const q = query(
        chatRef,
        orderBy('timestamp', 'desc'),
        limit(50)
      )

      // Set up real-time listener
      const unsubscribe = onSnapshot(q, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            const message = {
              id: change.doc.id,
              ...ChatMessage.fromFirestore(change.doc),
            }
            onMessageAdded(message)
          }
        })
      })

      return unsubscribe // Return function to stop listening
    } catch (error) {
      console.error('Error subscribing to chat:', error)
      throw error
    }
  },

  /**
   * Get messages in date range
   * @param {string} siteId - Site ID
   * @param {Date} startDate - Start of range
   * @param {Date} endDate - End of range
   */
  getMessageHistory: async (siteId, startDate, endDate) => {
    try {
      const chatRef = collection(db, PATHS.PUBLIC.CHATS(siteId))

      const q = query(
        chatRef,
        where('timestamp', '>=', Timestamp.fromDate(startDate)),
        where('timestamp', '<=', Timestamp.fromDate(endDate)),
        orderBy('timestamp', 'asc')
      )

      const snapshot = await getDocs(q)
      const messages = []

      snapshot.forEach(doc => {
        messages.push({
          id: doc.id,
          ...ChatMessage.fromFirestore(doc),
        })
      })

      return messages
    } catch (error) {
      console.error('Error fetching message history:', error)
      throw error
    }
  },

  /**
   * Send alert/notification to crew
   * Used for missing reports, attendance issues, etc.
   */
  sendAlert: async (siteId, alertMessage) => {
    try {
      return await chatService.sendMessage(
        siteId,
        'system',
        'CrewsSite System',
        alertMessage,
        'alert',
        null
      )
    } catch (error) {
      console.error('Error sending alert:', error)
      throw error
    }
  },
}
