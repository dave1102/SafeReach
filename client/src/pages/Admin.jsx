import { useEffect, useState } from 'react'
import { api } from '../services/api.js'
import GlassCard from '../components/GlassCard.jsx'

export default function Admin() {
  const [analytics, setAnalytics] = useState(null)
  const [pending, setPending] = useState([])
  const [error, setError] = useState('')

  const load = () => {
    api.getAnalytics().then(setAnalytics).catch((e) => setError(e.message))
    api.listHospitalSubmissions().then(setPending).catch((e) => setError(e.message))
  }

  useEffect(load, [])

  const decide = async (id, approve) => {
    await (approve ? api.approveHospital(id) : api.rejectHospital(id))
    load()
  }

  return (
    <div className="flex flex-col gap-6 pt-4">
      <h1 className="font-display font-bold text-2xl text-mist-800 dark:text-mist-100">Admin Panel</h1>
      {error && <p className="text-alert-600 text-sm">{error}</p>}

      <div className="grid sm:grid-cols-3 gap-3">
        <StatCard label="Total users" value={analytics?.totalUsers ?? '—'} />
        <StatCard label="SOS alerts (30d)" value={analytics?.sosLast30Days ?? '—'} />
        <StatCard label="Active community alerts" value={analytics?.activeAlerts ?? '—'} />
      </div>

      <GlassCard>
        <h2 className="section-title mb-3">Hospital verification queue</h2>
        {!pending.length ? (
          <p className="text-sm text-mist-500">No pending hospital submissions.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {pending.map((h) => (
              <li key={h.id} className="flex items-center justify-between gap-3 border-b border-mist-100 dark:border-white/5 py-2 last:border-0">
                <div className="min-w-0">
                  <p className="font-medium text-mist-800 dark:text-mist-100 truncate">{h.name}</p>
                  <p className="text-xs text-mist-500 truncate">{h.address}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => decide(h.id, true)} className="btn-secondary !px-3 !py-1.5 text-xs">Approve</button>
                  <button onClick={() => decide(h.id, false)} className="btn-outline !px-3 !py-1.5 text-xs">Reject</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </GlassCard>
    </div>
  )
}

function StatCard({ label, value }) {
  return (
    <GlassCard className="text-center">
      <p className="text-3xl font-display font-bold text-trust-700 dark:text-trust-200">{value}</p>
      <p className="text-sm text-mist-500 mt-1">{label}</p>
    </GlassCard>
  )
}
