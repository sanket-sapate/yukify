import { useState, useCallback } from 'react'

const STORAGE_KEY = 'yukify_playlists'

function load() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [] }
  catch { return [] }
}

function save(playlists) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(playlists))
}

export function usePlaylists() {
  const [playlists, setPlaylists] = useState(load)

  const createPlaylist = useCallback((name) => {
    const newList = { id: Date.now(), name, songIds: [] }
    setPlaylists(prev => {
      const updated = [...prev, newList]
      save(updated)
      return updated
    })
    return newList
  }, [])

  const deletePlaylist = useCallback((id) => {
    setPlaylists(prev => {
      const updated = prev.filter(p => p.id !== id)
      save(updated)
      return updated
    })
  }, [])

  const renamePlaylist = useCallback((id, name) => {
    setPlaylists(prev => {
      const updated = prev.map(p => p.id === id ? { ...p, name } : p)
      save(updated)
      return updated
    })
  }, [])

  const addSongToPlaylist = useCallback((playlistId, songId) => {
    setPlaylists(prev => {
      const updated = prev.map(p => {
        if (p.id !== playlistId) return p
        if (p.songIds.includes(songId)) return p
        return { ...p, songIds: [...p.songIds, songId] }
      })
      save(updated)
      return updated
    })
  }, [])

  const removeSongFromPlaylist = useCallback((playlistId, songId) => {
    setPlaylists(prev => {
      const updated = prev.map(p =>
        p.id === playlistId ? { ...p, songIds: p.songIds.filter(id => id !== songId) } : p
      )
      save(updated)
      return updated
    })
  }, [])

  return {
    playlists,
    createPlaylist,
    deletePlaylist,
    renamePlaylist,
    addSongToPlaylist,
    removeSongFromPlaylist,
  }
}
