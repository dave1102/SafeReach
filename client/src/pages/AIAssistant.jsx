import { useEffect, useRef, useState } from 'react'
import { api } from '../services/api.js'
import useSpeech from '../hooks/useSpeech.js'
import GlassCard from '../components/GlassCard.jsx'

const STARTER = {
  role: 'assistant',
  content:
    "Tell me what symptoms you're noticing, and I'll suggest possible causes, immediate first aid, and whether you should seek urgent care. I'm not a doctor — for anything severe, call emergency services right away."
}

export default function AIAssistant() {
  const [messages, setMessages] = useState([STARTER])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const { supported, listening, startListening, speak } = useSpeech({
    onCommand: (text) => setInput(text)
  })
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = async (e) => {
    e.preventDefault()
    const text = input.trim()
    if (!text || loading) return
    const nextMessages = [...messages, { role: 'user', content: text }]
    setMessages(nextMessages)
    setInput('')
    setLoading(true)
    try {
      const res = await api.askAssistant(text, nextMessages)
      setMessages((m) => [...m, { role: 'assistant', content: res.reply }])
    } catch (err) {
      setMessages((m) => [...m, {
        role: 'assistant',
        content: "I couldn't reach the assistant service. If this is urgent, please call your local emergency number now."
      }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-4 pt-4 max-w-2xl mx-auto">
      <div className="text-center">
        <h1 className="font-display font-bold text-2xl text-mist-800 dark:text-mist-100">AI Symptom Assistant</h1>
        <p className="text-xs text-mist-500 mt-1 px-4">
          For informational purposes only — not a medical diagnosis. In an emergency, call your local emergency number immediately.
        </p>
      </div>

      <GlassCard className="!p-4 h-[55vh] overflow-y-auto flex flex-col gap-3">
        {messages.map((m, i) => (
          <div key={i} className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap ${
            m.role === 'user'
              ? 'self-end bg-trust-600 text-white'
              : 'self-start bg-white/80 dark:bg-mist-700/60 text-mist-800 dark:text-mist-100'
          }`}>
            {m.content}
          </div>
        ))}
        {loading && <div className="self-start text-xs text-mist-400 px-2">Assistant is thinking…</div>}
        <div ref={bottomRef} />
      </GlassCard>

      <form onSubmit={send} className="flex items-center gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Describe your symptoms…"
          className="input-field flex-1"
        />
        {supported && (
          <button type="button" onClick={startListening} className={`btn-outline !px-3 ${listening ? 'animate-pulse' : ''}`} aria-label="Speak symptoms">
            🎙️
          </button>
        )}
        <button type="button" onClick={() => speak(messages[messages.length - 1]?.content || '')} className="btn-outline !px-3" aria-label="Read last reply aloud">
          🔈
        </button>
        <button type="submit" disabled={loading} className="btn-primary">Send</button>
      </form>
    </div>
  )
}
