/**
 * API 配置文件
 * 可选的后端服务配置
 */

export interface BackendConfig {
  enabled: boolean
  baseUrl: string
  apiVersion: string
  timeout: number
}

export interface AIProviderConfig {
  name: string
  displayName: string
  baseUrl: string
  models: string[]
  defaultModel: string
}

// 默认后端配置（当前为本地模式）
export const backendConfig: BackendConfig = {
  enabled: import.meta.env.VITE_BACKEND_ENABLED === 'true', // 通过环境变量控制
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001',
  apiVersion: 'v1',
  timeout: 30000
}

// AI 服务提供商配置
export const aiProviders: AIProviderConfig[] = [
  {
    name: 'openai',
    displayName: 'OpenAI',
    baseUrl: 'https://api.openai.com/v1',
    models: ['gpt-4o-mini', 'gpt-4o', 'gpt-4-turbo'],
    defaultModel: 'gpt-4o-mini'
  },
  {
    name: 'deepseek',
    displayName: 'DeepSeek',
    baseUrl: 'https://api.deepseek.com/v1',
    models: ['deepseek-chat', 'deepseek-coder'],
    defaultModel: 'deepseek-chat'
  },
  {
    name: 'qwen',
    displayName: '通义千问',
    baseUrl: 'https://dashscope.aliyuncs.com/api/v1',
    models: ['qwen-turbo', 'qwen-plus', 'qwen-max'],
    defaultModel: 'qwen-turbo'
  },
  {
    name: 'local',
    displayName: '本地模式（无需API）',
    baseUrl: '',
    models: [],
    defaultModel: ''
  }
]

// API 端点定义
export const apiEndpoints = {
  // 用户相关
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    profile: '/auth/profile'
  },
  // 评估相关
  assessment: {
    list: '/assessments',
    create: '/assessments',
    get: (id: string) => `/assessments/${id}`,
    delete: (id: string) => `/assessments/${id}`
  },
  // AI 解读
  ai: {
    interpret: '/ai/interpret'
  },
  // 数据同步
  sync: {
    upload: '/sync/upload',
    download: '/sync/download'
  }
}

// 构建完整 API URL
export function buildApiUrl(endpoint: string): string {
  if (!backendConfig.enabled) {
    throw new Error('后端服务未启用')
  }
  return `${backendConfig.baseUrl}/api/${backendConfig.apiVersion}${endpoint}`
}

// 通用 API 请求函数
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = buildApiUrl(endpoint)
  
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json'
  }
  
  // 从 localStorage 获取 token
  const token = localStorage.getItem('auth_token')
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`
  }
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers
    }
  })
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: '请求失败' }))
    throw new Error(error.message || `HTTP ${response.status}`)
  }
  
  return response.json()
}
