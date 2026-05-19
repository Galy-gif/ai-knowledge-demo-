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
    id: 'skill_translate',
    name: '翻译',
    desc: '保留语气的中英互译',
    placeholder: '粘贴或输入要翻译的内容…',
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
    id: 'skill_polish',
    name: '润色',
    desc: '让表达更清晰克制',
    placeholder: '粘贴或输入要润色的内容…',
    type: 'preset',
  },
  {
    id: 'skill_summary',
    name: '总结',
    desc: '把长内容压缩成要点',
    placeholder: '粘贴或输入要总结的内容…',
    type: 'preset',
  },
]
