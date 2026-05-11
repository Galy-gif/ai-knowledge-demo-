import { useNavigate } from 'react-router-dom'
import { Camera, ChevronRight, FileText, Mic, Sparkles } from 'lucide-react'
import BottomSheet from '../../components/ui/BottomSheet'

interface N03NewNoteMenuProps {
  open: boolean
  onClose: () => void
}

const NOTE_ACTIONS = [
  {
    Icon: Sparkles,
    label: 'AI 帮我写',
    desc: '从模板和一句需求生成初稿',
    path: '/notes/ai-write',
    color: 'text-brand-orange',
    bg: 'bg-brand-orange-light',
  },
  {
    Icon: FileText,
    label: '空白笔记',
    desc: '直接进入编辑器自由记录',
    path: '/notes/edit',
    color: 'text-blue-500',
    bg: 'bg-blue-50',
  },
  {
    Icon: Mic,
    ExtraIcon: Camera,
    label: '语音 / 拍照笔记',
    desc: '先创建采集模板，再补充素材',
    path: '/notes/edit',
    color: 'text-green-600',
    bg: 'bg-green-50',
    state: {
      prefillTitle: '语音 / 拍照笔记',
      prefilledContent: `## 采集素材

- 语音转写：
- 图片识别：

## AI 整理

`,
    },
  },
]

export default function N03_NewNoteMenu({ open, onClose }: N03NewNoteMenuProps) {
  const navigate = useNavigate()

  const handleSelect = (action: typeof NOTE_ACTIONS[number]) => {
    onClose()
    navigate(action.path, action.state ? { state: action.state } : undefined)
  }

  return (
    <BottomSheet open={open} onClose={onClose} title="新建笔记">
      <div className="px-5 py-3">
        <div className="space-y-2">
          {NOTE_ACTIONS.map(action => {
            const { Icon, ExtraIcon } = action
            return (
              <button
                key={action.label}
                onClick={() => handleSelect(action)}
                className="w-full flex items-center gap-3 p-3.5 bg-surface-card rounded-card border border-line-base text-left active:bg-white transition-colors"
              >
                <div className={`w-11 h-11 rounded-card flex items-center justify-center flex-shrink-0 ${action.bg}`}>
                  <Icon size={20} className={action.color} />
                  {ExtraIcon && <ExtraIcon size={15} className={`${action.color} -ml-1 mt-3`} />}
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
