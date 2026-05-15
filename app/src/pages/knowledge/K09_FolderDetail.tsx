import { useLocation, useNavigate } from 'react-router-dom'
import { ChevronLeft, Mic, MoreHorizontal, Search } from 'lucide-react'
import type { KnowledgeFile } from '../../mock/data'
import { getFileTypeVisual } from '../../utils/fileTypeVisuals'

interface FolderMockFile {
  id: string
  title: string
  type: KnowledgeFile['type']
  meta: string
  time: string
}

interface FolderViewState {
  folderTitle: string
  kbName: string
  files: FolderMockFile[]
}

export default function K09_FolderDetail() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const { folderTitle = '文件夹', files = [] } = (state ?? {}) as Partial<FolderViewState>

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex h-14 flex-shrink-0 items-center gap-1 border-b border-line-base px-2">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex h-10 w-10 items-center justify-center rounded-full text-ink-secondary active:bg-surface-card"
        >
          <ChevronLeft size={22} />
        </button>
        <div className="flex-1 min-w-0 px-1">
          <p className="text-[17px] font-semibold leading-6 text-ink-primary truncate">{folderTitle}</p>
          <p className="text-[12px] leading-4 text-ink-secondary">{files.length} 个文件</p>
        </div>
        <button type="button" className="flex h-10 w-10 items-center justify-center rounded-full text-ink-secondary">
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* File list */}
      <div className="flex-1 min-h-0 overflow-y-auto pb-4">
        <div className="mx-4 mt-3 overflow-hidden rounded-[12px] border border-[#EEEEEE] bg-white">
          {files.map((file, index) => {
            const { Icon, bg, color } = getFileTypeVisual(file.type)
            return (
              <button
                key={file.id}
                type="button"
                onClick={() => navigate('/knowledge/file-detail')}
                className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-transform duration-100 active:scale-[0.98] ${
                  index < files.length - 1 ? 'border-b border-[#EEEEEE]' : ''
                }`}
              >
                <span
                  className="w-9 h-9 flex-shrink-0 rounded-[10px] flex items-center justify-center"
                  style={{ backgroundColor: bg }}
                >
                  <Icon size={17} style={{ color }} />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-semibold leading-5 text-ink-primary truncate">{file.title}</p>
                  <p className="mt-0.5 text-[12px] leading-4 text-ink-placeholder">{file.meta} · {file.time}</p>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Bottom ask AI bar */}
      <div className="flex-shrink-0 border-t border-line-base bg-white px-4 py-3 shadow-[0_-8px_18px_rgba(15,23,42,0.04)]">
        <button
          type="button"
          className="h-11 w-full flex items-center gap-2 px-4 bg-[#F5F5F5] rounded-pill border border-transparent text-left"
        >
          <Search size={15} className="text-ink-placeholder flex-shrink-0" />
          <span className="flex-1 min-w-0 truncate text-body text-ink-placeholder">
            问 AI 关于「{folderTitle}」…
          </span>
          <Mic size={17} className="text-ink-placeholder flex-shrink-0" />
        </button>
      </div>
    </div>
  )
}
