/**
 * 心情追踪日历组件
 */

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useUserStore } from '../stores/userStore'

const MOOD_EMOJIS = ['😢', '😔', '😐', '🙂', '😊']
const MOOD_LABELS = ['很差', '较差', '一般', '较好', '很好']
const MOOD_COLORS = [
  'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
  'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
  'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
  'bg-lime-100 text-lime-600 dark:bg-lime-900/30 dark:text-lime-400',
  'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
]

interface MoodCalendarProps {
  onSelectDate?: (date: string, mood?: number) => void
}

export default function MoodCalendar({ onSelectDate }: MoodCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [showMoodPicker, setShowMoodPicker] = useState(false)
  
  const { moodEntries, setMoodEntry } = useUserStore()

  const moodMap = useMemo(() => {
    const map = new Map<string, number>()
    moodEntries.forEach(entry => {
      map.set(entry.date, entry.mood)
    })
    return map
  }, [moodEntries])

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)
  const daysInMonth = lastDayOfMonth.getDate()
  const startingDay = firstDayOfMonth.getDay()

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  const handleDateClick = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    setSelectedDate(dateStr)
    setShowMoodPicker(true)
    onSelectDate?.(dateStr, moodMap.get(dateStr))
  }

  const handleMoodSelect = (mood: number) => {
    if (selectedDate) {
      setMoodEntry(selectedDate, mood)
      // 通过 setMoodEntry 写入选中日期，避免仅能记录“今天”的限制
      // 这里先不收集备注/标签（如需可扩展为弹窗输入）
    }
    setShowMoodPicker(false)
  }

  const today = new Date()
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

  const weekDays = ['日', '一', '二', '三', '四', '五', '六']

  const renderDays = () => {
    const days = []
    
    // 空白填充
    for (let i = 0; i < startingDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10" />)
    }
    
    // 日期
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      const mood = moodMap.get(dateStr)
      const isToday = dateStr === todayStr
      const isSelected = dateStr === selectedDate
      const isFuture = new Date(dateStr) > today
      
      days.push(
        <motion.button
          key={day}
          whileHover={{ scale: isFuture ? 1 : 1.1 }}
          whileTap={{ scale: isFuture ? 1 : 0.95 }}
          onClick={() => !isFuture && handleDateClick(day)}
          disabled={isFuture}
          className={`
            h-10 w-10 rounded-full flex items-center justify-center text-sm font-medium
            transition-all relative
            ${isFuture ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed' : 'cursor-pointer'}
            ${isToday && !mood ? 'ring-2 ring-primary-500 ring-offset-2' : ''}
            ${isSelected ? 'ring-2 ring-primary-600' : ''}
            ${mood ? MOOD_COLORS[mood - 1] : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'}
          `}
        >
          {mood ? (
            <span className="text-lg">{MOOD_EMOJIS[mood - 1]}</span>
          ) : (
            day
          )}
        </motion.button>
      )
    }
    
    return days
  }

  // 统计当月心情
  const monthStats = useMemo(() => {
    let total = 0
    let count = 0
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      const mood = moodMap.get(dateStr)
      if (mood) {
        total += mood
        count++
      }
    }
    return {
      count,
      average: count > 0 ? (total / count).toFixed(1) : '-',
      label: count > 0 ? MOOD_LABELS[Math.round(total / count) - 1] : '暂无数据'
    }
  }, [year, month, daysInMonth, moodMap])

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={prevMonth}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
        
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {year}年{month + 1}月
        </h3>
        
        <button
          onClick={nextMonth}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
      </div>

      {/* Week Days */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map(day => (
          <div key={day} className="h-8 flex items-center justify-center text-xs font-medium text-gray-500 dark:text-gray-400">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {renderDays()}
      </div>

      {/* Month Stats */}
      <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">本月记录</span>
          <span className="font-medium text-gray-900 dark:text-white">{monthStats.count} 天</span>
        </div>
        <div className="flex items-center justify-between text-sm mt-2">
          <span className="text-gray-500 dark:text-gray-400">平均心情</span>
          <span className="font-medium text-gray-900 dark:text-white">
            {monthStats.average} ({monthStats.label})
          </span>
        </div>
      </div>

      {/* Mood Picker Modal */}
      <AnimatePresence>
        {showMoodPicker && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowMoodPicker(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-sm w-full shadow-xl"
            >
              <h4 className="text-lg font-semibold text-center text-gray-900 dark:text-white mb-2">
                今天感觉怎么样？
              </h4>
              <p className="text-sm text-center text-gray-500 dark:text-gray-400 mb-6">
                {selectedDate}
              </p>
              
              <div className="flex justify-center gap-3">
                {MOOD_EMOJIS.map((emoji, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleMoodSelect(i + 1)}
                    className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl transition-colors ${MOOD_COLORS[i]}`}
                    title={MOOD_LABELS[i]}
                  >
                    {emoji}
                  </motion.button>
                ))}
              </div>
              
              <div className="flex justify-center gap-4 mt-4 text-xs text-gray-500">
                {MOOD_LABELS.map((label, i) => (
                  <span key={i} className="text-center w-12">{label}</span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-2 justify-center">
        {MOOD_EMOJIS.map((emoji, i) => (
          <div key={i} className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
            <span>{emoji}</span>
            <span>{MOOD_LABELS[i]}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// 简化版心情选择器
export function QuickMoodPicker({ onSelect }: { onSelect?: (mood: number) => void }) {
  const { addMoodEntry, moodEntries } = useUserStore()
  
  const today = new Date().toISOString().split('T')[0]
  const todayMood = moodEntries.find(e => e.date === today)?.mood

  const handleSelect = (mood: number) => {
    addMoodEntry(mood)
    onSelect?.(mood)
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
      <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-3">
        {todayMood ? '今日心情已记录' : '记录今日心情'}
      </p>
      <div className="flex justify-center gap-2">
        {MOOD_EMOJIS.map((emoji, i) => (
          <motion.button
            key={i}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleSelect(i + 1)}
            className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl transition-all ${
              todayMood === i + 1 
                ? `${MOOD_COLORS[i]} ring-2 ring-offset-2 ring-primary-500` 
                : 'hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            {emoji}
          </motion.button>
        ))}
      </div>
    </div>
  )
}
