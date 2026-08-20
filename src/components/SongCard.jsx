import { Play, Pause, Plus } from 'lucide-react'
import { useState } from 'react'

export default function SongCard({ song, isPlaying, isCurrent, onPlay, onAddToQueue, playlists, onAddToPlaylist }) {
  const [ctxMenu, setCtxMenu] = useState(null) // { x, y } or null

  const openCtxMenu = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setCtxMenu({ x: e.clientX, y: e.clientY })
  }

  return (
    <>
      <div
        onClick={onPlay}
        onContextMenu={openCtxMenu}
        style={{
          background: 'var(--surface)',
          borderColor: isCurrent ? 'var(--accent)' : undefined,
          boxShadow: isCurrent ? '3px 3px 0 0 var(--accent)' : undefined,
        }}
        className="neo-card relative group overflow-hidden cursor-pointer"
      >
        {/* Art */}
        <div
          className="w-full aspect-square flex items-center justify-center relative overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${song.gradient[0]}, ${song.gradient[1]})`, borderRadius: 'calc(var(--radius) - 2px) calc(var(--radius) - 2px) 0 0' }}
        >
          {song.image
            ? <img src={song.image} alt={song.title} className="absolute inset-0 w-full h-full object-cover" draggable={false} />
            : <span className="text-white/20 text-7xl select-none font-black">♪</span>
          }

          <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-150
            ${isCurrent ? 'opacity-100 bg-black/20' : 'opacity-0 group-hover:opacity-100 bg-black/25'}`}
          >
            <div style={{ background: 'var(--accent)' }} className="neo-btn w-10 h-10 border-white/80">
              {isCurrent && isPlaying
                ? <Pause size={16} className="text-white" />
                : <Play size={16} className="text-white ml-0.5" />}
            </div>
          </div>

          {isCurrent && isPlaying && (
            <div className="absolute bottom-2 right-2 flex items-end gap-0.5">
              {[6, 10, 7].map((h, i) => (
                <div key={i} style={{ background: 'white', height: `${h}px`, animationDelay: `${i * 0.12}s` }}
                  className="w-1 rounded-full animate-pulse" />
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div style={{ borderTop: '2px solid var(--card-border)', background: 'var(--surface)' }} className="px-3 py-2.5">
          <p style={{ color: isCurrent ? 'var(--accent)' : 'var(--text)' }} className="text-sm font-black truncate leading-tight">{song.title}</p>
          <p style={{ color: 'var(--muted)' }} className="text-xs mt-0.5 truncate">{song.artist}</p>
        </div>
      </div>

      {/* Context menu */}
      {ctxMenu && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setCtxMenu(null)} onContextMenu={e => { e.preventDefault(); setCtxMenu(null) }} />
          <div
            style={{
              position: 'fixed',
              top: ctxMenu.y,
              left: ctxMenu.x,
              background: 'var(--surface)',
              border: '2px solid var(--card-border)',
              borderRadius: 'var(--radius)',
              boxShadow: 'var(--neo-shadow)',
              zIndex: 50,
              minWidth: '160px',
            }}
          >
            <button
              onClick={() => { onAddToQueue(song); setCtxMenu(null) }}
              style={{ color: 'var(--text)' }}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-[var(--accent-light)] transition-colors"
            >
              <Plus size={13} style={{ color: 'var(--accent)' }} /> Add to queue
            </button>

            {playlists.length > 0 && (
              <>
                <div style={{ borderTop: '2px solid var(--card-border)' }} />
                <p style={{ color: 'var(--muted)' }} className="px-3 py-1.5 text-[10px] uppercase tracking-wider font-medium">Add to playlist</p>
                {playlists.map(pl => (
                  <button key={pl.id}
                    onClick={() => { onAddToPlaylist(pl.id, song.id); setCtxMenu(null) }}
                    style={{ color: 'var(--text)' }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-[var(--accent-light)] transition-colors"
                  >
                    <Plus size={13} style={{ color: 'var(--accent)' }} />{pl.name}
                  </button>
                ))}
              </>
            )}
          </div>
        </>
      )}
    </>
  )
}
