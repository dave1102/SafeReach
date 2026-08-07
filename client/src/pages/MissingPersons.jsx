import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext.jsx'
import { subscribeToPublicAlerts, createPublicAlert } from '../services/firestoreService.js'
import AlertCard from '../components/AlertCard.jsx'
import Modal from '../components/Modal.jsx'

const emptyForm = { title: '', description: '', location: '', contactPhone: '' }

export default function MissingPersons() {
  const { user } = useAuth()
  const [alerts, setAlerts] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)

  useEffect(() => subscribeToPublicAlerts('missing_person', setAlerts), [])

  const submit = async (e) => {
    e.preventDefault()
    await createPublicAlert(user.uid, { ...form, category: 'missing_person' })
    setForm(emptyForm)
    setModalOpen(false)
  }

  return (
    <div className="flex flex-col gap-4 pt-4">
      <div className="flex items-center justify-between">
        <h1 className="font-display font-bold text-2xl text-mist-800 dark:text-mist-100">Missing Person Alerts</h1>
        <button onClick={() => setModalOpen(true)} className="btn-primary">+ Report</button>
      </div>
      <p className="text-sm text-mist-500">Community-reported alerts. Always contact local authorities for official missing person cases.</p>

      {!alerts.length ? (
        <p className="text-sm text-mist-500">No active alerts in your area right now.</p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-3">
          {alerts.map((a) => <AlertCard key={a.id} alert={a} />)}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Report a missing person">
        <form onSubmit={submit} className="flex flex-col gap-3">
          <input required placeholder="Name / short title" value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-field" />
          <textarea required placeholder="Description (age, appearance, last seen wearing…)" value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field min-h-24" />
          <input required placeholder="Last known location" value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })} className="input-field" />
          <input required type="tel" placeholder="Contact phone" value={form.contactPhone}
            onChange={(e) => setForm({ ...form, contactPhone: e.target.value })} className="input-field" />
          <button type="submit" className="btn-primary w-full mt-1">Publish alert</button>
        </form>
      </Modal>
    </div>
  )
}
