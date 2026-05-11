import { useState } from 'react'
import { useParams } from 'react-router-dom'
import PageLayout from '../../components/layout/PageLayout'
import TopHeader from '../../components/layout/TopHeader'
import { RefreshCw, Search } from 'lucide-react'
import { useApps } from '../../context/AppsContext'

interface RuntimeRow {
  name: string
  category: string
  metric: string
  signal: string
}

const RUNTIME_PRESETS: Record<string, {
  headers: [string, string, string]
  placeholder: string
  rows: RuntimeRow[]
  stats: [string, string][]
}> = {
  app1: {
    headers: ['产品', '定价', 'AI'],
    placeholder: '搜索竞品...',
    rows: [
      { name: 'Notion', category: '知识管理', metric: '$16/月', signal: '内置' },
      { name: 'Confluence', category: '企业协作', metric: '$5.75/人', signal: '插件' },
      { name: 'Obsidian', category: '本地知识图谱', metric: '$0（基础）', signal: '插件' },
    ],
    stats: [['3', '竞品数量'], ['$7.25', '平均定价'], ['4.5', '平均评分']],
  },
  app2: {
    headers: ['竞品', '动态', '优先级'],
    placeholder: '搜索竞品动态...',
    rows: [
      { name: 'Notion AI', category: '模板能力更新', metric: '新模板上线', signal: '高' },
      { name: 'Perplexity Spaces', category: '团队知识空间', metric: '协作升级', signal: '中' },
      { name: 'Mem', category: '自动整理', metric: '召回优化', signal: '中' },
    ],
    stats: [['3', '今日动态'], ['2', '高/中优先级'], ['86%', '摘要完整度']],
  },
}

export default function T07_AppRuntime() {
  const { id } = useParams()
  const { apps, activeApp } = useApps()
  const app = apps.find(item => item.id === id) ?? activeApp ?? apps[0]
  const preset = RUNTIME_PRESETS[app?.id ?? 'app1'] ?? RUNTIME_PRESETS.app1

  const [search, setSearch] = useState('')
  const [refreshing, setRefreshing] = useState(false)

  const handleRefresh = () => {
    setRefreshing(true)
    setTimeout(() => setRefreshing(false), 1200)
  }

  const filtered = preset.rows.filter(row =>
    row.name.toLowerCase().includes(search.toLowerCase()) ||
    row.category.toLowerCase().includes(search.toLowerCase()) ||
    row.metric.toLowerCase().includes(search.toLowerCase())
  )

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

  return (
    <PageLayout>
      <TopHeader
        title={app.name}
        showBack
        right={
          <button onClick={handleRefresh} className={`p-1 ${refreshing ? 'animate-spin' : ''}`}>
            <RefreshCw size={18} className="text-brand-orange" />
          </button>
        }
      />

      <div className="px-5 py-4 space-y-4">
        {/* Status */}
        <div className="flex items-center gap-2 px-3 py-2 bg-brand-orange-light rounded-card">
          <div className="w-2 h-2 rounded-full bg-brand-orange animate-pulse" />
          <p className="text-caption text-brand-orange">基于「{app.dataSource}」· 实时同步</p>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 bg-surface-card rounded-card px-4 py-3">
          <Search size={16} className="text-ink-placeholder" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={preset.placeholder}
            className="flex-1 bg-transparent text-body text-ink-primary outline-none placeholder:text-ink-placeholder"
          />
        </div>

        {/* Data table */}
        <div className="bg-white rounded-card border border-line-base overflow-hidden shadow-card">
          <div className="grid grid-cols-3 bg-surface-card px-4 py-2.5 text-micro text-ink-placeholder font-medium">
            {preset.headers.map(header => <span key={header}>{header}</span>)}
          </div>
          {filtered.map((row, i) => (
            <div key={row.name} className={`grid grid-cols-3 px-4 py-3.5 ${i !== filtered.length - 1 ? 'border-b border-line-base' : ''}`}>
              <div>
                <p className="text-caption text-ink-primary font-medium">{row.name}</p>
                <p className="text-micro text-ink-placeholder">{row.category}</p>
              </div>
              <p className="text-caption text-ink-secondary self-center">{row.metric}</p>
              <p className="text-caption text-brand-orange self-center">{row.signal}</p>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="px-4 py-8 text-center">
              <p className="text-body text-ink-secondary">没有匹配结果</p>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {preset.stats.map(([val, label]) => (
            <div key={label} className="bg-white rounded-card border border-line-base p-3 text-center shadow-card">
              <p className="text-h2 text-ink-primary">{val}</p>
              <p className="text-micro text-ink-placeholder mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  )
}
