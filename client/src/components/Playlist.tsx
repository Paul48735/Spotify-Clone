import type { Song } from '../data/songs'

type PlaylistProps = {
  songs: Song[]
  isLoading: boolean
  error: string | null
  currentSongId: number | null
  isPlaying: boolean
  onSelectSong: (song: Song) => void
  onPlayPlaylist: () => void
}

function Playlist({ songs, isLoading, error, currentSongId, isPlaying, onSelectSong, onPlayPlaylist }: PlaylistProps) {
  return (
    <section className="home">
      <div className="playlist-page">
        <div className="playlist-header">
          <img src="https://image-cdn-ak.spotifycdn.com/image/ab67706c0000da84ca966977380ba83ad20f968e" alt="Rock Mix" />
          <div className="playlist-header-info"><h1>Rock Mix</h1><p>Sleep Token, Linkin Park, Foo Fighters and more</p><strong>Playlist • Rock favourites</strong></div>
        </div>
        <div className="playlist-controls">
          <button className="playlist-play-button" type="button" aria-label={isPlaying ? 'Pause playlist' : 'Play playlist'} onClick={onPlayPlaylist}>{isPlaying ? '⏸' : '▶'}</button>
          <button type="button" aria-label="Shuffle">↝</button><button type="button" aria-label="Add playlist">＋</button><button type="button" aria-label="More options">•••</button>
        </div>
        <div className="playlist-table-heading"><span>#</span><span>Title</span><span>Album</span><span>Duration</span></div>

        {isLoading && <p className="content-status">Loading songs...</p>}
        {error && <p className="content-status error">{error}</p>}
        {!isLoading && !error && songs.length === 0 && <p className="content-status">No songs found.</p>}
        {!isLoading && !error && songs.map((song, index) => (
          <button className={`song-row${currentSongId === song.id ? ' active' : ''}`} type="button" key={song.id} onClick={() => onSelectSong(song)}>
            <span className="song-index"><span className="song-number">{index + 1}</span><span className="song-play-icon">{currentSongId === song.id && isPlaying ? '⏸' : '▶'}</span></span>
            <span className="song-title"><img src={song.albumArt} alt={song.title} /><span><strong>{song.title}</strong><small>{song.artist}</small></span></span>
            <span>{song.album}</span><span>{song.duration}</span>
          </button>
        ))}
      </div>
    </section>
  )
}

export default Playlist
