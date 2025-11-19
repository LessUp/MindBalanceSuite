# MindBalance Suite · 心理健康自评量表工具集

> 简体中文为主，附英文简介 / Chinese first, English summary below.

## 项目简介

MindBalance Suite 是一个开源的心理健康自评与科普工具集合，目前包含基于 React + TypeScript 的 Web 应用 `phq9-app`，集成多种常用心理健康量表（如 PHQ-9、GAD-7、WHO-5、PSS-10、DASS-21 等），用于健康教育与自我筛查。

- 本项目不保存或上传任何个人隐私数据，仅在本地浏览器中处理。
- 评估结果仅供参考，不构成医疗诊断或治疗建议。

具体量表说明、功能详情请参考子项目目录下的 [`phq9-app/README.md`](./phq9-app/README.md)。

## 版本与架构说明

- 当前推荐和实际使用的实现是 `phq9-app/src` 下的 **React 18 + TypeScript + Vite** 架构（入口为 `src/main.tsx`）。
- 仓库早期存在纯 HTML/CSS/JS 实现，现已通过重构迁移为 React + TypeScript 架构，相关代码可在 Git 历史中查阅（不再参与当前构建与部署）。
- 新增量表或功能时，请基于 React + TypeScript 版本进行开发。

## 仓库结构

```text
MindBalanceSuite/
├── phq9-app/            # 前端 Web 应用：心理健康自评量表中心
├── LICENSE              # MIT 开源协议
├── CONTRIBUTING.md      # 贡献指南
├── CODE_OF_CONDUCT.md   # 行为准则
├── netlify.toml         # Netlify 部署配置
└── README.md            # 本说明文档
```

## 快速开始

### 环境要求

- Node.js ≥ 18
- pnpm 或 npm

### 本地运行 `phq9-app`

```bash
# 进入子项目目录
cd phq9-app

# 安装依赖（推荐使用 pnpm）
pnpm install    # 或 npm install

# 启动开发服务器
pnpm dev        # 或 npm run dev
# 默认运行在 http://localhost:3000
```

### 构建与检查

```bash
# 生产构建
pnpm build      # 或 npm run build

# 预览构建结果
pnpm preview    # 或 npm run preview

# 代码检查 & 类型检查
pnpm lint       # 或 npm run lint
pnpm typecheck  # 或 npm run typecheck
```

更多技术细节与项目结构说明，请查看 [`phq9-app/README.md`](./phq9-app/README.md) 中的相关章节。

## 部署

本仓库自带 `netlify.toml`，适用于将构建产物作为静态站点进行托管。你可以选择：

- Netlify / Vercel 等静态托管服务
- GitHub Pages 或其他支持静态网站的服务

具体子项目部署步骤（包括 Vercel / Netlify / GitHub Pages 示例）请查看 [`phq9-app/README.md`](./phq9-app/README.md) 中的「部署」章节。

## 隐私与合规声明

- 所有评估数据仅在本地浏览器中处理与存储（如 localStorage）。
- 本项目不实现服务器端数据收集或账号系统的远程存储。
- 使用者应遵守本地法律法规，在机构环境中部署前请进行必要的伦理与合规审查。

## 贡献

非常欢迎社区参与完善：

- 提交 Issue 反馈 bug 或讨论新功能。
- 提交 Pull Request 改进代码、文案或增加量表。

详细流程与代码规范请参考：

- [`CONTRIBUTING.md`](./CONTRIBUTING.md)
- [`CODE_OF_CONDUCT.md`](./CODE_OF_CONDUCT.md)

## 许可证

本项目基于 [MIT License](./LICENSE) 开源。你可以自由使用、修改、分发本项目，前提是保留原始版权和许可声明。

## 免责声明

- 本项目仅用于心理健康教育与自我筛查。
- 不构成任何形式的医疗诊断、治疗建议或紧急干预。
- 如症状明显、持续恶化、影响工作或日常功能，或存在自/他伤风险，请尽快联系专业人员或当地紧急服务。

---

## English Summary

**MindBalance Suite** is an open-source toolkit for mental-health self-assessment and education.
The main module `phq9-app` is a React + TypeScript web application that integrates multiple validated scales (e.g. PHQ-9, GAD-7, WHO-5, PSS-10, DASS-21).

- All data are processed and stored locally in the browser.
- Results are for self-screening and education only and must not be used as a clinical diagnosis or treatment advice.

### Quick start

```bash
cd phq9-app
pnpm install   # or npm install
pnpm dev       # or npm run dev
```

For more details about features, tech stack, deployment and academic references, see [`phq9-app/README.md`](./phq9-app/README.md).

### License

Released under the MIT License. See [`LICENSE`](./LICENSE) for details.
