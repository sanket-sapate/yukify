import { useEffect, useRef } from 'react'

/**
 * Global keyboard controller for Yukify.
 *
 * Space             → Play / Pause
 * ArrowLeft         → Previous track
 * Shift+ArrowLeft   → Seek -10s
 * ArrowRight        → Next track
 * Shift+ArrowRight  → Seek +10s
 * ArrowUp           → Volume +10%
 * ArrowDown         → Volume -10%
 * M                 → Mute / unmute
 * S                 → Toggle shuffle
 * R                 → Cycle repeat (none → all → one)
 */
export function useKeyboard({ volume, currentTime, duration, togglePlay, playNext, playPrev, seek, setVolume, toggleShuffle, toggleRepeat }) {
  // Use refs so the event listener never needs to re-register
  const volumeRef      = useRef(volume)
  const currentTimeRef = useRef(currentTime)
  const durationRef    = useRef(duration)

  useEffect(() => { volumeRef.current      = volume      }, [volume])
  useEffect(() => { currentTimeRef.current = currentTime }, [currentTime])
  useEffect(() => { durationRef.current    = duration    }, [duration])

  useEffect(() => {
    const handler = e => {
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
            const pct = Math.max(0, ((currentTimeRef.current - 10) / durationRef.current) * 100)
            seek(pct)
          } else {
            playPrev()
          }
          break

        case 'ArrowRight':
          e.preventDefault()
          if (e.shiftKey) {
            const pct = Math.min(100, ((currentTimeRef.current + 10) / durationRef.current) * 100)
            seek(pct)
          } else {
            playNext()
          }
          break

        case 'ArrowUp':
          e.preventDefault()
          setVolume(Math.min(1, parseFloat((volumeRef.current + 0.1).toFixed(1))))
          break

        case 'ArrowDown':
          e.preventDefault()
          setVolume(Math.max(0, parseFloat((volumeRef.current - 0.1).toFixed(1))))
          break

        case 'm':
        case 'M':
          setVolume(volumeRef.current === 0 ? 0.8 : 0)
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
  }, [togglePlay, playNext, playPrev, seek, setVolume, toggleShuffle, toggleRepeat])
}
