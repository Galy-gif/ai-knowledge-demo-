import { useEffect, useState } from 'react'
import { Check, Database, Inbox, PenLine } from 'lucide-react'
import BottomSheet from '../ui/BottomSheet'
import { useKnowledge } from '../../context/KnowledgeContext'
import { QUICK_NOTES_KB_ID, type KnowledgeBase, type KnowledgeFile } from '../../mock/data'
import { getKnowledgeBasePwaFit } from '../../utils/pwaRecommendation'

interface DataSourceSelectorSheetProps {
  open: boolean
  selectedIds: string[]
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

function BaseRow({
  base,
  selected,
  onClick,
  files,
}: {
  base: KnowledgeBase
  selected: boolean
  onClick: () => void
  files: KnowledgeFile[]
}) {
  const fit = getKnowledgeBasePwaFit(base, files)
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-3 rounded-card border text-left active:bg-surface-card transition-colors ${
        selected ? 'border-brand-orange bg-brand-orange/[0.04]' : 'border-line-base bg-white'
      }`}
    >
      <Checkbox checked={selected} />
      <div
        className="w-9 h-9 rounded-card flex items-center justify-center text-lg flex-shrink-0"
        style={{ backgroundColor: base.icon === 'inbox' ? '#F8F8F8' : `${base.color}22` }}
      >
        {base.icon === 'pen-line' ? <PenLine size={17} className="text-brand-orange" />
          : base.icon === 'inbox' ? <Inbox size={17} className="text-[#9CA3AF]" />
          : base.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 min-w-0">
          <p className="text-card-title text-ink-primary truncate">{base.name}</p>
          <span className={`text-[10px] px-1.5 py-0.5 rounded-pill whitespace-nowrap ${fit.className}`}>
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
  onClose,
  onApply,
}: DataSourceSelectorSheetProps) {
  const { bases, subscribedBases, files } = useKnowledge()
  const [draftIds, setDraftIds] = useState<string[]>([])
  const personalBases = bases.filter(base => base.id !== QUICK_NOTES_KB_ID)
  const sourceBases = [...personalBases, ...subscribedBases]
  const useAll = draftIds.length === 0

  useEffect(() => {
    if (open) setDraftIds(selectedIds)
  }, [open, selectedIds])

  const toggleBase = (baseId: string) => {
    setDraftIds(prev => prev.includes(baseId)
      ? prev.filter(id => id !== baseId)
      : [...prev, baseId]
    )
  }

  const applyCurrentSelection = () => {
    onApply(draftIds, sourceBases.filter(base => draftIds.includes(base.id)).map(base => base.name))
    onClose()
  }

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title="选择数据源"
      titleAlign="center"
      titleClassName="text-[17px] leading-6 font-semibold text-ink-primary"
    >
      <div className="px-5 pt-2 pb-4">
        <p className="text-caption text-ink-secondary mb-4 text-center">AI 将基于选中的知识库内容生成轻应用</p>

        <button
          onClick={() => setDraftIds([])}
          className={`w-full flex items-center gap-3 px-3 py-3 rounded-card border text-left mb-4 transition-colors ${
            useAll ? 'border-brand-orange bg-brand-orange/[0.04]' : 'border-line-base bg-white'
          }`}
        >
          <Checkbox checked={useAll} />
          <div className="w-9 h-9 bg-brand-orange-light rounded-card flex items-center justify-center flex-shrink-0">
            <Database size={17} className="text-brand-orange" />
          </div>
          <div>
            <p className="text-card-title text-ink-primary">使用全部知识库</p>
            <p className="text-caption text-ink-placeholder mt-0.5">不限定范围，自动检索全部内容</p>
          </div>
        </button>

        <p className="text-caption text-ink-secondary mb-2">个人知识库</p>
        <div className="space-y-2 mb-4">
          {personalBases.map(base => (
            <BaseRow
              key={base.id}
              base={base}
              selected={draftIds.includes(base.id)}
              onClick={() => toggleBase(base.id)}
              files={files}
            />
          ))}
        </div>

        <p className="text-caption text-ink-secondary mb-2">订阅知识库</p>
        <div className="space-y-2 mb-4">
          {subscribedBases.map(base => (
            <BaseRow
              key={base.id}
              base={base}
              selected={draftIds.includes(base.id)}
              onClick={() => toggleBase(base.id)}
              files={files}
            />
          ))}
        </div>

        <button
          onClick={applyCurrentSelection}
          className="w-full py-3.5 bg-brand-orange text-white rounded-btn text-body font-medium"
        >
          应用选择
        </button>
      </div>
    </BottomSheet>
  )
}
