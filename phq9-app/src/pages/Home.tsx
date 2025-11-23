import { scales } from '../data/scales'
import { BarChart3, Shield, Heart, Brain, History } from 'lucide-react'
import { motion } from 'framer-motion'
import ScaleCard from '../components/ScaleCard'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export default function Home() {
  return (
    <div className="space-y-16 pb-12">
      {/* Hero Section */}
      <section className="relative text-center space-y-8 py-12 md:py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-primary-50/50 to-transparent dark:from-primary-900/10 pointer-events-none -z-10" />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex justify-center mb-6"
        >
          <div className="p-5 bg-white dark:bg-gray-800 rounded-2xl shadow-lg ring-1 ring-black/5">
            <Brain className="w-16 h-16 text-primary-600 dark:text-primary-400" />
          </div>
        </motion.div>
        
        <div className="space-y-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white tracking-tight"
          >
            心理健康<span className="text-primary-600 dark:text-primary-400">自评中心</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed"
          >
            专业的心理健康自评工具，帮助您了解内心状态。<br className="hidden sm:block" />
            <span className="text-base opacity-80">所有数据仅存储在本地，严格保护隐私。</span>
          </motion.p>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap justify-center gap-4 md:gap-8"
        >
          {[
            { icon: Shield, text: '隐私保护' },
            { icon: Heart, text: '专业可靠' },
            { icon: BarChart3, text: '科学评估' },
          ].map((feat, i) => (
            <div
              key={i}
              className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 bg-white/50 dark:bg-white/5 px-4 py-2 rounded-full backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50"
            >
              <feat.icon className="w-4 h-4" />
              <span>{feat.text}</span>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Important Notice */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-3xl mx-auto bg-amber-50/80 dark:bg-amber-900/20 border border-amber-200/60 dark:border-amber-800/60 rounded-xl p-6 backdrop-blur-sm"
      >
        <div className="flex items-start gap-4">
          <div className="p-2 bg-amber-100 dark:bg-amber-900/40 rounded-lg">
            <Shield className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-amber-900 dark:text-amber-100">重要免责声明</h3>
            <ul className="space-y-1.5 text-sm text-amber-800 dark:text-amber-200/80 leading-relaxed">
              <li className="flex gap-2">
                <span className="select-none">•</span>
                <span>本工具仅用于健康教育与自我筛查，不能替代专业临床诊断。</span>
              </li>
              <li className="flex gap-2">
                <span className="select-none">•</span>
                <span>如症状明显、持续恶化或存在自伤风险，请立即寻求专业医生帮助。</span>
              </li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Scales Grid */}
      <div className="space-y-10">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <div className="h-8 w-1 bg-primary-600 rounded-full" />
            精选量表
          </h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            共 {Object.keys(scales).length} 个量表
          </span>
        </div>
        
        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {Object.values(scales).map((scale) => (
            <motion.div key={scale.id} variants={item}>
              <ScaleCard 
                scale={scale} 
                description={getScaleDescription(scale.id)}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Features Grid */}
      <section className="py-12 border-t border-gray-100 dark:border-gray-800">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-12">
          平台特色
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: BarChart3,
              color: 'text-blue-600 dark:text-blue-400',
              bg: 'bg-blue-50 dark:bg-blue-900/20',
              title: '多维度评估',
              desc: '涵盖抑郁、焦虑、压力、睡眠等多个心理健康维度',
            },
            {
              icon: Shield,
              color: 'text-green-600 dark:text-green-400',
              bg: 'bg-green-50 dark:bg-green-900/20',
              title: '隐私至上',
              desc: '所有测评数据仅保存在您的本地浏览器中',
            },
            {
              icon: History,
              color: 'text-purple-600 dark:text-purple-400',
              bg: 'bg-purple-50 dark:bg-purple-900/20',
              title: '历程追踪',
              desc: '自动记录测评历史，可视化展示心理状态变化',
            },
            {
              icon: Brain,
              color: 'text-rose-600 dark:text-rose-400',
              bg: 'bg-rose-50 dark:bg-rose-900/20',
              title: '专业建议',
              desc: '基于测评结果提供针对性的自助建议与指导',
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="text-center space-y-4 group p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <div
                className={`w-14 h-14 mx-auto rounded-2xl flex items-center justify-center ${feature.bg} transition-transform group-hover:scale-110 duration-300`}
              >
                <feature.icon className={`w-7 h-7 ${feature.color}`} />
              </div>
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

function getScaleDescription(scaleId: string): string {
  const descriptions: Record<string, string> = {
    phq9: '国际通用抑郁症筛查量表，适用于快速评估近期情绪状态与抑郁风险。',
    gad7: '专注于焦虑症状的评估工具，帮助您了解当前的紧张与担忧程度。',
    phq2: '两分钟快速抑郁筛查，用于初步排查是否存在情绪困扰。',
    dass21: '综合性评估工具，同时检测抑郁、焦虑和压力三个维度的水平。',
    audit10: '世界卫生组织推荐的酒精使用筛查工具，评估饮酒习惯与潜在风险。',
    pss10: '评估您对生活压力的感知程度，反映应对生活挑战的信心。',
    phq15: '关注身体不适症状，了解心理压力在躯体层面的表现。',
    isi: '专业的失眠严重程度评估，分析睡眠质量及其对生活的影响。',
    k10: '广泛使用的心理困扰量表，评估整体心理健康状况与痛苦程度。',
    who5: '关注积极心理状态，评估您的主观幸福感与生活质量。',
    gad2: '快速焦虑筛查工具，用于初步评估焦虑倾向。',
    auditc: '简版酒精筛查，快速了解饮酒行为是否存在健康风险。',
  }
  return descriptions[scaleId] || '专业心理健康评估工具，助您了解内心世界。'
}
