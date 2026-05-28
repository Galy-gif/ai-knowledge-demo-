import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, Folder, HardDrive, Image as ImageIcon, FileText, Check } from 'lucide-react'
import { useKnowledge } from '../../context/KnowledgeContext'
import { useUser } from '../../context/UserContext'
import { QUICK_NOTES_KB_ID, type FileType, type KnowledgeFile } from '../../mock/data'
import Toast from '../../components/common/Toast'
import ConfirmDialog from '../../components/common/ConfirmDialog'

interface FakePickerFile {
  id: string
  name: string
  size: string
  type: FileType
  location: string
}

const PICKER_FILES: FakePickerFile[] = [
  { id: 'f1', name: '产品方案 V3.pdf', size: '2.1MB', type: 'pdf', location: '本机/文档' },
  { id: 'f2', name: '用户访谈纪要.docx', size: '420KB', type: 'doc', location: '本机/文档' },
  { id: 'f3', name: '运营 SOP 草案.docx', size: '640KB', type: 'doc', location: '本机/文档' },
  { id: 'f4', name: '白板拍照.jpg', size: '1.4MB', type: 'image', location: '相册/最近' },
  { id: 'f5', name: '团队会议 0512.m4a', size: '11MB', type: 'audio', location: '语音备忘录' },
]

type Stage = 'picker' | 'confirm'

export default function K15_AddFromUpload() {
  const navigate = useNavigate()
  const { activeBase, quickNotesBase, addFile } = useKnowledge()
  const { showToast } = useUser()
  const [stage, setStage] = useState<Stage>('picker')
  const [pickedId, setPickedId] = useState<string | null>(null)
  const [editedName, setEditedName] = useState('')

  const kbId = activeBase?.id ?? QUICK_NOTES_KB_ID
  const kbName = activeBase?.name ?? quickNotesBase.name
  const picked = PICKER_FILES.find(f => f.id === pickedId) ?? null

  useEffect(() => {
    if (picked) setEditedName(picked.name)
  }, [picked])

  const handlePick = (file: FakePickerFile) => {
    setPickedId(file.id)
    setStage('confirm')
  }

  const handleConfirm = () => {
    if (!picked) return
    const file: KnowledgeFile = {
      id: `file_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      kbId,
      name: editedName.trim() || picked.name,
      type: picked.type,
      size: picked.size,
      uploadedAt: '刚刚',
      summary: `从本机上传：${picked.location}`,
    }
    addFile(file)
    showToast(`已添加到「${kbName}」`)
    setTimeout(() => navigate(-1), 800)
  }

  const iconForType = (type: FileType) => {
    if (type === 'image') return ImageIcon
    if (type === 'audio') return HardDrive
    return FileText
  }

  return (
    <div className="flex flex-col h-full relative bg-white">
      <div className="h-14 flex items-center px-4 bg-white border-b border-line-base flex-shrink-0">
        <button onClick={() => navigate(-1)} className="p-1 -ml-1 mr-2 text-ink-secondary">
          <ChevronLeft size={24} />
        </button>
        <span className="flex-1 text-h2 text-ink-primary truncate">
          {stage === 'picker' ? '上传文件' : '确认添加'}
        </span>
      </div>

      {stage === 'picker' && (
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <div className="px-5 pt-3 pb-2">
            <div className="rounded-card bg-brand-orange-light px-3 py-2.5 flex items-center gap-2">
              <Folder size={14} className="text-brand-orange" />
              <p className="text-caption text-ink-primary">从设备里选一个文件上传</p>
            </div>
          </div>

          <div className="px-5 mt-2 mb-3">
            <p className="text-micro text-ink-placeholder mb-2">最近</p>
            {PICKER_FILES.map(f => {
              const Icon = iconForType(f.type)
              return (
                <button
                  key={f.id}
                  onClick={() => handlePick(f)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 mb-1.5 bg-white rounded-card border border-line-base active:bg-surface-card text-left"
                >
                  <div className="w-9 h-9 rounded-card bg-[#F5F5F5] flex items-center justify-center flex-shrink-0">
                    <Icon size={16} className="text-ink-secondary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-card-title text-ink-primary truncate">{f.name}</p>
                    <p className="text-caption text-ink-placeholder">{f.size} · {f.location}</p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {stage === 'confirm' && picked && (
        <div className="flex-1 overflow-y-auto scrollbar-hide px-5 pt-4">
          <div className="rounded-card border border-line-base bg-white p-4 mb-4">
            <p className="text-caption text-ink-placeholder mb-1">文件名</p>
            <input
              value={editedName}
              onChange={e => setEditedName(e.target.value)}
              className="w-full text-body text-ink-primary bg-transparent outline-none border-b border-line-base pb-2 focus:border-brand-orange"
            />
            <div className="mt-3 flex items-center gap-2 text-caption text-ink-secondary">
              <span>{picked.size}</span>
              <span className="text-ink-placeholder">·</span>
              <span>{picked.location}</span>
            </div>
          </div>

          <p className="text-caption text-ink-placeholder">将保存到</p>
          <p className="text-card-title text-ink-primary mt-1 mb-6">「{kbName}」</p>

          <button
            onClick={handleConfirm}
            className="w-full py-3 bg-brand-orange text-white rounded-btn text-body font-medium flex items-center justify-center gap-2"
          >
            <Check size={16} />
            添加到资料包
          </button>
        </div>
      )}

      <Toast />
      <ConfirmDialog />
    </div>
  )
}
