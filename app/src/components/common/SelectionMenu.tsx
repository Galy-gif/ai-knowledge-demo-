const DEFAULT_ACTIONS = ['复制', '高亮', 'AI 追问', '翻译', '解释', '做笔记']

interface Props {
  visible: boolean
  text: string
  onAction: (action: string) => void
  onDismiss: () => void
  actions?: string[]
  bottomPx?: number
  isHighlighted?: boolean
}

export default function SelectionMenu({
  visible, text, onAction, onDismiss,
  actions = DEFAULT_ACTIONS,
  bottomPx = 68,
  isHighlighted = false,
}: Props) {
  if (!visible) return null

  // Swap "高亮" → "取消高亮" (or vice-versa) based on current state
  const finalActions = actions.map(a => a === '高亮' ? (isHighlighted ? '取消高亮' : '高亮') : a)

  return (
    <div
      className="absolute inset-x-4 z-30"
      style={{ bottom: bottomPx }}
      onClick={onDismiss}
    >
      <div
        className="bg-ink-primary rounded-card-lg px-4 py-3 shadow-float"
        onClick={e => e.stopPropagation()}
      >
        <p className="text-caption text-white/50 mb-2.5 truncate">
          「{text.slice(0, 48)}{text.length > 48 ? '…' : ''}」
        </p>
        <div className="flex gap-2 flex-wrap">
          {finalActions.map(action => (
            <button
              key={action}
              onClick={() => onAction(action)}
              className={`px-3 py-1.5 text-caption rounded-pill active:opacity-70 transition-colors ${
                action === '取消高亮'
                  ? 'bg-yellow-400/30 text-yellow-200'
                  : 'bg-white/10 text-white'
              }`}
            >
              {action}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
