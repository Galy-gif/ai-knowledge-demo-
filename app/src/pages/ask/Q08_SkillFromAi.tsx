import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react'
import Toast from '../../components/common/Toast'
import { useUser } from '../../context/UserContext'
import { useSkills } from '../../context/SkillsContext'

const PREFILL_PROMPT =
  '你是用户研究专家。读完用户访谈记录后，按以下结构整理：1. 用户提出的具体问题 2. 用户的核心痛点 3. 用户表达的需求或期望。每条不超过 30 字，附原文位置。'

export default function Q08_SkillFromAi() {
  const navigate = useNavigate()
  const { showToast } = useUser()
  const { addUserSkill } = useSkills()

  const [name, setName] = useState('用户访谈结构化整理')
  const [desc, setDesc] = useState('按问题/痛点/需求三类提取访谈要点')
  const [prompt, setPrompt] = useState(PREFILL_PROMPT)
  const [kbs] = useState<string[]>(['用户访谈库'])

  const canSave = name.trim().length > 0 && desc.trim().length > 0 && prompt.trim().length > 0

  const handleSave = () => {
    if (!canSave) return
    addUserSkill({ name: name.trim(), desc: desc.trim(), prompt, kbNames: kbs })
    showToast('已保存为妙招')
    setTimeout(() => navigate('/ask', { state: { reopenSkills: true } }), 450)
  }

  return (
    <div className="flex flex-col h-full relative bg-white">
      <div className="h-14 flex items-center px-4 bg-white border-b border-line-base flex-shrink-0">
        <button onClick={() => navigate(-1)} className="p-1 -ml-1 mr-2 text-ink-secondary">
          <ChevronLeft size={24} />
        </button>
        <span className="flex-1 text-h2 text-ink-primary truncate">保存为妙招</span>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide" style={{ padding: '16px 16px 16px' }}>
        {/* AI prefill notice */}
        <div
          style={{
            backgroundColor: '#FFF1E6',
            borderRadius: 10,
            padding: '10px 12px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 8,
            marginBottom: 18,
          }}
        >
          <Sparkles size={13} color="#FF7A00" style={{ flexShrink: 0, marginTop: 2 }} />
          <p style={{ fontSize: 10, lineHeight: 1.6, color: '#4A4A4A' }}>
            AI 根据你最近的使用习惯生成，可直接保存或调整
          </p>
        </div>

        {/* Field 1: name */}
        <Field label="妙招名字">
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            style={inputStyle}
          />
        </Field>

        {/* Field 2: desc */}
        <Field label="描述">
          <input
            value={desc}
            onChange={e => setDesc(e.target.value)}
            style={inputStyle}
          />
        </Field>

        {/* Field 3: prompt */}
        <Field
          label="我想让 AI 做什么"
          accessory={
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 3,
                padding: '3px 8px',
                backgroundColor: '#FFF1E6',
                borderRadius: 999,
              }}
            >
              <Sparkles size={10} color="#FF7A00" />
              <span style={{ fontSize: 10, fontWeight: 500, color: '#FF7A00' }}>已 AI 优化</span>
            </span>
          }
        >
          <textarea
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            rows={6}
            style={{
              ...inputStyle,
              fontSize: 11,
              color: '#4A4A4A',
              lineHeight: 1.6,
              resize: 'none',
            }}
          />
        </Field>

        {/* Field 4: kb link */}
        <Field label="关联知识库">
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
            <div style={{ flex: 1, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {kbs.map(kb => (
                <span
                  key={kb}
                  style={{
                    fontSize: 11,
                    color: '#4A4A4A',
                    backgroundColor: '#FFFFFF',
                    border: '0.5px solid #EEEEEE',
                    padding: '3px 8px',
                    borderRadius: 999,
                  }}
                >
                  {kb}
                </span>
              ))}
            </div>
            <ChevronRight size={13} color="#9CA3AF" style={{ flexShrink: 0 }} />
          </button>
        </Field>
      </div>

      {/* Footer */}
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
          保存到我的妙招
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

function Field({
  label,
  accessory,
  children,
}: {
  label: string
  accessory?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 6,
        }}
      >
        <span style={{ fontSize: 11, color: '#9CA3AF' }}>{label}</span>
        {accessory}
      </div>
      {children}
    </div>
  )
}
