import express from 'express'
import { randomUUID } from 'crypto'
import { db } from '../db.js'
import { authRequired } from '../middleware/auth.js'

const router = express.Router()

router.get('/assessments', authRequired, (req, res) => {
  const rows = db
    .prepare(
      'SELECT id, scale_id, scale_title, total, max, label, values_json, created_at FROM assessments WHERE user_id = ? ORDER BY datetime(created_at) DESC'
    )
    .all(req.user.id)

  res.json(
    rows.map((r) => ({
      id: r.id,
      scale_id: r.scale_id,
      scale_title: r.scale_title,
      total: r.total,
      max: r.max,
      label: r.label,
      values: JSON.parse(r.values_json),
      created_at: r.created_at
    }))
  )
})

router.post('/assessments', authRequired, (req, res) => {
  const { scaleId, scaleTitle, total, max, label, values } = req.body || {}

  if (!scaleId || typeof scaleId !== 'string') {
    res.status(400).json({ message: 'scaleId 不能为空' })
    return
  }
  if (!scaleTitle || typeof scaleTitle !== 'string') {
    res.status(400).json({ message: 'scaleTitle 不能为空' })
    return
  }
  if (typeof total !== 'number' || typeof max !== 'number') {
    res.status(400).json({ message: 'total/max 格式不正确' })
    return
  }
  if (!label || typeof label !== 'string') {
    res.status(400).json({ message: 'label 不能为空' })
    return
  }
  if (!Array.isArray(values)) {
    res.status(400).json({ message: 'values 格式不正确' })
    return
  }

  const id = randomUUID()
  const createdAt = new Date().toISOString()

  db.prepare(
    'INSERT INTO assessments (id, user_id, scale_id, scale_title, total, max, label, values_json, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
  ).run(id, req.user.id, scaleId, scaleTitle, total, max, label, JSON.stringify(values), createdAt)

  res.json({
    id,
    scale_id: scaleId,
    scale_title: scaleTitle,
    total,
    max,
    label,
    values,
    created_at: createdAt
  })
})

router.delete('/assessments/:id', authRequired, (req, res) => {
  const { id } = req.params
  const info = db.prepare('DELETE FROM assessments WHERE id = ? AND user_id = ?').run(id, req.user.id)
  if (info.changes === 0) {
    res.status(404).json({ message: '记录不存在' })
    return
  }
  res.json({ message: '已删除' })
})

export default router
