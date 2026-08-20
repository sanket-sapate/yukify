import { useState, useCallback } from 'react'
import { songs } from '../data/songs'

const STORAGE_KEY = 'yukify_playlists'

function isInstrumental(song) {
  return /\s-\sI\.(mp3|aac|wav|flac|ogg|m4a)$/i.test(decodeURIComponent(song.src))
}

// Always-present playlists — derived from songs, cannot be deleted
export const defaultPlaylists = [
  {
    id: '__with_instruments__',
    name: 'Strings Attached',
    isDefault: true,
    songIds: songs.filter(isInstrumental).map(s => s.id),
  },
  {
    id: '__without_instruments__',
    name: 'Bare Soul',
    isDefault: true,
    songIds: songs.filter(s => !isInstrumental(s)).map(s => s.id),
  },
]

function load() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [] }
  catch { return [] }
}

function save(playlists) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(playlists))
}

export function usePlaylists() {
  const [userPlaylists, setUserPlaylists] = useState(load)

  // Consumers always get defaults first, then user playlists
  const playlists = [...defaultPlaylists, ...userPlaylists]

  const createPlaylist = useCallback((name) => {
    const newList = { id: Date.now(), name, songIds: [] }
    setUserPlaylists(prev => {
      const updated = [...prev, newList]
      save(updated)
      return updated
    })
    return newList
  }, [])

  const deletePlaylist = useCallback((id) => {
    // Default playlists cannot be deleted
    if (defaultPlaylists.some(p => p.id === id)) return
    setUserPlaylists(prev => {
      const updated = prev.filter(p => p.id !== id)
      save(updated)
      return updated
    })
  }, [])

  const renamePlaylist = useCallback((id, name) => {
    if (defaultPlaylists.some(p => p.id === id)) return
    setUserPlaylists(prev => {
      const updated = prev.map(p => p.id === id ? { ...p, name } : p)
      save(updated)
      return updated
    })
  }, [])

  const addSongToPlaylist = useCallback((playlistId, songId) => {
    if (defaultPlaylists.some(p => p.id === playlistId)) return
    setUserPlaylists(prev => {
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
    if (defaultPlaylists.some(p => p.id === playlistId)) return
    setUserPlaylists(prev => {
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
