import { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'

export default function CreatePlaylistModal({ onConfirm, onClose }) {
  const [name, setName] = useState('')
  const inputRef = useRef()

  useEffect(() => { inputRef.current?.focus() }, [])

  const handleSubmit = e => {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    onConfirm(trimmed)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(255, 77, 109, 0.15)', backdropFilter: 'blur(4px)' }}
    >
      <div
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--card-border)',
          boxShadow: '0 20px 60px rgba(255,77,109,0.15)',
        }}
        className="w-full max-w-sm rounded-2xl p-6"
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold text-base" style={{ color: 'var(--text)' }}>New Playlist</h2>
          <button
            onClick={onClose}
            style={{ color: 'var(--muted)' }}
            className="hover:text-[var(--accent)] transition-colors p-1 rounded-lg hover:bg-[var(--accent-light)]"
          >
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            ref={inputRef}
            type="text"
            placeholder="Playlist name…"
            value={name}
            onChange={e => setName(e.target.value)}
            style={{
              background: 'var(--accent-light)',
              border: '1px solid var(--card-border)',
              color: 'var(--text)',
            }}
            className="w-full px-4 py-2.5 rounded-xl text-sm outline-none focus:border-[var(--accent)] transition-colors placeholder:text-[var(--muted)]"
          />
          <div className="flex gap-3">
            <button
              type="button" onClick={onClose}
              style={{ border: '1px solid var(--card-border)', color: 'var(--muted)' }}
              className="flex-1 py-2.5 rounded-xl text-sm hover:text-[var(--accent)] hover:border-[var(--accent)] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              style={{ background: 'var(--accent)' }}
              className="flex-1 py-2.5 rounded-xl text-sm text-white font-medium hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
