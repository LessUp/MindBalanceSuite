/**
 * 科普知识库页面
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  BookOpen, Search, ChevronRight, Lightbulb, 
  Heart, Brain, Moon, Sparkles, ArrowLeft
} from 'lucide-react'
import { knowledgeArticles, interventionTips } from '../data/knowledgeBase'
import type { KnowledgeArticle, InterventionTip } from '../data/knowledgeBase'

type Tab = 'articles' | 'tips'

const categoryIcons: Record<string, typeof Heart> = {
  '抑郁': Heart,
  '焦虑': Brain,
  '压力': Sparkles,
  '睡眠': Moon,
  '正念': Sparkles
}

const categoryColors: Record<string, string> = {
  '抑郁': 'text-rose-500 bg-rose-50 dark:bg-rose-900/20',
  '焦虑': 'text-amber-500 bg-amber-50 dark:bg-amber-900/20',
  '压力': 'text-purple-500 bg-purple-50 dark:bg-purple-900/20',
  '睡眠': 'text-indigo-500 bg-indigo-50 dark:bg-indigo-900/20',
  '正念': 'text-teal-500 bg-teal-50 dark:bg-teal-900/20'
}

export default function Knowledge() {
  const [tab, setTab] = useState<Tab>('articles')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedArticle, setSelectedArticle] = useState<KnowledgeArticle | null>(null)
  const [selectedTip, setSelectedTip] = useState<InterventionTip | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const categories = Array.from(new Set(knowledgeArticles.map(a => a.category)))
  const tipCategories = Array.from(new Set(interventionTips.map(t => t.category)))

  const filteredArticles = knowledgeArticles.filter(article => {
    const matchesSearch = article.title.includes(searchQuery) || 
                         article.summary.includes(searchQuery)
    const matchesCategory = !selectedCategory || article.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const filteredTips = interventionTips.filter(tip => {
    const matchesSearch = tip.title.includes(searchQuery) || 
                         tip.description.includes(searchQuery)
    const matchesCategory = !selectedCategory || tip.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-8 pb-12">
      <AnimatePresence mode="wait">
        {selectedArticle ? (
          <ArticleDetail 
            key="article-detail"
            article={selectedArticle} 
            onBack={() => setSelectedArticle(null)} 
          />
        ) : selectedTip ? (
          <TipDetail 
            key="tip-detail"
            tip={selectedTip} 
            onBack={() => setSelectedTip(null)} 
          />
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-8"
          >
            {/* Header */}
            <div className="text-center space-y-4">
              <div className="inline-flex p-4 bg-gradient-to-br from-primary-100 to-primary-50 dark:from-primary-900/30 dark:to-primary-800/20 rounded-2xl">
                <BookOpen className="w-12 h-12 text-primary-600 dark:text-primary-400" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">心理科普</h1>
              <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                基于循证心理学的科普知识与实用技巧
              </p>
            </div>

            {/* Search */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索文章或技巧..."
                className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Tabs */}
            <div className="flex justify-center gap-2">
              <button
                onClick={() => setTab('articles')}
                className={`px-6 py-2 rounded-full transition-colors ${
                  tab === 'articles'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                }`}
              >
                科普文章
              </button>
              <button
                onClick={() => setTab('tips')}
                className={`px-6 py-2 rounded-full transition-colors ${
                  tab === 'tips'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                }`}
              >
                实用技巧
              </button>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
                  !selectedCategory
                    ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                }`}
              >
                全部
              </button>
              {(tab === 'articles' ? categories : tipCategories).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
                    selectedCategory === cat
                      ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Content */}
            {tab === 'articles' ? (
              <div className="grid gap-4 md:grid-cols-2">
                {filteredArticles.map((article) => {
                  const Icon = categoryIcons[article.category] || BookOpen
                  const colorClass = categoryColors[article.category] || 'text-gray-500 bg-gray-50'
                  
                  return (
                    <motion.button
                      key={article.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedArticle(article)}
                      className="bg-white dark:bg-gray-800 rounded-xl p-5 text-left shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all"
                    >
                      <div className="flex items-start gap-4">
                        <div className={`p-2 rounded-lg ${colorClass}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                              {article.title}
                            </h3>
                            <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                            {article.summary}
                          </p>
                          <span className={`inline-block mt-2 text-xs px-2 py-0.5 rounded-full ${colorClass}`}>
                            {article.category}
                          </span>
                        </div>
                      </div>
                    </motion.button>
                  )
                })}
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {filteredTips.map((tip) => (
                  <motion.button
                    key={tip.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedTip(tip)}
                    className="bg-white dark:bg-gray-800 rounded-xl p-5 text-left shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-500">
                        <Lightbulb className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                            {tip.title}
                          </h3>
                          <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                          {tip.description}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                            {tip.category}
                          </span>
                          <span className="text-xs text-gray-500">
                            {tip.duration}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function ArticleDetail({ article, onBack }: { article: KnowledgeArticle; onBack: () => void }) {
  const Icon = categoryIcons[article.category] || BookOpen
  const colorClass = categoryColors[article.category] || 'text-gray-500 bg-gray-50'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <button onClick={onBack} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
        <ArrowLeft className="w-5 h-5" />
        返回列表
      </button>

      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 dark:border-gray-700">
        {/* Header */}
        <div className="flex items-start gap-4 mb-6">
          <div className={`p-3 rounded-xl ${colorClass}`}>
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <span className={`inline-block text-xs px-2 py-0.5 rounded-full ${colorClass} mb-2`}>
              {article.category}
            </span>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {article.title}
            </h1>
          </div>
        </div>

        {/* Summary */}
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-6 pb-6 border-b border-gray-100 dark:border-gray-700">
          {article.summary}
        </p>

        {/* Content */}
        <div className="prose dark:prose-invert max-w-none mb-8">
          {article.content.split('\n\n').map((paragraph, i) => {
            if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
              return (
                <h3 key={i} className="text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-3">
                  {paragraph.replace(/\*\*/g, '')}
                </h3>
              )
            }
            if (paragraph.startsWith('- ')) {
              return (
                <ul key={i} className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                  {paragraph.split('\n').map((item, j) => (
                    <li key={j}>{item.replace('- ', '')}</li>
                  ))}
                </ul>
              )
            }
            return (
              <p key={i} className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {paragraph}
              </p>
            )
          })}
        </div>

        {/* Tips */}
        <div className="bg-primary-50 dark:bg-primary-900/20 rounded-xl p-5 mb-6">
          <h3 className="font-semibold text-primary-900 dark:text-primary-100 mb-3 flex items-center gap-2">
            <Lightbulb className="w-5 h-5" />
            实用建议
          </h3>
          <ul className="space-y-2">
            {article.tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-primary-800 dark:text-primary-200">
                <span className="mt-1.5 w-1.5 h-1.5 bg-primary-500 rounded-full flex-shrink-0" />
                {tip}
              </li>
            ))}
          </ul>
        </div>

        {/* References */}
        <div className="text-sm text-gray-500 dark:text-gray-400">
          <h4 className="font-medium mb-2">参考文献</h4>
          <ul className="space-y-1">
            {article.references.map((ref, i) => (
              <li key={i}>{ref}</li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  )
}

function TipDetail({ tip, onBack }: { tip: InterventionTip; onBack: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <button onClick={onBack} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
        <ArrowLeft className="w-5 h-5" />
        返回列表
      </button>

      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 dark:border-gray-700">
        {/* Header */}
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-500">
            <Lightbulb className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                {tip.category}
              </span>
              <span className="text-xs text-gray-500">
                {tip.duration}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {tip.title}
            </h1>
          </div>
        </div>

        {/* Description */}
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-6 pb-6 border-b border-gray-100 dark:border-gray-700">
          {tip.description}
        </p>

        {/* Steps */}
        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">操作步骤</h3>
          <ol className="space-y-3">
            {tip.steps.map((step, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full flex items-center justify-center text-sm font-medium">
                  {i + 1}
                </span>
                <span className="text-gray-700 dark:text-gray-300 pt-0.5">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Evidence */}
        <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4">
          <h4 className="font-medium text-green-900 dark:text-green-100 mb-1">科学依据</h4>
          <p className="text-sm text-green-800 dark:text-green-200">{tip.evidence}</p>
        </div>
      </div>
    </motion.div>
  )
}
