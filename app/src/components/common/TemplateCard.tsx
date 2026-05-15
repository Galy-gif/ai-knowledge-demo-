import type { PwaTemplate } from '../../mock/pwaTemplates'

interface TemplateCardProps {
  template: PwaTemplate
  variant?: 'compact' | 'list' | 'small'
  onClick?: () => void
  onGenerate?: () => void
}

const CATEGORY_COLORS: Record<PwaTemplate['category'], { bg: string; color: string }> = {
  财经: { bg: '#DBEAFE', color: '#1D4ED8' },
  健康: { bg: '#D1FAE5', color: '#047857' },
  职场: { bg: '#E9D5FF', color: '#7E22CE' },
  教育: { bg: '#FEF3C7', color: '#92400E' },
  生活: { bg: '#FED7AA', color: '#C2410C' },
}

export default function TemplateCard({ template, variant = 'compact', onClick, onGenerate }: TemplateCardProps) {
  const categoryColor = CATEGORY_COLORS[template.category]

  if (variant === 'list') {
    return (
      <div
        role="button"
        tabIndex={0}
        onClick={onClick}
        onKeyDown={event => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            onClick?.()
          }
        }}
        className="w-full flex items-center gap-3 px-4 py-3 mb-2 bg-white rounded-card border border-line-base shadow-card text-left active:bg-surface-card transition-colors"
      >
        <div className="w-12 h-12 rounded-card bg-brand-orange-light flex items-center justify-center text-2xl flex-shrink-0">
          {template.icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[15px] leading-5 font-semibold text-ink-primary truncate">{template.name}</p>
          <p className="text-caption text-ink-secondary mt-0.5 truncate">{template.coreFeatures}</p>
          <span className="inline-flex mt-2 px-2 py-0.5 bg-surface-card rounded-pill text-micro text-ink-secondary">
            {template.tag}
          </span>
        </div>
        <button
          onClick={event => {
            event.stopPropagation()
            onGenerate?.()
          }}
          className="px-3 py-1.5 rounded-pill border border-brand-orange text-brand-orange text-caption font-medium flex-shrink-0"
        >
          立即生成
        </button>
      </div>
    )
  }

  if (variant === 'small') {
    return (
      <button
        onClick={onClick}
        className="w-full h-[100px] px-3 py-3 bg-white rounded-card border border-line-base shadow-card text-left active:bg-surface-card transition-colors"
      >
        <div
          className="w-7 h-7 rounded-card flex items-center justify-center text-base mb-1"
          style={{ backgroundColor: categoryColor.bg, color: categoryColor.color }}
        >
          {template.icon}
        </div>
        <p className="text-[13px] leading-5 font-semibold text-ink-primary truncate">{template.name}</p>
        <p className="text-[11px] leading-[13px] text-ink-secondary mt-0.5 line-clamp-2">{template.coreFeatures}</p>
      </button>
    )
  }

  return (
    <button
      onClick={onClick}
      className="w-full min-h-[132px] px-3 py-3 bg-white rounded-card border border-line-base shadow-card text-left active:bg-surface-card transition-colors"
    >
      <div className="w-10 h-10 rounded-card bg-brand-orange-light flex items-center justify-center text-xl mb-3">
        {template.icon}
      </div>
      <p className="text-[14px] leading-5 font-semibold text-ink-primary truncate">{template.name}</p>
      <p className="text-caption text-ink-secondary mt-1 leading-relaxed line-clamp-2">{template.coreFeatures}</p>
    </button>
  )
}
