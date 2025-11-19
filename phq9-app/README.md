# 心理健康自评量表中心

本应用集成多种常用、科学的心理健康自评/筛查量表，用于健康教育与自我筛查。结果仅供参考，不构成医疗"诊断"或治疗建议。如症状明显、持续恶化、影响功能或存在自/他伤风险，请尽快联系专业人员或当地紧急服务。

## 🎯 支持的量表

- **PHQ-9** 抑郁（0–27；第9题>0提示即时求助）
- **GAD-7** 焦虑（0–21）
- **PHQ-2 / GAD-2** 快筛（0–6）
- **WHO-5** 主观幸福感（原始分0–25；百分比=×4）
- **PSS-10** 感知压力量表（0–40，含反向计分）
- **PHQ-15** 躯体化症状（0–30）
- **ISI** 失眠严重度指数（0–28）
- **K10** 心理困扰（10–50）
- **DASS-21** 抑郁/焦虑/压力三维度（每维度×2换算）
- **AUDIT-C** 酒精使用筛查（0–12，题目级选项）
- **AUDIT-10** 酒精使用障碍识别（0–40，题目级选项）

## ✨ 功能特性

### 核心功能
- ✅ **多量表切换** - 支持11种专业心理健康评估量表
- ✅ **智能评估** - 动态渲染题干与计分规则
- ✅ **进度追踪** - 实时显示答题进度
- ✅ **结果分析** - 专业分级与个性化建议
- ✅ **历史记录** - 保存评估历史，追踪变化趋势

### 新增功能
- 🔐 **账户管理** - 用户注册、登录、个人资料管理
- 💾 **浏览器缓存** - 本地存储评估数据与答案
- 🌙 **深色模式** - 支持浅色/深色主题切换
- 📱 **响应式设计** - 适配移动端与桌面端
- 🖨️ **打印功能** - 支持评估结果打印
- 📊 **数据导出** - 支持历史记录JSON导出

## 🚀 技术栈

- **前端框架**: React 18 + TypeScript
- **构建工具**: Vite
- **状态管理**: Zustand
- **路由**: React Router
- **样式**: Tailwind CSS
- **图标**: Lucide React
- **通知**: Sonner

## 📦 安装与运行

### 环境要求
- Node.js >= 18.0.0
- npm 或 pnpm

### 安装依赖
```bash
# 使用 pnpm (推荐)
pnpm install

# 或使用 npm
npm install
```

### 开发环境
```bash
# 启动开发服务器
pnpm dev
# 或
npm run dev

# 应用将在 http://localhost:3000 运行
```

### 构建生产版本
```bash
# 构建项目
pnpm build
# 或
npm run build

# 预览构建结果
pnpm preview
# 或
npm run preview
```

### 代码检查
```bash
# 运行 ESLint
pnpm lint
# 或
npm run lint

# 运行 TypeScript 类型检查
pnpm typecheck
# 或
npm run typecheck
```

## 🛠️ 项目结构

```
phq9-app/
├── src/
│   ├── components/          # 可复用组件
│   │   └── Layout.tsx      # 页面布局组件
│   ├── data/               # 静态数据
│   │   └── scales.ts       # 量表定义
│   ├── pages/              # 页面组件
│   │   ├── Home.tsx        # 首页
│   │   ├── Assessment.tsx  # 评估页面
│   │   ├── History.tsx     # 历史记录
│   │   └── Account.tsx     # 账户管理
│   ├── stores/             # 状态管理
│   │   ├── authStore.ts    # 用户认证
│   │   ├── assessmentStore.ts # 评估数据
│   │   ├── answerStore.ts  # 答案数据
│   │   └── themeStore.ts   # 主题设置
│   ├── App.tsx             # 主应用组件
│   ├── main.tsx            # 应用入口
│   └── index.css           # 全局样式
├── public/                 # 静态资源
├── package.json            # 项目依赖
├── vite.config.ts          # Vite 配置
├── tailwind.config.js      # Tailwind 配置
└── tsconfig.json           # TypeScript 配置
```

## 架构与历史版本说明

- 当前应用的正式实现为基于 **React 18 + TypeScript + Vite** 的 SPA，入口位于 `src/main.tsx`，量表定义集中在 `src/data/scales.ts`。
- 早期曾有纯 HTML/CSS/JS 版本，已在重构过程中迁移到 React + TypeScript 架构，相关历史实现可以通过 Git 提交记录查阅。
- 请在 `src/` 目录下进行新功能开发与维护，新增量表也应在 `src/data/scales.ts` 中定义。

## 🔧 部署

### Vercel (推荐)
1. 将代码推送到 GitHub
2. 在 Vercel 中导入项目
3. 设置构建命令：`npm run build`
4. 设置输出目录：`dist`
5. 点击部署

### Netlify
1. 将代码推送到 GitHub
2. 在 Netlify 中连接 GitHub 仓库
3. 设置构建命令：`npm run build`
4. 设置发布目录：`dist`
5. 点击部署

### GitHub Pages
1. 在 `package.json` 中添加：
```json
{
  "homepage": "https://yourusername.github.io/phq9-app"
}
```

2. 安装 gh-pages：
```bash
npm install --save-dev gh-pages
```

3. 在 `package.json` 中添加脚本：
```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

4. 运行部署：
```bash
npm run deploy
```

## 🔒 隐私保护

- **本地处理**: 所有评估数据在浏览器本地处理
- **无服务器上传**: 不上传任何个人数据到服务器
- **本地存储**: 使用浏览器 localStorage 保存数据
- **用户控制**: 用户可随时清除本地数据

## 📋 使用说明

### 1. 选择量表
- 在首页选择需要的心理健康评估量表
- 每个量表都有详细的说明和适用场景

### 2. 进行评估
- 仔细阅读每个问题
- 选择最符合您情况的选项
- 系统会自动跳转到下一题

### 3. 查看结果
- 完成所有题目后查看评估结果
- 获得专业的分级建议
- 可选择保存结果到历史记录

### 4. 管理账户
- 注册账户以保存评估历史
- 查看和管理个人评估记录
- 导出数据进行备份

## ⚠️ 重要提醒

- 本工具用于健康教育与自我筛查
- 不能替代专业人员的临床诊断或治疗建议
- 如症状明显、持续恶化、影响功能或存在自/他伤风险，请尽快联系专业人员
- 评估结果仅供参考，如有疑问请咨询专业医疗人员

## 🤝 贡献

欢迎提交 Issue 或 Pull Request 来改进这个项目。

### 开发规范
- 使用 TypeScript 进行类型安全的开发
- 遵循 React 最佳实践
- 保持组件的单一职责原则
- 添加适当的错误处理
- 编写清晰的代码注释

## 📄 许可证

本项目基于 [MIT License](LICENSE) 开源，可自由复用与二次开发。请保留原始版权声明。

## 📚 学术整合与研究基础

- 项目所用量表的原始文献及近年数字心理健康研究的系统整理，见仓库根目录的 `ACADEMIC_INTEGRATION.md`。
- 相关论文 PDF、技术报告及中文摘要集中存放于 `references/` 目录（需团队成员按数据库授权下载）。

## 📚 参考文献

- PHQ-9：Kroenke K, Spitzer RL, Williams JBW. J Gen Intern Med. 2001;16(9):606–613.
- GAD-7：Spitzer RL, Kroenke K, Williams JBW, Löwe B. Arch Intern Med. 2006;166(10):1092–1097.
- WHO-5：Topp CW, Østergaard SD, Søndergaard S, Bech P. Psychother Psychosom. 2015;84(3):167–176.
- PSS：Cohen S, Kamarck T, Mermelstein R. J Health Soc Behav. 1983;24(4):385–396.
- DASS-21：Lovibond SH, Lovibond PF. Manual for the DASS. 1995.
- AUDIT：Babor TF, Higgins-Biddle JC, Saunders JB, Monteiro MG. AUDIT: WHO 用户指南（第二版）。

---

**免责声明**: 本工具用于健康教育与自我筛查，不提供医疗诊断或治疗建议；不构成医患关系。对于任何健康问题，请咨询合格的医疗专业人员。
