import { Link } from 'react-router-dom'
import { scales } from '../data/scales'
import {
  ArrowRight,
  BarChart3,
  Brain,
  CheckCircle2,
  Clock3,
  Compass,
  Heart,
  Info,
  ListChecks,
  PenLine,
  Shield,
  Sparkles
} from 'lucide-react'

const featuredScale = scales.phq9

export default function Home() {
  const steps = [
    {
      title: '选择量表',
      desc: '根据当前关注点选择抑郁、焦虑、压力或睡眠等评估量表。',
      icon: Compass
    },
    {
      title: '专注作答',
      desc: '保持安静、诚实回答，通常耗时 3-8 分钟即可完成。',
      icon: PenLine
    },
    {
      title: '查看结果',
      desc: '即时生成分数、严重程度及行动建议，帮助理解当下状态。',
      icon: BarChart3
    },
    {
      title: '记录与关怀',
      desc: '登录后可保存记录，跟踪变化趋势，并及时寻求专业帮助。',
      icon: Heart
    }
  ]

  const highlights = [
    {
      title: '本地隐私优先',
      desc: '回答与历史均保存在浏览器本地，不会上传到服务器。',
      icon: Shield
    },
    {
      title: '一键快速开始',
      desc: '推荐从 PHQ-9 入手，适合绝大多数抑郁相关自评场景。',
      icon: Sparkles
    },
    {
      title: '可视化结果',
      desc: '配套严重程度标签与建议，帮助下一步行动决策。',
      icon: CheckCircle2
    },
    {
      title: '随时回溯',
      desc: '历史记录支持筛选、导出，便于与专业人员沟通。',
      icon: Clock3
    }
  ]

  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary-600 via-indigo-500 to-blue-500 text-white p-8 shadow-2xl">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.4),transparent_30%)]" />
        <div className="absolute inset-y-0 right-0 w-64 bg-white/10 blur-3xl" />
        <div className="relative space-y-6">
          <div className="flex flex-wrap items-center gap-3 text-xs font-medium uppercase tracking-wide">
            <span className="px-3 py-1 rounded-full bg-white/20 border border-white/30">新手友好</span>
            <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20">全程本地保存</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/15 rounded-2xl backdrop-blur">
              <Brain className="w-10 h-10" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold leading-tight">
              心理健康自评量表中心
            </h1>
          </div>

          <p className="text-lg md:text-xl text-white/90 max-w-3xl">
            从选表、作答到查看结果，一站式清晰流程，帮助您快速、安心地完成自我评估。
            结果仅供参考，不构成医疗诊断或治疗建议。
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              to={`/assessment/${featuredScale.id}`}
              className="inline-flex items-center gap-2 px-5 py-3 bg-white text-primary-700 font-semibold rounded-xl shadow-lg hover:-translate-y-0.5 transition-transform"
            >
              立即开始 {featuredScale.title.split(' ')[0]}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#guide"
              className="inline-flex items-center gap-2 px-4 py-3 border border-white/40 text-white font-medium rounded-xl hover:bg-white/10 transition-colors"
            >
              查看使用路径
            </a>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            {[
              { title: '准备时间', desc: '约 5-8 分钟', icon: Clock3 },
              { title: '操作步骤', desc: '选择量表 · 作答 · 查看结果', icon: ListChecks },
              { title: '隐私保护', desc: '数据仅存储在本地设备', icon: Shield },
              { title: '结果建议', desc: '配套行动提示与关怀提醒', icon: Sparkles }
            ].map((item) => (
              <div key={item.title} className="flex items-center gap-3 bg-white/10 rounded-2xl px-3 py-3 backdrop-blur">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <item.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-white/80">{item.title}</p>
                  <p className="text-sm font-semibold">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Flow & Quick Start */}
      <div id="guide" className="grid grid-cols-1 lg:grid-cols-[1.35fr_1fr] gap-6">
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-primary-100 dark:bg-primary-900/20">
              <Sparkles className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">从开始到结果</p>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">使用流程指引</h2>
            </div>
          </div>

          <div className="space-y-4">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className="flex gap-4 p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-800/40"
              >
                <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-300 font-semibold">
                  {index + 1}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <step.icon className="w-4 h-4 text-primary-500" />
                    <p className="font-semibold text-gray-900 dark:text-white">{step.title}</p>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-primary-950 border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-primary-100/70 to-transparent dark:from-primary-900/30" />
          <div className="relative space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary-600 text-white rounded-xl shadow-lg">
                <Brain className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">推荐起点</p>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">快速开始</h3>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{featuredScale.title}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">适合抑郁相关自我筛查，{featuredScale.questions.length} 道题，{featuredScale.timeframe}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">完成后将提供严重程度标签及后续行动建议。</p>
            </div>

            <Link
              to={`/assessment/${featuredScale.id}`}
              className="inline-flex items-center justify-center w-full px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-colors"
            >
              立即开始评估
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>

            <div className="text-xs text-gray-500 dark:text-gray-400 bg-white/60 dark:bg-gray-800/60 rounded-lg p-3 border border-gray-100 dark:border-gray-800">
              <p>小贴士：</p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>找一个不受打扰的时间与环境，保持放松。</li>
                <li>如有安全风险或持续困扰，请尽快联系专业人员。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Highlights */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">体验亮点</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">让每一步都简单明了</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {highlights.map((item) => (
            <div key={item.title} className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800">
              <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-300 flex items-center justify-center mb-3">
                <item.icon className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{item.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Scales Grid */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">可用量表</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">根据关注点选择合适量表，随时可切换</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Sparkles className="w-4 h-4" />
            <span>支持抑郁、焦虑、压力、睡眠等多维度自评</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.values(scales).map((scale) => (
            <div
              key={scale.id}
              className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm hover:shadow-lg transition-shadow"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{scale.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">时间范围：{scale.timeframe}</p>
                  </div>
                  <div className="px-3 py-1 rounded-full text-xs font-medium bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">
                    {scale.questions.length} 题
                  </div>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  {getScaleDescription(scale.id)}
                </p>

                <div className="flex flex-wrap gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <span className="px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800">快速评估</span>
                  <span className="px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800">本地保存</span>
                </div>

                <Link
                  to={`/assessment/${scale.id}`}
                  className="inline-flex items-center justify-center w-full px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl transition-colors"
                >
                  开始评估
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reminder */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-6 flex gap-3">
        <div className="p-3 rounded-xl bg-white/80 dark:bg-amber-900/30 text-amber-700 dark:text-amber-200">
          <Info className="w-5 h-5" />
        </div>
        <div className="space-y-2 text-sm">
          <h3 className="text-base font-semibold text-amber-800 dark:text-amber-100">使用提醒</h3>
          <ul className="space-y-1 text-amber-800 dark:text-amber-100">
            <li>• 本工具用于健康教育与自我筛查，不替代专业诊断或治疗。</li>
            <li>• 如症状明显、持续恶化、影响生活功能或存在安全风险，请尽快联系专业人员。</li>
            <li>• 如需分享结果，请使用导出功能并在安全场景下进行。</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

function getScaleDescription(scaleId: string): string {
  const descriptions: Record<string, string> = {
    phq9: '国际广泛使用的抑郁症筛查量表，适合初步自我筛查',
    gad7: '广泛性焦虑障碍筛查量表，评估焦虑症状严重程度',
    phq2: '抑郁快速筛查工具，用于初步风险评估',
    dass21: '评估抑郁、焦虑和压力三个维度的综合量表',
    audit10: '酒精使用障碍识别测试，评估酒精使用相关问题',
    pss10: '评估个体感知到的压力水平',
    phq15: '评估躯体化症状的严重程度',
    isi: '失眠严重程度指数，评估睡眠问题',
    k10: '心理困扰量表，评估心理健康状况',
    who5: '主观幸福感指数，评估积极心理健康状态',
    gad2: '焦虑快速筛查工具，用于初步风险评估',
    auditc: '酒精使用筛查工具，快速评估饮酒风险'
  }
  return descriptions[scaleId] || '专业心理健康评估工具'
}
