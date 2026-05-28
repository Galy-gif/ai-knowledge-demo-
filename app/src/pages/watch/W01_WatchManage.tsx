import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Check, Eye, MoreHorizontal, Plus, X } from 'lucide-react'
import TopHeader from '../../components/layout/TopHeader'
import BottomSheet from '../../components/ui/BottomSheet'
import Toast from '../../components/common/Toast'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import { useWatch, type WatchPlatform, type WatchType, type WatchStrategy, type WatchFrequency } from '../../context/WatchContext'
import { useUser } from '../../context/UserContext'

// ─── Platform config ─────────────────────────────────────────────────────────

const PLATFORM_CONFIG: Record<WatchPlatform, { name: string; char: string; color: string; bg: string }> = {
  xiaohongshu: { name: '小红书', char: '书', color: '#FF2442', bg: '#FFF1F3' },
  bilibili:    { name: 'B站',    char: 'B',  color: '#FB7299', bg: '#FFF0F5' },
  wechat:      { name: '公众号', char: '微', color: '#07C160', bg: '#F0FFF6' },
  zhihu:       { name: '知乎',   char: '知', color: '#0084FF', bg: '#F0F8FF' },
  twitter:     { name: 'X',      char: 'X',  color: '#1A1A1A', bg: '#F5F5F5' },
  weibo:       { name: '微博',   char: '博', color: '#E6162D', bg: '#FFF1F2' },
  xueqiu:      { name: '雪球',   char: '雪', color: '#1873CF', bg: '#E6F0FA' },
}

const PLATFORMS = Object.keys(PLATFORM_CONFIG) as WatchPlatform[]

const TYPE_LABELS: Record<WatchType, string> = {
  author: '作者',
  topic: '话题',
  keyword: '关键词',
}

// ─── Platform logo ────────────────────────────────────────────────────────────

function PlatformIcon({ platform, size = 40 }: { platform: WatchPlatform; size?: number }) {
  const cfg = PLATFORM_CONFIG[platform]
  const fontSize = size * 0.4
  return (
    <div
      className="flex items-center justify-center rounded-[10px] flex-shrink-0 font-bold"
      style={{ width: size, height: size, backgroundColor: cfg.bg, color: cfg.color, fontSize }}
    >
      {cfg.char}
    </div>
  )
}

// ─── Toggle switch ────────────────────────────────────────────────────────────

function ToggleSwitch({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={e => { e.stopPropagation(); onToggle() }}
      className="relative flex-shrink-0 transition-colors duration-200"
      style={{
        width: 40, height: 24, borderRadius: 12,
        backgroundColor: on ? '#22C55E' : '#D1D5DB',
      }}
    >
      <div
        className="absolute top-[2px] w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200"
        style={{ transform: on ? 'translateX(18px)' : 'translateX(2px)' }}
      />
    </button>
  )
}

// ─── Task card ────────────────────────────────────────────────────────────────

interface TaskCardProps {
  task: { id: string; platform: WatchPlatform; type: WatchType; target: string[]; status: string; lastFetchedAt: string; todayFetched: number }
  onToggle: () => void
  onMore: () => void
  onOpen: () => void
}

function TaskCard({ task, onToggle, onMore, onOpen }: TaskCardProps) {
  const isRunning = task.status === 'running'
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpen() } }}
      className="mx-4 mb-[10px] bg-white rounded-card border border-[#EEEEEE] p-[14px] cursor-pointer active:bg-[#FAFAFA] transition-colors"
    >
      <div className="flex items-start gap-3">
        <PlatformIcon platform={task.platform} size={40} />
        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-semibold text-ink-primary leading-5">
            蹲守「{task.target[0]}」
          </p>
          <div className="flex items-center gap-1.5 mt-1 flex-wrap">
            <span className="text-[11px] px-1.5 py-0.5 bg-[#F5F5F5] rounded text-ink-placeholder">
              {TYPE_LABELS[task.type]}
            </span>
            <span className="text-[11px] text-ink-placeholder truncate">
              · {task.target.join(' ')}
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            <span
              className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isRunning ? 'bg-green-500 animate-pulse' : 'bg-[#D1D5DB]'}`}
            />
            <span className="text-[11px] text-ink-placeholder">
              {isRunning
                ? `运行中 · ${task.lastFetchedAt}蹲到 ${task.todayFetched} 条`
                : `已暂停 · ${task.lastFetchedAt}`}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0 mt-0.5">
          <ToggleSwitch on={isRunning} onToggle={onToggle} />
          <button
            onClick={e => { e.stopPropagation(); onMore() }}
            className="p-1 text-ink-placeholder"
          >
            <MoreHorizontal size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Step dots ────────────────────────────────────────────────────────────────

function StepDots({ step }: { step: number }) {
  return (
    <div className="flex gap-1.5 justify-center mb-5">
      {[1, 2, 3, 4].map(s => (
        <div
          key={s}
          className="h-1.5 rounded-pill transition-all duration-200"
          style={{
            width: step === s ? 24 : 6,
            backgroundColor: step === s ? '#FF7A00' : '#E5E5E5',
          }}
        />
      ))}
    </div>
  )
}

// ─── Mock author search results ───────────────────────────────────────────────

const MOCK_SEARCH_RESULTS: Record<string, { id: string; name: string; followers: string }[]> = {
  '老张': [
    { id: 'a1', name: '老张说投资', followers: '4.5万粉丝' },
    { id: 'a2', name: '老张爱跑步', followers: '2.3万粉丝' },
    { id: 'a3', name: '老张的产品笔记', followers: '8.7千粉丝' },
  ],
  'dialog': [
    { id: 'b1', name: 'dialog 设计周报', followers: '12.6万粉丝' },
    { id: 'b2', name: 'dialogbox 产品人', followers: '3.4千粉丝' },
  ],
  '设计': [
    { id: 'c1', name: '设计师 Coco', followers: '8.1万粉丝' },
    { id: 'c2', name: '设计公举小磊磊', followers: '56.3万粉丝' },
    { id: 'c3', name: '设计简史', followers: '2.2万粉丝' },
  ],
}

function getSearchResults(query: string) {
  if (query.length < 2) return []
  for (const [key, results] of Object.entries(MOCK_SEARCH_RESULTS)) {
    if (query.includes(key) || key.includes(query)) return results
  }
  return [{ id: 'x1', name: `${query} 相关账号`, followers: '暂无数据' }]
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function W01_WatchManage() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const kbName: string = state?.kbName ?? '当前资料包'
  const kbId: string = state?.kbId ?? 'kb1'

  const { getKbTasks, toggleTask, deleteTask, addTask } = useWatch()
  const { showToast, showConfirm } = useUser()

  const kbTasks = getKbTasks(kbId)
  const runningCount = kbTasks.filter(t => t.status === 'running').length
  const totalFetched = kbTasks.reduce((s, t) => s + t.totalFetched, 0)

  // Sheet states
  const [showNewSheet, setShowNewSheet] = useState(false)
  const [taskMenuId, setTaskMenuId] = useState<string | null>(null)

  // New watch form
  const [step, setStep] = useState(1)
  const [platforms, setPlatforms] = useState<WatchPlatform[]>([])
  const [watchType, setWatchType] = useState<WatchType>('author')
  const [selectedAuthors, setSelectedAuthors] = useState<string[]>([])
  const [authorSearch, setAuthorSearch] = useState('')
  const [topics, setTopics] = useState<string[]>([])
  const [topicInput, setTopicInput] = useState('')
  const [keywords, setKeywords] = useState<string[]>([])
  const [keywordInput, setKeywordInput] = useState('')
  const [strategy, setStrategy] = useState<WatchStrategy>('ai_filter')
  const [frequency, setFrequency] = useState<WatchFrequency>('daily')
  const [notification, setNotification] = useState<'in_app' | 'push'>('in_app')

  const resetForm = () => {
    setStep(1); setPlatforms([]); setWatchType('author')
    setSelectedAuthors([]); setAuthorSearch('')
    setTopics([]); setTopicInput('')
    setKeywords([]); setKeywordInput('')
    setStrategy('ai_filter'); setFrequency('daily')
    setNotification('in_app')
  }

  const togglePlatform = (p: WatchPlatform) => {
    setPlatforms(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p])
  }

  const currentTargets = watchType === 'author' ? selectedAuthors
    : watchType === 'topic' ? topics : keywords

  const canStart = platforms.length > 0 && currentTargets.length > 0
  const canNextStep = step === 1 ? platforms.length > 0 : step === 2 ? currentTargets.length > 0 : true

  const handleStart = () => {
    if (!canStart) return
    const baseId = Date.now()
    platforms.forEach((p, idx) => {
      addTask({
        id: `watch_${baseId}_${idx}`,
        kbId,
        platform: p,
        type: watchType,
        target: currentTargets,
        strategy,
        frequency,
        notification,
        status: 'running' as const,
        createdAt: '刚刚',
        lastFetchedAt: '—',
        totalFetched: 0,
        todayFetched: 0,
      })
    })
    setShowNewSheet(false)
    resetForm()
    showToast(
      platforms.length === 1
        ? '已开始蹲守'
        : `已在 ${platforms.length} 个平台开始蹲守`,
      'success',
    )
  }

  const handleAddTopic = () => {
    const val = topicInput.trim()
    if (!val || topics.length >= 5) return
    setTopics(prev => [...prev, val])
    setTopicInput('')
  }

  const handleAddKeyword = (val: string) => {
    const parts = val.split(/[,，]/).map(s => s.trim()).filter(Boolean)
    setKeywords(prev => {
      const merged = [...prev]
      for (const p of parts) {
        if (!merged.includes(p) && merged.length < 5) merged.push(p)
      }
      return merged
    })
  }

  const searchResults = getSearchResults(authorSearch)

  const taskMenuTarget = kbTasks.find(t => t.id === taskMenuId)

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col h-full relative bg-white">
      <TopHeader
        title="蹲一下"
        showBack
        right={
          <button
            onClick={() => { resetForm(); setShowNewSheet(true) }}
            className="text-[13px] font-medium text-brand-orange"
          >
            + 新建
          </button>
        }
      />
      {/* Subtitle */}
      <div className="flex-shrink-0 px-4 py-2 bg-white border-b border-line-base">
        <p className="text-[11px] text-ink-placeholder">{kbName}</p>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {kbTasks.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
            <Eye size={64} className="text-[#E5E5E5] mb-4" />
            <p className="text-[16px] font-semibold text-ink-primary mb-1">还没有蹲守任务</p>
            <p className="text-[13px] text-ink-secondary mb-6">让 AI 帮你蹲一些感兴趣的更新</p>
            <button
              onClick={() => { resetForm(); setShowNewSheet(true) }}
              className="px-6 py-3 bg-brand-orange text-white rounded-btn text-body font-medium"
            >
              + 新建第一个
            </button>
          </div>
        ) : (
          <>
            {/* Status card */}
            <div className="mx-4 mt-4 mb-4 rounded-card bg-[#FFF1E6] p-4">
              <div className="flex items-center gap-2">
                <Eye size={20} className="text-brand-orange flex-shrink-0" />
                <p className="text-[14px] font-semibold text-ink-primary">
                  {runningCount} 个任务运行中
                </p>
              </div>
              <p className="text-[12px] text-ink-secondary mt-1.5 ml-7">
                累计蹲到 {totalFetched} 条内容 · 已自动归入相关主题
              </p>
            </div>

            {/* Task list */}
            {kbTasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onToggle={() => toggleTask(task.id)}
                onMore={() => setTaskMenuId(task.id)}
                onOpen={() => navigate(`/watch/task/${task.id}`)}
              />
            ))}
          </>
        )}
      </div>

      {/* ── New watch sheet ─────────────────────────────────────────────────── */}
      <BottomSheet
        open={showNewSheet}
        onClose={() => { setShowNewSheet(false); resetForm() }}
        title="新建蹲守"
        titleAlign="center"
        titleClassName="text-[17px] font-semibold text-ink-primary"
        fullHeight
        headerLeft={
          <button
            onClick={() => { setShowNewSheet(false); resetForm() }}
            className="text-[14px] text-ink-secondary"
          >
            取消
          </button>
        }
        headerRight={
          <button
            onClick={handleStart}
            className={`text-[14px] font-medium ${canStart ? 'text-brand-orange' : 'text-ink-placeholder'}`}
            disabled={!canStart}
          >
            开始蹲守
          </button>
        }
      >
        <div className="px-5 pt-3 pb-6">
          <StepDots step={step} />

          {/* ── Step 1: Platform ── */}
          {step === 1 && (
            <div>
              <p className="text-[13px] font-semibold text-ink-primary mb-1">在哪里蹲？</p>
              <p className="text-[11px] text-ink-placeholder mb-4">可多选，每个平台会创建独立任务</p>
              <div className="grid grid-cols-3 gap-3">
                {PLATFORMS.map(p => {
                  const cfg = PLATFORM_CONFIG[p]
                  const selected = platforms.includes(p)
                  return (
                    <button
                      key={p}
                      onClick={() => togglePlatform(p)}
                      aria-pressed={selected}
                      className="relative flex flex-col items-center gap-1.5 py-3 rounded-card transition-all"
                      style={{
                        backgroundColor: selected ? '#FFF1E6' : '#FAFAFA',
                        border: selected ? '1.5px solid #FF7A00' : '1.5px solid #EEEEEE',
                      }}
                    >
                      {selected && (
                        <span
                          style={{
                            position: 'absolute',
                            top: 6,
                            right: 6,
                            width: 16,
                            height: 16,
                            borderRadius: '50%',
                            backgroundColor: '#FF7A00',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Check size={10} color="#FFFFFF" strokeWidth={3} />
                        </span>
                      )}
                      <div
                        className="w-12 h-12 rounded-[10px] flex items-center justify-center font-bold text-[20px]"
                        style={{ backgroundColor: cfg.bg, color: cfg.color }}
                      >
                        {cfg.char}
                      </div>
                      <span className="text-[11px] text-ink-secondary">{cfg.name}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* ── Step 2: Type + target ── */}
          {step === 2 && (
            <div>
              <p className="text-[13px] font-semibold text-ink-primary mb-3">蹲什么？</p>
              {/* Type tabs */}
              <div className="flex gap-1.5 mb-4 p-1 bg-[#F5F5F5] rounded-[10px]">
                {(['author', 'topic', 'keyword'] as WatchType[]).map(t => (
                  <button
                    key={t}
                    onClick={() => setWatchType(t)}
                    className={`flex-1 py-1.5 rounded-[8px] text-[13px] font-medium transition-colors ${
                      watchType === t ? 'bg-white text-ink-primary shadow-sm' : 'text-ink-secondary'
                    }`}
                  >
                    {TYPE_LABELS[t]}
                  </button>
                ))}
              </div>

              {watchType === 'author' && (
                <div>
                  <input
                    value={authorSearch}
                    onChange={e => setAuthorSearch(e.target.value)}
                    placeholder={
                      platforms.length > 1
                        ? `输入作者名或主页链接（应用到 ${platforms.length} 个平台）`
                        : '输入作者名或主页链接'
                    }
                    className="w-full px-3.5 py-3 bg-[#F8F8F8] rounded-card text-[14px] text-ink-primary outline-none placeholder:text-ink-placeholder"
                  />
                  {selectedAuthors.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2.5">
                      {selectedAuthors.map(a => (
                        <span key={a} className="flex items-center gap-1 px-2.5 py-1 bg-brand-orange-light rounded-pill text-[12px] text-brand-orange">
                          {a}
                          <button onClick={() => setSelectedAuthors(prev => prev.filter(x => x !== a))}>
                            <X size={10} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                  {searchResults.length > 0 && authorSearch.length >= 2 && (
                    <div className="mt-3 space-y-2">
                      {searchResults.map(r => (
                        <div key={r.id} className="flex items-center gap-3 px-3 py-2.5 bg-[#FAFAFA] rounded-card">
                          <div className="w-8 h-8 rounded-full bg-[#EEEEEE] flex items-center justify-center text-[13px] font-medium text-ink-secondary flex-shrink-0">
                            {r.name[0]}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[13px] text-ink-primary font-medium">{r.name}</p>
                            <p className="text-[11px] text-ink-placeholder">{r.followers}</p>
                          </div>
                          <button
                            onClick={() => {
                              if (!selectedAuthors.includes(r.name) && selectedAuthors.length < 3) {
                                setSelectedAuthors(prev => [...prev, r.name])
                              }
                            }}
                            disabled={selectedAuthors.includes(r.name)}
                            className={`px-3 py-1 rounded-pill text-[11px] font-medium ${
                              selectedAuthors.includes(r.name)
                                ? 'bg-[#F0F0F0] text-ink-placeholder'
                                : 'bg-brand-orange text-white'
                            }`}
                          >
                            {selectedAuthors.includes(r.name) ? '已选' : '选择'}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {watchType === 'topic' && (
                <div>
                  <div className="flex gap-2">
                    <input
                      value={topicInput}
                      onChange={e => setTopicInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleAddTopic()}
                      placeholder="输入话题，如 AI Agent"
                      className="flex-1 px-3.5 py-3 bg-[#F8F8F8] rounded-card text-[14px] text-ink-primary outline-none placeholder:text-ink-placeholder"
                    />
                    <button
                      onClick={handleAddTopic}
                      disabled={!topicInput.trim() || topics.length >= 5}
                      className="w-10 h-[46px] rounded-card bg-brand-orange text-white flex items-center justify-center disabled:opacity-40"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                  {topics.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2.5">
                      {topics.map(t => (
                        <span key={t} className="flex items-center gap-1 px-2.5 py-1 bg-brand-orange-light rounded-pill text-[12px] text-brand-orange">
                          {t}
                          <button onClick={() => setTopics(prev => prev.filter(x => x !== t))}>
                            <X size={10} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="text-[11px] text-ink-placeholder mt-2">最多 5 个话题</p>
                </div>
              )}

              {watchType === 'keyword' && (
                <div>
                  <textarea
                    value={keywordInput}
                    onChange={e => {
                      setKeywordInput(e.target.value)
                      handleAddKeyword(e.target.value)
                    }}
                    placeholder="输入关键词，多个用逗号分隔"
                    rows={3}
                    className="w-full px-3.5 py-3 bg-[#F8F8F8] rounded-card text-[14px] text-ink-primary outline-none resize-none placeholder:text-ink-placeholder"
                  />
                  {keywords.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2.5">
                      {keywords.map(k => (
                        <span key={k} className="flex items-center gap-1 px-2.5 py-1 bg-brand-orange-light rounded-pill text-[12px] text-brand-orange">
                          {k}
                          <button onClick={() => setKeywords(prev => prev.filter(x => x !== k))}>
                            <X size={10} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="text-[11px] text-ink-placeholder mt-2">最多 5 个关键词</p>
                </div>
              )}
            </div>
          )}

          {/* ── Step 3: Strategy ── */}
          {step === 3 && (
            <div>
              <p className="text-[13px] font-semibold text-ink-primary mb-4">蹲到的内容怎么办？</p>
              <div className="space-y-2.5">
                {([
                  { id: 'ai_filter', emoji: '🤖', title: '智能过滤（推荐）', desc: 'AI 判断高相关的进资料包，无关内容自动剔除' },
                  { id: 'all_in',    emoji: '📥', title: '全部进库',         desc: '所有蹲到的内容都进，自己整理' },
                ] as { id: WatchStrategy; emoji: string; title: string; desc: string }[]).map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => setStrategy(opt.id)}
                    className={`w-full flex items-start gap-3 p-3.5 rounded-card border text-left transition-colors ${
                      strategy === opt.id
                        ? 'border-brand-orange bg-[#FFF7F0]'
                        : 'border-[#EEEEEE] bg-white'
                    }`}
                  >
                    <span className="text-[22px] flex-shrink-0 mt-0.5">{opt.emoji}</span>
                    <div>
                      <p className="text-[14px] font-semibold text-ink-primary">{opt.title}</p>
                      <p className="text-[12px] text-ink-secondary mt-0.5 leading-[1.4]">{opt.desc}</p>
                    </div>
                    {strategy === opt.id && (
                      <div className="ml-auto w-4 h-4 rounded-full bg-brand-orange flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Step 4: Advanced ── */}
          {step === 4 && (
            <div>
              <p className="text-[13px] font-semibold text-ink-primary mb-4">高级设置</p>

              {/* Frequency */}
              <p className="text-[12px] text-ink-secondary mb-2">监控频率</p>
              <div className="flex gap-2 flex-wrap mb-4">
                {([
                  { id: 'realtime', label: '实时' },
                  { id: 'hourly',   label: '每小时' },
                  { id: 'daily',    label: '每天' },
                  { id: 'weekly',   label: '每周' },
                ] as { id: WatchFrequency; label: string }[]).map(f => (
                  <button
                    key={f.id}
                    onClick={() => setFrequency(f.id)}
                    className={`px-4 py-1.5 rounded-pill text-[13px] transition-colors ${
                      frequency === f.id
                        ? 'bg-brand-orange text-white'
                        : 'bg-[#F5F5F5] text-ink-secondary'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {/* Notification */}
              <p className="text-[12px] text-ink-secondary mb-2">通知方式</p>
              <div className="space-y-2">
                {([
                  { id: 'in_app', label: '仅 App 内提醒' },
                  { id: 'push',   label: '+ 推送通知' },
                ] as { id: 'in_app' | 'push'; label: string }[]).map(n => (
                  <button
                    key={n.id}
                    onClick={() => setNotification(n.id)}
                    className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-card border text-left transition-colors ${
                      notification === n.id
                        ? 'border-brand-orange bg-[#FFF7F0]'
                        : 'border-[#EEEEEE] bg-white'
                    }`}
                  >
                    <div
                      className="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                      style={{ borderColor: notification === n.id ? '#FF7A00' : '#D1D5DB' }}
                    >
                      {notification === n.id && <div className="w-2 h-2 rounded-full bg-brand-orange" />}
                    </div>
                    <span className="text-[14px] text-ink-primary">{n.label}</span>
                  </button>
                ))}
              </div>

              {/* Submit */}
              <div className="mt-6">
                <button
                  onClick={handleStart}
                  disabled={!canStart}
                  className={`w-full py-4 rounded-btn text-body font-medium transition-colors ${
                    canStart ? 'bg-brand-orange text-white' : 'bg-[#FFE4D0] text-white cursor-default'
                  }`}
                >
                  开始蹲守
                </button>
                <p className="text-[11px] text-ink-placeholder text-center mt-2">AI 会替你 24 小时关注</p>
              </div>
            </div>
          )}

          {/* ── Step nav (steps 1-3) ── */}
          {step < 4 && (
            <div className="flex gap-3 mt-6">
              {step > 1 && (
                <button
                  onClick={() => setStep(s => s - 1)}
                  className="flex-1 py-3 rounded-btn border border-[#EEEEEE] text-body text-ink-secondary"
                >
                  上一步
                </button>
              )}
              <button
                onClick={() => canNextStep && setStep(s => s + 1)}
                disabled={!canNextStep}
                className={`flex-1 py-3 rounded-btn text-body font-medium transition-colors ${
                  canNextStep ? 'bg-brand-orange text-white' : 'bg-[#FFE4D0] text-white cursor-default'
                }`}
              >
                {step === 3
                  ? '高级设置 →'
                  : step === 1 && platforms.length > 0
                    ? `下一步 →（${platforms.length}）`
                    : '下一步 →'}
              </button>
            </div>
          )}
          {step === 4 && step > 1 && (
            <button
              onClick={() => setStep(3)}
              className="w-full py-3 rounded-btn border border-[#EEEEEE] text-body text-ink-secondary mt-3"
            >
              ← 上一步
            </button>
          )}
        </div>
      </BottomSheet>

      {/* ── Task more menu ──────────────────────────────────────────────────── */}
      <BottomSheet
        open={!!taskMenuId}
        onClose={() => setTaskMenuId(null)}
        title={taskMenuTarget ? `蹲守「${taskMenuTarget.target[0]}」` : '操作'}
        titleAlign="center"
        titleClassName="text-[16px] font-semibold text-ink-primary"
      >
        <div className="px-5 pt-2 pb-4 space-y-2">
          <button
            className="w-full px-4 py-3 rounded-card border border-[#EEEEEE] bg-white text-left text-[14px] text-ink-primary"
            onClick={() => setTaskMenuId(null)}
          >
            查看详情
          </button>
          <button
            className="w-full px-4 py-3 rounded-card border border-[#EEEEEE] bg-white text-left text-[14px] text-ink-primary"
            onClick={() => setTaskMenuId(null)}
          >
            编辑
          </button>
          <button
            className="w-full px-4 py-3 rounded-card border border-[#EEEEEE] bg-white text-left text-[14px] text-[#EF4444]"
            onClick={() => {
              const id = taskMenuId
              setTaskMenuId(null)
              if (!id) return
              showConfirm({
                title: '删除蹲守任务',
                description: '删除后将停止蹲守，已蹲到的内容不受影响。',
                confirmText: '删除',
                danger: true,
                onConfirm: () => {
                  deleteTask(id)
                  showToast('已删除蹲守任务')
                },
              })
            }}
          >
            删除
          </button>
        </div>
      </BottomSheet>

      <Toast />
      <ConfirmDialog />
    </div>
  )
}
