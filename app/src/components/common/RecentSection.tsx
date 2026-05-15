import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, ChevronDown, ChevronRight } from 'lucide-react'
import { useKnowledge } from '../../context/KnowledgeContext'
import { useMultiSelect } from '../../context/MultiSelectContext'
import { mockRecentItems, type KnowledgeFile, type RecentActivity, type RecentItem } from '../../mock/data'
import { RecentCompactRow } from './RecentItemCard'

type RecentFilter = RecentActivity

const FILTERS: { key: RecentFilter; label: string }[] = [
  { key: 'visited', label: '最近访问' },
  { key: 'updated', label: '最近更新' },
]

export default function RecentSection() {
  const navigate = useNavigate()
  const { files, bases, subscribedBases, setActiveBase, setActiveFile } = useKnowledge()
  const { isSelecting, isSelected, beginSelection, toggleFile } = useMultiSelect()
  const [activeFilter, setActiveFilter] = useState<RecentFilter>('visited')
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!menuOpen) return undefined
    const handlePointerDown = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setMenuOpen(false)
    }
    document.addEventListener('pointerdown', handlePointerDown, true)
    return () => document.removeEventListener('pointerdown', handlePointerDown, true)
  }, [menuOpen])

  const recentItems = mockRecentItems
    .filter(item => item.activity === activeFilter)
    .slice(0, 3)
    .map(item => ({ item, file: files.find(file => file.id === item.fileId) }))
    .filter((entry): entry is { item: RecentItem; file: KnowledgeFile } => Boolean(entry.file))
  const activeMeta = FILTERS.find(item => item.key === activeFilter) ?? FILTERS[0]

  const openFile = (file: KnowledgeFile) => {
    const base = [...bases, ...subscribedBases].find(kb => kb.id === file.kbId)
    if (base) setActiveBase(base)
    setActiveFile(file)
    navigate('/knowledge/file-detail')
  }

  const handleCardClick = (file: KnowledgeFile) => {
    if (isSelecting) {
      toggleFile(file)
      return
    }
    openFile(file)
  }

  return (
    <section className="space-y-2">
      <div className="px-1 flex items-center justify-between">
        <div className="relative" ref={menuRef}>
          <button
            onClick={event => {
              event.stopPropagation()
              setMenuOpen(prev => !prev)
            }}
            className="flex items-center gap-1 text-[15px] font-semibold leading-5 text-ink-primary"
          >
            {activeMeta.label}
            <ChevronDown size={14} className={`text-ink-placeholder transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
          </button>

          {menuOpen && (
            <div className="absolute left-0 top-7 z-30 w-[140px] rounded-card bg-white shadow-[0_12px_28px_rgba(15,23,42,0.16)] border border-line-base py-1">
              {FILTERS.map(option => (
                <button
                  key={option.key}
                  onClick={event => {
                    event.stopPropagation()
                    setActiveFilter(option.key)
                    setMenuOpen(false)
                  }}
                  className="w-full flex items-center justify-between px-3 py-2.5 text-left text-[13px] leading-5 text-ink-primary active:bg-surface-card"
                >
                  <span>{option.label}</span>
                  {activeFilter === option.key && <Check size={14} className="text-brand-orange" />}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={event => {
            event.stopPropagation()
            navigate('/knowledge/recent')
          }}
          aria-label="进入全部最近内容"
          className="flex h-6 w-6 items-center justify-center text-[#4A4A4A] active:text-brand-orange"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="bg-white rounded-card border border-line-base shadow-card overflow-hidden">
        {recentItems.map(({ item, file }, index) => (
          <RecentCompactRow
            key={item.id}
            item={item}
            file={file}
            selecting={isSelecting}
            selected={isSelected(file.id)}
            onClick={() => handleCardClick(file)}
            onLongPress={() => beginSelection(file)}
            className={index < recentItems.length - 1 ? 'border-b border-[#EEEEEE]' : ''}
          />
        ))}
        {recentItems.length === 0 && (
          <div className="px-4 py-5 text-center text-caption text-ink-placeholder">暂无最近内容</div>
        )}
      </div>
    </section>
  )
}
