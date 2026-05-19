import { useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Check,
  ChevronRight,
  FileText,
  Globe2,
  Image as ImageIcon,
  Link as LinkIcon,
  PenLine,
} from 'lucide-react'
import BottomSheet from '../../components/ui/BottomSheet'
import SaveToKnowledgeBaseSheet from '../../components/common/SaveToKnowledgeBaseSheet'
import { useKnowledge, type SaveSourceContent } from '../../context/KnowledgeContext'
import { useUser } from '../../context/UserContext'
import { QUICK_NOTES_KB_ID, type FileType, type KnowledgeFile } from '../../mock/data'
import { getFileTypeVisual } from '../../utils/fileTypeVisuals'

interface SourceCard {
  key: string
  route: string
  emoji: string
  bg: string
  title: string
  desc: string
}

const AUTO_SOURCES: SourceCard[] = [
  { key: 'browser-history', route: '/knowledge/add-from/browser-history', emoji: '🌐', bg: '#DBEAFE', title: '浏览器历史', desc: '浏览过的网页' },
  { key: 'wechat', route: '/knowledge/add-from/wechat', emoji: '💬', bg: '#D1FAE5', title: '微信收藏', desc: '收藏的文章/链接' },
  { key: 'cloud', route: '__cloud__', emoji: '☁️', bg: '#EDE9FE', title: '网盘', desc: '5 种主流网盘' },
  { key: 'email', route: '/knowledge/add-from/email', emoji: '✉️', bg: '#FEF3C7', title: '邮件附件', desc: '邮箱里的附件' },
  { key: 'screenshot', route: '/knowledge/add-from/screenshot', emoji: '📸', bg: '#FCE7F3', title: '系统截图', desc: '自动同步相册截图' },
  { key: 'download', route: '/knowledge/add-from/download', emoji: '📁', bg: '#FFF1E6', title: '下载文件', desc: '系统下载目录' },
]

const MANUAL_SOURCES: SourceCard[] = [
  { key: 'upload', route: '/knowledge/add-from/upload', emoji: '📤', bg: '#DBEAFE', title: '上传文件', desc: '从设备选文件' },
  { key: 'third-party', route: '/knowledge/add-from/third-party', emoji: '🔗', bg: '#D1FAE5', title: '第三方 App 分享', desc: '从其他 App 分享' },
  { key: 'ai-chat', route: '/knowledge/add-from/ai-chat', emoji: '🤖', bg: '#EDE9FE', title: 'AI 对话保存', desc: '保存 ChatGPT/Claude 对话' },
  { key: 'scan', route: '/knowledge/add-from/scan', emoji: '📷', bg: '#FEF3C7', title: '扫一扫', desc: '扫码或拍照' },
]

interface CloudProvider {
  id: string
  name: string
  emoji: string
  bg: string
  connected: boolean
}

const CLOUD_PROVIDERS: CloudProvider[] = [
  { id: 'baidu', name: '百度网盘', emoji: '🅑', bg: '#DBEAFE', connected: true },
  { id: 'aliyun', name: '阿里云盘', emoji: '🅐', bg: '#E0F2FE', connected: true },
  { id: 'icloud', name: 'iCloud Drive', emoji: '☁️', bg: '#F3F4F6', connected: false },
  { id: 'onedrive', name: 'OneDrive', emoji: '🅞', bg: '#DBEAFE', connected: false },
  { id: 'gdrive', name: 'Google Drive', emoji: '🅖', bg: '#FEF3C7', connected: false },
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
    return { Icon: Globe2, color: '#0284C7' }
  }
  if (type === 'pdf') {
    return { Icon: FileText, color: '#E74C3C' }
  }
  if (type === 'doc') {
    return { Icon: FileText, color: '#2B7BD6' }
  }
  if (type === 'image') {
    return { Icon: ImageIcon, color: '#10B981' }
  }
  const cfg = getFileTypeVisual(type)
  return { Icon: cfg.Icon, color: cfg.color }
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

function SourceGridCard({ card, onClick }: { card: SourceCard; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="h-[84px] rounded-card bg-white border border-[#EEEEEE] px-2.5 py-2 text-center active:scale-[0.96] transition-transform"
    >
      <div
        className="w-9 h-9 rounded-card mx-auto mb-1 flex items-center justify-center text-[20px]"
        style={{ backgroundColor: card.bg }}
      >
        {card.emoji}
      </div>
      <p className="text-[13px] leading-4 font-semibold text-ink-primary truncate">{card.title}</p>
      <p className="text-[11px] leading-3 text-ink-placeholder mt-0.5 truncate">{card.desc}</p>
    </button>
  )
}

function SourceGroup({ title, subtitle, items, onClick }: {
  title: string
  subtitle: string
  items: SourceCard[]
  onClick: (card: SourceCard) => void
}) {
  return (
    <section className="mb-5">
      <div className="mb-2">
        <p className="text-[13px] leading-5 font-semibold text-ink-primary">{title}</p>
        <p className="text-[11px] leading-4 text-ink-placeholder mt-0.5">{subtitle}</p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {items.map(item => (
          <SourceGridCard key={item.key} card={item} onClick={() => onClick(item)} />
        ))}
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
  onClick,
}: {
  title: string
  meta: string
  type: FileType
  state: SelectableCardState
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
      } ${saved ? 'opacity-60 cursor-default' : 'active:scale-[0.98]'}`}
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

function CloudPickerSheet({
  open,
  onClose,
  onPick,
}: {
  open: boolean
  onClose: () => void
  onPick: (provider: CloudProvider) => void
}) {
  if (!open) return null
  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-t-card-xl shadow-sheet pb-6">
        <div className="flex items-center justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-ink-placeholder/40 rounded-pill" />
        </div>
        <div className="px-5 pt-2 pb-3">
          <p className="text-h2 text-ink-primary">从哪个网盘添加？</p>
          <p className="text-caption text-ink-placeholder mt-1">已连接的网盘可直接浏览文件</p>
        </div>
        <div className="px-5 grid grid-cols-2 gap-2">
          {CLOUD_PROVIDERS.map(p => (
            <button
              key={p.id}
              onClick={() => onPick(p)}
              className="h-[84px] rounded-card bg-white border border-[#EEEEEE] px-2.5 py-2 text-center active:scale-[0.96] transition-transform"
            >
              <div
                className="w-9 h-9 rounded-card mx-auto mb-1 flex items-center justify-center text-[16px] font-bold"
                style={{ backgroundColor: p.bg }}
              >
                {p.emoji}
              </div>
              <p className="text-[13px] leading-4 font-semibold text-ink-primary truncate">{p.name}</p>
              <p className={`text-[11px] leading-3 mt-0.5 truncate ${
                p.connected ? 'text-[#10B981]' : 'text-ink-placeholder'
              }`}>
                {p.connected ? '已连接' : '未连接'}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function K06_UploadSource({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate()
  const { activeBase, setActiveFile, addFile, quickNotesBase } = useKnowledge()
  const { showToast } = useUser()
  const [linkValue, setLinkValue] = useState('')
  const [showLinkSaveSheet, setShowLinkSaveSheet] = useState(false)
  const [linkContent, setLinkContent] = useState<SaveSourceContent>({
    title: '网页链接',
    body: '',
    type: 'web',
  })
  const [selectedShortcutIds, setSelectedShortcutIds] = useState<string[]>([])
  const [savedBrowsingIds, setSavedBrowsingIds] = useState<string[]>([])
  const [showCloudPicker, setShowCloudPicker] = useState(false)
  const isQuickNotes = activeBase?.id === QUICK_NOTES_KB_ID

  const currentKbId = activeBase?.id ?? QUICK_NOTES_KB_ID
  const currentKbName = activeBase?.name ?? quickNotesBase.name

  const resetAndClose = () => {
    setSelectedShortcutIds([])
    setShowCloudPicker(false)
    onClose()
  }

  const navigateToSource = (route: string) => {
    resetAndClose()
    setTimeout(() => navigate(route), 80)
  }

  const handleSourceClick = (card: SourceCard) => {
    if (card.route === '__cloud__') {
      setShowCloudPicker(true)
      return
    }
    navigateToSource(card.route)
  }

  const handleCloudPick = (provider: CloudProvider) => {
    setShowCloudPicker(false)
    if (provider.connected) {
      navigateToSource(`/knowledge/add-from/cloud-files?provider=${provider.id}`)
      return
    }
    showToast(`正在连接${provider.name}...`)
    setTimeout(() => {
      showToast(`已连接${provider.name}`)
      navigateToSource(`/knowledge/add-from/cloud-files?provider=${provider.id}`)
    }, 1000)
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
            onClick={resetAndClose}
            className="text-body text-ink-secondary px-1"
          >
            取消
          </button>
        }
      >
        <div>
          <div className="sticky top-0 z-10 bg-white px-5 pt-2 pb-4 border-b border-line-base/60">
            <PasteLinkInput
              value={linkValue}
              onChange={setLinkValue}
              onSave={openLinkSaveSheet}
            />
          </div>

          <div className={`px-5 pt-4 ${selectedShortcutCount > 0 ? 'pb-24' : 'pb-4'}`}>
            <RecentShortcutSection
              title="最近浏览/下载"
              onAction={() => {
                resetAndClose()
                setTimeout(() => navigate('/knowledge/add-from/browser-history'), 80)
              }}
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

            <SourceGroup
              title="自动同步 🔄"
              subtitle="授权一次，持续帮你抓取"
              items={AUTO_SOURCES}
              onClick={handleSourceClick}
            />

            <SourceGroup
              title="手动添加 🤚"
              subtitle="需要时主动选择"
              items={MANUAL_SOURCES}
              onClick={handleSourceClick}
            />

            {isQuickNotes && (
              <button
                onClick={handleNewQuickNote}
                className="w-full h-12 rounded-card bg-brand-orange/[0.04] border border-brand-orange/20 px-3 flex items-center gap-3 active:bg-brand-orange-light transition-colors"
              >
                <div className="w-7 h-7 rounded-md bg-brand-orange/[0.08] flex items-center justify-center">
                  <PenLine size={16} strokeWidth={1.8} className="text-brand-orange" />
                </div>
                <span className="text-card-title text-ink-primary">新建速记</span>
                <span className="ml-auto text-caption text-ink-placeholder">快速记录灵感</span>
              </button>
            )}
          </div>
          <BottomActionBar
            count={selectedShortcutCount}
            onCancel={cancelShortcutSelection}
            onConfirm={confirmShortcutSelection}
            confirmLabel={confirmShortcutLabel}
          />
        </div>

        <CloudPickerSheet
          open={showCloudPicker}
          onClose={() => setShowCloudPicker(false)}
          onPick={handleCloudPick}
        />
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
