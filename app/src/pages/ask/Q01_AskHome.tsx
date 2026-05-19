import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AtSign,
  Bolt,
  Check,
  ChevronDown,
  ChevronRight,
  FileText,
  Image,
  Mic,
  RefreshCw,
  Search,
  Send,
  Sparkles,
  X,
  Zap,
} from 'lucide-react'
import TabLayout from '../../components/layout/TabLayout'
import Q02_SkillsSheet from './Q02_SkillsSheet'
import { PRESET_SKILLS, type MagicAction } from '../../mock/skills'
import { useUser } from '../../context/UserContext'
import { useKnowledge } from '../../context/KnowledgeContext'
import { useSkills } from '../../context/SkillsContext'
import { pwaTemplates, type PwaTemplate } from '../../mock/pwaTemplates'

type AskMode = 'ai' | 'web' | 'task'

const MODE_META: Record<AskMode, {
  label: string
  desc: string
  placeholder: string
  Icon: typeof Sparkles
  suggestions: string[]
}> = {
  ai: {
    label: 'AI 问答',
    desc: '用知识库和 AI 帮你回答问题',
    placeholder: '输入你的问题或内容…',
    Icon: Sparkles,
    suggestions: [
      '如何在知识库中快速找到历史决策？',
      '帮我总结今天工作资料里的关键信息',
      '分析竞品报告里最值得关注的3个点',
    ],
  },
  web: {
    label: '网页搜索',
    desc: '在网页上找最新信息',
    placeholder: '搜索网页...',
    Icon: Search,
    suggestions: [
      '搜索 AI 知识库产品的最新趋势',
      '查找知识管理工具的竞品动态',
      '帮我整理公开资料里的增长案例',
    ],
  },
  task: {
    label: '任务模式',
    desc: '一句话生成桌面轻应用',
    placeholder: '描述一个想要的轻应用...',
    Icon: Zap,
    suggestions: [
      '帮我做一个竞品数据速查工具',
      '生成一个知识库周报自动生成器',
      '做一个用户访谈问题生成器',
    ],
  },
}

const SUGGESTION_ICONS = [Sparkles, Search, FileText]
const MODE_ORDER: AskMode[] = ['ai', 'web', 'task']

const DEFAULT_HOME_TEMPLATE_IDS = ['diet-log', 'fitness-planner', 'fund-portfolio', 'travel-plan']

const TEMPLATE_TONES: Record<PwaTemplate['category'], { bg: string; color: string }> = {
  财经: { bg: '#DBEAFE', color: '#0C447C' },
  健康: { bg: '#D1FAE5', color: '#0F6E56' },
  职场: { bg: '#E9D5FF', color: '#3C3489' },
  教育: { bg: '#FEF3C7', color: '#7C4D00' },
  生活: { bg: '#FED7AA', color: '#993C1D' },
}

const TEMPLATE_ID_TONES: Record<string, { bg: string; color: string }> = {
  'diet-log': { bg: '#D1FAE5', color: '#0F6E56' },
  'fitness-planner': { bg: '#DBEAFE', color: '#0C447C' },
  'fund-portfolio': { bg: '#FEF3C7', color: '#7C4D00' },
  'travel-plan': { bg: '#CCFBF1', color: '#0F766E' },
}

function getDefaultHomeTemplates() {
  return DEFAULT_HOME_TEMPLATE_IDS
    .map(id => pwaTemplates.find(template => template.id === id))
    .filter((template): template is PwaTemplate => Boolean(template))
}

function pickFourTemplates() {
  return [...pwaTemplates]
    .sort(() => Math.random() - 0.5)
    .slice(0, 4)
}

function getTemplateTone(template: PwaTemplate) {
  if (TEMPLATE_ID_TONES[template.id]) return TEMPLATE_ID_TONES[template.id]
  return TEMPLATE_TONES[template.category]
}

export default function Q01_AskHome() {
  const navigate = useNavigate()
  const { showToast } = useUser()
  const { bases, subscribedBases, askSelectedBaseIds, setAskSelectedBaseIds } = useKnowledge()
  const { userSkills } = useSkills()
  const [mode, setMode] = useState<AskMode>('ai')
  const [input, setInput] = useState('')
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null)
  const [showSkills, setShowSkills] = useState(false)
  const [showModeMenu, setShowModeMenu] = useState(false)
  const [homeTemplates, setHomeTemplates] = useState<PwaTemplate[]>(() => getDefaultHomeTemplates())
  const [refreshingTemplates, setRefreshingTemplates] = useState(false)
  const featuredSuggestions = MODE_META[mode].suggestions
  const CurrentModeIcon = MODE_META[mode].Icon
  const allBases = [...bases, ...subscribedBases]
  const askSelectedBases = allBases.filter(kb => askSelectedBaseIds.includes(kb.id))
  const kbSlotLabel = askSelectedBases.length === 0
    ? ''
    : askSelectedBases.length === 1
      ? askSelectedBases[0].name
      : `${askSelectedBases[0].name} +${askSelectedBases.length - 1}`
  const selectedSkill = useMemo<MagicAction | null>(() => {
    if (!selectedSkillId) return null
    const preset = PRESET_SKILLS.find(s => s.id === selectedSkillId)
    if (preset) return preset
    const mine = userSkills.find(s => s.id === selectedSkillId)
    if (!mine) return null
    return {
      id: mine.id,
      name: mine.name,
      desc: mine.desc,
      placeholder: mine.placeholder,
      type: 'mine',
    }
  }, [selectedSkillId, userSkills])
  const inputPlaceholder = (mode === 'ai' && selectedSkill?.placeholder) || MODE_META[mode].placeholder

  const submitQuery = (rawText: string) => {
    const text = rawText.trim()
    const selectedKbNames = askSelectedBases.map(kb => kb.name)
    const contextState = { selectedKbIds: askSelectedBaseIds, selectedKbNames }
    if (!text) return
    if (mode === 'ai') navigate('/ask/answer', { state: { question: text, ...contextState } })
    else if (mode === 'web') navigate('/ask/web-search', { state: { query: text, ...contextState } })
    else navigate('/ask/task-mode', { state: { requirement: text, ...contextState } })
  }

  const openTemplateConfirm = (template: PwaTemplate) => {
    const selectedKbNames = askSelectedBases.map(kb => kb.name)
    navigate('/pwa/confirm', {
      state: {
        requirement: template.requirement,
        templateId: template.id,
        templateName: template.name,
        templateIcon: template.icon,
        templateCoreFeatures: template.coreFeatures,
        targetRuntimeType: template.targetRuntimeType,
        resultAppName: template.resultAppName,
        resultAppId: template.resultAppId,
        resultMainColor: template.resultMainColor,
        fromSource: 'q01_template_grid',
        selectedKbIds: askSelectedBaseIds,
        selectedKbNames,
      },
    })
  }

  const refreshTemplates = () => {
    setRefreshingTemplates(true)
    window.setTimeout(() => {
      setHomeTemplates(pickFourTemplates())
    }, 150)
    window.setTimeout(() => {
      setRefreshingTemplates(false)
    }, 300)
  }

  const handleSend = () => {
    submitQuery(input)
  }

  const handleMagicAction = (action: MagicAction) => {
    setSelectedSkillId(action.id)
    setShowSkills(false)
  }

  const handleModeChange = (nextMode: AskMode) => {
    setShowModeMenu(false)
    if (nextMode === mode) return
    setMode(nextMode)
    if (nextMode !== 'ai' && selectedSkillId) {
      setSelectedSkillId(null)
      showToast(`已清除妙招，${MODE_META[nextMode].label}下不可用`)
    }
  }

  const handleSkillButtonClick = () => {
    if (mode !== 'ai') {
      setMode('ai')
      showToast('已切换到 AI 问答模式')
    }
    setShowSkills(true)
  }

  const clearSkill = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation()
    setSelectedSkillId(null)
  }

  const clearKb = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation()
    setAskSelectedBaseIds([])
  }

  return (
    <TabLayout>
      <div className="flex flex-col h-full bg-white relative overflow-hidden">
        {showModeMenu && (
          <button
            aria-label="关闭模式菜单"
            className="absolute inset-0 z-20 cursor-default"
            onClick={() => setShowModeMenu(false)}
          />
        )}
        <div className="relative z-10 flex-1 min-h-0 overflow-y-auto scrollbar-hide px-5">
          {/* Hero */}
          <div className="pt-20 pb-9 text-center">
            <div className="relative inline-block">
              <h1
                className="text-[56px] leading-none font-medium text-[#FF7A00]"
                style={{
                  letterSpacing: '-1px',
                  fontFamily: '-apple-system, "SF Pro Display", sans-serif',
                }}
              >
                Explore
              </h1>
              <span className="absolute left-full top-1 ml-1 px-1.5 py-0.5 rounded-[6px] bg-[#FFF1E6] text-[11px] leading-3 font-medium text-[#FF7A00]">
                AI
              </span>
            </div>
            <p className="mt-3.5 text-[13px] leading-5 text-[#6B6B6B]">你的移动 AI 知识工作台</p>
          </div>

          {/* Suggestions */}
          <div className="mb-5">
            <p className="mb-2.5 text-[13px] leading-5 text-[#9CA3AF]">为你推荐</p>
            <div className="space-y-2">
            {featuredSuggestions.map((q, index) => {
              const Icon = SUGGESTION_ICONS[index] ?? Sparkles
              return (
              <button
                key={q}
                onClick={() => submitQuery(q)}
                className="w-full flex items-center gap-3 text-left px-3.5 py-3 bg-[#FAFAFA] rounded-[12px] active:bg-[#F5F5F5] transition-colors"
              >
                <div className="w-8 h-8 rounded-[9px] bg-[#FFF1E6] flex items-center justify-center flex-shrink-0">
                  <Icon size={15} className="text-[#FF7A00]" />
                </div>
                <p className="flex-1 min-w-0 text-[14px] leading-5 text-black truncate">{q}</p>
                <ChevronRight size={14} color="#CCCCCC" className="flex-shrink-0" />
              </button>
              )
            })}
            </div>
          </div>

          {/* PWA templates */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[14px] leading-5 font-semibold text-[#1A1A1A]">快速生成轻应用</h2>
              <div className="flex items-center gap-3">
                <button
                  onClick={refreshTemplates}
                  className="flex items-center gap-1 text-[12px] leading-4 text-[#9CA3AF]"
                >
                  <RefreshCw size={12} className={refreshingTemplates ? 'animate-[spin_300ms_linear]' : ''} />
                  <span>换一批</span>
                </button>
                <button
                  onClick={() => navigate('/pwa/templates')}
                  aria-label="查看全部轻应用模板"
                  className="flex h-5 w-5 items-center justify-center text-[#FF7A00]"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
            <div className={`grid grid-cols-2 gap-2.5 transition-opacity duration-150 ${
              refreshingTemplates ? 'opacity-0' : 'opacity-100'
            }`}>
              {homeTemplates.map(template => (
                <button
                  key={template.id}
                  type="button"
                  onClick={() => openTemplateConfirm(template)}
                  className="h-[68px] min-w-0 flex items-center gap-3 rounded-[12px] border border-[#EEEEEE] bg-white px-3 py-2.5 text-left active:bg-[#FAFAFA] transition-colors"
                >
                  <span
                    className="w-10 h-10 rounded-[10px] flex items-center justify-center text-[19px] flex-shrink-0"
                    style={{
                      backgroundColor: getTemplateTone(template).bg,
                      color: getTemplateTone(template).color,
                    }}
                  >
                    {template.icon}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[14px] leading-5 font-semibold text-[#1A1A1A]">
                      {template.name}
                    </span>
                    <span className="mt-0.5 block truncate text-[11px] leading-4 text-[#4A4A4A]">
                      {template.description}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Input area */}
        <div className="px-4 pt-2 pb-2 bg-white border-t border-line-base relative z-30">
          <div className="relative flex items-center gap-1.5 mb-2">
            <button
              type="button"
              onClick={() => setShowModeMenu(v => !v)}
              className="flex items-center gap-1.5 px-[10px] py-[5px] bg-[#F5F5F5] rounded-full text-[12px] leading-4 text-black min-w-0"
            >
              <CurrentModeIcon size={13} className="text-[#FF7A00] flex-shrink-0" />
              <span className="font-medium whitespace-nowrap">{MODE_META[mode].label}</span>
              <ChevronDown size={12} className="text-ink-placeholder flex-shrink-0" />
            </button>
            {showModeMenu && (
              <div className="absolute left-0 bottom-full mb-3 w-[280px] rounded-[12px] border border-[#EEEEEE] bg-white shadow-[0_4px_16px_rgba(0,0,0,0.08)] z-50 overflow-visible">
                <span className="absolute left-8 -bottom-[6px] h-3 w-3 rotate-45 border-b border-r border-[#EEEEEE] bg-white" />
                {MODE_ORDER.map(item => {
                  const meta = MODE_META[item]
                  const Icon = meta.Icon
                  const selected = item === mode
                  return (
                    <button
                      type="button"
                      key={item}
                      onClick={() => handleModeChange(item)}
                      className="relative z-10 flex h-16 w-full items-center gap-3 px-4 text-left first:rounded-t-[12px] last:rounded-b-[12px] active:bg-[#FAFAFA]"
                    >
                      <Icon size={18} className={selected ? 'text-[#FF7A00]' : 'text-[#9CA3AF]'} />
                      <div className="flex-1 min-w-0">
                        <p className="text-[14px] leading-5 font-semibold text-[#1A1A1A]">{meta.label}</p>
                        <p className="mt-0.5 truncate text-[12px] leading-4 text-[#4A4A4A]">{meta.desc}</p>
                      </div>
                      {selected && <Check size={17} className="text-[#FF7A00] flex-shrink-0" />}
                    </button>
                  )
                })}
              </div>
            )}
            {selectedSkill ? (
              <div
                role="button"
                tabIndex={0}
                aria-label={`妙招：${selectedSkill.name}（点击更换，点击 × 清除）`}
                onClick={handleSkillButtonClick}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleSkillButtonClick() } }}
                className="flex items-center gap-1 rounded-full cursor-pointer select-none"
                style={{
                  backgroundColor: '#FFF1E6',
                  border: '0.5px solid #FFE4D0',
                  padding: '5px 6px 5px 10px',
                  maxWidth: 130,
                  minWidth: 0,
                }}
              >
                <Bolt size={11} className="text-[#FF7A00]" style={{ flexShrink: 0 }} />
                <span
                  style={{
                    fontSize: 11,
                    lineHeight: '14px',
                    fontWeight: 500,
                    color: '#FF7A00',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    minWidth: 0,
                  }}
                >
                  {selectedSkill.name}
                </span>
                <span
                  role="button"
                  tabIndex={0}
                  aria-label="清除妙招"
                  onClick={clearSkill}
                  onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') clearSkill(e) }}
                  style={{
                    flexShrink: 0,
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                    backgroundColor: '#FFFFFF',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <X size={9} className="text-[#FF7A00]" />
                </span>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleSkillButtonClick}
                className="flex items-center gap-1.5 rounded-full"
                style={{ backgroundColor: '#F8F8F8', padding: '5px 10px' }}
              >
                <Bolt size={11} className="text-[#FF7A00]" />
                <span style={{ fontSize: 11, lineHeight: '14px', color: '#4A4A4A' }}>妙招</span>
              </button>
            )}
            {kbSlotLabel ? (
              <div
                role="button"
                tabIndex={0}
                aria-label={`知识库：${kbSlotLabel}（点击修改，点击 × 清除）`}
                onClick={() => navigate('/ask/select-kb')}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate('/ask/select-kb') } }}
                className="flex items-center gap-1 rounded-full cursor-pointer select-none"
                style={{
                  backgroundColor: '#F5F5F5',
                  border: '0.5px solid #EEEEEE',
                  padding: '5px 6px 5px 10px',
                  maxWidth: 130,
                  minWidth: 0,
                }}
              >
                <AtSign size={11} className="text-[#4A4A4A]" style={{ flexShrink: 0 }} />
                <span
                  style={{
                    fontSize: 11,
                    lineHeight: '14px',
                    fontWeight: 500,
                    color: '#4A4A4A',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    minWidth: 0,
                  }}
                >
                  {kbSlotLabel}
                </span>
                <span
                  role="button"
                  tabIndex={0}
                  aria-label="清除知识库"
                  onClick={clearKb}
                  onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') clearKb(e) }}
                  style={{
                    flexShrink: 0,
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                    backgroundColor: '#FFFFFF',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <X size={9} className="text-[#9CA3AF]" />
                </span>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => navigate('/ask/select-kb')}
                className="flex items-center gap-1.5 rounded-full"
                style={{ backgroundColor: '#F8F8F8', padding: '5px 10px' }}
              >
                <AtSign size={11} className="text-[#4A4A4A]" />
                <span style={{ fontSize: 11, lineHeight: '14px', color: '#4A4A4A' }}>知识库</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="flex-1 h-10 bg-[#F5F5F5] rounded-full px-4 flex items-center gap-2">
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder={inputPlaceholder}
                className="flex-1 h-5 bg-transparent resize-none text-[14px] leading-5 text-ink-primary outline-none placeholder:text-[#9CA3AF] overflow-hidden"
                rows={1}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
              />
              <div className="flex gap-2 items-center">
                <button
                  type="button"
                  onClick={() => showToast('语音 / 图片输入功能即将上线')}
                  title="语音输入"
                >
                  <Mic size={17} className="text-ink-placeholder" />
                </button>
                <button
                  type="button"
                  onClick={() => showToast('语音 / 图片输入功能即将上线')}
                  title="图片输入"
                >
                  <Image size={17} className="text-ink-placeholder" />
                </button>
              </div>
            </div>
            <button
              type="button"
              onClick={handleSend}
              className="w-10 h-10 rounded-full bg-[#FF7A00] flex items-center justify-center flex-shrink-0 active:scale-95 transition-transform"
            >
              <Send size={17} className="text-white" />
            </button>
          </div>
        </div>

        <Q02_SkillsSheet
          open={showSkills}
          onClose={() => setShowSkills(false)}
          onMagicApply={handleMagicAction}
        />
      </div>
    </TabLayout>
  )
}
