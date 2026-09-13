import { Router } from 'express'
import { database } from '../config/database.js'
import { songs } from '../data/songs.js'
import { requireAuth } from '../middleware/auth.js'

export const playlistRouter = Router()

playlistRouter.use(requireAuth)

playlistRouter.get('/', async (request, response) => {
  const result = await database.query(
    `SELECT id, name, description, cover_url, created_at, updated_at
     FROM playlists WHERE user_id = $1 ORDER BY created_at DESC`,
    [request.userId]
  )
  response.json(result.rows)
})

playlistRouter.post('/', async (request, response) => {
  const count = await database.query('SELECT COUNT(*) FROM playlists WHERE user_id = $1', [request.userId])
  const name = `My Playlist #${Number(count.rows[0].count) + 1}`
  const result = await database.query(
    `INSERT INTO playlists (user_id, name) VALUES ($1, $2)
     RETURNING id, name, description, cover_url, created_at, updated_at`,
    [request.userId, name]
  )
  response.status(201).json(result.rows[0])
})

playlistRouter.get('/:id', async (request, response) => {
  const playlistResult = await database.query(
    `SELECT id, name, description, cover_url, created_at, updated_at
     FROM playlists WHERE id = $1 AND user_id = $2`,
    [request.params.id, request.userId]
  )
  if (!playlistResult.rows[0]) return response.status(404).json({ message: 'ไม่พบ Playlist' })

  const tracksResult = await database.query(
    `SELECT track_id::INTEGER AS id, title, artist, album, album_art AS "albumArt",
            duration, audio_url AS "audioUrl", artist_id AS "artistId"
     FROM playlist_tracks WHERE playlist_id = $1 ORDER BY added_at`,
    [request.params.id]
  )
  response.json({ ...playlistResult.rows[0], tracks: tracksResult.rows })
})

playlistRouter.patch('/:id', async (request, response) => {
  const { name, description, coverUrl } = request.body
  if (name !== undefined && !String(name).trim()) return response.status(400).json({ message: 'ชื่อ Playlist ห้ามว่าง' })

  const result = await database.query(
    `UPDATE playlists SET
       name = COALESCE($1, name), description = COALESCE($2, description),
       cover_url = COALESCE($3, cover_url), updated_at = NOW()
     WHERE id = $4 AND user_id = $5
     RETURNING id, name, description, cover_url, created_at, updated_at`,
    [name?.trim(), description, coverUrl, request.params.id, request.userId]
  )
  if (!result.rows[0]) return response.status(404).json({ message: 'ไม่พบ Playlist' })
  response.json(result.rows[0])
})

playlistRouter.post('/:id/tracks', async (request, response) => {
  const owner = await database.query('SELECT id FROM playlists WHERE id = $1 AND user_id = $2', [request.params.id, request.userId])
  if (!owner.rows[0]) return response.status(404).json({ message: 'ไม่พบ Playlist' })

  const song = songs.find((item) => item.id === Number(request.body.trackId))
  if (!song) return response.status(404).json({ message: 'ไม่พบเพลง' })

  await database.query(
    `INSERT INTO playlist_tracks
       (playlist_id, track_id, title, artist, artist_id, album, album_art, duration, audio_url)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
     ON CONFLICT (playlist_id, track_id) DO NOTHING`,
    [request.params.id, String(song.id), song.title, song.artist, song.artistId, song.album, song.albumArt, song.duration, song.audioUrl]
  )
  response.status(201).json(song)
})

playlistRouter.delete('/:id/tracks/:trackId', async (request, response) => {
  const result = await database.query(
    `DELETE FROM playlist_tracks USING playlists
     WHERE playlist_tracks.playlist_id = playlists.id
       AND playlists.id = $1 AND playlists.user_id = $2
       AND playlist_tracks.track_id = $3
     RETURNING playlist_tracks.track_id`,
    [request.params.id, request.userId, request.params.trackId]
  )
  if (!result.rows[0]) return response.status(404).json({ message: 'ไม่พบเพลงใน Playlist' })
  response.status(204).send()
})

playlistRouter.delete('/:id', async (request, response) => {
  const result = await database.query(
    'DELETE FROM playlists WHERE id = $1 AND user_id = $2 RETURNING id',
    [request.params.id, request.userId]
  )
  if (!result.rows[0]) return response.status(404).json({ message: 'ไม่พบ Playlist' })
  response.status(204).send()
})
