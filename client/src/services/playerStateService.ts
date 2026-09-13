export type SavedPlayerState = {
  trackId: string | null
  positionSeconds: number
  queueType: 'rock' | 'liked_songs' | 'user_playlist' | null
  queueId: string | null
  updatedAt: string
}

const API_URL = 'http://localhost:3000/api/player/state'

function headers() {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  }
}

export async function getPlayerState() {
  const response = await fetch(API_URL, { headers: headers() })
  if (!response.ok) throw new Error('Could not load playback state')
  return response.json() as Promise<SavedPlayerState | null>
}

export async function savePlayerState(state: Omit<SavedPlayerState, 'updatedAt'>) {
  const response = await fetch(API_URL, {
    method: 'PUT',
    headers: headers(),
    body: JSON.stringify(state),
  })
  if (!response.ok) throw new Error('Could not save playback state')
}
