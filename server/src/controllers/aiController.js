import fetch from 'node-fetch'

// System prompt keeps the assistant firmly in "informational triage"
// territory: possible causes + first aid + urgency guidance, always
// paired with a disclaimer, never a diagnosis.
const SYSTEM_PROMPT = `You are the Overflow AI AI Assistant, a calm, careful first-aid and
symptom-information helper embedded in an emergency-preparedness app.

For every message describing symptoms:
1. Briefly acknowledge what the person described.
2. List 2-4 *possible* general causes/conditions, clearly framed as possibilities, not a diagnosis.
3. Give clear, immediate first-aid steps they can take right now.
4. State plainly when they should seek urgent/emergency care instead of waiting, and if anything
   sounds life-threatening (difficulty breathing, chest pain, severe bleeding, stroke signs, loss
   of consciousness), lead with telling them to call emergency services immediately.
5. Always include a short reminder that you are not a doctor and this is not a medical diagnosis.

Keep responses concise, plain-language, and calm — the person may be scared or in pain. Never
provide dosages for prescription-only medication. If the message is not health-related, gently
redirect to how you can help with symptoms or first aid.`

async function callGemini(message, history) {
  const contents = [
    ...history
      .filter((m) => m.role === 'user' || m.role === 'assistant')
      .map((m) => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }] })),
  ]

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents
      })
    }
  )
  const data = await res.json()
  if (!res.ok) throw new Error(data.error?.message || 'Gemini request failed')
  return data.candidates?.[0]?.content?.parts?.map((p) => p.text).join('') || ''
}

async function callOpenAI(message, history) {
  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...history
      .filter((m) => m.role === 'user' || m.role === 'assistant')
      .map((m) => ({ role: m.role, content: m.content }))
  ]

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({ model: 'gpt-4o-mini', messages, temperature: 0.4 })
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error?.message || 'OpenAI request failed')
  return data.choices?.[0]?.message?.content || ''
}

export async function askAssistant(req, res, next) {
  try {
    const { message, history = [] } = req.body
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ message: 'A "message" string is required.' })
    }

    let reply
    if (process.env.GEMINI_API_KEY) {
      reply = await callGemini(message, history)
    } else if (process.env.OPENAI_API_KEY) {
      reply = await callOpenAI(message, history)
    } else {
      return res.status(503).json({
        message: 'AI assistant is not configured. Set GEMINI_API_KEY or OPENAI_API_KEY on the server.'
      })
    }

    res.json({ reply })
  } catch (err) {
    next(err)
  }
}
