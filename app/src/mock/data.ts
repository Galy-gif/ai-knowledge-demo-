// ─── Types ────────────────────────────────────────────────────────────────────

export interface User {
  id: string
  name: string
  avatar: string
  email: string
  bio: string
}

export interface KnowledgeBase {
  id: string
  name: string
  icon: string
  color: string
  fileCount: number
  updatedAt: string
  isSubscribed?: boolean
  type: 'personal' | 'subscribed'
}

export type FileType = 'pdf' | 'doc' | 'txt' | 'url' | 'image' | 'audio'

export interface KnowledgeFile {
  id: string
  kbId: string
  name: string
  type: FileType
  size: string
  pageCount?: number
  wordCount?: number
  uploadedAt: string
  summary?: string
  toc?: TocItem[]
}

export interface TocItem {
  id: string
  title: string
  level: number
  anchor: string
}

export interface Team {
  id: string
  name: string
  avatar: string
  category: '产品方法论' | '设计系统' | '增长策略' | '团队管理'
  tagline: string
  tags: string[]
  followCount: number
  kbCount: number
  contentCount: number
  description: string
  knowledgeBases: TeamKnowledgeBase[]
  isSubscribed: boolean
}

export interface TeamKnowledgeBase {
  id: string
  title: string
  description: string
  readCount: string
  dayCount: string
  updatedAt: string
  icon: string
}

export interface Note {
  id: string
  title: string
  content: string
  tags: string[]
  createdAt: string
  updatedAt: string
  backlinks: string[]
  wordCount: number
}

export interface LightApp {
  id: string
  name: string
  icon: string
  description: string
  createdAt: string
  lastOpenedAt: string
  dataSource: string
}

export interface AiConversation {
  id: string
  question: string
  answer: string
  mode: 'ai' | 'web' | 'task'
  suggestions: string[]
  sources?: WebSource[]
}

export interface WebSource {
  id: string
  title: string
  url: string
  site: string
  snippet: string
  publishedAt: string
  readTime: string
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

export const mockUser: User = {
  id: 'u1',
  name: '林小知',
  avatar: '',
  email: 'linxiaozhi@example.com',
  bio: '产品设计师 · AI 工具爱好者',
}

export const mockKnowledgeBases: KnowledgeBase[] = [
  {
    id: 'kb1',
    name: '产品资料库',
    icon: '💼',
    color: '#FF7A00',
    fileCount: 12,
    updatedAt: '2小时前',
    type: 'personal',
  },
  {
    id: 'kb2',
    name: '用户访谈库',
    icon: '🎙️',
    color: '#6366F1',
    fileCount: 8,
    updatedAt: '1天前',
    type: 'personal',
  },
  {
    id: 'kb3',
    name: '读书摘录',
    icon: '📖',
    color: '#10B981',
    fileCount: 0,
    updatedAt: '3天前',
    type: 'personal',
  },
]

export const mockSubscribedKBs: KnowledgeBase[] = [
  {
    id: 'kb4',
    name: 'ProductLab 团队',
    icon: '🏢',
    color: '#8B5CF6',
    fileCount: 324,
    updatedAt: '1小时前',
    isSubscribed: true,
    type: 'subscribed',
  },
  {
    id: 'kb5',
    name: 'Design Systems Lab',
    icon: '🎨',
    color: '#06B6D4',
    fileCount: 156,
    updatedAt: '昨天',
    isSubscribed: true,
    type: 'subscribed',
  },
]

export const mockFiles: KnowledgeFile[] = [
  // 产品资料库 (kb1)
  {
    id: 'f1',
    kbId: 'kb1',
    name: '竞品分析报告.pdf',
    type: 'pdf',
    size: '2.4MB',
    pageCount: 24,
    wordCount: 8000,
    uploadedAt: '2小时前',
    summary: '深入分析知识管理工具竞争格局，涵盖 Notion、Confluence、Perplexity 等主流产品的核心功能、定价策略与用户反馈，揭示 AI 原生检索是下一代竞争焦点。',
    toc: [
      { id: 't1', title: '一、行业现状', level: 1, anchor: 'section-1' },
      { id: 't2', title: '二、主流竞品矩阵', level: 1, anchor: 'section-2' },
      { id: 't2a', title: '核心功能对比', level: 2, anchor: 'section-2a' },
      { id: 't2b', title: '定价策略', level: 2, anchor: 'section-2b' },
      { id: 't3', title: '三、关键洞察', level: 1, anchor: 'section-3' },
      { id: 't4', title: '四、机会分析', level: 1, anchor: 'section-4' },
    ],
  },
  {
    id: 'f2',
    kbId: 'kb1',
    name: '增长策略规划.docx',
    type: 'doc',
    size: '1.1MB',
    pageCount: 12,
    wordCount: 4200,
    uploadedAt: '1天前',
    summary: '2025 年知识管理产品核心增长策略，聚焦用户获取、留存、变现三大支柱，结合渠道分析与 OKR 追踪设计。',
    toc: [
      { id: 't5', title: '增长目标与北极星指标', level: 1, anchor: 'growth-1' },
      { id: 't6', title: '用户获取渠道分析', level: 1, anchor: 'growth-2' },
      { id: 't7', title: '留存与 LTV 提升', level: 1, anchor: 'growth-3' },
      { id: 't8', title: '变现路径', level: 1, anchor: 'growth-4' },
    ],
  },
  {
    id: 'f3',
    kbId: 'kb1',
    name: '用户访谈记录.txt',
    type: 'txt',
    size: '45KB',
    wordCount: 3500,
    uploadedAt: '3天前',
    summary: '与 15 位目标用户的深度访谈记录，聚焦知识管理痛点与现有工具局限性，输出 5 个核心需求方向。',
  },
  {
    id: 'f4',
    kbId: 'kb1',
    name: 'AI产品设计原则.pdf',
    type: 'pdf',
    size: '3.2MB',
    pageCount: 36,
    wordCount: 12000,
    uploadedAt: '4天前',
    summary: 'AI 产品设计的 10 条核心原则，覆盖意图识别、渐进披露、出错恢复等关键设计模式，含 Midjourney、Perplexity 等案例。',
    toc: [
      { id: 'ta1', title: '原则一：意图优先', level: 1, anchor: 'p1' },
      { id: 'ta2', title: '原则二：渐进披露', level: 1, anchor: 'p2' },
      { id: 'ta3', title: '原则三：可信来源', level: 1, anchor: 'p3' },
    ],
  },
  {
    id: 'f5',
    kbId: 'kb1',
    name: 'Q3用户调研报告.pdf',
    type: 'pdf',
    size: '1.8MB',
    pageCount: 18,
    wordCount: 6500,
    uploadedAt: '5天前',
    summary: '对 286 名活跃用户的季度调研结果，首次发现"检索焦虑"是第一痛点，超越"内容太多不知从哪下手"跃升至榜首。',
    toc: [
      { id: 'tb1', title: '调研背景与方法', level: 1, anchor: 'r1' },
      { id: 'tb2', title: '核心痛点排名', level: 1, anchor: 'r2' },
      { id: 'tb3', title: '用户分群画像', level: 1, anchor: 'r3' },
      { id: 'tb4', title: '功能需求优先级', level: 1, anchor: 'r4' },
    ],
  },
  {
    id: 'f6',
    kbId: 'kb1',
    name: '商品分析报告v2.docx',
    type: 'doc',
    size: '890KB',
    pageCount: 8,
    wordCount: 2800,
    uploadedAt: '1周前',
    summary: '产品功能模块的商业价值分析，评估各模块对付费转化的贡献权重，为下一轮定价调整提供依据。',
  },
  {
    id: 'f7',
    kbId: 'kb1',
    name: '产品方案v2.docx',
    type: 'doc',
    size: '2.1MB',
    pageCount: 22,
    wordCount: 7600,
    uploadedAt: '1周前',
    summary: '知识库 AI 能力升级的完整产品方案，含流式检索、来源溯源、多模态输入三大子方案的技术选型与 UI 规范。',
  },
  {
    id: 'f8',
    kbId: 'kb1',
    name: 'Notion AI 功能拆解',
    type: 'url',
    size: '—',
    uploadedAt: '2周前',
    summary: '来自 ProductHunt 的深度拆解文章，分析 Notion AI 的功能矩阵、用户反馈及与竞品的差异化点。',
  },
  {
    id: 'f9',
    kbId: 'kb1',
    name: '用户访谈录音-05月.m4a',
    type: 'audio',
    size: '24MB',
    uploadedAt: '2周前',
    summary: 'AI 自动转写完成。访谈对象：产品经理（5年），核心观点：移动端知识管理工具最大缺口在于"随时捕捉+事后整理"的断层。',
  },
  // 用户访谈库 (kb2)
  {
    id: 'f10',
    kbId: 'kb2',
    name: '访谈纪要-张磊.pdf',
    type: 'pdf',
    size: '560KB',
    pageCount: 6,
    uploadedAt: '2天前',
    summary: '工程师背景用户，强调知识检索的"精准召回"需求，对向量检索结果的可解释性有明确诉求。',
  },
  {
    id: 'f11',
    kbId: 'kb2',
    name: '访谈纪要-李晓.pdf',
    type: 'pdf',
    size: '480KB',
    pageCount: 5,
    uploadedAt: '3天前',
    summary: '设计师用户，最在意视觉化组织方式，希望知识库支持"思维导图视图"和"卡片看板"两种浏览模式。',
  },
  {
    id: 'f12',
    kbId: 'kb2',
    name: '问卷数据汇总.docx',
    type: 'doc',
    size: '1.3MB',
    pageCount: 14,
    uploadedAt: '4天前',
    summary: '186 份问卷的量化数据汇总，NPS 评分 42，核心满意度短板：移动端体验（3.1/5）和批量导入效率（2.9/5）。',
  },
  {
    id: 'f13',
    kbId: 'kb2',
    name: '访谈录音-王强.m4a',
    type: 'audio',
    size: '18MB',
    uploadedAt: '5天前',
    summary: 'AI 转写完成。运营负责人，使用知识库协同管理团队 SOP，痛点在于多人协作时的版本冲突与权限混乱。',
  },
  // ProductLab 团队订阅库 (kb4)
  {
    id: 'f_pl1',
    kbId: 'kb4',
    name: '需求拆解方法论.pdf',
    type: 'pdf',
    size: '1.2MB',
    pageCount: 15,
    wordCount: 4800,
    uploadedAt: '2天前',
    summary: '结构化拆解模糊需求的方法论，包含用户故事地图、优先级矩阵与验证清单，适用于 0→1 产品规划阶段。',
    toc: [
      { id: 'pl1a', title: '用户故事地图', level: 1, anchor: 'pl-1' },
      { id: 'pl1b', title: '优先级矩阵', level: 1, anchor: 'pl-2' },
      { id: 'pl1c', title: '需求验证清单', level: 1, anchor: 'pl-3' },
    ],
  },
  {
    id: 'f_pl2',
    kbId: 'kb4',
    name: '上线复盘模板 v3.docx',
    type: 'doc',
    size: '890KB',
    pageCount: 8,
    wordCount: 3200,
    uploadedAt: '5天前',
    summary: 'ProductLab 标准复盘模板，覆盖数据分析、问题归因、改进 Action 三大模块，已在 20+ 次复盘中验证有效。',
  },
  {
    id: 'f_pl3',
    kbId: 'kb4',
    name: '增长案例拆解合集.pdf',
    type: 'pdf',
    size: '3.4MB',
    pageCount: 48,
    wordCount: 16000,
    uploadedAt: '1周前',
    summary: '12个增长实验案例深度拆解，涵盖 SEO、裂变、Onboarding 优化等场景，提炼可复用的增长杠杆模型。',
  },
  {
    id: 'f_pl4',
    kbId: 'kb4',
    name: 'AI 产品 PMF 评估框架',
    type: 'url',
    size: '—',
    uploadedAt: '2周前',
    summary: '基于 ProductLab 内部实践总结的 AI 产品 PMF 评估框架，包含 8 个关键信号指标与评分模型。',
  },
  // Design Systems Lab 订阅库 (kb5)
  {
    id: 'f_ds1',
    kbId: 'kb5',
    name: '组件设计规范 2026.pdf',
    type: 'pdf',
    size: '4.1MB',
    pageCount: 72,
    wordCount: 18000,
    uploadedAt: '3天前',
    summary: '完整的组件库设计规范，涵盖 Button、Input、Card、Modal 等 40+ 核心组件的交互规范与代码对照表。',
    toc: [
      { id: 'ds1a', title: '基础组件', level: 1, anchor: 'ds-1' },
      { id: 'ds1b', title: '复合组件', level: 1, anchor: 'ds-2' },
      { id: 'ds1c', title: '动效规范', level: 1, anchor: 'ds-3' },
    ],
  },
  {
    id: 'f_ds2',
    kbId: 'kb5',
    name: '色彩与主题系统.docx',
    type: 'doc',
    size: '1.6MB',
    pageCount: 20,
    wordCount: 5200,
    uploadedAt: '1周前',
    summary: '设计 Token 与品牌色系统规范，定义 Light/Dark 双主题下的颜色变量映射规则，适配 Figma 与工程实现。',
  },
  {
    id: 'f_ds3',
    kbId: 'kb5',
    name: '设计评审检查清单.txt',
    type: 'txt',
    size: '28KB',
    wordCount: 1800,
    uploadedAt: '2周前',
    summary: '30项设计评审必查清单，覆盖视觉一致性、交互可达性、边界状态处理、响应式适配等维度。',
  },
]

export const mockTeams: Team[] = [
  {
    id: 'team1',
    name: 'ProductLab 团队',
    avatar: 'PL',
    category: '产品方法论',
    tagline: '专注 AI 产品方法与实践',
    tags: ['AI产品', '方法论', '案例拆解'],
    followCount: 12800,
    kbCount: 3,
    contentCount: 324,
    description: 'ProductLab 专注 AI 产品方法，需求拆解、增长实验与上线复盘。帮助产品团队建立可复用的方法论体系。',
    isSubscribed: false,
    knowledgeBases: [
      {
        id: 'tkb1',
        title: '需求拆解方法',
        description: '如何把模糊的用户需求转成清晰方案',
        readCount: '2.4k',
        dayCount: '18篇',
        updatedAt: '12分钟前',
        icon: '🔍',
      },
      {
        id: 'tkb2',
        title: '上线复盘模板',
        description: '从复盘流程转化成更好的迭代基础',
        readCount: '3.9k',
        dayCount: '24篇',
        updatedAt: '1天前',
        icon: '📋',
      },
      {
        id: 'tkb3',
        title: '增长案例拆解',
        description: '可复用的增长实验方案与案例分析',
        readCount: '4.7k',
        dayCount: '32篇',
        updatedAt: '3天前',
        icon: '📈',
      },
    ],
  },
  {
    id: 'team2',
    name: 'Design Systems Lab',
    avatar: 'DS',
    category: '设计系统',
    tagline: '设计系统与组件库深度研究',
    tags: ['设计系统', 'UI/UX', '组件库'],
    followCount: 8600,
    kbCount: 2,
    contentCount: 156,
    description: '专注设计系统建设、组件库规范与跨团队设计一致性实践。',
    isSubscribed: false,
    knowledgeBases: [],
  },
  {
    id: 'team3',
    name: 'GrowthOps Lab',
    avatar: 'GO',
    category: '增长策略',
    tagline: '增长实验、数据看板与留存方法',
    tags: ['增长', '数据分析', '留存'],
    followCount: 7200,
    kbCount: 2,
    contentCount: 98,
    description: 'GrowthOps Lab 聚焦增长策略与实验复盘，沉淀获客、转化、留存相关的可复用方法。',
    isSubscribed: false,
    knowledgeBases: [
      {
        id: 'tkb4',
        title: '增长实验手册',
        description: '从假设、埋点到复盘的完整实验流程',
        readCount: '1.8k',
        dayCount: '16篇',
        updatedAt: '2小时前',
        icon: '📈',
      },
      {
        id: 'tkb5',
        title: '留存分析模板',
        description: '按用户分层拆解留存下降原因',
        readCount: '1.1k',
        dayCount: '9篇',
        updatedAt: '昨天',
        icon: '📊',
      },
    ],
  },
  {
    id: 'team4',
    name: 'TeamFlow 研究所',
    avatar: 'TF',
    category: '团队管理',
    tagline: '团队协作、知识治理与 SOP 体系',
    tags: ['团队管理', 'SOP', '协作'],
    followCount: 5400,
    kbCount: 2,
    contentCount: 76,
    description: 'TeamFlow 研究所关注团队知识协作、流程治理和跨职能沟通，让知识库真正变成团队工作台。',
    isSubscribed: false,
    knowledgeBases: [
      {
        id: 'tkb6',
        title: '团队知识治理',
        description: '建立 Owner、更新节奏和归档规则',
        readCount: '960',
        dayCount: '12篇',
        updatedAt: '3小时前',
        icon: '🧭',
      },
      {
        id: 'tkb7',
        title: 'SOP 共创模板',
        description: '把口头经验沉淀成可执行流程',
        readCount: '1.4k',
        dayCount: '18篇',
        updatedAt: '2天前',
        icon: '📋',
      },
    ],
  },
]

export const mockNotes: Note[] = [
  {
    id: 'n1',
    title: 'AI 结果页来源卡片重构',
    content: `## 背景

当前 AI 回答页面混用了知识库来源和网页来源两套卡片样式，用户难以判断信息出处，在多轮追问场景中尤为明显。产品目标是通过统一来源展示逻辑，强化信息可追溯感，提升用户对 AI 回答的信任度。

## 核心洞察

用户对 AI 回答的信任建立在"能看见出处"上。调研数据显示，展示来源后用户对回答的采信率提升 34%，追问率下降 18%——说明清晰的来源减少了用户的不确定感，而非鼓励追问。

来源的展示时机同样关键：在答案渲染完成后才出现来源卡片，会让用户感觉信息是"事后补充"的，降低可信度。应与正文同步渐入。

## 方案

将知识库来源与网页来源统一为"来源卡片"组件，在回答正文末尾以小卡片形式呈现，支持点击跳转原文。具体设计要点：

- **样式统一**：两类来源使用同一卡片模板，用图标区分来源类型（📁 知识库 / 🌐 网页）
- **同步渐入**：在流式输出结束后 200ms 延迟滑入，避免"后补"感
- **引用高亮**：正文中被引用的句子加橙黄色底线，点击可展开对应来源卡片

## 风险与缓解

最主要的风险是来源数量过多时卡片区域过长，挤压正文阅读体验。缓解方案：默认折叠超过 3 条的来源，以"查看全部 N 条来源"入口展开；单条来源卡片高度控制在 52px 以内，保持紧凑。

## 下一步

- [ ] 完成来源卡片组件设计稿评审（5月15日）
- [ ] 与工程侧对齐流式输出 + 来源注入的时序方案
- [ ] 在 Q04 页面接入真实来源数据做可用性测试`,
    tags: ['AI产品', '设计'],
    createdAt: '2小时前',
    updatedAt: '2小时前',
    backlinks: ['n2'],
    wordCount: 680,
  },
  {
    id: 'n2',
    title: '上下文标签在搜索链路中的价值',
    content: `## 核心问题\n\n通过标签明确搜索范围，首答命中率提升并减少重复提问。\n\n## 数据支撑\n\n- 有标签的搜索首答满意率 +23%\n- 用户追问次数减少 1.8 次/会话`,
    tags: ['学习笔记', 'AI产品'],
    createdAt: '昨天',
    updatedAt: '昨天',
    backlinks: ['n1'],
    wordCount: 280,
  },
]

export const mockApps: LightApp[] = [
  {
    id: 'app1',
    name: '资料速查工具',
    icon: '📊',
    description: '快速检索工作资料库中的核心数据',
    createdAt: '3天前',
    lastOpenedAt: '2小时前',
    dataSource: '产品资料库',
  },
  {
    id: 'app2',
    name: '竞品动态监控',
    icon: '🔍',
    description: '持续追踪竞品更新，自动生成摘要',
    createdAt: '1周前',
    lastOpenedAt: '昨天',
    dataSource: '竞品分析报告',
  },
]

export const mockAiSuggestions = [
  '如何在知识库中快速找到历史决策？',
  '帮我总结今天工作资料里的关键信息',
  '分析竞品报告里最值得关注的3个点',
  '帮我把这篇文章整理成结构化笔记',
  'AI 知识管理工具的核心竞争力是什么？',
]

export const mockWebResults: WebSource[] = [
  {
    id: 'w1',
    title: '搜索问答产品的对话保持策略',
    url: 'https://yourportal.ai/articles/dialog-retention',
    site: 'yourportal.ai',
    snippet: '总结 Session 保留、来源映射、追问聚焦等关键设计点，帮助提升追问闭环体验与用户粘性。',
    publishedAt: '2026年4月30日',
    readTime: '8分钟',
  },
  {
    id: 'w2',
    title: 'AI 知识库产品的内容召回优化实践',
    url: 'https://uxnotes.cn/kb-recall',
    site: 'uxnotes.cn',
    snippet: '向量检索与关键词混合策略的工程实现，如何在召回率和精准率之间找到平衡点。',
    publishedAt: '2026年4月22日',
    readTime: '12分钟',
  },
  {
    id: 'w3',
    title: '从 Notion AI 到 Perplexity：知识管理的范式演变',
    url: 'https://productthinking.com/km-evolution',
    site: 'productthinking.com',
    snippet: '梳理过去3年知识管理赛道的产品演进路径，AI 嵌入方式从辅助写作到主动检索的转变。',
    publishedAt: '2026年3月15日',
    readTime: '15分钟',
  },
]
