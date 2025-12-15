import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, RotateCcw, Printer, AlertTriangle, CheckCircle2, Brain } from 'lucide-react'
import { scales, Scale } from '../data/scales'
import { useAnswerStore, type AnswerValue } from '../stores/answerStore'
import { useAssessmentStore } from '../stores/assessmentStore'
import { useAuthStore } from '../stores/authStore'
import { cn } from '../lib/utils'

export default function Assessment() {
  const { scaleId } = useParams<{ scaleId: string }>()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<AnswerValue[]>([])
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
      // If all questions are answered, we could potentially show results or jump to end,
      // but for now let's just load them.
      // Find first unanswered question to resume
      const firstUnanswered = savedAnswers.findIndex(a => a == null)
      if (firstUnanswered !== -1) {
        setCurrentQuestion(firstUnanswered)
      } else if (savedAnswers.length < scale.questions.length) {
        setCurrentQuestion(Math.min(savedAnswers.length, scale.questions.length - 1))
      }
    }
  }, [scale, getAnswers])

  if (!scale) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full">
          <AlertTriangle className="w-12 h-12 text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          量表不存在
        </h2>
        <Link 
          to="/" 
          className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
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
    
    // Auto advance after a short delay
    if (questionIndex < scale.questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(prev => prev + 1)
      }, 250)
    } else {
        // If it's the last question, maybe scroll to submit button or show it prominently?
        // In wizard mode, the "Next" button becomes "Submit"
    }
  }

  const handleSubmit = () => {
    if (answers.length !== scale.questions.length || answers.some(a => a == null)) {
      toast.error('请完成所有题目')
      return
    }

    const values = answers.map((a) => a ?? 0)
    const total = scale.computeTotal ? scale.computeTotal(values) : values.reduce((a, b) => a + b, 0)
    const severity = scale.severity(total, values)
    const extras = scale.extras ? scale.extras(total, values) : ''

    setResult({ total, severity, extras })
    setShowResults(true)

    if (isAuthenticated) {
      addResult({
        scaleId: scale.id,
        scaleTitle: scale.title,
        total,
        max: scale.max,
        label: severity.label,
        values
      })
      toast.success('评估结果已保存')
    }
  }

  const handleReset = () => {
    if (confirm('确定要重置所有选项吗？这将清除当前进度。')) {
      setAnswers([])
      setCurrentQuestion(0)
      setShowResults(false)
      setResult(null)
      clearAnswers(scale.id)
      toast.info('已重置评估')
    }
  }

  const progress = (answers.filter(a => a != null).length / scale.questions.length) * 100
  const currentOptions = scale.questionOptions ? scale.questionOptions[currentQuestion] : scale.options

  // Results View
  if (showResults && result) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto space-y-8"
      >
        <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">评估报告</h1>
            <button
                onClick={() => window.print()}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors print:hidden"
            >
                <Printer className="w-4 h-4" />
                打印报告
            </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden print:border-none print:shadow-none">
            <div className="p-8 text-center border-b border-gray-100 dark:border-gray-700 bg-gradient-to-b from-primary-50/30 to-transparent dark:from-primary-900/10">
                <h2 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-4">{scale.title}</h2>
                <div className="flex flex-col items-center justify-center gap-4 mb-6">
                    <div className="relative">
                        <svg className="w-40 h-40 transform -rotate-90">
                            <circle
                                className="text-gray-200 dark:text-gray-700"
                                strokeWidth="12"
                                stroke="currentColor"
                                fill="transparent"
                                r="70"
                                cx="80"
                                cy="80"
                            />
                            <circle
                                className="text-primary-600 dark:text-primary-500"
                                strokeWidth="12"
                                strokeDasharray={440}
                                strokeDashoffset={440 - (440 * result.total) / scale.max}
                                strokeLinecap="round"
                                stroke="currentColor"
                                fill="transparent"
                                r="70"
                                cx="80"
                                cy="80"
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-4xl font-bold text-gray-900 dark:text-white">
                                {result.total}
                            </span>
                            <span className="text-sm text-gray-500">总分 / {scale.max}</span>
                        </div>
                    </div>
                    <div className={cn(
                        "px-4 py-1.5 rounded-full text-sm font-semibold",
                        result.severity.badge === 'badge-minimal' && "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
                        result.severity.badge === 'badge-mild' && "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
                        result.severity.badge === 'badge-moderate' && "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
                        result.severity.badge === 'badge-modsev' && "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
                        result.severity.badge === 'badge-severe' && "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300"
                    )}>
                        {result.severity.label}
                    </div>
                </div>
            </div>

            <div className="p-8 space-y-6">
                <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                        <Brain className="w-5 h-5 text-primary-600" />
                        专业建议
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        {result.severity.advice}
                    </p>
                </div>

                {result.extras && (
                    <div 
                        className="prose prose-sm dark:prose-invert max-w-none bg-blue-50 dark:bg-blue-900/10 rounded-xl p-6"
                        dangerouslySetInnerHTML={{ __html: result.extras }} 
                    />
                )}
            </div>
        </div>

        <div className="flex justify-center gap-4 print:hidden">
            <button
                onClick={() => {
                    setShowResults(false)
                    setAnswers([])
                    setCurrentQuestion(0)
                    setResult(null)
                    clearAnswers(scale.id)
                }}
                className="px-6 py-2.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors font-medium"
            >
                重新测评
            </button>
            <Link
                to="/"
                className="px-6 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors font-medium"
            >
                返回首页
            </Link>
        </div>
      </motion.div>
    )
  }

  // Assessment Wizard View
  return (
    <div className="max-w-2xl mx-auto px-4 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Link to="/" className="p-2 -ml-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {scale.title}
        </div>
        <button
          onClick={handleReset}
          className="p-2 -mr-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
          title="重置进度"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mb-8 space-y-2">
        <div className="flex justify-between text-xs font-medium text-gray-500 dark:text-gray-400">
          <span>进度 {Math.round(progress)}%</span>
          <span>{currentQuestion + 1} / {scale.questions.length}</span>
        </div>
        <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-primary-600 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="relative min-h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            <div className="space-y-2">
                <span className="text-sm font-bold text-primary-600 dark:text-primary-400 tracking-wider uppercase">
                    问题 {currentQuestion + 1}
                </span>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white leading-tight">
                    {scale.questions[currentQuestion]}
                </h2>
            </div>

            <div className="grid gap-3">
                {currentOptions.map((option, idx) => {
                    const isSelected = answers[currentQuestion] === option.value
                    return (
                        <button
                            key={idx}
                            onClick={() => handleAnswer(currentQuestion, option.value)}
                            className={cn(
                                "group relative flex items-center p-4 text-left rounded-xl border-2 transition-all duration-200 hover:shadow-md",
                                isSelected
                                    ? "border-primary-600 bg-primary-50 dark:border-primary-500 dark:bg-primary-900/20"
                                    : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-primary-300 dark:hover:border-primary-700"
                            )}
                        >
                            <div className={cn(
                                "flex-1 text-lg font-medium transition-colors",
                                isSelected ? "text-primary-900 dark:text-primary-100" : "text-gray-700 dark:text-gray-300"
                            )}>
                                {option.label}
                            </div>
                            <div className={cn(
                                "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                                isSelected
                                    ? "border-primary-600 bg-primary-600 dark:border-primary-500 dark:bg-primary-500"
                                    : "border-gray-300 dark:border-gray-600 group-hover:border-primary-400"
                            )}>
                                {isSelected && <CheckCircle2 className="w-4 h-4 text-white" />}
                            </div>
                        </button>
                    )
                })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Footer */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 md:static md:bg-transparent md:border-none md:p-0 md:mt-8">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
            <button
                onClick={() => setCurrentQuestion(p => Math.max(0, p - 1))}
                disabled={currentQuestion === 0}
                className="px-6 py-3 text-gray-600 dark:text-gray-400 font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
                上一题
            </button>

            {currentQuestion === scale.questions.length - 1 ? (
                <button
                    onClick={handleSubmit}
                    disabled={answers[currentQuestion] == null}
                    className="flex-1 md:flex-none px-8 py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold rounded-lg shadow-lg shadow-primary-600/20 transition-all transform active:scale-95"
                >
                    查看结果
                </button>
            ) : (
                <button
                    onClick={() => setCurrentQuestion(p => Math.min(scale.questions.length - 1, p + 1))}
                    disabled={answers[currentQuestion] == null}
                    className="flex-1 md:flex-none px-8 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:text-gray-500 font-bold rounded-lg transition-all hover:shadow-lg active:scale-95 flex items-center justify-center gap-2"
                >
                    下一题
                    <ChevronRight className="w-4 h-4" />
                </button>
            )}
        </div>
      </div>
    </div>
  )
}
