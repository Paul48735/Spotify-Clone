import { Router } from 'express'
import { database } from '../config/database.js'
import { requireAuth } from '../middleware/auth.js'

export const playerStateRouter = Router()

playerStateRouter.use(requireAuth)

playerStateRouter.get('/', async (request, response) => {
  const result = await database.query(
    `SELECT track_id AS "trackId",
            position_seconds::DOUBLE PRECISION AS "positionSeconds",
            queue_type AS "queueType",
            queue_id AS "queueId",
            updated_at AS "updatedAt"
     FROM user_playback_state
     WHERE user_id = $1`,
    [request.userId]
  )

  response.json(result.rows[0] ?? null)
})

playerStateRouter.put('/', async (request, response) => {
  const { trackId, positionSeconds, queueType, queueId } = request.body
  const validQueueTypes = ['rock', 'liked_songs', 'user_playlist']

  if (
    (trackId !== null && typeof trackId !== 'string' && typeof trackId !== 'number') ||
    typeof positionSeconds !== 'number' || !Number.isFinite(positionSeconds) || positionSeconds < 0 ||
    (queueType !== null && !validQueueTypes.includes(queueType)) ||
    (queueId !== null && typeof queueId !== 'string' && typeof queueId !== 'number') ||
    (queueType === 'user_playlist' && queueId == null)
  ) {
    return response.status(400).json({ message: 'Invalid player state' })
  }

  const result = await database.query(
    `INSERT INTO user_playback_state
       (user_id, track_id, position_seconds, queue_type, queue_id, updated_at)
     VALUES ($1, $2, $3, $4, $5, NOW())
     ON CONFLICT (user_id) DO UPDATE SET
       track_id = EXCLUDED.track_id,
       position_seconds = EXCLUDED.position_seconds,
       queue_type = EXCLUDED.queue_type,
       queue_id = EXCLUDED.queue_id,
       updated_at = NOW()
     RETURNING track_id AS "trackId",
               position_seconds::DOUBLE PRECISION AS "positionSeconds",
               queue_type AS "queueType",
               queue_id AS "queueId",
               updated_at AS "updatedAt"`,
    [request.userId, trackId == null ? null : String(trackId), positionSeconds,
      queueType ?? null, queueId == null ? null : String(queueId)]
  )

  response.json(result.rows[0])
})
