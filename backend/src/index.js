/**
 * MindBalance Suite 后端服务
 * 提供用户认证、数据同步和AI解读API
 */

import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { v4 as uuidv4 } from 'uuid'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import Database from 'better-sqlite3'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3001
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

// 初始化数据库
const db = new Database(join(__dirname, '../data/mindbalance.db'))

// 创建表
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS assessments (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    scale_id TEXT NOT NULL,
    scale_title TEXT NOT NULL,
    total INTEGER NOT NULL,
    max INTEGER NOT NULL,
    label TEXT NOT NULL,
    values TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS mood_entries (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    mood INTEGER NOT NULL,
    note TEXT,
    date TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS gratitude_entries (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
`)

// 中间件
app.use(cors())
app.use(express.json())

// 认证中间件
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: '未认证' })
  }

  const token = authHeader.split(' ')[1]
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.userId = decoded.userId
    next()
  } catch (error) {
    return res.status(401).json({ message: 'Token无效' })
  }
}

// ========== 认证路由 ==========

// 注册
app.post('/api/v1/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body
    
    if (!email || !password) {
      return res.status(400).json({ message: '邮箱和密码必填' })
    }

    const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email)
    if (existingUser) {
      return res.status(400).json({ message: '该邮箱已注册' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const userId = uuidv4()

    db.prepare('INSERT INTO users (id, email, password, name) VALUES (?, ?, ?, ?)').run(
      userId, email, hashedPassword, name || null
    )

    const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' })

    res.json({
      token,
      user: { id: userId, email, name }
    })
  } catch (error) {
    console.error('注册错误:', error)
    res.status(500).json({ message: '注册失败' })
  }
})

// 登录
app.post('/api/v1/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email)
    if (!user) {
      return res.status(401).json({ message: '邮箱或密码错误' })
    }

    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) {
      return res.status(401).json({ message: '邮箱或密码错误' })
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' })

    res.json({
      token,
      user: { id: user.id, email: user.email, name: user.name }
    })
  } catch (error) {
    console.error('登录错误:', error)
    res.status(500).json({ message: '登录失败' })
  }
})

// 获取用户信息
app.get('/api/v1/auth/profile', authenticate, (req, res) => {
  const user = db.prepare('SELECT id, email, name, created_at FROM users WHERE id = ?').get(req.userId)
  if (!user) {
    return res.status(404).json({ message: '用户不存在' })
  }
  res.json(user)
})

// ========== 评估路由 ==========

// 获取评估历史
app.get('/api/v1/assessments', authenticate, (req, res) => {
  const assessments = db.prepare(
    'SELECT * FROM assessments WHERE user_id = ? ORDER BY created_at DESC'
  ).all(req.userId)

  res.json(assessments.map(a => ({
    ...a,
    values: JSON.parse(a.values)
  })))
})

// 创建评估记录
app.post('/api/v1/assessments', authenticate, (req, res) => {
  try {
    const { scaleId, scaleTitle, total, max, label, values } = req.body
    const id = uuidv4()

    db.prepare(
      'INSERT INTO assessments (id, user_id, scale_id, scale_title, total, max, label, values) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    ).run(id, req.userId, scaleId, scaleTitle, total, max, label, JSON.stringify(values))

    res.json({ id, scaleId, scaleTitle, total, max, label, values })
  } catch (error) {
    console.error('创建评估错误:', error)
    res.status(500).json({ message: '保存失败' })
  }
})

// 删除评估记录
app.delete('/api/v1/assessments/:id', authenticate, (req, res) => {
  const result = db.prepare('DELETE FROM assessments WHERE id = ? AND user_id = ?').run(
    req.params.id, req.userId
  )

  if (result.changes === 0) {
    return res.status(404).json({ message: '记录不存在' })
  }

  res.json({ message: '删除成功' })
})

// ========== 数据同步 ==========

// 上传本地数据
app.post('/api/v1/sync/upload', authenticate, (req, res) => {
  try {
    const { assessments, moodEntries, gratitudeEntries } = req.body

    // 同步评估记录
    if (assessments?.length) {
      const insertAssessment = db.prepare(
        'INSERT OR REPLACE INTO assessments (id, user_id, scale_id, scale_title, total, max, label, values, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
      )
      for (const a of assessments) {
        insertAssessment.run(a.id, req.userId, a.scaleId, a.scaleTitle, a.total, a.max, a.label, JSON.stringify(a.values), a.timestamp)
      }
    }

    // 同步心情记录
    if (moodEntries?.length) {
      const insertMood = db.prepare(
        'INSERT OR REPLACE INTO mood_entries (id, user_id, mood, note, date) VALUES (?, ?, ?, ?, ?)'
      )
      for (const m of moodEntries) {
        insertMood.run(uuidv4(), req.userId, m.mood, m.note, m.date)
      }
    }

    // 同步感恩记录
    if (gratitudeEntries?.length) {
      const insertGratitude = db.prepare(
        'INSERT OR REPLACE INTO gratitude_entries (id, user_id, content, created_at) VALUES (?, ?, ?, ?)'
      )
      for (const g of gratitudeEntries) {
        insertGratitude.run(g.id, req.userId, g.content, g.date)
      }
    }

    res.json({ message: '同步成功' })
  } catch (error) {
    console.error('同步错误:', error)
    res.status(500).json({ message: '同步失败' })
  }
})

// 下载云端数据
app.get('/api/v1/sync/download', authenticate, (req, res) => {
  const assessments = db.prepare(
    'SELECT * FROM assessments WHERE user_id = ? ORDER BY created_at DESC'
  ).all(req.userId).map(a => ({ ...a, values: JSON.parse(a.values) }))

  const moodEntries = db.prepare(
    'SELECT * FROM mood_entries WHERE user_id = ? ORDER BY date DESC'
  ).all(req.userId)

  const gratitudeEntries = db.prepare(
    'SELECT * FROM gratitude_entries WHERE user_id = ? ORDER BY created_at DESC'
  ).all(req.userId)

  res.json({ assessments, moodEntries, gratitudeEntries })
})

// ========== 健康检查 ==========
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// 启动服务器
app.listen(PORT, () => {
  console.log(`🚀 MindBalance 后端服务运行在 http://localhost:${PORT}`)
  console.log(`📝 API 文档: http://localhost:${PORT}/api/health`)
})
