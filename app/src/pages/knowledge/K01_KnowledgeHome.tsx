import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronDown, ChevronRight, Globe, Plus } from 'lucide-react'
import TabLayout from '../../components/layout/TabLayout'
import BottomSheet from '../../components/ui/BottomSheet'
import { useKnowledge } from '../../context/KnowledgeContext'
import { useUser } from '../../context/UserContext'
import { type KnowledgeBase } from '../../mock/data'

const KB_ICONS = ['💼', '📚', '🔬', '🎯', '💡', '📋']
const KB_COLORS = ['#FF7A00', '#6366F1', '#10B981', '#F59E0B', '#8B5CF6', '#06B6D4']

// ── Toggle row for AI settings ─────────────────────────────────────────────
function ToggleRow({ label, sub, value, onChange }: {
  label: string; sub?: string; value: boolean; onChange: (v: boolean) => void
}) {
  return (
    <button
      onClick={() => onChange(!value)}
      className="w-full flex items-center justify-between px-5 py-3.5 border-b border-line-base last:border-0"
    >
      <div className="text-left">
        <p className="text-body text-ink-primary">{label}</p>
        {sub && <p className="text-caption text-ink-placeholder mt-0.5">{sub}</p>}
      </div>
      <div className={`w-11 h-6 rounded-pill transition-colors flex-shrink-0 flex items-center px-0.5 ${value ? 'bg-brand-orange' : 'bg-line-base'}`}>
        <div className={`w-5 h-5 rounded-full bg-white shadow-card transition-transform ${value ? 'translate-x-5' : 'translate-x-0'}`} />
      </div>
    </button>
  )
}

export default function K01_KnowledgeHome() {
  const navigate = useNavigate()
  const { bases, subscribedBases, setActiveBase, addBase } = useKnowledge()
  const { showToast } = useUser()

  const [personalExpanded, setPersonalExpanded] = useState(true)
  const [subscribedExpanded, setSubscribedExpanded] = useState(true)
  const [showCreate, setShowCreate] = useState(false)   // K03

  // K03 form state
  const [newName, setNewName]         = useState('')
  const [newDesc, setNewDesc]         = useState('')
  const [newIcon, setNewIcon]         = useState(KB_ICONS[0])
  const [newColor, setNewColor]       = useState(KB_COLORS[0])
  const [aiRef, setAiRef]             = useState(true)
  const [autoSync, setAutoSync]       = useState(true)

  const openCreate = () => {
    setNewName(''); setNewDesc(''); setNewIcon(KB_ICONS[0]); setNewColor(KB_COLORS[0])
    setAiRef(true); setAutoSync(true)
    setShowCreate(true)
  }

  const handleCreate = () => {
    if (!newName.trim()) return
    const kb: KnowledgeBase = {
      id: `kb_${Date.now()}`,
      name: newName.trim(),
      icon: newIcon,
      color: newColor,
      fileCount: 0,
      updatedAt: '刚刚',
      type: 'personal',
    }
    addBase(kb)
    showToast('知识库创建成功')
    setShowCreate(false)
  }

  const handleCardClick = (kb: KnowledgeBase) => {
    setActiveBase(kb)
    navigate('/knowledge/detail')
  }

  return (
    <TabLayout>
      <div className="flex flex-col h-full bg-surface-card">

        {/* ── Header ── */}
        <div className="bg-white px-5 pt-5 pb-4 border-b border-line-base flex-shrink-0">
          <div className="flex items-center justify-between">
            <h1 className="text-h1 text-ink-primary">知识库</h1>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/knowledge/square')}
                className="flex items-center gap-1 text-caption text-ink-secondary"
              >
                <Globe size={15} />
                发现
              </button>
              <button
                onClick={openCreate}
                className="flex items-center gap-1 px-3 py-1.5 bg-brand-orange rounded-pill text-white text-caption"
              >
                <Plus size={13} />
                创建
              </button>
            </div>
          </div>
        </div>

        {/* ── KB Sections ── */}
        <div className="flex-1 overflow-y-auto scrollbar-hide px-4 py-4 space-y-3">

          {/* 个人知识库 */}
          <div className="bg-white rounded-card border border-line-base shadow-card overflow-hidden">
            <button
              onClick={() => setPersonalExpanded(v => !v)}
              className="w-full flex items-center justify-between px-4 py-3 border-b border-line-base"
            >
              <div className="flex items-center gap-2">
                <span className="text-caption font-medium text-ink-secondary">个人知识库</span>
                <span className="text-micro px-1.5 py-0.5 bg-surface-card text-ink-placeholder rounded-pill">{bases.length}</span>
              </div>
              <ChevronDown size={16} className={`text-ink-placeholder transition-transform ${personalExpanded ? '' : '-rotate-90'}`} />
            </button>

            {personalExpanded && (
              <div>
                {bases.map((kb, i) => (
                  <button
                    key={kb.id}
                    onClick={() => handleCardClick(kb)}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 text-left active:bg-surface-card transition-colors ${i < bases.length - 1 ? 'border-b border-line-base' : ''}`}
                  >
                    <div
                      className="w-10 h-10 rounded-card flex items-center justify-center text-xl flex-shrink-0"
                      style={{ backgroundColor: kb.color + '22' }}
                    >
                      {kb.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-card-title text-ink-primary">{kb.name}</p>
                      <p className="text-caption text-ink-placeholder mt-0.5">
                        {kb.fileCount > 0 ? `${kb.fileCount} 个文件` : '暂无内容'} · {kb.updatedAt}
                      </p>
                    </div>
                    <ChevronRight size={16} className="text-ink-placeholder flex-shrink-0" />
                  </button>
                ))}

                {/* Add new KB row */}
                <button
                  onClick={openCreate}
                  className="w-full flex items-center gap-3 px-4 py-3 text-brand-orange border-t border-line-base"
                >
                  <div className="w-10 h-10 rounded-card border border-dashed border-brand-orange-mid flex items-center justify-center flex-shrink-0">
                    <Plus size={18} className="text-brand-orange" />
                  </div>
                  <span className="text-body">新建知识库</span>
                </button>
              </div>
            )}
          </div>

          {/* 订阅知识库 */}
          <div className="bg-white rounded-card border border-line-base shadow-card overflow-hidden">
            <button
              onClick={() => setSubscribedExpanded(v => !v)}
              className="w-full flex items-center justify-between px-4 py-3 border-b border-line-base"
            >
              <div className="flex items-center gap-2">
                <span className="text-caption font-medium text-ink-secondary">订阅知识库</span>
                <span className="text-micro px-1.5 py-0.5 bg-surface-card text-ink-placeholder rounded-pill">{subscribedBases.length}</span>
              </div>
              <ChevronDown size={16} className={`text-ink-placeholder transition-transform ${subscribedExpanded ? '' : '-rotate-90'}`} />
            </button>

            {subscribedExpanded && (
              <div>
                {subscribedBases.map((kb, i) => (
                  <button
                    key={kb.id}
                    onClick={() => handleCardClick(kb)}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 text-left active:bg-surface-card transition-colors ${i < subscribedBases.length - 1 ? 'border-b border-line-base' : ''}`}
                  >
                    <div
                      className="w-10 h-10 rounded-card flex items-center justify-center text-xl flex-shrink-0"
                      style={{ backgroundColor: kb.color + '22' }}
                    >
                      {kb.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-card-title text-ink-primary">{kb.name}</p>
                      <p className="text-caption text-ink-placeholder mt-0.5">
                        {kb.fileCount} 个内容 · {kb.updatedAt}
                      </p>
                    </div>
                    <ChevronRight size={16} className="text-ink-placeholder flex-shrink-0" />
                  </button>
                ))}

                <button
                  onClick={() => navigate('/knowledge/square')}
                  className="w-full flex items-center gap-3 px-4 py-3 text-brand-orange border-t border-line-base"
                >
                  <div className="w-10 h-10 rounded-card border border-dashed border-brand-orange-mid flex items-center justify-center flex-shrink-0">
                    <Globe size={18} className="text-brand-orange" />
                  </div>
                  <span className="text-body">浏览知识库广场</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── K03 新建知识库抽屉 ── */}
        <BottomSheet open={showCreate} onClose={() => setShowCreate(false)}>
          {/* Custom header row */}
          <div className="flex items-center justify-between px-5 pb-3 border-b border-line-base">
            <button onClick={() => setShowCreate(false)} className="text-body text-ink-secondary w-10">取消</button>
            <span className="text-body font-semibold text-ink-primary">新建知识库</span>
            <button
              onClick={handleCreate}
              disabled={!newName.trim()}
              className="text-body text-brand-orange font-semibold w-10 text-right disabled:opacity-30"
            >
              创建
            </button>
          </div>

          <div className="px-5 pt-4">
            {/* Icon picker */}
            <div className="flex gap-3 mb-4">
              {KB_ICONS.map(ic => (
                <button
                  key={ic}
                  onClick={() => setNewIcon(ic)}
                  className={`w-12 h-12 rounded-full text-2xl flex items-center justify-center border-2 transition-colors ${
                    newIcon === ic ? 'border-brand-orange bg-brand-orange-light' : 'border-line-base bg-surface-card'
                  }`}
                >
                  {ic}
                </button>
              ))}
            </div>

            {/* Name */}
            <input
              value={newName}
              onChange={e => setNewName(e.target.value)}
              placeholder="例如：产品资料库"
              className="w-full px-0 py-2.5 border-b border-line-base text-body text-ink-primary outline-none bg-transparent placeholder:text-ink-placeholder mb-1"
            />

            {/* Description */}
            <textarea
              value={newDesc}
              onChange={e => setNewDesc(e.target.value)}
              placeholder="简单描述这个知识库的内容..."
              rows={2}
              className="w-full px-0 py-2.5 border-b border-line-base text-body text-ink-secondary outline-none bg-transparent placeholder:text-ink-placeholder resize-none mb-4"
            />
          </div>

          {/* Color row */}
          <div className="px-5 pb-3 flex gap-2.5">
            {KB_COLORS.map(c => (
              <button
                key={c}
                onClick={() => setNewColor(c)}
                className={`w-7 h-7 rounded-full transition-transform ${newColor === c ? 'scale-125 ring-2 ring-offset-1 ring-ink-placeholder' : ''}`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>

          {/* Permission */}
          <div className="border-t border-line-base">
            <p className="text-caption text-ink-placeholder px-5 pt-3 pb-1">权限</p>
            <button className="w-full flex items-center justify-between px-5 py-3 border-b border-line-base">
              <span className="text-body text-ink-primary">可见性</span>
              <div className="flex items-center gap-1 text-caption text-ink-placeholder">
                <span>仅自己</span>
                <ChevronRight size={14} />
              </div>
            </button>
          </div>

          {/* AI settings */}
          <div className="border-t border-line-base">
            <p className="text-caption text-ink-placeholder px-5 pt-3 pb-1">AI 设置</p>
            <ToggleRow
              label="允许 AI 在同一问中引用"
              sub="AI 回答时可检索此知识库"
              value={aiRef}
              onChange={setAiRef}
            />
            <ToggleRow
              label="订阅时自动同步更新"
              value={autoSync}
              onChange={setAutoSync}
            />
          </div>
        </BottomSheet>

      </div>
    </TabLayout>
  )
}
