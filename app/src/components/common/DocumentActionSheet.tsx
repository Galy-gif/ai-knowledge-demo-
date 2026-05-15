import { useNavigate } from 'react-router-dom'
import { Share2, Link2, Flag, Trash2, ExternalLink, Copy, Bookmark, Edit3, FolderPlus, type LucideIcon } from 'lucide-react'
import BottomSheet from '../ui/BottomSheet'
import { useUser } from '../../context/UserContext'

type DocType = 'knowledge' | 'note' | 'web'
type ActionItem = { icon: LucideIcon; label: string; id: string; sub?: string; danger?: boolean }

const ACTIONS: Record<DocType, ActionItem[]> = {
  knowledge: [
    { icon: Share2,       label: '分享文档',   id: 'share' },
    { icon: Link2,        label: '复制链接',   id: 'copy-link' },
    { icon: FolderPlus,   label: '保存到知识库', id: 'kb', sub: '选择目标知识库' },
    { icon: Flag,         label: '举报',       id: 'report' },
  ],
  note: [
    { icon: Edit3,        label: '编辑',       id: 'edit' },
    { icon: Share2,       label: '分享速记',   id: 'share' },
    { icon: Copy,         label: '复制全文',   id: 'copy-content' },
    { icon: ExternalLink, label: '导出速记',   id: 'export' },
    { icon: Trash2,       label: '删除速记',   id: 'delete', danger: true },
  ],
  web: [
    { icon: Share2,       label: '分享文章',     id: 'share' },
    { icon: Link2,        label: '复制链接',     id: 'copy-link' },
    { icon: FolderPlus,   label: '保存到知识库', id: 'kb', sub: '选择目标知识库' },
    { icon: ExternalLink, label: '在浏览器中打开', id: 'open' },
    { icon: Flag,         label: '举报',         id: 'report' },
  ],
}

interface Props {
  open: boolean
  onClose: () => void
  docType: DocType
  docContent?: string
  onDelete?: () => void
  onEdit?: () => void
  onSaveToKnowledgeBase?: (content?: string) => void
  annotationsCount?: number
  onAnnotations?: () => void
}

export default function DocumentActionSheet({
  open,
  onClose,
  docType,
  docContent,
  onDelete,
  onEdit,
  onSaveToKnowledgeBase,
  annotationsCount,
  onAnnotations,
}: Props) {
  const { showToast, showConfirm } = useUser()
  const navigate = useNavigate()

  const allActions: ActionItem[] = annotationsCount && annotationsCount > 0 && onAnnotations
    ? [{ icon: Bookmark, label: `查看标注 (${annotationsCount}条)`, id: 'annotations' }, ...ACTIONS[docType]]
    : ACTIONS[docType]

  const handleAction = (id: string) => {
    onClose()
    switch (id) {
      case 'annotations':
        onAnnotations?.()
        break
      case 'share':
        navigator.clipboard.writeText(window.location.href).catch(() => {})
        showToast('分享链接已复制')
        break
      case 'copy-link':
        navigator.clipboard.writeText(window.location.href).catch(() => {})
        showToast('链接已复制')
        break
      case 'copy-content':
        if (docContent) navigator.clipboard.writeText(docContent).catch(() => {})
        showToast('全文已复制')
        break
      case 'edit':
        onEdit?.()
        break
      case 'kb':
        onSaveToKnowledgeBase?.(docContent)
        break
      case 'export':
        showToast('已加入导出队列')
        break
      case 'open':
        showToast('已在浏览器中打开')
        break
      case 'report':
        showToast('已反馈，感谢')
        break
      case 'delete':
        showConfirm({
          title: '删除速记',
          description: '删除后无法恢复，确认删除？',
          confirmText: '删除',
          danger: true,
          onConfirm: () => {
            onDelete?.()
            navigate(-1)
          },
        })
        break
    }
  }

  return (
    <BottomSheet open={open} onClose={onClose}>
      <div className="px-5 pb-4">
        {allActions.map(({ icon: Icon, label, id, sub, danger }) => (
          <button
            key={id}
            onClick={() => handleAction(id)}
            className={`w-full flex items-center gap-4 py-4 border-b border-line-base last:border-0 active:bg-surface-card transition-colors ${
              danger ? 'text-red-500' : 'text-ink-primary'
            }`}
          >
            <Icon size={18} className={danger ? 'text-red-400' : 'text-ink-secondary'} />
            <span className="flex-1 text-left">
              <span className="block text-body">{label}</span>
              {sub && <span className="block text-caption text-ink-placeholder mt-0.5">{sub}</span>}
            </span>
          </button>
        ))}
      </div>
    </BottomSheet>
  )
}
