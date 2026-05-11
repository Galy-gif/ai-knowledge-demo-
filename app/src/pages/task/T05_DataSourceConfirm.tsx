import { useNavigate, useLocation } from 'react-router-dom'
import PageLayout from '../../components/layout/PageLayout'
import TopHeader from '../../components/layout/TopHeader'
import { CheckCircle, Database, RefreshCw } from 'lucide-react'

export default function T05_DataSourceConfirm() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const selectedKbNames: string[] = state?.selectedKbNames ?? []
  const dataSourceTitle = selectedKbNames.length === 0
    ? '未限定知识库'
    : selectedKbNames.length === 1
      ? selectedKbNames[0]
      : `${selectedKbNames.length} 个知识库`

  return (
    <PageLayout>
      <TopHeader title="数据源确认" showBack />
      <div className="px-5 py-6 space-y-5">
        {/* Success indicator */}
        <div className="flex items-center gap-3 p-4 bg-green-50 rounded-card border border-green-100">
          <CheckCircle size={20} className="text-green-500 flex-shrink-0" />
          <p className="text-body text-green-700 font-medium">轻应用生成成功！</p>
        </div>

        {/* App preview */}
        <div className="bg-white rounded-card-lg border border-line-base overflow-hidden shadow-card">
          <div className="bg-brand-orange px-4 py-3">
            <p className="text-white font-semibold">📊 资料速查工具</p>
          </div>
          <div className="p-4 space-y-2">
            {['竞品分析报告.pdf', '增长策略规划.docx', '用户访谈记录.txt'].map(f => (
              <div key={f} className="flex items-center gap-2 py-1.5 border-b border-line-base last:border-0">
                <Database size={14} className="text-ink-placeholder" />
                <p className="text-caption text-ink-secondary">{f}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Data source info */}
        <div className="space-y-3">
          <p className="text-caption text-ink-secondary font-medium">数据来源</p>
          <div className="flex items-center gap-3 p-3 bg-surface-card rounded-card">
            <span className="text-xl">💼</span>
            <div>
              <p className="text-body text-ink-primary font-medium">{dataSourceTitle}</p>
              <p className="text-caption text-ink-placeholder">
                {selectedKbNames.length > 0 ? selectedKbNames.join(' / ') : '将使用默认资料范围'} · 自动同步
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-caption text-ink-placeholder">
            <RefreshCw size={13} />
            <span>后续会自动同步知识库的最新内容</span>
          </div>
        </div>

        <button
          onClick={() => navigate('/ask/task-added-desktop')}
          className="w-full py-4 bg-brand-orange text-white rounded-btn text-body font-medium"
        >
          添加到桌面
        </button>
        <button
          onClick={() => navigate('/pwa/run/app1')}
          className="w-full py-3.5 text-ink-secondary text-body"
        >
          直接打开
        </button>
      </div>
    </PageLayout>
  )
}
