import express from 'express'
import { db } from '../db.js'
import { authRequired } from '../middleware/auth.js'

const router = express.Router()

function toDateOnly(iso) {
  return iso.slice(0, 10)
}

function computeStreak(dateStrings) {
  const set = new Set(dateStrings)
  let streak = 0
  const d = new Date()

  for (;;) {
    const key = d.toISOString().slice(0, 10)
    if (!set.has(key)) break
    streak += 1
    d.setDate(d.getDate() - 1)
  }

  return streak
}

router.get('/stats', authRequired, (req, res) => {
  const totalAssessments = db
    .prepare('SELECT COUNT(1) as cnt FROM assessments WHERE user_id = ?')
    .get(req.user.id).cnt

  const scaleRows = db
    .prepare(
      `SELECT scale_id, scale_title,
              COUNT(1) as count,
              AVG(CAST(total AS REAL) / CAST(max AS REAL)) as avg_ratio,
              MAX(created_at) as last_assessment
       FROM assessments
       WHERE user_id = ?
       GROUP BY scale_id, scale_title
       ORDER BY count DESC`
    )
    .all(req.user.id)

  const scaleStats = scaleRows.map((r) => ({
    scale_id: r.scale_id,
    scale_title: r.scale_title,
    count: r.count,
    avg_percentage: Math.round((r.avg_ratio || 0) * 10000) / 100,
    last_assessment: r.last_assessment
  }))

  const moodRows = db
    .prepare('SELECT date, mood FROM mood_entries WHERE user_id = ? ORDER BY date DESC LIMIT 30')
    .all(req.user.id)

  const moodTrend = moodRows.reverse().map((r) => ({ date: r.date, mood: r.mood }))

  const gratitudeCount = db
    .prepare('SELECT COUNT(1) as cnt FROM gratitude_entries WHERE user_id = ?')
    .get(req.user.id).cnt

  const assessmentDates = db
    .prepare('SELECT created_at FROM assessments WHERE user_id = ? ORDER BY datetime(created_at) DESC LIMIT 365')
    .all(req.user.id)
    .map((r) => toDateOnly(r.created_at))

  const streakDays = computeStreak(assessmentDates)

  res.json({
    totalAssessments,
    scaleStats,
    moodTrend,
    gratitudeCount,
    streakDays
  })
})

export default router
