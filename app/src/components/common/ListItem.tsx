import { type ReactNode } from 'react'
import { ChevronRight, type LucideIcon } from 'lucide-react'

interface ListItemProps {
  icon?: LucideIcon
  label: string
  description?: string
  value?: string
  badge?: ReactNode
  onClick?: () => void
  showArrow?: boolean
  danger?: boolean
  last?: boolean
}

export default function ListItem({
  icon: Icon,
  label,
  description,
  value,
  badge,
  onClick,
  showArrow = true,
  danger = false,
  last = false,
}: ListItemProps) {
  const Wrapper = onClick ? 'button' : 'div'

  return (
    <Wrapper
      {...(onClick ? { onClick } : {})}
      className={`w-full flex items-center gap-3 px-4 py-3.5 bg-white text-left
        ${!last ? 'border-b border-line-base' : ''}
        ${onClick ? 'active:bg-surface-card transition-colors' : ''}`}
    >
      {Icon && (
        <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
          <Icon size={18} className={danger ? 'text-red-400' : 'text-ink-secondary'} />
        </div>
      )}

      <div className="flex-1 min-w-0">
        <p className={`text-body ${danger ? 'text-red-500' : 'text-ink-primary'}`}>{label}</p>
        {description && (
          <p className="text-caption text-ink-placeholder mt-0.5 leading-snug">{description}</p>
        )}
      </div>

      {value && (
        <span className="text-caption text-ink-placeholder flex-shrink-0 mr-1">{value}</span>
      )}

      {badge && <div className="flex-shrink-0 mr-1">{badge}</div>}

      {showArrow && onClick && (
        <ChevronRight size={16} className="text-ink-placeholder flex-shrink-0 -mr-1" />
      )}
    </Wrapper>
  )
}
