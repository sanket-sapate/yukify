import { useState, useRef, useEffect, useCallback } from 'react'

function fisherYates(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// Build a shuffled order of all indices except `excludeIdx`
function buildShuffleOrder(length, excludeIdx) {
  const indices = Array.from({ length }, (_, i) => i).filter(i => i !== excludeIdx)
  return fisherYates(indices)
}

export function usePlayer() {
  const audioRef          = useRef(new Audio())
  const queueRef          = useRef([])
  const currentIdxRef     = useRef(null)
  const shuffleRef        = useRef(false)
  const repeatRef         = useRef('none')
  // Shuffle bag: ordered list of upcoming indices + history for prev
  const shuffleOrderRef   = useRef([])   // remaining upcoming indices
  const shuffleHistoryRef = useRef([])   // played indices (for prev)

  const [queue, setQueueState]             = useState([])
  const [currentIndex, setCurrentIdxState] = useState(null)
  const [isPlaying, setIsPlaying]          = useState(false)
  const [isBuffering, setIsBuffering]      = useState(false)
  const [progress, setProgress]            = useState(0)
  const [duration, setDuration]            = useState(0)
  const [currentTime, setCurrentTime]      = useState(0)
  const [volume, setVolumeState]           = useState(() => parseFloat(localStorage.getItem('yukify_volume') ?? '0.8'))
  const [shuffle, setShuffleState]         = useState(false)
  const [repeat, setRepeatState]           = useState('none')

  const audio = audioRef.current

  const setCurrentIndex = useCallback((val) => {
    const next = typeof val === 'function' ? val(currentIdxRef.current) : val
    currentIdxRef.current = next
    setCurrentIdxState(next)
  }, [])

  useEffect(() => { audio.volume = volume }, [volume])

  const loadAndPlay = useCallback((index) => {
    const q = queueRef.current
    if (index < 0 || index >= q.length) return
    audio.src = q[index].src
    audio.load()
    audio.play().catch(() => {})
    currentIdxRef.current = index
    setCurrentIdxState(index)
    setProgress(0)
    setCurrentTime(0)
  }, [])

  const playNext = useCallback(() => {
    const ci = currentIdxRef.current
    if (ci === null) return
    const q = queueRef.current

    if (shuffleRef.current) {
      // Push current to history
      shuffleHistoryRef.current.push(ci)

      if (shuffleOrderRef.current.length === 0) {
        // Exhausted — reshuffle if repeat is on
        if (repeatRef.current !== 'none') {
          shuffleOrderRef.current = buildShuffleOrder(q.length, ci)
        } else {
          return // stop
        }
      }

      const next = shuffleOrderRef.current.shift()
      loadAndPlay(next)
      return
    }

    // Non-shuffle
    if (ci + 1 < q.length) {
      loadAndPlay(ci + 1)
    } else if (repeatRef.current === 'all') {
      loadAndPlay(0)
    }
    // else last song, no repeat — stop
  }, [loadAndPlay])

  useEffect(() => {
    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime)
      setProgress(audio.duration ? (audio.currentTime / audio.duration) * 100 : 0)
    }
    const onLoadedMetadata = () => setDuration(audio.duration)
    const onEnded = () => {
      if (repeatRef.current === 'one') { audio.currentTime = 0; audio.play(); return }
      playNext()
    }
    const onPlay     = () => { setIsPlaying(true);  setIsBuffering(false) }
    const onPause    = () => setIsPlaying(false)
    const onWaiting  = () => setIsBuffering(true)
    const onPlaying  = () => setIsBuffering(false)

    audio.addEventListener('timeupdate',     onTimeUpdate)
    audio.addEventListener('loadedmetadata', onLoadedMetadata)
    audio.addEventListener('ended',          onEnded)
    audio.addEventListener('play',           onPlay)
    audio.addEventListener('pause',          onPause)
    audio.addEventListener('waiting',        onWaiting)
    audio.addEventListener('playing',        onPlaying)
    return () => {
      audio.removeEventListener('timeupdate',     onTimeUpdate)
      audio.removeEventListener('loadedmetadata', onLoadedMetadata)
      audio.removeEventListener('ended',          onEnded)
      audio.removeEventListener('play',           onPlay)
      audio.removeEventListener('pause',          onPause)
      audio.removeEventListener('waiting',        onWaiting)
      audio.removeEventListener('playing',        onPlaying)
    }
  }, [playNext, loadAndPlay])

  const setQueueAndPlay = useCallback((songs, index) => {
    queueRef.current = songs
    setQueueState(songs)
    // Reset shuffle bags for the new queue
    shuffleHistoryRef.current = []
    shuffleOrderRef.current   = shuffleRef.current
      ? buildShuffleOrder(songs.length, index)
      : []
    loadAndPlay(index)
  }, [loadAndPlay])

  const addToQueue = useCallback((song) => {
    const q   = queueRef.current
    const ci  = currentIdxRef.current
    const idx = q.findIndex(s => s.id === song.id)

    if (idx !== -1 && idx === ci) return 'playing'

    if (idx !== -1) {
      // Move to right after the current song (play next)
      const newQueue = [...q]
      newQueue.splice(idx, 1)
      const insertAt = ci !== null ? Math.min(ci + 1, newQueue.length) : 0
      newQueue.splice(insertAt, 0, song)
      queueRef.current = newQueue
      setQueueState(newQueue)
      if (ci !== null) {
        // If the removed song was before current, current shifted left by 1
        const newCi = idx < ci ? ci - 1 : ci
        currentIdxRef.current = newCi
        setCurrentIdxState(newCi)
      }
      return 'moved'
    }

    const wasEmpty = q.length === 0
    const newQueue = [...q, song]
    queueRef.current = newQueue
    setQueueState(newQueue)
    if (wasEmpty) {
      audio.src = song.src
      audio.load()
      currentIdxRef.current = 0
      setCurrentIdxState(0)
      setProgress(0)
      setCurrentTime(0)
    } else if (shuffleRef.current) {
      // Add new song into the upcoming shuffle order at a random position
      const order = shuffleOrderRef.current
      const insertAt = Math.floor(Math.random() * (order.length + 1))
      order.splice(insertAt, 0, newQueue.length - 1)
    }
    return 'added'
  }, [])

  const moveInQueue = useCallback((fromIdx, toIdx) => {
    const q = queueRef.current
    if (toIdx < 0 || toIdx >= q.length) return
    const newQueue = [...q]
    const [item] = newQueue.splice(fromIdx, 1)
    newQueue.splice(toIdx, 0, item)
    queueRef.current = newQueue
    setQueueState(newQueue)

    const ci = currentIdxRef.current
    if (ci === null) return
    let newCi = ci
    if (fromIdx === ci)                   newCi = toIdx
    else if (fromIdx < ci && toIdx >= ci) newCi = ci - 1
    else if (fromIdx > ci && toIdx <= ci) newCi = ci + 1
    if (newCi !== ci) {
      currentIdxRef.current = newCi
      setCurrentIdxState(newCi)
    }
  }, [])

  const playSong = useCallback((index) => {
    if (index === currentIdxRef.current) {
      if (audio.paused) audio.play().catch(() => {})
      else audio.pause()
      return
    }
    if (shuffleRef.current) {
      // Treat manual play as starting fresh from this song
      shuffleHistoryRef.current = []
      shuffleOrderRef.current   = buildShuffleOrder(queueRef.current.length, index)
    }
    loadAndPlay(index)
  }, [loadAndPlay])

  const togglePlay = useCallback(() => {
    if (audio.paused) audio.play().catch(() => {})
    else audio.pause()
  }, [])

  const playPrev = useCallback(() => {
    const ci = currentIdxRef.current
    if (ci === null) return
    if (audio.currentTime > 3) { audio.currentTime = 0; return }

    if (shuffleRef.current) {
      const history = shuffleHistoryRef.current
      if (history.length > 0) {
        const prev = history.pop()
        // Put current back at front of upcoming order
        shuffleOrderRef.current.unshift(ci)
        loadAndPlay(prev)
      } else {
        audio.currentTime = 0 // no history, just restart
      }
      return
    }

    const q = queueRef.current
    loadAndPlay((ci - 1 + q.length) % q.length)
  }, [loadAndPlay])

  const removeFromQueue = useCallback((idx) => {
    const newQueue = [...queueRef.current]
    newQueue.splice(idx, 1)
    queueRef.current = newQueue
    setQueueState(newQueue)
    const ci = currentIdxRef.current
    if (ci === null) return
    if (idx < ci) {
      currentIdxRef.current = ci - 1
      setCurrentIdxState(ci - 1)
    } else if (idx === ci) {
      audio.pause()
      audio.src = ''
      currentIdxRef.current = null
      setCurrentIdxState(null)
      setProgress(0)
      setCurrentTime(0)
      setDuration(0)
    }
  }, [])

  const clearQueue = useCallback(() => {
    queueRef.current = []
    setQueueState([])
    shuffleOrderRef.current   = []
    shuffleHistoryRef.current = []
    audio.pause()
    audio.src = ''
    currentIdxRef.current = null
    setCurrentIdxState(null)
    setProgress(0)
    setCurrentTime(0)
    setDuration(0)
  }, [])

  const seek = useCallback((percent) => {
    if (!audio.duration) return
    audio.currentTime = (percent / 100) * audio.duration
  }, [])

  const setVolume = useCallback((val) => {
    setVolumeState(val)
    audio.volume = val
    audio.muted = val === 0
    localStorage.setItem('yukify_volume', val)
  }, [])

  const toggleShuffle = useCallback(() => {
    setShuffleState(s => {
      const next = !s
      shuffleRef.current = next
      if (next) {
        // Build fresh shuffle order when enabling
        shuffleHistoryRef.current = []
        shuffleOrderRef.current   = buildShuffleOrder(queueRef.current.length, currentIdxRef.current)
      } else {
        shuffleOrderRef.current   = []
        shuffleHistoryRef.current = []
      }
      return next
    })
  }, [])

  const toggleRepeat = useCallback(() => {
    setRepeatState(r => {
      const next = r === 'none' ? 'all' : r === 'all' ? 'one' : 'none'
      repeatRef.current = next
      return next
    })
  }, [])

  const currentSong = currentIndex !== null ? queue[currentIndex] ?? null : null

  return {
    queue, currentSong, currentIndex, isPlaying, isBuffering,
    progress, duration, currentTime,
    volume, shuffle, repeat,
    setQueueAndPlay, addToQueue, moveInQueue,
    playSong, togglePlay, playNext, playPrev,
    removeFromQueue, clearQueue,
    seek, setVolume, toggleShuffle, toggleRepeat,
  }
}
