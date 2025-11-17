# MindBalanceSuite / PHQ9-App 学术整合方案

## 1. 目的与范围

本文件用于：
- 系统整理与本项目相关的**量表原始文献**及**近 5 年数字心理健康/移动干预/机器学习筛查**研究；
- 提取可直接或间接应用于本项目的关键技术点；
- 建立“文献 ←→ 项目模块”的对应关系，为后续实验设计与学术写作提供依据。

> 说明：为避免凭空捏造信息，以下 APA 引用中仅在已确认的情况下给出卷期/DOI；其余字段建议在实际写作时登录对应数据库（IEEE Xplore、ScienceDirect、SpringerLink、JMIR、PubMed 等）补全。

## 2. 核心参考文献（APA 建议格式）

### 2.1 量表原始文献

- Kroenke, K., Spitzer, R. L., & Williams, J. B. W. (2001). The PHQ-9: Validity of a brief depression severity measure. *Journal of General Internal Medicine*.
- Spitzer, R. L., Kroenke, K., Williams, J. B. W., & Löwe, B. (2006). A brief measure for assessing generalized anxiety disorder: The GAD-7. *Archives of Internal Medicine*.
- Topp, C. W., Østergaard, S. D., Søndergaard, S., & Bech, P. (2015). The WHO-5 Well-Being Index: A systematic review of the literature. *Psychotherapy and Psychosomatics*.
- Cohen, S., Kamarck, T., & Mermelstein, R. (1983). A global measure of perceived stress. *Journal of Health and Social Behavior*.
- Lovibond, S. H., & Lovibond, P. F. (1995). *Manual for the Depression Anxiety Stress Scales (DASS)*.
- Babor, T. F., Higgins-Biddle, J. C., Saunders, J. B., & Monteiro, M. G. (2001). *AUDIT: The Alcohol Use Disorders Identification Test. Guidelines for use in primary care* (2nd ed.). World Health Organization.

这些文献为 `src/data/scales.ts` 中各量表的题项、计分范围、分级阈值提供理论基础。

### 2.2 数字心理健康与移动应用干预

- Oliveira, C., Pereira, A., Vagos, P., Gonçalves, J., & Afonso, B. (2021). Effectiveness of mobile app–based psychological interventions for college students: A systematic review of the literature. *Frontiers in Psychology*.
- Fundoiano-Hershcovitz, Y., Breuer Asher, I., Ritholz, M. D., Feniger, E., Manejwala, O., & Goldstein, P. (2023). Specifying the efficacy of digital therapeutic tools for depression and anxiety: Retrospective, 2-cohort, real-world analysis. *Journal of Medical Internet Research*.
- Xu, W., et al. (2024). Effectiveness of an internet-based self-help acceptance and commitment therapy program on medical students’ mental well-being: Follow-up randomized controlled trial. *Journal of Medical Internet Research*. https://doi.org/10.2196/50664

主要可用结论：
- 高校/医学生群体中，**移动与网络心理干预具有可接受性和中等以上效应量**（压力、抑郁、焦虑显著降低）。
- 纯自助式方案（例如 iACT 2.0）在**无治疗师支持**情况下仍能产生持续 1 个月以上的效应。
- 数字治疗平台中，**不同交互组件（教练会话 vs. 呼吸练习）对抑郁/焦虑的影响路径不同**，提示需要个性化推荐策略。

### 2.3 机器学习与数字表型（被动数据筛查）

- Choudhary, S., Thomas, N., Ellenberger, J., Srinivasan, G., & Cohen, R. (2022). A machine learning approach for detecting digital behavioral patterns of depression using nonintrusive smartphone data (complementary path to Patient Health Questionnaire-9 assessment): Prospective observational study. *JMIR mHealth and uHealth*.
- （可选补充）Feasibility of a machine learning–based smartphone application in detecting depression and anxiety in a generally senior population. *Frontiers in Psychology*, 2022.

主要可用结论：
- 使用被动采集的智能手机行为特征（使用时长、交互模式、传感器等），可在**不直接提问的情况下**对抑郁严重程度进行中高精度预测，并与 PHQ‑9 形成互补关系。
- 提出“数字行为相似度（Mental Health Similarity Score）”等指标，用于持续监测情绪轨迹。

## 3. 文献与项目模块的对应关系

以下对应关系在 `references/citation_graph.json` 中以结构化形式给出，此处为可读版摘要。

### 3.1 量表与评估模块（Assessment 页面 + `scales.ts`）

- 模块：
  - 量表定义与计分：`src/data/scales.ts`
  - 评估流程与界面：`src/pages/Assessment.tsx`（以及相关组件）
- 支撑文献：
  - PHQ-9 / GAD-7 / WHO‑5 / PSS / DASS‑21 / AUDIT 相关原始文献。
- 可用技术点：
  - 严格遵循原始量表的题项、计分与分级阈值；
  - 在结果说明中，使用原文中推荐的阈值与临床提示语（目前已部分体现在 `severity` 与 `extras` 函数中）。

### 3.2 结果反馈与自助干预建议模块

- 模块：
  - 评估结果展示页（结果分级、文字建议）；
  - 未来可扩展的“自助练习/心理教育”页面或弹窗。
- 支撑文献：
  - Oliveira et al. (2021)
  - Fundoiano-Hershcovitz et al. (2023)
  - Xu et al. (2024)
- 可用技术点：
  - 参考 iACT 2.0，将**接受与承诺疗法（ACT）**中的核心练习（如价值澄清、当下觉察、认知解融合）封装为可重复使用的自助模块；
  - 借鉴数字治疗平台中**教练会话**与**呼吸训练**的差异效果，将来在产品中以“可切换的干预组件”方式实现，以便做 A/B 对比；
  - 对于高风险结果（如 PHQ‑9 第 9 题 > 0），在目前紧急求助提示的基础上，可以在文档中明确引用相关研究对于自杀风险筛查的建议，但不在前端做自动诊断。

### 3.3 历史记录与随访分析模块

- 模块：
  - 历史评估记录存储与可视化（`History` 页面、导出功能）。
- 支撑文献：
  - 所有使用 PHQ‑9 / GAD‑7 / DASS 等量表作为**纵向追踪工具**的数字干预研究（例如 Xu 2024, Fundoiano‑Hershcovitz 2023）。
- 可用技术点：
  - 明确在文档与周报中，将**重复测量设计**与量表时间间隔写清（如基线、4 周、8 周、随访）。

### 3.4 未来扩展：被动数据与机器学习筛查模块

- 模块（规划中）：
  - 可选的被动数据采集（需显式告知与授权，如使用时间段、步数、睡眠时长等非敏感指标）；
  - 后端或本地的风险评分模型（与 PHQ‑9/GAD‑7 结果做对照）。
- 支撑文献：
  - Choudhary et al. (2022) 等数字表型研究。
- 可用技术点：
  - 先在**研究模式**下实现：用户自愿加入，明确知情同意，并将 ML 预测仅用于研究，不参与实际反馈；
  - 使用开源 ML 工具（如 scikit-learn）在研究代码仓库中实现原型，而不是直接混入生产前端。

## 4. 对比实验设计（方法级验证）

以下为高层级实验思路，具体伦理审批与实施流程需在真实研究环境中补充。

### 4.1 ACT 自助模块 vs. 仅量表反馈

- 目标：验证在现有量表评估基础上增加 iACT 风格自助模块，对抑郁/焦虑/压力的额外收益。
- 设计：
  - 受试者：高校/医学生或普通大学生，自愿参与；
  - 分组：
    - 对照组：仅使用现有量表评估与结果说明；
    - 实验组：评估后自动获得 6 个 iACT 自助单元（仿照 Xu 2024 的频率与节奏）；
  - 指标：
    - 主要：DASS‑21、PHQ‑9、GAD‑7；
    - 次要：WHO‑5 主观幸福感、使用粘性（完成率、登录次数）。
  - 分析：重复测量 ANOVA 或线性混合模型，比较组间 × 时间的交互效应。

### 4.2 数字治疗交互组件对比（教练 vs. 呼吸练习）

- 目标：借鉴 Fundoiano‑Hershcovitz 2023 的发现，比较不同自助组件对 PHQ‑9 / GAD‑7 轨迹的影响模式。
- 设计思路：
  - 在项目中增加两个可选模块：
    - 模块 A：基于文本的“教练式指导脚本”（结构化问题 + 行动计划）；
    - 模块 B：基于图文/音频的呼吸与放松训练；
  - 组别：A 组、B 组、对照组（仅评估 + 提示）；
  - 指标：PHQ‑9 / GAD‑7 变化、模块使用频率与时长；
  - 分析：混合模型，考察“使用次数”与“症状变化”的交互。

### 4.3 被动数据 + 量表的互补性验证

- 目标：验证类似 Choudhary 2022 的数字行为指标，在本项目人群中的可行性与预测能力。
- 设计思路：
  - 在研究版本应用中，增加自愿的被动数据采集模块（仅限隐私风险较低的数据，如 app 打开频率、使用时间段等）；
  - 收集 PHQ‑9 / GAD‑7 与对应时间窗内的行为特征；
  - 采用随机森林等模型，预测二分类（无/中重度），并与 PHQ‑9 得分对照；
  - 指标：准确率、召回率、AUC，与原文报道水平做对比。

## 5. references 目录与引用关系图谱

- `references/`：
  - `papers/`：手动下载的 PDF、技术报告；
  - `summaries/`：每篇文献的结构化中文总结（建议字段：背景、样本、研究设计、主要结果、与本项目的关联、局限性）；
  - `citation_graph.json`：文献与项目模块关系的机器可读表示。

`citation_graph.json` 示例结构（实际文件中为 JSON）：

```jsonc
{
  "modules": [
    { "id": "mod_scales_engine", "name": "量表评估与计分引擎" },
    { "id": "mod_results_feedback", "name": "结果反馈与自助建议" },
    { "id": "mod_history_tracking", "name": "历史记录与随访" },
    { "id": "mod_future_digital_phenotyping", "name": "被动数据与 ML 筛查（规划中）" }
  ],
  "papers": [
    { "id": "paper_kroenke2001_phq9", "year": 2001 },
    { "id": "paper_spitzer2006_gad7", "year": 2006 },
    { "id": "paper_oliveira2021_mhealth_college", "year": 2021 },
    { "id": "paper_fundoiano2023_digital_therapeutic", "year": 2023 },
    { "id": "paper_xu2024_iact", "year": 2024 },
    { "id": "paper_choudhary2022_digital_behavior", "year": 2022 }
  ],
  "edges": [
    { "paperId": "paper_kroenke2001_phq9", "moduleId": "mod_scales_engine", "relation": "defines_scale" },
    { "paperId": "paper_oliveira2021_mhealth_college", "moduleId": "mod_results_feedback", "relation": "supports_intervention_design" },
    { "paperId": "paper_fundoiano2023_digital_therapeutic", "moduleId": "mod_results_feedback", "relation": "informs_engagement_features" },
    { "paperId": "paper_xu2024_iact", "moduleId": "mod_results_feedback", "relation": "informs_act_selfhelp" },
    { "paperId": "paper_choudhary2022_digital_behavior", "moduleId": "mod_future_digital_phenotyping", "relation": "informs_ml_screening" }
  ]
}
```

> 实际文件 `references/citation_graph.json` 中已经保存了一个可直接解析的 JSON 版本，可在研究脚本或可视化工具中直接加载使用。

## 6. 周报与文档要求建议

为保证学术严谨性，建议在团队周报中固定增加“学术整合”章节，包含：
- 新增/更新的文献列表（APA 引用，注明数据库与是否为同行评议期刊/CCF A 会议）；
- 文献与模块映射的变化（对应 `citation_graph.json`）；
- 新增或进行中的对比实验（设计、样本数、进度）；
- 初步结果与可重复性检查（例如是否在不同子样本上复现）。

在对外报告或论文写作时，可直接基于本文件与 `references/` 目录中的内容补充细节与引用。
