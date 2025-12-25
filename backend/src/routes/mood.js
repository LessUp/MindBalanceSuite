import express from 'express'
import { randomUUID } from 'crypto'
import { db } from '../db.js'
import { authRequired } from '../middleware/auth.js'

const router = express.Router()

router.get('/mood', authRequired, (req, res) => {
  const days = Number(req.query.days || 30)
  const now = new Date()
  const cutoff = new Date(now)
  cutoff.setDate(now.getDate() - (Number.isFinite(days) ? days : 30))
  const cutoffDate = cutoff.toISOString().slice(0, 10)

  const rows = db
    .prepare('SELECT id, mood, note, date FROM mood_entries WHERE user_id = ? AND date >= ? ORDER BY date DESC')
    .all(req.user.id, cutoffDate)

  res.json(
    rows.map((r) => ({
      id: r.id,
      mood: r.mood,
      note: r.note,
      date: r.date
    }))
  )
})

router.post('/mood', authRequired, (req, res) => {
  const { mood, note, date } = req.body || {}

  if (typeof mood !== 'number') {
    res.status(400).json({ message: 'mood 格式不正确' })
    return
  }

  const d = typeof date === 'string' && date.length > 0 ? date : new Date().toISOString().slice(0, 10)
  const id = randomUUID()

  db.prepare(
    'INSERT INTO mood_entries (id, user_id, mood, note, date) VALUES (?, ?, ?, ?, ?) ON CONFLICT(user_id, date) DO UPDATE SET mood=excluded.mood, note=excluded.note'
  ).run(id, req.user.id, mood, note || null, d)

  const row = db.prepare('SELECT id, mood, note, date FROM mood_entries WHERE user_id = ? AND date = ?').get(req.user.id, d)

  res.json({
    id: row.id,
    mood: row.mood,
    note: row.note,
    date: row.date
  })
})

export default router
