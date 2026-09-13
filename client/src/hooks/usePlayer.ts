import { useCallback, useEffect, useRef, useState } from 'react'
import type { Song } from '../types/song'
import { getPlayerState, savePlayerState, type SavedPlayerState } from '../services/playerStateService'

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds)) return '0:00'
  const minutes = Math.floor(seconds / 60)
  const remaining = Math.floor(seconds % 60).toString().padStart(2, '0')
  return `${minutes}:${remaining}`
}

export function usePlayer(songs: Song[], userId: string | null) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [currentSongId, setCurrentSongId] = useState<number | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [shuffleByQueue, setShuffleByQueue] = useState<Record<string, boolean>>({})
  const [isRepeat, setIsRepeat] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolumeState] = useState(0.65)
  const [activeQueue, setActiveQueue] = useState<Song[]>([])
  const [hasActiveQueue, setHasActiveQueue] = useState(false)
  const [activeQueueKey, setActiveQueueKey] = useState('')
  const isShuffle = shuffleByQueue[activeQueueKey || 'rock'] ?? false
  const isShuffleForQueue = (queueKey: string) => shuffleByQueue[queueKey] ?? false
  const [restoredState, setRestoredState] = useState<SavedPlayerState | null>(null)
  const [isStateLoaded, setIsStateLoaded] = useState(false)
  const lastVolume = useRef(0.65)
  const lastSavedAt = useRef(0)
  const currentSongIdRef = useRef<number | null>(null)
  const activeQueueKeyRef = useRef('')
  const currentSong = songs.find((song) => song.id === currentSongId)
    ?? songs.find((song) => song.id === 9)
    ?? songs[0]
  const queue = hasActiveQueue ? activeQueueKey === 'rock' ? songs : activeQueue : songs

  const saveState = useCallback((trackId: number | null, positionSeconds: number, queueKey: string) => {
    if (!userId || !isStateLoaded) return
    const queueType = queueKey === 'rock' ? 'rock' : queueKey === 'liked-songs' ? 'liked_songs' : queueKey ? 'user_playlist' : null
    const queueId = queueType === 'user_playlist' ? queueKey : null
    void savePlayerState({ trackId: trackId === null ? null : String(trackId), positionSeconds, queueType, queueId })
      .catch((error: unknown) => console.error('Could not save playback state', error))
    lastSavedAt.current = Date.now()
  }, [isStateLoaded, userId])

  useEffect(() => {
    let cancelled = false
    const audio = audioRef.current
    audio?.pause()
    if (audio) {
      audio.removeAttribute('src')
      audio.load()
    }
    queueMicrotask(() => {
      if (cancelled) return
      currentSongIdRef.current = null
      activeQueueKeyRef.current = ''
      setCurrentSongId(null)
      setCurrentTime(0)
      setIsPlaying(false)
      setShuffleByQueue({})
      setActiveQueue([])
      setHasActiveQueue(false)
      setActiveQueueKey('')
      setRestoredState(null)
      setIsStateLoaded(false)
    })

    if (!userId) {
      queueMicrotask(() => { if (!cancelled) setIsStateLoaded(true) })
      return () => { cancelled = true }
    }

    getPlayerState()
      .then((saved) => {
        if (cancelled || !saved) return
        setRestoredState(saved)
        const id = saved.trackId === null ? null : Number(saved.trackId)
        if (id !== null && Number.isFinite(id)) {
          currentSongIdRef.current = id
          setCurrentSongId(id)
        }
        setCurrentTime(Number(saved.positionSeconds) || 0)
        const key = saved.queueType === 'liked_songs' ? 'liked-songs'
          : saved.queueType === 'user_playlist' ? saved.queueId ?? ''
            : saved.queueType ?? ''
        activeQueueKeyRef.current = key
        setActiveQueueKey(key)
        if (key) setHasActiveQueue(true)
      })
      .catch((error: unknown) => {
        if (!cancelled) console.error('Could not load playback state', error)
      })
      .finally(() => { if (!cancelled) setIsStateLoaded(true) })

    return () => { cancelled = true }
  }, [userId])

  if (audioRef.current === null) audioRef.current = new Audio()

  const togglePlay = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    if (!audio.src) {
      if (!currentSong) return
      audio.src = currentSong.audioUrl
      audio.currentTime = currentTime
      currentSongIdRef.current = currentSong.id
      setCurrentSongId(currentSong.id)
      saveState(currentSong.id, currentTime, activeQueueKeyRef.current)
      void audio.play()
      return
    }
    if (audio.paused) void audio.play()
    else audio.pause()
  }, [currentSong, currentTime, saveState])

  const selectSong = useCallback((song: Song, forceRestart = false) => {
    const audio = audioRef.current
    if (!audio) return

    if (currentSongId === song.id && audio.src && !forceRestart) {
      togglePlay()
      return
    }

    audio.pause()
    audio.currentTime = 0
    audio.src = song.audioUrl
    currentSongIdRef.current = song.id
    setCurrentSongId(song.id)
    setCurrentTime(0)
    saveState(song.id, 0, activeQueueKeyRef.current)
    void audio.play()
  }, [currentSongId, saveState, togglePlay])

  const selectSongFromQueue = useCallback((song: Song, queue: Song[], queueKey = 'rock') => {
    const queueChanged = activeQueueKey !== queueKey
    activeQueueKeyRef.current = queueKey
    setActiveQueueKey(queueKey)
    setHasActiveQueue(true)
    setActiveQueue(queue)
    selectSong(song, queueChanged)
  }, [activeQueueKey, selectSong])

  const playNext = useCallback(() => {
    const queue = activeQueueKey === 'rock' ? songs : activeQueueKey ? activeQueue : songs
    const effectiveSongId = currentSongId ?? currentSong?.id ?? null

    if (isRepeat && currentSong) {
      selectSong(currentSong, true)
      return
    }

    if (isShuffle) {
      const choices = queue.filter((song) => song.id !== effectiveSongId)
      const randomSong = choices[Math.floor(Math.random() * choices.length)] ?? queue[0]
      if (randomSong) selectSong(randomSong, true)
      return
    }

    const index = queue.findIndex((song) => song.id === effectiveSongId)
    const nextSong = queue.length ? queue[(index + 1) % queue.length] : undefined
    if (nextSong) selectSong(nextSong, true)
  }, [activeQueue, activeQueueKey, currentSong, currentSongId, isRepeat, isShuffle, selectSong, songs])

  const playPrevious = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    if (audio.currentTime > 2) {
      audio.currentTime = 0
      return
    }
    const queue = activeQueueKey === 'rock' ? songs : activeQueueKey ? activeQueue : songs
    const effectiveSongId = currentSongId ?? currentSong?.id ?? null
    const index = queue.findIndex((song) => song.id === effectiveSongId)
    const previousIndex = index <= 0 ? queue.length - 1 : index - 1
    const previousSong = queue[previousIndex]
    if (previousSong) selectSong(previousSong, true)
  }, [activeQueue, activeQueueKey, currentSong, currentSongId, selectSong, songs])

  const playPlaylist = useCallback((playlistSongs: Song[] = songs, queueKey = 'rock') => {
    if (playlistSongs.length === 0) return
    const isSameQueue = activeQueueKey === queueKey
    setActiveQueueKey(queueKey)
    setHasActiveQueue(true)
    setActiveQueue(playlistSongs)
    activeQueueKeyRef.current = queueKey

    const currentBelongsToPlaylist = playlistSongs.some((song) => song.id === currentSongId)

    if (isSameQueue && currentSongId !== null && currentBelongsToPlaylist) {
      togglePlay()
      return
    }

    if (shuffleByQueue[queueKey]) {
      const randomSong = playlistSongs[Math.floor(Math.random() * playlistSongs.length)] ?? playlistSongs[0]
      if (randomSong) selectSong(randomSong, true)
      return
    }

    const firstSong = playlistSongs[0]
    if (firstSong) selectSong(firstSong, true)
  }, [activeQueueKey, currentSongId, shuffleByQueue, selectSong, songs, togglePlay])

  const syncQueue = useCallback((queueKey: string, queue: Song[]) => {
    if (activeQueueKey === queueKey) setActiveQueue(queue)
  }, [activeQueueKey])

  const toggleShuffleForQueue = useCallback((queue: Song[], queueKey: string) => {
    if (!queue.length) return
    setShuffleByQueue((current) => ({ ...current, [queueKey]: !current[queueKey] }))
  }, [])

  const clearQueue = useCallback((queueKey: string) => {
    if (activeQueueKey !== queueKey) return
    audioRef.current?.pause()
    audioRef.current?.removeAttribute('src')
    audioRef.current?.load()
    activeQueueKeyRef.current = ''
    setActiveQueueKey('')
    setHasActiveQueue(false)
    setActiveQueue([])
    setCurrentSongId(null)
    currentSongIdRef.current = null
    setCurrentTime(0)
    saveState(null, 0, '')
  }, [activeQueueKey, saveState])

  const seek = (percent: number) => {
    const audio = audioRef.current
    if (audio?.duration) audio.currentTime = percent * audio.duration
  }

  const setVolume = (newVolume: number) => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = Math.min(1, Math.max(0, newVolume))
  }

  const toggleMute = () => {
    if (volume > 0) {
      lastVolume.current = volume
      setVolume(0)
    } else setVolume(lastVolume.current)
  }

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = volume

    const updateTime = () => {
      setCurrentTime(audio.currentTime)
      if (Date.now() - lastSavedAt.current >= 5000) {
        saveState(currentSongIdRef.current, audio.currentTime, activeQueueKeyRef.current)
      }
    }
    const updateDuration = () => setDuration(audio.duration || 0)
    const updateVolume = () => setVolumeState(audio.volume)
    const started = () => setIsPlaying(true)
    const paused = () => {
      setIsPlaying(false)
      if (currentSongIdRef.current !== null) {
        saveState(currentSongIdRef.current, audio.currentTime, activeQueueKeyRef.current)
      }
    }

    audio.addEventListener('timeupdate', updateTime)
    audio.addEventListener('loadedmetadata', updateDuration)
    audio.addEventListener('volumechange', updateVolume)
    audio.addEventListener('play', started)
    audio.addEventListener('pause', paused)
    audio.addEventListener('ended', playNext)

    return () => {
      audio.removeEventListener('timeupdate', updateTime)
      audio.removeEventListener('loadedmetadata', updateDuration)
      audio.removeEventListener('volumechange', updateVolume)
      audio.removeEventListener('play', started)
      audio.removeEventListener('pause', paused)
      audio.removeEventListener('ended', playNext)
    }
  }, [playNext, saveState, volume])

  return {
    currentSong, currentSongId, isPlaying, isShuffle, isRepeat, currentTime, activeQueueKey, restoredState,
    duration, volume, queue, togglePlay, selectSong, selectSongFromQueue, playNext, playPrevious, playPlaylist, syncQueue, clearQueue, toggleShuffleForQueue,
    isShuffleForQueue,
    toggleShuffle: () => toggleShuffleForQueue(queue, activeQueueKey || 'rock'),
    toggleRepeat: () => setIsRepeat((value) => !value),
    seek, setVolume, toggleMute, formatTime,
  }
}
