import { songs } from './song.js'
import { artists } from './artist.js'

// Play & Pause
const playButton = document.getElementById('play-button')
let isPlaying = false

playButton.addEventListener('click', function () {
    isPlaying = !isPlaying
    if (isPlaying) {
        playButton.innerHTML = '&#x23F8'
        playButton.setAttribute('aria-label', 'Pause')
    } else {
        playButton.innerHTML = '&#9654;'
        playButton.setAttribute('aria-label', 'Play')
    }
})

// Playlists & Artists in library
const playlistsButton = document.getElementById('playlists-button')
const artistsButton = document.getElementById('artists-button')
let currentFilter = null
let isSearching = false

function filterLibrary(type) {
    const items = document.querySelectorAll('.library-item')

    if (currentFilter === type && !isSearching) {
        type = null
        currentFilter = null
    } else {
        currentFilter = type
    }

    items.forEach(item => {
        const detail = item.querySelector('.item-detail').textContent.toLowerCase()
        if (!type) {
            item.style.display = 'flex'
        } else if (type === 'playlists') {
            item.style.display = detail.includes('playlist') ? 'flex' : 'none'
        } else if (type === 'artists') {
            item.style.display = detail.includes('artist') ? 'flex' : 'none'
        }
    })
}

playlistsButton.addEventListener('click', function () {
    filterLibrary('playlists')
})

artistsButton.addEventListener('click', function () {
    filterLibrary('artists')
})

// Search in Library
const searchLibraryButton = document.getElementById('search-library')
const librarySearchInput = document.getElementById('library-search-input')

function searchLibraryItems(query) {
    const items = document.querySelectorAll('.library-item')
    const searchTerm = query.toLowerCase().trim()

    items.forEach(item => {
        const title = item.querySelector('.item-title').textContent.toLowerCase()
        const detail = item.querySelector('.item-detail').textContent.toLowerCase()

        if (!searchTerm) {
            item.style.display = 'flex'
        } else {
            const matches = title.includes(searchTerm) || detail.includes(searchTerm)
            item.style.display = matches ? 'flex' : 'none'
        }
    })
}

searchLibraryButton.addEventListener('click', function () {
    isSearching = !isSearching

    if (isSearching) {
        librarySearchInput.style.display = 'inline-block'
        librarySearchInput.focus()
    } else {
        librarySearchInput.style.display = 'none'
        librarySearchInput.value = ''
        searchLibraryItems('')
    }
})

librarySearchInput.addEventListener('input', function () {
    searchLibraryItems(this.value)
})

// Rock Mix Playlist Page
const homePage = document.getElementById('home-page')
const playlistPage = document.getElementById('playlist-page')
const rockMixCard = document.getElementById('rock-mix-card')
const playlistSongs = document.getElementById('playlist-songs')
const homeButton = document.querySelector('.home-button')

function renderPlaylist() {
    playlistSongs.innerHTML = songs.map(function (song, index) {
        return `
            <button class="song-row" type="button" data-song-id="${song.id}">
                <span class="song-index">
                    <span class="song-number">${index + 1}</span>
                    <span class="song-play-icon">&#9654;</span>
                </span>
                <span class="song-title">
                    <img src="${song.albumArt}" alt="${song.title}">
                    <span>
                        <strong>${song.title}</strong>
                        <small>${song.artist}</small>
                    </span>
                </span>
                <span>${song.album}</span>
                <span>${song.duration}</span>
            </button>
        `
    }).join('')
}

rockMixCard.addEventListener('click', function () {
    renderPlaylist()
    homePage.style.display = 'none'
    playlistPage.style.display = 'block'
})

homeButton.addEventListener('click', function () {
    playlistPage.style.display = 'none'
    homePage.style.display = 'block'
})

// Select Song
const currentCover = document.getElementById('current-cover')
const currentTitle = document.getElementById('current-title')
const currentArtist = document.getElementById('current-artist')
const progressDuration = document.getElementById('progress-duration')
const nowPlayingCover = document.querySelector('.now-playing-card > img')
const nowPlayingSong = document.querySelector('.now-playing-song')
const nowPlayingArtist = document.querySelector('.now-playing-artist')
const artistImage = document.querySelector('.artist-card > img')
const artistName = document.querySelector('.artist-info h3')
const artistListeners = document.querySelector('.artist-stats p')
const artistDescription = document.querySelector('.artist-description')

playlistSongs.addEventListener('click', function (event) {
    const songRow = event.target.closest('.song-row')

    if (!songRow) {
        return
    }

    const songId = Number(songRow.dataset.songId)
    const selectedSong = songs.find(function (song) {
        return song.id === songId
    })

    if (!selectedSong) {
        return
    }

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

    isPlaying = true
    playButton.innerHTML = '&#x23F8;'
    playButton.setAttribute('aria-label', 'Pause')
})



