import { Link } from 'react-router-dom'
import { ArrowRight, Clock, HelpCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { Scale } from '../data/scales'

interface ScaleCardProps {
  scale: Scale
  description: string
}

export default function ScaleCard({ scale, description }: ScaleCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className="h-full"
    >
      <div className="h-full bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col transition-all duration-300">
        <div className="p-6 flex-1">
          <div className="flex items-start justify-between mb-4">
            <div className="p-2 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
              <div className="w-8 h-8 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold text-lg">
                {scale.id.toUpperCase().slice(0, 2)}
              </div>
            </div>
            <span className="px-3 py-1 text-xs font-medium text-primary-700 bg-primary-50 dark:text-primary-300 dark:bg-primary-900/20 rounded-full">
              {scale.questions.length} 题
            </span>
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">
            {scale.title}
          </h3>
          
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            <span>参考时间范围：{scale.timeframe}</span>
          </p>
          
          <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mb-4">
            {description}
          </p>
        </div>
        
        <div className="p-6 pt-0 mt-auto">
          <Link
            to={`/assessment/${scale.id}`}
            className="group w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium rounded-lg transition-all hover:bg-primary-600 dark:hover:bg-primary-400 hover:text-white dark:hover:text-gray-900"
          >
            开始评估
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
