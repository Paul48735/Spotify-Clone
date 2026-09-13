import { database } from '../config/database.js'

await database.query(`
  CREATE TABLE IF NOT EXISTS users (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS playlists (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    cover_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  ALTER TABLE playlists ADD COLUMN IF NOT EXISTS cover_url TEXT;
  ALTER TABLE playlists ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

  CREATE INDEX IF NOT EXISTS playlists_user_created_at_idx
    ON playlists (user_id, created_at DESC);

  CREATE TABLE IF NOT EXISTS playlist_tracks (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    playlist_id BIGINT NOT NULL REFERENCES playlists(id) ON DELETE CASCADE,
    track_id VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    artist VARCHAR(255) NOT NULL,
    artist_id VARCHAR(255) NOT NULL,
    album VARCHAR(255) NOT NULL,
    album_art TEXT,
    duration VARCHAR(20) NOT NULL,
    audio_url TEXT,
    added_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (playlist_id, track_id)
  );

  CREATE TABLE IF NOT EXISTS liked_songs (
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    track_id VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    artist VARCHAR(255) NOT NULL,
    artist_id VARCHAR(255) NOT NULL,
    album VARCHAR(255) NOT NULL,
    album_art TEXT,
    duration VARCHAR(20) NOT NULL,
    audio_url TEXT,
    liked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, track_id)
  );

  CREATE INDEX IF NOT EXISTS liked_songs_user_liked_at_idx
    ON liked_songs (user_id, liked_at DESC);

  CREATE TABLE IF NOT EXISTS user_playback_state (
    user_id BIGINT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    track_id VARCHAR(255),
    position_seconds NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (position_seconds >= 0),
    queue_type VARCHAR(30),
    queue_id VARCHAR(255),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CHECK (
      queue_type IS NULL
      OR queue_type IN ('rock', 'liked_songs', 'user_playlist')
    ),
    CHECK (queue_type <> 'user_playlist' OR queue_id IS NOT NULL)
  );
`)

console.log('Database migration complete')
await database.end()
