import { useNavigate } from 'react-router-dom'
import { ArrowUpRight, ChevronLeft, Link2 } from 'lucide-react'
import Toast from '../../components/common/Toast'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import { useUser } from '../../context/UserContext'

const MOCK_LINK = 'https://www.xiaohongshu.com/explore/sample'

export default function K16_AddFromThirdParty() {
  const navigate = useNavigate()
  const { showToast } = useUser()

  const handlePaste = () => {
    showToast(`已添加链接：${MOCK_LINK}`)
    setTimeout(() => navigate(-1), 600)
  }

  return (
    <div className="flex flex-col h-full relative bg-white">
      <div className="h-14 flex items-center px-4 bg-white border-b border-line-base flex-shrink-0">
        <button onClick={() => navigate(-1)} className="p-1 -ml-1 mr-2 text-ink-secondary">
          <ChevronLeft size={24} />
        </button>
        <span className="flex-1 text-h2 text-ink-primary truncate">粘贴链接添加</span>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide flex items-center justify-center">
        <button
          type="button"
          onClick={handlePaste}
          className="flex items-center transition-transform active:scale-[0.98]"
          style={{
            width: 'calc(100% - 40px)',
            backgroundColor: '#FFF1E6',
            borderRadius: 16,
            padding: '20px 16px',
            gap: 14,
          }}
        >
          <div
            className="flex items-center justify-center flex-shrink-0"
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              backgroundColor: '#FFFFFF',
            }}
          >
            <Link2 size={20} color="#FF7A00" strokeWidth={2} />
          </div>
          <div className="flex-1 min-w-0 text-left">
            <p
              style={{
                fontSize: 14,
                fontWeight: 500,
                color: '#1A1A1A',
                lineHeight: 1.4,
              }}
            >
              粘贴链接
            </p>
            <p
              style={{
                fontSize: 12,
                color: '#9CA3AF',
                marginTop: 2,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              小红书、知乎、B 站等都支持
            </p>
          </div>
          <div
            className="flex items-center justify-center flex-shrink-0"
            style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              backgroundColor: '#FFFFFF',
            }}
          >
            <ArrowUpRight size={14} color="#FF7A00" strokeWidth={2.4} />
          </div>
        </button>
      </div>

      <Toast />
      <ConfirmDialog />
    </div>
  )
}
