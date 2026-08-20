import { useState } from 'react'

import { songs as allSongs } from './data/songs'
import { usePlayer } from './hooks/usePlayer'
import { usePlaylists } from './hooks/usePlaylists'
import { useLikes } from './hooks/useLikes'
import { useKeyboard } from './hooks/useKeyboard'

import TopBar from './components/TopBar'
import IconSidebar from './components/IconSidebar'
import MainContent from './components/MainContent'
import QueuePanel from './components/QueuePanel'
import Player from './components/Player'
import CreatePlaylistModal from './components/CreatePlaylistModal'
import Toast from './components/Toast'

export default function App() {
  const player = usePlayer()
  const { playlists, createPlaylist, deletePlaylist, addSongToPlaylist, removeSongFromPlaylist } = usePlaylists()
  const { likedIds, toggleLike } = useLikes()

  const [view, setView] = useState('library')
  const [activePlaylistId, setActivePlaylistId] = useState(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [query, setQuery] = useState('')
  const [toast, setToast] = useState(null)

  const showToast = (msg) => setToast(msg)

  const activePlaylist = playlists.find(p => p.id === activePlaylistId)
  const playlistSongs = activePlaylist ? allSongs.filter(s => activePlaylist.songIds.includes(s.id)) : []
  const likedSongs = allSongs.filter(s => likedIds.has(s.id))
  const viewSongs = query ? allSongs : view === 'playlist' ? playlistSongs : view === 'liked' ? likedSongs : allSongs

  const handleOpenPlaylist = id => { setActivePlaylistId(id); setView('playlist') }

  // Play a song from the current view — loads full view into queue
  const handlePlayFromView = (songId) => {
    const song = allSongs.find(s => s.id === songId)
    if (song) player.setQueueAndPlay([song], 0)
  }

  const handleAddToQueue = (song) => {
    const result = player.addToQueue(song)
    if (result === 'playing') showToast('Already playing')
    if (result === 'moved')   showToast('Playing next')
  }

  useKeyboard({
    volume:        player.volume,
    currentTime:   player.currentTime,
    duration:      player.duration,
    togglePlay:    player.togglePlay,
    playNext:      player.playNext,
    playPrev:      player.playPrev,
    seek:          player.seek,
    setVolume:     player.setVolume,
    toggleShuffle: player.toggleShuffle,
    toggleRepeat:  player.toggleRepeat,
  })

  return (
    <div className="flex flex-col" style={{ height: '100%' }}>

      {/* Full-width top bar */}
      <TopBar query={query} setQuery={setQuery} />

      {/* Middle: sidebar | main | queue */}
      <div className="flex flex-1 overflow-hidden">

        <IconSidebar
          view={view}
          setView={setView}
          onCreatePlaylist={() => setShowCreateModal(true)}
        />

        <MainContent
          view={view}
          query={query}
          songs={viewSongs}
          allSongs={allSongs}
          currentSongId={player.currentSong?.id ?? null}
          isPlaying={player.isPlaying}
          onPlay={handlePlayFromView}
          onAddToQueue={handleAddToQueue}
          playlists={playlists}
          onAddToPlaylist={addSongToPlaylist}
          activePlaylist={activePlaylist}
          onRemoveFromPlaylist={removeSongFromPlaylist}
          onOpen={handleOpenPlaylist}
          onDelete={deletePlaylist}
        />

        <QueuePanel
          songs={player.queue}
          currentIndex={player.currentIndex}
          onPlay={player.playSong}
          onRemove={player.removeFromQueue}
          onMove={player.moveInQueue}
          onClear={player.clearQueue}
        />
      </div>

      {/* Bottom player */}
      <Player
        currentSong={player.currentSong}
        isPlaying={player.isPlaying}
        isBuffering={player.isBuffering}
        progress={player.progress}
        currentTime={player.currentTime}
        duration={player.duration}
        volume={player.volume}
        shuffle={player.shuffle}
        repeat={player.repeat}
        isLiked={player.currentSong ? likedIds.has(player.currentSong.id) : false}
        onToggleLike={() => player.currentSong && toggleLike(player.currentSong.id)}
        onTogglePlay={player.togglePlay}
        onNext={player.playNext}
        onPrev={player.playPrev}
        onSeek={player.seek}
        onVolume={player.setVolume}
        onToggleShuffle={player.toggleShuffle}
        onToggleRepeat={player.toggleRepeat}
      />

      {showCreateModal && (
        <CreatePlaylistModal onConfirm={createPlaylist} onClose={() => setShowCreateModal(false)} />
      )}

      {toast && <Toast message={toast} onDismiss={() => setToast(null)} />}
    </div>
  )
}
