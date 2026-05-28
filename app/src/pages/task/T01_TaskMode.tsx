import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ChevronLeft, Send, Zap } from 'lucide-react'
import TabLayout from '../../components/layout/TabLayout'
import { useKnowledge } from '../../context/KnowledgeContext'

const TASK_SUGGESTIONS = [
  '帮我做一个竞品数据速查工具',
  '生成一个兴趣库周报自动生成器',
  '做一个用户访谈问题生成器',
]

export default function T01_TaskMode() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const { bases, subscribedBases, askSelectedBaseIds } = useKnowledge()
  const [input, setInput] = useState(state?.requirement || '')
  const allBases = [...bases, ...subscribedBases]
  const selectedKbIds: string[] = state?.selectedKbIds ?? askSelectedBaseIds
  const selectedKbNames: string[] = state?.selectedKbNames ?? allBases.filter(kb => selectedKbIds.includes(kb.id)).map(kb => kb.name)

  const handleSend = () => {
    if (!input.trim()) return
    navigate('/ask/task-result', { state: { requirement: input, selectedKbIds, selectedKbNames } })
  }

  return (
    <TabLayout>
      <div className="flex flex-col h-full bg-white">
        {/* Header */}
        <div className="px-5 pt-5 pb-3">
          <div className="flex items-center gap-2 mb-1">
            <button onClick={() => navigate('/apps')} className="p-1 -ml-2 text-ink-secondary">
              <ChevronLeft size={24} />
            </button>
            <Zap size={20} className="text-brand-orange" />
            <h1 className="text-h1 text-ink-primary">任务模式</h1>
          </div>
          <p className="text-caption text-ink-secondary">描述需求，AI 帮你生成可用的小应用</p>
          {selectedKbNames.length > 0 && (
            <div className="mt-2 flex items-center gap-1.5 overflow-x-auto scrollbar-hide">
              <span className="text-micro text-ink-placeholder flex-shrink-0">数据源</span>
              {selectedKbNames.map(name => (
                <span key={name} className="text-micro px-2 py-0.5 bg-brand-orange-light text-brand-orange rounded-pill whitespace-nowrap flex-shrink-0">
                  {name}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex-1 px-5 py-2 overflow-y-auto scrollbar-hide">
          <p className="text-caption text-ink-placeholder mb-3">试试这些任务</p>
          <div className="space-y-2">
            {TASK_SUGGESTIONS.map(s => (
              <button key={s} onClick={() => setInput(s)}
                className="w-full text-left p-4 bg-white rounded-card border border-line-base shadow-card">
                <p className="text-body text-ink-primary">{s}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="px-4 pb-3 pt-2 bg-white border-t border-line-base">
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-surface-card rounded-card-lg px-4 py-2.5">
              <textarea value={input} onChange={e => setInput(e.target.value)}
                placeholder="描述你想完成的任务..." rows={1}
                className="w-full bg-transparent resize-none text-body text-ink-primary outline-none placeholder:text-ink-placeholder max-h-24 leading-6"
              />
            </div>
            <button onClick={handleSend}
              className={`w-11 h-11 rounded-card-lg flex items-center justify-center ${input.trim() ? 'bg-brand-orange' : 'bg-surface-card'}`}>
              <Send size={18} className={input.trim() ? 'text-white' : 'text-ink-placeholder'} />
            </button>
          </div>
        </div>
      </div>
    </TabLayout>
  )
}
