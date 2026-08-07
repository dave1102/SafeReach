import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext.jsx'
import { subscribeToPublicAlerts, createPublicAlert } from '../services/firestoreService.js'
import AlertCard from '../components/AlertCard.jsx'
import Modal from '../components/Modal.jsx'

const emptyForm = { title: '', description: '', location: '', contactPhone: '' }
const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

export default function BloodDonation() {
  const { user } = useAuth()
  const [alerts, setAlerts] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [bloodType, setBloodType] = useState('O+')

  useEffect(() => subscribeToPublicAlerts('blood_donation', setAlerts), [])

  const submit = async (e) => {
    e.preventDefault()
    await createPublicAlert(user.uid, {
      ...form,
      title: `${bloodType} needed — ${form.title}`,
      category: 'blood_donation'
    })
    setForm(emptyForm)
    setModalOpen(false)
  }

  return (
    <div className="flex flex-col gap-4 pt-4">
      <div className="flex items-center justify-between">
        <h1 className="font-display font-bold text-2xl text-mist-800 dark:text-mist-100">Blood Donation Requests</h1>
        <button onClick={() => setModalOpen(true)} className="btn-primary">+ Request</button>
      </div>
      <p className="text-sm text-mist-500">Community-posted requests. Please verify urgent requests directly with the hospital or blood bank listed.</p>

      {!alerts.length ? (
        <p className="text-sm text-mist-500">No active requests right now.</p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-3">
          {alerts.map((a) => <AlertCard key={a.id} alert={a} />)}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Request blood donation">
        <form onSubmit={submit} className="flex flex-col gap-3">
          <select value={bloodType} onChange={(e) => setBloodType(e.target.value)} className="input-field">
            {bloodTypes.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <input required placeholder="Hospital / patient reference" value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-field" />
          <textarea required placeholder="Details (units needed, deadline…)" value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field min-h-24" />
          <input required placeholder="Hospital / city location" value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })} className="input-field" />
          <input required type="tel" placeholder="Contact phone" value={form.contactPhone}
            onChange={(e) => setForm({ ...form, contactPhone: e.target.value })} className="input-field" />
          <button type="submit" className="btn-primary w-full mt-1">Publish request</button>
        </form>
      </Modal>
    </div>
  )
}
