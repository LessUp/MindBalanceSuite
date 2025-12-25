import express from 'express'
import { authRequired } from '../middleware/auth.js'

const router = express.Router()

router.post('/ai/interpret', authRequired, (req, res) => {
  const { result, scale } = req.body || {}

  const total = result?.total
  const max = result?.max
  const label = result?.label
  const title = scale?.title

  const summary = `量表：${title || '未命名'}；结果等级：${label || '未知'}；得分：${typeof total === 'number' ? total : '?'} / ${typeof max === 'number' ? max : '?'}`

  res.json({
    summary,
    insights: ['该内容为自动生成信息，不构成医学诊断或治疗建议。'],
    suggestions: ['如你感到持续困扰，建议咨询专业人士并寻求支持。'],
    warning: null,
    timestamp: Date.now()
  })
})

export default router
