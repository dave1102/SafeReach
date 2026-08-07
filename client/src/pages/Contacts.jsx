import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext.jsx'
import { subscribeToContacts, addContact, updateContact, deleteContact } from '../services/firestoreService.js'
import useGeolocation from '../hooks/useGeolocation.js'
import ContactCard from '../components/ContactCard.jsx'
import Modal from '../components/Modal.jsx'
import GlassCard from '../components/GlassCard.jsx'

const emptyForm = { name: '', phone: '', relation: '' }

export default function Contacts() {
  const { user } = useAuth()
  const { coords } = useGeolocation()
  const [contacts, setContacts] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)

  useEffect(() => {
    if (!user) return
    return subscribeToContacts(user.uid, setContacts)
  }, [user])

  const openAdd = () => { setEditing(null); setForm(emptyForm); setModalOpen(true) }
  const openEdit = (contact) => { setEditing(contact); setForm(contact); setModalOpen(true) }

  const save = async (e) => {
    e.preventDefault()
    if (editing) {
      await updateContact(user.uid, editing.id, form)
    } else {
      await addContact(user.uid, form)
    }
    setModalOpen(false)
  }

  const remove = async (contact) => {
    if (confirm(`Remove ${contact.name} from your emergency contacts?`)) {
      await deleteContact(user.uid, contact.id)
    }
  }

  const shareLocation = async (contact) => {
    const text = coords
      ? `I'm sharing my live location via SafeReach: https://www.openstreetmap.org/?mlat=${coords.lat}&mlon=${coords.lng}#map=16/${coords.lat}/${coords.lng}`
      : "I'm trying to share my location via SafeReach but it isn't available right now."
    if (navigator.share) {
      await navigator.share({ title: 'My location', text }).catch(() => {})
    } else {
      window.open(`sms:${contact.phone}?body=${encodeURIComponent(text)}`, '_self')
    }
  }

  return (
    <div className="flex flex-col gap-4 pt-4">
      <div className="flex items-center justify-between">
        <h1 className="font-display font-bold text-2xl text-mist-800 dark:text-mist-100">Emergency Contacts</h1>
        <button onClick={openAdd} className="btn-primary">+ Add contact</button>
      </div>

      {!contacts.length ? (
        <GlassCard className="text-center text-mist-500 text-sm">
          No emergency contacts yet. Add the people who should know first if something happens.
        </GlassCard>
      ) : (
        <div className="flex flex-col gap-3">
          {contacts.map((c) => (
            <ContactCard key={c.id} contact={c} onEdit={openEdit} onDelete={remove} onShareLocation={shareLocation} />
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit contact' : 'Add contact'}>
        <form onSubmit={save} className="flex flex-col gap-3">
          <input required placeholder="Full name" value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" />
          <input required type="tel" placeholder="Phone number" value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input-field" />
          <input required placeholder="Relation (e.g. Mother, Doctor)" value={form.relation}
            onChange={(e) => setForm({ ...form, relation: e.target.value })} className="input-field" />
          <button type="submit" className="btn-primary w-full mt-1">{editing ? 'Save changes' : 'Add contact'}</button>
        </form>
      </Modal>
    </div>
  )
}
