import './Topbar.css'

import { useState } from 'react'

type TopbarProps = {
  onHomeClick: () => void
  username: string
  onLogout: () => void
}

function Topbar({ onHomeClick, username, onLogout }: TopbarProps) {
    const [isProfileOpen, setIsProfileOpen] = useState(false)

    return (
        <header className="topbar">
        <div className="topbar-left">
            <button className="topbar-icon" type="button" aria-label="More options">•••</button>
            <button className="topbar-icon" type="button" aria-label="Go back">‹</button>
            <button className="topbar-icon" type="button" aria-label="Go forward">›</button>
        </div>

        <div className="topbar-center">
            <button className="home-button" type="button" aria-label="Home" onClick={onHomeClick}>&#8962;</button>
            <div className="search-box">
                <span className="search-symbol">&#128269;</span>
                <input type="search" placeholder="What do you want to play?" aria-label="Search" />
                <span className="browse-symbol">&#9635;</span>
            </div>
        </div>

        <div className="topbar-right">
            <button className="topbar-icon small-icon" type="button" aria-label="Notifications">&#128276;</button>
            <button className="topbar-icon small-icon" type="button" aria-label="Friends">&#128101;</button>
            <div className="profile-menu">
                <button
                    className="profile-button"
                    type="button"
                    aria-label={`${username} profile`}
                    aria-expanded={isProfileOpen}
                    onClick={() => setIsProfileOpen((value) => !value)}
                >
                    {username.charAt(0).toUpperCase()}
                </button>
                {isProfileOpen && (
                    <div className="profile-dropdown">
                        <strong>{username}</strong>
                        <button type="button" onClick={onLogout}>Log out</button>
                    </div>
                )}
            </div>
        </div>
    </header>
    )
}

export default Topbar;
