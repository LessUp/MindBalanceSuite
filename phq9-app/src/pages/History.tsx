import { useState } from 'react'
import { useAssessmentStore } from '../stores/assessmentStore'
import { scales } from '../data/scales'
import { Trash2, Download, BarChart3 } from 'lucide-react'
import { toast } from 'sonner'

export default function History() {
  const { results, deleteResult, clearResults } = useAssessmentStore()
  const [filterScale, setFilterScale] = useState<string>('all')
  const [showConfirmClear, setShowConfirmClear] = useState(false)

  const filteredResults = filterScale === 'all' 
    ? results 
    : results.filter(result => result.scaleId === filterScale)

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

  // const getScaleInfo = (scaleId: string) => {
  //   return scales[scaleId] || { title: '未知量表', max: 0 }
  // }

  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <div className="w-8 h-8 text-gray-400" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          暂无历史记录
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          完成评估后，您的记录将显示在这里
        </p>
        <a href="/" className="inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors">
          开始评估
        </a>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            历史记录
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            共 {filteredResults.length} 条记录
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <select
            value={filterScale}
            onChange={(e) => setFilterScale(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="all">所有量表</option>
            {Object.values(scales).map(scale => (
              <option key={scale.id} value={scale.id}>{scale.title}</option>
            ))}
          </select>
          
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
          >
            <Download className="w-4 h-4" />
            导出
          </button>
          
          <button
            onClick={() => setShowConfirmClear(true)}
            className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg"
          >
            <Trash2 className="w-4 h-4" />
            清空
          </button>
        </div>
      </div>

      {/* Results List */}
      <div className="space-y-4">
        {filteredResults.map((result) => {
          // const scaleInfo = getScaleInfo(result.scaleId)
          
          return (
            <div key={result.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-primary-600 dark:text-primary-400" />
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
                    <div className="text-2xl font-bold text-primary-600">
                      {result.total}
                      <span className="text-sm font-normal text-gray-500 dark:text-gray-400">/{result.max}</span>
                    </div>
                    <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      {result.label}
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    评估结果：{result.label}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDelete(result.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

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