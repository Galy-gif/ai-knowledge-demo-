import { useNavigate } from 'react-router-dom'
import { Sparkles } from 'lucide-react'
import PageLayout from '../../components/layout/PageLayout'
import TopHeader from '../../components/layout/TopHeader'
import { useWatch, type TodayItem } from '../../context/WatchContext'

// ─── Platform badge ───────────────────────────────────────────────────────────

const PLATFORM_CFG: Record<string, { name: string; char: string; color: string; bg: string }> = {
  xiaohongshu: { name: '小红书', char: '书', color: '#FF2442', bg: '#FFF1F3' },
  bilibili:    { name: 'B站',    char: 'B',  color: '#FB7299', bg: '#FFF0F5' },
  wechat:      { name: '公众号', char: '微', color: '#07C160', bg: '#F0FFF6' },
  zhihu:       { name: '知乎',   char: '知', color: '#0084FF', bg: '#F0F8FF' },
  twitter:     { name: 'X',      char: 'X',  color: '#1A1A1A', bg: '#F5F5F5' },
  weibo:       { name: '微博',   char: '博', color: '#E6162D', bg: '#FFF1F2' },
  producthunt: { name: 'PH',     char: 'P',  color: '#DA552F', bg: '#FFF4F0' },
}

// ─── Item card ────────────────────────────────────────────────────────────────

function ItemCard({ item, onRead }: { item: TodayItem; onRead: () => void }) {
  const navigate = useNavigate()
  return (
    <div className="mx-4 mb-2.5 bg-white rounded-card border border-[#EEEEEE] p-[14px]">
      <button
        className="w-full text-left"
        onClick={() => {
          onRead()
          navigate('/knowledge/file-detail', { state: { mockTitle: item.title, mockSource: item.source } })
        }}
      >
        {/* Author row */}
        <div className="flex items-center gap-2 mb-1.5">
          <div
            className="w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold flex-shrink-0"
            style={{
              backgroundColor: PLATFORM_CFG[item.source]?.bg ?? '#F5F5F5',
              color: PLATFORM_CFG[item.source]?.color ?? '#9CA3AF',
            }}
          >
            {PLATFORM_CFG[item.source]?.char ?? item.source[0]}
          </div>
          <span className="text-[12px] text-ink-secondary">{item.author}</span>
          <span className="text-[11px] text-ink-placeholder">· {item.time}</span>
          {!item.read && (
            <span className="ml-auto text-[10px] px-1.5 py-0.5 bg-[#FFF1E6] text-brand-orange rounded font-medium">新</span>
          )}
        </div>
        {/* Title */}
        <p className="text-[14px] font-medium text-ink-primary leading-5">
          ✨ {item.title}
        </p>
      </button>

      {/* Actions */}
      <div className="flex gap-3 mt-3 pt-2.5 border-t border-[#F5F5F5]">
        <button
          onClick={onRead}
          className="text-[12px] text-ink-placeholder"
        >
          标记已读
        </button>
        <button className="text-[12px] text-ink-placeholder">移除</button>
      </div>
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function W02_TodayItems() {
  const { todayItems, markItemRead, markAllRead, todayUnread } = useWatch()

  return (
    <PageLayout>
      <TopHeader
        title={`今日新进 · ${todayItems.length} 条`}
        showBack
        right={
          todayUnread > 0 ? (
            <button onClick={markAllRead} className="text-[13px] text-brand-orange font-medium">
              全部已读
            </button>
          ) : undefined
        }
      />
      <div className="px-0 py-4 space-y-0">
        {/* Info banner */}
        <div className="mx-4 mb-4 flex items-center gap-2 px-3.5 py-3 bg-[#FFF1E6] rounded-card">
          <Sparkles size={15} className="text-brand-orange flex-shrink-0" />
          <p className="text-[12px] text-ink-secondary">AI 已为你智能过滤，按相关度排序</p>
        </div>

        {todayItems.map(item => (
          <ItemCard key={item.id} item={item} onRead={() => markItemRead(item.id)} />
        ))}
      </div>
    </PageLayout>
  )
}
