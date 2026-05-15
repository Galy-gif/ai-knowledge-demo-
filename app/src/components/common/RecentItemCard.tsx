import { useRef } from 'react'
import { ChevronRight } from 'lucide-react'
import type { KnowledgeFile, RecentItem } from '../../mock/data'
import { getFileTypeVisual } from '../../utils/fileTypeVisuals'

function SelectionDot({ selected, visible }: { selected: boolean; visible: boolean }) {
  if (!visible) return null
  return (
    <div className={`absolute left-2 top-2 z-10 w-6 h-6 rounded-full border flex items-center justify-center ${
      selected ? 'bg-brand-orange border-brand-orange' : 'bg-white border-[#D1D5DB]'
    }`}>
      {selected && <span className="text-[12px] font-semibold text-white leading-none">✓</span>}
    </div>
  )
}

function useLongPressClick({ onClick, onLongPress }: { onClick: () => void; onLongPress: () => void }) {
  const pressTimer = useRef<number | null>(null)
  const didLongPress = useRef(false)

  const startPress = () => {
    didLongPress.current = false
    pressTimer.current = window.setTimeout(() => {
      didLongPress.current = true
      onLongPress()
    }, 420)
  }

  const clearPress = () => {
    if (pressTimer.current) {
      window.clearTimeout(pressTimer.current)
      pressTimer.current = null
    }
  }

  const handleClick = () => {
    if (didLongPress.current) {
      didLongPress.current = false
      return
    }
    onClick()
  }

  return { startPress, clearPress, handleClick }
}

interface RecentCardProps {
  item: RecentItem
  file: KnowledgeFile
  selecting: boolean
  selected: boolean
  onClick: () => void
  onLongPress: () => void
  className?: string
}

export function RecentVisualCard({
  item,
  file,
  selecting,
  selected,
  onClick,
  onLongPress,
  className = '',
}: RecentCardProps) {
  const press = useLongPressClick({ onClick, onLongPress })
  const cfg = getFileTypeVisual(item.type)
  const { Icon } = cfg

  return (
    <button
      onPointerDown={press.startPress}
      onPointerUp={press.clearPress}
      onPointerCancel={press.clearPress}
      onPointerLeave={press.clearPress}
      onContextMenu={event => event.preventDefault()}
      onClick={press.handleClick}
      className={`relative h-[104px] rounded-card bg-white border px-3 py-3 text-left shadow-card active:bg-surface-card transition-colors ${
        selected ? 'border-brand-orange/50 ring-1 ring-brand-orange/20 bg-brand-orange/[0.04]' : 'border-line-base'
      } ${className}`}
    >
      <SelectionDot visible={selecting} selected={selected} />
      <div
        className="w-8 h-8 rounded-card flex items-center justify-center mb-2"
        style={{ backgroundColor: '#FFF1E6' }}
      >
        <Icon size={17} className="text-brand-orange" strokeWidth={1.9} />
      </div>
      <p className="text-[13px] leading-5 font-semibold text-ink-primary line-clamp-1">{item.title}</p>
      <p className="mt-0.5 text-[11px] leading-[13px] text-ink-secondary line-clamp-2">
        {item.time} · {item.kbName}
      </p>
      {file.summary && <span className="sr-only">{file.summary}</span>}
    </button>
  )
}

export function RecentListRow({
  item,
  file,
  selecting,
  selected,
  onClick,
  onLongPress,
}: RecentCardProps) {
  const cfg = getFileTypeVisual(item.type)
  const { Icon } = cfg
  const press = useLongPressClick({ onClick, onLongPress })

  return (
    <button
      onPointerDown={press.startPress}
      onPointerUp={press.clearPress}
      onPointerCancel={press.clearPress}
      onPointerLeave={press.clearPress}
      onContextMenu={event => event.preventDefault()}
      onClick={press.handleClick}
      className={`relative w-full flex items-center gap-3 p-3 rounded-card border bg-white text-left shadow-card active:bg-surface-card ${
        selected ? 'border-brand-orange/50 ring-1 ring-brand-orange/20 bg-brand-orange/[0.04]' : 'border-line-base'
      }`}
    >
      <SelectionDot visible={selecting} selected={selected} />
      <div
        className="w-11 h-11 rounded-card flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: cfg.bg }}
      >
        <Icon size={20} style={{ color: cfg.color }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-card-title text-ink-primary truncate">{item.title}</p>
        <p className="text-caption text-ink-placeholder mt-0.5 truncate">
          {item.time} · {item.kbName}
        </p>
        {file.summary && (
          <p className="text-caption text-ink-secondary mt-1 line-clamp-1">{file.summary}</p>
        )}
      </div>
    </button>
  )
}

export function RecentCompactRow({
  item,
  file,
  selecting,
  selected,
  onClick,
  onLongPress,
  className = '',
}: RecentCardProps) {
  const cfg = getFileTypeVisual(item.type)
  const { Icon } = cfg
  const press = useLongPressClick({ onClick, onLongPress })

  return (
    <button
      onPointerDown={press.startPress}
      onPointerUp={press.clearPress}
      onPointerCancel={press.clearPress}
      onPointerLeave={press.clearPress}
      onContextMenu={event => event.preventDefault()}
      onClick={press.handleClick}
      className={`relative w-full min-h-[56px] flex items-center gap-3 px-3.5 py-2.5 text-left active:bg-surface-card transition-colors ${
        selected ? 'bg-brand-orange/[0.04]' : 'bg-white'
      } ${className}`}
    >
      <SelectionDot visible={selecting} selected={selected} />
      <div
        className="w-8 h-8 rounded-[9px] flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: cfg.bg }}
      >
        <Icon size={16} style={{ color: cfg.color }} strokeWidth={1.9} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[14px] leading-5 font-semibold text-ink-primary truncate">{item.title}</p>
        <p className="text-[12px] leading-4 text-ink-secondary mt-0.5 truncate">
          {item.time} · {item.kbName}
        </p>
      </div>
      <ChevronRight size={12} className="text-ink-placeholder flex-shrink-0" />
      {file.summary && <span className="sr-only">{file.summary}</span>}
    </button>
  )
}
