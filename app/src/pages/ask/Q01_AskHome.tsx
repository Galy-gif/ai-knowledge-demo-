import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Send, AtSign, Mic, Image, SlidersHorizontal, ChevronRight, FileText, Search, Sparkles } from 'lucide-react'
import TabLayout from '../../components/layout/TabLayout'
import { mockAiSuggestions } from '../../mock/data'
import Q02_ToolsSheet, { type MagicAction, type ToolMode } from './Q02_ToolsSheet'
import { useUser } from '../../context/UserContext'
import { useKnowledge } from '../../context/KnowledgeContext'

const MODE_META: Record<ToolMode, { label: string; shortLabel: string; placeholder: string }> = {
  ai: { label: 'AI 问答', shortLabel: '问答', placeholder: '问一问...' },
  web: { label: '网页搜索', shortLabel: '搜索', placeholder: '搜索网页...' },
  task: { label: '任务模式', shortLabel: '任务', placeholder: '描述你想完成的任务...' },
}

const SUGGESTION_ICONS = [Sparkles, Search, FileText]

export default function Q01_AskHome() {
  const navigate = useNavigate()
  const { showToast } = useUser()
  const { bases, subscribedBases, askSelectedBaseIds } = useKnowledge()
  const [mode, setMode] = useState<ToolMode>('ai')
  const [input, setInput] = useState('')
  const [showTools, setShowTools] = useState(false)
  const featuredSuggestions = mockAiSuggestions.slice(0, 3)
  const allBases = [...bases, ...subscribedBases]
  const askSelectedBases = allBases.filter(kb => askSelectedBaseIds.includes(kb.id))
  const kbStatus = askSelectedBases.length === 0
    ? ''
    : askSelectedBases.length === 1
      ? askSelectedBases[0].name
      : `已选 ${askSelectedBases.length} 个`

  const submitQuery = (rawText: string) => {
    const text = rawText.trim()
    const selectedKbNames = askSelectedBases.map(kb => kb.name)
    const contextState = { selectedKbIds: askSelectedBaseIds, selectedKbNames }
    if (!text) return
    if (mode === 'ai') navigate('/ask/answer', { state: { question: text, ...contextState } })
    else if (mode === 'web') navigate('/ask/web-search', { state: { query: text, ...contextState } })
    else navigate('/ask/task-mode', { state: { requirement: text, ...contextState } })
  }

  const handleSend = () => {
    submitQuery(input)
  }

  const handleMagicAction = (action: MagicAction) => {
    setMode('ai')
    setInput(action.prompt)
    setShowTools(false)
  }

  const handleModeChange = (nextMode: ToolMode) => {
    setMode(nextMode)
    setShowTools(false)
  }

  return (
    <TabLayout>
      <div className="flex flex-col h-full bg-white">
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {/* Hero */}
          <div className="px-5 pt-8 pb-4">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-[26px] leading-tight font-semibold text-ink-primary">问一问</h1>
              <span className="px-1.5 py-0.5 rounded bg-white border border-line-base text-[9px] font-semibold text-brand-orange shadow-card">
                AI
              </span>
            </div>
            <p className="text-caption text-ink-placeholder">从知识库、网页和任务里快速开始</p>
          </div>

          {/* Suggestions */}
          <div className="px-5 py-2">
            <p className="text-caption text-ink-placeholder mb-3">为你推荐</p>
            <div className="space-y-2.5">
            {featuredSuggestions.map((q, index) => {
              const Icon = SUGGESTION_ICONS[index] ?? Sparkles
              return (
              <button
                key={q}
                onClick={() => submitQuery(q)}
                className="w-full flex items-center gap-3 text-left p-3.5 bg-white/95 rounded-card border border-line-base shadow-card active:bg-surface-card transition-colors"
              >
                <div className="w-9 h-9 rounded-card bg-brand-orange-light flex items-center justify-center flex-shrink-0">
                  <Icon size={17} className="text-brand-orange" />
                </div>
                <p className="flex-1 min-w-0 text-body text-ink-primary line-clamp-1">{q}</p>
                <ChevronRight size={15} className="text-ink-placeholder flex-shrink-0" />
              </button>
              )
            })}
            </div>
          </div>
        </div>

        {/* Input area */}
        <div className="px-4 pb-4 bg-white border-t border-line-base">
          {/* Quick actions */}
          <div className="flex items-center gap-3 py-2.5 border-b border-line-base mb-3">
            <button
              onClick={() => setShowTools(true)}
              className="flex items-center gap-1.5 text-caption text-ink-secondary"
            >
              <SlidersHorizontal size={15} className="text-brand-orange" />
              工具
            </button>
            <button
              onClick={() => navigate('/ask/select-kb')}
              className={`flex items-center gap-1.5 text-caption min-w-0 ${kbStatus ? 'text-brand-orange' : 'text-ink-secondary'}`}
            >
              <AtSign size={15} className="text-brand-orange" />
              <span className="whitespace-nowrap">知识库</span>
              {kbStatus && <span className="max-w-[92px] truncate">· {kbStatus}</span>}
            </button>
            <span className="ml-auto text-micro text-ink-placeholder">{MODE_META[mode].label}</span>
          </div>

          <div className="flex items-end gap-2">
            <div className="flex-1 bg-surface-card rounded-card-lg px-4 py-3 flex items-end gap-2">
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder={MODE_META[mode].placeholder}
                className="flex-1 bg-transparent resize-none text-body text-ink-primary outline-none placeholder:text-ink-placeholder max-h-24"
                rows={1}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
              />
              <div className="flex gap-2 items-center">
                <button
                  type="button"
                  onClick={() => showToast('语音 / 图片输入功能即将上线')}
                  title="语音输入"
                >
                  <Mic size={18} className="text-ink-placeholder" />
                </button>
                <button
                  type="button"
                  onClick={() => showToast('语音 / 图片输入功能即将上线')}
                  title="图片输入"
                >
                  <Image size={18} className="text-ink-placeholder" />
                </button>
              </div>
            </div>
            <button
              onClick={handleSend}
              className={`w-11 h-11 rounded-card-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                input.trim() ? 'bg-brand-orange' : 'bg-surface-card'
              }`}
            >
              <Send size={18} className={input.trim() ? 'text-white' : 'text-ink-placeholder'} />
            </button>
          </div>
        </div>

        <Q02_ToolsSheet
          open={showTools}
          activeMode={mode}
          onClose={() => setShowTools(false)}
          onModeChange={handleModeChange}
          onMagicApply={handleMagicAction}
        />
      </div>
    </TabLayout>
  )
}
