import type { Song } from '../types/song'
import './QueuePanel.css'

type Props = {
  currentSong: Song
  queue: Song[]
  onSelectSong: (song: Song) => void
  onClose: () => void
}

function QueuePanel({ currentSong, queue, onSelectSong, onClose }: Props) {
  const currentIndex = queue.findIndex((song) => song.id === currentSong.id)
  const orderedNext = currentIndex >= 0 ? [...queue.slice(currentIndex + 1), ...queue.slice(0, currentIndex)] : queue
  const nextSongs = orderedNext.slice(0, 10)

  const songItem = (song: Song, current = false) => (
    <button className={`queue-song${current ? ' current' : ''}`} key={song.id} onClick={() => onSelectSong(song)}>
      <img src={song.albumArt} alt="" />
      <span><strong>{song.title}</strong><small>{song.artist}</small></span>
    </button>
  )

  return (
    <aside className="now-playing queue-panel">
      <div className="queue-heading"><h2>Queue</h2><button type="button" aria-label="Close queue" onClick={onClose}>×</button></div>
      <h3>Now playing</h3>
      {songItem(currentSong, true)}
      <h3>Next in queue</h3>
      <div className="queue-list">
        {nextSongs.length ? nextSongs.map((song) => songItem(song)) : <p className="queue-empty">No more songs in queue.</p>}
      </div>
    </aside>
  )
}

export default QueuePanel
