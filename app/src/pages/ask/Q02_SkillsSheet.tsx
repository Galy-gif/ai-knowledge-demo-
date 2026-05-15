import {
  ChevronLeft,
  ChevronRight,
  FileText,
  Globe,
  PenLine,
  Sparkles,
  type LucideIcon,
} from 'lucide-react'
import BottomSheet from '../../components/ui/BottomSheet'

export interface MagicAction {
  label: string
  desc: string
  prompt: string
  Icon: LucideIcon
}

const MAGIC_ACTIONS: MagicAction[] = [
  {
    label: '总结',
    desc: '把长内容压缩成要点',
    prompt: '请帮我总结下面这段内容，输出 5 个关键要点：',
    Icon: Sparkles,
  },
  {
    label: '翻译',
    desc: '保留语气的中英互译',
    prompt: '请将下面内容翻译成自然、专业的英文：',
    Icon: Globe,
  },
  {
    label: '润色',
    desc: '让表达更清晰克制',
    prompt: '请帮我润色下面这段文字，保持原意但让表达更清晰：',
    Icon: PenLine,
  },
  {
    label: '续写',
    desc: '顺着已有思路补下一段',
    prompt: '请基于下面内容继续写，保持同样的语气和结构：',
    Icon: FileText,
  },
]

export default function Q02_SkillsSheet({
  open,
  onClose,
  onMagicApply,
}: {
  open: boolean
  onClose: () => void
  onMagicApply: (action: MagicAction) => void
}) {
  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title="妙招"
      headerLeft={
        <button
          onClick={onClose}
          aria-label="返回"
          className="p-1 text-ink-secondary"
        >
          <ChevronLeft size={24} />
        </button>
      }
    >
      <div className="px-5 py-3">
        <p className="text-caption text-ink-placeholder mb-3">快速处理</p>
        <div className="grid grid-cols-1 gap-2">
          {MAGIC_ACTIONS.map(action => {
            const { Icon } = action
            return (
              <button
                key={action.label}
                onClick={() => onMagicApply(action)}
                className="w-full flex items-center gap-3 p-3.5 bg-surface-card rounded-card border border-line-base text-left active:bg-white transition-colors"
              >
                <div className="w-10 h-10 rounded-card bg-white border border-line-base flex items-center justify-center flex-shrink-0">
                  <Icon size={18} className="text-brand-orange" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-card-title text-ink-primary">{action.label}</p>
                  <p className="text-caption text-ink-placeholder mt-0.5">{action.desc}</p>
                </div>
                <ChevronRight size={16} className="text-ink-placeholder flex-shrink-0" />
              </button>
            )
          })}
        </div>
      </div>
    </BottomSheet>
  )
}
