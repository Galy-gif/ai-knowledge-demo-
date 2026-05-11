import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, Edit2, Link2, MoreHorizontal, Send } from 'lucide-react'
import BottomSheet from '../../components/ui/BottomSheet'
import BottomFloatingPanel from '../../components/common/BottomFloatingPanel'
import DocumentActionSheet from '../../components/common/DocumentActionSheet'
import HighlightedText from '../../components/common/HighlightedText'
import DocumentReader, { AnnotationListSheet, useDocumentReader } from '../../components/common/DocumentReader'
import { useAnnotations } from '../../context/AnnotationContext'
import { useNotes } from '../../context/NotesContext'
import { useUser } from '../../context/UserContext'
import Toast from '../../components/common/Toast'
import { mockNotes } from '../../mock/data'

function NoteContent({ text }: { text: string }) {
  const { hlTexts, hlColors } = useDocumentReader()
  return (
    <>
      {text.split('\n').map((line, i) => {
        if (line.startsWith('## '))
          return <h2 key={i} className="text-h2 font-semibold text-ink-primary mt-6 mb-3">{line.slice(3)}</h2>
        if (line.startsWith('### '))
          return <h3 key={i} className="text-card-title font-semibold text-ink-primary mt-4 mb-2">{line.slice(4)}</h3>
        if (line.startsWith('- [ ]'))
          return (
            <div key={i} className="flex items-start gap-2 mb-1.5">
              <div className="w-4 h-4 border-2 border-line-base rounded mt-0.5 flex-shrink-0" />
              <p className="text-body text-ink-secondary">
                <HighlightedText text={line.slice(6)} highlights={hlTexts} colorMap={hlColors} />
              </p>
            </div>
          )
        if (line.startsWith('- '))
          return (
            <div key={i} className="flex items-start gap-2 mb-1.5">
              <span className="text-ink-secondary mt-1 flex-shrink-0 leading-none">·</span>
              <p className="text-body text-ink-secondary">
                <HighlightedText text={line.slice(2)} highlights={hlTexts} colorMap={hlColors} />
              </p>
            </div>
          )
        if (line === '---') return <hr key={i} className="border-line-base my-4" />
        if (line === '') return <div key={i} className="h-2" />
        return (
          <p key={i} className="text-body text-ink-secondary mb-2 leading-relaxed">
            <HighlightedText text={line} highlights={hlTexts} colorMap={hlColors} />
          </p>
        )
      })}
    </>
  )
}

export default function N06_NoteDetail() {
  const navigate = useNavigate()
  const { activeNote, notes, setActiveNote, deleteNote } = useNotes()
  const { showToast } = useUser()
  const { getAnnotationsByDoc } = useAnnotations()
  const note = activeNote ?? mockNotes[0]

  const docAnnotations = getAnnotationsByDoc(note.id, 'note')

  const [showBacklinks,    setShowBacklinks]    = useState(false)
  const [showActionSheet,  setShowActionSheet]  = useState(false)
  const [showAnnotations,  setShowAnnotations]  = useState(false)
  const [showX02,          setShowX02]          = useState(false)
  const [showX03,          setShowX03]          = useState(false)
  const [showX04,          setShowX04]          = useState(false)
  const [x02Input,         setX02Input]         = useState('')
  const [pendingText,      setPendingText]      = useState('')

  const backlinkedNotes = notes.filter(n => note.backlinks?.includes(n.id))

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
      <div className="flex items-center h-14 px-4 border-b border-line-base flex-shrink-0">
        <button onClick={() => navigate(-1)} className="p-1 -ml-1 mr-2 text-ink-secondary">
          <ChevronLeft size={24} />
        </button>
        <span className="flex-1 text-caption text-ink-placeholder truncate">{note.title}</span>
        <div className="flex items-center gap-1">
          <button onClick={() => setShowBacklinks(true)} className="p-2 text-ink-secondary">
            <Link2 size={20} />
          </button>
          <button
            onClick={() => navigate('/notes/edit', {
              state: { noteId: note.id, prefillTitle: note.title, prefilledContent: note.content },
            })}
            className="p-2 text-ink-secondary"
          >
            <Edit2 size={20} />
          </button>
          <button onClick={() => setShowActionSheet(true)} className="p-2 text-ink-secondary">
            <MoreHorizontal size={20} />
          </button>
        </div>
      </div>

      {/* ── Scrollable content (wrapped in DocumentReader) ── */}
      <DocumentReader
        docId={note.id}
        docType="note"
        bottomPx={8}
        onAction={handleAction}
        className="flex-1 overflow-y-auto scrollbar-hide"
      >
        <div className="px-5 pt-4 pb-10">
          <h1 className="text-[22px] font-semibold text-ink-primary mb-2">{note.title}</h1>
          <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-line-base flex-wrap">
            <span className="text-caption text-ink-placeholder">{note.updatedAt}</span>
            <span className="text-ink-placeholder">·</span>
            <span className="text-caption text-ink-placeholder">{note.wordCount} 字</span>
            {note.tags.map(tag => (
              <span key={tag} className="text-micro px-2 py-0.5 bg-surface-card text-ink-placeholder rounded-pill">
                #{tag}
              </span>
            ))}
          </div>
          <NoteContent text={note.content} />
        </div>
      </DocumentReader>

      {/* ── N08 Backlinks ── */}
      <BottomSheet open={showBacklinks} onClose={() => setShowBacklinks(false)} title="反向链接">
        <div className="px-5 py-3">
          {backlinkedNotes.length === 0 ? (
            <p className="text-body text-ink-placeholder py-8 text-center">暂无反向链接</p>
          ) : (
            <div className="space-y-2">
              <p className="text-caption text-ink-placeholder mb-3">被这些笔记引用过</p>
              {backlinkedNotes.map(n => (
                <button
                  key={n.id}
                  onClick={() => { setShowBacklinks(false); setActiveNote(n); navigate('/notes/detail') }}
                  className="w-full text-left p-3.5 bg-surface-card rounded-card border border-line-base"
                >
                  <p className="text-card-title text-ink-primary">{n.title}</p>
                  <p className="text-caption text-ink-placeholder mt-1">{n.updatedAt} · {n.wordCount} 字</p>
                </button>
              ))}
            </div>
          )}
        </div>
      </BottomSheet>

      {/* ── X02 AI追问 ── */}
      <BottomFloatingPanel open={showX02} onClose={() => setShowX02(false)} title="AI 追问">
        <div className="px-5 py-4">
          <div className="bg-surface-card rounded-card px-3 py-2.5 mb-4 border border-line-base">
            <p className="text-caption text-ink-placeholder mb-1">已选文本</p>
            <p className="text-body text-ink-secondary line-clamp-3">「{pendingText}」</p>
          </div>
          <div className="space-y-2 mb-4">
            {['这段话的核心观点是什么？', '如何在实际工作中应用？', '有哪些相关资料推荐？'].map(q => (
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
              onClick={() => { setShowX02(false); navigate('/ask/answer', { state: { question: x02Input, context: pendingText } }) }}
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
            "The core idea emphasizes building a sustainable knowledge management system with clear content lifecycles, enabling teams to maintain high-quality, up-to-date information repositories."
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
            在笔记语境下，该内容属于<strong>方法论型知识</strong>，适合作为核心原则收藏和引用。它描述的是一个可复用的工作框架，能够应用于团队协作、个人学习等多种场景中。
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => { setShowX04(false); navigate('/ask/answer', { state: { question: `解释一下：${pendingText.slice(0, 30)}` } }) }}
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

      <DocumentActionSheet
        open={showActionSheet}
        onClose={() => setShowActionSheet(false)}
        docType="note"
        docContent={note.content}
        onDelete={() => deleteNote(note.id)}
        annotationsCount={docAnnotations.length}
        onAnnotations={() => setShowAnnotations(true)}
      />

      <AnnotationListSheet
        open={showAnnotations}
        onClose={() => setShowAnnotations(false)}
        docId={note.id}
        docType="note"
      />

      <Toast />
    </div>
  )
}
