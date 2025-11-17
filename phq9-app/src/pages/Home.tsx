import { Link } from 'react-router-dom'
import { scales } from '../data/scales'
import { BarChart3, ArrowRight, Shield, Heart, Brain } from 'lucide-react'

export default function Home() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-full">
            <Brain className="w-12 h-12 text-primary-600 dark:text-primary-400" />
          </div>
        </div>
        
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          心理健康自评量表中心
        </h1>
        
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          科学、专业的心理健康自评工具，帮助您了解自身心理状态，
          结果仅供参考，不构成医疗诊断或治疗建议。
        </p>

        <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            <span>隐私保护</span>
          </div>
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4" />
            <span>专业可靠</span>
          </div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            <span>科学评估</span>
          </div>
        </div>
      </div>

      {/* Warning Notice */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <div className="text-amber-600 dark:text-amber-400 mt-1">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">重要提醒</h3>
            <ul className="text-amber-700 dark:text-amber-300 space-y-1 text-sm">
              <li>• 本工具用于健康教育与自我筛查，不能替代专业人员的临床诊断</li>
              <li>• 如症状明显、持续恶化、影响功能或存在自/他伤风险，请尽快联系专业人员</li>
              <li>• 所有数据均在本地处理，不会上传到任何服务器，保护您的隐私</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Scales Grid */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white text-center">
          可用量表
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.values(scales).map((scale) => (
            <div key={scale.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {scale.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    时间范围：{scale.timeframe}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    题目数：{scale.questions.length}
                  </p>
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {getScaleDescription(scale.id)}
                </p>
                
                <Link
                  to={`/assessment/${scale.id}`}
                  className="inline-flex items-center justify-center w-full px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors"
                >
                  开始评估
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white text-center mb-8">
          功能特色
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center space-y-3">
            <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center mx-auto">
              <BarChart3 className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">多量表支持</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">支持多种心理健康评估量表</p>
          </div>
          
          <div className="text-center space-y-3">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto">
              <Heart className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">隐私保护</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">所有数据本地处理，不上传服务器</p>
          </div>
          
          <div className="text-center space-y-3">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto">
              <div className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">历史记录</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">保存评估历史，追踪变化趋势</p>
          </div>
          
          <div className="text-center space-y-3">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto">
              <Shield className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">专业建议</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">基于评估结果提供专业建议</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function getScaleDescription(scaleId: string): string {
  const descriptions: Record<string, string> = {
    phq9: '国际广泛使用的抑郁症筛查量表，适合初步自我筛查',
    gad7: '广泛性焦虑障碍筛查量表，评估焦虑症状严重程度',
    phq2: '抑郁快速筛查工具，用于初步风险评估',
    dass21: '评估抑郁、焦虑和压力三个维度的综合量表',
    audit10: '酒精使用障碍识别测试，评估酒精使用相关问题',
    pss10: '评估个体感知到的压力水平',
    phq15: '评估躯体化症状的严重程度',
    isi: '失眠严重程度指数，评估睡眠问题',
    k10: '心理困扰量表，评估心理健康状况',
    who5: '主观幸福感指数，评估积极心理健康状态',
    gad2: '焦虑快速筛查工具，用于初步风险评估',
    auditc: '酒精使用筛查工具，快速评估饮酒风险'
  }
  return descriptions[scaleId] || '专业心理健康评估工具'
}