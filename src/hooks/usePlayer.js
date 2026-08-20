import { useState, useRef, useEffect, useCallback } from 'react'

export function usePlayer() {
  const audioRef       = useRef(new Audio())
  const queueRef       = useRef([])
  const currentIdxRef  = useRef(null)
  const shuffleRef     = useRef(false)
  const repeatRef      = useRef('none')

  const [queue, setQueueState]             = useState([])
  const [currentIndex, setCurrentIdxState] = useState(null)
  const [isPlaying, setIsPlaying]          = useState(false)
  const [progress, setProgress]            = useState(0)
  const [duration, setDuration]            = useState(0)
  const [currentTime, setCurrentTime]      = useState(0)
  const [volume, setVolumeState]           = useState(0.8)
  const [shuffle, setShuffleState]         = useState(false)
  const [repeat, setRepeatState]           = useState('none')

  const audio = audioRef.current

  // Single setter that keeps ref + state in sync
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
    let next
    if (shuffleRef.current) {
      do { next = Math.floor(Math.random() * q.length) }
      while (q.length > 1 && next === ci)
    } else {
      next = (ci + 1) % q.length
    }
    loadAndPlay(next)
  }, [loadAndPlay])

  useEffect(() => {
    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime)
      setProgress(audio.duration ? (audio.currentTime / audio.duration) * 100 : 0)
    }
    const onLoadedMetadata = () => setDuration(audio.duration)
    const onEnded = () => {
      const q  = queueRef.current
      const ci = currentIdxRef.current
      if (repeatRef.current === 'one') { audio.currentTime = 0; audio.play(); return }
      if (repeatRef.current === 'all' || shuffleRef.current) { playNext(); return }
      if (ci !== null && ci < q.length - 1) loadAndPlay(ci + 1)
    }
    const onPlay  = () => setIsPlaying(true)
    const onPause = () => setIsPlaying(false)

    audio.addEventListener('timeupdate',      onTimeUpdate)
    audio.addEventListener('loadedmetadata',  onLoadedMetadata)
    audio.addEventListener('ended',           onEnded)
    audio.addEventListener('play',            onPlay)
    audio.addEventListener('pause',           onPause)
    return () => {
      audio.removeEventListener('timeupdate',      onTimeUpdate)
      audio.removeEventListener('loadedmetadata',  onLoadedMetadata)
      audio.removeEventListener('ended',           onEnded)
      audio.removeEventListener('play',            onPlay)
      audio.removeEventListener('pause',           onPause)
    }
  }, [playNext, loadAndPlay])

  const setQueueAndPlay = useCallback((songs, index) => {
    queueRef.current = songs
    setQueueState(songs)
    loadAndPlay(index)
  }, [loadAndPlay])

  // Returns 'added' | 'playing' | 'moved'
  const addToQueue = useCallback((song) => {
    const q   = queueRef.current
    const ci  = currentIdxRef.current
    const idx = q.findIndex(s => s.id === song.id)

    if (idx !== -1 && idx === ci) return 'playing'

    if (idx !== -1) {
      // Move existing entry to top (index 0)
      const newQueue = [...q]
      newQueue.splice(idx, 1)
      newQueue.unshift(song)
      queueRef.current = newQueue
      setQueueState(newQueue)
      // Adjust currentIndex for the removal + unshift
      if (ci !== null) {
        let newCi = ci
        if (idx < ci) newCi -= 1   // removed before current
        newCi += 1                  // unshift pushed everything right
        currentIdxRef.current = newCi
        setCurrentIdxState(newCi)
      }
      return 'moved'
    }

    // Fresh add
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
    }
    return 'added'
  }, [])

  // Move a queue item up (-1) or down (+1)
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
    if (fromIdx === ci)              newCi = toIdx
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
  }, [])

  const toggleShuffle = useCallback(() => {
    setShuffleState(s => { shuffleRef.current = !s; return !s })
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
    queue, currentSong, currentIndex, isPlaying,
    progress, duration, currentTime,
    volume, shuffle, repeat,
    setQueueAndPlay, addToQueue, moveInQueue,
    playSong, togglePlay, playNext, playPrev,
    removeFromQueue, clearQueue,
    seek, setVolume, toggleShuffle, toggleRepeat,
  }
}
