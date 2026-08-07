import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext.jsx'
import { subscribeToRecentAlerts } from '../services/firestoreService.js'
import { api } from '../services/api.js'
import useGeolocation from '../hooks/useGeolocation.js'
import useOffline from '../hooks/useOffline.js'
import SOSButton from '../components/SOSButton.jsx'
import FlashlightButton from '../components/FlashlightButton.jsx'
import AlarmButton from '../components/AlarmButton.jsx'
import VoiceCommandButton from '../components/VoiceCommandButton.jsx'
import HospitalList from '../components/HospitalList.jsx'
import GlassCard from '../components/GlassCard.jsx'
import { Link } from 'react-router-dom'

export default function Dashboard() {
  const { profile } = useAuth()
  const { coords } = useGeolocation()
  const offline = useOffline()
  const [hospitals, setHospitals] = useState([])
  const [loadingPlaces, setLoadingPlaces] = useState(false)

  useEffect(() => {
    if (!coords) return
    setLoadingPlaces(true)
    api.getNearbyPlaces('hospital', coords.lat, coords.lng)
      .then((res) => setHospitals(res.places?.slice(0, 4) || []))
      .catch(() => setHospitals([]))
      .finally(() => setLoadingPlaces(false))
  }, [coords])

  return (
    <div className="flex flex-col gap-6 pt-4">
      {offline && (
        <div className="glass-card !p-3 text-sm text-center text-trust-700 dark:text-trust-200 bg-trust-50/70 dark:bg-white/5">
          You're offline — showing cached first aid guides, contacts, and hospitals.
        </div>
      )}

      <div className="text-center">
        <h1 className="font-display font-bold text-2xl text-mist-800 dark:text-mist-100">
          Hi {profile?.name?.split(' ')[0] || 'there'}, help is one tap away
        </h1>
        <p className="text-sm text-mist-500 mt-1">Hold the button below for 1 second to send an SOS alert.</p>
      </div>

      <div className="flex justify-center">
        <SOSButton />
      </div>

      <div className="grid sm:grid-cols-3 gap-3">
        <FlashlightButton />
        <AlarmButton />
        <div className="flex justify-center">
          <VoiceCommandButton />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <GlassCard>
          <div className="flex items-center justify-between mb-3">
            <h2 className="section-title">Nearby hospitals</h2>
            <Link to="/maps" className="text-xs text-trust-600 dark:text-trust-300 font-medium">See map →</Link>
          </div>
          <HospitalList places={hospitals} loading={loadingPlaces} emptyLabel="Enable location to find nearby hospitals." />
        </GlassCard>

        <GlassCard>
          <div className="flex items-center justify-between mb-3">
            <h2 className="section-title">Quick access</h2>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Link to="/first-aid" className="btn-outline justify-center">🩹 First aid</Link>
            <Link to="/contacts" className="btn-outline justify-center">👥 Contacts</Link>
            <Link to="/assistant" className="btn-outline justify-center">🤖 AI assistant</Link>
            <Link to="/missing-persons" className="btn-outline justify-center">🔎 Missing</Link>
          </div>
        </GlassCard>
      </div>

      <GlassCard>
        <h2 className="section-title mb-3">Recent alerts</h2>
        <RecentAlerts />
      </GlassCard>
    </div>
  )
}

function RecentAlerts() {
  const { user } = useAuth()
  const [alerts, setAlerts] = useState([])

  useEffect(() => {
    if (!user) return
    return subscribeToRecentAlerts(user.uid, setAlerts)
  }, [user])

  if (!alerts.length) {
    return <p className="text-sm text-mist-500">No alerts yet — your SOS presses and shared locations will show up here.</p>
  }

  return (
    <ul className="flex flex-col gap-2">
      {alerts.map((a) => (
        <li key={a.id} className="flex items-center justify-between text-sm py-2 border-b border-mist-100 dark:border-white/5 last:border-0">
          <span className="capitalize text-mist-700 dark:text-mist-200">{a.type.replace('_', ' ')}</span>
          <span className="text-mist-400 text-xs">
            {a.createdAt?.toDate ? a.createdAt.toDate().toLocaleString() : 'Just now'}
          </span>
        </li>
      ))}
    </ul>
  )
}
