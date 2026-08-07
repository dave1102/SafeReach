import { useCallback, useEffect, useRef, useState } from 'react'

// Wraps the Web Speech API for text-to-speech and voice commands.
// Both are optional browser features — callers should check
// `supported` before showing voice UI.
export default function useSpeech({ onCommand } = {}) {
  const [listening, setListening] = useState(false)
  const recognitionRef = useRef(null)
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
  const supported = !!SpeechRecognition && 'speechSynthesis' in window

  useEffect(() => {
    if (!SpeechRecognition) return
    const recognition = new SpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = 'en-US'
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase().trim()
      onCommand?.(transcript)
    }
    recognition.onend = () => setListening(false)
    recognitionRef.current = recognition
    return () => recognition.stop()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const startListening = useCallback(() => {
    if (!recognitionRef.current) return
    setListening(true)
    recognitionRef.current.start()
  }, [])

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop()
    setListening(false)
  }, [])

  const speak = useCallback((text) => {
    if (!('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 1
    window.speechSynthesis.speak(utterance)
  }, [])

  return { supported, listening, startListening, stopListening, speak }
}
