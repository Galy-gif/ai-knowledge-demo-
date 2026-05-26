import { useMemo, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, ChevronRight, Cpu, Database, Globe, MapPin, Minus, Pen, Plus } from 'lucide-react'
import PageLayout from '../../components/layout/PageLayout'
import TopHeader from '../../components/layout/TopHeader'
import { getPwaTemplateById } from '../../mock/pwaTemplates'
import DataSourceSelectorSheet from '../../components/common/DataSourceSelectorSheet'
import FeaturesEditSheet from '../../components/common/FeaturesEditSheet'
import AccessModeSheet, { type AccessModeId, ACCESS_MODE_LABELS, DEFAULT_ACCESS_MODES } from '../../components/common/AccessModeSheet'
import { useKnowledge } from '../../context/KnowledgeContext'
import type { TravelBudget, TravelCompanions, TravelPreferences } from '../../mock/data'

const TEMPLATE_DEFAULT_KB_IDS: Record<string, string[]> = {
  'diet-log': ['kb_diet', 'kb_nutrition_lab'],
  'fitness-planner': ['kb_training', 'kb_iron_gym'],
  'watchlist-helper': ['kb_film'],
  'travel-plan': ['kb_travel_food'],
}

const CUSTOM_REQ_PLACEHOLDERS: Record<string, string> = {
  'diet-log': '如：我想让它能扫描食物图片自动识别',
  'fitness-planner': '如：我希望它能根据心率自动推荐训练强度',
  'watchlist-helper': '如：希望能根据我的评分自动推荐相似剧集',
  'travel-plan': '如：希望避开人多景点、想体验温泉',
}
const DEFAULT_CUSTOM_REQ_PLACEHOLDER = '如：我想让它具备 XX 功能'

const BUDGET_OPTIONS: { id: TravelBudget; label: string }[] = [
  { id: 'budget', label: '经济 ¥5,000 以下' },
  { id: 'comfort', label: '舒适 ¥5,000-1.5万' },
  { id: 'premium', label: '精品 ¥1.5万-3万' },
  { id: 'luxury', label: '奢华 ¥3万以上' },
]

const HOTEL_OPTIONS = [
  { id: 'chain', label: '连锁酒店' },
  { id: 'premium', label: '精品酒店' },
  { id: 'local', label: '当地民宿' },
  { id: 'apartment', label: '公寓式' },
]

const TRIP_STYLE_OPTIONS = [
  { id: 'nature', label: '🏔️ 自然风光' },
  { id: 'city', label: '🏙️ 城市文化' },
  { id: 'history', label: '🏛️ 历史古迹' },
  { id: 'food', label: '🍜 美食探索' },
  { id: 'shopping', label: '🛍️ 购物娱乐' },
]

const COMPANION_OPTIONS: { id: TravelCompanions; label: string }[] = [
  { id: 'solo', label: '一人独行' },
  { id: 'couple', label: '情侣两人' },
  { id: 'family', label: '亲子家庭' },
  { id: 'friends', label: '朋友 3-5 人' },
]

const DEFAULT_TRAVEL_PREFS: TravelPreferences = {
  budget: 'comfort',
  hotelPrefs: ['premium'],
  tripStyles: ['history', 'food'],
  companions: 'couple',
  duration: 7,
}

const BUDGET_SUMMARY: Record<TravelBudget, string> = {
  budget: '经济 ¥5,000 以下',
  comfort: '舒适 ¥5,000-1.5万',
  premium: '精品 ¥1.5万-3万',
  luxury: '奢华 ¥3万以上',
}

const HOTEL_SUMMARY: Record<string, string> = {
  chain: '连锁酒店',
  premium: '精品酒店',
  local: '当地民宿',
  apartment: '公寓式',
}

const STYLE_SUMMARY: Record<string, string> = {
  nature: '自然',
  city: '城市',
  history: '历史',
  food: '美食',
  shopping: '购物',
}

const COMPANION_SUMMARY: Record<TravelCompanions, string> = {
  solo: '一人',
  couple: '情侣',
  family: '亲子',
  friends: '朋友',
}

function buildPrefsSummary(prefs: TravelPreferences): string {
  const parts: string[] = [BUDGET_SUMMARY[prefs.budget]]
  if (prefs.hotelPrefs.length > 0) {
    parts.push(prefs.hotelPrefs.map(h => HOTEL_SUMMARY[h] ?? h).join('/'))
  }
  if (prefs.tripStyles.length > 0) {
    parts.push(prefs.tripStyles.map(s => STYLE_SUMMARY[s] ?? s).join(' + '))
  }
  parts.push(COMPANION_SUMMARY[prefs.companions])
  parts.push(`${prefs.duration} 天`)
  return parts.join(' · ')
}

function Pill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1.5 rounded-pill text-[12px] leading-4 font-medium transition-colors whitespace-nowrap ${
        active
          ? 'bg-[#FFE4D0] text-brand-orange border-[1.5px] border-brand-orange'
          : 'bg-white text-ink-secondary border border-[#EEEEEE]'
      }`}
    >
      {children}
    </button>
  )
}

function TravelPrefsFields({
  prefs,
  onChange,
}: {
  prefs: TravelPreferences
  onChange: (next: TravelPreferences) => void
}) {
  const toggleArrayItem = (key: 'hotelPrefs' | 'tripStyles', id: string) => {
    const current = prefs[key]
    const next = current.includes(id) ? current.filter(i => i !== id) : [...current, id]
    onChange({ ...prefs, [key]: next })
  }

  const stepDuration = (delta: number) => {
    const next = Math.max(2, Math.min(30, prefs.duration + delta))
    onChange({ ...prefs, duration: next })
  }

  return (
    <div className="space-y-3.5">
      <div>
        <p className="text-[13px] leading-5 text-ink-primary mb-2">预算</p>
        <div className="flex flex-wrap gap-2">
          {BUDGET_OPTIONS.map(opt => (
            <Pill
              key={opt.id}
              active={prefs.budget === opt.id}
              onClick={() => onChange({ ...prefs, budget: opt.id })}
            >
              {opt.label}
            </Pill>
          ))}
        </div>
      </div>

      <div>
        <p className="text-[13px] leading-5 text-ink-primary mb-2">酒店偏好</p>
        <div className="flex flex-wrap gap-2">
          {HOTEL_OPTIONS.map(opt => (
            <Pill
              key={opt.id}
              active={prefs.hotelPrefs.includes(opt.id)}
              onClick={() => toggleArrayItem('hotelPrefs', opt.id)}
            >
              {opt.label}
            </Pill>
          ))}
        </div>
      </div>

      <div>
        <p className="text-[13px] leading-5 text-ink-primary mb-2">偏好类型（可多选）</p>
        <div className="flex flex-wrap gap-2">
          {TRIP_STYLE_OPTIONS.map(opt => (
            <Pill
              key={opt.id}
              active={prefs.tripStyles.includes(opt.id)}
              onClick={() => toggleArrayItem('tripStyles', opt.id)}
            >
              {opt.label}
            </Pill>
          ))}
        </div>
      </div>

      <div>
        <p className="text-[13px] leading-5 text-ink-primary mb-2">出行成员</p>
        <div className="flex flex-wrap gap-2">
          {COMPANION_OPTIONS.map(opt => (
            <Pill
              key={opt.id}
              active={prefs.companions === opt.id}
              onClick={() => onChange({ ...prefs, companions: opt.id })}
            >
              {opt.label}
            </Pill>
          ))}
        </div>
      </div>

      <div>
        <p className="text-[13px] leading-5 text-ink-primary mb-2">出行天数</p>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => stepDuration(-1)}
            disabled={prefs.duration <= 2}
            className="w-9 h-9 rounded-[10px] border border-[#EEEEEE] flex items-center justify-center disabled:opacity-40 active:bg-surface-card"
          >
            <Minus size={16} className="text-ink-secondary" strokeWidth={2} />
          </button>
          <p className="text-[18px] leading-6 font-semibold text-ink-primary tabular-nums w-8 text-center">{prefs.duration}</p>
          <button
            type="button"
            onClick={() => stepDuration(1)}
            disabled={prefs.duration >= 30}
            className="w-9 h-9 rounded-[10px] border border-[#EEEEEE] flex items-center justify-center disabled:opacity-40 active:bg-surface-card"
          >
            <Plus size={16} className="text-ink-secondary" strokeWidth={2} />
          </button>
          <span className="text-[13px] text-ink-secondary">天</span>
        </div>
      </div>
    </div>
  )
}

export default function T03_GenerateConfirm() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const { bases, subscribedBases } = useKnowledge()
  const template = getPwaTemplateById(state?.templateId)
  const templateName = state?.templateName ?? template?.name ?? '资料速查工具'
  const templateIcon = state?.templateIcon ?? template?.icon ?? '📊'
  const templateCoreFeatures = state?.templateCoreFeatures ?? template?.coreFeatures ?? 'AI 将基于以下配置为你生成专属轻应用'
  const requirement = state?.requirement ?? template?.requirement ?? '帮我做一个竞品数据速查工具'
  const sourcePath: string | undefined = state?.sourcePath
  const sourceState = state?.sourceState
  const templateId: string | undefined = state?.templateId ?? template?.id
  const isFromEdit = state?.fromEdit === true

  const initFeatures = (state?.selectedFeatures as string[] | undefined)
    ?? template?.defaultFeatures
    ?? templateCoreFeatures.split('、').map((s: string) => s.trim())

  const defaultKbs = useMemo(() => {
    const stateSelectedKbIds = state?.selectedKbIds as string[] | undefined
    if (stateSelectedKbIds && stateSelectedKbIds.length > 0) {
      return {
        ids: stateSelectedKbIds,
        names: (state.selectedKbNames as string[] | undefined) ?? [],
      }
    }
    const defaultIds = templateId ? TEMPLATE_DEFAULT_KB_IDS[templateId] ?? [] : []
    const allBases = [...bases, ...subscribedBases]
    const present = defaultIds
      .map(id => allBases.find(b => b.id === id))
      .filter((b): b is NonNullable<typeof b> => Boolean(b))
    return { ids: present.map(b => b.id), names: present.map(b => b.name) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templateId])

  const [selectedKbIds, setSelectedKbIds] = useState<string[]>(defaultKbs.ids)
  const [selectedKbNames, setSelectedKbNames] = useState<string[]>(defaultKbs.names)
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(initFeatures)
  const [selectedAccessModes, setSelectedAccessModes] = useState<AccessModeId[]>(
    (state?.selectedAccessModes as AccessModeId[] | undefined) ?? DEFAULT_ACCESS_MODES
  )
  const [customRequirement, setCustomRequirement] = useState<string>(state?.customRequirement ?? '')
  const [travelPrefs, setTravelPrefs] = useState<TravelPreferences>(
    (state?.travelPreferences as TravelPreferences | undefined) ?? DEFAULT_TRAVEL_PREFS
  )
  const [prefsConfigured, setPrefsConfigured] = useState<boolean>(state?.travelPreferences != null)
  const [prefsOpen, setPrefsOpen] = useState(false)
  const [showSourceSheet, setShowSourceSheet] = useState(false)
  const [showFeaturesSheet, setShowFeaturesSheet] = useState(false)
  const [showAccessSheet, setShowAccessSheet] = useState(false)

  const isTravel = templateId === 'travel-plan'

  const handlePrefsChange = (next: TravelPreferences) => {
    setTravelPrefs(next)
    setPrefsConfigured(true)
  }

  const handleApplySources = (ids: string[], names: string[]) => {
    setSelectedKbIds(ids)
    setSelectedKbNames(names)
  }

  const canStart = selectedKbIds.length > 0

  const dataSourceMainLabel = selectedKbIds.length === 0
    ? null
    : selectedKbNames.length > 0
      ? selectedKbNames.slice(0, 3).join('、') + (selectedKbNames.length > 3 ? '…' : '')
      : `已选 ${selectedKbIds.length} 个兴趣库`

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
        travelPreferences: isTravel ? travelPrefs : undefined,
        sourcePath,
        sourceState,
      },
    })
  }

  return (
    <PageLayout>
      <TopHeader title={isFromEdit ? '调整需求' : '生成确认'} showBack />
      <div className="px-5 py-6 space-y-6">
        {/* App icon + name */}
        <div className="text-center">
          <div className="w-20 h-20 bg-brand-orange-light rounded-card-xl flex items-center justify-center mx-auto mb-4 text-4xl">
            {templateIcon}
          </div>
          <h2 className="text-h1 text-ink-primary">{templateName}</h2>
          <p className="text-body text-ink-secondary mt-2">{templateCoreFeatures}</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {/* Data source */}
          <button
            type="button"
            onClick={() => setShowSourceSheet(true)}
            className="text-left active:bg-line-base/30 transition-colors"
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '14px 16px',
              backgroundColor: '#FFFFFF',
              border: '0.5px solid #EEEEEE',
              borderRadius: 12,
            }}
          >
            <span
              style={{
                flexShrink: 0,
                width: 28,
                height: 28,
                borderRadius: 8,
                backgroundColor: '#FFF1E6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Database size={14} color="#FF7A00" />
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 11, lineHeight: '14px', color: '#9CA3AF', marginBottom: 4 }}>
                数据源
              </p>
              {dataSourceMainLabel ? (
                <p
                  style={{
                    fontSize: 13,
                    fontWeight: 500,
                    lineHeight: 1.4,
                    color: '#1A1A1A',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {dataSourceMainLabel}
                </p>
              ) : (
                <p style={{ fontSize: 13, fontWeight: 500, lineHeight: 1.4, color: '#FF7A00' }}>
                  请选择兴趣库 →
                </p>
              )}
            </div>
            <ChevronRight size={16} color="#9CA3AF" style={{ flexShrink: 0 }} />
          </button>

          {/* Features */}
          <button
            type="button"
            onClick={() => setShowFeaturesSheet(true)}
            className="text-left active:bg-line-base/30 transition-colors"
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'flex-start',
              gap: 12,
              padding: '14px 16px',
              backgroundColor: '#FFFFFF',
              border: '0.5px solid #EEEEEE',
              borderRadius: 12,
            }}
          >
            <span
              style={{
                flexShrink: 0,
                width: 28,
                height: 28,
                borderRadius: 8,
                backgroundColor: '#FFF1E6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Cpu size={14} color="#FF7A00" />
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 11, lineHeight: '14px', color: '#9CA3AF', marginBottom: 4 }}>
                功能模块
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {selectedFeatures.map(f => {
                  const isAi = /AI/i.test(f)
                  return (
                    <span
                      key={f}
                      style={{
                        fontSize: 11,
                        lineHeight: '14px',
                        padding: '3px 10px',
                        borderRadius: 999,
                        fontWeight: isAi ? 500 : 400,
                        backgroundColor: isAi ? '#FFF1E6' : '#F5F5F5',
                        color: isAi ? '#FF7A00' : '#4A4A4A',
                      }}
                    >
                      {f}
                    </span>
                  )
                })}
              </div>
            </div>
            <ChevronRight size={16} color="#9CA3AF" style={{ flexShrink: 0, marginTop: 2 }} />
          </button>

          {/* Access mode */}
          <button
            type="button"
            onClick={() => setShowAccessSheet(true)}
            className="text-left active:bg-line-base/30 transition-colors"
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '14px 16px',
              backgroundColor: '#FFFFFF',
              border: '0.5px solid #EEEEEE',
              borderRadius: 12,
            }}
          >
            <span
              style={{
                flexShrink: 0,
                width: 28,
                height: 28,
                borderRadius: 8,
                backgroundColor: '#FFF1E6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Globe size={14} color="#FF7A00" />
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 11, lineHeight: '14px', color: '#9CA3AF', marginBottom: 4 }}>
                访问方式
              </p>
              <p style={{ fontSize: 13, fontWeight: 500, lineHeight: 1.4, color: '#1A1A1A' }}>
                {accessModeLabel}
              </p>
            </div>
            <ChevronRight size={16} color="#9CA3AF" style={{ flexShrink: 0 }} />
          </button>

          {/* Travel preferences (collapsible) */}
          {isTravel && (
            <div>
              <button
                type="button"
                onClick={() => setPrefsOpen(v => !v)}
                className="text-left active:bg-line-base/30 transition-colors"
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '14px 16px',
                  backgroundColor: '#FFFFFF',
                  border: '0.5px solid #EEEEEE',
                  borderRadius: 12,
                }}
              >
                <span
                  style={{
                    flexShrink: 0,
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    backgroundColor: '#FFF1E6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <MapPin size={14} color="#FF7A00" />
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 11, lineHeight: '14px', color: '#9CA3AF', marginBottom: 4 }}>
                    行程偏好
                  </p>
                  {prefsConfigured ? (
                    <p
                      style={{
                        fontSize: 13,
                        fontWeight: 500,
                        lineHeight: 1.4,
                        color: '#1A1A1A',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {buildPrefsSummary(travelPrefs)}
                    </p>
                  ) : (
                    <p style={{ fontSize: 13, fontWeight: 500, lineHeight: 1.4, color: '#9CA3AF' }}>
                      请填写预算、酒店等偏好
                    </p>
                  )}
                </div>
                <ChevronDown
                  size={16}
                  color="#9CA3AF"
                  style={{
                    flexShrink: 0,
                    transition: 'transform 200ms ease',
                    transform: prefsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  }}
                />
              </button>
              <AnimatePresence initial={false}>
                {prefsOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22, ease: 'easeOut' }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div
                      style={{
                        marginTop: 8,
                        padding: '14px 16px',
                        backgroundColor: '#FFFFFF',
                        border: '0.5px solid #EEEEEE',
                        borderRadius: 12,
                      }}
                    >
                      <TravelPrefsFields prefs={travelPrefs} onChange={handlePrefsChange} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
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
          className={`w-full py-4 rounded-btn text-body font-medium flex items-center justify-center gap-2 transition-colors active:scale-[0.98] ${
            canStart
              ? 'bg-brand-orange text-white'
              : 'bg-[#FFE4D0] text-white cursor-default'
          }`}
        >
          {isFromEdit ? '重新生成' : '开始生成 →'}
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
