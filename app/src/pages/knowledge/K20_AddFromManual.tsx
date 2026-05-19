import { useNavigate } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import TopHeader from '../../components/layout/TopHeader'

interface ManualSource {
  key: string
  route: string
  emoji: string
  bg: string
  title: string
  desc: string
}

const MANUAL_SOURCES: ManualSource[] = [
  { key: 'upload', route: '/knowledge/add-from/upload', emoji: '📤', bg: '#DBEAFE', title: '上传文件', desc: '从设备选择文件' },
  { key: 'third-party', route: '/knowledge/add-from/third-party', emoji: '🔗', bg: '#D1FAE5', title: '第三方 App 分享', desc: '从其他 App 分享到本应用' },
  { key: 'ai-chat', route: '/knowledge/add-from/ai-chat', emoji: '🤖', bg: '#EDE9FE', title: 'AI 对话保存', desc: '保存 ChatGPT/Claude 对话' },
  { key: 'scan', route: '/knowledge/add-from/scan', emoji: '📷', bg: '#FEF3C7', title: '扫一扫', desc: '扫码或拍照添加' },
]

export default function K20_AddFromManual() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col h-full bg-white">
      <TopHeader title="手动添加" showBack />
      <div className="flex-1 overflow-y-auto pt-4 pb-6 space-y-3">
        {MANUAL_SOURCES.map(item => (
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
