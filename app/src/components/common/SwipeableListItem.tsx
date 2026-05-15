import { useEffect, useRef, useState, type ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'

export interface SwipeAction {
  id: string
  label: string
  icon: LucideIcon
  color: string
  onAction: () => void
  disabled?: boolean
}

interface SwipeableListItemProps {
  id: string
  actions: SwipeAction[]
  children: ReactNode
  open?: boolean
  onOpenChange?: (id: string | null) => void
  onLongPress?: () => void
  className?: string
}

const ACTION_WIDTH = 76
const TAP_MOVE_THRESHOLD = 5
const DRAG_THRESHOLD = 10
const LONG_PRESS_MS = 420

export default function SwipeableListItem({
  id,
  actions,
  children,
  open = false,
  onOpenChange,
  onLongPress,
  className = '',
}: SwipeableListItemProps) {
  const [dragX, setDragX] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [tracking, setTracking] = useState(false)
  const startX = useRef(0)
  const startY = useRef(0)
  const startTime = useRef(0)
  const gestureMode = useRef<'pending' | 'drag' | 'scroll' | 'tap'>('tap')
  const suppressClick = useRef(false)
  const longPressTimer = useRef<number | null>(null)
  const currentDragX = useRef(0)
  const actionWidth = actions.length * ACTION_WIDTH
  const restingX = open ? -actionWidth : 0
  const translateX = dragging ? dragX : restingX

  useEffect(() => {
    if (!open && !dragging) setDragX(0)
  }, [open, dragging])

  const clearLongPress = () => {
    if (longPressTimer.current) {
      window.clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }
  }

  const releaseClickSuppression = (delay = 90) => {
    window.setTimeout(() => {
      suppressClick.current = false
    }, delay)
  }

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (actions.length === 0) return
    startX.current = event.clientX
    startY.current = event.clientY
    startTime.current = Date.now()
    gestureMode.current = 'pending'
    suppressClick.current = false
    setTracking(true)
    setDragging(false)
    setDragX(restingX)
    currentDragX.current = restingX
    if (onLongPress) {
      clearLongPress()
      longPressTimer.current = window.setTimeout(() => {
        if (gestureMode.current === 'pending') {
          suppressClick.current = true
          setTracking(false)
          onOpenChange?.(null)
          onLongPress()
        }
      }, LONG_PRESS_MS)
    }
  }

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!tracking) return
    const deltaX = event.clientX - startX.current
    const deltaY = event.clientY - startY.current
    const absX = Math.abs(deltaX)
    const absY = Math.abs(deltaY)

    if (gestureMode.current === 'pending') {
      if (absY >= DRAG_THRESHOLD && absY > absX) {
        gestureMode.current = 'scroll'
        clearLongPress()
        setTracking(false)
        setDragging(false)
        return
      }

      if (absX >= DRAG_THRESHOLD && absX > absY) {
        gestureMode.current = 'drag'
        clearLongPress()
        suppressClick.current = true
        setDragging(true)
        onOpenChange?.(null)
        event.currentTarget.setPointerCapture(event.pointerId)
      }
    }

    if (gestureMode.current !== 'drag') return
    event.preventDefault()
    const next = Math.max(-actionWidth, Math.min(0, restingX + deltaX))
    currentDragX.current = next
    setDragX(next)
  }

  const handlePointerEnd = (event: React.PointerEvent<HTMLDivElement>) => {
    clearLongPress()
    if (!tracking && gestureMode.current !== 'drag') return
    const deltaX = event.clientX - startX.current
    const deltaY = event.clientY - startY.current
    const elapsed = Date.now() - startTime.current
    const moveDistance = Math.hypot(deltaX, deltaY)
    const wasDragging = gestureMode.current === 'drag'
    const distance = Math.abs(wasDragging ? currentDragX.current : restingX)

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }

    if (wasDragging) {
      const shouldOpen = distance >= actionWidth * 0.4
      const nextX = shouldOpen ? -actionWidth : 0
      currentDragX.current = nextX
      setDragX(nextX)
      onOpenChange?.(shouldOpen ? id : null)
      setTracking(false)
      setDragging(false)
      releaseClickSuppression()
      return
    }

    setTracking(false)
    setDragging(false)

    if (open && moveDistance < TAP_MOVE_THRESHOLD) {
      suppressClick.current = true
      onOpenChange?.(null)
      releaseClickSuppression()
      return
    }

    if (moveDistance < TAP_MOVE_THRESHOLD && elapsed < 200) {
      suppressClick.current = false
    }
    releaseClickSuppression(suppressClick.current ? 120 : 0)
  }

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      onClickCapture={event => {
        const target = event.target as HTMLElement
        const isActionButton = Boolean(target.closest('[data-swipe-action="true"]'))
        if (suppressClick.current) {
          event.preventDefault()
          event.stopPropagation()
          return
        }
        if (open && !isActionButton) {
          event.preventDefault()
          event.stopPropagation()
          onOpenChange?.(null)
        }
      }}
    >
      <div
        className="absolute inset-y-0 right-0 flex transition-opacity duration-150"
        style={{
          opacity: open || dragging || dragX < 0 ? 1 : 0,
          pointerEvents: open || dragging || dragX < 0 ? 'auto' : 'none',
        }}
      >
        {actions.map(action => {
          const Icon = action.icon
          return (
            <button
              key={action.id}
              type="button"
              data-swipe-action="true"
              onClick={event => {
                event.stopPropagation()
                onOpenChange?.(null)
                action.onAction()
              }}
              className={`w-[76px] h-full flex flex-col items-center justify-center gap-1 text-white text-caption ${
                action.disabled ? 'opacity-45' : ''
              }`}
              style={{ backgroundColor: action.color }}
            >
              <Icon size={16} />
              <span>{action.label}</span>
            </button>
          )
        })}
      </div>
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
        style={{ transform: `translateX(${translateX}px)` }}
        className={`relative z-10 w-full touch-pan-y transition-transform ${dragging ? 'duration-0' : 'duration-300 ease-out'}`}
      >
        {children}
      </div>
    </div>
  )
}
