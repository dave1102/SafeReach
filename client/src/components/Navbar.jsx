import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'
import { useTheme } from '../contexts/ThemeContext.jsx'

const links = [
  { to: '/', label: 'Dashboard' },
  { to: '/assistant', label: 'AI Assistant' },
  { to: '/contacts', label: 'Contacts' },
  { to: '/first-aid', label: 'First Aid' },
  { to: '/maps', label: 'Maps' },
  { to: '/missing-persons', label: 'Missing' },
  { to: '/blood-donation', label: 'Blood' }
]

export default function Navbar() {
  const { user, isAdmin, logout } = useAuth()
  const { dark, toggleDark, largeText, toggleLargeText } = useTheme()
  const navigate = useNavigate()

  if (!user) {
    return (
      <header className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <span className="font-display font-bold text-xl text-trust-700 dark:text-trust-200">
          SafeReach
        </span>
        <button onClick={toggleDark} className="btn-outline !px-3 !py-2" aria-label="Toggle dark mode">
          {dark ? '☀️' : '🌙'}
        </button>
      </header>
    )
  }

  return (
    <header className="sticky top-0 z-40 backdrop-blur-lg bg-white/60 dark:bg-mist-900/60 border-b border-white/40 dark:border-white/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
        <NavLink to="/" className="font-display font-bold text-xl text-trust-700 dark:text-trust-200 shrink-0">
          SafeReach
        </NavLink>

        <nav className="hidden md:flex items-center gap-1 overflow-x-auto">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) =>
                `px-3 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-trust-600 text-white'
                    : 'text-mist-600 dark:text-mist-300 hover:bg-trust-50 dark:hover:bg-white/5'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
          {isAdmin && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `px-3 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                  isActive ? 'bg-signal-600 text-white' : 'text-signal-700 dark:text-signal-300 hover:bg-signal-50 dark:hover:bg-white/5'
                }`
              }
            >
              Admin
            </NavLink>
          )}
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          <button onClick={toggleLargeText} className="btn-outline !px-3 !py-2 text-xs" aria-pressed={largeText} title="Large text mode">
            A+
          </button>
          <button onClick={toggleDark} className="btn-outline !px-3 !py-2" aria-label="Toggle dark mode">
            {dark ? '☀️' : '🌙'}
          </button>
          <button onClick={() => logout().then(() => navigate('/login'))} className="btn-outline !px-3 !py-2 text-sm">
            Log out
          </button>
        </div>
      </div>

      <nav className="md:hidden flex gap-1 overflow-x-auto px-4 pb-3">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.to === '/'}
            className={({ isActive }) =>
              `px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${
                isActive ? 'bg-trust-600 text-white' : 'bg-white/50 dark:bg-white/5 text-mist-600 dark:text-mist-300'
              }`
            }
          >
            {l.label}
          </NavLink>
        ))}
      </nav>
    </header>
  )
}
