import { useNavigate } from 'react-router-dom'
import PageLayout from '../../components/layout/PageLayout'
import TopHeader from '../../components/layout/TopHeader'
import { useKnowledge } from '../../context/KnowledgeContext'
import { Check, PenLine } from 'lucide-react'
import { useState } from 'react'
import { useUser } from '../../context/UserContext'
import { QUICK_NOTES_KB_ID } from '../../mock/data'

export default function Q03_SelectKnowledge() {
  const navigate = useNavigate()
  const { bases, subscribedBases, askSelectedBaseIds, setAskSelectedBaseIds } = useKnowledge()
  const { showToast } = useUser()
  const allBases = [...bases, ...subscribedBases]
  const [selectedIds, setSelectedIds] = useState<string[]>(askSelectedBaseIds)

  const toggle = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id])
  }

  const handleConfirm = () => {
    setAskSelectedBaseIds(selectedIds)
    showToast(selectedIds.length > 0 ? `已选择 ${selectedIds.length} 个知识库` : '已不限定知识库')
    navigate(-1)
  }

  return (
    <PageLayout>
      <TopHeader title="选择知识库" showBack right={
        <div className="flex items-center gap-3">
          <button onClick={() => setSelectedIds([])} className="text-ink-secondary text-body">清空</button>
          <button onClick={handleConfirm} className="text-brand-orange text-body font-medium">确定</button>
        </div>
      } />
      <div className="px-5 py-4 space-y-2">
        <p className="text-caption text-ink-placeholder mb-3">选择问答、网页搜索和任务生成时参考的知识库，可多选</p>
        {allBases.map(kb => (
          <button key={kb.id} onClick={() => toggle(kb.id)}
            className={`w-full flex items-center gap-3 p-4 rounded-card border ${selectedIds.includes(kb.id) ? 'border-brand-orange bg-brand-orange-light' : 'border-line-base bg-white'}`}>
            <span className="w-10 h-10 rounded-card bg-surface-card flex items-center justify-center text-2xl flex-shrink-0">
              {kb.id === QUICK_NOTES_KB_ID ? <PenLine size={19} className="text-brand-orange" /> : kb.icon}
            </span>
            <div className="flex-1 text-left">
              <p className="text-card-title text-ink-primary">{kb.name}</p>
              <p className="text-caption text-ink-placeholder">{kb.fileCount} 个文件</p>
            </div>
            {selectedIds.includes(kb.id) && <div className="w-5 h-5 rounded-full bg-brand-orange flex items-center justify-center"><Check size={12} className="text-white" /></div>}
          </button>
        ))}
      </div>
    </PageLayout>
  )
}
