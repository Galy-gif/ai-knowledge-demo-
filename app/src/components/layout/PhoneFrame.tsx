import { type ReactNode } from 'react'

export default function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200 p-8">
      <div
        className="relative bg-white overflow-hidden flex flex-col"
        style={{
          width: 390,
          height: 844,
          borderRadius: 44,
          boxShadow: '0 0 0 10px #1A1A1A, 0 40px 80px rgba(0,0,0,0.4)',
        }}
      >
        {/* Status Bar */}
        <div className="flex items-center justify-between px-8 pt-3 pb-1 flex-shrink-0 bg-white z-10">
          <span className="text-micro font-semibold text-ink-primary">9:41</span>
          <div className="flex items-center gap-1.5">
            <div className="flex gap-0.5 items-end h-3">
              {[3, 4, 5, 6].map(h => (
                <div key={h} className="w-1 bg-ink-primary rounded-sm" style={{ height: h }} />
              ))}
            </div>
            <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
              <path d="M8 2.4C10.4 2.4 12.6 3.4 14.1 5L15.5 3.5C13.6 1.3 11 0 8 0C5 0 2.4 1.3 0.5 3.5L1.9 5C3.4 3.4 5.6 2.4 8 2.4Z" fill="#1A1A1A"/>
              <path d="M8 5.5C9.7 5.5 11.2 6.3 12.3 7.5L13.7 6C12.2 4.5 10.2 3.5 8 3.5C5.8 3.5 3.8 4.5 2.3 6L3.7 7.5C4.8 6.3 6.3 5.5 8 5.5Z" fill="#1A1A1A"/>
              <circle cx="8" cy="11" r="1.5" fill="#1A1A1A"/>
            </svg>
            <div className="flex items-center gap-0.5">
              <div className="w-6 h-3 border border-ink-primary rounded-sm relative">
                <div className="absolute inset-0.5 right-0.5 bg-ink-primary rounded-xs" style={{ right: '20%' }} />
              </div>
            </div>
          </div>
        </div>
        {/* Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  )
}
