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
    max_score INTEGER NOT NULL,
    label TEXT NOT NULL,
    answer_values TEXT NOT NULL,
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
    max: a.max_score,
    values: JSON.parse(a.answer_values)
  })))
})

// 创建评估记录
app.post('/api/v1/assessments', authenticate, (req, res) => {
  try {
    const { scaleId, scaleTitle, total, max, label, values } = req.body
    const id = uuidv4()

    db.prepare(
      'INSERT INTO assessments (id, user_id, scale_id, scale_title, total, max_score, label, answer_values) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
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
        'INSERT OR REPLACE INTO assessments (id, user_id, scale_id, scale_title, total, max_score, label, answer_values, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
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
  ).all(req.userId).map(a => ({ ...a, max: a.max_score, values: JSON.parse(a.answer_values) }))

  const moodEntries = db.prepare(
    'SELECT * FROM mood_entries WHERE user_id = ? ORDER BY date DESC'
  ).all(req.userId)

  const gratitudeEntries = db.prepare(
    'SELECT * FROM gratitude_entries WHERE user_id = ? ORDER BY created_at DESC'
  ).all(req.userId)

  res.json({ assessments, moodEntries, gratitudeEntries })
})

// ========== 心情记录路由 ==========

// 获取心情记录
app.get('/api/v1/mood', authenticate, (req, res) => {
  const { days = 30 } = req.query
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - parseInt(days))
  
  const entries = db.prepare(
    'SELECT * FROM mood_entries WHERE user_id = ? AND date >= ? ORDER BY date DESC'
  ).all(req.userId, cutoffDate.toISOString().split('T')[0])
  
  res.json(entries)
})

// 添加心情记录
app.post('/api/v1/mood', authenticate, (req, res) => {
  try {
    const { mood, note, date } = req.body
    const id = uuidv4()
    const entryDate = date || new Date().toISOString().split('T')[0]
    
    // 检查今天是否已有记录
    const existing = db.prepare(
      'SELECT id FROM mood_entries WHERE user_id = ? AND date = ?'
    ).get(req.userId, entryDate)
    
    if (existing) {
      db.prepare(
        'UPDATE mood_entries SET mood = ?, note = ? WHERE id = ?'
      ).run(mood, note || null, existing.id)
      res.json({ id: existing.id, mood, note, date: entryDate, updated: true })
    } else {
      db.prepare(
        'INSERT INTO mood_entries (id, user_id, mood, note, date) VALUES (?, ?, ?, ?, ?)'
      ).run(id, req.userId, mood, note || null, entryDate)
      res.json({ id, mood, note, date: entryDate })
    }
  } catch (error) {
    console.error('心情记录错误:', error)
    res.status(500).json({ message: '保存失败' })
  }
})

// ========== 感恩日记路由 ==========

// 获取感恩记录
app.get('/api/v1/gratitude', authenticate, (req, res) => {
  const { limit = 50 } = req.query
  const entries = db.prepare(
    'SELECT * FROM gratitude_entries WHERE user_id = ? ORDER BY created_at DESC LIMIT ?'
  ).all(req.userId, parseInt(limit))
  
  res.json(entries)
})

// 添加感恩记录
app.post('/api/v1/gratitude', authenticate, (req, res) => {
  try {
    const { content } = req.body
    if (!content?.trim()) {
      return res.status(400).json({ message: '内容不能为空' })
    }
    
    const id = uuidv4()
    const createdAt = new Date().toISOString()
    
    db.prepare(
      'INSERT INTO gratitude_entries (id, user_id, content, created_at) VALUES (?, ?, ?, ?)'
    ).run(id, req.userId, content.trim(), createdAt)
    
    res.json({ id, content: content.trim(), created_at: createdAt })
  } catch (error) {
    console.error('感恩记录错误:', error)
    res.status(500).json({ message: '保存失败' })
  }
})

// 删除感恩记录
app.delete('/api/v1/gratitude/:id', authenticate, (req, res) => {
  const result = db.prepare(
    'DELETE FROM gratitude_entries WHERE id = ? AND user_id = ?'
  ).run(req.params.id, req.userId)
  
  if (result.changes === 0) {
    return res.status(404).json({ message: '记录不存在' })
  }
  res.json({ message: '删除成功' })
})

// ========== 用户设置路由 ==========

// 更新用户信息
app.put('/api/v1/auth/profile', authenticate, async (req, res) => {
  try {
    const { name, email } = req.body
    
    if (email) {
      const existing = db.prepare(
        'SELECT id FROM users WHERE email = ? AND id != ?'
      ).get(email, req.userId)
      if (existing) {
        return res.status(400).json({ message: '该邮箱已被使用' })
      }
    }
    
    const updates = []
    const values = []
    if (name !== undefined) { updates.push('name = ?'); values.push(name) }
    if (email) { updates.push('email = ?'); values.push(email) }
    
    if (updates.length > 0) {
      values.push(req.userId)
      db.prepare(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`).run(...values)
    }
    
    const user = db.prepare(
      'SELECT id, email, name, created_at FROM users WHERE id = ?'
    ).get(req.userId)
    
    res.json(user)
  } catch (error) {
    console.error('更新用户错误:', error)
    res.status(500).json({ message: '更新失败' })
  }
})

// 修改密码
app.put('/api/v1/auth/password', authenticate, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: '请提供当前密码和新密码' })
    }
    
    if (newPassword.length < 6) {
      return res.status(400).json({ message: '新密码至少6个字符' })
    }
    
    const user = db.prepare('SELECT password FROM users WHERE id = ?').get(req.userId)
    const validPassword = await bcrypt.compare(currentPassword, user.password)
    
    if (!validPassword) {
      return res.status(401).json({ message: '当前密码错误' })
    }
    
    const hashedPassword = await bcrypt.hash(newPassword, 10)
    db.prepare('UPDATE users SET password = ? WHERE id = ?').run(hashedPassword, req.userId)
    
    res.json({ message: '密码修改成功' })
  } catch (error) {
    console.error('修改密码错误:', error)
    res.status(500).json({ message: '修改失败' })
  }
})

// ========== 统计路由 ==========

// 获取用户统计数据
app.get('/api/v1/stats', authenticate, (req, res) => {
  try {
    // 总评估次数
    const totalAssessments = db.prepare(
      'SELECT COUNT(*) as count FROM assessments WHERE user_id = ?'
    ).get(req.userId).count
    
    // 各量表统计
    const scaleStats = db.prepare(`
      SELECT scale_id, scale_title, COUNT(*) as count, 
             AVG(total * 100.0 / max_score) as avg_percentage,
             MAX(created_at) as last_assessment
      FROM assessments 
      WHERE user_id = ? 
      GROUP BY scale_id
    `).all(req.userId)
    
    // 最近30天心情趋势
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const moodTrend = db.prepare(
      'SELECT date, mood FROM mood_entries WHERE user_id = ? AND date >= ? ORDER BY date'
    ).all(req.userId, thirtyDaysAgo.toISOString().split('T')[0])
    
    // 感恩记录数
    const gratitudeCount = db.prepare(
      'SELECT COUNT(*) as count FROM gratitude_entries WHERE user_id = ?'
    ).get(req.userId).count
    
    // 连续评估天数
    const recentDates = db.prepare(`
      SELECT DISTINCT DATE(created_at) as date 
      FROM assessments 
      WHERE user_id = ? 
      ORDER BY date DESC 
      LIMIT 365
    `).all(req.userId)
    
    let streakDays = 0
    const today = new Date().toISOString().split('T')[0]
    let checkDate = new Date(today)
    
    for (const row of recentDates) {
      const dateStr = row.date
      if (dateStr === checkDate.toISOString().split('T')[0]) {
        streakDays++
        checkDate.setDate(checkDate.getDate() - 1)
      } else {
        break
      }
    }
    
    res.json({
      totalAssessments,
      scaleStats,
      moodTrend,
      gratitudeCount,
      streakDays
    })
  } catch (error) {
    console.error('统计错误:', error)
    res.status(500).json({ message: '获取统计失败' })
  }
})

// ========== AI 代理路由 ==========

// AI 解读代理（避免前端暴露API密钥）
app.post('/api/v1/ai/interpret', authenticate, async (req, res) => {
  try {
    const { provider, model, result, scale } = req.body
    
    // 从环境变量获取API密钥
    const apiKeys = {
      openai: process.env.OPENAI_API_KEY,
      deepseek: process.env.DEEPSEEK_API_KEY,
      qwen: process.env.QWEN_API_KEY
    }
    
    const apiKey = apiKeys[provider]
    if (!apiKey) {
      return res.status(400).json({ message: `未配置 ${provider} API密钥` })
    }
    
    const prompt = buildInterpretPrompt(result, scale)
    let interpretation
    
    switch (provider) {
      case 'openai':
        interpretation = await callOpenAI(apiKey, model || 'gpt-4o-mini', prompt)
        break
      case 'deepseek':
        interpretation = await callDeepSeek(apiKey, model || 'deepseek-chat', prompt)
        break
      case 'qwen':
        interpretation = await callQwen(apiKey, model || 'qwen-turbo', prompt)
        break
      default:
        return res.status(400).json({ message: '不支持的AI提供商' })
    }
    
    res.json(interpretation)
  } catch (error) {
    console.error('AI解读错误:', error)
    res.status(500).json({ message: 'AI解读失败', error: error.message })
  }
})

function buildInterpretPrompt(result, scale) {
  return `作为心理健康专家，请基于以下心理评估结果提供专业但温和的解读。

评估量表：${scale.title}
评估时间框架：${scale.timeframe}
总分：${result.total}/${result.max}
结果分级：${result.label}

请提供：
1. 一段简洁的总结（2-3句话）
2. 3-4条关键洞察
3. 4-5条具体的改善建议
4. 如果需要，提供安全警告

注意：
- 语气温和、支持性，避免过度医学化
- 强调这只是筛查工具，不是诊断
- 鼓励寻求专业帮助而不是制造恐慌
- 使用简体中文回复

请以JSON格式返回：
{
  "summary": "总结",
  "insights": ["洞察1", "洞察2"],
  "suggestions": ["建议1", "建议2"],
  "warning": "警告（可选，如无则为null）"
}`
}

async function callOpenAI(apiKey, model, prompt) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7
    })
  })
  
  const data = await response.json()
  if (data.error) throw new Error(data.error.message)
  return parseAIResponse(data.choices[0].message.content)
}

async function callDeepSeek(apiKey, model, prompt) {
  const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7
    })
  })
  
  const data = await response.json()
  if (data.error) throw new Error(data.error.message)
  return parseAIResponse(data.choices[0].message.content)
}

async function callQwen(apiKey, model, prompt) {
  const response = await fetch('https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      input: { messages: [{ role: 'user', content: prompt }] }
    })
  })
  
  const data = await response.json()
  if (data.code) throw new Error(data.message)
  return parseAIResponse(data.output.text)
}

function parseAIResponse(text) {
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0])
      return {
        summary: parsed.summary || '',
        insights: parsed.insights || [],
        suggestions: parsed.suggestions || [],
        warning: parsed.warning || null,
        timestamp: Date.now()
      }
    }
  } catch (e) {
    console.error('解析AI响应失败:', e)
  }
  return { summary: text, insights: [], suggestions: [], timestamp: Date.now() }
}

// ========== 健康检查 ==========
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    services: {
      database: 'connected',
      ai: {
        openai: !!process.env.OPENAI_API_KEY,
        deepseek: !!process.env.DEEPSEEK_API_KEY,
        qwen: !!process.env.QWEN_API_KEY
      }
    }
  })
})

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error('服务器错误:', err)
  res.status(500).json({ message: '服务器内部错误' })
})

// 启动服务器
app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════════════╗
║     🧠 MindBalance Suite 后端服务                    ║
╠══════════════════════════════════════════════════════╣
║  服务地址: http://localhost:${PORT}                     ║
║  健康检查: http://localhost:${PORT}/api/health          ║
║  API版本: v1                                         ║
╚══════════════════════════════════════════════════════╝
  `)
})
