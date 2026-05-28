import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { BookmarkPlus, ChevronLeft, Copy, Send, Share2, ThumbsDown, ThumbsUp, CheckCircle2 } from 'lucide-react'
import StreamingText from '../../components/common/StreamingText'
import SaveToKnowledgeBaseSheet from '../../components/common/SaveToKnowledgeBaseSheet'
import Toast from '../../components/common/Toast'
import BottomFloatingPanel from '../../components/common/BottomFloatingPanel'
import HighlightedText from '../../components/common/HighlightedText'
import DocumentReader, { useDocumentReader } from '../../components/common/DocumentReader'
import { useUser } from '../../context/UserContext'
import type { SaveSourceContent } from '../../context/KnowledgeContext'

const FULL_ANSWER = `## 资料包知识管理应该怎么运营？

运营资料包的核心在于建立可持续的内容生命周期管理体系。以下是经过实践验证的方法论：

### 1. 运营目标

通过系统化的内容组织和精细化的用户运营，提升资料包内容的使用效率和用户满意度，支撑增长策略资料包的增长与维护。

**内容分层策略：**
- 核心内容（长青型）→ SOP 文档、基础方法论
- 时效内容（更新型）→ 行业动态、版本记录
- 社区内容（共创型）→ 案例分享、经验总结

### 2. 内容分发

在创作者产出与网页来源进行整合与同步：
- **发布频率**：每周 2-3 篇核心内容
- **内容路线**：问题驱动 → 方法论 → 案例验证

### 3. 社区运营

定期举办主题讨论，邀请用户共创内容。重点运营高质量贡献者，形成正向飞轮。

### 4. 数据看板

建立关键指标追踪：阅读量、分享率、转化率，每月复盘调整内容策略。

### 5. 结论

将资料包运营视为一个持续迭代的产品来维护，而非静态文档库。定期清理过期内容，保持知识新鲜度。`

const STEPS = [
  { label: '分析需求', sub: '理解你的提问意图' },
  { label: '生成回答', sub: '基于资料包内容检索' },
  { label: '整理建议', sub: '提取相关追问' },
]

const SUGGESTIONS = [
  '如何衡量资料包的运营效果？',
  '有哪些好的资料包内容模板？',
  '怎么让团队成员积极贡献内容？',
]

function renderMarkdown(text: string, hlTexts: string[], hlColors: Map<string, string>) {
  return text.split('\n').map((line, i) => {
    if (line.startsWith('## '))
      return <h2 key={i} className="text-h2 text-ink-primary mt-5 mb-3 first:mt-0">{line.slice(3)}</h2>
    if (line.startsWith('### '))
      return <h3 key={i} className="text-card-title text-ink-primary mt-4 mb-2">{line.slice(4)}</h3>
    if (line.startsWith('**') && line.endsWith('**'))
      return <p key={i} className="text-body font-semibold text-ink-primary mb-2">{line.slice(2, -2)}</p>
    if (line.startsWith('- **')) {
      const parts = line.slice(4).split('**')
      return <p key={i} className="text-body text-ink-secondary mb-1 pl-3">• <strong>{parts[0]}</strong>{parts[1]}</p>
    }
    if (line.startsWith('- '))
      return <p key={i} className="text-body text-ink-secondary mb-1 pl-3">• {line.slice(2)}</p>
    if (line === '') return <div key={i} className="h-2" />
    return (
      <p key={i} className="text-body text-ink-secondary mb-2 leading-relaxed">
        <HighlightedText text={line} highlights={hlTexts} colorMap={hlColors} />
      </p>
    )
  })
}

function MarkdownContent({ text }: { text: string }) {
  const { hlTexts, hlColors } = useDocumentReader()
  return <>{renderMarkdown(text, hlTexts, hlColors)}</>
}

export default function Q04_AiAnswer() {
  const { state } = useLocation()
  const navigate = useNavigate()

  const { showToast } = useUser()
  const question = (state as { question?: string })?.question ?? '增长策略资料包应该怎么运营？'
  const selectedKbIds = (state as { selectedKbIds?: string[] })?.selectedKbIds ?? []
  const selectedKbNames = (state as { selectedKbNames?: string[] })?.selectedKbNames ?? []
  const [phase, setPhase] = useState<'steps' | 'answer'>('steps')
  const [activeStep, setActiveStep] = useState(0)
  const [input, setInput] = useState('')
  const [showKbSheet, setShowKbSheet] = useState(false)
  const [savePayload, setSavePayload] = useState<SaveSourceContent>({ title: 'AI 回答整理', body: FULL_ANSWER, type: 'ai-answer' })
  const [saveSheetTitle, setSaveSheetTitle] = useState('添加到资料包')
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null)
  const [pendingText, setPendingText] = useState('')
  const [showX02, setShowX02] = useState(false)
  const [showX03, setShowX03] = useState(false)
  const [showX04, setShowX04] = useState(false)
  const [x02Input, setX02Input] = useState('')

  useEffect(() => {
    const t1 = setTimeout(() => setActiveStep(1), 700)
    const t2 = setTimeout(() => setActiveStep(2), 1400)
    const t3 = setTimeout(() => setPhase('answer'), 2000)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [])

  const handleSendFollowUp = () => {
    if (!input.trim()) return
    navigate('/ask/answer-multi', { state: { question, followUp: input, selectedKbIds, selectedKbNames } })
  }

  const handleAction = (action: string, text: string) => {
    setPendingText(text)
    switch (action) {
      case 'AI 追问':
      case '追问':
        setX02Input(''); setShowX02(true); break
      case '翻译': setShowX03(true); break
      case '解释': setShowX04(true); break
      case '入库':
        openKbSheet(
          `关于「${question}」的回答节选`,
          text,
          'ai_excerpt',
          '保存划线内容',
          {
            originalQuestion: question,
            excerpt: text,
            conversationId: 'q04',
            createdAt: new Date().toISOString(),
          },
        )
        break
    }
  }

  const openKbSheet = (
    title: string,
    body: string,
    type: SaveSourceContent['type'] = 'ai-answer',
    sheetTitle = '添加到资料包',
    metadata?: SaveSourceContent['metadata'],
  ) => {
    setSavePayload({ title, body, type, metadata })
    setSaveSheetTitle(sheetTitle)
    setShowKbSheet(true)
  }

  return (
    <div className="flex flex-col h-full relative bg-white">

      {/* ── Header ── */}
      <div className="flex-shrink-0 flex items-center h-14 px-4 border-b border-line-base bg-white">
        <button onClick={() => navigate(-1)} className="p-1 -ml-1 mr-2 text-ink-secondary">
          <ChevronLeft size={24} />
        </button>
        <span className="flex-1 text-h2 text-ink-primary">AI 问答</span>
      </div>

      <DocumentReader
        docId={question.slice(0, 80)}
        docType="ai-answer"
        bottomPx={72}
        onAction={handleAction}
        className="flex-1 overflow-y-auto scrollbar-hide px-5 py-4"
      >
        {/* Question bubble */}
        <div className="bg-surface-card rounded-card p-4 mb-5">
          <p className="text-body font-medium text-ink-primary">{question}</p>
          {selectedKbNames.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              <span className="text-micro text-ink-placeholder self-center">参考资料包</span>
              {selectedKbNames.map(name => (
                <span key={name} className="text-micro px-2 py-0.5 bg-brand-orange-light text-brand-orange rounded-pill">
                  {name}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Progress steps */}
        {phase === 'steps' && (
          <div className="bg-white rounded-card border border-line-base shadow-card p-5 mb-4">
            <p className="text-caption font-semibold text-ink-primary mb-4">正在生成内容</p>
            {STEPS.map((step, i) => {
              const isDone   = i < activeStep
              const isActive = i === activeStep
              return (
                <div key={i} className="flex items-center gap-3 mb-3.5 last:mb-0">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                    isDone   ? 'bg-brand-orange' :
                    isActive ? 'border-2 border-brand-orange bg-brand-orange/10' :
                               'border-2 border-line-base bg-surface-card'
                  }`}>
                    {isDone   && <CheckCircle2 size={12} className="text-white" />}
                    {isActive && <div className="w-2 h-2 bg-brand-orange rounded-full animate-pulse" />}
                  </div>
                  <div>
                    <p className={`text-body ${i <= activeStep ? 'text-ink-primary' : 'text-ink-placeholder'}`}>
                      {step.label}
                    </p>
                    <p className="text-caption text-ink-placeholder">{step.sub}</p>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* AI answer (streaming) */}
        {phase === 'answer' && (
          <StreamingText
            text={FULL_ANSWER}
            speed={4}
            tickMs={18}
            render={(displayed, streaming) => (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 bg-brand-orange rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-micro font-bold">AI</span>
                  </div>
                  <span className="text-caption text-ink-placeholder">AI 回答</span>
                  {streaming && <div className="w-1.5 h-4 bg-brand-orange rounded-full animate-pulse" />}
                </div>

                <div className="mb-2"><MarkdownContent text={displayed} /></div>

                {!streaming && (
                  <>
                    {/* Action row */}
                    <div className="flex gap-2 mt-4 mb-5">
                      <button
                        onClick={() => { setFeedback(feedback === 'up' ? null : 'up'); showToast('感谢反馈') }}
                        className={`p-2 ${feedback === 'up' ? 'text-brand-orange' : 'text-ink-placeholder'}`}
                      >
                        <ThumbsUp size={16} className={feedback === 'up' ? 'fill-brand-orange' : ''} />
                      </button>
                      <button
                        onClick={() => { setFeedback(feedback === 'down' ? null : 'down'); showToast('感谢反馈') }}
                        className={`p-2 ${feedback === 'down' ? 'text-brand-orange' : 'text-ink-placeholder'}`}
                      >
                        <ThumbsDown size={16} className={feedback === 'down' ? 'fill-brand-orange' : ''} />
                      </button>
                      <div className="flex-1" />
                      <button
                        onClick={() => { navigator.clipboard.writeText(FULL_ANSWER).catch(() => {}); showToast('已复制') }}
                        className="flex items-center gap-1.5 px-3 py-2 bg-surface-card rounded-pill text-caption text-ink-secondary"
                      >
                        <Copy size={14} />复制
                      </button>
                      <button
                        onClick={() => openKbSheet('AI 回答整理', FULL_ANSWER)}
                        className="flex items-center gap-1.5 px-3 py-2 bg-surface-card rounded-pill text-caption text-ink-secondary"
                      >
                        <BookmarkPlus size={14} />添加到库
                      </button>
                      <button
                        onClick={() => { navigator.clipboard.writeText(window.location.href).catch(() => {}); showToast('分享链接已复制') }}
                        className="flex items-center gap-1.5 px-3 py-2 bg-surface-card rounded-pill text-caption text-ink-secondary"
                      >
                        <Share2 size={14} />分享
                      </button>
                    </div>

                    {/* Suggestions */}
                    <div className="mb-4">
                      <p className="text-caption text-ink-placeholder mb-2">推荐追问</p>
                      <div className="space-y-2">
                        {SUGGESTIONS.map(s => (
                          <button
                            key={s}
                            onClick={() => navigate('/ask/answer-multi', { state: { question, followUp: s, selectedKbIds, selectedKbNames } })}
                            className="w-full text-left px-4 py-3 bg-surface-card rounded-card text-body text-ink-secondary"
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          />
        )}
      </DocumentReader>

      {/* Follow-up input */}
      <div className="flex-shrink-0 px-4 pb-4 pt-3 bg-white border-t border-line-base">
        <div className="flex items-end gap-2">
          <div className="flex-1 bg-surface-card rounded-card-lg px-4 py-3">
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="继续追问..."
              className="w-full bg-transparent resize-none text-body text-ink-primary outline-none placeholder:text-ink-placeholder max-h-24"
              rows={1}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendFollowUp() } }}
            />
          </div>
          <button
            onClick={handleSendFollowUp}
            className={`w-11 h-11 rounded-card-lg flex items-center justify-center flex-shrink-0 transition-colors ${
              input.trim() ? 'bg-brand-orange' : 'bg-surface-card'
            }`}
          >
            <Send size={18} className={input.trim() ? 'text-white' : 'text-ink-placeholder'} />
          </button>
        </div>
      </div>

      <SaveToKnowledgeBaseSheet
        open={showKbSheet}
        onClose={() => setShowKbSheet(false)}
        sourceContent={savePayload}
        title={saveSheetTitle}
        successToast={kb => savePayload.type.endsWith('_excerpt') ? `已保存到「${kb.name}」资料包` : `已保存到「${kb.name}」`}
      />

      {/* ── X02 AI追问 ── */}
      <BottomFloatingPanel open={showX02} onClose={() => setShowX02(false)} title="AI 追问">
        <div className="px-5 py-4">
          <div className="bg-surface-card rounded-card px-3 py-2.5 mb-4 border border-line-base">
            <p className="text-caption text-ink-placeholder mb-1">已选文本</p>
            <p className="text-body text-ink-secondary line-clamp-3">「{pendingText}」</p>
          </div>
          <div className="space-y-2 mb-4">
            {['这段话的核心观点是什么？', '能具体展开说说吗？', '有数据依据吗？'].map(q => (
              <button
                key={q}
                onClick={() => setX02Input(q)}
                className={`w-full text-left px-3.5 py-2.5 rounded-card border text-body transition-colors ${
                  x02Input === q ? 'border-brand-orange bg-brand-orange-light text-brand-orange' : 'border-line-base bg-surface-card text-ink-secondary'
                }`}
              >
                {q}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <input
              value={x02Input}
              onChange={e => setX02Input(e.target.value)}
              placeholder="针对选中内容追问..."
              className="flex-1 px-4 py-3 bg-surface-card rounded-card border border-line-base text-body text-ink-primary outline-none placeholder:text-ink-placeholder"
            />
            <button
              onClick={() => { setShowX02(false); navigate('/ask/answer', { state: { question: x02Input, context: pendingText, selectedKbIds, selectedKbNames } }) }}
              disabled={!x02Input.trim()}
              className="w-11 h-11 bg-brand-orange rounded-full flex items-center justify-center disabled:opacity-30 flex-shrink-0"
            >
              <Send size={16} className="text-white" />
            </button>
          </div>
        </div>
      </BottomFloatingPanel>

      {/* ── X03 翻译 ── */}
      <BottomFloatingPanel open={showX03} onClose={() => setShowX03(false)} title="翻译">
        <div className="px-5 py-4">
          <p className="text-caption text-ink-placeholder mb-2">原文（中文）</p>
          <p className="text-body text-ink-secondary mb-4 pb-4 border-b border-line-base">
            「{pendingText}」
          </p>
          <p className="text-caption text-ink-placeholder mb-2">英文译文</p>
          <p className="text-body text-ink-primary leading-relaxed mb-4">
            "The core of operating a knowledge base lies in establishing a sustainable content lifecycle management system — covering goal-setting, distribution, community engagement, and dashboard tracking."
          </p>
          <button
            onClick={() => showToast('已复制译文')}
            className="px-4 py-2 bg-surface-card rounded-pill text-caption text-ink-secondary border border-line-base"
          >
            复制译文
          </button>
        </div>
      </BottomFloatingPanel>

      {/* ── X04 解释 ── */}
      <BottomFloatingPanel open={showX04} onClose={() => setShowX04(false)} title="解释">
        <div className="px-5 py-4">
          <div className="bg-surface-card rounded-card px-3 py-2.5 mb-4 border border-line-base">
            <p className="text-caption text-ink-placeholder truncate">
              「{pendingText.slice(0, 40)}{pendingText.length > 40 ? '…' : ''}」
            </p>
          </div>
          <p className="text-body text-ink-primary leading-relaxed mb-4">
            在知识管理产品语境下，该内容涉及<strong>内容生命周期管理</strong>的核心方法论。具体指：从内容创建、分类整理，到定期审查、过期清理的完整闭环，是保持资料包持续活跃和高价值的关键运营策略。
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => { setShowX04(false); navigate('/ask/answer', { state: { question: `解释一下：${pendingText.slice(0, 30)}`, selectedKbIds, selectedKbNames } }) }}
              className="px-4 py-2 bg-brand-orange text-white rounded-pill text-caption"
            >
              深入追问
            </button>
            <button
              onClick={() => showToast('已复制解释')}
              className="px-4 py-2 bg-surface-card rounded-pill text-caption text-ink-secondary border border-line-base"
            >
              复制解释
            </button>
          </div>
        </div>
      </BottomFloatingPanel>

      <Toast />
    </div>
  )
}
