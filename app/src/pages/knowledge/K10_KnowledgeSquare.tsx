import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import PageLayout from '../../components/layout/PageLayout'
import TopHeader from '../../components/layout/TopHeader'
import { useKnowledge } from '../../context/KnowledgeContext'

const CATEGORIES = ['全部', '产品方法论', '设计系统', '增长策略', '团队管理'] as const

export default function K10_KnowledgeSquare() {
  const navigate = useNavigate()
  const { teams } = useKnowledge()
  const [activeCategory, setActiveCategory] = useState<(typeof CATEGORIES)[number]>('全部')

  const filteredTeams = activeCategory === '全部'
    ? teams
    : teams.filter(team => team.category === activeCategory)

  return (
    <PageLayout>
      <TopHeader title="知识广场" showBack />
      <div className="px-5 py-4 space-y-4">
        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-pill text-caption whitespace-nowrap flex-shrink-0 transition-colors ${
                activeCategory === cat ? 'bg-brand-orange text-white' : 'bg-surface-card text-ink-secondary'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Teams */}
        {filteredTeams.length === 0 && (
          <div className="flex flex-col items-center py-14 text-center">
            <p className="text-body text-ink-secondary">这个分类下暂无团队</p>
            <p className="text-caption text-ink-placeholder mt-1">换个分类看看更多知识库</p>
          </div>
        )}

        {filteredTeams.map(team => (
          <button
            key={team.id}
            onClick={() => navigate(`/knowledge/team/${team.id}`)}
            className="w-full bg-white rounded-card border border-line-base shadow-card p-4 text-left"
          >
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-card bg-brand-orange flex items-center justify-center text-white font-semibold flex-shrink-0">
                {team.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-card-title text-ink-primary">{team.name}</p>
                  {team.isSubscribed && (
                    <span className="text-micro px-2 py-0.5 bg-brand-orange-light text-brand-orange rounded-pill">已订阅</span>
                  )}
                </div>
                <p className="text-caption text-ink-placeholder mt-0.5">{team.tagline}</p>
                <div className="flex gap-1 mt-2 overflow-x-auto scrollbar-hide">
                  <span className="text-micro px-2 py-0.5 bg-brand-orange-light text-brand-orange rounded-pill whitespace-nowrap flex-shrink-0">{team.category}</span>
                  {team.tags.map(tag => (
                    <span key={tag} className="text-micro px-2 py-0.5 bg-surface-card text-ink-secondary rounded-pill whitespace-nowrap flex-shrink-0">{tag}</span>
                  ))}
                </div>
              </div>
              <ChevronRight size={16} className="text-ink-placeholder flex-shrink-0 mt-1" />
            </div>
            <div className="flex gap-6 mt-3 pt-3 border-t border-line-base">
              <div className="text-center">
                <p className="text-card-title text-ink-primary">{(team.followCount / 1000).toFixed(1)}k</p>
                <p className="text-micro text-ink-placeholder">订阅者</p>
              </div>
              <div className="text-center">
                <p className="text-card-title text-ink-primary">{team.kbCount}</p>
                <p className="text-micro text-ink-placeholder">知识库</p>
              </div>
              <div className="text-center">
                <p className="text-card-title text-ink-primary">{team.contentCount}</p>
                <p className="text-micro text-ink-placeholder">内容</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </PageLayout>
  )
}
