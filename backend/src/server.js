import 'dotenv/config'
import express from 'express'
import cors from 'cors'

import authRoutes from './routes/auth.js'
import assessmentsRoutes from './routes/assessments.js'
import moodRoutes from './routes/mood.js'
import gratitudeRoutes from './routes/gratitude.js'
import statsRoutes from './routes/stats.js'
import syncRoutes from './routes/sync.js'
import aiRoutes from './routes/ai.js'

const app = express()

app.use(cors({ origin: true, credentials: true }))
app.use(express.json({ limit: '1mb' }))

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: process.env.APP_VERSION || '0.1.0',
    services: {
      database: 'sqlite',
      ai: {
        openai: Boolean(process.env.OPENAI_API_KEY),
        deepseek: Boolean(process.env.DEEPSEEK_API_KEY),
        qwen: Boolean(process.env.QWEN_API_KEY)
      }
    }
  })
})

app.use('/api/v1', authRoutes)
app.use('/api/v1', assessmentsRoutes)
app.use('/api/v1', moodRoutes)
app.use('/api/v1', gratitudeRoutes)
app.use('/api/v1', statsRoutes)
app.use('/api/v1', syncRoutes)
app.use('/api/v1', aiRoutes)

app.use((req, res) => {
  res.status(404).json({ message: '未找到接口' })
})

app.use((err, _req, res, _next) => {
  const message = err instanceof Error ? err.message : '服务器错误'
  res.status(500).json({ message })
})

const port = Number(process.env.PORT || 3001)
app.listen(port, () => {
  console.log(`MindBalance backend listening on ${port}`)
})
