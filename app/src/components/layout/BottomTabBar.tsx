import { useNavigate, useLocation } from 'react-router-dom'
import { LayoutGrid, BookOpen, User } from 'lucide-react'

const tabs = [
  { label: '小应用', icon: LayoutGrid, path: '/apps' },
  { label: '资料包', icon: BookOpen, path: '/knowledge' },
  { label: '我的', icon: User, path: '/profile' },
]

export default function BottomTabBar() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const isActive = (path: string) => pathname.startsWith(path)

  return (
    <div className="relative z-[var(--z-tabbar)] flex-shrink-0 flex items-end border-t border-line-base bg-white"
         style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
      {tabs.map(({ label, icon: Icon, path }) => {
        const active = isActive(path)
        return (
          <button
            key={path}
            onClick={() => navigate(path)}
            className="flex-1 flex flex-col items-center gap-0.5 py-2.5 transition-colors"
          >
            <Icon
              size={22}
              className={active ? 'text-brand-orange' : 'text-ink-placeholder'}
              strokeWidth={active ? 2.2 : 1.8}
            />
            <span className={`text-micro ${active ? 'text-brand-orange font-medium' : 'text-ink-placeholder'}`}>
              {label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
