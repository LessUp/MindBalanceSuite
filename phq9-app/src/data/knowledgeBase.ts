/**
 * 科普知识库 - 基于循证心理学研究
 * 融入科学论文结论与优化方案
 */

export interface KnowledgeArticle {
  id: string
  title: string
  category: string
  summary: string
  content: string
  tips: string[]
  references: string[]
  relatedScales: string[]
}

export interface InterventionTip {
  id: string
  category: string
  title: string
  description: string
  steps: string[]
  duration: string
  evidence: string
}

// 科普文章知识库
export const knowledgeArticles: KnowledgeArticle[] = [
  {
    id: 'depression-basics',
    title: '认识抑郁：不只是"心情不好"',
    category: '抑郁',
    summary: '抑郁症是一种常见的心理健康问题，了解它的症状和成因是康复的第一步。',
    content: `抑郁症不同于普通的情绪低落，它是一种持续的、影响日常功能的心理健康状况。

**核心症状包括：**
- 持续两周以上的情绪低落
- 对以往喜欢的活动失去兴趣
- 精力下降、易疲劳
- 睡眠和食欲改变
- 注意力和决策能力下降
- 自我价值感降低
- 对未来悲观

**抑郁症的生物学基础：**
研究表明，抑郁症与大脑中的神经递质（如血清素、多巴胺、去甲肾上腺素）失衡有关。这不是个人意志力的问题，而是需要科学干预的健康问题。

**好消息是：**
抑郁症是可治疗的。心理治疗（如认知行为治疗）、药物治疗和生活方式改变都可以有效帮助康复。`,
    tips: [
      '保持规律的睡眠作息',
      '进行适度的体育锻炼',
      '维持社交联系',
      '寻求专业帮助不是软弱的表现'
    ],
    references: [
      'American Psychiatric Association. (2013). DSM-5.',
      'WHO. (2023). Depression Fact Sheet.'
    ],
    relatedScales: ['phq9', 'phq2', 'dass21']
  },
  {
    id: 'anxiety-management',
    title: '焦虑管理：与不确定性共处',
    category: '焦虑',
    summary: '焦虑是正常的情绪反应，学会管理焦虑可以让生活更自在。',
    content: `适度的焦虑是人类进化的保护机制，但当焦虑过度或持续时，就需要关注和管理。

**焦虑的常见表现：**
- 过度担忧难以控制
- 坐立不安、紧张
- 肌肉紧张
- 睡眠困难
- 注意力难以集中
- 易怒

**焦虑的认知模式：**
焦虑的人往往高估威胁、低估自己的应对能力。认知行为治疗通过改变这些不合理的思维模式来减轻焦虑。

**有效的焦虑管理策略：**
1. 放松技术：深呼吸、渐进性肌肉放松
2. 正念练习：接纳当下，不评判
3. 认知重构：识别和挑战焦虑想法
4. 暴露练习：逐步面对恐惧情境`,
    tips: [
      '练习4-7-8呼吸法（吸气4秒-屏息7秒-呼气8秒）',
      '限制咖啡因和酒精摄入',
      '规律运动可降低焦虑水平',
      '写下担忧，安排"担忧时间"'
    ],
    references: [
      'Hofmann, S.G., & Smits, J.A. (2008). Cognitive-behavioral therapy for adult anxiety disorders.',
      'Craske, M.G., & Stein, M.B. (2016). Anxiety. The Lancet.'
    ],
    relatedScales: ['gad7', 'gad2', 'dass21', 'spin']
  },
  {
    id: 'stress-resilience',
    title: '压力与韧性：逆境中成长',
    category: '压力',
    summary: '压力是不可避免的，但我们可以培养韧性来更好地应对挑战。',
    content: `压力反应是身体面对威胁时的自然反应，短期压力可以提升表现，但长期压力会损害身心健康。

**压力对身体的影响：**
- 皮质醇持续升高
- 免疫功能下降
- 心血管风险增加
- 认知功能受损

**心理韧性的核心要素：**
1. **联结**：维持支持性社会关系
2. **灵活性**：适应变化，接受不确定性
3. **意义感**：找到困境中的意义和目标
4. **自我效能**：相信自己能够应对挑战
5. **乐观**：对未来保持现实的希望

**培养韧性的实践：**
- 建立稳定的日常作息
- 培养解决问题的能力
- 练习感恩和积极思维
- 设定可实现的目标
- 寻求并接受帮助`,
    tips: [
      '每天进行15分钟的放松练习',
      '学会说"不"，设定健康边界',
      '保持运动习惯，每周至少150分钟',
      '睡眠充足是应对压力的基础'
    ],
    references: [
      'McEwen, B.S. (2008). Central effects of stress hormones.',
      'Southwick, S.M., & Charney, D.S. (2012). Resilience: The Science of Mastering Lifes Greatest Challenges.'
    ],
    relatedScales: ['pss10', 'cdrisc', 'k10']
  },
  {
    id: 'sleep-hygiene',
    title: '睡眠卫生：高质量睡眠的科学',
    category: '睡眠',
    summary: '睡眠质量直接影响心理健康，改善睡眠习惯是调节情绪的重要途径。',
    content: `睡眠不仅是休息，更是大脑进行记忆巩固、情绪调节和身体修复的重要时期。

**健康睡眠的标准：**
- 入睡时间在30分钟内
- 睡眠效率达85%以上
- 夜间觉醒不超过1次
- 醒后20分钟内再次入睡

**影响睡眠的因素：**
1. **光线**：蓝光抑制褪黑素分泌
2. **温度**：理想卧室温度18-22°C
3. **饮食**：咖啡因半衰期约6小时
4. **心理状态**：焦虑和反刍影响入睡

**睡眠卫生实践：**
- 固定的作息时间，包括周末
- 睡前1小时避免电子屏幕
- 卧室只用于睡眠和亲密
- 避免在床上工作或看电视
- 规律运动，但避免睡前剧烈活动`,
    tips: [
      '建立睡前放松仪式（如阅读、冥想）',
      '避免午后咖啡因摄入',
      '如果20分钟无法入睡，起床做放松活动',
      '保持卧室安静、黑暗、凉爽'
    ],
    references: [
      'Walker, M. (2017). Why We Sleep.',
      'Morin, C.M. (2006). Cognitive behavioral therapy for chronic insomnia.'
    ],
    relatedScales: ['isi', 'phq9']
  },
  {
    id: 'mindfulness-practice',
    title: '正念练习：活在当下的艺术',
    category: '正念',
    summary: '正念是一种有意识地关注当下的练习，可以有效减轻压力和焦虑。',
    content: `正念源自东方冥想传统，现已成为经过科学验证的心理干预方法。

**正念的核心态度：**
1. **不评判**：观察体验而不贴标签
2. **耐心**：让事情按自己的节奏展开
3. **初心**：以全新的眼光看待事物
4. **信任**：相信自己的体验和直觉
5. **不强求**：接受当下的样子
6. **接纳**：如实地看待现实
7. **放下**：不执着于特定结果

**正念的科学益处：**
- 减少压力和焦虑症状
- 改善注意力和工作记忆
- 增强情绪调节能力
- 降低抑郁复发风险
- 改善身体疼痛管理

**简单的正念练习：**
每天花5分钟专注于呼吸，当注意力漂移时，温和地将其带回呼吸。这个简单的练习可以逐步培养正念能力。`,
    tips: [
      '从每天5分钟开始，逐渐增加',
      '使用正念App引导练习',
      '将正念融入日常活动（如吃饭、走路）',
      '加入正念练习小组获得支持'
    ],
    references: [
      'Kabat-Zinn, J. (2003). Mindfulness-based interventions in context.',
      'Khoury, B., et al. (2013). Mindfulness-based therapy: A meta-analysis.'
    ],
    relatedScales: ['maas', 'pss10']
  }
]

// 自助干预技巧
export const interventionTips: InterventionTip[] = [
  {
    id: 'breathing-478',
    category: '放松技术',
    title: '4-7-8 呼吸法',
    description: '一种简单有效的放松呼吸技术，可快速缓解焦虑。',
    steps: [
      '舒适地坐下，放松肩膀',
      '用鼻子吸气，心里默数到4',
      '屏住呼吸，心里默数到7',
      '用嘴慢慢呼气，心里默数到8',
      '重复这个循环4次'
    ],
    duration: '2-3分钟',
    evidence: '研究表明此技术可激活副交感神经系统，降低心率和血压。'
  },
  {
    id: 'pmr',
    category: '放松技术',
    title: '渐进性肌肉放松',
    description: '通过系统地收紧和放松肌肉群来减轻身体紧张。',
    steps: [
      '找一个安静舒适的地方躺下或坐下',
      '从脚开始，用力收紧脚部肌肉5秒',
      '突然放松，感受紧张消散的感觉',
      '向上移动到小腿、大腿，重复收紧-放松',
      '继续到腹部、胸部、手臂、肩膀、脸部',
      '最后，感受全身放松的状态'
    ],
    duration: '15-20分钟',
    evidence: 'Jacobson开发的技术，对焦虑、失眠和慢性疼痛有效。'
  },
  {
    id: 'gratitude-journal',
    category: '积极心理',
    title: '感恩日记',
    description: '每天记录感恩的事情，培养积极心态。',
    steps: [
      '每天晚上或早上固定时间',
      '写下3件今天让你感恩的事情',
      '可以是小事（如一杯好咖啡）或大事',
      '简单描述为什么让你感恩',
      '坚持至少2周'
    ],
    duration: '5分钟',
    evidence: 'Emmons研究表明，感恩练习可提升幸福感和生活满意度。'
  },
  {
    id: 'behavioral-activation',
    category: '情绪调节',
    title: '行为激活',
    description: '通过增加愉快和有意义的活动来改善情绪。',
    steps: [
      '列出以前喜欢但现在不再做的活动',
      '从最简单的活动开始',
      '安排具体的时间和地点',
      '即使没有动力，也先行动起来',
      '记录活动后的情绪变化',
      '逐渐增加活动的数量和难度'
    ],
    duration: '每天15-30分钟',
    evidence: '行为激活是治疗抑郁症的循证心理治疗方法之一。'
  },
  {
    id: 'thought-record',
    category: '认知重构',
    title: '思维记录',
    description: '识别和挑战消极自动思维的认知行为技术。',
    steps: [
      '当感到不安时，记录情境（什么时候、在哪里）',
      '写下当时的情绪和强度（0-100）',
      '记录脑海中的自动想法',
      '寻找支持和反对这个想法的证据',
      '形成更平衡、现实的替代想法',
      '重新评估情绪强度'
    ],
    duration: '10-15分钟',
    evidence: 'Beck认知治疗的核心技术，对抑郁和焦虑效果良好。'
  },
  {
    id: 'social-connection',
    category: '社会支持',
    title: '社交联结计划',
    description: '主动建立和维护支持性社会关系。',
    steps: [
      '列出3-5个想要联系的人',
      '每周至少主动联系1人',
      '可以是发消息、打电话或见面',
      '分享真实的感受，也倾听对方',
      '参加1个社区活动或兴趣小组',
      '对帮助过你的人表达感谢'
    ],
    duration: '每周1-2小时',
    evidence: '社会支持是心理健康的重要保护因素。'
  }
]

// 根据量表结果推荐知识文章
export function getRecommendedArticles(scaleId: string, _severityKey: string): KnowledgeArticle[] {
  return knowledgeArticles.filter(article => 
    article.relatedScales.includes(scaleId)
  )
}

// 根据量表结果推荐干预技巧
export function getRecommendedTips(scaleId: string, _severityKey: string): InterventionTip[] {
  const categoryMap: Record<string, string[]> = {
    phq9: ['情绪调节', '积极心理', '社会支持'],
    gad7: ['放松技术', '认知重构'],
    pss10: ['放松技术', '正念', '积极心理'],
    isi: ['放松技术'],
    maas: ['正念'],
    rses: ['积极心理', '认知重构'],
    cdrisc: ['积极心理', '社会支持']
  }
  
  const categories = categoryMap[scaleId] || ['积极心理']
  return interventionTips.filter(tip => categories.includes(tip.category))
}
