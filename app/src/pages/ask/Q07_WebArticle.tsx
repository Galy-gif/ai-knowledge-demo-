import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Share2, BookmarkPlus, ChevronDown, ChevronUp, Send, ThumbsUp, ThumbsDown, Copy, Sparkles, Bookmark } from 'lucide-react'
import BottomFloatingPanel from '../../components/common/BottomFloatingPanel'
import HighlightedText from '../../components/common/HighlightedText'
import SaveToKBSheet from '../../components/common/SaveToKBSheet'
import DocumentReader, { AnnotationListSheet, useDocumentReader } from '../../components/common/DocumentReader'
import Toast from '../../components/common/Toast'
import { useAnnotations } from '../../context/AnnotationContext'
import { useUser } from '../../context/UserContext'

const ARTICLE_CONTENT = `## 为什么话题需要保持上下文

搜索问答产品的核心体验不只是"一问一答"，而是让用户能够围绕同一个问题深度追问，获得更完整、更精准的答案与行动建议。

## Session 保留机制

核心设计是将用户的对话历史以 Session 为单位存储，支持跨问题的上下文引用。

**关键参数**
- Session 有效期：默认 24 小时
- 最大上下文长度：32k tokens
- 自动摘要触发：超过 8k tokens 时压缩历史

## 来源映射策略

当用户追问时，系统需要明确区分：

1. 基于前文回答的追问
2. 基于来源文章的追问
3. 全新话题的开始

这三种场景需要不同的上下文注入策略，才能确保答案的连贯性与准确性。

## 追问聚焦设计

通过推荐追问芯片引导用户深入话题，避免对话散漫。每次回答结束后系统自动生成 3 个推荐追问，基于当前上下文和用户历史行为个性化生成。

研究表明，在搜索问答场景中，超过 67% 的用户会进行至少一次追问。而带有上下文引导的追问设计，使得追问深度从平均 1.3 次提升至 2.7 次，显著提高用户获得满意答案的概率。`

const DEFAULT_ARTICLE = {
  title: '搜索问答产品的对话保持策略',
  site: 'yourportal.ai',
  publishedAt: '2026年4月30日',
  readTime: '8分钟',
}

// Stable doc ID derived from article identity
const articleDocId = `${DEFAULT_ARTICLE.site}:${DEFAULT_ARTICLE.title}`

function ArticleContent() {
  const { hlTexts, hlColors } = useDocumentReader()
  return (
    <div className="text-body text-ink-secondary">
      {ARTICLE_CONTENT.split('\n').map((line, i) => {
        if (line.startsWith('## '))
          return <h2 key={i} className="text-h2 text-ink-primary mt-7 mb-3 first:mt-0">{line.slice(3)}</h2>
        if (line.startsWith('**') && line.endsWith('**'))
          return <p key={i} className="font-semibold text-ink-primary mb-2">{line.slice(2, -2)}</p>
        if (line.startsWith('- '))
          return <p key={i} className="mb-1.5 pl-3">• <HighlightedText text={line.slice(2)} highlights={hlTexts} colorMap={hlColors} /></p>
        if (line.match(/^\d+\./))
          return <p key={i} className="mb-1.5 pl-3"><HighlightedText text={line} highlights={hlTexts} colorMap={hlColors} /></p>
        if (line === '') return <div key={i} className="h-3" />
        return (
          <p key={i} className="mb-3 leading-relaxed">
            <HighlightedText text={line} highlights={hlTexts} colorMap={hlColors} />
          </p>
        )
      })}
    </div>
  )
}

export default function Q07_WebArticle() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const { showToast } = useUser()
  const { getAnnotationsByDoc } = useAnnotations()

  const article = (state as { article?: typeof DEFAULT_ARTICLE })?.article ?? DEFAULT_ARTICLE
  const selectedKbIds = (state as { selectedKbIds?: string[] })?.selectedKbIds ?? []
  const selectedKbNames = (state as { selectedKbNames?: string[] })?.selectedKbNames ?? []
  const docId = article === DEFAULT_ARTICLE
    ? articleDocId
    : `${article.site}:${article.title}`

  const docAnnotations = getAnnotationsByDoc(docId, 'web')

  const [showAiPanel,    setShowAiPanel]    = useState(false)
  const [showSaveSheet,  setShowSaveSheet]  = useState(false)
  const [showAnnotations, setShowAnnotations] = useState(false)
  const [showX02,        setShowX02]        = useState(false)
  const [showX03,        setShowX03]        = useState(false)
  const [showX04,        setShowX04]        = useState(false)
  const [x02Input,       setX02Input]       = useState('')
  const [aiInput,        setAiInput]        = useState('')
  const [bookmarked,     setBookmarked]     = useState(false)
  const [feedback,       setFeedback]       = useState<'up' | 'down' | null>(null)
  const [pendingText,    setPendingText]    = useState('')

  const handleAction = (action: string, text: string) => {
    setPendingText(text)
    switch (action) {
      case 'AI 追问': setX02Input(''); setShowX02(true); break
      case '翻译': setShowX03(true); break
      case '解释': setShowX04(true); break
    }
  }

  return (
    <div className="flex flex-col h-full relative bg-white">

      {/* ── Header ── */}
      <div className="flex-shrink-0 flex items-center h-14 px-4 border-b border-line-base bg-white">
        <button onClick={() => navigate(-1)} className="p-1 -ml-1 mr-2 text-ink-secondary">
          <ChevronDown size={24} />
        </button>
        <span className="flex-1 text-caption text-ink-placeholder truncate">{article.site}</span>
        <div className="flex items-center gap-1">
          {docAnnotations.length > 0 && (
            <button onClick={() => setShowAnnotations(true)} className="p-2 text-ink-secondary relative">
              <Bookmark size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-brand-orange rounded-full" />
            </button>
          )}
          <button
            onClick={() => { setBookmarked(v => !v); showToast(bookmarked ? '已取消收藏' : '已收藏') }}
            className="p-2 text-ink-secondary"
          >
            <BookmarkPlus size={20} className={bookmarked ? 'fill-brand-orange text-brand-orange' : ''} />
          </button>
          <button
            onClick={() => { navigator.clipboard.writeText(window.location.href).catch(() => {}); showToast('分享链接已复制') }}
            className="p-2 text-ink-secondary"
          >
            <Share2 size={20} />
          </button>
        </div>
      </div>

      {/* ── Article content (wrapped in DocumentReader) ── */}
      <DocumentReader
        docId={docId}
        docType="web"
        bottomPx={showAiPanel ? 0 : 68}
        onAction={handleAction}
        className="flex-1 overflow-y-auto scrollbar-hide"
      >
        <div className="bg-[#FFFBF5] px-5 pt-6 pb-5 border-b border-line-base">
          <h1 className="text-[22px] font-semibold text-ink-primary leading-tight mb-3">
            {article.title}
          </h1>
          <div className="flex items-center gap-2 text-caption text-ink-placeholder">
            <span>{article.site}</span>
            <span>·</span>
            <span>{article.publishedAt}</span>
            <span>·</span>
            <span>阅读约 {article.readTime}</span>
          </div>
          {selectedKbNames.length > 0 && (
            <div className="mt-3 flex items-center gap-1.5 overflow-x-auto scrollbar-hide">
              <span className="text-micro text-ink-placeholder flex-shrink-0">结合知识库</span>
              {selectedKbNames.map(name => (
                <span key={name} className="text-micro px-2 py-0.5 bg-brand-orange-light text-brand-orange rounded-pill whitespace-nowrap flex-shrink-0">
                  {name}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="px-5 py-5">
          <ArticleContent />

          {/* Organise to note card */}
          <button
            onClick={() => navigate('/notes/edit', { state: { prefilledContent: `# ${article.title}\n\n来源：${article.site}\n\n` } })}
            className="w-full mt-6 mb-2 flex items-center gap-3 px-4 py-4 rounded-card border-2 border-brand-orange/30 bg-brand-orange-light/50 text-left"
          >
            <Sparkles size={18} className="text-brand-orange flex-shrink-0" />
            <div>
              <p className="text-body font-medium text-brand-orange">整理为笔记</p>
              <p className="text-caption text-brand-orange/70">AI 帮你提炼要点，生成结构化笔记</p>
            </div>
          </button>

          {/* Action row */}
          <div className="flex items-center justify-around pt-4 pb-2 border-t border-line-base mt-4">
            <button
              onClick={() => { setFeedback(feedback === 'up' ? null : 'up'); showToast('感谢反馈') }}
              className={`flex flex-col items-center gap-1 ${feedback === 'up' ? 'text-brand-orange' : 'text-ink-secondary'}`}
            >
              <ThumbsUp size={18} className={feedback === 'up' ? 'fill-brand-orange' : ''} />
              <span className="text-micro text-ink-placeholder">有用</span>
            </button>
            <button
              onClick={() => { setFeedback(feedback === 'down' ? null : 'down'); showToast('感谢反馈') }}
              className={`flex flex-col items-center gap-1 ${feedback === 'down' ? 'text-brand-orange' : 'text-ink-secondary'}`}
            >
              <ThumbsDown size={18} className={feedback === 'down' ? 'fill-brand-orange' : ''} />
              <span className="text-micro text-ink-placeholder">没用</span>
            </button>
            <button
              onClick={() => { navigator.clipboard.writeText(ARTICLE_CONTENT).catch(() => {}); showToast('全文已复制') }}
              className="flex flex-col items-center gap-1 text-ink-secondary"
            >
              <Copy size={18} />
              <span className="text-micro text-ink-placeholder">复制</span>
            </button>
            <button
              onClick={() => setShowSaveSheet(true)}
              className="flex flex-col items-center gap-1 text-ink-secondary"
            >
              <BookmarkPlus size={18} />
              <span className="text-micro text-ink-placeholder">保存</span>
            </button>
            <button
              onClick={() => { navigator.clipboard.writeText(window.location.href).catch(() => {}); showToast('分享链接已复制') }}
              className="flex flex-col items-center gap-1 text-ink-secondary"
            >
              <Share2 size={18} />
              <span className="text-micro text-ink-placeholder">分享</span>
            </button>
          </div>
        </div>
      </DocumentReader>

      {/* ── Bottom AI bar (collapsed) ── */}
      {!showAiPanel && (
        <button
          onClick={() => setShowAiPanel(true)}
          className="flex-shrink-0 mx-4 mb-4 flex items-center gap-3 px-4 py-3.5 bg-ink-primary rounded-card-lg shadow-float"
        >
          <div className="w-6 h-6 bg-brand-orange rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white text-micro font-bold">AI</span>
          </div>
          <span className="text-body text-white flex-1 text-left">问 AI 关于这篇内容…</span>
          <ChevronUp size={16} className="text-white/60" />
        </button>
      )}

      {/* ── Q08 AI Panel ── */}
      {showAiPanel && (
        <div className="flex-shrink-0 bg-white border-t border-line-base shadow-float">
          <div className="flex items-center justify-between px-5 py-3 border-b border-line-base">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-brand-orange rounded-full flex items-center justify-center">
                <span className="text-white text-micro font-bold">AI</span>
              </div>
              <span className="text-card-title text-ink-primary">AI 助手</span>
            </div>
            <button onClick={() => setShowAiPanel(false)}>
              <ChevronDown size={20} className="text-ink-secondary" />
            </button>
          </div>

          <div className="flex gap-2 px-5 py-3 overflow-x-auto scrollbar-hide">
            {['总结全文', '提炼要点', '生成笔记'].map(a => (
              <button
                key={a}
                onClick={() => navigate('/ask/answer', { state: { question: `${a}：${article.title}`, selectedKbIds, selectedKbNames } })}
                className="px-3 py-1.5 bg-surface-card rounded-pill text-caption text-ink-secondary whitespace-nowrap flex-shrink-0"
              >
                {a}
              </button>
            ))}
            <button
              onClick={() => setShowSaveSheet(true)}
              className="px-3 py-1.5 bg-brand-orange-light rounded-pill text-caption text-brand-orange whitespace-nowrap flex-shrink-0"
            >
              添加到知识库
            </button>
          </div>

          <div className="flex items-end gap-2 px-4 pb-4">
            <div className="flex-1 bg-surface-card rounded-card-lg px-4 py-3">
              <textarea
                value={aiInput}
                onChange={e => setAiInput(e.target.value)}
                placeholder="针对这篇文章提问..."
                className="w-full bg-transparent resize-none text-body text-ink-primary outline-none placeholder:text-ink-placeholder max-h-16"
                rows={1}
              />
            </div>
            <button
              onClick={() => navigate('/ask/answer', { state: { question: aiInput, selectedKbIds, selectedKbNames } })}
              disabled={!aiInput.trim()}
              className={`w-11 h-11 rounded-card-lg flex items-center justify-center flex-shrink-0 ${aiInput.trim() ? 'bg-brand-orange' : 'bg-surface-card'}`}
            >
              <Send size={18} className={aiInput.trim() ? 'text-white' : 'text-ink-placeholder'} />
            </button>
          </div>
        </div>
      )}

      {/* ── Q09 Save to KB ── */}
      <SaveToKBSheet open={showSaveSheet} onClose={() => setShowSaveSheet(false)} />

      {/* ── X02 AI追问 ── */}
      <BottomFloatingPanel open={showX02} onClose={() => setShowX02(false)} title="AI 追问">
        <div className="px-5 py-4">
          <div className="bg-surface-card rounded-card px-3 py-2.5 mb-4 border border-line-base">
            <p className="text-caption text-ink-placeholder mb-1">已选文本</p>
            <p className="text-body text-ink-secondary line-clamp-3">「{pendingText}」</p>
          </div>
          <div className="space-y-2 mb-4">
            {['这段话的核心观点是什么？', '能举个具体例子吗？', '这个结论有数据支撑吗？'].map(q => (
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
          <p className="text-body text-ink-secondary mb-4 pb-4 border-b border-line-base">「{pendingText}」</p>
          <p className="text-caption text-ink-placeholder mb-2">英文译文</p>
          <p className="text-body text-ink-primary leading-relaxed mb-4">
            "The core experience of a search Q&A product is not just a one-shot answer, but enabling users to deeply follow up around the same topic for more complete, precise answers and actionable insights."
          </p>
          <button onClick={() => showToast('已复制译文')} className="px-4 py-2 bg-surface-card rounded-pill text-caption text-ink-secondary border border-line-base">
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
            在搜索问答产品语境下，<strong>上下文保持</strong>指系统在多轮对话中维持对用户提问意图的理解连续性。系统需判断当前提问是对前文的延伸还是全新话题，从而提供连贯、准确的回答体验。
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => { setShowX04(false); navigate('/ask/answer', { state: { question: `解释一下：${pendingText.slice(0, 30)}`, selectedKbIds, selectedKbNames } }) }}
              className="px-4 py-2 bg-brand-orange text-white rounded-pill text-caption"
            >
              深入追问
            </button>
            <button onClick={() => showToast('已复制解释')} className="px-4 py-2 bg-surface-card rounded-pill text-caption text-ink-secondary border border-line-base">
              复制解释
            </button>
          </div>
        </div>
      </BottomFloatingPanel>

      <AnnotationListSheet
        open={showAnnotations}
        onClose={() => setShowAnnotations(false)}
        docId={docId}
        docType="web"
      />

      <Toast />
    </div>
  )
}
