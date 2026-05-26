import { useNavigate, useLocation } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Clock, Home, Menu, Share, Square } from 'lucide-react'
import PageLayout from '../../components/layout/PageLayout'
import { mockWebResults } from '../../mock/data'
import { useUser } from '../../context/UserContext'

function getSearchDomain(query: string) {
  const rules = [
    { key: '兴趣库', slug: 'zhishiku' },
    { key: '历史决策', slug: 'lishijuece' },
    { key: '竞品', slug: 'jingpin' },
    { key: '增长', slug: 'zengzhang' },
    { key: '运营', slug: 'yunying' },
    { key: '对话', slug: 'duihua' },
    { key: '保持', slug: 'baochi' },
    { key: '策略', slug: 'celue' },
    { key: 'AI', slug: 'ai' },
  ]
  const slugs = rules
    .filter(rule => query.includes(rule.key))
    .map(rule => rule.slug)
    .slice(0, 2)

  return `${slugs.length > 0 ? slugs.join('-') : 'ai-search'}.search`
}

export default function Q06_WebSearchResults() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const { showToast } = useUser()
  const query = state?.query || '搜索问答产品的对话保持策略'
  const selectedKbIds: string[] = state?.selectedKbIds ?? []
  const selectedKbNames: string[] = state?.selectedKbNames ?? []
  const searchDomain = getSearchDomain(query)

  return (
    <PageLayout>
      <div className="h-14 flex items-center px-4 bg-white flex-shrink-0">
        <button onClick={() => navigate(-1)} className="p-1 -ml-1 mr-2 text-ink-secondary">
          <ChevronLeft size={24} />
        </button>
        <span className="flex-1 text-h2 text-ink-primary truncate">网页搜索</span>
      </div>

      <div className="px-5 pt-1 pb-20">
        {/* Browser address bar */}
        <div className="mb-3">
          <div className="h-8 rounded-pill bg-surface-card flex items-center px-3">
            <div className="w-6" />
            <p className="flex-1 text-center text-caption font-medium text-ink-primary">{searchDomain}</p>
            <button
              type="button"
              aria-label="分享"
              onClick={() => showToast('分享功能即将上线')}
              className="w-6 h-6 flex items-center justify-center text-ink-placeholder"
            >
              <Share size={15} />
            </button>
          </div>
        </div>

        {/* Query badge */}
        <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-surface-card rounded-card">
          <span className="text-caption text-ink-placeholder">🌐</span>
          <p className="text-body text-ink-primary flex-1 truncate">{query}</p>
        </div>
        {selectedKbNames.length > 0 && (
          <div className="flex items-center gap-1.5 mb-4 -mt-2 overflow-x-auto scrollbar-hide">
            <span className="text-micro text-ink-placeholder flex-shrink-0">结合兴趣库</span>
            {selectedKbNames.map(name => (
              <span key={name} className="text-micro px-2 py-0.5 bg-brand-orange-light text-brand-orange rounded-pill whitespace-nowrap flex-shrink-0">
                {name}
              </span>
            ))}
          </div>
        )}

        {/* AI summary */}
        <div className="bg-brand-orange-light rounded-card p-4 mb-4">
          <p className="text-caption text-brand-orange font-medium mb-1">AI 综合摘要</p>
          <p className="text-body text-ink-primary">对话保持策略的核心在于 Session 管理与上下文压缩。主流方案包括滑动窗口、摘要压缩和显式上下文注入三种模式。</p>
        </div>

        {/* Results */}
        <div className="bg-white">
          {mockWebResults.map(result => (
            <button
              key={result.id}
              onClick={() => navigate('/ask/web-article', { state: { article: result, selectedKbIds, selectedKbNames } })}
              className="w-full text-left py-4 border-b border-line-base last:border-b-0 active:bg-surface-card transition-colors"
            >
              <p className="text-card-title text-ink-primary mb-1.5 leading-snug">{result.title}</p>
              <p className="text-caption text-blue-500 mb-1">{result.site}</p>
              <p className="text-caption text-ink-secondary leading-relaxed mb-2 line-clamp-2">{result.snippet}</p>
              <div className="flex items-center gap-2 text-micro text-ink-placeholder">
                <span>{result.publishedAt}</span>
                <span>·</span>
                <Clock size={11} />
                <span>{result.readTime}阅读</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-14 bg-white/95 border-t border-line-base flex items-center justify-around px-5">
        {[
          { Icon: ChevronLeft, label: '后退' },
          { Icon: ChevronRight, label: '前进' },
          { Icon: Square, label: '标签页' },
          { Icon: Menu, label: '菜单' },
          { Icon: Home, label: '首页' },
        ].map(({ Icon, label }) => (
          <button
            key={label}
            type="button"
            aria-label={label}
            className="w-10 h-10 rounded-full flex items-center justify-center text-ink-secondary active:bg-surface-card"
          >
            <Icon size={21} />
          </button>
        ))}
      </div>
    </PageLayout>
  )
}
