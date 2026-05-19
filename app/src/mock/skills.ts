export type SkillType = 'preset' | 'mine'

export interface MagicAction {
  id: string
  name: string
  desc: string
  placeholder: string
  type: SkillType
}

export const PRESET_SKILLS: MagicAction[] = [
  {
    id: 'skill_summary',
    name: '总结',
    desc: '把长内容压缩成要点',
    placeholder: '粘贴或输入要总结的内容…',
    type: 'preset',
  },
  {
    id: 'skill_related',
    name: '找相关',
    desc: '在你的知识库中找相关资料',
    placeholder: '输入你想找资料的话题…',
    type: 'preset',
  },
  {
    id: 'skill_followup',
    name: '追问 3 问',
    desc: 'AI 帮你深挖这段内容',
    placeholder: '粘贴或输入要深挖的内容…',
    type: 'preset',
  },
  {
    id: 'skill_rewrite',
    name: '改写口吻',
    desc: '给老板/客户/同事的不同版本',
    placeholder: '粘贴或输入要改写的内容…',
    type: 'preset',
  },
]
