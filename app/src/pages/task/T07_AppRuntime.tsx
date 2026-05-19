import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PageLayout from '../../components/layout/PageLayout'
import TopHeader from '../../components/layout/TopHeader'
import { ChevronDown, ChevronUp, Download, MoreHorizontal, RefreshCw, Sliders } from 'lucide-react'
import { useApps } from '../../context/AppsContext'
import { useUser } from '../../context/UserContext'
import ExportItinerarySheet from '../../components/common/ExportItinerarySheet'
import type { LightApp, TravelPreferences } from '../../mock/data'

// ── Shared ────────────────────────────────────────────────────────────────────

function SyncBar({ dataSource, color = 'orange' }: { dataSource: string; color?: 'orange' | 'teal' }) {
  const isTeal = color === 'teal'
  const bg = isTeal ? '#CCFBF1' : '#FFF1E6'
  const dot = isTeal ? '#14B8A6' : '#FF7A00'
  const text = isTeal ? '#0F766E' : '#FF7A00'
  return (
    <div className="flex items-center justify-between px-3 h-9 rounded-card" style={{ backgroundColor: bg }}>
      <div className="flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: dot }} />
        <p className="text-caption" style={{ color: text }}>基于「{dataSource}」· 实时同步</p>
      </div>
      <p className="text-micro opacity-60" style={{ color: text }}>上次同步：刚刚</p>
    </div>
  )
}

function AiTip({ text }: { text: string }) {
  return (
    <div className="flex gap-2.5 p-3 rounded-card" style={{ backgroundColor: '#FFF1E6' }}>
      <span className="text-base leading-none mt-0.5">✨</span>
      <p className="text-[12px] text-ink-primary leading-relaxed">{text}</p>
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

// ── Form 5: Travel Planner ────────────────────────────────────────────────────

const BUDGET_LABEL: Record<string, string> = {
  budget: '¥5,000 以下',
  comfort: '¥1.5万',
  premium: '¥1.5-3万',
  luxury: '¥3万+',
}
const HOTEL_LABEL: Record<string, string> = {
  chain: '连锁酒店',
  premium: '精品酒店',
  local: '当地民宿',
  apartment: '公寓式',
}
const STYLE_LABEL: Record<string, string> = {
  nature: '自然',
  city: '城市',
  history: '历史',
  food: '美食',
  shopping: '购物',
}
const COMPANION_LABEL: Record<string, string> = {
  solo: '独行',
  couple: '情侣',
  family: '亲子',
  friends: '朋友',
}

function buildSubtitle(prefs: TravelPreferences) {
  const budget = `预算 ${BUDGET_LABEL[prefs.budget] ?? '舒适'}`
  const hotel = prefs.hotelPrefs.length > 0
    ? prefs.hotelPrefs.map(h => HOTEL_LABEL[h] ?? h).join(' / ')
    : '精品酒店'
  const styles = prefs.tripStyles.length > 0
    ? prefs.tripStyles.map(s => STYLE_LABEL[s] ?? s).join(' + ')
    : '综合'
  const companion = `${COMPANION_LABEL[prefs.companions] ?? '情侣'} ${prefs.duration} 天`
  return `按照您的需求定制 · ${budget} · ${hotel} · ${styles} · ${companion}`
}

interface FlightCard {
  id: string
  airline: string
  flightNo: string
  price: string
  route: string
  badge?: { label: string; color: string }
}

const FLIGHTS: FlightCard[] = [
  { id: 'f1', airline: '春秋航空', flightNo: '9C8587', price: '¥1,280', route: '上海浦东 → 大阪关西 · 直飞 4h', badge: { label: '💰 最便宜', color: '#FF7A00' } },
  { id: 'f2', airline: '国航', flightNo: 'CA923', price: '¥1,820', route: '上海浦东 → 大阪关西 · 直飞 4h 10min', badge: { label: '⭐ 推荐', color: '#14B8A6' } },
  { id: 'f3', airline: '全日空', flightNo: 'NH976', price: '¥2,450', route: '上海浦东 → 关西（经东京）· 6h 30min' },
]

interface HotelCard {
  id: string
  emoji: string
  name: string
  meta: string
  price: string
  badge?: { label: string; color: string }
}

const HOTELS: HotelCard[] = [
  { id: 'h1', emoji: '🏛️', name: '京都老町家民宿', meta: '祇园步行 5min · 评分 9.2', price: '¥1,800/晚', badge: { label: '⭐ AI 推荐', color: '#14B8A6' } },
  { id: 'h2', emoji: '🏨', name: '大阪瑞吉酒店', meta: '难波附近 · 评分 9.0', price: '¥2,800/晚' },
  { id: 'h3', emoji: '🏯', name: '京都丽思卡尔顿', meta: '距清水寺 1.2km · 评分 8.9', price: '¥3,200/晚' },
]

interface DayItem {
  time: string
  place: string
  tag: string
  emoji: string
}

interface DayPlan {
  day: number
  city: string
  theme: string
  items: DayItem[]
}

const ITINERARY: DayPlan[] = [
  {
    day: 1, city: '京都', theme: '古都初体验', items: [
      { time: '8:30', place: '清水寺', tag: '景点', emoji: '🏛️' },
      { time: '11:00', place: '二年坂三年坂', tag: '街区', emoji: '🛍️' },
      { time: '13:00', place: '祇园料亭午餐', tag: '餐厅', emoji: '🍜' },
      { time: '15:30', place: '伏见稻荷大社', tag: '景点', emoji: '🏛️' },
    ],
  },
  {
    day: 2, city: '京都', theme: '古寺与园林', items: [
      { time: '9:00', place: '金阁寺', tag: '景点', emoji: '🏛️' },
      { time: '11:30', place: '龙安寺', tag: '景点', emoji: '🏛️' },
      { time: '13:00', place: '京都料理晚餐', tag: '餐厅', emoji: '🍜' },
      { time: '15:00', place: '哲学之道', tag: '休闲', emoji: '🌸' },
    ],
  },
  {
    day: 3, city: '大阪', theme: '城市初探', items: [
      { time: '9:30', place: '大阪城公园', tag: '景点', emoji: '🏯' },
      { time: '12:00', place: '难波美食街', tag: '餐厅', emoji: '🍜' },
      { time: '15:00', place: '心斋桥购物', tag: '街区', emoji: '🛍️' },
    ],
  },
  {
    day: 4, city: '大阪', theme: '美食之日', items: [
      { time: '10:00', place: '黑门市场', tag: '街区', emoji: '🍣' },
      { time: '12:30', place: '道顿堀章鱼烧', tag: '餐厅', emoji: '🍜' },
      { time: '14:00', place: '通天阁', tag: '景点', emoji: '🏛️' },
      { time: '18:00', place: '梅田蓝天大厦', tag: '景点', emoji: '🏙️' },
    ],
  },
  {
    day: 5, city: '奈良', theme: '古都余韵', items: [
      { time: '9:00', place: '奈良公园喂鹿', tag: '景点', emoji: '🦌' },
      { time: '11:00', place: '东大寺', tag: '景点', emoji: '🏛️' },
      { time: '13:30', place: '春日大社', tag: '景点', emoji: '🏛️' },
    ],
  },
  {
    day: 6, city: '神户', theme: '港湾风光', items: [
      { time: '9:30', place: '北野异人馆', tag: '景点', emoji: '🏛️' },
      { time: '12:30', place: '神户牛肉午餐', tag: '餐厅', emoji: '🥩' },
      { time: '15:00', place: '神户港夜景', tag: '景点', emoji: '🌃' },
    ],
  },
  {
    day: 7, city: '大阪', theme: '购物归程', items: [
      { time: '9:00', place: '心斋桥扫货', tag: '街区', emoji: '🛍️' },
      { time: '12:00', place: '关西机场', tag: '交通', emoji: '✈️' },
    ],
  },
]

function FlightCardItem({ flight }: { flight: FlightCard }) {
  return (
    <div className="relative w-[240px] h-[120px] flex-shrink-0 bg-white border border-[#EEEEEE] rounded-card p-3 flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-ink-placeholder font-medium">{flight.airline}</span>
          <span className="text-[11px] text-ink-placeholder">{flight.flightNo}</span>
        </div>
        <p className="text-[18px] font-semibold leading-7 mt-1" style={{ color: '#0F766E' }}>{flight.price}</p>
      </div>
      <p className="text-[11px] text-ink-secondary leading-4">{flight.route}</p>
      {flight.badge && (
        <span
          className="absolute top-2 right-2 text-[10px] font-medium text-white px-1.5 py-0.5 rounded-md"
          style={{ backgroundColor: flight.badge.color }}
        >
          {flight.badge.label}
        </span>
      )}
    </div>
  )
}

function HotelCardItem({ hotel }: { hotel: HotelCard }) {
  return (
    <div className="relative w-[240px] h-[120px] flex-shrink-0 bg-white border border-[#EEEEEE] rounded-card p-3 flex gap-3">
      <div className="w-16 h-16 rounded-[10px] bg-[#CCFBF1] flex items-center justify-center text-[28px] flex-shrink-0">
        {hotel.emoji}
      </div>
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <p className="text-[13px] font-semibold text-ink-primary leading-5 truncate">{hotel.name}</p>
          <p className="text-[11px] text-ink-secondary leading-4 mt-0.5 line-clamp-2">{hotel.meta}</p>
        </div>
        <p className="text-[14px] font-semibold" style={{ color: '#0F766E' }}>{hotel.price}</p>
      </div>
      {hotel.badge && (
        <span
          className="absolute top-2 right-2 text-[10px] font-medium text-white px-1.5 py-0.5 rounded-md"
          style={{ backgroundColor: hotel.badge.color }}
        >
          {hotel.badge.label}
        </span>
      )}
    </div>
  )
}

function SectionTitle({ title, more, sub }: { title: string; more?: boolean; sub?: string }) {
  return (
    <div className="px-4 mb-2.5">
      <div className="flex items-center justify-between">
        <p className="text-[14px] leading-5 font-semibold text-ink-primary">{title}</p>
        {more && <button className="text-[11px] text-ink-placeholder">更多 ›</button>}
      </div>
      {sub && <p className="text-[11px] text-ink-placeholder mt-1">{sub}</p>}
    </div>
  )
}

function DayCard({ plan, defaultOpen }: { plan: DayPlan; defaultOpen: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="bg-white border border-[#EEEEEE] rounded-card overflow-hidden">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center gap-2.5 px-3.5 py-3.5"
      >
        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: '#14B8A6' }} />
        <p className="text-[13px] font-semibold text-ink-primary">Day {plan.day} · {plan.city}</p>
        <p className="text-[12px] text-ink-secondary flex-1 text-left truncate">{plan.theme}</p>
        {open ? <ChevronUp size={16} className="text-ink-placeholder" /> : <ChevronDown size={16} className="text-ink-placeholder" />}
      </button>
      {open && (
        <div className="px-3.5 pb-3.5 space-y-2">
          {plan.items.map((item, i) => (
            <div key={i} className="flex items-center gap-3 py-1.5">
              <p className="text-[11px] text-ink-placeholder w-12 flex-shrink-0">{item.time}</p>
              <span className="text-[16px] flex-shrink-0">{item.emoji}</span>
              <p className="flex-1 text-[13px] text-ink-primary min-w-0">{item.place}</p>
              <span className="text-[10px] px-1.5 py-0.5 rounded-pill flex-shrink-0" style={{ backgroundColor: '#CCFBF1', color: '#0F766E' }}>
                {item.tag}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function TravelPlannerForm({ app, onAdjust, onExport }: { app: LightApp; onAdjust: () => void; onExport: () => void }) {
  const prefs: TravelPreferences = app.travelPreferences ?? {
    budget: 'comfort',
    hotelPrefs: ['premium'],
    tripStyles: ['history', 'food'],
    companions: 'couple',
    duration: 7,
  }
  const subtitle = buildSubtitle(prefs)
  const sightCount = ITINERARY.reduce((acc, day) => acc + day.items.filter(i => i.tag === '景点' || i.tag === '街区').length, 0)
  const restCount = ITINERARY.reduce((acc, day) => acc + day.items.filter(i => i.tag === '餐厅').length, 0)

  return (
    <div className="space-y-4">
      {/* A: Hero card */}
      <div
        className="mx-4 rounded-[16px] p-4 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #CCFBF1 0%, #FFFFFF 100%)', minHeight: 160 }}
      >
        <span className="text-[32px] leading-none">✈️</span>
        <p className="text-[22px] font-semibold leading-7 mt-1" style={{ color: '#0F766E' }}>日本关西七日游</p>
        <p className="text-[11px] leading-4 text-ink-secondary mt-2 line-clamp-2 max-w-[260px]">{subtitle}</p>
        <svg
          className="absolute right-3 bottom-3 opacity-30"
          width="80" height="48" viewBox="0 0 80 48" fill="none"
        >
          <path d="M 8 40 L 20 40 L 20 24 L 28 16 L 36 24 L 36 40 L 50 40 L 50 28 L 62 28 L 62 40 L 72 40" stroke="#14B8A6" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" fill="none" />
          <path d="M 28 16 L 28 8 M 26 11 L 30 11" stroke="#14B8A6" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>

      {/* B: Flights */}
      <section>
        <SectionTitle title="✈️ 机票推荐" more />
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 px-4">
            {FLIGHTS.map(f => <FlightCardItem key={f.id} flight={f} />)}
          </div>
        </div>
        <div className="mx-4 mt-3">
          <AiTip text="春秋航空价格最优，但建议提前 30 天预订国航更稳妥。" />
        </div>
      </section>

      {/* C: Hotels */}
      <section>
        <SectionTitle title="🏨 酒店推荐 · 已按您的精品酒店偏好筛选" more />
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 px-4">
            {HOTELS.map(h => <HotelCardItem key={h.id} hotel={h} />)}
          </div>
        </div>
        <div className="mx-4 mt-3">
          <AiTip text="老町家民宿最贴合您的精品酒店和历史古迹偏好，建议优先预订。" />
        </div>
      </section>

      {/* D: Utility 2x2 */}
      <section>
        <SectionTitle title="🌟 实用信息" />
        <div className="mx-4 grid grid-cols-2 gap-2.5">
          <div className="bg-white border border-[#EEEEEE] rounded-card p-3">
            <span className="text-[18px]">☀️</span>
            <p className="text-[18px] font-semibold text-ink-primary leading-6 mt-1">8℃</p>
            <p className="text-[11px] text-ink-secondary mt-0.5">多云转晴 · 关西本周</p>
          </div>
          <div className="bg-white border border-[#EEEEEE] rounded-card p-3">
            <span className="text-[18px]">💱</span>
            <p className="text-[18px] font-semibold text-ink-primary leading-6 mt-1">¥1 = 21.8</p>
            <p className="text-[11px] text-ink-secondary mt-0.5">日元 · 较昨日 <span style={{ color: '#10B981' }}>↑ 0.3</span></p>
          </div>
          <div className="bg-white border border-[#EEEEEE] rounded-card p-3">
            <span className="text-[18px]">✅</span>
            <p className="text-[18px] font-semibold leading-6 mt-1" style={{ color: '#10B981' }}>免签 15 天</p>
            <p className="text-[11px] text-ink-secondary mt-0.5">已生效 · 无需办理</p>
          </div>
          <div className="bg-white border border-[#EEEEEE] rounded-card p-3">
            <span className="text-[18px]">📖</span>
            <p className="text-[18px] font-semibold text-ink-primary leading-6 mt-1">56 篇攻略</p>
            <p className="text-[11px] text-ink-secondary mt-0.5">来自「日本旅行攻略」</p>
          </div>
        </div>
      </section>

      {/* E: Itinerary */}
      <section>
        <SectionTitle
          title={`📍 ${prefs.duration} 天行程 · 已按您的偏好生成`}
          sub={`⭐ 历史古迹 + 美食探索 · 已规划 ${sightCount} 个景点 / ${restCount} 家餐厅`}
        />
        <div className="mx-4 space-y-2.5">
          {ITINERARY.map(plan => (
            <DayCard key={plan.day} plan={plan} defaultOpen={plan.day <= 2} />
          ))}
        </div>
      </section>

      {/* F: AI assistant */}
      <section className="mx-4">
        <div className="rounded-card p-3.5" style={{ backgroundColor: '#FFF1E6' }}>
          <p className="text-[14px] font-semibold text-ink-primary">✨ AI 助手</p>
          <p className="text-[12px] text-ink-secondary leading-5 mt-1.5">
            已基于「日本旅行攻略」知识库生成全套方案，可随时调整您的偏好重新规划。
          </p>
          <div className="flex gap-2 mt-3">
            <button
              onClick={onAdjust}
              className="flex items-center gap-1.5 px-4 py-2 rounded-[10px] bg-white border border-brand-orange text-brand-orange text-[12px] font-medium transition-transform active:scale-95"
            >
              <Sliders size={13} strokeWidth={2} />
              调整需求
            </button>
            <button
              onClick={onExport}
              className="flex items-center gap-1.5 px-4 py-2 rounded-[10px] bg-brand-orange text-white text-[12px] font-medium transition-transform active:scale-95"
            >
              <Download size={13} strokeWidth={2} />
              导出行程
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export default function T07_AppRuntime() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { apps, activeApp, touchApp } = useApps()
  const { showToast } = useUser()
  const app = apps.find(item => item.id === id) ?? activeApp ?? apps[0]

  const [refreshing, setRefreshing] = useState(false)
  const [showExport, setShowExport] = useState(false)

  useEffect(() => {
    if (app?.id) touchApp(app.id)
  }, [app?.id])

  const handleRefresh = () => {
    setRefreshing(true)
    setTimeout(() => setRefreshing(false), 1200)
  }

  const handleAdjust = () => {
    if (!app) return
    navigate('/pwa/confirm', {
      state: {
        fromEdit: true,
        templateId: app.templateId,
        resultAppId: app.id,
        travelPreferences: app.travelPreferences,
        customRequirement: app.customRequirement,
      },
    })
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

  const isTravel = app.runtimeType === 'travel_planner'

  let form: React.ReactNode
  switch (app.runtimeType) {
    case 'data_dashboard':
      form = <DataDashboardForm />
      break
    case 'travel_planner':
      form = <TravelPlannerForm app={app} onAdjust={handleAdjust} onExport={() => setShowExport(true)} />
      break
    case 'daily_tracker':
      if (app.id === 'app_fitness') form = <FitnessTrackerForm />
      else form = <DailyTrackerForm />
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
              <RefreshCw size={18} className={isTravel ? 'text-[#14B8A6]' : 'text-brand-orange'} />
            </button>
            <button className="p-1">
              <MoreHorizontal size={18} className="text-ink-secondary" />
            </button>
          </div>
        }
      />

      <div className={`${isTravel ? 'pt-3 pb-6' : 'px-5 py-4'} space-y-3`}>
        <div className={isTravel ? 'px-4' : ''}>
          <SyncBar dataSource={app.dataSource} color={isTravel ? 'teal' : 'orange'} />
        </div>
        {form}
      </div>

      <ExportItinerarySheet
        open={showExport}
        onClose={() => setShowExport(false)}
        onPick={msg => showToast(msg, 'success')}
      />
    </PageLayout>
  )
}
