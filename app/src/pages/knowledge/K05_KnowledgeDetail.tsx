import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ChevronLeft, LayoutGrid, Plus, FileText, Globe, Mic, Image as ImageIcon,
  Search, ChevronRight,
} from 'lucide-react'
import { useKnowledge } from '../../context/KnowledgeContext'
import { type KnowledgeFile } from '../../mock/data'
import K06_UploadSource from './K06_UploadSource'

// ── File type config ──────────────────────────────────────────────────────────
const FILE_TYPE_CONFIG: Record<string, { label: string; bg: string; color: string; Icon: React.ComponentType<{ size?: number; className?: string }> }> = {
  pdf:   { label: 'PDF',   bg: 'bg-red-50',    color: 'text-red-500',    Icon: FileText },
  doc:   { label: 'DOC',   bg: 'bg-blue-50',   color: 'text-blue-500',   Icon: FileText },
  txt:   { label: 'TXT',   bg: 'bg-gray-100',  color: 'text-gray-500',   Icon: FileText },
  url:   { label: 'URL',   bg: 'bg-green-50',  color: 'text-green-600',  Icon: Globe    },
  image: { label: 'IMG',   bg: 'bg-purple-50', color: 'text-purple-500', Icon: ImageIcon },
  audio: { label: 'AUDIO', bg: 'bg-violet-50', color: 'text-violet-500', Icon: Mic      },
}

const TYPE_FILTERS = ['全部', '文档', '网页', '音频', '图片'] as const

function FileCard({ file, onClick, isTeamShared }: { file: KnowledgeFile; onClick: () => void; isTeamShared?: boolean }) {
  const cfg = FILE_TYPE_CONFIG[file.type] ?? FILE_TYPE_CONFIG.txt
  const { Icon } = cfg

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 p-4 bg-white rounded-card border border-line-base shadow-card text-left active:bg-surface-card transition-colors"
    >
      <div className="relative flex-shrink-0">
        <div className={`w-11 h-11 rounded-card ${cfg.bg} flex items-center justify-center`}>
          <Icon size={20} className={cfg.color} />
        </div>
        {isTeamShared && (
          <span className="absolute -top-1.5 -left-1 px-1 py-0.5 bg-brand-orange text-white text-[8px] font-semibold rounded-sm leading-none whitespace-nowrap">
            团队
          </span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-card-title text-ink-primary truncate">{file.name}</p>
        <p className="text-caption text-ink-placeholder mt-0.5">
          {file.size !== '—' && `${file.size}`}
          {file.pageCount && ` · ${file.pageCount}页`}
          {` · ${file.uploadedAt}`}
        </p>
        {file.summary && (
          <p className="text-caption text-ink-secondary mt-1 line-clamp-1 leading-relaxed">{file.summary}</p>
        )}
      </div>
      <ChevronRight size={16} className="text-ink-placeholder flex-shrink-0" />
    </button>
  )
}

export default function K05_KnowledgeDetail() {
  const navigate = useNavigate()
  const { activeBase, files, setActiveFile } = useKnowledge()

  const [activeFilter, setActiveFilter] = useState<string>('全部')
  const [showUpload, setShowUpload] = useState(false)  // K06

  const kbFiles = files.filter(f => f.kbId === activeBase?.id)

  const filterMap: Record<string, string[]> = {
    '文档': ['pdf', 'doc', 'txt'],
    '网页': ['url'],
    '音频': ['audio'],
    '图片': ['image'],
  }
  const filtered = activeFilter === '全部'
    ? kbFiles
    : kbFiles.filter(f => (filterMap[activeFilter] ?? []).includes(f.type))

  const handleFileClick = (file: KnowledgeFile) => {
    setActiveFile(file)
    navigate('/knowledge/file-detail')
  }

  return (
    <div className="flex flex-col h-full relative bg-surface-card">

      {/* ── Header ── */}
      <div className="flex-shrink-0 flex items-center h-14 px-4 bg-white border-b border-line-base">
        <button onClick={() => navigate('/knowledge')} className="p-1 -ml-1 mr-2 text-ink-secondary">
          <ChevronLeft size={24} />
        </button>
        <span className="flex-1 text-h2 text-ink-primary truncate">{activeBase?.name ?? '知识库'}</span>
        <button className="p-2 text-ink-secondary">
          <LayoutGrid size={20} />
        </button>
      </div>

      {/* ── Empty state ── */}
      {kbFiles.length === 0 ? (
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <div className="flex flex-col items-center pt-20 pb-8 px-8 text-center">
            <div className="w-20 h-20 bg-white rounded-card-xl border border-line-base shadow-card flex items-center justify-center mb-5 text-4xl">
              📁
            </div>
            <p className="text-card-title text-ink-primary mb-2">暂无内容</p>
            <p className="text-caption text-ink-placeholder leading-relaxed">
              当前知识库还没有任何内容，<br />你可以通过上传或导入来开始
            </p>
            <button
              onClick={() => setShowUpload(true)}
              className="mt-6 flex items-center gap-2 px-5 py-2.5 bg-brand-orange text-white rounded-btn text-body font-medium"
            >
              <Plus size={16} />
              添加内容
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* ── Filter tabs ── */}
          <div className="flex-shrink-0 bg-white border-b border-line-base px-4 py-2 flex gap-2 overflow-x-auto scrollbar-hide">
            {TYPE_FILTERS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className={`px-3 py-1.5 rounded-pill text-caption whitespace-nowrap transition-colors flex-shrink-0 ${
                  activeFilter === tab ? 'bg-brand-orange text-white' : 'bg-surface-card text-ink-secondary'
                }`}
              >
                {tab}
                {tab !== '全部' && filterMap[tab] && (
                  <span className="ml-1 opacity-70">
                    {kbFiles.filter(f => filterMap[tab].includes(f.type)).length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* ── File list ── */}
          <div className="flex-1 overflow-y-auto scrollbar-hide px-4 py-4 space-y-3 pb-24">
            {filtered.length > 0 ? (
              filtered.map(f => (
                <FileCard key={f.id} file={f} onClick={() => handleFileClick(f)} isTeamShared={activeBase?.type === 'subscribed'} />
              ))
            ) : (
              <div className="flex flex-col items-center py-12 text-center">
                <p className="text-body text-ink-secondary">该类型暂无文件</p>
              </div>
            )}
          </div>
        </>
      )}

      {/* ── Bottom Ask AI bar ── */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-line-base bg-white px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/ask')}
            className="flex-1 flex items-center gap-2 px-4 py-2.5 bg-surface-card rounded-pill border border-line-base text-left"
          >
            <Search size={15} className="text-ink-placeholder flex-shrink-0" />
            <span className="text-body text-ink-placeholder">问 AI 关于「{activeBase?.name ?? '知识库'}」…</span>
          </button>
          <button
            onClick={() => setShowUpload(true)}
            aria-label="添加内容"
            className="w-10 h-10 bg-brand-orange rounded-full flex items-center justify-center shadow-card flex-shrink-0"
          >
            <Plus size={20} className="text-white" />
          </button>
        </div>
      </div>

      <K06_UploadSource open={showUpload} onClose={() => setShowUpload(false)} />

    </div>
  )
}
