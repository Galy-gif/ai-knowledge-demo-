import { useEffect, useMemo, useState } from 'react'
import { Check, ChevronRight, Inbox, PenLine, Plus, Search, X } from 'lucide-react'
import BottomSheet from '../ui/BottomSheet'
import { useKnowledge, type SaveSourceContent } from '../../context/KnowledgeContext'
import { useUser } from '../../context/UserContext'
import { QUICK_NOTES_KB_ID, type KnowledgeBase } from '../../mock/data'

export interface SaveSheetProps {
  open: boolean
  onClose: () => void
  sourceContent: SaveSourceContent
  onSaved?: (target: { type: 'kb'; id: string }) => void
  successToast?: string | ((target: KnowledgeBase) => string)
  title?: string
}

const KB_ICONS = ['💼', '📚', '🔬', '🎯', '💡', '📋']
const KB_COLORS = ['#FF7A00', '#6366F1', '#10B981', '#F59E0B', '#8B5CF6', '#06B6D4']

function RadioDot({ selected }: { selected: boolean }) {
  return (
    <div className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 ${
      selected ? 'border-brand-orange bg-brand-orange' : 'border-line-base bg-white'
    }`}>
      {selected && <Check size={12} className="text-white" />}
    </div>
  )
}

function KnowledgeRow({ kb, selected, onClick }: { kb: KnowledgeBase; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-3 rounded-card border text-left transition-colors ${
        selected ? 'border-brand-orange bg-brand-orange-light' : 'border-line-base bg-white'
      }`}
    >
      <span
        className="w-8 h-8 rounded-card flex items-center justify-center text-base flex-shrink-0"
        style={{ backgroundColor: kb.icon === 'inbox' ? '#F8F8F8' : kb.color + '22' }}
      >
        {kb.icon === 'pen-line' ? <PenLine size={16} className="text-brand-orange" />
          : kb.icon === 'inbox' ? <Inbox size={16} className="text-[#9CA3AF]" />
          : kb.icon}
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 min-w-0">
          <p className="text-card-title text-ink-primary truncate">{kb.name}</p>
          {kb.isSystem && (
            <span className="text-[9px] px-1.5 py-0.5 bg-brand-orange-light text-brand-orange rounded-pill whitespace-nowrap">
              系统默认
            </span>
          )}
        </div>
        <p className="text-caption text-ink-placeholder truncate">
          {kb.fileCount > 0 ? `${kb.fileCount} 个内容` : '暂无内容'} · {kb.updatedAt}
        </p>
      </div>
      <RadioDot selected={selected} />
    </button>
  )
}

export default function SaveToKnowledgeBaseSheet({ open, onClose, sourceContent, onSaved, successToast, title = '添加到资料包' }: SaveSheetProps) {
  const { bases, subscribedBases, addBase, saveToKnowledgeBase } = useKnowledge()
  const { showToast } = useUser()
  const [selectedKbId, setSelectedKbId] = useState<string>('')
  const [showCreate, setShowCreate] = useState(false)
  const [newName, setNewName] = useState('')
  const [newIcon, setNewIcon] = useState(KB_ICONS[0])
  const [newColor, setNewColor] = useState(KB_COLORS[0])
  const [query, setQuery] = useState('')

  const personalBases = useMemo(
    () => {
      const quickNotes = bases.find(kb => kb.id === QUICK_NOTES_KB_ID)
      const rest = bases.filter(kb => kb.id !== QUICK_NOTES_KB_ID)
      return quickNotes ? [quickNotes, ...rest] : rest
    },
    [bases],
  )
  const selectedBase = [...personalBases, ...subscribedBases].find(kb => kb.id === selectedKbId)
  const normalizedQuery = query.trim().toLowerCase()
  const matchesQuery = (kb: KnowledgeBase) => !normalizedQuery || kb.name.toLowerCase().includes(normalizedQuery)
  const filteredPersonalBases = personalBases.filter(matchesQuery)
  const filteredSubscribedBases = subscribedBases.filter(matchesQuery)
  const visibleBases = [...filteredPersonalBases, ...filteredSubscribedBases]
  const hasMatches = visibleBases.length > 0
  const canSave = Boolean(selectedBase && (!normalizedQuery || visibleBases.some(kb => kb.id === selectedKbId)))

  useEffect(() => {
    if (!open) {
      setSelectedKbId('')
      setShowCreate(false)
      setQuery('')
      return
    }
    setSelectedKbId(prev => prev || (bases.some(kb => kb.id === QUICK_NOTES_KB_ID) ? QUICK_NOTES_KB_ID : personalBases[0]?.id ?? ''))
  }, [open, bases, personalBases])

  const resetCreateForm = (initialName = '') => {
    setNewName(initialName)
    setNewIcon(KB_ICONS[0])
    setNewColor(KB_COLORS[0])
  }

  const openCreate = (initialName = '') => {
    resetCreateForm(initialName)
    setShowCreate(true)
  }

  const handleCreate = () => {
    if (!newName.trim()) return
    const kb: KnowledgeBase = {
      id: `kb_${Date.now()}`,
      name: newName.trim(),
      icon: newIcon,
      color: newColor,
      fileCount: 0,
      updatedAt: '刚刚',
      managementMode: 'free',
      type: 'personal',
    }
    addBase(kb)
    setSelectedKbId(kb.id)
    setQuery('')
    setShowCreate(false)
  }

  const handleSave = () => {
    if (!selectedBase || !canSave) return
    saveToKnowledgeBase(sourceContent, selectedBase.id)
    const message = typeof successToast === 'function'
      ? successToast(selectedBase)
      : successToast ?? `已保存到「${selectedBase.name}」`
    showToast(message)
    onSaved?.({ type: 'kb', id: selectedBase.id })
    onClose()
  }

  return (
    <>
      <BottomSheet
        open={open && !showCreate}
        onClose={onClose}
        title={title}
        titleAlign="center"
        titleClassName="text-[17px] leading-6 font-semibold text-ink-primary"
        fullHeight
      >
        <div className="flex h-full min-h-0 flex-col px-5 pt-2">
          <p className="text-caption text-ink-secondary mb-4 text-center">选择要保存的资料包</p>

          <div className="mb-4 flex h-10 items-center gap-2 rounded-[10px] bg-[#F5F5F5] px-3">
            <Search size={18} className="flex-shrink-0 text-ink-placeholder" />
            <input
              value={query}
              onChange={event => setQuery(event.target.value)}
              placeholder="搜索资料包..."
              className="min-w-0 flex-1 bg-transparent text-body text-ink-primary outline-none placeholder:text-ink-placeholder"
              autoComplete="off"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                aria-label="清空搜索"
                className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-ink-placeholder active:bg-line-base"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto scrollbar-hide pb-3">
            {filteredPersonalBases.length > 0 && (
              <>
                <p className="text-caption text-ink-secondary mb-2">个人资料包</p>
                <div className="space-y-2 mb-4">
                  {filteredPersonalBases.map(kb => (
                    <KnowledgeRow
                      key={kb.id}
                      kb={kb}
                      selected={selectedKbId === kb.id}
                      onClick={() => setSelectedKbId(kb.id)}
                    />
                  ))}
                </div>
              </>
            )}

            {filteredSubscribedBases.length > 0 && (
              <>
                <p className="text-caption text-ink-secondary mb-2">订阅资料包</p>
                <div className="space-y-2 mb-4">
                  {filteredSubscribedBases.map(kb => (
                    <KnowledgeRow
                      key={kb.id}
                      kb={kb}
                      selected={selectedKbId === kb.id}
                      onClick={() => setSelectedKbId(kb.id)}
                    />
                  ))}
                </div>
              </>
            )}

            {!hasMatches && (
              <button
                onClick={() => openCreate(query.trim())}
                className="w-full rounded-card border border-dashed border-line-base bg-surface-card px-4 py-6 text-center text-body text-ink-secondary active:bg-line-base/40"
              >
                没有找到相关资料包，可以新建一个 <span className="text-brand-orange">→</span>
              </button>
            )}
          </div>

          <div className="-mx-5 border-t border-line-base/70 bg-white px-5 pt-3 pb-4">
            <button
              onClick={() => openCreate()}
              className="w-full flex items-center justify-center gap-2 py-3 mb-3 rounded-pill border border-brand-orange text-brand-orange text-body font-medium"
            >
              <Plus size={16} />
              新建资料包
            </button>

            <button
              onClick={handleSave}
              disabled={!canSave}
              className="w-full py-3.5 bg-brand-orange text-white rounded-btn text-body font-medium disabled:bg-line-base disabled:text-ink-placeholder"
            >
              确认保存
            </button>
          </div>
        </div>
      </BottomSheet>

      <BottomSheet
        open={open && showCreate}
        onClose={() => setShowCreate(false)}
        title="新建资料包"
        titleAlign="center"
        titleClassName="text-[17px] leading-6 font-semibold text-ink-primary"
        headerLeft={
          <button onClick={() => setShowCreate(false)} className="text-body text-ink-secondary px-1">
            取消
          </button>
        }
        headerRight={
          <button
            onClick={handleCreate}
            disabled={!newName.trim()}
            className="text-body text-brand-orange font-semibold disabled:opacity-30"
          >
            创建
          </button>
        }
      >
        <div className="px-5 py-4">
          <div className="flex gap-3 mb-4">
            {KB_ICONS.map(icon => (
              <button
                key={icon}
                onClick={() => setNewIcon(icon)}
                className={`w-11 h-11 rounded-full text-2xl flex items-center justify-center border-2 ${
                  newIcon === icon ? 'border-brand-orange bg-brand-orange-light' : 'border-line-base bg-surface-card'
                }`}
              >
                {icon}
              </button>
            ))}
          </div>
          <input
            value={newName}
            onChange={event => setNewName(event.target.value)}
            placeholder="例如：产品资料库"
            className="w-full px-0 py-3 border-b border-line-base text-body text-ink-primary outline-none bg-transparent placeholder:text-ink-placeholder mb-4"
          />
          <div className="flex gap-2.5">
            {KB_COLORS.map(color => (
              <button
                key={color}
                onClick={() => setNewColor(color)}
                className={`w-7 h-7 rounded-full transition-transform ${newColor === color ? 'scale-125 ring-2 ring-offset-1 ring-ink-placeholder' : ''}`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          <button
            onClick={handleCreate}
            disabled={!newName.trim()}
            className="w-full mt-6 py-3.5 bg-brand-orange text-white rounded-btn text-body font-medium disabled:opacity-40"
          >
            创建并选择
          </button>
          <button
            onClick={() => setShowCreate(false)}
            className="w-full mt-2 py-3 text-body text-ink-secondary"
          >
            <span className="inline-flex items-center gap-1">
              返回选择列表 <ChevronRight size={14} className="rotate-180" />
            </span>
          </button>
        </div>
      </BottomSheet>
    </>
  )
}
