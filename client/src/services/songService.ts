import type { Song } from "../types/song"

export async function getSongs(): Promise<Song[]> {
  const response = await fetch("http://localhost:3000/api/songs")

  if (!response.ok) {
    throw new Error("โหลดข้อมูลเพลงไม่สำเร็จ")
  }

  return response.json()
}
