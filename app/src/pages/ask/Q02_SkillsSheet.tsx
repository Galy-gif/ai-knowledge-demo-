import { useEffect, useState, type CSSProperties, type ReactNode } from 'react'
import { ChevronLeft, ChevronRight, MoreHorizontal, Plus, Sparkles } from 'lucide-react'
import { useUser } from '../../context/UserContext'
import { useSkills } from '../../context/SkillsContext'
import { PRESET_SKILLS, type MagicAction } from '../../mock/skills'

type SkillsSheetView = 'list' | 'create' | 'fromAI'

const SECTION_TITLE_STYLE: CSSProperties = {
  fontSize: 12,
  color: '#9CA3AF',
  marginBottom: 10,
}

const SKILL_CARD_STYLE: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  backgroundColor: '#F8F8F8',
  borderRadius: 10,
  padding: '12px 14px',
  width: '100%',
  border: 'none',
  textAlign: 'left',
  cursor: 'pointer',
}

const SKILL_NAME_STYLE: CSSProperties = {
  fontSize: 14,
  fontWeight: 500,
  color: '#1A1A1A',
  marginBottom: 3,
}

const SKILL_DESC_STYLE: CSSProperties = {
  fontSize: 12,
  color: '#9CA3AF',
}

const INPUT_STYLE: CSSProperties = {
  width: '100%',
  backgroundColor: '#F8F8F8',
  borderRadius: 8,
  padding: '10px 12px',
  fontSize: 13,
  color: '#1A1A1A',
  border: 'none',
  outline: 'none',
  boxSizing: 'border-box',
}

const FROM_AI_PREFILL_PROMPT =
  '你是用户研究专家。读完用户访谈记录后，按以下结构整理：1. 用户提出的具体问题 2. 用户的核心痛点 3. 用户表达的需求或期望。每条不超过 30 字，附原文位置。'

const OPTIMIZED_PROMPT_EXAMPLE =
  '你是资深内容编辑。读完输入文本后，按以下结构整理：\n1. 核心结论：一句话概括，不超过 30 字\n2. 关键要点：3-5 条，每条 ≤ 25 字，附原文位置\n3. 行动建议：2-3 条可执行操作\n注意保留原文中的数字、人名、专有名词。'

function SheetHeader({
  title,
  onBack,
  backLabel,
}: {
  title: string
  onBack: () => void
  backLabel: string
}) {
  return (
    <div className="h-12 flex items-center px-4 border-b border-line-base flex-shrink-0">
      <button onClick={onBack} aria-label={backLabel} className="p-1 -ml-1 text-ink-secondary">
        <ChevronLeft size={22} />
      </button>
      <span className="ml-2 text-[16px] leading-6 font-semibold text-ink-primary">{title}</span>
    </div>
  )
}

function Field({
  label,
  accessory,
  children,
}: {
  label: string
  accessory?: ReactNode
  children: ReactNode
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
        <span style={{ fontSize: 12, color: '#9CA3AF' }}>{label}</span>
        {accessory}
      </div>
      {children}
    </div>
  )
}

// ── ListView ─────────────────────────────────────────────────────────────────

function ListView({
  onClose,
  onMagicApply,
  goCreate,
  goFromAI,
}: {
  onClose: () => void
  onMagicApply: (action: MagicAction) => void
  goCreate: () => void
  goFromAI: () => void
}) {
  const { showToast } = useUser()
  const { userSkills, aiSuggestionDismissed, dismissAiSuggestion, addUserSkill } = useSkills()

  const handleAdopt = () => {
    addUserSkill({
      name: '用户访谈结构化整理',
      desc: '按问题/痛点/需求三类提取访谈要点',
      placeholder: '粘贴访谈记录或输入你的问题…',
      kbNames: ['用户访谈库'],
    })
    dismissAiSuggestion()
    showToast('已保存为妙招', 'success')
  }

  return (
    <>
      <SheetHeader title="妙招" backLabel="关闭" onBack={onClose} />

      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide">
        {!aiSuggestionDismissed && (
          <div
            style={{
              margin: '14px 14px 16px',
              padding: 12,
              backgroundColor: '#FFF1E6',
              border: '1px solid #FFE4D0',
              borderRadius: 12,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
              <Sparkles size={13} color="#FF7A00" />
              <span style={{ fontSize: 12, fontWeight: 500, color: '#FF7A00' }}>
                AI 发现一个工作模式
              </span>
            </div>
            <p style={{ fontSize: 12, lineHeight: 1.6, color: '#4A4A4A', marginBottom: 10 }}>
              你最近 5 次都在「用户访谈库」做相似的结构化整理，是否保存为妙招？
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <button
                type="button"
                onClick={goFromAI}
                style={{
                  backgroundColor: '#FFFFFF',
                  color: '#FF7A00',
                  border: '0.5px solid #FF7A00',
                  fontSize: 11,
                  fontWeight: 500,
                  padding: '6px 14px',
                  borderRadius: 8,
                  cursor: 'pointer',
                }}
              >
                查看
              </button>
              <button
                type="button"
                onClick={handleAdopt}
                style={{
                  backgroundColor: '#FF7A00',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: 11,
                  fontWeight: 500,
                  padding: '6px 14px',
                  borderRadius: 8,
                  cursor: 'pointer',
                }}
              >
                采用
              </button>
              <button
                type="button"
                onClick={dismissAiSuggestion}
                style={{
                  marginLeft: 'auto',
                  backgroundColor: 'transparent',
                  color: '#9CA3AF',
                  border: 'none',
                  fontSize: 11,
                  padding: '6px 10px',
                  cursor: 'pointer',
                }}
              >
                忽略
              </button>
            </div>
          </div>
        )}

        <section style={{ padding: '0 14px', marginTop: aiSuggestionDismissed ? 16 : 0 }}>
          <p style={SECTION_TITLE_STYLE}>可能需要的妙招</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {PRESET_SKILLS.map(action => (
              <button
                key={action.id}
                type="button"
                onClick={() => onMagicApply(action)}
                style={SKILL_CARD_STYLE}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={SKILL_NAME_STYLE}>{action.name}</p>
                  <p style={SKILL_DESC_STYLE}>{action.desc}</p>
                </div>
                <ChevronRight size={14} color="#9CA3AF" style={{ flexShrink: 0 }} />
              </button>
            ))}
          </div>
        </section>

        <section style={{ padding: '0 14px', marginTop: 18, paddingBottom: 16 }}>
          <p style={SECTION_TITLE_STYLE}>我的妙招</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {userSkills.map(skill => (
              <div
                key={skill.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 10,
                  backgroundColor: '#F8F8F8',
                  borderRadius: 10,
                  padding: '12px 14px',
                }}
              >
                <button
                  type="button"
                  onClick={() => onMagicApply({
                    id: skill.id,
                    name: skill.name,
                    desc: skill.desc,
                    placeholder: skill.placeholder,
                    type: 'mine',
                  })}
                  style={{
                    flex: 1,
                    minWidth: 0,
                    background: 'transparent',
                    border: 'none',
                    padding: 0,
                    textAlign: 'left',
                    cursor: 'pointer',
                  }}
                >
                  <p style={SKILL_NAME_STYLE}>{skill.name}</p>
                  <p style={{ ...SKILL_DESC_STYLE, marginBottom: 3 }}>{skill.desc}</p>
                  <p style={SKILL_DESC_STYLE}>{skill.meta}</p>
                </button>
                <button
                  type="button"
                  onClick={() => showToast('使用 / 编辑 / 删除（mock）')}
                  aria-label="更多"
                  style={{
                    flexShrink: 0,
                    marginTop: 2,
                    background: 'transparent',
                    border: 'none',
                    padding: 2,
                    cursor: 'pointer',
                  }}
                >
                  <MoreHorizontal size={14} color="#9CA3AF" />
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div style={{ padding: '12px 14px', borderTop: '0.5px solid #EEEEEE', flexShrink: 0 }}>
        <button
          type="button"
          onClick={goCreate}
          style={{
            width: '100%',
            backgroundColor: '#FFF1E6',
            color: '#FF7A00',
            border: '1px dashed #FF7A00',
            padding: '10px 0',
            borderRadius: 10,
            fontSize: 12,
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 4,
            cursor: 'pointer',
          }}
        >
          <Plus size={13} color="#FF7A00" />
          创建妙招
        </button>
      </div>
    </>
  )
}

// ── CreateView ───────────────────────────────────────────────────────────────

function CreateView({ goBack }: { goBack: () => void }) {
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
    showToast('已保存', 'success')
    goBack()
  }

  return (
    <>
      <SheetHeader title="创建妙招" backLabel="返回妙招列表" onBack={goBack} />

      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide" style={{ padding: '20px 16px 16px' }}>
        <Field label="妙招名字">
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="给这个妙招起个名字"
            style={INPUT_STYLE}
          />
        </Field>

        <Field label="描述">
          <input
            value={desc}
            onChange={e => setDesc(e.target.value)}
            placeholder="一句话说明用途"
            style={INPUT_STYLE}
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
                ...INPUT_STYLE,
                fontSize: 12,
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
              <span style={{ fontSize: 11, fontWeight: 500, color: '#FF7A00' }}>
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
              ...INPUT_STYLE,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            <span style={{ flex: 1, fontSize: 12, color: '#9CA3AF' }}>
              {kbs.length > 0 ? kbs.join('、') : '选择一个或多个知识库'}
            </span>
            <ChevronRight size={13} color="#9CA3AF" style={{ flexShrink: 0 }} />
          </button>
        </Field>
      </div>

      <div style={{ flexShrink: 0, padding: '12px 14px', borderTop: '0.5px solid #EEEEEE', backgroundColor: '#FFFFFF' }}>
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
            fontSize: 13,
            fontWeight: 500,
            border: 'none',
            cursor: canSave ? 'pointer' : 'default',
          }}
        >
          保存妙招
        </button>
      </div>
    </>
  )
}

// ── FromAIView ───────────────────────────────────────────────────────────────

function FromAIView({ goBack }: { goBack: () => void }) {
  const { showToast } = useUser()
  const { addUserSkill, dismissAiSuggestion } = useSkills()
  const [name, setName] = useState('用户访谈结构化整理')
  const [desc, setDesc] = useState('按问题/痛点/需求三类提取访谈要点')
  const [prompt, setPrompt] = useState(FROM_AI_PREFILL_PROMPT)
  const [kbs] = useState<string[]>(['用户访谈库'])

  const canSave = name.trim().length > 0 && desc.trim().length > 0 && prompt.trim().length > 0

  const handleSave = () => {
    if (!canSave) return
    addUserSkill({
      name: name.trim(),
      desc: desc.trim(),
      prompt,
      kbNames: kbs,
      placeholder: '粘贴访谈记录或输入你的问题…',
    })
    dismissAiSuggestion()
    showToast('已保存', 'success')
    goBack()
  }

  return (
    <>
      <SheetHeader title="保存为妙招" backLabel="返回妙招列表" onBack={goBack} />

      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide" style={{ padding: '16px 16px 16px' }}>
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
          <p style={{ fontSize: 11, lineHeight: 1.6, color: '#4A4A4A' }}>
            AI 根据你最近的使用习惯生成，可直接保存或调整
          </p>
        </div>

        <Field label="妙招名字">
          <input value={name} onChange={e => setName(e.target.value)} style={INPUT_STYLE} />
        </Field>

        <Field label="描述">
          <input value={desc} onChange={e => setDesc(e.target.value)} style={INPUT_STYLE} />
        </Field>

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
              <span style={{ fontSize: 11, fontWeight: 500, color: '#FF7A00' }}>已 AI 优化</span>
            </span>
          }
        >
          <textarea
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            rows={6}
            style={{
              ...INPUT_STYLE,
              fontSize: 12,
              color: '#4A4A4A',
              lineHeight: 1.6,
              resize: 'none',
            }}
          />
        </Field>

        <Field label="关联知识库">
          <button
            type="button"
            onClick={() => showToast('知识库多选（mock）')}
            style={{
              ...INPUT_STYLE,
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
                    fontSize: 12,
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

      <div style={{ flexShrink: 0, padding: '12px 14px', borderTop: '0.5px solid #EEEEEE', backgroundColor: '#FFFFFF' }}>
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
            fontSize: 13,
            fontWeight: 500,
            border: 'none',
            cursor: canSave ? 'pointer' : 'default',
          }}
        >
          保存到我的妙招
        </button>
      </div>
    </>
  )
}

// ── Default export ───────────────────────────────────────────────────────────

export default function Q02_SkillsSheet({
  open,
  onClose,
  onMagicApply,
}: {
  open: boolean
  onClose: () => void
  onMagicApply: (action: MagicAction) => void
}) {
  const [view, setView] = useState<SkillsSheetView>('list')

  useEffect(() => {
    if (open) setView('list')
  }, [open])

  if (!open) return null

  return (
    <div className="absolute inset-0 z-40 flex flex-col justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-t-card-xl shadow-sheet flex flex-col h-[85%] max-h-[85%]">
        <div className="flex items-center justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1 bg-ink-placeholder/40 rounded-pill" />
        </div>

        {view === 'list' && (
          <ListView
            onClose={onClose}
            onMagicApply={onMagicApply}
            goCreate={() => setView('create')}
            goFromAI={() => setView('fromAI')}
          />
        )}
        {view === 'create' && <CreateView goBack={() => setView('list')} />}
        {view === 'fromAI' && <FromAIView goBack={() => setView('list')} />}
      </div>
    </div>
  )
}
