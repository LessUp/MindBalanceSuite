# 2025-12-25 架构与部署配置修正

## 变更摘要
- **部署配置**：修正 Netlify 构建根目录指向，避免部署到空的 `phq9-app/src`。
- **目录准备**：创建 `legacy/` 目录，用于后续承接历史/冗余结构的迁移（不影响当前构建）。
- **后端落地**：新增 `backend/` 最小可运行服务（Express + SQLite + JWT），端点与 `src/services/apiClient.ts` 对齐。
- **同步修复**：修复云端下载合并逻辑，保留云端 `id/timestamp/date`，避免重复、删除失效与日期错位。

## 变更明细
- **修改**：`netlify.toml`
  - `base` 从 `"phq9-app"` 调整为 `"."`（根目录）。

- **新增**：`legacy/`
  - 新建空目录，作为后续目录重构/归档的落点。

- **新增**：`backend/`（最小可运行后端）
  - `backend/package.json`
  - `backend/src/server.js`
  - `backend/src/db.js`
  - `backend/src/middleware/auth.js`
  - `backend/src/routes/auth.js`
  - `backend/src/routes/assessments.js`
  - `backend/src/routes/mood.js`
  - `backend/src/routes/gratitude.js`
  - `backend/src/routes/stats.js`
  - `backend/src/routes/sync.js`
  - `backend/src/routes/ai.js`
  - `backend/data/`（SQLite 数据目录）

- **修改**：`src/stores/assessmentStore.ts`
  - 新增 `importResults`，用于导入/合并云端评估数据并保留 `id/timestamp`。

- **修改**：`src/stores/userStore.ts`
  - 新增 `setMoodEntry`（按指定日期写入/更新心情）。
  - 新增 `importMoodEntries` / `importGratitudeEntries`，用于导入/合并云端数据。

- **修改**：`src/services/syncService.ts`
  - 下载合并改为调用 `importResults` / `importMoodEntries` / `importGratitudeEntries`，不再通过 `addResult/addMoodEntry` 生成新主键。

- **修改**：`src/components/MoodCalendar.tsx`
  - 记录心情改为写入 `selectedDate`（通过 `setMoodEntry`），修复选中日期与写入日期不一致的问题。

## 原因与影响
- **原因**：当前仓库真正可运行/可构建的前端位于根目录 `src/`（配套根目录 `package.json`、`vite.config.ts`）。同时 `phq9-app/src` 为空，导致 `netlify.toml` 指向 `phq9-app` 会使部署构建产物缺失。
- **影响**：Netlify 部署将使用根目录应用构建输出 `dist/`，与 `vercel.json` 的 `distDir: "dist"` 保持一致。
- **影响**：当 `VITE_BACKEND_ENABLED=true` 且 `VITE_API_BASE_URL` 指向后端后，可启用登录/云端同步；并且同步下载不会因本地重新生成 `id/date` 导致重复与对不上删除。

## 后续工作
- **完善 backend（生产化）**：补齐运行/部署说明、环境变量模板、CORS/安全策略、以及 AI 真正的代理调用（当前为占位返回）。
- **目录收敛**：明确 `phq9-app/` 的定位（保留为历史文档/参考或迁移到 `legacy/`），避免双入口混乱。

## 目录收敛决策（方案 A）
- **决定**：以仓库根目录为唯一前端应用入口（`/src/main.tsx`），删除不可运行且重复的 `phq9-app/` 子项目。
- **原因**：`phq9-app/` 当前缺失应用入口（`phq9-app/src/main.tsx` 不存在），无法启动；同时与根目录前端重复导致部署/本地开发端口冲突与维护成本上升。
- **影响**：
  - 以后只在仓库根目录运行前端：`npm run dev`。
  - `phq9-app/` 的历史依赖（如其 `node_modules`、`package-lock.json`）不再保留。

## 目录收敛落地（已执行）
- **删除**：`phq9-app/`
- **更新**：仓库文档与模板中对 `phq9-app/` 的引用（`README.md`、`CONTRIBUTING.md`、`.github/*`）。

## 环境变量规范化
- **新增**：`.env.example`
- **新增**：`.env`（本地开发用，不提交）
- **新增**：`backend/.env.example`
- **修改**：`.gitignore`
  - 忽略 `.env` / `.env.*`，保留 `.env.example` 以便提交模板。
