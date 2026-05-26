import { useEffect, useState } from 'react'
import { Check, Inbox, PenLine, Users } from 'lucide-react'
import BottomSheet from '../ui/BottomSheet'
import { useKnowledge } from '../../context/KnowledgeContext'
import { QUICK_NOTES_KB_ID, type KnowledgeBase, type KnowledgeFile } from '../../mock/data'
import { getKnowledgeBasePwaFit } from '../../utils/pwaRecommendation'

interface DataSourceSelectorSheetProps {
  open: boolean
  selectedIds: string[]
  templateId?: string
  onClose: () => void
  onApply: (ids: string[], names: string[]) => void
}

function Checkbox({ checked }: { checked: boolean }) {
  return (
    <div className={`w-5 h-5 rounded-md border flex items-center justify-center flex-shrink-0 ${
      checked ? 'bg-brand-orange border-brand-orange' : 'bg-white border-line-base'
    }`}>
      {checked && <Check size={13} className="text-white" />}
    </div>
  )
}

function SubscribedBadge() {
  return (
    <div
      className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#3B82F6] flex items-center justify-center"
      style={{ border: '1.5px solid white' }}
    >
      <Users size={8} className="text-white" />
    </div>
  )
}

function BaseRow({
  base,
  selected,
  onClick,
  files,
  templateId,
  isSubscribed,
}: {
  base: KnowledgeBase
  selected: boolean
  onClick: () => void
  files: KnowledgeFile[]
  templateId?: string
  isSubscribed?: boolean
}) {
  const fit = getKnowledgeBasePwaFit(base, files, templateId)
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-3 rounded-card border text-left transition-colors ${
        selected
          ? 'border-brand-orange bg-brand-orange/[0.04] active:bg-brand-orange/[0.08]'
          : 'border-line-base bg-white active:bg-surface-card'
      }`}
    >
      <Checkbox checked={selected} />
      <div className="relative flex-shrink-0">
        <div
          className="w-9 h-9 rounded-card flex items-center justify-center text-lg"
          style={{ backgroundColor: base.icon === 'inbox' ? '#F8F8F8' : `${base.color}22` }}
        >
          {base.icon === 'pen-line' ? <PenLine size={17} className="text-brand-orange" />
            : base.icon === 'inbox' ? <Inbox size={17} className="text-[#9CA3AF]" />
            : base.icon}
        </div>
        {isSubscribed && <SubscribedBadge />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 min-w-0">
          <p className="text-card-title text-ink-primary truncate">{base.name}</p>
          <span className={`text-[10px] px-1.5 py-0.5 rounded-pill whitespace-nowrap flex-shrink-0 ${fit.className}`}>
            {fit.label}
          </span>
        </div>
        <p className="text-caption text-ink-placeholder mt-0.5">{base.fileCount} 个内容 · {base.updatedAt}</p>
      </div>
    </button>
  )
}

export default function DataSourceSelectorSheet({
  open,
  selectedIds,
  templateId,
  onClose,
  onApply,
}: DataSourceSelectorSheetProps) {
  const { bases, subscribedBases, files } = useKnowledge()
  const [draftIds, setDraftIds] = useState<string[]>([])
  const personalBases = bases.filter(base => base.id !== QUICK_NOTES_KB_ID)
  const allSources = [...personalBases, ...subscribedBases]

  useEffect(() => {
    if (open) setDraftIds(selectedIds)
  }, [open, selectedIds])

  const toggleBase = (baseId: string) => {
    setDraftIds(prev =>
      prev.includes(baseId) ? prev.filter(id => id !== baseId) : [...prev, baseId]
    )
  }

  const canComplete = draftIds.length > 0
  const countLabel = draftIds.length === 0
    ? '未选择兴趣库'
    : `已选 ${draftIds.length} 个兴趣库`

  const handleComplete = () => {
    if (!canComplete) return
    const names = allSources.filter(b => draftIds.includes(b.id)).map(b => b.name)
    onApply(draftIds, names)
    onClose()
  }

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title="选择数据源"
      titleAlign="center"
      titleClassName="text-[17px] leading-6 font-semibold text-ink-primary"
      headerLeft={
        <button onClick={onClose} className="text-[14px] text-ink-secondary">取消</button>
      }
      headerRight={
        <button
          onClick={handleComplete}
          className={`text-[14px] font-medium ${canComplete ? 'text-brand-orange' : 'text-ink-placeholder'}`}
        >
          完成
        </button>
      }
    >
      <div className="px-5 pt-2 pb-4">
        <p className="text-caption text-ink-secondary mb-4 text-center">AI 将基于选中的兴趣库内容生成轻应用</p>

        {/* Personal KBs */}
        <p className="text-[13px] font-semibold text-ink-primary pb-2">个人兴趣库</p>
        <div className="space-y-2 mb-5">
          {personalBases.map(base => (
            <BaseRow
              key={base.id}
              base={base}
              selected={draftIds.includes(base.id)}
              onClick={() => toggleBase(base.id)}
              files={files}
              templateId={templateId}
            />
          ))}
        </div>

        {/* Subscribed KBs */}
        <p className="text-[13px] font-semibold text-ink-primary pb-2">订阅兴趣库</p>
        <div className="space-y-2 mb-5">
          {subscribedBases.map(base => (
            <BaseRow
              key={base.id}
              base={base}
              selected={draftIds.includes(base.id)}
              onClick={() => toggleBase(base.id)}
              files={files}
              templateId={templateId}
              isSubscribed
            />
          ))}
        </div>

        {/* Bottom count bar */}
        <div className="flex items-center justify-between py-3 border-t border-line-base mb-3">
          <p className="text-caption text-ink-secondary">{countLabel}</p>
          {draftIds.length > 0 && (
            <p className="text-caption text-ink-placeholder truncate max-w-[55%] text-right">
              {allSources.filter(b => draftIds.includes(b.id)).map(b => b.name).join('、')}
            </p>
          )}
        </div>

        <button
          onClick={handleComplete}
          disabled={!canComplete}
          className={`w-full py-3.5 rounded-btn text-body font-medium transition-colors ${
            canComplete
              ? 'bg-brand-orange text-white'
              : 'bg-[#FFE4D0] text-white cursor-default'
          }`}
        >
          完成
        </button>
      </div>
    </BottomSheet>
  )
}
