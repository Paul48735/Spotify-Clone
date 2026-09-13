import type { Song } from '../types/song'

const API_URL = 'http://localhost:3000/api/liked-songs'
const authHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem('token')}` })

export async function getLikedSongs() {
  const response = await fetch(API_URL, { headers: authHeaders() })
  if (!response.ok) throw new Error('Could not load liked songs')
  return response.json() as Promise<Song[]>
}

export async function likeSong(trackId: number) {
  const response = await fetch(`${API_URL}/${trackId}`, { method: 'POST', headers: authHeaders() })
  if (!response.ok) throw new Error('Could not like song')
  return response.json() as Promise<Song>
}

export async function unlikeSong(trackId: number) {
  const response = await fetch(`${API_URL}/${trackId}`, { method: 'DELETE', headers: authHeaders() })
  if (!response.ok) throw new Error('Could not unlike song')
}
