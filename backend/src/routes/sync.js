import express from 'express'
import { db } from '../db.js'
import { authRequired } from '../middleware/auth.js'

const router = express.Router()

function safeJsonStringify(value) {
  return JSON.stringify(value ?? [])
}

router.post('/sync/upload', authRequired, (req, res) => {
  const { assessments, moodEntries, gratitudeEntries } = req.body || {}

  const upsertAssessment = db.prepare(
    `INSERT INTO assessments (id, user_id, scale_id, scale_title, total, max, label, values_json, created_at)
     VALUES (@id, @user_id, @scale_id, @scale_title, @total, @max, @label, @values_json, @created_at)
     ON CONFLICT(id) DO UPDATE SET
       scale_id=excluded.scale_id,
       scale_title=excluded.scale_title,
       total=excluded.total,
       max=excluded.max,
       label=excluded.label,
       values_json=excluded.values_json,
       created_at=excluded.created_at,
       user_id=excluded.user_id`
  )

  const upsertMood = db.prepare(
    `INSERT INTO mood_entries (id, user_id, mood, note, date)
     VALUES (@id, @user_id, @mood, @note, @date)
     ON CONFLICT(user_id, date) DO UPDATE SET
       mood=excluded.mood,
       note=excluded.note`
  )

  const upsertGratitude = db.prepare(
    `INSERT INTO gratitude_entries (id, user_id, content, mood, created_at)
     VALUES (@id, @user_id, @content, @mood, @created_at)
     ON CONFLICT(id) DO UPDATE SET
       content=excluded.content,
       mood=excluded.mood,
       created_at=excluded.created_at,
       user_id=excluded.user_id`
  )

  const tx = db.transaction(() => {
    if (Array.isArray(assessments)) {
      for (const a of assessments) {
        const id = String(a.id)
        const createdAt = a.timestamp ? new Date(Number(a.timestamp)).toISOString() : new Date().toISOString()
        const scaleId = a.scaleId ?? a.scale_id
        const scaleTitle = a.scaleTitle ?? a.scale_title
        upsertAssessment.run({
          id,
          user_id: req.user.id,
          scale_id: scaleId,
          scale_title: scaleTitle,
          total: a.total,
          max: a.max,
          label: a.label,
          values_json: safeJsonStringify(a.values),
          created_at: createdAt
        })
      }
    }

    if (Array.isArray(moodEntries)) {
      for (const m of moodEntries) {
        const date = typeof m.date === 'string' ? m.date.slice(0, 10) : new Date().toISOString().slice(0, 10)
        upsertMood.run({
          id: m.id ? String(m.id) : `${req.user.id}:${date}`,
          user_id: req.user.id,
          mood: m.mood,
          note: m.note || null,
          date
        })
      }
    }

    if (Array.isArray(gratitudeEntries)) {
      for (const g of gratitudeEntries) {
        const createdAt = typeof g.date === 'string' ? g.date : new Date().toISOString()
        upsertGratitude.run({
          id: String(g.id),
          user_id: req.user.id,
          content: g.content,
          mood: g.mood ?? null,
          created_at: createdAt
        })
      }
    }
  })

  tx()

  res.json({ message: '已上传' })
})

router.get('/sync/download', authRequired, (req, res) => {
  const assessments = db
    .prepare(
      'SELECT id, scale_id, scale_title, total, max, label, values_json, created_at FROM assessments WHERE user_id = ? ORDER BY datetime(created_at) DESC'
    )
    .all(req.user.id)
    .map((r) => ({
      id: r.id,
      scale_id: r.scale_id,
      scale_title: r.scale_title,
      total: r.total,
      max: r.max,
      label: r.label,
      values: JSON.parse(r.values_json),
      created_at: r.created_at
    }))

  const moodEntries = db
    .prepare('SELECT id, mood, note, date FROM mood_entries WHERE user_id = ? ORDER BY date DESC')
    .all(req.user.id)
    .map((r) => ({ id: r.id, mood: r.mood, note: r.note, date: r.date }))

  const gratitudeEntries = db
    .prepare('SELECT id, content, created_at FROM gratitude_entries WHERE user_id = ? ORDER BY datetime(created_at) DESC')
    .all(req.user.id)
    .map((r) => ({ id: r.id, content: r.content, created_at: r.created_at }))

  res.json({ assessments, moodEntries, gratitudeEntries })
})

export default router
