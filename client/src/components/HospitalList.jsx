export default function HospitalList({ places = [], loading, emptyLabel = 'No results nearby yet.' }) {
  if (loading) {
    return <p className="text-sm text-mist-500 px-1">Searching nearby…</p>
  }
  if (!places.length) {
    return <p className="text-sm text-mist-500 px-1">{emptyLabel}</p>
  }
  return (
    <ul className="flex flex-col gap-2">
      {places.map((p) => (
        <li key={p.id} className="glass-card !p-4 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="font-medium text-mist-800 dark:text-mist-100 truncate">{p.name}</p>
            <p className="text-xs text-mist-500 truncate">{p.address}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {p.distanceKm != null && (
              <span className="text-xs font-semibold text-trust-700 dark:text-trust-300 bg-trust-50 dark:bg-white/5 px-2 py-1 rounded-full">
                {p.distanceKm.toFixed(1)} km
              </span>
            )}
            <a
              href={`https://www.openstreetmap.org/directions?to=${p.lat},${p.lng}`}
              target="_blank" rel="noreferrer"
              className="btn-outline !px-3 !py-1.5 text-xs"
            >
              Directions
            </a>
          </div>
        </li>
      ))}
    </ul>
  )
}
