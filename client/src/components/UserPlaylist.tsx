import { useEffect, useMemo, useState } from 'react'
import { addPlaylistTrack, deletePlaylist, getPlaylist, removePlaylistTrack, updatePlaylist } from '../services/playlistService'
import type { Playlist, PlaylistDetail } from '../types/playlist'
import type { Song } from '../types/song'
import './UserPlaylist.css'
import './Playlist.css'

type Props = {
  playlist: Playlist
  songs: Song[]
  username: string
  currentSongId: number | null
  isPlaying: boolean
  isShuffle: boolean
  activeQueueKey: string
  onUpdated: (playlist: Playlist) => void
  onSelectSong: (song: Song, queue: Song[], queueKey: string) => void
  onPlayPlaylist: (tracks: Song[], queueKey: string) => void
  onToggleShuffle: (tracks: Song[], queueKey: string) => void
  onDeleted: (id: string) => void
  onQueueChanged: (id: string, tracks: Song[]) => void
}

function UserPlaylist({ playlist, songs, username, currentSongId, isPlaying, isShuffle, activeQueueKey, onUpdated, onSelectSong, onPlayPlaylist, onToggleShuffle, onDeleted, onQueueChanged }: Props) {
  const [detail, setDetail] = useState<PlaylistDetail | null>(null)
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(playlist.name)
  const [description, setDescription] = useState(playlist.description ?? '')
  const [coverUrl, setCoverUrl] = useState(playlist.cover_url ?? '')
  const [query, setQuery] = useState('' )
  const [playlistMenuOpen, setPlaylistMenuOpen] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [trackMenuId, setTrackMenuId] = useState<number | null>(null)
  const isThisPlaylistActive = activeQueueKey === playlist.id
  const isThisPlaylistPlaying = isPlaying && isThisPlaylistActive

  useEffect(() => { getPlaylist(playlist.id).then(setDetail).catch(() => setDetail(null)) }, [playlist.id])

  const results = useMemo(() => {
    const text = query.trim().toLowerCase()
    if (!text) return []
    const added = new Set(detail?.tracks.map((track) => String(track.id)))
    return songs.filter((song) => !added.has(String(song.id)) && `${song.title} ${song.artist}`.toLowerCase().includes(text)).slice(0, 8)
  }, [detail?.tracks, query, songs])

  const saveDetails = async () => {
    const updated = await updatePlaylist(playlist.id, { name, description, coverUrl })
    onUpdated(updated)
    setEditing(false)
  }

  const addTrack = async (song: Song) => {
    await addPlaylistTrack(playlist.id, song.id)
    const updated = await getPlaylist(playlist.id)
    setDetail(updated)
    onQueueChanged(playlist.id, updated.tracks)
  }

  const removeTrack = async (trackId: number) => {
    await removePlaylistTrack(playlist.id, trackId)
    const updated = await getPlaylist(playlist.id)
    setDetail(updated)
    onQueueChanged(playlist.id, updated.tracks)
    setTrackMenuId(null)
  }

  const confirmPlaylistDelete = async () => {
    await deletePlaylist(playlist.id)
    onDeleted(playlist.id)
  }

  return (
    <section className="home user-playlist">
      <div className="user-playlist-header">
        {coverUrl ? <img src={coverUrl} alt="Playlist cover" /> : <div className="default-cover">♫</div>}
        <div><small>Public Playlist</small><h1>{playlist.name}</h1><strong>{username}</strong></div>
      </div>
      <div className="playlist-controls user-playlist-controls">
        {!!detail?.tracks.length && <>
          <button className="playlist-play-button" type="button" aria-label={isThisPlaylistPlaying ? 'Pause playlist' : 'Play playlist'} onClick={() => onPlayPlaylist(detail.tracks, playlist.id)}>{isThisPlaylistPlaying ? '⏸' : '▶'}</button>
          <button className={isShuffle ? 'active' : ''} type="button" aria-label="Shuffle" aria-pressed={isShuffle} onClick={() => onToggleShuffle(detail.tracks, playlist.id)}>↝</button>
        </>}
        <span className="playlist-more">
          <button type="button" aria-label="More options" onClick={() => setPlaylistMenuOpen((value) => !value)}>•••</button>
          {playlistMenuOpen && <button className="delete-menu" type="button" onClick={() => setConfirmDelete(true)}>Delete</button>}
        </span>
        <button className="details-button" onClick={() => setEditing((value) => !value)}>✎ Name & details</button>
      </div>

      {editing && <div className="playlist-editor">
        <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Playlist name" />
        <input value={coverUrl} onChange={(event) => setCoverUrl(event.target.value)} placeholder="Cover image URL" />
        <textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Description" />
        <button onClick={saveDetails}>Save</button>
      </div>}

      <div className="playlist-tracks">
        {!!detail?.tracks.length && <div className="playlist-table-heading user-track-grid"><span>#</span><span>Title</span><span>Album</span><span>Duration</span><span /></div>}
        {detail?.tracks.map((song, index) => (
          <div className={`song-row user-track-grid${currentSongId === song.id ? ' active' : ''}`} key={song.id} onClick={() => onSelectSong(song, detail.tracks, playlist.id)}>
            <span className="song-index">
              <span className="song-number">{index + 1}</span>
              <span className="song-play-icon">{isThisPlaylistActive && currentSongId === song.id && isPlaying ? '⏸' : '▶'}</span>
            </span>
            <span className="song-title">
              <img src={song.albumArt} alt={song.title} />
              <span><strong>{song.title}</strong><small>{song.artist}</small></span>
            </span>
            <span>{song.album}</span><span>{song.duration}</span>
            <span className="track-more" onClick={(event) => event.stopPropagation()}>
              <button type="button" aria-label={`More options for ${song.title}`} onClick={() => setTrackMenuId((id) => id === song.id ? null : song.id)}>•••</button>
              {trackMenuId === song.id && <button className="delete-menu" type="button" onClick={() => removeTrack(song.id)}>Remove</button>}
            </span>
          </div>
        ))}
      </div>

      <div className="find-songs"><h2>Let's find something for your playlist</h2>
        <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search for songs" />
        {results.map((song) => <div className="search-song" key={song.id}><img src={song.albumArt} alt="" /><div><strong>{song.title}</strong><small>{song.artist}</small></div><button onClick={() => addTrack(song)}>Add</button></div>)}
      </div>

      {confirmDelete && <div className="delete-modal-backdrop" role="presentation">
        <div className="delete-modal" role="dialog" aria-modal="true" aria-labelledby="delete-title">
          <h2 id="delete-title">Delete from Your Library?</h2>
          <p>This will delete <strong>{playlist.name}</strong> from Your Library.</p>
          <div><button onClick={() => setConfirmDelete(false)}>Cancel</button><button className="confirm-delete" onClick={confirmPlaylistDelete}>Delete</button></div>
        </div>
      </div>}
    </section>
  )
}

export default UserPlaylist
