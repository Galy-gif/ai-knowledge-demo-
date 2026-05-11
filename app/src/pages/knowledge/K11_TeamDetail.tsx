import { useNavigate, useParams } from 'react-router-dom'
import { Share2, ChevronRight } from 'lucide-react'
import PageLayout from '../../components/layout/PageLayout'
import TopHeader from '../../components/layout/TopHeader'
import { useKnowledge } from '../../context/KnowledgeContext'
import { useUser } from '../../context/UserContext'

export default function K11_TeamDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { teams, subscribeTeam, unsubscribeTeam, subscribedBases, setActiveBase } = useKnowledge()
  const { showToast, showConfirm } = useUser()

  const team = teams.find(t => t.id === id)

  if (!team) {
    return (
      <PageLayout>
        <TopHeader title="团队详情" showBack />
        <div className="flex flex-col items-center justify-center flex-1 px-8 text-center py-20">
          <div className="w-16 h-16 bg-surface-card rounded-card-xl flex items-center justify-center mb-5">
            <Share2 size={26} className="text-ink-placeholder" />
          </div>
          <h2 className="text-h2 text-ink-primary mb-2">团队不存在</h2>
          <p className="text-body text-ink-secondary mb-8">
            这个知识团队可能已下架，或链接地址有误。
          </p>
          <button
            onClick={() => navigate('/knowledge/square')}
            className="px-6 py-3 bg-brand-orange text-white rounded-btn text-body font-medium"
          >
            返回知识广场
          </button>
        </div>
      </PageLayout>
    )
  }

  const handleSubscribeClick = () => {
    if (team.isSubscribed) {
      showConfirm({
        title: '取消订阅',
        description: `取消订阅「${team.name}」后，该团队的更新将不再同步到你的知识库。`,
        confirmText: '确认取消',
        danger: true,
        onConfirm: () => {
          unsubscribeTeam(team.id)
          showToast('已取消订阅')
        },
      })
    } else {
      subscribeTeam(team.id)
      showToast('订阅成功 🎉')
    }
  }

  const handleKbClick = () => {
    if (!team.isSubscribed) {
      showToast('订阅后即可查看知识库内容')
      return
    }
    const subscribedKB = subscribedBases.find(b => b.id === `kb_${team.id}` || b.name === team.name)
    if (subscribedKB) {
      setActiveBase(subscribedKB)
      navigate('/knowledge/detail')
    } else {
      showToast('暂无法访问此知识库')
    }
  }

  return (
    <PageLayout>
      <TopHeader
        title={team.name}
        showBack
        right={
          <button
            onClick={() => { navigator.clipboard.writeText(window.location.href).catch(() => {}); showToast('分享链接已复制') }}
            className="p-1"
          >
            <Share2 size={20} className="text-ink-secondary" />
          </button>
        }
      />
      <div className="px-5 py-4">
        {/* Team card */}
        <div className="flex items-center gap-4 mb-5">
          <div className="w-16 h-16 rounded-card-xl bg-brand-orange flex items-center justify-center text-white text-h2 flex-shrink-0">
            {team.avatar}
          </div>
          <div className="flex-1">
            <h2 className="text-h2 text-ink-primary">{team.name}</h2>
            <p className="text-caption text-ink-placeholder mt-0.5">{team.tagline}</p>
            <div className="flex gap-1 mt-1.5 flex-wrap">
              {team.tags.map(tag => (
                <span key={tag} className="text-micro px-2 py-0.5 bg-surface-card text-ink-secondary rounded-pill">{tag}</span>
              ))}
            </div>
          </div>
          <button
            onClick={handleSubscribeClick}
            className={`px-4 py-2 rounded-pill text-caption font-medium flex-shrink-0 transition-colors ${
              team.isSubscribed
                ? 'bg-surface-card text-ink-secondary border border-line-base'
                : 'bg-brand-orange text-white'
            }`}
          >
            {team.isSubscribed ? '已订阅' : '+ 订阅'}
          </button>
        </div>

        {/* Stats */}
        <div className="flex gap-8 mb-5">
          <div>
            <p className="text-h2 text-ink-primary">{(team.followCount / 1000).toFixed(1)}k</p>
            <p className="text-caption text-ink-placeholder">订阅</p>
          </div>
          <div>
            <p className="text-h2 text-ink-primary">{team.kbCount}</p>
            <p className="text-caption text-ink-placeholder">知识库</p>
          </div>
          <div>
            <p className="text-h2 text-ink-primary">{team.contentCount}</p>
            <p className="text-caption text-ink-placeholder">内容</p>
          </div>
        </div>

        {/* Description */}
        <div className="mb-5">
          <p className="text-caption text-ink-secondary font-medium mb-2">简介</p>
          <p className="text-body text-ink-secondary leading-relaxed">{team.description}</p>
        </div>

        {/* Knowledge Bases */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-card-title text-ink-primary">已发布知识库</p>
            <span className="text-caption text-ink-placeholder">最近更新 ∨</span>
          </div>
          <div className="space-y-3">
            {team.knowledgeBases.map(kb => (
              <button
                key={kb.id}
                onClick={handleKbClick}
                className="w-full flex items-center gap-3 p-4 bg-white rounded-card border border-line-base shadow-card text-left active:bg-surface-card transition-colors"
              >
                <div className="w-10 h-10 bg-surface-card rounded-card flex items-center justify-center text-xl flex-shrink-0">
                  {kb.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-card-title text-ink-primary">{kb.title}</p>
                  <p className="text-caption text-ink-placeholder mt-0.5 truncate">{kb.description}</p>
                  <p className="text-micro text-ink-placeholder mt-1">{kb.readCount} 阅读 · {kb.dayCount} · {kb.updatedAt}</p>
                </div>
                <ChevronRight size={16} className="text-ink-placeholder flex-shrink-0" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
