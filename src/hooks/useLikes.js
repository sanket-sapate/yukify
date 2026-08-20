import { useState, useCallback } from 'react'

const STORAGE_KEY = 'yukify_likes'

function load() {
  try { return new Set(JSON.parse(localStorage.getItem(STORAGE_KEY)) || []) }
  catch { return new Set() }
}

export function useLikes() {
  const [likedIds, setLikedIds] = useState(load)

  const toggleLike = useCallback((songId) => {
    setLikedIds(prev => {
      const next = new Set(prev)
      if (next.has(songId)) next.delete(songId)
      else next.add(songId)
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]))
      return next
    })
  }, [])

  return { likedIds, toggleLike }
}
