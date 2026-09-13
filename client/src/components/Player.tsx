import type { PointerEvent } from 'react'
import type { Song } from '../types/song'
import './Player.css'

type PlayerProps = {
  song: Song
  isPlaying: boolean
  isShuffle: boolean
  isRepeat: boolean
  currentTime: number
  duration: number
  volume: number
  isQueueOpen: boolean
  isLiked: boolean
  formatTime: (seconds: number) => string
  onTogglePlay: () => void
  onPrevious: () => void
  onNext: () => void
  onShuffle: () => void
  onRepeat: () => void
  onSeek: (percent: number) => void
  onVolume: (volume: number) => void
  onToggleMute: () => void
  onToggleQueue: () => void
  onToggleLike: () => void
}

function pointerPercent(event: PointerEvent<HTMLDivElement>) {
  const rectangle = event.currentTarget.getBoundingClientRect()
  return Math.min(1, Math.max(0, (event.clientX - rectangle.left) / rectangle.width))
}

function changeFromPointer(event: PointerEvent<HTMLDivElement>, changeValue: (value: number) => void) {
  changeValue(pointerPercent(event))
}

function Player(props: PlayerProps) {
  const progress = props.duration ? (props.currentTime / props.duration) * 100 : 0
  const volumeIcon = props.volume === 0 ? '🔇' : props.volume < 0.5 ? '🔉' : '🔊'

  return (
    <footer className="player">
      <div className="current-track">
        <img src={props.song.albumArt} alt={`${props.song.title} cover`} />
        <div className="current-track-info"><h3>{props.song.title}</h3><p>{props.song.artist}</p></div>
        <button className="current-track-button" type="button" aria-label="Remove from playlist">×</button>
        <button className={`current-track-button add-track-button${props.isLiked ? ' active' : ''}`} type="button" aria-label={props.isLiked ? 'Remove from liked songs' : 'Add to liked songs'} aria-pressed={props.isLiked} onClick={props.onToggleLike}>{props.isLiked ? '✓' : '+'}</button>
      </div>
      <div className="player-center">
        <div className="player-controls">
          <button className={props.isShuffle ? 'active' : ''} type="button" aria-label="Shuffle" aria-pressed={props.isShuffle} onClick={props.onShuffle}>⇄</button>
          <button type="button" aria-label="Previous song" onClick={props.onPrevious}>◀</button>
          <button className="play-button" type="button" aria-label={props.isPlaying ? 'Pause' : 'Play'} onClick={props.onTogglePlay}>{props.isPlaying ? '⏸' : '▶'}</button>
          <button type="button" aria-label="Next song" onClick={props.onNext}>▶</button>
          <button className={props.isRepeat ? 'active' : ''} type="button" aria-label="Repeat" aria-pressed={props.isRepeat} onClick={props.onRepeat}>↻</button>
        </div>
        <div className="player-progress">
          <span>{props.formatTime(props.currentTime)}</span>
          <div className="progress-track" onPointerDown={(event) => props.onSeek(pointerPercent(event))}>
            <div className="progress-current" style={{ width: `${progress}%` }} />
          </div>
          <span>{props.duration ? props.formatTime(props.duration) : props.song.duration}</span>
        </div>
      </div>
      <div className="player-tools">
        <button type="button" aria-label="Lyrics">♫</button>
        <button className={props.isQueueOpen ? 'active' : ''} type="button" aria-label="Queue" aria-pressed={props.isQueueOpen} onClick={props.onToggleQueue}>☰</button>
        <button type="button" aria-label={props.volume === 0 ? 'Unmute' : 'Mute'} onClick={props.onToggleMute}>{volumeIcon}</button>
        <div
          className="volume-track"
          onPointerDown={(event) => {
            event.currentTarget.setPointerCapture(event.pointerId)
            changeFromPointer(event, props.onVolume)
          }}
          onPointerMove={(event) => {
            if (event.currentTarget.hasPointerCapture(event.pointerId)) changeFromPointer(event, props.onVolume)
          }}
          onPointerUp={(event) => event.currentTarget.releasePointerCapture(event.pointerId)}
        >
          <div className="volume-current" style={{ width: `${props.volume * 100}%` }} />
        </div>
        <button type="button" aria-label="Full screen">⛶</button>
      </div>
    </footer>
  )
}

export default Player
