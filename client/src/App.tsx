import './App.css'
import { useEffect, useState } from 'react'
import Home from './components/Home'
import Library from './components/Library'
import NowPlaying from './components/NowPlaying'
import Player from './components/Player'
import Playlist from './components/Playlist'
import Topbar from './components/Topbar'
import type { Artist } from './types/artist'
import type { Song } from './types/song'
import { usePlayer } from './hooks/usePlayer'
import { getSongs } from './services/songService'
import { getArtists } from './services/artistService'

function App() {
  const [page, setPage] = useState<'home' | 'playlist'>('home')
  const [songs, setSongs] = useState<Song[]>([])
  const [artists, setArtists] = useState<Artist[]>([])
  const [isLoadingSongs, setIsLoadingSongs] = useState(true)
  const [songsError, setSongsError] = useState<string | null>(null)
  const player = usePlayer(songs)
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

  return (
    <>
      <Topbar onHomeClick={() => setPage('home')} />
      <main className="app-layout">
        <Library />
        {page === 'home' ? (
          <Home onOpenPlaylist={() => setPage('playlist')} />
        ) : (
          <Playlist
            songs={songs}
            isLoading={isLoadingSongs}
            error={songsError}
            currentSongId={player.currentSongId}
            isPlaying={player.isPlaying}
            isShuffle={player.isShuffle}
            onSelectSong={player.selectSong}
            onPlayPlaylist={player.playPlaylist}
            onToggleShuffle={player.toggleShuffle}
          />
        )}
        {player.currentSong ? (
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
          formatTime={player.formatTime}
          onTogglePlay={player.togglePlay}
          onPrevious={player.playPrevious}
          onNext={player.playNext}
          onShuffle={player.toggleShuffle}
          onRepeat={player.toggleRepeat}
          onSeek={player.seek}
          onVolume={player.setVolume}
          onToggleMute={player.toggleMute}
        />
      )}
    </>
  )
}

export default App
