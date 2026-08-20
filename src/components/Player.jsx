import {
  Play, Pause, SkipBack, SkipForward,
  Shuffle, Repeat, Repeat1, Volume2, VolumeX, Heart,
} from 'lucide-react'

function fmt(s) {
  if (!s || isNaN(s)) return '0:00'
  return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`
}

export default function Player({
  currentSong, isPlaying,
  progress, currentTime, duration,
  volume, shuffle, repeat,
  isLiked, onToggleLike,
  onTogglePlay, onNext, onPrev,
  onSeek, onVolume,
  onToggleShuffle, onToggleRepeat,
}) {
  const RepeatIcon = repeat === 'one' ? Repeat1 : Repeat

  return (
    <footer
      style={{ background: 'var(--surface)', borderTop: '2px solid var(--card-border)' }}
      className="shrink-0"
    >
      {/* Full-width striped seek bar — Nuclear's iconic look */}
      <div className="relative flex items-center" style={{ borderBottom: '2px solid var(--card-border)', height: '20px' }}>
        {/* Timestamps */}
        <span
          className="absolute left-2 text-[10px] tabular-nums z-10 font-medium"
          style={{ color: 'var(--card-border)' }}
        >
          {fmt(currentTime)}
        </span>
        <span
          className="absolute right-2 text-[10px] tabular-nums z-10 font-medium"
          style={{ color: 'var(--card-border)' }}
        >
          {fmt(duration)}
        </span>

        {/* Striped track */}
        <div className="absolute inset-0 overflow-hidden" style={{
          background: 'repeating-linear-gradient(-45deg, #ffb3c1 0px, #ffb3c1 6px, #ff8fa3 6px, #ff8fa3 12px)',
        }}>
          {/* Pink filled progress overlay */}
          {progress > 0 && (
            <div
              className="absolute inset-y-0 left-0"
              style={{
                width: `${progress}%`,
                background: 'repeating-linear-gradient(-45deg, #ff4d6d 0px, #ff4d6d 6px, #e0304f 6px, #e0304f 12px)',
              }}
            />
          )}
        </div>

        {/* Invisible range input over the top for interaction */}
        <input
          type="range" min={0} max={100} step={0.1}
          value={progress}
          onChange={e => onSeek(parseFloat(e.target.value))}
          disabled={!currentSong}
          className="absolute inset-0 w-full opacity-0 cursor-pointer"
          style={{ height: '100%' }}
        />
      </div>

      {/* Controls row */}
      <div className="grid px-6" style={{ gridTemplateColumns: '1fr auto 1fr', height: '64px' }}>

        {/* LEFT — art + info + heart */}
        <div className="flex items-center gap-3 min-w-0">
          {currentSong ? (
            <>
              <div
                className="w-10 h-10 shrink-0 overflow-hidden relative"
                style={{
                  background: `linear-gradient(135deg, ${currentSong.gradient[0]}, ${currentSong.gradient[1]})`,
                  border: '2px solid var(--card-border)',
                  borderRadius: 'var(--radius)',
                  boxShadow: 'var(--neo-shadow)',
                }}
              >
                {currentSong.image && (
                  <img src={currentSong.image} alt={currentSong.title} className="absolute inset-0 w-full h-full object-cover" draggable={false} />
                )}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate" style={{ color: 'var(--text)' }}>{currentSong.title}</p>
                <p className="text-xs" style={{ color: 'var(--muted)' }}>{currentSong.artist}</p>
              </div>
            </>
          ) : (
            <div
              className="w-10 h-10 shrink-0"
              style={{
                background: '#e0e0e0',
                border: '2px solid var(--card-border)',
                borderRadius: 'var(--radius)',
                boxShadow: 'var(--neo-shadow)',
              }}
            />
          )}
          <button
            onClick={onToggleLike}
            style={{
              color: isLiked ? 'var(--accent)' : 'var(--muted)',
              opacity: currentSong ? 1 : 0.3,
            }}
            className="ml-1 shrink-0 transition-colors hover:opacity-80"
            title={isLiked ? 'Unlike' : 'Like'}
            disabled={!currentSong}
          >
            <Heart size={15} fill={isLiked ? 'var(--accent)' : 'none'} />
          </button>
        </div>

        {/* CENTER — playback controls */}
        <div className="flex items-center gap-5 px-6">
          <button
            onClick={onToggleShuffle}
            style={{ color: shuffle ? 'var(--accent)' : 'var(--muted)', opacity: currentSong ? 1 : 0.4 }}
            className="hover:opacity-80 transition-opacity"
            title="Shuffle"
          >
            <Shuffle size={15} />
          </button>

          <button
            onClick={onPrev}
            style={{ color: 'var(--muted)', opacity: currentSong ? 1 : 0.4 }}
            className="hover:text-[var(--text)] transition-colors"
          >
            <SkipBack size={19} />
          </button>

          <button
            onClick={onTogglePlay}
            style={{ background: 'var(--accent)', color: 'white', opacity: currentSong ? 1 : 0.5 }}
            className="neo-btn w-9 h-9"
            disabled={!currentSong}
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
          </button>

          <button
            onClick={onNext}
            style={{ color: 'var(--muted)', opacity: currentSong ? 1 : 0.4 }}
            className="hover:text-[var(--text)] transition-colors"
          >
            <SkipForward size={19} />
          </button>

          <button
            onClick={onToggleRepeat}
            style={{ color: repeat !== 'none' ? 'var(--accent)' : 'var(--muted)', opacity: currentSong ? 1 : 0.4 }}
            className="hover:opacity-80 transition-opacity"
            title={`Repeat: ${repeat}`}
          >
            <RepeatIcon size={15} />
          </button>
        </div>

        {/* RIGHT — volume */}
        <div className="flex items-center gap-3 justify-end pr-2">
          <button
            onClick={() => onVolume(volume === 0 ? 0.8 : 0)}
            style={{ color: 'var(--muted)' }}
            className="hover:text-[var(--accent)] transition-colors shrink-0"
          >
            {volume === 0 ? <VolumeX size={15} /> : <Volume2 size={15} />}
          </button>
          <input
            type="range" min={0} max={1} step={0.01}
            value={volume}
            onChange={e => onVolume(parseFloat(e.target.value))}
            className="w-24 shrink-0"
          />
        </div>
      </div>
    </footer>
  )
}
