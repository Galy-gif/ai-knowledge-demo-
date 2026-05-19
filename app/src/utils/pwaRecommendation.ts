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

const FIT_MAP: Record<PwaFitLevel, { label: string; className: string }> = {
  recommended: { label: '🟢 推荐', className: 'bg-[#D1FAE5] text-[#10B981]' },
  normal: { label: '🟡 一般', className: 'bg-[#FEF3C7] text-[#F59E0B]' },
  'not-recommended': { label: '🔴 不建议', className: 'bg-[#FEE2E2] text-[#EF4444]' },
}

const TEMPLATE_KB_FIT: Record<string, Record<string, PwaFitLevel>> = {
  'travel-plan': {
    '旅行美食圈': 'recommended',
    '读书摘录': 'normal',
    '产品资料库': 'not-recommended',
    '用户访谈库': 'not-recommended',
    'AI 浏览器项目库': 'not-recommended',
    '季度产品复盘': 'not-recommended',
    'ProductLab 团队': 'not-recommended',
    'Design Systems Lab': 'not-recommended',
    '投资研究社': 'not-recommended',
  },
  'diet-log': {
    '旅行美食圈': 'recommended',
    '读书摘录': 'normal',
    '产品资料库': 'not-recommended',
    '用户访谈库': 'not-recommended',
    'ProductLab 团队': 'not-recommended',
    'Design Systems Lab': 'not-recommended',
    '投资研究社': 'not-recommended',
  },
  'fitness-planner': {
    '读书摘录': 'not-recommended',
    '产品资料库': 'not-recommended',
    '用户访谈库': 'not-recommended',
    '旅行美食圈': 'not-recommended',
    'ProductLab 团队': 'not-recommended',
    'Design Systems Lab': 'not-recommended',
    '投资研究社': 'not-recommended',
  },
  'fund-portfolio': {
    '投资研究社': 'recommended',
    '读书摘录': 'normal',
    '产品资料库': 'not-recommended',
    '用户访谈库': 'not-recommended',
    '旅行美食圈': 'not-recommended',
    'ProductLab 团队': 'not-recommended',
    'Design Systems Lab': 'not-recommended',
  },
}

export function getKnowledgeBasePwaFit(
  base: KnowledgeBase,
  files: KnowledgeFile[],
  templateId?: string,
): {
  level: PwaFitLevel
  label: string
  className: string
} {
  if (templateId) {
    const rules = TEMPLATE_KB_FIT[templateId]
    if (rules) {
      const level = rules[base.name]
      if (level) return { level, ...FIT_MAP[level] }
    }
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

  if (recommendedCount >= 2) return { level: 'recommended', ...FIT_MAP.recommended }
  if (recommendedCount >= 1) return { level: 'normal', ...FIT_MAP.normal }
  return { level: 'not-recommended', ...FIT_MAP['not-recommended'] }
}
