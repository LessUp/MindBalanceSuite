import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useAssessmentStore } from '../stores/assessmentStore'
import { useUserStore } from '../stores/userStore'
import { allScales } from '../data/scales'
import { 
  Trash2, Download, BarChart3, TrendingUp, Calendar, 
  Filter, FileText, Activity
} from 'lucide-react'
import { toast } from 'sonner'
import { AssessmentTrendChart, MoodTrendChart, StatCard, ScaleDistributionChart } from '../components/Charts'
import MoodCalendar, { QuickMoodPicker } from '../components/MoodCalendar'

type ViewMode = 'list' | 'chart' | 'calendar'

export default function History() {
  const { results, deleteResult, clearResults } = useAssessmentStore()
  const { moodEntries } = useUserStore()
  const [filterScale, setFilterScale] = useState<string>('all')
  const [showConfirmClear, setShowConfirmClear] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [dateRange, setDateRange] = useState<'week' | 'month' | 'all'>('month')

  const filteredResults = useMemo(() => {
    let filtered = filterScale === 'all' 
      ? results 
      : results.filter(result => result.scaleId === filterScale)
    
    if (dateRange !== 'all') {
      const now = Date.now()
      const range = dateRange === 'week' ? 7 * 24 * 60 * 60 * 1000 : 30 * 24 * 60 * 60 * 1000
      filtered = filtered.filter(r => now - r.timestamp < range)
    }
    
    return filtered
  }, [results, filterScale, dateRange])

  // 统计数据
  const stats = useMemo(() => {
    const scaleCount: Record<string, number> = {}
    const severityCount: Record<string, number> = {}
    let totalScore = 0
    
    results.forEach(r => {
      scaleCount[r.scaleId] = (scaleCount[r.scaleId] || 0) + 1
      severityCount[r.label] = (severityCount[r.label] || 0) + 1
      totalScore += (r.total / r.max) * 100
    })
    
    return {
      total: results.length,
      avgScore: results.length > 0 ? Math.round(totalScore / results.length) : 0,
      scaleCount,
      severityCount,
      mostUsed: Object.entries(scaleCount).sort((a, b) => b[1] - a[1])[0]
    }
  }, [results])

  // 趋势数据
  const trendData = useMemo(() => {
    const data = filteredResults
      .slice()
      .reverse()
      .map(r => ({
        date: new Date(r.timestamp).toLocaleDateString('zh-CN'),
        value: Math.round((r.total / r.max) * 100),
        label: r.label
      }))
    return data.slice(-20) // 最近20条
  }, [filteredResults])

  // 量表分布数据
  const distributionData = useMemo(() => {
    const colors = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6']
    return Object.entries(stats.scaleCount).map(([id, count], i) => ({
      name: allScales[id]?.title.split(' ')[0] || id,
      value: count,
      color: colors[i % colors.length]
    }))
  }, [stats.scaleCount])

  const handleDelete = (id: string) => {
    deleteResult(id)
    toast.success('已删除记录')
  }

  const handleClearAll = () => {
    clearResults()
    setShowConfirmClear(false)
    toast.success('已清空所有记录')
  }

  const handleExport = () => {
    const data = {
      exportDate: new Date().toISOString(),
      results: filteredResults
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `assessment-history-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    toast.success('已导出历史记录')
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('zh-CN')
  }

  const getSeverityColor = (label: string) => {
    const lowerLabel = label.toLowerCase()
    if (lowerLabel.includes('minimal') || lowerLabel.includes('正常') || lowerLabel.includes('低') || lowerLabel.includes('良好')) {
      return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
    }
    if (lowerLabel.includes('mild') || lowerLabel.includes('轻')) {
      return 'bg-lime-100 text-lime-700 dark:bg-lime-900/30 dark:text-lime-400'
    }
    if (lowerLabel.includes('moderate') || lowerLabel.includes('中')) {
      return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
    }
    if (lowerLabel.includes('severe') || lowerLabel.includes('重') || lowerLabel.includes('高')) {
      return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
    }
    return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
  }

  if (results.length === 0) {
    return (
      <div className="space-y-8">
        {/* Quick Mood Picker */}
        <div className="max-w-sm mx-auto">
          <QuickMoodPicker />
        </div>
        
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            暂无评估记录
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            完成评估后，您的记录将显示在这里
          </p>
          <a href="/" className="inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors">
            开始评估
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Activity className="w-7 h-7 text-primary-600" />
            数据中心
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            追踪您的心理健康历程
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            {[
              { mode: 'list' as ViewMode, icon: FileText, label: '列表' },
              { mode: 'chart' as ViewMode, icon: TrendingUp, label: '图表' },
              { mode: 'calendar' as ViewMode, icon: Calendar, label: '日历' }
            ].map(({ mode, icon: Icon, label }) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  viewMode === mode 
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' 
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="总评估次数"
          value={stats.total}
          subtitle="累计完成"
          icon={BarChart3}
          color="primary"
        />
        <StatCard
          title="平均得分率"
          value={`${stats.avgScore}%`}
          subtitle="整体水平"
          icon={TrendingUp}
          color={stats.avgScore < 40 ? 'success' : stats.avgScore < 70 ? 'warning' : 'danger'}
        />
        <StatCard
          title="心情记录"
          value={moodEntries.length}
          subtitle="累计天数"
          icon={Calendar}
          color="success"
        />
        <StatCard
          title="最常用量表"
          value={stats.mostUsed ? allScales[stats.mostUsed[0]]?.title.split(' ')[0] || '-' : '-'}
          subtitle={stats.mostUsed ? `${stats.mostUsed[1]} 次` : ''}
          icon={Activity}
          color="warning"
        />
      </div>

      {/* Quick Mood */}
      <QuickMoodPicker />

      {/* View Content */}
      {viewMode === 'chart' && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Trend Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">评估趋势</h3>
            {trendData.length > 1 ? (
              <AssessmentTrendChart data={trendData} />
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500">
                需要更多数据以显示趋势
              </div>
            )}
          </div>

          {/* Distribution Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">量表分布</h3>
            {distributionData.length > 0 ? (
              <ScaleDistributionChart data={distributionData} />
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500">
                暂无数据
              </div>
            )}
          </div>

          {/* Mood Trend */}
          <div className="md:col-span-2 bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">心情趋势</h3>
            {moodEntries.length > 0 ? (
              <MoodTrendChart data={moodEntries.slice(-30).reverse()} />
            ) : (
              <div className="h-48 flex items-center justify-center text-gray-500">
                开始记录心情以查看趋势
              </div>
            )}
          </div>
        </div>
      )}

      {viewMode === 'calendar' && (
        <div className="max-w-md mx-auto">
          <MoodCalendar />
        </div>
      )}

      {viewMode === 'list' && (
        <>
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={filterScale}
                onChange={(e) => setFilterScale(e.target.value)}
                className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
              >
                <option value="all">所有量表</option>
                {Object.values(allScales).map(scale => (
                  <option key={scale.id} value={scale.id}>{scale.title}</option>
                ))}
              </select>
            </div>
            
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as typeof dateRange)}
              className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
            >
              <option value="week">最近一周</option>
              <option value="month">最近一月</option>
              <option value="all">全部时间</option>
            </select>
            
            <div className="flex-1" />
            
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-sm"
            >
              <Download className="w-4 h-4" />
              导出
            </button>
            
            <button
              onClick={() => setShowConfirmClear(true)}
              className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg text-sm"
            >
              <Trash2 className="w-4 h-4" />
              清空
            </button>
          </div>

          {/* Results Count */}
          <p className="text-sm text-gray-500 dark:text-gray-400">
            显示 {filteredResults.length} 条记录
          </p>

          {/* Results List */}
          <div className="space-y-3">
            {filteredResults.map((result, index) => (
              <motion.div
                key={result.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/20 rounded-xl flex items-center justify-center">
                      <BarChart3 className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {result.scaleTitle}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(result.timestamp)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-xl font-bold text-gray-900 dark:text-white">
                        {result.total}<span className="text-sm font-normal text-gray-400">/{result.max}</span>
                      </div>
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                        getSeverityColor(result.label)
                      }`}>
                        {result.label}
                      </span>
                    </div>
                    
                    <button
                      onClick={() => handleDelete(result.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}

      {/* Clear Confirmation Modal */}
      {showConfirmClear && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              确认清空历史记录
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              此操作将删除所有历史记录，无法恢复。是否继续？
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirmClear(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                取消
              </button>
              <button
                onClick={handleClearAll}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
              >
                确认清空
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}