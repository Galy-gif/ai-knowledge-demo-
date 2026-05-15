import { useLocation, useNavigate } from 'react-router-dom'
import PageLayout from '../../components/layout/PageLayout'
import { RefreshCw } from 'lucide-react'

const RESULT_COLOR_BG: Record<string, string> = {
  purple: '#EDE9FE',
  orange: '#FFF1E6',
  green: '#D1FAE5',
  blue: '#DBEAFE',
}

export default function T06_AddedToDesktop() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const resultAppName: string = state?.resultAppName ?? state?.templateName ?? '资料速查工具'
  const resultAppId: string = state?.resultAppId ?? 'app_words'
  const resultMainColor: string = state?.resultMainColor ?? 'orange'
  const templateIcon: string = state?.templateIcon ?? '📊'

  const iconBg = RESULT_COLOR_BG[resultMainColor] ?? '#FFF1E6'

  return (
    <PageLayout>
      <div className="flex flex-col items-center justify-center h-full px-8 text-center bg-pwa-bg">
        <div
          className="w-24 h-24 rounded-card-xl shadow-card flex items-center justify-center text-5xl mb-6"
          style={{ backgroundColor: iconBg }}
        >
          {templateIcon}
        </div>
        <p className="text-caption text-ink-placeholder mb-2">{resultAppName}</p>

        <h1 className="text-h1 text-ink-primary mb-3">已添加到桌面</h1>
        <p className="text-body text-ink-secondary mb-2">现在可以从桌面直接打开</p>
        <p className="text-body text-ink-secondary mb-8">脱离 App 也能独立使用</p>

        <div className="flex items-center gap-2 mb-8 text-caption text-ink-placeholder">
          <RefreshCw size={13} />
          <span>后续会自动同步知识库的最新内容</span>
        </div>

        <div className="w-full space-y-3">
          <button
            onClick={() => navigate(`/pwa/run/${resultAppId}`)}
            className="w-full py-4 bg-brand-orange text-white rounded-btn text-body font-medium"
          >
            立即打开
          </button>
          <button
            onClick={() => navigate('/knowledge')}
            className="w-full py-3.5 text-ink-secondary text-body"
          >
            返回知识库
          </button>
        </div>
      </div>
    </PageLayout>
  )
}
