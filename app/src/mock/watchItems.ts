// 蹲守任务详情页（W03）每条蹲到内容的 mock 数据。
// 两种 kind：
//   - new      新蹲到，带"新"徽章 + 相关度 + AI 归入主题
//   - history  历史蹲到，有相关度 + AI 归入主题，无徽章

export type WatchItemKind = 'new' | 'history'

export interface WatchItem {
  id: string
  taskId: string
  kind: WatchItemKind
  title: string
  summary?: string
  meta: string
  relevance?: number
  aiTopic?: string
}

export const WATCH_ITEMS: WatchItem[] = [
  // ── watch_001 · 小红书 · dialog 设计周报 ────────────────────────────────
  {
    id: 'wi_001_1',
    taskId: 'watch_001',
    kind: 'new',
    title: 'AI 浏览器侧边栏的 3 种主流形态',
    summary: '对 Arc、Dia、SigmaOS 三款产品的侧边栏布局做对比，提炼"上下文工作区"的设计模式。',
    meta: '书 · dialog 设计周报 · 2 小时前',
    relevance: 94,
    aiTopic: '浏览器交互设计',
  },
  {
    id: 'wi_001_2',
    taskId: 'watch_001',
    kind: 'history',
    title: 'Arc 标签管理的灵感来源：树状文件夹之外',
    meta: '书 · dialog 设计周报 · 3 天前',
    relevance: 88,
    aiTopic: '信息架构',
  },
  {
    id: 'wi_001_3',
    taskId: 'watch_001',
    kind: 'history',
    title: '从命令面板到自然语言：浏览器输入框的 5 年演化',
    meta: '书 · dialog 设计周报 · 1 周前',
    relevance: 82,
    aiTopic: '浏览器交互设计',
  },

  // ── watch_002 · B站 · #AI浏览器 #浏览器评测 ─────────────────────────────
  {
    id: 'wi_002_1',
    taskId: 'watch_002',
    kind: 'new',
    title: '【极客湾】5 款 AI 浏览器横评：谁才是 Arc 的接班人',
    summary: 'Dia、SigmaOS、Browser Company、Comet、Pinch 五款产品的实测对比，重点看启动速度、AI 召回准确率和扩展生态。',
    meta: 'B · 极客湾 · 今早',
    relevance: 91,
    aiTopic: '产品评测',
  },
  {
    id: 'wi_002_2',
    taskId: 'watch_002',
    kind: 'new',
    title: '【小白测评】Dia 浏览器深度体验：上手 30 天的真实感受',
    summary: '使用 Dia 一个月后的真实感受，分享 5 个超出预期的功能和 3 个槽点。',
    meta: 'B · 小白测评 · 昨天',
    relevance: 86,
    aiTopic: '产品评测',
  },
  {
    id: 'wi_002_3',
    taskId: 'watch_002',
    kind: 'history',
    title: '【影视飓风】我们用 AI 浏览器做了一期视频，效率提升 4 倍',
    meta: 'B · 影视飓风 · 4 天前',
    relevance: 78,
    aiTopic: 'AI 辅助创作',
  },

  // ── watch_003 · 知乎 · Arc 停服 / Arc 替代品（已暂停）────────────────────
  {
    id: 'wi_003_1',
    taskId: 'watch_003',
    kind: 'history',
    title: 'Arc 停服后我尝试了 6 款替代品，最后留下了哪一款',
    meta: '知 · 数字游民王老师 · 1 周前',
    relevance: 90,
    aiTopic: 'Arc 替代品',
  },
  {
    id: 'wi_003_2',
    taskId: 'watch_003',
    kind: 'history',
    title: 'Browser Company 团队转向 Dia：从用户角度看这件事',
    meta: '知 · 产品观察 · 2 周前',
    relevance: 84,
    aiTopic: '行业动态',
  },

  // ── watch_004 · 公众号 · PMTalk（用户严格指定）─────────────────────────
  {
    id: 'wi_004_1',
    taskId: 'watch_004',
    kind: 'new',
    title: 'B 端 PM 如何做好用户访谈：5 个实战技巧',
    summary: '从设计访谈提纲、控制节奏到识别"礼貌性回答"，结合 SaaS 项目中的真实案例展开。',
    meta: '微 · PMTalk · 昨天 18:32',
    relevance: 92,
    aiTopic: '用户研究方法',
  },
  {
    id: 'wi_004_2',
    taskId: 'watch_004',
    kind: 'history',
    title: '产品经理的 OKR 实践：从对齐到复盘',
    meta: '微 · PMTalk · 3 天前',
    relevance: 87,
    aiTopic: '项目管理',
  },
  {
    id: 'wi_004_3',
    taskId: 'watch_004',
    kind: 'history',
    title: 'B 端产品的需求分层方法',
    meta: '微 · PMTalk · 5 天前',
    relevance: 81,
    aiTopic: '需求管理',
  },

  // ── watch_005 · 知乎 · 产品方法论 ───────────────────────────────────────
  {
    id: 'wi_005_1',
    taskId: 'watch_005',
    kind: 'new',
    title: '从 JTBD 到价值主张画布：一套可落地的需求拆解流程',
    summary: '不止是工具堆叠，重点讲在团队里怎么用、怎么对齐结论。',
    meta: '知 · 俞军观察 · 今早',
    relevance: 89,
    aiTopic: '需求方法论',
  },
  {
    id: 'wi_005_2',
    taskId: 'watch_005',
    kind: 'history',
    title: '产品决策中的"伪定量"陷阱：数据自洽不等于结论可信',
    meta: '知 · 数据洞察 · 4 天前',
    relevance: 83,
    aiTopic: '数据决策',
  },

  // ── watch_006 · X · 用户研究 ────────────────────────────────────────────
  {
    id: 'wi_006_1',
    taskId: 'watch_006',
    kind: 'new',
    title: '一条好的访谈问题，三个判断标准',
    summary: '判断访谈问题质量的 3 个维度：是否开放、是否聚焦行为、是否避免假设。',
    meta: 'X · @uxr_kate · 今天',
    relevance: 88,
    aiTopic: '访谈方法',
  },
  {
    id: 'wi_006_2',
    taskId: 'watch_006',
    kind: 'history',
    title: 'Why "5 users" works (and when it does not)',
    meta: 'X · @nngroup · 6 天前',
    relevance: 85,
    aiTopic: '可用性测试',
  },
  {
    id: 'wi_006_3',
    taskId: 'watch_006',
    kind: 'history',
    title: '用户研究报告，怎么写才有人看',
    meta: 'X · @研究员阿杜 · 1 周前',
    relevance: 79,
    aiTopic: '研究产出',
  },

  // ── watch_007 · 公众号 · 猫眼研究院（已暂停）────────────────────────────
  {
    id: 'wi_007_1',
    taskId: 'watch_007',
    kind: 'history',
    title: '影院用户的购票决策：从片单到选座的完整链路',
    meta: '微 · 猫眼研究院 · 1 周前',
    relevance: 86,
    aiTopic: '用户决策',
  },
  {
    id: 'wi_007_2',
    taskId: 'watch_007',
    kind: 'history',
    title: '00 后观影行为白皮书 · 2025 Q1',
    meta: '微 · 猫眼研究院 · 2 周前',
    relevance: 80,
    aiTopic: '用户画像',
  },

  // ── watch_008 · 小红书 · 书单狗 ─────────────────────────────────────────
  {
    id: 'wi_008_1',
    taskId: 'watch_008',
    kind: 'new',
    title: '5 本让你重新理解"专注"的书',
    summary: '从《深度工作》到《当下的力量》，附阅读顺序建议。',
    meta: '书 · 书单狗 · 今天',
    relevance: 87,
    aiTopic: '认知与专注',
  },
  {
    id: 'wi_008_2',
    taskId: 'watch_008',
    kind: 'new',
    title: '今年读到的最好的非虚构：《How to Take Smart Notes》',
    summary: 'Zettelkasten 的英文入门书，比中文译本更系统。',
    meta: '书 · 书单狗 · 今天',
    relevance: 90,
    aiTopic: '笔记方法',
  },
  {
    id: 'wi_008_3',
    taskId: 'watch_008',
    kind: 'history',
    title: '读完《思考，快与慢》后我改了哪些决策习惯',
    meta: '书 · 书单狗 · 4 天前',
    relevance: 82,
    aiTopic: '决策心理',
  },

  // ── watch_009 · 知乎 · 认知科学 ─────────────────────────────────────────
  {
    id: 'wi_009_1',
    taskId: 'watch_009',
    kind: 'new',
    title: '工作记忆的容量极限到底是 7 还是 4？',
    summary: '从 Miller 到 Cowan，三十年间认知容量研究的范式变迁。',
    meta: '知 · 神经科学猫 · 今天',
    relevance: 91,
    aiTopic: '工作记忆',
  },
  {
    id: 'wi_009_2',
    taskId: 'watch_009',
    kind: 'history',
    title: '为什么"间隔重复"比"集中复习"更有效',
    meta: '知 · 学习科学日报 · 5 天前',
    relevance: 84,
    aiTopic: '学习机制',
  },

  // ── watch_010 · 公众号 · 字节范儿 ───────────────────────────────────────
  {
    id: 'wi_010_1',
    taskId: 'watch_010',
    kind: 'new',
    title: '字节内部的复盘文化：5W2H + Pre-mortem 双引擎',
    summary: '复盘不是写总结。文章给出了一个团队落地复盘的 4 步法和 2 个常见误区。',
    meta: '微 · 字节范儿 · 今天',
    relevance: 89,
    aiTopic: '复盘方法',
  },
  {
    id: 'wi_010_2',
    taskId: 'watch_010',
    kind: 'new',
    title: '从季度 OKR 到每周 1-on-1：管理者的节奏感',
    meta: '微 · 字节范儿 · 今天',
    relevance: 85,
    aiTopic: '管理节奏',
  },
  {
    id: 'wi_010_3',
    taskId: 'watch_010',
    kind: 'history',
    title: '为什么我们停掉了双月复盘',
    meta: '微 · 字节范儿 · 5 天前',
    relevance: 80,
    aiTopic: '复盘方法',
  },

  // ── watch_011 · 小红书 · 减脂餐 ─────────────────────────────────────────
  {
    id: 'wi_011_1',
    taskId: 'watch_011',
    kind: 'new',
    title: '减脂期一日三餐：1500 大卡范本 + 替换清单',
    summary: '附食材克数、烹饪步骤和可替换组合，照着吃 7 天看效果。',
    meta: '书 · 减脂少女狗蛋 · 今天',
    relevance: 92,
    aiTopic: '减脂食谱',
  },
  {
    id: 'wi_011_2',
    taskId: 'watch_011',
    kind: 'new',
    title: '减脂期外卖怎么点：12 家连锁低卡选项实测',
    meta: '书 · 减脂记录员 · 今天',
    relevance: 88,
    aiTopic: '外食选择',
  },
  {
    id: 'wi_011_3',
    taskId: 'watch_011',
    kind: 'history',
    title: '为什么我减脂期还能吃米饭：碳水的角色被误解了',
    meta: '书 · 营养笔记 · 3 天前',
    relevance: 81,
    aiTopic: '宏量营养素',
  },

  // ── watch_012 · 公众号 · 营养师顾中一 ───────────────────────────────────
  {
    id: 'wi_012_1',
    taskId: 'watch_012',
    kind: 'new',
    title: '维生素 D 补不补、补多少：一篇说清的实证综述',
    summary: '基于 2024 年 3 篇大型综述，给出不同人群的剂量建议和检测频率。',
    meta: '微 · 营养师顾中一 · 今天',
    relevance: 90,
    aiTopic: '微量营养素',
  },
  {
    id: 'wi_012_2',
    taskId: 'watch_012',
    kind: 'history',
    title: '蛋白粉到底要不要吃，先看你的饮食结构',
    meta: '微 · 营养师顾中一 · 6 天前',
    relevance: 83,
    aiTopic: '蛋白质摄入',
  },

  // ── watch_013 · B站 · 硬派健身 ──────────────────────────────────────────
  {
    id: 'wi_013_1',
    taskId: 'watch_013',
    kind: 'new',
    title: '【硬派健身】力量训练前到底要不要静态拉伸？',
    summary: '过了 30 年的训练前拉伸建议被推翻：在大重量训练前做静态拉伸会让最大力量下降 5-10%。',
    meta: 'B · 硬派健身 · 今天',
    relevance: 93,
    aiTopic: '训练前热身',
  },
  {
    id: 'wi_013_2',
    taskId: 'watch_013',
    kind: 'new',
    title: '【硬派健身】卧推一直不涨？先看这 3 个动作模式问题',
    meta: 'B · 硬派健身 · 昨天',
    relevance: 88,
    aiTopic: '力量训练',
  },
  {
    id: 'wi_013_3',
    taskId: 'watch_013',
    kind: 'history',
    title: '【硬派健身】RPE 评分：比次数更靠谱的训练量度量',
    meta: 'B · 硬派健身 · 4 天前',
    relevance: 84,
    aiTopic: '训练量管理',
  },

  // ── watch_014 · 小红书 · #训练计划（已暂停）─────────────────────────────
  {
    id: 'wi_014_1',
    taskId: 'watch_014',
    kind: 'history',
    title: '一周 4 练 PPL 训练计划：动作 + 组数 + 替换方案',
    meta: '书 · 普拉斯老周 · 5 天前',
    relevance: 89,
    aiTopic: '分化训练',
  },
  {
    id: 'wi_014_2',
    taskId: 'watch_014',
    kind: 'history',
    title: '健身房新手 8 周入门计划：从机器到自由重量',
    meta: '书 · 健身教练张 · 1 周前',
    relevance: 82,
    aiTopic: '新手训练',
  },

  // ── watch_015 · 雪球 · 指数定投 ─────────────────────────────────────────
  {
    id: 'wi_015_1',
    taskId: 'watch_015',
    kind: 'new',
    title: '为什么我把定投从沪深 300 换成了中证 A50',
    summary: '从行业权重、估值百分位和波动率三个维度对比，附半年实测收益。',
    meta: '雪 · 慢钱投研 · 今天',
    relevance: 90,
    aiTopic: '指数选择',
  },
  {
    id: 'wi_015_2',
    taskId: 'watch_015',
    kind: 'history',
    title: '定投止盈的 3 种方式：估值、目标收益、动态再平衡',
    meta: '雪 · 银行螺丝钉 · 4 天前',
    relevance: 86,
    aiTopic: '定投策略',
  },
]

export function getTaskItems(taskId: string) {
  return WATCH_ITEMS.filter(item => item.taskId === taskId)
}
