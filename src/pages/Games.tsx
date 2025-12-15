/**
 * 心理小游戏与互动练习页面
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Gamepad2, Wind, Heart, Brain, Sparkles, 
  Play, ArrowLeft, Timer, Trophy
} from 'lucide-react'
import { mindGames, breathingExercises, emotionCards, getRandomAffirmation } from '../data/games'
import { useUserStore } from '../stores/userStore'

type GameView = 'list' | 'breathing' | 'gratitude' | 'emotion' | 'affirmation' | 'memory'

export default function Games() {
  const [view, setView] = useState<GameView>('list')
  const [selectedBreathing, setSelectedBreathing] = useState<string | null>(null)
  
  return (
    <div className="space-y-8 pb-12">
      <AnimatePresence mode="wait">
        {view === 'list' ? (
          <GameList key="list" onSelect={setView} />
        ) : view === 'breathing' ? (
          <BreathingGame 
            key="breathing" 
            exerciseId={selectedBreathing}
            onBack={() => setView('list')} 
            onSelectExercise={setSelectedBreathing}
          />
        ) : view === 'gratitude' ? (
          <GratitudeGame key="gratitude" onBack={() => setView('list')} />
        ) : view === 'emotion' ? (
          <EmotionGame key="emotion" onBack={() => setView('list')} />
        ) : view === 'affirmation' ? (
          <AffirmationGame key="affirmation" onBack={() => setView('list')} />
        ) : view === 'memory' ? (
          <MemoryGame key="memory" onBack={() => setView('list')} />
        ) : null}
      </AnimatePresence>
    </div>
  )
}

function GameList({ onSelect }: { onSelect: (view: GameView) => void }) {
  const categories = [
    { id: 'relaxation', name: '放松练习', icon: Wind, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { id: 'emotion', name: '情绪管理', icon: Heart, color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-900/20' },
    { id: 'cognitive', name: '认知训练', icon: Brain, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20' },
    { id: 'mindfulness', name: '正念练习', icon: Sparkles, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' }
  ]

  const gameActions: Record<string, GameView> = {
    'breathing-bubble': 'breathing',
    'gratitude-jar': 'gratitude',
    'emotion-wheel': 'emotion',
    'positive-affirmation': 'affirmation',
    'memory-garden': 'memory',
    'color-breath': 'breathing',
    'body-scan': 'breathing'
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex p-4 bg-gradient-to-br from-primary-100 to-primary-50 dark:from-primary-900/30 dark:to-primary-800/20 rounded-2xl">
          <Gamepad2 className="w-12 h-12 text-primary-600 dark:text-primary-400" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">心理小游戏</h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
          通过互动游戏和练习，培养积极心态，提升心理健康
        </p>
      </div>

      {/* Categories */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className={`${cat.bg} rounded-xl p-4 text-center`}
          >
            <cat.icon className={`w-8 h-8 mx-auto mb-2 ${cat.color}`} />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{cat.name}</span>
          </div>
        ))}
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mindGames.map((game) => (
          <motion.button
            key={game.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              const action = gameActions[game.id]
              if (action) onSelect(action)
            }}
            className="bg-white dark:bg-gray-800 rounded-xl p-5 text-left shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all"
          >
            <div className="flex items-start gap-4">
              <span className="text-3xl">{game.icon}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{game.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{game.description}</p>
                <div className="flex items-center gap-3 mt-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Timer className="w-3 h-3" />
                    {game.duration}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full ${
                    game.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                    game.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {game.difficulty === 'easy' ? '简单' : game.difficulty === 'medium' ? '中等' : '困难'}
                  </span>
                </div>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
}

function BreathingGame({ exerciseId, onBack, onSelectExercise }: { 
  exerciseId: string | null
  onBack: () => void
  onSelectExercise: (id: string | null) => void 
}) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale' | 'holdAfter'>('inhale')
  const [cycle, setCycle] = useState(0)
  
  const exercise = exerciseId 
    ? breathingExercises.find(e => e.id === exerciseId)
    : null

  const startBreathing = () => {
    if (!exercise) return
    setIsPlaying(true)
    setCycle(0)
    runBreathingCycle(exercise, 0)
  }

  const runBreathingCycle = (ex: typeof breathingExercises[0], currentCycle: number) => {
    if (currentCycle >= ex.cycles) {
      setIsPlaying(false)
      return
    }

    const phases: Array<{ phase: typeof phase; duration: number }> = [
      { phase: 'inhale', duration: ex.pattern.inhale * 1000 },
    ]
    if (ex.pattern.hold) phases.push({ phase: 'hold', duration: ex.pattern.hold * 1000 })
    phases.push({ phase: 'exhale', duration: ex.pattern.exhale * 1000 })
    if (ex.pattern.holdAfter) phases.push({ phase: 'holdAfter', duration: ex.pattern.holdAfter * 1000 })

    let delay = 0
    phases.forEach(({ phase: p, duration }) => {
      setTimeout(() => setPhase(p), delay)
      delay += duration
    })

    setTimeout(() => {
      setCycle(currentCycle + 1)
      runBreathingCycle(ex, currentCycle + 1)
    }, delay)
  }

  if (!exercise) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="space-y-6"
      >
        <button onClick={onBack} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
          <ArrowLeft className="w-5 h-5" />
          返回
        </button>
        
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">选择呼吸练习</h2>
        
        <div className="grid gap-4">
          {breathingExercises.map((ex) => (
            <button
              key={ex.id}
              onClick={() => onSelectExercise(ex.id)}
              className="bg-white dark:bg-gray-800 rounded-xl p-5 text-left shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all"
            >
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{ex.name}</h3>
              <p className="text-gray-600 dark:text-gray-400 mt-1">{ex.description}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {ex.benefits.map((b, i) => (
                  <span key={i} className="text-xs px-2 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded-full">
                    {b}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <button onClick={() => onSelectExercise(null)} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
        <ArrowLeft className="w-5 h-5" />
        返回选择
      </button>

      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{exercise.name}</h2>
        <p className="text-gray-600 dark:text-gray-400">{exercise.description}</p>
      </div>

      {/* Breathing Circle */}
      <div className="flex justify-center">
        <motion.div
          animate={{
            scale: isPlaying ? (phase === 'inhale' ? 1.5 : phase === 'exhale' ? 1 : 1.5) : 1,
          }}
          transition={{ duration: exercise.pattern[phase === 'holdAfter' ? 'exhale' : phase] || 4, ease: 'easeInOut' }}
          className="w-48 h-48 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-lg"
        >
          <span className="text-white text-xl font-medium">
            {isPlaying ? (
              phase === 'inhale' ? '吸气' :
              phase === 'hold' ? '屏息' :
              phase === 'exhale' ? '呼气' : '屏息'
            ) : '开始'}
          </span>
        </motion.div>
      </div>

      {/* Progress */}
      {isPlaying && (
        <div className="text-center text-gray-600 dark:text-gray-400">
          第 {cycle + 1} / {exercise.cycles} 轮
        </div>
      )}

      {/* Start Button */}
      {!isPlaying && (
        <div className="flex justify-center">
          <button
            onClick={startBreathing}
            className="flex items-center gap-2 px-8 py-3 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors"
          >
            <Play className="w-5 h-5" />
            开始练习
          </button>
        </div>
      )}
    </motion.div>
  )
}

function GratitudeGame({ onBack }: { onBack: () => void }) {
  const [input, setInput] = useState('')
  const { gratitudeEntries, addGratitudeEntry } = useUserStore()

  const handleSubmit = () => {
    if (input.trim()) {
      addGratitudeEntry(input.trim())
      setInput('')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <button onClick={onBack} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
        <ArrowLeft className="w-5 h-5" />
        返回
      </button>

      <div className="text-center space-y-2">
        <span className="text-5xl">🏺</span>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">感恩罐子</h2>
        <p className="text-gray-600 dark:text-gray-400">每天记录一件让你感恩的事</p>
      </div>

      {/* Input */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="今天有什么让你感恩的事？"
          className="w-full h-24 resize-none bg-transparent border-none focus:outline-none text-gray-900 dark:text-white"
        />
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={!input.trim()}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg disabled:opacity-50"
          >
            添加到罐子
          </button>
        </div>
      </div>

      {/* Entries */}
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-900 dark:text-white">
          我的感恩记录 ({gratitudeEntries.length})
        </h3>
        {gratitudeEntries.slice(0, 10).map((entry) => (
          <div
            key={entry.id}
            className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3 border border-amber-100 dark:border-amber-800"
          >
            <p className="text-gray-800 dark:text-gray-200">{entry.content}</p>
            <p className="text-xs text-gray-500 mt-2">
              {new Date(entry.date).toLocaleDateString('zh-CN')}
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

function EmotionGame({ onBack }: { onBack: () => void }) {
  const [selected, setSelected] = useState<string | null>(null)
  const selectedCard = emotionCards.find(c => c.id === selected)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <button onClick={onBack} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
        <ArrowLeft className="w-5 h-5" />
        返回
      </button>

      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">情绪轮盘</h2>
        <p className="text-gray-600 dark:text-gray-400">选择你现在的感受</p>
      </div>

      {/* Emotion Grid */}
      <div className="grid grid-cols-4 gap-3">
        {emotionCards.map((card) => (
          <button
            key={card.id}
            onClick={() => setSelected(card.id)}
            className={`p-4 rounded-xl text-center transition-all ${
              selected === card.id 
                ? 'bg-primary-100 dark:bg-primary-900/30 ring-2 ring-primary-500' 
                : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <span className="text-3xl">{card.emoji}</span>
            <p className="text-sm mt-1 text-gray-700 dark:text-gray-300">{card.emotion}</p>
          </button>
        ))}
      </div>

      {/* Selected Emotion Details */}
      {selectedCard && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">{selectedCard.emoji}</span>
            <div>
              <h3 className="font-bold text-xl text-gray-900 dark:text-white">{selectedCard.emotion}</h3>
              <p className="text-gray-600 dark:text-gray-400">{selectedCard.description}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">身体信号</h4>
              <div className="flex flex-wrap gap-2">
                {selectedCard.bodySignals.map((signal, i) => (
                  <span key={i} className="text-sm px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
                    {signal}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">应对策略</h4>
              <ul className="space-y-1">
                {selectedCard.copingStrategies.map((strategy, i) => (
                  <li key={i} className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-primary-500 rounded-full" />
                    {strategy}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

function AffirmationGame({ onBack }: { onBack: () => void }) {
  const [affirmation, setAffirmation] = useState(getRandomAffirmation())

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <button onClick={onBack} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
        <ArrowLeft className="w-5 h-5" />
        返回
      </button>

      <div className="text-center space-y-2">
        <span className="text-5xl">💪</span>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">积极肯定</h2>
        <p className="text-gray-600 dark:text-gray-400">每天对自己说一句积极的话</p>
      </div>

      <motion.div
        key={affirmation}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl p-8 text-center"
      >
        <p className="text-2xl font-medium text-white leading-relaxed">
          "{affirmation}"
        </p>
      </motion.div>

      <div className="flex justify-center">
        <button
          onClick={() => setAffirmation(getRandomAffirmation())}
          className="px-6 py-3 bg-white dark:bg-gray-800 rounded-full shadow-sm hover:shadow-md transition-all"
        >
          换一条 ✨
        </button>
      </div>
    </motion.div>
  )
}

function MemoryGame({ onBack }: { onBack: () => void }) {
  const emojis = ['🌸', '🌺', '🌻', '🌹', '🌷', '🌼', '💐', '🪻']
  const [cards, setCards] = useState<Array<{ id: number; emoji: string; flipped: boolean; matched: boolean }>>([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [gameComplete, setGameComplete] = useState(false)

  const initGame = () => {
    const shuffled = [...emojis, ...emojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, i) => ({ id: i, emoji, flipped: false, matched: false }))
    setCards(shuffled)
    setFlippedCards([])
    setMoves(0)
    setGameComplete(false)
  }

  useState(() => { initGame() })

  const handleCardClick = (id: number) => {
    if (flippedCards.length === 2) return
    if (cards[id].flipped || cards[id].matched) return

    const newCards = [...cards]
    newCards[id].flipped = true
    setCards(newCards)

    const newFlipped = [...flippedCards, id]
    setFlippedCards(newFlipped)

    if (newFlipped.length === 2) {
      setMoves(m => m + 1)
      const [first, second] = newFlipped
      if (cards[first].emoji === cards[second].emoji) {
        newCards[first].matched = true
        newCards[second].matched = true
        setCards(newCards)
        setFlippedCards([])
        
        if (newCards.every(c => c.matched)) {
          setGameComplete(true)
        }
      } else {
        setTimeout(() => {
          newCards[first].flipped = false
          newCards[second].flipped = false
          setCards([...newCards])
          setFlippedCards([])
        }, 1000)
      }
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <button onClick={onBack} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
        <ArrowLeft className="w-5 h-5" />
        返回
      </button>

      <div className="text-center space-y-2">
        <span className="text-5xl">🌸</span>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">记忆花园</h2>
        <p className="text-gray-600 dark:text-gray-400">翻开卡片，找到相同的花朵</p>
        <p className="text-sm text-gray-500">步数: {moves}</p>
      </div>

      {gameComplete ? (
        <div className="text-center space-y-4">
          <Trophy className="w-16 h-16 mx-auto text-yellow-500" />
          <p className="text-xl font-bold text-gray-900 dark:text-white">恭喜完成！</p>
          <p className="text-gray-600">用了 {moves} 步</p>
          <button onClick={initGame} className="px-6 py-2 bg-primary-600 text-white rounded-full">
            再玩一次
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-3 max-w-sm mx-auto">
          {cards.map((card) => (
            <motion.button
              key={card.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleCardClick(card.id)}
              className={`aspect-square rounded-xl text-3xl flex items-center justify-center transition-all ${
                card.flipped || card.matched
                  ? 'bg-white dark:bg-gray-700'
                  : 'bg-primary-100 dark:bg-primary-900/30'
              }`}
            >
              {(card.flipped || card.matched) ? card.emoji : '?'}
            </motion.button>
          ))}
        </div>
      )}
    </motion.div>
  )
}
