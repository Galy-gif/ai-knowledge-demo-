import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Eye, MoreHorizontal, Sparkles } from 'lucide-react'
import PageLayout from '../../components/layout/PageLayout'
import TopHeader from '../../components/layout/TopHeader'
import { useUser } from '../../context/UserContext'
import {
  useWatch,
  type WatchPlatform,
  type WatchTask,
  type WatchType,
} from '../../context/WatchContext'
import { getTaskItems, type WatchItem } from '../../mock/watchItems'

const PLATFORM_CONFIG: Record<WatchPlatform, { name: string; char: string; color: string; bg: string }> = {
  xiaohongshu: { name: '小红书', char: '书', color: '#FF2442', bg: '#FFF1F3' },
  bilibili:    { name: 'B站',    char: 'B',  color: '#FB7299', bg: '#FFF0F5' },
  wechat:      { name: '公众号', char: '微', color: '#07C160', bg: '#F0FFF6' },
  zhihu:       { name: '知乎',   char: '知', color: '#0084FF', bg: '#F0F8FF' },
  twitter:     { name: 'X',      char: 'X',  color: '#1A1A1A', bg: '#F5F5F5' },
  weibo:       { name: '微博',   char: '博', color: '#E6162D', bg: '#FFF1F2' },
  xueqiu:      { name: '雪球',   char: '雪', color: '#1873CF', bg: '#E6F0FA' },
}

const TYPE_LABELS: Record<WatchType, string> = {
  author: '作者',
  topic: '话题',
  keyword: '关键词',
}

function PlatformIcon({ platform, size = 36 }: { platform: WatchPlatform; size?: number }) {
  const cfg = PLATFORM_CONFIG[platform]
  return (
    <div
      className="flex items-center justify-center rounded-[10px] flex-shrink-0 font-bold"
      style={{ width: size, height: size, backgroundColor: cfg.bg, color: cfg.color, fontSize: size * 0.4 }}
    >
      {cfg.char}
    </div>
  )
}

function TaskInfoCard({ task }: { task: WatchTask }) {
  const isRunning = task.status === 'running'
  const platformName = PLATFORM_CONFIG[task.platform].name
  return (
    <div
      className="mx-4 rounded-card"
      style={{ backgroundColor: '#FFF1E6', padding: '14px' }}
    >
      <div className="flex items-start gap-3">
        <PlatformIcon platform={task.platform} size={40} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[15px] font-semibold text-ink-primary leading-5">
              蹲守「{task.target[0]}」
            </span>
            <span
              className="inline-flex items-center gap-1 px-1.5 py-[1px] rounded-pill"
              style={{
                backgroundColor: isRunning ? '#FFFFFF' : '#F5F5F5',
                border: isRunning ? '0.5px solid #FFD9B3' : '0.5px solid #E5E5E5',
              }}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${isRunning ? 'bg-green-500 animate-pulse' : 'bg-[#9CA3AF]'}`}
              />
              <span
                className="text-[10px] font-medium"
                style={{ color: isRunning ? '#FF7A00' : '#9CA3AF' }}
              >
                {isRunning ? '运行中' : '已暂停'}
              </span>
            </span>
          </div>
          <p className="text-[12px] text-ink-secondary mt-1">
            {platformName} · {TYPE_LABELS[task.type]} · {task.target.join('、')}
          </p>
          <p className="text-[11px] text-ink-placeholder mt-2">
            累计蹲到 <span className="text-ink-primary font-medium">{task.totalFetched}</span> 条 ·
            今天 <span className="text-[#FF7A00] font-medium">{task.todayFetched}</span> 条 ·
            最近同步 {task.lastFetchedAt}
          </p>
        </div>
      </div>
    </div>
  )
}

function NewBadge() {
  return (
    <span
      className="inline-flex items-center text-[10px] font-medium text-white px-1.5 py-[1px] rounded"
      style={{ backgroundColor: '#FF7A00', flexShrink: 0 }}
    >
      新
    </span>
  )
}

function RelevanceTopic({ relevance, topic }: { relevance?: number; topic?: string }) {
  if (!topic && relevance == null) return null
  return (
    <div className="flex items-center gap-1.5 mt-2 flex-wrap">
      {topic && (
        <span
          className="inline-flex items-center gap-1 px-1.5 py-[2px] rounded"
          style={{ backgroundColor: '#FFF1E6' }}
        >
          <Sparkles size={9} className="text-[#FF7A00]" />
          <span className="text-[10px] text-[#FF7A00]">AI 归入「{topic}」</span>
        </span>
      )}
      {relevance != null && (
        <span className="text-[10px] text-ink-placeholder">相关度 {relevance}%</span>
      )}
    </div>
  )
}

function ContentCard({ item }: { item: WatchItem }) {
  const isNew = item.kind === 'new'
  return (
    <div className="mx-4 bg-white rounded-card border border-[#EEEEEE] p-3.5">
      <div className="flex items-start gap-2">
        {isNew && <NewBadge />}
        <p className="flex-1 text-[14px] leading-5 font-medium text-ink-primary">{item.title}</p>
      </div>
      {item.summary && (
        <p className="text-[12px] leading-5 text-ink-secondary mt-1.5">{item.summary}</p>
      )}
      <p className="text-[11px] text-ink-placeholder mt-2">{item.meta}</p>
      <RelevanceTopic relevance={item.relevance} topic={item.aiTopic} />
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center text-center px-10 py-16">
      <Eye size={32} className="text-[#D1D5DB] mb-3" />
      <p className="text-[13px] text-ink-secondary">还没有蹲到内容</p>
      <p className="text-[11px] text-ink-placeholder mt-1">运行中后会自动归入这里</p>
    </div>
  )
}

export default function W03_WatchTaskDetail() {
  const { taskId } = useParams<{ taskId: string }>()
  const navigate = useNavigate()
  const { tasks } = useWatch()
  const { showToast } = useUser()

  const task = useMemo(() => tasks.find(t => t.id === taskId), [tasks, taskId])
  const items = useMemo(() => (taskId ? getTaskItems(taskId) : []), [taskId])

  if (!task) {
    return (
      <PageLayout>
        <TopHeader title="蹲守任务" showBack />
        <div className="flex flex-col items-center justify-center flex-1 px-8 text-center py-20">
          <div className="text-5xl mb-4">🕳️</div>
          <p className="text-body text-ink-secondary">蹲守任务不存在</p>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mt-4 text-[12px] text-[#FF7A00]"
          >
            返回
          </button>
        </div>
      </PageLayout>
    )
  }

  const newItems = items.filter(i => i.kind === 'new')
  const historyItems = items.filter(i => i.kind === 'history')

  return (
    <PageLayout>
      <TopHeader
        title={`蹲守「${task.target[0]}」`}
        showBack
        right={
          <button
            type="button"
            onClick={() => showToast('更多操作（mock）')}
            className="p-1 text-ink-secondary"
            aria-label="更多"
          >
            <MoreHorizontal size={20} />
          </button>
        }
      />

      <div className="pt-3 pb-6 space-y-3">
        <TaskInfoCard task={task} />

        {items.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {newItems.length > 0 && (
              <section className="space-y-2">
                <p className="px-4 text-[11px] text-ink-placeholder">
                  今日新蹲到 · {newItems.length} 条
                </p>
                {newItems.map(item => (
                  <ContentCard key={item.id} item={item} />
                ))}
              </section>
            )}

            {historyItems.length > 0 && (
              <section className="space-y-2">
                <p className="px-4 text-[11px] text-ink-placeholder">
                  历史蹲到 · {historyItems.length} 条
                </p>
                {historyItems.map(item => (
                  <ContentCard key={item.id} item={item} />
                ))}
              </section>
            )}
          </>
        )}
      </div>
    </PageLayout>
  )
}
