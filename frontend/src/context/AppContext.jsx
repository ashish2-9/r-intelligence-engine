// =============================================================================
// src/context/AppContext.jsx
// Global app state: analysis result, user location, connection status.
// =============================================================================

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { checkHealth, getUserLocation } from '../api/client'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [analysisResult, setAnalysisResult]   = useState(null)
  const [analysisRequest, setAnalysisRequest] = useState(null)
  const [apiConnected, setApiConnected]       = useState(null)  // null=checking
  const [userLocation, setUserLocation]       = useState(null)
  const [locationLoading, setLocationLoading] = useState(false)

  // ── Check API health on mount ─────────────────────────────────────────────
  useEffect(() => {
    checkHealth()
      .then(() => setApiConnected(true))
      .catch(() => setApiConnected(false))

    // Re-check every 30s
    const interval = setInterval(() => {
      checkHealth()
        .then(() => setApiConnected(true))
        .catch(() => setApiConnected(false))
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  // ── Auto-detect location on mount ─────────────────────────────────────────
  useEffect(() => {
    setLocationLoading(true)
    getUserLocation()
      .then(loc => setUserLocation(loc))
      .catch(() => {
        // Default to Mumbai if location fails
        setUserLocation({ city: 'Mumbai', country: 'India', lat: 19.076, lon: 72.877 })
      })
      .finally(() => setLocationLoading(false))
  }, [])

  const clearResult = useCallback(() => {
    setAnalysisResult(null)
    setAnalysisRequest(null)
  }, [])

  return (
    <AppContext.Provider value={{
      analysisResult, setAnalysisResult,
      analysisRequest, setAnalysisRequest,
      apiConnected,
      userLocation,
      locationLoading,
      clearResult,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside AppProvider')
  return ctx
}
