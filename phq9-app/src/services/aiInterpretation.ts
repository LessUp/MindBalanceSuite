/**
 * AI 大模型结果解读服务
 * 支持多种大模型API接入
 */

import type { AssessmentResult } from '../stores/assessmentStore'
import type { Scale } from '../data/scales'

export interface AIConfig {
  provider: 'openai' | 'anthropic' | 'deepseek' | 'qwen' | 'local'
  apiKey?: string
  baseUrl?: string
  model?: string
}

export interface InterpretationResult {
  summary: string
  insights: string[]
  suggestions: string[]
  warning?: string
  timestamp: number
}

// 本地解读模板（无需API）
const localInterpretations: Record<string, Record<string, InterpretationResult>> = {
  phq9: {
    minimal: {
      summary: '您当前的抑郁症状处于最低水平，整体心理状态良好。',
      insights: [
        '您能够保持积极的生活态度',
        '日常活动和社交功能正常',
        '睡眠和食欲相对稳定'
      ],
      suggestions: [
        '继续保持规律的作息和运动习惯',
        '维持健康的社交关系网络',
        '定期进行自我心理状态检查',
        '学习压力管理技巧作为预防'
      ],
      timestamp: Date.now()
    },
    mild: {
      summary: '您目前存在轻度的抑郁倾向，这是常见的情绪波动，通过适当调整可以改善。',
      insights: [
        '可能在某些方面感到提不起兴趣',
        '情绪有时会低落，但仍可控制',
        '日常功能基本正常，但可能感到疲惫'
      ],
      suggestions: [
        '增加户外活动和体育锻炼',
        '与亲友分享您的感受',
        '尝试写日记记录情绪变化',
        '保持规律作息，特别是睡眠',
        '如果症状持续2周以上，建议咨询专业人员'
      ],
      timestamp: Date.now()
    },
    moderate: {
      summary: '您的评估结果显示中度抑郁症状，建议认真对待并考虑寻求专业帮助。',
      insights: [
        '情绪低落可能已经影响日常生活',
        '可能出现睡眠或食欲的明显变化',
        '注意力和做事动力可能下降',
        '自我价值感可能受到影响'
      ],
      suggestions: [
        '强烈建议预约心理咨询或就医',
        '不要独自承担，向信任的人寻求支持',
        '保持基本的日常作息结构',
        '避免做重大决定',
        '进行放松训练如深呼吸、冥想'
      ],
      warning: '如果出现自伤想法，请立即寻求帮助。',
      timestamp: Date.now()
    },
    modsev: {
      summary: '您的评估结果显示中重度抑郁症状，需要尽快寻求专业心理/医学帮助。',
      insights: [
        '抑郁症状可能严重影响工作和生活',
        '可能感到持续的疲惫和无望',
        '社交和日常活动可能明显减少',
        '需要专业的评估和干预'
      ],
      suggestions: [
        '请尽快预约精神科或心理科就诊',
        '告知家人或朋友您的状况',
        '不要停止服用任何现有药物（如有）',
        '保持基本的自我照顾',
        '建立安全计划'
      ],
      warning: '请务必寻求专业帮助。如有自伤或自杀想法，请立即拨打心理援助热线或前往急诊。',
      timestamp: Date.now()
    },
    severe: {
      summary: '您的评估结果显示重度抑郁症状，这是需要立即关注的紧急情况。',
      insights: [
        '症状可能严重影响您的日常功能',
        '可能感到极度的无望和绝望',
        '自我照顾能力可能受到严重影响'
      ],
      suggestions: [
        '请立即寻求专业医疗帮助',
        '告知家人或可信赖的人',
        '不要独处',
        '拨打心理援助热线获得即时支持'
      ],
      warning: '这是紧急情况。如有任何自伤想法，请立即拨打急救电话或前往最近的急诊科。生命热线：400-161-9995',
      timestamp: Date.now()
    }
  },
  gad7: {
    minimal: {
      summary: '您当前的焦虑水平较低，心理状态相对平稳。',
      insights: [
        '您能够较好地管理日常压力',
        '担忧和紧张感在正常范围内',
        '睡眠和专注力基本正常'
      ],
      suggestions: [
        '继续保持健康的应对方式',
        '定期进行放松活动',
        '保持运动习惯',
        '限制咖啡因摄入'
      ],
      timestamp: Date.now()
    },
    mild: {
      summary: '您存在轻度焦虑症状，这是可以通过自我调节改善的。',
      insights: [
        '可能偶尔感到担忧难以控制',
        '可能有轻微的紧张或坐立不安',
        '睡眠可能偶尔受到影响'
      ],
      suggestions: [
        '学习并练习放松技术（如深呼吸、渐进肌肉放松）',
        '规律运动，每周至少150分钟',
        '限制社交媒体和新闻的浏览时间',
        '练习正念冥想',
        '如症状持续，可考虑咨询专业人员'
      ],
      timestamp: Date.now()
    },
    moderate: {
      summary: '您的焦虑水平处于中度，建议采取积极措施并考虑专业帮助。',
      insights: [
        '担忧和紧张可能影响日常生活',
        '可能难以放松和入睡',
        '可能出现身体症状如心悸、出汗'
      ],
      suggestions: [
        '建议咨询心理专业人员',
        '每天固定时间练习放松技术',
        '减少刺激物（咖啡、酒精）',
        '建立规律的日常作息',
        '学习认知行为技术识别焦虑想法'
      ],
      timestamp: Date.now()
    },
    severe: {
      summary: '您的焦虑水平较高，建议尽快寻求专业帮助。',
      insights: [
        '焦虑可能严重影响工作和社交',
        '可能伴有明显的身体症状',
        '日常功能可能受到明显影响'
      ],
      suggestions: [
        '请尽快预约心理咨询或精神科就诊',
        '告知家人您的状况',
        '在等待就诊期间，练习简单的呼吸技术',
        '避免做重大决定',
        '认知行为治疗(CBT)对焦虑有很好的效果'
      ],
      warning: '如果焦虑伴随恐慌发作或严重影响日常生活，请尽快就医。',
      timestamp: Date.now()
    }
  }
}

// 生成本地解读
export function getLocalInterpretation(
  scaleId: string,
  severityKey: string,
  result: AssessmentResult
): InterpretationResult {
  const scaleInterpretations = localInterpretations[scaleId]
  if (scaleInterpretations && scaleInterpretations[severityKey]) {
    return { ...scaleInterpretations[severityKey], timestamp: Date.now() }
  }
  
  // 默认解读
  return {
    summary: `您在 ${result.scaleTitle} 的得分为 ${result.total}/${result.max}，结果为"${result.label}"。`,
    insights: [
      '这个评估结果反映了您当前的心理状态',
      '建议结合实际情况理解这个结果',
      '定期评估可以帮助您追踪变化'
    ],
    suggestions: [
      '保持健康的生活方式',
      '如有需要，寻求专业支持',
      '与信任的人分享您的感受'
    ],
    timestamp: Date.now()
  }
}

// AI API 调用（需要配置API密钥）
export async function getAIInterpretation(
  config: AIConfig,
  result: AssessmentResult,
  scale: Scale
): Promise<InterpretationResult> {
  if (!config.apiKey) {
    throw new Error('需要配置API密钥')
  }

  const prompt = buildPrompt(result, scale)
  
  try {
    let response: string
    
    switch (config.provider) {
      case 'openai':
        response = await callOpenAI(config, prompt)
        break
      case 'deepseek':
        response = await callDeepSeek(config, prompt)
        break
      case 'qwen':
        response = await callQwen(config, prompt)
        break
      default:
        throw new Error(`不支持的AI提供商: ${config.provider}`)
    }
    
    return parseAIResponse(response)
  } catch (error) {
    console.error('AI解读失败:', error)
    // 降级到本地解读
    const severity = scale.severity(result.total, result.values)
    return getLocalInterpretation(scale.id, severity.key, result)
  }
}

function buildPrompt(result: AssessmentResult, scale: Scale): string {
  return `作为心理健康专家，请基于以下心理评估结果提供专业但温和的解读。

评估量表：${scale.title}
评估时间框架：${scale.timeframe}
总分：${result.total}/${result.max}
结果分级：${result.label}

请提供：
1. 一段简洁的总结（2-3句话）
2. 3-4条关键洞察
3. 4-5条具体的改善建议
4. 如果需要，提供安全警告

注意：
- 语气温和、支持性，避免过度医学化
- 强调这只是筛查工具，不是诊断
- 鼓励寻求专业帮助而不是制造恐慌
- 使用简体中文回复

请以JSON格式返回：
{
  "summary": "总结",
  "insights": ["洞察1", "洞察2"],
  "suggestions": ["建议1", "建议2"],
  "warning": "警告（可选）"
}`
}

async function callOpenAI(config: AIConfig, prompt: string): Promise<string> {
  const response = await fetch(config.baseUrl || 'https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.apiKey}`
    },
    body: JSON.stringify({
      model: config.model || 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7
    })
  })
  
  const data = await response.json()
  return data.choices[0].message.content
}

async function callDeepSeek(config: AIConfig, prompt: string): Promise<string> {
  const response = await fetch(config.baseUrl || 'https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.apiKey}`
    },
    body: JSON.stringify({
      model: config.model || 'deepseek-chat',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7
    })
  })
  
  const data = await response.json()
  return data.choices[0].message.content
}

async function callQwen(config: AIConfig, prompt: string): Promise<string> {
  const response = await fetch(config.baseUrl || 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.apiKey}`
    },
    body: JSON.stringify({
      model: config.model || 'qwen-turbo',
      input: { messages: [{ role: 'user', content: prompt }] }
    })
  })
  
  const data = await response.json()
  return data.output.text
}

function parseAIResponse(response: string): InterpretationResult {
  try {
    // 尝试提取JSON
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0])
      return {
        summary: parsed.summary || '',
        insights: parsed.insights || [],
        suggestions: parsed.suggestions || [],
        warning: parsed.warning,
        timestamp: Date.now()
      }
    }
  } catch (e) {
    console.error('解析AI响应失败:', e)
  }
  
  // 解析失败时返回原始文本
  return {
    summary: response,
    insights: [],
    suggestions: [],
    timestamp: Date.now()
  }
}
