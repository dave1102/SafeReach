import { useState } from 'react'
import firstAidGuides from '../data/firstAidData.js'
import FirstAidCard from '../components/FirstAidCard.jsx'

export default function FirstAid() {
  const [query, setQuery] = useState('')
  const filtered = firstAidGuides.filter((g) =>
    g.title.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="flex flex-col gap-4 pt-4">
      <div>
        <h1 className="font-display font-bold text-2xl text-mist-800 dark:text-mist-100">First Aid Library</h1>
        <p className="text-sm text-mist-500 mt-1">
          Step-by-step guidance for common emergencies. Available offline. This is general
          information, not a substitute for professional medical training or emergency services.
        </p>
      </div>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search guides…"
        className="input-field"
      />

      <div className="grid sm:grid-cols-2 gap-3">
        {filtered.map((g) => (
          <FirstAidCard key={g.slug} guide={g} />
        ))}
      </div>
    </div>
  )
}
