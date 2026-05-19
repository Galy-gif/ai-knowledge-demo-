import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'

export interface UserSkill {
  id: string
  name: string
  desc: string
  meta: string
  placeholder: string
  prompt?: string
  kbNames?: string[]
}

interface SkillsContextValue {
  userSkills: UserSkill[]
  addUserSkill: (skill: Omit<UserSkill, 'id' | 'meta' | 'placeholder'> & { meta?: string; placeholder?: string }) => void
  aiSuggestionDismissed: boolean
  dismissAiSuggestion: () => void
}

const SkillsContext = createContext<SkillsContextValue | null>(null)

const DEFAULT_USER_SKILL_PLACEHOLDER = '粘贴或输入要处理的内容…'

const INITIAL_USER_SKILLS: UserSkill[] = [
  {
    id: 'us_meeting_jira',
    name: '会议纪要 → JIRA 任务',
    desc: '把会议讨论转成结构化任务列表',
    meta: '已使用 23 次',
    placeholder: '粘贴会议纪要…',
  },
  {
    id: 'us_competitor_table',
    name: '竞品功能对比表',
    desc: '提取竞品功能并输出对比表格',
    meta: '已使用 8 次 · 关联 AI 浏览器项目库',
    placeholder: '输入要对比的竞品…',
  },
  {
    id: 'us_weekly_report',
    name: '周报输出格式',
    desc: '按本周完成/下周计划/风险三段输出',
    meta: '已使用 41 次',
    placeholder: '粘贴本周工作要点…',
  },
]

export function SkillsProvider({ children }: { children: ReactNode }) {
  const [userSkills, setUserSkills] = useState<UserSkill[]>(INITIAL_USER_SKILLS)
  const [aiSuggestionDismissed, setAiSuggestionDismissed] = useState(false)

  const addUserSkill = useCallback((payload: Omit<UserSkill, 'id' | 'meta' | 'placeholder'> & { meta?: string; placeholder?: string }) => {
    setUserSkills(prev => [
      {
        id: `us_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        name: payload.name,
        desc: payload.desc,
        meta: payload.meta ?? '刚刚保存 · 0 次使用',
        placeholder: payload.placeholder ?? DEFAULT_USER_SKILL_PLACEHOLDER,
        prompt: payload.prompt,
        kbNames: payload.kbNames,
      },
      ...prev,
    ])
  }, [])

  const dismissAiSuggestion = useCallback(() => setAiSuggestionDismissed(true), [])

  const value = useMemo(
    () => ({ userSkills, addUserSkill, aiSuggestionDismissed, dismissAiSuggestion }),
    [userSkills, addUserSkill, aiSuggestionDismissed, dismissAiSuggestion],
  )

  return <SkillsContext.Provider value={value}>{children}</SkillsContext.Provider>
}

export function useSkills() {
  const ctx = useContext(SkillsContext)
  if (!ctx) throw new Error('useSkills must be used within SkillsProvider')
  return ctx
}
