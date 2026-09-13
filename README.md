# Spotify Clone

A full-stack music player inspired by Spotify.  
Built to practice frontend development, REST APIs, authentication, database relationships, and audio player state management.

## Features

- Register, login, and logout with JWT authentication
- Create, edit, and delete personal playlists
- Add and remove songs from playlists
- Like and unlike songs
- Liked Songs playlist
- Play, pause, next, previous, seek, and volume controls
- Shuffle and repeat modes
- Queue panel
- Resume playback separately for each user
- Search songs in the library
- Responsive Spotify-inspired interface

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- CSS

### Backend

- Node.js
- Express
- TypeScript
- JWT
- bcrypt

### Database

- PostgreSQL
- `pg`

## Project Structure

```text
spotify-clone/
├── client/     # React frontend
├── server/     # Express API and database migration
└── vanilla/    # Original HTML, CSS, and JavaScript prototype
```

# Getting Started
1. Clone the repository

2. Configure the server

Create server/.env:
PGHOST=localhost
PGPORT=5432
PGDATABASE=spotify_clone
PGUSER=postgres
PGPASSWORD=your_password
JWT_SECRET=your_secret

*Do not commit this file.*

3. Install dependencies and run the server
cd server
npm install
npm run db:migrate
npm run dev

4. Run the frontend
Open another terminal
cd client
npm install
npm run dev

Current Limitations
- Song data currently uses local mock data
- Only a small number of audio files are included for demonstration
- Spotify Web API integration is not implemented
- Automated tests and production deployment are not configured yet

What I Learned
- Building reusable React components
- Managing shared audio player and queue state
- Creating REST API endpoints with Express
- Implementing JWT authentication
- Designing PostgreSQL tables and relationships
- Synchronizing frontend state with backend data
