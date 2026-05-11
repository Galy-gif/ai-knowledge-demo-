import { type ReactNode } from 'react'

interface BottomSheetProps {
  open: boolean
  onClose: () => void
  title?: string
  headerLeft?: ReactNode
  headerRight?: ReactNode
  children: ReactNode
  fullHeight?: boolean
}

export default function BottomSheet({ open, onClose, title, headerLeft, headerRight, children, fullHeight }: BottomSheetProps) {
  if (!open) return null

  return (
    <div className="absolute inset-0 z-40 flex flex-col justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div
        className={`relative bg-white rounded-t-card-xl shadow-sheet flex flex-col ${fullHeight ? 'h-[85%] max-h-[85%]' : 'max-h-[85%]'}`}
      >
        <div className="flex items-center justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1 bg-line-base rounded-pill" />
        </div>
        {title && (
          <div className="px-5 py-3 border-b border-line-base flex items-center gap-2 flex-shrink-0">
            {headerLeft && <div className="-ml-1 flex-shrink-0">{headerLeft}</div>}
            <h3 className="text-h2 text-ink-primary flex-1">{title}</h3>
            {headerRight && <div className="flex-shrink-0">{headerRight}</div>}
          </div>
        )}
        <div className={`min-h-0 overflow-y-auto scrollbar-hide pb-8 ${fullHeight ? 'flex-1' : ''}`}>
          {children}
        </div>
      </div>
    </div>
  )
}
