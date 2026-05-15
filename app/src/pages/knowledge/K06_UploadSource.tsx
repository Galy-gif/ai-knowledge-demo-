import { useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Check,
  ChevronLeft,
  ChevronRight,
  FileDown,
  FileText,
  Globe2,
  Image as ImageIcon,
  Link as LinkIcon,
  Mic,
  MessagesSquare,
  PenLine,
  Search,
  Smartphone,
  Sparkles,
  StickyNote,
  Radio,
  type LucideIcon,
} from 'lucide-react'
import BottomSheet from '../../components/ui/BottomSheet'
import SaveToKnowledgeBaseSheet from '../../components/common/SaveToKnowledgeBaseSheet'
import { useKnowledge, type SaveSourceContent } from '../../context/KnowledgeContext'
import { useUser } from '../../context/UserContext'
import { QUICK_NOTES_KB_ID, type FileType, type KnowledgeFile } from '../../mock/data'
import { getFileTypeVisual } from '../../utils/fileTypeVisuals'

type SourceKind = 'search' | 'browser' | 'ai-chat' | 'third-party' | 'wechat' | 'download' | 'system-note' | 'recording'
type View = 'sources' | SourceKind
type BrowserSaveMode = 'full' | 'selection'

interface SourceItem {
  kind: SourceKind
  Icon: LucideIcon
  title: string
  desc: string
}

const SOURCE_GROUPS: Array<{ title: string; cols?: 2 | 3; items: SourceItem[] }> = [
  {
    title: '收藏自浏览器',
    items: [
      { kind: 'search', Icon: Search, title: 'AI 搜索结果', desc: '搜索结果入库' },
      { kind: 'browser', Icon: Globe2, title: '浏览的网页', desc: '最近访问网页' },
      { kind: 'ai-chat', Icon: Sparkles, title: 'AI 助手回答', desc: '历史对话回答' },
    ],
  },
  {
    title: '跨端导入',
    items: [
      { kind: 'third-party', Icon: Smartphone, title: '第三方 App', desc: '公众号小红书' },
      { kind: 'wechat', Icon: MessagesSquare, title: '微信导入', desc: '微信收到的文章' },
      { kind: 'download', Icon: FileDown, title: '下载文件', desc: '本地文件 PDF 等' },
    ],
  },
  {
    title: '设备来源',
    items: [
      { kind: 'system-note', Icon: StickyNote, title: '系统便签', desc: '设备备忘录' },
      { kind: 'recording', Icon: Mic, title: '录音', desc: '语音备忘录' },
    ],
  },
]

const RECENT_SEARCH_RESULTS = [
  { id: 's1', title: 'AI 知识库产品的来源溯源设计', source: 'yourportal.ai', time: '10分钟前' },
  { id: 's2', title: '移动端知识管理工具体验趋势', source: 'uxnotes.cn', time: '32分钟前' },
  { id: 's3', title: 'Perplexity 工作流如何影响企业检索', source: 'productthinking.com', time: '今天 14:20' },
  { id: 's4', title: '知识库召回率优化方法合集', source: 'search-hub.com', time: '昨天' },
  { id: 's5', title: '团队 SOP 沉淀的轻量实践', source: 'teamflow.dev', time: '2天前' },
]

const RECENT_BROWSING = [
  { id: 'b1', favicon: 'Y', title: '搜索问答产品的对话保持策略', url: 'https://yourportal.ai/articles/dialog-retention' },
  { id: 'b2', favicon: 'U', title: 'AI 知识库产品的内容召回优化实践', url: 'https://uxnotes.cn/kb-recall' },
  { id: 'b3', favicon: 'P', title: '从 Notion AI 到 Perplexity', url: 'https://productthinking.com/km-evolution' },
  { id: 'b4', favicon: 'D', title: '多模态搜索体验设计案例', url: 'https://design-lab.dev/search-experience' },
  { id: 'b5', favicon: 'G', title: '增长团队知识库运营方法', url: 'https://growthops.io/kb-ops' },
]

const MOCK_FILES = [
  { id: 'd1', name: 'Q4 产品路线图.pdf', type: 'pdf' as FileType, size: '2.1MB' },
  { id: 'd2', name: '访谈纪要-移动端.md', type: 'txt' as FileType, size: '38KB' },
  { id: 'd3', name: '竞品功能清单.xlsx', type: 'doc' as FileType, size: '812KB' },
  { id: 'd4', name: '白板截图.png', type: 'image' as FileType, size: '1.4MB' },
  { id: 'd5', name: '运营 SOP 草案.docx', type: 'doc' as FileType, size: '640KB' },
]

const RECORDINGS = [
  { id: 'r1', title: '用户访谈-张磊', duration: '18:24', date: '今天 16:20' },
  { id: 'r2', title: '产品评审会摘录', duration: '42:08', date: '昨天' },
  { id: 'r3', title: '灵感速记-来源卡片', duration: '03:36', date: '2天前' },
  { id: 'r4', title: '电话沟通-团队权限', duration: '11:12', date: '5天前' },
]

const RECENT_AI_CONVERSATIONS = [
  { id: 'a1', title: '知识库运营指标整理', time: '刚刚', summary: '围绕内容使用率、检索满意率、更新健康度整理回答。' },
  { id: 'a2', title: '竞品报告要点提炼', time: '今天 13:20', summary: '总结 Notion、Confluence、Perplexity 的差异和机会点。' },
  { id: 'a3', title: '网页来源卡片方案', time: '昨天', summary: '解释来源卡片、引用高亮和溯源可信度设计。' },
  { id: 'a4', title: '任务模式模板匹配', time: '2天前', summary: '梳理轻应用模板库与关键词匹配流程。' },
]

const RECENT_BROWSER_DOWNLOADS: Array<{
  id: string
  title: string
  type: Extract<FileType, 'url' | 'pdf' | 'doc' | 'image'>
  source: string
  time: string
  summary: string
}> = [
  { id: 'rb1', title: 'Notion AI 功能拆解', type: 'url', source: '微信文章', time: '2 小时前', summary: '来自微信文章的 Notion AI 功能分析。' },
  { id: 'rb2', title: '2024 产品趋势报告.pdf', type: 'pdf', source: '下载', time: '昨天', summary: '最近下载的产品趋势报告 PDF。' },
  { id: 'rb3', title: 'Linear vs Jira', type: 'url', source: '博客文章', time: '今天上午', summary: 'Linear 与 Jira 的产品体验对比。' },
  { id: 'rb4', title: '用户访谈方法论', type: 'url', source: '小红书', time: '3 天前', summary: '用户访谈提纲和方法论整理。' },
  { id: 'rb5', title: 'OKR 制定指南.docx', type: 'doc', source: '下载', time: '1 周前', summary: '团队 OKR 制定指南文档。' },
  { id: 'rb6', title: 'Anthropic Claude 3 Demo', type: 'url', source: '网页', time: '4 小时前', summary: 'Claude 3 Demo 页面和能力说明。' },
]

function getShortcutVisual(type: FileType) {
  if (type === 'url') {
    return { Icon: Globe2, gradient: 'linear-gradient(135deg, #ECFEFF 0%, #DBEAFE 100%)', color: '#0284C7' }
  }
  if (type === 'pdf') {
    return { Icon: FileText, gradient: 'linear-gradient(135deg, #FEF2F2 0%, #FEE2E2 100%)', color: '#E74C3C' }
  }
  if (type === 'doc') {
    return { Icon: FileText, gradient: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)', color: '#2B7BD6' }
  }
  if (type === 'image') {
    return { Icon: ImageIcon, gradient: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)', color: '#10B981' }
  }

  const cfg = getFileTypeVisual(type)
  return { Icon: cfg.Icon, gradient: `linear-gradient(135deg, ${cfg.bg} 0%, #FFFFFF 100%)`, color: cfg.color }
}

function getLinkTitle(url: string) {
  try {
    const parsed = new URL(url)
    return `网页：${parsed.hostname.replace(/^www\./, '')}`
  } catch {
    return '网页链接'
  }
}

function isValidUrl(value: string) {
  return /^https?:\/\/[\w.-]+\.[a-z]{2,}[\w\-._~:/?#[\]@!$&'()*+,;=.]*$/i.test(value.trim())
}

function PasteLinkInput({
  value,
  onChange,
  onSave,
}: {
  value: string
  onChange: (value: string) => void
  onSave: (content: SaveSourceContent) => void
}) {
  const [focused, setFocused] = useState(false)
  const valid = isValidUrl(value)
  const trimmed = value.trim()

  const handleSave = () => {
    if (!valid) return
    const title = getLinkTitle(trimmed)
    onSave({
      title,
      type: 'web',
      body: `# ${title}\n\n来源：${trimmed}\n\n通过粘贴链接保存，AI 将在入库后自动识别网页标题、正文和要点。`,
    })
  }

  return (
    <div>
      <p className="text-caption text-ink-secondary mb-2">粘贴链接添加</p>
      <div className={`h-12 px-3 rounded-[10px] bg-[#F5F5F5] border flex items-center gap-2 transition-colors ${
        focused ? 'border-brand-orange' : 'border-transparent'
      }`}>
        <LinkIcon size={17} className="text-brand-orange flex-shrink-0" />
        <input
          value={value}
          onChange={event => onChange(event.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="粘贴 URL，自动识别并保存..."
          className="flex-1 min-w-0 bg-transparent outline-none text-body text-ink-primary placeholder:text-ink-placeholder"
        />
        <button
          onClick={handleSave}
          disabled={!valid}
          className="px-3 py-1.5 rounded-pill bg-brand-orange text-white text-caption font-medium disabled:bg-line-base disabled:text-ink-placeholder flex-shrink-0"
        >
          保存
        </button>
      </div>
    </div>
  )
}

function SourceGridItem({ item, onClick }: { item: SourceItem; onClick: () => void }) {
  const { Icon } = item
  return (
    <button
      onClick={onClick}
      className="h-[88px] rounded-card bg-[#F8F8F8] px-2.5 py-2.5 text-left active:bg-surface-card transition-colors"
    >
      <div className="w-7 h-7 rounded-md bg-brand-orange/[0.08] flex items-center justify-center mb-2">
        <Icon size={16} strokeWidth={1.8} className="text-brand-orange" />
      </div>
      <p className="text-caption font-medium text-ink-primary truncate">{item.title}</p>
      <p className="text-micro text-ink-placeholder mt-0.5 truncate">{item.desc}</p>
    </button>
  )
}

function SourceGroup({ title, items, children, onSourceClick }: {
  title: string
  items: SourceItem[]
  children?: ReactNode
  onSourceClick: (kind: SourceKind) => void
}) {
  return (
    <section className="mb-5">
      <p className="text-caption text-ink-secondary mb-2">{title}</p>
      <div className="grid grid-cols-3 gap-2">
        {items.map(item => (
          <SourceGridItem key={item.kind} item={item} onClick={() => onSourceClick(item.kind)} />
        ))}
        {children}
      </div>
    </section>
  )
}

function RecentShortcutSection({ title, onAction, children }: {
  title: string
  onAction: () => void
  children: ReactNode
}) {
  return (
    <section className="mb-5">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-[13px] leading-5 font-semibold text-ink-primary">{title}</h4>
        <button
          onClick={onAction}
          aria-label={`查看${title}全部内容`}
          className="h-6 w-6 flex items-center justify-center text-brand-orange"
        >
          <ChevronRight size={15} strokeWidth={1.9} />
        </button>
      </div>
      <div className="-mx-5 overflow-x-auto scrollbar-hide px-5">
        <div className="flex gap-2 pb-1">
          {children}
        </div>
      </div>
    </section>
  )
}

type SelectableCardState = 'default' | 'selected' | 'saved'

function SelectableCard({
  title,
  meta,
  type,
  state,
  disabled,
  shaking,
  onClick,
}: {
  title: string
  meta: string
  type: FileType
  state: SelectableCardState
  disabled?: boolean
  shaking?: boolean
  onClick: () => void
}) {
  const visual = getShortcutVisual(type)
  const Icon = visual.Icon
  const saved = state === 'saved'
  const selected = state === 'selected'
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={saved}
      className={`relative h-[96px] w-[100px] flex-shrink-0 overflow-hidden rounded-card bg-white px-2.5 py-2.5 text-left border transition-all duration-150 ${
        selected
          ? 'scale-[0.98] border-[1.5px] border-brand-orange shadow-[0_4px_12px_rgba(255,122,0,0.15)]'
          : 'border-[#EEEEEE]'
      } ${saved ? 'opacity-60 cursor-default' : disabled ? 'cursor-default' : 'active:scale-[0.98]'} ${shaking ? 'animate-card-shake' : ''}`}
    >
      <div className="w-7 h-7 rounded-md bg-brand-orange/[0.08] flex items-center justify-center mb-2">
        <Icon size={16} className="text-brand-orange" strokeWidth={1.8} />
      </div>
      <p className="text-caption font-medium leading-[16px] text-ink-primary line-clamp-2">{title}</p>
      <p className={`mt-0.5 text-[11px] leading-3 truncate ${saved ? 'text-[#10B981]' : 'text-ink-placeholder'}`}>
        {saved ? '✓ 已添加' : meta}
      </p>
      {selected && (
        <span className="absolute right-1.5 top-1.5 h-5 w-5 rounded-full bg-brand-orange flex items-center justify-center">
          <Check size={14} className="text-white" strokeWidth={2.4} />
        </span>
      )}
      {saved && (
        <span className="absolute right-1.5 top-1.5 h-5 w-5 rounded-full bg-surface-card flex items-center justify-center">
          <Check size={14} className="text-ink-placeholder" strokeWidth={2.2} />
        </span>
      )}
    </button>
  )
}

function BottomActionBar({
  count,
  onCancel,
  onConfirm,
  confirmLabel,
}: {
  count: number
  onCancel: () => void
  onConfirm: () => void
  confirmLabel: string
}) {
  if (count === 0) return null

  return (
    <div className="absolute bottom-3 left-0 right-0 z-30 px-4 animate-bottom-action-in">
      <div className="h-14 rounded-t-card bg-white border-t border-[#EEEEEE] shadow-[0_-4px_16px_rgba(0,0,0,0.06)] px-4 py-2 flex items-center justify-between">
        <p className="text-[13px] leading-5 text-ink-secondary">已选 {count} 项</p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-1.5 rounded-[10px] text-[13px] leading-5 text-ink-secondary active:bg-surface-card"
          >
            取消
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-3.5 py-1.5 rounded-[10px] bg-brand-orange text-white text-[13px] leading-5 font-semibold"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

function SelectCheck({ selected }: { selected: boolean }) {
  return (
    <div className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 ${
      selected ? 'bg-brand-orange border-brand-orange' : 'border-line-base bg-white'
    }`}>
      {selected && <Check size={12} className="text-white" />}
    </div>
  )
}

function GuideView({ title, steps, onDone }: { title: string; steps: string[]; onDone: () => void }) {
  return (
    <div className="px-5 py-3">
      <h4 className="text-h2 text-ink-primary mb-2">{title}</h4>
      <p className="text-caption text-ink-placeholder mb-4">按下面步骤把内容导入当前知识库。</p>
      <div className="space-y-3 mb-5">
        {steps.map((step, index) => (
          <div key={step} className="flex gap-3 p-3 bg-white rounded-card border border-line-base">
            <div className="w-6 h-6 rounded-full bg-brand-orange text-white text-caption font-semibold flex items-center justify-center flex-shrink-0">
              {index + 1}
            </div>
            <p className="text-body text-ink-secondary">{step}</p>
          </div>
        ))}
      </div>
      <button
        onClick={onDone}
        className="w-full py-3 bg-brand-orange text-white rounded-btn text-body font-medium"
      >
        我知道了
      </button>
    </div>
  )
}

export default function K06_UploadSource({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate()
  const { activeBase, setActiveFile, addFile, quickNotesBase } = useKnowledge()
  const { showToast } = useUser()
  const [view, setView] = useState<View>('sources')
  const [selectedSearch, setSelectedSearch] = useState<string[]>([])
  const [selectedPages, setSelectedPages] = useState<string[]>([])
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])
  const [selectedRecordings, setSelectedRecordings] = useState<string[]>([])
  const [selectedAiChats, setSelectedAiChats] = useState<string[]>([])
  const [pageSaveModes, setPageSaveModes] = useState<Record<string, BrowserSaveMode>>({})
  const [pageSnippets, setPageSnippets] = useState<Record<string, string>>({})
  const [importing, setImporting] = useState(false)
  const [linkValue, setLinkValue] = useState('')
  const [showLinkSaveSheet, setShowLinkSaveSheet] = useState(false)
  const [linkContent, setLinkContent] = useState<SaveSourceContent>({
    title: '网页链接',
    body: '',
    type: 'web',
  })
  const [selectedShortcutIds, setSelectedShortcutIds] = useState<string[]>([])
  const [savedBrowsingIds, setSavedBrowsingIds] = useState<string[]>([])
  const isQuickNotes = activeBase?.id === QUICK_NOTES_KB_ID

  const currentKbId = activeBase?.id ?? QUICK_NOTES_KB_ID
  const currentKbName = activeBase?.name ?? quickNotesBase.name

  const resetAndClose = () => {
    setView('sources')
    setSelectedSearch([])
    setSelectedPages([])
    setSelectedFiles([])
    setSelectedRecordings([])
    setSelectedAiChats([])
    setPageSaveModes({})
    setPageSnippets({})
    setSelectedShortcutIds([])
    setImporting(false)
    onClose()
  }

  const addMockFile = (payload: Omit<KnowledgeFile, 'id' | 'kbId' | 'uploadedAt'>) => {
    const id = `file_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`
    addFile({
      id,
      kbId: currentKbId,
      uploadedAt: '刚刚',
      ...payload,
    })
    return id
  }

  const finishImport = (count: number, createFiles: () => string[]) => {
    if (count === 0 || importing) return
    setImporting(true)
    window.setTimeout(() => {
      const ids = createFiles()
      showToast(`已入库 ${count} 项到「${currentKbName}」`)
      window.setTimeout(() => {
        if (ids.length > 0) {
          window.dispatchEvent(new CustomEvent('knowledge-files-added', { detail: { ids } }))
        }
        resetAndClose()
      }, 1500)
    }, 800)
  }

  const importSearch = () => {
    const items = RECENT_SEARCH_RESULTS.filter(item => selectedSearch.includes(item.id))
    finishImport(items.length, () =>
      items.map(item => addMockFile({
          name: item.title,
          type: 'url',
          size: '—',
          summary: `来自 ${item.source} 的搜索结果，已作为网页来源保存。`,
          content: `# ${item.title}\n\n来源：${item.source}\n\n这条搜索结果已保存到当前知识库，后续可以继续追问和整理。`,
          wordCount: 520,
        })
      )
    )
  }

  const setPageMode = (id: string, mode: BrowserSaveMode) => {
    setPageSaveModes(prev => {
      if ((prev[id] ?? 'full') === mode) return prev
      return { ...prev, [id]: mode }
    })
  }

  const updatePageSnippet = (id: string, value: string) => {
    setPageSnippets(prev => ({ ...prev, [id]: value }))
  }

  const importPages = () => {
    const items = RECENT_BROWSING.filter(item => selectedPages.includes(item.id))
    finishImport(items.length, () =>
      items.map(item => {
        const mode = pageSaveModes[item.id] ?? 'full'
        const snippet = pageSnippets[item.id]?.trim()
        return addMockFile({
          name: `${item.title}${mode === 'selection' ? ' · 选段' : ''}`,
          type: 'url',
          size: '—',
          summary: `${mode === 'selection' ? '选段' : '整页'}保存自 ${item.url}`,
          content: mode === 'selection'
            ? `# ${item.title} · 选段\n\n来源：${item.url}\n\n${snippet || '这是一段 mock 选段内容，保存后可在知识库中继续编辑和追问。'}`
            : `# ${item.title}\n\n来源：${item.url}\n\n已保存完整网页内容，AI 会自动提取正文、关键观点和来源信息。`,
          wordCount: mode === 'selection' ? (snippet?.length || 120) : 1300,
        })
      })
    )
  }

  const uploadSelectedFiles = () => {
    resetAndClose()
    navigate('/knowledge/uploading')
  }

  const importRecordings = () => {
    const items = RECORDINGS.filter(item => selectedRecordings.includes(item.id))
    finishImport(items.length, () =>
      items.map(item => addMockFile({
        name: `${item.title}.m4a`,
        type: 'audio',
        size: item.duration,
        summary: `录音导入完成，日期：${item.date}。AI 转写将在上传后自动生成。`,
      }))
    )
  }

  const importAiChats = () => {
    const items = RECENT_AI_CONVERSATIONS.filter(item => selectedAiChats.includes(item.id))
    finishImport(items.length, () =>
      items.map(item => addMockFile({
        name: item.title,
        type: 'note',
        size: `${item.summary.length}字`,
        wordCount: item.summary.length,
        summary: item.summary,
        content: `# ${item.title}\n\n${item.summary}`,
        tags: ['AI对话'],
      }))
    )
  }

  const toggle = (id: string, selected: string[], setSelected: (ids: string[]) => void) => {
    setSelected(selected.includes(id) ? selected.filter(item => item !== id) : [...selected, id])
  }

  const handleNewQuickNote = () => {
    resetAndClose()
    setActiveFile(null)
    navigate('/knowledge/file-detail', { state: { createNote: true, kbId: currentKbId } })
  }

  const openLinkSaveSheet = (content: SaveSourceContent) => {
    setLinkContent(content)
    setShowLinkSaveSheet(true)
  }

  const addRecentBrowsingItem = (item: typeof RECENT_BROWSER_DOWNLOADS[number]) => {
    addMockFile({
      name: item.title,
      type: item.type,
      size: item.type === 'url' ? '—' : item.type === 'pdf' ? '2.4MB' : item.type === 'doc' ? '720KB' : '1.2MB',
      summary: `${item.time} · ${item.source}。${item.summary}`,
      content: item.type === 'url' ? `# ${item.title}\n\n来源：${item.source}\n\n${item.summary}` : undefined,
      wordCount: item.type === 'url' ? 900 : undefined,
    })
  }

  const shortcutKey = (id: string) => `browser:${id}`

  const toggleShortcut = (key: string) => {
    setSelectedShortcutIds(prev =>
      prev.includes(key) ? prev.filter(item => item !== key) : [...prev, key]
    )
  }

  const selectedBrowsingItems = RECENT_BROWSER_DOWNLOADS.filter(item =>
    selectedShortcutIds.includes(shortcutKey(item.id)) &&
    !savedBrowsingIds.includes(item.id)
  )
  const selectedShortcutCount = selectedBrowsingItems.length
  const confirmShortcutLabel = `+ 添加到「${currentKbName}」`

  const cancelShortcutSelection = () => setSelectedShortcutIds([])

  const confirmShortcutSelection = () => {
    if (selectedShortcutCount === 0) return

    selectedBrowsingItems.forEach(addRecentBrowsingItem)
    setSavedBrowsingIds(prev => [...new Set([...prev, ...selectedBrowsingItems.map(item => item.id)])])
    setSelectedShortcutIds([])
    showToast(`已添加 ${selectedShortcutCount} 项到「${currentKbName}」`)
  }

  const renderContent = () => {
    if (view === 'search') {
      return (
        <div className="px-5 py-3">
          <p className="text-caption text-ink-placeholder mb-3">最近搜索结果</p>
          {RECENT_SEARCH_RESULTS.map(item => (
            <button
              key={item.id}
              onClick={() => toggle(item.id, selectedSearch, setSelectedSearch)}
              className="w-full flex items-center gap-3 px-4 py-3 mb-2 bg-white rounded-card border border-line-base text-left"
            >
              <SelectCheck selected={selectedSearch.includes(item.id)} />
              <div className="flex-1 min-w-0">
                <p className="text-card-title text-ink-primary truncate">{item.title}</p>
                <p className="text-caption text-ink-placeholder mt-0.5">{item.source} · {item.time}</p>
              </div>
            </button>
          ))}
          <button
            onClick={importSearch}
            disabled={selectedSearch.length === 0 || importing}
            className="w-full mt-2 py-3 bg-brand-orange text-white rounded-btn text-body font-medium disabled:opacity-40"
          >
            {importing ? '入库中...' : `入库 ${selectedSearch.length} 项`}
          </button>
        </div>
      )
    }

    if (view === 'browser') {
      return (
        <div className="px-5 py-3">
          <p className="text-caption text-ink-placeholder mb-3">最近浏览</p>
          {RECENT_BROWSING.map(item => {
            const mode = pageSaveModes[item.id] ?? 'full'
            return (
              <div key={item.id} className="px-4 py-3 mb-2 bg-white rounded-card border border-line-base">
                <div className="flex items-center gap-3">
                  <button onClick={() => toggle(item.id, selectedPages, setSelectedPages)}>
                    <SelectCheck selected={selectedPages.includes(item.id)} />
                  </button>
                  <div className="w-8 h-8 rounded-full bg-brand-orange-light text-brand-orange text-caption font-semibold flex items-center justify-center flex-shrink-0">
                    {item.favicon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-card-title text-ink-primary truncate">{item.title}</p>
                    <p className="text-micro text-ink-placeholder truncate">{item.url}</p>
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-3">
                  <button
                    type="button"
                    onClick={() => setPageMode(item.id, 'full')}
                    className={`h-7 rounded-pill px-3.5 text-[12px] leading-4 transition-colors duration-150 ${
                      mode === 'full'
                        ? 'border border-brand-orange bg-brand-orange text-white'
                        : 'border border-brand-orange bg-white text-brand-orange'
                    }`}
                  >
                    整页
                  </button>
                  <button
                    type="button"
                    onClick={() => setPageMode(item.id, 'selection')}
                    className={`h-7 rounded-pill px-3.5 text-[12px] leading-4 transition-colors duration-150 ${
                      mode === 'selection'
                        ? 'border border-brand-orange bg-brand-orange text-white'
                        : 'border border-brand-orange bg-white text-brand-orange'
                    }`}
                  >
                    选段
                  </button>
                </div>
                {mode === 'selection' && (
                  <div className="mt-3 rounded-card border border-line-base bg-surface-card p-3">
                    <p className="text-micro text-ink-secondary">粘贴或编辑要保存的片段</p>
                    <textarea
                      value={pageSnippets[item.id] ?? ''}
                      onChange={event => updatePageSnippet(item.id, event.target.value)}
                      placeholder="粘贴或编辑要保存的片段"
                      className="mt-2 h-20 w-full resize-none rounded-[10px] bg-white px-3 py-2 text-caption text-ink-primary outline-none placeholder:text-ink-placeholder focus:ring-1 focus:ring-brand-orange"
                    />
                  </div>
                )}
              </div>
            )
          })}
          <button
            onClick={importPages}
            disabled={selectedPages.length === 0 || importing}
            className="w-full mt-2 py-3 bg-brand-orange text-white rounded-btn text-body font-medium disabled:opacity-40"
          >
            {importing ? '入库中...' : `入库 ${selectedPages.length} 项`}
          </button>
        </div>
      )
    }

    if (view === 'ai-chat') {
      return (
        <div className="px-5 py-3">
          <p className="text-caption text-ink-placeholder mb-3">最近 AI 对话</p>
          {RECENT_AI_CONVERSATIONS.map(item => (
            <button
              key={item.id}
              onClick={() => toggle(item.id, selectedAiChats, setSelectedAiChats)}
              className="w-full flex items-center gap-3 px-4 py-3 mb-2 bg-white rounded-card border border-line-base text-left"
            >
              <SelectCheck selected={selectedAiChats.includes(item.id)} />
              <div className="w-10 h-10 rounded-card bg-brand-orange/[0.08] flex items-center justify-center">
                <Sparkles size={18} className="text-brand-orange" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-card-title text-ink-primary truncate">{item.title}</p>
                <p className="text-caption text-ink-placeholder">{item.time}</p>
                <p className="text-caption text-ink-secondary mt-0.5 line-clamp-1">{item.summary}</p>
              </div>
            </button>
          ))}
          <button
            onClick={importAiChats}
            disabled={selectedAiChats.length === 0 || importing}
            className="w-full mt-2 py-3 bg-brand-orange text-white rounded-btn text-body font-medium disabled:opacity-40"
          >
            {importing ? '入库中...' : `入库 ${selectedAiChats.length} 项`}
          </button>
        </div>
      )
    }

    if (view === 'download') {
      return (
        <div className="px-5 py-3">
          <p className="text-caption text-ink-placeholder mb-3">mock 文件选择器</p>
          {MOCK_FILES.map(item => {
            const cfg = getFileTypeVisual(item.type)
            const { Icon } = cfg
            return (
              <button
                key={item.id}
                onClick={() => toggle(item.id, selectedFiles, setSelectedFiles)}
                className="w-full flex items-center gap-3 px-4 py-3 mb-2 bg-white rounded-card border border-line-base text-left"
              >
                <SelectCheck selected={selectedFiles.includes(item.id)} />
                <div
                  className="w-10 h-10 rounded-card flex items-center justify-center"
                  style={{ backgroundColor: cfg.bg }}
                >
                  <Icon size={18} style={{ color: cfg.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-card-title text-ink-primary truncate">{item.name}</p>
                  <p className="text-caption text-ink-placeholder">{item.size}</p>
                </div>
              </button>
            )
          })}
          <button
            onClick={uploadSelectedFiles}
            disabled={selectedFiles.length === 0}
            className="w-full mt-2 py-3 bg-brand-orange text-white rounded-btn text-body font-medium disabled:opacity-40"
          >
            上传 {selectedFiles.length} 个文件
          </button>
        </div>
      )
    }

    if (view === 'recording') {
      return (
        <div className="px-5 py-3">
          <p className="text-caption text-ink-placeholder mb-3">最近录音</p>
          {RECORDINGS.map(item => (
            <button
              key={item.id}
              onClick={() => toggle(item.id, selectedRecordings, setSelectedRecordings)}
              className="w-full flex items-center gap-3 px-4 py-3 mb-2 bg-white rounded-card border border-line-base text-left"
            >
              <SelectCheck selected={selectedRecordings.includes(item.id)} />
              <div className="w-10 h-10 rounded-card bg-brand-orange/[0.08] flex items-center justify-center">
                <Mic size={18} className="text-brand-orange" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-card-title text-ink-primary truncate">{item.title}</p>
                <p className="text-caption text-ink-placeholder">{item.duration} · {item.date}</p>
              </div>
            </button>
          ))}
          <div className="grid grid-cols-2 gap-2 mt-2">
            <button
              onClick={() => { showToast('现场录音功能即将上线') }}
              className="flex items-center justify-center gap-2 py-3 bg-surface-card rounded-btn text-body text-ink-secondary"
            >
              <Radio size={16} />
              现场录音
            </button>
            <button
              onClick={importRecordings}
              disabled={selectedRecordings.length === 0 || importing}
              className="py-3 bg-brand-orange text-white rounded-btn text-body font-medium disabled:opacity-40"
            >
              {importing ? '入库中...' : `入库 ${selectedRecordings.length} 项`}
            </button>
          </div>
        </div>
      )
    }

    if (view === 'third-party') {
      return (
        <GuideView
          title="如何从其他 App 分享到本应用"
          steps={['在公众号、小红书、抖音或快手中打开目标内容。', '点击系统分享按钮，选择“分享到本应用”。', '回到本应用确认保存范围，AI 会自动提取标题、正文和来源。']}
          onDone={() => setView('sources')}
        />
      )
    }

    if (view === 'wechat') {
      return (
        <GuideView
          title="在微信内通过 ... 菜单分享到本应用"
          steps={['在微信里打开文章链接、图片或文件。', '点击右上角“...”菜单，选择“更多打开方式”。', '选择本应用后，内容会进入当前知识库的待入库队列。']}
          onDone={() => setView('sources')}
        />
      )
    }

    if (view === 'system-note') {
      return (
        <GuideView
          title="读取系统便签需要授权"
          steps={['前往系统设置，允许本应用读取备忘录 / 便签。', '授权后会显示最近便签列表，你可以多选导入。', '导入内容会保留原始创建时间，并转成速记或文本文件。']}
          onDone={() => setView('sources')}
        />
      )
    }

    return (
      <div>
        <div className="sticky top-0 z-10 bg-white px-5 pt-2 pb-4 border-b border-line-base/60">
          <p className="text-caption text-ink-secondary mb-3 text-center">选择内容来源</p>
          <PasteLinkInput
            value={linkValue}
            onChange={setLinkValue}
            onSave={openLinkSaveSheet}
          />
        </div>

        <div className={`px-5 pt-4 ${selectedShortcutCount > 0 ? 'pb-24' : 'pb-4'}`}>
          <RecentShortcutSection
            title="最近浏览/下载"
            onAction={() => navigate('/knowledge/recent-browsing')}
          >
            {RECENT_BROWSER_DOWNLOADS.map(item => {
              const key = shortcutKey(item.id)
              const saved = savedBrowsingIds.includes(item.id)
              return (
                <SelectableCard
                  key={item.id}
                  title={item.title}
                  meta={`${item.time} · ${item.source}`}
                  type={item.type}
                  state={saved ? 'saved' : selectedShortcutIds.includes(key) ? 'selected' : 'default'}
                  onClick={() => {
                    if (!saved) toggleShortcut(key)
                  }}
                />
              )
            })}
          </RecentShortcutSection>

          {SOURCE_GROUPS.map(group => (
            <SourceGroup
              key={group.title}
              title={group.title}
              items={group.items}
              onSourceClick={setView}
            >
              {group.title === '设备来源' && isQuickNotes && (
                <button
                  onClick={handleNewQuickNote}
                  className="h-[88px] rounded-card bg-brand-orange/[0.04] border border-brand-orange/20 px-2.5 py-2.5 text-left active:bg-brand-orange-light transition-colors"
                >
                  <div className="w-7 h-7 rounded-md bg-brand-orange/[0.08] flex items-center justify-center mb-2">
                    <PenLine size={16} strokeWidth={1.8} className="text-brand-orange" />
                  </div>
                  <p className="text-caption font-medium text-ink-primary truncate">新建速记</p>
                  <p className="text-micro text-ink-placeholder mt-0.5 truncate">快速记录灵感</p>
                </button>
              )}
            </SourceGroup>
          ))}
        </div>
        <BottomActionBar
          count={selectedShortcutCount}
          onCancel={cancelShortcutSelection}
          onConfirm={confirmShortcutSelection}
          confirmLabel={confirmShortcutLabel}
        />
      </div>
    )
  }

  const flatSources = SOURCE_GROUPS.flatMap(group => group.items)
  const secondaryTitle = flatSources.find(item => item.kind === view)?.title

  return (
    <>
      <BottomSheet
        open={open}
        onClose={resetAndClose}
        title="添加内容"
        titleAlign="center"
        titleClassName="text-[17px] leading-6 font-semibold text-ink-primary"
        heightClassName="h-[80%] max-h-[80%]"
        headerLeft={
          <button
            onClick={view === 'sources' ? resetAndClose : () => setView('sources')}
            className="text-body text-ink-secondary px-1"
          >
            {view === 'sources' ? '取消' : <ChevronLeft size={22} />}
          </button>
        }
      >
        {view !== 'sources' && (
          <div className="px-5 pt-1 pb-2">
            <p className="text-caption text-ink-secondary">选择内容来源</p>
            <p className="text-h2 text-ink-primary mt-1">{secondaryTitle}</p>
          </div>
        )}
        {renderContent()}
      </BottomSheet>

      <SaveToKnowledgeBaseSheet
        open={showLinkSaveSheet}
        onClose={() => setShowLinkSaveSheet(false)}
        sourceContent={linkContent}
        successToast={kb => `已保存「${linkContent.title}」到「${kb.name}」`}
        onSaved={() => {
          setLinkValue('')
          setShowLinkSaveSheet(false)
        }}
      />
    </>
  )
}
