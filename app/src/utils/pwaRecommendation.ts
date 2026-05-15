import { getPwaTemplateById, pwaTemplates, type PwaTemplate } from '../mock/pwaTemplates'
import type { FileType, KnowledgeBase, KnowledgeFile } from '../mock/data'

export type PwaFitLevel = 'recommended' | 'normal' | 'not-recommended'

export interface PwaRecommendationInput {
  id?: string
  title: string
  type?: FileType
  wordCount?: number
  summary?: string
  content?: string
}

export interface PwaTemplateMatch {
  templateId?: string
  template?: PwaTemplate
  name: string
  icon: string
  coreFeatures: string
  requirement: string
}

const EXCLUDE_WORDS = ['日记', '感想', '随笔', '小说']
const STRUCTURED_WORDS = ['分析', '对比', '调研', '报告']
const METRIC_WORDS = ['数据', '指标', '统计']
const METHOD_WORDS = ['方法', '方案', 'SOP', '流程', '策略']
const LEARNING_WORDS = ['题', '学习', '笔记', '课']
const PLAN_WORDS = ['计划', '规划', '路线', '周期']

const VIRTUAL_MATCHES: Array<{ keywords: string[]; match: PwaTemplateMatch }> = [
  {
    keywords: ['竞品'],
    match: {
      templateId: 'stock-watchlist',
      template: getPwaTemplateById('stock-watchlist'),
      name: '竞品对比看板',
      icon: '📊',
      coreFeatures: '竞品追踪、维度对比、资料关联',
      requirement: '基于当前文档生成竞品对比看板，支持竞品追踪、维度对比和资料关联。',
    },
  },
  {
    keywords: ['调研', '访谈', '问卷'],
    match: {
      name: '调研追踪面板',
      icon: '📋',
      coreFeatures: '样本管理、问题追踪、洞察归纳',
      requirement: '基于当前调研资料生成调研追踪面板，支持样本管理、问题追踪和洞察归纳。',
    },
  },
  {
    keywords: ['策略', '产品', '设计'],
    match: {
      name: '产品策略看板',
      icon: '🧭',
      coreFeatures: '策略拆解、来源整理、行动清单',
      requirement: '基于当前资料生成产品策略看板，支持策略拆解、来源整理和行动清单。',
    },
  },
]

function normalize(input: PwaRecommendationInput) {
  return `${input.title} ${input.summary ?? ''} ${input.content ?? ''}`.toLowerCase()
}

function containsAny(text: string, words: string[]) {
  return words.some(word => text.includes(word.toLowerCase()))
}

export function isPwaRecommendable(input: PwaRecommendationInput) {
  const text = normalize(input)

  if (input.type === 'note') return false
  if ((input.wordCount ?? 999) < 300) return false
  if (containsAny(text, EXCLUDE_WORDS)) return false

  return (
    containsAny(text, STRUCTURED_WORDS) ||
    containsAny(text, METRIC_WORDS) ||
    containsAny(text, METHOD_WORDS) ||
    containsAny(text, LEARNING_WORDS) ||
    containsAny(text, PLAN_WORDS)
  )
}

export function matchTemplate(input: PwaRecommendationInput): PwaTemplateMatch | undefined {
  if (!isPwaRecommendable(input)) return undefined
  const text = normalize(input)

  const virtual = VIRTUAL_MATCHES.find(item => containsAny(text, item.keywords))
  if (virtual) {
    const title = input.title.replace(/\.[^.]+$/, '')
    return {
      ...virtual.match,
      requirement: `基于「${title}」生成${virtual.match.name}，包含${virtual.match.coreFeatures}功能。`,
    }
  }

  const template = pwaTemplates.find(item =>
    item.keywords.some(keyword => text.includes(keyword.toLowerCase())) ||
    text.includes(item.name.toLowerCase())
  )
  if (!template) return undefined

  const title = input.title.replace(/\.[^.]+$/, '')
  return {
    templateId: template.id,
    template,
    name: template.name,
    icon: template.icon,
    coreFeatures: template.coreFeatures,
    requirement: `基于「${title}」生成${template.name}，包含${template.coreFeatures}功能。`,
  }
}

export function getPwaRecommendation(input: PwaRecommendationInput) {
  const match = matchTemplate(input)
  return {
    recommendable: Boolean(match),
    match,
  }
}

export function getKnowledgeBasePwaFit(base: KnowledgeBase, files: KnowledgeFile[]): {
  level: PwaFitLevel
  label: string
  className: string
} {
  if (base.name === '产品资料库' || base.name === 'ProductLab 团队' || base.name === 'Design Systems Lab') {
    return { level: 'recommended', label: '🟢 推荐', className: 'bg-green-100 text-green-700' }
  }
  if (base.name === '用户访谈库') {
    return { level: 'normal', label: '🟡 一般', className: 'bg-yellow-100 text-yellow-700' }
  }
  if (base.name === '读书摘录') {
    return { level: 'not-recommended', label: '🔴 不建议', className: 'bg-red-100 text-red-700' }
  }

  const kbFiles = files.filter(file => file.kbId === base.id)
  const recommendedCount = kbFiles.filter(file =>
    isPwaRecommendable({
      title: file.name,
      type: file.type,
      wordCount: file.wordCount,
      summary: file.summary,
      content: file.content,
    })
  ).length

  if (recommendedCount >= 2) return { level: 'recommended', label: '🟢 推荐', className: 'bg-green-100 text-green-700' }
  if (recommendedCount >= 1) return { level: 'normal', label: '🟡 一般', className: 'bg-yellow-100 text-yellow-700' }
  return { level: 'not-recommended', label: '🔴 不建议', className: 'bg-red-100 text-red-700' }
}
