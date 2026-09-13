import { useState } from 'react'
import type { Playlist } from '../types/playlist'
import './Library.css'

type Props = { playlists: Playlist[]; username: string;  onCreatePlaylist: () => void; onOpenPlaylist: (playlist: Playlist) => void; onOpenLikedSongs: () => void }

function Library({ playlists, username, onCreatePlaylist, onOpenPlaylist, onOpenLikedSongs }: Props) {
  const [filter, setFilter] = useState<'playlists' | 'artists' | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [query, setQuery] = useState('')

  const changeFilter = (next: 'playlists' | 'artists') => setFilter((current) => current === next ? null : next)

  return (
    <aside className="library">
      <div className="library-header"><h2 className="heading">Your Library</h2><button className="create-button" onClick={onCreatePlaylist}>+ Create</button></div>
      <div className="filter-button">
        <button className="create-button" onClick={() => changeFilter('playlists')}>Playlists</button>
        <button className="create-button" onClick={() => changeFilter('artists')}>Artists</button>
      </div>
      <div className="library-scroll">
        <div className="library-tools">
          <div>
            <button className="search-library" type="button" aria-label="Search your library" onClick={() => {
              setIsSearching((value) => !value)
              if (isSearching) setQuery('')
            }}>⌕</button>
            {isSearching && <input className="library-search-input" type="search" placeholder="Search in your library" value={query} onChange={(event) => setQuery(event.target.value)} autoFocus />}
          </div>
          <button className="recents-button" type="button">Recents <span>☷</span></button>
        </div>
        <div className="library-list">
          {filter !== 'artists' && 'Liked Songs'.toLowerCase().includes(query.toLowerCase()) && (
            <button className="library-item" onClick={onOpenLikedSongs}>
              <img className="cover" src="https://picsum.photos/seed/liked-songs/120" alt="" />
              <span className="item-info"><span className="item-title">Liked Songs</span><span className="item-detail">Playlist • {username}</span></span>
            </button>
          )}
          {filter !== 'artists' && playlists.filter((playlist) => playlist.name.toLowerCase().includes(query.toLowerCase())).map((playlist) => (
            <button className="library-item" key={`playlist-${playlist.id}`} onClick={() => onOpenPlaylist(playlist)}>
              {playlist.cover_url ? <img className="cover" src={playlist.cover_url} alt="" /> : <span className="cover default-library-cover">♫</span>}
              <span className="item-info"><span className="item-title">{playlist.name}</span><span className="item-detail">Playlist • {username}</span></span>
            </button>
          ))}
          {/* {visibleItems.map((item) => (
            <button className="library-item" key={item.title}>
              <img className={`cover${item.artist ? ' artist-cover' : ''}`} src={item.image} alt={item.title} />
              <span className="item-info"><span className="item-title">{item.title}</span><span className="item-detail">{item.detail}</span></span>
            </button>
          ))} */}
        </div>
      </div>
    </aside>
  )
}

export default Library
