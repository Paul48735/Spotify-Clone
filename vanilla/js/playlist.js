import { songs } from '../song.js'
import { selectSong, updateSongRowIcons } from './player.js'

export function setupPlaylist() {
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

        updateSongRowIcons()
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

    playlistSongs.addEventListener('click', function (event) {
        const playIcon = event.target.closest('.song-play-icon')

        if (!playIcon) {
            return
        }

        const songRow = playIcon.closest('.song-row')
        selectSong(Number(songRow.dataset.songId))
    })
}
