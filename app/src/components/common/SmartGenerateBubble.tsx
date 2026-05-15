import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowRight, Sparkles, X } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  getPwaRecommendation,
  type PwaRecommendationInput,
  type PwaTemplateMatch,
} from '../../utils/pwaRecommendation'

const BUBBLE_SIZE = 40
const VISIBLE_HALF = 20
const EDGE_GAP = 12
const TOP_GAP = 20
const BOTTOM_RESERVED = 112
const LONG_PRESS_MS = 200
const CLICK_MOVE_THRESHOLD = 5
const DRAG_MOVE_THRESHOLD = 10

type BubbleSide = 'left' | 'right'
type TransitionMode = 'none' | 'snap' | 'reveal'

interface BubblePosition {
  x: number
  y: number
}

interface SmartGenerateBubbleProps {
  doc: PwaRecommendationInput
  sourceKbId?: string
  sourceKbName?: string
  isOpen?: boolean
  onClose?: () => void
  onGenerate?: (match: PwaTemplateMatch) => void
}

export default function SmartGenerateBubble({
  doc,
  sourceKbId,
  sourceKbName,
  isOpen,
  onClose,
  onGenerate,
}: SmartGenerateBubbleProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const positionRef = useRef<BubblePosition>({ x: 0, y: 0 })
  const pointerRef = useRef<{
    active: boolean
    dragging: boolean
    pointerId: number
    startX: number
    startY: number
    startPos: BubblePosition
    moved: boolean
    timer?: number
  } | null>(null)
  const bubbleKey = doc.id ?? doc.title
  const recommendation = getPwaRecommendation(doc)
  const match = recommendation.match

  const [expanded, setExpanded] = useState(Boolean(isOpen))
  const [tooltipManuallyClosed, setTooltipManuallyClosed] = useState(false)
  const [tooltipClosing, setTooltipClosing] = useState(false)
  const [position, setPosition] = useState<BubblePosition>({ x: 0, y: 0 })
  const [side, setSide] = useState<BubbleSide>('right')
  const [docked, setDocked] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [transitionMode, setTransitionMode] = useState<TransitionMode>('none')

  const requestedExpanded = isOpen ?? expanded
  const isExpanded = requestedExpanded && !tooltipManuallyClosed
  const shouldRenderTooltip = isExpanded || tooltipClosing

  useEffect(() => {
    positionRef.current = position
  }, [position])

  const getBounds = useCallback(() => {
    const parentRect = wrapperRef.current?.parentElement?.getBoundingClientRect()
    const width = parentRect?.width ?? 390
    const height = parentRect?.height ?? 808
    return {
      width,
      height,
      minY: TOP_GAP,
      maxY: Math.max(TOP_GAP, height - BOTTOM_RESERVED - BUBBLE_SIZE),
    }
  }, [])

  const clampY = useCallback((rawY: number) => {
    const bounds = getBounds()
    return Math.min(bounds.maxY, Math.max(bounds.minY, rawY))
  }, [getBounds])

  const getDefaultPosition = useCallback(() => {
    const bounds = getBounds()
    return {
      x: bounds.width - EDGE_GAP - BUBBLE_SIZE,
      y: clampY(bounds.height - BOTTOM_RESERVED - BUBBLE_SIZE),
    }
  }, [clampY, getBounds])

  const resetPosition = useCallback(() => {
    setTransitionMode('none')
    setSide('right')
    setDocked(false)
    const nextPosition = getDefaultPosition()
    positionRef.current = nextPosition
    setPosition(nextPosition)
  }, [getDefaultPosition])

  useEffect(() => {
    setTooltipManuallyClosed(false)
    setTooltipClosing(false)
    setExpanded(false)
    resetPosition()
  }, [bubbleKey])

  useEffect(() => {
    resetPosition()
    const handleResize = () => resetPosition()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [resetPosition])

  useEffect(() => {
    if (typeof isOpen === 'boolean') setExpanded(isOpen)
  }, [isOpen])

  useEffect(() => {
    if (!match) return undefined

    let hideTimer: number | undefined
    const showTimer = window.setTimeout(() => {
      setTooltipManuallyClosed(false)
      setExpanded(true)
      hideTimer = window.setTimeout(() => {
        setExpanded(false)
      }, 4000)
    }, 3000)

    return () => {
      window.clearTimeout(showTimer)
      if (hideTimer) window.clearTimeout(hideTimer)
    }
  }, [bubbleKey, match?.name])

  useEffect(() => {
    if (!isExpanded) return undefined

    const handlePointerDown = (event: PointerEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setExpanded(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown, true)
    return () => document.removeEventListener('pointerdown', handlePointerDown, true)
  }, [isExpanded])

  if (!match) return null

  const handleGenerate = () => {
    if (onGenerate) {
      onGenerate(match)
      return
    }

    navigate('/ask/task-generate-confirm', {
      state: {
        requirement: match.requirement,
        templateId: match.templateId,
        templateName: match.name,
        templateIcon: match.icon,
        templateCoreFeatures: match.coreFeatures,
        selectedKbIds: sourceKbId ? [sourceKbId] : [],
        selectedKbNames: sourceKbName ? [sourceKbName] : [],
        generatedFromFileId: doc.id,
        sourcePath: `${location.pathname}${location.search}${location.hash}`,
        sourceState: location.state,
      },
    })
  }

  const closeTooltip = () => {
    setTooltipManuallyClosed(true)
    setTooltipClosing(true)
    window.setTimeout(() => {
      setExpanded(false)
      setTooltipClosing(false)
    }, 150)
    onClose?.()
  }

  const snapToSide = (rawX: number, rawY: number) => {
    const bounds = getBounds()
    const nextSide: BubbleSide = rawX + BUBBLE_SIZE / 2 < bounds.width / 2 ? 'left' : 'right'
    setSide(nextSide)
    setDocked(true)
    setExpanded(false)
    setTransitionMode('snap')
    const nextPosition = {
      x: nextSide === 'left' ? -VISIBLE_HALF : bounds.width - VISIBLE_HALF,
      y: clampY(rawY),
    }
    positionRef.current = nextPosition
    setPosition(nextPosition)
    window.setTimeout(() => setTransitionMode('none'), 320)
  }

  const revealFromDock = () => {
    const bounds = getBounds()
    setDocked(false)
    setExpanded(false)
    setTransitionMode('reveal')
    const nextPosition = {
      x: side === 'left' ? EDGE_GAP : bounds.width - EDGE_GAP - BUBBLE_SIZE,
      y: clampY(position.y),
    }
    positionRef.current = nextPosition
    setPosition(nextPosition)
    window.setTimeout(() => setTransitionMode('none'), 220)
  }

  const beginDrag = (pointerId?: number) => {
    if (!pointerRef.current || pointerRef.current.dragging) return
    pointerRef.current.dragging = true
    pointerRef.current.moved = true
    setDragging(true)
    setTooltipManuallyClosed(false)
    setExpanded(false)
    setDocked(false)
    setTransitionMode('none')
    if (pointerId !== undefined) {
      wrapperRef.current?.setPointerCapture?.(pointerId)
    }
  }

  const clearPointerTimer = () => {
    if (pointerRef.current?.timer) {
      window.clearTimeout(pointerRef.current.timer)
      pointerRef.current.timer = undefined
    }
  }

  const handlePointerDown = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (event.button !== 0) return
    clearPointerTimer()
    pointerRef.current = {
      active: true,
      dragging: false,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startPos: positionRef.current,
      moved: false,
      timer: window.setTimeout(() => beginDrag(event.pointerId), LONG_PRESS_MS),
    }
    wrapperRef.current?.setPointerCapture?.(event.pointerId)
  }

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const pointer = pointerRef.current
    if (!pointer?.active || pointer.pointerId !== event.pointerId) return

    const dx = event.clientX - pointer.startX
    const dy = event.clientY - pointer.startY
    const distance = Math.hypot(dx, dy)

    if (!pointer.dragging && distance >= DRAG_MOVE_THRESHOLD) {
      beginDrag(event.pointerId)
    }

    if (!pointer.dragging) return

    const bounds = getBounds()
    const nextX = Math.min(bounds.width - BUBBLE_SIZE, Math.max(0, pointer.startPos.x + dx))
    const nextY = clampY(pointer.startPos.y + dy)
    const nextPosition = { x: nextX, y: nextY }
    positionRef.current = nextPosition
    setPosition(nextPosition)
  }

  const handlePointerEnd = (event: React.PointerEvent<HTMLDivElement>) => {
    const pointer = pointerRef.current
    if (!pointer || pointer.pointerId !== event.pointerId) return

    clearPointerTimer()
    wrapperRef.current?.releasePointerCapture?.(event.pointerId)

    const dx = event.clientX - pointer.startX
    const dy = event.clientY - pointer.startY
    const distance = Math.hypot(dx, dy)
    const wasDragging = pointer.dragging
    pointerRef.current = null
    setDragging(false)

    if (wasDragging) {
      const bounds = getBounds()
      const finalX = Math.min(bounds.width - BUBBLE_SIZE, Math.max(0, pointer.startPos.x + dx))
      const finalY = clampY(pointer.startPos.y + dy)
      snapToSide(finalX, finalY)
      return
    }

    if (distance <= CLICK_MOVE_THRESHOLD) {
      if (docked) revealFromDock()
      else {
        setTooltipManuallyClosed(false)
        setExpanded(prev => !prev)
      }
    }
  }

  const handlePointerCancel = (event: React.PointerEvent<HTMLDivElement>) => {
    const pointer = pointerRef.current
    if (pointer?.pointerId === event.pointerId) {
      clearPointerTimer()
      pointerRef.current = null
      setDragging(false)
    }
  }

  const isLeftSide = position.x + BUBBLE_SIZE / 2 < getBounds().width / 2
  const tooltipSide: BubbleSide = isLeftSide ? 'left' : 'right'
  const transitionStyle =
    transitionMode === 'snap'
      ? 'transform 300ms cubic-bezier(0.22, 1, 0.36, 1)'
      : transitionMode === 'reveal'
        ? 'transform 200ms ease-out'
        : undefined

  return (
    <div
      ref={wrapperRef}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerCancel}
      className="absolute left-0 top-0 z-[29]"
      style={{
        width: BUBBLE_SIZE,
        height: BUBBLE_SIZE,
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        transition: transitionStyle,
        touchAction: 'none',
      }}
    >
      {shouldRenderTooltip && (
        <div
          role="button"
          tabIndex={0}
          onClick={handleGenerate}
          onKeyDown={event => {
            if (event.key === 'Enter' || event.key === ' ') handleGenerate()
          }}
          className={`absolute bottom-0 w-[268px] cursor-pointer rounded-card bg-white px-3 py-2.5 shadow-[0_10px_28px_rgba(15,23,42,0.18)] ${
            tooltipClosing ? 'opacity-0 translate-x-2 transition-all duration-150 ease-out' : 'animate-smart-bubble-card-in'
          } ${
            tooltipSide === 'right' ? 'right-[52px]' : 'left-[52px]'
          }`}
        >
          <div className={`absolute top-1/2 h-3 w-3 -translate-y-1/2 rotate-45 bg-white ${
            tooltipSide === 'right' ? '-right-1.5' : '-left-1.5'
          }`} />
          <button
            onClick={event => {
              event.stopPropagation()
              closeTooltip()
            }}
            aria-label="关闭智能生成提示"
            className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full text-ink-placeholder active:bg-surface-card"
          >
            <X size={12} />
          </button>
          <div className="flex items-center gap-2 pr-5">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-card bg-brand-orange-light text-brand-orange">
              <Sparkles size={16} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[12px] leading-4 text-ink-secondary">💡 智能识别</p>
              <p className="mt-0.5 whitespace-nowrap text-[13px] font-semibold leading-5 text-ink-primary">
                可生成「{match.name}」
              </p>
            </div>
            <span className="flex flex-shrink-0 items-center gap-0.5 text-[12px] font-medium text-brand-orange">
              试试
              <ArrowRight size={12} />
            </span>
          </div>
        </div>
      )}

      <button
        onPointerDown={handlePointerDown}
        aria-label={`智能生成「${match.name}」`}
        className={`flex h-10 w-10 items-center rounded-full border bg-gradient-to-br from-[#FFE4D0] to-[#FFD4B0] text-brand-orange transition-[box-shadow,transform] ${
          docked
            ? `border-brand-orange/45 shadow-[0_4px_14px_rgba(255,122,0,0.22)] ${side === 'left' ? 'justify-end pr-1' : 'justify-start pl-1'}`
            : 'justify-center border-brand-orange/30 shadow-[0_6px_16px_rgba(255,122,0,0.25)] animate-smart-bubble-breathe'
        } ${dragging ? 'scale-105 shadow-[0_10px_24px_rgba(255,122,0,0.34)] cursor-grabbing' : 'cursor-pointer'}`}
      >
        <Sparkles size={16} />
      </button>
    </div>
  )
}
