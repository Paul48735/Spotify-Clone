import type { Artist } from '../types/artist'
import type { Song } from '../types/song'
import './NowPlaying.css'

type NowPlayingProps = {
  song: Song
  artist?: Artist
}

function NowPlaying({ song, artist }: NowPlayingProps) {
  return (
    <aside className="now-playing">
      <div className="now-playing-card">
        <img src={song.albumArt} alt={`${song.title} cover`} />
        <h2 className="now-playing-text">Sleep Token Mix</h2>
        <div className="song-overlay">
          <div className="song-info">
            <h3 className="now-playing-song">{song.title}</h3>
            <p className="now-playing-artist">{song.artist}</p>
          </div>
          <div className="now-playing-action"><button type="button" aria-label="Add to library">+</button></div>
        </div>
      </div>
      <div className="about-the-artist">
        <div className="artist-card">
          <img src={artist?.image ?? song.albumArt} alt={artist?.name ?? song.artist} />
          <h2>About the artist</h2>
          <div className="artist-info">
            <h3>{artist?.name ?? song.artist}</h3>
            <div className="artist-stats">
              <p>{artist?.monthlyListeners ?? '0'} monthly listeners</p>
              <button className="follow-button">Follow</button>
            </div>
            <p className="artist-description">{artist?.description ?? song.album}</p>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default NowPlaying
