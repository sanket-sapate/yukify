import { useEffect } from 'react'

export default function Toast({ message, onDismiss }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 2500)
    return () => clearTimeout(t)
  }, [message, onDismiss])

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '88px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'var(--card-border)',
        color: 'var(--bg)',
        border: '2px solid var(--card-border)',
        borderRadius: 'var(--radius)',
        boxShadow: 'var(--neo-shadow)',
        zIndex: 100,
        pointerEvents: 'none',
        whiteSpace: 'nowrap',
      }}
      className="px-4 py-2 text-sm font-bold"
    >
      {message}
    </div>
  )
}
