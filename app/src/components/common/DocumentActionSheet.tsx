import { useNavigate } from 'react-router-dom'
import { Share2, Link2, FileText, Flag, Trash2, ExternalLink, Copy, Bookmark } from 'lucide-react'
import BottomSheet from '../ui/BottomSheet'
import { useUser } from '../../context/UserContext'

type DocType = 'knowledge' | 'note' | 'web'

const ACTIONS: Record<DocType, Array<{ icon: typeof Share2; label: string; id: string; danger?: boolean }>> = {
  knowledge: [
    { icon: Share2,       label: '分享文档',   id: 'share' },
    { icon: Link2,        label: '复制链接',   id: 'copy-link' },
    { icon: FileText,     label: '添加到笔记', id: 'note' },
    { icon: Flag,         label: '举报',       id: 'report' },
  ],
  note: [
    { icon: Share2,       label: '分享笔记',   id: 'share' },
    { icon: Copy,         label: '复制全文',   id: 'copy-content' },
    { icon: ExternalLink, label: '导出笔记',   id: 'export' },
    { icon: Trash2,       label: '删除笔记',   id: 'delete', danger: true },
  ],
  web: [
    { icon: Share2,       label: '分享文章',     id: 'share' },
    { icon: Link2,        label: '复制链接',     id: 'copy-link' },
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
  annotationsCount?: number
  onAnnotations?: () => void
}

export default function DocumentActionSheet({ open, onClose, docType, docContent, onDelete, annotationsCount, onAnnotations }: Props) {
  const { showToast, showConfirm } = useUser()
  const navigate = useNavigate()

  const allActions = annotationsCount && annotationsCount > 0 && onAnnotations
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
      case 'note':
        if (docContent) navigate('/notes/edit', { state: { prefilledContent: docContent } })
        else navigate('/notes/edit')
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
          title: '删除笔记',
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
        {allActions.map(({ icon: Icon, label, id, danger }) => (
          <button
            key={id}
            onClick={() => handleAction(id)}
            className={`w-full flex items-center gap-4 py-4 border-b border-line-base last:border-0 active:bg-surface-card transition-colors ${
              danger ? 'text-red-500' : 'text-ink-primary'
            }`}
          >
            <Icon size={18} className={danger ? 'text-red-400' : 'text-ink-secondary'} />
            <span className="text-body">{label}</span>
          </button>
        ))}
      </div>
    </BottomSheet>
  )
}
