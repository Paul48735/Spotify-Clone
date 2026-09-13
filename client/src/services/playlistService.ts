import type { Playlist, PlaylistDetail } from '../types/playlist'

const API_URL = 'http://localhost:3000/api/playlists'

function authHeaders() {
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` }
}

async function readResponse<T>(response: Response): Promise<T> {
  if (!response.ok) throw new Error('Playlist request failed')
  return response.json()
}

export async function getPlaylists() {
  return readResponse<Playlist[]>(await fetch(API_URL, { headers: authHeaders() }))
}

export async function createPlaylist() {
  return readResponse<Playlist>(await fetch(API_URL, { method: 'POST', headers: authHeaders() }))
}

export async function getPlaylist(id: string) {
  return readResponse<PlaylistDetail>(await fetch(`${API_URL}/${id}`, { headers: authHeaders() }))
}

export async function updatePlaylist(id: string, details: { name: string; description: string; coverUrl: string }) {
  return readResponse<Playlist>(await fetch(`${API_URL}/${id}`, {
    method: 'PATCH', headers: authHeaders(), body: JSON.stringify(details),
  }))
}

export async function addPlaylistTrack(id: string, trackId: number) {
  return readResponse(await fetch(`${API_URL}/${id}/tracks`, {
    method: 'POST', headers: authHeaders(), body: JSON.stringify({ trackId }),
  }))
}

export async function removePlaylistTrack(id: string, trackId: number) {
  const response = await fetch(`${API_URL}/${id}/tracks/${trackId}`, { method: 'DELETE', headers: authHeaders() })
  if (!response.ok) throw new Error('ลบเพลงไม่สำเร็จ')
}

export async function deletePlaylist(id: string) {
  const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE', headers: authHeaders() })
  if (!response.ok) throw new Error('ลบ Playlist ไม่สำเร็จ')
}
