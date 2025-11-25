/**
 * 数据导出工具
 */

import type { AssessmentResult } from '../stores/assessmentStore'
import type { MoodEntry, GratitudeEntry } from '../stores/userStore'

export interface ExportData {
  exportDate: string
  version: string
  assessments: AssessmentResult[]
  moodEntries?: MoodEntry[]
  gratitudeEntries?: GratitudeEntry[]
}

// 导出为JSON文件
export function exportToJSON(
  assessments: AssessmentResult[],
  moodEntries?: MoodEntry[],
  gratitudeEntries?: GratitudeEntry[]
): void {
  const data: ExportData = {
    exportDate: new Date().toISOString(),
    version: '1.0.0',
    assessments,
    moodEntries,
    gratitudeEntries
  }

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  downloadBlob(blob, `mindbalance-export-${formatDate(new Date())}.json`)
}

// 导出为CSV文件
export function exportToCSV(assessments: AssessmentResult[]): void {
  const headers = ['日期', '量表', '得分', '满分', '结果', '百分比']
  const rows = assessments.map(r => [
    new Date(r.timestamp).toLocaleString('zh-CN'),
    r.scaleTitle,
    r.total.toString(),
    r.max.toString(),
    r.label,
    `${Math.round((r.total / r.max) * 100)}%`
  ])

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n')

  // 添加BOM以支持中文
  const BOM = '\uFEFF'
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8' })
  downloadBlob(blob, `mindbalance-assessments-${formatDate(new Date())}.csv`)
}

// 导出为PDF报告
export async function exportToPDF(
  assessments: AssessmentResult[],
  userName?: string
): Promise<void> {
  // 生成HTML报告
  const html = generateReportHTML(assessments, userName)
  
  // 创建打印窗口
  const printWindow = window.open('', '_blank')
  if (!printWindow) {
    throw new Error('无法打开打印窗口')
  }

  printWindow.document.write(html)
  printWindow.document.close()
  
  // 等待样式加载后打印
  printWindow.onload = () => {
    printWindow.print()
  }
}

// 生成HTML报告
function generateReportHTML(assessments: AssessmentResult[], userName?: string): string {
  const now = new Date()
  
  // 统计数据
  const stats = {
    total: assessments.length,
    avgScore: assessments.length > 0 
      ? Math.round(assessments.reduce((sum, r) => sum + (r.total / r.max) * 100, 0) / assessments.length) 
      : 0,
    scaleCount: {} as Record<string, number>
  }
  
  assessments.forEach(r => {
    stats.scaleCount[r.scaleTitle] = (stats.scaleCount[r.scaleTitle] || 0) + 1
  })

  return `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>心理健康评估报告</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #333;
      padding: 40px;
      max-width: 800px;
      margin: 0 auto;
    }
    .header {
      text-align: center;
      margin-bottom: 40px;
      padding-bottom: 20px;
      border-bottom: 2px solid #6366f1;
    }
    .header h1 { color: #6366f1; font-size: 28px; margin-bottom: 8px; }
    .header p { color: #666; font-size: 14px; }
    .section { margin-bottom: 30px; }
    .section h2 { 
      font-size: 18px; 
      color: #1f2937; 
      margin-bottom: 15px;
      padding-bottom: 8px;
      border-bottom: 1px solid #e5e7eb;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      margin-bottom: 30px;
    }
    .stat-card {
      background: #f9fafb;
      padding: 20px;
      border-radius: 8px;
      text-align: center;
    }
    .stat-value { font-size: 32px; font-weight: bold; color: #6366f1; }
    .stat-label { font-size: 12px; color: #6b7280; margin-top: 4px; }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 14px;
    }
    th, td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #e5e7eb;
    }
    th { background: #f9fafb; font-weight: 600; }
    .badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 500;
    }
    .badge-success { background: #d1fae5; color: #065f46; }
    .badge-warning { background: #fef3c7; color: #92400e; }
    .badge-danger { background: #fee2e2; color: #991b1b; }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      text-align: center;
      font-size: 12px;
      color: #9ca3af;
    }
    @media print {
      body { padding: 20px; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>🧠 心理健康评估报告</h1>
    <p>${userName ? `用户：${userName} · ` : ''}生成时间：${now.toLocaleString('zh-CN')}</p>
  </div>

  <div class="stats-grid">
    <div class="stat-card">
      <div class="stat-value">${stats.total}</div>
      <div class="stat-label">评估总次数</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">${stats.avgScore}%</div>
      <div class="stat-label">平均得分率</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">${Object.keys(stats.scaleCount).length}</div>
      <div class="stat-label">使用量表数</div>
    </div>
  </div>

  <div class="section">
    <h2>评估历史记录</h2>
    <table>
      <thead>
        <tr>
          <th>日期</th>
          <th>量表</th>
          <th>得分</th>
          <th>结果</th>
        </tr>
      </thead>
      <tbody>
        ${assessments.slice(0, 50).map(r => `
          <tr>
            <td>${new Date(r.timestamp).toLocaleDateString('zh-CN')}</td>
            <td>${r.scaleTitle}</td>
            <td>${r.total}/${r.max} (${Math.round((r.total / r.max) * 100)}%)</td>
            <td><span class="badge ${getBadgeClass(r.label)}">${r.label}</span></td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    ${assessments.length > 50 ? `<p style="text-align: center; margin-top: 10px; color: #9ca3af;">显示前50条记录，共${assessments.length}条</p>` : ''}
  </div>

  <div class="footer">
    <p>本报告由 MindBalance Suite 生成</p>
    <p>仅供参考，不能替代专业医疗诊断</p>
  </div>
</body>
</html>
`
}

// 获取徽章样式类
function getBadgeClass(label: string): string {
  const lower = label.toLowerCase()
  if (lower.includes('正常') || lower.includes('minimal') || lower.includes('低') || lower.includes('良好')) {
    return 'badge-success'
  }
  if (lower.includes('重') || lower.includes('severe') || lower.includes('高')) {
    return 'badge-danger'
  }
  return 'badge-warning'
}

// 格式化日期
function formatDate(date: Date): string {
  return date.toISOString().split('T')[0]
}

// 下载Blob文件
function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
