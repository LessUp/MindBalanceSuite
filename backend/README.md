# MindBalance Suite 后端服务

可选的后端服务，提供用户认证、数据同步、AI 解读代理和云端存储功能。

## 功能特性

- **用户认证** - JWT 认证，支持注册/登录/修改密码
- **数据同步** - 本地数据云端同步
- **评估历史** - 云端保存评估记录
- **心情追踪** - 云端保存心情记录
- **感恩日记** - 云端保存感恩记录
- **统计分析** - 用户数据统计与趋势分析
- **AI 解读代理** - 安全的 AI API 代理，避免前端暴露密钥

## 快速开始

### 环境要求
- Node.js >= 18.0.0
- npm 或 pnpm

### 安装依赖
```bash
npm install
# 或
pnpm install
```

### 环境配置
复制 `.env.example` 为 `.env` 并配置：
```bash
cp .env.example .env
```

编辑 `.env` 文件：
```env
PORT=3001
JWT_SECRET=your-super-secret-key-change-in-production

# AI API 密钥（可选，用于 AI 解读功能）
OPENAI_API_KEY=sk-xxx
DEEPSEEK_API_KEY=sk-xxx
QWEN_API_KEY=sk-xxx
```

### 启动服务
```bash
# 开发模式（自动重启）
npm run dev

# 生产模式
npm start
```

服务将运行在 `http://localhost:3001`

## API 接口文档

### 认证 API

#### 注册
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "用户名"
}
```

#### 登录
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### 获取用户信息
```http
GET /api/v1/auth/profile
Authorization: Bearer <token>
```

#### 更新用户信息
```http
PUT /api/v1/auth/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "新名字",
  "email": "new@example.com"
}
```

#### 修改密码
```http
PUT /api/v1/auth/password
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword"
}
```

### 评估 API

#### 获取评估历史
```http
GET /api/v1/assessments
Authorization: Bearer <token>
```

#### 创建评估记录
```http
POST /api/v1/assessments
Authorization: Bearer <token>
Content-Type: application/json

{
  "scaleId": "phq9",
  "scaleTitle": "PHQ-9 抑郁症筛查量表",
  "total": 10,
  "max": 27,
  "label": "轻度抑郁",
  "values": [1, 2, 1, 0, 2, 1, 1, 1, 1]
}
```

#### 删除评估记录
```http
DELETE /api/v1/assessments/:id
Authorization: Bearer <token>
```

### 心情 API

#### 获取心情记录
```http
GET /api/v1/mood?days=30
Authorization: Bearer <token>
```

#### 添加心情记录
```http
POST /api/v1/mood
Authorization: Bearer <token>
Content-Type: application/json

{
  "mood": 4,
  "note": "今天心情不错",
  "date": "2025-01-01"
}
```

### 感恩 API

#### 获取感恩记录
```http
GET /api/v1/gratitude?limit=50
Authorization: Bearer <token>
```

#### 添加感恩记录
```http
POST /api/v1/gratitude
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "感谢今天的好天气"
}
```

#### 删除感恩记录
```http
DELETE /api/v1/gratitude/:id
Authorization: Bearer <token>
```

### 统计 API

#### 获取用户统计
```http
GET /api/v1/stats
Authorization: Bearer <token>
```

返回：
```json
{
  "totalAssessments": 10,
  "scaleStats": [...],
  "moodTrend": [...],
  "gratitudeCount": 5,
  "streakDays": 3
}
```

### 同步 API

#### 上传本地数据
```http
POST /api/v1/sync/upload
Authorization: Bearer <token>
Content-Type: application/json

{
  "assessments": [...],
  "moodEntries": [...],
  "gratitudeEntries": [...]
}
```

#### 下载云端数据
```http
GET /api/v1/sync/download
Authorization: Bearer <token>
```

### AI 解读 API

#### 获取 AI 解读
```http
POST /api/v1/ai/interpret
Authorization: Bearer <token>
Content-Type: application/json

{
  "provider": "openai",
  "model": "gpt-4o-mini",
  "result": {
    "total": 10,
    "max": 27,
    "label": "轻度抑郁"
  },
  "scale": {
    "title": "PHQ-9 抑郁症筛查量表",
    "timeframe": "过去两周"
  }
}
```

### 健康检查
```http
GET /api/health
```

返回：
```json
{
  "status": "ok",
  "timestamp": "2025-01-01T00:00:00.000Z",
  "version": "1.0.0",
  "services": {
    "database": "connected",
    "ai": {
      "openai": true,
      "deepseek": false,
      "qwen": false
    }
  }
}
```

## 数据存储

使用 SQLite 数据库，文件存储在 `data/mindbalance.db`。

## 前端配置

要启用后端服务，修改前端 `src/config/api.ts`：

```typescript
export const backendConfig: BackendConfig = {
  enabled: true,  // 改为 true
  baseUrl: 'http://localhost:3001',
  apiVersion: 'v1',
  timeout: 30000
}
```

## 安全注意事项

1. 生产环境务必修改 `JWT_SECRET`
2. 考虑添加 HTTPS
3. 考虑添加请求限流
4. 定期备份数据库文件

## 部署

### Docker（推荐）
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

### 传统部署
```bash
npm ci --only=production
npm start
```

## 许可证

MIT License
