import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { scales, Scale } from '../data/scales'
import { useAnswerStore } from '../stores/answerStore'
import { useAssessmentStore } from '../stores/assessmentStore'
import { useAuthStore } from '../stores/authStore'
import { ChevronLeft, Printer, RotateCcw } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Assessment() {
  const { scaleId } = useParams<{ scaleId: string }>()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [showResults, setShowResults] = useState(false)
  const [result, setResult] = useState<{
    total: number
    severity: ReturnType<Scale['severity']>
    extras: string
  } | null>(null)

  const { setAnswer, getAnswers, clearAnswers } = useAnswerStore()
  const { addResult } = useAssessmentStore()
  const { isAuthenticated } = useAuthStore()

  const scale = scaleId ? scales[scaleId] : null

  useEffect(() => {
    if (scale) {
      const savedAnswers = getAnswers(scale.id)
      setAnswers(savedAnswers)
    }
  }, [scale, getAnswers])

  if (!scale) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          量表不存在
        </h2>
        <Link to="/" className="text-primary-600 hover:text-primary-700">
          返回首页
        </Link>
      </div>
    )
  }

  const handleAnswer = (questionIndex: number, value: number) => {
    const newAnswers = [...answers]
    newAnswers[questionIndex] = value
    setAnswers(newAnswers)
    setAnswer(scale.id, questionIndex, value)
    
    // Auto advance to next question
    if (questionIndex < scale.questions.length - 1) {
      setTimeout(() => setCurrentQuestion(questionIndex + 1), 300)
    }
  }

  const handleSubmit = () => {
    if (answers.length !== scale.questions.length || answers.some(a => a === undefined)) {
      toast.error('请完成所有题目')
      return
    }

    const total = scale.computeTotal ? scale.computeTotal(answers) : answers.reduce((a, b) => a + b, 0)
    const severity = scale.severity(total, answers)
    const extras = scale.extras ? scale.extras(total, answers) : ''

    setResult({ total, severity, extras })
    setShowResults(true)

    // Save result
    if (isAuthenticated) {
      addResult({
        scaleId: scale.id,
        scaleTitle: scale.title,
        total,
        max: scale.max,
        label: severity.label,
        values: answers
      })
      toast.success('评估结果已保存')
    }
  }

  const handleReset = () => {
    setAnswers([])
    setCurrentQuestion(0)
    setShowResults(false)
    setResult(null)
    clearAnswers(scale.id)
    toast.info('已重置评估')
  }

  const handlePrint = () => {
    window.print()
  }

  const progress = answers.filter(a => a !== undefined).length / scale.questions.length * 100

  const getOptionsForQuestion = (questionIndex: number) => {
    return scale.questionOptions ? scale.questionOptions[questionIndex] : scale.options
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {scale.title}
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              时间范围：{scale.timeframe} · 共{scale.questions.length}题
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
          >
            <RotateCcw className="w-4 h-4" />
            重置
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg print:hidden"
          >
            <Printer className="w-4 h-4" />
            打印
          </button>
        </div>
      </div>

      {/* Progress */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            进度
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {answers.filter(a => a !== undefined).length} / {scale.questions.length}
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Results */}
      {showResults && result && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 print-break">
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                评估结果
              </h2>
              <div className="text-3xl font-bold text-primary-600 mb-2">
                {result.total} / {scale.max}
              </div>
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                {result.severity.label}
              </div>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">建议</h3>
              <p className="text-gray-700 dark:text-gray-300">{result.severity.advice}</p>
            </div>
            
            {result.extras && (
              <div dangerouslySetInnerHTML={{ __html: result.extras }} />
            )}
            
            <div className="text-center text-sm text-gray-500 dark:text-gray-400">
              提示：本工具为自我筛查与健康教育用途，结果仅供参考，不构成医疗诊断或治疗建议。
            </div>
          </div>
        </div>
      )}

      {/* Questions */}
      <div className="space-y-6">
        {scale.questions.map((question, index) => {
          const options = getOptionsForQuestion(index)
          const isAnswered = answers[index] !== undefined
          
          return (
            <div 
              key={index}
              className={`bg-white dark:bg-gray-800 rounded-lg border p-6 transition-all duration-300 ${
                currentQuestion === index 
                  ? 'border-primary-500 shadow-lg' 
                  : isAnswered 
                  ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10'
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    isAnswered 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      {question}
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {options.map((option, optionIndex) => (
                        <button
                          key={optionIndex}
                          onClick={() => handleAnswer(index, option.value)}
                          className={`p-3 text-left rounded-lg border transition-all duration-200 ${
                            answers[index] === option.value
                              ? 'border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300'
                              : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-4 h-4 rounded-full border-2 ${
                              answers[index] === option.value
                                ? 'border-primary-500 bg-primary-500'
                                : 'border-gray-300 dark:border-gray-500'
                            }`}>
                              {answers[index] === option.value && (
                                <div className="w-full h-full rounded-full bg-white scale-50" />
                              )}
                            </div>
                            <span>{option.label}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Submit Button */}
      {!showResults && (
        <div className="flex justify-center">
          <button
            onClick={handleSubmit}
            disabled={answers.filter(a => a !== undefined).length !== scale.questions.length}
            className="px-8 py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
          >
            提交评估
          </button>
        </div>
      )}
    </div>
  )
}