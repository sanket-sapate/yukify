import { Trash2 } from 'lucide-react'
import SongCard from './SongCard'

export default function SongList({
  songs, allSongs,
  currentIndex, isPlaying,
  onPlay, playlists, onAddToPlaylist,
  view, activePlaylist,
  onRemoveFromPlaylist,
}) {
  const isPlaylistView = view === 'playlist'
  const title = isPlaylistView ? activePlaylist?.name : 'All Songs'

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="mb-6">
        <h1 className="text-xl font-semibold" style={{ color: 'var(--text)' }}>{title}</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>
          {songs.length} song{songs.length !== 1 ? 's' : ''}
          {isPlaylistView && ' · Yukta'}
        </p>
      </div>

      {songs.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 gap-2" style={{ color: 'var(--muted)' }}>
          <span className="text-4xl opacity-30">♪</span>
          <p className="text-sm">{isPlaylistView ? 'No songs yet — use ⋮ on a card to add.' : 'No songs.'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
          {songs.map(song => {
            const globalIndex = allSongs.findIndex(s => s.id === song.id)
            return (
              <div key={song.id} className="relative group/wrap">
                <SongCard
                  song={song}
                  isPlaying={isPlaying}
                  isCurrent={currentIndex === globalIndex}
                  onPlay={() => onPlay(globalIndex)}
                  playlists={playlists}
                  onAddToPlaylist={onAddToPlaylist}
                />
                {isPlaylistView && (
                  <button
                    onClick={() => onRemoveFromPlaylist(activePlaylist.id, song.id)}
                    className="absolute top-2 left-2 z-10 p-1.5 rounded opacity-0 group-hover/wrap:opacity-100 transition-all"
                    style={{ background: 'rgba(0,0,0,0.7)', color: 'var(--muted)' }}
                    title="Remove from playlist"
                  >
                    <Trash2 size={12} />
                  </button>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
