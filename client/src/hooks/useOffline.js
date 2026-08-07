import { useEffect, useState } from 'react'

// Tracks browser connectivity so the UI can show an "Offline mode"
// banner and rely on cached first-aid/contacts/hospital data instead
// of failing network requests silently.
export default function useOffline() {
  const [offline, setOffline] = useState(!navigator.onLine)

  useEffect(() => {
    const goOnline = () => setOffline(false)
    const goOffline = () => setOffline(true)
    window.addEventListener('online', goOnline)
    window.addEventListener('offline', goOffline)
    return () => {
      window.removeEventListener('online', goOnline)
      window.removeEventListener('offline', goOffline)
    }
  }, [])

  return offline
}
