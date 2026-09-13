import './App.css'
import { useEffect, useState } from 'react'
import AuthPage from './components/AuthPage'
import Home from './components/Home'
import Library from './components/Library'
import NowPlaying from './components/NowPlaying'
import QueuePanel from './components/QueuePanel'
import Player from './components/Player'
import Playlist from './components/Playlist'
import Topbar from './components/Topbar'
import UserPlaylist from './components/UserPlaylist'
import type { Artist } from './types/artist'
import type { Song } from './types/song'
import { usePlayer } from './hooks/usePlayer'
import { getSongs } from './services/songService'
import { getArtists } from './services/artistService'
import { getCurrentUser, type AuthResponse } from './services/authService'
import type { User } from './types/user'
import type { Playlist as PlaylistType } from './types/playlist'
import { createPlaylist, getPlaylist, getPlaylists } from './services/playlistService'
import { getLikedSongs, likeSong, unlikeSong } from './services/likedSongService'

function App() {
  const [page, setPage] = useState<'home' | 'rock-playlist' | 'user-playlist' | 'liked-songs'>('home')
  const [songs, setSongs] = useState<Song[]>([])
  const [artists, setArtists] = useState<Artist[]>([])
  const [isLoadingSongs, setIsLoadingSongs] = useState(true)
  const [songsError, setSongsError] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [isCheckingAuth, setIsCheckingAuth] = useState(() => Boolean(localStorage.getItem('token')))
  const [playlists, setPlaylists] = useState<PlaylistType[]>([])
  const [selectedPlaylist, setSelectedPlaylist] = useState<PlaylistType | null>(null)
  const [isQueueOpen, setIsQueueOpen] = useState(false)
  const [likedSongs, setLikedSongs] = useState<Song[]>([])
  const [hasLoadedLikedSongs, setHasLoadedLikedSongs] = useState(false)
  const player = usePlayer(songs, user?.id ?? null)
  const syncPlayerQueue = player.syncQueue
  const currentArtist = artists.find(
    (artist) => artist.id === player.currentSong?.artistId
  )

  useEffect(() => {
    getSongs()
      .then(setSongs)
      .catch((error: unknown) => {
        setSongsError(error instanceof Error ? error.message : 'โหลดข้อมูลเพลงไม่สำเร็จ')
      })
      .finally(() => setIsLoadingSongs(false))
  }, [])

  useEffect(() => {
    getArtists()
      .then(setArtists)
      .catch((error: unknown) => {
        console.error("โหลดศิลปินไม่สำเร็จ", error)
      })
  }, [])

  useEffect(() => {
    if (user) getPlaylists().then(setPlaylists).catch(() => setPlaylists([]))
  }, [user])

  useEffect(() => {
    if (!user) return
    let cancelled = false
    getLikedSongs()
      .then((items) => { if (!cancelled) setLikedSongs(items) })
      .catch(() => { if (!cancelled) setLikedSongs([]) })
      .finally(() => { if (!cancelled) setHasLoadedLikedSongs(true) })
    return () => { cancelled = true }
  }, [user])

  const restoredQueueType = player.restoredState?.queueType
  const restoredQueueId = player.restoredState?.queueId

  useEffect(() => {
    if (restoredQueueType === 'rock' && songs.length) syncPlayerQueue('rock', songs)
  }, [restoredQueueType, songs, syncPlayerQueue])

  useEffect(() => {
    if (restoredQueueType === 'liked_songs' && hasLoadedLikedSongs) {
      syncPlayerQueue('liked-songs', likedSongs)
    }
  }, [hasLoadedLikedSongs, likedSongs, restoredQueueType, syncPlayerQueue])

  useEffect(() => {
    if (restoredQueueType !== 'user_playlist' || !restoredQueueId) return
    let cancelled = false
    getPlaylist(restoredQueueId)
      .then((playlist) => { if (!cancelled) syncPlayerQueue(restoredQueueId, playlist.tracks) })
      .catch((error: unknown) => console.error('Could not restore playlist queue', error))
    return () => { cancelled = true }
  }, [restoredQueueId, restoredQueueType, syncPlayerQueue])

  useEffect(() => {
    const token = localStorage.getItem('token')

    if (!token) {
      return
    }

    getCurrentUser(token)
      .then(setUser)
      .catch(() => localStorage.removeItem('token'))
      .finally(() => setIsCheckingAuth(false))
  }, [])

  const handleAuthenticated = (result: AuthResponse) => {
    localStorage.setItem('token', result.token)
    setLikedSongs([])
    setHasLoadedLikedSongs(false)
    setUser(result.user)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    setUser(null)
    setLikedSongs([])
    setHasLoadedLikedSongs(false)
  }

  const handleToggleLike = async () => {
    const song = player.currentSong
    if (!song) return

    if (likedSongs.some((item) => item.id === song.id)) {
      await unlikeSong(song.id)
      const nextSongs = likedSongs.filter((item) => item.id !== song.id)
      setLikedSongs(nextSongs)
      player.syncQueue('liked-songs', nextSongs)
    } else {
      const savedSong = await likeSong(song.id)
      const nextSongs = [savedSong, ...likedSongs]
      setLikedSongs(nextSongs)
      player.syncQueue('liked-songs', nextSongs)
    }
  }

  const handleCreatePlaylist = async () => {
    const playlist = await createPlaylist()
    setPlaylists((current) => [playlist, ...current])
    setSelectedPlaylist(playlist)
    setPage('user-playlist')
  }

  const handleOpenPlaylist = (playlist: PlaylistType) => {
    setSelectedPlaylist(playlist)
    setPage('user-playlist')
  }

  const handlePlaylistUpdated = (playlist: PlaylistType) => {
    setSelectedPlaylist(playlist)
    setPlaylists((current) => current.map((item) => item.id === playlist.id ? playlist : item))
  }

  const handlePlaylistDeleted = (id: string) => {
    player.clearQueue(id)
    setPlaylists((current) => current.filter((playlist) => playlist.id !== id))
    setSelectedPlaylist(null)
    setPage('home')
  }

  if (isCheckingAuth) {
    return <main className="auth-page"><p>Checking your account...</p></main>
  }

  if (!user) {
    return <AuthPage onAuthenticated={handleAuthenticated} />
  }

  return (
    <>
      <Topbar onHomeClick={() => setPage('home')} username={user.username} onLogout={handleLogout} />
      <main className="app-layout">
        <Library playlists={playlists} username={user.username}  onCreatePlaylist={handleCreatePlaylist} onOpenPlaylist={handleOpenPlaylist} onOpenLikedSongs={() => setPage('liked-songs')} />
        {page === 'home' ? (
          <Home onOpenPlaylist={() => setPage('rock-playlist')} />
        ) : page === 'rock-playlist' ? (
          <Playlist
            songs={songs}
            isLoading={isLoadingSongs}
            error={songsError}
            currentSongId={player.currentSongId}
            isPlaying={player.isPlaying}
            isShuffle={player.isShuffleForQueue('rock')}
            isActiveQueue={player.activeQueueKey === 'rock'}
            onSelectSong={(song) => player.selectSongFromQueue(song, songs)}
            onPlayPlaylist={() => player.playPlaylist(songs, 'rock')}
            onToggleShuffle={() => player.toggleShuffleForQueue(songs, 'rock')}
          />
        ) : page === 'liked-songs' ? (
          <Playlist
            songs={likedSongs}
            isLoading={false}
            error={null}
            currentSongId={player.currentSongId}
            isPlaying={player.isPlaying}
            isShuffle={player.isShuffleForQueue('liked-songs')}
            isActiveQueue={player.activeQueueKey === 'liked-songs'}
            onSelectSong={(song) => player.selectSongFromQueue(song, likedSongs, 'liked-songs')}
            onPlayPlaylist={() => player.playPlaylist(likedSongs, 'liked-songs')}
            onToggleShuffle={() => player.toggleShuffleForQueue(likedSongs, 'liked-songs')}
            title="Liked Songs"
            description="Songs you have saved"
            image="https://picsum.photos/seed/liked-songs/300"
            ownerText={`Playlist • ${user.username} • ${likedSongs.length} songs`}
            showExtraControls={false}
          />
        ) : selectedPlaylist ? (
          <UserPlaylist
            key={selectedPlaylist.id}
            playlist={selectedPlaylist}
            songs={songs}
            username={user.username}
            currentSongId={player.activeQueueKey === selectedPlaylist.id ? player.currentSongId : null}
            isPlaying={player.activeQueueKey === selectedPlaylist.id && player.isPlaying}
            isShuffle={player.isShuffleForQueue(selectedPlaylist.id)}
            activeQueueKey={player.activeQueueKey}
            onUpdated={handlePlaylistUpdated}
            onSelectSong={player.selectSongFromQueue}
            onPlayPlaylist={player.playPlaylist}
            onToggleShuffle={player.toggleShuffleForQueue}
            onDeleted={handlePlaylistDeleted}
            onQueueChanged={player.syncQueue}
          />
        ) : (
          <Home onOpenPlaylist={() => setPage('rock-playlist')} />
        )}
        {player.currentSong && isQueueOpen ? (
          <QueuePanel
            currentSong={player.currentSong}
            queue={player.queue}
            onSelectSong={player.selectSong}
            onClose={() => setIsQueueOpen(false)}
          />
        ) : player.currentSong ? (
          <NowPlaying song={player.currentSong} artist={currentArtist} />
        ) : (
          <aside className="now-playing"><p className="content-status">Loading player...</p></aside>
        )}
      </main>
      {player.currentSong && (
        <Player
          song={player.currentSong}
          isPlaying={player.isPlaying}
          isShuffle={player.isShuffle}
          isRepeat={player.isRepeat}
          currentTime={player.currentTime}
          duration={player.duration}
          volume={player.volume}
          isQueueOpen={isQueueOpen}
          isLiked={likedSongs.some((song) => song.id === player.currentSong?.id)}
          formatTime={player.formatTime}
          onTogglePlay={player.togglePlay}
          onPrevious={player.playPrevious}
          onNext={player.playNext}
          onShuffle={player.toggleShuffle}
          onRepeat={player.toggleRepeat}
          onSeek={player.seek}
          onVolume={player.setVolume}
          onToggleMute={player.toggleMute}
          onToggleQueue={() => setIsQueueOpen((current) => !current)}
          onToggleLike={handleToggleLike}
        />
      )}
    </>
  )
}

export default App
