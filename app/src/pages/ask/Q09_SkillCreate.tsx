import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react'
import Toast from '../../components/common/Toast'
import { useUser } from '../../context/UserContext'
import { useSkills } from '../../context/SkillsContext'

const OPTIMIZED_PROMPT_EXAMPLE =
  '你是资深内容编辑。读完输入文本后，按以下结构整理：\n1. 核心结论：一句话概括，不超过 30 字\n2. 关键要点：3-5 条，每条 ≤ 25 字，附原文位置\n3. 行动建议：2-3 条可执行操作\n注意保留原文中的数字、人名、专有名词。'

export default function Q09_SkillCreate() {
  const navigate = useNavigate()
  const { showToast } = useUser()
  const { addUserSkill } = useSkills()

  const [name, setName] = useState('')
  const [desc, setDesc] = useState('')
  const [prompt, setPrompt] = useState('')
  const [optimized, setOptimized] = useState(false)
  const [kbs] = useState<string[]>([])

  const canSave = name.trim().length > 0 && desc.trim().length > 0 && prompt.trim().length > 0

  const handleOptimize = () => {
    setPrompt(OPTIMIZED_PROMPT_EXAMPLE)
    setOptimized(true)
    showToast('AI 优化完成')
  }

  const handleSave = () => {
    if (!canSave) return
    addUserSkill({
      name: name.trim(),
      desc: desc.trim(),
      prompt,
      kbNames: kbs.length > 0 ? kbs : undefined,
    })
    showToast('已保存妙招')
    setTimeout(() => navigate('/ask', { state: { reopenSkills: true } }), 450)
  }

  return (
    <div className="flex flex-col h-full relative bg-white">
      <div className="h-14 flex items-center px-4 bg-white border-b border-line-base flex-shrink-0">
        <button onClick={() => navigate(-1)} className="p-1 -ml-1 mr-2 text-ink-secondary">
          <ChevronLeft size={24} />
        </button>
        <span className="flex-1 text-h2 text-ink-primary truncate">创建妙招</span>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide" style={{ padding: '20px 16px 16px' }}>
        <Field label="妙招名字">
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="给这个妙招起个名字"
            style={inputStyle}
          />
        </Field>

        <Field label="描述">
          <input
            value={desc}
            onChange={e => setDesc(e.target.value)}
            placeholder="一句话说明用途"
            style={inputStyle}
          />
        </Field>

        <Field label="我想让 AI 做什么">
          <div style={{ position: 'relative' }}>
            <textarea
              value={prompt}
              onChange={e => {
                setPrompt(e.target.value)
                if (optimized) setOptimized(false)
              }}
              rows={6}
              placeholder="用大白话描述想让 AI 做什么，比如：把长文整理成会议纪要"
              style={{
                ...inputStyle,
                fontSize: 11,
                color: '#4A4A4A',
                lineHeight: 1.6,
                resize: 'none',
                paddingBottom: 44,
              }}
            />
            <button
              type="button"
              onClick={handleOptimize}
              disabled={optimized}
              style={{
                position: 'absolute',
                right: 10,
                bottom: 10,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 3,
                padding: '5px 10px',
                backgroundColor: optimized ? '#FFF1E6' : '#FFFFFF',
                border: '1px solid #FFE4D0',
                borderRadius: 999,
                cursor: optimized ? 'default' : 'pointer',
              }}
            >
              <Sparkles size={10} color="#FF7A00" />
              <span style={{ fontSize: 10, fontWeight: 500, color: '#FF7A00' }}>
                {optimized ? '已 AI 优化' : 'AI 优化'}
              </span>
            </button>
          </div>
        </Field>

        <Field label="关联知识库（可选）">
          <button
            type="button"
            onClick={() => showToast('知识库多选（mock）')}
            style={{
              ...inputStyle,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            <span style={{ flex: 1, fontSize: 11, color: '#9CA3AF' }}>
              {kbs.length > 0 ? kbs.join('、') : '选择一个或多个知识库'}
            </span>
            <ChevronRight size={13} color="#9CA3AF" style={{ flexShrink: 0 }} />
          </button>
        </Field>
      </div>

      <div
        style={{
          flexShrink: 0,
          padding: '12px 14px',
          borderTop: '0.5px solid #EEEEEE',
          backgroundColor: '#FFFFFF',
        }}
      >
        <button
          type="button"
          onClick={handleSave}
          disabled={!canSave}
          style={{
            width: '100%',
            backgroundColor: canSave ? '#FF7A00' : '#FFD4B0',
            color: '#FFFFFF',
            padding: '11px 0',
            borderRadius: 10,
            fontSize: 12,
            fontWeight: 500,
            border: 'none',
            cursor: canSave ? 'pointer' : 'default',
          }}
        >
          保存妙招
        </button>
      </div>

      <Toast />
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  backgroundColor: '#F8F8F8',
  borderRadius: 8,
  padding: '10px 12px',
  fontSize: 12,
  color: '#1A1A1A',
  border: 'none',
  outline: 'none',
  boxSizing: 'border-box',
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <p style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 6 }}>{label}</p>
      {children}
    </div>
  )
}
