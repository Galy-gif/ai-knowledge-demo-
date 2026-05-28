import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Sparkles } from 'lucide-react'
import {
  mockCategoryRecommends,
  mockCollectionCategories,
  type CollectionCategoryId,
} from '../../mock/data'

export default function K12_CategoryRecommend() {
  const { categoryId } = useParams()
  const navigate = useNavigate()
  const cat = mockCollectionCategories.find(c => c.id === categoryId)
  const recs = mockCategoryRecommends.filter(r => r.categoryId === (categoryId as CollectionCategoryId))

  return (
    <div className="flex flex-col h-full bg-surface-card">
      <header className="flex-shrink-0 flex items-center gap-2 px-3 h-12 bg-white border-b border-line-base">
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="返回"
          className="flex h-8 w-8 items-center justify-center text-ink-secondary active:text-ink-primary"
        >
          <ArrowLeft size={22} strokeWidth={1.8} />
        </button>
        <h2 className="text-card-title text-ink-primary flex-1 min-w-0 truncate">
          {cat?.label ?? ''} · AI 推荐
        </h2>
      </header>
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <div className="px-4 pt-3 pb-6">
          <div className="flex items-center gap-1.5 mb-3">
            <Sparkles size={14} className="text-brand-orange" />
            <p className="text-caption text-ink-secondary">
              基于你在「{cat?.label}」类的收藏，为你推荐这些资料包
            </p>
          </div>
          <div className="space-y-2.5">
            {recs.map(rec => (
              <button
                key={rec.id}
                type="button"
                onClick={() => navigate('/knowledge/square')}
                className="w-full flex items-center gap-3 rounded-card bg-white border border-line-base shadow-card p-3 text-left active:bg-surface-card"
              >
                <span
                  className="w-12 h-12 rounded-card flex items-center justify-center text-[22px] flex-shrink-0"
                  style={{ backgroundColor: rec.coverColor }}
                >
                  {rec.coverEmoji}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-card-title text-ink-primary truncate">{rec.name}</p>
                  <p className="text-micro text-brand-orange mt-0.5 line-clamp-2">💡 {rec.reason}</p>
                </div>
                <span className="flex-shrink-0 h-7 px-3 rounded-pill bg-brand-orange text-white text-[11px] font-medium flex items-center">
                  订阅
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
