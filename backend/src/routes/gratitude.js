import express from 'express'
import { randomUUID } from 'crypto'
import { db } from '../db.js'
import { authRequired } from '../middleware/auth.js'

const router = express.Router()

router.get('/gratitude', authRequired, (req, res) => {
  const limit = Number(req.query.limit || 50)
  const lim = Number.isFinite(limit) ? Math.max(1, Math.min(500, limit)) : 50

  const rows = db
    .prepare('SELECT id, content, created_at FROM gratitude_entries WHERE user_id = ? ORDER BY datetime(created_at) DESC LIMIT ?')
    .all(req.user.id, lim)

  res.json(
    rows.map((r) => ({
      id: r.id,
      content: r.content,
      created_at: r.created_at
    }))
  )
})

router.post('/gratitude', authRequired, (req, res) => {
  const { content } = req.body || {}
  if (!content || typeof content !== 'string') {
    res.status(400).json({ message: 'content 不能为空' })
    return
  }

  const id = randomUUID()
  const createdAt = new Date().toISOString()

  db.prepare(
    'INSERT INTO gratitude_entries (id, user_id, content, created_at) VALUES (?, ?, ?, ?)'
  ).run(id, req.user.id, content, createdAt)

  res.json({ id, content, created_at: createdAt })
})

router.delete('/gratitude/:id', authRequired, (req, res) => {
  const { id } = req.params
  const info = db.prepare('DELETE FROM gratitude_entries WHERE id = ? AND user_id = ?').run(id, req.user.id)
  if (info.changes === 0) {
    res.status(404).json({ message: '记录不存在' })
    return
  }
  res.json({ message: '已删除' })
})

export default router
