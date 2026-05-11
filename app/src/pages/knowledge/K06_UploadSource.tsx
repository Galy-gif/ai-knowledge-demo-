import { useNavigate } from 'react-router-dom'
import { FileText, Globe, Mic, Camera, Image as ImageIcon, PenLine, Zap } from 'lucide-react'
import BottomSheet from '../../components/ui/BottomSheet'

const UPLOAD_SOURCES = [
  { Icon: FileText,  label: '本地文件', desc: 'PDF、Word、TXT', bg: 'bg-brand-orange-light', color: 'text-brand-orange' },
  { Icon: Camera,    label: '拍照',     desc: '扫描纸质文档',   bg: 'bg-green-50',           color: 'text-green-600'   },
  { Icon: ImageIcon, label: '相册',     desc: '选择图片文件',   bg: 'bg-purple-50',          color: 'text-purple-500'  },
  { Icon: Mic,       label: '语音录制', desc: '录音转文字',     bg: 'bg-violet-50',          color: 'text-violet-500'  },
  { Icon: Globe,     label: '网页链接', desc: '粘贴 URL 导入',  bg: 'bg-blue-50',            color: 'text-blue-500'    },
  { Icon: PenLine,   label: '新建笔记', desc: '直接写入知识库', bg: 'bg-yellow-50',          color: 'text-yellow-600'  },
]

export default function K06_UploadSource({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate()

  const handleSelect = () => {
    onClose()
    navigate('/knowledge/uploading')
  }

  return (
    <BottomSheet open={open} onClose={onClose} title="添加内容">
      <div className="px-5 pb-2">
        <p className="text-caption text-ink-placeholder mb-4">选择内容来源</p>

        <div className="grid grid-cols-3 gap-3 mb-4">
          {UPLOAD_SOURCES.map(({ Icon, label, desc, bg, color }) => (
            <button
              key={label}
              onClick={handleSelect}
              className="flex flex-col items-center gap-2 p-3 bg-white rounded-card border border-line-base shadow-card active:bg-surface-card transition-colors"
            >
              <div className={`w-11 h-11 ${bg} rounded-card-lg flex items-center justify-center`}>
                <Icon size={20} className={color} />
              </div>
              <span className="text-caption text-ink-primary font-medium">{label}</span>
              <span className="text-micro text-ink-placeholder text-center leading-tight">{desc}</span>
            </button>
          ))}
        </div>

        <button
          onClick={handleSelect}
          className="w-full flex items-center gap-3 px-4 py-3.5 bg-brand-orange rounded-card text-white mb-3"
        >
          <Zap size={18} />
          <div className="text-left">
            <p className="text-body font-medium">AI 一键导入</p>
            <p className="text-caption opacity-80">从微信/邮箱/浏览器智能识别</p>
          </div>
        </button>

        <button
          onClick={onClose}
          className="w-full py-3 text-body text-ink-secondary"
        >
          取消
        </button>
      </div>
    </BottomSheet>
  )
}
