import { useEffect, useState } from 'react'

// Returns the user's current position, refreshed on demand. Falls back
// to a null coords object (with an error message) if permission is
// denied or geolocation is unavailable, so callers can show a manual
// location entry instead of crashing.
export default function useGeolocation() {
  const [coords, setCoords] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  const refresh = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported on this device.')
      setLoading(false)
      return
    }
    setLoading(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setError(null)
        setLoading(false)
      },
      (err) => {
        setError(err.message)
        setLoading(false)
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  useEffect(() => { refresh() }, [])

  return { coords, error, loading, refresh }
}
