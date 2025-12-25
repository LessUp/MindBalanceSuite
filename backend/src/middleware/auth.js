import jwt from 'jsonwebtoken'
import { db } from '../db.js'

function getJwtSecret() {
  return process.env.JWT_SECRET || 'dev-secret'
}

export function authRequired(req, res, next) {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) {
    res.status(401).json({ message: '未登录' })
    return
  }

  const token = header.slice('Bearer '.length)

  try {
    const payload = jwt.verify(token, getJwtSecret())
    const userId = payload?.sub
    if (!userId) {
      res.status(401).json({ message: '无效令牌' })
      return
    }

    const user = db.prepare('SELECT id, email, name, created_at FROM users WHERE id = ?').get(userId)
    if (!user) {
      res.status(401).json({ message: '用户不存在' })
      return
    }

    req.user = user
    next()
  } catch {
    res.status(401).json({ message: '无效令牌' })
  }
}

export function getJwtSecretForSigning() {
  return getJwtSecret()
}
