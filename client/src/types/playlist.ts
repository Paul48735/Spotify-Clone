import type { Song } from './song'

export type Playlist = {
  id: string
  name: string
  description: string | null
  cover_url: string | null
  created_at: string
  updated_at: string
}

export type PlaylistDetail = Playlist & { tracks: Song[] }
