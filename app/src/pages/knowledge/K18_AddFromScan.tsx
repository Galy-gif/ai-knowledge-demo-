import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, Check } from 'lucide-react'
import { useKnowledge } from '../../context/KnowledgeContext'
import { useUser } from '../../context/UserContext'
import { QUICK_NOTES_KB_ID, type KnowledgeFile } from '../../mock/data'
import Toast from '../../components/common/Toast'
import ConfirmDialog from '../../components/common/ConfirmDialog'

const SCAN_RESULT = {
  url: 'https://www.example.com/ai-product-roadmap-2026',
  title: 'AI 产品 2026 路线图分享',
  source: 'example.com',
  summary: '扫码识别到的网页：AI 产品 2026 路线图分享。',
}

type Stage = 'scanning' | 'result'

export default function K18_AddFromScan() {
  const navigate = useNavigate()
  const { activeBase, quickNotesBase, addFile } = useKnowledge()
  const { showToast } = useUser()
  const [stage, setStage] = useState<Stage>('scanning')

  const kbId = activeBase?.id ?? QUICK_NOTES_KB_ID
  const kbName = activeBase?.name ?? quickNotesBase.name

  useEffect(() => {
    if (stage !== 'scanning') return
    const t = window.setTimeout(() => setStage('result'), 1500)
    return () => window.clearTimeout(t)
  }, [stage])

  const handleSave = () => {
    const file: KnowledgeFile = {
      id: `file_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      kbId,
      name: SCAN_RESULT.title,
      type: 'url',
      size: '—',
      uploadedAt: '刚刚',
      summary: `${SCAN_RESULT.source} · 扫码识别`,
      content: `# ${SCAN_RESULT.title}\n\n来源：${SCAN_RESULT.url}\n\n${SCAN_RESULT.summary}`,
    }
    addFile(file)
    showToast(`已添加到「${kbName}」`)
    setTimeout(() => navigate(-1), 800)
  }

  return (
    <div className="flex flex-col h-full relative bg-black">
      <div className="h-14 flex items-center px-4 bg-black/60 flex-shrink-0 relative z-10">
        <button onClick={() => navigate(-1)} className="p-1 -ml-1 mr-2 text-white">
          <ChevronLeft size={24} />
        </button>
        <span className="flex-1 text-h2 text-white truncate">扫一扫</span>
      </div>

      {stage === 'scanning' && (
        <div className="flex-1 relative flex flex-col items-center justify-center text-white">
          <div className="relative w-56 h-56 border-2 border-brand-orange rounded-card-lg">
            <span className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-brand-orange rounded-tl-lg" />
            <span className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-brand-orange rounded-tr-lg" />
            <span className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-brand-orange rounded-bl-lg" />
            <span className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-brand-orange rounded-br-lg" />
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-brand-orange animate-pulse" />
          </div>
          <p className="mt-6 text-body text-white/80">正在识别...</p>
        </div>
      )}

      {stage === 'result' && (
        <div className="flex-1 bg-white overflow-y-auto scrollbar-hide px-5 pt-4">
          <div className="rounded-card bg-brand-orange-light px-3 py-2.5 flex items-center gap-2 mb-4">
            <Check size={14} className="text-brand-orange" />
            <p className="text-caption text-ink-primary">已识别到链接</p>
          </div>

          <div className="rounded-card border border-line-base bg-white p-4 mb-6">
            <p className="text-card-title text-ink-primary mb-1">{SCAN_RESULT.title}</p>
            <p className="text-caption text-ink-placeholder break-all">{SCAN_RESULT.url}</p>
            <p className="text-caption text-ink-secondary mt-2 leading-5">{SCAN_RESULT.summary}</p>
          </div>

          <p className="text-caption text-ink-placeholder">将保存到</p>
          <p className="text-card-title text-ink-primary mt-1 mb-6">「{kbName}」</p>

          <button
            onClick={handleSave}
            className="w-full py-3 bg-brand-orange text-white rounded-btn text-body font-medium"
          >
            保存到知识库
          </button>
        </div>
      )}

      <Toast />
      <ConfirmDialog />
    </div>
  )
}
