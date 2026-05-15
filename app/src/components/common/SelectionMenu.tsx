import {
  Copy,
  BookmarkPlus,
  Highlighter,
  Languages,
  MessageCircle,
  Slash,
  type LucideIcon,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import type { SelectionState } from '../../hooks/useTextSelection'

const DEFAULT_ACTIONS = ['复制', '高亮', '翻译', '入库', '追问']
const MENU_WIDTH = 280
const MENU_HEIGHT = 44
const EDGE_GAP = 12
const SELECTION_GAP = 8

interface Props {
  visible: boolean
  text: string
  rect?: SelectionState['rect']
  onAction: (action: string) => void
  onDismiss: () => void
  actions?: string[]
  bottomPx?: number
  isHighlighted?: boolean
}

export function getSelectionFloatingStyle(
  rect: SelectionState['rect'],
  width = MENU_WIDTH,
  height = MENU_HEIGHT,
): CSSProperties {
  if (!rect) {
    return {
      left: '50%',
      bottom: 76,
      transform: 'translateX(-50%)',
    }
  }

  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight
  const topSpace = rect.top
  const preferredTop = topSpace >= 60
    ? rect.top - height - SELECTION_GAP
    : rect.bottom + SELECTION_GAP
  const selectionCenter = rect.left + rect.width / 2
  const left = Math.min(
    Math.max(selectionCenter - width / 2, EDGE_GAP),
    Math.max(EDGE_GAP, viewportWidth - width - EDGE_GAP),
  )

  return {
    left,
    top: Math.min(Math.max(EDGE_GAP, preferredTop), Math.max(EDGE_GAP, viewportHeight - height - EDGE_GAP)),
  }
}

function getActionIcon(action: string): LucideIcon {
  if (action === '复制') return Copy
  if (action === '高亮' || action === '取消高亮') return Highlighter
  if (action === '翻译') return Languages
  if (action === '入库') return BookmarkPlus
  return MessageCircle
}

export default function SelectionMenu({
  visible, onAction, onDismiss,
  rect,
  actions = DEFAULT_ACTIONS,
  isHighlighted = false,
}: Props) {
  const menuRef = useRef<HTMLDivElement | null>(null)
  const [closing, setClosing] = useState(false)

  const finalActions = actions.map(a => a === '高亮' ? (isHighlighted ? '取消高亮' : '高亮') : a)
  const style = getSelectionFloatingStyle(rect)
  const closeWith = (callback: () => void) => {
    setClosing(true)
    window.setTimeout(callback, 100)
  }

  useEffect(() => {
    if (visible) setClosing(false)
  }, [visible, rect?.top, rect?.left, rect?.right, rect?.bottom])

  useEffect(() => {
    if (!visible) return

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target
      if (target instanceof Node && menuRef.current?.contains(target)) return
      onDismiss()
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeWith(onDismiss)
    }

    document.addEventListener('pointerdown', handlePointerDown, true)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown, true)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [visible, onDismiss])

  if (!visible) return null

  return (
    <div
      ref={menuRef}
      className={`fixed z-30 rounded-[12px] border-[1.5px] border-[#FF7A00] bg-white/[0.88] px-1 py-1 shadow-[0_4px_16px_rgba(0,0,0,0.08)] backdrop-blur-[20px] transition-opacity duration-100 supports-[not(backdrop-filter:blur(1px))]:bg-white/[0.95] ${
        closing ? 'opacity-0' : 'animate-selection-menu-in opacity-100'
      }`}
      style={style}
    >
      <div className="flex h-9 items-center">
        {finalActions.map((action, index) => {
          const displayAction = action === 'AI 追问' ? '追问' : action
          const Icon = getActionIcon(action)
          const active = action === '取消高亮'
          const payloadAction = displayAction === '追问' ? 'AI 追问' : action
          return (
            <div key={action} className="flex h-full items-center">
              {index > 0 && <span className="mx-0.5 h-6 w-px bg-[#FFE4D0]" />}
              <button
                type="button"
                onClick={() => closeWith(() => onAction(payloadAction))}
                className={`group -m-1 flex h-[42px] min-w-[50px] flex-col items-center justify-center rounded-[6px] px-[9px] py-1 transition-all duration-100 active:scale-95 ${
                  active ? 'bg-[#FFF1E6]' : ''
                }`}
              >
                <span className="relative flex h-4 w-4 items-center justify-center">
                  <Icon
                    size={16}
                    strokeWidth={1.9}
                    className={active ? 'text-[#FF7A00]' : 'text-[#4A4A4A]'}
                  />
                  {action === '取消高亮' && (
                    <Slash
                      size={14}
                      strokeWidth={2.2}
                      className="absolute text-[#FF7A00]"
                    />
                  )}
                </span>
                <span className={`mt-px whitespace-nowrap ${displayAction === '入库' ? 'text-[11px]' : 'text-[10px]'} leading-3 ${
                  active ? 'text-[#FF7A00]' : 'text-[#1A1A1A]'
                }`}>
                  {displayAction}
                </span>
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
