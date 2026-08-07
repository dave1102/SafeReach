import { useEffect, useState } from 'react'
import useGeolocation from '../hooks/useGeolocation.js'
import { api } from '../services/api.js'
import MapView from '../components/MapView.jsx'
import HospitalList from '../components/HospitalList.jsx'

const TYPES = [
  { key: 'hospital', label: 'Hospitals' },
  { key: 'police', label: 'Police' },
  { key: 'pharmacy', label: 'Pharmacies' }
]

export default function Maps() {
  const { coords, error, refresh } = useGeolocation()
  const [type, setType] = useState('hospital')
  const [places, setPlaces] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!coords) return
    setLoading(true)
    api.getNearbyPlaces(type, coords.lat, coords.lng)
      .then((res) => setPlaces(res.places || []))
      .catch(() => setPlaces([]))
      .finally(() => setLoading(false))
  }, [coords, type])

  return (
    <div className="flex flex-col gap-4 pt-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h1 className="font-display font-bold text-2xl text-mist-800 dark:text-mist-100">Nearby Help</h1>
        <div className="flex gap-2">
          {TYPES.map((t) => (
            <button
              key={t.key}
              onClick={() => setType(t.key)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                type === t.key ? 'bg-trust-600 text-white' : 'bg-white/60 dark:bg-white/5 text-mist-600 dark:text-mist-300'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="glass-card !p-3 text-sm text-alert-700 dark:text-alert-300 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={refresh} className="btn-outline !px-3 !py-1.5 text-xs">Retry</button>
        </div>
      )}

      <MapView center={coords} places={places} radiusMeters={5000} />

      <HospitalList places={places} loading={loading} />
    </div>
  )
}
