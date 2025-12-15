export interface Scale {
  id: string
  title: string
  timeframe: string
  questions: string[]
  options: Option[]
  questionOptions?: Option[][]
  max: number
  severity: (total: number, values: number[]) => SeverityResult
  extras?: (total: number, values: number[]) => string
  computeTotal?: (values: number[]) => number
}

export interface Option {
  label: string
  value: number
}

export interface SeverityResult {
  key: string
  label: string
  badge: string
  advice: string
}

export const baseOptions: Option[] = [
  { label: '完全没有', value: 0 },
  { label: '好几天', value: 1 },
  { label: '一半以上的天数', value: 2 },
  { label: '几乎每天', value: 3 }
]

export const scales: Record<string, Scale> = {
  phq9: {
    id: 'phq9',
    title: 'PHQ-9 抑郁症自评量表',
    timeframe: '过去两周',
    questions: [
      '做事时提不起劲或没有兴趣',
      '感到心情沮丧、忧郁或绝望',
      '入睡困难、持续睡眠困难或睡眠过多',
      '感到疲倦或没有活力',
      '食欲不振或吃太多',
      '觉得自己很糟或觉得自己很失败，或让自己或家人失望',
      '注意力不集中，例如看报纸或看电视时',
      '动作或说话速度变慢，以至于别人已经注意到了？或相反——烦躁不安或坐立不安，动来动去的情况更明显',
      '有不如死掉或者以某种方式伤害自己的想法'
    ],
    options: baseOptions,
    max: 27,
    severity: (total: number, _values: number[]) => {
      if (total <= 4) return { key: 'minimal', label: '最小/无抑郁', badge: 'badge-minimal', advice: '建议继续关注自身状态，保持规律作息与运动。如症状持续或影响生活，仍建议咨询专业人员。' }
      if (total <= 9) return { key: 'mild', label: '轻度', badge: 'badge-mild', advice: '建议与专业人员沟通，获取心理教育与自助干预建议，持续观察变化。' }
      if (total <= 14) return { key: 'moderate', label: '中度', badge: 'badge-moderate', advice: '建议进行专业评估，心理治疗可能带来帮助，并在医嘱下考虑综合干预。' }
      if (total <= 19) return { key: 'modsev', label: '中重度', badge: 'badge-modsev', advice: '建议尽快进行专业评估，遵循医生建议，可能需要系统的心理治疗与药物治疗。' }
      return { key: 'severe', label: '重度', badge: 'badge-severe', advice: '建议尽快就医评估，必要时前往医院或急诊寻求安全与治疗支持。' }
    },
    extras: (_total: number, values: number[]) => {
      const risk = (values[8] || 0) > 0
      return risk ? '<div class="risk">如有伤害自己或他人的想法或计划，请立即寻求帮助：拨打当地紧急求助电话，或尽快前往最近的医院急诊科。</div>' : ''
    }
  },

  gad7: {
    id: 'gad7',
    title: 'GAD-7 焦虑自评量表',
    timeframe: '过去两周',
    questions: [
      '感到紧张、焦虑或坐立不安',
      '无法停止或控制担忧',
      '对各种事情过分担忧',
      '难以放松',
      '因为烦躁而难以静坐',
      '容易烦恼或恼火',
      '担心会发生可怕的事情'
    ],
    options: baseOptions,
    max: 21,
    severity: (total: number) => {
      if (total <= 4) return { key: 'minimal', label: '最小/无焦虑', badge: 'badge-minimal', advice: '建议保持良好作息与运动，继续观察情绪与压力变化。' }
      if (total <= 9) return { key: 'mild', label: '轻度焦虑', badge: 'badge-mild', advice: '建议开展放松训练与自助干预，必要时与专业人员沟通。' }
      if (total <= 14) return { key: 'moderate', label: '中度焦虑', badge: 'badge-moderate', advice: '建议进行专业评估与干预，心理治疗可能带来帮助。' }
      return { key: 'severe', label: '重度焦虑', badge: 'badge-severe', advice: '建议尽快就医评估，遵循医生建议进行系统治疗。' }
    }
  },

  phq2: {
    id: 'phq2',
    title: 'PHQ-2 抑郁快速筛查',
    timeframe: '过去两周',
    questions: [
      '做事时提不起劲或没有兴趣',
      '感到心情沮丧、忧郁或绝望'
    ],
    options: baseOptions,
    max: 6,
    severity: (total: number) => {
      if (total >= 3) return { key: 'screen-pos', label: '阳性筛查（建议进一步评估）', badge: 'badge-mild', advice: '建议完成 PHQ-9 以获得更全面的评估，并尽快与专业人员沟通。' }
      return { key: 'screen-neg', label: '阴性/较低风险', badge: 'badge-minimal', advice: '建议保持健康生活方式并持续关注状态，如症状持续或加重请咨询专业人员。' }
    }
  },

  dass21: {
    id: 'dass21',
    title: 'DASS-21 抑郁-焦虑-压力量表',
    timeframe: '过去一周',
    questions: [
      '我难以轻松地放松下来',
      '我口干',
      '似乎一点也无法体验到积极的情绪',
      '呼吸困难（例如：呼吸太快、无法顺畅呼吸）',
      '对任何事都提不起劲或无法感到愉悦',
      '倾向于对事情反应过度',
      '感到颤抖（例如：手发抖）',
      '难以容忍干扰我继续做事的事',
      '感到消沉与忧郁',
      '缺乏积极的期望',
      '难以耐心和放松',
      '感觉自己神经紧绷',
      '没有热情去做任何事',
      '容易烦躁',
      '感觉心跳加快（例如：心跳加速或心悸）',
      '感到害怕，似乎没有任何原因',
      '觉得生活没有意义',
      '难以开始行动去做事情',
      '容易被激怒',
      '感觉内心恐慌',
      '对一切都失去兴趣'
    ],
    options: [
      { label: '完全不符合', value: 0 },
      { label: '有时符合', value: 1 },
      { label: '经常符合', value: 2 },
      { label: '几乎总是', value: 3 }
    ],
    max: 63,
    severity: () => ({ key: 'dim', label: '维度结果', badge: 'badge-minimal', advice: '请参考下方三个维度的分级建议。' }),
    extras: (_total: number, _values: number[]) => {
      function sumIdx(arr: number[]) {
        return arr.reduce((s, i) => s + (_values[i - 1] || 0), 0) * 2
      }
      const d = sumIdx([3, 5, 10, 13, 16, 17, 21])
      const a = sumIdx([2, 4, 7, 9, 15, 19, 20])
      const s = sumIdx([1, 6, 8, 11, 12, 14, 18])
      
      function bandD(x: number) {
        if (x <= 9) return ['正常', 'badge-minimal']
        if (x <= 13) return ['轻度', 'badge-mild']
        if (x <= 20) return ['中度', 'badge-moderate']
        if (x <= 27) return ['重度', 'badge-modsev']
        return ['极重度', 'badge-severe']
      }
      function bandA(x: number) {
        if (x <= 7) return ['正常', 'badge-minimal']
        if (x <= 9) return ['轻度', 'badge-mild']
        if (x <= 14) return ['中度', 'badge-moderate']
        if (x <= 19) return ['重度', 'badge-modsev']
        return ['极重度', 'badge-severe']
      }
      function bandS(x: number) {
        if (x <= 14) return ['正常', 'badge-minimal']
        if (x <= 18) return ['轻度', 'badge-mild']
        if (x <= 25) return ['中度', 'badge-moderate']
        if (x <= 33) return ['重度', 'badge-modsev']
        return ['极重度', 'badge-severe']
      }
      
      const [dL, dB] = bandD(d)
      const [aL, aB] = bandA(a)
      const [sL, sB] = bandS(s)
      
      return `<div class="muted">DASS-21 分维度（分数按×2换算）：</div>
        <div class="severity"><span class="badge ${dB}">抑郁 ${d}</span> <span class="badge ${aB}">焦虑 ${a}</span> <span class="badge ${sB}">压力 ${s}</span></div>
        <div class="advice">抑郁：${dL}；焦虑：${aL}；压力：${sL}。如任一维度达到中度及以上，建议专业评估。</div>`
    }
  },

  audit10: {
    options: [] as Option[], // Required field, empty for this scale
    id: 'audit10',
    title: 'AUDIT-10 酒精使用障碍识别测试',
    timeframe: '过去一年',
    questions: [
      '你多久饮酒一次？',
      '在有饮酒的日子里，你通常喝多少标准杯？',
      '你有多频繁在一次场合中饮用6杯（或以上）？',
      '过去一年中，你有没有发现一旦开始饮酒就难以停止？',
      '过去一年中，因为饮酒而未能完成应做的事情（工作、学业、家庭）发生过吗？',
      '过去一年中，你是否需要早上喝一杯酒来开始一天或解宿醉？',
      '过去一年中，你是否因为饮酒而感到内疚或懊悔？',
      '过去一年中，你是否因为饮酒而记不起前一天晚上发生的事情？',
      '你是否因为饮酒而伤害过自己或他人？',
      '是否有人建议你减少饮酒或对你的饮酒表示担忧？'
    ],
    questionOptions: [
      [
        { label: '从不', value: 0 },
        { label: '每月一次或更少', value: 1 },
        { label: '每月2–4次', value: 2 },
        { label: '每周2–3次', value: 3 },
        { label: '几乎每天或每天', value: 4 }
      ],
      [
        { label: '1–2杯', value: 0 },
        { label: '3–4杯', value: 1 },
        { label: '5–6杯', value: 2 },
        { label: '7–9杯', value: 3 },
        { label: '10杯或以上', value: 4 }
      ],
      [
        { label: '从不', value: 0 },
        { label: '少于每月一次', value: 1 },
        { label: '每月一次', value: 2 },
        { label: '每周一次', value: 3 },
        { label: '每天或几乎每天', value: 4 }
      ],
      [
        { label: '从不', value: 0 },
        { label: '少于每月一次', value: 1 },
        { label: '每月一次', value: 2 },
        { label: '每周一次', value: 3 },
        { label: '每天或几乎每天', value: 4 }
      ],
      [
        { label: '从不', value: 0 },
        { label: '少于每月一次', value: 1 },
        { label: '每月一次', value: 2 },
        { label: '每周一次', value: 3 },
        { label: '每天或几乎每天', value: 4 }
      ],
      [
        { label: '从不', value: 0 },
        { label: '少于每月一次', value: 1 },
        { label: '每月一次', value: 2 },
        { label: '每周一次', value: 3 },
        { label: '每天或几乎每天', value: 4 }
      ],
      [
        { label: '从不', value: 0 },
        { label: '少于每月一次', value: 1 },
        { label: '每月一次', value: 2 },
        { label: '每周一次', value: 3 },
        { label: '每天或几乎每天', value: 4 }
      ],
      [
        { label: '从不', value: 0 },
        { label: '少于每月一次', value: 1 },
        { label: '每月一次', value: 2 },
        { label: '每周一次', value: 3 },
        { label: '每天或几乎每天', value: 4 }
      ],
      [
        { label: '没有', value: 0 },
        { label: '有，但不是在过去一年', value: 2 },
        { label: '有，而且在过去一年', value: 4 }
      ],
      [
        { label: '没有', value: 0 },
        { label: '有，但不是在过去一年', value: 2 },
        { label: '有，而且在过去一年', value: 4 }
      ]
    ],
    max: 40,
    severity: (total: number) => {
      if (total <= 7) return { key: 'low', label: '低风险', badge: 'badge-minimal', advice: '保持健康饮酒或无酒精生活方式。' }
      if (total <= 15) return { key: 'hazard', label: '危险饮酒', badge: 'badge-mild', advice: '建议减少饮酒，必要时寻求专业支持。' }
      if (total <= 19) return { key: 'harmful', label: '有害饮酒', badge: 'badge-moderate', advice: '建议专业评估与干预，制定减酒/戒酒计划。' }
      return { key: 'dependence', label: '可能的酒精依赖', badge: 'badge-severe', advice: '建议尽快就医评估并接受系统治疗与支持。' }
    },
    extras: (_total: number, _values: number[]) => '<div class="muted">提示：部分阈值可能因性别、文化与临床环境有所调整，请结合专业判断。</div>'
  },

  pss10: {
    id: 'pss10',
    title: 'PSS-10 感知压力量表',
    timeframe: '过去一个月',
    questions: [
      '在过去一个月中，你有多经常感觉无法控制重要事情？',
      '在过去一个月中，你有多经常感到紧张与压力？',
      '在过去一个月中，你有多经常感觉自己能掌控发生的事？',
      '在过去一个月中，你有多经常因为发生了意外的事情而心烦意乱？',
      '在过去一个月中，你有多经常觉得事情正按你希望的那样发展？',
      '在过去一个月中，你有多经常感觉无法应付你必须做的事？',
      '在过去一个月中，你有多经常能掌控恼人的事情？',
      '在过去一个月中，你有多经常感到你掌控一切的能力被超越？',
      '在过去一个月中，你有多经常觉得事情进展顺利？',
      '在过去一个月中，你有多经常觉得困难堆积如山，无法克服？'
    ],
    options: [
      { label: '从不', value: 0 },
      { label: '几乎从不', value: 1 },
      { label: '有时', value: 2 },
      { label: '相当经常', value: 3 },
      { label: '总是', value: 4 }
    ],
    max: 40,
    computeTotal: (values: number[]) => {
      const rev = [3, 4, 6, 7]
      let sum = 0
      for (let i = 0; i < values.length; i++) {
        const v = values[i]
        sum += rev.includes(i) ? (4 - v) : v
      }
      return sum
    },
    severity: (total: number) => {
      if (total <= 13) return { key: 'low', label: '低压力', badge: 'badge-minimal', advice: '保持良好作息与应对策略。' }
      if (total <= 26) return { key: 'moderate', label: '中等压力', badge: 'badge-mild', advice: '尝试放松训练与时间管理，必要时与专业人员沟通。' }
      return { key: 'high', label: '高压力', badge: 'badge-moderate', advice: '建议专业评估与干预，关注身心健康。' }
    }
  },

  phq15: {
    id: 'phq15',
    title: 'PHQ-15 躯体化症状自评',
    timeframe: '过去四周',
    questions: [
      '胃痛',
      '背痛',
      '手臂、腿或关节（如膝、髋）疼痛',
      '经常性头痛',
      '胸痛',
      '头晕',
      '昏厥',
      '心率快、心悸',
      '呼吸短促',
      '便秘、腹泻或两者交替',
      '恶心、胀气或消化不良',
      '疲乏或体力不支',
      '睡眠困难',
      '经期问题或月经痉挛（如适用）',
      '性方面问题'
    ],
    options: [
      { label: '完全不困扰', value: 0 },
      { label: '有一点困扰', value: 1 },
      { label: '非常困扰', value: 2 }
    ],
    max: 30,
    severity: (total: number) => {
      if (total <= 4) return { key: 'minimal', label: '最小/无', badge: 'badge-minimal', advice: '维持健康生活方式并关注变化。' }
      if (total <= 9) return { key: 'low', label: '轻度', badge: 'badge-mild', advice: '建议自我管理与必要时咨询专业人员。' }
      if (total <= 14) return { key: 'moderate', label: '中度', badge: 'badge-moderate', advice: '建议专业评估与针对性干预。' }
      return { key: 'high', label: '重度', badge: 'badge-severe', advice: '建议尽快就医评估与系统干预。' }
    }
  },

  isi: {
    id: 'isi',
    title: 'ISI 失眠严重度指数',
    timeframe: '最近两周',
    questions: [
      '入睡困难程度',
      '维持睡眠困难程度',
      '早醒问题程度',
      '对当前睡眠模式的满意度',
      '睡眠问题对日间功能的影响程度',
      '睡眠问题是否被他人注意到（损害生活质量）',
      '对睡眠问题的担心/困扰程度'
    ],
    options: [
      { label: '无', value: 0 },
      { label: '轻度', value: 1 },
      { label: '中度', value: 2 },
      { label: '重度', value: 3 },
      { label: '极重度', value: 4 }
    ],
    max: 28,
    severity: (total: number) => {
      if (total <= 7) return { key: 'none', label: '无失眠', badge: 'badge-minimal', advice: '保持良好睡眠卫生。' }
      if (total <= 14) return { key: 'mild', label: '轻度失眠', badge: 'badge-mild', advice: '建议改善睡眠习惯与放松训练。' }
      if (total <= 21) return { key: 'moderate', label: '中度失眠', badge: 'badge-moderate', advice: '建议专业评估，考虑认知行为治疗等干预。' }
      return { key: 'severe', label: '重度失眠', badge: 'badge-severe', advice: '建议尽快就医评估并进行系统治疗。' }
    }
  },

  k10: {
    id: 'k10',
    title: 'K10 心理困扰量表',
    timeframe: '过去四周',
    questions: [
      '感觉疲劳到什么程度？',
      '紧张到什么程度？',
      '如此紧张以致不能平静下来到什么程度？',
      '绝望到什么程度？',
      '感到坐立不安和烦躁到什么程度？',
      '如此烦躁以致不能静坐到什么程度？',
      '忧郁或悲伤到什么程度？',
      '觉得一切事情都是努力到什么程度？',
      '如此忧郁以致没有任何事情能使你高兴到什么程度？',
      '无用感到什么程度？'
    ],
    options: [
      { label: '从不', value: 1 },
      { label: '很少', value: 2 },
      { label: '有时', value: 3 },
      { label: '经常', value: 4 },
      { label: '总是', value: 5 }
    ],
    max: 50,
    severity: (total: number) => {
      if (total <= 19) return { key: 'well', label: '较低困扰', badge: 'badge-minimal', advice: '继续保持与自我照顾。' }
      if (total <= 24) return { key: 'mild', label: '轻度困扰', badge: 'badge-mild', advice: '建议自助干预与关注变化。' }
      if (total <= 29) return { key: 'moderate', label: '中度困扰', badge: 'badge-moderate', advice: '建议专业评估与干预。' }
      return { key: 'severe', label: '重度困扰', badge: 'badge-severe', advice: '建议尽快就医评估与系统干预。' }
    }
  },

  who5: {
    id: 'who5',
    title: 'WHO-5 主观幸福感指数',
    timeframe: '过去两周',
    questions: [
      '我感到情绪愉快，精神良好',
      '我感到平静、放松',
      '我感到精力充沛、充满活力',
      '我起床后感觉神清气爽',
      '我的日常生活充满兴趣'
    ],
    options: [
      { label: '从不', value: 0 },
      { label: '很少', value: 1 },
      { label: '有时', value: 2 },
      { label: '经常', value: 3 },
      { label: '大部分时间', value: 4 },
      { label: '一直如此', value: 5 }
    ],
    max: 25,
    severity: (total: number) => {
      const pct = total * 4
      if (pct >= 70) return { key: 'good', label: '幸福感良好', badge: 'badge-minimal', advice: '继续保持良好的生活方式与社交联系。' }
      if (pct >= 51) return { key: 'mild', label: '轻度下降', badge: 'badge-mild', advice: '建议自助干预（运动、睡眠、社交、兴趣），并关注后续变化。' }
      if (pct >= 29) return { key: 'moderate', label: '中度下降', badge: 'badge-moderate', advice: '建议与专业人员沟通，评估负性情绪的影响并获得针对性建议。' }
      return { key: 'marked', label: '显著下降', badge: 'badge-severe', advice: '建议尽快进行专业评估，必要时接受系统干预与支持。' }
    },
    extras: (total: number) => {
      const pct = total * 4
      return `<div class="muted">WHO-5 百分比：<strong>${pct}%</strong>（原始分×4）。一般认为 ≤50% 表示幸福感下降，需要关注；≤28% 建议进一步评估。</div>`
    }
  },

  gad2: {
    id: 'gad2',
    title: 'GAD-2 焦虑快速筛查',
    timeframe: '过去两周',
    questions: [
      '感到紧张、焦虑或坐立不安',
      '无法停止或控制担忧'
    ],
    options: baseOptions,
    max: 6,
    severity: (total: number) => {
      if (total >= 3) return { key: 'screen-pos', label: '阳性筛查（建议进一步评估）', badge: 'badge-mild', advice: '建议完成 GAD-7 或寻求专业评估，以获取更全面的建议。' }
      return { key: 'screen-neg', label: '阴性/较低风险', badge: 'badge-minimal', advice: '建议保持健康生活方式并持续关注状态，如症状持续或加重请咨询专业人员。' }
    }
  },

  auditc: {
    options: [] as Option[], // Required field, empty for this scale
    id: 'auditc',
    title: 'AUDIT-C 酒精使用筛查',
    timeframe: '过去一年',
    questions: [
      '你多久饮酒一次？',
      '在有饮酒的日子里，你通常喝多少标准杯？（1标准杯≈啤酒330ml或葡萄酒100ml或烈酒30ml）',
      '你有多频繁在一次场合中饮用6杯（或以上）？'
    ],
    questionOptions: [
      [
        { label: '从不', value: 0 },
        { label: '每月一次或更少', value: 1 },
        { label: '每月2–4次', value: 2 },
        { label: '每周2–3次', value: 3 },
        { label: '几乎每天或每天', value: 4 }
      ],
      [
        { label: '1–2杯', value: 0 },
        { label: '3–4杯', value: 1 },
        { label: '5–6杯', value: 2 },
        { label: '7–9杯', value: 3 },
        { label: '10杯或以上', value: 4 }
      ],
      [
        { label: '从不', value: 0 },
        { label: '少于每月一次', value: 1 },
        { label: '每月一次', value: 2 },
        { label: '每周一次', value: 3 },
        { label: '每天或几乎每天', value: 4 }
      ]
    ],
    max: 12,
    severity: (total: number) => {
      if (total <= 3) return { key: 'low', label: '低风险', badge: 'badge-minimal', advice: '维持健康饮酒或无酒精生活方式。' }
      if (total <= 5) return { key: 'hazard', label: '可能的危险饮酒', badge: 'badge-mild', advice: '建议减少饮酒量与频率，如有困难可咨询专业人员。' }
      if (total <= 7) return { key: 'high', label: '高风险', badge: 'badge-moderate', advice: '建议专业评估并获得个性化减酒/戒酒计划。' }
      return { key: 'probable', label: '可能的酒精使用障碍', badge: 'badge-severe', advice: '建议尽快就医评估并接受系统干预与支持。' }
    },
    extras: () => '<div class="muted">注：常见阳性界值为男性≥4、女性≥3，但需结合个人情况与专业判断。</div>'
  }
}