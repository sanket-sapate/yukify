import { ListMusic, Trash2 } from 'lucide-react'

export default function PlaylistsPage({ playlists, allSongs, onOpen, onDelete }) {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mb-6">
        <h1 className="text-xl font-semibold" style={{ color: 'var(--text)' }}>Playlists</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>
          {playlists.length} playlist{playlists.length !== 1 ? 's' : ''}
        </p>
      </div>

      {playlists.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 gap-2" style={{ color: 'var(--muted)' }}>
          <ListMusic size={40} className="opacity-30" />
          <p className="text-sm">No playlists yet. Click + in the sidebar.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {playlists.map(pl => {
            const firstSong = allSongs.find(s => pl.songIds.includes(s.id))
            const grad = firstSong?.gradient ?? ['#ffb3c1', '#ff4d6d']

            return (
              <div
                key={pl.id}
                onClick={() => onOpen(pl.id)}
                style={{
                  background: 'var(--surface)',
                  border: '2px solid var(--card-border)',
                }}
                className="group relative rounded-xl overflow-hidden cursor-pointer hover:border-[var(--accent)] transition-all hover:scale-[1.01] hover:shadow-md"
              >
                <div
                  className="h-20 flex items-center justify-center"
                  style={{ background: `linear-gradient(135deg, ${grad[0]}, ${grad[1]})` }}
                >
                  <ListMusic size={32} className="text-white/30" />
                </div>
                <div
                  className="px-4 py-3 flex items-center justify-between"
                  style={{ borderTop: '1px solid var(--card-border)' }}
                >
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>{pl.name}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
                      {pl.songIds.length} song{pl.songIds.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <button
                    onClick={e => { e.stopPropagation(); onDelete(pl.id) }}
                    style={{ color: 'var(--muted)' }}
                    className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:text-[var(--accent)] hover:bg-[var(--accent-light)] transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
