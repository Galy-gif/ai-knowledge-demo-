import { useEffect, useRef } from 'react'
import { Search } from 'lucide-react'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  active: boolean
  onActivate: () => void
  onCancel: () => void
  placeholder?: string
}

export default function SearchBar({
  value,
  onChange,
  active,
  onActivate,
  onCancel,
  placeholder = '搜索...',
}: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (active) {
      requestAnimationFrame(() => inputRef.current?.focus())
    }
  }, [active])

  return (
    <div className="flex items-center gap-3">
      <div
        onClick={onActivate}
        className="h-10 flex-1 min-w-0 flex items-center gap-2 px-4 rounded-full bg-[#F5F5F5] text-left"
      >
        <Search size={18} className="text-ink-placeholder flex-shrink-0" />
        <input
          ref={inputRef}
          value={value}
          onFocus={onActivate}
          onChange={event => onChange(event.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent outline-none text-[14px] leading-5 text-ink-primary placeholder:text-ink-placeholder"
        />
      </div>
      {active && (
        <button
          type="button"
          onClick={onCancel}
          className="text-body text-ink-secondary flex-shrink-0"
        >
          取消
        </button>
      )}
    </div>
  )
}
