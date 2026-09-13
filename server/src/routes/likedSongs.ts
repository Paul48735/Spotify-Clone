import { Router } from 'express'
import { database } from '../config/database.js'
import { songs } from '../data/songs.js'
import { requireAuth } from '../middleware/auth.js'

export const likedSongsRouter = Router()

likedSongsRouter.use(requireAuth)

likedSongsRouter.get('/', async (request, response) => {
  const result = await database.query(
    `SELECT track_id::INTEGER AS id, title, artist, artist_id AS "artistId",
            album, album_art AS "albumArt", duration, audio_url AS "audioUrl"
     FROM liked_songs
     WHERE user_id = $1
     ORDER BY liked_at DESC`,
    [request.userId]
  )

  response.json(result.rows)
})

likedSongsRouter.post('/:trackId', async (request, response) => {
  const song = songs.find((item) => String(item.id) === request.params.trackId)

  if (!song) {
    return response.status(404).json({ message: 'Song not found' })
  }

  const result = await database.query(
    `INSERT INTO liked_songs
       (user_id, track_id, title, artist, artist_id, album, album_art, duration, audio_url)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     ON CONFLICT (user_id, track_id) DO NOTHING
     RETURNING track_id::INTEGER AS id, title, artist, artist_id AS "artistId",
               album, album_art AS "albumArt", duration, audio_url AS "audioUrl"`,
    [request.userId, song.id, song.title, song.artist, song.artistId,
      song.album, song.albumArt, song.duration, song.audioUrl]
  )

  response.status(result.rows[0] ? 201 : 200).json(result.rows[0] ?? song)
})

likedSongsRouter.delete('/:trackId', async (request, response) => {
  const result = await database.query(
    `DELETE FROM liked_songs
     WHERE user_id = $1 AND track_id = $2
     RETURNING track_id`,
    [request.userId, request.params.trackId]
  )

  if (!result.rows[0]) {
    return response.status(404).json({ message: 'Liked song not found' })
  }

  response.status(204).send()
})
