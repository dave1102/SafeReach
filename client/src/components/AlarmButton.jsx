import { useRef, useState } from 'react'

// Loud alarm — generates a siren tone with the Web Audio API so it
// doesn't depend on shipping/loading an audio file.
export default function AlarmButton() {
  const [playing, setPlaying] = useState(false)
  const ctxRef = useRef(null)
  const oscRef = useRef(null)
  const intervalRef = useRef(null)

  const start = () => {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    gain.gain.value = 0.3
    osc.connect(gain).connect(ctx.destination)
    osc.start()
    let up = true
    intervalRef.current = setInterval(() => {
      osc.frequency.setValueAtTime(up ? 1200 : 700, ctx.currentTime)
      up = !up
    }, 350)
    ctxRef.current = ctx
    oscRef.current = osc
    setPlaying(true)
  }

  const stop = () => {
    clearInterval(intervalRef.current)
    oscRef.current?.stop()
    ctxRef.current?.close()
    setPlaying(false)
  }

  return (
    <button onClick={playing ? stop : start} className={playing ? 'btn-secondary w-full' : 'btn-outline w-full'}>
      🔊 {playing ? 'Stop alarm' : 'Sound loud alarm'}
    </button>
  )
}
