import { type ReactNode } from 'react'
import { X } from 'lucide-react'

interface Props {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
}

export default function BottomFloatingPanel({ open, onClose, title, children }: Props) {
  if (!open) return null
  return (
    <>
      <div className="absolute inset-0 z-40 bg-black/30" onClick={onClose} />
      <div className="absolute bottom-0 left-0 right-0 z-50 bg-white rounded-t-card-xl shadow-sheet max-h-[65%] flex flex-col">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-line-base flex-shrink-0">
          <span className="text-card-title font-semibold text-ink-primary">{title}</span>
          <button onClick={onClose} className="p-1 text-ink-placeholder">
            <X size={18} />
          </button>
        </div>
        <div className="overflow-y-auto scrollbar-hide">
          {children}
        </div>
      </div>
    </>
  )
}
