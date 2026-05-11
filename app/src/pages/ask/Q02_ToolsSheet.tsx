import {
  ChevronLeft,
  ChevronRight,
  Code2,
  FileText,
  Globe,
  ListChecks,
  PenLine,
  Sparkles,
  type LucideIcon,
} from 'lucide-react'
import BottomSheet from '../../components/ui/BottomSheet'

export type ToolMode = 'ai' | 'web' | 'task'

export interface MagicAction {
  label: string
  desc: string
  prompt: string
  Icon: LucideIcon
}

interface MagicGroup {
  title: string
  actions: MagicAction[]
}

const MODE_ACTIONS: Array<{
  mode: ToolMode
  label: string
  desc: string
  Icon: LucideIcon
}> = [
  { mode: 'ai', label: 'AI 问答', desc: '基于知识库和上下文回答', Icon: Sparkles },
  { mode: 'web', label: '网页搜索', desc: '搜索公开网页并整理来源', Icon: Globe },
  { mode: 'task', label: '任务模式', desc: '描述需求并生成轻应用', Icon: ListChecks },
]

const MAGIC_GROUPS: MagicGroup[] = [
  {
    title: '快速处理',
    actions: [
      {
        label: '总结',
        desc: '把长内容压缩成要点',
        prompt: '请帮我总结下面这段内容，输出 5 个关键要点：',
        Icon: Sparkles,
      },
      {
        label: '翻译',
        desc: '保留语气的中英互译',
        prompt: '请将下面内容翻译成自然、专业的英文：',
        Icon: Globe,
      },
      {
        label: '润色',
        desc: '让表达更清晰克制',
        prompt: '请帮我润色下面这段文字，保持原意但让表达更清晰：',
        Icon: PenLine,
      },
      {
        label: '续写',
        desc: '顺着已有思路补下一段',
        prompt: '请基于下面内容继续写，保持同样的语气和结构：',
        Icon: FileText,
      },
    ],
  },
  {
    title: '结构化输出',
    actions: [
      {
        label: '提取待办',
        desc: '变成可执行清单',
        prompt: '请从下面内容里提取待办事项，按负责人、截止时间、优先级整理：',
        Icon: ListChecks,
      },
      {
        label: '对比表',
        desc: '整理成维度对照',
        prompt: '请把下面主题整理成对比表，包含关键维度、优缺点和适用场景：',
        Icon: FileText,
      },
      {
        label: '代码解释',
        desc: '拆解逻辑与风险点',
        prompt: '请解释下面这段代码的核心逻辑，并指出潜在问题：',
        Icon: Code2,
      },
    ],
  },
]

export default function Q02_ToolsSheet({
  open,
  activeMode,
  onClose,
  onModeChange,
  onMagicApply,
}: {
  open: boolean
  activeMode: ToolMode
  onClose: () => void
  onModeChange: (mode: ToolMode) => void
  onMagicApply: (action: MagicAction) => void
}) {
  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title="工具"
      fullHeight
      headerLeft={
        <button
          onClick={onClose}
          aria-label="返回"
          className="p-1 text-ink-secondary"
        >
          <ChevronLeft size={24} />
        </button>
      }
    >
      <div className="px-5 py-3 space-y-5">
        <section>
          <div className="flex items-center justify-between mb-2">
            <p className="text-caption text-ink-placeholder">模式</p>
            <p className="text-micro text-ink-placeholder">发送前可随时切换</p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {MODE_ACTIONS.map(({ mode, label, desc, Icon }) => {
              const selected = activeMode === mode
              return (
                <button
                  key={mode}
                  onClick={() => onModeChange(mode)}
                  className={`min-h-[104px] p-3 rounded-card border text-left transition-colors ${
                    selected
                      ? 'bg-brand-orange-light border-brand-orange text-brand-orange'
                      : 'bg-surface-card border-line-base text-ink-secondary active:bg-white'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-card bg-white border flex items-center justify-center mb-2 ${
                    selected ? 'border-brand-orange/30' : 'border-line-base'
                  }`}>
                    <Icon size={17} className={selected ? 'text-brand-orange' : 'text-ink-secondary'} />
                  </div>
                  <p className={`text-caption font-semibold ${selected ? 'text-brand-orange' : 'text-ink-primary'}`}>
                    {label}
                  </p>
                  <p className="text-micro text-ink-placeholder leading-snug mt-1 line-clamp-2">{desc}</p>
                </button>
              )
            })}
          </div>
        </section>

        {MAGIC_GROUPS.map(group => (
          <section key={group.title}>
            <p className="text-caption text-ink-placeholder mb-2">{group.title}</p>
            <div className="grid grid-cols-1 gap-2">
              {group.actions.map(action => {
                const { Icon } = action
                return (
                  <button
                    key={action.label}
                    onClick={() => onMagicApply(action)}
                    className="w-full flex items-center gap-3 p-3.5 bg-surface-card rounded-card border border-line-base text-left active:bg-white transition-colors"
                  >
                    <div className="w-10 h-10 rounded-card bg-white border border-line-base flex items-center justify-center flex-shrink-0">
                      <Icon size={18} className="text-brand-orange" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-card-title text-ink-primary">{action.label}</p>
                      <p className="text-caption text-ink-placeholder mt-0.5">{action.desc}</p>
                    </div>
                    <ChevronRight size={16} className="text-ink-placeholder flex-shrink-0" />
                  </button>
                )
              })}
            </div>
          </section>
        ))}
      </div>
    </BottomSheet>
  )
}
