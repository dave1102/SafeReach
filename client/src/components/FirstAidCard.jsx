import { Link } from 'react-router-dom'

const severityStyles = {
  Critical: 'bg-alert-100 text-alert-700 dark:bg-alert-500/20 dark:text-alert-300',
  High: 'bg-trust-100 text-trust-700 dark:bg-trust-500/20 dark:text-trust-300',
  Moderate: 'bg-signal-100 text-signal-700 dark:bg-signal-500/20 dark:text-signal-300'
}

export default function FirstAidCard({ guide }) {
  return (
    <Link to={`/first-aid/${guide.slug}`} className="glass-card p-5 flex flex-col gap-2 group">
      <div className="flex items-center justify-between">
        <span className="font-display font-semibold text-mist-800 dark:text-mist-100 group-hover:text-trust-700 dark:group-hover:text-trust-300">
          {guide.title}
        </span>
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${severityStyles[guide.severity]}`}>
          {guide.severity}
        </span>
      </div>
      <p className="text-sm text-mist-500 dark:text-mist-400">{guide.summary}</p>
    </Link>
  )
}
