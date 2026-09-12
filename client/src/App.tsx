import './App.css'
import { useState } from 'react'
import Home from './components/Home'
import Library from './components/Library'
import NowPlaying from './components/NowPlaying'
import Player from './components/Player'
import Playlist from './components/Playlist'
import Topbar from './components/Topbar'
import { artists } from './data/artists'
import { songs } from './data/songs'
import { usePlayer } from './hooks/usePlayer'

function App() {
  const [page, setPage] = useState<'home' | 'playlist'>('home')
  const player = usePlayer()
  const currentArtist = artists.find((artist) => artist.id === player.currentSong.artistId)

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
            isLoading={false}
            error={null}
            currentSongId={player.currentSongId}
            isPlaying={player.isPlaying}
            onSelectSong={player.selectSong}
            onPlayPlaylist={player.playPlaylist}
          />
        )}
        <NowPlaying song={player.currentSong} artist={currentArtist} />
      </main>
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
    </>
  )
}

export default App
