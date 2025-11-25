/**
 * 数据可视化图表组件
 */

import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell
} from 'recharts'

interface TrendData {
  date: string
  value: number
  label?: string
}

interface ScaleDistribution {
  name: string
  value: number
  color: string
}

// 颜色配置
const COLORS = {
  primary: '#6366f1',
  success: '#22c55e',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#3b82f6',
  muted: '#94a3b8'
}

const SEVERITY_COLORS: Record<string, string> = {
  minimal: '#22c55e',
  mild: '#84cc16',
  moderate: '#f59e0b',
  modsev: '#f97316',
  severe: '#ef4444',
  low: '#22c55e',
  hazard: '#f59e0b',
  high: '#f97316',
  probable: '#ef4444'
}

// 评估历史趋势图
export function AssessmentTrendChart({ data }: { data: TrendData[] }) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return `${date.getMonth() + 1}/${date.getDate()}`
  }

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.3} />
              <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="date" 
            tickFormatter={formatDate}
            tick={{ fontSize: 12 }}
            stroke="#9ca3af"
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            stroke="#9ca3af"
            domain={[0, 'auto']}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
            }}
            formatter={(value: number) => [`${value} 分`, '得分']}
            labelFormatter={(label) => `日期: ${label}`}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke={COLORS.primary}
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorValue)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

// 多量表对比图
export function MultiScaleChart({ data }: { data: Array<{ date: string; [key: string]: number | string }> }) {
  const scales = Object.keys(data[0] || {}).filter(k => k !== 'date')
  const colors = [COLORS.primary, COLORS.success, COLORS.warning, COLORS.info, COLORS.danger]

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }}
            stroke="#9ca3af"
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            stroke="#9ca3af"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px'
            }}
          />
          <Legend />
          {scales.map((scale, i) => (
            <Line
              key={scale}
              type="monotone"
              dataKey={scale}
              stroke={colors[i % colors.length]}
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

// 心情趋势图
export function MoodTrendChart({ data }: { data: Array<{ date: string; mood: number }> }) {
  const moodColors = ['#ef4444', '#f97316', '#f59e0b', '#84cc16', '#22c55e']
  
  const getMoodColor = (mood: number) => moodColors[Math.min(mood - 1, 4)]
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return `${date.getMonth() + 1}/${date.getDate()}`
  }

  return (
    <div className="w-full h-48">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
          <XAxis 
            dataKey="date" 
            tickFormatter={formatDate}
            tick={{ fontSize: 11 }}
            stroke="#9ca3af"
          />
          <YAxis 
            domain={[0, 5]}
            ticks={[1, 2, 3, 4, 5]}
            tick={{ fontSize: 11 }}
            stroke="#9ca3af"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px'
            }}
            formatter={(value: number) => {
              const labels = ['很差', '较差', '一般', '较好', '很好']
              return [labels[value - 1] || value, '心情']
            }}
            labelFormatter={(label) => `日期: ${label}`}
          />
          <Bar 
            dataKey="mood" 
            radius={[4, 4, 0, 0]}
            fill={COLORS.primary}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getMoodColor(entry.mood)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

// 量表分布饼图
export function ScaleDistributionChart({ data }: { data: ScaleDistribution[] }) {
  // 转换为recharts期望的格式
  const chartData = data.map(item => ({
    ...item,
    name: item.name,
    value: item.value
  }))

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
            label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
            labelLine={{ stroke: '#9ca3af', strokeWidth: 1 }}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px'
            }}
            formatter={(value: number) => [`${value} 次`, '评估次数']}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

// 严重程度分布
export function SeverityDistributionChart({ data }: { data: Array<{ severity: string; count: number }> }) {
  return (
    <div className="w-full h-48">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 10, right: 30, left: 60, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
          <XAxis type="number" tick={{ fontSize: 11 }} stroke="#9ca3af" />
          <YAxis 
            type="category" 
            dataKey="severity" 
            tick={{ fontSize: 11 }}
            stroke="#9ca3af"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px'
            }}
            formatter={(value: number) => [`${value} 次`, '次数']}
          />
          <Bar 
            dataKey="count" 
            radius={[0, 4, 4, 0]}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={SEVERITY_COLORS[entry.severity.toLowerCase()] || COLORS.muted} 
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

// 统计卡片
export function StatCard({ 
  title, 
  value, 
  subtitle, 
  trend,
  icon: Icon,
  color = 'primary'
}: { 
  title: string
  value: string | number
  subtitle?: string
  trend?: { value: number; isUp: boolean }
  icon?: React.ComponentType<{ className?: string }>
  color?: 'primary' | 'success' | 'warning' | 'danger'
}) {
  const colorClasses = {
    primary: 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400',
    success: 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400',
    warning: 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400',
    danger: 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>
          )}
          {trend && (
            <p className={`text-xs mt-2 ${trend.isUp ? 'text-green-600' : 'text-red-600'}`}>
              {trend.isUp ? '↑' : '↓'} {Math.abs(trend.value)}% 较上周
            </p>
          )}
        </div>
        {Icon && (
          <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </div>
  )
}

// 进度环
export function ProgressRing({ 
  value, 
  max, 
  size = 120, 
  strokeWidth = 10,
  color = COLORS.primary,
  label 
}: { 
  value: number
  max: number
  size?: number
  strokeWidth?: number
  color?: string
  label?: string
}) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const percent = Math.min(value / max, 1)
  const strokeDashoffset = circumference - percent * circumference

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-500"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-gray-900 dark:text-white">
          {Math.round(percent * 100)}%
        </span>
        {label && (
          <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
        )}
      </div>
    </div>
  )
}
