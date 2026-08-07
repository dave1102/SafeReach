import { useRef, useState } from 'react'

// Emergency flashlight. Browsers don't expose the torch API on most
// devices/desktops, so this uses the display itself (a full-white
// screen) as a reliable fallback that works everywhere, and attempts
// the real camera torch track where supported.
export default function FlashlightButton() {
  const [on, setOn] = useState(false)
  const trackRef = useRef(null)

  const toggle = async () => {
    if (!on) {
      try {
        const stream = await navigator.mediaDevices?.getUserMedia({
          video: { facingMode: 'environment' }
        })
        const track = stream?.getVideoTracks?.()[0]
        if (track && track.getCapabilities?.().torch) {
          await track.applyConstraints({ advanced: [{ torch: true }] })
          trackRef.current = track
        }
      } catch {
        // No torch API available — screen-flash fallback below still works.
      }
    } else if (trackRef.current) {
      await trackRef.current.applyConstraints({ advanced: [{ torch: false }] }).catch(() => {})
      trackRef.current.stop()
      trackRef.current = null
    }
    setOn((v) => !v)
  }

  return (
    <>
      <button onClick={toggle} className="btn-outline w-full">
        🔦 {on ? 'Turn off flashlight' : 'Emergency flashlight'}
      </button>
      {on && (
        <div
          className="fixed inset-0 z-[100] bg-white flex items-center justify-center"
          onClick={toggle}
          role="button"
          aria-label="Tap to turn off flashlight"
        >
          <p className="text-mist-800 font-medium">Tap anywhere to turn off</p>
        </div>
      )}
    </>
  )
}
