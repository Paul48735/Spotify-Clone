import cors from "cors"
import express from "express"
import { songs } from "./data/songs.js"
import { artists } from "./data/artists.js"
import { database } from "./config/database.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { requireAuth } from "./middleware/auth.js"
import { playlistRouter } from './routes/playlists.js'
import { likedSongsRouter } from './routes/likedSongs.js'
import { playerStateRouter } from './routes/playerState.js'

const app = express()
const PORT = 3000

app.use(cors())
app.use(express.json())

app.get("/api/songs", (request, response) => {
  const query = String(request.query.q ?? '').trim().toLowerCase()
  const result = query
    ? songs.filter((song) => `${song.title} ${song.artist} ${song.album}`.toLowerCase().includes(query))
    : songs
  response.json(result)
})

app.get("/api/artists", (_request: unknown, response: any) => {
  response.json(artists)
})

app.get("/api/health/database", async (_request, response) => {
  try {
    const result = await database.query("SELECT NOW() AS current_time")

    response.json({
      status: "connected",
      databaseTime: result.rows[0].current_time
    })
  } catch {
    response.status(500).json({
      status: "connection failed"
    })
  }
})

app.get("/api/users", async (_request, response) => {
  try {
    const result = await database.query(`
      SELECT id, username, email, created_at
      FROM users
      ORDER BY id
    `)

    response.json(result.rows)
  } catch (error) {
    console.error(error)

    response.status(500).json({
      message: "โหลดข้อมูลผู้ใช้ไม่สำเร็จ"
    })
  }
})

app.post("/api/users", async (request, response) => {
  const { username, email, password } = request.body

  if (!username || !email || !password) {
    return response.status(400).json({
      message: "กรุณากรอกข้อมูลให้ครบ"
    })
  }

  try {
    const passwordHash = await bcrypt.hash(password, 12)

    const result = await database.query(
      `INSERT INTO users (username, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, username, email, created_at`,
      [username, email, passwordHash]
    )

    return response.status(201).json(result.rows[0])
  } catch {
    return response.status(500).json({
      message: "สร้างผู้ใช้ไม่สำเร็จ"
    })
  }
})

app.post("/api/auth/login", async (request, response) => {
  const { email, password } = request.body

  if (!email || !password) {
    return response.status(400).json({
      message: "กรุณากรอก email และ password"
    })
  }

  const result = await database.query(
    `SELECT id, username, email, password_hash
     FROM users
     WHERE email = $1`,
    [email]
  )

  const user = result.rows[0]

  if (!user) {
    return response.status(401).json({
      message: "Email หรือ Password ไม่ถูกต้อง"
    })
  }

  const passwordIsCorrect = await bcrypt.compare(
    password,
    user.password_hash
  )

  if (!passwordIsCorrect) {
    return response.status(401).json({
      message: "Email หรือ Password ไม่ถูกต้อง"
    })
  }

  const jwtSecret = process.env.JWT_SECRET

  if (!jwtSecret) {
    return response.status(500).json({
      message: "Server configuration error"
    })
  }

  const token = jwt.sign(
    { userId: user.id },
    jwtSecret,
    { expiresIn: "7d" }
  )

  return response.json({
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email
    }
  })
})

app.get("/api/auth/me", requireAuth, async (request, response) => {
  const result = await database.query(
    `SELECT id, username, email, created_at
     FROM users
     WHERE id = $1`,
    [request.userId]
  )

  const user = result.rows[0]

  if (!user) {
    return response.status(404).json({
      message: "ไม่พบผู้ใช้"
    })
  }

  return response.json(user)
})

app.use('/api/playlists', playlistRouter)
app.use('/api/liked-songs', likedSongsRouter)
app.use('/api/player/state', playerStateRouter)

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})
