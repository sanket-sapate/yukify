import SongCard from './SongCard'
import PlaylistsPage from './PlaylistsPage'
import { Trash2 } from 'lucide-react'

export default function MainContent({
  view, query,
  songs, allSongs,
  currentSongId, isPlaying,
  onPlay, onAddToQueue, playlists, onAddToPlaylist,
  activePlaylist, onRemoveFromPlaylist,
  onOpen, onDelete,
}) {
  const isPlaylistView = view === 'playlist'

  const filteredSongs = query
    ? songs.filter(s =>
        s.title.toLowerCase().includes(query.toLowerCase()) ||
        s.artist.toLowerCase().includes(query.toLowerCase())
      )
    : songs

  const pageTitle = isPlaylistView ? activePlaylist?.name : 'Dashboard'

  return (
    <div
      className="flex-1 flex flex-col overflow-hidden"
      style={{ background: 'var(--bg)', borderRight: '2px solid var(--card-border)' }}
    >
      {/* Page heading */}
      <div
        style={{ borderBottom: '2px solid var(--card-border)', background: 'var(--bg)' }}
        className="px-6 py-4 shrink-0"
      >
        <h1 className="text-2xl font-black" style={{ color: 'var(--text)' }}>{pageTitle}</h1>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-5 pt-5 pb-4">
        {view === 'playlists' ? (
          <PlaylistsPage playlists={playlists} allSongs={allSongs} onOpen={onOpen} onDelete={onDelete} />
        ) : (
          <>
            <p className="text-xs mb-4" style={{ color: 'var(--muted)' }}>
              {filteredSongs.length} song{filteredSongs.length !== 1 ? 's' : ''} · Yukta
            </p>

            {filteredSongs.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 gap-2" style={{ color: 'var(--muted)' }}>
                <span className="text-4xl opacity-30">♪</span>
                <p className="text-sm">
                  {query ? `No songs match "${query}"` : isPlaylistView ? 'No songs yet — use ⋮ on a card to add.' : 'No songs.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
                {filteredSongs.map(song => (
                    <div key={song.id} className="relative group/wrap">
                      <SongCard
                        song={song}
                        isPlaying={isPlaying}
                        isCurrent={currentSongId === song.id}
                        onPlay={() => onPlay(song.id)}
                        playlists={playlists}
                        onAddToQueue={onAddToQueue}
                        onAddToPlaylist={onAddToPlaylist}
                      />
                      {isPlaylistView && (
                        <button
                          onClick={() => onRemoveFromPlaylist(activePlaylist.id, song.id)}
                          className="absolute top-2 left-2 z-10 p-1.5 rounded-lg opacity-0 group-hover/wrap:opacity-100 transition-all"
                          style={{ background: 'rgba(255,255,255,0.85)', color: 'var(--muted)' }}
                          title="Remove from playlist"
                        >
                          <Trash2 size={12} />
                        </button>
                      )}
                    </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
