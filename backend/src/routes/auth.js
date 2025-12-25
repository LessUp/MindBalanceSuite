import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { randomUUID } from 'crypto'
import { db } from '../db.js'
import { authRequired, getJwtSecretForSigning } from '../middleware/auth.js'

const router = express.Router()

function signToken(userId) {
  return jwt.sign({ sub: userId }, getJwtSecretForSigning(), { expiresIn: '30d' })
}

router.post('/auth/register', (req, res) => {
  const { email, password, name } = req.body || {}

  if (!email || typeof email !== 'string') {
    res.status(400).json({ message: '邮箱不能为空' })
    return
  }
  if (!password || typeof password !== 'string' || password.length < 6) {
    res.status(400).json({ message: '密码至少 6 位' })
    return
  }

  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email)
  if (existing) {
    res.status(409).json({ message: '邮箱已注册' })
    return
  }

  const id = randomUUID()
  const createdAt = new Date().toISOString()
  const passwordHash = bcrypt.hashSync(password, 10)

  db.prepare(
    'INSERT INTO users (id, email, name, password_hash, created_at) VALUES (?, ?, ?, ?, ?)'
  ).run(id, email, name || null, passwordHash, createdAt)

  const token = signToken(id)
  res.json({
    token,
    user: { id, email, name: name || null }
  })
})

router.post('/auth/login', (req, res) => {
  const { email, password } = req.body || {}

  if (!email || typeof email !== 'string' || !password || typeof password !== 'string') {
    res.status(400).json({ message: '邮箱或密码错误' })
    return
  }

  const user = db.prepare('SELECT id, email, name, password_hash FROM users WHERE email = ?').get(email)
  if (!user) {
    res.status(401).json({ message: '邮箱或密码错误' })
    return
  }

  const ok = bcrypt.compareSync(password, user.password_hash)
  if (!ok) {
    res.status(401).json({ message: '邮箱或密码错误' })
    return
  }

  const token = signToken(user.id)
  res.json({
    token,
    user: { id: user.id, email: user.email, name: user.name || null }
  })
})

router.get('/auth/profile', authRequired, (req, res) => {
  res.json({
    id: req.user.id,
    email: req.user.email,
    name: req.user.name || null,
    created_at: req.user.created_at
  })
})

router.put('/auth/profile', authRequired, (req, res) => {
  const { name, email } = req.body || {}

  if (email !== undefined && (typeof email !== 'string' || email.length === 0)) {
    res.status(400).json({ message: '邮箱格式不正确' })
    return
  }
  if (name !== undefined && typeof name !== 'string') {
    res.status(400).json({ message: '昵称格式不正确' })
    return
  }

  if (email && email !== req.user.email) {
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email)
    if (existing) {
      res.status(409).json({ message: '邮箱已被占用' })
      return
    }
  }

  const newEmail = email !== undefined ? email : req.user.email
  const newName = name !== undefined ? (name || null) : req.user.name

  db.prepare('UPDATE users SET email = ?, name = ? WHERE id = ?').run(newEmail, newName, req.user.id)

  res.json({
    id: req.user.id,
    email: newEmail,
    name: newName
  })
})

router.put('/auth/password', authRequired, (req, res) => {
  const { currentPassword, newPassword } = req.body || {}

  if (!currentPassword || typeof currentPassword !== 'string') {
    res.status(400).json({ message: '当前密码不能为空' })
    return
  }
  if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 6) {
    res.status(400).json({ message: '新密码至少 6 位' })
    return
  }

  const row = db.prepare('SELECT password_hash FROM users WHERE id = ?').get(req.user.id)
  const ok = row && bcrypt.compareSync(currentPassword, row.password_hash)
  if (!ok) {
    res.status(401).json({ message: '当前密码错误' })
    return
  }

  const passwordHash = bcrypt.hashSync(newPassword, 10)
  db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(passwordHash, req.user.id)

  res.json({ message: '密码已更新' })
})

router.post('/auth/logout', (_req, res) => {
  res.json({ message: '已退出' })
})

export default router
