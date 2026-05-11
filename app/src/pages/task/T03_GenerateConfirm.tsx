import { useNavigate, useLocation } from 'react-router-dom'
import PageLayout from '../../components/layout/PageLayout'
import TopHeader from '../../components/layout/TopHeader'
import { Database, Cpu, Globe } from 'lucide-react'

export default function T03_GenerateConfirm() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const selectedKbIds: string[] = state?.selectedKbIds ?? []
  const selectedKbNames: string[] = state?.selectedKbNames ?? []
  const dataSourceLabel = selectedKbNames.length === 0
    ? '未限定知识库'
    : selectedKbNames.length === 1
      ? `${selectedKbNames[0]}`
      : `${selectedKbNames.length} 个知识库`

  return (
    <PageLayout>
      <TopHeader title="生成确认" showBack />
      <div className="px-5 py-6 space-y-6">
        <div className="text-center">
          <div className="w-20 h-20 bg-brand-orange-light rounded-card-xl flex items-center justify-center mx-auto mb-4 text-4xl">
            📊
          </div>
          <h2 className="text-h1 text-ink-primary">资料速查工具</h2>
          <p className="text-body text-ink-secondary mt-2">AI 将基于以下配置为你生成专属轻应用</p>
        </div>

        <div className="space-y-3">
          {[
            { icon: Database, label: '数据源', value: dataSourceLabel },
            { icon: Cpu, label: '功能模块', value: '检索 · 对比 · 导出' },
            { icon: Globe, label: '访问方式', value: '可添加到桌面，离线可用' },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-4 p-4 bg-surface-card rounded-card">
              <div className="w-10 h-10 bg-brand-orange-light rounded-card flex items-center justify-center flex-shrink-0">
                <Icon size={18} className="text-brand-orange" />
              </div>
              <div>
                <p className="text-caption text-ink-placeholder">{label}</p>
                <p className="text-body text-ink-primary font-medium">{value}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="text-caption text-ink-placeholder text-center">预计生成时间 30-60 秒</p>

        <button
          onClick={() => navigate('/ask/task-generating', { state: { selectedKbIds, selectedKbNames } })}
          className="w-full py-4 bg-brand-orange text-white rounded-btn text-body font-medium flex items-center justify-center gap-2"
        >
          开始生成 →
        </button>
      </div>
    </PageLayout>
  )
}
