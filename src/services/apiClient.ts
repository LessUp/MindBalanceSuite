/**
 * API 客户端服务
 * 提供与后端服务的通信功能
 */

import { backendConfig } from '../config/api'

// Token 存储键
const TOKEN_KEY = 'mindbalance_token'

// 获取存储的 Token
export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

// 设置 Token
export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
}

// 清除 Token
export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY)
}

// 检查后端是否启用
export function isBackendEnabled(): boolean {
  return backendConfig.enabled
}

// 构建 API URL
function buildUrl(endpoint: string): string {
  return `${backendConfig.baseUrl}/api/${backendConfig.apiVersion}${endpoint}`
}

// 通用请求函数
async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  if (!backendConfig.enabled) {
    throw new Error('后端服务未启用')
  }

  const url = buildUrl(endpoint)
  const token = getToken()

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  }

  const response = await fetch(url, {
    ...options,
    headers
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || `请求失败: ${response.status}`)
  }

  return data
}

// ========== 认证 API ==========

export interface LoginResponse {
  token: string
  user: {
    id: string
    email: string
    name: string | null
  }
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  const data = await request<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  })
  setToken(data.token)
  return data
}

export async function register(email: string, password: string, name?: string): Promise<LoginResponse> {
  const data = await request<LoginResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, name })
  })
  setToken(data.token)
  return data
}

export async function getProfile(): Promise<{
  id: string
  email: string
  name: string | null
  created_at: string
}> {
  return request('/auth/profile')
}

export async function updateProfile(updates: { name?: string; email?: string }): Promise<{
  id: string
  email: string
  name: string | null
}> {
  return request('/auth/profile', {
    method: 'PUT',
    body: JSON.stringify(updates)
  })
}

export async function changePassword(currentPassword: string, newPassword: string): Promise<{ message: string }> {
  return request('/auth/password', {
    method: 'PUT',
    body: JSON.stringify({ currentPassword, newPassword })
  })
}

export function logout(): void {
  clearToken()
}

// ========== 评估 API ==========

export interface AssessmentRecord {
  id: string
  scale_id: string
  scale_title: string
  total: number
  max: number
  label: string
  values: number[]
  created_at: string
}

export async function getAssessments(): Promise<AssessmentRecord[]> {
  return request('/assessments')
}

export async function createAssessment(data: {
  scaleId: string
  scaleTitle: string
  total: number
  max: number
  label: string
  values: number[]
}): Promise<AssessmentRecord> {
  return request('/assessments', {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

export async function deleteAssessment(id: string): Promise<{ message: string }> {
  return request(`/assessments/${id}`, {
    method: 'DELETE'
  })
}

// ========== 心情 API ==========

export interface MoodEntry {
  id: string
  mood: number
  note: string | null
  date: string
}

export async function getMoodEntries(days: number = 30): Promise<MoodEntry[]> {
  return request(`/mood?days=${days}`)
}

export async function addMoodEntry(mood: number, note?: string, date?: string): Promise<MoodEntry> {
  return request('/mood', {
    method: 'POST',
    body: JSON.stringify({ mood, note, date })
  })
}

// ========== 感恩 API ==========

export interface GratitudeEntry {
  id: string
  content: string
  created_at: string
}

export async function getGratitudeEntries(limit: number = 50): Promise<GratitudeEntry[]> {
  return request(`/gratitude?limit=${limit}`)
}

export async function addGratitudeEntry(content: string): Promise<GratitudeEntry> {
  return request('/gratitude', {
    method: 'POST',
    body: JSON.stringify({ content })
  })
}

export async function deleteGratitudeEntry(id: string): Promise<{ message: string }> {
  return request(`/gratitude/${id}`, {
    method: 'DELETE'
  })
}

// ========== 统计 API ==========

export interface UserStats {
  totalAssessments: number
  scaleStats: Array<{
    scale_id: string
    scale_title: string
    count: number
    avg_percentage: number
    last_assessment: string
  }>
  moodTrend: Array<{
    date: string
    mood: number
  }>
  gratitudeCount: number
  streakDays: number
}

export async function getStats(): Promise<UserStats> {
  return request('/stats')
}

// ========== 同步 API ==========

export interface SyncData {
  assessments: AssessmentRecord[]
  moodEntries: MoodEntry[]
  gratitudeEntries: GratitudeEntry[]
}

export async function uploadData(data: {
  assessments?: any[]
  moodEntries?: any[]
  gratitudeEntries?: any[]
}): Promise<{ message: string }> {
  return request('/sync/upload', {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

export async function downloadData(): Promise<SyncData> {
  return request('/sync/download')
}

// ========== AI 解读 API ==========

export interface AIInterpretation {
  summary: string
  insights: string[]
  suggestions: string[]
  warning: string | null
  timestamp: number
}

export async function getAIInterpretation(
  provider: 'openai' | 'deepseek' | 'qwen',
  result: { total: number; max: number; label: string },
  scale: { title: string; timeframe: string },
  model?: string
): Promise<AIInterpretation> {
  return request('/ai/interpret', {
    method: 'POST',
    body: JSON.stringify({ provider, model, result, scale })
  })
}

// ========== 健康检查 API ==========

export interface HealthStatus {
  status: string
  timestamp: string
  version: string
  services: {
    database: string
    ai: {
      openai: boolean
      deepseek: boolean
      qwen: boolean
    }
  }
}

export async function checkHealth(): Promise<HealthStatus> {
  const response = await fetch(`${backendConfig.baseUrl}/api/health`)
  return response.json()
}
