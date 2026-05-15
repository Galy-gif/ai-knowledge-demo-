import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import PageLayout from '../../components/layout/PageLayout'
import TopHeader from '../../components/layout/TopHeader'
import { ChevronRight, Database, Cpu, Globe } from 'lucide-react'
import { getPwaTemplateById } from '../../mock/pwaTemplates'
import DataSourceSelectorSheet from '../../components/common/DataSourceSelectorSheet'

export default function T03_GenerateConfirm() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const template = getPwaTemplateById(state?.templateId)
  const templateName = state?.templateName ?? template?.name ?? '资料速查工具'
  const templateIcon = state?.templateIcon ?? template?.icon ?? '📊'
  const templateCoreFeatures = state?.templateCoreFeatures ?? template?.coreFeatures ?? 'AI 将基于以下配置为你生成专属轻应用'
  const requirement = state?.requirement ?? template?.requirement ?? '帮我做一个竞品数据速查工具'
  const sourcePath: string | undefined = state?.sourcePath
  const sourceState = state?.sourceState
  const [selectedKbIds, setSelectedKbIds] = useState<string[]>(state?.selectedKbIds ?? [])
  const [selectedKbNames, setSelectedKbNames] = useState<string[]>(state?.selectedKbNames ?? [])
  const [showSourceSheet, setShowSourceSheet] = useState(false)
  const dataSourceLabel = selectedKbNames.length === 0
    ? '未限定知识库（基于全部内容）'
    : selectedKbNames.length === 1
      ? `${selectedKbNames[0]}`
      : `${selectedKbNames[0]} + ${selectedKbNames.length - 1} 个`

  const handleApplySources = (ids: string[], names: string[]) => {
    setSelectedKbIds(ids)
    setSelectedKbNames(names)
  }

  return (
    <PageLayout>
      <TopHeader title="生成确认" showBack />
      <div className="px-5 py-6 space-y-6">
        <div className="text-center">
          <div className="w-20 h-20 bg-brand-orange-light rounded-card-xl flex items-center justify-center mx-auto mb-4 text-4xl">
            {templateIcon}
          </div>
          <h2 className="text-h1 text-ink-primary">{templateName}</h2>
          <p className="text-body text-ink-secondary mt-2">
            {templateCoreFeatures}
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => setShowSourceSheet(true)}
            className="w-full flex items-center gap-4 p-4 bg-surface-card rounded-card text-left active:bg-line-base/40 transition-colors"
          >
            <div className="w-10 h-10 bg-brand-orange-light rounded-card flex items-center justify-center flex-shrink-0">
              <Database size={18} className="text-brand-orange" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] leading-5 text-ink-secondary">数据源</p>
              <p className="text-body text-ink-primary font-semibold truncate">{dataSourceLabel}</p>
            </div>
            <ChevronRight size={16} className="text-ink-placeholder flex-shrink-0" />
          </button>

          <div className="flex items-center gap-4 p-4 bg-surface-card rounded-card">
            <div className="w-10 h-10 bg-brand-orange-light rounded-card flex items-center justify-center flex-shrink-0">
              <Cpu size={18} className="text-brand-orange" />
            </div>
            <div>
              <p className="text-caption text-ink-placeholder">功能模块</p>
              <p className="text-body text-ink-primary font-medium">{templateCoreFeatures.replaceAll('、', ' · ')}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-surface-card rounded-card">
            <div className="w-10 h-10 bg-brand-orange-light rounded-card flex items-center justify-center flex-shrink-0">
              <Globe size={18} className="text-brand-orange" />
            </div>
            <div>
              <p className="text-caption text-ink-placeholder">访问方式</p>
              <p className="text-body text-ink-primary font-medium">可添加到桌面，离线可用</p>
            </div>
          </div>
        </div>

        <p className="text-caption text-ink-placeholder text-center">预计生成时间 30-60 秒</p>

        <button
          onClick={() => navigate('/ask/task-generating', {
            state: {
              requirement,
              templateId: template?.id ?? state?.templateId,
              templateName,
              templateIcon,
              templateCoreFeatures,
              selectedKbIds,
              selectedKbNames,
              sourcePath,
              sourceState,
            },
          })}
          className="w-full py-4 bg-brand-orange text-white rounded-btn text-body font-medium flex items-center justify-center gap-2"
        >
          开始生成 →
        </button>
      </div>

      <DataSourceSelectorSheet
        open={showSourceSheet}
        selectedIds={selectedKbIds}
        onClose={() => setShowSourceSheet(false)}
        onApply={handleApplySources}
      />
    </PageLayout>
  )
}
