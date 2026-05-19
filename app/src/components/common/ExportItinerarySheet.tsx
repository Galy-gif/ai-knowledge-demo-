import BottomSheet from '../ui/BottomSheet'

interface ExportOption {
  emoji: string
  label: string
  desc: string
  toast: string
}

const OPTIONS: ExportOption[] = [
  { emoji: '📄', label: '导出为 PDF', desc: '适合打印或离线查看', toast: '已生成 PDF' },
  { emoji: '📅', label: '添加到日历', desc: '同步到系统日历应用', toast: '已添加到日历' },
  { emoji: '💬', label: '分享到微信', desc: '发给同行的朋友', toast: '已分享到微信' },
  { emoji: '📋', label: '复制行程链接', desc: '通过链接分享', toast: '已复制链接' },
]

interface ExportItinerarySheetProps {
  open: boolean
  onClose: () => void
  onPick: (toast: string) => void
}

export default function ExportItinerarySheet({ open, onClose, onPick }: ExportItinerarySheetProps) {
  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title="导出行程"
      titleAlign="center"
      titleClassName="text-[17px] leading-6 font-semibold text-ink-primary"
    >
      <div className="px-5 pt-2 pb-6">
        <p className="text-[11px] text-ink-placeholder text-center mb-4">选择导出方式</p>
        <div className="space-y-2">
          {OPTIONS.map(opt => (
            <button
              key={opt.label}
              onClick={() => {
                onPick(opt.toast)
                onClose()
              }}
              className="w-full flex items-center gap-3 px-4 py-3.5 rounded-card border border-line-base bg-white active:bg-surface-card transition-colors text-left active:scale-[0.98]"
            >
              <div className="w-10 h-10 rounded-card bg-surface-card flex items-center justify-center text-[20px] flex-shrink-0">
                {opt.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-body font-medium text-ink-primary">{opt.label}</p>
                <p className="text-caption text-ink-placeholder mt-0.5">{opt.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </BottomSheet>
  )
}
