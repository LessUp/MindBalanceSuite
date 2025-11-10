# 心理健康自评量表中心（Web 应用）

本应用集成多种常用、科学的心理健康自评/筛查量表，用于健康教育与自我筛查。结果仅供参考，不构成医疗“诊断”或治疗建议。如症状明显、持续恶化、影响功能或存在自/他伤风险，请尽快联系专业人员或当地紧急服务。

## 支持的量表
- PHQ-9 抑郁（0–27；第9题>0提示即时求助）
- GAD-7 焦虑（0–21）
- PHQ-2 / GAD-2 快筛（0–6）
- WHO-5 主观幸福感（原始分0–25；百分比=×4）
- PSS-10 感知压力量表（0–40，含反向计分）
- PHQ-15 躯体化症状（0–30）
- ISI 失眠严重度指数（0–28）
- K10 心理困扰（10–50）
- DASS-21 抑郁/焦虑/压力三维度（每维度×2换算）
- AUDIT-C 酒精使用筛查（0–12，题目级选项）
- AUDIT-10 酒精使用障碍识别（0–40，题目级选项）

## 功能特性
- 多量表切换（Tabs），动态渲染题干与计分规则
- 进度条与选中高亮，作答完整后才允许提交
- 单选后自动滚动至下一题，吸底操作区（提交/重置/打印/历史）
- 结果分级徽章与建议，结果摘要可一键复制，PHQ-9 第9题风险提示
- 本地持久化：当前量表与各量表作答自动保存与恢复；历史记录可查看/恢复/清空/导出 JSON
- 主题切换（浅色/深色），打印优化
- 隐私友好：纯前端，本地计算，不上传任何数据

## 使用方式
- 直接双击打开 `index.html` 即可在浏览器离线使用。
- 或在本地启动一个静态服务器（推荐，便于打印与兼容）：
  1) 终端切换到 `phq9-app/` 目录
  2) 运行：`python3 -m http.server 8080`  
  3) 打开浏览器访问：`http://localhost:8080`

## 部署
- Netlify：根目录已提供 `netlify.toml`，发布目录为 `phq9-app/`。
- GitHub Pages：将 `phq9-app/` 设为 Pages 发布目录。
- Vercel：创建项目时选择 `phq9-app/` 作为输出目录。

## 科学与适用性说明
- PHQ-9 为国际广泛使用、经大量研究验证的抑郁症状自评量表，适合初步自我筛查与随访监测，不可替代临床面诊与综合评估。
- 分数阈值与分级建议参考权威研究；不同人群与临床情境可能需要结合专业判断进行解释。

## 风险与安全
- 如存在强烈痛苦、计划或实施自伤/他伤念头，或难以保证自身安全：请立即联系当地紧急电话或前往就近医院急诊科求助。

## 隐私
- 本应用不收集、不上传任何个人数据。所有作答与结果计算在本地浏览器完成。

## 参考文献（节选）
- PHQ-9：Kroenke K, Spitzer RL, Williams JBW. J Gen Intern Med. 2001;16(9):606–613.
- GAD-7：Spitzer RL, Kroenke K, Williams JBW, Löwe B. Arch Intern Med. 2006;166(10):1092–1097.
- WHO-5：Topp CW, Østergaard SD, Søndergaard S, Bech P. Psychother Psychosom. 2015;84(3):167–176.
- PSS：Cohen S, Kamarck T, Mermelstein R. J Health Soc Behav. 1983;24(4):385–396.
- DASS-21：Lovibond SH, Lovibond PF. Manual for the DASS. 1995.
- AUDIT：Babor TF, Higgins-Biddle JC, Saunders JB, Monteiro MG. AUDIT: WHO 用户指南（第二版）。

## 免责声明
- 本工具用于健康教育与自我筛查，不提供医疗诊断或治疗建议；不构成医患关系。对于任何健康问题，请咨询合格的医疗专业人员。

## 仓库结构
```
phq9-app/
  index.html        # 入口页面
  app.js            # 量表逻辑、持久化与交互
  styles.css        # 样式（含暗色模式与历史记录 UI）
  README.md         # 使用与部署说明
LICENSE             # MIT 许可证
CONTRIBUTING.md     # 贡献指南
CODE_OF_CONDUCT.md  # 行为准则
.gitignore
netlify.toml
```

## 本地开发与调试
- 所有逻辑均为原生 HTML/CSS/JavaScript，无需额外依赖。
- 建议通过本地静态服务器打开，便于跨浏览器测试（示例：`python3 -m http.server 8080`）。
- 修改代码后刷新即可看到效果；若涉及 localStorage，可在浏览器开发者工具中清理或切换量表验证持久化逻辑。

## 贡献
- 欢迎提交 Issue 或 Pull Request。
- 请先阅读 [CONTRIBUTING.md](../CONTRIBUTING.md) 了解提交规范（如何新增量表、代码风格等）。
- 共同遵守 [CODE_OF_CONDUCT.md](../CODE_OF_CONDUCT.md)。

## 许可证
- 本项目基于 [MIT License](../LICENSE) 开源，可自由复用与二次开发。请保留原始版权声明。
