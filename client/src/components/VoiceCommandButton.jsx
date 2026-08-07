import useSpeech from '../hooks/useSpeech.js'
import { useNavigate } from 'react-router-dom'

// Basic voice-command navigation: "open first aid", "call emergency
// contacts", "start SOS" etc. Extend the matcher below for more phrases.
export default function VoiceCommandButton() {
  const navigate = useNavigate()

  const handleCommand = (transcript) => {
    if (transcript.includes('first aid')) navigate('/first-aid')
    else if (transcript.includes('contact')) navigate('/contacts')
    else if (transcript.includes('map') || transcript.includes('hospital')) navigate('/maps')
    else if (transcript.includes('assistant') || transcript.includes('symptom')) navigate('/assistant')
    else if (transcript.includes('sos') || transcript.includes('emergency')) navigate('/')
  }

  const { supported, listening, startListening, speak } = useSpeech({ onCommand: (t) => {
    handleCommand(t)
    speak(`Opening ${t}`)
  }})

  if (!supported) return null

  return (
    <button
      onClick={startListening}
      className={`btn-outline !px-3 !py-2 ${listening ? 'animate-pulse border-trust-500' : ''}`}
      aria-label="Voice command"
      title="Try: 'open first aid', 'open contacts', 'open maps'"
    >
      🎙️
    </button>
  )
}
