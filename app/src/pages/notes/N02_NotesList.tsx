import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, X } from 'lucide-react'
import TabLayout from '../../components/layout/TabLayout'
import { useNotes } from '../../context/NotesContext'
import N03_NewNoteMenu from './N03_NewNoteMenu'

export default function N02_NotesList() {
  const navigate = useNavigate()
  const { notes, setActiveNote } = useNotes()
  const [showNewMenu, setShowNewMenu] = useState(false)
  const [activeTag, setActiveTag] = useState<string | null>(null)

  const tags = Array.from(new Set(notes.flatMap(n => n.tags)))
  const filtered = activeTag ? notes.filter(n => n.tags.includes(activeTag)) : notes

  return (
    <TabLayout>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="px-5 pt-5 pb-3 flex items-center justify-between">
          <h1 className="text-h1 text-ink-primary">笔记</h1>
          <button
            onClick={() => setShowNewMenu(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-brand-orange rounded-pill text-white text-caption"
          >
            <Plus size={14} />
            新建
          </button>
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="px-5 pb-3 flex gap-2 overflow-x-auto scrollbar-hide">
            {tags.map(tag => (
              <button
                key={tag}
                onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-pill text-caption whitespace-nowrap flex-shrink-0 transition-colors ${
                  activeTag === tag ? 'bg-ink-primary text-white' : 'bg-surface-card text-ink-secondary'
                }`}
              >
                #{tag}
                {activeTag === tag && <X size={12} />}
              </button>
            ))}
            <span className="text-caption text-ink-placeholder flex-shrink-0 self-center">+ 更多</span>
          </div>
        )}

        {/* Note list */}
        <div className="flex-1 overflow-y-auto scrollbar-hide px-5 space-y-3 pb-4">
          {notes.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[460px] text-center px-3">
              <div className="w-20 h-20 bg-surface-card rounded-card-xl flex items-center justify-center text-4xl mb-5">
                📝
              </div>
              <h2 className="text-h2 text-ink-primary mb-2">开始记录知识</h2>
              <p className="text-body text-ink-secondary mb-8 leading-relaxed">
                用 AI 整理你的想法，构建个人知识体系
              </p>
              <button
                onClick={() => setShowNewMenu(true)}
                className="px-8 py-4 bg-brand-orange text-white rounded-btn text-body font-medium"
              >
                开始记笔记
              </button>
            </div>
          ) : filtered.length > 0 ? (
            <>
              {activeTag && (
                <p className="text-caption text-ink-placeholder">筛选结果 · {filtered.length} 篇</p>
              )}
              {filtered.map(note => (
                <button
                  key={note.id}
                  onClick={() => { setActiveNote(note); navigate('/notes/detail') }}
                  className="w-full text-left bg-white rounded-card border border-line-base shadow-card p-4"
                >
                  <h3 className="text-card-title text-ink-primary mb-1.5">{note.title}</h3>
                  <p className="text-caption text-ink-secondary line-clamp-2 mb-2 leading-relaxed">
                    {note.content.replace(/[#*[\]]/g, '').slice(0, 80)}...
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1">
                      {note.tags.map(tag => (
                        <span key={tag} className="text-micro px-2 py-0.5 bg-surface-card text-ink-placeholder rounded-pill">
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <span className="text-micro text-ink-placeholder">{note.updatedAt}</span>
                  </div>
                </button>
              ))}
            </>
          ) : (
            <div className="flex flex-col items-center py-12 text-center">
              <p className="text-body text-ink-secondary">没有找到相关笔记</p>
            </div>
          )}
        </div>

        <N03_NewNoteMenu open={showNewMenu} onClose={() => setShowNewMenu(false)} />
      </div>
    </TabLayout>
  )
}
