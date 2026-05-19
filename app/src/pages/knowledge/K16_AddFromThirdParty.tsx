import { useNavigate } from 'react-router-dom'
import { ChevronLeft, Share2 } from 'lucide-react'
import Toast from '../../components/common/Toast'
import ConfirmDialog from '../../components/common/ConfirmDialog'

export default function K16_AddFromThirdParty() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col h-full relative bg-white">
      <div className="h-14 flex items-center px-4 bg-white border-b border-line-base flex-shrink-0">
        <button onClick={() => navigate(-1)} className="p-1 -ml-1 mr-2 text-ink-secondary">
          <ChevronLeft size={24} />
        </button>
        <span className="flex-1 text-h2 text-ink-primary truncate">从其他 App 分享</span>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide flex flex-col items-center justify-center px-8 -mt-10">
        <div className="w-20 h-20 rounded-full bg-brand-orange-light flex items-center justify-center mb-5">
          <Share2 size={36} className="text-brand-orange" strokeWidth={1.6} />
        </div>
        <p className="text-h2 text-ink-primary text-center mb-2">从其他 App 分享进来</p>
        <p className="text-body text-ink-secondary text-center leading-6">
          在小红书、抖音等 App 中点击分享按钮，<br />选择「分享到本应用」即可入库。
        </p>

        <button
          onClick={() => navigate(-1)}
          className="mt-8 text-caption text-brand-orange"
        >
          或者你也可以直接粘贴链接 →
        </button>
      </div>

      <Toast />
      <ConfirmDialog />
    </div>
  )
}
