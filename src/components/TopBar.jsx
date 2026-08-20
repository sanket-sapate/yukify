import { ChevronLeft, ChevronRight, Search, Settings, X } from 'lucide-react'

export default function TopBar({ query, setQuery }) {
  return (
    <header
      style={{
        background: 'var(--bg)',
        borderBottom: '2px solid var(--card-border)',
        height: '52px',
      }}
      className="flex items-center gap-3 px-3 shrink-0"
    >
      {/* Left — logo + nav */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          style={{ background: 'var(--accent)', color: 'white' }}
          className="neo-btn w-8 h-8"
          title="Yukify"
        >
          <span className="text-xs font-black">Y</span>
        </button>
        <button style={{ background: 'var(--surface)', color: 'var(--muted)' }} className="neo-btn w-7 h-7" title="Back">
          <ChevronLeft size={14} />
        </button>
        <button style={{ background: 'var(--surface)', color: 'var(--muted)' }} className="neo-btn w-7 h-7" title="Forward">
          <ChevronRight size={14} />
        </button>
      </div>

      {/* Center — search */}
      <div
        style={{
          background: 'var(--surface)',
          border: '2px solid var(--card-border)',
          borderRadius: 'var(--radius)',
          boxShadow: 'var(--neo-shadow)',
        }}
        className="flex items-center gap-2 flex-1 px-4 h-9"
      >
        <Search size={14} style={{ color: 'var(--muted)' }} className="shrink-0" />
        <input
          type="text"
          placeholder="Search songs, artists…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="flex-1 text-sm outline-none bg-transparent"
          style={{ color: 'var(--text)' }}
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="shrink-0 p-0.5 rounded transition-opacity hover:opacity-70"
            style={{ color: 'var(--muted)' }}
            title="Clear search"
          >
            <X size={13} />
          </button>
        )}
      </div>

      {/* Right — settings */}
      <button
        style={{ background: 'var(--surface)', color: 'var(--muted)' }}
        className="neo-btn w-8 h-8 shrink-0"
        title="Settings"
      >
        <Settings size={15} />
      </button>
    </header>
  )
}
