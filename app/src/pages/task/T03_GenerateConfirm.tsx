import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ChevronRight, Cpu, Database, Globe, Pen } from 'lucide-react'
import PageLayout from '../../components/layout/PageLayout'
import TopHeader from '../../components/layout/TopHeader'
import { getPwaTemplateById } from '../../mock/pwaTemplates'
import DataSourceSelectorSheet from '../../components/common/DataSourceSelectorSheet'
import FeaturesEditSheet from '../../components/common/FeaturesEditSheet'
import AccessModeSheet, { type AccessModeId, ACCESS_MODE_LABELS, DEFAULT_ACCESS_MODES } from '../../components/common/AccessModeSheet'

const CUSTOM_REQ_PLACEHOLDERS: Record<string, string> = {
  'diet-log': '如：我想让它能扫描食物图片自动识别',
  'fitness-planner': '如：我希望它能根据心率自动推荐训练强度',
  'fund-portfolio': '如：我想要每天的涨跌推送，且能模拟买卖',
  'travel-plan': '如：我想让它显示天气、汇率，按预算推荐景点',
}
const DEFAULT_CUSTOM_REQ_PLACEHOLDER = '如：我想让它具备 XX 功能'

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
  const templateId: string | undefined = state?.templateId ?? template?.id

  const initFeatures = (state?.selectedFeatures as string[] | undefined)
    ?? template?.defaultFeatures
    ?? templateCoreFeatures.split('、').map((s: string) => s.trim())

  const [selectedKbIds, setSelectedKbIds] = useState<string[]>(state?.selectedKbIds ?? [])
  const [selectedKbNames, setSelectedKbNames] = useState<string[]>(state?.selectedKbNames ?? [])
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(initFeatures)
  const [selectedAccessModes, setSelectedAccessModes] = useState<AccessModeId[]>(
    (state?.selectedAccessModes as AccessModeId[] | undefined) ?? DEFAULT_ACCESS_MODES
  )
  const [customRequirement, setCustomRequirement] = useState<string>(state?.customRequirement ?? '')
  const [showSourceSheet, setShowSourceSheet] = useState(false)
  const [showFeaturesSheet, setShowFeaturesSheet] = useState(false)
  const [showAccessSheet, setShowAccessSheet] = useState(false)

  const handleApplySources = (ids: string[], names: string[]) => {
    setSelectedKbIds(ids)
    setSelectedKbNames(names)
  }

  const canStart = selectedKbIds.length > 0

  const dataSourceMainLabel = selectedKbIds.length === 0
    ? null
    : `已选 ${selectedKbIds.length} 个知识库`

  const dataSourceSubLabel = selectedKbNames.length > 0
    ? selectedKbNames.slice(0, 3).join('、') + (selectedKbNames.length > 3 ? '...' : '')
    : undefined

  const accessModeLabel = selectedAccessModes
    .map(m => ACCESS_MODE_LABELS[m])
    .join(' + ')

  const handleStart = () => {
    if (!canStart) return
    navigate('/ask/task-generating', {
      state: {
        requirement,
        templateId,
        templateName,
        templateIcon,
        templateCoreFeatures,
        targetRuntimeType: state?.targetRuntimeType ?? template?.targetRuntimeType,
        resultAppName: state?.resultAppName ?? template?.resultAppName,
        resultAppId: state?.resultAppId ?? template?.resultAppId,
        resultMainColor: state?.resultMainColor ?? template?.resultMainColor,
        selectedKbIds,
        selectedKbNames,
        selectedFeatures,
        selectedAccessModes,
        customRequirement,
        sourcePath,
        sourceState,
      },
    })
  }

  return (
    <PageLayout>
      <TopHeader title="生成确认" showBack />
      <div className="px-5 py-6 space-y-6">
        {/* App icon + name */}
        <div className="text-center">
          <div className="w-20 h-20 bg-brand-orange-light rounded-card-xl flex items-center justify-center mx-auto mb-4 text-4xl">
            {templateIcon}
          </div>
          <h2 className="text-h1 text-ink-primary">{templateName}</h2>
          <p className="text-body text-ink-secondary mt-2">{templateCoreFeatures}</p>
        </div>

        <div className="space-y-3">
          {/* Data source row */}
          <button
            onClick={() => setShowSourceSheet(true)}
            className="w-full flex items-center gap-4 p-4 bg-surface-card rounded-card text-left active:bg-line-base/40 transition-colors border border-line-base"
          >
            <div className="w-10 h-10 bg-brand-orange-light rounded-card flex items-center justify-center flex-shrink-0">
              <Database size={18} className="text-brand-orange" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] leading-5 text-ink-secondary">数据源</p>
              {dataSourceMainLabel ? (
                <>
                  <p className="text-body text-ink-primary font-semibold">{dataSourceMainLabel}</p>
                  {dataSourceSubLabel && (
                    <p className="text-[11px] text-ink-placeholder leading-4 truncate mt-0.5">
                      {dataSourceSubLabel}
                    </p>
                  )}
                </>
              ) : (
                <p className="text-body font-semibold" style={{ color: '#FF7A00' }}>
                  请选择知识库 →
                </p>
              )}
            </div>
            <ChevronRight size={16} className="text-ink-placeholder flex-shrink-0" />
          </button>

          {/* Features row */}
          <button
            onClick={() => setShowFeaturesSheet(true)}
            className="w-full flex items-center gap-4 p-4 bg-surface-card rounded-card text-left active:bg-line-base/40 transition-colors border border-line-base"
          >
            <div className="w-10 h-10 bg-brand-orange-light rounded-card flex items-center justify-center flex-shrink-0">
              <Cpu size={18} className="text-brand-orange" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-caption text-ink-placeholder mb-1.5">功能模块</p>
              <div className="flex flex-wrap gap-1.5">
                {selectedFeatures.map(f => (
                  <span
                    key={f}
                    className="text-[11px] px-2 py-0.5 bg-brand-orange text-white rounded-pill font-medium"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>
            <ChevronRight size={16} className="text-ink-placeholder flex-shrink-0" />
          </button>

          {/* Access mode row */}
          <button
            onClick={() => setShowAccessSheet(true)}
            className="w-full flex items-center gap-4 p-4 bg-surface-card rounded-card text-left active:bg-line-base/40 transition-colors border border-line-base"
          >
            <div className="w-10 h-10 bg-brand-orange-light rounded-card flex items-center justify-center flex-shrink-0">
              <Globe size={18} className="text-brand-orange" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-caption text-ink-placeholder">访问方式</p>
              <p className="text-body text-ink-primary font-medium">{accessModeLabel}</p>
            </div>
            <ChevronRight size={16} className="text-ink-placeholder flex-shrink-0" />
          </button>
        </div>

        {/* Custom requirement block */}
        <div className="p-[14px] bg-white rounded-card border border-line-base">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-brand-orange-light rounded-card flex items-center justify-center flex-shrink-0">
              <Pen size={15} className="text-brand-orange" />
            </div>
            <p className="text-[13px] text-ink-secondary">补充需求（可选）</p>
          </div>
          <textarea
            value={customRequirement}
            onChange={e => setCustomRequirement(e.target.value)}
            placeholder={CUSTOM_REQ_PLACEHOLDERS[templateId ?? ''] ?? DEFAULT_CUSTOM_REQ_PLACEHOLDER}
            rows={3}
            className="w-full text-[13px] text-ink-primary bg-transparent resize-none outline-none placeholder:text-ink-placeholder leading-5"
            style={{ maxHeight: '72px' }}
          />
        </div>

        <p className="text-caption text-ink-placeholder text-center">预计生成时间 30-60 秒</p>

        <button
          onClick={handleStart}
          disabled={!canStart}
          className={`w-full py-4 rounded-btn text-body font-medium flex items-center justify-center gap-2 transition-colors ${
            canStart
              ? 'bg-brand-orange text-white'
              : 'bg-[#FFE4D0] text-white cursor-default'
          }`}
        >
          开始生成 →
        </button>
      </div>

      <DataSourceSelectorSheet
        open={showSourceSheet}
        selectedIds={selectedKbIds}
        templateId={templateId}
        onClose={() => setShowSourceSheet(false)}
        onApply={handleApplySources}
      />

      <FeaturesEditSheet
        open={showFeaturesSheet}
        templateId={templateId}
        selectedFeatures={selectedFeatures}
        onClose={() => setShowFeaturesSheet(false)}
        onApply={setSelectedFeatures}
      />

      <AccessModeSheet
        open={showAccessSheet}
        selected={selectedAccessModes}
        onClose={() => setShowAccessSheet(false)}
        onApply={setSelectedAccessModes}
      />
    </PageLayout>
  )
}
