import { useCallback, useEffect, useRef, useState } from 'react'
import type { Song } from '../types/song'

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds)) return '0:00'
  const minutes = Math.floor(seconds / 60)
  const remaining = Math.floor(seconds % 60).toString().padStart(2, '0')
  return `${minutes}:${remaining}`
}

export function usePlayer(songs: Song[]) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [currentSongId, setCurrentSongId] = useState<number | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isShuffle, setIsShuffle] = useState(false)
  const [isRepeat, setIsRepeat] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolumeState] = useState(0.65)
  const lastVolume = useRef(0.65)
  const currentSong = songs.find((song) => song.id === currentSongId)
    ?? songs.find((song) => song.id === 9)
    ?? songs[0]

  if (audioRef.current === null) audioRef.current = new Audio()

  const togglePlay = useCallback(() => {
    const audio = audioRef.current
    if (!audio?.src) return
    if (audio.paused) void audio.play()
    else audio.pause()
  }, [])

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
    setCurrentSongId(song.id)
    setCurrentTime(0)
    void audio.play()
  }, [currentSongId, togglePlay])

  const playNext = useCallback(() => {
    if (isRepeat && currentSongId !== null && currentSong) {
      selectSong(currentSong, true)
      return
    }

    if (isShuffle) {
      const choices = songs.filter((song) => song.id !== currentSongId)
      const randomSong = choices[Math.floor(Math.random() * choices.length)] ?? songs[0]
      if (randomSong) selectSong(randomSong, true)
      return
    }

    const index = songs.findIndex((song) => song.id === currentSongId)
    const nextSong = songs.length ? songs[(index + 1) % songs.length] : undefined
    if (nextSong) selectSong(nextSong, true)
  }, [currentSong, currentSongId, isRepeat, isShuffle, selectSong, songs])

  const playPrevious = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    if (audio.currentTime > 2) {
      audio.currentTime = 0
      return
    }
    const index = songs.findIndex((song) => song.id === currentSongId)
    const previousIndex = index <= 0 ? songs.length - 1 : index - 1
    const previousSong = songs[previousIndex]
    if (previousSong) selectSong(previousSong, true)
  }, [currentSongId, selectSong, songs])

  const playPlaylist = useCallback(() => {
    if (currentSongId !== null) {
      togglePlay()
      return
    }

    if (isShuffle) {
      const randomSong = songs[Math.floor(Math.random() * songs.length)] ?? songs[0]
      if (randomSong) selectSong(randomSong, true)
      return
    }

    const firstSong = songs[0]
    if (firstSong) selectSong(firstSong, true)
  }, [currentSongId, isShuffle, selectSong, songs, togglePlay])

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

    const updateTime = () => setCurrentTime(audio.currentTime)
    const updateDuration = () => setDuration(audio.duration || 0)
    const updateVolume = () => setVolumeState(audio.volume)
    const started = () => setIsPlaying(true)
    const paused = () => setIsPlaying(false)

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
  }, [playNext, volume])

  return {
    currentSong, currentSongId, isPlaying, isShuffle, isRepeat, currentTime,
    duration, volume, togglePlay, selectSong, playNext, playPrevious, playPlaylist,
    toggleShuffle: () => setIsShuffle((value) => !value),
    toggleRepeat: () => setIsRepeat((value) => !value),
    seek, setVolume, toggleMute, formatTime,
  }
}
