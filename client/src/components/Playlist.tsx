import type { Song } from '../types/song'
import './Playlist.css'

type Props = {
  songs: Song[]; isLoading: boolean; error: string | null
  currentSongId: number | null; isPlaying: boolean; isShuffle: boolean
  isActiveQueue?: boolean; onSelectSong: (song: Song) => void
  onPlayPlaylist: () => void; onToggleShuffle: () => void
  title?: string; description?: string; image?: string; ownerText?: string
  showExtraControls?: boolean
}

function Playlist({ songs, isLoading, error, currentSongId, isPlaying, isShuffle,
  isActiveQueue = false, onSelectSong, onPlayPlaylist, onToggleShuffle,
  title = 'Rock Mix', description = 'Sleep Token, Linkin Park, Foo Fighters and more',
  image = 'https://image-cdn-ak.spotifycdn.com/image/ab67706c0000da84ca966977380ba83ad20f968e',
  ownerText = 'Playlist • Rock favourites', showExtraControls = true }: Props) {
  const isThisPlaylistPlaying = isActiveQueue && isPlaying

  return <section className="home"><div className="playlist-page">
    <div className="playlist-header">
      <img src={image} alt={title} />
      <div className="playlist-header-info"><h1>{title}</h1><p>{description}</p><strong>{ownerText}</strong></div>
    </div>

    {songs.length > 0 && <>
      <div className="playlist-controls">
        <button className="playlist-play-button" type="button" aria-label={isThisPlaylistPlaying ? 'Pause playlist' : 'Play playlist'} onClick={() => onPlayPlaylist()}>{isThisPlaylistPlaying ? '⏸' : '▶'}</button>
        <button className={isShuffle ? 'active' : ''} type="button" aria-label="Shuffle" aria-pressed={isShuffle} onClick={onToggleShuffle}>↝</button>
        {showExtraControls && <><button type="button" aria-label="Add playlist">＋</button><button type="button" aria-label="More options">•••</button></>}
      </div>
      <div className="playlist-table-heading"><span>#</span><span>Title</span><span>Album</span><span>Duration</span></div>
    </>}

    {isLoading && <p className="content-status">Loading songs...</p>}
    {error && <p className="content-status error">{error}</p>}
    {!isLoading && !error && songs.length === 0 && <p className="content-status">No songs found.</p>}
    {!isLoading && !error && songs.map((song, index) => (
      <button className={`song-row${isActiveQueue && currentSongId === song.id ? ' active' : ''}`} type="button" key={song.id} onClick={() => onSelectSong(song)}>
        <span className="song-index"><span className="song-number">{index + 1}</span><span className="song-play-icon">{isActiveQueue && currentSongId === song.id && isPlaying ? '⏸' : '▶'}</span></span>
        <span className="song-title"><img src={song.albumArt} alt={song.title} /><span><strong>{song.title}</strong><small>{song.artist}</small></span></span>
        <span>{song.album}</span><span>{song.duration}</span>
      </button>
    ))}
  </div></section>
}

export default Playlist
