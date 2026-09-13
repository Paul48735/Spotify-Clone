import type { User } from "../types/user"

const API_URL = "http://localhost:3000"

export type AuthResponse = {
  token: string
  user: User
}

export async function register(
  username: string,
  email: string,
  password: string
): Promise<User> {
  const response = await fetch(`${API_URL}/api/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ username, email, password })
  })

  if (!response.ok) {
    throw new Error("สมัครสมาชิกไม่สำเร็จ")
  }

  return response.json()
}

export async function login(
  email: string,
  password: string
): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
  })

  if (!response.ok) {
    throw new Error("Email หรือ Password ไม่ถูกต้อง")
  }

  return response.json()
}

export async function getCurrentUser(token: string): Promise<User> {
  const response = await fetch(`${API_URL}/api/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  if (!response.ok) {
    throw new Error("Token ไม่ถูกต้องหรือหมดอายุ")
  }

  return response.json()
}