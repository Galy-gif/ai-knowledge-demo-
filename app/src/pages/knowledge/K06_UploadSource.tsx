import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Check,
  ChevronRight,
  Hand,
  Link as LinkIcon,
  PenLine,
  RefreshCw,
} from 'lucide-react'
import BottomSheet from '../../components/ui/BottomSheet'
import SaveToKnowledgeBaseSheet from '../../components/common/SaveToKnowledgeBaseSheet'
import { useKnowledge, type SaveSourceContent } from '../../context/KnowledgeContext'
import { useUser } from '../../context/UserContext'
import { QUICK_NOTES_KB_ID, type FileType, type KnowledgeFile } from '../../mock/data'

const RECENT_BROWSER_DOWNLOADS: Array<{
  id: string
  title: string
  type: Extract<FileType, 'url' | 'pdf' | 'doc' | 'image'>
  source: string
  time: string
  summary: string
  emoji: string
}> = [
  { id: 'rb1', title: 'Notion AI 功能拆解', type: 'url', source: '微信文章', time: '2 小时前', summary: '来自微信文章的 Notion AI 功能分析。', emoji: '🌐' },
  { id: 'rb2', title: '2024 产品趋势报告.pdf', type: 'pdf', source: '下载', time: '昨天', summary: '最近下载的产品趋势报告 PDF。', emoji: '📄' },
  { id: 'rb3', title: 'Linear vs Jira', type: 'url', source: '博客文章', time: '今天上午', summary: 'Linear 与 Jira 的产品体验对比。', emoji: '🌐' },
  { id: 'rb4', title: '用户访谈方法论', type: 'url', source: '小红书', time: '3 天前', summary: '用户访谈提纲和方法论整理。', emoji: '🌐' },
  { id: 'rb5', title: 'OKR 制定指南.docx', type: 'doc', source: '下载', time: '1 周前', summary: '团队 OKR 制定指南文档。', emoji: '📝' },
  { id: 'rb6', title: 'Anthropic Claude 3 Demo', type: 'url', source: '网页', time: '4 小时前', summary: 'Claude 3 Demo 页面和能力说明。', emoji: '🌐' },
]

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

function PasteLinkRow({
  value,
  onChange,
  onSave,
}: {
  value: string
  onChange: (value: string) => void
  onSave: (content: SaveSourceContent) => void
}) {
  const trimmed = value.trim()
  const valid = isValidUrl(value)
  const hasInput = trimmed.length > 0

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
    <div className="mx-4 bg-white border border-[#EEEEEE] rounded-card p-3 flex items-center gap-3">
      <div
        className={`w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0 ${
          valid ? 'bg-[#DCFCE7]' : 'bg-brand-orange-light'
        }`}
      >
        {valid ? (
          <Check size={16} className="text-[#10B981]" strokeWidth={2.4} />
        ) : (
          <LinkIcon size={16} className="text-brand-orange" strokeWidth={2} />
        )}
      </div>
      <input
        value={value}
        onChange={event => onChange(event.target.value)}
        placeholder="粘贴链接快速添加"
        className="flex-1 min-w-0 bg-transparent outline-none text-[13px] leading-5 font-medium text-ink-primary placeholder:text-ink-placeholder placeholder:font-medium"
      />
      {hasInput && (
        <button
          onClick={handleSave}
          disabled={!valid}
          className="px-3 py-1 rounded-pill bg-brand-orange text-white text-[12px] leading-4 font-medium disabled:bg-line-base disabled:text-ink-placeholder flex-shrink-0"
        >
          保存
        </button>
      )}
    </div>
  )
}

function RecentScrollSection({
  selectedIds,
  savedIds,
  onToggle,
  onSeeAll,
}: {
  selectedIds: string[]
  savedIds: string[]
  onToggle: (id: string) => void
  onSeeAll: () => void
}) {
  return (
    <section>
      <div className="px-4 flex items-center justify-between mb-2.5">
        <h4 className="text-[13px] leading-5 font-semibold text-ink-primary">最近浏览/下载</h4>
        <button
          onClick={onSeeAll}
          className="flex items-center gap-0.5 text-[11px] leading-4 text-ink-placeholder active:text-ink-secondary"
        >
          全部
          <ChevronRight size={12} strokeWidth={2} />
        </button>
      </div>
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 px-4">
          {RECENT_BROWSER_DOWNLOADS.map(item => {
            const saved = savedIds.includes(item.id)
            const selected = selectedIds.includes(item.id)
            return (
              <button
                key={item.id}
                type="button"
                disabled={saved}
                onClick={() => !saved && onToggle(item.id)}
                className={`relative w-[130px] h-[84px] flex-shrink-0 rounded-card bg-white border p-2.5 text-left transition-all ${
                  selected
                    ? 'border-[1.5px] border-brand-orange shadow-[0_4px_12px_rgba(255,122,0,0.15)]'
                    : 'border-[#EEEEEE]'
                } ${saved ? 'opacity-60' : 'active:scale-[0.98]'}`}
              >
                <div className="w-7 h-7 rounded-[10px] bg-brand-orange-light flex items-center justify-center text-[14px] mb-1.5">
                  {item.emoji}
                </div>
                <p className="text-[12px] leading-[15px] font-semibold text-ink-primary line-clamp-2">{item.title}</p>
                <p className={`text-[10px] leading-3 mt-0.5 truncate ${saved ? 'text-[#10B981]' : 'text-ink-placeholder'}`}>
                  {saved ? '✓ 已添加' : item.time}
                </p>
                {selected && (
                  <span className="absolute right-1.5 top-1.5 h-4 w-4 rounded-full bg-brand-orange flex items-center justify-center">
                    <Check size={11} className="text-white" strokeWidth={2.6} />
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function EntryRow({
  icon,
  iconBg,
  iconColor,
  title,
  desc,
  onClick,
}: {
  icon: typeof RefreshCw
  iconBg: string
  iconColor: string
  title: string
  desc: string
  onClick: () => void
}) {
  const Icon = icon
  return (
    <button
      type="button"
      onClick={onClick}
      className="mx-4 w-[calc(100%-32px)] bg-white border border-[#EEEEEE] rounded-card p-3 flex items-center gap-3 active:scale-[0.99] transition-transform"
    >
      <div
        className="w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: iconBg }}
      >
        <Icon size={16} style={{ color: iconColor }} strokeWidth={2} />
      </div>
      <div className="flex-1 min-w-0 text-left">
        <p className="text-[14px] leading-5 font-semibold text-ink-primary">{title}</p>
        <p className="text-[11px] leading-4 text-ink-placeholder mt-0.5 truncate">{desc}</p>
      </div>
      <ChevronRight size={14} className="text-ink-placeholder flex-shrink-0" strokeWidth={2} />
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
  const isQuickNotes = activeBase?.id === QUICK_NOTES_KB_ID

  const currentKbId = activeBase?.id ?? QUICK_NOTES_KB_ID
  const currentKbName = activeBase?.name ?? quickNotesBase.name

  const resetAndClose = () => {
    setSelectedShortcutIds([])
    onClose()
  }

  const navigateTo = (route: string) => {
    resetAndClose()
    setTimeout(() => navigate(route), 80)
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

  const toggleShortcut = (id: string) => {
    setSelectedShortcutIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    )
  }

  const selectedBrowsingItems = RECENT_BROWSER_DOWNLOADS.filter(item =>
    selectedShortcutIds.includes(item.id) && !savedBrowsingIds.includes(item.id)
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
        headerRight={<div className="w-7 h-7" aria-hidden />}
      >
        <div className={`pt-4 ${selectedShortcutCount > 0 ? 'pb-24' : 'pb-4'} space-y-4`}>
          <PasteLinkRow
            value={linkValue}
            onChange={setLinkValue}
            onSave={openLinkSaveSheet}
          />

          <RecentScrollSection
            selectedIds={selectedShortcutIds}
            savedIds={savedBrowsingIds}
            onToggle={toggleShortcut}
            onSeeAll={() => navigateTo('/knowledge/add-from/browser-history')}
          />

          <EntryRow
            icon={RefreshCw}
            iconBg="#FFF1E6"
            iconColor="#FF7A00"
            title="自动同步"
            desc="浏览器 · 微信 · 网盘 · 截图 · 邮件 · 下载"
            onClick={() => navigateTo(`/knowledge/${currentKbId}/add-from-auto`)}
          />

          <EntryRow
            icon={Hand}
            iconBg="#F8F8F8"
            iconColor="#8C8C8C"
            title="手动添加"
            desc="上传文件 · 第三方分享 · AI 对话 · 扫一扫"
            onClick={() => navigateTo(`/knowledge/${currentKbId}/add-from-manual`)}
          />

          {isQuickNotes && (
            <button
              onClick={handleNewQuickNote}
              className="mx-4 w-[calc(100%-32px)] h-12 rounded-card bg-brand-orange/[0.04] border border-brand-orange/20 px-3 flex items-center gap-3 active:bg-brand-orange-light transition-colors"
            >
              <div className="w-9 h-9 rounded-[10px] bg-brand-orange-light flex items-center justify-center flex-shrink-0">
                <PenLine size={16} strokeWidth={2} className="text-brand-orange" />
              </div>
              <span className="text-[14px] leading-5 font-semibold text-ink-primary">新建速记</span>
              <span className="ml-auto text-[11px] leading-4 text-ink-placeholder">快速记录灵感</span>
            </button>
          )}
        </div>

        <BottomActionBar
          count={selectedShortcutCount}
          onCancel={cancelShortcutSelection}
          onConfirm={confirmShortcutSelection}
          confirmLabel={confirmShortcutLabel}
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
