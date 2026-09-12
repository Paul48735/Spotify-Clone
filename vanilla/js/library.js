export function setupLibrary() {
    const playlistsButton = document.getElementById('playlists-button')
    const artistsButton = document.getElementById('artists-button')
    const searchLibraryButton = document.getElementById('search-library')
    const librarySearchInput = document.getElementById('library-search-input')
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

        items.forEach(function (item) {
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

    function searchLibraryItems(query) {
        const items = document.querySelectorAll('.library-item')
        const searchTerm = query.toLowerCase().trim()

        items.forEach(function (item) {
            const title = item.querySelector('.item-title').textContent.toLowerCase()
            const detail = item.querySelector('.item-detail').textContent.toLowerCase()
            const matches = title.includes(searchTerm) || detail.includes(searchTerm)

            item.style.display = !searchTerm || matches ? 'flex' : 'none'
        })
    }

    playlistsButton.addEventListener('click', function () {
        filterLibrary('playlists')
    })

    artistsButton.addEventListener('click', function () {
        filterLibrary('artists')
    })

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
}
