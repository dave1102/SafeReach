import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'
import GlassCard from '../components/GlassCard.jsx'

export default function Signup() {
  const { signup, loginWithGoogle } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    setLoading(true)
    try {
      await signup(name, email, password)
      navigate('/')
    } catch (err) {
      setError(err.message.replace('Firebase: ', ''))
    } finally {
      setLoading(false)
    }
  }

  const google = async () => {
    setError('')
    try {
      await loginWithGoogle()
      navigate('/')
    } catch (err) {
      setError(err.message.replace('Firebase: ', ''))
    }
  }

  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <GlassCard className="w-full max-w-sm !p-8">
        <h1 className="font-display font-bold text-2xl text-center mb-1 text-trust-700 dark:text-trust-200">Create your account</h1>
        <p className="text-center text-sm text-mist-500 mb-6">Set up SafeReach before you need it.</p>

        <form onSubmit={submit} className="flex flex-col gap-3">
          <input required placeholder="Full name" value={name}
            onChange={(e) => setName(e.target.value)} className="input-field" />
          <input type="email" required placeholder="Email" value={email}
            onChange={(e) => setEmail(e.target.value)} className="input-field" />
          <input type="password" required placeholder="Password (min. 6 characters)" value={password}
            onChange={(e) => setPassword(e.target.value)} className="input-field" />
          {error && <p className="text-alert-600 text-sm">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full mt-1">
            {loading ? 'Creating account…' : 'Sign up'}
          </button>
        </form>

        <div className="flex items-center gap-3 my-4 text-xs text-mist-400">
          <span className="h-px bg-mist-200 dark:bg-white/10 flex-1" /> or <span className="h-px bg-mist-200 dark:bg-white/10 flex-1" />
        </div>

        <button onClick={google} className="btn-outline w-full">Continue with Google</button>

        <p className="text-center text-sm text-mist-500 mt-6">
          Already have an account? <Link to="/login" className="text-trust-600 dark:text-trust-300 font-medium">Log in</Link>
        </p>
      </GlassCard>
    </div>
  )
}
