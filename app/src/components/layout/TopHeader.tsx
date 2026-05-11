import { type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'

interface TopHeaderProps {
  title?: string
  showBack?: boolean
  onBack?: () => void
  right?: ReactNode
  transparent?: boolean
  large?: boolean
}

export default function TopHeader({ title, showBack, onBack, right, transparent, large }: TopHeaderProps) {
  const navigate = useNavigate()

  const handleBack = () => {
    if (onBack) onBack()
    else navigate(-1)
  }

  if (large) {
    return (
      <div className={`px-5 pt-4 pb-2 flex items-end justify-between ${transparent ? '' : 'bg-white'}`}>
        <h1 className="text-h1 text-ink-primary">{title}</h1>
        {right && <div className="flex items-center gap-2">{right}</div>}
      </div>
    )
  }

  return (
    <div className={`h-14 flex items-center px-4 ${transparent ? '' : 'bg-white border-b border-line-base'}`}>
      {showBack && (
        <button onClick={handleBack} className="p-1 -ml-1 mr-2 text-ink-secondary">
          <ChevronLeft size={24} />
        </button>
      )}
      <span className="flex-1 text-h2 text-ink-primary truncate">{title}</span>
      {right && <div className="flex items-center gap-2">{right}</div>}
    </div>
  )
}
