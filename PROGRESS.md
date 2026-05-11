# Demo 开发进度

> 最后更新：第七轮（清理 + 准备发布）

---

## ✅ 已完成

### 基础工程
- [x] Vite + React + TypeScript 初始化
- [x] Tailwind CSS v3 配置（设计 token 完整对应文档第 5 节）
- [x] React Router v6 路由配置
- [x] lucide-react 图标库
- [x] 4 个 Context（UserContext / KnowledgeContext / NotesContext / AppsContext）
- [x] mock/data.ts 完整数据结构（13 个文件，3 个个人 KB，2 个订阅 KB）
- [x] 390×844 手机框 PhoneFrame（带状态栏）

### 通用组件（src/components/）
| 组件 | 路径 | 说明 |
|---|---|---|
| BottomTabBar | layout/ | 4 tab，路由驱动高亮 |
| TopHeader | layout/ | 大标题/返回/右操作区 |
| TabLayout | layout/ | Tab 页面容器 |
| PageLayout | layout/ | 二级页面容器 |
| PhoneFrame | layout/ | 手机壳 |
| Toast | common/ | 顶部滑入，2 秒消失，成功/错误 |
| ConfirmDialog | common/ | 标题+描述+双按钮，支持危险色 |
| ListItem | common/ | 图标+标题+描述+右值/箭头，M 模块统一复用 |
| BottomSheet | ui/ | 底部抽屉 |
| SkeletonList | ui/ | 列表骨架屏 |

### 新增共享组件（R5 / R6 / R7）

| 组件 | 路径 | 说明 |
|---|---|---|
| StreamingText | common/ | AI 打字流式组件，`render(text, streaming)` prop，统一替代 setInterval 手写 |
| SelectionMenu | common/ | X01 划词黑色胶囊菜单，支持 bottomPx 偏移，复用于 K08/Q07/N06 |
| BottomFloatingPanel | common/ | X02/X03/X04 浮层容器，轻量替代 BottomSheet |
| SaveToKBSheet | common/ | Q09 保存到知识库底部抽屉，复用于 Q04/Q05/Q07 |
| useTextSelection | hooks/ | 跨平台文字选取 hook（mouseup + touchend），封装 Selection API |
| Q02_MagicMenu | pages/ask/ | 妙招底部弹层，支持 AI / 网页搜索 / 任务模式预填 |
| N03_NewNoteMenu | pages/notes/ | 新建笔记底部菜单，复用于 N02 空态/列表 |
| K06_UploadSource | pages/knowledge/ | 上传来源 BottomSheet 组件，供 K05 调起 |

### 发布准备（R7）
- [x] Vite `base: '/'`
- [x] Vercel SPA rewrites：根目录与 `app/` 各有 `vercel.json`
- [x] README 更新本地启动与 Vercel 部署步骤
- [x] `package.json` 使用 `prebuild: tsc -b` + `build: vite build`

### 已建页面（40+ / 39）

| ID | 页面 | 状态 | 轮次 |
|---|---|---|---|
| G01 | 闪屏 | ✅ 动画自动跳转 | R1 |
| G- | 开发中占位页 /coming-soon | ✅ | R2 |
| **K01** | **知识库主页（含 K02 / K03 抽屉）** | **✅ 完全重写：accordion 分区 + 创建抽屉** | **R4** |
| **K02** | **知识库切换器（Bottom Sheet）** | **✅ 内联于 K01** | **R4** |
| **K03** | **新建知识库（Bottom Sheet）** | **✅ 内联于 K01，含 AI 设置 toggle** | **R4** |
| **K04** | **工作资料（空态）** | **✅ 与 K05 合并为 K05_KnowledgeDetail** | **R4** |
| **K05** | **工作资料（有文件）** | **✅ 含文件类型图标 / 筛选 Tab / 调起 K06 抽屉** | **R7** |
| **K06** | **上传选择来源（Bottom Sheet）** | **✅ 独立 BottomSheet 组件，3×2 网格 + AI 一键导入** | **R7** |
| **K07** | **上传中页面** | **✅ 完全重写：3 张文件卡 / 进度动画 / 底部提示** | **R4** |
| **K08** | **文件详情阅读（含 K09 目录）** | **✅ 完全重写：AI 摘要卡 / 表格渲染 / AI 助手浮层 / 划词菜单** | **R4** |
| K10 | 知识库广场 | ✅ 分类筛选 | R7 |
| K11 | 团队详情 | ✅ 订阅可用 | R1 |
| Q01 | 问一问首页 | ✅ 三模式 + Q02 妙招弹层 | R6 |
| Q02 | 妙招菜单展开 | ✅ 底部弹层 + 模式预填 | R6 |
| Q03 | 选知识库 | ✅ | R1 |
| **Q04** | **AI 回答首轮** | **✅ 重写：进度步骤卡 + StreamingText + Q09 保存** | **R5** |
| **Q05** | **AI 回答多轮** | **✅ 重写：气泡布局 + 正确折叠逻辑 + StreamingText** | **R5** |
| Q06 | 网页搜索结果 | ✅ | R1 |
| **Q07** | **网页文章详情（含 Q08/Q09）** | **✅ 重写：暖色背景 + 整理为笔记 + 操作行 + X01-X04** | **R5** |
| T01 | 任务模式 | ✅ | R1 |
| T02 | 任务结果 | ✅ | R1 |
| T03 | 生成确认 | ✅ | R1 |
| T04 | 生成中进度 | ✅ | R1 |
| T05 | 数据源确认 | ✅ | R1 |
| T06 | 已添加到桌面 | ✅ | R1 |
| T07 | 轻应用运行（含搜索）| ✅ `/pwa/run/:id` 按 app id 渲染 | R7 |
| T08 | 我的轻应用列表 | ✅ 卡片跳 `/pwa/run/:id` | R7 |
| N01 | 笔记空态 | ✅ 已删除独立页，合并进 N02 | R7 |
| N02 | 笔记列表（含 Tag 筛选）| ✅ 内置空态 + N03 新建菜单 | R7 |
| N03 | 新建浮窗（轻量菜单）| ✅ 共享 BottomSheet 组件 | R7 |
| N04 | AI 帮我写 | ✅ 模板选择 + mock 参考素材 | R7 |
| N05 | 笔记编辑 | ✅ Markdown 工具栏 / 流式生成 / 编辑模式 / 删除确认 / 外部预填 API | R7 |
| **N06** | **笔记详情（含反向链接 N08 + X01-X04）** | **✅ 加入 useTextSelection + 划词全套面板** | **R5** |
| M01 | 我的主页 | ✅ 完全重写，贴近原型 | R2 |
| M02 | 个人资料 | ✅ 内联昵称编辑 + stub 入口跳占位页 | R7 |

---

## 🔲 待完成

| ID | 页面 | 优先级 | 备注 |
|---|---|---|---|
| K12 | 订阅成功状态 | 低 | K11 已做状态变化 |
| Q02 | 妙招菜单展开 | ✅ | 已独立为 Q02_MagicMenu |
| Q08 | AI 助手浮层（独立）| 低 | Q07/K08 已内联 |
| Q09 | 保存到知识库 | ✅ | SaveToKBSheet 共享组件，已用于 Q04/Q05/Q07 |
| X01 | 划词菜单 | ✅ | SelectionMenu 共享组件，K08/Q07/N06 已接入 |
| X02 | 划词追问浮层 | ✅ | BottomFloatingPanel，K08/Q07/N06 已内联 |
| X03 | 划词翻译浮层 | ✅ | BottomFloatingPanel，K08/Q07/N06 已内联 |
| X04 | 划词解释浮层 | ✅ | BottomFloatingPanel，K08/Q07/N06 已内联 |
| N03 | 新建浮窗（独立）| ✅ | 已独立为 N03_NewNoteMenu，并接入 N02 |
| N07 | 更多操作菜单 | 低 | ✅ N05 已内联（含删除确认）|
| N08 | 反向链接面板 | 低 | ✅ N06 已内联 |
| G02 | 通用错误页 | 低 | |

---

## ⚠️ 已知隐患

1. ~~**划词用 `onMouseUp`**~~ — ✅ 已修：`useTextSelection()` hook 同时绑定 mouseup + touchend
2. **StrictMode 双 effect** — 流式打字 dev 模式可能触发两次，cleanup 已处理
3. ~~**K11 路由参数**~~ — ✅ 已修：非法团队 id 显示空态，不再回退到 teams[0]
4. **K07 进度动画** — `finished` ref 依赖可能导致 StrictMode 下双触发，已用 flag 防护
5. **M02 昵称编辑** — blur+onClick 双触发，无副作用但可优化

## R7 清理记录

- 删除 `/knowledge/create` 路由与 `K03_CreateKnowledge.tsx` 独立页，保留 K01 内嵌创建知识库抽屉。
- 删除 `/notes/empty` 路由与 `N01_NotesEmpty.tsx` 独立页，N02 自己根据数据为空显示空态。
- 删除 `/me/apps` 入口，统一使用 `/profile/my-apps`。
- `/ask/task-app` 仅保留兼容重定向，正式轻应用运行路径为 `/pwa/run/:id`。
