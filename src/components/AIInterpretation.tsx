/**
 * AI 解读结果组件
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Sparkles, AlertTriangle, Lightbulb, ChevronDown, ChevronUp,
  Loader2, RefreshCw, Brain
} from 'lucide-react'
import { getLocalInterpretation, type InterpretationResult } from '../services/aiInterpretation'
import type { AssessmentResult } from '../stores/assessmentStore'
import type { Scale } from '../data/scales'

interface AIInterpretationProps {
  result: AssessmentResult
  scale: Scale
  severityKey: string
}

export default function AIInterpretation({ result, scale, severityKey }: AIInterpretationProps) {
  const [interpretation, setInterpretation] = useState<InterpretationResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [expanded, setExpanded] = useState(true)

  // 获取解读
  const fetchInterpretation = async () => {
    setLoading(true)
    try {
      // 目前使用本地解读，后续可以扩展为AI解读
      const localResult = getLocalInterpretation(scale.id, severityKey, result)
      setInterpretation(localResult)
    } catch (error) {
      console.error('获取解读失败:', error)
    } finally {
      setLoading(false)
    }
  }

  // 首次自动获取
  if (!interpretation && !loading) {
    fetchInterpretation()
  }

  return (
    <div className="bg-gradient-to-br from-primary-50 to-indigo-50 dark:from-primary-900/20 dark:to-indigo-900/20 rounded-2xl overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-5 flex items-center justify-between hover:bg-white/30 dark:hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-xl">
            <Brain className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-gray-900 dark:text-white">智能解读</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              基于评估结果的个性化分析
            </p>
          </div>
        </div>
        {expanded ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 space-y-4">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-primary-600" />
                  <span className="ml-2 text-gray-500">正在分析...</span>
                </div>
              ) : interpretation ? (
                <>
                  {/* Summary */}
                  <div className="bg-white/60 dark:bg-gray-800/60 rounded-xl p-4">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {interpretation.summary}
                    </p>
                  </div>

                  {/* Warning */}
                  {interpretation.warning && (
                    <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                      <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-amber-800 dark:text-amber-300">
                        {interpretation.warning}
                      </p>
                    </div>
                  )}

                  {/* Insights */}
                  {interpretation.insights.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-primary-600" />
                        关键洞察
                      </h4>
                      <ul className="space-y-2">
                        {interpretation.insights.map((insight, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-2 flex-shrink-0" />
                            {insight}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Suggestions */}
                  {interpretation.suggestions.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                        <Lightbulb className="w-4 h-4 text-amber-500" />
                        改善建议
                      </h4>
                      <ul className="space-y-2">
                        {interpretation.suggestions.map((suggestion, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <span className="w-5 h-5 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-full flex items-center justify-center text-xs flex-shrink-0">
                              {i + 1}
                            </span>
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Refresh Button */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                    <span className="text-xs text-gray-400">
                      本地解读 · {new Date(interpretation.timestamp).toLocaleTimeString('zh-CN')}
                    </span>
                    <button
                      onClick={fetchInterpretation}
                      className="flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700"
                    >
                      <RefreshCw className="w-3 h-3" />
                      刷新
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  无法获取解读
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// 简化版解读卡片
export function InterpretationCard({ 
  advice 
}: { 
  advice: string 
}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-primary-50 dark:bg-primary-900/20 rounded-xl">
          <Brain className="w-6 h-6 text-primary-600 dark:text-primary-400" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
            结果解读
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            {advice}
          </p>
        </div>
      </div>
    </div>
  )
}
