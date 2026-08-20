import { ListMusic, Trash2, Pin } from 'lucide-react'

export default function PlaylistsPage({ playlists, allSongs, onOpen, onDelete }) {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mb-6">
        <h1 className="text-xl font-black" style={{ color: 'var(--text)' }}>Playlists</h1>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {playlists.map(pl => {
            const plSongs   = allSongs.filter(s => pl.songIds.includes(s.id))
            const swatches  = plSongs.slice(0, 4).map(s => s.gradient)
            const mainGrad  = swatches[0] ?? ['#e94560', '#c62a47']

            return (
              <div
                key={pl.id}
                onClick={() => onOpen(pl.id)}
                style={{
                  border: '2px solid var(--card-border)',
                  boxShadow: 'var(--neo-shadow)',
                  borderRadius: 'var(--radius)',
                  background: 'var(--surface)',
                  cursor: 'pointer',
                }}
                className="group relative overflow-hidden transition-transform hover:-translate-y-0.5 active:translate-y-0"
              >
                {/* Gradient cover with swatches */}
                <div
                  className="relative h-28 flex items-end p-3"
                  style={{ background: `linear-gradient(135deg, ${mainGrad[0]}, ${mainGrad[1]})` }}
                >
                  {/* Swatch strip — bottom-right corner */}
                  {swatches.length > 1 && (
                    <div className="absolute bottom-3 right-3 flex gap-1">
                      {swatches.map((g, i) => (
                        <div
                          key={i}
                          style={{
                            width: 14, height: 14,
                            borderRadius: 3,
                            background: `linear-gradient(135deg, ${g[0]}, ${g[1]})`,
                            border: '1.5px solid rgba(255,255,255,0.5)',
                          }}
                        />
                      ))}
                    </div>
                  )}

                  {/* Default pin badge */}
                  {pl.isDefault && (
                    <div
                      className="absolute top-2.5 left-2.5 flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-black uppercase tracking-wider"
                      style={{
                        background: 'var(--card-border)',
                        color: 'var(--bg)',
                        borderRadius: 4,
                      }}
                    >
                      <Pin size={8} />
                      Default
                    </div>
                  )}
                </div>

                {/* Info row */}
                <div
                  className="flex items-center justify-between px-4 py-3"
                  style={{ borderTop: '2px solid var(--card-border)' }}
                >
                  <div>
                    <p className="text-sm font-black leading-tight" style={{ color: 'var(--text)' }}>{pl.name}</p>
                    <p className="text-xs mt-0.5 font-medium" style={{ color: 'var(--muted)' }}>
                      {pl.songIds.length} song{pl.songIds.length !== 1 ? 's' : ''}
                    </p>
                  </div>

                  {!pl.isDefault && (
                    <button
                      onClick={e => { e.stopPropagation(); onDelete(pl.id) }}
                      style={{ color: 'var(--muted)' }}
                      className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:text-[var(--accent)] transition-all"
                      title="Delete playlist"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
