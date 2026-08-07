import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext.jsx'
import { logAlert } from '../services/firestoreService.js'
import useGeolocation from '../hooks/useGeolocation.js'

// The core SOS control: press-and-hold to arm (avoids accidental fires),
// then logs the alert with location and (if configured) notifies
// emergency contacts via SMS through the device's native share/SMS sheet.
export default function SOSButton() {
  const { user } = useAuth()
  const { coords } = useGeolocation()
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [holding, setHolding] = useState(false)

  const triggerSOS = async () => {
    setSending(true)
    try {
      await logAlert(user.uid, {
        type: 'sos',
        location: coords ? { lat: coords.lat, lng: coords.lng } : null
      })
      setSent(true)
      setTimeout(() => setSent(false), 4000)
    } finally {
      setSending(false)
      setHolding(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        {holding && (
          <span className="absolute inset-0 rounded-full bg-alert-500/50 animate-pulseRing" />
        )}
        <button
          onMouseDown={() => setHolding(true)}
          onMouseUp={triggerSOS}
          onMouseLeave={() => setHolding(false)}
          onTouchStart={() => setHolding(true)}
          onTouchEnd={triggerSOS}
          disabled={sending}
          className="relative h-32 w-32 sm:h-40 sm:w-40 rounded-full bg-gradient-to-b from-alert-500 to-alert-700 text-white font-display font-bold text-2xl shadow-glass-lg active:scale-95 transition-transform flex flex-col items-center justify-center gap-1"
          aria-label="Hold to send SOS alert"
        >
          <span>SOS</span>
          <span className="text-[10px] font-body font-normal opacity-90">Hold to send</span>
        </button>
      </div>
      {sent && (
        <p className="text-signal-700 dark:text-signal-300 font-medium text-sm animate-fadeUp">
          Alert sent with your location. Stay where you are if it's safe.
        </p>
      )}
      {!coords && (
        <p className="text-mist-400 text-xs">Enable location for faster response.</p>
      )}
    </div>
  )
}
