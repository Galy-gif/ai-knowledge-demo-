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
  managementMode: KnowledgeManagementMode | null
  isSubscribed?: boolean
  isSystem?: boolean
  locked?: boolean
  type: 'personal' | 'subscribed'
}

export type KnowledgeManagementMode = 'project' | 'second_brain' | 'output' | 'idea' | 'ai' | 'free'

export type FileType =
  | 'pdf'
  | 'doc'
  | 'txt'
  | 'url'
  | 'image'
  | 'audio'
  | 'note'
  | 'pdf_excerpt'
  | 'doc_excerpt'
  | 'web_excerpt'
  | 'ai_excerpt'
  | 'note_excerpt'

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
  content?: string
  workflowStage?: string
  aiTopic?: string
  aiConfidence?: 'high' | 'medium' | 'low'
  aiSuggestion?: string
  tags?: string[]
  metadata?: Record<string, unknown>
  createdAt?: string
  updatedAt?: string
  toc?: TocItem[]
}

export type RecentActivity = 'updated' | 'visited'

export interface RecentItem {
  id: string
  fileId: string
  title: string
  kbId: string
  kbName: string
  type: FileType
  time: string
  activity: RecentActivity
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

export interface DiscoverKb {
  id: string
  name: string
  description: string
  coverEmoji: string
  coverColor: string
  author: { name: string; type: 'team' | 'personal' }
  contentCount: number
  subscriberCount: number
  category: string
  isSubscribed: boolean
  section: 'hot' | 'recommended'
  inRecommend?: boolean
}

export interface DiscoverKbContentItem {
  id: string
  title: string
  desc: string
  time: string
  type: string
}

export type RuntimeType = 'learning_list' | 'data_dashboard' | 'daily_tracker'

export interface LightApp {
  id: string
  name: string
  icon: string
  description: string
  templateId?: string
  createdAt: string
  lastOpenedAt: string
  lastUsedAt: string
  dataSource: string
  runtimeType?: RuntimeType
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

export const QUICK_NOTES_KB_ID = 'kb_quick_notes'

const quickNoteFiles: KnowledgeFile[] = [
  {
    id: 'n1',
    kbId: QUICK_NOTES_KB_ID,
    name: 'AI 结果页来源卡片重构',
    type: 'note',
    size: '680字',
    wordCount: 680,
    uploadedAt: '2小时前',
    createdAt: '2小时前',
    updatedAt: '2小时前',
    tags: ['AI产品', '设计'],
    summary: '统一 AI 回答页的来源展示逻辑，强化信息可追溯感，提升用户对 AI 回答的信任度。',
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
  },
  {
    id: 'n2',
    kbId: QUICK_NOTES_KB_ID,
    name: '上下文标签在搜索链路中的价值',
    type: 'note',
    size: '280字',
    wordCount: 280,
    uploadedAt: '昨天',
    createdAt: '昨天',
    updatedAt: '昨天',
    tags: ['学习笔记', 'AI产品'],
    summary: '通过标签明确搜索范围，首答命中率提升并减少重复提问。',
    content: `## 核心问题

通过标签明确搜索范围，首答命中率提升并减少重复提问。

## 数据支撑

- 有标签的搜索首答满意率 +23%
- 用户追问次数减少 1.8 次/会话`,
  },
  {
    id: 'n3',
    kbId: QUICK_NOTES_KB_ID,
    name: 'AI 追问整理',
    type: 'note',
    size: '460字',
    wordCount: 460,
    uploadedAt: '刚刚',
    createdAt: '刚刚',
    updatedAt: '刚刚',
    tags: ['速记', 'AI问答'],
    summary: '从 AI 多轮追问中提炼出的知识库运营指标、内容更新节奏和后续行动建议。',
    content: `## AI 追问整理

围绕知识库运营效果，当前可以优先关注三个指标：

- 内容使用率：每篇内容在近 30 天内被阅读、引用和追问的次数
- 检索满意率：用户首次提问是否找到可用答案
- 更新健康度：过期内容占比和核心文档更新时间

## 下一步

把这些指标放进周报模板里，并为每个知识库指定内容 Owner。`,
  },
]

const freeMiscFiles: KnowledgeFile[] = [
  { id: 'free1', kbId: 'kb_free_misc', name: '临时想法：移动端收藏入口', type: 'note', size: '260字', wordCount: 260, uploadedAt: '刚刚', summary: '随手记录移动端收藏入口应该更靠近输入区。' },
  { id: 'free2', kbId: 'kb_free_misc', name: 'AI 搜索结果页截图.png', type: 'image', size: '1.2MB', uploadedAt: '10分钟前', summary: '一组搜索结果页截图，用于后续视觉参考。' },
  { id: 'free3', kbId: 'kb_free_misc', name: 'Linear 工作流文章', type: 'url', size: '—', uploadedAt: '30分钟前', summary: '关于团队 issue 流转和状态设计的文章。' },
  { id: 'free4', kbId: 'kb_free_misc', name: '会议录音片段.m4a', type: 'audio', size: '8MB', uploadedAt: '1小时前', summary: '下午讨论导入流程时的录音片段。' },
  { id: 'free5', kbId: 'kb_free_misc', name: '桌面端信息架构草稿.pdf', type: 'pdf', size: '2.3MB', pageCount: 18, wordCount: 5200, uploadedAt: '2小时前', summary: '桌面端信息架构的早期草稿。' },
  { id: 'free6', kbId: 'kb_free_misc', name: '周会待办清单.txt', type: 'txt', size: '12KB', wordCount: 860, uploadedAt: '今天 11:20', summary: '周会产生的待办项，未做分类。' },
  { id: 'free7', kbId: 'kb_free_misc', name: '浏览器侧边栏灵感', type: 'note', size: '420字', wordCount: 420, uploadedAt: '今天 09:40', summary: '侧边栏可以承载当前网页摘要和知识库入口。' },
  { id: 'free8', kbId: 'kb_free_misc', name: 'Notion 模板页面', type: 'url', size: '—', uploadedAt: '昨天', summary: '一个可参考的模板页面。' },
  { id: 'free9', kbId: 'kb_free_misc', name: '用户反馈截图 0513.png', type: 'image', size: '780KB', uploadedAt: '昨天', summary: '用户在群里反馈空态引导太强的截图。' },
  { id: 'free10', kbId: 'kb_free_misc', name: '产品命名备忘', type: 'note', size: '300字', wordCount: 300, uploadedAt: '昨天', summary: '关于自由收纳、我的速记等命名的备忘。' },
  { id: 'free11', kbId: 'kb_free_misc', name: '竞品首页布局.docx', type: 'doc', size: '640KB', pageCount: 6, wordCount: 2100, uploadedAt: '2天前', summary: '几个竞品首页布局和首屏文案对比。' },
  { id: 'free12', kbId: 'kb_free_misc', name: '导入来源 checklist.txt', type: 'txt', size: '9KB', wordCount: 720, uploadedAt: '2天前', summary: '粘贴链接、最近浏览、跨端导入等来源清单。' },
  { id: 'free13', kbId: 'kb_free_misc', name: 'Claude 对话记录', type: 'url', size: '—', uploadedAt: '3天前', summary: '一次关于知识库分类逻辑的对话记录。' },
  { id: 'free14', kbId: 'kb_free_misc', name: '设计评审录音.m4a', type: 'audio', size: '18MB', uploadedAt: '3天前', summary: '设计评审会上关于管理方式入口的讨论。' },
  { id: 'free15', kbId: 'kb_free_misc', name: '状态机草图.png', type: 'image', size: '920KB', uploadedAt: '4天前', summary: '滑动、长按、多选的状态机手绘图。' },
  { id: 'free16', kbId: 'kb_free_misc', name: '保存到库流程.pdf', type: 'pdf', size: '1.6MB', pageCount: 12, wordCount: 3600, uploadedAt: '4天前', summary: '统一保存到库流程说明。' },
  { id: 'free17', kbId: 'kb_free_misc', name: '灵感：空状态应该更安静', type: 'note', size: '180字', wordCount: 180, uploadedAt: '5天前', summary: '空状态不要催促用户做决定。' },
  { id: 'free18', kbId: 'kb_free_misc', name: '移动端底栏参考', type: 'url', size: '—', uploadedAt: '5天前', summary: '几个移动端底部输入条和 tab 的参考。' },
  { id: 'free19', kbId: 'kb_free_misc', name: 'README 发布说明草稿.docx', type: 'doc', size: '430KB', pageCount: 4, wordCount: 1600, uploadedAt: '1周前', summary: '公开部署前的 README 文案草稿。' },
  { id: 'free20', kbId: 'kb_free_misc', name: '临时素材包记录.txt', type: 'txt', size: '15KB', wordCount: 980, uploadedAt: '1周前', summary: '尚未决定归属的一批素材记录。' },
]

export const mockKnowledgeBases: KnowledgeBase[] = [
  {
    id: 'kb_unconfigured',
    name: '未命名知识库',
    icon: 'inbox',
    color: '#9CA3AF',
    fileCount: 0,
    updatedAt: '刚刚',
    managementMode: null,
    type: 'personal',
  },
  {
    id: 'kb1',
    name: '产品资料库',
    icon: '💼',
    color: '#FF7A00',
    fileCount: 14,
    updatedAt: '2小时前',
    managementMode: 'ai',
    type: 'personal',
  },
  {
    id: 'kb2',
    name: '用户访谈库',
    icon: '🎙️',
    color: '#6366F1',
    fileCount: 9,
    updatedAt: '1天前',
    managementMode: 'output',
    type: 'personal',
  },
  {
    id: 'kb3',
    name: '读书摘录',
    icon: '📖',
    color: '#10B981',
    fileCount: 1,
    updatedAt: '3天前',
    managementMode: 'idea',
    type: 'personal',
  },
  {
    id: 'kb_project_browser',
    name: 'AI 浏览器项目库',
    icon: '🧭',
    color: '#FF7A00',
    fileCount: 12,
    updatedAt: '刚刚',
    managementMode: 'project',
    type: 'personal',
  },
  {
    id: 'kb_output_review',
    name: '季度产品复盘',
    icon: '📊',
    color: '#FF7A00',
    fileCount: 11,
    updatedAt: '今天',
    managementMode: 'output',
    type: 'personal',
  },
  {
    id: QUICK_NOTES_KB_ID,
    name: '我的速记',
    icon: 'pen-line',
    color: '#FF7A00',
    fileCount: quickNoteFiles.length,
    updatedAt: '刚刚',
    managementMode: 'idea',
    type: 'personal',
    isSystem: true,
    locked: true,
  },
  {
    id: 'kb_free_misc',
    name: '杂物收藏',
    icon: '📦',
    color: '#FF7A00',
    fileCount: freeMiscFiles.length,
    updatedAt: '刚刚',
    managementMode: 'second_brain',
    type: 'personal',
  },
]

export const mockSubscribedKBs: KnowledgeBase[] = [
  {
    id: 'kb_travel_food',
    name: '旅行美食圈',
    icon: '🌏',
    color: '#14B8A6',
    fileCount: 256,
    updatedAt: '2小时前',
    managementMode: null,
    isSubscribed: true,
    type: 'subscribed',
  },
  {
    id: 'kb_pm_interview',
    name: 'PM 必备：用户访谈方法论',
    icon: '💼',
    color: '#3B82F6',
    fileCount: 89,
    updatedAt: '1小时前',
    managementMode: null,
    isSubscribed: true,
    type: 'subscribed',
  },
  {
    id: 'kb_design_system',
    name: '设计系统实战',
    icon: '🎨',
    color: '#EC4899',
    fileCount: 124,
    updatedAt: '昨天',
    managementMode: null,
    isSubscribed: true,
    type: 'subscribed',
  },
]

export const mockFiles: KnowledgeFile[] = [
  ...quickNoteFiles,
  ...freeMiscFiles,
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
  {
    id: 'f14',
    kbId: 'kb1',
    name: 'YourPortal Research 报告',
    type: 'url',
    size: '—',
    uploadedAt: '1小时前',
    summary: '网页研究报告，梳理 AI 知识管理产品在搜索、问答与来源追踪上的体验趋势。',
  },
  {
    id: 'f15',
    kbId: 'kb1',
    name: '周会纪要 05/11.m4a',
    type: 'audio',
    size: '16MB',
    uploadedAt: '今天',
    summary: '周会录音导入，重点包括知识库最近入口、多选入库和公开演示前的交互修正。',
  },
  {
    id: 'f18',
    kbId: 'kb1',
    name: '产品架构图.png',
    type: 'image',
    size: '1.4MB',
    uploadedAt: '4小时前',
    summary: '知识库、问答、轻应用三大模块的信息架构图，标注了统一保存到库的核心路径。',
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
  {
    id: 'f16',
    kbId: 'kb2',
    name: '用户访谈 02 录音.m4a',
    type: 'audio',
    size: '21MB',
    uploadedAt: '昨天',
    summary: '第二轮移动端用户访谈录音，已完成转写，围绕知识库选择反馈和跨知识库追问展开。',
  },
  {
    id: 'f17',
    kbId: 'kb2',
    name: '用户调研问卷.docx',
    type: 'doc',
    size: '720KB',
    pageCount: 9,
    wordCount: 2600,
    uploadedAt: '2天前',
    summary: '用户调研问卷题目与答卷结构，覆盖知识库创建、内容导入、AI 追问三个核心场景。',
  },
  // 读书摘录 (kb3)
  {
    id: 'f_read1',
    kbId: 'kb3',
    name: '《认知觉醒》读书笔记',
    type: 'note',
    size: '6.8KB',
    wordCount: 2100,
    uploadedAt: '3天前',
    summary: '关于注意力、反馈回路和主动学习的摘录，整理为可复用的产品学习笔记。',
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
  {
    id: 'f_pl5',
    kbId: 'kb4',
    name: 'ProductLab 增长方法论',
    type: 'url',
    size: '—',
    wordCount: 9800,
    uploadedAt: '今天 09:30',
    summary: 'ProductLab 团队沉淀的增长方法论，覆盖实验假设、指标拆解、渠道验证和复盘模板。',
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

export const mockRecentItems: RecentItem[] = [
  {
    id: 'recent1',
    fileId: 'f1',
    title: '竞品分析报告.pdf',
    kbId: 'kb1',
    kbName: '产品资料库',
    type: 'pdf',
    time: '2 小时前',
    activity: 'visited',
  },
  {
    id: 'recent2',
    fileId: 'n3',
    title: 'AI 追问整理',
    kbId: QUICK_NOTES_KB_ID,
    kbName: '我的速记',
    type: 'note',
    time: '刚刚',
    activity: 'updated',
  },
  {
    id: 'recent3',
    fileId: 'f16',
    title: '用户访谈 02 录音',
    kbId: 'kb2',
    kbName: '用户访谈库',
    type: 'audio',
    time: '昨天',
    activity: 'visited',
  },
  {
    id: 'recent4',
    fileId: 'f_pl5',
    title: 'ProductLab 增长方法论',
    kbId: 'kb4',
    kbName: 'ProductLab 团队',
    type: 'url',
    time: '今天 09:30',
    activity: 'updated',
  },
  {
    id: 'recent5',
    fileId: 'f_read1',
    title: '《认知觉醒》读书笔记',
    kbId: 'kb3',
    kbName: '读书摘录',
    type: 'note',
    time: '3 天前',
    activity: 'visited',
  },
  {
    id: 'recent6',
    fileId: 'f14',
    title: 'YourPortal 行业报告',
    kbId: 'kb1',
    kbName: '产品资料库',
    type: 'url',
    time: '1 小时前',
    activity: 'updated',
  },
  {
    id: 'recent7',
    fileId: 'f15',
    title: '周会纪要 05/11',
    kbId: 'kb1',
    kbName: '产品资料库',
    type: 'audio',
    time: '今天 14:00',
    activity: 'updated',
  },
  {
    id: 'recent8',
    fileId: 'n2',
    title: '上下文标签策略',
    kbId: QUICK_NOTES_KB_ID,
    kbName: '我的速记',
    type: 'note',
    time: '昨天',
    activity: 'visited',
  },
  {
    id: 'recent9',
    fileId: 'f17',
    title: '用户调研问卷.docx',
    kbId: 'kb2',
    kbName: '用户访谈库',
    type: 'doc',
    time: '2 天前',
    activity: 'visited',
  },
  {
    id: 'recent10',
    fileId: 'f18',
    title: '产品架构图.png',
    kbId: 'kb1',
    kbName: '产品资料库',
    type: 'image',
    time: '4 小时前',
    activity: 'updated',
  },
  {
    id: 'recent11',
    fileId: 'f2',
    title: '增长策略规划.docx',
    kbId: 'kb1',
    kbName: '产品资料库',
    type: 'doc',
    time: '今天 11:20',
    activity: 'updated',
  },
  {
    id: 'recent12',
    fileId: 'f3',
    title: '用户访谈记录.txt',
    kbId: 'kb1',
    kbName: '产品资料库',
    type: 'txt',
    time: '4 小时前',
    activity: 'visited',
  },
  {
    id: 'recent13',
    fileId: 'f4',
    title: 'AI 产品设计原则.pdf',
    kbId: 'kb1',
    kbName: '产品资料库',
    type: 'pdf',
    time: '6 小时前',
    activity: 'updated',
  },
  {
    id: 'recent14',
    fileId: 'f10',
    title: '访谈纪要-张磊.pdf',
    kbId: 'kb2',
    kbName: '用户访谈库',
    type: 'pdf',
    time: '昨天 18:30',
    activity: 'visited',
  },
  {
    id: 'recent15',
    fileId: 'f12',
    title: '问卷数据汇总.docx',
    kbId: 'kb2',
    kbName: '用户访谈库',
    type: 'doc',
    time: '今天 10:10',
    activity: 'updated',
  },
  {
    id: 'recent16',
    fileId: 'f13',
    title: '访谈录音-王强.m4a',
    kbId: 'kb2',
    kbName: '用户访谈库',
    type: 'audio',
    time: '2 天前',
    activity: 'visited',
  },
  {
    id: 'recent17',
    fileId: 'f_pl1',
    title: '需求拆解方法论.pdf',
    kbId: 'kb4',
    kbName: 'ProductLab 团队',
    type: 'pdf',
    time: '今天 08:45',
    activity: 'updated',
  },
  {
    id: 'recent18',
    fileId: 'f_pl2',
    title: '上线复盘模板 v3.docx',
    kbId: 'kb4',
    kbName: 'ProductLab 团队',
    type: 'doc',
    time: '1 天前',
    activity: 'visited',
  },
  {
    id: 'recent19',
    fileId: 'f_ds1',
    title: '组件设计规范 2026.pdf',
    kbId: 'kb5',
    kbName: 'Design Systems Lab',
    type: 'pdf',
    time: '3 天前',
    activity: 'updated',
  },
  {
    id: 'recent20',
    fileId: 'f_ds3',
    title: '设计评审检查清单.txt',
    kbId: 'kb5',
    kbName: 'Design Systems Lab',
    type: 'txt',
    time: '2 周前',
    activity: 'visited',
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

export const mockDiscoverKbs: DiscoverKb[] = [
  // ─── 推荐 tab 默认 6 张（inRecommend: true）────────────────────────────────
  {
    id: 'kb_japan_travel',
    name: '日本旅行实战手册',
    description: '关东+关西+九州 30 天行程模板与避坑指南',
    coverEmoji: '✈️',
    coverColor: '#CCFBF1',
    author: { name: '旅行美食圈', type: 'team' },
    contentCount: 256,
    subscriberCount: 12800,
    category: '生活',
    isSubscribed: false,
    section: 'hot',
    inRecommend: true,
  },
  {
    id: 'kb_pm_interview',
    name: 'PM 必备：用户访谈方法论',
    description: '从访谈大纲到洞察沉淀的完整工作流',
    coverEmoji: '💼',
    coverColor: '#DBEAFE',
    author: { name: 'ProductLab 团队', type: 'team' },
    contentCount: 89,
    subscriberCount: 5200,
    category: '职场',
    isSubscribed: true,
    section: 'hot',
    inRecommend: true,
  },
  {
    id: 'kb_stock_notes',
    name: 'A 股投资笔记',
    description: '每周财报分析 + 行业拐点判断',
    coverEmoji: '📈',
    coverColor: '#D1FAE5',
    author: { name: '老张说投资', type: 'personal' },
    contentCount: 312,
    subscriberCount: 8700,
    category: '财经',
    isSubscribed: false,
    section: 'hot',
    inRecommend: true,
  },
  {
    id: 'kb_browser_trend',
    name: 'AI 浏览器趋势观察',
    description: '每周追踪 Arc、Dia 等新一代浏览器动向',
    coverEmoji: '🌐',
    coverColor: '#EDE9FE',
    author: { name: 'Dialog 设计周报', type: 'team' },
    contentCount: 67,
    subscriberCount: 3400,
    category: '科技',
    isSubscribed: false,
    section: 'hot',
    inRecommend: true,
  },
  {
    id: 'kb_design_system',
    name: '设计系统实战',
    description: 'Notion、Linear、Vercel 的设计语言拆解',
    coverEmoji: '🎨',
    coverColor: '#FCE7F3',
    author: { name: 'Design Systems Lab', type: 'team' },
    contentCount: 124,
    subscriberCount: 6100,
    category: '职场',
    isSubscribed: true,
    section: 'recommended',
    inRecommend: true,
  },
  {
    id: 'kb_diet_recipe',
    name: '减脂期食谱与营养',
    description: '100+ 高蛋白低卡食谱与采购清单',
    coverEmoji: '🥗',
    coverColor: '#D1FAE5',
    author: { name: '健身教练老王', type: 'personal' },
    contentCount: 78,
    subscriberCount: 4500,
    category: '健康',
    isSubscribed: false,
    section: 'hot',
    inRecommend: true,
  },

  // ─── 科技 ─────────────────────────────────────────────────────────────────
  {
    id: 'kb_llm_notes',
    name: '大模型实战笔记',
    description: 'GPT/Claude/Gemini 真实使用对比与提示词技巧',
    coverEmoji: '🧠',
    coverColor: '#DBEAFE',
    author: { name: '硅基生命研究所', type: 'team' },
    contentCount: 142,
    subscriberCount: 18600,
    category: '科技',
    isSubscribed: false,
    section: 'hot',
  },
  {
    id: 'kb_ai_agent',
    name: 'AI Agent 产品分析',
    description: 'Manus、Devin、Operator 等 Agent 产品深度拆解',
    coverEmoji: '🤖',
    coverColor: '#CCFBF1',
    author: { name: 'AI 周刊', type: 'personal' },
    contentCount: 89,
    subscriberCount: 9200,
    category: '科技',
    isSubscribed: false,
    section: 'hot',
  },
  {
    id: 'kb_frontend',
    name: '前端开发实践',
    description: 'React 18+/Vue 3+/Svelte 实战经验沉淀',
    coverEmoji: '💻',
    coverColor: '#F3F4F6',
    author: { name: '前端早早聊', type: 'team' },
    contentCount: 234,
    subscriberCount: 22100,
    category: '科技',
    isSubscribed: false,
    section: 'recommended',
  },
  {
    id: 'kb_indie_dev',
    name: '独立开发者周报',
    description: '每周精选独立开发项目与营收数据',
    coverEmoji: '🚀',
    coverColor: '#FFF1E6',
    author: { name: 'IndieHackers 中文版', type: 'personal' },
    contentCount: 156,
    subscriberCount: 11300,
    category: '科技',
    isSubscribed: false,
    section: 'recommended',
  },
  {
    id: 'kb_dev_tools',
    name: '程序员效率工具',
    description: 'Cursor、Raycast、Obsidian 等工具的深度使用',
    coverEmoji: '🛠️',
    coverColor: '#FEF3C7',
    author: { name: '效率工具控', type: 'personal' },
    contentCount: 98,
    subscriberCount: 7800,
    category: '科技',
    isSubscribed: false,
    section: 'recommended',
  },

  // ─── 职场 ─────────────────────────────────────────────────────────────────
  {
    id: 'kb_prd_templates',
    name: '大厂 PRD 模板库',
    description: '阿里腾讯字节真实 PRD 拆解 + 模板',
    coverEmoji: '📋',
    coverColor: '#EDE9FE',
    author: { name: '产品笔记本', type: 'team' },
    contentCount: 145,
    subscriberCount: 14700,
    category: '职场',
    isSubscribed: false,
    section: 'hot',
  },
  {
    id: 'kb_bytedance_docs',
    name: '字节跳动复盘文档合集',
    description: '字节内部公开的产品/运营复盘案例',
    coverEmoji: '📊',
    coverColor: '#FEE2E2',
    author: { name: '字节文档圈', type: 'personal' },
    contentCount: 76,
    subscriberCount: 8300,
    category: '职场',
    isSubscribed: false,
    section: 'hot',
  },
  {
    id: 'kb_okr',
    name: 'OKR 实战案例',
    description: '从初创到上市公司的 OKR 落地经验',
    coverEmoji: '🎯',
    coverColor: '#D1FAE5',
    author: { name: '管理三明治', type: 'team' },
    contentCount: 62,
    subscriberCount: 4100,
    category: '职场',
    isSubscribed: false,
    section: 'recommended',
  },
  {
    id: 'kb_resume',
    name: '简历优化指南',
    description: '各岗位简历改造案例与面试经验',
    coverEmoji: '📄',
    coverColor: '#CCFBF1',
    author: { name: '求职说', type: 'personal' },
    contentCount: 108,
    subscriberCount: 12500,
    category: '职场',
    isSubscribed: false,
    section: 'recommended',
  },
  {
    id: 'kb_data_analyst',
    name: '数据分析师工作笔记',
    description: 'SQL/Python/BI 工具实战与业务案例',
    coverEmoji: '📊',
    coverColor: '#FEF3C7',
    author: { name: '数据小酒馆', type: 'team' },
    contentCount: 187,
    subscriberCount: 9600,
    category: '职场',
    isSubscribed: false,
    section: 'recommended',
  },

  // ─── 财经 ─────────────────────────────────────────────────────────────────
  {
    id: 'kb_us_tech',
    name: '美股科技股深度',
    description: '七姐妹财报跟踪 + AI 概念股分析',
    coverEmoji: '🇺🇸',
    coverColor: '#DBEAFE',
    author: { name: '海外科技投资', type: 'team' },
    contentCount: 198,
    subscriberCount: 16200,
    category: '财经',
    isSubscribed: false,
    section: 'hot',
  },
  {
    id: 'kb_fund',
    name: '基金组合搭配',
    description: '不同风险偏好下的基金组合实战',
    coverEmoji: '💰',
    coverColor: '#FEF3C7',
    author: { name: '基民日记', type: 'personal' },
    contentCount: 124,
    subscriberCount: 11800,
    category: '财经',
    isSubscribed: false,
    section: 'hot',
  },
  {
    id: 'kb_personal_finance',
    name: '个人理财规划',
    description: '从存款到资产配置的完整路径',
    coverEmoji: '💳',
    coverColor: '#EDE9FE',
    author: { name: '财富自由实验室', type: 'team' },
    contentCount: 87,
    subscriberCount: 6400,
    category: '财经',
    isSubscribed: false,
    section: 'recommended',
  },
  {
    id: 'kb_macro',
    name: '全球宏观观察',
    description: '美联储、央行政策与汇率趋势分析',
    coverEmoji: '🌍',
    coverColor: '#CCFBF1',
    author: { name: '宏观察', type: 'team' },
    contentCount: 145,
    subscriberCount: 7900,
    category: '财经',
    isSubscribed: false,
    section: 'recommended',
  },
  {
    id: 'kb_crypto',
    name: '加密货币研究',
    description: 'BTC/ETH 周期分析与 DeFi 协议拆解',
    coverEmoji: '₿',
    coverColor: '#FFF1E6',
    author: { name: 'Web3 Daily', type: 'personal' },
    contentCount: 167,
    subscriberCount: 13400,
    category: '财经',
    isSubscribed: false,
    section: 'recommended',
  },

  // ─── 生活 ─────────────────────────────────────────────────────────────────
  {
    id: 'kb_shanghai_life',
    name: '上海中产生活观察',
    description: '月薪 2-3 万人群的真实消费与生活记录',
    coverEmoji: '🏙️',
    coverColor: '#FCE7F3',
    author: { name: '城市观察笔记', type: 'personal' },
    contentCount: 178,
    subscriberCount: 24100,
    category: '生活',
    isSubscribed: false,
    section: 'hot',
  },
  {
    id: 'kb_michelin',
    name: '米其林餐厅打卡攻略',
    description: '全国米其林星级餐厅亲测与人均预算',
    coverEmoji: '🍽️',
    coverColor: '#FEE2E2',
    author: { name: '美食侦探局', type: 'team' },
    contentCount: 134,
    subscriberCount: 9800,
    category: '生活',
    isSubscribed: false,
    section: 'hot',
  },
  {
    id: 'kb_camping',
    name: '露营装备清单',
    description: '从入门到精致露营的全套装备攻略',
    coverEmoji: '⛺',
    coverColor: '#D1FAE5',
    author: { name: '户外野行', type: 'personal' },
    contentCount: 76,
    subscriberCount: 5600,
    category: '生活',
    isSubscribed: false,
    section: 'recommended',
  },
  {
    id: 'kb_home_organize',
    name: '居家收纳实战',
    description: '小户型与多人家庭的收纳方案合集',
    coverEmoji: '🏠',
    coverColor: '#FEF3C7',
    author: { name: '整理癖', type: 'personal' },
    contentCount: 112,
    subscriberCount: 8200,
    category: '生活',
    isSubscribed: false,
    section: 'recommended',
  },
  {
    id: 'kb_pets',
    name: '宠物饲养指南',
    description: '猫狗鸟鱼饲养经验与就医避坑',
    coverEmoji: '🐱',
    coverColor: '#EDE9FE',
    author: { name: '萌宠百科', type: 'team' },
    contentCount: 98,
    subscriberCount: 6700,
    category: '生活',
    isSubscribed: false,
    section: 'recommended',
  },

  // ─── 健康 ─────────────────────────────────────────────────────────────────
  {
    id: 'kb_fitness',
    name: '健身计划制定',
    description: '增肌、减脂、塑形不同目标的完整训练方案',
    coverEmoji: '💪',
    coverColor: '#DBEAFE',
    author: { name: '力量训练实验室', type: 'team' },
    contentCount: 156,
    subscriberCount: 18900,
    category: '健康',
    isSubscribed: false,
    section: 'hot',
  },
  {
    id: 'kb_running',
    name: '跑步进阶指南',
    description: '从 0 跑到全马的训练计划与装备选择',
    coverEmoji: '🏃',
    coverColor: '#FFF1E6',
    author: { name: '跑者世界中文版', type: 'team' },
    contentCount: 134,
    subscriberCount: 11200,
    category: '健康',
    isSubscribed: false,
    section: 'hot',
  },
  {
    id: 'kb_sleep',
    name: '睡眠改善方案',
    description: '失眠、浅睡、倒时差的科学解决方案',
    coverEmoji: '😴',
    coverColor: '#EDE9FE',
    author: { name: '睡眠研究室', type: 'team' },
    contentCount: 56,
    subscriberCount: 7300,
    category: '健康',
    isSubscribed: false,
    section: 'recommended',
  },
  {
    id: 'kb_mental',
    name: '心理调节笔记',
    description: '焦虑、抑郁、职场压力的应对方法',
    coverEmoji: '🧘',
    coverColor: '#FCE7F3',
    author: { name: '心晴心理', type: 'personal' },
    contentCount: 87,
    subscriberCount: 9400,
    category: '健康',
    isSubscribed: false,
    section: 'recommended',
  },
  {
    id: 'kb_tcm',
    name: '中医养生入门',
    description: '24 节气调养与日常体质改善',
    coverEmoji: '🌿',
    coverColor: '#CCFBF1',
    author: { name: '老中医说', type: 'personal' },
    contentCount: 102,
    subscriberCount: 6800,
    category: '健康',
    isSubscribed: false,
    section: 'recommended',
  },

  // ─── 教育 ─────────────────────────────────────────────────────────────────
  {
    id: 'kb_intl_school',
    name: '国际学校择校攻略',
    description: '一线城市国际学校全景对比与申请要点',
    coverEmoji: '🎓',
    coverColor: '#DBEAFE',
    author: { name: '升学规划师', type: 'team' },
    contentCount: 89,
    subscriberCount: 6500,
    category: '教育',
    isSubscribed: false,
    section: 'hot',
  },
  {
    id: 'kb_abroad_study',
    name: '留学申请实战',
    description: '美英港新四地申请流程与文书案例',
    coverEmoji: '🌏',
    coverColor: '#EDE9FE',
    author: { name: '留学说', type: 'personal' },
    contentCount: 156,
    subscriberCount: 14200,
    category: '教育',
    isSubscribed: false,
    section: 'hot',
  },
  {
    id: 'kb_gaokao',
    name: '高考志愿填报',
    description: '院校选择、专业冷热与分数对位策略',
    coverEmoji: '📝',
    coverColor: '#FFF1E6',
    author: { name: '志愿专家', type: 'team' },
    contentCount: 124,
    subscriberCount: 18700,
    category: '教育',
    isSubscribed: false,
    section: 'hot',
  },
  {
    id: 'kb_k12',
    name: 'K12 学科辅导',
    description: '小学到高中各学科要点与提分方法',
    coverEmoji: '📚',
    coverColor: '#FCE7F3',
    author: { name: '学海无涯', type: 'team' },
    contentCount: 198,
    subscriberCount: 9300,
    category: '教育',
    isSubscribed: false,
    section: 'recommended',
  },
  {
    id: 'kb_online_course',
    name: '在线课程精选',
    description: 'Coursera/edX/极客时间课程评测与笔记',
    coverEmoji: '🎥',
    coverColor: '#CCFBF1',
    author: { name: '课程评测员', type: 'personal' },
    contentCount: 76,
    subscriberCount: 5400,
    category: '教育',
    isSubscribed: false,
    section: 'recommended',
  },

  // ─── 产业 ─────────────────────────────────────────────────────────────────
  {
    id: 'kb_new_energy',
    name: '新能源汽车产业观察',
    description: '比亚迪、特斯拉、新势力的产销与技术追踪',
    coverEmoji: '🚗',
    coverColor: '#D1FAE5',
    author: { name: '车圈观察者', type: 'team' },
    contentCount: 145,
    subscriberCount: 12300,
    category: '产业',
    isSubscribed: false,
    section: 'hot',
  },
  {
    id: 'kb_semiconductor',
    name: '半导体周报',
    description: '晶圆、设备、设计公司动态与产业链梳理',
    coverEmoji: '🔌',
    coverColor: '#DBEAFE',
    author: { name: '芯片产业研究', type: 'team' },
    contentCount: 89,
    subscriberCount: 8700,
    category: '产业',
    isSubscribed: false,
    section: 'hot',
  },
  {
    id: 'kb_consumer',
    name: '消费品研究',
    description: '新消费品牌兴衰与渠道变化深度分析',
    coverEmoji: '🛒',
    coverColor: '#FFF1E6',
    author: { name: '消费洞察', type: 'team' },
    contentCount: 112,
    subscriberCount: 6900,
    category: '产业',
    isSubscribed: false,
    section: 'hot',
  },
  {
    id: 'kb_manufacturing',
    name: '制造业数字化',
    description: '智能工厂、工业软件与数字化转型案例',
    coverEmoji: '🏭',
    coverColor: '#F3F4F6',
    author: { name: '智造说', type: 'team' },
    contentCount: 67,
    subscriberCount: 4200,
    category: '产业',
    isSubscribed: false,
    section: 'recommended',
  },
  {
    id: 'kb_cross_border',
    name: '跨境电商深度',
    description: 'Amazon/TikTok Shop/独立站运营实战',
    coverEmoji: '📦',
    coverColor: '#CCFBF1',
    author: { name: '跨境笔记', type: 'personal' },
    contentCount: 134,
    subscriberCount: 10500,
    category: '产业',
    isSubscribed: false,
    section: 'recommended',
  },

  // ─── 人文 ─────────────────────────────────────────────────────────────────
  {
    id: 'kb_history',
    name: '历史读书会笔记',
    description: '中外通史与断代史经典读书笔记合集',
    coverEmoji: '📜',
    coverColor: '#FEF3C7',
    author: { name: '读史小组', type: 'team' },
    contentCount: 156,
    subscriberCount: 11700,
    category: '人文',
    isSubscribed: false,
    section: 'hot',
  },
  {
    id: 'kb_philosophy',
    name: '哲学入门精选',
    description: '西方哲学史与现代思潮的入门读物推荐',
    coverEmoji: '🤔',
    coverColor: '#EDE9FE',
    author: { name: '哲思录', type: 'personal' },
    contentCount: 78,
    subscriberCount: 5800,
    category: '人文',
    isSubscribed: false,
    section: 'hot',
  },
  {
    id: 'kb_art',
    name: '当代艺术观察',
    description: '双年展、画廊展览与艺术家访谈记录',
    coverEmoji: '🖼️',
    coverColor: '#FCE7F3',
    author: { name: '艺术现场', type: 'team' },
    contentCount: 92,
    subscriberCount: 7400,
    category: '人文',
    isSubscribed: false,
    section: 'hot',
  },
  {
    id: 'kb_film',
    name: '电影深度评论',
    description: '当代华语与外语电影的长评与导演研究',
    coverEmoji: '🎬',
    coverColor: '#FEE2E2',
    author: { name: '电影手册中文版', type: 'team' },
    contentCount: 234,
    subscriberCount: 19600,
    category: '人文',
    isSubscribed: false,
    section: 'recommended',
  },
  {
    id: 'kb_classical_music',
    name: '古典音乐入门',
    description: '从巴洛克到现代派的作曲家与名曲导赏',
    coverEmoji: '🎼',
    coverColor: '#DBEAFE',
    author: { name: '乐迷俱乐部', type: 'personal' },
    contentCount: 67,
    subscriberCount: 4900,
    category: '人文',
    isSubscribed: false,
    section: 'recommended',
  },

  // ─── 法律 ─────────────────────────────────────────────────────────────────
  {
    id: 'kb_labor_law',
    name: '劳动法实用指南',
    description: '加班、辞退、社保、工伤的常见纠纷与应对',
    coverEmoji: '⚖️',
    coverColor: '#FFF1E6',
    author: { name: '律师老李', type: 'personal' },
    contentCount: 134,
    subscriberCount: 16800,
    category: '法律',
    isSubscribed: false,
    section: 'hot',
  },
  {
    id: 'kb_contract',
    name: '合同审查要点',
    description: '常见商务合同的关键条款与风险点',
    coverEmoji: '📑',
    coverColor: '#DBEAFE',
    author: { name: '合同法务', type: 'team' },
    contentCount: 89,
    subscriberCount: 7200,
    category: '法律',
    isSubscribed: false,
    section: 'hot',
  },
  {
    id: 'kb_marriage_law',
    name: '婚姻家事案例',
    description: '离婚、抚养、继承的真实案例与判决思路',
    coverEmoji: '💍',
    coverColor: '#FCE7F3',
    author: { name: '家事律师', type: 'personal' },
    contentCount: 112,
    subscriberCount: 9300,
    category: '法律',
    isSubscribed: false,
    section: 'hot',
  },
  {
    id: 'kb_ip',
    name: '知识产权保护',
    description: '商标、专利、著作权维权实操指引',
    coverEmoji: '©️',
    coverColor: '#EDE9FE',
    author: { name: 'IP 实务', type: 'team' },
    contentCount: 76,
    subscriberCount: 5600,
    category: '法律',
    isSubscribed: false,
    section: 'recommended',
  },
  {
    id: 'kb_startup_law',
    name: '创业法务清单',
    description: '股权结构、融资协议与员工激励法律要点',
    coverEmoji: '🏢',
    coverColor: '#FEF3C7',
    author: { name: '创投法务圈', type: 'team' },
    contentCount: 98,
    subscriberCount: 6800,
    category: '法律',
    isSubscribed: false,
    section: 'recommended',
  },
]

export const mockDiscoverKbContents: Record<string, DiscoverKbContentItem[]> = {
  'kb_japan_travel': [
    { id: 'j1', title: '东京3天深度行程：涩谷 + 新宿 + 浅草', desc: '结合线路图，适合第一次去东京', time: '2天前', type: 'doc' },
    { id: 'j2', title: '大阪美食图鉴：道顿堀到黑门市场', desc: '20+ 本地人推荐的居酒屋和食堂', time: '4天前', type: 'doc' },
    { id: 'j3', title: '关西七日游总预算拆解', desc: '机票、住宿、餐饮、景点全覆盖', time: '1周前', type: 'pdf' },
    { id: 'j4', title: '日本交通攻略：JR Pass vs 单程票', desc: '不同行程下的性价比对比', time: '1周前', type: 'doc' },
    { id: 'j5', title: '京都寺庙打卡清单（附门票信息）', desc: '含金阁寺、岚山、伏见稻荷', time: '2周前', type: 'doc' },
    { id: 'j6', title: '购物清单：药妆 / 零食 / 电器', desc: '按类型整理，附价格参考', time: '2周前', type: 'note' },
    { id: 'j7', title: '九州行程：博多 + 长崎 + 熊本', desc: '鲜为人知的九州小众路线', time: '3周前', type: 'doc' },
    { id: 'j8', title: '去日本最容易犯的15个错误', desc: '过来人总结，含交通和礼仪篇', time: '1个月前', type: 'note' },
  ],
  'kb_pm_interview': [
    { id: 'pm1', title: '用户访谈大纲模板 v3', desc: '结构化的访谈引导脚本，适合 B 端和 C 端', time: '1天前', type: 'doc' },
    { id: 'pm2', title: '访谈洞察沉淀：从记录到 Action', desc: '如何把访谈笔记转化为产品洞察', time: '3天前', type: 'note' },
    { id: 'pm3', title: '招募受访者的7种方法', desc: '渠道、话术和筛选标准全解析', time: '5天前', type: 'doc' },
    { id: 'pm4', title: '远程访谈工具对比：Zoom vs Dovetail', desc: '功能、价格、适用场景详细对比', time: '1周前', type: 'pdf' },
    { id: 'pm5', title: '如何设计不引导用户的提问', desc: '避免确认性偏差的访谈技巧', time: '2周前', type: 'doc' },
    { id: 'pm6', title: '访谈录音转写与分析工作流', desc: '结合 AI 工具，效率提升 3 倍', time: '2周前', type: 'note' },
    { id: 'pm7', title: '用户访谈 vs 可用性测试：如何选', desc: '研究方法选择决策树', time: '3周前', type: 'doc' },
    { id: 'pm8', title: '访谈报告写作规范', desc: '让利益相关方更容易采纳洞察', time: '1个月前', type: 'pdf' },
    { id: 'pm9', title: '远程访谈中的非语言信号解读', desc: '表情、停顿与回避的意义', time: '1个月前', type: 'note' },
    { id: 'pm10', title: '儿童用户访谈特别指南', desc: '与未成年用户访谈的注意事项', time: '2个月前', type: 'doc' },
  ],
  'kb_stock_notes': [
    { id: 'st1', title: '2025 Q2 财报分析：消费板块', desc: '贵州茅台 + 海底捞 + 泡泡玛特', time: '1天前', type: 'pdf' },
    { id: 'st2', title: '行业拐点信号：如何判断底部', desc: '结合成交量、PE 和政策周期', time: '3天前', type: 'note' },
    { id: 'st3', title: 'A 股核心资产估值体系', desc: '消费/科技/医疗三大板块估值方法', time: '5天前', type: 'doc' },
    { id: 'st4', title: '基金经理访谈精华：张坤论消费', desc: '易方达 2024 年度报告核心摘录', time: '1周前', type: 'pdf' },
    { id: 'st5', title: '散户常犯的3类认知错误', desc: '追涨杀跌 / 频繁操作 / 过度分散', time: '2周前', type: 'note' },
    { id: 'st6', title: '医药板块投资逻辑梳理', desc: '政策、老龄化与创新药三条主线', time: '3周前', type: 'doc' },
    { id: 'st7', title: '定投 vs 择时：10年回测对比', desc: '用数据说话，结论出乎意料', time: '1个月前', type: 'pdf' },
    { id: 'st8', title: '港股折价成因与投资机会', desc: 'AH 溢价率变化规律分析', time: '1个月前', type: 'doc' },
  ],
  'kb_browser_trend': [
    { id: 'br1', title: 'Arc 浏览器第12次重大更新解析', desc: '新功能逻辑与产品策略分析', time: '2天前', type: 'note' },
    { id: 'br2', title: 'Dia 发布：AI 原生浏览器的下一站', desc: 'The Browser Company 新产品深度解读', time: '4天前', type: 'doc' },
    { id: 'br3', title: 'Safari 18 与 Chrome 126 功能对比', desc: '2025 上半年浏览器能力演进', time: '1周前', type: 'pdf' },
    { id: 'br4', title: '侧边栏战争：Arc vs Sidebar vs Edge', desc: '三款主流侧边栏交互深度对比', time: '2周前', type: 'note' },
    { id: 'br5', title: '浏览器历史：从 Mosaic 到 AI 浏览器', desc: '30 年演进脉络梳理', time: '3周前', type: 'doc' },
    { id: 'br6', title: '2025 浏览器市场份额报告', desc: 'StatCounter 最新数据分析', time: '1个月前', type: 'pdf' },
    { id: 'br7', title: '用户为什么还没离开 Chrome', desc: '生态锁定 vs 体验创新的博弈', time: '1个月前', type: 'note' },
    { id: 'br8', title: 'Notion Web Clipper vs Arc Boost', desc: '浏览器内容捕获工具对比', time: '2个月前', type: 'doc' },
  ],
  'kb_design_system': [
    { id: 'ds1', title: '组件命名规范 2025 版', desc: '从 Atomic Design 到 Component API', time: '2天前', type: 'doc' },
    { id: 'ds2', title: 'Token 系统：从 Figma Variables 到代码', desc: '双向同步的设计系统工作流', time: '5天前', type: 'pdf' },
    { id: 'ds3', title: 'Vercel Design 设计语言拆解', desc: '极简风格背后的决策逻辑', time: '1周前', type: 'note' },
    { id: 'ds4', title: 'Linear 组件库开源分析', desc: 'Radix UI + Tailwind 的最佳实践', time: '2周前', type: 'doc' },
    { id: 'ds5', title: 'Dark Mode Token 策略：4 种主流方案', desc: 'CSS 变量 / Tailwind / Figma 语义色对比', time: '3周前', type: 'pdf' },
    { id: 'ds6', title: '组件文档写作指南', desc: '让开发者真正会用你的设计系统', time: '3周前', type: 'note' },
    { id: 'ds7', title: '无障碍色彩对比度检查清单', desc: 'WCAG 2.1 合规实操指南', time: '1个月前', type: 'doc' },
    { id: 'ds8', title: 'Notion 设计系统演进史', desc: '从乱到治的 5 年设计系统建设历程', time: '1个月前', type: 'pdf' },
    { id: 'ds9', title: 'iOS 17 Design Kit 拆解', desc: 'Apple HIG 最新变化与工程适配', time: '2个月前', type: 'doc' },
    { id: 'ds10', title: '设计系统健康度评估模型', desc: '6 个维度判断你的设计系统是否好用', time: '2个月前', type: 'note' },
  ],
  'kb_diet_recipe': [
    { id: 'dr1', title: '鸡胸肉10种低卡做法', desc: '不干不柴的烹饪技巧详解', time: '1天前', type: 'note' },
    { id: 'dr2', title: '减脂期外卖选择指南', desc: '美团、饿了么上的高蛋白低卡选项', time: '3天前', type: 'doc' },
    { id: 'dr3', title: '一周减脂餐食材采购清单', desc: '1500 kcal 目标的采购指南', time: '5天前', type: 'doc' },
    { id: 'dr4', title: '蛋白质食物热量速查表', desc: '50+ 常见食物对比', time: '1周前', type: 'pdf' },
    { id: 'dr5', title: '间歇性断食 16:8 实操指南', desc: '常见误区与注意事项', time: '2周前', type: 'note' },
    { id: 'dr6', title: '高蛋白早餐：6种10分钟做法', desc: '不用沙拉的营养早餐方案', time: '3周前', type: 'doc' },
    { id: 'dr7', title: '运动后补餐的最佳时机与食物', desc: '科学依据 + 实践建议', time: '1个月前', type: 'note' },
    { id: 'dr8', title: '低卡零食 Top 20', desc: '超市能买到的健康替代品', time: '1个月前', type: 'doc' },
  ],
}

export const mockApps: LightApp[] = [
  {
    id: 'app_diet',
    name: '减脂期饮食',
    icon: '🥗',
    description: '食物库、热量记录、营养分析',
    templateId: 'diet-log',
    createdAt: '2周前',
    lastOpenedAt: '刚刚',
    lastUsedAt: '刚刚',
    dataSource: '健康计划',
    runtimeType: 'daily_tracker',
  },
  {
    id: 'app_invest',
    name: 'Q4 投资跟踪',
    icon: '📈',
    description: '基金净值、收益曲线、持仓笔记',
    templateId: 'fund-portfolio',
    createdAt: '1周前',
    lastOpenedAt: '1小时前',
    lastUsedAt: '1小时前',
    dataSource: '财经资料库',
    runtimeType: 'data_dashboard',
  },
  {
    id: 'app_words',
    name: '我的英语单词本',
    icon: '📖',
    description: '生词库、记忆曲线、每日学习',
    templateId: 'word-cards',
    createdAt: '3天前',
    lastOpenedAt: '昨天',
    lastUsedAt: '昨天',
    dataSource: '读书摘录',
    runtimeType: 'learning_list',
  },
  {
    id: 'app_fitness',
    name: '我的训练计划',
    icon: '🏃',
    description: '动作库、训练计划、打卡记录',
    templateId: 'fitness-planner',
    createdAt: '2天前',
    lastOpenedAt: '2天前',
    lastUsedAt: '2天前',
    dataSource: '健身资料',
    runtimeType: 'daily_tracker' as const,
  },
  {
    id: 'app_interview',
    name: '我的面试题库',
    icon: '📝',
    description: '题目集、刷题进度、复盘笔记',
    templateId: 'interview-bank',
    createdAt: '1周前',
    lastOpenedAt: '1周前',
    lastUsedAt: '1周前',
    dataSource: '面试资料',
    runtimeType: 'learning_list' as const,
  },
  {
    id: 'app_travel',
    name: '日本关西七日游',
    icon: '✈️',
    description: '行程时间线、景点收藏、预算跟踪、AI 推荐',
    templateId: 'travel-plan',
    createdAt: '刚刚',
    lastOpenedAt: '刚刚',
    lastUsedAt: '刚刚',
    dataSource: '旅行美食圈',
    runtimeType: 'daily_tracker' as const,
  },
]

export const mockAiSuggestions = [
  '如何在知识库中快速找到历史决策？',
  '帮我总结今天工作资料里的关键信息',
  '分析竞品报告里最值得关注的3个点',
  '帮我把这篇文章整理成结构化要点',
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
