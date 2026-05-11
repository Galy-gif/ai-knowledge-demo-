import { useState } from 'react'
import { Plus } from 'lucide-react'
import BottomSheet from '../ui/BottomSheet'
import { useKnowledge } from '../../context/KnowledgeContext'
import { useUser } from '../../context/UserContext'

interface Props {
  open: boolean
  onClose: () => void
  onSaved?: () => void
}

export default function SaveToKBSheet({ open, onClose, onSaved }: Props) {
  const { bases } = useKnowledge()
  const { showToast } = useUser()
  const [selectedKb, setSelectedKb] = useState(bases[0]?.id ?? '')

  const handleSave = () => {
    showToast('已保存到知识库')
    onClose()
    onSaved?.()
  }

  return (
    <BottomSheet open={open} onClose={onClose} title="保存到知识库">
      <div className="px-5 py-3 space-y-2">
        {bases.map(kb => (
          <button
            key={kb.id}
            onClick={() => setSelectedKb(kb.id)}
            className={`w-full flex items-center gap-3 p-3 rounded-card border ${
              selectedKb === kb.id ? 'border-brand-orange bg-brand-orange-light' : 'border-line-base'
            }`}
          >
            <span className="text-xl">{kb.icon}</span>
            <p className="text-card-title text-ink-primary">{kb.name}</p>
          </button>
        ))}
        <button className="w-full flex items-center gap-3 p-3 rounded-card border border-dashed border-line-base text-brand-orange">
          <Plus size={16} />
          <p className="text-body">新建知识库</p>
        </button>
        <button
          onClick={handleSave}
          className="w-full py-3.5 bg-brand-orange text-white rounded-btn text-body font-medium mt-2"
        >
          确认保存
        </button>
      </div>
    </BottomSheet>
  )
}
