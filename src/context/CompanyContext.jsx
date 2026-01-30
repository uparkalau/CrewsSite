import { createContext, useContext, useState, useEffect } from 'react'
import { getFirestore, doc, getDoc } from 'firebase/firestore'
import { useAuth } from './AuthContext'

/* eslint-disable react-refresh/only-export-components */
/**
 * CompanyContext - Manages selected company/site context
 * Enables multi-tenancy and site switching
 * Phase 3+: Add site selection switcher
 */
const CompanyContext = createContext()

export function CompanyProvider({ children }) {
  const { user, companyId: userCompanyId } = useAuth()
  const [company, setCompany] = useState(null)
  const [sites, setSites] = useState([])
  const [selectedSite, setSelectedSite] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Load company metadata when user logs in
  useEffect(() => {
    const loadCompany = async () => {
      if (!user || !userCompanyId) {
        setCompany(null)
        setSites([])
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const db = getFirestore()
        const companyDoc = await getDoc(doc(db, 'companies', userCompanyId))
        
        if (companyDoc.exists()) {
          const companyData = {
            id: companyDoc.id,
            ...companyDoc.data()
          }
          setCompany(companyData)
          
          // Phase 2+: Load sites from companies/{companyId}/sites
          // For now, just stub the structure
          setSites([])
          setSelectedSite(null)
        }
      } catch (err) {
        console.error('Failed to load company:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadCompany()
  }, [user, userCompanyId])

  const value = {
    company,
    sites,
    selectedSite,
    setSelectedSite,
    loading,
    error,
  }

  return <CompanyContext.Provider value={value}>{children}</CompanyContext.Provider>
}

export function useCompany() {
  const context = useContext(CompanyContext)
  if (!context) {
    throw new Error('useCompany must be used within CompanyProvider')
  }
  return context
}
