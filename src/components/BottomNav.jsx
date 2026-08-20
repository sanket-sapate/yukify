import { LayoutGrid, Heart, ListMusic, ListOrdered } from 'lucide-react'

export default function BottomNav({ view, setView, queueCount, showQueue, onToggleQueue, onCreatePlaylist }) {
  const navItems = [
    { id: 'library',   icon: <LayoutGrid size={20} />,   label: 'Library'   },
    { id: 'liked',     icon: <Heart size={20} />,         label: 'Liked'     },
    { id: 'playlists', icon: <ListMusic size={20} />,     label: 'Playlists' },
  ]

  return (
    <nav
      className="flex md:hidden shrink-0 items-stretch"
      style={{
        background: 'var(--surface)',
        borderTop: '2px solid var(--card-border)',
        height: '56px',
      }}
    >
      {navItems.map(({ id, icon, label }) => {
        const isActive = view === id && !showQueue
        return (
          <button
            key={id}
            onClick={() => setView(id)}
            className="flex-1 flex flex-col items-center justify-center gap-0.5 relative transition-colors"
            style={{
              color: isActive ? 'var(--accent)' : 'var(--muted)',
            }}
          >
            {icon}
            <span className="text-[10px] font-semibold">{label}</span>
            {isActive && (
              <span
                className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-t-full"
                style={{ width: 24, height: 3, background: 'var(--accent)' }}
              />
            )}
          </button>
        )
      })}

      {/* Queue toggle button */}
      <button
        onClick={onToggleQueue}
        className="flex-1 flex flex-col items-center justify-center gap-0.5 relative transition-colors"
        style={{ color: showQueue ? 'var(--accent)' : 'var(--muted)' }}
      >
        <div className="relative">
          <ListOrdered size={20} />
          {queueCount > 0 && (
            <span
              className="absolute -top-1.5 -right-2 min-w-[16px] h-4 flex items-center justify-center rounded-full text-[9px] font-bold px-1"
              style={{ background: 'var(--accent)', color: '#fff', border: '1.5px solid var(--surface)' }}
            >
              {queueCount > 99 ? '99+' : queueCount}
            </span>
          )}
        </div>
        <span className="text-[10px] font-semibold">Queue</span>
        {showQueue && (
          <span
            className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-t-full"
            style={{ width: 24, height: 3, background: 'var(--accent)' }}
          />
        )}
      </button>
    </nav>
  )
}
