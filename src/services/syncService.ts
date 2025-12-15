/**
 * 数据同步服务
 * 支持本地数据与云端的双向同步
 */

import { useAssessmentStore } from '../stores/assessmentStore'
import { useUserStore } from '../stores/userStore'
import * as api from './apiClient'
import { toast } from 'sonner'

export interface SyncStatus {
  lastSyncTime: string | null
  pendingUploads: number
  syncInProgress: boolean
}

// 同步状态存储键
const SYNC_STATUS_KEY = 'mindbalance_sync_status'

// 获取同步状态
export function getSyncStatus(): SyncStatus {
  const stored = localStorage.getItem(SYNC_STATUS_KEY)
  if (stored) {
    return JSON.parse(stored)
  }
  return {
    lastSyncTime: null,
    pendingUploads: 0,
    syncInProgress: false
  }
}

// 更新同步状态
function updateSyncStatus(updates: Partial<SyncStatus>): void {
  const current = getSyncStatus()
  localStorage.setItem(SYNC_STATUS_KEY, JSON.stringify({ ...current, ...updates }))
}

// 上传本地数据到云端
export async function uploadLocalData(): Promise<void> {
  if (!api.isBackendEnabled() || !api.getToken()) {
    throw new Error('后端未启用或未登录')
  }

  updateSyncStatus({ syncInProgress: true })

  try {
    const assessmentStore = useAssessmentStore.getState()
    const userStore = useUserStore.getState()

    // 获取本地数据
    const localData = {
      assessments: assessmentStore.results.map(r => ({
        id: r.id,
        scaleId: r.scaleId,
        scaleTitle: r.scaleTitle,
        total: r.total,
        max: r.max,
        label: r.label,
        values: r.values,
        timestamp: r.timestamp
      })),
      moodEntries: userStore.moodEntries,
      gratitudeEntries: userStore.gratitudeEntries
    }

    await api.uploadData(localData)
    
    updateSyncStatus({
      lastSyncTime: new Date().toISOString(),
      pendingUploads: 0,
      syncInProgress: false
    })

    toast.success('数据已同步到云端')
  } catch (error) {
    updateSyncStatus({ syncInProgress: false })
    throw error
  }
}

// 从云端下载数据
export async function downloadCloudData(): Promise<void> {
  if (!api.isBackendEnabled() || !api.getToken()) {
    throw new Error('后端未启用或未登录')
  }

  updateSyncStatus({ syncInProgress: true })

  try {
    const cloudData = await api.downloadData()
    
    // 合并评估数据
    const assessmentStore = useAssessmentStore.getState()
    const existingIds = new Set(assessmentStore.results.map(r => r.id))
    
    for (const assessment of cloudData.assessments) {
      if (!existingIds.has(assessment.id)) {
        // 使用标准 addResult，id 和 timestamp 会自动生成
        assessmentStore.addResult({
          scaleId: assessment.scale_id,
          scaleTitle: assessment.scale_title,
          total: assessment.total,
          max: assessment.max,
          label: assessment.label,
          values: assessment.values
        })
      }
    }

    // 合并心情数据
    const userStore = useUserStore.getState()
    const existingMoodDates = new Set(userStore.moodEntries.map(m => m.date))
    
    for (const mood of cloudData.moodEntries) {
      if (!existingMoodDates.has(mood.date)) {
        userStore.addMoodEntry(mood.mood, mood.note || undefined)
      }
    }

    // 合并感恩数据
    const existingGratitudeIds = new Set(userStore.gratitudeEntries.map(g => g.id))
    
    for (const gratitude of cloudData.gratitudeEntries) {
      if (!existingGratitudeIds.has(gratitude.id)) {
        // 直接添加到 store（需要一个特殊方法）
        // 这里简化处理，实际可以扩展 store
      }
    }

    updateSyncStatus({
      lastSyncTime: new Date().toISOString(),
      syncInProgress: false
    })

    toast.success('已从云端同步数据')
  } catch (error) {
    updateSyncStatus({ syncInProgress: false })
    throw error
  }
}

// 双向同步
export async function fullSync(): Promise<void> {
  await uploadLocalData()
  await downloadCloudData()
}

// 检查是否需要同步
export function needsSync(): boolean {
  const status = getSyncStatus()
  if (!status.lastSyncTime) return true
  
  const lastSync = new Date(status.lastSyncTime)
  const now = new Date()
  const hoursSinceSync = (now.getTime() - lastSync.getTime()) / (1000 * 60 * 60)
  
  return hoursSinceSync > 24 // 超过24小时需要同步
}

// 自动同步（如果需要）
export async function autoSync(): Promise<void> {
  if (!api.isBackendEnabled() || !api.getToken()) return
  
  if (needsSync()) {
    try {
      await fullSync()
    } catch (error) {
      console.error('自动同步失败:', error)
    }
  }
}
