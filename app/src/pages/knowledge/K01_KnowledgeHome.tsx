import { useState, useMemo, useRef, useLayoutEffect, type PointerEvent as ReactPointerEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Crosshair, Compass, Plus, Sparkles } from 'lucide-react'
import TabLayout from '../../components/layout/TabLayout'
import { useWatch } from '../../context/WatchContext'
import {
  mockCollectionCategories,
  mockCollectionItems,
  type CollectionItem,
  type CollectionCategoryId,
} from '../../mock/data'

type CategoryFilter = 'all' | CollectionCategoryId
const FAB_SIZE = 48
const MARGIN = 16
const DRAG_THRESHOLD = 4

function ContentCard({ item }: { item: CollectionItem }) {
  return (
    <button
      type="button"
      onClick={() => {
        // TODO: 后续接入全局收藏详情页。
      }}
      className="w-full rounded-card border border-line-base bg-white p-3 text-left shadow-card active:bg-surface-card"
    >
      <div className="flex gap-3">
        <div
          className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-card text-[24px]"
          style={{
            background: `linear-gradient(135deg, ${item.thumbGradient[0]}, ${item.thumbGradient[1]})`,
          }}
        >
          {item.thumbEmoji}
        </div>
        <div className="min-w-0 flex-1">
          <p className="line-clamp-1 text-card-title text-ink-primary">{item.title}</p>
          <p className="mt-0.5 line-clamp-2 text-caption leading-[1.45] text-ink-secondary">
            {item.summary}
          </p>
          <div className="mt-1.5 flex items-center gap-2 text-micro text-ink-placeholder">
            <span className="min-w-0 truncate">
              {item.sourceEmoji} {item.source} · {item.savedAt}
            </span>
            <span className="ml-auto flex-shrink-0 rounded-pill bg-surface-card px-1.5 py-0.5 text-[10px] leading-3 text-ink-secondary">
              {item.secondaryTag}
            </span>
          </div>
        </div>
      </div>
    </button>
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
  const [activeSecondary, setActiveSecondary] = useState('全部')
  const [searchActive, setSearchActive] = useState(false)
  const [fabPos, setFabPos] = useState<{ x: number; y: number } | null>(null)
  const [isFabDragging, setIsFabDragging] = useState(false)
  const [fabReady, setFabReady] = useState(false)

  const categoryTabs = useMemo(
    () => [{ id: 'all' as const, label: '全部', emoji: '' }, ...mockCollectionCategories],
    []
  )
  const currentCategory = activeCategory === 'all'
    ? undefined
    : mockCollectionCategories.find(category => category.id === activeCategory)
  const secondaryTags = currentCategory ? ['全部', ...currentCategory.secondaryTags] : []

  const filteredItems = useMemo(() => {
    return mockCollectionItems.filter(item => {
      const categoryMatched = activeCategory === 'all' || item.categoryId === activeCategory
      const secondaryMatched = activeSecondary === '全部' || item.secondaryTag === activeSecondary
      return categoryMatched && secondaryMatched
    })
  }, [activeCategory, activeSecondary])

  const handleCategoryChange = (categoryId: CategoryFilter) => {
    setActiveCategory(categoryId)
    setActiveSecondary('全部')
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
              <h1 className="text-h1 text-ink-primary">兴趣库</h1>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  aria-label="发现广场"
                  onClick={() => navigate('/knowledge/square')}
                  className="flex h-8 w-8 items-center justify-center text-ink-secondary active:text-brand-orange"
                >
                  <Compass size={22} strokeWidth={1.8} />
                </button>
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

          <div className="sticky top-0 z-10 border-t border-line-base bg-white">
            <div className="overflow-x-auto scrollbar-hide px-5">
              <div className="flex min-w-max gap-5">
                {categoryTabs.map(category => {
                  const selected = activeCategory === category.id
                  return (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => handleCategoryChange(category.id)}
                      className={`relative flex h-11 items-center gap-1 whitespace-nowrap text-[15px] ${
                        selected ? 'font-semibold text-ink-primary' : 'text-ink-placeholder'
                      }`}
                    >
                      {category.emoji && <span>{category.emoji}</span>}
                      <span>{category.label}</span>
                      {selected && (
                        <span className="absolute bottom-0 left-0 right-0 h-[3px] rounded-full bg-brand-orange" />
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {activeCategory !== 'all' && (
            <div className="border-t border-line-base bg-white py-2.5">
              <div className="overflow-x-auto scrollbar-hide px-5">
                <div className="flex min-w-max gap-2">
                  {secondaryTags.map(tag => {
                    const selected = activeSecondary === tag
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => setActiveSecondary(tag)}
                        className={`rounded-pill px-3 py-1 text-[12px] leading-4 ${
                          selected
                            ? 'bg-brand-orange-light text-brand-orange'
                            : 'bg-surface-card text-ink-secondary'
                        }`}
                      >
                        {tag}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-hide bg-surface-card pb-20">
          {activeCategory === 'all' ? (
            <>
              <div className="mx-4 mt-3 rounded-card bg-brand-orange-light border border-brand-orange-mid/40 px-4 py-3">
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-brand-orange" />
                  <span className="text-card-title text-ink-primary">
                    AI 已为你整理 {mockCollectionItems.length} 条收藏
                  </span>
                </div>
                <p className="text-caption text-ink-secondary mt-1">
                  自动识别为 {mockCollectionCategories.length} 个内容类型，可按类型快速查找
                </p>
              </div>

              {mockCollectionCategories.map(category => {
                const categoryItems = mockCollectionItems.filter(item => item.categoryId === category.id)
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
                        {category.emoji} {category.label}
                        <span className="ml-1 text-caption font-normal text-ink-placeholder">
                          {categoryItems.length}
                        </span>
                      </span>
                      <span className="text-caption text-ink-placeholder">查看全部 ›</span>
                    </button>
                    <div className="space-y-2.5 px-4">
                      {previewItems.map(item => (
                        <ContentCard key={item.id} item={item} />
                      ))}
                    </div>
                  </section>
                )
              })}
            </>
          ) : filteredItems.length === 0 ? (
            <div className="flex h-full items-center justify-center px-5 text-caption text-ink-placeholder">
              这个分类还没有收藏内容
            </div>
          ) : (
            <div className="space-y-2.5 px-5 py-3">
              {filteredItems.map(item => (
                <ContentCard key={item.id} item={item} />
              ))}
            </div>
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
      </div>
    </TabLayout>
  )
}
