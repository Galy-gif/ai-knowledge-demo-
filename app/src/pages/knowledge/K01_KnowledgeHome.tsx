import { useState, useMemo, useRef, useLayoutEffect, type PointerEvent as ReactPointerEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Crosshair, Plus, Sparkles, Check, ChevronRight, Play } from 'lucide-react'
import TabLayout from '../../components/layout/TabLayout'
import BottomSheet from '../../components/ui/BottomSheet'
import { useWatch } from '../../context/WatchContext'
import { findMatchingPwaTemplate, getPwaTemplateById } from '../../mock/pwaTemplates'
import {
  mockCollectionCategories,
  mockCollectionItems,
  mockCategoryRecommends,
  type CollectionItem,
  type CollectionCategoryId,
} from '../../mock/data'

type CategoryFilter = 'all' | CollectionCategoryId
const FAB_SIZE = 48
const MARGIN = 16
const DRAG_THRESHOLD = 4
const CATEGORY_TEMPLATE_FALLBACK: Partial<Record<CollectionCategoryId, string>> = {
  article: 'reading-shelf',
  qa: 'reading-shelf',
  novel: 'reading-shelf',
  video: 'watchlist-helper',
  short_drama: 'watchlist-helper',
  music: 'doc-pack',
}

const ORG_OPTIONS: Array<{
  value: boolean
  title: string
  subtitle: string
  desc: string
  badge?: 'ai'
}> = [
  {
    value: true,
    title: '自动整理与维护',
    subtitle: 'AI 全自动分类、链接、清理',
    desc: '收藏进来的内容由 AI 自动按类型归类、去重、整理，你不用手动管。',
    badge: 'ai',
  },
  {
    value: false,
    title: '不整理',
    subtitle: '按添加顺序排列，自己掌控',
    desc: '想到什么丢什么，按收藏时间排列，不做任何自动归类。',
  },
]

function ContentCard({ item, onGenerate }: { item: CollectionItem; onGenerate: (item: CollectionItem) => void }) {
  const isPoster = item.categoryId === 'video' || item.categoryId === 'short_drama'
  const hideThumb = item.categoryId === 'article' || item.categoryId === 'qa'

  const cardContent = (
      <div className="flex gap-3">
        {hideThumb ? null : isPoster ? (
          <div
            className="relative flex h-[72px] w-[54px] flex-shrink-0 items-center justify-center overflow-hidden rounded-card"
            style={{ background: `linear-gradient(135deg, ${item.thumbGradient[0]}, ${item.thumbGradient[1]})` }}
          >
            <span className="text-[26px] opacity-90">{item.thumbEmoji}</span>
            <span className="absolute bottom-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-black/45 backdrop-blur-sm">
              <Play size={9} className="text-white" fill="white" />
            </span>
          </div>
        ) : (
          <div
            className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-card text-[24px]"
            style={{ background: `linear-gradient(135deg, ${item.thumbGradient[0]}, ${item.thumbGradient[1]})` }}
          >
            {item.thumbEmoji}
          </div>
        )}
        <div className="min-w-0 flex-1 pr-10">
          <p className="line-clamp-1 text-card-title text-ink-primary">{item.title}</p>
          <p className="mt-0.5 line-clamp-1 text-caption leading-[1.45] text-ink-secondary">{item.summary}</p>
          <div className="mt-1.5 flex items-center gap-2 text-micro text-ink-placeholder">
            <span className="min-w-0 truncate">{item.sourceEmoji} {item.source} · {item.savedAt}</span>
            <span className="ml-auto flex-shrink-0 rounded-pill bg-surface-card px-1.5 py-0.5 text-[10px] leading-3 text-ink-secondary">
              {item.tagLabel}
            </span>
          </div>
        </div>
      </div>
  )

  return (
    <div className="relative w-full rounded-card border border-line-base bg-white p-3 text-left shadow-card">
      {item.url && (
        <a
          href={item.url}
          className="absolute inset-0 z-0 rounded-card"
          aria-label={`打开「${item.title}」原文`}
        />
      )}
      <button
        type="button"
        aria-label={`基于「${item.title}」生成小应用`}
        title="基于此内容生成小应用"
        onClick={() => onGenerate(item)}
        className="absolute right-2.5 top-2.5 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-brand-orange-mid/50 bg-brand-orange-light text-brand-orange shadow-[0_4px_12px_rgba(255,122,0,0.12)] active:scale-95 active:bg-[#FFE4D0]"
      >
        <Sparkles size={15} strokeWidth={2.2} />
      </button>
      <div className="relative z-10 pointer-events-none rounded-card">{cardContent}</div>
    </div>
  )
}

export default function K01_KnowledgeHome() {
  const navigate = useNavigate()
  const { todayUnread } = useWatch()
  const rootRef = useRef<HTMLDivElement>(null)
  const dragState = useRef<{
    dragging: boolean
    moved: boolean
    startClientX: number
    startClientY: number
    startX: number
    startY: number
  }>({
    dragging: false,
    moved: false,
    startClientX: 0,
    startClientY: 0,
    startX: 0,
    startY: 0,
  })
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all')
  const [searchActive, setSearchActive] = useState(false)
  const [aiOrganize, setAiOrganize] = useState(true)
  const [showOrgSheet, setShowOrgSheet] = useState(false)
  const [fabPos, setFabPos] = useState<{ x: number; y: number } | null>(null)
  const [isFabDragging, setIsFabDragging] = useState(false)
  const [fabReady, setFabReady] = useState(false)

  const visibleCategories = useMemo(
    () => mockCollectionCategories.filter(category => category.id !== 'quote'),
    []
  )

  const visibleItems = useMemo(
    () => mockCollectionItems.filter(item => item.categoryId !== 'quote'),
    []
  )

  const categoryTabs = useMemo(
    () => [{ id: 'all' as const, label: '全部' }, ...visibleCategories],
    [visibleCategories]
  )

  const filteredItems = useMemo(() => {
    if (activeCategory === 'all') return visibleItems
    return visibleItems.filter(item => item.categoryId === activeCategory)
  }, [activeCategory, visibleItems])

  const handleCategoryChange = (categoryId: CategoryFilter) => {
    setActiveCategory(categoryId)
  }

  const handleGenerateFromItem = (item: CollectionItem) => {
    const matchText = `${item.title} ${item.summary} ${item.tagLabel} ${item.source}`
    const fallbackTemplateId = CATEGORY_TEMPLATE_FALLBACK[item.categoryId] ?? 'doc-pack'
    const template = findMatchingPwaTemplate(matchText) ?? getPwaTemplateById(fallbackTemplateId) ?? getPwaTemplateById('doc-pack')
    const selectedFeatures = template?.defaultFeatures ?? template?.coreFeatures.split('、').map(feature => feature.trim()) ?? [
      '内容速览',
      '要点整理',
      'AI 推荐',
    ]
    const resultAppName = template?.resultAppName ?? `${item.title.slice(0, 8)}助手`

    navigate('/ask/task-generate-confirm', {
      state: {
        requirement: `基于「${item.title}」生成一个小应用，方便持续整理、查看和复用这条内容。`,
        templateId: template?.id,
        templateName: template?.name ?? '内容小应用',
        templateIcon: template?.icon ?? item.thumbEmoji,
        templateCoreFeatures: template?.coreFeatures ?? '内容速览、要点整理、AI 推荐',
        targetRuntimeType: template?.targetRuntimeType,
        resultAppName,
        resultAppId: template?.resultAppId,
        resultMainColor: template?.resultMainColor ?? 'orange',
        selectedKbIds: [`collection:${item.id}`],
        selectedKbNames: [item.title],
        selectedFeatures,
        customRequirement: `内容来源：${item.source}；类型：${item.tagLabel}；摘要：${item.summary}`,
        sourcePath: '/knowledge',
        sourceState: {
          from: 'knowledge_content_card',
          itemId: item.id,
          categoryId: item.categoryId,
          title: item.title,
          summary: item.summary,
          source: item.source,
          tagLabel: item.tagLabel,
        },
      },
    })
  }

  useLayoutEffect(() => {
    const el = rootRef.current
    if (!el) return
    const { clientWidth: w, clientHeight: h } = el
    setFabPos({ x: w - FAB_SIZE - MARGIN, y: h - FAB_SIZE - MARGIN - 12 })
    const frame = window.requestAnimationFrame(() => setFabReady(true))
    return () => window.cancelAnimationFrame(frame)
  }, [])

  const onFabPointerDown = (e: ReactPointerEvent<HTMLButtonElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    const currentPos = fabPos
    if (!currentPos) return
    dragState.current = {
      dragging: true,
      moved: false,
      startClientX: e.clientX,
      startClientY: e.clientY,
      startX: currentPos.x,
      startY: currentPos.y,
    }
    setIsFabDragging(true)
  }

  const onFabPointerMove = (e: ReactPointerEvent<HTMLButtonElement>) => {
    const st = dragState.current
    if (!st.dragging) return
    const el = rootRef.current
    if (!el) return
    const dx = e.clientX - st.startClientX
    const dy = e.clientY - st.startClientY
    let x = st.startX + dx
    let y = st.startY + dy
    if (Math.abs(dx) + Math.abs(dy) > DRAG_THRESHOLD) st.moved = true
    const maxX = el.clientWidth - FAB_SIZE - MARGIN
    const maxY = el.clientHeight - FAB_SIZE - 24
    x = Math.min(Math.max(MARGIN, x), maxX)
    y = Math.min(Math.max(72, y), maxY)
    setFabPos({ x, y })
  }

  const onFabPointerUp = (e: ReactPointerEvent<HTMLButtonElement>) => {
    const st = dragState.current
    if (!st.dragging) return
    st.dragging = false
    setIsFabDragging(false)
    const el = rootRef.current
    if (el) {
      setFabPos(prev => {
        if (!prev) return prev
        const center = prev.x + FAB_SIZE / 2
        const snapX = center < el.clientWidth / 2 ? MARGIN : el.clientWidth - FAB_SIZE - MARGIN
        return { ...prev, x: snapX }
      })
    }
    try {
      e.currentTarget.releasePointerCapture(e.pointerId)
    } catch {
      // noop
    }
  }

  const onFabClick = () => {
    if (dragState.current.moved) {
      dragState.current.moved = false
      return
    }
    navigate('/knowledge/upload')
  }

  return (
    <TabLayout>
      <div ref={rootRef} className="relative flex h-full flex-col bg-surface-card">
        <div className="flex-shrink-0 bg-white">
          <header className="px-5 pt-6 pb-3">
            <div className="flex items-center justify-between gap-3">
              <h1 className="text-h1 text-ink-primary">资料包</h1>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  aria-label="蹲一蹲"
                  onClick={() => navigate('/watch/today')}
                  className="relative flex h-8 w-8 items-center justify-center text-ink-secondary active:text-brand-orange"
                >
                  <Crosshair size={22} strokeWidth={1.8} />
                  {todayUnread > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 h-4 min-w-[16px] rounded-full bg-brand-orange px-1 text-center text-[10px] leading-4 text-white">
                      {todayUnread}
                    </span>
                  )}
                </button>
                <button
                  type="button"
                  aria-label="搜索"
                  onClick={() => setSearchActive(true)}
                  className="flex h-8 w-8 items-center justify-center text-ink-secondary active:text-brand-orange"
                >
                  <Search size={22} strokeWidth={1.8} />
                </button>
              </div>
            </div>
            {searchActive && (
              <div className="mt-3 flex items-center gap-2 rounded-card bg-surface-card px-3 py-2">
                <Search size={16} className="text-ink-placeholder" />
                <input
                  autoFocus
                  readOnly
                  placeholder="搜索功能即将上线"
                  className="min-w-0 flex-1 bg-transparent text-body text-ink-secondary outline-none placeholder:text-ink-placeholder"
                />
                <button
                  type="button"
                  onClick={() => setSearchActive(false)}
                  className="text-caption text-ink-placeholder"
                >
                  取消
                </button>
              </div>
            )}
          </header>

          <div className="sticky top-0 z-10 border-t border-line-base bg-white py-2.5">
            <div className="overflow-x-auto scrollbar-hide px-5">
              <div className="flex min-w-max gap-2">
                {categoryTabs.map(category => {
                  const selected = activeCategory === category.id
                  return (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => handleCategoryChange(category.id)}
                      className={`h-8 px-4 rounded-pill text-[13px] whitespace-nowrap flex-shrink-0 transition-colors ${
                        selected
                          ? 'bg-brand-orange text-white'
                          : 'bg-white border border-line-base text-ink-secondary'
                      }`}
                    >
                      {category.label}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-hide bg-surface-card pb-20">
          {/* AI 整理横幅（紧凑一行） */}
          <button
            type="button"
            onClick={() => setShowOrgSheet(true)}
            className="mx-4 mt-3 w-[calc(100%-2rem)] flex items-center gap-2 rounded-card bg-brand-orange-light border border-brand-orange-mid/40 px-3 py-2 text-left"
          >
            <Sparkles size={15} className="text-brand-orange flex-shrink-0" />
            <span className="text-caption text-ink-primary flex-1 min-w-0 truncate">
              {aiOrganize
                ? `AI 自动整理中 · 已归类 ${visibleItems.length} 条`
                : `未启用整理 · 共 ${visibleItems.length} 条收藏`}
            </span>
            <span className="text-micro text-brand-orange flex-shrink-0">切换 ›</span>
          </button>

          {activeCategory === 'all' ? (
            <>
              {aiOrganize ? (
                // AI 自动整理：按分类分组
                <>
                  {visibleCategories.map(category => {
                    const categoryItems = visibleItems.filter(item => item.categoryId === category.id)
                    const previewItems = categoryItems.slice(0, 3)
                    if (previewItems.length === 0) return null
                    return (
                      <section key={category.id} className="mt-4">
                        <button
                          type="button"
                          onClick={() => handleCategoryChange(category.id)}
                          className="mb-2 flex w-full items-center justify-between px-4"
                        >
                          <span className="text-card-title text-ink-primary">
                            {category.label}
                            <span className="ml-1 text-caption font-normal text-ink-placeholder">
                              {categoryItems.length}
                            </span>
                          </span>
                          <span className="text-caption text-ink-placeholder">›</span>
                        </button>
                        <div className="space-y-2.5 px-4">
                          {previewItems.map(item => (
                            <ContentCard key={item.id} item={item} onGenerate={handleGenerateFromItem} />
                          ))}
                        </div>
                        {(() => {
                          const rec = mockCategoryRecommends.find(r => r.categoryId === category.id)
                          if (!rec) return null
                          return (
                            <button
                              type="button"
                              onClick={() => navigate(`/knowledge/recommend/${category.id}`)}
                              className="mt-2.5 mx-4 w-[calc(100%-2rem)] flex items-center gap-2.5 rounded-card border border-brand-orange-mid/40 bg-brand-orange-light/60 p-2.5 text-left active:bg-brand-orange-light"
                            >
                              <Sparkles size={14} className="text-brand-orange flex-shrink-0" />
                              <div className="min-w-0 flex-1">
                                <p className="text-caption text-ink-primary truncate">
                                  <span className="text-brand-orange font-medium">AI 推荐</span> · {rec.name}
                                </p>
                                <p className="text-micro text-ink-placeholder mt-0.5 line-clamp-1">{rec.reason}</p>
                              </div>
                              <span className="text-micro text-brand-orange flex-shrink-0">更多 ›</span>
                            </button>
                          )
                        })()}
                      </section>
                    )
                  })}
                </>
              ) : (
                // 不整理：按 savedOrder 倒序平铺
                <div className="space-y-2.5 px-4 pt-1 pb-2">
                  {[...visibleItems]
                    .sort((a, b) => b.savedOrder - a.savedOrder)
                    .map(item => <ContentCard key={item.id} item={item} onGenerate={handleGenerateFromItem} />)}
                </div>
              )}
            </>
          ) : filteredItems.length === 0 ? (
            <div className="flex h-full items-center justify-center px-5 text-caption text-ink-placeholder">
              这个分类还没有收藏内容
            </div>
          ) : (
            <>
              <div className="space-y-2.5 px-4 py-3">
                {filteredItems.map(item => (
                  <ContentCard key={item.id} item={item} onGenerate={handleGenerateFromItem} />
                ))}
              </div>
              {(() => {
                const recs = mockCategoryRecommends.filter(r => r.categoryId === activeCategory)
                if (recs.length === 0) return null
                const preview = recs.slice(0, 2)
                return (
                  <div className="mx-4 mt-2 mb-4 rounded-card-lg bg-gradient-to-b from-brand-orange-light to-white border border-brand-orange-mid/40 p-3">
                    <div className="flex items-center gap-1.5 mb-2.5 px-1">
                      <Sparkles size={16} className="text-brand-orange" />
                      <span className="text-card-title text-ink-primary">AI 为你推荐</span>
                      <span className="text-micro text-ink-placeholder">· 基于这类收藏</span>
                    </div>
                    <div className="space-y-2">
                      {preview.map(rec => (
                        <button
                          key={rec.id}
                          onClick={() => navigate('/knowledge/square')}
                          className="w-full flex items-center gap-3 rounded-card bg-white border border-line-base p-2.5 text-left active:bg-surface-card"
                        >
                          <span
                            className="w-10 h-10 rounded-card flex items-center justify-center text-[20px] flex-shrink-0"
                            style={{ backgroundColor: rec.coverColor }}
                          >
                            {rec.coverEmoji}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-card-title text-ink-primary truncate">{rec.name}</p>
                            <p className="text-micro text-brand-orange mt-0.5 line-clamp-1">💡 {rec.reason}</p>
                          </div>
                          <span className="flex-shrink-0 h-7 px-3 rounded-pill bg-brand-orange-light text-brand-orange text-[11px] font-medium flex items-center">查看</span>
                        </button>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => navigate(`/knowledge/recommend/${activeCategory}`)}
                      className="mt-2.5 w-full h-9 rounded-card bg-white border border-brand-orange-mid/50 text-brand-orange text-[13px] font-medium flex items-center justify-center gap-1"
                    >
                      查看更多推荐 <ChevronRight size={14} />
                    </button>
                  </div>
                )
              })()}
            </>
          )}
        </div>

        <button
          type="button"
          aria-label="添加内容"
          onPointerDown={onFabPointerDown}
          onPointerMove={onFabPointerMove}
          onPointerUp={onFabPointerUp}
          onPointerCancel={onFabPointerUp}
          onClick={onFabClick}
          className="absolute z-30 flex h-12 w-12 touch-none items-center justify-center rounded-full bg-brand-orange text-white shadow-float"
          style={{
            left: 0,
            top: 0,
            opacity: fabReady ? 1 : 0,
            transform: fabPos ? `translate(${fabPos.x}px, ${fabPos.y}px)` : 'translate(0, 0)',
            transition: fabReady && !isFabDragging ? 'transform 200ms ease-out' : 'none',
          }}
        >
          <Plus size={24} strokeWidth={2.4} />
        </button>

        <BottomSheet open={showOrgSheet} onClose={() => setShowOrgSheet(false)} title="选择整理方式" titleAlign="center">
          <div className="px-4 pb-4">
            <p className="text-caption text-ink-secondary mb-3">选一种适合你的整理策略，之后可以改</p>
            <div className="space-y-2.5">
              {ORG_OPTIONS.map(opt => {
                const selected = aiOrganize === opt.value
                return (
                  <button
                    key={opt.title}
                    type="button"
                    onClick={() => { setAiOrganize(opt.value); setShowOrgSheet(false) }}
                    className={`w-full rounded-card border p-3 text-left ${
                      selected ? 'border-brand-orange bg-brand-orange-light' : 'border-line-base bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-card-title text-ink-primary">{opt.title}</span>
                      <div className="flex items-center gap-1.5">
                        {opt.badge === 'ai' && (
                          <span className="text-micro text-brand-orange font-medium">AI 推荐</span>
                        )}
                        {selected && <Check size={16} className="text-brand-orange" />}
                      </div>
                    </div>
                    <p className="text-caption text-brand-orange mt-0.5">{opt.subtitle}</p>
                    <p className="text-caption text-ink-secondary mt-1">{opt.desc}</p>
                  </button>
                )
              })}
            </div>
          </div>
        </BottomSheet>
      </div>
    </TabLayout>
  )
}
