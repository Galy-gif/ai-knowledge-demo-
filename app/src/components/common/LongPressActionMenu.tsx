import { useRef, useState, type ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'

export interface LongPressMenuAction {
  id: string
  label: string
  icon: LucideIcon
  onAction: () => void
  danger?: boolean
  disabled?: boolean
}

interface LongPressActionMenuProps {
  children: ReactNode
  actions: LongPressMenuAction[]
  extraActions?: LongPressMenuAction[]
  disabled?: boolean
  className?: string
}

const MENU_WIDTH = 180
const MENU_EDGE_GAP = 12
const MENU_TOP_LIMIT = 100
const MENU_BOTTOM_LIMIT = 750
const MENU_ITEM_HEIGHT = 44
const MENU_VERTICAL_PADDING = 8
const MENU_SEPARATOR_HEIGHT = 9
const MENU_GAP_FROM_ITEM = 8
const LONG_PRESS_MS = 500
const MOVE_THRESHOLD = 8

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function getFrameBounds(source: HTMLElement) {
  const frame = source.closest('[data-phone-frame="true"]')?.getBoundingClientRect()
  if (!frame) {
    return {
      left: 0,
      right: window.innerWidth,
      top: 0,
      bottom: window.innerHeight,
      menuTopLimit: MENU_TOP_LIMIT,
      menuBottomLimit: Math.min(window.innerHeight - MENU_EDGE_GAP, MENU_BOTTOM_LIMIT),
    }
  }

  return {
    left: frame.left,
    right: frame.right,
    top: frame.top,
    bottom: frame.bottom,
    menuTopLimit: frame.top + MENU_TOP_LIMIT,
    menuBottomLimit: Math.min(frame.bottom - MENU_EDGE_GAP, frame.top + MENU_BOTTOM_LIMIT),
  }
}

export default function LongPressActionMenu({
  children,
  actions,
  extraActions = [],
  disabled,
  className = '',
}: LongPressActionMenuProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const pressTimer = useRef<number | null>(null)
  const startPoint = useRef<{ x: number; y: number } | null>(null)
  const suppressClick = useRef(false)
  const [pressed, setPressed] = useState(false)
  const [menuPosition, setMenuPosition] = useState<{ x: number; y: number } | null>(null)

  const allActions = actions.filter(action => !action.disabled)
  const visibleExtraActions = extraActions.filter(action => !action.disabled)
  const menuOpen = Boolean(menuPosition)
  const menuHeight = MENU_VERTICAL_PADDING
    + allActions.length * MENU_ITEM_HEIGHT
    + (visibleExtraActions.length > 0 ? MENU_SEPARATOR_HEIGHT + visibleExtraActions.length * MENU_ITEM_HEIGHT : 0)

  const clearPress = () => {
    if (pressTimer.current) {
      window.clearTimeout(pressTimer.current)
      pressTimer.current = null
    }
    startPoint.current = null
  }

  const openMenu = () => {
    const wrapper = wrapperRef.current
    const rect = wrapper?.getBoundingClientRect()
    if (!wrapper || !rect) return

    const bounds = getFrameBounds(wrapper)
    const leftLimit = bounds.left + MENU_EDGE_GAP
    const rightLimit = Math.max(leftLimit, bounds.right - MENU_WIDTH - MENU_EDGE_GAP)
    const topLimit = Math.min(
      bounds.menuTopLimit,
      Math.max(bounds.top + MENU_EDGE_GAP, bounds.menuBottomLimit - menuHeight),
    )
    const bottomLimit = bounds.menuBottomLimit
    const bottomTopLimit = Math.max(topLimit, bottomLimit - menuHeight)
    const itemCenterX = rect.left + rect.width / 2
    const belowTop = rect.bottom + MENU_GAP_FROM_ITEM
    const aboveTop = rect.top - menuHeight - MENU_GAP_FROM_ITEM

    const x = clamp(itemCenterX - MENU_WIDTH / 2, leftLimit, rightLimit)
    const preferredY = belowTop + menuHeight <= bottomLimit ? belowTop : aboveTop
    const y = clamp(preferredY, topLimit, bottomTopLimit)

    suppressClick.current = true
    setPressed(true)
    setMenuPosition({ x, y })
    window.setTimeout(() => setPressed(false), 160)
  }

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (disabled || event.button !== 0 || allActions.length === 0) return
    clearPress()
    startPoint.current = { x: event.clientX, y: event.clientY }
    suppressClick.current = false
    pressTimer.current = window.setTimeout(openMenu, LONG_PRESS_MS)
  }

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const start = startPoint.current
    if (!start) return
    if (Math.abs(event.clientX - start.x) > MOVE_THRESHOLD || Math.abs(event.clientY - start.y) > MOVE_THRESHOLD) {
      clearPress()
    }
  }

  const handlePointerEnd = () => {
    clearPress()
    window.setTimeout(() => {
      suppressClick.current = false
    }, 80)
  }

  const closeMenu = () => {
    setMenuPosition(null)
    setPressed(false)
  }

  const runAction = (action: LongPressMenuAction) => {
    closeMenu()
    action.onAction()
  }

  const renderAction = (action: LongPressMenuAction) => {
    const Icon = action.icon
    const color = action.danger ? '#EF4444' : '#4A4A4A'
    return (
      <button
        key={action.id}
        type="button"
        onClick={() => runAction(action)}
        className="flex h-11 w-full items-center gap-2.5 px-4 text-left text-[14px] leading-5 active:bg-surface-card"
        style={{ color }}
      >
        <Icon size={16} style={{ color }} />
        <span>{action.label}</span>
      </button>
    )
  }

  return (
    <>
      <div
        ref={wrapperRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
        onPointerLeave={handlePointerEnd}
        onContextMenu={event => event.preventDefault()}
        onClickCapture={event => {
          if (!suppressClick.current) return
          event.preventDefault()
          event.stopPropagation()
        }}
        className={`relative transition-transform duration-150 ${pressed ? 'scale-[0.98]' : 'scale-100'} ${className}`}
      >
        {children}
        {menuOpen && (
          <span className="pointer-events-none absolute inset-0 z-20 rounded-[12px] bg-[#FFF1E6]/60 ring-1 ring-[#FF7A00]/20" />
        )}
      </div>

      {menuPosition && (
        <>
          <button
            type="button"
            aria-label="关闭操作菜单"
            className="fixed inset-0 z-[45] cursor-default bg-transparent"
            onClick={closeMenu}
          />
          <div
            className="fixed z-[46] w-[180px] rounded-[8px] bg-white py-1 shadow-[0_8px_24px_rgba(0,0,0,0.10)]"
            style={{ left: menuPosition.x, top: menuPosition.y }}
          >
            {allActions.map(renderAction)}
            {visibleExtraActions.length > 0 && (
              <>
                <div className="mx-4 my-1 h-px bg-[#EEEEEE]" />
                {visibleExtraActions.map(renderAction)}
              </>
            )}
          </div>
        </>
      )}
    </>
  )
}
