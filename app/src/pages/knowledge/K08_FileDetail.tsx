import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  Bold,
  Bookmark,
  ChevronLeft,
  Hash,
  Image,
  Italic,
  LayoutList,
  Link,
  List,
  MoreHorizontal,
  Send,
  Sparkles,
} from 'lucide-react'
import BottomSheet from '../../components/ui/BottomSheet'
import BottomFloatingPanel from '../../components/common/BottomFloatingPanel'
import DocumentActionSheet from '../../components/common/DocumentActionSheet'
import HighlightedText from '../../components/common/HighlightedText'
import DocumentReader, { AnnotationListSheet, useDocumentReader } from '../../components/common/DocumentReader'
import SaveToKnowledgeBaseSheet from '../../components/common/SaveToKnowledgeBaseSheet'
import SmartGenerateBubble from '../../components/common/SmartGenerateBubble'
import Toast from '../../components/common/Toast'
import { useAnnotations } from '../../context/AnnotationContext'
import { useKnowledge, type SaveSourceContent } from '../../context/KnowledgeContext'
import { useUser } from '../../context/UserContext'
import { type KnowledgeFile, mockFiles } from '../../mock/data'

// ── Rich document content map ─────────────────────────────────────────────────
const DOCS: Record<string, { summary: string; content: string }> = {
  f1: {
    summary: '深入分析知识管理工具竞争格局，主流产品 AI 检索精准度普遍不足，"可溯源的 AI 回答"是下一代竞争焦点。企业级产品移动端体验严重滞后，机会窗口明显。',
    content: `## 一、行业现状

2023–2026 年全球知识管理软件市场规模预计从 136 亿元增长至 177 亿元，年复合增长率 9.2%。驱动力来自远程协作常态化、企业知识资产意识提升，以及 AI 大模型对传统检索方式的颠覆性重塑。

主流赛道已从"文档存储"演进为"知识中枢 + AI 问答"，各梯队玩家边界加速模糊。

来源：Statista Market Insights, 2024

## 二、主流竞品矩阵

| 产品 | 定位 | 核心优势 | AI 能力 | 移动端 |
|---|---|---|---|---|
| Notion | 全功能工作台 | 灵活度高、生态成熟 | 写作辅助为主 | 一般 |
| Confluence | 企业协作文档 | 权限体系完善 | 搜索增强 | 弱 |
| Perplexity | AI 搜索引擎 | 实时网页检索 | 核心能力 | 中等 |
| Obsidian | 个人知识图谱 | 双向链接、本地化 | 插件依赖 | 弱 |
| 飞书兴趣库 | 国内企业协作 | 与飞书套件联动 | 搜索 + 摘要 | 良好 |

**核心发现：**

- 企业级产品普遍缺乏移动端优先的交互设计，移动场景下用户体验断层明显
- AI 检索精准度仍是用户最大痛点，大多数产品停留在"关键词增强"阶段
- "可溯源的 AI 回答"尚属空白，用户在决策场景中不敢直接采用 AI 结论

## 三、关键洞察

基于对 200+ 用户的调研数据，知识管理工具的核心诉求集中在三个层面：

1. **快速检索**：用户希望在 3 秒内找到目标信息，容忍度极低
2. **AI 理解**：不仅是搜索，而是真正"懂"用户意图，输出结构化答案
3. **无缝协作**：个人知识与团队知识的边界管理需要更清晰的权限设计

用户对 AI 回答的信任建立在"能看见出处"上。调研显示，展示来源后采信率提升 34%，追问率下降 18%。

## 四、机会分析

- **移动端优先**：市场中尚无一款真正以移动端为主场景设计的 AI 知识产品
- **AI 溯源**：将 AI 回答与兴趣库文档精确关联，是高频决策用户的核心需求
- **个人 + 团队双模**：无缝切换个人私有库与订阅团队库，降低信息孤岛风险`,
  },
  f5: {
    summary: '286 名活跃用户季度调研结果。"检索焦虑"首次超越"内容过载"成为第一痛点；移动端体验满意度最低（3.1/5）；75% 用户愿意为"AI 可溯源回答"付费。',
    content: `## 一、调研背景与方法

本次调研于 2026 年 Q3 进行，覆盖 286 名月活用户。采用在线问卷（234 份）+ 深度访谈（52 人）双轨并行，问卷通过 App 内推送，访谈通过视频会议完成。

样本结构：产品经理 38%、工程师 29%、设计师 18%、其他岗位 15%。

## 二、核心痛点排名

| 排名 | 痛点描述 | 提及率 | 同比变化 |
|---|---|---|---|
| 1 | 找不到想要的内容（检索焦虑）| 67% | ↑ 12% |
| 2 | 内容太多不知从哪下手 | 54% | ↓ 3% |
| 3 | AI 回答不可信、无出处 | 48% | ↑ 18% |
| 4 | 移动端体验差 | 43% | ↑ 9% |
| 5 | 跨设备同步延迟 | 31% | — |

**关键发现**："检索焦虑"首次超越"内容过载"成为第一痛点，反映出随着用户存储内容增多，召回体验的重要性急剧上升。

## 三、用户分群画像

**重度用户（日均使用 > 30 分钟，占比 28%）**
- 核心场景：会议准备、竞品调研、周报写作
- 主要痛点：检索精准度、AI 回答质量
- 付费意愿：高，月均 ARPU 234 元

**中度用户（日均使用 10–30 分钟，占比 51%）**
- 核心场景：资料查找、速记整理
- 主要痛点：操作复杂、移动端体验
- 付费意愿：中，月均 ARPU 68 元

**轻度用户（日均使用 < 10 分钟，占比 21%）**
- 核心场景：偶发性文档存储
- 主要痛点：启动成本高、学习曲线陡
- 付费意愿：低，流失风险高

## 四、功能需求优先级

用户对以下功能的需求强度评分（1–5 分）：

- **AI 可溯源回答**：4.6 分，75% 表示愿意为此付费
- **移动端优化**：4.4 分，主要诉求是快速捕捉和碎片化阅读
- **多兴趣库联合检索**：4.1 分
- **划词追问**：3.9 分，在文档阅读场景尤为强烈
- **批量导入工具**：3.7 分`,
  },
  f2: {
    summary: '以 DAU×付费率为北极星指标，Q4 目标 DAU 12万、付费率 8.5%。重点投入三条增长线：SEO 内容矩阵、产品内引导漏斗优化、企业客户拓展。',
    content: `## 一、增长目标与北极星指标

**北极星指标**：DAU × 付费率（当前：8.2万 × 6.1% = 5002 付费用户）

**Q4 目标**：DAU 12万，付费率 8.5%，对应付费用户 10200 人

核心假设：移动端体验提升使次日留存率从 41% → 52%，是 DAU 增长的主要驱动力。

## 二、用户获取渠道分析

| 渠道 | 当前占比 | CAC | 30日留存 | Q4 投入建议 |
|---|---|---|---|---|
| 自然搜索 (SEO) | 34% | ¥12 | 48% | 加大内容矩阵建设 |
| 产品内病毒传播 | 28% | ¥8 | 56% | 优化分享激励机制 |
| KOL / 内容营销 | 19% | ¥67 | 41% | 聚焦垂直产品社区 |
| 付费广告 | 12% | ¥145 | 29% | 缩减，ROI 最低 |
| 企业采购 | 7% | ¥890 | 78% | 试点企业销售团队 |

**核心结论**：自然搜索和产品内传播 CAC 最低、留存最高，Q4 应集中资源于这两条线。

## 三、留存与 LTV 提升策略

**激活阶段（0–3天）**：
- 优化 onboarding 流程，首次导入内容步骤从 7 步压缩至 3 步
- 新用户引导完成率目标：60%（现状 34%）

**习惯养成（4–30天）**：
- 智能推送"今日待回顾"，基于遗忘曲线算法
- 移动端 Widget，让兴趣库成为锁屏触手可及的工具

**深度绑定（30天+）**：
- 开放 API，与 Slack、Notion、飞书深度集成
- 团队协作功能，提升组织级留存（流失率降低 60%）

## 四、变现路径

**个人版**：免费（5GB）→ Pro（¥98/月，无限容量 + AI 高级功能）
**团队版**：¥29/人/月，最低 5 人起购，含管理后台和权限系统
**企业版**：私有化部署 + 定制化，年框合同

Q4 重点：提升免费 → Pro 转化率（目标从 6.1% → 8.5%），核心抓手是"AI 使用量达到上限"的精准触发提示。`,
  },
}

// ── Document renderer ─────────────────────────────────────────────────────────

function renderTable(lines: string[], hlTexts: string[], hlColors: Map<string, string>) {
  const dataLines = lines.filter(l => !l.match(/^\|[-| :]+\|/))
  if (dataLines.length === 0) return null
  const [headerLine, ...bodyLines] = dataLines
  const headerCells = headerLine.split('|').filter(c => c.trim() !== '')

  return (
    <div className="overflow-x-auto my-4 rounded-card border border-line-base">
      <table className="w-full min-w-full border-collapse">
        <thead>
          <tr className="bg-surface-card">
            {headerCells.map((cell, ci) => (
              <th key={ci} className="px-3 py-2 text-left text-caption font-semibold text-ink-primary whitespace-nowrap">
                {cell.trim()}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {bodyLines.map((row, ri) => {
            const cells = row.split('|').filter(c => c.trim() !== '')
            return (
              <tr key={ri} className="border-t border-line-base">
                {cells.map((cell, ci) => (
                  <td key={ci} className="px-3 py-2 text-caption text-ink-secondary whitespace-nowrap">
                    <HighlightedText text={cell.trim()} highlights={hlTexts} colorMap={hlColors} />
                  </td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function DocumentContent({ content }: { content: string }) {
  const { hlTexts, hlColors } = useDocumentReader()
  const lines = content.split('\n')
  const elements: React.ReactNode[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    if (line.startsWith('|')) {
      const tableLines: string[] = []
      while (i < lines.length && lines[i].startsWith('|')) {
        tableLines.push(lines[i])
        i++
      }
      elements.push(<div key={`tbl-${i}`}>{renderTable(tableLines, hlTexts, hlColors)}</div>)
      continue
    }

    if (line.startsWith('# ')) {
      elements.push(<h1 key={i} className="text-[22px] font-semibold text-ink-primary mt-7 mb-3 first:mt-0">{line.slice(2)}</h1>)
    } else if (line.startsWith('## ')) {
      elements.push(<h2 key={i} className="text-h2 font-semibold text-ink-primary mt-7 mb-3 first:mt-0">{line.slice(3)}</h2>)
    } else if (line.startsWith('### ')) {
      elements.push(<h3 key={i} className="text-card-title font-semibold text-ink-primary mt-5 mb-2">{line.slice(4)}</h3>)
    } else if (line.startsWith('- [ ]')) {
      elements.push(
        <div key={i} className="flex items-start gap-2 mb-1.5">
          <div className="w-4 h-4 border-2 border-line-base rounded mt-0.5 flex-shrink-0" />
          <p className="text-body text-ink-secondary"><HighlightedText text={line.slice(6)} highlights={hlTexts} colorMap={hlColors} /></p>
        </div>
      )
    } else if (line.match(/^- \*\*/) || (line.startsWith('- ') && line.length > 2)) {
      elements.push(
        <div key={i} className="flex items-start gap-2 mb-1.5">
          <span className="text-brand-orange mt-1 flex-shrink-0 text-[10px] leading-5">●</span>
          <p className="text-body text-ink-secondary"><HighlightedText text={line.slice(2)} highlights={hlTexts} colorMap={hlColors} /></p>
        </div>
      )
    } else if (line.match(/^\d+\.\s/)) {
      elements.push(
        <p key={i} className="text-body text-ink-secondary mb-1.5 pl-1">
          <HighlightedText text={line} highlights={hlTexts} colorMap={hlColors} />
        </p>
      )
    } else if (line === '') {
      elements.push(<div key={i} className="h-2" />)
    } else {
      elements.push(
        <p key={i} className="text-body text-ink-secondary mb-2 leading-relaxed">
          <HighlightedText text={line} highlights={hlTexts} colorMap={hlColors} />
        </p>
      )
    }
    i++
  }

  return <div>{elements}</div>
}

function summarizeNote(content: string) {
  return content
    .replace(/^#+\s*/gm, '')
    .split('\n')
    .map(line => line.replace(/^\s*[-*>]+\s*/, '').trim())
    .find(Boolean)
    ?.slice(0, 96) || '轻量速记内容，可继续编辑和作为 AI 上下文引用。'
}

function createNoteFile(kbId: string, title: string, content: string): KnowledgeFile {
  const safeTitle = title.trim() || '无标题速记'
  const safeContent = content.trim()
  return {
    id: `quick_note_${Date.now()}`,
    kbId,
    name: safeTitle,
    type: 'note',
    size: `${safeContent.length}字`,
    wordCount: safeContent.length,
    uploadedAt: '刚刚',
    createdAt: '刚刚',
    updatedAt: '刚刚',
    tags: ['速记'],
    summary: summarizeNote(safeContent),
    content: safeContent,
  }
}

function MarkdownNoteEditor({
  file,
  initialTitle,
  initialContent,
  onSave,
  onCancel,
}: {
  file: KnowledgeFile | null
  initialTitle: string
  initialContent: string
  onSave: (payload: { title: string; content: string }) => void
  onCancel: () => void
}) {
  const [title, setTitle] = useState(initialTitle)
  const [content, setContent] = useState(initialContent)
  const [promptKind, setPromptKind] = useState<'link' | 'image' | null>(null)
  const [promptValue, setPromptValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const selectionRef = useRef<{ start: number; end: number } | null>(null)

  const autoResize = () => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }

  useEffect(() => { autoResize() }, [content])

  const focusTextarea = (start: number, end = start) => {
    window.setTimeout(() => {
      const el = textareaRef.current
      if (!el) return
      el.focus()
      el.setSelectionRange(start, end)
      autoResize()
    }, 0)
  }

  const getSelection = () => {
    const el = textareaRef.current
    return {
      start: el?.selectionStart ?? content.length,
      end: el?.selectionEnd ?? content.length,
    }
  }

  const replaceRange = (start: number, end: number, inserted: string, cursorStart?: number, cursorEnd?: number) => {
    const next = content.slice(0, start) + inserted + content.slice(end)
    setContent(next)
    focusTextarea(cursorStart ?? start + inserted.length, cursorEnd ?? cursorStart ?? start + inserted.length)
  }

  const wrapSelection = (before: string, after: string, placeholder: string) => {
    const { start, end } = getSelection()
    const selected = content.slice(start, end) || placeholder
    const inserted = `${before}${selected}${after}`
    const selectionStart = start + before.length
    replaceRange(start, end, inserted, selectionStart, selectionStart + selected.length)
  }

  const insertList = () => {
    const { start, end } = getSelection()
    const selected = content.slice(start, end)
    const inserted = selected
      ? selected.split('\n').map(line => line.trim().startsWith('- ') ? line : `- ${line}`).join('\n')
      : '- '
    replaceRange(start, end, inserted)
  }

  const insertHeading = () => {
    const { start, end } = getSelection()
    const selected = content.slice(start, end) || '标题'
    const prefix = start > 0 && !content.slice(0, start).endsWith('\n') ? '\n' : ''
    const inserted = `${prefix}# ${selected}`
    const selectionStart = start + prefix.length + 2
    replaceRange(start, end, inserted, selectionStart, selectionStart + selected.length)
  }

  const openUrlPrompt = (kind: 'link' | 'image') => {
    selectionRef.current = getSelection()
    setPromptValue('')
    setPromptKind(kind)
  }

  const confirmUrlInsert = () => {
    if (!promptKind || !promptValue.trim()) return
    const { start, end } = selectionRef.current ?? getSelection()
    const selected = content.slice(start, end)
    const url = promptValue.trim()
    const inserted = promptKind === 'link'
      ? `[${selected || '链接文本'}](${url})`
      : `![${selected || '图片描述'}](${url})`
    setPromptKind(null)
    setPromptValue('')
    replaceRange(start, end, inserted)
  }

  const toolbarIcons = [
    { Icon: Bold, label: '加粗', action: () => wrapSelection('**', '**', '加粗文字') },
    { Icon: Italic, label: '斜体', action: () => wrapSelection('_', '_', '斜体文字') },
    { Icon: List, label: '列表', action: insertList },
    { Icon: Hash, label: '标题', action: insertHeading },
    { Icon: Link, label: '链接', action: () => openUrlPrompt('link') },
    { Icon: Image, label: '图片', action: () => openUrlPrompt('image') },
  ]

  return (
    <div className="flex flex-col h-full relative bg-white">
      <div className="flex items-center h-14 px-4 border-b border-line-base flex-shrink-0">
        <button onClick={onCancel} className="p-1 -ml-1 mr-2 text-ink-secondary">
          <ChevronLeft size={24} />
        </button>
        <span className="flex-1 text-caption text-ink-placeholder truncate">
          {title || (file ? '编辑速记' : '新建速记')}
        </span>
        <button
          onClick={() => onSave({ title, content })}
          className="px-3.5 py-1.5 bg-brand-orange text-white text-caption font-medium rounded-btn"
        >
          保存
        </button>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <div className="px-5 pt-4 pb-6">
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="标题"
            className="w-full text-[22px] font-semibold text-ink-primary outline-none bg-transparent placeholder:text-ink-placeholder pb-3 mb-4 border-b border-line-base"
          />
          <textarea
            ref={textareaRef}
            value={content}
            onChange={e => { setContent(e.target.value); autoResize() }}
            placeholder="开始写速记..."
            className="w-full text-body text-ink-primary outline-none bg-transparent placeholder:text-ink-placeholder resize-none leading-[1.75] min-h-[320px]"
          />
        </div>
      </div>

      <div className="flex-shrink-0 border-t border-line-base bg-white">
        <div className="flex items-center px-3 py-2 gap-0.5">
          {toolbarIcons.map(({ Icon, label, action }) => (
            <button
              key={label}
              onClick={action}
              title={label}
              className="p-2 rounded text-ink-placeholder active:bg-surface-card transition-colors"
            >
              <Icon size={18} />
            </button>
          ))}
          <div className="flex-1" />
        </div>
      </div>

      <BottomSheet
        open={promptKind !== null}
        onClose={() => setPromptKind(null)}
        title={promptKind === 'image' ? '插入图片' : '插入链接'}
      >
        <div className="px-5 py-3 space-y-3">
          <input
            value={promptValue}
            onChange={e => setPromptValue(e.target.value)}
            placeholder={promptKind === 'image' ? '输入图片 URL' : '输入链接 URL'}
            className="w-full px-4 py-3 bg-surface-card rounded-card border border-line-base text-body text-ink-primary outline-none placeholder:text-ink-placeholder"
            autoFocus
          />
          <button
            onClick={confirmUrlInsert}
            disabled={!promptValue.trim()}
            className="w-full py-3 bg-brand-orange text-white rounded-btn text-body font-medium disabled:opacity-40"
          >
            插入
          </button>
        </div>
      </BottomSheet>
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function K08_FileDetail() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const { activeFile, activeBase, bases, subscribedBases, addFile, updateFile, deleteFile, setActiveFile, quickNotesBase } = useKnowledge()
  const { showToast } = useUser()
  const { getAnnotationsByDoc } = useAnnotations()

  const routeState = (state as { createNote?: boolean; kbId?: string } | null) ?? {}
  const creatingNote = !!routeState.createNote
  const file = creatingNote
    ? null
    : (activeFile ?? mockFiles[0])
  const isNoteFile = creatingNote || file?.type === 'note'
  const doc = isNoteFile
    ? {
        summary: summarizeNote(file?.content ?? ''),
        content: file?.content ?? '',
      }
    : (DOCS[file?.id ?? ''] ?? (file?.content
        ? { summary: file.summary ?? '这是一份从工作流阶段打开的资料。', content: file.content }
        : DOCS['f1']))
  const docId = file?.id ?? 'new-quick-note'
  const docType = isNoteFile ? 'note' : 'knowledge'

  const docAnnotations = getAnnotationsByDoc(docId, docType)

  const [showTOC,         setShowTOC]         = useState(false)
  const [showAiAssist,    setShowAiAssist]    = useState(false)
  const [showActionSheet, setShowActionSheet] = useState(false)
  const [showKbSheet,     setShowKbSheet]     = useState(false)
  const [showAnnotations, setShowAnnotations] = useState(false)
  const [showX02,         setShowX02]         = useState(false)
  const [showX03,         setShowX03]         = useState(false)
  const [showX04,         setShowX04]         = useState(false)
  const [x02Input,        setX02Input]        = useState('')
  const [aiInput,         setAiInput]         = useState('')
  const [bookmarked,      setBookmarked]      = useState(false)
  const [pendingText,     setPendingText]     = useState('')
  const [savePayload,     setSavePayload]     = useState<SaveSourceContent>({ title: file?.name ?? '文档保存', body: doc.content, type: 'document' })
  const [saveSheetTitle,  setSaveSheetTitle]  = useState('添加到兴趣库')
  const [editingNote,     setEditingNote]     = useState(creatingNote)
  const selectionSaveCountRef = useRef(0)

  const handleAction = (action: string, text: string) => {
    setPendingText(text)
    switch (action) {
      case 'AI 追问':
      case '追问':
        setX02Input(''); setShowX02(true); break
      case '翻译': setShowX03(true); break
      case '解释': setShowX04(true); break
      case '入库': {
        selectionSaveCountRef.current += 1
        const excerptType: SaveSourceContent['type'] =
          displayFile.type === 'pdf' ? 'pdf_excerpt' :
          displayFile.type === 'note' ? 'note_excerpt' :
          'doc_excerpt'
        openKbSheet(
          `《${displayFile.name}》节选 - 划线 ${selectionSaveCountRef.current}`,
          text,
          excerptType,
          '保存划线内容',
          {
            originalFileId: displayFile.id,
            originalFileName: displayFile.name,
            excerpt: text,
            pageNumber: undefined,
            createdAt: new Date().toISOString(),
          },
        )
        break
      }
    }
  }

  const openKbSheet = (
    title: string,
    body: string,
    type: SaveSourceContent['type'] = 'document',
    sheetTitle = '添加到兴趣库',
    metadata?: SaveSourceContent['metadata'],
  ) => {
    setSavePayload({ title, body, type, metadata })
    setSaveSheetTitle(sheetTitle)
    setShowKbSheet(true)
  }

  const handleNoteSave = ({ title, content }: { title: string; content: string }) => {
    const trimmedContent = content.trim()
    if (!title.trim() && !trimmedContent) {
      navigate('/knowledge/detail')
      return
    }
    if (file && file.type === 'note') {
      const safeTitle = title.trim() || '无标题速记'
      updateFile(file.id, {
        name: safeTitle,
        content: trimmedContent,
        summary: summarizeNote(trimmedContent),
        size: `${trimmedContent.length}字`,
        wordCount: trimmedContent.length,
        updatedAt: '刚刚',
        uploadedAt: file.uploadedAt,
      })
      showToast('已保存到「我的速记」')
      setEditingNote(false)
      return
    }

    const kbId = routeState.kbId ?? activeBase?.id ?? quickNotesBase.id
    const targetName = activeBase?.id === kbId ? activeBase.name : quickNotesBase.name
    const nextFile = createNoteFile(kbId, title, trimmedContent)
    addFile(nextFile)
    setActiveFile(nextFile)
    showToast(`已保存到「${targetName}」`)
    setEditingNote(false)
    navigate('/knowledge/file-detail', { replace: true })
  }

  if (editingNote) {
    return (
      <MarkdownNoteEditor
        file={file}
        initialTitle={file?.name ?? ''}
        initialContent={file?.content ?? ''}
        onSave={handleNoteSave}
        onCancel={() => {
          if (creatingNote || !file) navigate('/knowledge/detail')
          else setEditingNote(false)
        }}
      />
    )
  }

  const displayFile = file ?? mockFiles[0]
  const sourceBase = activeBase?.id === displayFile.kbId
    ? activeBase
    : [...bases, ...subscribedBases].find(base => base.id === displayFile.kbId)

  return (
    <div className="flex flex-col h-full relative bg-white">

      {/* ── Header ── */}
      <div className="flex-shrink-0 flex items-center h-14 px-4 border-b border-line-base bg-white">
        <button onClick={() => navigate(-1)} className="p-1 -ml-1 mr-2 text-ink-secondary">
          <ChevronLeft size={24} />
        </button>
        <span className="flex-1 text-card-title text-ink-primary truncate">{displayFile.name}</span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => { setBookmarked(v => !v); showToast(bookmarked ? '已取消收藏' : '已收藏') }}
            className="p-2 text-ink-secondary"
          >
            <Bookmark size={20} className={bookmarked ? 'fill-brand-orange text-brand-orange' : ''} />
          </button>
          <button onClick={() => setShowTOC(true)} className="p-2 text-ink-secondary">
            <LayoutList size={20} />
          </button>
          <button onClick={() => setShowActionSheet(true)} className="p-2 text-ink-secondary">
            <MoreHorizontal size={20} />
          </button>
        </div>
      </div>

      {displayFile.workflowStage && (
        <div className="flex-shrink-0 bg-[#FFF1E6] px-5 py-2 text-[13px] leading-5 text-[#4A4A4A]">
          该资料在【{displayFile.workflowStage}】阶段
        </div>
      )}

      {/* ── Document content (wrapped in DocumentReader) ── */}
      <DocumentReader
        docId={docId}
        docType={docType}
        bottomPx={72}
        onAction={handleAction}
        className="flex-1 overflow-y-auto scrollbar-hide"
      >
        <div className="px-5 pt-5 pb-6">
          <div className="mb-5">
            <h1 className="text-[20px] font-semibold text-ink-primary mb-2">
              {displayFile.name.replace(/\.[^.]+$/, '')}
            </h1>
            <div className="flex items-center flex-wrap gap-x-3 gap-y-1">
              {displayFile.type === 'note' && <span className="text-caption text-brand-orange">速记</span>}
              {displayFile.size !== '—' && <span className="text-caption text-ink-placeholder">{displayFile.size}</span>}
              {displayFile.pageCount && <span className="text-caption text-ink-placeholder">{displayFile.pageCount} 页</span>}
              <span className="text-caption text-ink-placeholder">{displayFile.uploadedAt}</span>
            </div>
            {displayFile.tags && displayFile.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {displayFile.tags.map(tag => (
                  <span key={tag} className="text-micro px-2 py-0.5 bg-surface-card text-ink-placeholder rounded-pill">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* AI Summary card */}
          <div className="bg-brand-orange-light rounded-card p-4 mb-6">
            <div className="flex items-center gap-1.5 mb-2">
              <Sparkles size={13} className="text-brand-orange" />
              <span className="text-caption font-semibold text-brand-orange">AI 摘要</span>
            </div>
            <p className="text-body text-ink-primary leading-relaxed">{doc.summary}</p>
            <div className="flex gap-2 mt-3">
              {['复制摘要', '保存到库'].map(a => (
                <button
                  key={a}
                  onClick={() => {
                    if (a === '保存到库') openKbSheet(`${displayFile.name} 摘要`, doc.summary)
                    else { navigator.clipboard.writeText(doc.summary).catch(() => {}); showToast('摘要已复制') }
                  }}
                  className="px-2.5 py-1 bg-white/70 rounded-pill text-caption text-brand-orange border border-brand-orange/20"
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          <DocumentContent content={doc.content} />
        </div>
      </DocumentReader>

      <SmartGenerateBubble
        doc={{
          id: displayFile.id,
          title: displayFile.name,
          type: displayFile.type,
          wordCount: displayFile.wordCount,
          summary: displayFile.summary,
          content: doc.content,
        }}
        sourceKbId={sourceBase?.id ?? displayFile.kbId}
        sourceKbName={sourceBase?.name}
      />

      {/* ── Bottom Ask AI bar ── */}
      <div className="flex-shrink-0 border-t border-line-base bg-white px-4 pt-2 pb-3">
        <button
          onClick={() => setShowAiAssist(true)}
          className="w-full flex items-center gap-2.5 px-4 py-3 bg-surface-card rounded-card border border-line-base text-left"
        >
          <Sparkles size={15} className="text-brand-orange flex-shrink-0" />
          <span className="text-body text-ink-placeholder flex-1">问 AI 关于这篇内容…</span>
          <Send size={15} className="text-ink-placeholder flex-shrink-0" />
        </button>
      </div>

      {/* ── K09 TOC ── */}
      <BottomSheet open={showTOC} onClose={() => setShowTOC(false)} title="目录">
        <div className="px-5 py-3">
          {displayFile.toc && displayFile.toc.length > 0 ? (
            <div className="space-y-0.5">
              {displayFile.toc.map(item => (
                <button
                  key={item.id}
                  onClick={() => setShowTOC(false)}
                  className={`w-full text-left py-2.5 px-3 rounded-card transition-colors hover:bg-surface-card ${
                    item.level === 1 ? 'text-body font-medium text-ink-primary' : 'text-body text-ink-secondary pl-7'
                  }`}
                >
                  {item.title}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-body text-ink-placeholder py-4 text-center">暂无目录</p>
          )}
        </div>
      </BottomSheet>

      {/* ── AI Assistant overlay (Q08) ── */}
      <BottomSheet open={showAiAssist} onClose={() => setShowAiAssist(false)} title="AI 助手">
        <div className="px-5 py-3">
          <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-surface-card rounded-card border border-line-base">
            <span className="text-caption text-ink-placeholder">基于</span>
            <span className="text-caption text-ink-primary font-medium truncate">{displayFile.name}</span>
          </div>
          <p className="text-caption text-ink-placeholder mb-3">你可以问</p>
          <div className="space-y-2 mb-5">
            {[
              '这篇文档的核心结论是什么？',
              '有哪些数据支撑了主要观点？',
              '对我们的产品决策有什么启示？',
            ].map(q => (
              <button
                key={q}
                className="w-full text-left px-3.5 py-2.5 bg-surface-card rounded-card border border-line-base text-body text-ink-secondary"
                onClick={() => setAiInput(q)}
              >
                {q}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 px-3.5 py-2.5 bg-surface-card rounded-card border border-line-base">
            <input
              value={aiInput}
              onChange={e => setAiInput(e.target.value)}
              placeholder="输入你的问题..."
              className="flex-1 text-body text-ink-primary bg-transparent outline-none placeholder:text-ink-placeholder"
            />
            <button
              onClick={() => { setShowAiAssist(false); navigate('/ask/answer', { state: { question: aiInput, fromFile: displayFile.name } }) }}
              className="w-8 h-8 bg-brand-orange rounded-full flex items-center justify-center flex-shrink-0"
            >
              <Send size={14} className="text-white" />
            </button>
          </div>
          <div className="h-2" />
        </div>
      </BottomSheet>

      {/* ── X02 AI追问 ── */}
      <BottomFloatingPanel open={showX02} onClose={() => setShowX02(false)} title="AI 追问">
        <div className="px-5 py-4">
          <div className="bg-surface-card rounded-card px-3 py-2.5 mb-4 border border-line-base">
            <p className="text-caption text-ink-placeholder mb-1">已选文本</p>
            <p className="text-body text-ink-secondary line-clamp-3">「{pendingText}」</p>
          </div>
          <div className="space-y-2 mb-4">
            {['这段话的核心观点是什么？', '能具体展开说说吗？', '有数据依据吗？'].map(q => (
              <button
                key={q}
                onClick={() => setX02Input(q)}
                className={`w-full text-left px-3.5 py-2.5 rounded-card border text-body transition-colors ${
                  x02Input === q ? 'border-brand-orange bg-brand-orange-light text-brand-orange' : 'border-line-base bg-surface-card text-ink-secondary'
                }`}
              >
                {q}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <input
              value={x02Input}
              onChange={e => setX02Input(e.target.value)}
              placeholder="针对选中内容追问..."
              className="flex-1 px-4 py-3 bg-surface-card rounded-card border border-line-base text-body text-ink-primary outline-none placeholder:text-ink-placeholder"
            />
            <button
              onClick={() => { setShowX02(false); navigate('/ask/answer', { state: { question: x02Input, context: pendingText } }) }}
              disabled={!x02Input.trim()}
              className="w-11 h-11 bg-brand-orange rounded-full flex items-center justify-center disabled:opacity-30 flex-shrink-0"
            >
              <Send size={16} className="text-white" />
            </button>
          </div>
        </div>
      </BottomFloatingPanel>

      {/* ── X03 翻译 ── */}
      <BottomFloatingPanel open={showX03} onClose={() => setShowX03(false)} title="翻译">
        <div className="px-5 py-4">
          <p className="text-caption text-ink-placeholder mb-2">原文（中文）</p>
          <p className="text-body text-ink-secondary mb-4 pb-4 border-b border-line-base">
            「{pendingText}」
          </p>
          <p className="text-caption text-ink-placeholder mb-2">英文译文</p>
          <p className="text-body text-ink-primary leading-relaxed mb-4">
            "The core of operating a knowledge base lies in establishing a sustainable content lifecycle management system — covering goal-setting, distribution, community engagement, and dashboard tracking."
          </p>
          <button
            onClick={() => showToast('已复制译文')}
            className="px-4 py-2 bg-surface-card rounded-pill text-caption text-ink-secondary border border-line-base"
          >
            复制译文
          </button>
        </div>
      </BottomFloatingPanel>

      {/* ── X04 解释 ── */}
      <BottomFloatingPanel open={showX04} onClose={() => setShowX04(false)} title="解释">
        <div className="px-5 py-4">
          <div className="bg-surface-card rounded-card px-3 py-2.5 mb-4 border border-line-base">
            <p className="text-caption text-ink-placeholder truncate">
              「{pendingText.slice(0, 40)}{pendingText.length > 40 ? '…' : ''}」
            </p>
          </div>
          <p className="text-body text-ink-primary leading-relaxed mb-4">
            在知识管理产品语境下，该内容涉及<strong>内容生命周期管理</strong>的核心方法论。具体指：从内容创建、分类整理，到定期审查、过期清理的完整闭环，是保持兴趣库持续活跃和高价值的关键运营策略。
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => { setShowX04(false); navigate('/ask/answer', { state: { question: `解释一下：${pendingText.slice(0, 30)}` } }) }}
              className="px-4 py-2 bg-brand-orange text-white rounded-pill text-caption"
            >
              深入追问
            </button>
            <button
              onClick={() => showToast('已复制解释')}
              className="px-4 py-2 bg-surface-card rounded-pill text-caption text-ink-secondary border border-line-base"
            >
              复制解释
            </button>
          </div>
        </div>
      </BottomFloatingPanel>

      <DocumentActionSheet
        open={showActionSheet}
        onClose={() => setShowActionSheet(false)}
        docType={isNoteFile ? 'note' : 'knowledge'}
        docContent={doc.content}
        onEdit={isNoteFile ? () => setEditingNote(true) : undefined}
        onSaveToKnowledgeBase={(content) => openKbSheet(displayFile.name, content ?? doc.content)}
        onDelete={isNoteFile ? () => {
          deleteFile(displayFile.id)
          showToast('速记已删除')
        } : undefined}
        annotationsCount={docAnnotations.length}
        onAnnotations={() => setShowAnnotations(true)}
      />

      <AnnotationListSheet
        open={showAnnotations}
        onClose={() => setShowAnnotations(false)}
        docId={docId}
        docType={docType}
      />

      <SaveToKnowledgeBaseSheet
        open={showKbSheet}
        onClose={() => setShowKbSheet(false)}
        sourceContent={savePayload}
        title={saveSheetTitle}
        successToast={kb => savePayload.type.endsWith('_excerpt') ? `已保存到「${kb.name}」兴趣库` : `已保存到「${kb.name}」`}
      />

      <Toast />
    </div>
  )
}
