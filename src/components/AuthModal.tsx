/**
 * 登录/注册模态框组件
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Mail, Lock, User, Eye, EyeOff, Loader2, Cloud, CloudOff } from 'lucide-react'
import { toast } from 'sonner'
import * as api from '../services/apiClient'
import { useAuthStore } from '../stores/authStore'
import { isBackendEnabled } from '../services/apiClient'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  initialMode?: 'login' | 'register'
}

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { login: authLogin } = useAuthStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (!isBackendEnabled()) {
        // 本地模式：直接使用authStore
        authLogin(email, name || email.split('@')[0])
        toast.success(`欢迎${mode === 'register' ? '加入' : '回来'}！`)
        onClose()
        return
      }

      // 后端模式
      if (mode === 'register') {
        const response = await api.register(email, password, name)
        authLogin(response.user.email, response.user.name || email.split('@')[0])
        toast.success('注册成功！')
      } else {
        const response = await api.login(email, password)
        authLogin(response.user.email, response.user.name || email.split('@')[0])
        toast.success('登录成功！')
      }
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : '操作失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  const switchMode = () => {
    setMode(mode === 'login' ? 'register' : 'login')
    setError('')
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e: React.MouseEvent) => e.stopPropagation()}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
        >
          {/* Header */}
          <div className="relative p-6 pb-0">
            <button
              onClick={onClose}
              className="absolute right-4 top-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
            
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-primary-600 dark:text-primary-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {mode === 'login' ? '欢迎回来' : '创建账户'}
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                {mode === 'login' ? '登录以同步您的数据' : '开始您的心理健康之旅'}
              </p>
            </div>

            {/* Backend Status */}
            <div className={`flex items-center justify-center gap-2 text-xs py-2 px-3 rounded-full mx-auto w-fit ${
              isBackendEnabled() 
                ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                : 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400'
            }`}>
              {isBackendEnabled() ? (
                <>
                  <Cloud className="w-3 h-3" />
                  云端同步已启用
                </>
              ) : (
                <>
                  <CloudOff className="w-3 h-3" />
                  本地模式（数据仅保存在浏览器）
                </>
              )}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg">
                {error}
              </div>
            )}

            {mode === 'register' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  昵称
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="您的昵称"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                邮箱
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            {isBackendEnabled() && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  密码
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required={isBackendEnabled()}
                    minLength={6}
                    className="w-full pl-10 pr-12 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  处理中...
                </>
              ) : (
                mode === 'login' ? '登录' : '注册'
              )}
            </button>

            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              {mode === 'login' ? '还没有账户？' : '已有账户？'}
              <button
                type="button"
                onClick={switchMode}
                className="text-primary-600 hover:text-primary-700 font-medium ml-1"
              >
                {mode === 'login' ? '立即注册' : '立即登录'}
              </button>
            </p>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// 同步状态指示器
export function SyncStatusIndicator() {
  const backendEnabled = isBackendEnabled()
  const token = api.getToken()
  const isLoggedIn = !!token

  return (
    <div className={`flex items-center gap-2 text-xs px-3 py-1.5 rounded-full ${
      backendEnabled && isLoggedIn
        ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'
        : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
    }`}>
      {backendEnabled && isLoggedIn ? (
        <>
          <Cloud className="w-3 h-3" />
          <span>已同步</span>
        </>
      ) : (
        <>
          <CloudOff className="w-3 h-3" />
          <span>本地</span>
        </>
      )}
    </div>
  )
}
