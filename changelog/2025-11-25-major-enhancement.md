# 2025-11-25 重大功能增强

## 概述
本次更新为 MindBalance Suite 添加了大量新功能，包括更多心理量表、科普知识库、心理小游戏、AI结果解读等。

## 新增功能

### 1. 扩展心理测试量表
基于科学论文新增 6 个心理评估量表：
- **RSES 罗森伯格自尊量表** - 评估自我价值感和自信水平
- **CD-RISC-10 心理韧性量表** - 测量面对逆境时的恢复能力
- **SWLS 生活满意度量表** - 评估整体生活质量的主观感受
- **SPIN 社交恐惧量表** - 评估社交场合的舒适程度
- **MAAS 正念量表** - 评估活在当下的能力
- **GQ-6 感恩量表** - 评估对生活美好事物的欣赏程度

新增量表分类系统：
- 核心评估（PHQ-9、GAD-7、DASS-21、K10）
- 快速筛查（PHQ-2、GAD-2、WHO-5）
- 专项评估（PSS-10、ISI、PHQ-15、SPIN 等）
- 积极心理（RSES、CD-RISC、SWLS、MAAS、GQ-6）

### 2. 科普知识库
新增 `/knowledge` 页面：
- 循证心理学科普文章（抑郁、焦虑、压力、睡眠、正念）
- 实用自助干预技巧（呼吸法、感恩日记、行为激活等）
- 文章与量表关联推荐
- 搜索和分类筛选功能

### 3. 心理小游戏模块
新增 `/games` 页面，包含互动练习：
- **呼吸泡泡** - 引导式深呼吸练习
- **感恩罐子** - 每日感恩记录
- **情绪轮盘** - 情绪识别与应对策略
- **积极肯定** - 随机积极肯定语句
- **记忆花园** - 翻牌配对认知训练

多种呼吸练习模板：
- 方形呼吸（4-4-4-4）
- 4-7-8 放松呼吸
- 提神呼吸
- 协调呼吸

### 4. AI 结果解读
新增大模型结果解读服务：
- 支持 OpenAI、DeepSeek、通义千问等 API
- 本地模式（无需 API 密钥）
- 个性化解读和建议
- 安全警告机制

### 5. 增强用户系统
新增用户状态管理：
- 用户偏好设置
- 统计数据追踪
- 心情日历
- 感恩日记
- AI 配置管理

### 6. 可选后端服务
新增 `/backend` 目录，提供完整的后端 API：
- 用户认证（注册/登录/JWT/修改密码）
- 数据云端同步（评估、心情、感恩记录）
- SQLite 数据持久化
- RESTful API 设计
- 用户统计与数据分析
- AI 解读代理（安全的 API 密钥管理）
- 完整的 API 文档

## 技术改进

### 新增文件
- `src/data/extendedScales.ts` - 扩展量表定义
- `src/data/knowledgeBase.ts` - 科普知识库
- `src/data/games.ts` - 游戏和练习数据
- `src/services/aiInterpretation.ts` - AI 解读服务
- `src/stores/userStore.ts` - 增强用户状态
- `src/pages/Games.tsx` - 游戏页面
- `src/pages/Knowledge.tsx` - 知识页面
- `src/config/api.ts` - API 配置
- `backend/` - 后端服务目录

### 修改文件
- `src/App.tsx` - 添加新路由
- `src/components/Layout.tsx` - 添加导航链接
- `src/data/scales.ts` - 集成扩展量表
- `src/pages/Home.tsx` - 添加分类筛选
- `src/pages/Assessment.tsx` - 使用 allScales

## 参考文献
新增量表参考：
- Rosenberg, M. (1965). Society and the adolescent self-image.
- Connor, K.M., & Davidson, J.R. (2003). CD-RISC. Depression and Anxiety.
- Diener, E., et al. (1985). SWLS. Journal of Personality Assessment.
- Connor, K.M., et al. (2000). SPIN. British Journal of Psychiatry.
- Brown, K.W., & Ryan, R.M. (2003). MAAS. Journal of Personality and Social Psychology.
- McCullough, M.E., et al. (2002). GQ-6. Journal of Personality and Social Psychology.

## 第二阶段更新

### 新增功能

#### 1. 数据可视化图表
- **评估趋势图** - 展示历史评估得分变化
- **量表分布饼图** - 显示各量表使用比例
- **心情趋势图** - 可视化心情变化
- **统计卡片** - 关键数据一目了然
- **进度环** - 直观展示完成度

#### 2. 心情追踪日历
- 月度日历视图
- 表情符号快速记录
- 月度统计汇总
- 历史心情浏览

#### 3. 增强历史记录页面
- 列表/图表/日历三种视图
- 时间范围筛选（周/月/全部）
- 量表类型筛选
- 统计数据面板

#### 4. 登录/注册UI
- 美观的模态框设计
- 支持本地模式和后端模式
- 云端同步状态指示

#### 5. AI解读组件
- 可折叠的解读面板
- 关键洞察展示
- 改善建议列表
- 安全警告提示

#### 6. 数据导出功能
- JSON 完整数据导出
- CSV 表格导出
- PDF 报告生成（打印）

### 新增文件
- `src/components/Charts.tsx` - 图表组件库
- `src/components/MoodCalendar.tsx` - 心情日历
- `src/components/AuthModal.tsx` - 登录注册模态框
- `src/components/AIInterpretation.tsx` - AI解读组件
- `src/utils/exportData.ts` - 数据导出工具

### 依赖更新
- 新增 `recharts` - 图表库

## 待办事项
- [ ] 添加更多量表（BDI-II、PCL-5 等）
- [ ] 多语言支持
- [ ] PWA 离线支持
- [ ] 提醒功能
- [ ] 数据备份恢复
