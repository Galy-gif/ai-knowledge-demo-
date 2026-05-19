export type PwaTemplateCategory = '财经' | '健康' | '职场' | '教育' | '生活'

export interface PwaTemplate {
  id: string
  category: PwaTemplateCategory
  tag: string
  icon: string
  name: string
  description: string
  coreFeatures: string
  requirement: string
  keywords: string[]
  recommended?: boolean
  targetRuntimeType?: string
  resultAppName?: string
  resultAppId?: string
  resultMainColor?: string
  defaultFeatures?: string[]
  defaultAccessMode?: string
}

export const pwaTemplateCategories = ['全部', '财经', '健康', '职场', '教育', '生活'] as const

export const pwaTemplates: PwaTemplate[] = [
  {
    id: 'stock-watchlist',
    category: '财经',
    tag: '股票分析',
    icon: '📊',
    name: '自选股看板',
    description: '追踪股票与财报日历',
    coreFeatures: '个股追踪、财报日历、知识库内研报关联',
    requirement: '帮我生成一个自选股看板，支持个股追踪、财报日历和知识库内研报关联。',
    keywords: ['股票', '自选股', '个股', '财报', '研报', '行情', '投资'],
    recommended: true,
  },
  {
    id: 'fund-portfolio',
    category: '财经',
    tag: '基金理财',
    icon: '📈',
    name: '基金组合助手',
    description: '跟踪基金持仓与收益',
    coreFeatures: '基金净值、收益曲线、持仓笔记',
    requirement: '帮我做一个基金持仓跟踪应用，显示总资产和涨跌',
    keywords: ['基金', '理财', '净值', '收益', '持仓', '组合'],
    targetRuntimeType: 'data_dashboard',
    resultAppName: 'Q4 投资跟踪',
    resultAppId: 'app_invest',
    resultMainColor: 'green',
    defaultFeatures: ['资产总览', '持仓明细', '收益曲线'],
    defaultAccessMode: 'desktop',
  },
  {
    id: 'fitness-planner',
    category: '健康',
    tag: '运动健身',
    icon: '🏃',
    name: '健身计划助手',
    description: '制定与跟踪训练目标',
    coreFeatures: '动作库、训练计划、打卡记录',
    requirement: '帮我做一个训练打卡的应用，跟踪每日训练量和身体指标',
    keywords: ['健身', '运动', '训练', '动作', '打卡', '肌肉'],
    recommended: true,
    targetRuntimeType: 'daily_tracker',
    resultAppName: '我的训练计划',
    resultAppId: 'app_fitness',
    resultMainColor: 'orange',
    defaultFeatures: ['训练日程', '动作库', '力量记录'],
    defaultAccessMode: 'desktop',
  },
  {
    id: 'diet-log',
    category: '健康',
    tag: '营养膳食',
    icon: '🥗',
    name: '饮食记录本',
    description: '记录每日饮食与营养',
    coreFeatures: '食物库、热量记录、营养分析',
    requirement: '帮我做一个每日饮食打卡的应用，记录三餐热量和营养',
    keywords: ['饮食', '热量', '营养', '减脂', '食物', '卡路里'],
    targetRuntimeType: 'daily_tracker',
    resultAppName: '减脂期饮食',
    resultAppId: 'app_diet',
    resultMainColor: 'purple',
    defaultFeatures: ['食物库', '热量记录', '营养分析'],
    defaultAccessMode: 'desktop',
  },
  {
    id: 'travel-plan',
    category: '生活',
    tag: '旅行规划',
    icon: '✈️',
    name: '旅行计划本',
    description: '规划行程与每日安排',
    coreFeatures: '行程时间线、景点收藏、预算跟踪',
    requirement: '帮我做一个旅行规划应用，按天展示行程、景点、餐厅和预算',
    keywords: ['旅行', '旅游', '行程', '攻略', '路线', '景点', '预算', '出行'],
    targetRuntimeType: 'travel_planner',
    resultAppName: '日本关西七日游',
    resultAppId: 'app_travel',
    resultMainColor: 'teal',
    defaultFeatures: ['行程时间线', '景点收藏', '预算跟踪', 'AI 推荐'],
    defaultAccessMode: 'desktop',
  },
  {
    id: 'interview-bank',
    category: '职场',
    tag: '简历面试',
    icon: '📝',
    name: '面试题库',
    description: '整理题目与备考笔记',
    coreFeatures: '题目集、刷题进度、复盘笔记',
    requirement: '帮我做一个面试题库应用，分类整理题目并标记掌握度',
    keywords: ['面试', '题库', '刷题', '简历', '求职', '复盘'],
    recommended: true,
    targetRuntimeType: 'learning_list',
    resultAppName: '我的面试题库',
    resultAppId: 'app_interview',
    resultMainColor: 'blue',
    defaultFeatures: ['题目集', '刷题进度', '复盘笔记'],
    defaultAccessMode: 'desktop',
  },
  {
    id: 'word-cards',
    category: '教育',
    tag: '语言学习',
    icon: '🔤',
    name: '单词卡片本',
    description: '记录生词与复习进度',
    coreFeatures: '生词库、记忆曲线、每日学习',
    requirement: '帮我生成一个单词卡片本，支持生词库、记忆曲线和每日学习。',
    keywords: ['单词', '英语', '语言', '背词', '生词', '记忆'],
  },
  {
    id: 'mistake-book',
    category: '教育',
    tag: '考研/考公',
    icon: '📚',
    name: '错题本',
    description: '整理错题与知识点',
    coreFeatures: '错题集、知识点关联、定时复习',
    requirement: '帮我生成一个错题本，支持错题集、知识点关联和定时复习。',
    keywords: ['错题', '考研', '考公', '复习', '知识点', '刷题'],
  },
  {
    id: 'recipe-book',
    category: '生活',
    tag: '美食菜谱',
    icon: '🍳',
    name: '食谱本',
    description: '管理菜谱与购物清单',
    coreFeatures: '菜谱库、购物清单、烹饪记录',
    requirement: '帮我生成一个食谱本，支持菜谱库、购物清单和烹饪记录。',
    keywords: ['食谱', '菜谱', '做饭', '购物清单', '烹饪', '美食'],
    recommended: true,
  },
  {
    id: 'travel-planner',
    category: '生活',
    tag: '旅行攻略',
    icon: '🧳',
    name: '行程规划本',
    description: '规划行程与路线笔记',
    coreFeatures: '目的地清单、行程表、路线笔记',
    requirement: '帮我生成一个行程规划本，支持目的地清单、行程表和路线笔记。',
    keywords: ['旅行', '旅游', '行程', '攻略', '路线', '目的地'],
  },
  {
    id: 'parenting-diary',
    category: '生活',
    tag: '育儿百科',
    icon: '🍼',
    name: '育儿日记',
    description: '记录成长与提醒事项',
    coreFeatures: '成长记录、知识参考、提醒清单',
    requirement: '帮我生成一个育儿日记，支持成长记录、知识参考和提醒清单。',
    keywords: ['育儿', '宝宝', '成长', '日记', '提醒', '亲子'],
  },
]

const RECOMMENDED_TEMPLATE_IDS = [
  'stock-watchlist',
  'fitness-planner',
  'interview-bank',
  'recipe-book',
  'word-cards',
  'mistake-book',
]

export const recommendedPwaTemplates = RECOMMENDED_TEMPLATE_IDS
  .map(id => pwaTemplates.find(template => template.id === id))
  .filter((template): template is PwaTemplate => Boolean(template))

export function findMatchingPwaTemplate(text: string) {
  const normalized = text.trim().toLowerCase()
  if (!normalized) return undefined

  return pwaTemplates.find(template =>
    template.keywords.some(keyword => normalized.includes(keyword.toLowerCase())) ||
    normalized.includes(template.name.toLowerCase())
  )
}

export function getPwaTemplateById(id?: string) {
  if (!id) return undefined
  return pwaTemplates.find(template => template.id === id)
}
