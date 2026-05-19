import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, Sparkles } from 'lucide-react'
import { useKnowledge } from '../../context/KnowledgeContext'
import { useUser } from '../../context/UserContext'
import { QUICK_NOTES_KB_ID, type KnowledgeFile } from '../../mock/data'
import Toast from '../../components/common/Toast'
import ConfirmDialog from '../../components/common/ConfirmDialog'

interface Platform {
  id: 'chatgpt' | 'claude' | 'doubao'
  name: string
  emoji: string
  bg: string
}

const PLATFORMS: Platform[] = [
  { id: 'chatgpt', name: 'ChatGPT', emoji: '🟢', bg: '#D1FAE5' },
  { id: 'claude', name: 'Claude', emoji: '🟠', bg: '#FFF1E6' },
  { id: 'doubao', name: '豆包', emoji: '🔵', bg: '#DBEAFE' },
]

const CONVERSATIONS = [
  { id: 'c1', title: 'AI 浏览器的核心机会点分析', time: '今天 14:20', summary: '围绕 AI 浏览器形态、用户痛点和差异化机会的讨论。' },
  { id: 'c2', title: '如何用 PARA 整理产品资料', time: '昨天', summary: '将 PARA 框架应用到产品资料整理流程的细节梳理。' },
  { id: 'c3', title: '下周面试准备', time: '2 天前', summary: '高级产品经理面试的常考题与回答框架。' },
  { id: 'c4', title: 'Q4 OKR 撰写思路', time: '3 天前', summary: 'Q4 OKR 设定的目标拆解和关键结果建议。' },
  { id: 'c5', title: '竞品对比表格生成', time: '5 天前', summary: '主流知识管理工具的对比表格自动生成。' },
]

export default function K17_AddFromAiChat() {
  const navigate = useNavigate()
  const { activeBase, quickNotesBase, addFile } = useKnowledge()
  const { showToast } = useUser()
  const [platform, setPlatform] = useState<Platform | null>(null)

  const kbId = activeBase?.id ?? QUICK_NOTES_KB_ID
  const kbName = activeBase?.name ?? quickNotesBase.name

  const handleImport = (chat: typeof CONVERSATIONS[number]) => {
    if (!platform) return
    const file: KnowledgeFile = {
      id: `file_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      kbId,
      name: chat.title,
      type: 'note',
      size: `${chat.summary.length}字`,
      wordCount: chat.summary.length,
      uploadedAt: '刚刚',
      summary: `来自 ${platform.name}：${chat.summary}`,
      content: `# ${chat.title}\n\n来源：${platform.name}\n\n${chat.summary}`,
      tags: [platform.name, 'AI对话'],
    }
    addFile(file)
    showToast(`已添加到「${kbName}」`)
    setTimeout(() => navigate(-1), 800)
  }

  return (
    <div className="flex flex-col h-full relative bg-white">
      <div className="h-14 flex items-center px-4 bg-white border-b border-line-base flex-shrink-0">
        <button
          onClick={() => (platform ? setPlatform(null) : navigate(-1))}
          className="p-1 -ml-1 mr-2 text-ink-secondary"
        >
          <ChevronLeft size={24} />
        </button>
        <span className="flex-1 text-h2 text-ink-primary truncate">
          {platform ? `${platform.name} 最近对话` : '选择对话来源'}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {!platform && (
          <div className="px-5 pt-3">
            <p className="text-caption text-ink-placeholder mb-3">从哪个 AI 助手导入？</p>
            <div className="grid grid-cols-1 gap-2">
              {PLATFORMS.map(p => (
                <button
                  key={p.id}
                  onClick={() => setPlatform(p)}
                  className="w-full h-16 px-4 rounded-card border border-line-base bg-white flex items-center gap-3 active:bg-surface-card"
                >
                  <div
                    className="w-10 h-10 rounded-card flex items-center justify-center text-[22px]"
                    style={{ backgroundColor: p.bg }}
                  >
                    {p.emoji}
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-card-title text-ink-primary">{p.name}</p>
                    <p className="text-caption text-ink-placeholder">已授权，5 条最近对话</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {platform && (
          <div className="px-5 pt-3 pb-4">
            <div className="rounded-card bg-brand-orange-light px-3 py-2.5 flex items-center gap-2 mb-3">
              <Sparkles size={14} className="text-brand-orange" />
              <p className="text-caption text-ink-primary">已连接 {platform.name} · 5 条最近对话</p>
            </div>
            {CONVERSATIONS.map(chat => (
              <div
                key={chat.id}
                className="px-4 py-3 mb-2 bg-white rounded-card border border-line-base"
              >
                <p className="text-card-title text-ink-primary truncate">{chat.title}</p>
                <p className="text-caption text-ink-placeholder mt-0.5">{chat.time}</p>
                <p className="text-caption text-ink-secondary mt-1.5 line-clamp-2">{chat.summary}</p>
                <div className="flex justify-end mt-2">
                  <button
                    onClick={() => handleImport(chat)}
                    className="h-7 px-3 rounded-pill bg-brand-orange text-white text-[12px] font-medium"
                  >
                    选择导入
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Toast />
      <ConfirmDialog />
    </div>
  )
}
