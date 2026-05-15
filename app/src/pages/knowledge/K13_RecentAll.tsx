import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowUpDown, Check, ChevronLeft, LayoutGrid, List } from 'lucide-react'
import { RecentListRow, RecentVisualCard } from '../../components/common/RecentItemCard'
import { useKnowledge } from '../../context/KnowledgeContext'
import { useMultiSelect } from '../../context/MultiSelectContext'
import { mockRecentItems, type FileType, type KnowledgeFile, type RecentItem } from '../../mock/data'

type RecentFilter = '全部' | '速记' | '文档' | '网页' | '音频' | '图片'
type SortKey = 'visited' | 'updated' | 'created' | 'name'

const TYPE_FILTERS: RecentFilter[] = ['全部', '速记', '文档', '网页', '音频', '图片']
const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'visited', label: '按访问时间' },
  { key: 'updated', label: '按更新时间' },
  { key: 'created', label: '按创建时间' },
  { key: 'name', label: '按名称' },
]

const filterMap: Record<Exclude<RecentFilter, '全部'>, FileType[]> = {
  '速记': ['note'],
  '文档': ['pdf', 'doc', 'txt'],
  '网页': ['url'],
  '音频': ['audio'],
  '图片': ['image'],
}

function matchesFilter(item: RecentItem, filter: RecentFilter) {
  if (filter === '全部') return true
  return filterMap[filter].includes(item.type)
}

function createdScore(file: KnowledgeFile, sourceIndex: number) {
  const text = `${file.createdAt ?? ''} ${file.uploadedAt ?? ''}`
  if (text.includes('刚刚')) return 1000
  if (text.includes('今天')) return 900
  if (text.includes('小时')) return 850
  if (text.includes('昨天') || text.includes('1天')) return 760
  if (text.includes('2天')) return 700
  if (text.includes('3天')) return 650
  if (text.includes('4天')) return 600
  if (text.includes('5天')) return 560
  if (text.includes('周')) return 420
  return 300 - sourceIndex
}

export default function K13_RecentAll() {
  const navigate = useNavigate()
  const { files, bases, subscribedBases, setActiveBase, setActiveFile } = useKnowledge()
  const { isSelecting, isSelected, beginSelection, toggleFile } = useMultiSelect()
  const [activeFilter, setActiveFilter] = useState<RecentFilter>('全部')
  const [sortKey, setSortKey] = useState<SortKey>('visited')
  const [sortOpen, setSortOpen] = useState(false)
  const [gridView, setGridView] = useState(true)
  const sortRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!sortOpen) return undefined
    const handlePointerDown = (event: PointerEvent) => {
      if (!sortRef.current?.contains(event.target as Node)) setSortOpen(false)
    }
    document.addEventListener('pointerdown', handlePointerDown, true)
    return () => document.removeEventListener('pointerdown', handlePointerDown, true)
  }, [sortOpen])

  const entries = mockRecentItems
    .map((item, sourceIndex) => ({ item, sourceIndex, file: files.find(file => file.id === item.fileId) }))
    .filter((entry): entry is { item: RecentItem; sourceIndex: number; file: KnowledgeFile } => Boolean(entry.file))
    .filter(({ item }) => matchesFilter(item, activeFilter))
    .sort((a, b) => {
      if (sortKey === 'name') return a.item.title.localeCompare(b.item.title, 'zh-Hans-CN')
      if (sortKey === 'updated') {
        const activityDiff = Number(b.item.activity === 'updated') - Number(a.item.activity === 'updated')
        return activityDiff || a.sourceIndex - b.sourceIndex
      }
      if (sortKey === 'created') {
        return createdScore(b.file, b.sourceIndex) - createdScore(a.file, a.sourceIndex)
      }
      const activityDiff = Number(b.item.activity === 'visited') - Number(a.item.activity === 'visited')
      return activityDiff || a.sourceIndex - b.sourceIndex
    })

  const openFile = (file: KnowledgeFile) => {
    const base = [...bases, ...subscribedBases].find(kb => kb.id === file.kbId)
    if (base) setActiveBase(base)
    setActiveFile(file)
    navigate('/knowledge/file-detail')
  }

  const handleItemClick = (file: KnowledgeFile) => {
    if (isSelecting) {
      toggleFile(file)
      return
    }
    openFile(file)
  }

  return (
    <div className="flex flex-col h-full bg-surface-card">
      <div className="flex-shrink-0 h-14 px-4 bg-white border-b border-line-base flex items-center relative">
        <button onClick={() => navigate('/knowledge')} className="p-1 -ml-1 text-ink-secondary">
          <ChevronLeft size={24} />
        </button>
        <h1 className="absolute left-1/2 -translate-x-1/2 text-h2 text-ink-primary">全部最近</h1>
        <div className="ml-auto flex items-center gap-1">
          <button
            onClick={() => setGridView(prev => !prev)}
            className="p-2 text-ink-secondary"
            aria-label={gridView ? '切换列表视图' : '切换网格视图'}
          >
            {gridView ? <List size={19} /> : <LayoutGrid size={19} />}
          </button>
          <div className="relative" ref={sortRef}>
            <button
              onClick={() => setSortOpen(prev => !prev)}
              className="p-2 text-ink-secondary"
              aria-label="排序"
            >
              <ArrowUpDown size={19} />
            </button>
            {sortOpen && (
              <div className="absolute right-0 top-10 z-30 w-[148px] rounded-card border border-line-base bg-white py-1 shadow-[0_12px_28px_rgba(15,23,42,0.16)]">
                {SORT_OPTIONS.map(option => (
                  <button
                    key={option.key}
                    onClick={() => {
                      setSortKey(option.key)
                      setSortOpen(false)
                    }}
                    className="w-full flex items-center justify-between px-3 py-2.5 text-body text-ink-primary active:bg-surface-card"
                  >
                    {option.label}
                    {sortKey === option.key && <Check size={15} className="text-brand-orange" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex-shrink-0 bg-white border-b border-line-base px-4 py-2 flex gap-2 overflow-x-auto scrollbar-hide">
        {TYPE_FILTERS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab)}
            className={`px-3 py-1.5 rounded-pill text-caption whitespace-nowrap transition-colors flex-shrink-0 ${
              activeFilter === tab ? 'bg-brand-orange text-white' : 'bg-surface-card text-ink-secondary'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide px-4 py-4">
        {gridView ? (
          <div className="grid grid-cols-2 gap-3">
            {entries.map(({ item, file }) => (
              <RecentVisualCard
                key={item.id}
                item={item}
                file={file}
                selecting={isSelecting}
                selected={isSelected(file.id)}
                onClick={() => handleItemClick(file)}
                onLongPress={() => beginSelection(file)}
                className="w-full"
              />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {entries.map(({ item, file }) => (
              <RecentListRow
                key={item.id}
                item={item}
                file={file}
                selecting={isSelecting}
                selected={isSelected(file.id)}
                onClick={() => handleItemClick(file)}
                onLongPress={() => beginSelection(file)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
