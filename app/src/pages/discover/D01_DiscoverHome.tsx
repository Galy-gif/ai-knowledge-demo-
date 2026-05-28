import { useMemo, useState } from 'react'
import { Grid2X2, Plus, Search, UserRound } from 'lucide-react'
import TabLayout from '../../components/layout/TabLayout'
import SaveToKnowledgeBaseSheet from '../../components/common/SaveToKnowledgeBaseSheet'
import { mockDiscoverCategories, mockDiscoverFeed, type DiscoverFeedItem } from '../../mock/data'
import type { SaveSourceContent } from '../../context/KnowledgeContext'

const SECTION_TITLES = ['今日热推', '飙升榜单', '同好都在看', '完结好剧', '为你精选']
const ITEMS_PER_SECTION = 3

const DEFAULT_SAVE_CONTENT: SaveSourceContent = {
  title: '',
  body: '',
  type: 'web',
}

function buildSaveContent(item: DiscoverFeedItem): SaveSourceContent {
  return {
    title: item.title,
    body: `# ${item.title}\n\n${item.subtitle}\n\n${item.meta} · 评分 ${item.score}\n\n标签：${item.tags.join('、')}`,
    type: 'web',
    metadata: { source: 'discover', kind: item.kind, score: item.score },
  }
}

function DiscoverFeedCard({
  item,
  onSave,
}: {
  item: DiscoverFeedItem
  onSave: (item: DiscoverFeedItem) => void
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => undefined}
      onKeyDown={() => undefined}
      className="flex flex-col"
    >
      <div
        className="relative flex aspect-[3/4] items-center justify-center overflow-hidden rounded-[10px]"
        style={{ background: `linear-gradient(135deg, ${item.cover.gradient[0]}, ${item.cover.gradient[1]})` }}
      >
        <span className="text-[32px] leading-none opacity-90">{item.cover.emoji}</span>
        <span className="absolute bottom-1.5 left-1.5 flex items-center gap-0.5 rounded-[4px] bg-black/45 px-1.5 py-0.5 text-[10px] leading-3 font-medium text-white backdrop-blur-sm">
          ★ {item.score}
        </span>
        {item.hot && (
          <span className="absolute top-1.5 right-1.5 rounded-[4px] bg-brand-orange px-1.5 py-0.5 text-[9px] leading-3 font-semibold text-white">
            🔥
          </span>
        )}
        <button
          type="button"
          onClick={event => {
            event.stopPropagation()
            onSave(item)
          }}
          aria-label="加入资料包"
          className="absolute bottom-1.5 right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-white/95 text-brand-orange shadow-sm active:bg-brand-orange-light"
        >
          <Plus size={13} strokeWidth={2.5} />
        </button>
      </div>

      <div className="mt-1.5 px-0.5">
        <h4 className="min-h-[32px] text-[12px] leading-[16px] font-medium text-ink-primary line-clamp-2">
          {item.title}
        </h4>
        <p className="mt-0.5 text-[10px] leading-3 text-ink-placeholder line-clamp-1">
          {item.tags.slice(0, 2).join(' · ')}
          {item.meta && ` · ${item.meta.split('·')[0].trim()}`}
        </p>
      </div>
    </div>
  )
}

export default function D01_DiscoverHome() {
  const [activeCategoryId, setActiveCategoryId] = useState('all')
  const [showKbSheet, setShowKbSheet] = useState(false)
  const [savePayload, setSavePayload] = useState<SaveSourceContent>(DEFAULT_SAVE_CONTENT)

  const activeCategory = mockDiscoverCategories.find(category => category.id === activeCategoryId) ?? mockDiscoverCategories[0]
  const feedItems = useMemo(() => {
    if (activeCategory.kinds === 'all') return mockDiscoverFeed
    return mockDiscoverFeed.filter(item => activeCategory.kinds.includes(item.kind))
  }, [activeCategory])
  const sections = useMemo(
    () => Array.from({ length: Math.ceil(feedItems.length / ITEMS_PER_SECTION) }, (_, index) => ({
      title: SECTION_TITLES[index % SECTION_TITLES.length],
      subtitle: index === 0 ? '为你精选' : '正在升温',
      items: feedItems.slice(index * ITEMS_PER_SECTION, index * ITEMS_PER_SECTION + ITEMS_PER_SECTION),
    })),
    [feedItems],
  )

  const openSaveSheet = (item: DiscoverFeedItem) => {
    setSavePayload(buildSaveContent(item))
    setShowKbSheet(true)
  }

  return (
    <TabLayout>
      <div className="relative flex h-full flex-col bg-surface-card">
        <div className="sticky top-0 z-20 flex-shrink-0 bg-white px-4 pt-5 pb-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="flex h-10 min-w-0 flex-1 items-center gap-2 rounded-[12px] border border-line-base bg-white px-3 text-left text-ink-placeholder"
            >
              <Search size={18} className="flex-shrink-0" />
              <span className="truncate text-[13px] leading-5">搜索喜欢的内容...</span>
            </button>
            <button type="button" className="flex w-9 flex-shrink-0 flex-col items-center gap-0.5 text-ink-secondary">
              <Grid2X2 size={20} strokeWidth={1.8} />
              <span className="text-[10px] leading-3">分类</span>
            </button>
            <button type="button" className="flex w-9 flex-shrink-0 flex-col items-center gap-0.5 text-ink-secondary">
              <UserRound size={20} strokeWidth={1.8} />
              <span className="text-[10px] leading-3">我的</span>
            </button>
          </div>

          <div className="mt-4 flex gap-6 overflow-x-auto whitespace-nowrap scrollbar-hide">
            {mockDiscoverCategories.map(category => {
              const active = category.id === activeCategoryId
              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setActiveCategoryId(category.id)}
                  className={`relative pb-2 text-[16px] leading-6 ${
                    active ? 'font-semibold text-ink-primary' : 'font-medium text-ink-placeholder'
                  }`}
                >
                  {category.label}
                  {active && (
                    <span className="absolute left-1/2 bottom-0 h-1 w-6 -translate-x-1/2 rounded-pill bg-brand-orange" />
                  )}
                </button>
              )
            })}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-hide px-3 pb-4 pt-1">
          {sections.map(section => (
            <section key={section.title} className="mb-5">
              <header className="mb-2.5 flex items-baseline gap-2 px-1">
                <h3 className="text-[14px] leading-5 font-semibold text-ink-primary">{section.title}</h3>
                <span className="text-[10px] leading-3 text-ink-placeholder">{section.subtitle}</span>
              </header>
              <div className="grid grid-cols-3 gap-2.5">
                {section.items.map(item => (
                  <DiscoverFeedCard key={item.id} item={item} onSave={openSaveSheet} />
                ))}
              </div>
            </section>
          ))}
        </div>

        <SaveToKnowledgeBaseSheet
          open={showKbSheet}
          onClose={() => setShowKbSheet(false)}
          sourceContent={savePayload}
          title="加入资料包"
          successToast={kb => `已加入「${kb.name}」资料包`}
        />
      </div>
    </TabLayout>
  )
}
