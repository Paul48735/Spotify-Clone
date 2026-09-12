import cors from "cors"
import express from "express"
import { songs } from "./data/songs.js"
import { artists } from "./data/artists.js"

const app = express()
const PORT = 3000

app.use(cors())
app.use(express.json())

app.get("/api/songs", (_request: unknown, response: any) => {
  response.json(songs)
})

app.get("/api/artists", (_request: unknown, response: any) => {
  response.json(artists)
})

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})
