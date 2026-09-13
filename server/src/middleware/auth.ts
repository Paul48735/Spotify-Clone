import type { NextFunction, Request, Response } from "express"
import jwt, { type JwtPayload } from "jsonwebtoken"

declare global {
  namespace Express {
    interface Request {
      userId?: string
    }
  }
}

export function requireAuth(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const authorization = request.headers.authorization
  const token = authorization?.split(" ")[1]
  const jwtSecret = process.env.JWT_SECRET

  if (!token || !jwtSecret) {
    response.status(401).json({
      message: "กรุณา Login"
    })
    return
  }

  try {
    const payload = jwt.verify(token, jwtSecret) as JwtPayload

    if (!payload.userId) {
      response.status(401).json({
        message: "Token ไม่ถูกต้อง"
      })
      return
    }

    request.userId = String(payload.userId)
    next()
  } catch {
    response.status(401).json({
      message: "Token หมดอายุหรือไม่ถูกต้อง"
    })
  }
}