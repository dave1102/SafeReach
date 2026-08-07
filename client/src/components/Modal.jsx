export default function Modal({ open, onClose, title, children }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-mist-900/40 backdrop-blur-sm" onClick={onClose}>
      <div
        className="glass-panel w-full max-w-md p-6 bg-white/90 dark:bg-mist-800/90"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title">{title}</h2>
          <button onClick={onClose} className="text-mist-400 hover:text-mist-700 dark:hover:text-mist-100 text-xl leading-none" aria-label="Close">×</button>
        </div>
        {children}
      </div>
    </div>
  )
}
