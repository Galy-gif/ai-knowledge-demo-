import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import TopHeader from '../../components/layout/TopHeader'
import Toast from '../../components/common/Toast'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import BottomSheet from '../../components/ui/BottomSheet'
import { useKnowledge } from '../../context/KnowledgeContext'
import { useUser } from '../../context/UserContext'
import type { DiscoverKb } from '../../mock/data'

const COMMON_CATS = ['推荐', '科技', '职场', '财经', '生活', '健康']
const ALL_CATS = ['科技', '教育', '职场', '财经', '产业', '健康', '法律', '人文', '生活', '推荐']

function formatCount(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n)
}

function KbCard({
  kb,
  onNavigate,
  onToggle,
}: {
  kb: DiscoverKb
  onNavigate: () => void
  onToggle: (e: React.MouseEvent) => void
}) {
  return (
    <div
      onClick={onNavigate}
      className="mx-4 mb-[10px] bg-white rounded-card border border-[#EEEEEE] p-[14px] active:bg-surface-card transition-colors cursor-pointer"
    >
      {/* Top: cover + info */}
      <div className="flex items-start gap-3">
        <div
          className="w-12 h-12 rounded-[10px] flex items-center justify-center flex-shrink-0 text-[22px]"
          style={{ backgroundColor: kb.coverColor }}
        >
          {kb.coverEmoji}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-semibold text-ink-primary leading-5">{kb.name}</p>
          <p
            className="text-[12px] leading-[1.4] mt-0.5 overflow-hidden"
            style={{
              color: '#4A4A4A',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {kb.description}
          </p>
          <p className="text-[11px] mt-1" style={{ color: '#9CA3AF' }}>
            by {kb.author.name} · {kb.author.type === 'team' ? '团队' : '个人创作者'}
          </p>
        </div>
      </div>

      {/* Divider + bottom stats */}
      <div className="flex items-center justify-between mt-[10px] pt-[10px] border-t border-[#F0F0F0]">
        <div className="flex items-center gap-4">
          <span className="text-[11px]" style={{ color: '#9CA3AF' }}>
            <span className="font-semibold text-ink-primary">{kb.contentCount}</span> 内容
          </span>
          <span className="text-[11px]" style={{ color: '#9CA3AF' }}>
            <span className="font-semibold text-ink-primary">{formatCount(kb.subscriberCount)}</span> 订阅
          </span>
        </div>
        <button
          onClick={onToggle}
          className="h-6 px-3 rounded-pill text-[11px] font-medium flex-shrink-0 transition-colors"
          style={
            kb.isSubscribed
              ? { backgroundColor: '#F0F0F0', color: '#9CA3AF' }
              : { backgroundColor: '#FFF1E6', color: '#FF7A00' }
          }
        >
          {kb.isSubscribed ? '已订阅' : '+订阅'}
        </button>
      </div>
    </div>
  )
}

export default function K10_KnowledgeSquare() {
  const navigate = useNavigate()
  const { discoverKbs, subscribeDiscoverKb, unsubscribeDiscoverKb } = useKnowledge()
  const { showToast } = useUser()
  const [activeCat, setActiveCat] = useState('推荐')
  const [extraCat, setExtraCat] = useState<string | null>(null)
  const [showMoreSheet, setShowMoreSheet] = useState(false)

  const visibleCats = extraCat && !COMMON_CATS.includes(extraCat)
    ? [...COMMON_CATS, extraCat]
    : COMMON_CATS

  const handleSelectAllCat = (cat: string) => {
    setActiveCat(cat)
    setExtraCat(COMMON_CATS.includes(cat) ? null : cat)
    setShowMoreSheet(false)
  }

  const handleCatClick = (cat: string) => {
    setActiveCat(cat)
    if (COMMON_CATS.includes(cat)) setExtraCat(null)
  }

  const matchesCat = (kb: DiscoverKb) =>
    activeCat === '推荐' ? kb.inRecommend === true : kb.category === activeCat

  const hotKbs = discoverKbs.filter(kb => kb.section === 'hot' && matchesCat(kb))
  const recommendedKbs = discoverKbs.filter(kb => kb.section === 'recommended' && matchesCat(kb))
  const isEmpty = hotKbs.length === 0 && recommendedKbs.length === 0

  const handleToggle = (kb: DiscoverKb, e: React.MouseEvent) => {
    e.stopPropagation()
    if (kb.isSubscribed) {
      unsubscribeDiscoverKb(kb.id)
      showToast('已取消订阅')
    } else {
      subscribeDiscoverKb(kb.id)
      showToast(`已订阅「${kb.name}」`)
    }
  }

  return (
    <div className="flex flex-col h-full relative bg-white">
      <TopHeader
        title="知识广场"
        showBack
        right={
          <button className="p-1">
            <Search size={20} className="text-ink-secondary" />
          </button>
        }
      />

      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {/* Category pills */}
        <div className="flex gap-2 px-4 py-3 overflow-x-auto scrollbar-hide">
          {visibleCats.map(cat => (
            <button
              key={cat}
              onClick={() => handleCatClick(cat)}
              className={`h-8 px-[14px] rounded-pill text-[13px] whitespace-nowrap flex-shrink-0 transition-colors ${
                activeCat === cat
                  ? 'bg-brand-orange text-white'
                  : 'bg-white border border-[#EEEEEE] text-ink-secondary'
              }`}
            >
              {cat}
            </button>
          ))}
          <button
            onClick={() => setShowMoreSheet(true)}
            className="h-8 px-[14px] rounded-pill text-[13px] whitespace-nowrap flex-shrink-0 bg-[#F8F8F8] text-ink-placeholder"
          >
            更多 →
          </button>
        </div>

        {isEmpty && (
          <div className="flex flex-col items-center py-16 text-center px-8">
            <p className="text-body text-ink-secondary">这个分类下暂无知识库</p>
            <p className="text-caption text-ink-placeholder mt-1">换个分类看看</p>
          </div>
        )}

        {/* Section: 本周热门 */}
        {hotKbs.length > 0 && (
          <div className="mb-2">
            <div className="flex items-center justify-between px-4 py-3">
              <p className="text-[13px] font-semibold text-ink-primary">🔥 本周热门</p>
              <button className="text-[11px] text-ink-secondary">全部 →</button>
            </div>
            {hotKbs.map(kb => (
              <KbCard
                key={kb.id}
                kb={kb}
                onNavigate={() => navigate(`/knowledge/kb/${kb.id}`)}
                onToggle={e => handleToggle(kb, e)}
              />
            ))}
          </div>
        )}

        {/* Section: 你可能感兴趣 */}
        {recommendedKbs.length > 0 && (
          <div className="mb-6">
            <div className="px-4 py-3">
              <p className="text-[13px] font-semibold text-ink-primary">⭐ 你可能感兴趣</p>
              <p className="text-[11px] text-ink-placeholder mt-0.5">根据你的知识库内容推荐</p>
            </div>
            {recommendedKbs.map(kb => (
              <KbCard
                key={kb.id}
                kb={kb}
                onNavigate={() => navigate(`/knowledge/kb/${kb.id}`)}
                onToggle={e => handleToggle(kb, e)}
              />
            ))}
          </div>
        )}
      </div>

      {/* All categories sheet */}
      <BottomSheet
        open={showMoreSheet}
        onClose={() => setShowMoreSheet(false)}
        title="全部分类"
      >
        <div className="px-5 pt-3 pb-4 grid grid-cols-2 gap-2.5">
          {ALL_CATS.map(cat => (
            <button
              key={cat}
              onClick={() => handleSelectAllCat(cat)}
              className={`h-11 rounded-card text-[14px] font-medium transition-colors ${
                activeCat === cat
                  ? 'bg-brand-orange text-white'
                  : 'bg-surface-card text-ink-primary'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </BottomSheet>

      <Toast />
      <ConfirmDialog />
    </div>
  )
}
