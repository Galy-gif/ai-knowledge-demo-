# Demo 开发进度

> 最后更新：R43（T03 行程偏好改折叠行卡片 + T07 调整需求/导出行程接交互）
> 本文件由 Claude Code 维护，记录功能进度、产品决策和工作偏好。

---

## 当前状态速览

| 模块 | 状态 | 说明 |
|---|---|---|
| 知识库主页 K01 | ✅ 完成（R39 加蹲守提示条）| 搜索、最近内容、滑动操作、多选批量、顶部蹲守提示条 |
| 知识库详情 K05 | ✅ 完成（R37/R39 微调）| 5 种管理方式视图、蹲一下状态条、AI 模式标识条简化 |
| 添加内容 K06 | ✅ 完成（R42 微调）| 粘贴链接行 + 最近横滑（单行省略） + 自动同步 6 横滑小图标 + 手动添加 4 横滑小图标 |
| 知识广场 K10 | ✅ 完成（R34/R38）| KB 卡片 + 分类胶囊 + 订阅/取关，9 分类 51 个 mock KB |
| 知识库广场详情 K11 | ✅ 完成（R34 重设计）| KB 详情页替代团队详情 |
| 蹲一下 W01/W02 | ✅ 完成（R35/R37）| 蹲守管理 + 今日内容，K05 状态条 + K01 提示条；5 个 KB 各有 mock 任务 |
| 问一问 Q01 | ✅ 完成 | Explore LOGO + 模式切换 + 推荐 + 轻应用快捷区 |
| AI 回答 Q04/Q05 | ✅ 完成 | 流式回答 + 保存到库 |
| 轻应用生成 T 系列 | ✅ 完成（R41 旅行重做）| 4 种 runtime：learning_list / data_dashboard / daily_tracker / travel_planner |
| 我的 M01/M02 | ✅ 完成 | 基础信息编辑 |

---


## 关键产品决策摘要

### 知识库管理方式（5 种，K03 新建时二步选择）

| 模式 | 代码值 | 对应样例库 | K05 视图特征 |
|---|---|---|---|
| 按项目整理 | `project` | AI 浏览器项目库 | 进行中/长期/参考/已归档四组，橙色色条 |
| 从资料变成果 | `output` | 季度产品复盘 | 四阶段进度条 + 横滑资料卡，收集→整理→提炼→已输出 |
| 按想法整理 | `idea` | 读书摘录、我的速记 | 两列瀑布流卡片墙 + 关联标签 + 知识网络概览 |
| 让 AI 帮你整理 | `ai` | 产品资料库 | AI 自动分组 + 主题识别状态卡 + 建议条 |
| 自由收纳 | `free` | 杂物收藏、订阅库 | 纯平铺列表，无任何分类/统计 |
| 未选（新建默认） | `null` | 未命名知识库 | 无入口条，空态显示双路径按钮 |

**决策背景**：「PARA / CODE / 卡片盒 / 第二大脑 / 自动整理」是最初讨论的框架，最终落地为以上 5 种更口语化的中文命名。`null` 是新建但未选择的临时状态，不等同于 `free`。

### 蹲一下功能（W 系列）

- **定位**：内容监控/订阅——用户选定平台+关键词/作者，系统自动追踪新内容并过滤推送
- **入口**：K05「...」菜单第一项「蹲一下」→ W01 蹲守管理；K01 知识库主页在有未读时显示浅橙提示条 → W02 今日内容（R39 起从 Q01 搬到 K01）
- **K05 状态条**：有运行中任务时，在管理方式入口条下方显示浅橙状态条，「X 个蹲守中 · 今天蹲到 X 条」；按当前 KB 动态显示，杂物收藏 / 我的速记 / 未命名隐藏
- **平台支持**：小红书、B站、公众号、知乎、X(Twitter)、微博，用彩色字符方块表示（不用 lucide 通用图标）
- **W01 创建向导**：4 步——选平台 → 选类型+输入（作者/话题/关键词）→ 选策略（智能过滤/全部进库/进收件箱）→ 频率+通知
- **mock 任务覆盖**：kb_project_browser 3 个 / kb1 2 个 / kb2 2 个 / kb3 2 个 / kb_output_review 1 个，共 10 个

### K06 添加内容抽屉（R42 微调）

5 个区块：

1. **TopHeader**：左"取消" + 中"添加内容" + 右 28px 占位
2. **粘贴链接行卡片**：浅橙底 Link 图标，输入合法 URL 后图标变绿 ✓，右侧出现"保存"小按钮
3. **最近浏览/下载横滑**：6 张 130×84 卡，24×24 浅橙 emoji 方块；标题强制单行省略号（`white-space: nowrap; text-overflow: ellipsis`），时间贴底（`mt-auto`）；多选 + 底部"+ 添加到「XXX」"浮条
4. **自动同步横滑小图标**（6 个）：浏览器/微信/网盘/邮件/截图/下载，48×48 emoji 方块 + 11px 标签；点击网盘弹 CloudPickerSheet（5 个网盘），其它直接跳 `/knowledge/add-from/:source`
5. **手动添加横滑小图标**（4 个）：上传文件/第三方/AI 对话/扫一扫，点击直接跳 K15/K16/K17/K18

「我的速记」额外显示底部「新建速记」行卡片。

R40-R41 时短暂存在的 K19/K20 二级中转页（自动/手动来源选择）已删除，用户在主面板直接点小图标进具体来源。

### 添加来源页架构（R36）

所有来源页统一布局：TopHeader（左返回 + 中标题 + 右上「重新连接」橙色按钮）+ 顶部浅橙状态卡 + 主体勾选列表 + 底部浮起「已选 N 项 · 添加到「XXX」」浮条。

- **K14 通用 A 类页**：单组件覆盖 6 个来源（browser-history / wechat / screenshot / download / email / cloud-files），按 `:source` URL 参数切换 mock 数据。浏览器历史每条额外有「整页/选段」切换按钮。网盘分支额外面包屑。
- **K15 上传文件**：mock 系统文件选择浮层（5 条 mock 文件）→ 选择后进入确认页（可编辑文件名 + 添加按钮）。
- **K16 第三方 App 分享**：简化引导页，只留 emoji + 一段说明 + 「直接粘贴链接 →」跳回。删除了原三步教程页和「我知道了」按钮。
- **K17 AI 对话保存**：先选平台（ChatGPT/Claude/豆包），再列出 5 条 mock 对话，每条独立「选择导入」按钮。
- **K18 扫一扫**：黑屏 + 扫码框 mock + 1.5s 自动跳到识别结果（mock 链接 + 保存按钮）。

### 知识广场 K10/K11（R34 重设计 + R38 内容扩充）

- K10：从「团队卡片」改为「KB 卡片」，emoji 封面 + 订阅量 + 分类胶囊
- K11：从「团队详情」改为「KB 详情页」，hero 区 emoji 封面 + 订阅量格式化 + 内容列表 + 底部吸底订阅按钮
- KnowledgeContext 新增 `discoverKbs`、`subscribeDiscoverKb`、`unsubscribeDiscoverKb`
- 9 个分类（推荐/科技/职场/财经/生活/健康/教育/产业/人文/法律）共 51 个 mock KB，每个分类 5-7 张分本周热门 / 你可能感兴趣两组
- `DiscoverKb.inRecommend` 字段控制「推荐」tab 内容，非默认 6 个分类的 KB 在「推荐」tab 不出现

### 「我的速记」系统知识库

- `managementMode: 'idea'`，固定，不可修改
- 不可删除、不可重命名
- 是所有「保存到库」操作的默认目标（`SaveToKnowledgeBaseSheet` 默认选中）
- K06 在此库内才出现「新建速记」入口

---

## 工作偏好

### 视觉风格
- **克制，不要 AI 味**：避免过多渐变、发光、毛玻璃等 AI 工具常见视觉套路
- **主色橙 #FF7A00**（`brand-orange`），用于主操作按钮和少量强调，不铺满背景
- **浅橙背景 `#FFF1E6`**（`brand-orange-light`）用于状态条、提示条等次要强调区域
- **中文界面**，所有 UI 文案用中文，功能命名偏口语化
- 平台标识用「彩色字符方块」而不是 lucide 通用图标

### 代码风格
- TypeScript strict：type-only import 必须用 `import type`，未用变量是 build error
- 不写注释，除非 WHY 非常不显然
- BottomSheet 页面用 raw flex 布局（`flex flex-col h-full relative bg-white`），不能套 PageLayout
- Context 只做状态，不做 UI；页面内联逻辑，不过度抽象组件
- 每次改完跑 `npm run build` 确认通过

### 协作节奏
- 改完立刻 build 验证，build 不过不算完成
- 需要推 GitHub 时直接说，不需要每次问
- 进度记在 PROGRESS.md，避免上下文截断后重复解释背景

---

## ✅ 已完成功能清单

### 基础工程
- Vite + React + TypeScript，Tailwind CSS v3（完整设计 token）
- React Router v6，lucide-react
- 6 个 Context：UserContext / AnnotationsContext / KnowledgeContext / AppsContext / MultiSelectContext / WatchContext
- `mock/data.ts`：完整数据结构，含「我的速记」系统库、note 类型文件、个人/订阅知识库、discover KB
- 390×844 手机框 PhoneFrame

### 通用组件
- BottomSheet、Toast、ConfirmDialog、SaveToKnowledgeBaseSheet
- StreamingText（AI 打字效果，防 StrictMode 双触发）
- SelectionMenu + BottomFloatingPanel（X01-X04 划词功能）
- AskAIPanel（知识库级原地 AI 对话浮层）
- RecentSection、RecentItemCard、RecentCompactRow（最近内容复用）
- MultiSelectActionBar（全局多选批量操作）
- SmartGenerateBubble（K08/Q07 右下角一键生成轻应用气泡）
- SwipeableListItem（K01/K05 侧滑操作）
- TemplateCard（Q01 + T09 复用）
- DataSourceSelectorSheet（T03 数据源选择）
- SearchBar（K01 全局搜索）

### 已建页面（51 个）

| 模块 | 页面 | 关键功能 |
|---|---|---|
| G | 闪屏、ComingSoon | 动画自动跳转 |
| K01 | 知识库主页 | 搜索/发现切换、最近内容、滑动操作（重命名/删除/取关）、多选、顶部蹲守提示条 |
| K05 | 知识库详情 | 5 种管理方式视图、蹲一下入口、ask AI 悬浮条、AI 模式标识条 |
| K06 | 添加内容 BottomSheet | 粘贴链接行 + 最近横滑 + 自动 6 + 手动 4 横滑小图标 |
| K14 | 通用 A 类来源页 | 6 来源统一容器（浏览器历史/微信收藏/截图/下载/邮件/网盘） |
| K15 | 上传文件 | mock 文件选择器 + 确认页 |
| K16 | 第三方分享引导 | 简化版引导（删除原三步教程） |
| K17 | AI 对话保存 | 选平台 + 对话列表 + 单条导入 |
| K18 | 扫一扫 | 相机 mock + 1.5s 后识别结果 |
| K07 | 上传中 | 3 文件进度动画 |
| K08 | 文件详情 | 阅读/编辑、划词 X01-X04、SmartGenerateBubble、保存到库 |
| K09 | 文件夹详情 | 基础目录 |
| K10 | 知识广场 | KB 卡片、分类胶囊、订阅/取关 |
| K11 | KB 详情 | Hero + 内容列表 + 吸底订阅按钮 |
| K13 | 最近全部 | 类型筛选 + 网格/列表视图 + 排序 |
| W01 | 蹲守管理 | 4 步创建向导、任务卡片、暂停/恢复 |
| W02 | 今日内容 | 已读/未读、全部已读、平台标识 |
| Q01 | 问一问首页 | Explore LOGO、模式切换、轻应用快捷区 |
| Q02 | 妙招底部弹层 | 总结/翻译/润色/续写 |
| Q03 | 选知识库 | 选择 |
| Q04 | AI 回答首轮 | StreamingText + 来源卡 + 保存到库 |
| Q05 | AI 回答多轮 | 气泡布局 + 折叠逻辑 |
| Q06 | 网页搜索结果 | 结果列表 |
| Q07 | 网页文章详情 | 阅读 + 划词 + 保存到库 |
| T01-T10 | 轻应用生成全流程 | 模板匹配 + 旅行规划 + 数据源选择 + PWA 运行 |
| M01 | 我的主页 | 基础信息 |
| M02 | 个人资料 | 昵称编辑 |

---

## 🔲 待完成

| 任务 | 优先级 | 说明 |
|---|---|---|
| K12 订阅成功状态 | 低 | K11 已有状态变化 |

---

## 已知隐患

1. **StrictMode 双 effect** — 流式打字 dev 可能双触发，cleanup 已处理
2. **K07 进度动画** — `finished` ref 依赖可能 StrictMode 下双触发，flag 防护已加
3. **M02 昵称编辑** — blur+onClick 双触发，无副作用但可优化

---

## 历史完善记录（R1–R33 概要）

- **R1–R7**：基础框架、路由、Tab 布局、Vite/Vercel 部署
- **R8**：删除独立 Notes 模块，全部迁移为「我的速记」知识库 + note 类型文件
- **R9–R10**：K06 来源网格 7 种来源、K01 最近区域、多选批量操作
- **R11**：Q01 Explore LOGO、轻应用模板库 T09/T10
- **R12–R13**：保存入口收敛到 SaveToKnowledgeBaseSheet
- **R14–R16**：文件类型视觉统一、Q01 首屏压缩优化
- **R17–R18**：SwipeableListItem 手势修复、保存入口统一
- **R19**：T03 数据源选择器 DataSourceSelectorSheet
- **R20–R22**：K05 底部 Ask AI 布局修复、SmartGenerateBubble
- **R23–R24**：SaveToKnowledgeBaseSheet 搜索框、K01 最近区改版
- **R25–R27**：5 种知识库管理方式完整实现（project/output/idea/ai/free）
- **R28–R30**：K06 快捷卡多选批量添加、K05 管理方式入口条
- **R31–R33**：null 状态空态、自由收纳模式、管理方式选择浮层优化
- **R34**：K10 知识广场改为 KB 卡片设计，K11 改为 KB 详情页
- **R35**：蹲一下功能全套（WatchContext、W01 蹲守管理、W02 今日内容、K05 状态条、Q01 提示条）
- **R36**：K06 添加内容抽屉重构——自动同步 6 + 手动添加 4 + 网盘二级 BottomSheet + 6 个 A 类来源页（K14 统一容器）+ 4 个 B 类页（K15/K16/K17/K18）；删除原 3 组来源教程视图和 `/knowledge/recent-browsing` ComingSoon 路由
- **R37**：K05 删第二大脑模式「今日新进 8 条」卡 + CODE 模式「7 篇资料正在路上」进度卡；WatchContext mock 从 1 个知识库扩展到 5 个（kb_project_browser 3 任务 / kb1 2 / kb2 2 / kb3 2 / kb_output_review 1），K05 顶部蹲守状态条按当前 KB 动态显示运行中任务数和今日新进数
- **R38**：K10 知识广场各分类 mock 数据扩充——`mockDiscoverKbs` 从 6 个扩展到 51 个，9 个分类（推荐/科技/职场/财经/生活/健康/教育/产业/人文/法律）每个都有 5-7 张卡片分本周热门 / 你可能感兴趣两组。`DiscoverKb` 新增 `inRecommend` 字段，K10 的「推荐」tab 只展示这 6 张精选 KB，其它分类按 `category` 过滤
- **R39**：蹲守提示条从 Q01 首页搬到 K01 知识库主页——Q01 移除 useWatch + "🎯 今天蹲到 X 条"横条，K01 在 TopHeader 与 RecentSection 之间加 lucide Target 图标 + 浅橙底通栏（todayUnread > 0 才显示，跳 /watch/today）；K05「自动整理与维护」模式下管理方式标识条上的橙色「重新整理」文字按钮删除，AI 状态卡内的「重新整理」按钮保留
- **R40**：K06 添加内容抽屉重构为入口卡模式——删除原 6+4 大方块网格 + 粘贴链接大输入框 + "自动同步/手动添加"分组标题；改为 5 区块：TopHeader（取消/添加内容/28px 占位）+ 粘贴链接行卡片（输入合法 URL 后图标变绿 ✓ 出现保存按钮）+ 最近浏览/下载横滑（130×84 卡 + 多选）+ 自动同步入口行卡（橙 RefreshCw）+ 手动添加入口行卡（灰 Hand）。新增 K19/K20 二级页面分别展开 6 个自动同步源和 4 个手动添加源，路径 `/knowledge/:kbId/add-from-auto` 和 `/knowledge/:kbId/add-from-manual`。所有行卡片严格统一规格（白底、1px #EEEEEE、12px 圆角、padding 12px、左右 margin 16px、36×36 图标 10px 圆角）。原网盘 picker 移除，cloud 直接进 `/knowledge/add-from/cloud-files`
- **R41**：旅行计划本 PWA 全套重做——订阅 KB「旅行美食圈」改名「日本旅行攻略」（📖 浅青底，攻略局，256 内容/12.8k 订阅）。T03 仅 travel-plan 模板下显示「行程偏好」区块（预算 4 单选 / 酒店 4 多选 / 偏好类型 5 多选 / 出行成员 4 单选 / 出行天数加减步进器），默认舒适+精品酒店+历史+美食+情侣+7 天。pwaTemplates 中 travel-plan 的 targetRuntimeType 改为 `travel_planner`，T07 新增 travel_planner 形态（青色 #14B8A6）：青色头图卡 + 机票横滑 3 张（最便宜/推荐/次选角标）+ 酒店横滑 3 张（AI 推荐角标）+ 实用信息 2×2（天气/汇率/签证/攻略数）+ 7 天行程折叠（Day 1-2 默认展开）+ 底部橙色 AI 助手卡。偏好通过 navigate state 透传 T03→T04→T05，T04 完成时通过 `updateApp` 写入 LightApp.travelPreferences，T07 从 app 读取并构造副标题。T04 旅行步骤 1 文字改为「理解您的旅行偏好」，customRequirement 非空时插入「识别到补充需求...」步骤。删除原 daily_tracker 旅行 mock 数据（INIT_ITINERARY / AddItinerarySheet / TravelTrackerForm）
- **R42**：K06 视觉微调——最近浏览/下载卡片标题溢出修复：130×84 box-border + flex column + 24×24 图标 + 标题 `white-space: nowrap; text-overflow: ellipsis` 强制单行 + 时间 `mt-auto` 贴底。自动同步/手动添加从"行卡片入口"改为"横滑小图标列表"（48×48 emoji 方块 + 11px 标签，6+4 项）。删除 K19/K20 二级中转页和路由，恢复网盘 CloudPickerSheet（5 个网盘的 BottomSheet）
- **R43**：T03 行程偏好折叠化 + T07 旅行底部按钮接交互。T03 仅 `travel-plan` 模板显示「行程偏好」行卡片，视觉与上面 3 行（数据源/功能模块/访问方式）完全一致（bg-surface-card + brand-orange-light 36px 图标方块），右侧 ChevronDown/Up；默认折叠，未填时副文案橙色「请填写预算、酒店等偏好」，已填时拼接摘要（如「舒适 ¥5,000-1.5万 · 精品酒店 · 历史 + 美食 · 情侣 · 7 天」）。展开用 framer-motion AnimatePresence（height/opacity 0→auto，0.22s easeOut），下方白底卡片承载 5 字段。T03 读取 `state.fromEdit` 时 TopHeader 改「调整需求」、底部按钮改「重新生成」。T07 旅行 runtime「调整需求」按钮 navigate 到 `/pwa/confirm` 携带 fromEdit + templateId + resultAppId + travelPreferences + customRequirement；「导出行程」按钮唤起新建的 `ExportItinerarySheet`（4 选项：PDF/日历/微信/复制链接，点击 mock Toast + 关闭）。两按钮加 `active:scale-95`。LightApp 新增可选字段 `customRequirement`；T04 完成时 updateApp 同时写入 travelPreferences 和 customRequirement。新增依赖 framer-motion ^12
