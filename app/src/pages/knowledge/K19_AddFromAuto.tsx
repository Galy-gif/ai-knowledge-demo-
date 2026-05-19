import { useNavigate } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import TopHeader from '../../components/layout/TopHeader'

interface AutoSource {
  key: string
  route: string
  emoji: string
  bg: string
  title: string
  desc: string
}

const AUTO_SOURCES: AutoSource[] = [
  { key: 'browser-history', route: '/knowledge/add-from/browser-history', emoji: '🌐', bg: '#DBEAFE', title: '浏览器历史', desc: '浏览过的网页 · 已连接' },
  { key: 'wechat', route: '/knowledge/add-from/wechat', emoji: '💬', bg: '#D1FAE5', title: '微信收藏', desc: '收藏的文章/链接 · 已连接' },
  { key: 'cloud', route: '/knowledge/add-from/cloud-files', emoji: '☁️', bg: '#EDE9FE', title: '网盘', desc: '5 种主流网盘 · 已连接' },
  { key: 'email', route: '/knowledge/add-from/email', emoji: '✉️', bg: '#FEF3C7', title: '邮件附件', desc: '邮箱里的附件 · 已连接' },
  { key: 'screenshot', route: '/knowledge/add-from/screenshot', emoji: '📸', bg: '#FCE7F3', title: '系统截图', desc: '自动同步相册截图 · 已连接' },
  { key: 'download', route: '/knowledge/add-from/download', emoji: '📁', bg: '#FFF1E6', title: '下载文件', desc: '系统下载目录 · 已连接' },
]

export default function K19_AddFromAuto() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col h-full bg-white">
      <TopHeader title="自动同步" showBack />
      <div className="flex-1 overflow-y-auto pt-4 pb-6 space-y-3">
        {AUTO_SOURCES.map(item => (
          <button
            key={item.key}
            type="button"
            onClick={() => navigate(item.route)}
            className="mx-4 w-[calc(100%-32px)] bg-white border border-[#EEEEEE] rounded-card p-3 flex items-center gap-3 active:scale-[0.99] transition-transform"
          >
            <div
              className="w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0 text-[18px]"
              style={{ backgroundColor: item.bg }}
            >
              {item.emoji}
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-[14px] leading-5 font-semibold text-ink-primary">{item.title}</p>
              <p className="text-[11px] leading-4 text-ink-placeholder mt-0.5 truncate">{item.desc}</p>
            </div>
            <ChevronRight size={14} className="text-ink-placeholder flex-shrink-0" strokeWidth={2} />
          </button>
        ))}
      </div>
    </div>
  )
}
