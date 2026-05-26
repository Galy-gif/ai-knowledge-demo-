import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, X, CheckCircle, Loader } from 'lucide-react'
import { useKnowledge } from '../../context/KnowledgeContext'
import { useUser } from '../../context/UserContext'
import { getFileTypeVisual } from '../../utils/fileTypeVisuals'

interface UploadItem {
  id: string
  name: string
  type: 'pdf' | 'doc' | 'audio'
  totalMB: number
  progress: number   // 0-100
  done: boolean
  aiProcessing?: boolean
}

const INITIAL_ITEMS: UploadItem[] = [
  { id: 'u1', name: 'Q3用户调研报告.pdf',  type: 'pdf',   totalMB: 5.6, progress: 78,  done: false },
  { id: 'u2', name: '商品分析报告.docx',    type: 'doc',   totalMB: 1.1, progress: 100, done: true  },
  { id: 'u3', name: '用户访谈录音.m4a',     type: 'audio', totalMB: 24,  progress: 32,  done: false, aiProcessing: true },
]

function FileTypeIcon({ type }: { type: UploadItem['type'] }) {
  const cfg = getFileTypeVisual(type)
  const { Icon } = cfg
  return (
    <div
      className="w-12 h-12 rounded-card flex items-center justify-center flex-shrink-0"
      style={{ backgroundColor: cfg.bg }}
    >
      <Icon size={22} style={{ color: cfg.color }} />
    </div>
  )
}

export default function K07_Uploading() {
  const navigate = useNavigate()
  const { activeBase, addFile } = useKnowledge()
  const { showToast } = useUser()
  const [items, setItems] = useState<UploadItem[]>(INITIAL_ITEMS)
  const [finished, setFinished] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setItems(prev => {
        const updated = prev.map(item => {
          if (item.done) return item
          const next = Math.min(item.progress + (item.type === 'audio' ? 2 : 4), 100)
          return { ...item, progress: next, done: next === 100 }
        })

        if (updated.every(i => i.done) && !finished) {
          clearInterval(timer)
          setFinished(true)
          setTimeout(() => {
            if (activeBase) {
              addFile({
                id: `f_${Date.now()}`,
                kbId: activeBase.id,
                name: 'Q3用户调研报告.pdf',
                type: 'pdf',
                size: '5.6MB',
                pageCount: 18,
                uploadedAt: '刚刚',
                summary: '季度调研报告已处理完成，AI 摘要已生成。',
              })
            }
            showToast('文件上传成功')
            navigate(-1)
          }, 800)
        }

        return updated
      })
    }, 150)
    return () => clearInterval(timer)
  }, [finished])

  const doneCount = items.filter(i => i.done).length
  const totalCount = items.length

  return (
    <div className="flex flex-col h-full bg-white">

      {/* Header */}
      <div className="flex-shrink-0 flex items-center h-14 px-4 border-b border-line-base">
        <button onClick={() => navigate(-1)} className="p-1 -ml-1 mr-2 text-ink-secondary">
          <ChevronLeft size={24} />
        </button>
        <span className="flex-1 text-h2 text-ink-primary">上传中</span>
        <button className="text-caption text-ink-secondary px-2 py-1 bg-surface-card rounded-btn">
          后台运行
        </button>
      </div>

      {/* Summary */}
      <div className="px-5 py-3 bg-surface-card border-b border-line-base flex-shrink-0">
        <p className="text-caption text-ink-placeholder">
          共 {totalCount} 个文件，{totalCount - doneCount > 0 ? `${totalCount - doneCount} 个上传中` : '全部处理完成'}
        </p>
      </div>

      {/* File cards */}
      <div className="flex-1 overflow-y-auto scrollbar-hide px-5 py-4 space-y-3">
        {items.map(item => {
          const uploadedMB = ((item.progress / 100) * item.totalMB).toFixed(1)
          const remaining = item.done ? 0 : Math.ceil((item.totalMB - Number(uploadedMB)) / 0.4)

          return (
            <div key={item.id} className="bg-white rounded-card border border-line-base shadow-card p-4">
              <div className="flex items-start gap-3">
                <FileTypeIcon type={item.type} />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-card-title text-ink-primary truncate">{item.name}</p>
                    {item.done ? (
                      <CheckCircle size={18} className="text-green-500 flex-shrink-0" />
                    ) : (
                      <button className="text-ink-placeholder flex-shrink-0">
                        <X size={16} />
                      </button>
                    )}
                  </div>

                  {item.done ? (
                    <div className="flex items-center gap-1.5 mt-1">
                      <CheckCircle size={13} className="text-green-500" />
                      <p className="text-caption text-green-600">处理完成</p>
                    </div>
                  ) : (
                    <>
                      {/* Progress bar */}
                      <div className="mt-2 h-1.5 bg-line-base rounded-pill overflow-hidden">
                        <div
                          className="h-full bg-brand-orange rounded-pill transition-all duration-150"
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between mt-1.5">
                        <p className="text-caption text-ink-placeholder">
                          {item.aiProcessing
                            ? (
                              <span className="flex items-center gap-1">
                                <Loader size={11} className="animate-spin" />
                                AI 正在自动转写并提取要点...
                              </span>
                            )
                            : `已上传 ${uploadedMB}MB / ${item.totalMB}MB · 剩余 ${remaining} 秒`
                          }
                        </p>
                        <p className="text-caption text-brand-orange font-medium">{item.progress}%</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Bottom note */}
      <div className="flex-shrink-0 border-t border-line-base px-5 py-3 flex items-center justify-between bg-white">
        <p className="text-caption text-ink-placeholder">
          上传完成后将自动添加到「{activeBase?.name ?? '兴趣库'}」
        </p>
        <button className="text-caption text-brand-orange">更改</button>
      </div>
    </div>
  )
}
