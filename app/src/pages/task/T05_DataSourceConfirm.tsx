import { useNavigate, useLocation } from 'react-router-dom'
import PageLayout from '../../components/layout/PageLayout'
import TopHeader from '../../components/layout/TopHeader'
import { CheckCircle, RefreshCw } from 'lucide-react'
import type { TravelPreferences } from '../../mock/data'

const RESULT_COLOR_BG: Record<string, string> = {
  purple: '#EDE9FE',
  orange: '#FFF1E6',
  green: '#D1FAE5',
  blue: '#DBEAFE',
  teal: '#CCFBF1',
}

const RESULT_COLOR_HEADER: Record<string, string> = {
  purple: '#6D28D9',
  orange: '#FF7A00',
  green: '#047857',
  blue: '#1D4ED8',
  teal: '#14B8A6',
}

const TEMPLATE_FILE_LISTS: Record<string, string[]> = {
  'diet-log': ['今日早餐 · 燕麦粥 380 kcal', '今日午餐 · 鸡胸沙拉 520 kcal', '今日加餐 · 蓝莓酸奶 180 kcal', '营养目标：1500 kcal / 天'],
  'fitness-planner': ['晨间拉伸 · 7 分钟 · 3 项动作', '上肢力量 · 25 分钟 · 6 项动作', '核心训练 · 13 分钟 · 4 项动作', '本周目标：4 天训练'],
  'fund-portfolio': ['易方达消费精选 · ¥34,500 (+2.3%)', '中欧医疗健康 · ¥18,720 (-0.8%)', '招商中证白酒 · ¥42,800 (+1.5%)', '兴全合宜 · ¥52,150 (+0.9%)'],
  'watchlist-helper': ['漫长的季节 · 第 8 集 / 12 集', '繁花 · 想看 · 推荐指数 9.2', '星际穿越 · 已看 · 评分 9.4', '电影深度评论 · 悬疑题材长评'],
  'reading-shelf': ['AI Agent 浏览器趋势 · 少数派 · 8 分钟', '把稍后读变成每日输入系统 · 微信公众号', '从 RSS 到知识库的自动化流程 · 知乎', '本周阅读燃尽 · 完成率 43%'],
  'doc-pack': ['LangGraph 状态机设计笔记 · 已处理', 'SWE-bench 排行解读 · 已处理', 'BrowserGym 任务集说明 · 待处理', 'PC 多标签 · 12 个资料'],
  'interview-bank': ['算法 · 二叉树遍历 · 已掌握', 'HR 面 · 职业规划 · 学习中', '项目 · 系统设计 · 新题', '行为 · 团队协作 · 学习中'],
  'travel-plan': ['第 1 天 · 大阪城公园 + 道顿堀', '第 2 天 · 奈良公园 + 春日大社', '第 3 天 · 清水寺 + 伏见稻荷', '预算规划 · ¥8,000 / 7 天'],
}

const DEFAULT_FILES = ['资料条目 1', '资料条目 2', '资料条目 3']

export default function T05_DataSourceConfirm() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const templateId: string | undefined = state?.templateId
  const templateIcon: string = state?.templateIcon ?? '📊'
  const resultAppName: string = state?.resultAppName ?? state?.templateName ?? '资料速查工具'
  const resultAppId: string = state?.resultAppId ?? 'app_words'
  const resultMainColor: string = state?.resultMainColor ?? 'orange'
  const selectedKbNames: string[] = state?.selectedKbNames ?? []
  const selectedFeatures: string[] | undefined = state?.selectedFeatures
  const customRequirement: string | undefined = state?.customRequirement
  const travelPreferences: TravelPreferences | undefined = state?.travelPreferences
  const sourcePath: string | undefined = state?.sourcePath
  const sourceState = state?.sourceState

  const headerBg = RESULT_COLOR_HEADER[resultMainColor] ?? '#FF7A00'
  const iconBg = RESULT_COLOR_BG[resultMainColor] ?? '#FFF1E6'
  const fileList = TEMPLATE_FILE_LISTS[templateId ?? ''] ?? DEFAULT_FILES

  const dataSourceTitle = selectedKbNames.length === 0
    ? '未限定资料包'
    : selectedKbNames.length === 1 ? selectedKbNames[0] : `${selectedKbNames.length} 个资料包`

  const passState = {
    requirement: state?.requirement,
    templateId,
    templateName: state?.templateName,
    templateIcon,
    resultAppName,
    resultAppId,
    resultMainColor,
    selectedKbIds: state?.selectedKbIds,
    selectedKbNames,
    selectedFeatures,
    customRequirement,
    travelPreferences,
    sourcePath,
    sourceState,
  }

  return (
    <PageLayout>
      <TopHeader title="应用预览" showBack />
      <div className="px-5 py-6 space-y-5">
        <div className="flex items-center gap-3 p-4 bg-green-50 rounded-card border border-green-100">
          <CheckCircle size={20} className="text-green-500 flex-shrink-0" />
          <p className="text-body text-green-700 font-medium">小应用生成成功！</p>
        </div>

        <div className="bg-white rounded-card-lg border border-line-base overflow-hidden shadow-card">
          <div className="px-4 py-3 flex items-center gap-2" style={{ backgroundColor: headerBg }}>
            <span
              className="w-8 h-8 rounded-[8px] flex items-center justify-center text-xl flex-shrink-0"
              style={{ backgroundColor: 'rgba(255,255,255,0.25)' }}
            >
              {templateIcon}
            </span>
            <p className="text-white font-semibold">{resultAppName}</p>
          </div>
          <div className="p-4 space-y-2">
            {fileList.map(f => (
              <div key={f} className="flex items-center gap-2 py-1.5 border-b border-line-base last:border-0">
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: headerBg }} />
                <p className="text-caption text-ink-secondary">{f}</p>
              </div>
            ))}
            {selectedFeatures && selectedFeatures.length > 0 && (
              <div className="pt-2 flex flex-wrap gap-1.5">
                {selectedFeatures.map(f => (
                  <span key={f} className="text-[10px] px-2 py-0.5 rounded-pill" style={{ backgroundColor: `${headerBg}22`, color: headerBg }}>
                    {f}
                  </span>
                ))}
              </div>
            )}
            {customRequirement && (
              <p className="text-caption pt-1" style={{ color: headerBg }}>
                ✓ 已包含你的补充需求
              </p>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-caption text-ink-secondary font-medium">数据来源</p>
          <div className="flex items-center gap-3 p-3 rounded-card" style={{ backgroundColor: iconBg }}>
            <span className="text-xl">{templateIcon}</span>
            <div>
              <p className="text-body text-ink-primary font-medium">{dataSourceTitle}</p>
              <p className="text-caption text-ink-placeholder">
                {selectedKbNames.length > 0
                    ? `${selectedKbNames.join(' / ')} · 自动同步`
                    : '将使用默认资料范围'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-caption text-ink-placeholder">
            <RefreshCw size={13} />
            <span>后续会自动同步资料包的最新内容</span>
          </div>
        </div>

        <button
          onClick={() => navigate('/ask/task-added-desktop', { state: passState })}
          className="w-full py-4 bg-brand-orange text-white rounded-btn text-body font-medium"
        >
          添加到桌面
        </button>
        <button
          onClick={() => navigate(`/pwa/run/${resultAppId}`)}
          className="w-full py-3.5 text-ink-secondary text-body"
        >
          直接打开
        </button>
      </div>
    </PageLayout>
  )
}
