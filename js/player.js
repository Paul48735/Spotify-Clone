import { songs } from '../song.js'
import { artists } from '../artist.js'

const audioPlayer = new Audio()
let currentSongId = null
let isShuffleActive = false
let isRepeatActive = false
let lastVolume = 0.65
let isAdjustingVolume = false

const playButton = document.getElementById('play-button')
const previousButton = document.getElementById('previous-button')
const nextButton = document.getElementById('next-button')
const shuffleButton = document.getElementById('shuffle-button')
const repeatButton = document.getElementById('repeat-button')
const playlistPlayButton = document.querySelector('.playlist-play-button')
const volumeButton = document.getElementById('volume-button')
const volumeTrack = document.getElementById('volume-track')
const volumeCurrent = document.getElementById('volume-current')
const currentCover = document.getElementById('current-cover')
const currentTitle = document.getElementById('current-title')
const currentArtist = document.getElementById('current-artist')
const progressCurrentTime = document.getElementById('progress-current-time')
const progressDuration = document.getElementById('progress-duration')
const progressTrack = document.querySelector('.progress-track')
const progressCurrent = document.querySelector('.progress-current')
const nowPlayingCover = document.querySelector('.now-playing-card > img')
const nowPlayingSong = document.querySelector('.now-playing-song')
const nowPlayingArtist = document.querySelector('.now-playing-artist')
const artistImage = document.querySelector('.artist-card > img')
const artistName = document.querySelector('.artist-info h3')
const artistListeners = document.querySelector('.artist-stats p')
const artistDescription = document.querySelector('.artist-description')

audioPlayer.volume = lastVolume

function setPlayButton(isPlaying) {
    playButton.innerHTML = isPlaying ? '&#x23F8;' : '&#9654;'
    playButton.setAttribute('aria-label', isPlaying ? 'Pause' : 'Play')
}

export function updateSongRowIcons() {
    document.querySelectorAll('.song-row').forEach(function (songRow) {
        const songId = Number(songRow.dataset.songId)
        const songIcon = songRow.querySelector('.song-play-icon')
        const isCurrentSong = songId === currentSongId
        const isPlaying = isCurrentSong && !audioPlayer.paused

        songRow.classList.toggle('active', isCurrentSong)
        songIcon.innerHTML = isPlaying ? '&#x23F8;' : '&#9654;'
    })

    const isPlaying = currentSongId !== null && !audioPlayer.paused
    playlistPlayButton.innerHTML = isPlaying ? '&#x23F8;' : '&#9654;'
    playlistPlayButton.setAttribute('aria-label', isPlaying ? 'Pause playlist' : 'Play playlist')
}

function formatTime(seconds) {
    if (!Number.isFinite(seconds)) {
        return '0:00'
    }

    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60).toString().padStart(2, '0')
    return minutes + ':' + remainingSeconds
}

function getPlayableSongs() {
    return songs.filter(function (song) {
        return song.audioUrl
    })
}

function updateSelectedSong(selectedSong) {
    currentCover.src = selectedSong.albumArt
    currentCover.alt = selectedSong.title + ' cover'
    currentTitle.textContent = selectedSong.title
    currentArtist.textContent = selectedSong.artist
    progressDuration.textContent = selectedSong.duration
    nowPlayingCover.src = selectedSong.albumArt
    nowPlayingCover.alt = selectedSong.title + ' cover'
    nowPlayingSong.textContent = selectedSong.title
    nowPlayingArtist.textContent = selectedSong.artist

    const selectedArtist = artists.find(function (artist) {
        return artist.id === selectedSong.artistId
    })

    if (selectedArtist) {
        artistImage.src = selectedArtist.image
        artistImage.alt = selectedArtist.name
        artistName.textContent = selectedArtist.name
        artistListeners.textContent = selectedArtist.monthlyListeners + ' monthly listeners'
        artistDescription.textContent = selectedArtist.description
    }
}

function toggleCurrentSong() {
    if (!audioPlayer.src) {
        return
    }

    if (audioPlayer.paused) {
        audioPlayer.play()
    } else {
        audioPlayer.pause()
    }

    setPlayButton(!audioPlayer.paused)
    updateSongRowIcons()
}

export function selectSong(songId, forceRestart = false) {
    const selectedSong = songs.find(function (song) {
        return song.id === songId
    })

    if (!selectedSong) {
        return
    }

    if (currentSongId === songId && audioPlayer.src && !forceRestart) {
        toggleCurrentSong()
        return
    }

    audioPlayer.pause()
    audioPlayer.currentTime = 0
    updateSelectedSong(selectedSong)
    progressCurrentTime.textContent = '0:00'
    progressCurrent.style.width = '0%'

    if (selectedSong.audioUrl) {
        currentSongId = selectedSong.id
        audioPlayer.src = selectedSong.audioUrl
        audioPlayer.play()
        setPlayButton(true)
    } else {
        currentSongId = null
        audioPlayer.removeAttribute('src')
        audioPlayer.load()
        setPlayButton(false)
    }

    updateSongRowIcons()
}

function playNextSong() {
    const playableSongs = getPlayableSongs()

    if (playableSongs.length === 0) {
        return
    }

    if (isRepeatActive && currentSongId !== null) {
        selectSong(currentSongId, true)
        return
    }

    if (isShuffleActive) {
        let randomSong = playableSongs[Math.floor(Math.random() * playableSongs.length)]

        while (randomSong.id === currentSongId && playableSongs.length > 1) {
            randomSong = playableSongs[Math.floor(Math.random() * playableSongs.length)]
        }

        selectSong(randomSong.id, true)
        return
    }

    const currentIndex = playableSongs.findIndex(function (song) {
        return song.id === currentSongId
    })
    const nextIndex = (currentIndex + 1) % playableSongs.length
    selectSong(playableSongs[nextIndex].id, true)
}

function playPreviousSong() {
    const playableSongs = getPlayableSongs()

    if (playableSongs.length === 0) {
        return
    }

    if (audioPlayer.currentTime > 2) {
        audioPlayer.currentTime = 0
        return
    }

    const currentIndex = playableSongs.findIndex(function (song) {
        return song.id === currentSongId
    })
    const previousIndex = currentIndex <= 0 ? playableSongs.length - 1 : currentIndex - 1
    selectSong(playableSongs[previousIndex].id, true)
}

function changeVolume(event) {
    const trackPosition = volumeTrack.getBoundingClientRect()
    const pointerPosition = (event.clientX - trackPosition.left) / trackPosition.width
    const newVolume = Math.min(1, Math.max(0, pointerPosition))

    audioPlayer.volume = newVolume

    if (newVolume > 0) {
        lastVolume = newVolume
    }
}

export function setupPlayer() {
    playButton.addEventListener('click', toggleCurrentSong)
    previousButton.addEventListener('click', playPreviousSong)
    nextButton.addEventListener('click', playNextSong)

    playlistPlayButton.addEventListener('click', function () {
        if (currentSongId === null) {
            const firstSong = getPlayableSongs()[0]

            if (firstSong) {
                selectSong(firstSong.id, true)
            }
        } else {
            toggleCurrentSong()
        }
    })

    shuffleButton.addEventListener('click', function () {
        isShuffleActive = !isShuffleActive
        shuffleButton.classList.toggle('active', isShuffleActive)
        shuffleButton.setAttribute('aria-pressed', isShuffleActive)
    })

    repeatButton.addEventListener('click', function () {
        isRepeatActive = !isRepeatActive
        repeatButton.classList.toggle('active', isRepeatActive)
        repeatButton.setAttribute('aria-pressed', isRepeatActive)
    })

    volumeTrack.addEventListener('pointerdown', function (event) {
        isAdjustingVolume = true
        volumeTrack.setPointerCapture(event.pointerId)
        changeVolume(event)
    })

    volumeTrack.addEventListener('pointermove', function (event) {
        if (isAdjustingVolume) {
            changeVolume(event)
        }
    })

    volumeTrack.addEventListener('pointerup', function () {
        isAdjustingVolume = false
    })

    volumeButton.addEventListener('click', function () {
        if (audioPlayer.volume > 0) {
            lastVolume = audioPlayer.volume
            audioPlayer.volume = 0
        } else {
            audioPlayer.volume = lastVolume
        }
    })

    progressTrack.addEventListener('click', function (event) {
        if (!audioPlayer.duration) {
            return
        }

        const trackPosition = progressTrack.getBoundingClientRect()
        const clickPercent = (event.clientX - trackPosition.left) / trackPosition.width
        audioPlayer.currentTime = clickPercent * audioPlayer.duration
    })

    audioPlayer.addEventListener('volumechange', function () {
        volumeCurrent.style.width = audioPlayer.volume * 100 + '%'

        if (audioPlayer.volume === 0) {
            volumeButton.innerHTML = '&#128263;'
            volumeButton.setAttribute('aria-label', 'Unmute')
        } else if (audioPlayer.volume < 0.5) {
            volumeButton.innerHTML = '&#128265;'
            volumeButton.setAttribute('aria-label', 'Mute')
        } else {
            volumeButton.innerHTML = '&#128266;'
            volumeButton.setAttribute('aria-label', 'Mute')
        }
    })

    audioPlayer.addEventListener('loadedmetadata', function () {
        progressDuration.textContent = formatTime(audioPlayer.duration)
    })

    audioPlayer.addEventListener('timeupdate', function () {
        progressCurrentTime.textContent = formatTime(audioPlayer.currentTime)

        if (audioPlayer.duration) {
            const progressPercent = (audioPlayer.currentTime / audioPlayer.duration) * 100
            progressCurrent.style.width = progressPercent + '%'
        }
    })

    audioPlayer.addEventListener('ended', playNextSong)
}
