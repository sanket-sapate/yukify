import { Music, ListMusic, Home, Plus, Trash2 } from 'lucide-react'

export default function Sidebar({
  view, setView,
  playlists, activePlaylistId, setActivePlaylistId,
  onCreatePlaylist, onDeletePlaylist,
  isMobileOpen, setMobileOpen,
}) {
  const navItem = (label, icon, id) => (
    <button
      key={id}
      onClick={() => { setView(id); setMobileOpen(false) }}
      style={{
        background: view === id ? 'color-mix(in srgb, var(--accent) 15%, transparent)' : 'transparent',
        color: view === id ? 'var(--accent)' : 'var(--muted)',
      }}
      className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium transition-all hover:text-[var(--text)]"
    >
      {icon}
      {label}
    </button>
  )

  return (
    <>
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-20 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        style={{ background: 'var(--sidebar)', borderRight: '1px solid var(--border)', width: '220px' }}
        className={`
          fixed top-0 left-0 h-full z-30 flex flex-col shrink-0
          transition-transform duration-300
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:relative lg:translate-x-0 lg:z-auto
        `}
      >
        {/* Logo */}
        <div
          style={{ borderBottom: '1px solid var(--border)' }}
          className="flex items-center gap-3 px-5 py-5"
        >
          <div
            style={{ background: 'var(--accent)' }}
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
          >
            <Music size={15} className="text-white" />
          </div>
          <span className="text-white font-semibold text-base">Yukify</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 pt-4 space-y-1">
          {navItem('Library', <Home size={16} />, 'library')}
          {navItem('Playlists', <ListMusic size={16} />, 'playlists')}

          {playlists.length > 0 && (
            <div className="pt-5">
              <p
                style={{ color: 'var(--muted)' }}
                className="px-4 pb-2 text-[10px] uppercase tracking-widest font-medium"
              >
                My Playlists
              </p>
              {playlists.map(pl => (
                <div key={pl.id} className="flex items-center group/pl">
                  <button
                    onClick={() => { setActivePlaylistId(pl.id); setView('playlist'); setMobileOpen(false) }}
                    style={{
                      color: view === 'playlist' && activePlaylistId === pl.id ? 'var(--accent)' : 'var(--muted)',
                      background: view === 'playlist' && activePlaylistId === pl.id
                        ? 'color-mix(in srgb, var(--accent) 15%, transparent)'
                        : 'transparent',
                    }}
                    className="flex-1 flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm truncate transition-all hover:text-[var(--text)]"
                  >
                    <ListMusic size={14} className="shrink-0" />
                    <span className="truncate">{pl.name}</span>
                  </button>
                  <button
                    onClick={() => onDeletePlaylist(pl.id)}
                    style={{ color: 'var(--muted)' }}
                    className="pr-2 opacity-0 group-hover/pl:opacity-100 hover:text-[var(--accent)] transition-all"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </nav>

        {/* Footer */}
        <div
          style={{ borderTop: '1px solid var(--border)' }}
          className="px-3 py-3"
        >
          <button
            onClick={onCreatePlaylist}
            style={{ color: 'var(--muted)' }}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm hover:text-[var(--accent)] hover:bg-[var(--elevated)] transition-all"
          >
            <Plus size={16} />
            New Playlist
          </button>
        </div>
      </aside>
    </>
  )
}
