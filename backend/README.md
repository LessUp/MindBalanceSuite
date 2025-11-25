# MindBalance Suite 后端服务

可选的后端服务，提供用户认证、数据同步和云端存储功能。

## 功能特性

- **用户认证** - JWT 认证，支持注册/登录
- **数据同步** - 本地数据云端同步
- **评估历史** - 云端保存评估记录
- **心情追踪** - 云端保存心情和感恩记录

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
创建 `.env` 文件：
```env
PORT=3001
JWT_SECRET=your-super-secret-key-change-in-production
```

### 启动服务
```bash
# 开发模式（自动重启）
npm run dev

# 生产模式
npm start
```

服务将运行在 `http://localhost:3001`

## API 接口

### 认证
- `POST /api/v1/auth/register` - 注册
- `POST /api/v1/auth/login` - 登录
- `GET /api/v1/auth/profile` - 获取用户信息

### 评估
- `GET /api/v1/assessments` - 获取评估历史
- `POST /api/v1/assessments` - 创建评估记录
- `DELETE /api/v1/assessments/:id` - 删除评估记录

### 同步
- `POST /api/v1/sync/upload` - 上传本地数据
- `GET /api/v1/sync/download` - 下载云端数据

### 健康检查
- `GET /api/health` - 服务健康状态

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
