import { useEffect, useState } from 'react'
import { Check, Home, MessageCircle, Users, WifiOff } from 'lucide-react'
import BottomSheet from '../ui/BottomSheet'

export type AccessModeId = 'desktop' | 'offline' | 'chat' | 'team'

interface AccessOption {
  id: AccessModeId
  Icon: typeof Home
  label: string
  desc: string
}

const OPTIONS: AccessOption[] = [
  { id: 'desktop', Icon: Home, label: '添加到桌面', desc: '在手机桌面上添加图标，独立 App 体验' },
  { id: 'offline', Icon: WifiOff, label: '离线可用', desc: '无网络时也能查看（数据缓存）' },
  { id: 'chat', Icon: MessageCircle, label: '嵌入对话', desc: '在 AI 问答中可调用此应用结果' },
  { id: 'team', Icon: Users, label: '团队共享', desc: '邀请同事一起使用' },
]

export const ACCESS_MODE_LABELS: Record<AccessModeId, string> = {
  desktop: '桌面',
  offline: '离线',
  chat: '嵌入对话',
  team: '团队共享',
}

export const DEFAULT_ACCESS_MODES: AccessModeId[] = ['desktop', 'offline']

interface AccessModeSheetProps {
  open: boolean
  selected: AccessModeId[]
  onClose: () => void
  onApply: (modes: AccessModeId[]) => void
}

export default function AccessModeSheet({
  open,
  selected,
  onClose,
  onApply,
}: AccessModeSheetProps) {
  const [draft, setDraft] = useState<AccessModeId[]>([])

  useEffect(() => {
    if (open) setDraft(selected)
  }, [open, selected])

  const toggle = (id: AccessModeId) => {
    setDraft(prev => {
      if (prev.includes(id)) {
        if (prev.length <= 1) return prev
        return prev.filter(x => x !== id)
      }
      return [...prev, id]
    })
  }

  const canComplete = draft.length >= 1

  const handleComplete = () => {
    if (!canComplete) return
    onApply(draft)
    onClose()
  }

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title="访问方式"
      titleAlign="center"
      titleClassName="text-[17px] leading-6 font-semibold text-ink-primary"
      headerLeft={
        <button onClick={onClose} className="text-[14px] text-ink-secondary">取消</button>
      }
      headerRight={
        <button
          onClick={handleComplete}
          className={`text-[14px] font-medium ${canComplete ? 'text-brand-orange' : 'text-ink-placeholder'}`}
        >
          完成
        </button>
      }
    >
      <div className="px-5 pt-3 pb-6">
        <p className="text-caption text-ink-secondary text-center mb-5">选择如何使用这个小应用</p>
        <div className="space-y-2">
          {OPTIONS.map(({ id, Icon, label, desc }) => {
            const sel = draft.includes(id)
            return (
              <button
                key={id}
                onClick={() => toggle(id)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-card border text-left transition-colors ${
                  sel
                    ? 'border-brand-orange bg-[#FFF1E6]'
                    : 'border-line-base bg-white active:bg-surface-card'
                }`}
              >
                <div className={`w-9 h-9 rounded-card flex items-center justify-center flex-shrink-0 ${
                  sel ? 'bg-brand-orange' : 'bg-surface-card'
                }`}>
                  <Icon size={17} className={sel ? 'text-white' : 'text-ink-secondary'} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-body font-medium ${sel ? 'text-brand-orange' : 'text-ink-primary'}`}>{label}</p>
                  <p className="text-caption text-ink-placeholder mt-0.5">{desc}</p>
                </div>
                {sel && (
                  <div className="w-5 h-5 rounded-full bg-brand-orange flex items-center justify-center flex-shrink-0">
                    <Check size={12} className="text-white" />
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </BottomSheet>
  )
}
