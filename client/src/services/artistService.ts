import type { Artist } from "../types/artist"

export async function getArtists(): Promise<Artist[]> {
  const response = await fetch("http://localhost:3000/api/artists")

  if (!response.ok) {
    throw new Error("โหลดข้อมูลศิลปินไม่สำเร็จ")
  }

  return response.json()
}
