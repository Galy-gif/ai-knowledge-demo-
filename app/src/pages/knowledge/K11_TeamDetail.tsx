import { useParams, useNavigate } from 'react-router-dom'
import { FileText, File, Link, Mic, Image, StickyNote } from 'lucide-react'
import TopHeader from '../../components/layout/TopHeader'
import Toast from '../../components/common/Toast'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import { useKnowledge } from '../../context/KnowledgeContext'
import { useUser } from '../../context/UserContext'
import { mockDiscoverKbContents } from '../../mock/data'

function formatCount(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n)
}

const FILE_TYPE_ICONS: Record<string, React.ReactNode> = {
  pdf: <File size={14} className="text-[#EF4444]" />,
  doc: <FileText size={14} className="text-[#3B82F6]" />,
  note: <StickyNote size={14} className="text-[#F59E0B]" />,
  url: <Link size={14} className="text-[#10B981]" />,
  audio: <Mic size={14} className="text-[#8B5CF6]" />,
  image: <Image size={14} className="text-[#EC4899]" />,
}

export default function K11_TeamDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { discoverKbs, subscribeDiscoverKb, unsubscribeDiscoverKb } = useKnowledge()
  const { showToast } = useUser()

  const kb = discoverKbs.find(k => k.id === id)

  if (!kb) {
    return (
      <div className="flex flex-col h-full relative bg-white">
        <TopHeader title="兴趣库详情" showBack />
        <div className="flex flex-col items-center justify-center flex-1 px-8 text-center py-20">
          <div className="text-5xl mb-4">📭</div>
          <h2 className="text-h2 text-ink-primary mb-2">兴趣库不存在</h2>
          <p className="text-body text-ink-secondary mb-8">
            该兴趣库可能已下架，或链接地址有误。
          </p>
          <button
            onClick={() => navigate('/knowledge/square')}
            className="px-6 py-3 bg-brand-orange text-white rounded-btn text-body font-medium"
          >
            返回兴趣圈子
          </button>
        </div>
        <Toast />
      </div>
    )
  }

  const contents = mockDiscoverKbContents[kb.id] ?? []

  const handleToggle = () => {
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
      <TopHeader title="兴趣库详情" showBack />

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {/* Hero */}
        <div className="px-5 pt-5 pb-4">
          <div className="flex items-start gap-4">
            <div
              className="w-[72px] h-[72px] rounded-card-xl flex items-center justify-center text-[36px] flex-shrink-0"
              style={{ backgroundColor: kb.coverColor }}
            >
              {kb.coverEmoji}
            </div>
            <div className="flex-1 min-w-0 pt-1">
              <h2 className="text-h2 text-ink-primary leading-tight">{kb.name}</h2>
              <p className="text-[12px] text-ink-secondary leading-[1.5] mt-1.5">{kb.description}</p>
              <p className="text-[11px] mt-1.5" style={{ color: '#9CA3AF' }}>
                by {kb.author.name} · {kb.author.type === 'team' ? '团队' : '个人创作者'}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-8 mt-4 pt-4 border-t border-line-base">
            <div>
              <p className="text-[18px] font-semibold text-ink-primary">{kb.contentCount}</p>
              <p className="text-[12px] text-ink-placeholder mt-0.5">内容</p>
            </div>
            <div>
              <p className="text-[18px] font-semibold text-ink-primary">{formatCount(kb.subscriberCount)}</p>
              <p className="text-[12px] text-ink-placeholder mt-0.5">订阅者</p>
            </div>
            <div>
              <p className="text-[18px] font-semibold text-ink-primary">每周</p>
              <p className="text-[12px] text-ink-placeholder mt-0.5">更新频率</p>
            </div>
          </div>
        </div>

        {/* Content list */}
        <div className="px-5 pb-28">
          <p className="text-[13px] font-semibold text-ink-primary mb-3">全部内容</p>
          <div className="space-y-0">
            {contents.map((item, i) => (
              <div
                key={item.id}
                className={`flex items-start gap-3 py-3 ${
                  i < contents.length - 1 ? 'border-b border-line-base' : ''
                }`}
              >
                <div className="w-7 h-7 rounded-[8px] bg-surface-card flex items-center justify-center flex-shrink-0 mt-0.5">
                  {FILE_TYPE_ICONS[item.type] ?? <FileText size={14} className="text-ink-placeholder" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] text-ink-primary leading-5 font-medium">{item.title}</p>
                  <p className="text-[11px] text-ink-placeholder mt-0.5 leading-4">{item.desc}</p>
                </div>
                <p className="text-[11px] text-ink-placeholder flex-shrink-0 mt-0.5">{item.time}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky subscribe button */}
      <div className="px-5 py-4 border-t border-line-base bg-white flex-shrink-0">
        <button
          onClick={handleToggle}
          className={`w-full py-3.5 rounded-btn text-body font-medium transition-colors ${
            kb.isSubscribed
              ? 'bg-surface-card text-ink-secondary border border-line-base'
              : 'bg-brand-orange text-white'
          }`}
        >
          {kb.isSubscribed ? '已订阅 · 取消订阅' : '+ 订阅此兴趣库'}
        </button>
      </div>

      <Toast />
      <ConfirmDialog />
    </div>
  )
}
