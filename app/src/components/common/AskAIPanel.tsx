import { useState } from 'react'
import { ExternalLink, Send, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import BottomFloatingPanel from './BottomFloatingPanel'
import StreamingText from './StreamingText'

type Scope = 'document' | 'knowledge'

interface Message {
  id: string
  role: 'user' | 'assistant'
  text: string
}

interface AskAIPanelProps {
  open: boolean
  onClose: () => void
  scope: Scope
  scopeName: string
  scopeId: string
}

function buildAnswer(question: string, scopeName: string, scope: Scope, round: number) {
  const sourceLabel = scope === 'knowledge' ? '兴趣库' : '文档'
  const followUpPrefix = round > 0 ? '结合上一轮上下文继续看，' : ''
  return `${followUpPrefix}基于「${scopeName}」${sourceLabel}内容，可以从三个层面回答：

**1. 先定位核心资料**
- 优先检索标题、摘要和最近更新内容
- 对速记、文档、网页来源进行合并去重
- 将与“${question.slice(0, 18)}”相关的片段作为回答依据

**2. 再提炼可执行结论**
- 把零散信息压缩成 3-5 个要点
- 标记可能需要二次确认的来源
- 如果涉及任务生成，会保留约束条件和数据来源

**3. 后续建议**
你可以继续追问某个细节，或通过保存到库把这次回答沉淀下来。`
}

function renderMarkdown(text: string) {
  return text.split('\n').map((line, index) => {
    if (line.startsWith('**') && line.endsWith('**')) {
      return <p key={index} className="text-body font-semibold text-ink-primary mt-3 mb-1">{line.slice(2, -2)}</p>
    }
    if (line.startsWith('- ')) {
      return <p key={index} className="text-body text-ink-secondary mb-1 pl-3">• {line.slice(2)}</p>
    }
    if (!line.trim()) return <div key={index} className="h-1.5" />
    return <p key={index} className="text-body text-ink-secondary leading-relaxed mb-1.5">{line}</p>
  })
}

export default function AskAIPanel({ open, onClose, scope, scopeName, scopeId }: AskAIPanelProps) {
  const navigate = useNavigate()
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([])

  const handleSend = () => {
    const question = input.trim()
    if (!question) return
    const round = messages.filter(m => m.role === 'user').length
    setMessages(prev => [
      ...prev,
      { id: `u_${Date.now()}`, role: 'user', text: question },
      { id: `a_${Date.now()}`, role: 'assistant', text: buildAnswer(question, scopeName, scope, round) },
    ])
    setInput('')
  }

  const openFullConversation = () => {
    const userMessages = messages.filter(m => m.role === 'user')
    const firstQuestion = userMessages[0]?.text ?? `基于「${scopeName}」继续问答`
    const latestQuestion = userMessages[userMessages.length - 1]?.text ?? `请总结「${scopeName}」的核心内容`
    navigate('/ask/answer-multi', {
      state: {
        question: firstQuestion,
        followUp: latestQuestion,
        selectedKbIds: scope === 'knowledge' ? [scopeId] : [],
        selectedKbNames: scope === 'knowledge' ? [scopeName] : [],
        history: messages,
      },
    })
  }

  return (
    <BottomFloatingPanel
      open={open}
      onClose={onClose}
      title="AI 对话"
      maxHeightClass="max-h-[78%]"
      headerRight={
        <button
          onClick={openFullConversation}
          aria-label="跳转到完整对话"
          className="p-1 text-ink-placeholder active:text-brand-orange"
        >
          <ExternalLink size={17} />
        </button>
      }
    >
      <div className="flex flex-col min-h-[420px]">
        <div className="px-5 pt-3 pb-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-brand-orange-light text-brand-orange rounded-pill text-caption font-medium">
            <Sparkles size={13} />
            基于「{scopeName}」回答
          </div>
        </div>

        <div className="flex-1 px-5 py-2 space-y-4 overflow-y-auto scrollbar-hide">
          {messages.length === 0 ? (
            <div className="pt-10 text-center">
              <div className="w-12 h-12 mx-auto rounded-card-lg bg-brand-orange-light flex items-center justify-center mb-3">
                <Sparkles size={20} className="text-brand-orange" />
              </div>
              <p className="text-card-title text-ink-primary">在当前兴趣库内提问</p>
              <p className="text-caption text-ink-placeholder mt-1">AI 会默认检索这里的全部内容作为上下文</p>
            </div>
          ) : (
            messages.map(message => (
              message.role === 'user' ? (
                <div key={message.id} className="flex justify-end">
                  <div className="max-w-[82%] bg-brand-orange/10 rounded-card rounded-tr-sm px-3.5 py-2.5">
                    <p className="text-body text-ink-primary">{message.text}</p>
                  </div>
                </div>
              ) : (
                <div key={message.id}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-brand-orange rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-micro font-bold">AI</span>
                    </div>
                    <span className="text-caption text-ink-placeholder">AI 回答</span>
                  </div>
                  <StreamingText
                    text={message.text}
                    speed={4}
                    tickMs={18}
                    render={(displayed, streaming) => (
                      <div>
                        {streaming && <div className="w-1.5 h-4 bg-brand-orange rounded-full animate-pulse mb-2" />}
                        {renderMarkdown(displayed)}
                      </div>
                    )}
                  />
                </div>
              )
            ))
          )}
        </div>

        <div className="flex-shrink-0 px-4 py-3 border-t border-line-base bg-white">
          <div className="flex items-end gap-2">
            <div className="flex-1 bg-surface-card rounded-card-lg px-4 py-2.5">
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder={`在「${scopeName}」中继续追问…`}
                className="w-full bg-transparent resize-none text-body text-ink-primary outline-none placeholder:text-ink-placeholder max-h-20"
                rows={1}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSend()
                  }
                }}
              />
            </div>
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className={`w-10 h-10 rounded-card-lg flex items-center justify-center flex-shrink-0 ${
                input.trim() ? 'bg-brand-orange' : 'bg-surface-card'
              }`}
            >
              <Send size={16} className={input.trim() ? 'text-white' : 'text-ink-placeholder'} />
            </button>
          </div>
        </div>
      </div>
    </BottomFloatingPanel>
  )
}
