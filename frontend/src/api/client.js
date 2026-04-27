// =============================================================================
// src/api/client.js  —  R-Intelligence API Client
//
// All API calls go through Vite's proxy (/api → http://api:8000).
// This means the browser only ever talks to localhost:5173 — no CORS issue.
// =============================================================================

import axios from 'axios'

const api = axios.create({
  baseURL: '',   // relative — Vite proxy handles /api routing
  timeout: 60000,
  headers: { 'Content-Type': 'application/json' }
})

api.interceptors.response.use(
  res => res,
  err => {
    if (!err.response) {
      return Promise.reject({
        type: 'NETWORK_ERROR',
        message: 'Cannot reach the API. Is Docker Compose running? (docker compose up --build)'
      })
    }
    return Promise.reject({
      type: 'API_ERROR',
      status: err.response.status,
      message: err.response.data?.detail || `Server error ${err.response.status}`
    })
  }
)

// ── Health check (used by Navbar connection badge) ─────────────────────────
export const checkHealth = () =>
  api.get('/health').then(r => r.data)

// ── Auto-detect user location (FREE ip-api.com, no key needed) ────────────
export const getUserLocation = () =>
  api.get('/api/v1/location').then(r => r.data)

// ── Main analysis endpoint ─────────────────────────────────────────────────
export const analyseItem = (payload) =>
  api.post('/api/v1/analyse', payload).then(r => r.data)

// ── Behavioral nudge ───────────────────────────────────────────────────────
export const getBehavioralNudge = (userId) =>
  api.get(`/api/v1/behavioral/${userId}`).then(r => r.data)

// ── Waste prediction ───────────────────────────────────────────────────────
export const getWastePrediction = (userId) =>
  api.get(`/api/v1/predict/${userId}`).then(r => r.data)

export default api
