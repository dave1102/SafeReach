const badgeByCategory = {
  missing_person: 'bg-trust-100 text-trust-700 dark:bg-trust-500/20 dark:text-trust-300',
  blood_donation: 'bg-alert-100 text-alert-700 dark:bg-alert-500/20 dark:text-alert-300'
}

export default function AlertCard({ alert }) {
  return (
    <div className="glass-card p-5 flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-semibold text-mist-800 dark:text-mist-100">{alert.title}</h3>
        <span className={`text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap ${badgeByCategory[alert.category] || 'bg-mist-100 text-mist-700'}`}>
          {alert.category === 'missing_person' ? 'Missing person' : 'Blood needed'}
        </span>
      </div>
      <p className="text-sm text-mist-600 dark:text-mist-300">{alert.description}</p>
      <div className="flex items-center justify-between text-xs text-mist-400 pt-1">
        <span>{alert.location}</span>
        {alert.contactPhone && (
          <a href={`tel:${alert.contactPhone}`} className="text-trust-600 dark:text-trust-300 font-medium">
            Call contact
          </a>
        )}
      </div>
    </div>
  )
}
