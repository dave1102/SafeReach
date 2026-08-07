import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-center">
      <h1 className="font-display font-bold text-3xl text-mist-800 dark:text-mist-100">404</h1>
      <p className="text-mist-500">That page doesn't exist.</p>
      <Link to="/" className="btn-primary">Back to Dashboard</Link>
    </div>
  )
}
