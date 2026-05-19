import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, ChevronDown, ChevronLeft, ChevronRight, Compass, Edit3, Globe, Inbox, PenLine, Plus, Search, Target, Trash2, Unlink } from 'lucide-react'
import TabLayout from '../../components/layout/TabLayout'
import RecentSection from '../../components/common/RecentSection'
import SearchBar from '../../components/common/SearchBar'
import SwipeableListItem, { type SwipeAction } from '../../components/common/SwipeableListItem'
import BottomSheet from '../../components/ui/BottomSheet'
import { useKnowledge } from '../../context/KnowledgeContext'
import { useMultiSelect, type MultiSelectItem } from '../../context/MultiSelectContext'
import { useUser } from '../../context/UserContext'
import { useWatch } from '../../context/WatchContext'
import { mockRecentItems, QUICK_NOTES_KB_ID, type KnowledgeBase, type KnowledgeFile, type KnowledgeManagementMode } from '../../mock/data'
import { getFileTypeVisual } from '../../utils/fileTypeVisuals'

const KB_ICONS = ['💼', '📚', '🔬', '🎯', '💡', '📋']
const KB_COLORS = ['#FF7A00', '#6366F1', '#10B981', '#F59E0B', '#8B5CF6', '#06B6D4']
const MANAGEMENT_OPTIONS: Array<{
  id: KnowledgeManagementMode
  title: string
  desc: string
  keywords: string
  badge?: 'ai'
}> = [
  {
    id: 'project',
    title: '按项目整理',
    desc: '围绕"我现在要做什么"来整理知识，适合目标明确的内容。',
    keywords: '项目资料 · 调研任务 · 方案推进 · 学习作业',
  },
  {
    id: 'output',
    title: '从资料变成果',
    desc: '把收集来的资料一步步提炼成最终可交付的成果。',
    keywords: '报告 · PPT · 文章 · 方案 · 总结',
  },
  {
    id: 'idea',
    title: '按想法整理',
    desc: '把零散想法变成卡片，并建立关联，适合长期积累思考。',
    keywords: '灵感 · 观点 · 读书笔记 · 研究发现',
  },
  {
    id: 'ai',
    title: '让 AI 帮你整理',
    desc: 'AI 自动分类、提炼重点、关联相关内容，并提醒你定期清理。',
    keywords: '资料多 · 容易乱 · 长期维护',
    badge: 'ai',
  },
  {
    id: 'free',
    title: '自由收纳',
    desc: '不按任何方式整理，想怎么放就怎么放。',
    keywords: '完全自由 · 零规则 · 自己掌控',
  },
]

function ManagementModeCard({
  option,
  selected,
  onClick,
}: {
  option: typeof MANAGEMENT_OPTIONS[number]
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative w-full rounded-[12px] p-4 text-left border transition-all duration-150 ${
        selected
          ? 'border-[1.5px] border-[#FF7A00] bg-[#FFF1E6] shadow-[0_4px_16px_rgba(0,0,0,0.06)]'
          : 'border-[#EEEEEE] bg-white'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 pr-8">
            <p className="text-[15px] leading-5 font-semibold text-ink-primary">{option.title}</p>
            {option.badge === 'ai' && (
              <span className="px-2 py-0.5 rounded-full bg-[#FFF1E6] border border-[#FF7A00]/30 text-[11px] leading-4 text-[#FF7A00] whitespace-nowrap">
                AI 推荐
              </span>
            )}
          </div>
          <p className="mt-1.5 text-[14px] leading-[1.5] text-ink-primary">{option.desc}</p>
          <p className="mt-2 text-[12px] leading-4 text-[#9CA3AF]">{option.keywords}</p>
        </div>
      </div>
      {selected && (
        <span className="absolute right-4 top-4 h-5 w-5 rounded-full bg-[#FF7A00] flex items-center justify-center">
          <Check size={14} className="text-white" strokeWidth={2.4} />
        </span>
      )}
    </button>
  )
}

// ── Toggle row for AI settings ─────────────────────────────────────────────
function ToggleRow({ label, sub, value, onChange }: {
  label: string; sub?: string; value: boolean; onChange: (v: boolean) => void
}) {
  return (
    <button
      onClick={() => onChange(!value)}
      className="w-full flex items-center justify-between px-5 py-3.5 border-b border-line-base last:border-0"
    >
      <div className="text-left">
        <p className="text-body text-ink-primary">{label}</p>
        {sub && <p className="text-caption text-ink-placeholder mt-0.5">{sub}</p>}
      </div>
      <div className={`w-11 h-6 rounded-pill transition-colors flex-shrink-0 flex items-center px-0.5 ${value ? 'bg-brand-orange' : 'bg-line-base'}`}>
        <div className={`w-5 h-5 rounded-full bg-white shadow-card transition-transform ${value ? 'translate-x-5' : 'translate-x-0'}`} />
      </div>
    </button>
  )
}

const SEARCH_SUGGESTIONS = ['竞品分析报告', '用户访谈录音', '增长方法论', 'AI 追问整理']
const SEARCH_HISTORY = ['来源卡片', '周会纪要', '知识库运营']

function SearchResultRow({ file, base, onClick }: { file: KnowledgeFile; base?: KnowledgeBase; onClick: () => void }) {
  const cfg = getFileTypeVisual(file.type)
  const { Icon } = cfg
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-3 py-3 bg-white rounded-card border border-line-base text-left active:bg-surface-card"
    >
      <div
        className="w-9 h-9 rounded-card flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: cfg.bg }}
      >
        <Icon size={17} style={{ color: cfg.color }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-card-title text-ink-primary truncate">{file.name}</p>
        <p className="text-caption text-ink-placeholder truncate">
          {base?.name ?? '知识库'} · {file.summary ?? file.uploadedAt}
        </p>
      </div>
      <ChevronRight size={15} className="text-ink-placeholder flex-shrink-0" />
    </button>
  )
}

function SelectionDot({ selected, visible }: { selected: boolean; visible: boolean }) {
  if (!visible) return null
  return (
    <div className={`absolute left-2 top-2 z-10 w-6 h-6 rounded-full border flex items-center justify-center ${
      selected ? 'bg-brand-orange border-brand-orange' : 'bg-white border-[#D1D5DB]'
    }`}>
      {selected && <span className="text-[12px] font-semibold text-white leading-none">✓</span>}
    </div>
  )
}

export default function K01_KnowledgeHome() {
  const navigate = useNavigate()
  const {
    bases,
    subscribedBases,
    files,
    setActiveBase,
    setActiveFile,
    addBase,
    updateBase,
    removeBase,
    unsubscribeBase,
  } = useKnowledge()
  const {
    isSelecting,
    selectedItems,
    clearSelection,
    replaceItems,
    beginBaseSelection,
    toggleBase,
    isSelected,
  } = useMultiSelect()
  const { showToast, showConfirm } = useUser()
  const { todayUnread } = useWatch()

  const [personalExpanded, setPersonalExpanded] = useState(true)
  const [subscribedExpanded, setSubscribedExpanded] = useState(true)
  const [showCreate, setShowCreate] = useState(false)   // K03
  const [createStep, setCreateStep] = useState<'basic' | 'management'>('basic')
  const [searchActive, setSearchActive] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [openSwipeId, setOpenSwipeId] = useState<string | null>(null)
  const [renamingBase, setRenamingBase] = useState<KnowledgeBase | null>(null)
  const [renameName, setRenameName] = useState('')
  const [renameIcon, setRenameIcon] = useState(KB_ICONS[0])
  const [renameManagementMode, setRenameManagementMode] = useState<KnowledgeManagementMode | null>(null)

  // K03 form state
  const [newName, setNewName]         = useState('')
  const [newDesc, setNewDesc]         = useState('')
  const [newIcon, setNewIcon]         = useState(KB_ICONS[0])
  const [newColor, setNewColor]       = useState(KB_COLORS[0])
  const [newManagementMode, setNewManagementMode] = useState<KnowledgeManagementMode | ''>('')
  const [aiRef, setAiRef]             = useState(true)
  const [autoSync, setAutoSync]       = useState(true)

  const openCreate = () => {
    setNewName(''); setNewDesc(''); setNewIcon(KB_ICONS[0]); setNewColor(KB_COLORS[0])
    setNewManagementMode('')
    setAiRef(true); setAutoSync(true); setCreateStep('basic')
    setShowCreate(true)
  }

  const handleCreate = (mode?: KnowledgeManagementMode) => {
    if (!newName.trim()) return
    const kb: KnowledgeBase = {
      id: `kb_${Date.now()}`,
      name: newName.trim(),
      icon: newIcon,
      color: newColor,
      fileCount: 0,
      updatedAt: '刚刚',
      managementMode: mode ?? (newManagementMode || 'free'),
      type: 'personal',
    }
    addBase(kb)
    showToast('知识库创建成功')
    setShowCreate(false)
    setCreateStep('basic')
    navigate('/knowledge/detail')
  }

  const handleCardClick = (kb: KnowledgeBase) => {
    if (openSwipeId) {
      setOpenSwipeId(null)
      return
    }
    if (isSelecting) {
      toggleBase(kb)
      return
    }
    setActiveBase(kb)
    navigate('/knowledge/detail')
  }

  const startRename = (kb: KnowledgeBase) => {
    if (kb.isSystem || kb.locked) {
      showToast('我的速记为系统默认知识库，不可重命名', 'info')
      return
    }
    setRenamingBase(kb)
    setRenameName(kb.name)
    setRenameIcon(KB_ICONS.includes(kb.icon) ? kb.icon : KB_ICONS[0])
    setRenameManagementMode(kb.managementMode ?? null)
  }

  const confirmRename = () => {
    if (!renamingBase || !renameName.trim()) return
    updateBase(renamingBase.id, { name: renameName.trim(), icon: renameIcon, managementMode: renameManagementMode })
    showToast(`已重命名为「${renameName.trim()}」`)
    setRenamingBase(null)
  }

  const confirmDeleteBase = (kb: KnowledgeBase) => {
    if (kb.isSystem || kb.locked) {
      showToast('我的速记为系统默认知识库，不可删除', 'info')
      return
    }
    showConfirm({
      title: `删除「${kb.name}」？`,
      description: `此知识库包含 ${kb.fileCount} 个文件，删除后所有内容将一并丢失，无法恢复。`,
      confirmText: '删除',
      danger: true,
      onConfirm: () => {
        removeBase(kb.id)
        showToast(`已删除「${kb.name}」`)
      },
    })
  }

  const confirmUnsubscribe = (kb: KnowledgeBase) => {
    showConfirm({
      title: `取消订阅「${kb.name}」？`,
      description: '取消后该团队的更新将不再同步到你的知识库，已下载的内容不会删除。',
      confirmText: '取消订阅',
      danger: true,
      onConfirm: () => {
        unsubscribeBase(kb.id)
        showToast('已取消订阅')
      },
    })
  }

  const getPersonalActions = (kb: KnowledgeBase): SwipeAction[] => {
    const locked = Boolean(kb.isSystem || kb.locked)
    return [
      {
        id: 'rename',
        label: '重命名',
        icon: Edit3,
        color: locked ? '#9CA3AF' : '#6B7280',
        disabled: locked,
        onAction: () => startRename(kb),
      },
      {
        id: 'delete',
        label: '删除',
        icon: Trash2,
        color: locked ? '#FCA5A5' : '#DC2626',
        disabled: locked,
        onAction: () => confirmDeleteBase(kb),
      },
    ]
  }

  const getSubscribedActions = (kb: KnowledgeBase): SwipeAction[] => [
    {
      id: 'unsubscribe',
      label: '取消订阅',
      icon: Unlink,
      color: '#FF7A00',
      onAction: () => confirmUnsubscribe(kb),
    },
  ]

  const recentFiles = mockRecentItems
    .map(item => files.find(file => file.id === item.fileId))
    .filter((file): file is KnowledgeFile => Boolean(file))
  const k01SelectableItems: MultiSelectItem[] = [
    ...recentFiles.map(file => ({ type: 'file' as const, id: file.id, file })),
    ...bases.map(base => ({ type: 'base' as const, id: base.id, base })),
    ...subscribedBases.map(base => ({ type: 'base' as const, id: base.id, base })),
  ]
  const allK01Selected = k01SelectableItems.length > 0 && k01SelectableItems.every(item =>
    selectedItems.some(selected => selected.type === item.type && selected.id === item.id)
  )

  const toggleSelectAll = () => {
    if (allK01Selected) {
      clearSelection()
      return
    }
    replaceItems(k01SelectableItems)
  }

  const allBases = [...bases, ...subscribedBases]
  const query = searchQuery.trim().toLowerCase()
  const searchResults = query
    ? files
        .map(file => {
          const haystacks = [
            file.name,
            file.summary ?? '',
            file.content ?? '',
            allBases.find(base => base.id === file.kbId)?.name ?? '',
          ].map(text => text.toLowerCase())
          const score =
            (haystacks[0].includes(query) ? 100 : 0) +
            (haystacks[1].includes(query) ? 40 : 0) +
            (haystacks[2].includes(query) ? 20 : 0) +
            (haystacks[3].includes(query) ? 10 : 0)
          return { file, score }
        })
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score)
    : []
  const groupedSearchResults = searchResults.reduce<Array<{ base: KnowledgeBase | undefined; files: KnowledgeFile[] }>>((acc, item) => {
    const base = allBases.find(kb => kb.id === item.file.kbId)
    const group = acc.find(entry => entry.base?.id === base?.id)
    if (group) group.files.push(item.file)
    else acc.push({ base, files: [item.file] })
    return acc
  }, [])

  const openSearchFile = (file: KnowledgeFile) => {
    const base = allBases.find(kb => kb.id === file.kbId)
    if (base) setActiveBase(base)
    setActiveFile(file)
    navigate('/knowledge/file-detail')
  }

  const renderSearchContent = () => (
    <div className="flex-1 overflow-y-auto scrollbar-hide px-4 py-4">
      {!query ? (
        <div className="space-y-5">
          <section>
            <p className="text-caption text-ink-secondary mb-2">历史搜索</p>
            <div className="flex flex-wrap gap-2">
              {SEARCH_HISTORY.map(item => (
                <button
                  key={item}
                  onClick={() => setSearchQuery(item)}
                  className="px-3 py-1.5 bg-white border border-line-base rounded-pill text-caption text-ink-secondary"
                >
                  {item}
                </button>
              ))}
            </div>
          </section>
          <section>
            <p className="text-caption text-ink-secondary mb-2">推荐搜索</p>
            <div className="space-y-2">
              {SEARCH_SUGGESTIONS.map(item => (
                <button
                  key={item}
                  onClick={() => setSearchQuery(item)}
                  className="w-full px-4 py-3 bg-white rounded-card border border-line-base text-left text-body text-ink-primary"
                >
                  {item}
                </button>
              ))}
            </div>
          </section>
        </div>
      ) : groupedSearchResults.length > 0 ? (
        <div className="space-y-4">
          {groupedSearchResults.map(group => (
            <section key={group.base?.id ?? 'unknown'}>
              <p className="text-caption text-ink-secondary mb-2">{group.base?.name ?? '未知知识库'}</p>
              <div className="space-y-2">
                {group.files.map(file => (
                  <SearchResultRow
                    key={file.id}
                    file={file}
                    base={group.base}
                    onClick={() => openSearchFile(file)}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="py-16 text-center">
          <p className="text-body text-ink-secondary">没有找到相关内容</p>
          <p className="text-caption text-ink-placeholder mt-1">换个关键词试试看</p>
        </div>
      )}
    </div>
  )

  return (
    <TabLayout>
      <div className="flex flex-col h-full bg-surface-card">

        {/* ── Header ── */}
        <div className="bg-white px-5 pt-5 pb-4 border-b border-line-base flex-shrink-0">
          {isSelecting ? (
            <div className="flex items-center justify-between h-8">
              <button onClick={clearSelection} className="w-16 text-left text-body text-ink-secondary">
                取消
              </button>
              <span className="text-body font-semibold text-ink-primary">已选 {selectedItems.length} 项</span>
              <button onClick={toggleSelectAll} className="w-16 text-right text-body text-brand-orange">
                {allK01Selected ? '取消全选' : '全选'}
              </button>
            </div>
          ) : (
            <div className="min-h-10 overflow-hidden">
              {searchActive ? (
                <div className="animate-header-search-expand">
                  <SearchBar
                    value={searchQuery}
                    onChange={setSearchQuery}
                    active={searchActive}
                    onActivate={() => setSearchActive(true)}
                    onCancel={() => {
                      setSearchActive(false)
                      setSearchQuery('')
                    }}
                    placeholder="搜索所有知识库内的内容..."
                  />
                </div>
              ) : (
                <div className="flex items-center justify-between h-10 transition-opacity duration-[250ms]">
                  <h1 className="text-[22px] leading-7 font-semibold text-ink-primary">知识库</h1>
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      aria-label="搜索知识库"
                      onClick={() => setSearchActive(true)}
                      className="w-8 h-8 flex items-center justify-center text-ink-secondary active:text-brand-orange"
                    >
                      <Search size={24} strokeWidth={1.8} />
                    </button>
                    <button
                      type="button"
                      aria-label="发现知识库"
                      onClick={() => navigate('/knowledge/square')}
                      className="w-8 h-8 flex items-center justify-center text-ink-secondary active:text-brand-orange"
                    >
                      <Compass size={24} strokeWidth={1.8} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {!searchActive && !isSelecting && todayUnread > 0 && (
          <button
            type="button"
            onClick={() => navigate('/watch/today')}
            className="h-11 flex-shrink-0 flex items-center justify-between px-4 bg-[#FFF1E6] active:bg-[#FFE4D0] transition-colors"
          >
            <div className="flex items-center gap-2">
              <Target size={16} className="text-[#FF7A00]" />
              <span className="text-[13px] text-ink-primary">今天蹲到 {todayUnread} 条新内容</span>
            </div>
            <span className="text-[11px] font-medium text-[#FF7A00]">查看 →</span>
          </button>
        )}

        {searchActive ? renderSearchContent() : (
          /* ── KB Sections ── */
          <div
            className="flex-1 overflow-y-auto scrollbar-hide px-4 py-4 space-y-4"
            onClick={() => openSwipeId && setOpenSwipeId(null)}
          >
            <RecentSection />

            {/* 个人知识库 */}
            <div className="bg-white rounded-card border border-line-base shadow-card overflow-hidden">
              <button
                onClick={event => {
                  event.stopPropagation()
                  setPersonalExpanded(v => !v)
                }}
                className="w-full flex items-center justify-between px-4 py-3 border-b border-line-base"
              >
                <div className="flex items-center gap-2">
                  <span className="text-caption font-medium text-ink-secondary">个人知识库</span>
                  <span className="text-micro px-1.5 py-0.5 bg-surface-card text-ink-placeholder rounded-pill">{bases.length}</span>
                </div>
                <ChevronDown size={16} className={`text-ink-placeholder transition-transform ${personalExpanded ? '' : '-rotate-90'}`} />
              </button>

              {personalExpanded && (
                <div>
                  {bases.map((kb, i) => (
                    <SwipeableListItem
                      key={kb.id}
                      id={kb.id}
                      actions={getPersonalActions(kb)}
                      open={openSwipeId === kb.id}
                      onOpenChange={setOpenSwipeId}
                      onLongPress={() => beginBaseSelection(kb)}
                    >
                      <button
                        onClick={event => {
                          event.stopPropagation()
                          handleCardClick(kb)
                        }}
                        className={`relative w-full flex items-center gap-3 px-4 py-3.5 text-left active:bg-surface-card transition-colors ${
                          isSelected(kb.id) ? 'bg-brand-orange/[0.04]' : 'bg-white'
                        } ${i < bases.length - 1 ? 'border-b border-line-base' : ''}`}
                      >
                        <SelectionDot visible={isSelecting} selected={isSelected(kb.id)} />
                        <div
                          className="w-10 h-10 rounded-card flex items-center justify-center text-xl flex-shrink-0"
                          style={{ backgroundColor: kb.icon === 'inbox' ? '#F8F8F8' : kb.color + '22' }}
                        >
                          {kb.id === QUICK_NOTES_KB_ID ? (
                            <PenLine size={20} className="text-brand-orange" />
                          ) : kb.icon === 'inbox' ? (
                            <Inbox size={20} className="text-[#9CA3AF]" />
                          ) : (
                            kb.icon
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className="text-card-title text-ink-primary">{kb.name}</p>
                            {kb.isSystem && (
                              <span className="text-[9px] px-1.5 py-0.5 bg-brand-orange-light text-brand-orange rounded-pill whitespace-nowrap">
                                系统默认
                              </span>
                            )}
                          </div>
                          <p className="text-caption text-ink-placeholder mt-0.5">
                            {kb.fileCount} 个内容 · {kb.updatedAt}
                          </p>
                        </div>
                        <ChevronRight size={16} className="text-ink-placeholder flex-shrink-0" />
                      </button>
                    </SwipeableListItem>
                  ))}

                  {/* Add new KB row */}
                  <button
                    onClick={event => {
                      event.stopPropagation()
                      openCreate()
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-brand-orange border-t border-line-base"
                  >
                    <div className="w-10 h-10 rounded-card border border-dashed border-brand-orange-mid flex items-center justify-center flex-shrink-0">
                      <Plus size={18} className="text-brand-orange" />
                    </div>
                    <span className="text-body">新建知识库</span>
                  </button>
                </div>
              )}
            </div>

            {/* 订阅知识库 */}
            <div className="bg-white rounded-card border border-line-base shadow-card overflow-hidden">
              <button
                onClick={event => {
                  event.stopPropagation()
                  setSubscribedExpanded(v => !v)
                }}
                className="w-full flex items-center justify-between px-4 py-3 border-b border-line-base"
              >
                <div className="flex items-center gap-2">
                  <span className="text-caption font-medium text-ink-secondary">订阅知识库</span>
                  <span className="text-micro px-1.5 py-0.5 bg-surface-card text-ink-placeholder rounded-pill">{subscribedBases.length}</span>
                </div>
                <ChevronDown size={16} className={`text-ink-placeholder transition-transform ${subscribedExpanded ? '' : '-rotate-90'}`} />
              </button>

              {subscribedExpanded && (
                <div>
                  {subscribedBases.map((kb, i) => (
                    <SwipeableListItem
                      key={kb.id}
                      id={kb.id}
                      actions={getSubscribedActions(kb)}
                      open={openSwipeId === kb.id}
                      onOpenChange={setOpenSwipeId}
                      onLongPress={() => beginBaseSelection(kb)}
                    >
                      <button
                        onClick={event => {
                          event.stopPropagation()
                          handleCardClick(kb)
                        }}
                        className={`relative w-full flex items-center gap-3 px-4 py-3.5 text-left active:bg-surface-card transition-colors ${
                          isSelected(kb.id) ? 'bg-brand-orange/[0.04]' : 'bg-white'
                        } ${i < subscribedBases.length - 1 ? 'border-b border-line-base' : ''}`}
                      >
                        <SelectionDot visible={isSelecting} selected={isSelected(kb.id)} />
                        <div
                          className="w-10 h-10 rounded-card flex items-center justify-center text-xl flex-shrink-0"
                          style={{ backgroundColor: kb.color + '22' }}
                        >
                          {kb.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-card-title text-ink-primary">{kb.name}</p>
                          <p className="text-caption text-ink-placeholder mt-0.5">
                            {kb.fileCount} 个内容 · {kb.updatedAt}
                          </p>
                        </div>
                        <ChevronRight size={16} className="text-ink-placeholder flex-shrink-0" />
                      </button>
                    </SwipeableListItem>
                  ))}

                  <button
                    onClick={event => {
                      event.stopPropagation()
                      navigate('/knowledge/square')
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-brand-orange border-t border-line-base"
                  >
                    <div className="w-10 h-10 rounded-card border border-dashed border-brand-orange-mid flex items-center justify-center flex-shrink-0">
                      <Globe size={18} className="text-brand-orange" />
                    </div>
                    <span className="text-body">浏览知识库广场</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── K03 新建知识库抽屉 ── */}
        <BottomSheet
          open={showCreate}
          onClose={() => setShowCreate(false)}
          fullHeight={createStep === 'management'}
          heightClassName={createStep === 'management' ? 'h-[85%] max-h-[85%]' : undefined}
        >
          {/* Custom header row */}
          <div className="flex items-center justify-between px-5 pb-3 border-b border-line-base">
            {createStep === 'management' ? (
              <button onClick={() => setCreateStep('basic')} className="text-ink-secondary w-10 flex items-center">
                <ChevronLeft size={22} />
              </button>
            ) : (
              <button onClick={() => setShowCreate(false)} className="text-body text-ink-secondary w-10">取消</button>
            )}
            <span className="text-body font-semibold text-ink-primary">
              {createStep === 'management' ? '选择管理方式' : '新建知识库'}
            </span>
            {createStep === 'basic' ? (
              <button
                onClick={() => setCreateStep('management')}
                disabled={!newName.trim()}
                className="text-body text-brand-orange font-semibold w-12 text-right disabled:opacity-30"
              >
                下一步
              </button>
            ) : (
              <span className="w-10" />
            )}
          </div>

          {createStep === 'basic' ? (
            <>
              <div className="px-5 pt-4">
                <div className="mb-4 rounded-[12px] border border-[#FFE0CC] bg-[#FFF7F0] px-3.5 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[12px] font-semibold text-[#FF7A00]">步骤 1/2</span>
                    <span className="text-[12px] text-[#9CA3AF]">填写名称后，下一步选择管理方式</span>
                  </div>
                </div>

                {/* Icon picker */}
                <div className="flex gap-3 mb-4">
                  {KB_ICONS.map(ic => (
                    <button
                      key={ic}
                      onClick={() => setNewIcon(ic)}
                      className={`w-12 h-12 rounded-full text-2xl flex items-center justify-center border-2 transition-colors ${
                        newIcon === ic ? 'border-brand-orange bg-brand-orange-light' : 'border-line-base bg-surface-card'
                      }`}
                    >
                      {ic}
                    </button>
                  ))}
                </div>

                {/* Name */}
                <input
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  placeholder="例如：产品资料库"
                  className="w-full px-0 py-2.5 border-b border-line-base text-body text-ink-primary outline-none bg-transparent placeholder:text-ink-placeholder"
                />
                <p className="mt-2 mb-1 text-[12px] leading-4 text-[#9CA3AF]">
                  {newName.trim() ? '可以点击右上角「下一步」了' : '先填写知识库名称'}
                </p>

                {/* Description */}
                <textarea
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                  placeholder="简单描述这个知识库的内容..."
                  rows={2}
                  className="w-full px-0 py-2.5 border-b border-line-base text-body text-ink-secondary outline-none bg-transparent placeholder:text-ink-placeholder resize-none mb-4"
                />
              </div>

              {/* Color row */}
              <div className="px-5 pb-3 flex gap-2.5">
                {KB_COLORS.map(c => (
                  <button
                    key={c}
                    onClick={() => setNewColor(c)}
                    className={`w-7 h-7 rounded-full transition-transform ${newColor === c ? 'scale-125 ring-2 ring-offset-1 ring-ink-placeholder' : ''}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>

              {/* Permission */}
              <div className="border-t border-line-base">
                <p className="text-caption text-ink-placeholder px-5 pt-3 pb-1">权限</p>
                <button className="w-full flex items-center justify-between px-5 py-3 border-b border-line-base">
                  <span className="text-body text-ink-primary">可见性</span>
                  <div className="flex items-center gap-1 text-caption text-ink-placeholder">
                    <span>仅自己</span>
                    <ChevronRight size={14} />
                  </div>
                </button>
              </div>

              {/* AI settings */}
              <div className="border-t border-line-base">
                <p className="text-caption text-ink-placeholder px-5 pt-3 pb-1">AI 设置</p>
                <ToggleRow
                  label="允许 AI 在同一问中引用"
                  sub="AI 回答时可检索此知识库"
                  value={aiRef}
                  onChange={setAiRef}
                />
                <ToggleRow
                  label="订阅时自动同步更新"
                  value={autoSync}
                  onChange={setAutoSync}
                />
              </div>
            </>
          ) : (
            <div className="flex h-full min-h-0 flex-col px-5 pt-4">
              <div className="flex-shrink-0">
                <p className="text-[13px] leading-5 text-[#4A4A4A] text-center">
                  决定了知识库怎么帮你整理内容，之后可以改
                </p>
              </div>
              <div className="mt-4 flex-1 min-h-0 space-y-3 overflow-y-auto scrollbar-hide pb-4">
                {MANAGEMENT_OPTIONS.map(option => (
                  <ManagementModeCard
                    key={option.id}
                    option={option}
                    selected={newManagementMode === option.id}
                    onClick={() => setNewManagementMode(option.id)}
                  />
                ))}
              </div>
              <div className="-mx-5 flex-shrink-0 border-t border-line-base/70 bg-white px-5 pt-3 pb-4">
                <button
                  onClick={() => handleCreate('free')}
                  className="w-full py-2 text-center text-body text-ink-secondary"
                >
                  跳过，先用默认
                </button>
                <button
                  onClick={() => handleCreate()}
                  disabled={!newManagementMode}
                  className="w-full mt-2 py-3.5 rounded-btn bg-[#FF7A00] text-white text-body font-semibold disabled:bg-[#FFE0CC]"
                >
                  确认
                </button>
              </div>
            </div>
          )}
        </BottomSheet>

        <BottomSheet
          open={Boolean(renamingBase)}
          onClose={() => setRenamingBase(null)}
          title="知识库设置"
          titleAlign="center"
          titleClassName="text-[17px] leading-6 font-semibold text-ink-primary"
          heightClassName="h-[85%] max-h-[85%]"
        >
          <div className="px-5 pt-4 pb-5">
            <p className="text-caption text-ink-secondary mb-3 text-center">修改名称、图标和管理方式</p>
            <div className="flex gap-3 mb-4">
              {KB_ICONS.map(ic => (
                <button
                  key={ic}
                  onClick={() => setRenameIcon(ic)}
                  className={`w-12 h-12 rounded-full text-2xl flex items-center justify-center border-2 transition-colors ${
                    renameIcon === ic ? 'border-brand-orange bg-brand-orange-light' : 'border-line-base bg-surface-card'
                  }`}
                >
                  {ic}
                </button>
              ))}
            </div>
            <input
              value={renameName}
              onChange={event => setRenameName(event.target.value)}
              placeholder="知识库名称"
              className="w-full px-4 py-3 bg-surface-card rounded-card border border-line-base text-body text-ink-primary outline-none placeholder:text-ink-placeholder"
            />
            <div className="mt-5">
              <p className="text-caption text-ink-secondary mb-2">管理方式</p>
              <div className="space-y-3">
                {MANAGEMENT_OPTIONS.map(option => (
                  <ManagementModeCard
                    key={option.id}
                    option={option}
                    selected={renameManagementMode === option.id}
                    onClick={() => setRenameManagementMode(option.id)}
                  />
                ))}
              </div>
            </div>
            <button
              onClick={confirmRename}
              disabled={!renameName.trim()}
              className="w-full mt-4 py-3.5 bg-brand-orange text-white rounded-btn text-body font-medium disabled:opacity-40"
            >
              保存修改
            </button>
          </div>
        </BottomSheet>

      </div>
    </TabLayout>
  )
}
