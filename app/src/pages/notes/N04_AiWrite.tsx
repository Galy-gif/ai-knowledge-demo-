import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageLayout from '../../components/layout/PageLayout'
import TopHeader from '../../components/layout/TopHeader'
import { Plus, Mic } from 'lucide-react'
import { useUser } from '../../context/UserContext'

const TEMPLATES = [
  { icon: '📋', label: '会议纪要' },
  { icon: '📚', label: '学习笔记' },
  { icon: '📖', label: '读书心得' },
  { icon: '📦', label: '项目复盘' },
]

const REFERENCE_OPTIONS = ['竞品分析报告.pdf', '用户访谈记录.txt', '增长策略规划.docx']

export default function N04_AiWrite() {
  const navigate = useNavigate()
  const { showToast } = useUser()
  const [input, setInput] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState('会议纪要')
  const [showReferencePicker, setShowReferencePicker] = useState(false)
  const [references, setReferences] = useState<string[]>([])

  const handleGenerate = () => {
    navigate('/notes/edit', { state: { aiGenerated: true, template: selectedTemplate, prompt: input } })
  }

  const addReference = (name: string) => {
    setReferences(prev => prev.includes(name) ? prev : [...prev, name])
    setShowReferencePicker(false)
    showToast('已添加为参考素材')
  }

  return (
    <PageLayout>
      <TopHeader title="AI 帮我写" showBack right={
        <button onClick={() => navigate(-1)} className="text-ink-secondary text-body">跳过</button>
      } />
      <div className="px-5 py-6 space-y-6">
        <div className="text-center">
          <h2 className="text-h1 text-ink-primary mb-2">想写点什么？</h2>
          <p className="text-body text-ink-secondary">告诉我你的想法，AI 会帮你整理成结构化笔记</p>
        </div>

        {/* Input */}
        <div>
          <div className="relative bg-surface-card rounded-card-lg p-4 min-h-28">
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="例如：今天和团队讨论了 Q4 路线图，主要聊了三件事…"
              className="w-full bg-transparent resize-none text-body text-ink-primary outline-none placeholder:text-ink-placeholder"
              rows={4}
              maxLength={500}
            />
            <p className="absolute bottom-3 right-3 text-micro text-ink-placeholder">{input.length}/500</p>
          </div>

          {/* References */}
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => setShowReferencePicker(v => !v)}
              className="flex items-center gap-1.5 px-3 py-2 bg-surface-card rounded-card text-caption text-ink-secondary"
            >
              <Plus size={14} className="text-brand-orange" />添加文件
            </button>
            <button
              onClick={() => addReference('Q3 周报.docx')}
              className="flex items-center gap-1.5 px-3 py-2 bg-surface-card rounded-card text-caption text-ink-secondary"
            >
              <span className="text-sm">📄</span> Q3 周报.docx
            </button>
            <button
              onClick={() => addReference('语音录音 · 32分钟')}
              className="flex items-center gap-1.5 px-3 py-2 bg-surface-card rounded-card text-caption text-ink-secondary"
            >
              <Mic size={14} className="text-brand-orange" />语音录音 · 32分钟
            </button>
          </div>

          {showReferencePicker && (
            <div className="mt-2 p-2 bg-white border border-line-base rounded-card shadow-card space-y-1">
              {REFERENCE_OPTIONS.map(name => (
                <button
                  key={name}
                  onClick={() => addReference(name)}
                  className="w-full text-left px-3 py-2 rounded-card text-caption text-ink-secondary active:bg-surface-card"
                >
                  {name}
                </button>
              ))}
            </div>
          )}

          {references.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {references.map(name => (
                <span key={name} className="px-2.5 py-1 bg-brand-orange-light text-brand-orange rounded-pill text-micro">
                  {name}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Templates */}
        <div>
          <p className="text-caption text-ink-secondary mb-3">模板</p>
          <div className="grid grid-cols-4 gap-2">
            {TEMPLATES.map(({ icon, label }) => (
              <button key={label} onClick={() => setSelectedTemplate(label)}
                className={`flex flex-col items-center gap-1.5 py-3 rounded-card border transition-colors ${
                  selectedTemplate === label ? 'border-brand-orange bg-brand-orange-light' : 'border-line-base bg-surface-card'
                }`}>
                <span className="text-xl">{icon}</span>
                <p className="text-micro text-ink-secondary">{label}</p>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={!input.trim()}
          className="w-full flex items-center justify-center gap-2 py-4 bg-brand-orange text-white rounded-btn text-body font-medium disabled:opacity-40"
        >
          开始生成 →
        </button>
      </div>
    </PageLayout>
  )
}
