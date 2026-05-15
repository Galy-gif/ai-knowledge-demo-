import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import PageLayout from '../../components/layout/PageLayout'
import TopHeader from '../../components/layout/TopHeader'
import { MoreHorizontal, RefreshCw } from 'lucide-react'
import { useApps } from '../../context/AppsContext'

// ── Shared ────────────────────────────────────────────────────────────────────

function SyncBar({ dataSource }: { dataSource: string }) {
  return (
    <div className="flex items-center justify-between px-3 h-9 rounded-card" style={{ backgroundColor: '#FFF1E6' }}>
      <div className="flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-pulse" />
        <p className="text-caption text-brand-orange">基于「{dataSource}」· 实时同步</p>
      </div>
      <p className="text-micro text-brand-orange opacity-60">上次同步：刚刚</p>
    </div>
  )
}

function AiTip({ text }: { text: string }) {
  return (
    <div className="flex gap-2.5 p-3.5 rounded-card" style={{ backgroundColor: '#FFF8F0', border: '1px solid #FFD9B3' }}>
      <span className="text-base leading-none mt-0.5">✨</span>
      <p className="text-caption text-ink-secondary leading-relaxed">{text}</p>
    </div>
  )
}

// ── Form 1: Learning List ─────────────────────────────────────────────────────

const WORDS = [
  { word: 'serendipity', phonetic: '/ˌserənˈdɪpɪti/', meaning: '意外发现美好之物的能力', status: 'new' },
  { word: 'ephemeral', phonetic: '/ɪˈfemərəl/', meaning: '短暂的，转瞬即逝的', status: 'learning' },
  { word: 'serendipitous', phonetic: '/ˌserənˈdɪpɪtəs/', meaning: '偶然发现的，幸运的', status: 'learning' },
  { word: 'ubiquitous', phonetic: '/juːˈbɪkwɪtəs/', meaning: '无处不在的，普遍存在的', status: 'mastered' },
  { word: 'pragmatic', phonetic: '/præɡˈmætɪk/', meaning: '务实的，注重实际的', status: 'mastered' },
]

const STATUS_DOT: Record<string, string> = {
  new: '#60A5FA',
  learning: '#FBBF24',
  mastered: '#34D399',
}
const STATUS_LABEL: Record<string, string> = {
  new: '新词',
  learning: '学习中',
  mastered: '已掌握',
}

function LearningListForm() {
  const total = 20
  const done = 12
  const pct = Math.round((done / total) * 100)

  return (
    <div className="space-y-3">
      <div className="rounded-card p-4 text-white" style={{ background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)' }}>
        <p className="text-micro opacity-75 mb-1">今日学习进度</p>
        <div className="flex items-end justify-between mb-3">
          <p className="text-[28px] font-bold leading-none">{done}<span className="text-base font-normal opacity-75"> / {total} 词</span></p>
          <p className="text-[22px] font-bold">{pct}%</p>
        </div>
        <div className="w-full h-2 bg-white/30 rounded-full overflow-hidden">
          <div className="h-full bg-white rounded-full" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {[['📖', '继续学习'], ['🔁', '复习错词'], ['📊', '学习报告']].map(([icon, label]) => (
          <button key={label} className="flex flex-col items-center gap-1 py-3 bg-white rounded-card border border-line-base shadow-card">
            <span className="text-xl">{icon}</span>
            <p className="text-micro text-ink-secondary">{label}</p>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-card border border-line-base shadow-card overflow-hidden">
        <div className="px-4 py-2.5 bg-surface-card border-b border-line-base">
          <p className="text-micro text-ink-placeholder font-medium">单词列表</p>
        </div>
        {WORDS.map((w, i) => (
          <div key={w.word} className={`flex items-center gap-3 px-4 py-3 ${i !== WORDS.length - 1 ? 'border-b border-line-base' : ''}`}>
            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: STATUS_DOT[w.status] }} />
            <div className="flex-1 min-w-0">
              <p className="text-caption text-ink-primary font-medium">{w.word}</p>
              <p className="text-micro text-ink-placeholder">{w.phonetic} · {w.meaning}</p>
            </div>
            <span className="text-micro px-2 py-0.5 rounded-pill" style={{ backgroundColor: STATUS_DOT[w.status] + '22', color: STATUS_DOT[w.status] }}>
              {STATUS_LABEL[w.status]}
            </span>
          </div>
        ))}
      </div>

      <AiTip text="根据记忆曲线，ephemeral 和 serendipitous 应在明天复习，建议睡前花 5 分钟强化。" />
    </div>
  )
}

// ── Form 2: Data Dashboard ────────────────────────────────────────────────────

const HOLDINGS = [
  { name: '易方达消费精选', code: '110022', shares: '1200 份', value: '¥34,500', change: '+2.3%', positive: true },
  { name: '中欧医疗健康', code: '003095', shares: '800 份', value: '¥18,720', change: '-0.8%', positive: false },
  { name: '招商中证白酒', code: '161725', shares: '2000 份', value: '¥42,800', change: '+1.5%', positive: true },
  { name: '兴全合宜', code: '163417', shares: '1500 份', value: '¥52,150', change: '+0.9%', positive: true },
]

function DataDashboardForm() {
  return (
    <div className="space-y-3">
      <div className="rounded-card p-4" style={{ background: 'linear-gradient(135deg, #D1FAE5 0%, #ECFDF5 100%)', border: '1px solid #A7F3D0' }}>
        <p className="text-micro text-[#065F46] opacity-70 mb-1">总资产估值</p>
        <p className="text-[28px] font-bold text-[#064E3B] leading-none mb-1">
          ¥ 184,236<span className="text-[18px] font-semibold">.50</span>
        </p>
        <p className="text-caption font-semibold" style={{ color: '#059669' }}>+¥ 3,421.20 (+1.89%) 今日</p>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {[
          ['7', '持仓数', '基金 · 股票'],
          ['+12.4%', '总收益', '近 30 天'],
          ['中等', '风险等级', '动态评估'],
        ].map(([val, label, sub]) => (
          <div key={label} className="bg-white rounded-card border border-line-base p-3 text-center shadow-card">
            <p className="text-[15px] font-semibold text-ink-primary">{val}</p>
            <p className="text-micro text-ink-placeholder mt-0.5">{label}</p>
            <p className="text-[10px] text-ink-placeholder opacity-70">{sub}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-card border border-line-base shadow-card overflow-hidden">
        <div className="px-4 py-2.5 bg-surface-card border-b border-line-base">
          <p className="text-micro text-ink-placeholder font-medium">持仓明细</p>
        </div>
        {HOLDINGS.map((h, i) => (
          <div key={h.code} className={`px-4 py-3 ${i !== HOLDINGS.length - 1 ? 'border-b border-line-base' : ''}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-caption text-ink-primary font-medium">{h.name}</p>
                <p className="text-micro text-ink-placeholder">{h.code} · {h.shares}</p>
              </div>
              <div className="text-right">
                <p className="text-caption text-ink-primary font-medium">{h.value}</p>
                <p className="text-micro font-medium" style={{ color: h.positive ? '#059669' : '#EF4444' }}>{h.change}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <AiTip text="白酒板块连续 3 日上涨，消费基金贡献本周主要收益。建议关注本周五行业政策。" />
    </div>
  )
}

// ── Form 3: Daily Tracker ─────────────────────────────────────────────────────

function CircleRing({ pct, color, label, value }: { pct: number; color: string; label: string; value: string }) {
  const r = 28
  const circ = 2 * Math.PI * r
  const offset = circ * (1 - pct / 100)
  return (
    <div className="flex flex-col items-center gap-1.5">
      <svg width="72" height="72" viewBox="0 0 72 72">
        <circle cx="36" cy="36" r={r} fill="none" stroke="#F3F4F6" strokeWidth="6" />
        <circle
          cx="36" cy="36" r={r} fill="none"
          stroke={color} strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          transform="rotate(-90 36 36)"
        />
        <text x="36" y="36" textAnchor="middle" dominantBaseline="middle" fontSize="11" fontWeight="600" fill="#1A1A1A">{pct}%</text>
      </svg>
      <p className="text-micro text-ink-placeholder">{label}</p>
      <p className="text-caption text-ink-primary font-medium">{value}</p>
    </div>
  )
}

const MEALS = [
  { time: '7:30 早餐', items: '全麦三明治 + 鸡蛋', kcal: '约 380 kcal', count: '3 项食物' },
  { time: '12:15 午餐', items: '鸡胸沙拉', kcal: '约 520 kcal', count: '5 项食物' },
  { time: '16:00 加餐', items: '蓝莓酸奶', kcal: '约 180 kcal', count: '2 项食物' },
]

function DailyTrackerForm() {
  const current = 1247
  const target = 1500
  const pct = Math.round((current / target) * 100)

  return (
    <div className="space-y-3">
      <div className="rounded-card p-4" style={{ background: 'linear-gradient(135deg, #EDE9FE 0%, #F5F3FF 100%)', border: '1px solid #DDD6FE' }}>
        <div className="flex items-center justify-between mb-2">
          <p className="text-caption font-medium text-[#5B21B6]">12 月 5 日 · 周四</p>
          <button className="text-micro font-medium px-2.5 py-1 rounded-pill" style={{ backgroundColor: '#8B5CF6', color: '#fff' }}>
            + 记录一餐
          </button>
        </div>
        <p className="text-[26px] font-bold text-[#4C1D95] leading-none mb-2">
          {current.toLocaleString()} <span className="text-base font-normal text-[#7C3AED] opacity-75">/ {target} 目标 kcal</span>
        </p>
        <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#C4B5FD' }}>
          <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: '#7C3AED' }} />
        </div>
      </div>

      <div className="bg-white rounded-card border border-line-base shadow-card p-4">
        <p className="text-micro text-ink-placeholder font-medium mb-4">营养素完成度</p>
        <div className="flex justify-around">
          <CircleRing pct={62} color="#8B5CF6" label="碳水" value="142g" />
          <CircleRing pct={89} color="#3B82F6" label="蛋白质" value="78g" />
          <CircleRing pct={45} color="#F59E0B" label="脂肪" value="38g" />
        </div>
      </div>

      <div className="bg-white rounded-card border border-line-base shadow-card overflow-hidden">
        <div className="px-4 py-2.5 bg-surface-card border-b border-line-base">
          <p className="text-micro text-ink-placeholder font-medium">今日餐食</p>
        </div>
        {MEALS.map((m, i) => (
          <div key={m.time} className={`flex items-start gap-3 px-4 py-3 ${i !== MEALS.length - 1 ? 'border-b border-line-base' : ''}`}>
            <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: '#8B5CF6' }} />
            <div className="flex-1">
              <p className="text-micro text-ink-placeholder mb-0.5">{m.time} · {m.count}</p>
              <p className="text-caption text-ink-primary">{m.items}</p>
            </div>
            <p className="text-caption font-medium flex-shrink-0" style={{ color: '#7C3AED' }}>{m.kcal}</p>
          </div>
        ))}
      </div>

      <AiTip text="今天还可摄入 253 kcal，建议晚餐选择低脂蛋白质（如鱼/虾），避免再次超标。" />
    </div>
  )
}

// ── Form 4: Fitness Tracker ───────────────────────────────────────────────────

const TRAININGS = [
  { time: '8:00 晨间拉伸', items: '颈肩拉伸 + 腰部活动', duration: '7 分钟', count: '3 项动作' },
  { time: '18:30 上肢力量', items: '哑铃推举 + 划船 + 三头肌', duration: '25 分钟', count: '6 项动作' },
  { time: '19:00 核心训练', items: '平板支撑 + 卷腹 + 俄转', duration: '13 分钟', count: '4 项动作' },
]

function FitnessTrackerForm() {
  const current = 45
  const target = 60
  const pct = Math.round((current / target) * 100)

  return (
    <div className="space-y-3">
      <div className="rounded-card p-4" style={{ background: 'linear-gradient(135deg, #FFF1E6 0%, #FFFFFF 100%)', border: '1px solid #FFD9B3' }}>
        <div className="flex items-center justify-between mb-2">
          <p className="text-caption font-medium text-[#7C2D12]">12 月 5 日 · 周四</p>
          <button className="text-micro font-medium px-2.5 py-1 rounded-pill" style={{ backgroundColor: '#FF7A00', color: '#fff' }}>
            + 记录训练
          </button>
        </div>
        <p className="text-[26px] font-bold text-[#7C2D12] leading-none mb-2">
          训练时长 {current} <span className="text-base font-normal opacity-75">/ {target} 分钟</span>
        </p>
        <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#FED7AA' }}>
          <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: '#FF7A00' }} />
        </div>
        <p className="text-micro opacity-60 mt-2" style={{ color: '#7C2D12' }}>已完成 {pct}% · 还差 {target - current} 分钟达成今日目标</p>
      </div>

      <div className="bg-white rounded-card border border-line-base shadow-card p-4">
        <p className="text-micro text-ink-placeholder font-medium mb-4">训练指标完成度</p>
        <div className="flex justify-around">
          <CircleRing pct={90} color="#FF7A00" label="力量训练" value="18 组" />
          <CircleRing pct={73} color="#EF4444" label="有氧时长" value="22 分" />
          <CircleRing pct={50} color="#F59E0B" label="拉伸时长" value="5 分" />
        </div>
      </div>

      <div className="bg-white rounded-card border border-line-base shadow-card overflow-hidden">
        <div className="px-4 py-2.5 bg-surface-card border-b border-line-base">
          <p className="text-micro text-ink-placeholder font-medium">今日训练记录</p>
        </div>
        {TRAININGS.map((t, i) => (
          <div key={t.time} className={`flex items-start gap-3 px-4 py-3 ${i !== TRAININGS.length - 1 ? 'border-b border-line-base' : ''}`}>
            <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 bg-brand-orange" />
            <div className="flex-1">
              <p className="text-micro text-ink-placeholder mb-0.5">{t.time} · {t.count}</p>
              <p className="text-caption text-ink-primary">{t.items}</p>
            </div>
            <p className="text-caption font-medium flex-shrink-0 text-brand-orange">{t.duration}</p>
          </div>
        ))}
      </div>

      <AiTip text="上肢训练已完成 90%，建议明天换下肢训练日。本周累计训练 280 分钟，达成阶段目标。" />
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export default function T07_AppRuntime() {
  const { id } = useParams()
  const { apps, activeApp, touchApp } = useApps()
  const app = apps.find(item => item.id === id) ?? activeApp ?? apps[0]

  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    if (app?.id) touchApp(app.id)
  }, [app?.id])

  const handleRefresh = () => {
    setRefreshing(true)
    setTimeout(() => setRefreshing(false), 1200)
  }

  if (!app) {
    return (
      <PageLayout>
        <TopHeader title="轻应用" showBack />
        <div className="flex flex-col items-center justify-center flex-1 px-8 text-center py-20">
          <div className="text-5xl mb-4">⚡</div>
          <p className="text-body text-ink-secondary">轻应用不存在</p>
        </div>
      </PageLayout>
    )
  }

  let form: React.ReactNode
  switch (app.runtimeType) {
    case 'data_dashboard':
      form = <DataDashboardForm />
      break
    case 'daily_tracker':
      form = app.id === 'app_fitness' ? <FitnessTrackerForm /> : <DailyTrackerForm />
      break
    default:
      form = <LearningListForm />
  }

  return (
    <PageLayout>
      <TopHeader
        title={app.name}
        showBack
        right={
          <div className="flex items-center gap-1">
            <button onClick={handleRefresh} className={`p-1 ${refreshing ? 'animate-spin' : ''}`}>
              <RefreshCw size={18} className="text-brand-orange" />
            </button>
            <button className="p-1">
              <MoreHorizontal size={18} className="text-ink-secondary" />
            </button>
          </div>
        }
      />

      <div className="px-5 py-4 space-y-3">
        <SyncBar dataSource={app.dataSource} />
        {form}
      </div>
    </PageLayout>
  )
}
