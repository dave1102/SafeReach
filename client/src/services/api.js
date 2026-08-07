// Thin fetch wrapper for the SafeReach Express backend. Attaches the
// current user's Firebase ID token so protected routes (AI assistant,
// places search, admin) can verify the caller server-side.
import { auth } from '../firebase.js'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

async function request(path, { method = 'GET', body, auth: needsAuth = true } = {}) {
  const headers = { 'Content-Type': 'application/json' }

  if (needsAuth && auth.currentUser) {
    const token = await auth.currentUser.getIdToken()
    headers.Authorization = `Bearer ${token}`
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  })

  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}))
    throw new Error(errBody.message || `Request failed: ${res.status}`)
  }
  return res.json()
}

export const api = {
  // AI symptom assistant
  askAssistant: (message, history = []) =>
    request('/ai/assistant', { method: 'POST', body: { message, history } }),

  // Nearby hospitals / pharmacies / police via backend places proxy
  getNearbyPlaces: (type, lat, lng, radius = 5000) =>
    request(`/places/nearby?type=${type}&lat=${lat}&lng=${lng}&radius=${radius}`),

  // Missing person + blood donation alerts (public feed, backed by Firestore)
  getAlerts: (category) => request(`/alerts?category=${category}`, { auth: false }),
  createAlert: (payload) => request('/alerts', { method: 'POST', body: payload }),

  // Admin
  getAnalytics: () => request('/admin/analytics'),
  listHospitalSubmissions: () => request('/admin/hospitals/pending'),
  approveHospital: (id) => request(`/admin/hospitals/${id}/approve`, { method: 'POST' }),
  rejectHospital: (id) => request(`/admin/hospitals/${id}/reject`, { method: 'POST' })
}
