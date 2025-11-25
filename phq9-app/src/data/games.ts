/**
 * 心理小游戏与互动练习模块
 * 基于积极心理学和认知训练研究
 */

export interface MindGame {
  id: string
  name: string
  description: string
  category: 'relaxation' | 'cognitive' | 'emotion' | 'mindfulness' | 'social'
  duration: string
  difficulty: 'easy' | 'medium' | 'hard'
  benefits: string[]
  icon: string
}

export interface BreathingExercise {
  id: string
  name: string
  description: string
  pattern: {
    inhale: number
    hold?: number
    exhale: number
    holdAfter?: number
  }
  cycles: number
  benefits: string[]
}

export interface EmotionCard {
  id: string
  emotion: string
  emoji: string
  description: string
  bodySignals: string[]
  copingStrategies: string[]
}

// 心理小游戏列表
export const mindGames: MindGame[] = [
  {
    id: 'breathing-bubble',
    name: '呼吸泡泡',
    description: '跟随动画泡泡的节奏进行深呼吸，帮助放松身心。',
    category: 'relaxation',
    duration: '3-5分钟',
    difficulty: 'easy',
    benefits: ['减轻焦虑', '降低心率', '促进放松'],
    icon: '🫧'
  },
  {
    id: 'gratitude-jar',
    name: '感恩罐子',
    description: '每天添加一件感恩的事到罐子里，累积正能量。',
    category: 'emotion',
    duration: '2-3分钟',
    difficulty: 'easy',
    benefits: ['提升幸福感', '培养积极心态', '增强感恩意识'],
    icon: '🏺'
  },
  {
    id: 'emotion-wheel',
    name: '情绪轮盘',
    description: '识别和探索当前的情绪状态，增进情绪觉察。',
    category: 'emotion',
    duration: '5分钟',
    difficulty: 'easy',
    benefits: ['情绪识别', '自我觉察', '情绪词汇扩展'],
    icon: '🎯'
  },
  {
    id: 'memory-garden',
    name: '记忆花园',
    description: '翻牌配对游戏，锻炼工作记忆和注意力。',
    category: 'cognitive',
    duration: '5-10分钟',
    difficulty: 'medium',
    benefits: ['提升记忆力', '增强专注力', '认知训练'],
    icon: '🌸'
  },
  {
    id: 'color-breath',
    name: '色彩呼吸',
    description: '想象吸入平静的颜色，呼出紧张的颜色。',
    category: 'mindfulness',
    duration: '3-5分钟',
    difficulty: 'easy',
    benefits: ['正念练习', '放松身心', '创意表达'],
    icon: '🌈'
  },
  {
    id: 'body-scan',
    name: '身体扫描',
    description: '从头到脚感受身体各部位，释放紧张。',
    category: 'mindfulness',
    duration: '10-15分钟',
    difficulty: 'medium',
    benefits: ['身心觉察', '释放紧张', '改善睡眠'],
    icon: '🧘'
  },
  {
    id: 'positive-affirmation',
    name: '积极肯定',
    description: '选择并重复积极的自我肯定语句。',
    category: 'emotion',
    duration: '3分钟',
    difficulty: 'easy',
    benefits: ['提升自信', '改变消极思维', '增强自我价值'],
    icon: '💪'
  },
  {
    id: 'worry-box',
    name: '烦恼盒子',
    description: '将烦恼写下来放入盒子，练习暂时放下。',
    category: 'emotion',
    duration: '5分钟',
    difficulty: 'easy',
    benefits: ['释放焦虑', '认知距离化', '情绪管理'],
    icon: '📦'
  },
  {
    id: 'focus-timer',
    name: '专注番茄',
    description: '番茄工作法计时器，提升专注力和效率。',
    category: 'cognitive',
    duration: '25分钟',
    difficulty: 'medium',
    benefits: ['提升专注', '减少拖延', '时间管理'],
    icon: '🍅'
  },
  {
    id: 'mood-tracker',
    name: '心情日历',
    description: '用颜色和表情记录每日心情变化。',
    category: 'emotion',
    duration: '1分钟',
    difficulty: 'easy',
    benefits: ['情绪追踪', '模式识别', '自我觉察'],
    icon: '📅'
  }
]

// 呼吸练习模板
export const breathingExercises: BreathingExercise[] = [
  {
    id: 'box-breathing',
    name: '方形呼吸',
    description: '海豹突击队使用的压力管理技术，适合快速镇定。',
    pattern: { inhale: 4, hold: 4, exhale: 4, holdAfter: 4 },
    cycles: 4,
    benefits: ['快速镇定', '提升专注', '减少焦虑']
  },
  {
    id: '478-breathing',
    name: '4-7-8 呼吸',
    description: 'Dr. Andrew Weil推荐的放松技术，帮助入睡。',
    pattern: { inhale: 4, hold: 7, exhale: 8 },
    cycles: 4,
    benefits: ['促进睡眠', '深度放松', '降低心率']
  },
  {
    id: 'relaxing-breath',
    name: '放松呼吸',
    description: '简单的腹式呼吸，适合初学者。',
    pattern: { inhale: 4, exhale: 6 },
    cycles: 6,
    benefits: ['日常放松', '初学友好', '随时可用']
  },
  {
    id: 'energizing-breath',
    name: '提神呼吸',
    description: '快速呼吸技术，帮助提升精力和警觉。',
    pattern: { inhale: 2, exhale: 2 },
    cycles: 10,
    benefits: ['提升精力', '增强警觉', '激活身心']
  },
  {
    id: 'coherent-breath',
    name: '协调呼吸',
    description: '每分钟5次呼吸，达到心率变异性最佳状态。',
    pattern: { inhale: 6, exhale: 6 },
    cycles: 5,
    benefits: ['心率变异性优化', '情绪平衡', '长期健康']
  }
]

// 情绪卡片
export const emotionCards: EmotionCard[] = [
  {
    id: 'joy',
    emotion: '快乐',
    emoji: '😊',
    description: '一种积极的情绪体验，伴随着满足感和幸福感。',
    bodySignals: ['嘴角上扬', '眼睛发亮', '身体轻松', '精力充沛'],
    copingStrategies: ['分享快乐', '记录美好时刻', '表达感恩']
  },
  {
    id: 'sadness',
    emotion: '悲伤',
    emoji: '😢',
    description: '面对失去或失望时的自然情绪反应。',
    bodySignals: ['胸口沉闷', '眼眶湿润', '身体疲惫', '想独处'],
    copingStrategies: ['允许自己悲伤', '寻求支持', '进行自我关怀', '适度运动']
  },
  {
    id: 'anger',
    emotion: '愤怒',
    emoji: '😠',
    description: '当感到不公正或边界被侵犯时的保护性情绪。',
    bodySignals: ['肌肉紧张', '心跳加速', '脸部发热', '呼吸加快'],
    copingStrategies: ['深呼吸', '暂时离开', '运动释放', '表达需求']
  },
  {
    id: 'fear',
    emotion: '恐惧',
    emoji: '😨',
    description: '面对威胁或危险时的警报系统。',
    bodySignals: ['心跳加速', '出汗', '呼吸急促', '肌肉僵硬'],
    copingStrategies: ['深呼吸', '理性评估', '渐进暴露', '寻求支持']
  },
  {
    id: 'anxiety',
    emotion: '焦虑',
    emoji: '😰',
    description: '对未来不确定性的担忧和不安。',
    bodySignals: ['坐立不安', '难以专注', '肌肉紧绷', '睡眠困难'],
    copingStrategies: ['正念练习', '限制担忧时间', '行动起来', '挑战灾难化思维']
  },
  {
    id: 'calm',
    emotion: '平静',
    emoji: '😌',
    description: '内心安宁、放松的状态。',
    bodySignals: ['呼吸平稳', '肌肉放松', '心跳平缓', '头脑清明'],
    copingStrategies: ['保持正念', '规律作息', '亲近自然', '冥想练习']
  },
  {
    id: 'gratitude',
    emotion: '感恩',
    emoji: '🙏',
    description: '对生活中美好事物的欣赏和感激。',
    bodySignals: ['心胸开阔', '温暖感', '眼神柔和', '想要分享'],
    copingStrategies: ['感恩日记', '表达感谢', '回顾美好', '帮助他人']
  },
  {
    id: 'lonely',
    emotion: '孤独',
    emoji: '😔',
    description: '渴望联结但感到隔离的痛苦体验。',
    bodySignals: ['胸口空虚', '渴望陪伴', '精力低落', '思绪纷飞'],
    copingStrategies: ['主动联系', '参加活动', '自我陪伴', '志愿服务']
  }
]

// 积极肯定语句
export const positiveAffirmations = [
  '我有能力应对今天的挑战',
  '我值得被爱和尊重',
  '我的感受是有效的',
  '我每天都在成长和进步',
  '我选择专注于我能控制的事情',
  '我对自己有耐心和同情',
  '我的存在让世界变得更美好',
  '我有权利说不，设定边界',
  '失败是学习的机会',
  '我足够好，现在就是',
  '我选择放下无法改变的过去',
  '我值得休息和自我照顾',
  '我的声音和想法很重要',
  '我可以一步一步来',
  '今天我选择善待自己'
]

// 获取随机肯定语句
export function getRandomAffirmation(): string {
  return positiveAffirmations[Math.floor(Math.random() * positiveAffirmations.length)]
}

// 根据情绪获取应对策略
export function getCopingStrategies(emotionId: string): string[] {
  const card = emotionCards.find(c => c.id === emotionId)
  return card?.copingStrategies || []
}
