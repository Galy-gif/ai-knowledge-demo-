/**
 * N05 笔记编辑页
 *
 * ── 接收方式（Navigation State API）──────────────────────────
 *
 * 1. 新建空白笔记
 *    navigate('/notes/edit')
 *
 * 2. AI 流式生成
 *    navigate('/notes/edit', { state: { aiGenerated: true, template: '会议纪要' } })
 *
 * 3. 编辑已有笔记
 *    navigate('/notes/edit', {
 *      state: { noteId: 'n1', prefillTitle: '标题', prefilledContent: '正文...' }
 *    })
 *
 * 4. 外部预填内容（AI 回答 → 整理为笔记、划词做笔记、网页保存等）
 *    navigate('/notes/edit', { state: { prefilledContent: '...' } })
 *    ── 或 ──
 *    // 先在 NotesContext 中写入 prefillContent，再跳转
 *    setPrefillContent('...')
 *    navigate('/notes/edit')
 *
 * ────────────────────────────────────────────────────────────
 */

import { useEffect, useState, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { MoreHorizontal, Bold, Italic, List, Link, Image, Hash, ChevronLeft, BookmarkPlus, FileOutput, Trash2, FileCode } from 'lucide-react'
import BottomSheet from '../../components/ui/BottomSheet'
import Toast from '../../components/common/Toast'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import { useNotes } from '../../context/NotesContext'
import { useUser } from '../../context/UserContext'
import { type Note } from '../../mock/data'

// ── 每个模板对应的 AI 流式生成内容 ──────────────────────────────
const TEMPLATE_TITLES: Record<string, string> = {
  '会议纪要': '会议纪要 · Q4 路线图讨论',
  '学习笔记': '学习笔记 · AI 知识管理方法论',
  '读书心得': '读书心得 · 《知识管理的艺术》',
  '项目复盘': '项目复盘 · Q3 功能迭代',
}

const AI_CONTENT = `## 背景

本次 Q4 规划会议汇聚了产品、工程、设计三个团队，重点围绕知识库 AI 能力升级与移动端体验重构两条主线进行深度讨论。会前已对 Q3 OKR 完成度做了复盘，整体达成率 78%，核心短板在检索精度。

## 核心洞察

用户在使用知识库检索时，最大的痛点不是找不到内容，而是"找到了但不确定对不对"。AI 回答缺乏可追溯的来源展示，导致用户在决策场景中不敢直接采用。

移动端首屏加载时间超过 2.5s 的用户流失率是 <1.5s 的 3.2 倍，这是 Q4 必须攻克的体验红线。

## 方案

确定 Q4 三条核心投入线，每条线配置独立 Owner 和里程碑节点：

- **AI 检索升级**：向量召回精度目标 90%+，引入混合检索策略（向量 + BM25），Owner: 工程 - 张磊
- **移动端重构**：首屏目标降至 1.5s，采用骨架屏 + 流式渲染，Owner: 设计/前端 - 李晓
- **团队协作**：支持多人共编知识库，基于 CRDT 方案，Owner: 工程 - 王强

## 风险与缓解

AI 检索升级与移动端重构存在人力竞争风险——两条线均依赖同一个工程核心团队。缓解方案是将两条线的关键节点错开两周：检索升级先行，10月底完成模型切换；移动端重构从11月初启动，避免并行压力。

## 下一步

- [ ] 完成 AI 检索技术方案评审（5月15日前，张磊负责）
- [ ] 启动移动端首屏性能基线测量（5月12日，李晓负责）
- [ ] 制定 Q4 OKR 追踪看板并同步全团队（5月18日，产品负责）`

// ── 组件 ───────────────────────────────────────────────────────
export default function N05_NoteEdit() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const { addNote, updateNote, deleteNote, prefillContent: ctxPrefill, setPrefillContent } = useNotes()
  const { showToast, showConfirm } = useUser()

  // ── 从 navigation state 读取参数 ──────────────────────────────
  const noteId: string | undefined       = state?.noteId          // 编辑模式：已有笔记 ID
  const prefillTitle: string             = state?.prefillTitle ?? ''
  // prefilledContent 是跨模块预填内容（AI 回答 / 划词 / 网页）的入口 prop
  const prefilledContent: string         = state?.prefilledContent ?? ''
  const aiGenerated: boolean             = !!state?.aiGenerated
  const template: string                 = state?.template ?? '会议纪要'

  // ── 初始值计算 ──────────────────────────────────────────────
  // 优先级：navigation state prefilledContent > NotesContext prefillContent > ''
  const initContent = prefilledContent || ctxPrefill || ''
  const initTitle   = aiGenerated
    ? (TEMPLATE_TITLES[template] ?? '会议纪要')
    : (prefillTitle || (initContent ? 'AI 回答整理' : ''))

  const [title, setTitle]           = useState(initTitle)
  const [content, setContent]       = useState(initContent)
  const [streaming, setStreaming]   = useState(false)
  const [showMoreSheet, setShowMoreSheet] = useState(false)
  const [promptKind, setPromptKind] = useState<'link' | 'image' | null>(null)
  const [promptValue, setPromptValue] = useState('')
  const idxRef = useRef(0)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const selectionRef = useRef<{ start: number; end: number } | null>(null)

  // 清理 Context 中的临时 prefillContent，避免下次打开时残留
  useEffect(() => {
    if (ctxPrefill) setPrefillContent('')
  }, [])

  // AI 流式打字
  useEffect(() => {
    if (!aiGenerated) return
    setStreaming(true)
    idxRef.current = 0
    const timer = setInterval(() => {
      idxRef.current += 4
      setContent(AI_CONTENT.slice(0, idxRef.current))
      if (idxRef.current >= AI_CONTENT.length) {
        clearInterval(timer)
        setStreaming(false)
      }
    }, 12)
    return () => clearInterval(timer)
  }, [])

  // textarea 高度自适应
  const autoResize = () => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = el.scrollHeight + 'px'
  }
  useEffect(() => { autoResize() }, [content])

  const focusTextarea = (start: number, end = start) => {
    window.setTimeout(() => {
      const el = textareaRef.current
      if (!el) return
      el.focus()
      el.setSelectionRange(start, end)
      autoResize()
    }, 0)
  }

  const getSelection = () => {
    const el = textareaRef.current
    return {
      start: el?.selectionStart ?? content.length,
      end: el?.selectionEnd ?? content.length,
    }
  }

  const replaceRange = (start: number, end: number, inserted: string, cursorStart?: number, cursorEnd?: number) => {
    const next = content.slice(0, start) + inserted + content.slice(end)
    setContent(next)
    focusTextarea(cursorStart ?? start + inserted.length, cursorEnd ?? cursorStart ?? start + inserted.length)
  }

  const wrapSelection = (before: string, after: string, placeholder: string) => {
    const { start, end } = getSelection()
    const selected = content.slice(start, end) || placeholder
    const inserted = `${before}${selected}${after}`
    const selectionStart = start + before.length
    const selectionEnd = selectionStart + selected.length
    replaceRange(start, end, inserted, selectionStart, selectionEnd)
  }

  const insertList = () => {
    const { start, end } = getSelection()
    const selected = content.slice(start, end)
    const inserted = selected
      ? selected.split('\n').map(line => line.trim().startsWith('- ') ? line : `- ${line}`).join('\n')
      : '- '
    replaceRange(start, end, inserted)
  }

  const insertHeading = () => {
    const { start, end } = getSelection()
    const selected = content.slice(start, end) || '标题'
    const prefix = start > 0 && !content.slice(0, start).endsWith('\n') ? '\n' : ''
    const inserted = `${prefix}# ${selected}`
    const selectionStart = start + prefix.length + 2
    replaceRange(start, end, inserted, selectionStart, selectionStart + selected.length)
  }

  const openUrlPrompt = (kind: 'link' | 'image') => {
    selectionRef.current = getSelection()
    setPromptValue('')
    setPromptKind(kind)
  }

  const confirmUrlInsert = () => {
    if (!promptKind || !promptValue.trim()) return
    const { start, end } = selectionRef.current ?? getSelection()
    const selected = content.slice(start, end)
    const url = promptValue.trim()
    const inserted = promptKind === 'link'
      ? `[${selected || '链接文本'}](${url})`
      : `![${selected || '图片描述'}](${url})`
    setPromptKind(null)
    setPromptValue('')
    replaceRange(start, end, inserted)
  }

  // ── 保存 ───────────────────────────────────────────────────
  const handleSave = () => {
    if (noteId) {
      // 编辑模式：更新已有笔记
      updateNote(noteId, {
        title: title || '无标题',
        content,
        updatedAt: '刚刚',
        wordCount: content.length,
      })
      showToast('笔记已更新')
    } else {
      // 新建模式：跳过空笔记
      if (!title.trim() && !content.trim()) {
        navigate('/notes')
        return
      }
      const newNote: Note = {
        id: `note_${Date.now()}`,
        title: title || '无标题',
        content,
        tags: ['AI产品'],
        createdAt: '刚刚',
        updatedAt: '刚刚',
        backlinks: [],
        wordCount: content.length,
      }
      addNote(newNote)
      showToast('笔记已保存')
    }
    navigate('/notes')
  }

  // ── 删除（需 G04 确认）─────────────────────────────────────
  const handleDelete = () => {
    setShowMoreSheet(false)
    showConfirm({
      title: '删除笔记',
      description: '删除后无法恢复，确认继续？',
      confirmText: '删除',
      danger: true,
      onConfirm: () => {
        if (noteId) deleteNote(noteId)
        showToast('笔记已删除')
        navigate('/notes')
      },
    })
  }

  const toolbarIcons = [
    { Icon: Bold,   label: '加粗', action: () => wrapSelection('**', '**', '加粗文字') },
    { Icon: Italic, label: '斜体', action: () => wrapSelection('_', '_', '斜体文字') },
    { Icon: List,   label: '列表', action: insertList },
    { Icon: Hash,   label: '标题', action: insertHeading },
    { Icon: Link,   label: '链接', action: () => openUrlPrompt('link') },
    { Icon: Image,  label: '图片', action: () => openUrlPrompt('image') },
  ]

  return (
    // 自管布局：不走 PageLayout，避免双层 overflow 破坏高度
    <div className="flex flex-col h-full relative bg-white">

      {/* ── Header ── */}
      <div className="flex items-center h-14 px-4 border-b border-line-base flex-shrink-0">
        <button onClick={handleSave} className="p-1 -ml-1 mr-2 text-ink-secondary">
          <ChevronLeft size={24} />
        </button>
        <span className="flex-1 text-caption text-ink-placeholder truncate">
          {title || (noteId ? '编辑笔记' : '新笔记')}
        </span>
        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            className="px-3.5 py-1.5 bg-brand-orange text-white text-caption font-medium rounded-btn"
          >
            保存
          </button>
          <button
            onClick={() => setShowMoreSheet(true)}
            className="p-1 text-ink-secondary"
          >
            <MoreHorizontal size={20} />
          </button>
        </div>
      </div>

      {/* ── 可滚动正文区 ── */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <div className="px-5 pt-4 pb-6">
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="标题"
            className="w-full text-[22px] font-semibold text-ink-primary outline-none bg-transparent
                       placeholder:text-ink-placeholder pb-3 mb-4 border-b border-line-base"
          />
          <textarea
            ref={textareaRef}
            value={content}
            onChange={e => { setContent(e.target.value); autoResize() }}
            placeholder="开始写作..."
            className="w-full text-body text-ink-primary outline-none bg-transparent
                       placeholder:text-ink-placeholder resize-none leading-[1.75] min-h-[320px]"
          />
          {streaming && (
            <span className="inline-block w-0.5 h-4 bg-brand-orange animate-pulse ml-0.5 align-middle" />
          )}
        </div>
      </div>

      {/* ── 底部工具栏 ── */}
      <div className="flex-shrink-0 border-t border-line-base bg-white">
        <div className="flex items-center px-3 py-2 gap-0.5">
          {toolbarIcons.map(({ Icon, label, action }) => (
            <button
              key={label}
              onClick={action}
              title={label}
              className="p-2 rounded text-ink-placeholder active:bg-surface-card transition-colors"
            >
              <Icon size={18} />
            </button>
          ))}
          <div className="flex-1" />
        </div>
      </div>

      {/* ── N07 更多操作（底部抽屉）── */}
      <BottomSheet
        open={showMoreSheet}
        onClose={() => setShowMoreSheet(false)}
        title="更多操作"
      >
        <div className="px-5 py-2">
          {[
            { Icon: BookmarkPlus, label: '保存到知识库', danger: false, action: () => setShowMoreSheet(false) },
            { Icon: FileCode,     label: '导出为 Markdown', danger: false, action: () => setShowMoreSheet(false) },
            { Icon: FileOutput,   label: '导出为 PDF',  danger: false, action: () => setShowMoreSheet(false) },
            { Icon: Trash2,       label: '删除笔记',    danger: true,  action: handleDelete },
          ].map(({ Icon, label, danger, action }) => (
            <button
              key={label}
              onClick={action}
              className={`w-full flex items-center gap-3 py-3.5 px-1 border-b border-line-base last:border-0
                ${danger ? 'text-red-500' : 'text-ink-primary'}`}
            >
              <Icon size={18} className={danger ? 'text-red-400' : 'text-ink-placeholder'} />
              <span className="text-body">{label}</span>
            </button>
          ))}
        </div>
      </BottomSheet>

      <BottomSheet
        open={promptKind !== null}
        onClose={() => setPromptKind(null)}
        title={promptKind === 'image' ? '插入图片' : '插入链接'}
      >
        <div className="px-5 py-3 space-y-3">
          <input
            value={promptValue}
            onChange={e => setPromptValue(e.target.value)}
            placeholder={promptKind === 'image' ? '输入图片 URL' : '输入链接 URL'}
            className="w-full px-4 py-3 bg-surface-card rounded-card border border-line-base text-body text-ink-primary outline-none placeholder:text-ink-placeholder"
            autoFocus
          />
          <button
            onClick={confirmUrlInsert}
            disabled={!promptValue.trim()}
            className="w-full py-3 bg-brand-orange text-white rounded-btn text-body font-medium disabled:opacity-40"
          >
            插入
          </button>
        </div>
      </BottomSheet>

      {/* Toast / ConfirmDialog 自挂，因为没走 PageLayout */}
      <Toast />
      <ConfirmDialog />
    </div>
  )
}
