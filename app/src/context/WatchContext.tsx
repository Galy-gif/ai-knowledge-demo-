import { createContext, useContext, useState, type ReactNode } from 'react'

export type WatchPlatform = 'xiaohongshu' | 'bilibili' | 'wechat' | 'zhihu' | 'twitter' | 'weibo'
export type WatchType = 'author' | 'topic' | 'keyword'
export type WatchStrategy = 'ai_filter' | 'all_in' | 'inbox'
export type WatchFrequency = 'realtime' | 'hourly' | 'daily' | 'weekly'
export type WatchStatus = 'running' | 'paused'

export interface WatchTask {
  id: string
  kbId: string
  platform: WatchPlatform
  type: WatchType
  target: string[]
  strategy: WatchStrategy
  frequency: WatchFrequency
  notification: 'in_app' | 'push'
  status: WatchStatus
  createdAt: string
  lastFetchedAt: string
  totalFetched: number
  todayFetched: number
}

export interface TodayItem {
  id: string
  source: WatchPlatform | 'producthunt'
  author: string
  title: string
  time: string
  read: boolean
}

const INIT_TASKS: WatchTask[] = [
  // AI 浏览器项目库（kb_project_browser）
  {
    id: 'watch_001',
    kbId: 'kb_project_browser',
    platform: 'xiaohongshu',
    type: 'author',
    target: ['dialog 设计周报'],
    strategy: 'ai_filter',
    frequency: 'daily',
    notification: 'in_app',
    status: 'running',
    createdAt: '3天前',
    lastFetchedAt: '2小时前',
    totalFetched: 12,
    todayFetched: 1,
  },
  {
    id: 'watch_002',
    kbId: 'kb_project_browser',
    platform: 'bilibili',
    type: 'topic',
    target: ['#AI浏览器', '#浏览器评测'],
    strategy: 'ai_filter',
    frequency: 'daily',
    notification: 'in_app',
    status: 'running',
    createdAt: '5天前',
    lastFetchedAt: '今早',
    totalFetched: 8,
    todayFetched: 2,
  },
  {
    id: 'watch_003',
    kbId: 'kb_project_browser',
    platform: 'zhihu',
    type: 'keyword',
    target: ['Arc 停服', 'Arc 替代品'],
    strategy: 'ai_filter',
    frequency: 'daily',
    notification: 'in_app',
    status: 'paused',
    createdAt: '2周前',
    lastFetchedAt: '7天前',
    totalFetched: 7,
    todayFetched: 0,
  },
  // 产品资料库（kb1）
  {
    id: 'watch_004',
    kbId: 'kb1',
    platform: 'wechat',
    type: 'author',
    target: ['PMTalk'],
    strategy: 'ai_filter',
    frequency: 'daily',
    notification: 'in_app',
    status: 'running',
    createdAt: '1周前',
    lastFetchedAt: '昨天',
    totalFetched: 6,
    todayFetched: 1,
  },
  {
    id: 'watch_005',
    kbId: 'kb1',
    platform: 'zhihu',
    type: 'topic',
    target: ['产品方法论'],
    strategy: 'ai_filter',
    frequency: 'daily',
    notification: 'in_app',
    status: 'running',
    createdAt: '2周前',
    lastFetchedAt: '3天前',
    totalFetched: 5,
    todayFetched: 0,
  },
  // 用户访谈库（kb2）
  {
    id: 'watch_006',
    kbId: 'kb2',
    platform: 'twitter',
    type: 'keyword',
    target: ['用户研究'],
    strategy: 'ai_filter',
    frequency: 'daily',
    notification: 'in_app',
    status: 'running',
    createdAt: '4天前',
    lastFetchedAt: '今天',
    totalFetched: 4,
    todayFetched: 1,
  },
  {
    id: 'watch_007',
    kbId: 'kb2',
    platform: 'wechat',
    type: 'author',
    target: ['猫眼研究院'],
    strategy: 'ai_filter',
    frequency: 'daily',
    notification: 'in_app',
    status: 'paused',
    createdAt: '3周前',
    lastFetchedAt: '5天前',
    totalFetched: 9,
    todayFetched: 0,
  },
  // 读书摘录（kb3）
  {
    id: 'watch_008',
    kbId: 'kb3',
    platform: 'xiaohongshu',
    type: 'author',
    target: ['书单狗'],
    strategy: 'ai_filter',
    frequency: 'daily',
    notification: 'in_app',
    status: 'running',
    createdAt: '1周前',
    lastFetchedAt: '今天',
    totalFetched: 18,
    todayFetched: 3,
  },
  {
    id: 'watch_009',
    kbId: 'kb3',
    platform: 'zhihu',
    type: 'topic',
    target: ['认知科学'],
    strategy: 'ai_filter',
    frequency: 'daily',
    notification: 'in_app',
    status: 'running',
    createdAt: '2周前',
    lastFetchedAt: '2天前',
    totalFetched: 7,
    todayFetched: 1,
  },
  // 季度产品复盘（kb_output_review）
  {
    id: 'watch_010',
    kbId: 'kb_output_review',
    platform: 'wechat',
    type: 'author',
    target: ['字节范儿'],
    strategy: 'ai_filter',
    frequency: 'daily',
    notification: 'in_app',
    status: 'running',
    createdAt: '5天前',
    lastFetchedAt: '今天',
    totalFetched: 6,
    todayFetched: 2,
  },
]

export const MOCK_TODAY_ITEMS: TodayItem[] = [
  { id: 'ti1', source: 'xiaohongshu', author: 'dialog 设计周报', title: '移动端 AI 浏览器的设计语言探索', time: '2小时前', read: false },
  { id: 'ti2', source: 'bilibili', author: '极客湾', title: '5 款 AI 浏览器横评：谁才是 Arc 的接班人', time: '1小时前', read: false },
  { id: 'ti3', source: 'producthunt', author: 'ProductHunt', title: 'Pinch 浏览器全球首发：专为 AI 时代设计', time: '6小时前', read: false },
  { id: 'ti4', source: 'zhihu', author: '知乎精选', title: 'Arc 浏览器停服后，用户该何去何从？', time: '4小时前', read: false },
  { id: 'ti5', source: 'wechat', author: 'PMTalk', title: 'AI 浏览器的产品机会：下一个超级入口在哪里', time: '早上', read: false },
]

interface WatchContextValue {
  tasks: WatchTask[]
  todayItems: TodayItem[]
  todayUnread: number
  addTask: (task: WatchTask) => void
  toggleTask: (id: string) => void
  deleteTask: (id: string) => void
  getKbTasks: (kbId: string) => WatchTask[]
  markAllRead: () => void
  markItemRead: (id: string) => void
}

const WatchContext = createContext<WatchContextValue | null>(null)

export function WatchProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<WatchTask[]>(INIT_TASKS)
  const [todayItems, setTodayItems] = useState<TodayItem[]>(MOCK_TODAY_ITEMS)

  const todayUnread = todayItems.filter(i => !i.read).length

  const addTask = (task: WatchTask) => setTasks(prev => [task, ...prev])

  const toggleTask = (id: string) =>
    setTasks(prev =>
      prev.map(t => t.id === id ? { ...t, status: t.status === 'running' ? 'paused' : 'running' } : t)
    )

  const deleteTask = (id: string) => setTasks(prev => prev.filter(t => t.id !== id))

  const getKbTasks = (kbId: string) => tasks.filter(t => t.kbId === kbId)

  const markAllRead = () => setTodayItems(prev => prev.map(i => ({ ...i, read: true })))

  const markItemRead = (id: string) =>
    setTodayItems(prev => prev.map(i => i.id === id ? { ...i, read: true } : i))

  return (
    <WatchContext.Provider value={{
      tasks, todayItems, todayUnread,
      addTask, toggleTask, deleteTask, getKbTasks,
      markAllRead, markItemRead,
    }}>
      {children}
    </WatchContext.Provider>
  )
}

export function useWatch() {
  const ctx = useContext(WatchContext)
  if (!ctx) throw new Error('useWatch must be inside WatchProvider')
  return ctx
}
