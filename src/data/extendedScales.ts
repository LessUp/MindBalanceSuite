/**
 * 扩展心理测试量表 - 基于科学论文
 * 参考文献见 ACADEMIC_INTEGRATION.md
 */

import type { Scale } from './scales'

export const extendedScales: Record<string, Scale> = {
  // 罗森伯格自尊量表 (RSES)
  rses: {
    id: 'rses',
    title: 'RSES 罗森伯格自尊量表',
    timeframe: '一般情况',
    questions: [
      '我感到自己是一个有价值的人，至少与其他人在同一水平上',
      '我感到自己有许多好的品质',
      '总的来说，我倾向于觉得自己是一个失败者',
      '我能像大多数人一样把事情做好',
      '我感到自己没有太多值得骄傲的地方',
      '我对自己持肯定的态度',
      '总的来说，我对自己感到满意',
      '我希望我能更多地尊重自己',
      '有时候我确实觉得自己很没用',
      '有时候我认为自己一无是处'
    ],
    options: [
      { label: '非常同意', value: 3 },
      { label: '同意', value: 2 },
      { label: '不同意', value: 1 },
      { label: '非常不同意', value: 0 }
    ],
    max: 30,
    computeTotal: (values: number[]) => {
      const reverseItems = [2, 4, 7, 8, 9]
      return values.reduce((sum, v, i) => sum + (reverseItems.includes(i) ? (3 - v) : v), 0)
    },
    severity: (total: number) => {
      if (total >= 25) return { key: 'high', label: '高自尊', badge: 'badge-minimal', advice: '您拥有健康的自尊水平，继续保持积极的自我认知。' }
      if (total >= 15) return { key: 'normal', label: '正常自尊', badge: 'badge-mild', advice: '您的自尊水平正常，可以通过积极的自我肯定来提升自信。' }
      return { key: 'low', label: '低自尊', badge: 'badge-moderate', advice: '建议关注自我价值感，可以尝试写下自己的优点，或寻求专业支持。' }
    }
  },

  // CD-RISC-10 心理韧性量表
  cdrisc: {
    id: 'cdrisc',
    title: 'CD-RISC-10 心理韧性量表',
    timeframe: '过去一个月',
    questions: [
      '我能适应变化',
      '无论发生什么，我都能应对',
      '我尽量看到问题的幽默面',
      '应对压力使我更加坚强',
      '我倾向于在困难时期振作起来',
      '即使有障碍，我也能达到目标',
      '在压力下我可以保持专注和清晰思考',
      '面对失败我不容易气馁',
      '我认为自己是一个坚强的人',
      '我能处理不愉快的感受'
    ],
    options: [
      { label: '完全不是', value: 0 },
      { label: '很少这样', value: 1 },
      { label: '有时这样', value: 2 },
      { label: '经常这样', value: 3 },
      { label: '几乎总是', value: 4 }
    ],
    max: 40,
    severity: (total: number) => {
      if (total >= 33) return { key: 'high', label: '高韧性', badge: 'badge-minimal', advice: '您具有很强的心理韧性，在逆境中能够很好地恢复和成长。' }
      if (total >= 25) return { key: 'moderate', label: '中等韧性', badge: 'badge-mild', advice: '您的韧性水平良好，可以通过挑战自己来进一步提升。' }
      if (total >= 17) return { key: 'low', label: '较低韧性', badge: 'badge-moderate', advice: '建议培养应对技能，如问题解决、寻求支持和积极重构。' }
      return { key: 'verylow', label: '韧性需培养', badge: 'badge-modsev', advice: '建议寻求专业指导，学习韧性培养技巧。' }
    }
  },

  // 生活满意度量表 (SWLS)
  swls: {
    id: 'swls',
    title: 'SWLS 生活满意度量表',
    timeframe: '一般情况',
    questions: [
      '在大多数方面，我的生活接近我的理想',
      '我的生活状况非常好',
      '我对自己的生活感到满意',
      '到目前为止，我已经得到了生活中想要的重要东西',
      '如果我能重新生活，我几乎不会改变任何事情'
    ],
    options: [
      { label: '非常不同意', value: 1 },
      { label: '不同意', value: 2 },
      { label: '有点不同意', value: 3 },
      { label: '中立', value: 4 },
      { label: '有点同意', value: 5 },
      { label: '同意', value: 6 },
      { label: '非常同意', value: 7 }
    ],
    max: 35,
    severity: (total: number) => {
      if (total >= 31) return { key: 'extremely', label: '非常满意', badge: 'badge-minimal', advice: '您对生活非常满意！继续保持积极的生活态度。' }
      if (total >= 26) return { key: 'satisfied', label: '满意', badge: 'badge-minimal', advice: '您对生活整体满意，生活质量良好。' }
      if (total >= 21) return { key: 'slightly', label: '比较满意', badge: 'badge-mild', advice: '生活大体满意，可以思考哪些方面还可以提升。' }
      if (total >= 15) return { key: 'neutral', label: '中立', badge: 'badge-moderate', advice: '建议反思生活目标，寻找提升满意度的方向。' }
      if (total >= 10) return { key: 'dissatisfied', label: '不太满意', badge: 'badge-modsev', advice: '建议与专业人员探讨生活困扰，寻找改善方向。' }
      return { key: 'extremely_dissatisfied', label: '非常不满意', badge: 'badge-severe', advice: '强烈建议寻求专业心理支持，探索生活意义和改变可能。' }
    }
  },

  // SPIN 社交恐惧量表
  spin: {
    id: 'spin',
    title: 'SPIN 社交恐惧量表',
    timeframe: '过去一周',
    questions: [
      '我害怕权威人物',
      '我对在他人面前脸红感到困扰',
      '派对和社交活动让我害怕',
      '我避免与陌生人交谈',
      '被批评让我非常害怕',
      '对尴尬的恐惧让我回避做事或与人交谈',
      '在他人面前出汗让我困扰',
      '我避免参加派对',
      '我避免那些我会成为注意力中心的活动',
      '与陌生人交谈让我害怕',
      '我避免必须发言的情况',
      '我会不惜一切代价避免被批评',
      '当我与不熟悉的人在一起时，心悸让我困扰',
      '我害怕在他人面前做傻事',
      '我害怕成为注意力中心',
      '我害怕在他人面前说话时声音发抖',
      '我害怕在他人面前被评判'
    ],
    options: [
      { label: '完全没有', value: 0 },
      { label: '有一点', value: 1 },
      { label: '有些', value: 2 },
      { label: '很多', value: 3 },
      { label: '极度', value: 4 }
    ],
    max: 68,
    severity: (total: number) => {
      if (total <= 20) return { key: 'none', label: '无社交焦虑', badge: 'badge-minimal', advice: '您的社交焦虑水平很低，社交功能良好。' }
      if (total <= 30) return { key: 'mild', label: '轻度社交焦虑', badge: 'badge-mild', advice: '存在轻微社交担忧，可以尝试逐步暴露和社交技能训练。' }
      if (total <= 40) return { key: 'moderate', label: '中度社交焦虑', badge: 'badge-moderate', advice: '建议寻求专业帮助，认知行为治疗对社交焦虑效果良好。' }
      if (total <= 50) return { key: 'severe', label: '重度社交焦虑', badge: 'badge-modsev', advice: '强烈建议寻求专业心理治疗，可能需要综合干预。' }
      return { key: 'verysevere', label: '极重度社交焦虑', badge: 'badge-severe', advice: '请尽快寻求专业帮助。' }
    }
  },

  // 正念量表简版 (MAAS-5)
  maas: {
    id: 'maas',
    title: 'MAAS 正念量表（简版）',
    timeframe: '日常生活中',
    questions: [
      '我可能经历某些情绪，但直到过后才意识到',
      '我因粗心或想着别的事而打碎或弄洒东西',
      '我发现很难集中注意力于当下发生的事情',
      '我倾向于快速赶路，而不太注意沿途经历',
      '我似乎在"自动驾驶"模式下运行'
    ],
    options: [
      { label: '几乎总是', value: 1 },
      { label: '经常', value: 2 },
      { label: '有时', value: 3 },
      { label: '很少', value: 4 },
      { label: '几乎从不', value: 5 }
    ],
    max: 25,
    severity: (total: number) => {
      const avg = total / 5
      if (avg >= 4) return { key: 'high', label: '高正念水平', badge: 'badge-minimal', advice: '您具有良好的正念觉察能力，继续保持。' }
      if (avg >= 3) return { key: 'moderate', label: '中等正念水平', badge: 'badge-mild', advice: '建议增加正念练习，如冥想、专注呼吸。' }
      return { key: 'low', label: '较低正念水平', badge: 'badge-moderate', advice: '建议开始系统的正念训练，从每日5分钟开始。' }
    }
  },

  // 感恩量表 (GQ-6)
  gq6: {
    id: 'gq6',
    title: 'GQ-6 感恩量表',
    timeframe: '一般情况',
    questions: [
      '我生活中有很多值得感恩的事情',
      '如果我必须列出所有感恩的事情，那将是一个很长的清单',
      '当我看周围的世界时，我没有太多值得感恩的',
      '我对很多不同的人心存感激',
      '随着年龄的增长，我发现自己更能欣赏曾经是我生活一部分的人、事件和情境',
      '很长时间才会让我对某人或某事感到感激'
    ],
    options: [
      { label: '非常不同意', value: 1 },
      { label: '不同意', value: 2 },
      { label: '有点不同意', value: 3 },
      { label: '中立', value: 4 },
      { label: '有点同意', value: 5 },
      { label: '同意', value: 6 },
      { label: '非常同意', value: 7 }
    ],
    max: 42,
    computeTotal: (values: number[]) => {
      // 第3,6题反向计分
      return values.reduce((sum, v, i) => sum + ([2, 5].includes(i) ? (8 - v) : v), 0)
    },
    severity: (total: number) => {
      if (total >= 35) return { key: 'high', label: '高感恩倾向', badge: 'badge-minimal', advice: '您具有很强的感恩特质，这对心理健康非常有益。' }
      if (total >= 28) return { key: 'moderate', label: '中等感恩', badge: 'badge-mild', advice: '您的感恩水平良好，可以尝试每天记录三件感恩的事。' }
      return { key: 'low', label: '感恩需培养', badge: 'badge-moderate', advice: '建议培养感恩习惯，每天关注生活中的美好事物。' }
    }
  }
}

// 量表分类
export const scaleCategories = {
  core: {
    name: '核心评估',
    description: '常用的心理健康筛查量表',
    scales: ['phq9', 'gad7', 'dass21', 'k10']
  },
  quickScreen: {
    name: '快速筛查',
    description: '2-5分钟快速评估',
    scales: ['phq2', 'gad2', 'who5']
  },
  specific: {
    name: '专项评估',
    description: '针对特定问题的深入评估',
    scales: ['pss10', 'isi', 'phq15', 'spin', 'auditc', 'audit10']
  },
  positive: {
    name: '积极心理',
    description: '评估积极心理资源',
    scales: ['rses', 'cdrisc', 'swls', 'maas', 'gq6']
  }
}
