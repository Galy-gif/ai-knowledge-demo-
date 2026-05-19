import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, MoreHorizontal, Plus, Sparkles } from 'lucide-react'
import { useUser } from '../../context/UserContext'
import { useSkills } from '../../context/SkillsContext'
import { PRESET_SKILLS, type MagicAction } from '../../mock/skills'

export default function Q02_SkillsSheet({
  open,
  onClose,
  onMagicApply,
}: {
  open: boolean
  onClose: () => void
  onMagicApply: (action: MagicAction) => void
}) {
  const navigate = useNavigate()
  const { showToast } = useUser()
  const { userSkills, aiSuggestionDismissed, dismissAiSuggestion } = useSkills()

  if (!open) return null

  return (
    <div className="absolute inset-0 z-40 flex flex-col justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-t-card-xl shadow-sheet flex flex-col h-[88%] max-h-[88%]">
        <div className="flex items-center justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1 bg-ink-placeholder/40 rounded-pill" />
        </div>

        {/* Header */}
        <div className="h-12 flex items-center px-4 border-b border-line-base flex-shrink-0">
          <button onClick={onClose} aria-label="返回" className="p-1 -ml-1 text-ink-secondary">
            <ChevronLeft size={22} />
          </button>
          <span className="ml-2 text-[16px] leading-6 font-semibold text-ink-primary">妙招</span>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide">
          {/* AI suggestion banner */}
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
                <span style={{ fontSize: 11, fontWeight: 500, color: '#FF7A00' }}>
                  AI 发现一个工作模式
                </span>
              </div>
              <p style={{ fontSize: 11, lineHeight: 1.55, color: '#4A4A4A', marginBottom: 10 }}>
                你最近 5 次都在「用户访谈库」做相似的结构化整理，是否保存为妙招？
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button
                  type="button"
                  onClick={() => navigate('/skill/from-ai')}
                  style={{
                    flex: 1,
                    backgroundColor: '#FF7A00',
                    color: '#FFFFFF',
                    fontSize: 11,
                    fontWeight: 500,
                    padding: '7px 0',
                    borderRadius: 8,
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  查看 →
                </button>
                <button
                  type="button"
                  onClick={dismissAiSuggestion}
                  style={{
                    backgroundColor: 'transparent',
                    color: '#9CA3AF',
                    fontSize: 11,
                    padding: '7px 12px',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  忽略
                </button>
              </div>
            </div>
          )}

          {/* Recommended */}
          <section style={{ padding: '0 14px', marginTop: aiSuggestionDismissed ? 16 : 0 }}>
            <p style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 8 }}>推荐</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {PRESET_SKILLS.map(action => (
                <button
                  key={action.id}
                  type="button"
                  onClick={() => onMagicApply(action)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    backgroundColor: '#F8F8F8',
                    borderRadius: 10,
                    padding: '11px 12px',
                    width: '100%',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 12, fontWeight: 500, color: '#1A1A1A', marginBottom: 2 }}>
                      {action.name}
                    </p>
                    <p style={{ fontSize: 10, color: '#9CA3AF' }}>{action.desc}</p>
                  </div>
                  <ChevronRight size={13} color="#9CA3AF" style={{ flexShrink: 0 }} />
                </button>
              ))}
            </div>
          </section>

          {/* My skills */}
          <section style={{ padding: '0 14px', marginTop: 18, paddingBottom: 16 }}>
            <p style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 8 }}>我的妙招</p>
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
                    padding: '11px 12px',
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
                    <p style={{ fontSize: 12, fontWeight: 500, color: '#1A1A1A', marginBottom: 2 }}>
                      {skill.name}
                    </p>
                    <p style={{ fontSize: 10, color: '#9CA3AF', marginBottom: 3 }}>{skill.desc}</p>
                    <p style={{ fontSize: 10, color: '#9CA3AF' }}>{skill.meta}</p>
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
                    <MoreHorizontal size={13} color="#9CA3AF" />
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '12px 14px',
            borderTop: '0.5px solid #EEEEEE',
            flexShrink: 0,
          }}
        >
          <button
            type="button"
            onClick={() => navigate('/skill/create')}
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
      </div>
    </div>
  )
}
