import { useEffect } from 'react'

/**
 * Global keyboard controller for Yukify.
 *
 * Space        → Play / Pause
 * ArrowLeft    → Previous track  (Shift+ArrowLeft → seek -10s)
 * ArrowRight   → Next track      (Shift+ArrowRight → seek +10s)
 * ArrowUp      → Volume +10%
 * ArrowDown    → Volume -10%
 * M            → Mute / unmute
 * S            → Toggle shuffle
 * R            → Cycle repeat (none → all → one)
 */
export function useKeyboard({ isPlaying, volume, currentTime, duration, togglePlay, playNext, playPrev, seek, setVolume, toggleShuffle, toggleRepeat }) {
  useEffect(() => {
    const handler = e => {
      // Don't hijack shortcuts when user is typing in an input
      const tag = document.activeElement?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return

      switch (e.key) {
        case ' ':
          e.preventDefault()
          togglePlay()
          break

        case 'ArrowLeft':
          e.preventDefault()
          if (e.shiftKey) {
            // Seek back 10s
            const pct = Math.max(0, ((currentTime - 10) / duration) * 100)
            seek(pct)
          } else {
            playPrev()
          }
          break

        case 'ArrowRight':
          e.preventDefault()
          if (e.shiftKey) {
            // Seek forward 10s
            const pct = Math.min(100, ((currentTime + 10) / duration) * 100)
            seek(pct)
          } else {
            playNext()
          }
          break

        case 'ArrowUp':
          e.preventDefault()
          setVolume(Math.min(1, parseFloat((volume + 0.1).toFixed(1))))
          break

        case 'ArrowDown':
          e.preventDefault()
          setVolume(Math.max(0, parseFloat((volume - 0.1).toFixed(1))))
          break

        case 'm':
        case 'M':
          setVolume(volume === 0 ? 0.8 : 0)
          break

        case 's':
        case 'S':
          toggleShuffle()
          break

        case 'r':
        case 'R':
          toggleRepeat()
          break

        default:
          break
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isPlaying, volume, currentTime, duration, togglePlay, playNext, playPrev, seek, setVolume, toggleShuffle, toggleRepeat])
}
