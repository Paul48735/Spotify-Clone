import { useState } from 'react'
import { libraryItems } from '../data/library'

function Library() {
  const [filter, setFilter] = useState<'playlists' | 'artists' | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [query, setQuery] = useState('')

  const visibleItems = libraryItems.filter((item) => {
    const matchesFilter = !filter || item.detail.toLowerCase().includes(filter === 'playlists' ? 'playlist' : 'artist')
    return matchesFilter && `${item.title} ${item.detail}`.toLowerCase().includes(query.trim().toLowerCase())
  })

  const changeFilter = (next: 'playlists' | 'artists') => setFilter((current) => current === next ? null : next)

  return (
    <aside className="library">
      <div className="library-header"><h2 className="heading">Your Library</h2><button className="create-button">+ Create</button></div>
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
          {visibleItems.map((item) => (
            <button className="library-item" key={item.title}>
              <img className={`cover${item.artist ? ' artist-cover' : ''}`} src={item.image} alt={item.title} />
              <span className="item-info"><span className="item-title">{item.title}</span><span className="item-detail">{item.detail}</span></span>
            </button>
          ))}
        </div>
      </div>
    </aside>
  )
}

export default Library
