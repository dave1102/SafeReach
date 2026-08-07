export default function ContactCard({ contact, onEdit, onDelete, onShareLocation }) {
  const call = () => window.open(`tel:${contact.phone}`, '_self')
  const sms = () => window.open(`sms:${contact.phone}`, '_self')

  return (
    <div className="glass-card p-4 flex items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="font-semibold text-mist-800 dark:text-mist-100 truncate">{contact.name}</p>
        <p className="text-sm text-mist-500 truncate">{contact.relation} · {contact.phone}</p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button onClick={call} className="btn-secondary !px-3 !py-2 text-sm" aria-label={`Call ${contact.name}`}>📞</button>
        <button onClick={sms} className="btn-outline !px-3 !py-2 text-sm" aria-label={`Text ${contact.name}`}>💬</button>
        <button onClick={() => onShareLocation(contact)} className="btn-outline !px-3 !py-2 text-sm" aria-label={`Share location with ${contact.name}`}>📍</button>
        <button onClick={() => onEdit(contact)} className="text-mist-400 hover:text-trust-600 text-sm px-1" aria-label="Edit">✏️</button>
        <button onClick={() => onDelete(contact)} className="text-mist-400 hover:text-alert-600 text-sm px-1" aria-label="Delete">🗑️</button>
      </div>
    </div>
  )
}
