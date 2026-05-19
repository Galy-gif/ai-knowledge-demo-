import { useMemo, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Check, ChevronLeft, ChevronRight } from 'lucide-react'
import { useKnowledge } from '../../context/KnowledgeContext'
import { useUser } from '../../context/UserContext'
import { QUICK_NOTES_KB_ID, type FileType, type KnowledgeFile } from '../../mock/data'
import Toast from '../../components/common/Toast'
import ConfirmDialog from '../../components/common/ConfirmDialog'

type SourceKey =
  | 'browser-history'
  | 'wechat'
  | 'screenshot'
  | 'download'
  | 'email'
  | 'cloud-files'

interface SourceItem {
  id: string
  title: string
  meta: string
  thumb?: string
  fileType: FileType
  size: string
  summary: string
  hasSaveMode?: boolean
}

interface SourceConfig {
  title: string
  statusText: string
  items: SourceItem[]
  showBreadcrumb?: boolean
}

const BROWSER_HISTORY: SourceItem[] = [
  { id: 'bh1', title: 'AI Native 浏览器的未来', meta: '知乎专栏 · 2 小时前', fileType: 'url', size: '—', summary: '关于 AI Native 浏览器形态的趋势讨论。', hasSaveMode: true },
  { id: 'bh2', title: '2024 产品趋势报告.pdf', meta: '网站 · 昨天', fileType: 'pdf', size: '2.4MB', summary: '2024 年产品趋势研究 PDF。', hasSaveMode: true },
  { id: 'bh3', title: 'Notion AI 功能拆解', meta: '公众号 · 昨天', fileType: 'url', size: '—', summary: 'Notion AI 各模块能力拆解。', hasSaveMode: true },
  { id: 'bh4', title: 'Linear vs Jira 深度对比', meta: '今天上午', fileType: 'url', size: '—', summary: 'Linear 与 Jira 的体验对比分析。', hasSaveMode: true },
  { id: 'bh5', title: '用户访谈方法论', meta: 'Medium · 3 天前', fileType: 'url', size: '—', summary: '用户访谈提纲与方法论整理。', hasSaveMode: true },
  { id: 'bh6', title: 'Manus Agent 实测分析', meta: '即刻 · 3 天前', fileType: 'url', size: '—', summary: 'Manus Agent 实测体验记录。', hasSaveMode: true },
  { id: 'bh7', title: '移动端浏览器交互趋势', meta: '设计周报 · 1 周前', fileType: 'url', size: '—', summary: '移动端浏览器交互形态的趋势观察。', hasSaveMode: true },
  { id: 'bh8', title: 'Arc 浏览器停服公告', meta: 'The Verge · 1 周前', fileType: 'url', size: '—', summary: 'Arc 浏览器停服的官方公告。', hasSaveMode: true },
]

const WECHAT: SourceItem[] = [
  { id: 'wx1', title: '「PMTalk」AI 浏览器产品机会分析', meta: '公众号 · 今天', fileType: 'url', size: '—', summary: 'PMTalk 公众号关于 AI 浏览器的机会点分析。' },
  { id: 'wx2', title: '朋友转发：移动端 AI 体验调研', meta: '文章 · 昨天', fileType: 'url', size: '—', summary: '朋友转发的移动端 AI 体验调研文章。' },
  { id: 'wx3', title: '「极客时间」大模型应用开发课', meta: '课程链接 · 2 天前', fileType: 'url', size: '—', summary: '极客时间大模型应用开发课程的介绍链接。' },
  { id: 'wx4', title: '张三发的语音：产品方向讨论', meta: '语音 47s · 3 天前', fileType: 'audio', size: '47s', summary: '张三发的产品方向讨论语音。' },
  { id: 'wx5', title: '行业群里的截图：竞品功能对比', meta: '图片 · 4 天前', fileType: 'image', size: '0.8MB', summary: '行业群里转发的竞品功能对比截图。' },
  { id: 'wx6', title: '「字节范儿」内部文档分享', meta: '链接 · 5 天前', fileType: 'url', size: '—', summary: '字节范儿公众号转发的内部文档链接。' },
]

const SCREENSHOT: SourceItem[] = [
  { id: 'sc1', title: '截图 2026-05-15 14:32', meta: '公众号文章 · 刚刚', fileType: 'image', size: '0.6MB', summary: '截屏自公众号文章。', thumb: '📰' },
  { id: 'sc2', title: '截图 2026-05-15 11:08', meta: '数据图表 · 今天上午', fileType: 'image', size: '0.9MB', summary: '截屏的数据图表。', thumb: '📊' },
  { id: 'sc3', title: '截图 2026-05-14 22:15', meta: 'X 上的帖子 · 昨晚', fileType: 'image', size: '0.4MB', summary: '截屏自 X 上的帖子。', thumb: '🐦' },
  { id: 'sc4', title: '截图 2026-05-14 16:42', meta: '知乎回答 · 昨天', fileType: 'image', size: '0.7MB', summary: '截屏自知乎回答。', thumb: '💭' },
]

const DOWNLOAD: SourceItem[] = [
  { id: 'dl1', title: '2024 产品趋势报告.pdf', meta: '2.4MB · 昨天', fileType: 'pdf', size: '2.4MB', summary: '下载的 2024 产品趋势报告。' },
  { id: 'dl2', title: '用户访谈记录.txt', meta: '45KB · 3 天前', fileType: 'txt', size: '45KB', summary: '下载的用户访谈记录文本。' },
  { id: 'dl3', title: 'Q3 OKR 草稿.docx', meta: '1.1MB · 4 天前', fileType: 'doc', size: '1.1MB', summary: '下载的 Q3 OKR 草稿文档。' },
  { id: 'dl4', title: '竞品分析视频.mp4', meta: '87MB · 1 周前', fileType: 'audio', size: '87MB', summary: '下载的竞品分析视频。' },
  { id: 'dl5', title: '设计稿打包.zip', meta: '124MB · 1 周前', fileType: 'doc', size: '124MB', summary: '下载的设计稿打包。' },
]

const EMAIL: SourceItem[] = [
  { id: 'em1', title: '客户反馈汇总.xlsx', meta: '来自张三 · 今天 9:30', fileType: 'doc', size: '320KB', summary: '张三邮件附件，客户反馈汇总。' },
  { id: 'em2', title: 'Q4 财报.pdf', meta: '来自财务部 · 昨天', fileType: 'pdf', size: '1.8MB', summary: '财务部邮件附件，Q4 财报。' },
  { id: 'em3', title: '竞品分析 v2.pptx', meta: '来自王五 · 2 天前', fileType: 'doc', size: '4.2MB', summary: '王五邮件附件，竞品分析 v2。' },
  { id: 'em4', title: '面试题库.docx', meta: '来自 HR · 3 天前', fileType: 'doc', size: '780KB', summary: 'HR 邮件附件，面试题库。' },
  { id: 'em5', title: '会议纪要-202605.docx', meta: '来自会议秘书 · 5 天前', fileType: 'doc', size: '210KB', summary: '会议秘书邮件附件，5 月会议纪要。' },
]

const CLOUD_FILES: SourceItem[] = [
  { id: 'cf1', title: '2024 产品趋势报告.pdf', meta: '/工作资料 · 2.4MB · 昨天', fileType: 'pdf', size: '2.4MB', summary: '网盘 /工作资料 路径下的趋势报告。' },
  { id: 'cf2', title: '用户访谈逐字稿合集.docx', meta: '/工作资料 · 1.8MB · 3 天前', fileType: 'doc', size: '1.8MB', summary: '网盘 /工作资料 路径下的访谈逐字稿。' },
  { id: 'cf3', title: '认知觉醒.epub', meta: '/读书笔记 · 1.2MB · 1 周前', fileType: 'doc', size: '1.2MB', summary: '网盘 /读书笔记 路径下的电子书。' },
  { id: 'cf4', title: 'AI 产品截图集.zip', meta: '/素材 · 45MB · 2 周前', fileType: 'doc', size: '45MB', summary: '网盘 /素材 路径下的截图压缩包。' },
  { id: 'cf5', title: '2026-05-12 产品周会.m4a', meta: '/会议录音 · 32MB · 3 天前', fileType: 'audio', size: '32MB', summary: '网盘 /会议录音 路径下的周会录音。' },
  { id: 'cf6', title: '2024Q3 复盘文档.pdf', meta: '/备份 · 5.6MB · 1 月前', fileType: 'pdf', size: '5.6MB', summary: '网盘 /备份 路径下的 Q3 复盘文档。' },
]

const CLOUD_PROVIDER_NAMES: Record<string, string> = {
  baidu: '百度网盘',
  aliyun: '阿里云盘',
  icloud: 'iCloud Drive',
  onedrive: 'OneDrive',
  gdrive: 'Google Drive',
}

function buildConfig(source: SourceKey, providerName?: string): SourceConfig {
  switch (source) {
    case 'browser-history':
      return { title: '从浏览器历史添加', statusText: `已连接 · 同步 ${BROWSER_HISTORY.length} 条内容`, items: BROWSER_HISTORY }
    case 'wechat':
      return { title: '从微信收藏添加', statusText: `已连接 · 同步 ${WECHAT.length} 条内容`, items: WECHAT }
    case 'screenshot':
      return { title: '从系统截图添加', statusText: `已连接 · 同步 ${SCREENSHOT.length} 张截图`, items: SCREENSHOT }
    case 'download':
      return { title: '从下载文件添加', statusText: `已连接 · 同步 ${DOWNLOAD.length} 个文件`, items: DOWNLOAD }
    case 'email':
      return { title: '从邮件附件添加', statusText: `已连接 · 同步 ${EMAIL.length} 个附件`, items: EMAIL }
    case 'cloud-files':
      return {
        title: `从${providerName ?? '网盘'}添加`,
        statusText: `已连接 · 同步 ${CLOUD_FILES.length} 个文件`,
        items: CLOUD_FILES,
        showBreadcrumb: true,
      }
  }
}

type BrowserSaveMode = 'full' | 'selection'

function SelectCheck({ selected }: { selected: boolean }) {
  return (
    <div
      className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 ${
        selected ? 'bg-brand-orange border-brand-orange' : 'border-line-base bg-white'
      }`}
    >
      {selected && <Check size={12} className="text-white" strokeWidth={2.4} />}
    </div>
  )
}

function fileTypeBadge(type: FileType, thumb?: string) {
  if (thumb) {
    return (
      <div className="w-10 h-10 rounded-card bg-[#F5F5F5] flex items-center justify-center text-[20px] flex-shrink-0">
        {thumb}
      </div>
    )
  }
  const bg: Record<FileType, string> = {
    pdf: '#FEE2E2', doc: '#DBEAFE', txt: '#FEF3C7', url: '#DBEAFE',
    image: '#FCE7F3', audio: '#EDE9FE', note: '#FFF1E6',
    pdf_excerpt: '#FEE2E2', doc_excerpt: '#DBEAFE', web_excerpt: '#DBEAFE',
    ai_excerpt: '#EDE9FE', note_excerpt: '#FFF1E6',
  }
  const label: Record<FileType, string> = {
    pdf: 'PDF', doc: 'DOC', txt: 'TXT', url: 'URL', image: 'IMG',
    audio: 'AUD', note: '速记',
    pdf_excerpt: 'PDF', doc_excerpt: 'DOC', web_excerpt: 'URL',
    ai_excerpt: 'AI', note_excerpt: '速记',
  }
  return (
    <div
      className="w-10 h-10 rounded-card flex items-center justify-center text-[10px] font-semibold text-ink-secondary flex-shrink-0"
      style={{ backgroundColor: bg[type] }}
    >
      {label[type]}
    </div>
  )
}

function Breadcrumb({ folder, onFolderChange }: { folder: string; onFolderChange: (f: string) => void }) {
  const folders = ['根目录', '工作资料', '读书笔记', '素材', '会议录音', '备份']
  return (
    <div className="px-5 py-2 flex items-center gap-1 text-caption text-ink-secondary overflow-x-auto scrollbar-hide">
      {folders.map((f, idx) => (
        <span key={f} className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={() => onFolderChange(f)}
            className={folder === f ? 'text-brand-orange font-medium' : 'text-ink-secondary'}
          >
            {f}
          </button>
          {idx < folders.length - 1 && <ChevronRight size={12} className="text-ink-placeholder" />}
        </span>
      ))}
    </div>
  )
}

interface ListRowProps {
  item: SourceItem
  selected: boolean
  onToggle: () => void
  saveMode?: BrowserSaveMode
  onSaveModeChange?: (mode: BrowserSaveMode) => void
}

function ListRow({ item, selected, onToggle, saveMode, onSaveModeChange }: ListRowProps) {
  return (
    <div className="px-4 py-3 mb-2 bg-white rounded-card border border-line-base">
      <button onClick={onToggle} className="w-full flex items-center gap-3 text-left">
        <SelectCheck selected={selected} />
        {fileTypeBadge(item.fileType, item.thumb)}
        <div className="flex-1 min-w-0">
          <p className="text-card-title text-ink-primary truncate">{item.title}</p>
          <p className="text-caption text-ink-placeholder mt-0.5 truncate">{item.meta}</p>
        </div>
      </button>
      {item.hasSaveMode && onSaveModeChange && (
        <div className="flex justify-end gap-2 mt-2">
          <button
            type="button"
            onClick={() => onSaveModeChange('full')}
            className={`h-7 rounded-pill px-3.5 text-[12px] leading-4 transition-colors ${
              (saveMode ?? 'full') === 'full'
                ? 'border border-brand-orange bg-brand-orange text-white'
                : 'border border-brand-orange bg-white text-brand-orange'
            }`}
          >
            整页
          </button>
          <button
            type="button"
            onClick={() => onSaveModeChange('selection')}
            className={`h-7 rounded-pill px-3.5 text-[12px] leading-4 transition-colors ${
              saveMode === 'selection'
                ? 'border border-brand-orange bg-brand-orange text-white'
                : 'border border-brand-orange bg-white text-brand-orange'
            }`}
          >
            选段
          </button>
        </div>
      )}
    </div>
  )
}

function BottomBar({ count, kbName, onCancel, onConfirm }: {
  count: number
  kbName: string
  onCancel: () => void
  onConfirm: () => void
}) {
  if (count === 0) return null
  return (
    <div className="absolute bottom-0 left-0 right-0 z-30 px-4 pb-4 pt-2 bg-white border-t border-line-base shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[13px] leading-5 text-ink-secondary">已选 {count} 项</p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-2 rounded-[10px] text-[13px] leading-5 text-ink-secondary active:bg-surface-card"
          >
            取消
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 rounded-[10px] bg-brand-orange text-white text-[13px] leading-5 font-semibold"
          >
            添加到「{kbName}」
          </button>
        </div>
      </div>
    </div>
  )
}

function ReconnectSheet({ open, providerName, onClose }: { open: boolean; providerName: string; onClose: () => void }) {
  if (!open) return null
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-[280px] bg-white rounded-card-lg p-5 text-center">
        <p className="text-h2 text-ink-primary mb-2">重新连接 {providerName}</p>
        <p className="text-caption text-ink-secondary mb-4">需要授权后才能继续同步该来源的内容。</p>
        <button
          onClick={onClose}
          className="w-full py-2.5 bg-brand-orange text-white rounded-btn text-body font-medium"
        >
          已连接，继续
        </button>
      </div>
    </div>
  )
}

export default function K14_AddFromSource() {
  const { source: rawSource } = useParams<{ source: string }>()
  const [searchParams] = useSearchParams()
  const provider = searchParams.get('provider') ?? undefined
  const source = (rawSource ?? 'browser-history') as SourceKey
  const navigate = useNavigate()
  const { activeBase, quickNotesBase, addFile } = useKnowledge()
  const { showToast } = useUser()

  const providerName = provider ? CLOUD_PROVIDER_NAMES[provider] : undefined
  const config = useMemo(() => buildConfig(source, providerName), [source, providerName])

  const kbId = activeBase?.id ?? QUICK_NOTES_KB_ID
  const kbName = activeBase?.name ?? quickNotesBase.name

  const [selected, setSelected] = useState<string[]>([])
  const [saveModes, setSaveModes] = useState<Record<string, BrowserSaveMode>>({})
  const [folder, setFolder] = useState('根目录')
  const [showReconnect, setShowReconnect] = useState(false)

  const toggle = (id: string) =>
    setSelected(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]))

  const handleConfirm = () => {
    if (selected.length === 0) return
    const picked = config.items.filter(item => selected.includes(item.id))
    picked.forEach(item => {
      const mode = saveModes[item.id] ?? 'full'
      const isSelection = source === 'browser-history' && mode === 'selection'
      const file: KnowledgeFile = {
        id: `file_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        kbId,
        name: isSelection ? `${item.title} · 选段` : item.title,
        type: item.fileType,
        size: item.size,
        uploadedAt: '刚刚',
        summary: item.summary,
        content: item.fileType === 'url' || item.fileType === 'note'
          ? `# ${item.title}\n\n${item.summary}`
          : undefined,
      }
      addFile(file)
    })
    showToast(`已添加 ${picked.length} 项到「${kbName}」`)
    setTimeout(() => navigate(-1), 800)
  }

  const showBreadcrumb = config.showBreadcrumb

  return (
    <div className="flex flex-col h-full relative bg-white">
      <div className="h-14 flex items-center px-4 bg-white border-b border-line-base flex-shrink-0">
        <button onClick={() => navigate(-1)} className="p-1 -ml-1 mr-2 text-ink-secondary">
          <ChevronLeft size={24} />
        </button>
        <span className="flex-1 text-h2 text-ink-primary truncate">{config.title}</span>
        <button
          onClick={() => setShowReconnect(true)}
          className="text-[11px] text-brand-orange px-2 py-1 active:bg-brand-orange-light rounded-md"
        >
          重新连接
        </button>
      </div>

      <div className={`flex-1 overflow-y-auto scrollbar-hide ${selected.length > 0 ? 'pb-20' : 'pb-4'}`}>
        <div className="px-5 pt-3 pb-2">
          <div className="rounded-card bg-brand-orange-light px-3 py-2.5 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-orange" />
            <p className="text-caption text-ink-primary">{config.statusText}</p>
          </div>
        </div>

        {showBreadcrumb && <Breadcrumb folder={folder} onFolderChange={setFolder} />}

        <div className="px-5 pt-2">
          {config.items.map(item => (
            <ListRow
              key={item.id}
              item={item}
              selected={selected.includes(item.id)}
              onToggle={() => toggle(item.id)}
              saveMode={saveModes[item.id]}
              onSaveModeChange={item.hasSaveMode
                ? mode => setSaveModes(prev => ({ ...prev, [item.id]: mode }))
                : undefined}
            />
          ))}
        </div>
      </div>

      <BottomBar
        count={selected.length}
        kbName={kbName}
        onCancel={() => setSelected([])}
        onConfirm={handleConfirm}
      />

      <ReconnectSheet
        open={showReconnect}
        providerName={providerName ?? '该来源'}
        onClose={() => setShowReconnect(false)}
      />

      <Toast />
      <ConfirmDialog />
    </div>
  )
}
